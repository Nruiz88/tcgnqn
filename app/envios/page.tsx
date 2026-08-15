import InfoPage, { InfoSection } from '@/components/info-page'
import { buildWhatsappLink, whatsappNumber } from '@/lib/whatsapp'
import Link from 'next/link'

export const metadata = {
  title: 'Envíos y devoluciones · TCG NQN',
}

export default function EnviosPage() {
  const hasWa = Boolean(whatsappNumber())
  const wa = buildWhatsappLink(
    '¡Hola TCG NQN! Quería consultar por un envío.',
  )

  return (
    <InfoPage
      eyebrow="Ayuda"
      title="Envíos y devoluciones"
      subtitle="Todo lo que tenés que saber sobre cómo llegan tus cartas y qué pasa si algo no te convence."
    >
      <InfoSection title="Entregas en Neuquén">
        <p>
          Si estás en Neuquén o alrededores podemos coordinar un punto de
          encuentro o la entrega directa. El día y horario se arreglan por
          WhatsApp una vez confirmado el pedido.
        </p>
      </InfoSection>

      <InfoSection title="Envíos al resto del país">
        <p>
          Enviamos a todo el país con envío seguro y seguimiento. Las cartas se
          protegen en sleeves, toploaders y sobres acolchados para que lleguen en
          perfecto estado.
        </p>
        <p>
          El costo y el tiempo de envío dependen del destino: se calculan al
          momento de coordinar el pedido y se confirman antes de cargar el pago.
        </p>
      </InfoSection>

      <InfoSection title="Plazos de despacho">
        <p>
          Procesamos y despachamos los pedidos dentro de las 24–48 horas hábiles
          de confirmado el pago. Te compartimos el número de seguimiento apenas
          sale de nuestra tienda.
        </p>
      </InfoSection>

      <InfoSection title="Cambios y devoluciones">
        <p>
          Aceptamos cambios o devoluciones dentro de las 48 horas de recibido el
          producto, siempre que la carta esté en el mismo estado en que fue
          enviada y conserve su packaging original.
        </p>
        <p>
          Para solicitar un cambio o devolución escribinos por WhatsApp con el
          número de pedido. Coordinamos el retiro o la devolución y, si
          corresponde, el reembolso.
        </p>
      </InfoSection>

      <InfoSection title="Productos dañados o incorrectos">
        <p>
          Si tu pedido llega dañado o no es lo que esperabas, avisanos dentro de
          las 48 horas con una foto del producto y el packaging. Lo resolvemos a
          la brevedad con un reemplazo o reembolso.
        </p>
      </InfoSection>

      {hasWa && (
        <section className="mt-2 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 text-center">
          <p className="text-sm font-semibold">¿Tenés otra duda sobre tu envío?</p>
          <p className="mt-1 text-sm text-neutral-500">
            Escribinos y te respondemos a la brevedad.
          </p>
          <Link
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#0d0f14] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            Consultar por WhatsApp
          </Link>
        </section>
      )}

      <p className="text-xs text-neutral-400">
        Última actualización: agosto de 2026
      </p>
    </InfoPage>
  )
}