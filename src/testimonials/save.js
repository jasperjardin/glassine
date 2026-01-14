/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, RichText } from '@wordpress/block-editor';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {Element} Element to render.
 */
export default function save({ attributes } ) {
	const { testimonials, accentColor } = attributes;

	// Filter the valid testimonials first
	const validTestimonials = testimonials.filter(
		(item) => item.imageUrl || item.content || item.author
	);

	// If no valid testimonials exist, do not render the block at all
	if (validTestimonials.length === 0) {
		return null;
	}

	// Add 'swiper' class to the main block wrapper
	const blockProps = useBlockProps.save({ 
		style: { '--accent-color': accentColor }
    });

	return (
        <div {...blockProps}>
            {/* The inner slider container that matches your CSS nesting */}
            <div className="testimonial-slider swiper">
                <div className="testimonial-slider__wrapper swiper-wrapper">
					{/* Filter first to remove items where all fields are empty */}
					{testimonials
						.filter(item => item.imageUrl || item.content || item.author)
						.map((item, index) => (
						
                        <div className="testimonial-slider__item swiper-slide" key={index}>
							<div className="testimonial-slider__contents">
								{item.imageUrl ? (
									<div className="testimonial-slider__image-container">
										<img 
											src={item.imageUrl} 
											className="testimonial-slider__image" 
											alt="" 
										/>
									</div>
								) : (
									<div className="testimonial-slider__image-container testimonial-slider__image-placeholder">
										<img 
											src={ `${window.location.origin}/wp-content/plugins/glassine/assets/images/testimonial-placeholder.png` } 
											className="testimonial-slider__image placeholder-image" 
											alt="Placeholder" 
										/>
									</div>
								)}
								<RichText.Content 
									tagName="p" 
									className="testimonial-slider__quote" 
									value={item.content} 
								/>
								<RichText.Content 
									tagName="cite" 
									className="testimonial-slider__author" 
									value={item.author} 
								/>
							</div>
                        </div>
                    ))}
                </div>
                <div className="swiper-pagination testimonial-slider__pagination"></div>
                <div className="swiper-button-prev testimonial-slider__btn testimonial-slider__btn--prev"></div>
                <div className="swiper-button-next testimonial-slider__btn testimonial-slider__btn--next"></div>
            </div>
        </div>
    );
}