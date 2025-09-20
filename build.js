const fs = require("fs-extra");
const path = require("path");
const glob = require("glob");

class WellFoodBuilder {
  constructor() {
    this.sourceDir = ".";
    this.distDir = "dist";
    this.componentsDir = "components";
    this.watchMode = process.argv.includes("--watch");
  }

  async build() {
    console.log("🚀 Starting WellFood build process...");

    try {
      // Clean dist directory
      await this.cleanDist();

      // Copy static assets
      await this.copyAssets();

      // Process HTML files
      await this.processHtmlFiles();

      console.log("✅ Build completed successfully!");

      if (this.watchMode) {
        console.log("👀 Watching for changes...");
        this.watchFiles();
      }
    } catch (error) {
      console.error("❌ Build failed:", error);
      process.exit(1);
    }
  }

  async cleanDist() {
    console.log("🧹 Cleaning dist directory...");
    await fs.remove(this.distDir);
    await fs.ensureDir(this.distDir);
  }

  async copyAssets() {
    console.log("📁 Copying assets...");

    const assetDirs = ["assets"];
    const filesToCopy = ["*.html", "*.txt", "*.md"];

    // Copy asset directories
    for (const dir of assetDirs) {
      if (await fs.pathExists(dir)) {
        await fs.copy(dir, path.join(this.distDir, dir));
      }
    }

    // Copy root files
    for (const pattern of filesToCopy) {
      const files = glob.sync(pattern, {
        ignore: ["node_modules/**", "dist/**", "components/**"],
      });
      for (const file of files) {
        await fs.copy(file, path.join(this.distDir, file));
      }
    }
  }

  async processHtmlFiles() {
    console.log("📄 Processing HTML files...");

    const htmlFiles = glob.sync("*.html", {
      ignore: ["dist/**", "components/**"],
    });

    for (const file of htmlFiles) {
      console.log(`  Processing ${file}...`);
      const content = await this.processHtmlFile(file);
      await fs.writeFile(path.join(this.distDir, file), content);
    }
  }

  async processHtmlFile(filePath) {
    let content = await fs.readFile(filePath, "utf8");

    // Load components
    const components = await this.loadComponents();

    // Replace component placeholders
    for (const [name, componentContent] of Object.entries(components)) {
      const placeholder = `<!-- ${name.toUpperCase()} COMPONENT -->`;
      if (content.includes(placeholder)) {
        content = content.replace(placeholder, componentContent);
      }
    }

    // Handle special cases for different page types
    if (filePath === "index.html") {
      // Home page - no page banner
      content = content.replace(
        /<!-- PAGE BANNER START -->[\s\S]*?<!-- PAGE BANNER END -->/g,
        ""
      );
    } else {
      // Other pages - include page banner
      const pageBanner = components["page-banner"];
      if (pageBanner) {
        const pageTitle = this.getPageTitle(filePath);
        const breadcrumb = this.getBreadcrumb(filePath);
        const bannerWithData = pageBanner
          .replace("{{page_title}}", pageTitle)
          .replace("{{breadcrumb}}", breadcrumb);

        content = content.replace(
          /<!-- PAGE BANNER START -->[\s\S]*?<!-- PAGE BANNER END -->/g,
          bannerWithData
        );
      }
    }

    // Handle headline components with different classes
    content = this.processHeadlines(content);

    return content;
  }

  async loadComponents() {
    const components = {};
    const componentFiles = glob.sync(path.join(this.componentsDir, "*.html"));

    for (const file of componentFiles) {
      const name = path.basename(file, ".html");
      const content = await fs.readFile(file, "utf8");
      components[name] = content;
    }

    return components;
  }

  processHeadlines(content) {
    // Replace headline placeholders with appropriate classes
    const headlineReplacements = [
      {
        pattern: /<!-- HEADLINE COMPONENT -->/g,
        replacement: components["headline"] || "",
      },
      {
        pattern: /<!-- HEADLINE COMPONENT - BLACK -->/g,
        replacement: (components["headline"] || "")
          .replace("{{headline_class}}", "bgc-black pt-120 rpt-90")
          .replace("{{marquee_class}}", "white-text"),
      },
      {
        pattern: /<!-- HEADLINE COMPONENT - LIGHTER -->/g,
        replacement: (components["headline"] || "")
          .replace("{{headline_class}}", "bgc-lighter pt-120 rpt-90")
          .replace("{{marquee_class}}", ""),
      },
    ];

    for (const { pattern, replacement } of headlineReplacements) {
      content = content.replace(pattern, replacement);
    }

    return content;
  }

  getPageTitle(filePath) {
    const titles = {
      "about.html": "About company",
      "contact.html": "Contact us",
      "menu-restaurant.html": "Menu Restaurant",
      "menu-pizza.html": "Menu Pizza",
      "menu-burger.html": "Menu Burger",
      "menu-grill.html": "Menu Grill",
      "menu-chicken.html": "Menu Chicken",
      "menu-sea-food.html": "Menu Sea Food",
      "chefs.html": "Our Chefs",
      "chef-details.html": "Chef Details",
      "gallery.html": "Gallery",
      "blog.html": "Blog",
      "blog-details.html": "Blog Details",
      "shop.html": "Shop",
      "product-details.html": "Product Details",
      "cart.html": "Shopping Cart",
      "checkout.html": "Checkout",
      "faq.html": "FAQ",
      "history.html": "Our History",
    };

    return titles[filePath] || "Page";
  }

  getBreadcrumb(filePath) {
    const breadcrumbs = {
      "about.html": "About Us",
      "contact.html": "Contact us",
      "menu-restaurant.html": "Menu Restaurant",
      "menu-pizza.html": "Menu Pizza",
      "menu-burger.html": "Menu Burger",
      "menu-grill.html": "Menu Grill",
      "menu-chicken.html": "Menu Chicken",
      "menu-sea-food.html": "Menu Sea Food",
      "chefs.html": "Our Chefs",
      "chef-details.html": "Chef Details",
      "gallery.html": "Gallery",
      "blog.html": "Blog",
      "blog-details.html": "Blog Details",
      "shop.html": "Shop",
      "product-details.html": "Product Details",
      "cart.html": "Shopping Cart",
      "checkout.html": "Checkout",
      "faq.html": "FAQ",
      "history.html": "Our History",
    };

    return breadcrumbs[filePath] || "Page";
  }

  watchFiles() {
    const watchPatterns = ["*.html", "components/**/*.html", "assets/**/*"];

    watchPatterns.forEach((pattern) => {
      glob.watch(pattern, (err, files) => {
        if (err) return;
        console.log(`📝 Files changed: ${files.join(", ")}`);
        this.build();
      });
    });
  }
}

// Run the builder
const builder = new WellFoodBuilder();
builder.build();
