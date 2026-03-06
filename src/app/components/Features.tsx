import { Zap, Users, BarChart3, Shield, Globe, Sparkles } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Automação Inteligente',
    description: 'Automatize tarefas repetitivas e foque no que realmente importa para o crescimento do seu negócio.',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    icon: BarChart3,
    title: 'Analytics Avançado',
    description: 'Tome decisões baseadas em dados com dashboards intuitivos e relatórios em tempo real.',
    color: 'from-blue-500 to-indigo-500'
  },
  {
    icon: Users,
    title: 'Colaboração em Equipe',
    description: 'Trabalhe em conjunto com sua equipe de forma eficiente, em qualquer lugar do mundo.',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: Shield,
    title: 'Segurança Máxima',
    description: 'Seus dados protegidos com criptografia de ponta e conformidade com LGPD e GDPR.',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Globe,
    title: 'Alcance Global',
    description: 'Expanda seu negócio para qualquer mercado com suporte multi-idioma e multi-moeda.',
    color: 'from-cyan-500 to-blue-500'
  },
  {
    icon: Sparkles,
    title: 'IA Integrada',
    description: 'Aproveite o poder da inteligência artificial para otimizar operações e experiência do cliente.',
    color: 'from-red-500 to-orange-500'
  }
];

export function Features() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">
            Recursos
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3 mb-4">
            Tudo que você precisa para crescer
          </h2>
          <p className="text-xl text-gray-600">
            Ferramentas poderosas projetadas para startups que querem escalar rapidamente
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group p-8 rounded-2xl border border-gray-200 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 bg-white"
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <img 
              src="https://images.unsplash.com/photo-1758691736843-90f58dce465e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwY29sbGFib3JhdGlvbiUyMHdvcmtzcGFjZXxlbnwxfHx8fDE3NzI1NzYzNTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Colaboração"
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Pronto para transformar sua startup?
            </h3>
            <p className="text-xl mb-8 text-indigo-100 max-w-2xl mx-auto">
              Junte-se a milhares de empreendedores que já estão acelerando seus negócios
            </p>
            <button className="px-8 py-4 bg-white text-indigo-600 rounded-lg font-medium hover:bg-gray-50 transition-colors shadow-xl">
              Começar agora
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
