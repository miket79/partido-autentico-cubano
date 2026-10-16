import type { AnchorHTMLAttributes, MouseEvent } from 'react'
import { navegar } from '../navegacion'

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }

// Enlace interno: cambia de página sin recargar el sitio. Los enlaces externos funcionan como siempre.
export function Enlace({ href, onClick, ...resto }: Props) {
  const alHacerClic = (evento: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(evento)
    if (evento.defaultPrevented || evento.button !== 0 || evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey) return
    if (resto.target || !href.startsWith('/')) return
    evento.preventDefault()
    navegar(href)
  }
  return <a {...resto} href={href} onClick={alHacerClic} />
}
