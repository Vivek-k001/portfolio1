const dots = document.querySelectorAll('.dot');
const sections = document.querySelectorAll('section');
const themeBtn = document.getElementById('themeToggle');
const body = document.body;

function scrollToSection(index) {
    const section = document.getElementById(`section-${index}`);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
        updateActiveDot(index);
    }
}

function updateActiveDot(index) {
    dots.forEach(dot => dot.classList.remove('active'));
    dots[index].classList.add('active');
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const index = parseInt(entry.target.id.split('-')[1]);
            updateActiveDot(index);
        }
    });
}, { root: null, rootMargin: '-40% 0px -40% 0px', threshold: 0 });

sections.forEach(section => observer.observe(section));

const currentTheme = localStorage.getItem('theme');
if (currentTheme) body.setAttribute('data-theme', currentTheme);

themeBtn.addEventListener('click', () => {
    const newTheme = body.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});


// ==========================================
// 3D IMAGE SLIDER LOGIC (Now with Touch!)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.slider-container');
    const slider = document.querySelector('.slider');

    // State variables
    let isDragging = false;
    let startX = 0;
    let lastX = 0;
    let currentRotation = 0;

    // Physics variables
    let velocity = 0;        
    const autoSpeed = 0.9;   // Slower auto-spin looks classier
    const dragSpeed = 0.1;   // Sensitivity
    const friction = 0.05;   // Smoothness of the return to auto-spin

    // --- MOUSE EVENTS (Laptop/Desktop) ---
    
    // 1. MOUSE DOWN
    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        lastX = e.clientX;
        velocity = 0; // Stop auto-spin immediately on grab
        container.style.cursor = 'grabbing'; // Visual cue
    });

    // 2. MOUSE MOVE
    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const x = e.clientX;
        const diff = x - lastX; 
        velocity = diff * dragSpeed;
        currentRotation += velocity;
        slider.style.transform = `rotateY(${currentRotation}deg)`;
        lastX = x;
    });

    // 3. MOUSE UP
    window.addEventListener('mouseup', () => {
        isDragging = false;
        container.style.cursor = 'grab'; // Reset cursor
    });

    // --- TOUCH EVENTS (Mobile/Tablet) ---

    // 1. TOUCH START
    container.addEventListener('touchstart', (e) => {
        isDragging = true;
        // e.touches[0] gets the first finger on screen
        startX = e.touches[0].clientX;
        lastX = e.touches[0].clientX;
        velocity = 0;
    }, { passive: true });

    // 2. TOUCH MOVE
    window.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        
        const x = e.touches[0].clientX;
        const diff = x - lastX;
        
        // Update physics
        velocity = diff * dragSpeed;
        currentRotation += velocity;
        slider.style.transform = `rotateY(${currentRotation}deg)`;
        lastX = x;
    }, { passive: true });

    // 3. TOUCH END
    window.addEventListener('touchend', () => {
        isDragging = false;
    });

    // --- ANIMATION LOOP ---
    function animate() {
        requestAnimationFrame(animate);

        if (!isDragging) {
            // Smoothly interpolate velocity back to autoSpeed
            velocity += (autoSpeed - velocity) * friction;
            currentRotation += velocity;
            slider.style.transform = `rotateY(${currentRotation}deg)`;
        }
    }

    // Start the loop
    animate();

    // --- WHEEL SUPPORT ---
    container.addEventListener('wheel', (e) => {
        e.preventDefault();
        const scrollForce = e.deltaY * 0.05; 
        velocity += scrollForce;
    }, { passive: false });
});






/* --- INFINITE CAROUSEL GENERATOR --- */

// 1. Array of your image filenames
const logoFiles = [
    "ai logo.png", "c logo.png", "css logo.png", "docker-logo.png",
    "flutter logo.png", "html logo.png", "java logo.png", "javascript logo.png",
    "ml logo.png", "n8n-logo.png", "php logo.png", "python logo.png",
    "react logo.png", "sql logo.png", "svelte-logo.png", "typescript-logo.png"
];

const folderPath = "logo/"; // Ensure this matches your folder name
const rowsCount = 3;        // Number of rows

function createCarousel() {
    const carouselContainer = document.getElementById('carouselContainer');
    
    // Safety check: if container doesn't exist, stop (prevents errors on other pages)
    if (!carouselContainer) return;

    // Sanitize filenames (handle spaces)
    const safeLogos = logoFiles.map(name => encodeURIComponent(name).replace(/%20/g, " "));

    for (let i = 0; i < rowsCount; i++) {
        const row = document.createElement('div');
        row.className = 'carousel-row';
        
        const track = document.createElement('div');
        track.className = 'carousel-track';

        // Duplicate the list to create the infinite loop effect
        // (Original + Duplicate = seamless scrolling)
        let infiniteList = [...safeLogos, ...safeLogos];

        // Optional: Shift the starting point of rows 2 and 3 so they don't look identical
        if (i === 1) infiniteList = infiniteList.slice(5).concat(infiniteList.slice(0, 5));
        if (i === 2) infiniteList = infiniteList.slice(10).concat(infiniteList.slice(0, 10));

        // Create Image Elements
        infiniteList.forEach(fileName => {
            const img = document.createElement('img');
            img.src = `${folderPath}${fileName}`;
            img.alt = decodeURIComponent(fileName); 
            track.appendChild(img);
        });

        row.appendChild(track);
        carouselContainer.appendChild(row);
    }
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', createCarousel);



/* --- ZIGZAG ANIMATION OBSERVER --- */
const zigzagObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.2 
});

const zigzagItems = document.querySelectorAll('.zigzag-item');
zigzagItems.forEach(item => {
    zigzagObserver.observe(item);
});




/* --- SMOOTH FLUID SCROLL FUNCTION --- */
function scrollToSection(sectionIndex) {
    const targetSection = document.getElementById('section-' + sectionIndex);
    
    if (!targetSection) return;

    // 1. SETTINGS
    const duration = 2000; // Time in milliseconds (2 seconds) - Increase for slower scroll
    const startPosition = window.pageYOffset;
    const targetPosition = targetSection.getBoundingClientRect().top + startPosition;
    const distance = targetPosition - startPosition;
    let startTime = null;

    // 2. THE EASING FUNCTION (easeInOutCubic)
    // This math makes it start slow, speed up, then slow down gently
    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t + b;
        t -= 2;
        return c / 2 * (t * t * t + 2) + b;
    }

    // 3. THE ANIMATION LOOP
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        
        // Calculate next position
        const run = ease(timeElapsed, startPosition, distance, duration);
        
        window.scrollTo(0, run);

        // Keep animating until time is up
        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }

    // Start the animation
    requestAnimationFrame(animation);
}