/**
 * Glassine Testimonials: Frontend Entry Point
 * * This module initializes the slider logic for the Glassine Testimonials block.
 * It utilizes the GlassineSlider class to handle multi-instance initialization
 * with custom aesthetic overrides.
 */

import GlassineSlider from './components/view/GlassineTestimonialsSlider';

/**
 * Initialize the sliders with global design preferences.
 * * We pass 'null' as the first argument to retain the default block selector,
 * while providing a configuration object to define the motion signature.
 */
GlassineSlider.boot(null, {
	loop: true,
    speed: 500,
	watchOverflow: true,
	spaceBetween: 100,
	centeredSlides: true,
    slidesPerView: 1,
    autoplay: { 
        delay: 5000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
    },
	/**
	 * effect: 'fade',
     * fadeEffect: {
     *     crossFade: true
     * }
	 */
});