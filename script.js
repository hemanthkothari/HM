// Countdown Timer for Wedding Date
document.addEventListener('DOMContentLoaded', function() {
    // Set the wedding date - November 2, 2025
    const weddingDate = new Date('November 2, 2025 00:00:00').getTime();
    
    // Setup PDF download functionality
    setupPdfDownload();
    
    // Setup language toggle
    setupLanguageToggle();
    
    // Setup location click to search
    setupLocationClick();
    
    // Setup wedding day click to add to calendar
    setupWeddingDayClick();
    
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

// Function to setup location click to search
function setupLocationClick() {
    const locationElement = document.querySelector('.venue-address');
    if (locationElement) {
        locationElement.style.cursor = 'pointer';
        locationElement.title = 'Click to see images of Bikaner, Rajasthan';
        
        // Add hover effect
        locationElement.addEventListener('mouseover', function() {
            this.style.textDecoration = 'underline';
            this.style.color = 'var(--rose-gold)';
        });
        
        locationElement.addEventListener('mouseout', function() {
            this.style.textDecoration = 'none';
            this.style.color = '';
        });
        
        // Add click event to search for the location in Google Images
        locationElement.addEventListener('click', function() {
            const searchQuery = 'Bikaner Rajasthan tourism beauty';
            window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}&tbm=isch`, '_blank');
        });
    }
}

// Function to setup wedding day click to add to calendar
function setupWeddingDayClick() {
    const weddingDayElement = document.querySelector('.wedding-day');
    const addCalendarBtn = document.querySelector('.add-calendar');
    
    // Setup add to calendar functionality
    const addToCalendar = function() {
        // Create Google Calendar link
        const eventTitle = 'Wedding of Hemanth and Minakashi';
        const eventLocation = 'Bikaner, Rajasthan';
        const eventDescription = 'Wedding celebration of Hemanth Kothari and Minakashi Rampuria';
        const eventDate = '20251102'; // YYYYMMDD format
        
        // Set as all-day event
        const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${eventDate}/${eventDate}&details=${encodeURIComponent(eventDescription)}&location=${encodeURIComponent(eventLocation)}&allday=true`;
        
        window.open(googleCalendarUrl, '_blank');
    };
    
    // Add event listener to wedding day in calendar
    if (weddingDayElement) {
        weddingDayElement.style.cursor = 'pointer';
        weddingDayElement.title = 'Click to add to your calendar';
        weddingDayElement.addEventListener('click', addToCalendar);
    }
    
    // Add event listener to Add to Calendar button
    if (addCalendarBtn) {
        addCalendarBtn.addEventListener('click', addToCalendar);
    }
    
    // Setup share button functionality
    const shareBtn = document.querySelector('.share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', function() {
            if (navigator.share) {
                navigator.share({
                    title: 'Wedding Invitation - Hemanth & Minakashi',
                    text: 'You are invited to the wedding of Hemanth & Minakashi on November 2, 2025',
                    url: window.location.href
                })
                .catch(error => console.log('Error sharing:', error));
            } else {
                // Fallback for browsers that don't support Web Share API
                const dummy = document.createElement('input');
                document.body.appendChild(dummy);
                dummy.value = window.location.href;
                dummy.select();
                document.execCommand('copy');
                document.body.removeChild(dummy);
                
                // Show a success message
                const successMsg = document.createElement('div');
                successMsg.className = 'download-success';
                successMsg.textContent = getCurrentLanguage() === 'hi' ? 
                    'लिंक कॉपी किया गया!' : 
                    'Link copied to clipboard!';
                
                document.body.appendChild(successMsg);
                
                // Remove the success message after 3 seconds
                setTimeout(() => {
                    successMsg.style.opacity = '0';
                    setTimeout(() => {
                        document.body.removeChild(successMsg);
                    }, 500);
                }, 2500);
            }
        });
    }
}

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
    
    // Adjust calendar based on screen width
    const calendarGrid = document.querySelector('.calendar-grid');
    if (calendarGrid) {
        const containerWidth = calendarGrid.offsetWidth;
        
        // Adjust calendar day sizes for smaller screens
        if (containerWidth < 500) {
            const days = calendarGrid.querySelectorAll('.day');
            days.forEach(day => {
                if (day.classList.contains('wedding-day')) {
                    day.style.transform = 'scale(1.03)'; // Slightly smaller scale on small screens
                }
            });
        }
    }
    
    // Adjust octagon frame for different screen sizes
    const octagonFrame = document.querySelector('.octagon-frame');
    if (octagonFrame) {
        const containerWidth = document.querySelector('.photo-section').offsetWidth;
        if (containerWidth < 350) {
            octagonFrame.style.width = '90%';
        } else {
            octagonFrame.style.width = '80%';
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
            'save-our-date': 'Save Our Date',
            'day-of-week': 'Sunday',
            'date': 'November 2, 2025',
            'venue-name': 'ROYAL WEDDING VENUE',
            'venue-address': 'BIKANER, RAJASTHAN',
            'rsvp-label': 'RSVP BY:',
            'rsvp-date': 'October 1, 2025',
            'add-calendar': 'Add to Calendar',
            'share': 'Share',
            'countdown-title': 'Countdown to the Big Day',
            'days': 'Days',
            'hours': 'Hours',
            'minutes': 'Minutes',
            'seconds': 'Seconds',
            'download': 'Download Invitation',
            'month': 'November 2025'
        },
        'hi': {
            'save-our-date': 'हमारी तिथि सुरक्षित रखें',
            'day-of-week': 'रविवार',
            'date': 'नवंबर 2, 2025',
            'venue-name': 'रॉयल वेडिंग वेन्यू',
            'venue-address': 'बीकानेर, राजस्थान',
            'rsvp-label': 'कृपया उत्तर दें:',
            'rsvp-date': 'अक्टूबर 1, 2025',
            'add-calendar': 'कैलेंडर में जोड़ें',
            'share': 'शेयर करें',
            'countdown-title': 'उस खास दिन की उलटी गिनती',
            'days': 'दिन',
            'hours': 'घंटे',
            'minutes': 'मिनट',
            'seconds': 'सेकंड',
            'download': 'निमंत्रण डाउनलोड करें',
            'month': 'नवंबर 2025'
        }
    };
    
    // Apply translations to elements with data attributes
    document.querySelectorAll('[data-' + language + ']').forEach(element => {
        element.textContent = element.getAttribute('data-' + language);
        
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
        // Save Our Date heading
        const saveOurDate = document.querySelector('.save-our-date');
        if (saveOurDate) {
            applyTransitionEffect(saveOurDate, translations[language]['save-our-date']);
        }
        
        // Calendar month heading
        const calendarHeader = document.querySelector('.calendar-header h3');
        if (calendarHeader) {
            applyTransitionEffect(calendarHeader, translations[language]['month']);
        }
        
        // Day of week
        const dayOfWeek = document.querySelector('.day-of-week');
        if (dayOfWeek) {
            applyTransitionEffect(dayOfWeek, translations[language]['day-of-week']);
        }
        
        // Date
        const date = document.querySelector('.date');
        if (date) {
            applyTransitionEffect(date, translations[language]['date']);
        }
        
        // Venue name
        const venueName = document.querySelector('.venue-name');
        if (venueName) {
            applyTransitionEffect(venueName, translations[language]['venue-name']);
        }
        
        // Venue address
        const venueAddress = document.querySelector('.venue-address');
        if (venueAddress) {
            applyTransitionEffect(venueAddress, translations[language]['venue-address']);
        }
        
        // RSVP label
        const rsvpLabel = document.querySelector('.rsvp-label');
        if (rsvpLabel) {
            applyTransitionEffect(rsvpLabel, translations[language]['rsvp-label']);
        }
        
        // RSVP date
        const rsvpDate = document.querySelector('.rsvp-date');
        if (rsvpDate) {
            applyTransitionEffect(rsvpDate, translations[language]['rsvp-date']);
        }
        
        // Add to Calendar button
        const addCalendarBtn = document.querySelector('.add-calendar span');
        if (addCalendarBtn) {
            applyTransitionEffect(addCalendarBtn, translations[language]['add-calendar']);
        }
        
        // Share button
        const shareBtn = document.querySelector('.share-btn span');
        if (shareBtn) {
            applyTransitionEffect(shareBtn, translations[language]['share']);
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

// Function to add decorative elements and animations
function addDecorations() {
    // Add subtle animation to the save-our-date heading
    const saveOurDate = document.querySelector('.save-our-date');
    if (saveOurDate) {
        saveOurDate.style.transition = 'all 0.5s ease';
        
        saveOurDate.addEventListener('mouseover', function() {
            this.style.textShadow = '2px 2px 4px rgba(183, 110, 121, 0.4)';
            this.style.transform = 'scale(1.05)';
        });
        
        saveOurDate.addEventListener('mouseout', function() {
            this.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.1)';
            this.style.transform = 'scale(1)';
        });
    }
    
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
    const saveDate = document.querySelector('.save-date-container');
    if (saveDate) {
        saveDate.style.opacity = '0';
        saveDate.style.transform = 'translateY(20px)';
        saveDate.style.transition = 'opacity 1s ease, transform 1s ease';
        
        setTimeout(() => {
            saveDate.style.opacity = '1';
            saveDate.style.transform = 'translateY(0)';
        }, 300);
    }
    
    // Add hover effects to action buttons
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(button => {
        button.style.transition = 'all 0.3s ease';
        
        button.addEventListener('mouseover', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
            this.style.backgroundColor = 'var(--gold-color)';
            this.style.color = 'white';
        });
        
        button.addEventListener('mouseout', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
            this.style.backgroundColor = '';
            this.style.color = '';
        });
    });
    
    // Add calendar day hover effects
    addCalendarEffects();
}

// Function to add calendar effects
function addCalendarEffects() {
    // Add hover effects to calendar days
    const days = document.querySelectorAll('.day:not(.empty)');
    days.forEach(day => {
        day.addEventListener('mouseover', function() {
            if (!this.classList.contains('wedding-day')) {
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
            }
        });
        
        day.addEventListener('mouseout', function() {
            if (!this.classList.contains('wedding-day')) {
                this.style.transform = '';
                this.style.boxShadow = '';
            }
        });
    });
    
    // Add special effects to wedding day
    const weddingDay = document.querySelector('.wedding-day');
    if (weddingDay) {
        // Add pulsing animation
        const pulseAnimation = document.createElement('style');
        pulseAnimation.textContent = `
            @keyframes wedding-day-pulse {
                0% { box-shadow: 0 0 5px rgba(183, 110, 121, 0.3); }
                50% { box-shadow: 0 0 15px rgba(183, 110, 121, 0.5); }
                100% { box-shadow: 0 0 5px rgba(183, 110, 121, 0.3); }
            }
            .heart-highlight {
                animation: wedding-day-pulse 2s infinite;
            }
        `;
        document.head.appendChild(pulseAnimation);
    }
}
