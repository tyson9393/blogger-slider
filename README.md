# Blogger Slider Script

This repository hosts the external JavaScript engine used to power responsive touch sliders in Blogger posts.

## Features
- Multi-slider support (1 slider per `<h1>` section)
- Pixel-accurate drag with Pointer Events
- Thumbnails with scroll-to-active
- Progress dots (highlight current slide)
- Mobile-safe initialization (works on Blogger mobile!)
- Resize-safe, landscape-optimized
- Keyboard navigation
- Fully blogger-safe (no external dependencies)

## How to Use in Blogger

1️⃣ Paste your slider HTML inside Blogger post (HTML mode).  
2️⃣ Add this script at the **bottom** of the post:

```html
<script defer src="https://cdn.jsdelivr.net/gh/<YOUR_GITHUB_USERNAME>/<REPO_NAME>@main/slider.js"></script>
