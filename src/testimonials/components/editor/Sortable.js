import { useSortable } from '@dnd-kit/sortable'; // Or from '@wordpress/sortable' if using the library
import { CSS } from '@dnd-kit/utilities';
import { RichText, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';

export default function SortableItem({ item, index, updateItem, removeItem }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: index });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.6 : 1,
    };

    return (
        <div 
			ref={setNodeRef} 
			style={style} 
			className="testimonial-slider__item testimonial-slider__item--editable"
		>
            {/* The Drag Handle */}
            <div 
				className="testimonial-slider__handle" 
				{...attributes} 
				{...listeners} 
				title="Drag to reorder"
			>⠿</div>

            {/* Remove Button */}
            <Button 
                icon="no-alt" 
                className="testimonial-slider__remove" 
                onClick={() => removeItem(index)} 
            />

			<div className="testimonial-slider__image-container">
                <MediaUploadCheck>
                    <MediaUpload
                        onSelect={(media) => updateItem('imageUrl', media.url, index)}
                        allowedTypes={['image']}
                        value={item.imageUrl}
                        render={({ open }) => (
                            !item.imageUrl ? (
                                <Button variant="secondary" onClick={open}>Add Image</Button>
                            ) : (
                                <img src={item.imageUrl} className="testimonial-slider__image" onClick={open} alt="Author" />
                            )
                        )}
                    />
                </MediaUploadCheck>
            </div>

            <RichText
                tagName="p"
                className="testimonial-slider__quote"
                value={item.content}
                onChange={(val) => updateItem('content', val, index)}
                placeholder="Write testimonial..."
            />
            <RichText
                tagName="cite"
                className="testimonial-slider__author"
                value={item.author}
                onChange={(val) => updateItem('author', val, index)}
                placeholder="- Name"
            />
        </div>
    );
}