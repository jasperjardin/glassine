/**
 * GlassineTestimonialsSlider
 * A professional, class-based wrapper for Swiper.js.
 */
export default class GlassineTestimonialsSlider {
    // Default selector - can be overridden externally via GlassineTestimonialsSlider.SELECTOR = '.new-class';
    static SELECTOR = '.wp-block-glassine-testimonials';

    /**
     * @param {Object} options - Custom overrides for Swiper settings.
     */
    constructor(options = {}) {
        this.selector = GlassineTestimonialsSlider.SELECTOR;
        this.instances = document.querySelectorAll(this.selector);
        
        // Elite: Merge defaults with externally provided options
        this.config = {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            grabCursor: true,
            watchOverflow: true,
            roundLengths: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
                dynamicBullets: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            ...options // External overrides
        };

        this.init();
    }

    init() {
        if (typeof Swiper === 'undefined' || !this.instances.length) return;

        this.instances.forEach((el) => {
			// Ensure we are targeting the element that actually has the 'swiper' class
			const swiperContainer = el.classList.contains('swiper') ? el : el.querySelector('.swiper');
				
			if (!swiperContainer || swiperContainer.classList.contains('swiper-initialized')) return;

			try {
				const inlineOptions = el.dataset.swiperOptions ? JSON.parse(el.dataset.swiperOptions) : {};
				// Initialize Swiper on the container, not the block wrapper
				new Swiper(swiperContainer, { ...this.config, ...inlineOptions });
			} catch (error) {
				console.error(`[GlassineTestimonialsSlider] Failed to init:`, error);
			}
        });
    }

    /**
     * Static bootstrapper to initialize the class with custom settings.
     * @param {string} customSelector - Optional custom selector string.
     * @param {Object} customConfig - Optional custom Swiper configuration.
     */
    static boot(customSelector = null, customConfig = {}) {
        if (customSelector) {
            GlassineTestimonialsSlider.SELECTOR = customSelector;
        }

        const startup = () => new GlassineTestimonialsSlider(customConfig);
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', startup);
        } else {
            startup();
        }
    }
}