import React, { useState } from 'react';
import { ArrowRight, Users, Target, Lightbulb, Heart, Zap } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { OrbSystem } from './OrbSystem';
import { DeviceNetworkOrb } from './DeviceNetworkOrb';
import kevinImage from 'figma:asset/41a49c28f6517f5aed0ec919dc272807fbbefaf2.png';

interface AboutPageProps {
  onNavigate: (page: string) => void;
  onTryItNow: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, onTryItNow }) => {
  const [selectedMilestone, setSelectedMilestone] = useState<number | null>(null);
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);

  const timeline = [
    {
      title: 'TicketEase Roots',
      description: 'Started as a simple helpdesk tool for small businesses',
      details: 'Founded with the mission to make IT support accessible for small teams. Focused on simplicity and ease of use over enterprise complexity.'
    },
    {
      title: 'The problem',
      description: 'Old ticketing just treated symptoms, not root causes',
      details: 'Customers told us regular ticketing was reactive. Teams drowned in duplicate alerts and couldn\'t see patterns.'
    },
    {
      title: 'AI shift',
      description: 'Built smart tools to catch problems early',
      details: 'Made computers smart enough to spot patterns and group related issues automatically.'
    },
    {
      title: 'BUBOIQ Born',
      description: 'Rebuilt everything to be smart by design',
      details: 'Created a completely new system that watches everything, thinks about problems first, then takes action. Like having a wise owl watching over your technology.'
    },
    {
      title: 'Market Ready',
      description: 'Launched BUBOIQ to help businesses run smoother',
      details: 'Now helps IT teams work smarter by spotting problems early and reducing alert noise. Serving teams who want better than reactive chaos.'
    }
  ];

  const values = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Fast',
      description: 'Everything should feel instant. No waiting, no loading, no delays.',
      color: 'text-signal-yellow'
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: 'Clear',
      description: 'Complex problems get simple answers. No jargon, no confusion.',
      color: 'text-cyan-accent'
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: 'Built for IT pros',
      description: 'Made by engineers who know chaotic IT.',
      color: 'text-iq-neon-green'
    }
  ];


  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        {/* About Page Intelligence Orbs - Metaball Story Evolution */}
        <OrbSystem
          variantType="Metaball"
          sizeToken="L"
          placement="MidRight"
          zLayer="MidGlass"
          tint="Base"
          motionProfile="Idle"
          glow={2}
          className="opacity-60"
        />
        <OrbSystem
          variantType="ParticleSwarm"
          sizeToken="S"
          placement="TopLeft"
          zLayer="MidGlass"
          tint="Base"
          motionProfile="Scroll"
          density={3}
          glow={1}
          className="opacity-40"
        />
        
        {/* Subtle background tint */}
        <div className="absolute inset-0 bg-gradient-to-b from-surface-dark/20 to-transparent pointer-events-none z-[5]" />
        
        {/* Neural Network Grid */}
        <div className="absolute inset-0 bubo-circuit-pattern opacity-10 pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="flex justify-center mb-12">
            <div className="relative group">
              <DeviceNetworkOrb size={320} className="bubo-animate-float relative z-10" isHomePage={false} />
              <div className="absolute inset-0 bg-iq-neon-green/20 rounded-full blur-xl scale-150 group-hover:scale-175 transition-transform duration-700" />
              <div className="absolute inset-0 bg-electric-blue/10 rounded-full blur-2xl scale-200 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </div>
          </div>
          
          <h1 className="font-space-grotesk text-5xl md:text-7xl font-bold text-pure-white mb-6 leading-tight">
            We Built a Brain,
            <span className="text-iq-neon-green bubo-neon-text-green relative">
              {' '}Not a Filing Cabinet
              <div className="absolute inset-0 bg-gradient-to-r from-iq-neon-green to-cyan-accent opacity-0 hover:opacity-20 transition-opacity duration-300 blur-xl" />
            </span>
          </h1>
          
          <div className="bubo-glass p-8 md:p-12 rounded-3xl mb-12 max-w-4xl mx-auto relative group overflow-hidden">
            {/* Holographic Background Effect */}
            <div className="absolute inset-0 bubo-holographic opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
            
            {/* Scanning Line Effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-iq-neon-green/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1500" />
            </div>
            
            <p className="font-inter text-xl md:text-2xl text-cloud-white leading-relaxed relative z-10">
              "Transform chaotic IT operations into intelligent, predictive workflows that 
              <span className="text-iq-neon-green bubo-neon-text-green"> prevent problems before they impact your team</span>. 
              Built by someone who understands the pain of reactive IT chaos."
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-['Space_Grotesk'] text-3xl md:text-4xl font-bold text-pure-white mb-4">
              Our Journey
            </h2>
            <p className="text-lg text-mist-gray">From simple ticketing to AI-first intelligence</p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-iq-neon-green via-cyan-accent to-signal-yellow" />
            
            <div className="space-y-12">
              {timeline.map((milestone, index) => (
                <div key={index} className="relative">
                  {/* Timeline dot */}
                  <div className="absolute left-2 md:left-1/2 w-4 h-4 bg-iq-neon-green rounded-full border-4 border-dark-midnight transform -translate-x-1/2" />
                  
                  <div className={`ml-12 md:ml-0 ${index % 2 === 0 ? 'md:pr-1/2' : 'md:pl-1/2 md:text-right'}`}>
                    <Card 
                      className={`bubo-glass p-6 cursor-pointer transition-all duration-300 hover:scale-105 ${
                        selectedMilestone === index ? 'border-iq-neon-green/50 bubo-glow-green' : 'border-slate-gray/30'
                      }`}
                      onClick={() => setSelectedMilestone(selectedMilestone === index ? null : index)}
                    >
                      <div className="mb-3">
                        <h3 className="font-['Space_Grotesk'] text-lg font-bold text-pure-white">
                          {milestone.title === 'BUBOIQ Born' ? (
                            <><span className="text-white">BUBO</span><span className="text-[#00FF85]">IQ</span> Born</>
                          ) : (
                            milestone.title
                          )}
                        </h3>
                      </div>
                      <p className="text-mist-gray mb-3">
                        {milestone.title === 'Market Ready' ? (
                          <>Launched <span className="text-white">BUBO</span><span className="text-[#00FF85]">IQ</span> as the AI brain for IT operations</>
                        ) : (
                          milestone.description
                        )}
                      </p>
                      
                      {selectedMilestone === index && (
                        <div className="border-t border-slate-gray/30 pt-4 mt-4">
                          <p className="text-cloud-white">{milestone.details}</p>
                        </div>
                      )}
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-nocturne-indigo/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-['Space_Grotesk'] text-3xl md:text-4xl font-bold text-pure-white mb-4">
              Our Values
            </h2>
            <p className="text-lg text-mist-gray">What drives everything we build</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="bubo-glass p-8 text-center hover:scale-105 transition-all duration-300">
                <div className={`${value.color} mb-4 flex justify-center`}>
                  <div className="w-16 h-16 bg-current/20 rounded-2xl flex items-center justify-center">
                    {value.icon}
                  </div>
                </div>
                <h3 className="font-['Space_Grotesk'] text-xl font-bold text-pure-white mb-3">
                  {value.title}
                </h3>
                <p className="text-mist-gray">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Founder */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-['Space_Grotesk'] text-3xl md:text-4xl font-bold text-pure-white mb-4">
              Meet the Founder
            </h2>
            <p className="text-lg text-mist-gray">Building at the crossroads of creativity and problem-solving</p>
          </div>

          <Card className="bubo-glass p-8 md:p-12 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                <img 
                  src={kevinImage}
                  alt="Kevin Haskins - Founder of BuboIQ"
                  className="w-48 h-48 md:w-56 md:h-56 rounded-2xl object-cover border-2 border-iq-neon-green/30 hover:border-iq-neon-green/50 transition-colors duration-300"
                />
              </div>

              {/* Bio Content */}
              <div className="flex-1 text-center md:text-left">
                <h3 className="font-['Space_Grotesk'] text-2xl md:text-3xl font-bold text-pure-white mb-2">
                  Kevin Haskins
                </h3>
                <p className="text-iq-neon-green text-lg mb-6">Founder & CEO</p>
                
                <div className="space-y-4 text-mist-gray leading-relaxed">
                  <p>
                    Starting in healthcare and spending 15+ years in IT taught me that technology works best when it's built for the people using it. 
                    I've spent my career streamlining processes, troubleshooting under pressure, and designing systems that just make sense.
                  </p>
                  
                  <p>
                    Four years ago, I added design to my toolkit — not to make things "pretty," but to make them work better. 
                    Design is about clarity, function, and solving real problems.
                  </p>
                  
                  <p className="text-cloud-white font-medium">
                    That mindset led me to create Bubo<span className="text-iq-neon-green">IQ</span>: combining two decades of experience 
                    into an AI-first platform that helps IT teams work at the speed of thought, not chaos.
                  </p>
                </div>

                {/* Skills/Expertise Tags */}
                <div className="flex flex-wrap gap-2 mt-6 justify-center md:justify-start">
                  <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30">Healthcare IT</Badge>
                  <Badge className="bg-cyan-accent/20 text-cyan-accent border-cyan-accent/30">Product Design</Badge>
                  <Badge className="bg-signal-yellow/20 text-signal-yellow border-signal-yellow/30">SaaS Development</Badge>
                  <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30">15+ Years Tech</Badge>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-iq-neon-green/10 to-cyan-accent/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-['Space_Grotesk'] text-3xl md:text-4xl font-bold text-pure-white mb-4">
            Experience the Difference
          </h2>
          <p className="text-lg text-mist-gray mb-8">
            Join forward-thinking IT teams who've chosen intelligence over chaos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={onTryItNow} className="bubo-btn-neon-primary text-lg px-8 py-4">
              Try It Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button onClick={() => onNavigate('pricing')} className="bubo-btn-secondary text-lg px-8 py-4">
              View Pricing
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};