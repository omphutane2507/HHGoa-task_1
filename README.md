# HH Goa 2026 - Builder ID Generator

A lightweight browser-based ID card generator for the HH Goa 2026 event. Upload a photo, enter your name/alias and stack/role, and generate a polished builder ID preview that can be downloaded or shared.

## Files

- `index.html` - Main page and UI structure.
- `style.css` - Visual styling, layout, and responsive behavior.
- `app.js` - Canvas rendering logic, image upload handling, HEIC conversion support, and ID card generation.

## Features

- Upload photo support for JPG, PNG, and HEIC images.
- Automatic HEIC → JPEG conversion when supported by the browser.
- Canvas-based ID card generation with custom background, borders, and text overlays.
- Random builder title assignment from a curated list.
- Preview display and image export via canvas.

## Usage

1. Open `index.html` in a modern browser.
2. Upload your photo using the `UPLOAD YOUR PHOTO` button.
3. Enter your name/alias and stack/role.
4. Click `GENERATE ID CARD`.
5. Use the download/share actions once the card is generated.

## Notes

- The project uses Google Fonts (`Playfair Display` and `Space Mono`) for the custom text styling.
- `heic2any` is loaded from a CDN to handle HEIC image conversion in-browser.
- The generated card is rendered at a 1080x1350 canvas size for good sharing quality.

## Development

This is a static frontend project, so you can open `index.html` directly in your browser. For the best experience, run it from a local web server to avoid CORS or file URL limitations.

### Run locally

- Option 1: Open `index.html` directly in your browser.
- Option 2: Serve the folder with a local server, e.g. using Python:
  - `python -m http.server 8000`
  - Then open `http://localhost:8000`
