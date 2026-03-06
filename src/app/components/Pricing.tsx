import { Check, Sparkles } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    price: 'Gratuito',
    description: 'Perfeito para começar',
    features: [
      'Até 3 usuários',
      '5 GB de armazenamento',
      'Suporte por email',
      'Analytics básico',
      'Integrações limitadas'
    ],
    cta: 'Começar grátis',
    popular: false,
    color: 'border-gray-200'
  },
  {
    name: 'Growth',
    price: 'R$ 199',
    period: '/mês',
    description: 'Para startups em crescimento',
    features: [
      'Até 15 usuários',
      '100 GB de armazenamento',
      'Suporte prioritário 24/7',
      'Analytics avançado',
      'Todas as integrações',
      'Automações ilimitadas',
      'API completa',
      'Relatórios personalizados'
    ],
    cta: 'Começar teste grátis',
    popular: true,
    color: 'border-indigo-500'
  },
  {
    name: 'Enterprise',
    price: 'Personalizado',
    description: 'Para empresas escalando',
    features: [
      'Usuários ilimitados',
      'Armazenamento ilimitado',
      'Gerente de conta dedicado',
      'IA e analytics premium',
      'White-label disponível',
      'SLA garantido',
      'Onboarding personalizado',
      'Treinamento da equipe'
    ],
    cta: 'Falar com vendas',
    popular: false,
    color: 'border-gray-200'
  }
];

export function Pricing() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">
            Preços
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3 mb-4">
            Planos que crescem com você
          </h2>
          <p className="text-xl text-gray-600">
            Escolha o plano ideal para o momento da sua startup. Sem surpresas.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative bg-white rounded-2xl border-2 ${plan.color} p-8 flex flex-col ${
                plan.popular ? 'shadow-2xl scale-105 md:scale-110' : 'shadow-lg'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full text-sm font-medium flex items-center gap-1 shadow-lg">
                  <Sparkles className="w-4 h-4" />
                  Mais popular
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 text-sm">
                  {plan.description}
                </p>
              </div>
              
              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-gray-600">
                      {plan.period}
                    </span>
                  )}
                </div>
              </div>
              
              <button 
                className={`w-full py-3 rounded-lg font-medium transition-all mb-8 ${
                  plan.popular 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/30' 
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {plan.cta}
              </button>
              
              <div className="space-y-4 flex-grow">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start gap-3">
                    <div className={`mt-0.5 rounded-full p-0.5 ${
                      plan.popular ? 'bg-indigo-100' : 'bg-gray-100'
                    }`}>
                      <Check className={`w-4 h-4 ${
                        plan.popular ? 'text-indigo-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <span className="text-gray-700 text-sm">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">
            Todas as assinaturas incluem teste grátis de 14 dias. Sem cartão de crédito necessário.
          </p>
          <p className="text-sm text-gray-500">
            Dúvidas sobre os planos? <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium">Fale com nosso time</a>
          </p>
        </div>
      </div>
    </section>
  );
}
