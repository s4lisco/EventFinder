// frontend/src/components/CookieBanner.tsx
import { useEffect, useState } from 'react';
import { hasCookieConsent, hasCookieDeclined, acceptCookies, declineCookies } from '@/utils/cookies';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const hasConsent = hasCookieConsent();
    const hasDeclined = hasCookieDeclined();
    
    if (!hasConsent && !hasDeclined) {
      // Show banner after a small delay for better UX
      setTimeout(() => {
        setIsVisible(true);
        setTimeout(() => setIsAnimating(true), 50);
      }, 1000);
    }
  }, []);

  const handleAccept = () => {
    acceptCookies();
    setIsAnimating(false);
    setTimeout(() => setIsVisible(false), 300);
  };

  const handleDecline = () => {
    declineCookies();
    setIsAnimating(false);
    setTimeout(() => setIsVisible(false), 300);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 transform transition-all duration-200 ${
        isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
    >
      <div className="border-t border-border bg-white/95 px-4 py-4 shadow-soft-xl backdrop-blur-xl sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Content */}
            <div className="flex flex-1 items-start gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-button bg-gradient-primary shadow-soft">
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="flex-1 pt-0.5">
                <h3 className="text-sm font-bold text-text sm:text-base">
                  We value your privacy
                </h3>
                <p className="mt-1 text-xs text-text-muted sm:text-sm">
                  We use cookies to enhance your browsing experience, provide personalized 
                  content, and analyze our traffic. By clicking "Accept All", you consent 
                  to our use of cookies.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-shrink-0">
              <button
                onClick={handleDecline}
                className="btn-secondary whitespace-nowrap text-xs sm:text-sm"
              >
                Decline
              </button>
              <button
                onClick={handleAccept}
                className="btn-primary whitespace-nowrap text-xs sm:text-sm"
              >
                Accept All
              </button>
            </div>
          </div>

          {/* Privacy policy link (optional) */}
          <div className="mt-3 sm:ml-[52px]">
            <a
              href="#"
              className="inline-flex items-center gap-1 text-xs font-medium text-primary transition-opacity duration-150 hover:opacity-80"
              onClick={(e) => {
                e.preventDefault();
                // You can add a link to your privacy policy here
                alert('Privacy policy link would go here');
              }}
            >
              Learn more about our privacy policy
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
