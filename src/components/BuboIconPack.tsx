import React from 'react';

// BuboIQ Custom Icon Pack - Minimal line icons optimized for dark UI

interface IconProps {
  size?: number;
  className?: string;
  color?: string;
}

// Owl Eye Icon - Primary Brand Mark (Enhanced Geometric Version)
export const OwlEye: React.FC<IconProps> = ({ 
  size = 24, 
  className = "", 
  color = "currentColor" 
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Outer geometric frame */}
    <path d="M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z" />
    {/* Inner iris circles */}
    <circle cx="9" cy="10" r="2.5" opacity="0.7" />
    <circle cx="15" cy="10" r="2.5" opacity="0.7" />
    {/* Pupils with glow effect */}
    <circle cx="9" cy="10" r="1" fill={color} />
    <circle cx="15" cy="10" r="1" fill={color} />
    {/* Angular brow lines */}
    <path d="M6 7L9 9M15 9L18 7" strokeWidth="2" />
    {/* Neural connection indicator */}
    <path d="M12 14L12 16" strokeWidth="2" opacity="0.8" />
    <circle cx="12" cy="17" r="1" fill={color} opacity="0.6" />
  </svg>
);

// Brand Logo Variant - Simplified for small sizes
export const OwlEyeSimple: React.FC<IconProps> = ({ 
  size = 16, 
  className = "", 
  color = "currentColor" 
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    className={className}
  >
    <circle cx="8" cy="8" r="7" stroke={color} strokeWidth="1" />
    <circle cx="6" cy="6" r="1.5" stroke={color} strokeWidth="1" />
    <circle cx="10" cy="6" r="1.5" stroke={color} strokeWidth="1" />
    <circle cx="6" cy="6" r="0.5" fill={color} />
    <circle cx="10" cy="6" r="0.5" fill={color} />
    <path d="M8 10V11" stroke={color} strokeWidth="1" />
  </svg>
);

// Neural Network Icon
export const NeuralNetwork: React.FC<IconProps> = ({ 
  size = 24, 
  className = "", 
  color = "currentColor" 
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="4" cy="6" r="2" />
    <circle cx="20" cy="6" r="2" />
    <circle cx="4" cy="18" r="2" />
    <circle cx="20" cy="18" r="2" />
    <circle cx="12" cy="12" r="3" />
    <path d="M6 6l4 4m2 2l4-4m-10 8l4-4m2-2l4 4" opacity="0.6" />
  </svg>
);

// Signal Wave Icon
export const SignalWave: React.FC<IconProps> = ({ 
  size = 24, 
  className = "", 
  color = "currentColor" 
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 12h3l3-6 3 12 3-6 3 3h3" />
    <circle cx="12" cy="12" r="1" fill={color} />
  </svg>
);

// Prediction Arrow Icon
export const PredictionArrow: React.FC<IconProps> = ({ 
  size = 24, 
  className = "", 
  color = "currentColor" 
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 12h12" />
    <path d="M12 6l6 6-6 6" />
    <path d="M8 8l-2-2 2-2" opacity="0.5" />
    <circle cx="4" cy="4" r="1" fill={color} />
    <circle cx="4" cy="20" r="1" fill={color} />
  </svg>
);

// Circuit Board Icon
export const CircuitBoard: React.FC<IconProps> = ({ 
  size = 24, 
  className = "", 
  color = "currentColor" 
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="7" cy="7" r="1" fill={color} />
    <circle cx="17" cy="7" r="1" fill={color} />
    <circle cx="7" cy="17" r="1" fill={color} />
    <circle cx="17" cy="17" r="1" fill={color} />
    <path d="M7 8v8m10-8v8M8 7h8m-8 10h8" opacity="0.6" />
  </svg>
);

// Quantum Computing Icon
export const QuantumComputing: React.FC<IconProps> = ({ 
  size = 24, 
  className = "", 
  color = "currentColor" 
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="4" opacity="0.6" />
    <circle cx="12" cy="12" r="1" fill={color} />
    <path d="M12 4v2m0 12v2m8-8h-2m-12 0h2" />
    <path d="M16.24 7.76l-1.41 1.41m-5.66 5.66l-1.41 1.41m0-11.32l1.41 1.41m5.66 5.66l1.41 1.41" opacity="0.4" />
  </svg>
);

// AI Assist Icon
export const AIAssist: React.FC<IconProps> = ({ 
  size = 24, 
  className = "", 
  color = "currentColor" 
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125 0-.75.64-1.312 1.688-1.312h1.875c3.063 0 5.626-2.562 5.626-5.625C22 6.5 17.5 2 12 2z" />
    <circle cx="6" cy="10" r="1" fill={color} />
    <circle cx="9" cy="7" r="1" fill={color} />
    <circle cx="15" cy="7" r="1" fill={color} />
    <circle cx="18" cy="10" r="1" fill={color} />
  </svg>
);

// Data Flow Icon
export const DataFlow: React.FC<IconProps> = ({ 
  size = 24, 
  className = "", 
  color = "currentColor" 
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="5" cy="12" r="3" />
    <circle cx="19" cy="12" r="3" />
    <path d="M8 12h8" />
    <path d="M12 8l4 4-4 4" />
    <circle cx="12" cy="8" r="1" fill={color} opacity="0.6" />
    <circle cx="12" cy="16" r="1" fill={color} opacity="0.6" />
  </svg>
);

// Security Shield Plus Icon
export const SecurityShieldPlus: React.FC<IconProps> = ({ 
  size = 24, 
  className = "", 
  color = "currentColor" 
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V6l-8-3-8 3v6c0 6 8 10 8 10z" />
    <path d="M9 12h6m-3-3v6" />
  </svg>
);

// Incident Alert Icon
export const IncidentAlert: React.FC<IconProps> = ({ 
  size = 24, 
  className = "", 
  color = "currentColor" 
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <path d="M12 9v4m0 4h.01" />
    <circle cx="12" cy="17" r="1" fill={color} />
  </svg>
);

// Observatory Icon
export const Observatory: React.FC<IconProps> = ({ 
  size = 24, 
  className = "", 
  color = "currentColor" 
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" opacity="0.6" />
    <circle cx="12" cy="12" r="2" />
    <path d="M12 2v4m0 12v4m10-10h-4m-12 0h4" />
    <path d="M17.66 6.34l-2.83 2.83m-5.66 5.66l-2.83 2.83m0-11.32l2.83 2.83m5.66 5.66l2.83 2.83" opacity="0.4" />
  </svg>
);

// Intelligence Graph Icon
export const IntelligenceGraph: React.FC<IconProps> = ({ 
  size = 24, 
  className = "", 
  color = "currentColor" 
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="5" r="3" />
    <circle cx="5" cy="15" r="3" />
    <circle cx="19" cy="15" r="3" />
    <path d="M9.3 8.3l-3.4 4.4M14.7 8.3l3.4 4.4M5 18l14 0" opacity="0.6" />
    <circle cx="12" cy="12" r="1" fill={color} />
  </svg>
);

// Design System Icon - Color Palette
export const ColorPalette: React.FC<IconProps> = ({ 
  size = 24, 
  className = "", 
  color = "currentColor" 
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="8" cy="8" r="2" fill="#00FF85" />
    <circle cx="16" cy="8" r="2" fill="#00FFC6" />
    <circle cx="8" cy="16" r="2" fill="#FFD400" />
    <circle cx="16" cy="16" r="2" fill="#0E1726" stroke="#00FF85" />
    <circle cx="12" cy="12" r="1" fill={color} />
  </svg>
);

// Typography Icon
export const Typography: React.FC<IconProps> = ({ 
  size = 24, 
  className = "", 
  color = "currentColor" 
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 7V4h16v3M9 20h6M12 4v16" />
    <circle cx="12" cy="8" r="1" fill={color} opacity="0.6" />
  </svg>
);

// Component Library Icon
export const ComponentLibrary: React.FC<IconProps> = ({ 
  size = 24, 
  className = "", 
  color = "currentColor" 
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
    <circle cx="6.5" cy="6.5" r="1" fill={color} opacity="0.6" />
    <circle cx="17.5" cy="6.5" r="1" fill={color} opacity="0.6" />
    <circle cx="6.5" cy="17.5" r="1" fill={color} opacity="0.6" />
    <circle cx="17.5" cy="17.5" r="1" fill={color} opacity="0.6" />
  </svg>
);

// Export all icons as a collection
export const BuboIcons = {
  OwlEye,
  OwlEyeSimple,
  NeuralNetwork,
  SignalWave,
  PredictionArrow,
  CircuitBoard,
  QuantumComputing,
  AIAssist,
  DataFlow,
  SecurityShieldPlus,
  IncidentAlert,
  Observatory,
  IntelligenceGraph,
  ColorPalette,
  Typography,
  ComponentLibrary
};

export default BuboIcons;