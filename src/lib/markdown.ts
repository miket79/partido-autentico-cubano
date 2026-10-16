// Conversor de Markdown a HTML, pequeño y sin dependencias, para los documentos del sitio.
// Admite: encabezados (## y ###), párrafos, **negrita**, *cursiva*, [enlaces](url),
// listas numeradas y con viñetas, citas (>), tablas y bloques HTML propios (por ejemplo, diagramas).

export type Encabezado = { id: string; nivel: number; texto: string }
export type Frontmatter = Record<string, string>

const escapar = (texto: string) => texto.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export function slugificar(texto: string) {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function separarFrontmatter(fuente: string): { datos: Frontmatter; cuerpo: string } {
  const texto = fuente.replace(/\r\n/g, '\n')
  const coincidencia = /^---\n([\s\S]*?)\n---\n?/.exec(texto)
  if (!coincidencia) return { datos: {}, cuerpo: texto }
  const datos: Frontmatter = {}
  for (const linea of coincidencia[1].split('\n')) {
    const separador = linea.indexOf(':')
    if (separador > 0) datos[linea.slice(0, separador).trim()] = linea.slice(separador + 1).trim()
  }
  return { datos, cuerpo: texto.slice(coincidencia[0].length) }
}

function enLinea(texto: string) {
  const reservados: string[] = []
  const reservar = (html: string) => `\u0000${reservados.push(html) - 1}\u0000`
  let salida = texto.replace(/\\([\\`*_{}[\]()#+\-.!|>])/g, (_, caracter: string) => reservar(escapar(caracter)))
  salida = escapar(salida)
  salida = salida.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, etiqueta: string, url: string) => {
    const externo = /^https?:\/\//.test(url)
    return reservar(`<a href="${url}"${externo ? ' target="_blank" rel="noopener noreferrer"' : ''}>`) + etiqueta + reservar('</a>')
  })
  let comillaAbierta = false
  salida = salida.replace(/&quot;/g, () => ((comillaAbierta = !comillaAbierta) ? '“' : '”'))
  salida = salida.replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>')
  salida = salida.replace(/(^|[^*\w])\*([^*\s](?:[^*]*?[^*\s])?)\*(?![*\w])/g, '$1<em>$2</em>')
  return salida.replace(/\u0000(\d+)\u0000/g, (_, indice: string) => reservados[Number(indice)])
}

function celdas(fila: string) {
  return fila.trim().replace(/^\|/, '').replace(/\|$/, '').split(/(?<!\\)\|/).map((celda) => celda.trim())
}

export function convertirMarkdown(cuerpo: string): { html: string; encabezados: Encabezado[] } {
  const lineas = cuerpo.replace(/\r\n/g, '\n').split('\n')
  const bloques: string[] = []
  const encabezados: Encabezado[] = []
  const idsUsados = new Map<string, number>()
  let parrafo: string[] = []

  const cerrarParrafo = () => {
    if (parrafo.length) bloques.push(`<p>${enLinea(parrafo.join(' '))}</p>`)
    parrafo = []
  }

  let i = 0
  while (i < lineas.length) {
    const linea = lineas[i]
    const recortada = linea.trim()

    if (!recortada) { cerrarParrafo(); i += 1; continue }

    const encabezado = /^(#{1,6})\s+(.+)$/.exec(recortada)
    if (encabezado) {
      cerrarParrafo()
      const nivel = encabezado[1].length
      const texto = encabezado[2].trim()
      const base = slugificar(texto) || 'seccion'
      const repeticiones = idsUsados.get(base) ?? 0
      idsUsados.set(base, repeticiones + 1)
      const id = repeticiones ? `${base}-${repeticiones + 1}` : base
      encabezados.push({ id, nivel, texto: texto.replace(/[*_]/g, '') })
      bloques.push(`<h${nivel} id="${id}">${enLinea(texto)}</h${nivel}>`)
      i += 1
      continue
    }

    if (recortada.startsWith('<')) {
      cerrarParrafo()
      const html: string[] = []
      while (i < lineas.length && lineas[i].trim()) { html.push(lineas[i]); i += 1 }
      bloques.push(html.join('\n'))
      continue
    }

    if (/^---+$/.test(recortada)) { cerrarParrafo(); bloques.push('<hr />'); i += 1; continue }

    if (recortada.startsWith('>')) {
      cerrarParrafo()
      const cita: string[] = []
      while (i < lineas.length && lineas[i].trim().startsWith('>')) { cita.push(lineas[i].trim().replace(/^>\s?/, '')); i += 1 }
      bloques.push(`<blockquote>${convertirMarkdown(cita.join('\n')).html}</blockquote>`)
      continue
    }

    const lista = /^(\d+\.|[-*])\s+/.exec(recortada)
    if (lista) {
      cerrarParrafo()
      const ordenada = /\d/.test(lista[1])
      const patron = ordenada ? /^\d+\.\s+/ : /^[-*]\s+/
      const elementos: string[] = []
      while (i < lineas.length) {
        const actual = lineas[i]
        if (patron.test(actual.trim()) && !/^\s{2,}/.test(actual)) elementos.push(actual.trim().replace(patron, ''))
        else if (actual.trim() && /^\s+/.test(actual) && elementos.length) elementos[elementos.length - 1] += ` ${actual.trim()}`
        else break
        i += 1
      }
      const etiqueta = ordenada ? 'ol' : 'ul'
      bloques.push(`<${etiqueta}>${elementos.map((elemento) => `<li>${enLinea(elemento)}</li>`).join('')}</${etiqueta}>`)
      continue
    }

    if (recortada.startsWith('|') && i + 1 < lineas.length && /^\|?\s*:?-{3,}/.test(lineas[i + 1].trim())) {
      cerrarParrafo()
      const cabecera = celdas(recortada)
      i += 2
      const filas: string[][] = []
      while (i < lineas.length && lineas[i].trim().startsWith('|')) { filas.push(celdas(lineas[i])); i += 1 }
      bloques.push(
        `<div class="tabla"><table><thead><tr>${cabecera.map((celda) => `<th>${enLinea(celda)}</th>`).join('')}</tr></thead>` +
        `<tbody>${filas.map((fila) => `<tr>${fila.map((celda) => `<td>${enLinea(celda)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`,
      )
      continue
    }

    parrafo.push(recortada)
    i += 1
  }

  cerrarParrafo()
  return { html: bloques.join('\n'), encabezados }
}

export function contarPalabras(texto: string) {
  return texto.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length
}
