// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functions
    initMobileMenu();
    initActiveNav();
    initBreadcrumb();
    initTabFilter();
    initContactForm();
    initSmoothScroll();
    initScrollAnimations();
    initNewsletterForm();
});

// ===== MOBILE MENU TOGGLE =====
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Change icon
            const icon = this.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navMenu.contains(event.target) && !menuToggle.contains(event.target)) {
                navMenu.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Close menu when clicking a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }
}

// ===== ACTIVE NAVIGATION LINK =====
function initActiveNav() {
    const sections = document.querySelectorAll('section, .hero');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', function() {
        let current = '';
        const scrollPosition = window.scrollY + 100; // Offset for header
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                current = section.getAttribute('id') || 'home';
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href').substring(1); // Remove #
            if (href === current || (current === '' && href === 'home')) {
                link.classList.add('active');
            }
        });
    });
}

// Update the breadcrumb function - find this section and add the new case
function initBreadcrumb() {
    const breadcrumbActive = document.getElementById('currentPage');
    const sections = document.querySelectorAll('section, .hero');
    
    if (breadcrumbActive) {
        window.addEventListener('scroll', function() {
            let currentSection = 'Home';
            const scrollPosition = window.scrollY + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionBottom = sectionTop + section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    const id = section.getAttribute('id') || 'home';
                    
                    // Format section name
                    switch(id) {
                        case 'home':
                            currentSection = 'Home';
                            break;
                        case 'about':
                            currentSection = 'About';
                            break;
                        case 'programs':
                            currentSection = 'Academic Programs';
                            break;
                        case 'faculty':
                            currentSection = 'Faculty';
                            break;
                        case 'lms':
                            currentSection = 'LMS Portal';
                            break;
                        case 'contact':
                            currentSection = 'Contact Form';
                            break;
                        case 'contact-info':
                            currentSection = 'Contact Information';
                            break;
                        default:
                            currentSection = id.charAt(0).toUpperCase() + id.slice(1);
                    }
                }
            });
            
            breadcrumbActive.textContent = currentSection;
        });
    }
}
// ===== PROGRAM FILTER TABS =====
function initTabFilter() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const programCards = document.querySelectorAll('.program-card');
    
    if (tabButtons.length && programCards.length) {
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                tabButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                const filterValue = this.getAttribute('data-tab');
                
                // Filter programs
                programCards.forEach(card => {
                    if (filterValue === 'all') {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 10);
                    } else {
                        const category = card.getAttribute('data-category');
                        if (category === filterValue) {
                            card.style.display = 'block';
                            setTimeout(() => {
                                card.style.opacity = '1';
                                card.style.transform = 'scale(1)';
                            }, 10);
                        } else {
                            card.style.opacity = '0';
                            card.style.transform = 'scale(0.8)';
                            setTimeout(() => {
                                card.style.display = 'none';
                            }, 300);
                        }
                    }
                });
            });
        });
    }
}

// ===== CONTACT FORM VALIDATION & SUBMISSION =====
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('is-invalid')) {
                    validateField(this);
                }
            });
        });
        
        // Form submission
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate all fields
            let isValid = true;
            const requiredFields = contactForm.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!validateField(field)) {
                    isValid = false;
                }
            });
            
            // Validate email format
            const email = document.getElementById('email');
            if (email && email.value && !isValidEmail(email.value)) {
                showError(email, 'Please enter a valid email address');
                isValid = false;
            }
            
            // Validate phone format if provided
            const phone = document.getElementById('phone');
            if (phone && phone.value && !isValidPhone(phone.value)) {
                showError(phone, 'Please enter a valid phone number');
                isValid = false;
            }
            
            // Validate checkbox
            const consent = document.getElementById('consent');
            if (consent && !consent.checked) {
                alert('Please consent to the data storage policy');
                isValid = false;
            }
            
            if (isValid) {
                submitForm(contactForm);
            }
        });
    }
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    
    // Remove existing error
    removeError(field);
    
    // Check required
    if (field.hasAttribute('required') && !value) {
        showError(field, 'This field is required');
        isValid = false;
    }
    
    // Check minlength
    if (isValid && field.hasAttribute('minlength') && value.length < parseInt(field.getAttribute('minlength'))) {
        showError(field, `Minimum ${field.getAttribute('minlength')} characters required`);
        isValid = false;
    }
    
    // Check pattern
    if (isValid && field.hasAttribute('pattern') && value) {
        const pattern = new RegExp(field.getAttribute('pattern'));
        if (!pattern.test(value)) {
            showError(field, 'Please match the requested format');
            isValid = false;
        }
    }
    
    // Update class
    if (isValid) {
        field.classList.remove('is-invalid');
        if (value) {
            field.classList.add('is-valid');
        } else {
            field.classList.remove('is-valid');
        }
    } else {
        field.classList.add('is-invalid');
        field.classList.remove('is-valid');
    }
    
    return isValid;
}

// Show error message
function showError(field, message) {
    const errorDiv = document.getElementById(field.id + 'Error');
    if (errorDiv) {
        errorDiv.textContent = message;
    }
}

// Remove error message
function removeError(field) {
    const errorDiv = document.getElementById(field.id + 'Error');
    if (errorDiv) {
        errorDiv.textContent = '';
    }
}

// Email validation
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Phone validation
function isValidPhone(phone) {
    const re = /^[0-9+\-\s]+$/;
    return re.test(phone);
}

// Submit form
function submitForm(form) {
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    // Show loading state
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline-flex';
    submitBtn.disabled = true;
    
    // Use FormSubmit.co to send email
    fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            // Show success message
            document.getElementById('formSuccess').style.display = 'block';
            document.getElementById('formError').style.display = 'none';
            form.reset();
            
            // Reset validation classes
            form.querySelectorAll('.is-valid').forEach(el => {
                el.classList.remove('is-valid');
            });
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                document.getElementById('formSuccess').style.display = 'none';
            }, 5000);
        } else {
            throw new Error('Form submission failed');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('formError').style.display = 'block';
        document.getElementById('formSuccess').style.display = 'none';
    })
    .finally(() => {
        // Hide loading state
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        submitBtn.disabled = false;
    });
}

// ===== SMOOTH SCROLLING =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.program-card, .faculty-card, .info-card, .gallery-item, .about-content, .about-gallery');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Unobserve after animation
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
}

// ===== NEWSLETTER FORM =====
function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]');
            
            if (email && isValidEmail(email.value)) {
                // Show success message
                alert('Thank you for subscribing to our newsletter!');
                email.value = '';
            } else {
                alert('Please enter a valid email address');
            }
        });
    }
}

// ===== BACK TO TOP BUTTON =====
function initBackToTop() {
    // Create button if it doesn't exist
    if (!document.getElementById('backToTop')) {
        const btn = document.createElement('button');
        btn.id = 'backToTop';
        btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        btn.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background-color: var(--secondary);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            display: none;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            box-shadow: var(--shadow);
            transition: var(--transition);
            z-index: 999;
        `;
        
        btn.addEventListener('mouseenter', () => {
            btn.style.backgroundColor = 'var(--secondary-dark)';
            btn.style.transform = 'translateY(-5px)';
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.backgroundColor = 'var(--secondary)';
            btn.style.transform = 'translateY(0)';
        });
        
        btn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        document.body.appendChild(btn);
        
        // Show/hide on scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                btn.style.display = 'flex';
            } else {
                btn.style.display = 'none';
            }
        });
    }
}

// Initialize back to top button
initBackToTop();