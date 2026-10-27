/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, '../src/lib/templates');

// Map of hardcoded strings in the user's templates to our standard placeholders
const replacements = [
  { search: /Nathaniel/g, replace: '{{groomName}}' },
  { search: /Evangeline/g, replace: '{{brideName}}' },
  { search: /XVI · OCTOBER · MMXXV/g, replace: '{{eventDate}}' },
  { search: /Saturday, October 16/gi, replace: '{{eventDate}}' },
  { search: /St\. Gabriel's Cathedral/g, replace: '{{venue}}' },
  { search: /Mr\. & Mrs\. Augustus Harrington/g, replace: '{{groomParents}}' },
  { search: /Mr\. & Mrs\. Cornelius Whitfield/g, replace: '{{brideParents}}' },
  // Adding some fallbacks for other templates if they use different names
  { search: /Aditya/g, replace: '{{groomName}}' },
  { search: /Priya/g, replace: '{{brideName}}' },
  { search: /Arjun/gi, replace: '{{groomName}}' },
  { search: /Kavya/gi, replace: '{{brideName}}' },
  { search: /14 FEBRUARY 2025/gi, replace: '{{eventDate}}' },
  { search: /14\s+FEBRUARY\s+2025/gi, replace: '{{eventDate}}' },
  // Missing names from templates
  { search: /Aiden/gi, replace: '{{groomName}}' },
  { search: /Sophia/gi, replace: '{{brideName}}' },
  { search: /Ethan/gi, replace: '{{groomName}}' },
  { search: /Elara/gi, replace: '{{brideName}}' },
  { search: /Caspian/gi, replace: '{{groomName}}' },
  { search: /Gautam/gi, replace: '{{groomName}}' },
  { search: /Bhavna/gi, replace: '{{brideName}}' },
  { search: /Zaid/gi, replace: '{{groomName}}' },
  { search: /Amira/gi, replace: '{{brideName}}' },
];

function processTemplates() {
  if (!fs.existsSync(templatesDir)) {
    console.error(`Directory not found: ${templatesDir}`);
    return;
  }

  const files = fs.readdirSync(templatesDir).filter(f => f.endsWith('.html'));

  files.forEach(file => {
    const filePath = path.join(templatesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    let modified = false;
    replacements.forEach(({ search, replace }) => {
      if (search.test(content)) {
        content = content.replace(search, replace);
        modified = true;
      }
    });

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated placeholders in: ${file}`);
    } else {
      console.log(`No matching hardcoded text found in: ${file}`);
    }
  });
}

processTemplates();
