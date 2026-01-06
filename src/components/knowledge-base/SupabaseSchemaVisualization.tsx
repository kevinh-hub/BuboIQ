import React, { useState } from 'react';
import { Database, Shield, Lock, Users, Eye, FileText, MessageSquare, BarChart3, ArrowRight, Key, Layers, Zap } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface SupabaseSchemaVisualizationProps {
  onClose?: () => void;
}

interface TableSchema {
  name: string;
  description: string;
  tier: 'starter' | 'pro' | 'team' | 'all';
  fields: Array<{
    name: string;
    type: string;
    isPrimary?: boolean;
    isForeign?: boolean;
    isRequired?: boolean;
    description: string;
  }>;
  relationships: Array<{
    target: string;
    type: 'one-to-many' | 'many-to-one' | 'many-to-many';
    field: string;
  }>;
  rlsPolicies: Array<{
    name: string;
    operation: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE';
    condition: string;
  }>;
}

const knowledgeBaseSchema: TableSchema[] = [
  {
    name: 'kb_problem_signature',
    description: 'AI-identified patterns from resolved issues',
    tier: 'all',
    fields: [
      { name: 'id', type: 'UUID', isPrimary: true, isRequired: true, description: 'Unique signature identifier' },
      { name: 'org_id', type: 'UUID', isForeign: true, isRequired: true, description: 'Organization scope' },
      { name: 'signature_hash', type: 'TEXT', isRequired: true, description: 'MD5 hash of problem pattern' },
      { name: 'title', type: 'TEXT', isRequired: true, description: 'Human-readable problem title' },
      { name: 'description', type: 'TEXT', isRequired: true, description: 'Problem description' },
      { name: 'pattern_vector', type: 'VECTOR(1536)', description: 'OpenAI embeddings for similarity search' },
      { name: 'confidence_score', type: 'NUMERIC(3,2)', description: 'ML confidence (0.00-1.00)' },
      { name: 'occurrence_count', type: 'INTEGER', description: 'Number of matching issues' },
      { name: 'os_tags', type: 'TEXT[]', description: 'Operating system compatibility' },
      { name: 'vendor_tags', type: 'TEXT[]', description: 'Software vendor tags' },
      { name: 'device_class_tags', type: 'TEXT[]', description: 'Device type classifications' },
      { name: 'created_at', type: 'TIMESTAMPTZ', isRequired: true, description: 'Creation timestamp' },
      { name: 'updated_at', type: 'TIMESTAMPTZ', isRequired: true, description: 'Last update timestamp' }
    ],
    relationships: [
      { target: 'kb_article', type: 'one-to-many', field: 'signature_id' },
      { target: 'kb_evidence', type: 'one-to-many', field: 'signature_id' }
    ],
    rlsPolicies: [
      { name: 'org_isolation', operation: 'SELECT', condition: 'org_id = auth.jwt() ->> \'org_id\'::UUID' },
      { name: 'org_insert', operation: 'INSERT', condition: 'org_id = auth.jwt() ->> \'org_id\'::UUID' }
    ]
  },
  {
    name: 'kb_article',
    description: 'Self-building knowledge articles with fix steps',
    tier: 'all',
    fields: [
      { name: 'id', type: 'UUID', isPrimary: true, isRequired: true, description: 'Unique article identifier' },
      { name: 'org_id', type: 'UUID', isForeign: true, isRequired: true, description: 'Organization scope' },
      { name: 'signature_id', type: 'UUID', isForeign: true, isRequired: true, description: 'Related problem signature' },
      { name: 'title', type: 'TEXT', isRequired: true, description: 'Article title' },
      { name: 'description', type: 'TEXT', description: 'Article description' },
      { name: 'status', type: 'kb_article_status', isRequired: true, description: 'draft, published, deprecated' },
      { name: 'tier_requirement', type: 'subscription_tier', description: 'Minimum tier for access' },
      { name: 'confidence_level', type: 'confidence_level', description: 'high, medium, low' },
      { name: 'fix_steps', type: 'JSONB', description: 'Structured fix instructions' },
      { name: 'prechecks', type: 'JSONB', description: 'Pre-execution validation steps' },
      { name: 'verification_steps', type: 'JSONB', description: 'Post-fix verification' },
      { name: 'rollback_plan', type: 'JSONB', description: 'Recovery instructions' },
      { name: 'median_time_to_fix', type: 'INTEGER', description: 'Minutes to resolution' },
      { name: 'success_rate', type: 'NUMERIC(5,2)', description: 'Success percentage' },
      { name: 'automation_ready', type: 'BOOLEAN', description: 'Can be automated' },
      { name: 'risk_assessment', type: 'risk_level', description: 'low, medium, high' },
      { name: 'created_by', type: 'UUID', description: 'Author (system or user)' },
      { name: 'reviewed_by', type: 'UUID', description: 'Last reviewer' },
      { name: 'published_at', type: 'TIMESTAMPTZ', description: 'Publication timestamp' },
      { name: 'created_at', type: 'TIMESTAMPTZ', isRequired: true, description: 'Creation timestamp' },
      { name: 'updated_at', type: 'TIMESTAMPTZ', isRequired: true, description: 'Last update timestamp' }
    ],
    relationships: [
      { target: 'kb_problem_signature', type: 'many-to-one', field: 'signature_id' },
      { target: 'kb_feedback', type: 'one-to-many', field: 'article_id' },
      { target: 'kb_evidence', type: 'one-to-many', field: 'article_id' }
    ],
    rlsPolicies: [
      { name: 'org_isolation', operation: 'SELECT', condition: 'org_id = auth.jwt() ->> \'org_id\'::UUID' },
      { name: 'tier_access', operation: 'SELECT', condition: 'check_tier_access(tier_requirement, auth.jwt() ->> \'tier\')' },
      { name: 'org_insert', operation: 'INSERT', condition: 'org_id = auth.jwt() ->> \'org_id\'::UUID' }
    ]
  },
  {
    name: 'kb_evidence',
    description: 'Source tickets and data supporting article creation',
    tier: 'pro',
    fields: [
      { name: 'id', type: 'UUID', isPrimary: true, isRequired: true, description: 'Unique evidence identifier' },
      { name: 'org_id', type: 'UUID', isForeign: true, isRequired: true, description: 'Organization scope' },
      { name: 'signature_id', type: 'UUID', isForeign: true, description: 'Related problem signature' },
      { name: 'article_id', type: 'UUID', isForeign: true, description: 'Related article' },
      { name: 'ticket_id', type: 'UUID', isForeign: true, description: 'Source ticket' },
      { name: 'evidence_type', type: 'evidence_type', isRequired: true, description: 'ticket, log, metric, feedback' },
      { name: 'evidence_data', type: 'JSONB', isRequired: true, description: 'Structured evidence content' },
      { name: 'confidence_weight', type: 'NUMERIC(3,2)', description: 'Evidence reliability (0.00-1.00)' },
      { name: 'extraction_method', type: 'extraction_method', description: 'manual, ai_extracted, automated' },
      { name: 'created_at', type: 'TIMESTAMPTZ', isRequired: true, description: 'Creation timestamp' }
    ],
    relationships: [
      { target: 'kb_problem_signature', type: 'many-to-one', field: 'signature_id' },
      { target: 'kb_article', type: 'many-to-one', field: 'article_id' },
      { target: 'tickets', type: 'many-to-one', field: 'ticket_id' }
    ],
    rlsPolicies: [
      { name: 'org_isolation', operation: 'SELECT', condition: 'org_id = auth.jwt() ->> \'org_id\'::UUID' },
      { name: 'pro_tier_only', operation: 'SELECT', condition: 'check_tier_access(\'pro\', auth.jwt() ->> \'tier\')' }
    ]
  },
  {
    name: 'kb_feedback',
    description: 'User feedback on article effectiveness',
    tier: 'all',
    fields: [
      { name: 'id', type: 'UUID', isPrimary: true, isRequired: true, description: 'Unique feedback identifier' },
      { name: 'org_id', type: 'UUID', isForeign: true, isRequired: true, description: 'Organization scope' },
      { name: 'article_id', type: 'UUID', isForeign: true, isRequired: true, description: 'Related article' },
      { name: 'user_id', type: 'UUID', isForeign: true, description: 'Feedback provider' },
      { name: 'ticket_id', type: 'UUID', isForeign: true, description: 'Related ticket' },
      { name: 'feedback_type', type: 'feedback_type', isRequired: true, description: 'success, failure, improvement' },
      { name: 'rating', type: 'INTEGER', description: 'Rating 1-5' },
      { name: 'comments', type: 'TEXT', description: 'Detailed feedback' },
      { name: 'time_to_complete', type: 'INTEGER', description: 'Minutes to complete fix' },
      { name: 'step_feedback', type: 'JSONB', description: 'Per-step feedback' },
      { name: 'tags', type: 'TEXT[]', description: 'Categorization tags' },
      { name: 'is_anonymous', type: 'BOOLEAN', description: 'Anonymous feedback flag' },
      { name: 'created_at', type: 'TIMESTAMPTZ', isRequired: true, description: 'Creation timestamp' }
    ],
    relationships: [
      { target: 'kb_article', type: 'many-to-one', field: 'article_id' },
      { target: 'users', type: 'many-to-one', field: 'user_id' },
      { target: 'tickets', type: 'many-to-one', field: 'ticket_id' }
    ],
    rlsPolicies: [
      { name: 'org_isolation', operation: 'SELECT', condition: 'org_id = auth.jwt() ->> \'org_id\'::UUID' },
      { name: 'own_feedback', operation: 'SELECT', condition: 'user_id = auth.uid() OR is_anonymous = true' }
    ]
  }
];

const tierColors = {
  all: 'bg-slate-gray/20 text-cloud-white border-slate-gray/30',
  starter: 'bg-slate-gray/20 text-cloud-white border-slate-gray/30',
  pro: 'bg-electric-blue/20 text-electric-blue border-electric-blue/30',
  team: 'bg-prediction-purple/20 text-prediction-purple border-prediction-purple/30'
};

const tierIcons = {
  all: <Users className="w-3 h-3" />,
  starter: <Users className="w-3 h-3" />,
  pro: <Shield className="w-3 h-3" />,
  team: <Zap className="w-3 h-3" />
};

export const SupabaseSchemaVisualization: React.FC<SupabaseSchemaVisualizationProps> = ({
  onClose
}) => {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [activeView, setActiveView] = useState('schema');

  const getFieldIcon = (field: any) => {
    if (field.isPrimary) return <Key className="w-3 h-3 text-iq-neon-green" />;
    if (field.isForeign) return <ArrowRight className="w-3 h-3 text-electric-blue" />;
    return <FileText className="w-3 h-3 text-mist-gray" />;
  };

  const renderDataPipeline = () => (
    <div className="space-y-8">
      <h2 className="text-2xl font-space-grotesk text-pure-white mb-6">
        Self-Building Knowledge Pipeline
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Step 1: Issues Closed */}
        <Card className="bubo-glass p-6 relative">
          <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-iq-neon-green flex items-center justify-center text-dark-midnight font-bold text-sm">
            1
          </div>
          
          <div className="text-center mb-4">
            <div className="w-16 h-16 rounded-full bg-iq-neon-green/20 flex items-center justify-center mx-auto mb-3">
              <FileText className="w-8 h-8 text-iq-neon-green" />
            </div>
            <h3 className="text-lg font-semibold text-pure-white">Issues Closed</h3>
          </div>
          
          <div className="space-y-2 text-sm text-mist-gray">
            <p>• Issue fix patterns identified</p>
            <p>• Solution steps extracted</p>
            <p>• Success metrics captured</p>
          </div>
          
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
            <div className="w-6 h-6 rounded-full bg-electric-blue flex items-center justify-center">
              <ArrowRight className="w-4 h-4 text-pure-white rotate-90" />
            </div>
          </div>
        </Card>

        {/* Step 2: Evidence Ingest */}
        <Card className="bubo-glass p-6 relative">
          <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-electric-blue flex items-center justify-center text-pure-white font-bold text-sm">
            2
          </div>
          
          <div className="text-center mb-4">
            <div className="w-16 h-16 rounded-full bg-electric-blue/20 flex items-center justify-center mx-auto mb-3">
              <Database className="w-8 h-8 text-electric-blue" />
            </div>
            <h3 className="text-lg font-semibold text-pure-white">Evidence Ingest</h3>
          </div>
          
          <div className="space-y-2 text-sm text-mist-gray">
            <p>• Vector embeddings generated</p>
            <p>• Pattern clustering applied</p>
            <p>• Confidence scoring</p>
          </div>
          
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
            <div className="w-6 h-6 rounded-full bg-signal-yellow flex items-center justify-center">
              <ArrowRight className="w-4 h-4 text-dark-midnight rotate-90" />
            </div>
          </div>
        </Card>

        {/* Step 3: Signature Cluster */}
        <Card className="bubo-glass p-6 relative">
          <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-signal-yellow flex items-center justify-center text-dark-midnight font-bold text-sm">
            3
          </div>
          
          <div className="text-center mb-4">
            <div className="w-16 h-16 rounded-full bg-signal-yellow/20 flex items-center justify-center mx-auto mb-3">
              <Layers className="w-8 h-8 text-signal-yellow" />
            </div>
            <h3 className="text-lg font-semibold text-pure-white">Signature Cluster</h3>
          </div>
          
          <div className="space-y-2 text-sm text-mist-gray">
            <p>• Similar issues grouped</p>
            <p>• Problem signatures created</p>
            <p>• Metadata extraction</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Step 4: Draft Article */}
        <Card className="bubo-glass p-6 relative">
          <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-prediction-purple flex items-center justify-center text-pure-white font-bold text-sm">
            4
          </div>
          
          <div className="text-center mb-4">
            <div className="w-16 h-16 rounded-full bg-prediction-purple/20 flex items-center justify-center mx-auto mb-3">
              <Eye className="w-8 h-8 text-prediction-purple" />
            </div>
            <h3 className="text-lg font-semibold text-pure-white">Draft Article</h3>
          </div>
          
          <div className="space-y-2 text-sm text-mist-gray">
            <p>• AI-generated draft created</p>
            <p>• Steps structured and ordered</p>
            <p>• Risk assessment applied</p>
          </div>
          
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
            <div className="w-6 h-6 rounded-full bg-cyan-accent flex items-center justify-center">
              <ArrowRight className="w-4 h-4 text-dark-midnight rotate-90" />
            </div>
          </div>
        </Card>

        {/* Step 5: Reviewer Console */}
        <Card className="bubo-glass p-6 relative">
          <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-cyan-accent flex items-center justify-center text-dark-midnight font-bold text-sm">
            5
          </div>
          
          <div className="text-center mb-4">
            <div className="w-16 h-16 rounded-full bg-cyan-accent/20 flex items-center justify-center mx-auto mb-3">
              <Shield className="w-8 h-8 text-cyan-accent" />
            </div>
            <h3 className="text-lg font-semibold text-pure-white">Reviewer Console</h3>
          </div>
          
          <div className="space-y-2 text-sm text-mist-gray">
            <p>• Human review and approval</p>
            <p>• Quality assurance checks</p>
            <p>• Publication workflow</p>
          </div>
          
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
            <div className="w-6 h-6 rounded-full bg-iq-neon-green flex items-center justify-center">
              <ArrowRight className="w-4 h-4 text-dark-midnight rotate-90" />
            </div>
          </div>
        </Card>

        {/* Step 6: Published KB */}
        <Card className="bubo-glass p-6 relative">
          <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-iq-neon-green flex items-center justify-center text-dark-midnight font-bold text-sm">
            6
          </div>
          
          <div className="text-center mb-4">
            <div className="w-16 h-16 rounded-full bg-iq-neon-green/20 flex items-center justify-center mx-auto mb-3">
              <BarChart3 className="w-8 h-8 text-iq-neon-green" />
            </div>
            <h3 className="text-lg font-semibold text-pure-white">Published KB</h3>
          </div>
          
          <div className="space-y-2 text-sm text-mist-gray">
            <p>• Live knowledge available</p>
            <p>• Issue deflection active</p>
            <p>• Usage tracking enabled</p>
          </div>
        </Card>
      </div>

      {/* Continuous Loop */}
      <Card className="bubo-glass p-6 text-center">
        <h3 className="text-lg font-semibold text-pure-white mb-4">Continuous Improvement Loop</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-iq-neon-green mb-2">Feedback Collection</h4>
            <p className="text-sm text-mist-gray">User success/failure feedback updates confidence scores and triggers article improvements</p>
          </div>
          <div>
            <h4 className="font-medium text-electric-blue mb-2">Metrics Analysis</h4>
            <p className="text-sm text-mist-gray">Deflection rates, time savings, and success patterns inform future article creation</p>
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-dark-midnight bubo-neural-bg p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-iq-neon-green/20 to-electric-blue/20 flex items-center justify-center">
              <Database className="w-6 h-6 text-iq-neon-green" />
            </div>
            <div>
              <h1 className="font-space-grotesk text-2xl text-pure-white mb-1">
                Knowledge Base Architecture
              </h1>
              <p className="text-mist-gray">Supabase schema and data pipeline visualization</p>
            </div>
          </div>
          
          {onClose && (
            <Button onClick={onClose} className="bubo-btn-secondary">
              Close
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeView} onValueChange={setActiveView} className="space-y-6">
        <TabsList className="bg-surface-dark/50 border border-slate-gray/30 rounded-xl p-1">
          <TabsTrigger 
            value="schema" 
            className="data-[state=active]:bg-iq-neon-green/20 data-[state=active]:text-iq-neon-green text-mist-gray"
          >
            <Database className="w-4 h-4 mr-2" />
            Database Schema
          </TabsTrigger>
          <TabsTrigger 
            value="pipeline" 
            className="data-[state=active]:bg-iq-neon-green/20 data-[state=active]:text-iq-neon-green text-mist-gray"
          >
            <Zap className="w-4 h-4 mr-2" />
            Data Pipeline
          </TabsTrigger>
        </TabsList>

        <TabsContent value="schema" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
            {knowledgeBaseSchema.map((table) => (
              <Card 
                key={table.name} 
                className={`bubo-glass p-6 cursor-pointer transition-all duration-300 ${
                  selectedTable === table.name ? 'bubo-glow-green' : 'hover:bubo-glow-green'
                }`}
                onClick={() => setSelectedTable(selectedTable === table.name ? null : table.name)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-iq-neon-green/20 flex items-center justify-center">
                      <Database className="w-5 h-5 text-iq-neon-green" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-pure-white">{table.name}</h3>
                      <p className="text-sm text-mist-gray">{table.description}</p>
                    </div>
                  </div>
                  
                  <Badge className={tierColors[table.tier]}>
                    {tierIcons[table.tier]}
                    <span className="ml-1">{table.tier === 'all' ? 'All Tiers' : table.tier}</span>
                  </Badge>
                </div>

                {selectedTable === table.name && (
                  <div className="space-y-4 border-t border-slate-gray/20 pt-4">
                    {/* Fields */}
                    <div>
                      <h4 className="font-medium text-pure-white mb-3 flex items-center gap-2">
                        <Key className="w-4 h-4 text-iq-neon-green" />
                        Fields ({table.fields.length})
                      </h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {table.fields.map((field) => (
                          <div key={field.name} className="flex items-center gap-3 p-2 bg-surface-dark/50 rounded-lg">
                            {getFieldIcon(field)}
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-sm text-iq-neon-green">{field.name}</span>
                                <span className="text-xs text-electric-blue">{field.type}</span>
                                {field.isRequired && (
                                  <Badge className="bg-crimson-danger/20 text-crimson-danger border-crimson-danger/30 text-xs px-1">
                                    Required
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-mist-gray">{field.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* RLS Policies */}
                    <div>
                      <h4 className="font-medium text-pure-white mb-3 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-electric-blue" />
                        Security Policies ({table.rlsPolicies.length})
                      </h4>
                      <div className="space-y-2">
                        {table.rlsPolicies.map((policy, index) => (
                          <div key={index} className="p-3 bg-electric-blue/10 border border-electric-blue/30 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className="bg-electric-blue/20 text-electric-blue border-electric-blue/30 text-xs">
                                {policy.operation}
                              </Badge>
                              <span className="text-sm font-medium text-pure-white">{policy.name}</span>
                            </div>
                            <p className="text-xs font-mono text-electric-blue">{policy.condition}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Relationships */}
                    {table.relationships.length > 0 && (
                      <div>
                        <h4 className="font-medium text-pure-white mb-3 flex items-center gap-2">
                          <ArrowRight className="w-4 h-4 text-signal-yellow" />
                          Relationships ({table.relationships.length})
                        </h4>
                        <div className="space-y-2">
                          {table.relationships.map((rel, index) => (
                            <div key={index} className="flex items-center gap-3 p-2 bg-signal-yellow/10 border border-signal-yellow/30 rounded-lg">
                              <ArrowRight className="w-4 h-4 text-signal-yellow" />
                              <span className="text-sm text-pure-white">{rel.target}</span>
                              <Badge className="bg-signal-yellow/20 text-signal-yellow border-signal-yellow/30 text-xs">
                                {rel.type}
                              </Badge>
                              <span className="text-xs font-mono text-signal-yellow">{rel.field}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pipeline">
          {renderDataPipeline()}
        </TabsContent>
      </Tabs>
    </div>
  );
};