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