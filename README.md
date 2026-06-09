# Cassly Jane & Mark Florence - Wedding Website

A beautiful, fully responsive wedding website built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- **Responsive Design** - Mobile-first approach with full desktop support
- **Live Countdown** - Real-time countdown to the wedding date
- **Image Gallery** - Masonry grid with lightbox modal
- **Guestbook** - Message submission with in-memory persistence
- **RSVP Form** - Comprehensive form with meal preferences and guest count
- **Entourage Directory** - Organized wedding party members
- **FAQ Section** - Accessible accordion with common questions
- **SEO Optimized** - Meta tags, sitemap, and robots.txt
- **Accessibility** - Semantic HTML, ARIA labels, keyboard navigation

## Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Fonts**: Geist (sans) + Playfair Display (serif)

## Getting Started

### Installation

1. Clone the repository or download the project
2. Install dependencies:
   \`\`\`bash
   pnpm install
   \`\`\`

3. Run the development server:
   \`\`\`bash
   pnpm dev
   \`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

\`\`\`bash
pnpm build
pnpm start
\`\`\`

## Project Structure

\`\`\`
├── app/
│   ├── layout.tsx           # Root layout with fonts
│   ├── page.tsx             # Home page with all sections
│   ├── globals.css          # Global styles and design tokens
│   ├── api/
│   │   ├── messages/        # Guestbook API
│   │   └── rsvp/            # RSVP API
│   ├── robots.ts            # SEO robots.txt
│   └── sitemap.ts           # SEO sitemap
├── components/
│   ├── navbar.tsx           # Navigation bar
│   ├── footer.tsx           # Footer
│   ├── button.tsx           # Button component
│   ├── card.tsx             # Card component
│   ├── section.tsx          # Section wrapper
│   └── sections/
│       ├── hero.tsx         # Hero section
│       ├── countdown.tsx    # Countdown timer
│       ├── narrative.tsx    # Love story with carousel
│       ├── gallery.tsx      # Photo gallery
│       ├── messages.tsx     # Guestbook
│       ├── details.tsx      # Ceremony & reception info
│       ├── entourage.tsx    # Wedding party
│       ├── rsvp.tsx         # RSVP form
│       ├── registry.tsx     # Gift registry
│       └── faq.tsx          # FAQ accordion
├── content/
│   └── site.ts              # Site configuration and data
├── lib/
│   └── utils.ts             # Utility functions
└── public/
    └── images/              # Wedding photos
\`\`\`

## Customization

### Update Wedding Details

Edit `content/site.ts` to update:
- Couple names
- Wedding date and time
- Venue information
- Ceremony and reception details
- Entourage members
- Gift note

### Update Colors

Edit `app/globals.css` to change the color scheme:
- `--primary`: Rustic Purple (#6A4C93)
- `--secondary`: Sage Green (#A8BDA8)

### Add Photos

Replace placeholder images in `/public/images/` with your own wedding photos:
- `garden-wedding-couple.jpg` - Hero background
- `couple-garden-moment.jpg` - Narrative carousel
- `couple-laughing-together.jpg` - Narrative carousel
- `couple-sunset-embrace.jpg` - Narrative carousel
- `gallery-1.jpg` through `gallery-6.jpg` - Gallery images

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project" and import your repository
4. Vercel will automatically detect Next.js and configure the build
5. Click "Deploy"

Your site will be live at `your-project.vercel.app`

### Environment Variables

No environment variables are required for the basic setup. The site uses in-memory storage for messages and RSVPs.

For production, consider:
- Adding a database (Supabase, Neon, etc.) for persistent storage
- Setting up email notifications for new RSVPs
- Adding analytics (Vercel Analytics is included)

## Features in Detail

### Countdown Timer
- Live countdown to December 3, 2025, 5:00 PM
- Updates every second
- Displays days, hours, minutes, and seconds

### Image Gallery
- Responsive masonry grid
- Lightbox modal for full-size viewing
- Smooth hover effects

### Guestbook
- Submit name and message
- Real-time display of messages
- Client and server validation

### RSVP Form
- Full name, email, phone fields
- Attendance confirmation
- Conditional fields (meal preference, guest count)
- Success/error feedback

### Entourage Directory
- Organized by role (Wedding Party, Ushers, Special Roles, Little Ones)
- Placeholder photo areas
- Responsive grid layout

### FAQ Accordion
- 8 common questions and answers
- Smooth expand/collapse animation
- Accessible keyboard navigation

## Performance Optimizations

- Image optimization with Next.js Image component
- CSS-in-JS with Tailwind for minimal bundle size
- Semantic HTML for better SEO
- Smooth scroll behavior
- Lazy loading for images

## Accessibility

- Semantic HTML elements
- ARIA labels and roles
- Keyboard navigation support
- High contrast colors
- Focus indicators on interactive elements
- Screen reader friendly

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is created for personal use. Feel free to customize and deploy!

## Support

For questions or issues, please contact the couple directly or refer to the FAQ section on the website.

---

Made with love for Cassly Jane & Mark Florence ❤️
