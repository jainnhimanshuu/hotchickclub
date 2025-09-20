const fs = require("fs-extra");
const path = require("path");

class HotChickBuilder {
  constructor() {
    this.componentsDir = "components";
    this.distDir = "dist";
    // Only process these 4 core pages
    this.corePages = ["index.html", "menu.html", "about.html", "contact.html"];
  }

  async build() {
    console.log("🚀 Starting Hot Chick Club build process...");
    console.log("📄 Building only 4 core pages:", this.corePages.join(", "));

    try {
      // Clean and create dist directory
      await fs.remove(this.distDir);
      await fs.ensureDir(this.distDir);

      // Copy only necessary files
      await this.copyAssets();

      // Load components
      const components = await this.loadComponents();

      // Process only the 4 core HTML files
      await this.processCorePages(components);

      console.log("✅ Hot Chick Club build completed successfully!");
      console.log("🎯 Built pages:", this.corePages.join(", "));
    } catch (error) {
      console.error("❌ Build failed:", error);
    }
  }

  async copyAssets() {
    console.log("📁 Copying assets...");

    // Copy assets directory
    if (await fs.pathExists("assets")) {
      await fs.copy("assets", path.join(this.distDir, "assets"));
    }

    // Copy only the 4 core HTML files
    for (const page of this.corePages) {
      if (await fs.pathExists(page)) {
        await fs.copy(page, path.join(this.distDir, page));
        console.log(`  📄 Copied ${page}`);
      }
    }

    // Copy other necessary files
    const otherFiles = ["package.json", "README.md"];
    for (const file of otherFiles) {
      if (await fs.pathExists(file)) {
        await fs.copy(file, path.join(this.distDir, file));
      }
    }
  }

  async loadComponents() {
    console.log("🧩 Loading components...");
    const components = {};
    const componentFiles = fs.readdirSync(this.componentsDir);

    for (const file of componentFiles) {
      if (file.endsWith(".html")) {
        const name = file.replace(".html", "");
        const content = await fs.readFile(
          path.join(this.componentsDir, file),
          "utf8"
        );
        components[name] = content;
        console.log(`  🧩 Loaded ${name} component`);
      }
    }

    return components;
  }

  async processCorePages(components) {
    console.log("⚙️ Processing core pages...");

    for (const page of this.corePages) {
      console.log(`  🔧 Processing ${page}...`);
      let content = await fs.readFile(path.join(this.distDir, page), "utf8");

      // Replace component placeholders
      for (const [name, componentContent] of Object.entries(components)) {
        const placeholder = `<!-- ${name.toUpperCase()} COMPONENT -->`;
        content = content.replace(
          new RegExp(placeholder, "g"),
          componentContent
        );
      }

      // Handle special component names
      const specialReplacements = {
        head: "HEAD",
        preloader: "PRELOADER",
        header: "HEADER",
        "hidden-sidebar": "HIDDEN SIDEBAR",
        footer: "FOOTER",
        scripts: "SCRIPTS",
      };

      for (const [name, componentContent] of Object.entries(components)) {
        const placeholder = `<!-- ${
          specialReplacements[name] || name.toUpperCase()
        } COMPONENT -->`;
        content = content.replace(
          new RegExp(placeholder, "g"),
          componentContent
        );
      }

      // Handle special cases
      if (page === "index.html") {
        // Remove page banner for home page
        content = content.replace(
          /<!-- PAGE BANNER START -->[\s\S]*?<!-- PAGE BANNER END -->/g,
          ""
        );
      } else {
        // Add page banner for other pages
        const pageBanner = components["page-banner"];
        if (pageBanner) {
          const pageTitle = this.getPageTitle(page);
          const breadcrumb = this.getBreadcrumb(page);
          const bannerWithData = pageBanner
            .replace("{{page_title}}", pageTitle)
            .replace("{{breadcrumb}}", breadcrumb);

          content = content.replace(
            /<!-- PAGE BANNER START -->[\s\S]*?<!-- PAGE BANNER END -->/g,
            bannerWithData
          );
        }
      }

      await fs.writeFile(path.join(this.distDir, page), content);
      console.log(`  ✅ Processed ${page}`);
    }
  }

  getPageTitle(filePath) {
    const titles = {
      "menu.html": "Our Menu",
      "about.html": "About Us",
      "contact.html": "Contact Us",
    };
    return titles[filePath] || "Page";
  }

  getBreadcrumb(filePath) {
    const breadcrumbs = {
      "menu.html": "Menu",
      "about.html": "About Us",
      "contact.html": "Contact Us",
    };
    return breadcrumbs[filePath] || "Page";
  }
}

// Run the builder
const builder = new HotChickBuilder();
builder.build();
