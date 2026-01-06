import React from 'react';
import { motion } from 'motion/react';
import { OwlEye } from './BuboIconPack';

interface BuboOnboardingLoaderProps {
  message?: string;
  progress?: number;
  isVisible: boolean;
}

export const BuboOnboardingLoader: React.FC<BuboOnboardingLoaderProps> = ({
  message = "Calibrating AI Intelligence...",
  progress = 0,
  isVisible
}) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/95 backdrop-blur-lg flex items-center justify-center z-50"
    >
      <div className="text-center space-y-8 max-w-md mx-auto px-8">
        {/* Animated Owl Eye */}
        <motion.div
          className="relative mx-auto"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="w-20 h-20 bg-gradient-to-br from-iq-green/20 to-signal-blue/20 rounded-full flex items-center justify-center border-2 border-iq-green/30 shadow-lg relative overflow-hidden mx-auto">
            <OwlEye size={40} className="text-iq-green" />
            
            {/* Scanning effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-iq-green/30 to-transparent"
              animate={{ x: [-100, 100] }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "linear" 
              }}
            />
          </div>
          
          {/* Ripple effects */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 border-2 border-iq-green/20 rounded-full"
              animate={{
                scale: [1, 2.5],
                opacity: [0.5, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.7,
                ease: "easeOut"
              }}
            />
          ))}
        </motion.div>

        {/* Loading Message */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <h3 className="text-2xl font-bold text-cloud-white">
            {message}
          </h3>
          <p className="text-mist-gray text-sm">
            Initializing your personalized intelligence workspace
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "100%", opacity: 1 }}
          transition={{ delay: 1 }}
          className="w-full max-w-xs mx-auto"
        >
          <div className="h-2 bg-slate-gray/30 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-iq-green to-signal-blue rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between text-xs text-mist-gray mt-2">
            <span>0%</span>
            <span className="text-iq-green font-semibold">{progress}%</span>
            <span>100%</span>
          </div>
        </motion.div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-iq-green/40 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, -100],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default BuboOnboardingLoader;