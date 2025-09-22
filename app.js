class PitchDeck {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 14;
        this.slides = document.querySelectorAll('.slide');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.indicatorsContainer = document.getElementById('slideIndicators');
        this.charts = {};
        
        this.init();
    }

    init() {
        this.createIndicators();
        this.bindEvents();
        this.initializeCharts();
        this.updateSlide();
    }

    createIndicators() {
        // Clear existing indicators
        this.indicatorsContainer.innerHTML = '';
        
        for (let i = 1; i <= this.totalSlides; i++) {
            const indicator = document.createElement('div');
            indicator.className = 'indicator';
            indicator.dataset.slide = i;
            if (i === 1) indicator.classList.add('active');
            
            // Add click event listener
            indicator.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.goToSlide(i);
            });
            
            this.indicatorsContainer.appendChild(indicator);
        }
    }

    bindEvents() {
        this.prevBtn.addEventListener('click', () => this.previousSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.previousSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
            if (e.key === 'Home') this.goToSlide(1);
            if (e.key === 'End') this.goToSlide(this.totalSlides);
        });

        // Touch/swipe support
        let startX = null;
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        document.addEventListener('touchend', (e) => {
            if (startX === null) return;
            const endX = e.changedTouches[0].clientX;
            const diffX = startX - endX;
            
            if (Math.abs(diffX) > 50) {
                if (diffX > 0) this.nextSlide();
                else this.previousSlide();
            }
            startX = null;
        });
    }

    nextSlide() {
        if (this.currentSlide < this.totalSlides) {
            this.currentSlide++;
            this.updateSlide();
        }
    }

    previousSlide() {
        if (this.currentSlide > 1) {
            this.currentSlide--;
            this.updateSlide();
        }
    }

    goToSlide(slideNumber) {
        if (slideNumber >= 1 && slideNumber <= this.totalSlides) {
            this.currentSlide = slideNumber;
            this.updateSlide();
        }
    }

    updateSlide() {
        // Update slide visibility
        this.slides.forEach((slide, index) => {
            const slideNumber = index + 1;
            slide.classList.remove('active', 'prev');
            
            if (slideNumber === this.currentSlide) {
                slide.classList.add('active');
            } else if (slideNumber < this.currentSlide) {
                slide.classList.add('prev');
            }
        });

        // Update indicators
        const indicators = document.querySelectorAll('.indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.remove('active');
            if (index + 1 === this.currentSlide) {
                indicator.classList.add('active');
            }
        });

        // Update navigation buttons
        this.prevBtn.style.opacity = this.currentSlide === 1 ? '0.5' : '1';
        this.nextBtn.style.opacity = this.currentSlide === this.totalSlides ? '0.5' : '1';

        // Initialize charts when reaching specific slides
        this.initializeSlideSpecificCharts();
    }

    initializeCharts() {
        // Initialize charts that should be ready from start
        setTimeout(() => {
            this.createOpportunityChart();
            this.createRevenueChart();
        }, 500);
    }

    initializeSlideSpecificCharts() {
        // Re-render charts when slides become visible to ensure proper sizing
        switch (this.currentSlide) {
            case 3:
                setTimeout(() => this.createOpportunityChart(), 100);
                break;
            case 6:
                setTimeout(() => this.createRevenueChart(), 100);
                break;
        }
    }

    createOpportunityChart() {
        const canvas = document.getElementById('opportunityChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        if (this.charts.opportunity) {
            this.charts.opportunity.destroy();
        }

        this.charts.opportunity = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['2024', '2025', '2026', '2027', '2028', '2029', '2030'],
                datasets: [
                    {
                        label: 'PropTech Market Growth (₹ Crores)',
                        data: [15000, 18500, 22000, 26500, 29000, 31000, 31500],
                        borderColor: '#1FB8CD',
                        backgroundColor: 'rgba(31, 184, 205, 0.1)',
                        fill: true,
                        tension: 0.4,
                        borderWidth: 3,
                        pointRadius: 6,
                        pointBackgroundColor: '#1FB8CD',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2
                    },
                    {
                        label: 'Competitor Losses (₹ Crores)',
                        data: [400, 450, 500, 550, 600, 650, 700],
                        borderColor: '#DB4545',
                        backgroundColor: 'rgba(219, 69, 69, 0.1)',
                        fill: false,
                        tension: 0.4,
                        borderWidth: 2,
                        pointRadius: 4,
                        pointBackgroundColor: '#DB4545',
                        borderDash: [5, 5]
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: {
                                size: 12,
                                weight: '500'
                            }
                        }
                    },
                    title: {
                        display: true,
                        text: 'Market Growth vs Competitor Losses',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '₹' + (value/1000).toFixed(0) + 'K Cr';
                            }
                        },
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    }
                }
            }
        });
    }

    createRevenueChart() {
        const canvas = document.getElementById('revenueChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        if (this.charts.revenue) {
            this.charts.revenue.destroy();
        }

        this.charts.revenue = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: [
                    'Verification & Certification',
                    'Technology Services (AR/VR)',
                    'Premium Subscriptions',
                    'Transaction Commissions',
                    'Corporate Partnerships'
                ],
                datasets: [{
                    data: [35, 25, 20, 15, 5],
                    backgroundColor: [
                        '#1FB8CD',
                        '#FFC185',
                        '#B4413C',
                        '#5D878F',
                        '#DB4545'
                    ],
                    borderWidth: 3,
                    borderColor: '#ffffff',
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            usePointStyle: true,
                            padding: 15,
                            font: {
                                size: 11
                            },
                            generateLabels: function(chart) {
                                const data = chart.data;
                                if (data.labels.length && data.datasets.length) {
                                    return data.labels.map((label, i) => {
                                        const percentage = data.datasets[0].data[i];
                                        return {
                                            text: `${label} (${percentage}%)`,
                                            fillStyle: data.datasets[0].backgroundColor[i],
                                            hidden: false,
                                            index: i
                                        };
                                    });
                                }
                                return [];
                            }
                        }
                    },
                    title: {
                        display: true,
                        text: 'Revenue Stream Distribution - High Margin Model',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                }
            }
        });
    }

    // Utility methods for presentation
    startAutoAdvance(intervalMs = 12000) {
        this.autoAdvanceInterval = setInterval(() => {
            if (this.currentSlide < this.totalSlides) {
                this.nextSlide();
            } else {
                this.goToSlide(1);
            }
        }, intervalMs);
    }

    stopAutoAdvance() {
        if (this.autoAdvanceInterval) {
            clearInterval(this.autoAdvanceInterval);
            this.autoAdvanceInterval = null;
        }
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('Error attempting to enable fullscreen:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }

    // Animation utilities
    animateNumbers() {
        const numberElements = document.querySelectorAll('[data-animate-number]');
        numberElements.forEach(element => {
            const finalNumber = parseInt(element.dataset.animateNumber);
            this.animateCounter(element, finalNumber);
        });
    }

    animateCounter(element, finalNumber, duration = 2000) {
        const startNumber = 0;
        const increment = finalNumber / (duration / 16);
        let current = startNumber;

        const timer = setInterval(() => {
            current += increment;
            if (current >= finalNumber) {
                element.textContent = finalNumber;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }

    // Export and print functionality
    exportToPDF() {
        window.print();
    }

    // Presentation mode helpers
    enterPresentationMode() {
        document.body.classList.add('presentation-mode');
        this.toggleFullscreen();
    }

    exitPresentationMode() {
        document.body.classList.remove('presentation-mode');
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
    }
}

// Analytics tracking for presentation insights
class PresentationAnalytics {
    constructor(pitchDeck) {
        this.pitchDeck = pitchDeck;
        this.slideTimeSpent = {};
        this.slideStartTime = Date.now();
        this.totalPresentationTime = Date.now();
        this.slideVisits = {};
        
        this.trackSlideChanges();
        this.initializeTracking();
    }

    initializeTracking() {
        // Initialize visit counters
        for (let i = 1; i <= this.pitchDeck.totalSlides; i++) {
            this.slideVisits[i] = 0;
            this.slideTimeSpent[i] = 0;
        }
        this.slideVisits[1] = 1; // First slide is visited on load
    }

    trackSlideChanges() {
        const originalUpdateSlide = this.pitchDeck.updateSlide.bind(this.pitchDeck);
        this.pitchDeck.updateSlide = () => {
            this.recordSlideTime();
            originalUpdateSlide();
            this.slideStartTime = Date.now();
            this.slideVisits[this.pitchDeck.currentSlide] = (this.slideVisits[this.pitchDeck.currentSlide] || 0) + 1;
        };
    }

    recordSlideTime() {
        const currentSlide = this.pitchDeck.currentSlide;
        const timeSpent = Date.now() - this.slideStartTime;
        
        this.slideTimeSpent[currentSlide] += timeSpent;
    }

    getAnalytics() {
        this.recordSlideTime(); // Record current slide time
        
        const totalTime = Date.now() - this.totalPresentationTime;
        const averageTimePerSlide = Object.values(this.slideTimeSpent).reduce((a, b) => a + b, 0) / this.pitchDeck.totalSlides;
        
        return {
            totalPresentationTime: totalTime,
            slideTimeSpent: this.slideTimeSpent,
            slideVisits: this.slideVisits,
            currentSlide: this.pitchDeck.currentSlide,
            completionRate: (this.pitchDeck.currentSlide / this.pitchDeck.totalSlides) * 100,
            averageTimePerSlide: averageTimePerSlide,
            mostViewedSlide: Object.keys(this.slideVisits).reduce((a, b) => this.slideVisits[a] > this.slideVisits[b] ? a : b),
            engagementScore: this.calculateEngagementScore()
        };
    }

    calculateEngagementScore() {
        const totalSlides = this.pitchDeck.totalSlides;
        const uniqueSlidesVisited = Object.keys(this.slideVisits).filter(slide => this.slideVisits[slide] > 0).length;
        const completionRate = (this.pitchDeck.currentSlide / totalSlides) * 100;
        
        return Math.min(100, (uniqueSlidesVisited / totalSlides) * 50 + (completionRate * 0.5));
    }

    exportAnalytics() {
        const analytics = this.getAnalytics();
        const blob = new Blob([JSON.stringify(analytics, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'greenaria-pitch-analytics.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Utility functions for the presentation
const Utils = {
    // Format currency with Indian notation
    formatCurrency(amount, currency = '₹', suffix = '') {
        if (amount >= 10000000) { // 1 crore
            return `${currency}${(amount / 10000000).toFixed(1)} Cr${suffix}`;
        } else if (amount >= 100000) { // 1 lakh
            return `${currency}${(amount / 100000).toFixed(1)} L${suffix}`;
        } else if (amount >= 1000) {
            return `${currency}${(amount / 1000).toFixed(1)}K${suffix}`;
        }
        return `${currency}${amount}${suffix}`;
    },

    // Debounce function for performance
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Smooth scroll to element
    scrollToElement(element, duration = 1000) {
        const targetPosition = element.offsetTop;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    },

    // Generate presentation summary
    generateSummary(analytics) {
        const insights = [];
        
        if (analytics.completionRate === 100) {
            insights.push("✅ Full presentation completed");
        } else {
            insights.push(`📊 ${analytics.completionRate.toFixed(1)}% completion rate`);
        }
        
        if (analytics.engagementScore > 80) {
            insights.push("🎯 High engagement level");
        } else if (analytics.engagementScore > 60) {
            insights.push("📈 Good engagement level");
        }
        
        const totalMinutes = Math.floor(analytics.totalPresentationTime / 60000);
        insights.push(`⏱️ ${totalMinutes} minutes presentation time`);
        
        return insights;
    }
};

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const pitchDeck = new PitchDeck();
    const analytics = new PresentationAnalytics(pitchDeck);

    // Enhanced keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        switch(e.key.toLowerCase()) {
            case 'f':
                if (e.ctrlKey || e.metaKey) break;
                e.preventDefault();
                pitchDeck.toggleFullscreen();
                break;
            case 'p':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    pitchDeck.exportToPDF();
                }
                break;
            case 'a':
                if (e.ctrlKey || e.metaKey) break;
                e.preventDefault();
                analytics.exportAnalytics();
                break;
            case 'escape':
                pitchDeck.stopAutoAdvance();
                pitchDeck.exitPresentationMode();
                break;
            case ' ':
                e.preventDefault();
                if (e.shiftKey) {
                    pitchDeck.previousSlide();
                } else {
                    pitchDeck.nextSlide();
                }
                break;
        }
    });

    // Handle window resize for responsive charts
    window.addEventListener('resize', Utils.debounce(() => {
        pitchDeck.initializeSlideSpecificCharts();
    }, 250));

    // Handle visibility change
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            pitchDeck.stopAutoAdvance();
        }
    });

    // Add presentation controls
    const presentationControls = {
        start: () => {
            pitchDeck.goToSlide(1);
            pitchDeck.enterPresentationMode();
        },
        
        end: () => {
            const analyticsData = analytics.getAnalytics();
            console.log('Presentation Summary:', Utils.generateSummary(analyticsData));
            pitchDeck.exitPresentationMode();
        },
        
        toggleAutoAdvance: () => {
            if (pitchDeck.autoAdvanceInterval) {
                pitchDeck.stopAutoAdvance();
                console.log('Auto-advance stopped');
            } else {
                pitchDeck.startAutoAdvance();
                console.log('Auto-advance started (12s intervals)');
            }
        }
    };

    // Expose global interface for external control
    window.greenariaPitch = {
        deck: pitchDeck,
        analytics: analytics,
        controls: presentationControls,
        utils: Utils
    };

    // Add custom styles for presentation mode
    const style = document.createElement('style');
    style.textContent = `
        .presentation-mode .navigation {
            display: none;
        }
        
        .presentation-mode .slide-indicators {
            opacity: 0.5;
        }
        
        .presentation-mode body {
            cursor: none;
        }
        
        .presentation-mode body:hover {
            cursor: default;
        }
    `;
    document.head.appendChild(style);

    console.log('🏢 Greenaria Verified Pitch Deck Loaded Successfully');
    console.log('📱 Controls: Arrow keys (navigate), Space (next), Shift+Space (prev)');
    console.log('🖥️ Shortcuts: F (fullscreen), P (print), A (analytics), Esc (exit)');
    console.log('🎯 Access: window.greenariaPitch for programmatic control');
});

// Service Worker registration for offline capability
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then(registration => {
        console.log('ServiceWorker registered successfully');
    }).catch(error => {
        console.log('ServiceWorker registration failed:', error);
    });
}