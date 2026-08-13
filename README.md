# 🌴 HH Goa 2026 - Builder ID & PFP Frame Generator

[![HH Goa 2026](https://img.shields.io/badge/Event-HH%20Goa%202026-116c3b?style=for-the-badge)](https://github.com/omphutane2507/HHGoa-task_1)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![Vanilla JS](https://img.shields.io/badge/Tech-HTML5%20%7C%20CSS3%20%7C%20JS-ec0d68?style=for-the-badge)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

A lightweight, browser-based digital badge and profile picture frame generator designed for **Hacker House Goa 2026** (Oct 28–31, 2026). 

This app allows event attendees, developers, and creators to generate official event badges and customized profile picture frames for social media (X/Twitter) in seconds.

---

## 🚀 Live Demo & Quick Start

1. You can simply open `index.html` in your browser.
2. Or use any static file server, for example:
```bash
npx serve .
```

3. Visit the local URL provided by your static server.

---

## ✨ Features

### 🪪 Mode 1: Builder ID Card Generator (Portrait - 1080x1350)
* **Official Event Badge Format**: High-resolution portrait layout engineered for high quality image export.
* **Custom Info Fields**: Add your Name / Alias and Stack / Role (e.g. `Full-Stack / Rust`).
* **Dynamic Builder Classes**: Assign random builder titles (e.g., `10X SHIPPER`, `FULL-STACK WIZARD`, `PROTOCOL ARCHITECT`, `TERMINAL DWELLER`) with one-click regeneration and dual title support.
* **Branded Typography**: Styled using `Playfair Display` serif headers and `Space Mono` typography with custom vector overlays (`goa_hindi.svg`).

### 🖼️ Mode 2: PFP Frame Generator (Square - 1080x1080)
* **Social Media Ready**: Square profile picture overlay optimized for X (Twitter), Discord, and LinkedIn.
* **Multi-Theme Support**: Choose from curated visual themes:
  * 🟢 **Classic** - Signature HH Goa green & gold aesthetic
  * 🌊 **Beach** - Coastal vibes & ocean tones
  * 🎉 **Party** - Neon festive highlights
  * 🍺 **Beer** - Warm amber tones
  * 🌴 **Jungle** - Lush tropical greenery

### 🛠️ Interactive Canvas Controls & Image Tools
* **Multi-Format Upload**: Supports `JPG`, `PNG`, and fully client-side `HEIC` conversion using `heic-to`.
* **Real-time Drag & Reposition**: Direct drag-and-drop photo positioning (supports mouse and touch devices).
* **Transform Sliders**:
  * 🔍 **Zoom / Scale**: Adjust photo magnification (0.5x to 3.0x).
  * 🔄 **Rotate**: 360° precise angle rotation (-180° to 180°).
  * ☀️ **Light / Brightness**: Fine-tune exposure (0.0x to 2.0x).
* **One-Touch Actions**: `Auto Fit`, `Flip Horizontal`, and `Reset` photo adjustments.

### 📤 Export & One-Click Sharing
* **PNG Export**: Instant high-resolution canvas download.
* **Share on X Integration**: Pre-populated X (Twitter) post text with official hashtag `#FrameInGoa`.

---

## 📁 Repository Structure

```
.
├── index.html         # Main HTML layout, options selector & modal UI
├── style.css          # Responsive design, CSS custom properties & glassmorphism theme
├── app.js             # HTML5 Canvas 2D engine, photo controls & state management
├── goa_hindi.svg      # Vector header branding element
├── Sun_rise.png       # Background asset
├── theme_beach.png    # Beach theme asset
├── theme_beer.png     # Beer theme asset
├── theme_party.png    # Party theme asset
├── theme_tree.png     # Jungle theme asset
└── README.md          # Project documentation
```

---

## 🛠️ Technology Stack

* **Frontend Logic**: Pure Vanilla JavaScript (ES6+, Object-Oriented Canvas Context).
* **Graphics Rendering**: Native HTML5 `<canvas>` 2D API.
* **Styles & Layout**: Vanilla CSS3 (Flexbox, CSS Grid, Custom Properties, Glassmorphism).
* **Fonts**: Google Fonts ([Playfair Display](https://fonts.google.com/specimen/Playfair+Display) & [Space Mono](https://fonts.google.com/specimen/Space+Mono)).
* **Frontend Libraries**: [heic-to](https://github.com/hoppergee/heic-to) via CDN for purely client-side HEIC conversion without a server.

---

## 📋 Git & Deployment Commands

To push this repository to your existing GitHub repo [`https://github.com/omphutane2507/HHGoa-task_1.git`](https://github.com/omphutane2507/HHGoa-task_1.git):

```bash
# 1. Stage all files (removes nested subfolder references and adds root files)
git add -A

# 2. Commit the changes
git commit -m "Analyze project, update README.md, and clean up repository structure"

# 3. Ensure remote origin is set correctly
git remote set-url origin https://github.com/omphutane2507/HHGoa-task_1.git

# 4. Push changes to main branch
git push -u origin main
```

---
