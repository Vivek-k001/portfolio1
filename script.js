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





//img slider js code
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

    // 1. MOUSE DOWN
    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        lastX = e.clientX;
        velocity = 0; // Stop auto-spin immediately on grab
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
    });

    // 4. ANIMATION LOOP
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

    // 5. WHEEL SUPPORT
    container.addEventListener('wheel', (e) => {
        e.preventDefault();
        const scrollForce = e.deltaY * 0.05; 
        velocity += scrollForce;
    }, { passive: false });
});