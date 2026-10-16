import { ArrowLeft, ArrowRight, Printer } from 'lucide-react'
import type { MouseEvent } from 'react'
import { Enlace } from '../components/Enlace'
import { buscarDocumento, documentos } from '../documentos'
import { navegar } from '../navegacion'

// Los enlaces internos dentro del texto (por ejemplo, a otro documento) cambian de página sin recargar.
function alHacerClicEnTexto(evento: MouseEvent<HTMLDivElement>) {
  const enlace = (evento.target as HTMLElement).closest('a')
  const href = enlace?.getAttribute('href')
  if (!href || !href.startsWith('/') || enlace?.target || evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.button !== 0) return
  evento.preventDefault()
  navegar(href)
}

export function Documento({ slug }: { slug: string }) {
  const documento = buscarDocumento(slug)

  if (!documento) {
    return (
      <section className="library-hero" aria-labelledby="missing-title">
        <p className="section-label">Documentos</p>
        <h1 id="missing-title">Documento no encontrado.</h1>
        <p>El texto que busca no existe o cambió de dirección.</p>
        <Enlace className="button button-light" href="/documentos"><ArrowLeft size={18} aria-hidden="true" /> Ver todos los documentos</Enlace>
      </section>
    )
  }

  const posicion = documentos.indexOf(documento)
  const anterior = documentos[posicion - 1]
  const siguiente = documentos[posicion + 1]
  const indice = documento.encabezados.filter((encabezado) => encabezado.nivel <= 3)
  const conIndice = indice.filter((encabezado) => encabezado.nivel === 2).length >= 3

  return (
    <article className="doc" aria-labelledby="doc-title">
      <header className="doc-hero">
        <nav className="doc-breadcrumb" aria-label="Ruta">
          <Enlace href="/documentos">Documentos</Enlace><span aria-hidden="true">/</span><span>{documento.tipo}</span>
        </nav>
        <h1 id="doc-title">{documento.titulo}</h1>
        <p className="doc-summary">{documento.resumen}</p>
        <div className="doc-meta">
          <span>{documento.fecha}</span>
          <span>{documento.minutosLectura} min de lectura</span>
          <button className="doc-print" type="button" onClick={() => window.print()}><Printer size={16} aria-hidden="true" /> Imprimir o guardar PDF</button>
        </div>
      </header>

      <div className="doc-layout doc-layout-toc">
        {conIndice ? (
          <aside className="doc-toc" aria-label="Contenido del documento">
            <details open>
              <summary>Contenido</summary>
              <ol>
                {indice.map((encabezado) => (
                  <li className={encabezado.nivel === 3 ? 'doc-toc-sub' : undefined} key={encabezado.id}>
                    <a href={`#${encabezado.id}`}>{encabezado.texto}</a>
                  </li>
                ))}
              </ol>
            </details>
          </aside>
        ) : (
          <aside className="doc-toc doc-toc-docs" aria-label="Documentos fundamentales">
            <details open>
              <summary>Documentos fundamentales</summary>
              <ol>
                {documentos.map((otro) => (
                  <li key={otro.slug}>
                    <Enlace href={`/documentos/${otro.slug}`} aria-current={otro.slug === documento.slug ? 'page' : undefined}>{otro.titulo}</Enlace>
                  </li>
                ))}
              </ol>
            </details>
          </aside>
        )}
        <div className="doc-body" onClick={alHacerClicEnTexto} dangerouslySetInnerHTML={{ __html: documento.html }} />
      </div>

      <nav className="doc-pager" aria-label="Otros documentos">
        {anterior ? (
          <Enlace className="doc-pager-link" href={`/documentos/${anterior.slug}`}>
            <span className="doc-pager-label"><ArrowLeft size={16} aria-hidden="true" /> Anterior</span>
            <span className="doc-pager-title">{anterior.titulo}</span>
          </Enlace>
        ) : <span />}
        {siguiente ? (
          <Enlace className="doc-pager-link doc-pager-next" href={`/documentos/${siguiente.slug}`}>
            <span className="doc-pager-label">Siguiente <ArrowRight size={16} aria-hidden="true" /></span>
            <span className="doc-pager-title">{siguiente.titulo}</span>
          </Enlace>
        ) : (
          <Enlace className="doc-pager-link doc-pager-next" href="/documentos">
            <span className="doc-pager-label">Biblioteca <ArrowRight size={16} aria-hidden="true" /></span>
            <span className="doc-pager-title">Todos los documentos</span>
          </Enlace>
        )}
      </nav>
    </article>
  )
}
