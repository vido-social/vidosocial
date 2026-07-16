# VIDO Social — Kotisivut ja markkinointi

**Anti-toimisto rakennus- ja talotekniikka-alalle**

Digital marketing agency website built for construction, HVAC, electrical, and renovation companies in Finland.

- 🌍 **Website:** https://vidosocial.com
- 🏢 **Y-tunnus:** 3581471-7
- 📧 **Contact:** ville@vidosocial.com

---

## 🏗️ Project Structure

```
vidosocial/
├── index.html                   # Homepage (main landing page)
├── tietosuoja.html              # Privacy policy (Tietosuojaseloste)
├── 404.html                     # Error page
├── public/
│   ├── css/
│   │   ├── variables.css        # CSS custom properties & design tokens
│   │   ├── layout.css           # Grid, spacing, container styles
│   │   ├── components.css       # Buttons, cards, modals
│   │   ├── forms.css            # Form inputs & validation
│   │   ├── animations.css       # Transitions & reveal effects
│   │   └── responsive.css       # Media queries & breakpoints
│   ├── js/
│   │   ├── app.js               # Main app initialization
│   │   ├── form.js              # Form handling & validation
│   │   ├── modals.js            # Modal management
│   │   └── observer.js          # Intersection observer for animations
│   └── images/
│       └── og-image.png         # Social media preview image
├── api/
│   └── contact.js               # Vercel serverless function (email handler)
├── favicon.svg                  # Site icon
├── site.webmanifest             # PWA manifest
├── robots.txt                   # SEO crawler rules
├── vercel.json                  # Vercel deployment config
├── package.json                 # Project metadata
└── .gitignore                   # Git ignore rules
```

---

## 🚀 Getting Started

### Local Development

No build step required — just open `index.html` in your browser or use a local server:

```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server

# Then open: http://localhost:8000
```

### Deployment

Deployed automatically to **Vercel** on push to `main` branch.

```bash
# Manual deploy
vercel --prod

# Preview deploy
vercel
```

---

## 📝 Key Files

| File | Purpose |
|------|---------|
| `index.html` | Main landing page with hero, services, pricing, contact form |
| `tietosuoja.html` | GDPR-compliant privacy policy (in Finnish) |
| `404.html` | Custom error page |
| `vercel.json` | Security headers, caching, URL rewrites |
| `public/css/variables.css` | Design tokens (colors, spacing, typography) |
| `public/js/form.js` | Form validation & submission handling |

---

## 🔧 Configuration

### Environment Variables

Add to `.env.local` (not tracked in Git):

```
VITE_API_CONTACT_ENDPOINT=/api/contact
VITE_CALENDLY_URL=https://calendly.com/vidosocial
VITE_WHATSAPP_NUMBER=+358xxxxxxxxx
```

### Vercel Deployment

Security headers are configured in `vercel.json`:
- HSTS (Strict-Transport-Security)
- X-Frame-Options (prevents clickjacking)
- Permissions-Policy (disables camera, microphone, geolocation)
- Referrer-Policy (strict-origin-when-cross-origin)

---

## 🛠️ Current Cleanup Phase

This branch (`chore/codebase-cleanup`) is actively refactoring:

- ✅ Extract CSS to `public/css/`
- ✅ Extract JavaScript to `public/js/`
- ✅ Remove unused files (`vidosocial-redesign.zip`)
- ✅ Add `.gitignore` & documentation
- 🔄 Fix hardcoded values (WhatsApp number, email endpoints)
- 📋 Add form validation improvements
- 📋 Consolidate color variables

**Status:** In progress — see [chore/codebase-cleanup PR](#) for details.

---

## 📋 TODO

### High Priority
- [ ] Implement `/api/contact` email handler (Vercel function)
- [ ] Replace hardcoded WhatsApp number with environment variable
- [ ] Extract CSS to separate files in `public/css/`
- [ ] Extract JavaScript to `public/js/`
- [ ] Update HTML files to reference external CSS/JS

### Medium Priority
- [ ] Add form validation library (e.g., Zod, Yup)
- [ ] Implement Calendly integration
- [ ] Add error boundaries & logging
- [ ] Create reusable component templates
- [ ] Add lighthouse CI checks

### Nice to Have
- [ ] Set up Prettier + ESLint
- [ ] Add staging environment
- [ ] Implement analytics (privacy-respecting)
- [ ] Add A/B testing framework
- [ ] Create admin dashboard for form submissions

---

## 🎨 Design System

**Colors:** Dark mode only (#050505 background, light text)
**Typography:** Apple System Font stack
**Spacing:** 8px base unit
**Radius:** 24px (default), 16px (sm)
**Shadows:** Layered depth (0 40px 120px)

See `public/css/variables.css` for all design tokens.

---

## 📞 Support

Questions or issues? Reach out to **ville@vidosocial.com**

---

## 📄 License

All rights reserved © 2026 VIDO (Y-tunnus 3581471-7)
