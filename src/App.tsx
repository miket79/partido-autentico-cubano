import { ArrowLeft, ArrowRight, ArrowUpRight, FileText, Landmark, Menu, Pause, Play, Scale, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import skylineAnimation from '../seedance-2.5_Skyscrapers_grow_progressively_taller_reaching_towards_the_sky_with_imposing_pea-0.mp4'

const navigation = [
  { label: 'El Partido', href: '#partido' },
  { label: 'Principios', href: '#principios' },
  { label: 'Archivo', href: '#archivo' },
]

const principles = [
  { title: 'Justicia', text: 'El imperio de la ley, la igualdad ante la justicia y la responsabilidad de quienes ejercen el poder.', icon: Scale },
  { title: 'Democracia', text: 'Una república de instituciones fuertes, elecciones libres y ciudadanos con voz y voto.', icon: Landmark },
  { title: 'Tradición', text: 'La defensa de nuestra historia, la familia y los valores que sostienen la identidad nacional.', icon: FileText },
]

const updates = [
  { type: 'Declaración', date: 'Archivo PAC', title: 'Justicia y democracia para la reconstrucción nacional.', text: 'Conoce los principios que orientan nuestra visión conservadora de una Cuba libre y soberana.' },
  { type: 'Documentos', date: 'Biblioteca pública', title: 'Ideas para la reconstrucción de la patria.', text: 'Un espacio abierto para consultar textos, propuestas y referencias de nuestra historia republicana.' },
  { type: 'Participación', date: 'Comunidad', title: 'La voz ciudadana es parte del cambio.', text: 'Súmate a una conversación responsable sobre el presente y el futuro de Cuba.' },
]

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activePrinciple, setActivePrinciple] = useState(0)
  const [activeUpdate, setActiveUpdate] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const closeMenu = () => setMenuOpen(false)

  useEffect(() => {
    if (!isPlaying) return undefined
    const interval = window.setInterval(() => setActiveUpdate((current) => (current + 1) % updates.length), 6000)
    return () => window.clearInterval(interval)
  }, [isPlaying])

  const showPreviousUpdate = () => setActiveUpdate((current) => (current - 1 + updates.length) % updates.length)
  const showNextUpdate = () => setActiveUpdate((current) => (current + 1) % updates.length)

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Partido Auténtico Cubano, inicio">
          <img className="brand-logo" src="/logo-pac.jpeg" alt="" />
          <span className="brand-name">Partido Auténtico<br />Cubano</span>
        </a>
        <nav className={menuOpen ? 'navigation navigation-open' : 'navigation'} aria-label="Navegación principal">
          {navigation.map((item) => <a key={item.href} href={item.href} onClick={closeMenu}>{item.label}</a>)}
          <a className="join-link" href="#participa" onClick={closeMenu}>Participa <ArrowUpRight size={16} aria-hidden="true" /></a>
        </nav>
        <button className="menu-toggle" type="button" aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={menuOpen} onClick={() => setMenuOpen((isOpen) => !isOpen)}>
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </header>

      <main>
        <div className="news-ticker" aria-label="Mensaje destacado">
          <div className="ticker-track"><span>Justicia y democracia</span><i>✦</i><span>Una Cuba auténtica</span><i>✦</i><span>Justicia y democracia</span><i>✦</i><span>Una Cuba auténtica</span><i>✦</i></div>
        </div>
        <section className="hero" id="inicio" aria-labelledby="hero-title">
          <video className="hero-video" src={skylineAnimation} autoPlay muted loop playsInline aria-hidden="true" />
          <div className="hero-content">
            <p className="eyebrow">Conservadurismo democrático cubano</p>
            <h1 id="hero-title">Cuba para<br /><em>los Cubanos.</em></h1>
            <p className="hero-copy">Los Auténticos Cubanos construiremos un futuro de justicia y democracia.</p>
            <a className="button button-primary" href="#participa">Únete al movimiento <ArrowUpRight size={18} aria-hidden="true" /></a>
          </div>
          <div className="hero-slogans" aria-hidden="true"><span>Patria y libertad</span><span>Justicia y democracia</span></div>
        </section>

        <section className="statement" id="partido" aria-labelledby="statement-title">
          <p className="section-label">01 / El Partido</p>
          <div><h2 id="statement-title">Orden, justicia y democracia para nuestra patria.</h2><p>Somos un partido conservador de derecha. Defendemos una Cuba con instituciones firmes, Estado de derecho, libertad responsable y una democracia que respete la voluntad de sus ciudadanos.</p></div>
        </section>

        <section className="principles" id="principios" aria-labelledby="principles-title">
          <div className="principles-intro"><p className="section-label">02 / Nuestros pilares</p><h2 id="principles-title">Justicia y democracia como base de una Cuba libre.</h2></div>
          <div className="principle-grid">
            {principles.map((principle, index) => {
              const Icon = principle.icon
              return <button className={activePrinciple === index ? 'principle-card principle-active' : 'principle-card'} key={principle.title} type="button" onClick={() => setActivePrinciple(index)} aria-pressed={activePrinciple === index}><Icon strokeWidth={1.5} aria-hidden="true" /><span className="principle-index">0{index + 1}</span><h3>{principle.title}</h3><p>{principle.text}</p><span className="principle-prompt">Explorar <ArrowUpRight size={16} aria-hidden="true" /></span></button>
            })}
          </div>
        </section>

        <section className="updates" aria-labelledby="updates-title">
          <div className="updates-intro"><p className="section-label">En movimiento</p><h2 id="updates-title">La conversación continúa.</h2><p>Perspectivas, documentos y voces para imaginar una Cuba posible.</p></div>
          <div className="update-stage">
            {updates.map((update, index) => <article className={activeUpdate === index ? 'update-card update-active' : 'update-card'} key={update.title} aria-hidden={activeUpdate !== index}><p className="update-meta"><span>{update.type}</span>{update.date}</p><h3>{update.title}</h3><p>{update.text}</p><a href="#participa" tabIndex={activeUpdate === index ? 0 : -1}>Leer más <ArrowUpRight size={17} aria-hidden="true" /></a></article>)}
            <div className="update-controls"><button type="button" onClick={showPreviousUpdate} aria-label="Actualización anterior"><ArrowLeft size={19} aria-hidden="true" /></button><button type="button" onClick={() => setIsPlaying((playing) => !playing)} aria-label={isPlaying ? 'Pausar avance automático' : 'Reanudar avance automático'}>{isPlaying ? <Pause size={17} aria-hidden="true" /> : <Play size={17} aria-hidden="true" />}</button><button type="button" onClick={showNextUpdate} aria-label="Actualización siguiente"><ArrowRight size={19} aria-hidden="true" /></button><span>{String(activeUpdate + 1).padStart(2, '0')} / {String(updates.length).padStart(2, '0')}</span></div>
          </div>
        </section>

        <section className="archive" id="archivo" aria-labelledby="archive-title">
          <div className="archive-heading"><p className="section-label">03 / Archivo público</p><h2 id="archive-title">Ideas, documentos y actualidad.</h2></div>
          <div className="archive-links">
            <a href="#participa"><span>Documentos fundamentales</span><ArrowUpRight aria-hidden="true" /></a>
            <a href="#participa"><span>Noticias y comunicados</span><ArrowUpRight aria-hidden="true" /></a>
            <a href="#participa"><span>Memoria histórica</span><ArrowUpRight aria-hidden="true" /></a>
          </div>
        </section>

        <section className="participate" id="participa" aria-labelledby="participate-title">
          <p className="section-label">04 / Participa</p><h2 id="participate-title">La libertad se construye con todos.</h2><p>Recibe información sobre nuestras actividades, propuestas y formas de colaborar.</p>
          <a className="button button-light" href="mailto:contacto@partidoautenticocubano.com">Contactar al PAC <ArrowUpRight size={18} aria-hidden="true" /></a>
        </section>
      </main>

      <footer className="site-footer"><a className="brand brand-footer" href="#inicio"><img className="brand-logo" src="/logo-pac.jpeg" alt="" /><span className="brand-name">Partido Auténtico Cubano</span></a><p>Una Cuba libre, democrática y soberana.</p><a href="#inicio">Volver arriba</a></footer>
    </div>
  )
}

export default App
