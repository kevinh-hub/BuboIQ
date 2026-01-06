import React, { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { ReasoningTraceCard } from '../../analyst/production/ReasoningTraceCard';
import { ActionItem } from '../../analyst/production/ActionItem';
import { KillSwitchBanner } from '../../analyst/production/KillSwitchBanner';
import { Button } from '../../ui/button';
import { toast } from 'sonner';

export function AnalystConsolePage({ user }: { user: any }) {
  const [orgId, setOrgId] = useState<string>('');
  const [traces, setTraces] = useState<any[]>([]);
  const [actions, setActions] = useState<any[]>([]);
  const [policy, setPolicy] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    import.meta.env.VITE_SUPABASE_URL!,
    import.meta.env.VITE_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    (async () => {
      // Get org_id from user metadata
      const jwtOrg = user?.user_metadata?.org_id;
      setOrgId(jwtOrg);

      // Fetch policy
      try {
        const pol = await fetch('/api/policy/get', {
          method: 'POST',
          body: JSON.stringify({ org_id: jwtOrg }),
        }).then((r) => r.json());
        setPolicy(pol);
      } catch (err) {
        console.error('Failed to fetch policy:', err);
      }

      setLoading(true);
      try {
        const { data: t } = await supabase
          .from('agent_traces')
          .select('*')
          .eq('org_id', jwtOrg)
          .order('created_at', { ascending: false })
          .limit(50);

        const { data: a } = await supabase
          .from('action_queue')
          .select('*')
          .eq('org_id', jwtOrg)
          .in('status', ['queued', 'approved'])
          .order('created_at', { ascending: false })
          .limit(50);

        setTraces(t || []);
        setActions(a || []);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        toast.error('Failed to load analyst data');
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  async function approve(id: string) {
    try {
      await fetch('/api/actions/approve', {
        method: 'POST',
        body: JSON.stringify({ action_id: id }),
      });
      setActions((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'approved' } : a)));
      toast.success('Action approved & dispatched.');
    } catch (err) {
      console.error('Failed to approve action:', err);
      toast.error('Failed to approve action');
    }
  }

  async function reject(id: string) {
    try {
      await fetch('/api/actions/reject', {
        method: 'POST',
        body: JSON.stringify({ action_id: id }),
      });
      setActions((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'rejected' } : a)));
      toast.info('Action rejected.');
    } catch (err) {
      console.error('Failed to reject action:', err);
      toast.error('Failed to reject action');
    }
  }

  async function rerun() {
    try {
      await fetch('/api/agent/run', {
        method: 'POST',
        body: JSON.stringify({ org_id: orgId }),
      });
      toast.success('Agent reasoning started. Check back in a moment.');
    } catch (err) {
      console.error('Failed to run agent:', err);
      toast.error('Failed to run agent');
    }
  }

  return (
    <div className="p-8 space-y-6">
      <KillSwitchBanner enabled={policy?.kill_switch === true} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-space-grotesk text-white mb-2">
            <span className="text-white">BUBO</span>
            <span className="text-[#00FF85]">IQ</span>
            <span className="text-text-400 ml-3">Analyst v1</span>
          </h1>
          <p className="text-text-400">AI-powered IT support intelligence platform</p>
        </div>
        <Button
          onClick={rerun}
          className="bg-bg-850 text-text-100 border border-[color:rgb(var(--border-analyst))] hover:bg-bg-900"
        >
          Re-run reasoning now
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <section className="space-y-4">
          <h2 className="text-xl font-space-grotesk text-white">Recent Reasoning Traces</h2>
          {loading && (
            <div className="panel p-6 text-text-400">
              <div className="animate-pulse">Loading...</div>
            </div>
          )}
          {!loading && traces.length === 0 && (
            <div className="panel p-6 text-text-400">No traces yet.</div>
          )}
          {traces.map((t) => (
            <ReasoningTraceCard
              key={t.id}
              createdAt={t.created_at}
              confidence={t.confidence}
              output={t.output}
              onLineage={() => toast.info('Lineage view coming soon')}
            />
          ))}
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-space-grotesk text-white">Pending Actions</h2>
          {loading && (
            <div className="panel p-6 text-text-400">
              <div className="animate-pulse">Loading...</div>
            </div>
          )}
          {!loading && actions.length === 0 && (
            <div className="panel p-6 text-text-400">No pending actions.</div>
          )}
          {actions.map((a) => (
            <ActionItem
              key={a.id}
              actionType={a.action_type}
              payload={a.payload}
              hints={
                policy?.kill_switch
                  ? ['Observe-Only is enabled. Executable actions are paused.']
                  : []
              }
              onApprove={() => approve(a.id)}
              onReject={() => reject(a.id)}
              disabled={policy?.kill_switch}
            />
          ))}
        </section>
      </div>
    </div>
  );
}
