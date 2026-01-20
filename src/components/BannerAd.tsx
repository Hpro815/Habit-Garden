import { useEffect, useRef } from 'react';

// Google AdSense Configuration
const ADSENSE_CONFIG = {
  client: 'ca-pub-1661766797463818',
  slot: '8087878505',
};

// Declare adsbygoogle for TypeScript
declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export function BannerAd() {
  const adRef = useRef<HTMLModElement>(null);
  const isAdLoaded = useRef(false);

  useEffect(() => {
    // Only load ad once
    if (isAdLoaded.current) return;

    try {
      // Push ad to adsbygoogle array
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        window.adsbygoogle.push({});
        isAdLoaded.current = true;
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg">
      <div className="w-full flex justify-center">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={ADSENSE_CONFIG.client}
          data-ad-slot={ADSENSE_CONFIG.slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}
