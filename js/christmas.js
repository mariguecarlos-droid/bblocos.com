document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Snowfall (Removed as requested)
    // createSnowflakes();

    // 2. Initialize Banner
    createChristmasBanner();
});

/* --- Snowfall Logic --- */
function createSnowflakes() {
    const snowContainer = document.createElement('div');
    snowContainer.id = 'snow-container';
    document.body.appendChild(snowContainer);

    const numberOfSnowflakes = 50; // Adjust for density
    const snowflakes = ['❅', '❆', '❄']; // Different shapes

    for (let i = 0; i < numberOfSnowflakes; i++) {
        const flake = document.createElement('div');
        flake.classList.add('snowflake');
        flake.innerText = snowflakes[Math.floor(Math.random() * snowflakes.length)];
        
        // Randomize position and animation
        flake.style.left = Math.random() * 100 + 'vw';
        flake.style.animationDuration = Math.random() * 3 + 2 + 's'; // 2-5 seconds
        flake.style.opacity = Math.random();
        flake.style.fontSize = Math.random() * 10 + 10 + 'px';
        
        // Stagger start times
        flake.style.animationDelay = Math.random() * 5 + 's';

        snowContainer.appendChild(flake);
    }
}

/* --- Banner Logic --- */
function createChristmasBanner() {
    const banner = document.createElement('div');
    banner.id = 'christmas-banner';
    
    banner.innerHTML = `
        <p>🎄 Feliz Natal! Aproveite nossas ofertas especiais de final de ano! 🎅</p>
    `;

    // Insert after the hero section (main photo) if it exists, otherwise top of body
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.insertAdjacentElement('afterend', banner);
    } else {
        document.body.insertBefore(banner, document.body.firstChild);
    }

    // Close functionality (removed as button was removed)

}
