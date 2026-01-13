document.addEventListener('DOMContentLoaded', () => {
    // Initialize Promo Banner
    createPromoBanner();
});

/* --- Banner Logic --- */
function createPromoBanner() {
    const banner = document.createElement('div');
    banner.id = 'promo-banner';
    
    banner.innerHTML = `
        <p>🔥 Ofertas imperdíveis vc só encontra aqui! Aproveite os melhores preços do mercado. 🔥</p>
    `;

    // Insert INSIDE the hero section, at the top (prepend)
    // This allows it to overlay the background image if .hero has relative positioning
    const hero = document.querySelector('.hero');
    if (hero) {
        // Ensure hero has position relative so absolute child works relative to it
        if (getComputedStyle(hero).position === 'static') {
            hero.style.position = 'relative';
        }
        hero.prepend(banner);
    } else {
        document.body.insertBefore(banner, document.body.firstChild);
    }
}
