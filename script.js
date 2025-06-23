// Save the Date - Indian Wedding JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Add fade-in animation to elements
    const elements = document.querySelectorAll('.pre-heading, .om-symbol, .names-container, .date-container, .countdown, .venue, .venue-name, .details, .blessing, .download-container, .swastik-symbol');
    
    elements.forEach((element, index) => {
        // Set initial opacity to 0
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        // Stagger the animations
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 300 * index);
    });
    
    // Add decorative elements dynamically
    addDecorativeElements();
    
    // Add hover effect to date box
    const dateBox = document.querySelector('.date-box');
    if (dateBox) {
        dateBox.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        dateBox.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }
    
    // Initialize countdown timer
    initCountdown();
    
    // Initialize download button
    initDownloadButton();
});

// Function to initialize countdown timer
function initCountdown() {
    // Set the wedding date - November 2, 2025
    const weddingDate = new Date('November 2, 2025 00:00:00').getTime();
    
    // Update the countdown every second
    const countdownTimer = setInterval(function() {
        // Get today's date and time
        const now = new Date().getTime();
        
        // Find the distance between now and the wedding date
        const distance = weddingDate - now;
        
        // Time calculations for days, hours, minutes and seconds
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Display the result
        document.getElementById('days').textContent = days;
        document.getElementById('hours').textContent = hours;
        document.getElementById('minutes').textContent = minutes;
        document.getElementById('seconds').textContent = seconds;
        
        // If the countdown is over, display a message
        if (distance < 0) {
            clearInterval(countdownTimer);
            document.getElementById('days').textContent = '0';
            document.getElementById('hours').textContent = '0';
            document.getElementById('minutes').textContent = '0';
            document.getElementById('seconds').textContent = '0';
            
            const countdownItems = document.querySelectorAll('.countdown-item');
            countdownItems.forEach(item => {
                item.style.backgroundColor = 'rgba(156, 44, 44, 0.1)';
            });
        }
    }, 1000);
}

// Function to initialize download button
function initDownloadButton() {
    const downloadBtn = document.getElementById('download-btn');
    const floatingBtn = document.querySelector('.floating-download-btn');
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            // Create a canvas element to render the invitation
            const container = document.querySelector('.container');
            
            // Use html2canvas library (dynamically loaded)
            const script = document.createElement('script');
            script.src = 'https://html2canvas.hertzen.com/dist/html2canvas.min.js';
            document.head.appendChild(script);
            
            script.onload = function() {
                // Add a class to prepare for screenshot
                container.classList.add('preparing-download');
                
                // Hide the floating button temporarily
                floatingBtn.style.display = 'none';
                
                // Take screenshot after a small delay to ensure styles are applied
                setTimeout(() => {
                    html2canvas(container, {
                        scale: 2,
                        logging: false,
                        useCORS: true,
                        backgroundColor: null
                    }).then(canvas => {
                        // Convert canvas to image
                        const image = canvas.toDataURL('image/png');
                        
                        // Create download link
                        const downloadLink = document.createElement('a');
                        downloadLink.href = image;
                        downloadLink.download = 'Wedding_Invitation_Hemanth_Minakshi.png';
                        
                        // Trigger download
                        document.body.appendChild(downloadLink);
                        downloadLink.click();
                        document.body.removeChild(downloadLink);
                        
                        // Restore the floating button
                        floatingBtn.style.display = 'block';
                        
                        // Remove the preparation class
                        container.classList.remove('preparing-download');
                        
                        // Show a success message
                        const successMsg = document.createElement('div');
                        successMsg.className = 'download-success';
                        successMsg.textContent = 'Invitation downloaded successfully!';
                        successMsg.style.position = 'fixed';
                        successMsg.style.bottom = '90px';
                        successMsg.style.right = '30px';
                        successMsg.style.backgroundColor = 'rgba(0, 128, 0, 0.8)';
                        successMsg.style.color = 'white';
                        successMsg.style.padding = '10px 15px';
                        successMsg.style.borderRadius = '5px';
                        successMsg.style.zIndex = '100';
                        successMsg.style.opacity = '0';
                        successMsg.style.transition = 'opacity 0.3s ease';
                        
                        document.body.appendChild(successMsg);
                        
                        // Show and then fade out the message
                        setTimeout(() => {
                            successMsg.style.opacity = '1';
                            
                            setTimeout(() => {
                                successMsg.style.opacity = '0';
                                
                                setTimeout(() => {
                                    document.body.removeChild(successMsg);
                                }, 300);
                            }, 2000);
                        }, 100);
                    });
                }, 100);
            };
            
            // Fallback if script fails to load
            script.onerror = function() {
                alert('Could not load the required library. Please try again later.');
                floatingBtn.style.display = 'block';
            };
        });
    }
}

// Function to add decorative elements
function addDecorativeElements() {
    // Create corner decorations
    const borderDesign = document.querySelector('.border-design');
    
    if (borderDesign) {
        const corners = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
        
        corners.forEach(corner => {
            const decoration = document.createElement('div');
            decoration.className = `corner-decoration ${corner}`;
            decoration.innerHTML = '❈';
            decoration.style.position = 'absolute';
            decoration.style.color = '#d4af37';
            decoration.style.fontSize = '1.5rem';
            
            switch(corner) {
                case 'top-left':
                    decoration.style.top = '5px';
                    decoration.style.left = '5px';
                    break;
                case 'top-right':
                    decoration.style.top = '5px';
                    decoration.style.right = '5px';
                    break;
                case 'bottom-left':
                    decoration.style.bottom = '5px';
                    decoration.style.left = '5px';
                    break;
                case 'bottom-right':
                    decoration.style.bottom = '5px';
                    decoration.style.right = '5px';
                    break;
            }
            
            borderDesign.appendChild(decoration);
        });
    }
    
    // Add subtle background animation
    const container = document.querySelector('.container');
    if (container) {
        container.style.animation = 'backgroundShimmer 8s infinite alternate';
        
        // Add keyframes for background animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes backgroundShimmer {
                0% {
                    box-shadow: 0 0 50px rgba(212, 175, 55, 0.1);
                }
                100% {
                    box-shadow: 0 0 70px rgba(212, 175, 55, 0.3);
                }
            }
        `;
        document.head.appendChild(style);
    }
}
