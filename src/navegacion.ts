import { useSyncExternalStore } from 'react'

// Navegación sencilla entre páginas sin recargar el sitio (el servidor envía siempre index.html).
const EVENTO = 'pac:navegacion'

function suscribir(aviso: () => void) {
  window.addEventListener('popstate', aviso)
  window.addEventListener(EVENTO, aviso)
  return () => {
    window.removeEventListener('popstate', aviso)
    window.removeEventListener(EVENTO, aviso)
  }
}

const rutaActual = () => window.location.pathname.replace(/\/+$/, '') || '/'

export function useRuta() {
  return useSyncExternalStore(suscribir, rutaActual, () => '/')
}

export function irAAncla(ancla: string, suave = true) {
  const destino = ancla ? document.getElementById(decodeURIComponent(ancla.replace(/^#/, ''))) : null
  if (destino) destino.scrollIntoView({ behavior: suave ? 'smooth' : 'instant', block: 'start' })
  else window.scrollTo({ top: 0, behavior: 'instant' })
}

export function navegar(destino: string) {
  const url = new URL(destino, window.location.href)
  const mismaPagina = (url.pathname.replace(/\/+$/, '') || '/') === rutaActual()
  window.history.pushState(null, '', `${url.pathname}${url.search}${url.hash}`)
  if (!mismaPagina) window.dispatchEvent(new Event(EVENTO))
  window.requestAnimationFrame(() => window.requestAnimationFrame(() => irAAncla(url.hash, mismaPagina)))
}
