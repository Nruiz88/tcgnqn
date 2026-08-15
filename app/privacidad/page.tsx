import InfoPage, { InfoSection } from '@/components/info-page'

export const metadata = {
  title: 'Política de privacidad · TCG NQN',
}

export default function PrivacidadPage() {
  return (
    <InfoPage
      eyebrow="Legal"
      title="Política de privacidad"
      subtitle="En TCG NQN respetamos tu privacidad. Te contamos qué datos recopilamos, para qué los usamos y cómo los cuidamos."
    >
      <InfoSection title="1. Qué datos recopilamos">
        <p>
          Al realizar un pedido recopilamos los datos necesarios para procesarlo:
          nombre, teléfono o WhatsApp, dirección de envío y el contenido del
          pedido. Si creás una cuenta, guardamos tu correo y una contraseña
          cifrada.
        </p>
      </InfoSection>

      <InfoSection title="2. Cómo usamos tus datos">
        <p>
          Usamos tus datos únicamente para: procesar y despachar pedidos,
          coordinar pagos y entregas por WhatsApp, responder consultas y mejorar
          el funcionamiento de la tienda. No enviamos publicidad a la que no
          hayas consentido.
        </p>
      </InfoSection>

      <InfoSection title="3. Almacenamiento y seguridad">
        <p>
          Tus datos se almacenan en servidores seguros y protegidos. Las
          contraseñas se guardan cifradas y nunca se comparten con terceros.
        </p>
      </InfoSection>

      <InfoSection title="4. Compartir información">
        <p>
          No vendemos ni cedemos tus datos personales a terceros. Solo
          compartimos la información mínima necesaria con los servicios que
          usamos para operar la tienda (base de datos y hosting).
        </p>
      </InfoSection>

      <InfoSection title="5. Cookies">
        <p>
          Usamos cookies propias para recordar tu carrito, tus favoritos y tus
          preferencias de tema. Podés borrarlas desde tu navegador en cualquier
          momento.
        </p>
      </InfoSection>

      <InfoSection title="6. Tus derechos">
        <p>
          Podés solicitarnos el acceso, corrección o eliminación de tus datos en
          cualquier momento. También podés cerrar tu cuenta desde el panel de
          usuario o pidiéndolo por WhatsApp.
        </p>
      </InfoSection>

      <InfoSection title="7. Contacto">
        <p>
          Si tenés dudas sobre esta política, escribinos por WhatsApp desde la
          página de{' '}
          <a
            href="/contacto"
            className="font-medium text-indigo-600 hover:underline"
          >
            contacto
          </a>
          .
        </p>
      </InfoSection>

      <p className="text-xs text-neutral-400">
        Última actualización: agosto de 2026
      </p>
    </InfoPage>
  )
}