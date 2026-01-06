export const isBillingEnabled = () => {
  return true; // Default to true for now
};

export const isFeatureEnabled = (featureName: string) => {
  // Simple feature flag implementation
  const features: Record<string, boolean> = {
    'billing': true,
    'discovery': true,
    'scripts': false,
    'remote-access': true
  };
  return features[featureName] ?? false;
};
