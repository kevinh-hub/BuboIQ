import { useState, useEffect } from 'react';
import { createClient } from '../utils/supabase/client';

export function useFeatureFlag(flagKey: string): boolean {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkFlag = async () => {
      try {
        const supabase = createClient();
        
        // Check if feature_flags table exists and query it
        const { data, error } = await supabase
          .from('feature_flags')
          .select('enabled, rollout_percent')
          .eq('key', flagKey)
          .single();

        if (error) {
          console.warn(`Feature flag ${flagKey} not found, defaulting to false`);
          setEnabled(false);
        } else {
          // If rollout_percent is set, randomly determine if enabled
          if (data.rollout_percent !== null && data.rollout_percent < 100) {
            const randomValue = Math.random() * 100;
            setEnabled(data.enabled && randomValue < data.rollout_percent);
          } else {
            setEnabled(data.enabled);
          }
        }
      } catch (err) {
        console.error('Error checking feature flag:', err);
        setEnabled(false);
      } finally {
        setLoading(false);
      }
    };

    checkFlag();
  }, [flagKey]);

  return enabled;
}
