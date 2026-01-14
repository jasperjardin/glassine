import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles in the editor
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import ControlSettings from './components/editor/ControlSettings';
import SortableItem from './components/editor/Sortable';
import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
    const { testimonials, accentColor } = attributes;

    // Use Sensors to prevent Drag and Drop from triggering on simple clicks/slides
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 10, // Must move 10px to start dragging, otherwise it swipes
			},
		})
	);

    const updateItem = (key, value, index) => {
        const newItems = [...testimonials];
        newItems[index] = { ...newItems[index], [key]: value };
        setAttributes({ testimonials: newItems });
    };

    const removeItem = (index) => {
        const newItems = testimonials.filter((_, i) => i !== index);
        setAttributes({ testimonials: newItems });
    };

    const addTestimonial = () => {
        setAttributes({
            testimonials: [...testimonials, { content: '', author: '', imageUrl: '' }]
        });
    };

	const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active && over && active.id !== over.id) {
            // Find indices based on the IDs provided to SortableContext
            const oldIndex = active.id;
            const newIndex = over.id;
            setAttributes({
                testimonials: arrayMove(testimonials, oldIndex, newIndex)
            });
        }
    };

	return (
        <div {...useBlockProps({ style: { '--accent-color': accentColor } })}>
            <ControlSettings accentColor={accentColor} setAttributes={setAttributes} />

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <Swiper
                    modules={[Navigation, Pagination]}
                    navigation={true} // Swiper creates these automatically
                    pagination={{ clickable: true }}
                    loop={false}      // No loop as requested
                    slidesPerView={1}
                >
                    <SortableContext 
                        items={testimonials.map((_, i) => i)} 
                        strategy={horizontalListSortingStrategy}
                    >
                        {testimonials.map((item, index) => (
                            <SwiperSlide key={index}>
                                <SortableItem 
                                    index={index} 
                                    item={item} 
                                    updateItem={updateItem}
                                    removeItem={removeItem}
                                />
                            </SwiperSlide>
                        ))}
                    </SortableContext>
                </Swiper>
            </DndContext>

            <Button variant="primary" onClick={addTestimonial}>Add Testimonial</Button>
        </div>
    );
}