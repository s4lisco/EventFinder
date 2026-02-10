// frontend/src/utils/cookies.ts

/**
 * Set a cookie in the browser
 * @param name - Cookie name
 * @param value - Cookie value
 * @param days - Number of days until expiration
 */
export function setCookie(name: string, value: string, days: number = 365): void {
  if (typeof window === 'undefined') return;
  
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
}

/**
 * Get a cookie value from the browser
 * @param name - Cookie name
 * @returns Cookie value or null if not found
 */
export function getCookie(name: string): string | null {
  if (typeof window === 'undefined') return null;
  
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(';');
  
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1, cookie.length);
    }
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length, cookie.length);
    }
  }
  
  return null;
}

/**
 * Delete a cookie from the browser
 * @param name - Cookie name
 */
export function deleteCookie(name: string): void {
  if (typeof window === 'undefined') return;
  
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

/**
 * Check if user has accepted cookies
 * @returns true if cookies are accepted, false otherwise
 */
export function hasCookieConsent(): boolean {
  const consent = getCookie('cookie_consent');
  return consent === 'accepted';
}

/**
 * Check if user has declined cookies
 * @returns true if cookies are declined, false otherwise
 */
export function hasCookieDeclined(): boolean {
  const consent = getCookie('cookie_consent');
  return consent === 'declined';
}

/**
 * Accept cookies
 */
export function acceptCookies(): void {
  setCookie('cookie_consent', 'accepted', 365);
}

/**
 * Decline cookies
 */
export function declineCookies(): void {
  setCookie('cookie_consent', 'declined', 30); // Shorter expiry for declined
}
