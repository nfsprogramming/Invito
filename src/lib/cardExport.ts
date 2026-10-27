import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { saveAs } from "file-saver";
import QRCode from "qrcode";
import { InvitationData } from "./store";
import { CardTemplate, CardExportFormat } from "./cardTemplates";

/**
 * Generate QR code for the invitation website
 */
export async function generateQRCode(url: string): Promise<string> {
  try {
    return await QRCode.toDataURL(url, {
      width: 200,
      margin: 1,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });
  } catch (error) {
    console.error("QR Code generation failed:", error);
    return "";
  }
}

/**
 * Export card as PNG image
 */
export async function exportCardAsPNG(
  element: HTMLElement,
  filename: string
): Promise<void> {
  try {
    const canvas = await html2canvas(element, {
      scale: 2, // Higher resolution
      useCORS: true,
      backgroundColor: null,
      logging: false,
    });

    canvas.toBlob((blob) => {
      if (blob) {
        saveAs(blob, `${filename}.png`);
      }
    });
  } catch (error) {
    console.error("PNG export failed:", error);
    throw new Error("Failed to export card as PNG");
  }
}

/**
 * Export card as PDF
 */
export async function exportCardAsPDF(
  element: HTMLElement,
  filename: string
): Promise<void> {
  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
      logging: false,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? "landscape" : "portrait",
      unit: "px",
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error("PDF export failed:", error);
    throw new Error("Failed to export card as PDF");
  }
}

/**
 * Export card for Instagram (1:1 square)
 */
export async function exportCardForInstagram(
  element: HTMLElement,
  filename: string
): Promise<void> {
  try {
    const canvas = await html2canvas(element, {
      scale: 3, // Higher resolution for Instagram
      useCORS: true,
      backgroundColor: null,
      logging: false,
    });

    // Ensure 1:1 aspect ratio by cropping
    const size = Math.min(canvas.width, canvas.height);
    const croppedCanvas = document.createElement("canvas");
    croppedCanvas.width = size;
    croppedCanvas.height = size;
    const ctx = croppedCanvas.getContext("2d");

    if (ctx) {
      const offsetX = (canvas.width - size) / 2;
      const offsetY = (canvas.height - size) / 2;
      ctx.drawImage(canvas, offsetX, offsetY, size, size, 0, 0, size, size);
    }

    croppedCanvas.toBlob((blob) => {
      if (blob) {
        saveAs(blob, `${filename}-instagram.png`);
      }
    });
  } catch (error) {
    console.error("Instagram export failed:", error);
    throw new Error("Failed to export card for Instagram");
  }
}

/**
 * Export card for Instagram Story (9:16)
 */
export async function exportCardForStory(
  element: HTMLElement,
  filename: string
): Promise<void> {
  try {
    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      backgroundColor: null,
      logging: false,
    });

    // Ensure 9:16 aspect ratio
    const targetWidth = 1080;
    const targetHeight = 1920;
    const scaledCanvas = document.createElement("canvas");
    scaledCanvas.width = targetWidth;
    scaledCanvas.height = targetHeight;
    const ctx = scaledCanvas.getContext("2d");

    if (ctx) {
      // Fill background
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, targetWidth, targetHeight);

      // Calculate scaling to fit within 9:16
      const scale = Math.min(targetWidth / canvas.width, targetHeight / canvas.height);
      const scaledWidth = canvas.width * scale;
      const scaledHeight = canvas.height * scale;
      const offsetX = (targetWidth - scaledWidth) / 2;
      const offsetY = (targetHeight - scaledHeight) / 2;

      ctx.drawImage(canvas, offsetX, offsetY, scaledWidth, scaledHeight);
    }

    scaledCanvas.toBlob((blob) => {
      if (blob) {
        saveAs(blob, `${filename}-story.png`);
      }
    });
  } catch (error) {
    console.error("Story export failed:", error);
    throw new Error("Failed to export card for Story");
  }
}

/**
 * Main export function that routes to specific format
 */
export async function exportCard(
  element: HTMLElement,
  format: CardExportFormat,
  filename: string
): Promise<void> {
  switch (format) {
    case "png":
      await exportCardAsPNG(element, filename);
      break;
    case "pdf":
      await exportCardAsPDF(element, filename);
      break;
    case "instagram":
      await exportCardForInstagram(element, filename);
      break;
    case "story":
      await exportCardForStory(element, filename);
      break;
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
}
