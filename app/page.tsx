import { Button } from './components/Button'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">InclusiveAID</h1>
        <p className="text-gray-600">Seu assistente virtual adaptado</p>
      </header>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Onboarding Section */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Bem-vindo</h2>
          <p className="mb-4 text-gray-600">
            Configure suas preferências de acessibilidade para uma experiência personalizada.
          </p>
          <Button>Começar</Button>
        </div>

        {/* Accessibility Settings */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Configurações de Acessibilidade</h2>
          <p className="mb-4 text-gray-600">
            Personalize as configurações de acordo com suas necessidades.
          </p>
          <Button variant="secondary">Configurar</Button>
        </div>

        {/* Chat Interface */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Assistente Virtual</h2>
          <p className="mb-4 text-gray-600">
            Interaja com o assistente virtual adaptado às suas necessidades.
          </p>
          <Button variant="outline">Iniciar Chat</Button>
        </div>
      </section>
    </div>
  )
}
