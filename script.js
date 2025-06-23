// Countdown Timer for Wedding Date
document.addEventListener('DOMContentLoaded', function() {
    // Set the wedding date - November 2, 2025
    const weddingDate = new Date('November 2, 2025 00:00:00').getTime();
    
    // Setup PDF download functionality
    setupPdfDownload();
    
    // Setup language toggle
    setupLanguageToggle();
    
    // Setup symbol transition animation
    setupSymbolTransition();
    
    // Update the countdown every second
    const countdownTimer = setInterval(function() {
        // Get today's date and time
        const now = new Date().getTime();
        
        // Find the time remaining between now and the wedding date
        const timeRemaining = weddingDate - now;
        
        // Calculate days, hours, minutes, and seconds
        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
        
        // Display the result in the corresponding elements
        document.getElementById('days').textContent = formatTime(days);
        document.getElementById('hours').textContent = formatTime(hours);
        document.getElementById('minutes').textContent = formatTime(minutes);
        document.getElementById('seconds').textContent = formatTime(seconds);
        
        // If the countdown is over, display a message
        if (timeRemaining < 0) {
            clearInterval(countdownTimer);
            const celebrationMessage = getCurrentLanguage() === 'hi' ? 
                'विवाह का दिन आ गया है!' : 
                'The Wedding Day Has Arrived!';
            document.getElementById('countdown').innerHTML = `<div class="celebration">${celebrationMessage}</div>`;
        }
    }, 1000);
    
    // Function to format time (add leading zero if number is less than 10)
    function formatTime(time) {
        return time < 10 ? `0${time}` : time;
    }
    
    // Add decorative elements and animations
    addDecorations();
    
    // Check for viewport resize to adjust responsive elements
    window.addEventListener('resize', adjustResponsiveElements);
    adjustResponsiveElements(); // Initial adjustment
});

// Function to adjust responsive elements
function adjustResponsiveElements() {
    // Adjust countdown container based on screen width
    const countdown = document.getElementById('countdown');
    if (countdown) {
        const containerWidth = countdown.offsetWidth;
        const items = countdown.querySelectorAll('.countdown-item');
        const totalItems = items.length;
        
        // Calculate ideal item width based on container
        const idealItemWidth = Math.max(40, Math.min(70, (containerWidth - (totalItems * 10)) / totalItems));
        
        // Apply responsive sizing
        items.forEach(item => {
            item.style.minWidth = `${idealItemWidth}px`;
        });
        
        // Adjust font sizes for better fit on smaller screens
        if (containerWidth < 400) {
            items.forEach(item => {
                const numberElement = item.querySelector('span:first-child');
                const labelElement = item.querySelector('.label');
                
                if (numberElement) {
                    numberElement.style.fontSize = `${Math.max(0.9, containerWidth / 400 * 1.3)}rem`;
                }
                
                if (labelElement) {
                    labelElement.style.fontSize = `${Math.max(0.5, containerWidth / 400 * 0.7)}rem`;
                }
            });
        } else {
            // Reset font sizes for larger screens
            items.forEach(item => {
                const numberElement = item.querySelector('span:first-child');
                const labelElement = item.querySelector('.label');
                
                if (numberElement) {
                    numberElement.style.fontSize = '';
                }
                
                if (labelElement) {
                    labelElement.style.fontSize = '';
                }
            });
        }
    }
}

// Function to setup PDF download
function setupPdfDownload() {
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            // Get the invitation content
            const element = document.getElementById('invitation-content');
            
            // Configure the PDF options
            const opt = {
                margin: 10,
                filename: 'Hemanth_Minakashi_Wedding_Invitation.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };
            
            // Add a temporary class for PDF generation
            element.classList.add('generating-pdf');
            
            // Generate the PDF
            html2pdf().from(element).set(opt).save().then(() => {
                // Remove the temporary class after PDF generation
                element.classList.remove('generating-pdf');
                
                // Show a success message
                const successMsg = document.createElement('div');
                successMsg.className = 'download-success';
                
                // Set message based on current language
                successMsg.textContent = getCurrentLanguage() === 'hi' ? 
                    'निमंत्रण डाउनलोड हो गया!' : 
                    'Invitation downloaded!';
                
                document.body.appendChild(successMsg);
                
                // Remove the success message after 3 seconds
                setTimeout(() => {
                    successMsg.style.opacity = '0';
                    setTimeout(() => {
                        document.body.removeChild(successMsg);
                    }, 500);
                }, 2500);
            });
        });
    }
}

// Function to setup language toggle
function setupLanguageToggle() {
    const langEn = document.getElementById('langEn');
    const langHi = document.getElementById('langHi');
    
    if (langEn && langHi) {
        // Set initial language from localStorage or default to English
        const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
        
        // Set active button based on saved language
        if (savedLanguage === 'en') {
            langEn.classList.add('active');
            langHi.classList.remove('active');
        } else {
            langHi.classList.add('active');
            langEn.classList.remove('active');
        }
        
        // Apply the saved language
        applyLanguage(savedLanguage);
        
        // Add click event listeners
        langEn.addEventListener('click', function() {
            if (!this.classList.contains('active')) {
                this.classList.add('active');
                langHi.classList.remove('active');
                localStorage.setItem('preferredLanguage', 'en');
                applyLanguage('en');
            }
        });
        
        langHi.addEventListener('click', function() {
            if (!this.classList.contains('active')) {
                this.classList.add('active');
                langEn.classList.remove('active');
                localStorage.setItem('preferredLanguage', 'hi');
                applyLanguage('hi');
            }
        });
    }
}

// Function to apply selected language
function applyLanguage(language) {
    // Translation data
    const translations = {
        'en': {
            'save-the-date': 'Save the Date',
            'we-are-getting-married': 'We are getting married',
            'countdown-title': 'Countdown to the Big Day',
            'days': 'Days',
            'hours': 'Hours',
            'minutes': 'Minutes',
            'seconds': 'Seconds',
            'download': 'Download Invitation',
            'date': 'November 2, 2025'
        },
        'hi': {
            'save-the-date': 'दिनांक सुरक्षित रखें',
            'we-are-getting-married': 'हमारी शादी हो रही है',
            'countdown-title': 'शादी के दिन तक का समय',
            'days': 'दिन',
            'hours': 'घंटे',
            'minutes': 'मिनट',
            'seconds': 'सेकंड',
            'download': 'निमंत्रण डाउनलोड करें',
            'date': '2 नवंबर, 2025'
        }
    };
    
    // Apply translations to elements with data attributes
    document.querySelectorAll('[data-' + language + ']').forEach(element => {
        // Special handling for date element with sparkles
        if (element.classList.contains('date')) {
            // Get the date text node (the middle child between sparkle elements)
            const dateText = element.childNodes[1];
            if (dateText && dateText.nodeType === Node.TEXT_NODE) {
                dateText.nodeValue = element.getAttribute('data-' + language);
            }
        } else {
            element.textContent = element.getAttribute('data-' + language);
        }
        
        // Add fade transition
        element.classList.add('fade-transition');
        element.classList.add('fade-out');
        
        setTimeout(() => {
            element.classList.remove('fade-out');
            element.classList.add('fade-in');
        }, 50);
    });
    
    // Apply translations to specific elements
    if (translations[language]) {
        // Save the Date heading
        const saveTheDate = document.querySelector('.save-the-date');
        if (saveTheDate) {
            applyTransitionEffect(saveTheDate, translations[language]['save-the-date']);
        }
        
        // Wedding details heading
        const weddingDetailsH3 = document.querySelector('.wedding-details h3');
        if (weddingDetailsH3) {
            applyTransitionEffect(weddingDetailsH3, translations[language]['we-are-getting-married']);
        }
        
        // Countdown title
        const countdownTitle = document.querySelector('.countdown-container h3');
        if (countdownTitle) {
            applyTransitionEffect(countdownTitle, translations[language]['countdown-title']);
        }
        
        // Countdown labels
        const labels = document.querySelectorAll('.label');
        if (labels.length === 4) {
            applyTransitionEffect(labels[0], translations[language]['days']);
            applyTransitionEffect(labels[1], translations[language]['hours']);
            applyTransitionEffect(labels[2], translations[language]['minutes']);
            applyTransitionEffect(labels[3], translations[language]['seconds']);
        }
        
        // Download button text
        const downloadBtn = document.querySelector('.download-button span');
        if (downloadBtn) {
            applyTransitionEffect(downloadBtn, translations[language]['download']);
        }
    }
}

// Helper function to apply transition effect to element text change
function applyTransitionEffect(element, newText) {
    element.classList.add('fade-transition');
    element.classList.add('fade-out');
    
    setTimeout(() => {
        element.textContent = newText;
        element.classList.remove('fade-out');
        element.classList.add('fade-in');
    }, 300);
    
    setTimeout(() => {
        element.classList.remove('fade-in');
    }, 600);
}

// Function to get current language
function getCurrentLanguage() {
    return localStorage.getItem('preferredLanguage') || 'en';
}

// Function to setup symbol transition animation
function setupSymbolTransition() {
    const symbolElement = document.querySelector('.symbol-transition');
    if (symbolElement) {
        // Initial state is "&"
        
        // After 2 seconds, change to ring
        setTimeout(() => {
            symbolElement.classList.add('symbol-fade-out');
            
            setTimeout(() => {
                symbolElement.textContent = '';
                symbolElement.classList.add('symbol-ring');
                symbolElement.classList.remove('symbol-fade-out');
                
                // After 2 more seconds, change to heart
                setTimeout(() => {
                    symbolElement.classList.add('symbol-fade-out');
                    
                    setTimeout(() => {
                        symbolElement.classList.remove('symbol-ring');
                        symbolElement.classList.add('symbol-heart');
                        symbolElement.classList.remove('symbol-fade-out');
                    }, 500);
                }, 2000);
            }, 500);
        }, 2000);
    }
}

// Function to add decorative elements and animations
function addDecorations() {
    // Add subtle animation to the save-the-date heading
    const saveTheDate = document.querySelector('.save-the-date');
    if (saveTheDate) {
        saveTheDate.style.transition = 'all 0.5s ease';
        
        saveTheDate.addEventListener('mouseover', function() {
            this.style.textShadow = '2px 2px 4px rgba(168, 7, 26, 0.4)';
            this.style.transform = 'scale(1.05)';
        });
        
        saveTheDate.addEventListener('mouseout', function() {
            this.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.2)';
            this.style.transform = 'scale(1)';
        });
    }
    
    // Animate the '&' symbol to change to ring and then heart
    animateAndSymbol();
    
    // Add subtle animation to the countdown items
    const countdownItems = document.querySelectorAll('.countdown-item');
    countdownItems.forEach(item => {
        item.style.transition = 'all 0.3s ease';
        
        item.addEventListener('mouseover', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
        });
        
        item.addEventListener('mouseout', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        });
    });
    
    // Add a subtle entrance animation for the main content
    const content = document.querySelector('.content');
    if (content) {
        content.style.opacity = '0';
        content.style.transform = 'translateY(20px)';
        content.style.transition = 'opacity 1s ease, transform 1s ease';
        
        setTimeout(() => {
            content.style.opacity = '1';
            content.style.transform = 'translateY(0)';
        }, 300);
    }
    
    // Add sparkle effect to the page
    addSparkleEffect();
    
    // Highlight the wedding date with special effects
    highlightWeddingDate();
}

// Function to add sparkle effect to the page
function addSparkleEffect() {
    // Create sparkles container
    const sparklesContainer = document.createElement('div');
    sparklesContainer.className = 'sparkles-container';
    sparklesContainer.style.position = 'absolute';
    sparklesContainer.style.top = '0';
    sparklesContainer.style.left = '0';
    sparklesContainer.style.width = '100%';
    sparklesContainer.style.height = '100%';
    sparklesContainer.style.pointerEvents = 'none';
    sparklesContainer.style.overflow = 'hidden';
    sparklesContainer.style.zIndex = '50';
    
    document.querySelector('.border-design').appendChild(sparklesContainer);
    
    // Create random sparkles
    const createSparkle = () => {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        
        // Random position
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        sparkle.style.left = `${posX}%`;
        sparkle.style.top = `${posY}%`;
        
        // Random size
        const size = Math.random() * 6 + 2;
        sparkle.style.width = `${size}px`;
        sparkle.style.height = `${size}px`;
        
        // Random animation delay
        const delay = Math.random() * 3;
        sparkle.style.animationDelay = `${delay}s`;
        
        // Random animation duration
        const duration = Math.random() * 2 + 2;
        sparkle.style.animationDuration = `${duration}s`;
        
        sparklesContainer.appendChild(sparkle);
        
        // Remove sparkle after animation completes
        setTimeout(() => {
            sparkle.remove();
        }, duration * 1000);
    };
    
    // Create initial sparkles
    for (let i = 0; i < 15; i++) {
        createSparkle();
    }
    
    // Create new sparkles periodically
    setInterval(() => {
        createSparkle();
    }, 500);
    
    // Add sparkles on mouse move
    document.addEventListener('mousemove', (e) => {
        if (Math.random() > 0.9) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            
            // Position at mouse cursor
            const rect = sparklesContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            sparkle.style.left = `${x}px`;
            sparkle.style.top = `${y}px`;
            
            // Random size
            const size = Math.random() * 6 + 2;
            sparkle.style.width = `${size}px`;
            sparkle.style.height = `${size}px`;
            
            sparklesContainer.appendChild(sparkle);
            
            // Remove sparkle after animation completes
            setTimeout(() => {
                sparkle.remove();
            }, 3000);
        }
    });
}

// Function to highlight the wedding date
function highlightWeddingDate() {
    const dateElement = document.querySelector('.date');
    if (dateElement) {
        // Add pulsing effect on hover
        dateElement.addEventListener('mouseover', function() {
            this.style.transform = 'scale(1.1)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        dateElement.addEventListener('mouseout', function() {
            this.style.transform = 'scale(1)';
        });
        
        // Add CSS class for heart beat animation
        if (!document.querySelector('#date-pulse-style')) {
            const style = document.createElement('style');
            style.id = 'date-pulse-style';
            style.textContent = `
                @keyframes heartbeat {
                    0% { transform: scale(1); }
                    14% { transform: scale(1.1); }
                    28% { transform: scale(1); }
                    42% { transform: scale(1.15); }
                    70% { transform: scale(1); }
                }
                .heartbeat {
                    animation: heartbeat 2s ease infinite;
                }
            `;
            document.head.appendChild(style);
        }
        
        // Add heartbeat animation
        dateElement.classList.add('heartbeat');
    }
}

// Function to animate the '&' symbol to change to ring and then heart
function animateAndSymbol() {
    const andElement = document.querySelector('.and span');
    if (andElement) {
        // Wait for page to load
        setTimeout(() => {
            // Change to ring emoji
            andElement.textContent = '💍';
            andElement.style.fontSize = '2.5rem';
            
            // Then change to heart after another delay
            setTimeout(() => {
                andElement.textContent = '❤️';
                andElement.style.fontSize = '2.5rem';
                
                // Add pulsing animation to heart
                andElement.style.animation = 'heartbeat 2s ease infinite';
            }, 2000);
        }, 2000);
    }
}
