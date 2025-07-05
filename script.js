// High-Performance Wedding Invitation Script
// Advanced caching, optimization, and performance monitoring
const CACHE = {
    elements: new Map(), // Use Map for better performance than Object
    config: WEDDING_CONFIG,
    currentLang: null,
    weddingDate: null,
    intervals: new Set(), // Use Set for unique intervals
    timeouts: new Set(),  // Use Set for unique timeouts
    observers: new Set(), // Intersection observers for lazy operations
    rafIds: new Set(),    // RequestAnimationFrame IDs
    eventListeners: new Map(), // Track event listeners for cleanup
    performance: {
        startTime: performance.now(),
        metrics: new Map(),
        loadTimes: new Map()
    }
};

// Performance monitoring utilities
const PERF = {
    mark: (name) => {
        CACHE.performance.metrics.set(name, performance.now());
    },
    measure: (name, startMark) => {
        const startTime = CACHE.performance.metrics.get(startMark);
        if (startTime) {
            const duration = performance.now() - startTime;
            CACHE.performance.loadTimes.set(name, duration);
            console.log(`⚡ ${name}: ${duration.toFixed(2)}ms`);
            return duration;
        }
    },
    logMetrics: () => {
        const total = performance.now() - CACHE.performance.startTime;
        console.log(`🚀 Total initialization time: ${total.toFixed(2)}ms`);
        CACHE.performance.loadTimes.forEach((time, name) => {
            console.log(`📊 ${name}: ${time.toFixed(2)}ms`);
        });
    }
};

// High-performance element caching with Map
function getElement(id, useCache = true) {
    if (useCache && CACHE.elements.has(id)) {
        return CACHE.elements.get(id);
    }
    const element = document.getElementById(id);
    if (useCache && element) {
        CACHE.elements.set(id, element);
    }
    return element;
}

// Batch element getter for performance
function getElements(...ids) {
    return ids.map(id => getElement(id));
}

// Advanced DOM utilities
const DOM = {
    // Fast element creation with attributes
    create: (tag, attributes = {}, content = '') => {
        const el = document.createElement(tag);
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') el.className = value;
            else if (key === 'innerHTML') el.innerHTML = value;
            else if (key === 'textContent') el.textContent = value;
            else el.setAttribute(key, value);
        });
        if (content) el.textContent = content;
        return el;
    },
    
    // Batch DOM updates with DocumentFragment
    batchUpdate: (container, updateFn) => {
        const fragment = document.createDocumentFragment();
        const temp = container.cloneNode(true);
        updateFn(temp);
        while (temp.firstChild) {
            fragment.appendChild(temp.firstChild);
        }
        container.innerHTML = '';
        container.appendChild(fragment);
    },
    
    // Throttled event handler
    throttle: (func, delay) => {
        let timeoutId;
        let lastExecTime = 0;
        return function (...args) {
            const currentTime = Date.now();
            
            if (currentTime - lastExecTime > delay) {
                func.apply(this, args);
                lastExecTime = currentTime;
            } else {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                    lastExecTime = Date.now();
                }, delay - (currentTime - lastExecTime));
            }
        };
    },
    
    // Debounced event handler
    debounce: (func, delay) => {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    },
    
    // Intersection Observer for lazy operations
    observe: (element, callback, options = {}) => {
        if (!window.IntersectionObserver) {
            callback(element); // Fallback for older browsers
            return null;
        }
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    callback(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, ...options });
        
        observer.observe(element);
        CACHE.observers.add(observer);
        return observer;
    }
};

// Web Performance API integration
const WEB_PERF = {
    // Critical Resource Hints
    preload: (href, as = 'fetch') => {
        const link = DOM.create('link', {
            rel: 'preload',
            href: href,
            as: as
        });
        document.head.appendChild(link);
    },
    
    // Prefetch resources
    prefetch: (href) => {
        const link = DOM.create('link', {
            rel: 'prefetch',
            href: href
        });
        document.head.appendChild(link);
    },
    
    // Monitor Largest Contentful Paint
    observeLCP: () => {
        try {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log(`📊 LCP: ${lastEntry.startTime.toFixed(2)}ms`);
            });
            observer.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
            console.log('LCP observation not supported');
        }
    },
    
    // Monitor First Input Delay
    observeFID: () => {
        try {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    console.log(`📊 FID: ${entry.processingStart - entry.startTime}ms`);
                });
            });
            observer.observe({ entryTypes: ['first-input'] });
        } catch (e) {
            console.log('FID observation not supported');
        }
    },
    
    // Monitor Cumulative Layout Shift
    observeCLS: () => {
        try {
            let clsValue = 0;
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                }
                console.log(`📊 CLS: ${clsValue.toFixed(4)}`);
            });
            observer.observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
            console.log('CLS observation not supported');
        }
    }
};

// Optimized current language getter with caching
function getCurrentLanguage() {
    if (CACHE.currentLang === null) {
        CACHE.currentLang = localStorage.getItem('preferredLanguage') || CACHE.config.settings.defaultLanguage;
    }
    return CACHE.currentLang;
}

// Update cached language
function updateCurrentLanguage(lang) {
    CACHE.currentLang = lang;
    localStorage.setItem('preferredLanguage', lang);
}

// Function to format time (add leading zero if number is less than 10)
function formatTime(time) {
    return time < 10 ? `0${time}` : time;
}

// High-Performance Initialization with Performance Monitoring
document.addEventListener('DOMContentLoaded', function() {
    PERF.mark('init-start');
    
    // Cache wedding date calculation
    CACHE.weddingDate = new Date(CACHE.config.dates.mainCeremony).getTime();
    
    // Initialize performance monitoring
    initializePerformanceMonitoring();
    
    // Initialize all components with performance tracking
    initializeApp();
    
    PERF.measure('Total Initialization', 'init-start');
    
    // Log performance metrics after initialization
    setTimeout(() => PERF.logMetrics(), 100);
});

// Initialize Web Performance Monitoring
function initializePerformanceMonitoring() {
    // Monitor Core Web Vitals
    WEB_PERF.observeLCP();
    WEB_PERF.observeFID();
    WEB_PERF.observeCLS();
    
    // Preload critical resources
    WEB_PERF.preload(CACHE.config.media.videoFile, 'video');
    WEB_PERF.preload(CACHE.config.media.backgroundMusic, 'audio');
    
    // Prefetch images for better UX
    WEB_PERF.prefetch(CACHE.config.media.ganeshaImage);
    WEB_PERF.prefetch(CACHE.config.media.logoImage);
}

// Optimized app initialization with performance tracking
function initializeApp() {
    const components = [
        { name: 'Loading Screen', fn: setupLoadingScreen },
        { name: 'Video Download', fn: setupVideoDownload },
        { name: 'Language Toggle', fn: setupLanguageToggle },
        { name: 'Interactions', fn: setupInteractions },
        { name: 'Calendar Button', fn: setupCalendarButton },
        { name: 'Hashtag Click', fn: setupHashtagClick },
        { name: 'Dynamic Content', fn: setupDynamicContent },
        { name: 'Countdown Timer', fn: startCountdownTimer },
        { name: 'Decorations', fn: addDecorations },
        { name: 'Responsive Handling', fn: setupResponsiveHandling },
        { name: 'Falling Flowers', fn: startFallingFlowers },
        { name: 'Background Music', fn: setupBackgroundMusic },
        { name: 'Music Toggle', fn: setupMusicToggle }
    ];
    
    // Initialize components with performance tracking
    components.forEach(({ name, fn }) => {
        PERF.mark(`${name}-start`);
        try {
            fn();
            PERF.measure(`${name} Setup`, `${name}-start`);
        } catch (error) {
            console.error(`❌ Failed to initialize ${name}:`, error);
        }
    });
}

// Enhanced falling flowers animation
function startFallingFlowers() {
    const flowingFlowersContainer = getElement('flowingFlowers');
    if (!flowingFlowersContainer) return;
    
    const flowerTypes = CACHE.config.settings.flowerTypes;
    const flowerSpeeds = CACHE.config.settings.flowerSpeeds;
    
    // Create initial flowers
    for (let i = 0; i < CACHE.config.effects.flowerInitialCount; i++) {
        const timeout = setTimeout(() => createFlower(flowingFlowersContainer, flowerTypes, flowerSpeeds), i * 500);
        CACHE.timeouts.add(timeout);
    }
    
    // Create flowers periodically
    const flowerInterval = setInterval(() => {
        createFlower(flowingFlowersContainer, flowerTypes, flowerSpeeds);
    }, CACHE.config.effects.flowerCreateInterval);
    CACHE.intervals.add(flowerInterval);
    
    // Create flower bursts periodically
    const burstInterval = setInterval(() => {
        createFlowerBurst(flowingFlowersContainer, flowerTypes, flowerSpeeds);
    }, CACHE.config.effects.flowerBurstInterval);
    CACHE.intervals.add(burstInterval);
}

// Create individual flower
function createFlower(container, flowerTypes, flowerSpeeds) {
    const flower = document.createElement('div');
    flower.className = `${CACHE.config.cssClasses.flower} ${flowerTypes[Math.floor(Math.random() * flowerTypes.length)]} ${flowerSpeeds[Math.floor(Math.random() * flowerSpeeds.length)]}`;
    
    // Random starting position and properties
    const startX = Math.random() * 100;
    const size = Math.random() * 15 + 10; // 10-25px
    const rotation = Math.random() * 360;
    const opacity = Math.random() * 0.5 + 0.3; // 0.3-0.8
    
    flower.style.cssText = `
        left: ${startX}%;
        top: -20px;
        width: ${size}px;
        height: ${size}px;
        transform: rotate(${rotation}deg);
        opacity: ${opacity};
    `;
    
    container.appendChild(flower);
    
    // Remove flower after animation completes (match CSS animation duration)
    const animationClass = flower.className.split(' ').find(cls => cls.includes('flower-'));
    let duration = 15000; // default slow
    
    if (animationClass === 'flower-fast') duration = 8000;
    else if (animationClass === 'flower-medium') duration = 12000;
    else if (animationClass === 'flower-slow') duration = 15000;
    
    const cleanup = setTimeout(() => {
        if (flower.parentNode) {
            flower.remove();
        }
    }, duration + 1000); // Add 1 second buffer
    CACHE.timeouts.add(cleanup);
}

// Create flower burst effect
function createFlowerBurst(container, flowerTypes, flowerSpeeds) {
    const burstCount = Math.floor(Math.random() * (CACHE.config.effects.flowerBurstCount.max - CACHE.config.effects.flowerBurstCount.min)) + CACHE.config.effects.flowerBurstCount.min;
    
    for (let i = 0; i < burstCount; i++) {
        const timeout = setTimeout(() => {
            createFlower(container, flowerTypes, flowerSpeeds);
        }, i * CACHE.config.effects.flowerBurstDelay);
        CACHE.timeouts.add(timeout);
    }
}

// Optimized countdown timer with cached elements
function startCountdownTimer() {
    // Cache countdown elements
    const countdownElements = {
        days: getElement('days'),
        hours: getElement('hours'),
        minutes: getElement('minutes'),
        seconds: getElement('seconds'),
        countdown: getElement('countdown')
    };
    
    // Optimized countdown function
    const updateCountdown = () => {
        const now = Date.now();
        const timeRemaining = CACHE.weddingDate - now;
        
        if (timeRemaining < 0) {
            // Clear interval and show celebration message
            CACHE.intervals.forEach(clearInterval);
            const celebrationMessage = CACHE.config.translations[getCurrentLanguage()]['celebration-message'];
            countdownElements.countdown.innerHTML = `<div class="celebration">${celebrationMessage}</div>`;
            return;
        }
        
        // Calculate time units more efficiently
        const days = Math.floor(timeRemaining / 86400000); // 1000 * 60 * 60 * 24
        const hours = Math.floor((timeRemaining % 86400000) / 3600000); // 1000 * 60 * 60
        const minutes = Math.floor((timeRemaining % 3600000) / 60000); // 1000 * 60
        const seconds = Math.floor((timeRemaining % 60000) / 1000);
        
        // Update DOM efficiently (batch updates)
        requestAnimationFrame(() => {
            countdownElements.days.textContent = formatTime(days);
            countdownElements.hours.textContent = formatTime(hours);
            countdownElements.minutes.textContent = formatTime(minutes);
            countdownElements.seconds.textContent = formatTime(seconds);
        });
    };
    
    // Initial update
    updateCountdown();
    
    // Store interval for cleanup
    const countdownInterval = setInterval(updateCountdown, CACHE.config.settings.countdownUpdateInterval);
    CACHE.intervals.add(countdownInterval);
}

// Combined setup for interactions (optimized)
function setupInteractions() {
    setupLocationClick();
    setupDateClick();
}

// Function to setup location click to search
function setupLocationClick() {
    const locationElement = document.querySelector('.location');
    if (locationElement) {
        locationElement.style.cursor = 'pointer';
        
        // Add hover effect with optimized event handling
        const handleMouseOver = () => {
            locationElement.style.textDecoration = 'underline';
            locationElement.style.color = 'var(--primary-color)';
        };
        
        const handleMouseOut = () => {
            locationElement.style.textDecoration = 'none';
            locationElement.style.color = '';
        };
        
        // Add click event to search for the location
        const handleClick = () => {
            const searchQuery = CACHE.config.location.searchQuery;
            window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}&tbm=isch`, '_blank');
        };
        
        locationElement.addEventListener('mouseover', handleMouseOver, { passive: true });
        locationElement.addEventListener('mouseout', handleMouseOut, { passive: true });
        locationElement.addEventListener('click', handleClick);
    }
}

// Function to setup date click to add to calendar
function setupDateClick() {
    const dateElement = document.querySelector('.date');
    if (dateElement) {
        dateElement.style.cursor = 'pointer';
        dateElement.addEventListener('click', addToCalendar);
    }
}

// Optimized responsive handling
function setupResponsiveHandling() {
    // Use passive listeners and debounced resize
    let resizeTimeout;
    const handleResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(adjustResponsiveElements, 100);
    };
    
    window.addEventListener('resize', handleResize, { passive: true });
    adjustResponsiveElements(); // Initial adjustment
}

// Function to adjust responsive elements (optimized)
function adjustResponsiveElements() {
    const countdown = getElement('countdown');
    if (!countdown) return;
    
    const containerWidth = countdown.offsetWidth;
    const items = countdown.querySelectorAll('.countdown-item');
    const totalItems = items.length;
    
    if (totalItems === 0) return;
    
    // Calculate ideal item width based on container
    const thresholds = CACHE.config.settings.adjustmentThresholds;
    const idealItemWidth = Math.max(
        thresholds.minItemWidth, 
        Math.min(thresholds.maxItemWidth, (containerWidth - (totalItems * thresholds.itemSpacing)) / totalItems)
    );
    
    // Batch DOM updates
    requestAnimationFrame(() => {
        items.forEach(item => {
            item.style.minWidth = `${idealItemWidth}px`;
        });
        
        // Adjust font sizes for smaller screens
        if (containerWidth < thresholds.containerWidth) {
            items.forEach(item => {
                const numberElement = item.querySelector('span:first-child');
                const labelElement = item.querySelector('.label');
                
                if (numberElement) {
                    const scale = Math.max(thresholds.minFontScale, containerWidth / thresholds.containerWidth * thresholds.maxFontScale);
                    numberElement.style.fontSize = `${scale}rem`;
                }
                
                if (labelElement) {
                    const scale = Math.max(thresholds.labelMinScale, containerWidth / thresholds.containerWidth * thresholds.labelMaxScale);
                    labelElement.style.fontSize = `${scale}rem`;
                }
            });
        } else {
            // Reset font sizes for larger screens
            items.forEach(item => {
                const numberElement = item.querySelector('span:first-child');
                const labelElement = item.querySelector('.label');
                
                if (numberElement) numberElement.style.fontSize = '';
                if (labelElement) labelElement.style.fontSize = '';
            });
        }
    });
}

// Enhanced video download setup - Force download instead of opening in browser
function setupVideoDownload() {
    const downloadBtn = getElement('downloadBtn');
    if (!downloadBtn) return;
    
    // Remove existing listeners to prevent duplicates
    const existingHandler = downloadBtn._videoHandler;
    if (existingHandler) {
        downloadBtn.removeEventListener('click', existingHandler);
    }
    
    // Create new handler using blob-based approach to force download
    const videoHandler = async function(event) {
        event.preventDefault();
        event.stopPropagation();
        
        // Prevent multiple simultaneous downloads
        if (downloadBtn.disabled) return;
        
        // Disable button temporarily
        downloadBtn.disabled = true;
        downloadBtn.style.opacity = '0.6';
        downloadBtn.style.pointerEvents = 'none';
        
        const videoPath = CACHE.config.media.videoFile;
        const fileName = CACHE.config.media.fileName;
        
        try {
            console.log('🎬 Starting video download...');
            
            // Fetch the file as blob to force download
            const response = await fetch(videoPath);
            if (!response.ok) {
                throw new Error(`Failed to fetch video: ${response.status} ${response.statusText}`);
            }
            
            const blob = await response.blob();
            console.log('📁 Video blob created, size:', blob.size, 'bytes');
            
            // Create download URL from blob
            const downloadUrl = URL.createObjectURL(blob);
            
            // Create download link with forced download
            const downloadLink = document.createElement('a');
            downloadLink.href = downloadUrl;
            downloadLink.download = fileName;
            downloadLink.style.display = 'none';
            
            // Force download by setting additional attributes
            downloadLink.setAttribute('download', fileName);
            downloadLink.setAttribute('target', '_blank');
            
            // Add to DOM temporarily
            document.body.appendChild(downloadLink);
            
            // Trigger download
            downloadLink.click();
            
            // Clean up
            document.body.removeChild(downloadLink);
            
            // Clean up blob URL after a delay to ensure download starts
            setTimeout(() => {
                URL.revokeObjectURL(downloadUrl);
                console.log('🧹 Blob URL cleaned up');
            }, 1000);
            
            // Show success message
            showSuccessMessage(CACHE.config.translations[getCurrentLanguage()]['download-success'] || 'Video downloaded successfully!');
            console.log('✅ Video download initiated successfully');
            
        } catch (error) {
            console.error('❌ Video download failed:', error);
            
            // Fallback to direct link method if blob approach fails
            console.log('🔄 Attempting fallback download method...');
            try {
                const fallbackLink = document.createElement('a');
                fallbackLink.href = videoPath;
                fallbackLink.download = fileName;
                fallbackLink.style.display = 'none';
                fallbackLink.setAttribute('download', fileName);
                fallbackLink.setAttribute('target', '_blank');
                
                document.body.appendChild(fallbackLink);
                fallbackLink.click();
                document.body.removeChild(fallbackLink);
                
                showSuccessMessage('Download started (fallback method)');
                console.log('✅ Fallback download method succeeded');
            } catch (fallbackError) {
                console.error('❌ Fallback download also failed:', fallbackError);
                showSuccessMessage('Download failed. Please try again or check your browser settings.', 'rgba(255, 0, 0, 0.8)');
            }
        } finally {
            // Re-enable button after delay
            setTimeout(() => {
                downloadBtn.disabled = false;
                downloadBtn.style.opacity = '1';
                downloadBtn.style.pointerEvents = 'auto';
            }, 2000); // Slightly longer delay for blob processing
        }
    };
    
    // Store handler reference for cleanup
    downloadBtn._videoHandler = videoHandler;
    downloadBtn.addEventListener('click', videoHandler);
    
    console.log('✅ Video download functionality setup complete');
}

// Optimized success message function
function showSuccessMessage(message, backgroundColor = null) {
    const successMsg = document.createElement('div');
    successMsg.className = CACHE.config.cssClasses.downloadSuccess;
    successMsg.textContent = message;
    
    if (backgroundColor) {
        successMsg.style.backgroundColor = backgroundColor;
    }
    
    document.body.appendChild(successMsg);
    
    // Cleanup with timeout tracking
    const fadeTimeout = setTimeout(() => {
        successMsg.style.opacity = '0';
        const removeTimeout = setTimeout(() => {
            if (document.body.contains(successMsg)) {
                document.body.removeChild(successMsg);
            }
        }, CACHE.config.messages.successFadeDuration);
        CACHE.timeouts.add(removeTimeout);
    }, CACHE.config.messages.successDuration);
    
    CACHE.timeouts.add(fadeTimeout);
}

// Optimized language toggle setup
function setupLanguageToggle() {
    const langEn = getElement('langEn');
    const langHi = getElement('langHi');
    
    if (!langEn || !langHi) return;
    
    // Set initial language
    const savedLanguage = getCurrentLanguage();
    updateLanguageButtons(savedLanguage, langEn, langHi);
    applyLanguage(savedLanguage);
    
    // Add optimized click handlers
    langEn.addEventListener('click', () => handleLanguageChange('en', langEn, langHi));
    langHi.addEventListener('click', () => handleLanguageChange('hi', langEn, langHi));
}

// Helper function for language changes
function handleLanguageChange(language, langEn, langHi) {
    const currentLang = getCurrentLanguage();
    if (currentLang === language) return;
    
    updateCurrentLanguage(language);
    updateLanguageButtons(language, langEn, langHi);
    applyLanguage(language);
    
    // Force update of all dynamic content including names
    updateAllLanguageContent(language);
}

// Function to update ALL language-dependent content
function updateAllLanguageContent(language) {
    // Update groom and bride names directly
    const groomNameElement = getElement('groom-name');
    const groomFatherElement = getElement('groom-father');
    const brideNameElement = getElement('bride-name');
    const brideFatherElement = getElement('bride-father');
    
    if (groomNameElement && groomFatherElement) {
        groomNameElement.textContent = language === 'hi' ? 
            CACHE.config.couple.groom.nameHindi : 
            CACHE.config.couple.groom.name;
        groomFatherElement.textContent = language === 'hi' ? 
            CACHE.config.couple.groom.fatherHindi : 
            CACHE.config.couple.groom.father;
    }
    
    if (brideNameElement && brideFatherElement) {
        brideNameElement.textContent = language === 'hi' ? 
            CACHE.config.couple.bride.nameHindi : 
            CACHE.config.couple.bride.name;
        brideFatherElement.textContent = language === 'hi' ? 
            CACHE.config.couple.bride.fatherHindi : 
            CACHE.config.couple.bride.father;
    }
    
    // Update all other language content
    updateDynamicLanguageContent(language);
}

// Helper function to update language buttons
function updateLanguageButtons(language, langEn, langHi) {
    if (language === 'en') {
        langEn.classList.add('active');
        langHi.classList.remove('active');
    } else {
        langHi.classList.add('active');
        langEn.classList.remove('active');
    }
}

// Optimized language application
function applyLanguage(language) {
    const translations = CACHE.config.translations[language];
    if (!translations) return;
    
    // Update all translatable elements efficiently
    const updates = [
        { selector: '.save-the-date', text: translations['save-the-date'] },
        { selector: '.wedding-details h3', text: translations['we-are-getting-married'] },
        { selector: '.countdown-container h3', text: translations['countdown-title'] },
        { selector: '.download-button span', text: translations['download'] }
    ];
    
    // Batch DOM updates
    requestAnimationFrame(() => {
        updates.forEach(({ selector, text }) => {
            const element = document.querySelector(selector);
            if (element) {
                applyTransitionEffect(element, text);
            }
        });
        
        // Update countdown labels
        const labels = document.querySelectorAll('.label');
        const labelTexts = [translations['days'], translations['hours'], translations['minutes'], translations['seconds']];
        labels.forEach((label, index) => {
            if (labelTexts[index]) {
                applyTransitionEffect(label, labelTexts[index]);
            }
        });
        
        // Update dynamic content
        updateDynamicLanguageContent(language);
    });
}

// Helper function for transition effects (optimized)
function applyTransitionEffect(element, newText) {
    element.classList.add(CACHE.config.cssClasses.fadeTransition, CACHE.config.cssClasses.fadeOut);
    
    const updateTimeout = setTimeout(() => {
        element.textContent = newText;
        element.classList.remove(CACHE.config.cssClasses.fadeOut);
        element.classList.add(CACHE.config.cssClasses.fadeIn);
        
        const cleanupTimeout = setTimeout(() => {
            element.classList.remove(CACHE.config.cssClasses.fadeIn);
        }, CACHE.config.effects.animationDurations.fadeComplete);
        
        CACHE.timeouts.add(cleanupTimeout);
    }, CACHE.config.effects.animationDurations.fadeTransition);
    
    CACHE.timeouts.add(updateTimeout);
}

// Update dynamic language-dependent content
function updateDynamicLanguageContent(language) {
    const content = CACHE.config.htmlContent.content[language];
    const translations = CACHE.config.translations[language];
    
    // Update symbols and special content
    const updates = [
        { id: 'and-symbol', text: content.andSymbol },
        { id: 'sparkle-symbol', text: content.sparkleSymbol },
        { id: 'date-text', text: translations.date },
        { id: 'sanskrit-verse-text', text: content.sanskritVerse },
        { id: 'formal-invitation-text', text: content.formalInvitation },
        { id: 'calendar-button-text', text: translations.calendar }
    ];
    
    updates.forEach(({ id, text }) => {
        const element = getElement(id);
        if (element) {
            element.textContent = text;
        }
    });
    
    // Update location
    const locationElement = getElement('wedding-location');
    if (locationElement) {
        locationElement.textContent = language === 'hi' ? 
            CACHE.config.location.venueHindi : 
            CACHE.config.location.venue;
    }
    
    // Update tooltips
    updateTooltips(language);
}

// Optimized tooltip updates
function updateTooltips(language) {
    const uiText = CACHE.config.uiText[language];
    
    // Update location tooltip
    const locationElement = document.querySelector('.location');
    if (locationElement && uiText) {
        const locationName = language === 'hi' ? 
            CACHE.config.location.venueHindi : 
            CACHE.config.location.venue;
        locationElement.title = `${uiText.locationTooltip} ${locationName}`;
    }
    
    // Update date tooltip
    const dateElement = document.querySelector('.date');
    if (dateElement && uiText) {
        dateElement.title = uiText.dateTooltip;
    }
    
}

// Optimized decorations with performance improvements
function addDecorations() {
    // Add subtle animations with better performance
    addHoverEffects();
    addEntranceAnimation();
    addOptimizedSparkleEffect();
    highlightWeddingDate();
}

// Optimized hover effects
function addHoverEffects() {
    const saveTheDate = document.querySelector('.save-the-date');
    if (saveTheDate) {
        saveTheDate.style.transition = 'all 0.5s ease';
        
        const handleMouseOver = function() {
            this.style.textShadow = '2px 2px 4px rgba(168, 7, 26, 0.4)';
            this.style.transform = 'scale(1.05)';
        };
        
        const handleMouseOut = function() {
            this.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.2)';
            this.style.transform = 'scale(1)';
        };
        
        saveTheDate.addEventListener('mouseover', handleMouseOver, { passive: true });
        saveTheDate.addEventListener('mouseout', handleMouseOut, { passive: true });
    }
    
    // Countdown items hover effects
    const countdownItems = document.querySelectorAll('.countdown-item');
    countdownItems.forEach(item => {
        item.style.transition = 'all 0.3s ease';
        
        const handleMouseOver = function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
        };
        
        const handleMouseOut = function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        };
        
        item.addEventListener('mouseover', handleMouseOver, { passive: true });
        item.addEventListener('mouseout', handleMouseOut, { passive: true });
    });
}

// Optimized entrance animation
function addEntranceAnimation() {
    const content = document.querySelector('.content');
    if (content) {
        content.style.opacity = '0';
        content.style.transform = 'translateY(20px)';
        content.style.transition = 'opacity 1s ease, transform 1s ease';
        
        const timeout = setTimeout(() => {
            content.style.opacity = '1';
            content.style.transform = 'translateY(0)';
        }, CACHE.config.effects.animationDurations.contentEntrance);
        
        CACHE.timeouts.add(timeout);
    }
}

// Memory-efficient sparkle effect
function addOptimizedSparkleEffect() {
    const sparklesContainer = document.createElement('div');
    sparklesContainer.className = CACHE.config.cssClasses.sparklesContainer;
    sparklesContainer.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;overflow:hidden;z-index:50;';
    
    const borderDesign = document.querySelector('.border-design');
    if (!borderDesign) return;
    
    borderDesign.appendChild(sparklesContainer);
    
    let sparkleCount = 0;
    const maxSparkles = CACHE.config.effects.sparkleCount;
    
    const createSparkle = () => {
        if (sparkleCount >= maxSparkles) return;
        
        const sparkle = document.createElement('div');
        sparkle.className = CACHE.config.cssClasses.sparkle;
        
        // Random properties from config
        const size = Math.random() * (CACHE.config.styling.sparkleSize.max - CACHE.config.styling.sparkleSize.min) + CACHE.config.styling.sparkleSize.min;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const delay = Math.random() * 3;
        const duration = Math.random() * 2 + 2;
        
        sparkle.style.cssText = `left:${posX}%;top:${posY}%;width:${size}px;height:${size}px;animation-delay:${delay}s;animation-duration:${duration}s;`;
        
        sparklesContainer.appendChild(sparkle);
        sparkleCount++;
        
        // Remove sparkle and update count
        const timeout = setTimeout(() => {
            if (sparkle.parentNode) {
                sparkle.remove();
                sparkleCount--;
            }
        }, (duration + delay) * 1000);
        
        CACHE.timeouts.add(timeout);
    };
    
    // Create initial sparkles
    for (let i = 0; i < 5; i++) {
        const timeout = setTimeout(() => createSparkle(), i * 200);
        CACHE.timeouts.add(timeout);
    }
    
    // Create sparkles periodically
    const sparkleInterval = setInterval(createSparkle, CACHE.config.effects.sparkleCreateInterval);
    CACHE.intervals.add(sparkleInterval);
    
    // Optimized mouse move sparkles
    let lastSparkleTime = 0;
    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastSparkleTime < 100) return; // Throttle
        
        if (Math.random() > CACHE.config.effects.sparkleMouseChance) {
            lastSparkleTime = now;
            
            const sparkle = document.createElement('div');
            sparkle.className = CACHE.config.cssClasses.sparkle;
            
            const rect = sparklesContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const size = Math.random() * 4 + 2;
            
            sparkle.style.cssText = `left:${x}px;top:${y}px;width:${size}px;height:${size}px;`;
            sparklesContainer.appendChild(sparkle);
            
            const timeout = setTimeout(() => {
                if (sparkle.parentNode) {
                    sparkle.remove();
                }
            }, CACHE.config.effects.sparkleLifetime);
            
            CACHE.timeouts.add(timeout);
        }
    }, { passive: true });
}

// Optimized date highlighting
function highlightWeddingDate() {
    const dateElement = document.querySelector('.date');
    if (!dateElement) return;
    
    // Add pulsing effect on hover
    const handleMouseOver = function() {
        this.style.transform = 'scale(1.1)';
        this.style.transition = 'transform 0.3s ease';
    };
    
    const handleMouseOut = function() {
        this.style.transform = 'scale(1)';
    };
    
    dateElement.addEventListener('mouseover', handleMouseOver, { passive: true });
    dateElement.addEventListener('mouseout', handleMouseOut, { passive: true });
    
    // Add heartbeat animation CSS only once
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
            .${CACHE.config.cssClasses.heartbeat} {
                animation: heartbeat ${CACHE.config.animations.heartbeatDuration} ease infinite;
            }
        `;
        document.head.appendChild(style);
    }
    
    dateElement.classList.add(CACHE.config.cssClasses.heartbeat);
}


// Function to setup dynamic content from config
function setupDynamicContent() {
    // Update HTML meta information
    const pageTitle = getElement('page-title');
    if (pageTitle) {
        pageTitle.textContent = CACHE.config.htmlContent.meta.title;
    }
    
    const pageDescription = getElement('page-description');
    if (pageDescription) {
        pageDescription.setAttribute('content', CACHE.config.htmlContent.meta.description);
    }
    
    const pageKeywords = getElement('page-keywords');
    if (pageKeywords) {
        pageKeywords.setAttribute('content', CACHE.config.htmlContent.meta.keywords);
    }
    
    const pageFavicon = getElement('page-favicon');
    if (pageFavicon) {
        pageFavicon.href = CACHE.config.media.logoImage;
    }
    
    // Update hashtag
    const hashtagElement = getElement('hashtag');
    if (hashtagElement) {
        hashtagElement.textContent = CACHE.config.couple.hashtag;
    }
    
    // Update groom information
    const groomNameElement = getElement('groom-name');
    const groomFatherElement = getElement('groom-father');
    
    if (groomNameElement && groomFatherElement) {
        const currentLang = getCurrentLanguage();
        groomNameElement.textContent = currentLang === 'hi' ? 
            CACHE.config.couple.groom.nameHindi : 
            CACHE.config.couple.groom.name;
        groomFatherElement.textContent = currentLang === 'hi' ? 
            CACHE.config.couple.groom.fatherHindi : 
            CACHE.config.couple.groom.father;
    }
    
    // Update bride information
    const brideNameElement = getElement('bride-name');
    const brideFatherElement = getElement('bride-father');
    
    if (brideNameElement && brideFatherElement) {
        const currentLang = getCurrentLanguage();
        brideNameElement.textContent = currentLang === 'hi' ? 
            CACHE.config.couple.bride.nameHindi : 
            CACHE.config.couple.bride.name;
        brideFatherElement.textContent = currentLang === 'hi' ? 
            CACHE.config.couple.bride.fatherHindi : 
            CACHE.config.couple.bride.father;
    }
    
    
    // Update loading screen logo
    const loadingLogo = document.querySelector('.loading-logo');
    if (loadingLogo) {
        loadingLogo.src = CACHE.config.media.logoImage;
        loadingLogo.alt = CACHE.config.htmlContent.images.logoAlt;
    }
    
    // Update ganesha image
    const ganeshaImage = document.querySelector('.ganesha-image');
    if (ganeshaImage) {
        ganeshaImage.src = CACHE.config.media.ganeshaImage;
        ganeshaImage.alt = CACHE.config.htmlContent.images.ganeshaAlt;
    }
    
    // Update all text content from config
    const currentLang = getCurrentLanguage();
    
    // Main headings and content
    const saveTheDateHeading = getElement('save-the-date-heading');
    if (saveTheDateHeading) {
        saveTheDateHeading.textContent = CACHE.config.translations[currentLang]['save-the-date'];
    }
    
    const andSymbol = getElement('and-symbol');
    if (andSymbol) {
        andSymbol.textContent = CACHE.config.htmlContent.content[currentLang].andSymbol;
    }
    
    const sparkleSymbol = getElement('sparkle-symbol');
    if (sparkleSymbol) {
        sparkleSymbol.textContent = CACHE.config.htmlContent.content[currentLang].sparkleSymbol;
    }
    
    const weddingMessage = getElement('wedding-message');
    if (weddingMessage) {
        weddingMessage.textContent = CACHE.config.translations[currentLang]['we-are-getting-married'];
    }
    
    const dateText = getElement('date-text');
    if (dateText) {
        dateText.textContent = CACHE.config.translations[currentLang]['date'];
    }
    
    const weddingLocation = getElement('wedding-location');
    if (weddingLocation) {
        weddingLocation.textContent = currentLang === 'hi' ? 
            CACHE.config.location.venueHindi : 
            CACHE.config.location.venue;
    }
    
    const countdownTitle = getElement('countdown-title');
    if (countdownTitle) {
        countdownTitle.textContent = CACHE.config.translations[currentLang]['countdown-title'];
    }
    
    // Countdown labels
    const daysLabel = getElement('days-label');
    if (daysLabel) {
        daysLabel.textContent = CACHE.config.translations[currentLang]['days'];
    }
    
    const hoursLabel = getElement('hours-label');
    if (hoursLabel) {
        hoursLabel.textContent = CACHE.config.translations[currentLang]['hours'];
    }
    
    const minutesLabel = getElement('minutes-label');
    if (minutesLabel) {
        minutesLabel.textContent = CACHE.config.translations[currentLang]['minutes'];
    }
    
    const secondsLabel = getElement('seconds-label');
    if (secondsLabel) {
        secondsLabel.textContent = CACHE.config.translations[currentLang]['seconds'];
    }
    
    // Sanskrit verse
    const sanskritVerseText = getElement('sanskrit-verse-text');
    if (sanskritVerseText) {
        sanskritVerseText.textContent = CACHE.config.htmlContent.content[currentLang].sanskritVerse;
    }
    
    // Formal invitation
    const formalInvitationText = getElement('formal-invitation-text');
    if (formalInvitationText) {
        formalInvitationText.textContent = CACHE.config.htmlContent.content[currentLang].formalInvitation;
    }
    
    // Button texts
    const downloadButtonText = getElement('download-button-text');
    if (downloadButtonText) {
        downloadButtonText.textContent = CACHE.config.translations[currentLang]['download'];
    }
    
    const calendarButtonText = getElement('calendar-button-text');
    if (calendarButtonText) {
        calendarButtonText.textContent = CACHE.config.translations[currentLang]['calendar'];
    }
    
    // Update language button text
    const langEnBtn = getElement('langEn');
    const langHiBtn = getElement('langHi');
    if (langEnBtn && langHiBtn) {
        langEnBtn.textContent = CACHE.config.htmlContent.buttons[currentLang].english;
        langHiBtn.textContent = CACHE.config.htmlContent.buttons[currentLang].hindi;
    }
    
    // Update tooltips
    updateTooltips(currentLang);
}

// Optimized loading screen setup
function setupLoadingScreen() {
    const loadingScreen = getElement('loading-screen');
    if (!loadingScreen) return;
    
    // Hide main content initially during loading
    const mainContent = document.querySelector('.container');
    if (mainContent) {
        mainContent.style.opacity = '0';
        mainContent.style.visibility = 'hidden';
    }
    
    const timeout = setTimeout(() => {
        loadingScreen.style.opacity = '0';
        loadingScreen.style.transition = 'opacity 1s ease';
        
        const removeTimeout = setTimeout(() => {
            if (loadingScreen && loadingScreen.parentNode) {
                loadingScreen.style.display = 'none';
            }
            
            // Show main content after loading screen is gone
            if (mainContent) {
                mainContent.style.visibility = 'visible';
                mainContent.style.opacity = '1';
                mainContent.style.transition = 'opacity 0.5s ease';
                
                // Add loaded class for any CSS animations
                document.body.classList.add(CACHE.config.cssClasses.contentLoaded);
            }
        }, 1000);
        
        CACHE.timeouts.add(removeTimeout);
    }, CACHE.config.settings.loadingScreenDuration);
    
    CACHE.timeouts.add(timeout);
}

// Calendar functionality
function setupCalendarButton() {
    const calendarBtn = getElement('calendarBtn');
    if (calendarBtn) {
        calendarBtn.addEventListener('click', addToCalendar);
    }
}

function addToCalendar() {
    const eventDetails = {
        title: CACHE.config.event.title,
        start: CACHE.config.dates.calendarStartDate,
        end: CACHE.config.dates.calendarEndDate,
        description: CACHE.config.event.description,
        location: CACHE.config.location.venue
    };
    
    // Create calendar URL
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventDetails.title)}&dates=${eventDetails.start}/${eventDetails.end}&details=${encodeURIComponent(eventDetails.description)}&location=${encodeURIComponent(eventDetails.location)}`;
    
    // Try to open calendar, fallback to creating ICS file
    try {
        window.open(calendarUrl, '_blank');
        showSuccessMessage(CACHE.config.translations[getCurrentLanguage()]['calendar-success'], CACHE.config.styling.calendarButtonBackground);
    } catch (error) {
        console.error('Calendar opening failed, creating ICS file:', error);
        createICSFile(eventDetails);
    }
}

function createICSFile(eventDetails) {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Wedding Invitation//EN
BEGIN:VEVENT
UID:${Date.now()}@wedding-invitation.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${eventDetails.start}T000000Z
DTEND:${eventDetails.end}T235959Z
SUMMARY:${eventDetails.title}
DESCRIPTION:${eventDetails.description}
LOCATION:${eventDetails.location}
BEGIN:VALARM
TRIGGER:-P1D
DESCRIPTION:${CACHE.config.alarmMessages.oneDayBefore}
ACTION:DISPLAY
END:VALARM
BEGIN:VALARM
TRIGGER:-PT8H
DESCRIPTION:${CACHE.config.alarmMessages.morningOf}
ACTION:DISPLAY
END:VALARM
BEGIN:VALARM
TRIGGER:PT0S
DESCRIPTION:${CACHE.config.alarmMessages.eventStart}
ACTION:DISPLAY
END:VALARM
END:VEVENT
END:VCALENDAR`;
    
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = CACHE.config.files.icsFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showSuccessMessage(CACHE.config.translations[getCurrentLanguage()]['calendar-file-success'], CACHE.config.styling.calendarButtonBackground);
}

// Enhanced cleanup function with complete memory management
function cleanup() {
    console.log('🧹 Starting cleanup...');
    
    // Clear all intervals
    CACHE.intervals.forEach(clearInterval);
    CACHE.intervals.clear();
    
    // Clear all timeouts  
    CACHE.timeouts.forEach(clearTimeout);
    CACHE.timeouts.clear();
    
    // Clear all RAF IDs
    CACHE.rafIds.forEach(cancelAnimationFrame);
    CACHE.rafIds.clear();
    
    // Disconnect all observers
    CACHE.observers.forEach(observer => observer.disconnect());
    CACHE.observers.clear();
    
    // Clear element cache
    CACHE.elements.clear();
    
    // Clear event listeners
    CACHE.eventListeners.forEach((listeners, element) => {
        listeners.forEach(({ event, handler, options }) => {
            element.removeEventListener(event, handler, options);
        });
    });
    CACHE.eventListeners.clear();
    
    console.log('✅ Cleanup completed');
}

// Enhanced event listener management
function addTrackedEventListener(element, event, handler, options = {}) {
    element.addEventListener(event, handler, options);
    
    if (!CACHE.eventListeners.has(element)) {
        CACHE.eventListeners.set(element, []);
    }
    
    CACHE.eventListeners.get(element).push({ event, handler, options });
}

// Service Worker Registration for PWA capabilities
async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('🔄 Service Worker registered:', registration);
        } catch (error) {
            console.log('Service Worker registration failed:', error);
        }
    }
}

// Critical CSS inlining and optimization
function optimizeCriticalCSS() {
    // Remove unused CSS for first paint optimization
    const criticalStyles = [
        'body', '.container', '.loading-screen', '.border-design',
        '.content', '.ganesha-container', '.invitation-text'
    ];
    
    // Defer non-critical CSS
    const nonCriticalCSS = document.querySelectorAll('link[rel="stylesheet"]:not([data-critical])');
    nonCriticalCSS.forEach(link => {
        link.media = 'print';
        link.onload = function() {
            this.media = 'all';
        };
    });
}

// Image lazy loading optimization
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        }, { threshold: 0.1 });
        
        images.forEach(img => imageObserver.observe(img));
        CACHE.observers.add(imageObserver);
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

// Memory usage monitoring
function monitorMemoryUsage() {
    if ('memory' in performance) {
        const memory = performance.memory;
        console.log(`💾 Memory Usage:
            Used: ${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB
            Total: ${(memory.totalJSHeapSize / 1048576).toFixed(2)} MB
            Limit: ${(memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`);
    }
}

// Network status monitoring
function setupNetworkMonitoring() {
    if ('connection' in navigator) {
        const connection = navigator.connection;
        console.log(`📶 Connection: ${connection.effectiveType}, ${connection.downlink}Mbps`);
        
        connection.addEventListener('change', () => {
            console.log(`📶 Connection changed: ${connection.effectiveType}`);
            
            // Adjust quality based on connection
            if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                // Disable animations on slow connections
                document.body.classList.add('reduced-motion');
            }
        });
    }
}

// Battery API optimization
function setupBatteryOptimization() {
    if ('getBattery' in navigator) {
        navigator.getBattery().then(battery => {
            console.log(`🔋 Battery: ${Math.round(battery.level * 100)}%`);
            
            // Reduce animations when battery is low
            if (battery.level < 0.2) {
                document.body.classList.add('low-battery');
                console.log('🔋 Low battery: Reducing animations');
            }
            
            battery.addEventListener('levelchange', () => {
                if (battery.level < 0.2) {
                    document.body.classList.add('low-battery');
                } else {
                    document.body.classList.remove('low-battery');
                }
            });
        });
    }
}

// Enhanced background music setup
function setupBackgroundMusic() {
    const backgroundMusic = getElement('backgroundMusic');
    if (!backgroundMusic) {
        console.log('Background music element not found');
        return;
    }
    
    // Set volume to a more audible level
    backgroundMusic.volume = 0.5;
    
    console.log('Setting up background music...');
    
    // Flag to track if interaction listeners have been set up
    let interactionListenersActive = false;
    
    // Try to play music - prevents multiple instances
    const playMusic = async () => {
        try {
            // Check if music is already playing to prevent duplicates
            if (!backgroundMusic.paused) {
                console.log('🎵 Music is already playing');
                return true;
            }
            
            console.log('Attempting to play background music...');
            backgroundMusic.currentTime = 0;
            const playPromise = backgroundMusic.play();
            await playPromise;
            console.log('🎵 Background music started successfully!');
            return true;
        } catch (error) {
            console.log('⚠️ Autoplay prevented by browser:', error.message);
            return false;
        }
    };
    
    // Try to play immediately when page loads
    const initialPlayTimeout = setTimeout(async () => {
        const success = await playMusic();
        if (!success && !interactionListenersActive) {
            console.log('📱 Music will start on first user interaction...');
            setupInteractionListeners();
        }
    }, 1000);
    CACHE.timeouts.add(initialPlayTimeout);
    
    // Setup interaction listeners only once
    function setupInteractionListeners() {
        if (interactionListenersActive) return;
        
        interactionListenersActive = true;
        
        const playOnUserInteraction = async (event) => {
            console.log('🖱️ User interaction detected, starting music...');
            const success = await playMusic();
            if (success) {
                // Remove all interaction listeners after successful play
                ['click', 'touchstart', 'keydown', 'mousemove'].forEach(eventType => {
                    document.removeEventListener(eventType, playOnUserInteraction);
                });
                interactionListenersActive = false;
                console.log('✅ Music interaction listeners removed');
            }
        };
        
        // Add interaction listeners with { once: true } to prevent duplicates
        ['click', 'touchstart', 'keydown', 'mousemove'].forEach(eventType => {
            document.addEventListener(eventType, playOnUserInteraction, { once: true, passive: true });
        });
    }
    
    // Handle audio events for debugging
    backgroundMusic.addEventListener('loadstart', () => {
        console.log('🔄 Music loading started...');
    });
    
    backgroundMusic.addEventListener('canplay', () => {
        console.log('✅ Music is ready to play');
    });
    
    backgroundMusic.addEventListener('playing', () => {
        console.log('▶️ Music is now playing');
    });
    
    backgroundMusic.addEventListener('error', (e) => {
        console.error('❌ Music loading error:', e.target.error);
    });
    
    backgroundMusic.addEventListener('ended', () => {
        console.log('🔄 Music ended, restarting...');
        backgroundMusic.currentTime = 0;
        backgroundMusic.play().catch(error => {
            console.log('Failed to restart music:', error.message);
        });
    });
    
    // Force load the audio
    backgroundMusic.load();
}

// Music toggle setup
function setupMusicToggle() {
    const musicToggle = getElement('musicToggle');
    const backgroundMusic = getElement('backgroundMusic');
    const playingIcon = getElement('musicPlayingIcon');
    const mutedIcon = getElement('musicMutedIcon');
    
    if (!musicToggle || !backgroundMusic || !playingIcon || !mutedIcon) return;
    
    // Track music state
    let isMusicPlaying = false;
    
    // Update button visual state with proper icon switching
    function updateMusicButtonState(isPlaying) {
        if (isPlaying) {
            // Show playing icon, hide muted icon
            playingIcon.style.display = 'block';
            mutedIcon.style.display = 'none';
            musicToggle.title = 'Click to mute music';
        } else {
            // Show muted icon, hide playing icon
            playingIcon.style.display = 'none';
            mutedIcon.style.display = 'block';
            musicToggle.title = 'Click to play music';
        }
        isMusicPlaying = isPlaying;
        console.log(`🎵 Music button updated: ${isPlaying ? 'Playing' : 'Muted'} icon shown`);
    }
    
    // Handle music toggle click
    musicToggle.addEventListener('click', async () => {
        try {
            if (isMusicPlaying) {
                // Pause music
                backgroundMusic.pause();
                updateMusicButtonState(false);
                console.log('🔇 Music paused by user');
            } else {
                // Play music
                backgroundMusic.currentTime = 0;
                await backgroundMusic.play();
                updateMusicButtonState(true);
                console.log('🎵 Music resumed by user');
            }
        } catch (error) {
            console.log('Music toggle failed:', error.message);
        }
    });
    
    // Listen for music events to update button state
    backgroundMusic.addEventListener('playing', () => {
        updateMusicButtonState(true);
    });
    
    backgroundMusic.addEventListener('pause', () => {
        updateMusicButtonState(false);
    });
    
    // Initialize button state (start with muted icon until music starts)
    updateMusicButtonState(false);
}

// Setup hashtag click functionality
function setupHashtagClick() {
    const hashtagElement = getElement('hashtag');
    if (!hashtagElement) return;
    
    // Make hashtag clickable
    hashtagElement.style.cursor = 'pointer';
    hashtagElement.title = 'Click to send hashtag idea via WhatsApp';
    
    // Add hover effect
    const handleMouseOver = () => {
        hashtagElement.style.transform = 'scale(1.05)';
        hashtagElement.style.textShadow = '0 2px 4px rgba(168, 7, 26, 0.3)';
    };
    
    const handleMouseOut = () => {
        hashtagElement.style.transform = 'scale(1)';
        hashtagElement.style.textShadow = '0 1px 1px rgba(0, 0, 0, 0.1)';
    };
    
    // Add click event to show options popup
    const handleClick = () => {
        showHashtagOptionsModal();
    };
    
    // Add event listeners
    hashtagElement.addEventListener('mouseover', handleMouseOver, { passive: true });
    hashtagElement.addEventListener('mouseout', handleMouseOut, { passive: true });
    hashtagElement.addEventListener('click', handleClick);
    
    console.log('✅ Hashtag Instagram click functionality setup complete');
}

// Show hashtag options modal with both Instagram and WhatsApp
function showHashtagOptionsModal() {
    // Create modal backdrop
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        font-family: 'Cormorant Garamond', serif;
        backdrop-filter: blur(5px);
    `;
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background-color: white;
        padding: 30px;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        text-align: center;
        max-width: 400px;
        width: 90%;
        border: 3px solid var(--gold-color);
        position: relative;
    `;
    
    modalContent.innerHTML = `
        <button id="closeModal" style="
            position: absolute;
            top: 10px;
            right: 15px;
            background: none;
            border: none;
            font-size: 24px;
            color: #999;
            cursor: pointer;
            padding: 5px;
        ">&times;</button>
        
        <h3 style="
            color: var(--primary-color);
            margin-bottom: 20px;
            font-size: 1.5rem;
            font-weight: 600;
        ">Share Hashtag Ideas</h3>
        
        <p style="
            color: var(--text-color);
            margin-bottom: 25px;
            font-size: 1rem;
            line-height: 1.5;
        ">How would you like to share your hashtag ideas?</p>
        
        <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
            <button id="whatsappOption" style="
                background-color: #25D366;
                color: white;
                border: none;
                padding: 12px 20px;
                border-radius: 10px;
                cursor: pointer;
                font-family: 'Cormorant Garamond', serif;
                font-size: 1rem;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 8px;
                transition: all 0.3s ease;
                box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);
            ">
                <span style="font-size: 1.2em;">📱</span>
                WhatsApp
            </button>
            
            <button id="instagramOption" style="
                background: linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%);
                color: white;
                border: none;
                padding: 12px 20px;
                border-radius: 10px;
                cursor: pointer;
                font-family: 'Cormorant Garamond', serif;
                font-size: 1rem;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 8px;
                transition: all 0.3s ease;
                box-shadow: 0 4px 12px rgba(225, 48, 108, 0.3);
            ">
                <span style="font-size: 1.2em;">📷</span>
                Instagram
            </button>
        </div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Add hover effects
    const whatsappBtn = modalContent.querySelector('#whatsappOption');
    const instagramBtn = modalContent.querySelector('#instagramOption');
    
    whatsappBtn.addEventListener('mouseover', () => {
        whatsappBtn.style.transform = 'translateY(-2px)';
        whatsappBtn.style.boxShadow = '0 6px 16px rgba(37, 211, 102, 0.4)';
    });
    
    whatsappBtn.addEventListener('mouseout', () => {
        whatsappBtn.style.transform = 'translateY(0)';
        whatsappBtn.style.boxShadow = '0 4px 12px rgba(37, 211, 102, 0.3)';
    });
    
    instagramBtn.addEventListener('mouseover', () => {
        instagramBtn.style.transform = 'translateY(-2px)';
        instagramBtn.style.boxShadow = '0 6px 16px rgba(225, 48, 108, 0.4)';
    });
    
    instagramBtn.addEventListener('mouseout', () => {
        instagramBtn.style.transform = 'translateY(0)';
        instagramBtn.style.boxShadow = '0 4px 12px rgba(225, 48, 108, 0.3)';
    });
    
    // Handle WhatsApp option
    whatsappBtn.addEventListener('click', () => {
        const phoneNumber = '9483609058';
        const message = 'Get Creative while creating our Wedding Hashtag!';
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        
        console.log(`📱 Opening WhatsApp to send message: ${message}`);
        window.open(whatsappUrl, '_blank');
        
        showSuccessMessage('Opening WhatsApp to send hashtag idea', 'rgba(37, 211, 102, 0.9)');
        document.body.removeChild(modal);
    });
    
    // Handle Instagram option
    instagramBtn.addEventListener('click', () => {
        const hashtag = CACHE.config.couple.hashtag;
        const cleanHashtag = hashtag.replace('#', '');
        const instagramUrl = `https://www.instagram.com/explore/tags/${encodeURIComponent(cleanHashtag)}/`;
        
        console.log(`📷 Opening Instagram hashtag: ${hashtag}`);
        window.open(instagramUrl, '_blank');
        
        showSuccessMessage(`Opening Instagram hashtag ${hashtag}`, 'rgba(225, 48, 108, 0.9)');
        document.body.removeChild(modal);
    });
    
    // Handle close button
    const closeBtn = modalContent.querySelector('#closeModal');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    closeBtn.addEventListener('mouseover', () => {
        closeBtn.style.color = 'var(--primary-color)';
    });
    
    closeBtn.addEventListener('mouseout', () => {
        closeBtn.style.color = '#999';
    });
    
    // Handle clicking outside modal
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    // Handle escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            if (document.body.contains(modal)) {
                document.body.removeChild(modal);
            }
            document.removeEventListener('keydown', handleEscape);
        }
    };
    
    document.addEventListener('keydown', handleEscape);
    
    // Add entrance animation
    modal.style.opacity = '0';
    modalContent.style.transform = 'scale(0.8)';
    
    requestAnimationFrame(() => {
        modal.style.transition = 'opacity 0.3s ease';
        modalContent.style.transition = 'transform 0.3s ease';
        modal.style.opacity = '1';
        modalContent.style.transform = 'scale(1)';
    });
}

// Add cleanup on page unload
window.addEventListener('beforeunload', cleanup);
