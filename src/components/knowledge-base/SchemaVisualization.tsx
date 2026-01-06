import React, { useState } from 'react';
import { Database, Shield, Users, FileText, MessageSquare, BarChart3, Search, Eye, Lock } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface SchemaVisualizationProps {
  onBack: () => void;
}

interface SchemaTable {
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  fields: SchemaField[];
  relationships: string[];
}

interface SchemaField {
  name: string;
  type: string;
  description: string;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
  isPrivate?: boolean;
}

export const SchemaVisualization: React.FC<SchemaVisualizationProps> = ({ onBack }) => {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  const schemaTables: SchemaTable[] = [
    {
      name: 'problem_signatures',
      description: 'Unique patterns that identify similar IT problems',
      icon: <Search className="w-6 h-6" />,
      color: 'electric-blue',
      fields: [
        { name: 'id', type: 'UUID', description: 'Unique signature identifier', isPrimaryKey: true },
        { name: 'org_id', type: 'UUID', description: 'Organization identifier', isForeignKey: true, isPrivate: true },
        { name: 'signature_hash', type: 'TEXT', description: 'Computed problem signature' },
        { name: 'title', type: 'TEXT', description: 'Human-readable problem title' },
        { name: 'category', type: 'TEXT', description: 'Problem category (Hardware, Software, etc.)' },
        { name: 'confidence', type: 'INTEGER', description: 'Pattern confidence score (0-100)' },
        { name: 'occurrence_count', type: 'INTEGER', description: 'How many times this pattern occurred' },
        { name: 'created_at', type: 'TIMESTAMP', description: 'When pattern was first identified' },
        { name: 'updated_at', type: 'TIMESTAMP', description: 'Last time pattern was updated' }
      ],
      relationships: ['articles', 'evidence_logs']
    },
    {
      name: 'articles',
      description: 'Knowledge base articles with step-by-step solutions',
      icon: <FileText className="w-6 h-6" />,
      color: 'iq-neon-green',
      fields: [
        { name: 'id', type: 'UUID', description: 'Unique article identifier', isPrimaryKey: true },
        { name: 'org_id', type: 'UUID', description: 'Organization identifier', isForeignKey: true, isPrivate: true },
        { name: 'signature_id', type: 'UUID', description: 'Links to problem signature', isForeignKey: true },
        { name: 'title', type: 'TEXT', description: 'Article title in plain English' },
        { name: 'problem_description', type: 'TEXT', description: 'What the problem looks like to users' },
        { name: 'prechecks', type: 'JSONB', description: 'Steps to verify before fixing' },
        { name: 'fix_steps', type: 'JSONB', description: 'Main solution steps' },
        { name: 'verify_steps', type: 'JSONB', description: 'Steps to confirm fix worked' },
        { name: 'status', type: 'TEXT', description: 'draft, published, or deprecated' },
        { name: 'confidence', type: 'INTEGER', description: 'Solution confidence (0-100)' },
        { name: 'risk_level', type: 'TEXT', description: 'Low, Medium, or High risk' },
        { name: 'estimated_time', type: 'TEXT', description: 'Expected completion time' },
        { name: 'success_rate', type: 'INTEGER', description: 'Percentage of successful applications' },
        { name: 'created_by', type: 'UUID', description: 'User who created/approved', isForeignKey: true },
        { name: 'created_at', type: 'TIMESTAMP', description: 'When article was created' },
        { name: 'updated_at', type: 'TIMESTAMP', description: 'Last modification time' }
      ],
      relationships: ['problem_signatures', 'evidence_logs', 'feedback_logs', 'users']
    },
    {
      name: 'evidence_logs',
      description: 'Collected evidence from real IT issues and their solutions',
      icon: <Eye className="w-6 h-6" />,
      color: 'prediction-purple',
      fields: [
        { name: 'id', type: 'UUID', description: 'Unique evidence identifier', isPrimaryKey: true },
        { name: 'org_id', type: 'UUID', description: 'Organization identifier', isForeignKey: true, isPrivate: true },
        { name: 'signature_id', type: 'UUID', description: 'Links to problem signature', isForeignKey: true },
        { name: 'ticket_id', type: 'UUID', description: 'Source ticket if available', isForeignKey: true },
        { name: 'evidence_type', type: 'TEXT', description: 'logs, screenshots, commands, etc.' },
        { name: 'evidence_data', type: 'JSONB', description: 'The actual evidence content', isPrivate: true },
        { name: 'system_context', type: 'JSONB', description: 'OS, software versions, etc.' },
        { name: 'resolution_steps', type: 'JSONB', description: 'What actually fixed the problem' },
        { name: 'outcome', type: 'TEXT', description: 'success, failure, or partial' },
        { name: 'collected_at', type: 'TIMESTAMP', description: 'When evidence was gathered' }
      ],
      relationships: ['problem_signatures', 'articles', 'tickets']
    },
    {
      name: 'feedback_logs',
      description: 'User feedback on article effectiveness and quality',
      icon: <MessageSquare className="w-6 h-6" />,
      color: 'signal-yellow',
      fields: [
        { name: 'id', type: 'UUID', description: 'Unique feedback identifier', isPrimaryKey: true },
        { name: 'org_id', type: 'UUID', description: 'Organization identifier', isForeignKey: true, isPrivate: true },
        { name: 'article_id', type: 'UUID', description: 'Article being rated', isForeignKey: true },
        { name: 'user_id', type: 'UUID', description: 'User providing feedback', isForeignKey: true, isPrivate: true },
        { name: 'rating', type: 'INTEGER', description: 'Thumbs up (1) or down (0)' },
        { name: 'time_to_complete', type: 'INTEGER', description: 'Minutes taken to complete fix' },
        { name: 'comments', type: 'TEXT', description: 'Optional user comments' },
        { name: 'step_completed', type: 'TEXT', description: 'Which step was being executed' },
        { name: 'outcome', type: 'TEXT', description: 'success, failure, or abandoned' },
        { name: 'submitted_at', type: 'TIMESTAMP', description: 'When feedback was provided' }
      ],
      relationships: ['articles', 'users']
    },
    {
      name: 'users',
      description: 'System users with role-based access to knowledge base',
      icon: <Users className="w-6 h-6" />,
      color: 'cyan-accent',
      fields: [
        { name: 'id', type: 'UUID', description: 'Unique user identifier', isPrimaryKey: true },
        { name: 'org_id', type: 'UUID', description: 'Organization identifier', isForeignKey: true, isPrivate: true },
        { name: 'email', type: 'TEXT', description: 'User email address', isPrivate: true },
        { name: 'role', type: 'TEXT', description: 'admin, reviewer, or user' },
        { name: 'tier', type: 'TEXT', description: 'starter, pro, or team' },
        { name: 'display_name', type: 'TEXT', description: 'User display name' },
        { name: 'preferences', type: 'JSONB', description: 'User settings and preferences' },
        { name: 'created_at', type: 'TIMESTAMP', description: 'Account creation time' },
        { name: 'last_active', type: 'TIMESTAMP', description: 'Last activity timestamp' }
      ],
      relationships: ['articles', 'feedback_logs']
    }
  ];

  const getTableCard = (table: SchemaTable) => (
    <Card
      key={table.name}
      className={`
        bubo-glass p-6 cursor-pointer transition-all duration-300 border-2
        ${selectedTable === table.name 
          ? `border-${table.color} bg-${table.color}/10` 
          : `border-${table.color}/30 hover:border-${table.color}/60`
        }
      `}
      onClick={() => setSelectedTable(selectedTable === table.name ? null : table.name)}
    >
      <div className="flex items-center space-x-4 mb-4">
        <div className={`w-12 h-12 rounded-xl bg-${table.color}/20 flex items-center justify-center text-${table.color}`}>
          {table.icon}
        </div>
        <div>
          <h3 className="font-space-grotesk font-semibold text-pure-white">
            {table.name}
          </h3>
          <p className="text-sm text-mist-gray">{table.description}</p>
        </div>
      </div>

      {selectedTable === table.name && (
        <div className="space-y-3 border-t border-slate-gray/20 pt-4">
          <div className="mb-3">
            <h4 className="font-medium text-pure-white mb-2">Fields:</h4>
            <div className="space-y-2">
              {table.fields.map((field) => (
                <div key={field.name} className="flex items-center justify-between py-2 px-3 bg-surface-dark/50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm text-cyan-accent">{field.name}</span>
                    {field.isPrimaryKey && (
                      <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30 text-xs">
                        PK
                      </Badge>
                    )}
                    {field.isForeignKey && (
                      <Badge className="bg-electric-blue/20 text-electric-blue border-electric-blue/30 text-xs">
                        FK
                      </Badge>
                    )}
                    {field.isPrivate && (
                      <Lock className="w-3 h-3 text-amber-warning" />
                    )}
                  </div>
                  <div className="text-xs text-mist-gray">
                    {field.type}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-pure-white mb-2">Relationships:</h4>
            <div className="flex flex-wrap gap-2">
              {table.relationships.map((rel) => (
                <Badge key={rel} className="bg-prediction-purple/20 text-prediction-purple border-prediction-purple/30 text-xs">
                  {rel}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </Card>
  );

  return (
    <div className="min-h-screen bg-dark-midnight bubo-neural-bg p-8">
      {/* Header */}
      <div className="mb-8">
        <Button onClick={onBack} className="bubo-btn-ghost mb-6">
          Back to Knowledge Base
        </Button>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-iq-neon-green/20 to-electric-blue/20 flex items-center justify-center">
            <Database className="w-6 h-6 text-iq-neon-green" />
          </div>
          <div>
            <h1 className="font-space-grotesk text-3xl text-pure-white mb-2">
              Knowledge Base Schema
            </h1>
            <p className="text-mist-gray">
              Database structure for storing and organizing IT solutions
            </p>
          </div>
        </div>
      </div>

      {/* Privacy Notice */}
      <Card className="bubo-glass p-6 mb-8 border-iq-neon-green/30">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 rounded-xl bg-iq-neon-green/20 flex items-center justify-center">
            <Shield className="w-6 h-6 text-iq-neon-green" />
          </div>
          <div>
            <h2 className="font-space-grotesk text-xl font-bold text-pure-white mb-2">
              Data Privacy & Isolation
            </h2>
            <p className="text-mist-gray mb-4">
              Each organization's data is completely isolated and private. Row-level security policies ensure data never crosses organizational boundaries.
            </p>
            <div className="flex items-center space-x-2">
              <Lock className="w-4 h-4 text-amber-warning" />
              <span className="text-sm text-amber-warning">Fields marked with lock icon contain sensitive or private data</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Schema Tables */}
      <div className="space-y-6">
        <h2 className="font-space-grotesk text-2xl font-bold text-pure-white mb-6">
          Database Tables
        </h2>

        <div className="grid gap-6">
          {schemaTables.map(getTableCard)}
        </div>
      </div>

      {/* Key Relationships */}
      <Card className="bubo-glass p-8 mt-12 border-prediction-purple/30">
        <h2 className="font-space-grotesk text-2xl font-bold text-pure-white mb-6">
          How It All Connects
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-pure-white mb-4">Data Flow</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-electric-blue rounded-full" />
                <span className="text-cloud-white">Issues create <strong>problem signatures</strong></span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-prediction-purple rounded-full" />
                <span className="text-cloud-white">Evidence is collected and linked to signatures</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-iq-neon-green rounded-full" />
                <span className="text-cloud-white">AI generates <strong>articles</strong> from evidence</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-signal-yellow rounded-full" />
                <span className="text-cloud-white">Users provide <strong>feedback</strong> on articles</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-cyan-accent rounded-full" />
                <span className="text-cloud-white">System learns and improves accuracy</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-pure-white mb-4">Security Model</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <Shield className="w-4 h-4 text-iq-neon-green" />
                <span className="text-cloud-white">All data isolated by <strong>org_id</strong></span>
              </div>
              <div className="flex items-center space-x-3">
                <Lock className="w-4 h-4 text-amber-warning" />
                <span className="text-cloud-white">Sensitive fields are encrypted at rest</span>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="w-4 h-4 text-cyan-accent" />
                <span className="text-cloud-white">Role-based access controls data visibility</span>
              </div>
              <div className="flex items-center space-x-3">
                <BarChart3 className="w-4 h-4 text-prediction-purple" />
                <span className="text-cloud-white">Analytics are aggregated and anonymized</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Implementation Notes */}
      <Card className="bubo-glass p-6 mt-8 border-slate-gray/30">
        <h3 className="font-space-grotesk text-lg font-bold text-pure-white mb-4">
          Implementation Details
        </h3>
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="font-medium text-electric-blue mb-2">PostgreSQL Features Used:</h4>
            <ul className="space-y-1 text-mist-gray">
              <li>• JSONB for flexible step storage</li>
              <li>• Row Level Security (RLS) for data isolation</li>
              <li>• UUID primary keys for distributed systems</li>
              <li>• Partial indexes for performance</li>
              <li>• Full-text search capabilities</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-iq-neon-green mb-2">Supabase Integration:</h4>
            <ul className="space-y-1 text-mist-gray">
              <li>• Real-time subscriptions for live updates</li>
              <li>• Auth policies tied to RLS</li>
              <li>• Edge functions for AI processing</li>
              <li>• Storage for evidence attachments</li>
              <li>• Built-in analytics and monitoring</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};