// Initialize enhanced mobile support
document.addEventListener('DOMContentLoaded', () => {
    const projectsContainer = document.querySelector('.projects-container');
    if (projectsContainer) {
        // Add touch event listeners
        projectsContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
        projectsContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
        projectsContainer.addEventListener('touchend', handleTouchEnd, { passive: true });
        // Update layout on orientation change
        window.addEventListener('orientationchange', () => {
            setTimeout(updateProjectsLayout, 100);
        });
        // Better resize handling
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(updateProjectsLayout, 100);
        });
    }
    // Initial setup
    updateProjectsLayout();
});
// --- Neural Network Animated Background ---
function createNeuralNetwork() {
    const network = document.getElementById('neuralNetwork');
    const canvas = document.getElementById('neuralCanvas');
    if (!network || !canvas) return;
    // Get the hero section's bounding box for limiting lines
    const heroSection = document.getElementById('home');
    const rect = heroSection.getBoundingClientRect();
    // Set canvas size to match hero section
    canvas.width = rect.width;
    canvas.height = rect.height;
    canvas.style.position = 'absolute';
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = 0;
    network.style.position = 'absolute';
    network.style.top = 0;
    network.style.left = 0;
    network.style.width = '100%';
    network.style.height = '100%';
    network.style.zIndex = 0;
    network.style.pointerEvents = 'none';

    const ctx = canvas.getContext('2d');
    const nodes = [];
    const nodeCount = 50;
    // Clear previous nodes
    network.querySelectorAll('.neural-node').forEach(n => n.remove());
    // Create neural nodes
    for (let i = 0; i < nodeCount; i++) {
        const node = document.createElement('div');
        node.className = 'neural-node';
        // Random position within hero section
        node._x = Math.random() * rect.width;
        node._y = Math.random() * rect.height;
        node.style.left = node._x + 'px';
        node.style.top = node._y + 'px';
        // Random velocity
        node._vx = (Math.random() - 0.5) * 1.5;
        node._vy = (Math.random() - 0.5) * 1.5;
        network.appendChild(node);
        nodes.push(node);
    }
    // Animate nodes and draw lines
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Draw lines between close nodes
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const a = nodes[i];
                const b = nodes[j];
                const dx = a._x - b._x;
                const dy = a._y - b._y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.save();
                    ctx.globalAlpha = 0.15 * (1 - dist / 120);
                    ctx.strokeStyle = '#fff';
                    ctx.beginPath();
                    ctx.moveTo(a._x, a._y);
                    ctx.lineTo(b._x, b._y);
                    ctx.stroke();
                    ctx.restore();
                }
            }
        }
        // Move nodes
        for (let node of nodes) {
            node._x += node._vx;
            node._y += node._vy;
            // Bounce off hero section edges
            if (node._x < 0 || node._x > rect.width) node._vx = -node._vx;
            if (node._y < 0 || node._y > rect.height) node._vy = -node._vy;
            node._x = Math.max(0, Math.min(rect.width, node._x));
            node._y = Math.max(0, Math.min(rect.height, node._y));
            node.style.left = node._x + 'px';
            node.style.top = node._y + 'px';
        }
        requestAnimationFrame(animate);
    }
    animate();
}

window.addEventListener('DOMContentLoaded', () => {
    createNeuralNetwork();
    window.addEventListener('resize', createNeuralNetwork);
});
// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Fade in animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Mobile menu toggle

// Project buttons
document.querySelectorAll('button').forEach(btn => {
    if (btn.textContent.includes('View Project')) {
        btn.addEventListener('click', () => {
            alert('This would open the project details. This is a demo portfolio showcasing the design and functionality.');
        });
    }
});
// Updated Projects Carousel Functionality - Replace the existing carousel JS

let currentSlide = 0;
const projectsTrack = document.getElementById('projectsTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

function getVisibleProjects() {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
}

function getMaxSlide() {
    const totalProjects = document.querySelectorAll('.project-card').length;
    const visibleProjects = getVisibleProjects();
    return Math.max(0, totalProjects - visibleProjects);
}

function updateCardEffects() {
    const cards = document.querySelectorAll('.project-card');
    const visibleProjects = getVisibleProjects();
    
    cards.forEach((card, index) => {
        // Reset all effects
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
        
        // Apply effects based on position relative to current slide
        const cardPosition = index - currentSlide;
        
        // Cards partially visible on the sides
        if (cardPosition === -1 || cardPosition === visibleProjects) {
            card.style.opacity = '0.6';
            card.style.transform = 'scale(0.9)';
        }
        // Cards completely outside visible area
        else if (cardPosition < -1 || cardPosition > visibleProjects) {
            card.style.opacity = '0.3';
            card.style.transform = 'scale(0.85)';
        }
    });
}

function updateSlidePosition() {
    const visibleProjects = getVisibleProjects();
    const slideWidth = 100 / visibleProjects;
    const translateX = -(currentSlide * slideWidth);
    projectsTrack.style.transform = `translateX(${translateX}%)`;
    
    // Update button states
    prevBtn.disabled = currentSlide === 0;
    nextBtn.disabled = currentSlide >= getMaxSlide();
    
    // Update card effects
    updateCardEffects();
}

function slideProjects(direction) {
    const maxSlide = getMaxSlide();
    
    if (direction === 'next' && currentSlide < maxSlide) {
        currentSlide++;
    } else if (direction === 'prev' && currentSlide > 0) {
        currentSlide--;
    }
    
    updateSlidePosition();
}

// Handle window resize
window.addEventListener('resize', () => {
    const maxSlide = getMaxSlide();
    if (currentSlide > maxSlide) {
        currentSlide = maxSlide;
    }
    updateSlidePosition();
});

// Initialize carousel
document.addEventListener('DOMContentLoaded', () => {
    updateSlidePosition();
    
    // Auto-slide functionality (optional)
    let autoSlideInterval;
    
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            if (currentSlide >= getMaxSlide()) {
                currentSlide = 0;
            } else {
                currentSlide++;
            }
            updateSlidePosition();
        }, 5000);
    }
    
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }
    
    // Start auto-slide
    startAutoSlide();
    
    // Pause auto-slide on hover
    const projectsContainer = document.querySelector('.projects-container');
    projectsContainer.addEventListener('mouseenter', stopAutoSlide);
    projectsContainer.addEventListener('mouseleave', startAutoSlide);
});

// Enhanced touch/swipe support for mobile
let startX = 0;
let currentX = 0;
let isDragging = false;
let startTime = 0;

projectsTrack.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startTime = Date.now();
    isDragging = true;
});

projectsTrack.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    currentX = e.touches[0].clientX;
    e.preventDefault(); // Prevent scrolling
});

projectsTrack.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;
    
    const diffX = startX - currentX;
    const diffTime = Date.now() - startTime;
    const threshold = 50;
    const velocity = Math.abs(diffX) / diffTime;
    
    // Trigger slide based on distance or velocity
    if ((Math.abs(diffX) > threshold) || (velocity > 0.5)) {
        if (diffX > 0) {
            slideProjects('next');
        } else {
            slideProjects('prev');
        }
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        slideProjects('prev');
    } else if (e.key === 'ArrowRight') {
        slideProjects('next');
    }
});

// Mobile menu functionality
const mobileMenuBtn = document.getElementById('mobile-menu');
const closeMobileMenuBtn = document.getElementById('close-mobile-menu');
const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
const mobileMenuSidebar = document.getElementById('mobile-menu-sidebar');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

function openMobileMenu() {
    mobileMenuOverlay.classList.remove('invisible', 'opacity-0');
    mobileMenuOverlay.classList.add('visible', 'opacity-100');
    mobileMenuSidebar.classList.remove('translate-x-full');
    mobileMenuSidebar.classList.add('translate-x-0');
    document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
    mobileMenuOverlay.classList.remove('visible', 'opacity-100');
    mobileMenuOverlay.classList.add('invisible', 'opacity-0');
    mobileMenuSidebar.classList.remove('translate-x-0');
    mobileMenuSidebar.classList.add('translate-x-full');
    document.body.style.overflow = '';
}

if (mobileMenuBtn && closeMobileMenuBtn && mobileMenuOverlay && mobileMenuSidebar) {
    mobileMenuBtn.addEventListener('click', openMobileMenu);
    closeMobileMenuBtn.addEventListener('click', closeMobileMenu);
    mobileMenuOverlay.addEventListener('click', closeMobileMenu);
}

// Close mobile menu when clicking on navigation links
mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
        closeMobileMenu();
    });
});

// Close mobile menu on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeMobileMenu();
    }
});

