# 💎 Glassine

**Author:** Jasper Jardin

**Tags:** block

**Tested up to:** 6.7

**Stable tag:** 0.1.0

**License:** GPL-2.0-or-later

**License URI:** [https://www.gnu.org/licenses/gpl-2.0.html](https://www.gnu.org/licenses/gpl-2.0.html)

---

## 📖 Description

**Glassine** is a specialized WordPress plugin designed as a technical showcase for custom Gutenberg block development. Its primary feature is a modular **Testimonial Slider** block. This project demonstrates clean functional programming, an intuitive drag-and-drop editorial experience, and an optimized asset loading system that aligns with modern WordPress standards.

---

## ✨ Core Features: Testimonial Slider

* **🔄 Interactive Reordering**: Integrated `@dnd-kit` allows editors to drag and drop testimonials directly within the block editor for seamless management.
* **📱 Responsive Slider**: Powered by **Swiper.js** to provide a smooth, touch-enabled experience for frontend visitors.
* **🎨 Design Synchronization**: A custom color picker for accent elements (borders and author names) that updates the UI in real-time via CSS custom properties (`--accent-color`).
* **⚡ Performance First**: Implements a "Just-In-Time" asset strategy, ensuring that libraries like Swiper are only loaded when the block is actually rendered on a page.

---

## ⚙️ Development Environment

This project is built using a modern JavaScript toolchain to ensure compatibility with the latest WordPress block standards.

| Tool | Version |
| --- | --- |
| **Node.js** | `v22.14.0` 🟢 |
| **NPM** | `11.5.2` 📦 |

---

## 🛠 Asset Management & `glassine.php` Logic

The plugin features a custom asset registration system in `glassine.php` that prevents unnecessary site bloat by collaborating with the build-generated manifest.

### Key PHP Functions

* **`get_glassine_resource_collection()`**: Acts as the central repository for external libraries. It defines source paths, dependencies, and versions for assets like Swiper.
* **`glassine_resources_registry($resources)`**: Handles the actual `wp_register_script` and `wp_register_style` calls. It dynamically calculates versions using `filemtime` to bypass browser caching after updates.
* **`glassine_blocks_registry()`**: The logic coordinator. It reads the `blocks-manifest.php` (created during the NPM build) to identify which blocks require specific resources. If the slider needs `'swiper'`, this function ensures it is registered.
* **🏗️ WordPress Core Integration**: Uses `wp_register_block_types_from_metadata_collection` (introduced in WP 6.8). This allows WordPress to handle block registration with high performance, loading styles and scripts only when necessary.

---

## 📦 Dependency Ecosystem

### Technical Packages

| Package | Version | Purpose |
| --- | --- | --- |
| `swiper` | `^12.0.3` | The engine for the frontend slider and editor preview. |
| `@dnd-kit/core` | `^6.3.1` | Foundational logic for drag-and-drop events. |
| `@dnd-kit/sortable` | `^10.0.0` | Sorting strategies for the testimonial list items. |
| `@wordpress/scripts` | `^31.2.0` | The official build toolchain for compiling JS and SCSS. |

### Development Scripts

| Command | Action | Description |
| --- | --- | --- |
| `npm run start` | `wp-scripts start --blocks-manifest` | Compiles for development and watches for changes. |
| `npm run build` | `wp-scripts build --blocks-manifest` | Generates minified production assets and the PHP manifest. |
| `npm run lint:js` | `wp-scripts lint-js` | Checks JS files for coding standard compliance. |
| `npm run lint:css` | `wp-scripts lint-style` | Validates SCSS/CSS files for formatting and errors. |
| `npm run plugin-zip` | `wp-scripts plugin-zip` | Bundles the plugin into a distributable ZIP file. |

---

## 📂 Project Structure

* **`glassine.php`**: Plugin entry point and resource registration logic.
* **`block.json`**: Block metadata, attribute definitions, and script handles.
* **`edit.js`**: The React-based editor interface featuring the drag-and-drop context.
* **`view.js`**: The frontend entry point that boots the slider logic.
* **`GlassineTestimonialsSlider.js`**: A functional wrapper class for managing Swiper instances.
* **`style.scss`**: Frontend styles and CSS variable integration.

---

## 🚀 Installation

1. Upload the `glassine` folder to your `/wp-content/plugins/` directory.
2. Activate the plugin through the **Plugins** menu in WordPress.
3. Search for **Glassine Testimonials** in the Block Editor and start adding content.

---
