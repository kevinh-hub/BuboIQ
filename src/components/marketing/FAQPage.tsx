import React, { useState } from 'react';
import { ChevronDown, Search, MessageCircle, Mail, ExternalLink } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { OrbSystem } from './OrbSystem';

interface FAQPageProps {
  onNavigate: (page: string) => void;
}

interface FAQItem {
  question: string;
  answer: string;
  category: 'general' | 'pricing' | 'security' | 'compliance' | 'features' | 'support';
}

export const FAQPage: React.FC<FAQPageProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const faqs: FAQItem[] = [
    {
      category: 'general',
      question: 'What is BuboIQ?',
      answer: 'BuboIQ is smart IT support built for MSPs. Unlike old ticketing tools, BuboIQ catches problems before they hit your clients, groups related issues automatically, and cuts alert noise by up to 85%.'
    },
    {
      category: 'general',
      question: 'Who is BuboIQ for?',
      answer: 'Built for MSPs managing IT for many clients. Whether you support 25 computers or 300+, we scale with you and help you catch problems early.'
    },
    {
      category: 'pricing',
      question: 'What pricing plans do you offer?',
      answer: 'We offer three core plans: Starter ($39/month for 25 devices), Pro ($149/month for 100 devices), and Team ($349/month for 300 devices). All plans include our AI-powered intelligence engine, smart ticket correlation, and real-time monitoring. You can also add specialized packs: Security & Compliance Pack ($129/mo + $0.60/device), DR/Backup Pack ($99/mo), and Remote/Zero-Trust Pack ($79/mo).'
    },
    {
      category: 'pricing',
      question: 'Is there a free trial?',
      answer: 'Yes! All new accounts include a 14-day free trial. You can explore the platform and experience how BuboIQ helps MSPs deliver proactive IT support before committing to a plan.'
    },
    {
      category: 'pricing',
      question: 'What happens if I exceed my device limit?',
      answer: 'If you approach your device limit, we\'ll notify you in advance. You can easily upgrade to the next tier or purchase additional device capacity through our add-on packs. We never shut off your service without warning.'
    },
    {
      category: 'features',
      question: 'How does smart prediction work?',
      answer: 'BuboIQ watches your whole setup and learns patterns that happen before failures. It looks at past data, connects events across computers, and warns you before things break. Like having a wise owl watching your tech 24/7.'
    },
    {
      category: 'features',
      question: 'What tools does BuboIQ work with?',
      answer: 'Works with your current RMM and PSA tools (ConnectWise, Datto, NinjaOne), monitoring systems, and chat apps like Slack and Teams. Team plan gets custom connections for special needs.'
    },
    {
      category: 'features',
      question: 'Can I brand BuboIQ as my own?',
      answer: 'Yes! Team plan ($349/mo) lets you add your logo, change colors, and make the client view match your MSP brand.'
    },
    {
      category: 'security',
      question: 'How secure is BuboIQ?',
      answer: 'Security is job #1. BuboIQ uses strong encryption (AES-256 stored, TLS 1.3 in transit), role controls, and runs on SOC 2 Type II infrastructure. All remote sessions are encrypted end-to-end with full audit logs.'
    },
    {
      category: 'security',
      question: 'Where is my data stored?',
      answer: 'Stored in secure cloud with auto backups. Each MSP\'s data stays completely separate from others. You own your data and can export it anytime.'
    },
    {
      category: 'compliance',
      question: 'Is BuboIQ HIPAA compliant?',
      answer: 'Yes! Team plan ($349/mo) with Security & Compliance Pack ($129/mo + $0.60/device) includes HIPAA features: auto health data detection and hiding, breach notices, audit logs, and scorecards. Must-have for MSPs with healthcare clients.'
    },
    {
      category: 'compliance',
      question: 'What compliance rules do you support?',
      answer: 'Supports HIPAA, SOC 2, PCI-DSS, GDPR, and NIST. Security & Compliance Pack (needs Team plan) includes auto evidence collection, scorecards, breach workflows, and one-click exports to make audits easier.'
    },
    {
      category: 'support',
      question: 'What support do you offer?',
      answer: 'All plans get email support. Team plan ($349/mo) gets a dedicated account manager with custom onboarding and success calls. Full docs, guides, and best practices for everyone.'
    },
    {
      category: 'support',
      question: 'Do you help us get started?',
      answer: 'Yes! Everyone gets guided setup with help docs and best practices. Team plan ($349/mo) gets custom onboarding calls, workflow help, and ongoing success support.'
    },
    {
      category: 'support',
      question: 'How do I get in touch with your team?',
      answer: 'You can reach us at help@buboiq.com for general inquiries, sales questions, and support requests. We typically respond within 24 hours. Team tier customers receive priority support with dedicated account management.'
    },
    {
      category: 'features',
      question: 'What is BuboConnect remote access?',
      answer: 'BuboConnect is our zero-trust remote support solution integrated directly into the platform. Pro plan includes 50 sessions (60 min each), Team includes 200 sessions (120 min each). The Remote/Zero-Trust Pack ($79/mo) adds powerful capabilities. All sessions are encrypted, logged, and compliance-ready.'
    },
    {
      category: 'pricing',
      question: 'Can I add more devices to my plan?',
      answer: 'Yes! Each tier includes a set number of devices: Starter (25), Pro (100), Team (300). You can upgrade to the next tier anytime or purchase overage capacity at per-device rates. The Security & Compliance Pack also charges $0.60/device beyond the base fee.'
    },
    {
      category: 'support',
      question: 'BuboIQ Agent System Requirements',
      answer: '📋 Quick Summary\n\n**Supported Operating Systems**\nWindows: 11 (x64, ARM64), 10 21H2+, Server 2019/2022\nmacOS: 11 Big Sur → 15 Sequoia, Intel & Apple Silicon\nLinux: Ubuntu 20.04+, Debian 11+, RHEL/Rocky/Alma 8+, Kernel 5.4+\n\n**Hardware Requirements**\nMinimum: 1 GHz CPU, 512 MB RAM, 100 MB disk, HTTPS connection\nRecommended: 2 GHz dual-core, 2 GB RAM, 500 MB disk, 5 Mbps broadband\nResource usage: < 2% CPU avg | ~50 MB RAM | 50–100 MB/day network\n\n**Network Requirements**\nOutbound only: api.buboiq.com, updates.buboiq.com, telemetry.buboiq.com\nTLS 1.3 required, proxy-friendly, firewall/NAT-safe\n\n**Installation Requirements**\nWindows: Admin privileges\nmacOS: Admin account with sudo\nLinux: Root or sudo access'
    },
    {
      category: 'features',
      question: 'What is the BuboIQ Knowledge Base?',
      answer: 'The BuboIQ Knowledge Base is a self-building solution library that automatically learns from your resolved tickets. When your team fixes problems, our AI analyzes the solution steps, creates structured articles, and makes them available for future issues. Instead of manually documenting fixes, BuboIQ builds your knowledge base automatically—turning every resolved ticket into institutional knowledge.'
    },
    {
      category: 'features',
      question: 'How does the Knowledge Base self-learning system work?',
      answer: 'Here is the automated workflow: (1) When issues are resolved, BuboIQ collects all evidence—logs, steps taken, and outcomes. (2) AI analyzes this data and creates a draft article with step-by-step solutions. (3) Technical experts review and approve the draft through our Reviewer Console. (4) Once approved, the article is published and becomes searchable. (5) Users provide feedback on solution effectiveness, and the AI continuously refines articles based on real-world success rates.'
    },
    {
      category: 'features',
      question: 'What makes Knowledge Base articles different from regular documentation?',
      answer: 'BuboIQ articles are dynamic and data-driven. Each article shows: (1) Confidence level (high/medium/low) based on how many times the fix has worked. (2) Success rate percentage from real resolutions. (3) Median time to fix so you know how long it takes. (4) Built from X issues—showing how many real problems validated this solution. (5) Last verified date to ensure freshness. Plus, articles are automatically tagged by OS, vendor, and device class for precise searching.'
    },
    {
      category: 'features',
      question: 'Who can create and review Knowledge Base articles?',
      answer: 'Article creation is automated—BuboIQ AI generates draft articles from resolved tickets. However, human review is required before publishing. Team members with reviewer permissions can access the Reviewer Console to approve or reject drafts, edit solution steps, adjust risk levels, and ensure accuracy. This hybrid approach combines AI efficiency with human expertise for high-quality, trustworthy solutions.'
    },
    {
      category: 'features',
      question: 'Can I search the Knowledge Base when creating tickets?',
      answer: 'Yes! The Knowledge Base is integrated directly into ticket workflows. When creating or viewing tickets, you can search for relevant solutions and link them to tickets. If a matching article exists, you can apply the fix steps immediately. If no article exists yet, BuboIQ can create a draft once the issue is resolved—automatically building your knowledge base from real-world fixes.'
    },
    {
      category: 'pricing',
      question: 'Is the Knowledge Base available on all plans?',
      answer: 'The Knowledge Base is available on all plans (Starter, Pro, and Team), but capabilities vary by tier. All plans can view and search published articles. Pro plan adds draft creation and basic analytics. Team plan includes full Reviewer Console access, detailed metrics, confidence scoring, and the ability to manage article lifecycles (draft → published → deprecated).'
    },
    {
      category: 'features',
      question: 'What are Guided Fixes?',
      answer: 'Guided Fixes are step-by-step actions for common fixes—flush DNS, reset network, collect logs, and more—across Windows, macOS, and Linux, powered by the BuboIQ Agent or a Connect session.'
    },
    {
      category: 'features',
      question: 'Do Guided Fixes execute commands automatically?',
      answer: 'Only when you click Run. Every step shows what it does, the expected output, and a Safety grade. Destructive steps require typed confirmation and, on Team, approval.'
    },
    {
      category: 'pricing',
      question: 'Which plans include Guided Fixes?',
      answer: 'Starter ($33/mo) includes safe Quick Actions. Full Guided Fixes and remote execution are in Pro ($127/mo) and Team ($297/mo).'
    },
    {
      category: 'security',
      question: 'Are Guided Fixes safe for production machines?',
      answer: 'Yes—each step has a Safety grade, prerequisites, and timeouts. Risky/Destructive steps require confirmation. Team can enforce approvals and audit trails.'
    },
    {
      category: 'features',
      question: 'How does remote execution work with Guided Fixes?',
      answer: 'Use BuboIQ Connect to run steps on the target device. Remote runs use your existing session pool and inherit your organization\'s security policies.'
    },
    {
      category: 'security',
      question: 'What data is collected during Guided Fix execution?',
      answer: 'Execution logs stream to your console. Exports and KB drafts use built-in redaction for credentials, emails, IPs, and device identifiers. Telemetry is off by default.'
    },
    {
      category: 'features',
      question: 'Can I create my own Guided Fixes?',
      answer: 'Yes. Pro and Team can publish organization Guided Fixes. Team adds policies and approvals for high-risk actions.'
    },
    {
      category: 'features',
      question: 'Do Guided Fixes cover all operating systems?',
      answer: 'Yes—Windows, macOS, and Linux. The UI shows only valid steps for the target OS and version.'
    },
    {
      category: 'features',
      question: 'Can I preview a Guided Fix before running it?',
      answer: 'Always. You will see a plain-English summary, the exact command, prerequisites, and expected output before running any step.'
    },
    {
      category: 'features',
      question: 'How do approvals work for Guided Fixes?',
      answer: 'On Team, destructive steps show "Approval required." Approvers can review the step, its safety grade, and the rollback path before allowing it to run.'
    },
    {
      category: 'support',
      question: 'What happens if a Guided Fix step fails?',
      answer: 'The runner shows errors inline and suggests next steps. Some actions include rollback commands when applicable.'
    },
    {
      category: 'features',
      question: 'Will Guided Fixes create Knowledge Base articles automatically?',
      answer: 'After a successful Guided Fix, BuboIQ drafts an article (Prechecks → Fix → Verify) with redacted outputs for review.'
    },
    {
      category: 'features',
      question: 'Can I use industry presets with Guided Fixes?',
      answer: 'Yes. Healthcare/Finance/SaaS preset packs are supported as content packs. They add policy defaults and curated Guided Fixes.'
    },
    {
      category: 'pricing',
      question: 'Do Guided Fixes change my pricing?',
      answer: 'No. Guided Fixes respect current plans: Starter $33, Pro $127, Team $297.'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Questions', count: faqs.length },
    { id: 'general', label: 'General', count: faqs.filter(f => f.category === 'general').length },
    { id: 'pricing', label: 'Pricing & Plans', count: faqs.filter(f => f.category === 'pricing').length },
    { id: 'features', label: 'Features', count: faqs.filter(f => f.category === 'features').length },
    { id: 'security', label: 'Security', count: faqs.filter(f => f.category === 'security').length },
    { id: 'compliance', label: 'Compliance', count: faqs.filter(f => f.category === 'compliance').length },
    { id: 'support', label: 'Support', count: faqs.filter(f => f.category === 'support').length }
  ];

  const toggleItem = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        {/* Intelligence Orbs */}
        <OrbSystem
          variantType="ParticleSwarm"
          sizeToken="M"
          placement="TopRight"
          zLayer="MidGlass"
          tint="Base"
          motionProfile="Idle"
          density={2}
          glow={2}
          className="opacity-50"
        />
        <OrbSystem
          variantType="Metaball"
          sizeToken="S"
          placement="MidLeft"
          zLayer="MidGlass"
          tint="Base"
          motionProfile="Scroll"
          glow={1}
          className="opacity-40"
        />

        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-surface-dark/20 to-transparent pointer-events-none z-[5]" />
        <div className="absolute inset-0 bubo-circuit-pattern opacity-10 pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="flex justify-center mb-6">
            <Badge className="bg-iq-neon-green/10 text-iq-neon-green border-iq-neon-green/30 px-4 py-2">
              Frequently Asked Questions
            </Badge>
          </div>

          <h1 className="font-space-grotesk text-5xl md:text-7xl font-bold text-pure-white mb-6 leading-tight">
            We're Here to{' '}
            <span className="text-iq-neon-green bubo-neon-text-green">Help You Succeed</span>
          </h1>

          <p className="font-inter text-xl text-mist-gray mb-12 max-w-3xl mx-auto">
            Find answers to common questions about <span className="text-white">BUBO</span><span className="text-iq-neon-green">IQ</span>, our pricing, features, and how we help MSPs deliver proactive IT support.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative bubo-glass rounded-2xl p-2">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-mist-gray" />
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none outline-none pl-14 pr-4 py-4 text-cloud-white placeholder:text-mist-gray font-inter"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-b border-slate-gray/30">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-iq-neon-green text-dark-midnight bubo-glow-green'
                    : 'bg-surface-dark/50 text-mist-gray hover:text-cloud-white border border-slate-gray/30 hover:border-iq-neon-green/30'
                }`}
              >
                {category.label}
                <span className="ml-2 text-xs opacity-70">({category.count})</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {filteredFAQs.length === 0 ? (
            <Card className="bubo-glass p-12 text-center">
              <p className="text-mist-gray text-lg">
                No questions found matching "{searchQuery}". Try a different search term or browse by category.
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredFAQs.map((faq, index) => (
                <Card
                  key={index}
                  className={`bubo-glass overflow-hidden transition-all duration-300 cursor-pointer ${
                    expandedItems.has(index) ? 'border-iq-neon-green/30 bubo-glow-green' : 'border-slate-gray/30'
                  }`}
                  onClick={() => toggleItem(index)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className="bg-iq-neon-green/10 text-iq-neon-green border-iq-neon-green/30 text-xs">
                            {faq.category}
                          </Badge>
                        </div>
                        <h3 className="font-space-grotesk text-lg font-bold text-pure-white">
                          {faq.question}
                        </h3>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-iq-neon-green transition-transform duration-300 flex-shrink-0 ${
                          expandedItems.has(index) ? 'rotate-180' : ''
                        }`}
                      />
                    </div>

                    {expandedItems.has(index) && (
                      <div className="mt-4 pt-4 border-t border-slate-gray/30">
                        <p className="font-inter text-cloud-white leading-relaxed whitespace-pre-line">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-t from-iq-neon-green/5 to-transparent pointer-events-none" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <Card className="bubo-glass-bright p-12 text-center relative overflow-hidden">
            {/* Holographic Effect */}
            <div className="absolute inset-0 bubo-holographic opacity-50 rounded-3xl" />
            
            <div className="relative z-10">
              <MessageCircle className="w-16 h-16 text-iq-neon-green mx-auto mb-6" />
              
              <h2 className="font-space-grotesk text-3xl md:text-4xl font-bold text-pure-white mb-4">
                Still Have Questions?
              </h2>
              
              <p className="font-inter text-lg text-cloud-white mb-8 max-w-2xl mx-auto">
                Our team is here to help. Get in touch and we'll answer your questions within 24 hours.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => window.location.href = 'mailto:help@buboiq.com'}
                  className="bubo-btn-neon-primary"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Email Us
                </Button>
                
                <Button 
                  onClick={() => onNavigate('pricing')}
                  className="bubo-btn-secondary"
                >
                  View Pricing
                  <ExternalLink className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};
