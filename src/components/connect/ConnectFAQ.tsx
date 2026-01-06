import React, { useState } from 'react';
import { ChevronDown, Shield, Monitor, Zap, Clock } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  icon: React.ReactNode;
  category: 'security' | 'technical' | 'usage';
}

const faqData: FAQItem[] = [
  {
    id: 'security-encryption',
    question: 'How secure is remote access?',
    answer: 'Your connections are completely secure and private. We use bank-level security to protect every session, and all activity is safely recorded. Only authorized people can connect, and everything stays protected.',
    icon: <Shield className="w-5 h-5" />,
    category: 'security'
  },
  {
    id: 'providers-support',
    question: 'Which remote access tools work with BuboIQ?',
    answer: 'We work with the most popular remote access tools like TeamViewer, Chrome Remote Desktop, and Microsoft Remote Desktop. If your company already uses remote access software, we can probably connect to it.',
    icon: <Monitor className="w-5 h-5" />,
    category: 'technical'
  },
  {
    id: 'demo-mode',
    question: 'Can I try this without setting anything up?',
    answer: 'Absolutely! Our demo mode shows you exactly how everything works without needing to connect to real computers. You can explore all the features and see how it would work for your team.',
    icon: <Zap className="w-5 h-5" />,
    category: 'usage'
  },
  {
    id: 'session-limits',
    question: 'How long can I stay connected?',
    answer: 'With our Pro plan, you can have as many connections as you need, each lasting up to 8 hours. If you\'re actively working, the session will automatically extend. Enterprise customers can set their own time limits.',
    icon: <Clock className="w-5 h-5" />,
    category: 'usage'
  },
  {
    id: 'compliance-logging',
    question: 'Do you keep records of remote sessions?',
    answer: 'Yes, we automatically save records of all remote sessions for security and business compliance. You can see who connected when and what they did. This helps meet your company\'s record-keeping requirements.',
    icon: <Shield className="w-5 h-5" />,
    category: 'security'
  },
  {
    id: 'network-requirements',
    question: 'Will this work with our internet and company network?',
    answer: 'Yes! BuboIQ Connect works with any regular internet connection and most company networks. You just need a decent internet speed (similar to video calling). Most businesses can use it without any special setup.',
    icon: <Monitor className="w-5 h-5" />,
    category: 'technical'
  }
];

export const ConnectFAQ: React.FC = () => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const filteredFAQ = selectedCategory === 'all' 
    ? faqData 
    : faqData.filter(item => item.category === selectedCategory);

  const categories = [
    { id: 'all', label: 'All Topics', count: faqData.length },
    { id: 'security', label: 'Security', count: faqData.filter(f => f.category === 'security').length },
    { id: 'technical', label: 'Technical', count: faqData.filter(f => f.category === 'technical').length },
    { id: 'usage', label: 'Usage', count: faqData.filter(f => f.category === 'usage').length }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="font-space-grotesk text-3xl md:text-4xl font-bold text-pure-white mb-4">
          Bubo<span className="text-iq-neon-green">IQ</span> Connect FAQ
        </h2>
        <p className="text-mist-gray text-lg">
          Everything you need to know about secure remote access
        </p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-3 mb-8 justify-center">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
              selectedCategory === category.id
                ? 'bg-iq-neon-green/20 text-iq-neon-green border border-iq-neon-green/30'
                : 'bg-surface-dark/50 text-mist-gray border border-surface-dark hover:text-pure-white hover:border-iq-neon-green/20'
            }`}
          >
            {category.label}
            <span className="ml-2 text-xs opacity-75">({category.count})</span>
          </button>
        ))}
      </div>

      {/* FAQ Items */}
      <div className="space-y-4">
        {filteredFAQ.map((item) => (
          <div
            key={item.id}
            className="bubo-glass rounded-2xl border border-iq-neon-green/10 overflow-hidden"
          >
            <button
              onClick={() => toggleExpanded(item.id)}
              className="w-full p-6 text-left flex items-center justify-between hover:bg-iq-neon-green/5 transition-colors duration-300"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-iq-neon-green/20 rounded-xl flex items-center justify-center text-iq-neon-green">
                  {item.icon}
                </div>
                <h3 className="font-space-grotesk font-semibold text-pure-white text-lg">
                  {item.question}
                </h3>
              </div>
              <ChevronDown 
                className={`w-5 h-5 text-mist-gray transition-transform duration-300 ${
                  expandedItems.has(item.id) ? 'rotate-180' : ''
                }`}
              />
            </button>
            
            {expandedItems.has(item.id) && (
              <div className="px-6 pb-6">
                <div className="border-t border-iq-neon-green/10 pt-4 ml-14">
                  <p className="text-mist-gray leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Support CTA */}
      <div className="mt-12 text-center">
        <div className="bubo-glass rounded-2xl p-8 border border-iq-neon-green/20">
          <h3 className="font-space-grotesk text-xl font-bold text-pure-white mb-2">
            Still have questions?
          </h3>
          <p className="text-mist-gray mb-6">
            Our technical team is here to help you get the most out of BuboIQ Connect.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@buboiq.com"
              className="bubo-btn-secondary inline-flex items-center"
            >
              Contact Support
            </a>
            <a
              href="#"
              className="bubo-btn-ghost inline-flex items-center"
            >
              Schedule Demo
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};