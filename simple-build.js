const fs = require("fs-extra");
const path = require("path");

class SimpleBuilder {
  constructor() {
    this.componentsDir = "components";
    this.distDir = "dist";
  }

  async build() {
    console.log("🚀 Starting simple build process...");

    try {
      // Clean and create dist directory
      await fs.remove(this.distDir);
      await fs.ensureDir(this.distDir);

      // Copy all files except components
      await this.copyFiles();

      // Load components
      const components = await this.loadComponents();

      // Process HTML files
      await this.processHtmlFiles(components);

      console.log("✅ Build completed successfully!");
    } catch (error) {
      console.error("❌ Build failed:", error);
    }
  }

  async copyFiles() {
    console.log("📁 Copying files...");

    const files = fs.readdirSync(".");
    for (const file of files) {
      if (
        file === "components" ||
        file === "dist" ||
        file === "node_modules" ||
        file.startsWith(".")
      ) {
        continue;
      }

      const stat = fs.statSync(file);
      if (stat.isDirectory()) {
        await fs.copy(file, path.join(this.distDir, file));
      } else {
        await fs.copy(file, path.join(this.distDir, file));
      }
    }
  }

  async loadComponents() {
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
      }
    }

    return components;
  }

  async processHtmlFiles(components) {
    console.log("📄 Processing HTML files...");

    const htmlFiles = fs
      .readdirSync(this.distDir)
      .filter((file) => file.endsWith(".html"));

    for (const file of htmlFiles) {
      console.log(`  Processing ${file}...`);
      let content = await fs.readFile(path.join(this.distDir, file), "utf8");

      // Replace component placeholders
      for (const [name, componentContent] of Object.entries(components)) {
        const placeholder = `<!-- ${name.toUpperCase()} COMPONENT -->`;
        content = content.replace(
          new RegExp(placeholder, "g"),
          componentContent
        );
      }

      // Handle special cases
      if (file === "index.html") {
        // Remove page banner for home page
        content = content.replace(
          /<!-- PAGE BANNER START -->[\s\S]*?<!-- PAGE BANNER END -->/g,
          ""
        );
      }

      await fs.writeFile(path.join(this.distDir, file), content);
    }
  }
}

// Run the builder
const builder = new SimpleBuilder();
builder.build();
