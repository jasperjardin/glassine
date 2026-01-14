import {
    InspectorControls,
    PanelColorSettings 
} from '@wordpress/block-editor';

export default function ControlSettings({ accentColor, setAttributes }) {
    return (
        <InspectorControls>
            <PanelColorSettings 
                title="Design Settings"
                initialOpen={true}
                colorSettings={[ {
                    value: accentColor,
                    onChange: (val) => setAttributes({ accentColor: val }),
                    label: 'Accent Border Color',
                } ]}
            />
        </InspectorControls>
    );
}