import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from '../utils/supabase/client';
import { projectId } from '../utils/supabase/info';

const AuthContext = createContext(null);

// Helper to check for super admin email
function isSuperAdminEmail(email) {
  if (!email) return false;
  return email.toLowerCase() === "kevinh@buboiq.com";
}

// Helper to map DB role to App UI role
function toAppRole(dbRole) {
  // Treat super_admin exactly like owner in the UI
  if (dbRole === "super_admin") return "owner";
  
  // Standard mapping
  if (dbRole === "owner") return "owner";
  if (dbRole === "agent") return "agent";
  if (dbRole === "viewer") return "viewer";
  
  // Default fallback
  return "owner";
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [systemConfig, setSystemConfig] = useState(null);

  // FETCH SYSTEM CONFIG
  const fetchSystemConfig = async (token) => {
    try {
      // Default to production env unless we are in a dev/demo flow that sets a cookie or local storage
      // For now, we fetch 'production' config as the baseline
      const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-55e8c5b2/system-config?env=production`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setSystemConfig(data.config);
      }
    } catch (e) {
      console.error('[AuthContext] Failed to fetch system config:', e);
    }
  };

  // DERIVE USER WITH ROLE
  const deriveUserWithRole = (sessionUser) => {
    if (!sessionUser) return null;

    const email = sessionUser.email;
    const rawRole = sessionUser.role;
    const metadata = sessionUser.user_metadata || {};
    const appMetadata = sessionUser.app_metadata || {};

    // Priority: 1. Hardcoded Super Admin, 2. Profile/Metadata Role, 3. Fallback to 'owner' if 'authenticated'
    let dbRole = 'owner'; // Default fallback for any authenticated user
    
    if (isSuperAdminEmail(email)) {
      dbRole = 'super_admin';
    } else if (metadata.role) {
      dbRole = metadata.role;
    } else if (appMetadata.role) {
      dbRole = appMetadata.role;
    } else if (rawRole && rawRole !== 'authenticated') {
      dbRole = rawRole;
    }

    // Map to App Role for UI
    const appRole = toAppRole(dbRole);

    // Derive Tier
    const tier = metadata.tier || appMetadata.tier || 'starter';
    const name = metadata.name || metadata.full_name || email.split('@')[0];

    return {
      ...sessionUser,
      id: sessionUser.id,
      email: email,
      role: appRole, // UI Role (owner, agent, viewer)
      db_role: dbRole, // Original DB Role (includes super_admin)
      tier: tier,
      name: name,
      org_id: metadata.org_id || appMetadata.org_id || 'default'
    };
  };

  // LOGIN
  const login = async (email, password) => {
    console.log('[AuthContext] Attempting login for:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('[AuthContext] Login failed:', error.message);
      throw error;
    }

    if (!data.user) {
      throw new Error("Login succeeded but no user returned");
    }

    const derivedUser = deriveUserWithRole(data.user);
    console.log('[AuthContext] Login successful, user derived:', derivedUser);
    setUser(derivedUser);
    
    // Fetch config immediately on login
    if (data.session?.access_token) {
      fetchSystemConfig(data.session.access_token);
    }
    
    return derivedUser;
  };

  // LOGOUT
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem("buboiq_session"); // Cleanup just in case
  };

  // Helper functions for role and tier access
  const hasRole = (requiredRole) => {
    if (!user) return false;
    
    // Super admin has access to everything in backend logic, but strict UI checks might use this
    if (user.db_role === 'super_admin') return true;
    
    if (requiredRole === 'admin') return user.role === 'admin' || user.role === 'owner';
    return user.role === requiredRole;
  };

  const checkTierAccess = (requiredTier) => {
    if (!user) return false;
    
    // 1. Check Global Overrides
    if (systemConfig?.overrides) {
      if (systemConfig.overrides.disableTierGuard) return true;
      if (systemConfig.overrides.unlockTiers) return true;
    }

    // Super admin bypasses tier checks
    if (user.db_role === 'super_admin') return true;
    if (user.tier === 'trial') return true;

    const tiers = ['starter', 'pro', 'team', 'enterprise'];
    const userTier = user.tier || 'starter';
    
    const userLevel = tiers.indexOf(userTier);
    const requiredLevel = tiers.indexOf(requiredTier);
    
    if (requiredLevel === -1) return true; // Unknown requirement? Allow.
    if (userLevel === -1) return false; // Unknown user tier? Deny if requirement is strict.
    
    return userLevel >= requiredLevel;
  };

  const checkFeatureAccess = (featureKey) => {
    if (!systemConfig?.featureMatrix) return true; // Default to open if no config loaded yet? Or closed? Let's be permissive if offline.
    
    // 1. Check Global Overrides
    if (systemConfig.overrides?.unlockFeatures) return true;
    if (user?.db_role === 'super_admin') return true;

    const feature = systemConfig.featureMatrix[featureKey];
    if (!feature) return true; // Feature not tracked in matrix

    // 2. Check Global Kill Switch
    if (feature.global === false) return false;

    // 3. Check Tier Availability
    const userTier = user?.tier || 'starter';
    
    if (userTier === 'starter') return feature.starter;
    if (userTier === 'pro') return feature.pro;
    if (userTier === 'team' || userTier === 'enterprise') return feature.team;
    
    return false;
  };

  // RESTORE SESSION
  useEffect(() => {
    const initSession = async () => {
      const alreadyInit = sessionStorage.getItem('buboiq_auth_init');
      if (!alreadyInit) setLoading(true);
      try {
        // 1. Get current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log('[AuthContext] Session restored for:', session.user.email);
          const derived = deriveUserWithRole(session.user);
          setUser(derived);
          if (session.access_token) {
             fetchSystemConfig(session.access_token);
          }
        } else if (error) {
          console.warn('[AuthContext] Session restore error:', error);
        }
      } catch (err) {
        console.error('[AuthContext] Unexpected error restoring session:', err);
      } finally {
        setLoading(false);
        sessionStorage.setItem('buboiq_auth_init', '1');
      }
    };

    initSession();

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[AuthContext] Auth state change:', event);
      if (session?.user) {
        setUser(deriveUserWithRole(session.user));
        if (session.access_token) {
          fetchSystemConfig(session.access_token);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      systemConfig,
      login, 
      logout, 
      signIn: login, 
      signOut: logout,
      hasRole,
      checkTierAccess,
      checkFeatureAccess
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
