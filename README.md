# WellFood Restaurant Template - Component System

This project has been converted to use a component-based architecture for better maintainability and reusability.

## 🏗️ Project Structure

```
├── components/           # Reusable HTML components
│   ├── head.html        # HTML head section
│   ├── preloader.html   # Loading animation
│   ├── header.html      # Navigation header
│   ├── hidden-sidebar.html # Sidebar with appointment form
│   ├── page-banner.html # Page banner with breadcrumbs
│   ├── headline.html    # Scrolling marquee text
│   ├── footer.html      # Footer with newsletter and links
│   ├── scripts.html     # Common JavaScript files
│   └── contact-scripts.html # Contact form scripts
├── assets/              # Static assets (CSS, JS, images)
├── dist/               # Built/compiled files
├── build.js            # Advanced build script
├── simple-build.js     # Simple build script
└── package.json        # Node.js dependencies
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Build the project:
```bash
npm run build
```

3. Serve the built files:
```bash
npm run serve
```

## 🔧 Build Scripts

- `npm run build` - Build the project using the simple build script
- `npm run dev` - Build and watch for changes
- `npm run clean` - Clean the dist directory
- `npm run serve` - Serve the built files locally

## 📝 How to Use Components

### In HTML Files

Replace common sections with component placeholders:

```html
<!-- HEAD COMPONENT -->
<body>
    <div class="page-wrapper">
        <!-- PRELOADER COMPONENT -->
        <!-- HEADER COMPONENT -->
        
        <!-- Your page content here -->
        
        <!-- FOOTER COMPONENT -->
    </div>
    <!-- SCRIPTS COMPONENT -->
</body>
```

### Available Components

1. **HEAD COMPONENT** - HTML head section with meta tags and CSS links
2. **PRELOADER COMPONENT** - Loading animation
3. **HEADER COMPONENT** - Navigation header with logo and menu
4. **HIDDEN SIDEBAR COMPONENT** - Sidebar with appointment form
5. **PAGE BANNER COMPONENT** - Page banner with breadcrumbs (auto-excluded from home page)
6. **HEADLINE COMPONENT** - Scrolling marquee text
7. **FOOTER COMPONENT** - Footer with newsletter signup and links
8. **SCRIPTS COMPONENT** - Common JavaScript files
9. **CONTACT SCRIPTS COMPONENT** - Additional scripts for contact forms

## 🎯 Benefits

- **Maintainability**: Update components once, changes apply everywhere
- **Consistency**: Ensures all pages have the same header, footer, and structure
- **Efficiency**: Reduces code duplication
- **Scalability**: Easy to add new pages or modify existing ones

## 📁 File Organization

- **Source files**: Keep your original HTML files in the root directory
- **Components**: Store reusable components in the `components/` directory
- **Built files**: The build process creates optimized files in the `dist/` directory
- **Assets**: Static files (CSS, JS, images) are copied as-is to the dist directory

## 🔄 Workflow

1. Edit your HTML files and add component placeholders where needed
2. Modify components in the `components/` directory
3. Run `npm run build` to compile everything
4. Test the built files in the `dist/` directory

## 🛠️ Customization

To add new components:
1. Create a new HTML file in the `components/` directory
2. Add the component placeholder to your HTML files: `<!-- NEW_COMPONENT COMPONENT -->`
3. The build script will automatically include it

## 📋 Notes

- The build script automatically excludes the page banner from the home page (index.html)
- All assets are copied to the dist directory
- The build process preserves the original file structure
- Component placeholders are case-sensitive and must match exactly
