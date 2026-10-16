import { contarPalabras, convertirMarkdown, separarFrontmatter, type Encabezado } from './lib/markdown'

// Para publicar un documento nuevo basta con añadir un archivo .md en src/content/documentos
// con su cabecera (titulo, slug, tipo, orden, fecha, resumen).
const archivos = import.meta.glob<string>('./content/documentos/*.md', { query: '?raw', import: 'default', eager: true })

export type Documento = {
  slug: string
  titulo: string
  tipo: string
  orden: number
  fecha: string
  resumen: string
  html: string
  encabezados: Encabezado[]
  minutosLectura: number
}

export const documentos: Documento[] = Object.entries(archivos)
  .map(([ruta, fuente]) => {
    const { datos, cuerpo } = separarFrontmatter(fuente)
    const { html, encabezados } = convertirMarkdown(cuerpo)
    const nombre = ruta.split('/').pop()?.replace(/\.md$/, '') ?? ''
    return {
      slug: datos.slug || nombre.replace(/^\d+-/, ''),
      titulo: datos.titulo || nombre,
      tipo: datos.tipo || 'Documento',
      orden: Number(datos.orden) || 99,
      fecha: datos.fecha || '',
      resumen: datos.resumen || '',
      html,
      encabezados,
      minutosLectura: Math.max(1, Math.round(contarPalabras(html) / 220)),
    }
  })
  .sort((a, b) => a.orden - b.orden || a.titulo.localeCompare(b.titulo, 'es'))

export const buscarDocumento = (slug: string) => documentos.find((documento) => documento.slug === slug)
