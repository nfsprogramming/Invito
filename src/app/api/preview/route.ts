import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { EDITOR_ENGINE_SCRIPT } from '@/lib/editorEngine';
import { getTemplateDefaultNames } from '@/lib/templates';

const TEMPLATE_IDS = new Set([
  'baby-shower', 'beach', 'bollywood', 'bridal-shower', 'christian',
  'engagement', 'fairytale', 'grand-reception', 'haldi-vibes', 'islamic',
  'mehendi-magic', 'minimal', 'rajasthani', 'sangeet-night', 'south-indian',
  'tamil', 'vintage',
]);

type PreviewData = Record<string, unknown>;

function text(value: unknown, maxLength: number): string {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function serializeForScript(value: unknown): string {
  return JSON.stringify(value).replace(/[<>&\u2028\u2029]/g, (character) => ({
    '<': '\\u003c',
    '>': '\\u003e',
    '&': '\\u0026',
    '\u2028': '\\u2028',
    '\u2029': '\\u2029',
  })[character] ?? character);
}

function buildPersonalizationScript(data: PreviewData, previewMode = false): string {
  const templateId = typeof data.templateId === 'string' ? data.templateId : '';
  const defaults = getTemplateDefaultNames(templateId);

  const invitation = {
    brideName: text(data.brideName, 80) || defaults.brideName,
    groomName: text(data.groomName, 80) || defaults.groomName,
    eventName: text(data.eventName, 100),
    eventDate: text(data.eventDate, 40),
    eventTime: text(data.eventTime, 40),
    venue: text(data.venue, 160),
    venueAddress: text(data.venueAddress, 200),
    customMessage: text(data.customMessage, 1000),
    hostNames: text(data.hostNames, 200),
    rsvpPhone: text(data.rsvpPhone, 40),
    couplePhoto: typeof data.couplePhoto === 'string' ? data.couplePhoto : '',
    groomPhoto: typeof data.groomPhoto === 'string' ? data.groomPhoto : '',
    bridePhoto: typeof data.bridePhoto === 'string' ? data.bridePhoto : '',
    story: text(data.story, 1500),
    dressCode: text(data.dressCode, 200),
    googleMapsUrl: text(data.googleMapsUrl, 400),
    events: Array.isArray(data.events) ? data.events : [],
    timerEnabled: data.timerEnabled !== false,
    timerDate: text(data.timerDate, 50),
  };

  return `<script>(function () {
    const invitation = ${serializeForScript(invitation)};
    
    // Safely replace placeholders in text nodes and attributes to prevent XSS
    function replacePlaceholders(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        if (node.nodeValue.includes('{{')) {
          node.nodeValue = node.nodeValue
            .replace(/{{brideName}}/gi, invitation.brideName)
            .replace(/{{groomName}}/gi, invitation.groomName)
            .replace(/{{eventName}}/gi, invitation.eventName || 'Wedding')
            .replace(/{{eventDate}}/gi, invitation.eventDate || 'Date')
            .replace(/{{eventTime}}/gi, invitation.eventTime || 'Time')
            .replace(/{{venue}}/gi, invitation.venue || 'Venue')
            .replace(/{{venueAddress}}/gi, invitation.venueAddress || 'Address')
            .replace(/{{hostNames}}/gi, invitation.hostNames || 'Families')
            .replace(/{{rsvpPhone}}/gi, invitation.rsvpPhone || 'RSVP')
            .replace(/{{customMessage}}/gi, invitation.customMessage || 'Message');
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE') {
          Array.from(node.attributes).forEach(attr => {
            if (attr.value.includes('{{')) {
              attr.value = attr.value
                .replace(/{{brideName}}/gi, invitation.brideName)
                .replace(/{{groomName}}/gi, invitation.groomName)
                .replace(/{{eventName}}/gi, invitation.eventName || 'Wedding')
                .replace(/{{eventDate}}/gi, invitation.eventDate || 'Date')
                .replace(/{{eventTime}}/gi, invitation.eventTime || 'Time')
                .replace(/{{venue}}/gi, invitation.venue || 'Venue')
                .replace(/{{venueAddress}}/gi, invitation.venueAddress || 'Address')
                .replace(/{{hostNames}}/gi, invitation.hostNames || 'Families')
                .replace(/{{rsvpPhone}}/gi, invitation.rsvpPhone || 'RSVP')
                .replace(/{{customMessage}}/gi, invitation.customMessage || 'Message');
            }
          });
          node.childNodes.forEach(replacePlaceholders);
        }
      }
    }
    
    replacePlaceholders(document.documentElement);

    const names = [invitation.groomName, invitation.brideName].filter(Boolean).join(' & ');
    if (names) document.title = names + (invitation.eventName ? ' — ' + invitation.eventName : ' — Invitation');
    
    // Dynamic Event Cards Generator
    if (invitation.events && invitation.events.length > 0) {
      const eventCardClasses = ['.event-card', '.itinerary-item', '.timeline-item', '.detail-card', '.family-card', '.venue-card', '.program-item', '.flip-card'];
      let blueprint = null;
      let container = null;
      
      for (const selector of eventCardClasses) {
        const el = document.querySelector(selector);
        if (el) {
          const parent = el.closest('#events, #itinerary, .events, .timeline, #timeline, .program, .events-grid');
          if (parent) {
             blueprint = el.cloneNode(true);
             container = el.parentElement;
             break;
          }
        }
      }
      
      if (blueprint && container) {
        container.innerHTML = ''; // Clear hardcoded events
        
        const titleSelectors = ['.event-card-name', '.event-title', '.event-name', '.timeline-title', '.title', 'h3', 'h4'];
        const dateSelectors = ['.event-card-date', '.event-date', '.timeline-date', '.date', '.detail-date'];
        const timeSelectors = ['.event-card-time', '.event-time', '.timeline-time', '.time', '.detail-time'];
        const venueSelectors = ['.event-card-venue', '.event-venue', '.timeline-venue', '.venue', '.location', '.detail-location'];
        
        invitation.events.forEach((ev, index) => {
          const card = blueprint.cloneNode(true);
          
          const updateField = (selectors, value) => {
            if (!value) return;
            for (const sel of selectors) {
              const el = card.querySelector(sel);
              if (el) {
                el.textContent = value;
                return;
              }
            }
          };
          
          updateField(titleSelectors, ev.name);
          updateField(dateSelectors, ev.date);
          updateField(timeSelectors, ev.time);
          updateField(venueSelectors, ev.venue);
          
          // Try to update day badge if it exists
          const badge = card.querySelector('.event-card-badge, .timeline-badge, .day-badge, .event-tag');
          if (badge) badge.textContent = 'Day ' + (index + 1);
          
          container.appendChild(card);
        });
      }
    }
    
    function applyPhotoToElement(el, photoUrl) {
      if (!el || !photoUrl) return;
      if (el.tagName === 'IMG') {
        el.src = photoUrl;
      } else {
        el.style.backgroundImage = 'url(' + photoUrl + ')';
        el.style.backgroundSize = 'cover';
        el.style.backgroundPosition = 'center';
        el.innerHTML = '';
        el.classList.add('has-custom-photo');
      }
    }

    if (invitation.couplePhoto || invitation.groomPhoto || invitation.bridePhoto) {
      const style = document.createElement('style');
      style.textContent = '.has-custom-photo::before, .has-custom-photo::after { color: transparent !important; -webkit-text-fill-color: transparent !important; }';
      document.head.appendChild(style);
    }

    // Apply Groom Photo if provided
    if (invitation.groomPhoto) {
      const groomSelectors = '[data-person="groom"], #groom-placeholder, #frame-groom .frame-photo-placeholder, .groom-photo, [data-groom-photo], .person-card:first-of-type .photo-placeholder, .person-card:first-of-type .photo-frame, #frame-groom';
      document.querySelectorAll(groomSelectors).forEach((el) => {
        applyPhotoToElement(el, invitation.groomPhoto);
      });
    }

    // Apply Bride Photo if provided
    if (invitation.bridePhoto) {
      const brideSelectors = '[data-person="bride"], #bride-placeholder, #frame-bride .frame-photo-placeholder, .bride-photo, [data-bride-photo], .person-card:last-of-type .photo-placeholder, .person-card:last-of-type .photo-frame, #frame-bride';
      document.querySelectorAll(brideSelectors).forEach((el) => {
        applyPhotoToElement(el, invitation.bridePhoto);
      });
    }

    // Apply Couple Photo if provided
    if (invitation.couplePhoto) {
      const coupleSelectors = '.couple-photo img, .hero-photo, .photo-area, .couple-photo-placeholder, [data-invito-photo], [data-couple-photo]';
      document.querySelectorAll(coupleSelectors).forEach((el) => {
        applyPhotoToElement(el, invitation.couplePhoto);
      });

      // If separate photos are NOT provided, also fallback couple photo to person placeholders
      if (!invitation.groomPhoto && !invitation.bridePhoto) {
        document.querySelectorAll('.photo-placeholder, .frame-photo-placeholder, .polaroid-photo').forEach((el) => {
          applyPhotoToElement(el, invitation.couplePhoto);
        });
      }
    }

    // Inject Timer Configuration
    const timerScript = document.createElement('script');
    timerScript.textContent = "window.INVITO_TIMER_ENABLED = " + (invitation.timerEnabled !== false) + "; window.INVITO_TIMER_DATE = '" + (invitation.timerDate || '') + "';";
    document.head.appendChild(timerScript);

  }());</script>
  ${!previewMode ? `<script>${EDITOR_ENGINE_SCRIPT}</script>` : ''}
  `;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { templateId, data, previewMode } = body as { templateId?: unknown; data?: PreviewData; previewMode?: boolean };

    if (typeof templateId !== 'string' || !TEMPLATE_IDS.has(templateId)) {
      return NextResponse.json({ error: 'Missing templateId' }, { status: 400 });
    }

    // Securely resolve the template file path
    const templatePath = path.join(process.cwd(), 'src', 'lib', 'templates', `${templateId}.html`);

    if (!fs.existsSync(templatePath)) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    let html = fs.readFileSync(templatePath, 'utf8');
    const invitation = data ?? {};

    // Handle Countdown Timer
    if (invitation.timerEnabled !== false && invitation.timerDate) {
      html = html.replace(/new Date\(['"][^'"]+['"]\)\.getTime\(\)/g, `new Date('${invitation.timerDate}').getTime()`);
    } else if (invitation.timerEnabled === false) {
      html = html.replace('</head>', '<style>#countdown, .countdown, .countdown-wrapper, .countdown-section { display: none !important; }</style></head>');
    }

    // Clean, borderless scrollbars and safe-area margins for luxury mobile simulator experience across all templates
    const previewStyles = `
    <style id="invito-preview-enhancements">
      html, body {
        scrollbar-width: none !important;
        -ms-overflow-style: none !important;
      }
      ::-webkit-scrollbar {
        width: 0px !important;
        height: 0px !important;
        display: none !important;
      }
      /* Prevent hero headers and footers from hitting the top notch / dynamic island and bottom curves */
      @media (max-width: 640px) {
        body {
          padding-top: max(env(safe-area-inset-top, 0px), 36px) !important;
          padding-bottom: max(env(safe-area-inset-bottom, 0px), 32px) !important;
          box-sizing: border-box !important;
        }
        /* Ensure fixed elements like audio toggles respect top safe padding */
        .audio-toggle, .audio-control, #audio-toggle, #music-toggle, .music-btn {
          top: 44px !important;
        }
        /* Ensure sections with fixed 100vh can gracefully grow with content on mobile */
        section, .hero, #hero {
          min-height: 100vh !important;
          height: auto !important;
        }
      }
    </style>
    `;
    html = html.replace('</head>', `${previewStyles}</head>`);

    // Templates are static source files. Personalize them in the iframe using textContent,
    // avoiding raw user input in HTML or CSS.
    html = html.replace('</body>', `${buildPersonalizationScript(data ?? {}, previewMode)}</body>`);
    
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-store',
      },
    });

  } catch (error) {
    console.error('Preview rendering error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
