# Invito — Luxury Digital Invitation Studio

Invito is a full-featured web application for creating, customizing, and sharing luxury digital wedding and festive invitations. Bootstrapped with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS, Invito provides couples with real-time interactive invitation websites, wax-seal envelope animations, ceremony countdown timers, RSVP tracking, matching stationery cards with QR codes, and self-contained offline export packages.

---

## Features

- **17 Cultural & Contemporary Templates**: Curated designs spanning South Indian, Christian Cathedral, Emerald Noor Nikah, Rajasthani Haveli, Imperial Promise (Engagement), Marigold Sunshine (Haldi), Henna Garden (Mehendi), Starlight Sangeet, Grand Ballroom Reception, Editorial Minimal, Coastal Serenade (Beach), Gilded Heritage (Vintage), Tamil Mangala Isai, Enchanted Fairytale, Bollywood Glamour, Baby Shower, and Bridal Shower.
- **Real-Time Interactive Editor (`/editor/[id]`)**: Customize couple names, event dates, venues, host names, Google Maps links, custom messages, couple/individual photos, and multi-event day itineraries.
- **Dynamic Template Preview Engine (`/api/preview`)**: Secure server-rendered iframe preview injecting live personalizations, day schedules, and custom media without raw user input vulnerabilities.
- **Wax-Seal Envelope Experience**: Interactive virtual envelope opening animation with wax seals welcoming guests.
- **Audio & Ambiance Toggle**: Built-in celebration music controller supporting custom background tracks.
- **Ceremony Countdown & Calendar Sync**: Live ticking countdown timer to the wedding day with instant **Add to Google Calendar** and **Apple/iCal** export.
- **Matching Stationery Cards & QR Code Studio (`/cards`)**: Generate matching printable stationery cards (Instagram Story and Square formats) with embedded QR codes that link directly to the couple's digital invitation. Instant Ultra-HD PNG and printable PDF export via `html2canvas` and `jspdf`.
- **Guest RSVP & Organizer Dashboard (`/dashboard`)**: Collect guest confirmations (attending count, dietary preferences, personal messages) and manage entries with status filtering and one-click CSV export.
- **Offline Package Bundling**: Download self-contained, standalone single-file HTML invitations or bundled ZIP packages via `jszip` and `file-saver`.
- **Integrated Payment Gateway (`/payment`, `/api/payments/*`)**: Native Razorpay checkout flow with secure backend order creation and HMAC SHA-256 signature verification.

---

## Template Showcase

| Temple Radiance (South Indian) | Cathedral Grace (Christian) | Emerald Noor Nikah (Islamic) |
| :---: | :---: | :---: |
| ![South Indian](public/templates/south-indian.png) | ![Christian](public/templates/christian.png) | ![Islamic](public/templates/islamic.png) |

| Haveli Splendor (Rajasthani) | Imperial Promise (Engagement) | Editorial Atelier (Minimal) |
| :---: | :---: | :---: |
| ![Rajasthani](public/templates/rajasthani.png) | ![Engagement](public/templates/engagement.png) | ![Minimal](public/templates/minimal.png) |

---

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router & Server Components)
- **UI Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/) & [PostCSS](https://postcss.org/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Export & Canvas**: [html2canvas](https://html2canvas.hertzen.com/), [jsPDF](https://github.com/parallax/jsPDF), [JSZip](https://stuk.github.io/jszip/), [file-saver](https://github.com/eligrey/FileSaver.js/)
- **QR Code**: [qrcode](https://github.com/soldair/node-qrcode)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Payments**: [Razorpay](https://razorpay.com/)

---

## Getting Started

### Prerequisites

- **Node.js**: v20.x or higher (tested on Node v20/v26)
- **npm**: v10.x or higher

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/nfsprogramming/Invito.git
   cd Invito
   ```

2. Install dependencies:
   ```bash
   npm ci
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` to configure your keys:
   ```env
   # Razorpay Configuration (optional for testing in mock mode)
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_placeholder
   RAZORPAY_KEY_SECRET=

   # Public App Base URL
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

### Development Server

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server with Webpack. |
| `npm run dev:turbo` | Starts the Next.js development server with Turbopack. |
| `npm run build` | Compiles and builds an optimized production deployment. |
| `npm run start` | Runs the compiled production server. |
| `npm run lint` | Runs ESLint 9 to analyze code quality and enforce conventions. |
| `npm run clean` | Cleans the local `.next` cache directory. |

---

## Project Structure

```text
Invito/
├── public/                 # Static assets, SVG icons, and template previews
│   └── templates/          # Preview images for all 17 invitation styles
├── scripts/                # Developer migration & template utility scripts
├── src/
│   ├── app/                # Next.js App Router pages and API routes
│   │   ├── api/            # Server endpoints (payments, template preview engine)
│   │   ├── cards/          # Stationery Card Studio page
│   │   ├── dashboard/      # RSVP tracking & management dashboard
│   │   ├── editor/[id]/    # Interactive invitation customization studio
│   │   ├── i/[slug]/       # Guest-facing standalone invitation view
│   │   ├── payment/        # Checkout & order confirmation
│   │   ├── preview/[id]/   # Fullscreen live invitation preview
│   │   ├── pricing/        # Pricing tiers & feature comparison
│   │   ├── templates/      # Template catalog with occasion/culture filters
│   │   ├── globals.css     # Global editorial styles and CSS variables
│   │   └── page.tsx        # Homepage & hero showcase
│   ├── components/         # Reusable React components & modals
│   │   ├── templates/      # Fallback React template components & renderer
│   │   ├── AIWordingAssistant.tsx
│   │   ├── CardGenerator.tsx
│   │   ├── CountdownTimer.tsx
│   │   ├── EnvelopeOpening.tsx
│   │   ├── GuestRSVPModal.tsx
│   │   └── Navbar.tsx
│   └── lib/                # Business logic, stores, templates, and export utilities
│       ├── calendar.ts     # ICS and Google Calendar date formatting
│       ├── cardExport.ts   # PNG/PDF client-side rasterization
│       ├── cardTemplates.ts# Matching card layout definitions
│       ├── export.ts       # Standalone HTML and ZIP packager
│       ├── store.ts        # Zustand persistent state for invitations & RSVPs
│       ├── templates.ts    # Central registry of templates and pricing tiers
│       └── templates/*.html# Full-fidelity HTML template source files
├── .env.example            # Sample environment variables
├── .gitignore              # Repository git ignore rules
├── LICENSE                 # MIT License
├── next.config.ts          # Next.js runtime configuration
├── package.json            # Dependencies and npm scripts
├── postcss.config.js       # PostCSS Tailwind plugins configuration
├── tailwind.config.js      # Custom theme, colors, and typography
└── tsconfig.json           # TypeScript configuration
```

---

## Production Build Verification

Invito is verified against production builds:

```bash
npm run build
```

Production output:
```text
Route (app)
┌ ○ /
├ ○ /_not-found
├ ƒ /api/payments/order
├ ƒ /api/payments/verify
├ ƒ /api/preview
├ ○ /cards
├ ○ /dashboard
├ ƒ /editor/[id]
├ ƒ /i/[slug]
├ ○ /payment
├ ƒ /preview/[id]
├ ○ /pricing
└ ○ /templates
```

---

## Limitations

- Payment processing requires active Razorpay API credentials (`NEXT_PUBLIC_RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`). In the absence of credentials, the API route returns a structured 503 response.
- RSVP submissions on the static build are persisted in the browser's local state (`zustand`/localStorage); connecting a persistent database (e.g. Supabase, PostgreSQL) is recommended for multi-device cross-synchronization.

---

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/new-template`).
3. Commit your changes.
4. Run `npm run lint` and `npm run build` to ensure all checks pass.
5. Push to the branch and open a Pull Request.

---

## License

This project is licensed under the [MIT License](LICENSE).
