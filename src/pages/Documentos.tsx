import { ArrowUpRight } from 'lucide-react'
import { Enlace } from '../components/Enlace'
import { documentos } from '../documentos'

export function Documentos() {
  return (
    <>
      <section className="library-hero" aria-labelledby="library-title">
        <p className="section-label">Archivo público / Biblioteca</p>
        <h1 id="library-title">Documentos fundamentales.</h1>
        <p>Los textos que definen al Partido Auténtico Cubano: su manifiesto, sus Bases, sus Estatutos y el estudio que los fundamenta en el pensamiento de José Martí.</p>
      </section>

      <section className="library-list" aria-label="Lista de documentos">
        {documentos.map((documento, indice) => (
          <Enlace className="library-item" href={`/documentos/${documento.slug}`} key={documento.slug}>
            <span className="library-index">{String(indice + 1).padStart(2, '0')}</span>
            <span className="library-body">
              <span className="library-type">{documento.tipo}</span>
              <span className="library-title">{documento.titulo}</span>
              <span className="library-summary">{documento.resumen}</span>
              <span className="library-meta">{documento.fecha} · {documento.minutosLectura} min de lectura</span>
            </span>
            <ArrowUpRight className="library-arrow" aria-hidden="true" />
          </Enlace>
        ))}
      </section>

      <section className="library-note">
        <p>Los documentos del PAC adaptan a la Cuba de hoy las Bases y los Estatutos con que José Martí fundó el Partido Revolucionario Cubano en 1892: donde Martí combatía al gobierno colonial, el PAC combate al régimen del Partido Comunista y al poder de la familia Castro Ruz.</p>
        <Enlace className="button button-primary" href="/documentos/estudio">Leer el estudio <ArrowUpRight size={18} aria-hidden="true" /></Enlace>
      </section>
    </>
  )
}
