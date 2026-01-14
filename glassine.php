<?php
/**
 * Plugin Name:			Glassine
 * Description:       	A technical showcase plugin featuring a modular
 * 						Testimonial Slider. Demonstrates clean functional
 * 						programming, intuitive drag-and-drop Gutenberg block
 * 						development, and an optimized asset loading system for
 * 						modern WordPress environments.
 * Version:				0.1.0
 * Requires at least:	6.7
 * Requires PHP:		7.4
 * Author:				Jasper B Jardin
 * License:				GPL-2.0-or-later
 * License URI:			https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:			glassine
 *
 * @package Glassine
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Returns a collection of available library resources.
 */
function get_glassine_resource_collection() {
    $libraries = apply_filters(
		'glassine_resource_collection',
		array(
			'swiper' => array(
				'css' => array(
					'main' => array(
						'id'    => 'swiper',
						'src'   => 'assets/lib/swiperjs/swiper-bundle.min.css',
						'deps'  => array(),
						'ver'   => '', // Auto-filled by filemtime if local
						'media' => 'all',
					),
				),
				'js' => array(
					'main' => array(
						'id'    => 'swiper',
						'src'   => 'assets/lib/swiperjs/swiper-bundle.min.js',
						'deps'  => array(),
						'ver'   => '',
						'args'  => array( 'in_footer' => true ),
					),
				),
			),
			// Add more libraries here (e.g., 'gsap' => array(...))
		)
    );

	return $libraries;
}

/**
 * Registers specific resources from the collection.
 *
 * @param array $args {
 * Optional. Array of resource keys to register.
 * @type array $css_id Nested array of [library_key => [resource_keys]].
 * @type array $js_id  Nested array of [library_key => [resource_keys]].
 * }
 */
function glassine_resources_registry( array $args = array() ) {
    $collection = get_glassine_resource_collection();

    // Set defaults and validate structure
    $args = wp_parse_args( $args, array(
        'css_id' => array(),
        'js_id'  => array(),
    ) );

    // Unified processing map: type => registration_function
    $processors = array(
        'css' => 'wp_register_style',
        'js'  => 'wp_register_script',
    );

    foreach ( $processors as $type => $register_func ) {
        $arg_key = "{$type}_id";

        if ( empty( $args[$arg_key] ) || ! is_array( $args[$arg_key] ) ) {
            continue;
        }

        foreach ( $args[$arg_key] as $lib_key => $resource_keys ) {
            // Validate library existence
            if ( ! isset( $collection[$lib_key][$type] ) ) {
                continue;
            }

            foreach ( (array) $resource_keys as $res_key ) {
                // Validate resource existence
                if ( ! isset( $collection[$lib_key][$type][$res_key] ) ) {
                    continue;
                }

                $item	= $collection[$lib_key][$type][$res_key];
				$handle = $item['id'];

				/**
				 * Duplication Prevention Checker
				 *
				 * Use the private utility to avoid duplicated registrations.
				 */
				if ( _glassine_is_asset_registered( $handle, $type ) ) {
					continue;
				}

                // Resolve Asset Data
                $data = _glassine_resolve_asset_data( $item );

                // Execute dynamic registration
                if ( $type === 'css' ) {
                    $register_func(
                        $item['id'],
                        $data['src'],
                        $item['deps'] ?? array(),
                        $data['ver'],
                        $item['media'] ?? 'all'
                    );
                } else {
                    $register_func(
                        $item['id'],
                        $data['src'],
                        $item['deps'] ?? array(),
                        $data['ver'],
                        $item['args'] ?? array()
                    );
                }
            }
        }
    }
}

/**
 * Internal helper to resolve source URLs and versioning.
 * Strictly handles the logic for pathing and cache-busting.
 *
 * @private
 */
function _glassine_resolve_asset_data( array $item ) {
    $src = $item['src'] ?? '';
    $is_external = str_starts_with( $src, 'http' ) || str_starts_with( $src, '//' );

    // Resolve URL
    $resolved_src = $is_external ? $src : plugins_url( $src, __FILE__ );

    // Resolve Version
    $ver = ! empty( $item['ver'] ) ? $item['ver'] : false;

    if ( ! $ver && ! $is_external ) {
        $file_path = plugin_dir_path( __FILE__ ) . $src;
        $ver = file_exists( $file_path ) ? filemtime( $file_path ) : '1.0.0';
    }

    return array(
        'src' => $resolved_src,
        'ver' => $ver ?: '1.0.0',
    );
}

/**
 * Checks if a specific asset (script or style) is already registered.
 *
 * @private
 * @param string $handle The asset handle ID.
 * @param string $type   Asset type: 'js' or 'css'.
 * @return bool True if registered, false otherwise.
 */
function _glassine_is_asset_registered( string $handle, string $type = 'js' ) : bool {
    return ( $type === 'css' )
        ? wp_style_is( $handle, 'registered' )
        : wp_script_is( $handle, 'registered' );
}

/**
 * Scans block settings for asset handles and maps them to library keys.
 * @private
 */
function _glassine_get_resources_from_manifest( array $settings ) : array {
    $collection = get_glassine_resource_collection();
    $results    = array( 'js_id' => array(), 'css_id' => array() );

    // Asset keys to scan in block.json / manifest
    $map = array(
        'js'  => array( 'editorScript', 'script', 'viewScript' ),
        'css' => array( 'editorStyle', 'style' )
    );

    foreach ( $map as $type => $manifest_keys ) {
        foreach ( $manifest_keys as $key ) {
            if ( empty( $settings[$key] ) ) continue;

            // Ensure we are working with an array (block.json allows strings)
            $assets = (array) $settings[$key];

            foreach ( $assets as $handle ) {
                // Skip local files (e.g., "file:./index.js")
                if ( is_string( $handle ) && str_starts_with( $handle, 'file:' ) ) {
                    continue;
                }

                /**
                 * Reverse Lookup: Find which library owns this handle.
                 * Example: Find that 'swiper-js' belongs to 'swiper' library.
                 */
                foreach ( $collection as $lib_key => $lib_data ) {
                    if ( ! isset( $lib_data[$type] ) ) continue;

                    foreach ( $lib_data[$type] as $res_key => $res_data ) {
                        if ( $res_data['id'] === $handle ) {
                            $results["{$type}_id"][$lib_key][] = $res_key;
                        }
                    }
                }
            }
        }
    }

    return $results;
}

/**
 * Registers the block using a `blocks-manifest.php` file, which improves the performance of block type registration.
 * Behind the scenes, it also registers all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://make.wordpress.org/core/2025/03/13/more-efficient-block-type-registration-in-6-8/
 * @see https://make.wordpress.org/core/2024/10/17/new-block-type-registration-apis-to-improve-performance-in-wordpress-6-7/
 */
function glassine_blocks_registry() {
	$manifest_path = __DIR__ . '/build/blocks-manifest.php';

	if ( ! file_exists( $manifest_path ) ) {
        return;
    }

	$manifest_data = require $manifest_path;

	/**
     * Resource Auto-Registration
	 *
     * Scan the manifest to see if any blocks require external library handles.
     */
    foreach ( $manifest_data as $block_settings ) {
        $required_resources = _glassine_get_resources_from_manifest( $block_settings );

        if ( ! empty( $required_resources['js_id'] ) || ! empty( $required_resources['css_id'] ) ) {
            glassine_resources_registry( $required_resources );
        }
    }

	/**
     * Block Registration
	 *
     * Standard WordPress 6.7/6.8 high-performance registration.
	 *
	 * Registers the block(s) metadata from the `blocks-manifest.php` and registers the block type(s)
	 * based on the registered block metadata.
	 * Added in WordPress 6.8 to simplify the block metadata registration process added in WordPress 6.7.
	 *
	 * @see https://make.wordpress.org/core/2025/03/13/more-efficient-block-type-registration-in-6-8/
     */
    if ( function_exists( 'wp_register_block_types_from_metadata_collection' ) ) {
        wp_register_block_types_from_metadata_collection( __DIR__ . '/build', $manifest_path );
        return;
    }

	/**
	 * Registers the block(s) metadata from the `blocks-manifest.php` file.
	 * Added to WordPress 6.7 to improve the performance of block type registration.
	 *
	 * @see https://make.wordpress.org/core/2024/10/17/new-block-type-registration-apis-to-improve-performance-in-wordpress-6-7/
	 */
	if ( function_exists( 'wp_register_block_metadata_collection' ) ) {
		wp_register_block_metadata_collection( __DIR__ . '/build', $manifest_path );
	}

	foreach ( array_keys( $manifest_data ) as $block_slug ) {
        register_block_type( __DIR__ . "/build/{$block_slug}" );
    }
}
add_action( 'init', 'glassine_blocks_registry' );
