/**
 * Tech Skills Hub Ghana - Main JavaScript
 * WDD 231 Final Project
 * Vanilla JavaScript - No jQuery or Frameworks
 */

// ===================================
// Strict Mode
// ===================================
'use strict';

// ===================================
// DOM Content Loaded
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initNavigation();
    initCurrentYear();
    initActiveNavigation();
    initResourceFilters();
    initContactForm();
    initSmoothScrolling();
    initBackToTop();
});

// ===================================
// Mobile Navigation Toggle
// ===================================
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            
            // Toggle aria-expanded
            navToggle.setAttribute('aria-expanded', !isExpanded);
            
            // Toggle menu visibility
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInside = navToggle.contains(event.target) || navMenu.contains(event.target);
            
            if (!isClickInside && navMenu.classList.contains('active')) {
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
            }
        });
    }
}

// ===================================
// Current Year in Footer
// ===================================
function initCurrentYear() {
    const yearElement = document.getElementById('currentYear');
    
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.textContent = currentYear;
    }
}

// ===================================
// Active Navigation Highlighting
// ===================================
function initActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (sections.length === 0 || navLinks.length === 0) {
        return;
    }

    function highlightNavigation() {
        const scrollPosition = window.scrollY + 100;

        sections.forEach(function(section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(function(link) {
                    link.classList.remove('active');
                    
                    const href = link.getAttribute('href');
                    if (href === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });

        // Highlight home when at top
        if (window.scrollY < 100) {
            navLinks.forEach(function(link) {
                link.classList.remove('active');
                if (link.getAttribute('href') === 'index.html') {
                    link.classList.add('active');
                }
            });
        }
    }

    // Run on scroll
    window.addEventListener('scroll', highlightNavigation);
    
    // Run on load
    highlightNavigation();
}

// ===================================
// Resource Filtering
// ===================================
function initResourceFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const resourceCards = document.querySelectorAll('.resource-card');
    
    if (filterButtons.length === 0 || resourceCards.length === 0) {
        return;
    }

    filterButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const filterValue = button.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(function(btn) {
                btn.classList.remove('active');
            });
            button.classList.add('active');
            
            // Filter resources
            resourceCards.forEach(function(card) {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all') {
                    card.style.display = 'block';
                    // Fade in animation
                    card.style.opacity = '0';
                    setTimeout(function() {
                        card.style.transition = 'opacity 0.3s ease';
                        card.style.opacity = '1';
                    }, 10);
                } else if (category === filterValue) {
                    card.style.display = 'block';
                    // Fade in animation
                    card.style.opacity = '0';
                    setTimeout(function() {
                        card.style.transition = 'opacity 0.3s ease';
                        card.style.opacity = '1';
                    }, 10);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// ===================================
// Contact Form Validation
// ===================================
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) {
        return;
    }

    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Get form fields
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const subject = document.getElementById('subject');
        const message = document.getElementById('message');
        
        // Validate fields
        let isValid = true;
        let errorMessage = '';

        // Name validation
        if (name.value.trim() === '') {
            isValid = false;
            errorMessage += 'Please enter your name.\n';
            name.focus();
        }

        // Email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email.value.trim() === '') {
            isValid = false;
            errorMessage += 'Please enter your email address.\n';
            if (errorMessage.split('\n').length === 2) {
                email.focus();
            }
        } else if (!emailPattern.test(email.value.trim())) {
            isValid = false;
            errorMessage += 'Please enter a valid email address.\n';
            if (errorMessage.split('\n').length === 2) {
                email.focus();
            }
        }

        // Subject validation
        if (subject.value.trim() === '') {
            isValid = false;
            errorMessage += 'Please enter a subject.\n';
            if (errorMessage.split('\n').length === 2) {
                subject.focus();
            }
        }

        // Message validation
        if (message.value.trim() === '') {
            isValid = false;
            errorMessage += 'Please enter your message.\n';
            if (errorMessage.split('\n').length === 2) {
                message.focus();
            }
        } else if (message.value.trim().length < 10) {
            isValid = false;
            errorMessage += 'Message must be at least 10 characters long.\n';
            if (errorMessage.split('\n').length === 2) {
                message.focus();
            }
        }

        // Submit or show errors
        if (isValid) {
            // Success message
            alert('Thank you for your message! We will get back to you soon.');
            
            // Reset form
            contactForm.reset();
        } else {
            // Show errors
            alert(errorMessage);
        }
    });

    // Real-time validation feedback
    const formInputs = contactForm.querySelectorAll('input, textarea');
    formInputs.forEach(function(input) {
        input.addEventListener('blur', function() {
            validateField(input);
        });

        input.addEventListener('input', function() {
            // Remove error styling on input
            input.style.borderColor = '';
        });
    });
}

// ===================================
// Field Validation Helper
// ===================================
function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    const fieldId = field.id;

    if (value === '') {
        field.style.borderColor = '#EF4444';
        return false;
    }

    if (fieldType === 'email') {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
            field.style.borderColor = '#EF4444';
            return false;
        }
    }

    if (fieldId === 'message' && value.length < 10) {
        field.style.borderColor = '#EF4444';
        return false;
    }

    field.style.borderColor = '#10B981';
    return true;
}

// ===================================
// Smooth Scrolling
// ===================================
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(function(link) {
        link.addEventListener('click', function(event) {
            const href = link.getAttribute('href');
            
            // Skip if it's just "#" or empty
            if (href === '#' || href === '') {
                return;
            }

            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                event.preventDefault();
                
                const headerHeight = document.querySelector('.site-header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===================================
// Back to Top Button
// ===================================
function initBackToTop() {
    const backToTopButton = document.querySelector('.back-to-top');
    
    if (!backToTopButton) {
        return;
    }

    // Show/hide button based on scroll position
    function toggleBackToTop() {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    }

    // Scroll to top when clicked
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Listen for scroll events
    window.addEventListener('scroll', toggleBackToTop);
    
    // Check initial state
    toggleBackToTop();
}

// ===================================
// Lazy Loading Images (Optional Enhancement)
// ===================================
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if (images.length === 0) {
        return;
    }

    const imageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(function(img) {
        imageObserver.observe(img);
    });
}

// ===================================
// Keyboard Navigation Enhancement
// ===================================
document.addEventListener('keydown', function(event) {
    // ESC key closes mobile menu
    if (event.key === 'Escape') {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navToggle && navMenu && navMenu.classList.contains('active')) {
            navToggle.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('active');
        }
    }
});

// ===================================
// Focus Management for Accessibility
// ===================================
function initFocusManagement() {
    // Trap focus in mobile menu when open
    const navMenu = document.querySelector('.nav-menu');
    const navToggle = document.querySelector('.nav-toggle');
    
    if (!navMenu || !navToggle) {
        return;
    }

    const focusableElements = navMenu.querySelectorAll('a, button');
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    navMenu.addEventListener('keydown', function(event) {
        if (!navMenu.classList.contains('active')) {
            return;
        }

        if (event.key === 'Tab') {
            if (event.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstFocusable) {
                    event.preventDefault();
                    lastFocusable.focus();
                }
            } else {
                // Tab
                if (document.activeElement === lastFocusable) {
                    event.preventDefault();
                    firstFocusable.focus();
                }
            }
        }
    });
}

// Initialize focus management
initFocusManagement();

// ===================================
// Performance Monitoring (Optional)
// ===================================
window.addEventListener('load', function() {
    // Log page load time
    const loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
    console.log('Page loaded in ' + loadTime + 'ms');
});
