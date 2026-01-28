const CookieConsent = (() => {
    let banner;

    function init() {
        banner = document.getElementById('cookie-banner');
        if (!banner) return;

        const cookieConsent = localStorage.getItem('cookieConsent');

        if (!cookieConsent) {
            banner.style.display = 'flex';
            setTimeout(() => banner.classList.add('visible'), 50);
            
            // Attach event listeners
            const acceptBtn = banner.querySelector('.btn-accept');
            const declineBtn = banner.querySelector('.btn-decline');
            
            if (acceptBtn) acceptBtn.addEventListener('click', acceptCookies);
            if (declineBtn) declineBtn.addEventListener('click', declineCookies);
            
        } else if (cookieConsent === 'accepted') {
            enableTracking();
        }
    }

    function hideBanner() {
        banner.classList.remove('visible');
        setTimeout(() => {
            banner.style.display = 'none';
        }, 300);
    }

    function acceptCookies() {
        localStorage.setItem('cookieConsent', 'accepted');
        hideBanner();
        enableTracking();
    }

    function declineCookies() {
        localStorage.setItem('cookieConsent', 'declined');
        hideBanner();
    }

    function enableTracking() {
        console.log("Tracking enabled");
    }

    return {
        init
    };
})();
