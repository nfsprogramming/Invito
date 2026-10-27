import JSZip from "jszip";
import { saveAs } from "file-saver";
import { InvitationData } from "@/lib/store";

/**
 * Fetches the actual high-fidelity HTML template from the backend
 * to ensure the downloaded version perfectly matches the preview.
 */
async function fetchTemplateHTML(data: InvitationData): Promise<string> {
  try {
    const response = await fetch('/api/preview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ templateId: data.templateId, data })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to generate template: ${response.statusText}`);
    }
    
    return await response.text();
  } catch (error) {
    console.error("Failed to fetch template HTML:", error);
    throw new Error("Could not generate the exact template. Please try again.");
  }
}

/** Download a single HTML file */
export async function downloadHTML(data: InvitationData): Promise<void> {
  const html = await fetchTemplateHTML(data);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  saveAs(blob, `invito-${data.brideName}-${data.groomName}.html`.replace(/\s+/g, "-").toLowerCase());
}

/** Download a ZIP with HTML + README */
export async function downloadZIP(data: InvitationData): Promise<void> {
  const zip = new JSZip();
  const html = await fetchTemplateHTML(data);
  const filename = `invito-${data.brideName}-${data.groomName}`.replace(/\s+/g, "-").toLowerCase();

  zip.file(`${filename}.html`, html);
  zip.file(
    "README.txt",
    `Invito – Your Digital Invitation
==================================
Names  : ${data.brideName} & ${data.groomName}
Event  : ${data.eventName}
Date   : ${data.eventDate}
Venue  : ${data.venue}

To use:
1. Open the .html file in any modern browser
2. Share the file or host it on any static host (GitHub Pages, Netlify, etc.)

© 2025 Invito · invito.app`
  );

  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, `${filename}.zip`);
}
