import React from 'react';
import { ArrowLeft, Shield, Eye, FileText } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Separator } from '../ui/separator';

interface LegalPageProps {
  type: 'privacy' | 'terms';
  onNavigate: (page: string) => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({ type, onNavigate }) => {
  const isPrivacy = type === 'privacy';

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Button 
          onClick={() => onNavigate('home')}
          className="bubo-btn-ghost mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-iq-neon-green/20 rounded-xl flex items-center justify-center">
              {isPrivacy ? <Shield className="w-8 h-8 text-iq-neon-green" /> : <FileText className="w-8 h-8 text-iq-neon-green" />}
            </div>
          </div>
          
          <h1 className="font-['Space_Grotesk'] text-5xl md:text-7xl font-bold text-pure-white mb-4">
            {isPrivacy ? 'Privacy Policy' : 'Terms of Service'}
          </h1>
          
          <p className="text-lg text-mist-gray">
            Last updated: December 2024
          </p>
        </div>

        <Card className="bubo-glass p-8">
          {isPrivacy ? (
            <div className="prose prose-invert max-w-none">
              <div className="mb-8">
                <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-pure-white mb-4 flex items-center">
                  <Eye className="w-6 h-6 mr-3 text-iq-neon-green" />
                  Our Privacy Commitment
                </h2>
                <p className="text-cloud-white mb-6">
                  At BuboIQ, we believe your data is yours. We're committed to transparency about how we collect, 
                  use, and protect your information. This policy explains our practices in plain English.
                </p>
              </div>

              <Separator className="my-8 bg-slate-gray/30" />

              <section className="mb-8">
                <h3 className="font-['Space_Grotesk'] text-xl font-bold text-pure-white mb-4">
                  Information We Collect
                </h3>
                <div className="space-y-4 text-mist-gray">
                  <div>
                    <h4 className="font-semibold text-pure-white mb-2">Account Information</h4>
                    <p>When you create an account, we collect your name, email address, company name, and billing information.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-pure-white mb-2">Usage Data</h4>
                    <p>We collect information about how you use BuboIQ, including features accessed, time spent, and performance metrics to improve our service.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-pure-white mb-2">Technical Data</h4>
                    <p>IT signals, tickets, incidents, and operational data you input into BuboIQ. This data is processed to provide our AI services but remains yours.</p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h3 className="font-['Space_Grotesk'] text-xl font-bold text-pure-white mb-4">
                  How We Use Your Information
                </h3>
                <ul className="space-y-2 text-mist-gray">
                  <li>• Provide and improve BuboIQ services</li>
                  <li>• Process AI analysis and predictions for your organization</li>
                  <li>• Send important service updates and security notifications</li>
                  <li>• Provide customer support</li>
                  <li>• Ensure platform security and prevent fraud</li>
                </ul>
              </section>

              <section className="mb-8">
                <h3 className="font-['Space_Grotesk'] text-xl font-bold text-pure-white mb-4">
                  Data Protection & Security
                </h3>
                <div className="space-y-4 text-mist-gray">
                  <p>
                    <strong className="text-pure-white">Encryption:</strong> All data is encrypted in transit (TLS 1.3) and at rest (AES-256).
                  </p>
                  <p>
                    <strong className="text-pure-white">Access Controls:</strong> Strict role-based access with multi-factor authentication required.
                  </p>
                  <p>
                    <strong className="text-pure-white">Data Isolation:</strong> Your data is logically separated and never mixed with other customers' data.
                  </p>
                  <p>
                    <strong className="text-pure-white">AI Training:</strong> We never use your data to train AI models for other customers.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h3 className="font-['Space_Grotesk'] text-xl font-bold text-pure-white mb-4">
                  Your Rights
                </h3>
                <ul className="space-y-2 text-mist-gray">
                  <li>• <strong className="text-pure-white">Access:</strong> Request a copy of your personal data</li>
                  <li>• <strong className="text-pure-white">Correction:</strong> Update or correct inaccurate information</li>
                  <li>• <strong className="text-pure-white">Deletion:</strong> Request deletion of your data (subject to legal requirements)</li>
                  <li>• <strong className="text-pure-white">Portability:</strong> Export your data in standard formats</li>
                  <li>• <strong className="text-pure-white">Objection:</strong> Opt out of certain data processing activities</li>
                </ul>
              </section>

              <section className="mb-8">
                <h3 className="font-['Space_Grotesk'] text-xl font-bold text-pure-white mb-4">
                  Compliance
                </h3>
                <p className="text-mist-gray">
                  BuboIQ is SOC 2 Type II compliant and adheres to GDPR, CCPA, and other applicable privacy regulations. 
                  We undergo regular security audits and maintain industry-standard certifications.
                </p>
              </section>

              <div className="bg-iq-neon-green/10 border border-iq-neon-green/30 rounded-xl p-6">
                <h4 className="font-semibold text-iq-neon-green mb-2">Questions About Privacy?</h4>
                <p className="text-cloud-white">
                  Contact our privacy team at <a href="mailto:privacy@buboiq.com" className="text-iq-neon-green hover:underline">privacy@buboiq.com</a> 
                  or reach out through our support channels.
                </p>
              </div>
            </div>
          ) : (
            <div className="prose prose-invert max-w-none">
              <div className="mb-8">
                <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-pure-white mb-4 flex items-center">
                  <FileText className="w-6 h-6 mr-3 text-iq-neon-green" />
                  Terms of Service
                </h2>
                <p className="text-cloud-white mb-6">
                  These terms govern your use of BuboIQ services. By using our platform, 
                  you agree to these terms and our commitment to providing reliable AI-driven IT operations.
                </p>
              </div>

              <Separator className="my-8 bg-slate-gray/30" />

              <section className="mb-8">
                <h3 className="font-['Space_Grotesk'] text-xl font-bold text-pure-white mb-4">
                  Service Description
                </h3>
                <p className="text-mist-gray mb-4">
                  BuboIQ provides AI-powered IT operations management, including signal monitoring, 
                  incident correlation, predictive analytics, and smart ticketing services.
                </p>
                <p className="text-mist-gray">
                  Our service is designed for businesses and organizations to improve their IT operations 
                  through intelligent automation and predictive insights.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="font-['Space_Grotesk'] text-xl font-bold text-pure-white mb-4">
                  Acceptable Use
                </h3>
                <div className="text-mist-gray space-y-4">
                  <p><strong className="text-pure-white">You may:</strong></p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Use BuboIQ for legitimate business IT operations</li>
                    <li>Integrate with your existing tools and systems</li>
                    <li>Share access with your team members</li>
                    <li>Export your data at any time</li>
                  </ul>
                  
                  <p><strong className="text-pure-white">You may not:</strong></p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Use the service for illegal activities</li>
                    <li>Attempt to reverse engineer or copy our AI models</li>
                    <li>Share account credentials with unauthorized users</li>
                    <li>Overload our systems with excessive requests</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h3 className="font-['Space_Grotesk'] text-xl font-bold text-pure-white mb-4">
                  Service Availability
                </h3>
                <div className="text-mist-gray space-y-2">
                  <p>• <strong className="text-pure-white">Uptime SLA:</strong> 99.9% availability guarantee</p>
                  <p>• <strong className="text-pure-white">Maintenance:</strong> Scheduled maintenance with 24-hour notice</p>
                  <p>• <strong className="text-pure-white">Support:</strong> 24/7 support for critical issues on paid plans</p>
                </div>
              </section>

              <section className="mb-8">
                <h3 className="font-['Space_Grotesk'] text-xl font-bold text-pure-white mb-4">
                  Payment Terms
                </h3>
                <div className="text-mist-gray space-y-2">
                  <p>• Billing occurs monthly or annually based on your plan selection</p>
                  <p>• 14-day free trial available for all plans</p>
                  <p>• 30-day money-back guarantee on all paid plans</p>
                  <p>• You can cancel or downgrade anytime with 30 days notice</p>
                </div>
              </section>

              <section className="mb-8">
                <h3 className="font-['Space_Grotesk'] text-xl font-bold text-pure-white mb-4">
                  Data Ownership
                </h3>
                <p className="text-mist-gray">
                  You retain full ownership of all data you input into BuboIQ. We provide processing 
                  and analysis services but never claim ownership of your business data, tickets, or operational information.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="font-['Space_Grotesk'] text-xl font-bold text-pure-white mb-4">
                  Limitation of Liability
                </h3>
                <p className="text-mist-gray">
                  BuboIQ provides AI predictions and analysis as a tool to assist IT operations. 
                  While we strive for accuracy, final decisions about IT operations remain your responsibility. 
                  Our liability is limited to the amount you pay for our services.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="font-['Space_Grotesk'] text-xl font-bold text-pure-white mb-4">
                  Changes to Terms
                </h3>
                <p className="text-mist-gray">
                  We may update these terms occasionally. We'll notify you of significant changes 
                  via email and provide 30 days notice before any changes take effect.
                </p>
              </section>

              <div className="bg-cyan-accent/10 border border-cyan-accent/30 rounded-xl p-6">
                <h4 className="font-semibold text-cyan-accent mb-2">Questions About Terms?</h4>
                <p className="text-cloud-white">
                  Contact our legal team at <a href="mailto:legal@buboiq.com" className="text-cyan-accent hover:underline">legal@buboiq.com</a> 
                  for any questions about these terms of service.
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};