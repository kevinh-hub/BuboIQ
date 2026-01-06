import React from 'react';
import { Gauge, Shield, Layers } from 'lucide-react';

const valueProps = [
  {
    icon: <Gauge className="w-8 h-8" />,
    title: 'Reduce MTTR',
    description: 'AI reasoning cuts mean time to fix by identifying root causes instantly',
    stat: '60% faster',
    color: 'accent'
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: 'Safe by Default',
    description: 'Approval workflows, rollback protection, and kill switch ensure zero-risk automation',
    stat: '100% audited',
    color: 'success'
  },
  {
    icon: <Layers className="w-8 h-8" />,
    title: 'Fits Your Stack',
    description: 'Works with existing PSA tools via signed webhooks. No rip-and-replace required',
    stat: 'Plug & play',
    color: 'info'
  }
];

export function ValuePropositionSection() {
  const colorMap = {
    accent: 'from-accent/20 to-accent/5',
    success: 'from-success/20 to-success/5',
    info: 'from-info/20 to-info/5'
  };

  const borderMap = {
    accent: 'border-accent/30 hover:border-accent/60',
    success: 'border-success/30 hover:border-success/60',
    info: 'border-info/30 hover:border-info/60'
  };

  const textMap = {
    accent: 'text-accent',
    success: 'text-success',
    info: 'text-info'
  };

  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {valueProps.map((prop, index) => (
            <div
              key={index}
              className={`bubo-glass p-8 rounded-2xl border ${borderMap[prop.color]} hover:scale-105 transition-all duration-300 bg-gradient-to-br ${colorMap[prop.color]}`}
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-bg-850 border-2 ${borderMap[prop.color].split(' ')[0]} mb-6 ${textMap[prop.color]}`}>
                {prop.icon}
              </div>
              
              <h3 className="text-2xl font-space-grotesk text-white mb-3">
                {prop.title}
              </h3>
              
              <p className="text-text-400">
                {prop.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
