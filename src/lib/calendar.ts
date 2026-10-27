import { saveAs } from "file-saver";

export interface CalendarEventParams {
  title: string;
  description: string;
  location: string;
  startDate: string; // YYYY-MM-DD
  startTime?: string; // HH:MM AM/PM
}

function formatICalDate(dateStr: string, timeStr?: string): string {
  try {
    const cleanDate = dateStr.replace(/-/g, "");
    return `${cleanDate}T090000Z`;
  } catch {
    return "20261128T090000Z";
  }
}

export function getGoogleCalendarUrl(params: CalendarEventParams): string {
  const start = formatICalDate(params.startDate, params.startTime);
  const end = formatICalDate(params.startDate, params.startTime); // same day or +3 hours

  const query = new URLSearchParams({
    action: "TEMPLATE",
    text: params.title,
    dates: `${start}/${end}`,
    details: params.description,
    location: params.location,
  });

  return `https://calendar.google.com/calendar/render?${query.toString()}`;
}

export function downloadICSFile(params: CalendarEventParams): void {
  const start = formatICalDate(params.startDate, params.startTime);
  const end = formatICalDate(params.startDate, params.startTime);

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Invito Studio//Digital Invitation//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `SUMMARY:${params.title}`,
    `DESCRIPTION:${params.description}`,
    `LOCATION:${params.location}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  saveAs(blob, `${params.title.replace(/\s+/g, "-").toLowerCase()}.ics`);
}
