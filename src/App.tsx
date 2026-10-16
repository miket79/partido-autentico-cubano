import { ArrowUpRight, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Enlace } from './components/Enlace'
import { buscarDocumento } from './documentos'
import { irAAncla, useRuta } from './navegacion'
import { Documento } from './pages/Documento'
import { Documentos } from './pages/Documentos'
import { Inicio } from './pages/Inicio'
import './documentos.css'

const navigation = [
  { label: 'El Partido', href: '/#partido' },
  { label: 'Principios', href: '/#principios' },
  { label: 'Documentos', href: '/documentos' },
  { label: 'Archivo', href: '/#archivo' },
]

const NOMBRE = 'Partido Auténtico Cubano'

function tituloDePagina(ruta: string) {
  if (ruta === '/documentos') return `Documentos fundamentales · ${NOMBRE}`
  if (ruta.startsWith('/documentos/')) {
    const documento = buscarDocumento(ruta.slice('/documentos/'.length))
    return `${documento ? documento.titulo : 'Documento no encontrado'} · ${NOMBRE}`
  }
  return `${NOMBRE} · Cuba para los Cubanos`
}

function App() {
  const ruta = useRuta()
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)

  useEffect(() => {
    document.title = tituloDePagina(ruta)
  }, [ruta])

  useEffect(() => {
    if (window.location.hash) window.requestAnimationFrame(() => irAAncla(window.location.hash, false))
  }, [])

  let pagina = <Inicio />
  if (ruta === '/documentos') pagina = <Documentos />
  else if (ruta.startsWith('/documentos/')) pagina = <Documento slug={decodeURIComponent(ruta.slice('/documentos/'.length))} />

  return (
    <div className="site-shell">
      <header className="site-header">
        <Enlace className="brand" href="/" aria-label="Partido Auténtico Cubano, inicio" onClick={closeMenu}>
          <img className="brand-logo" src="/logo-pac.jpeg" alt="" />
          <span className="brand-name">Partido Auténtico<br />Cubano</span>
        </Enlace>
        <nav className={menuOpen ? 'navigation navigation-open' : 'navigation'} aria-label="Navegación principal">
          {navigation.map((item) => <Enlace key={item.href} href={item.href} onClick={closeMenu} aria-current={item.href === '/documentos' && ruta.startsWith('/documentos') ? 'page' : undefined}>{item.label}</Enlace>)}
          <Enlace className="join-link" href="/#participa" onClick={closeMenu}>Participa <ArrowUpRight size={16} aria-hidden="true" /></Enlace>
        </nav>
        <button className="menu-toggle" type="button" aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={menuOpen} onClick={() => setMenuOpen((isOpen) => !isOpen)}>
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </header>

      <main key={ruta}>{pagina}</main>

      <footer className="site-footer"><Enlace className="brand brand-footer" href="/"><img className="brand-logo" src="/logo-pac.jpeg" alt="" /><span className="brand-name">Partido Auténtico Cubano</span></Enlace><p>Una Cuba libre, democrática y soberana.</p><a href="#top">Volver arriba</a></footer>
    </div>
  )
}

export default App
