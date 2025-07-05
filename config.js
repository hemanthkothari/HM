// Wedding Configuration File
// This file contains all the customizable details for the wedding invitation
// Simply update these values to customize for any wedding

const WEDDING_CONFIG = {
    // Couple Information
    couple: {
        groom: {
            name: 'Hemanth Kothari',
            nameHindi: 'हेमंत कोठारी',
            father: 'Santosh Devi Kishor Kumar Ji Kothari',
            fatherHindi: 'संतोष देवी किशोर कुमार जी कोठारी के पुत्र'
        },
        bride: {
            name: 'Minakashi Rampuria',
            nameHindi: 'मीनाक्षी रामपुरिया',
            father: 'Kiran Devi Pradeep Kumar Ji Rampuria',
            fatherHindi: 'किरण देवी प्रदीप कुमार जी रामपुरिया की पुत्री'
        },
        hashtag: '#kotharigotrampuria'
    },
    
    // Wedding Dates
    dates: {
        mainCeremony: 'November 2, 2025 00:00:00',
        startDate: '2025-10-31',
        endDate: '2025-11-02',
        calendarStartDate: '20251031',
        calendarEndDate: '20251103'
    },
    
    // Location
    location: {
        venue: 'Bikaner, Rajasthan',
        venueHindi: 'बीकानेर, राजस्थान',
        searchQuery: 'Bikaner Rajasthan tourism beauty'
    },
    
    // Event Details
    event: {
        title: 'Wedding of Hemanth and Minakashi',
        description: 'Wedding celebration of Hemanth Kothari and Minakashi Rampuria - Save the Date (Oct 31 - Nov 2, 2025) for more info please keep checking https://hemanthkothari.github.io/hM/',
        websiteUrl: 'https://hemanthkothari.github.io/hM/',
        googleMeetUrl: 'https://meet.google.com/xyz-wedding-celebration'
    },
    
    // Media Files
    media: {
        logoImage: 'images/H & M Logo.svg',
        ganeshaImage: 'images/ganesha.jpg',
        mandalaImage: 'images/mandala.jpg',
        backgroundMusic: 'SAVE THE DATE.mp3'
    },
    
    // File Names
    files: {
        pdfFilename: 'Hemanth_Minakashi_Wedding_Invitation.pdf',
        icsFilename: 'Hemanth_Minakashi_Wedding.ics'
    },
    
    // Translations
    translations: {
        en: {
            'save-the-date': 'Save the Date',
            'we-are-getting-married': 'We are getting married',
            'countdown-title': 'Countdown to the Big Day',
            'days': 'Days',
            'hours': 'Hours',
            'minutes': 'Minutes',
            'seconds': 'Seconds',
            'download': 'Download Invitation',
            'calendar': 'Add to Calendar',
            'date': 'November 2, 2025',
            'celebration-message': 'The Wedding Day Has Arrived!',
            'download-success': 'Invitation downloaded!',
            'calendar-success': 'Calendar opened!',
            'calendar-file-success': 'Calendar file downloaded!',
        },
        hi: {
            'save-the-date': 'इस शुभ दिन में शामिल हों',
            'we-are-getting-married': 'हम विवाह के बंधन में बंधने जा रहे हैं, शादी मे जरूर पधारना सा',
            'countdown-title': 'उस खास दिन की उलटी गिनती',
            'days': 'दिन',
            'hours': 'घंटे',
            'minutes': 'मिनट',
            'seconds': 'सेकंड',
            'download': 'निमंत्रण डाउनलोड करें',
            'calendar': 'कैलेंडर में जोड़ें',
            'date': '2 नवंबर, 2025',
            'celebration-message': 'विवाह का दिन आ गया है!',
            'download-success': 'निमंत्रण डाउनलोड हो गया!',
            'calendar-success': 'कैलेंडर खुल गया!',
            'calendar-file-success': 'कैलेंडर फ़ाइल डाउनलोड हो गई!',
        }
    },
    
    // Calendar Reminders (in minutes before event)
    reminders: {
        oneDayBefore: 1440,  // 24 hours
        morningOf: 480,      // 8 hours
        eventStart: 0        // At event time
    },
    
    // Calendar Alarm Messages
    alarmMessages: {
        oneDayBefore: 'Wedding tomorrow - Don\'t forget!',
        morningOf: 'Wedding celebration begins today!',
        eventStart: 'Wedding celebration is starting now!'
    },

    // UI Messages and Text
    uiText: {
        en: {
            locationTooltip: 'Click to see images of',
            dateTooltip: 'Click to add to your calendar',
            formalInvitation: 'Formal invitation to follow',
            sanskritVerse: 'सर्वमंगल मांगल्ये शिवे सर्वार्थ साधिके'
        },
        hi: {
            locationTooltip: 'की तस्वीरें देखने के लिए क्लिक करें',
            dateTooltip: 'अपने कैलेंडर में जोड़ने के लिए क्लिक करें',
            formalInvitation: 'औपचारिक निमंत्रण जल्द ही',
            sanskritVerse: 'सर्वमंगल मांगल्ये शिवे सर्वार्थ साधिके'
        }
    },
    
    
    // Styling Values
    styling: {
        primaryColor: '#a8071a',
        goldColor: '#d4af37',
        calendarButtonBackground: 'rgba(46, 125, 50, 0.9)',
        sparkleSize: { min: 2, max: 8 },
        borderDesignOpacity: 0.1
    },
    
    // Timing Settings
    timing: {
        successMessageDuration: 2500,
        fadeAnimationDuration: 500,
        transitionDelay: 300,
        sparkleLifetime: 3000,
        flowerAnimationDurations: {
            slow: 15000,
            medium: 12000,
            fast: 8000
        }
    },
    
    // Animation Settings
    animations: {
        sparkleCount: 15,
        sparkleInterval: 500,
        flowerBurstInterval: 10000,
        flowerCreateInterval: 2000,
        heartbeatDuration: '2s',
        pulseAnimationDuration: '2s'
    },
    
    // HTML Content
    htmlContent: {
        meta: {
            title: 'Hemanth & Minakashi - Save the Date',
            description: 'Wedding invitation for Hemanth Kothari and Minakashi Rampuria. Save the date for November 2, 2025 in Bikaner, Rajasthan.',
            keywords: 'wedding, invitation, save the date, Hemanth, Minakashi, Kothari, Rampuria, Bikaner, Rajasthan'
        },
        images: {
            logoAlt: 'H & M Wedding Logo',
            ganeshaAlt: 'Lord Ganesha Blessing',
            mandalaAlt: 'Traditional Mandala Design'
        },
        buttons: {
            en: {
                download: 'Download Invitation',
                calendar: 'Add to Calendar',
                english: 'English',
                hindi: 'हिंदी'
            },
            hi: {
                download: 'निमंत्रण डाउनलोड करें',
                calendar: 'कैलेंडर में जोड़ें',
                english: 'English',
                hindi: 'हिंदी'
            }
        },
        content: {
            en: {
                sanskritVerse: 'सर्वमंगल मांगल्ये शिवे सर्वार्थ साधिके',
                formalInvitation: 'Formal invitation to follow',
                groomFatherPrefix: 'S/o',
                brideFatherPrefix: 'D/o',
                andSymbol: '&',
                sparkleSymbol: '✨'
            },
            hi: {
                sanskritVerse: 'सर्वमंगल मांगल्ये शिवे सर्वार्थ साधिके',
                formalInvitation: 'औपचारिक निमंत्रण जल्द ही',
                groomFatherPrefix: 'पुत्र',
                brideFatherPrefix: 'पुत्री',
                andSymbol: '&',
                sparkleSymbol: '✨'
            }
        }
    },
    
    // Tooltips and Error Messages
    tooltips: {
        en: {
            locationClick: 'Click to see images of',
            dateClick: 'Click to add to your calendar'
        },
        hi: {
            locationClick: 'की तस्वीरें देखने के लिए क्लिक करें',
            dateClick: 'अपने कैलेंडर में जोड़ने के लिए क्लिक करें'
        }
    },
    
    // Animation and Visual Effects
    effects: {
        sparkleCount: 15,
        sparkleCreateInterval: 500,
        sparkleLifetime: 3000,
        sparkleMouseChance: 0.9,
        flowerInitialCount: 12,
        flowerCreateInterval: 1200,
        flowerBurstInterval: 6000,
        flowerBurstCount: { min: 4, max: 7 },
        flowerBurstDelay: 200,
        animationDurations: {
            fadeTransition: 300,
            fadeComplete: 600,
            loadingFadeOut: 1000,
            loadingDelay: 500,
            contentEntrance: 300,
            sparkleRemoval: 3000,
            flowerSlow: 15000,
            flowerMedium: 12000,
            flowerFast: 8000,
            flowerCleanup: 2000
        }
    },
    
    // CSS Classes and Selectors
    cssClasses: {
        fadeTransition: 'fade-transition',
        fadeOut: 'fade-out',
        fadeIn: 'fade-in',
        contentLoaded: 'content-loaded',
        generatingPdf: 'generating-pdf',
        musicOff: 'music-off',
        sparklesContainer: 'sparkles-container',
        sparkle: 'sparkle',
        flower: 'flower',
        celebration: 'celebration',
        downloadSuccess: 'download-success',
        musicEnableMessage: 'music-enable-message',
        heartbeat: 'heartbeat'
    },
    
    // DOM Element IDs
    elementIds: {
        loadingScreen: 'loading-screen',
        backgroundMusic: 'backgroundMusic',
        musicToggle: 'musicToggle',
        musicIcon: 'musicIcon',
        downloadBtn: 'downloadBtn',
        calendarBtn: 'calendarBtn',
        langEn: 'langEn',
        langHi: 'langHi',
        countdown: 'countdown',
        days: 'days',
        hours: 'hours',
        minutes: 'minutes',
        seconds: 'seconds',
        flowingFlowers: 'flowingFlowers',
        invitationContent: 'invitation-content'
    },
    
    // Success Messages and Durations
    messages: {
        successDuration: 2500,
        successFadeDuration: 500
    },
    
    // Browser and Device Detection
    deviceDetection: {
        iosUserAgents: ['iPad', 'iPhone', 'iPod'],
        iosPlatform: 'MacIntel'
    },
    
    // Technical Settings
    settings: {
        loadingScreenDuration: 3000,
        musicStartDelay: 1500,
        musicVolume: 0.3,
        defaultLanguage: 'hi',
        interactionEvents: ['click', 'mouseover', 'keydown', 'touchstart', 'scroll'],
        flowerTypes: ['flower-petal', 'rose-flower', 'lotus-flower'],
        flowerSpeeds: ['flower-slow', 'flower-medium', 'flower-fast'],
        pdfOptions: {
            margin: 10,
            filename: 'wedding-invitation.pdf',
            imageType: 'jpeg',
            imageQuality: 0.98,
            scale: 2,
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait'
        },
        countdownUpdateInterval: 1000,
        adjustmentThresholds: {
            containerWidth: 400,
            minItemWidth: 40,
            maxItemWidth: 70,
            itemSpacing: 10,
            minFontScale: 0.9,
            maxFontScale: 1.3,
            labelMinScale: 0.5,
            labelMaxScale: 0.7
        }
    }
};
