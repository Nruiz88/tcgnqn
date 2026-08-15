import InfoPage, { InfoSection } from '@/components/info-page'
import Link from 'next/link'

export const metadata = {
  title: 'Términos y condiciones · TCG NQN',
}

export default function TerminosPage() {
  return (
    <InfoPage
      eyebrow="Legal"
      title="Términos y condiciones"
      subtitle="Los presentes términos regulan el uso de la tienda online de TCG NQN y la compra de productos. Al navegar o comprar en nuestro sitio aceptás estas condiciones."
    >
      <InfoSection title="1. Sobre la tienda">
        <p>
          TCG NQN es una tienda de Neuquén, Argentina, dedicada a la venta de
          cartas coleccionables, boosters y accesorios de juegos de cartas (TCG).
        </p>
        <p>
          Al realizar un pedido declarás ser mayor de edad y contar con capacidad
          legal para realizar la compra.
        </p>
      </InfoSection>

      <InfoSection title="2. Productos y precios">
        <p>
          Los productos se publican con su precio, estado y condición de la carta
          (por ejemplo: Mint, Near Mint o jugada). Las fotos son ilustrativas y
          pueden variar levemente respecto del producto real.
        </p>
        <p>
          Los precios se expresan en pesos argentinos y pueden actualizarse sin
          previo aviso. El precio vigente es el que se muestra al momento de
          confirmar el pedido.
        </p>
      </InfoSection>

      <InfoSection title="3. Pedidos y formas de pago">
        <p>
          El pago se coordina por WhatsApp o transferencia bancaria. No
          procesamos tarjetas en línea: al confirmar tu pedido te contactamos
          para coordinar el pago y la entrega.
        </p>
        <p>
          Una vez confirmado el pago, el pedido pasa a preparación. En caso de
          que un producto no esté disponible, te lo avisamos antes de cargar el
          pago y podés elegir un reemplazo o la cancelación.
        </p>
      </InfoSection>

      <InfoSection title="4. Envíos y entrega">
        <p>
          Realizamos entregas en Neuquén y envíos a todo el país. Los tiempos y
          costos de envío dependen del destino y se coordinan por WhatsApp. Podés
          ver más detalles en{' '}
          <Link href="/envios" className="font-medium text-indigo-600 hover:underline">
            Envíos y devoluciones
          </Link>
          .
        </p>
      </InfoSection>

      <InfoSection title="5. Cambios y devoluciones">
        <p>
          Aceptamos cambios o devoluciones dentro de las 48 horas de recibido el
          producto, siempre que la carta esté en el mismo estado en que fue
          enviada y conserve su packaging original. Los detalles están en{' '}
          <Link href="/envios" className="font-medium text-indigo-600 hover:underline">
            Envíos y devoluciones
          </Link>
          .
        </p>
      </InfoSection>

      <InfoSection title="6. Propiedad intelectual">
        <p>
          Las marcas y nombres de los juegos de cartas (Pokémon, Yu-Gi-Oh!, One
          Piece, Magic: The Gathering, entre otros) pertenecen a sus respectivos
          dueños. TCG NQN no está afiliada a ninguna de esas compañías y solo
          comercializa sus productos.
        </p>
      </InfoSection>

      <InfoSection title="7. Limitación de responsabilidad">
        <p>
          No nos hacemos responsables por el mal uso de los productos ni por
          daños causados por terceros durante el transporte, siempre que hayamos
          despachado el pedido correctamente.
        </p>
      </InfoSection>

      <InfoSection title="8. Ley aplicable">
        <p>
          Estos términos se rigen por las leyes de la República Argentina. Ante
          cualquier duda podés escribirnos por{' '}
          <Link href="/contacto" className="font-medium text-indigo-600 hover:underline">
            WhatsApp
          </Link>
          .
        </p>
      </InfoSection>

      <p className="text-xs text-neutral-400">
        Última actualización: agosto de 2026
      </p>
    </InfoPage>
  )
}