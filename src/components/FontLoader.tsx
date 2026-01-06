import React, { useEffect } from 'react';

const FontLoader: React.FC = () => {
  useEffect(() => {
    // Only add preconnect links for performance optimization
    // The actual font loading is handled by CSS @import to avoid security errors
    
    const existingPreconnect = document.querySelector('link[href="https://fonts.googleapis.com"]');
    
    if (!existingPreconnect) {
      // Preconnect to Google Fonts for better performance
      const preconnect1 = document.createElement('link');
      preconnect1.rel = 'preconnect';
      preconnect1.href = 'https://fonts.googleapis.com';
      document.head.appendChild(preconnect1);

      const preconnect2 = document.createElement('link');
      preconnect2.rel = 'preconnect';
      preconnect2.href = 'https://fonts.gstatic.com';
      preconnect2.crossOrigin = 'anonymous';
      document.head.appendChild(preconnect2);
    }

    // Font loading status check (optional - for debugging)
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(() => {
        const spaceGroteskLoaded = document.fonts.check('1em "Space Grotesk"');
        if (!spaceGroteskLoaded) {
          console.info('Space Grotesk font not loaded, using fallback fonts');
        }
      }).catch(() => {
        // Silently handle font loading check errors
      });
    }
  }, []);

  return null;
};

export default FontLoader;