# RotateFlow
> Transform media on any webpage with intuitive controls. Rotate, scale, pan, flip, and adjust brightness/contrast instantly.

<div align="center">

[![Chrome Web Store](https://img.shields.io/badge/Chrome-Web%20Store-4285F4?style=flat-square&logo=google-chrome)](https://chrome.google.com/webstore)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/Version-1.1.0-blue?style=flat-square)](https://github.com/abishekgh-6/RotateFlow/releases)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-success?style=flat-square)](https://developer.chrome.com/docs/extensions/mv3/)
[![JavaScript](https://img.shields.io/badge/Made%20with-JavaScript-F7DF1E?style=flat-square&logo=javascript)](https://javascript.com)

**The essential Chrome extension for transforming media on any webpage.**

[Features](#-features) • 
[Installation](#-installation) • 
[Usage](#-usage) • 
[Keyboard Shortcuts](#-keyboard-shortcuts) • 
[Contributing](#-contributing) • 
[License](#-license)

</div>

---

## 🎯 Why RotateFlow?

Ever encountered media that's rotated the wrong way, too small to see clearly, or cut off by restrictive page layouts? RotateFlow solves this instantly.

**Common scenarios:**
- 📸 Photos uploaded sideways (landscape when should be portrait)
- 🎥 Videos playing at awkward angles
- 🔍 Images too small to read or examine details
- 🖼️ Media clipped or hidden by page layout
- 🎨 Need to flip or adjust contrast on the fly
- 📱 Embedded iframes that don't fit your screen

RotateFlow lets you **transform any media directly in the browser** without modifying the original file.

---

## ✨ Features

### 🔄 **Rotation**
- Rotate images and videos to any angle (0-360°)
- Preset buttons: 90°, 180°, 270°
- Rotate clockwise/counter-clockwise
- Right-click context menu for quick rotation

### 📏 **Scaling (Zoom)**
- Zoom from 10% to 1000% (100x magnification)
- Zoom toward the pointer (Ctrl/Cmd + Scroll)
- Double-click to zoom in quickly
- Real-time zoom indicator
- Quick presets: 50%, 100%, 200%

### 📍 **Panning (Move)**
- Drag media to reposition it
- Shift-drag or middle-button drag to pan smoothly
- Arrow keys for precise movement
- Center media with one click

### 🎨 **Adjustments**
- **Flip horizontally** and vertically
- **Brightness control** (50% - 150%)
- **Contrast control** (50% - 150%)
- **Real-time preview** of all changes

### 🎛️ **Smart Selection**
- Automatically detects:
  - Images (`<img>`)
  - Videos (`<video>`)
  - Canvas elements
  - iframes and embedded media
- Select from multiple media on same page
- Independent settings per media element
- Per-tab memory (settings persist during session)

### 🛠️ **Control Methods**
- **Popup panel** - Full controls from toolbar
- **Direct interaction** - Transform media directly on page
- **Keyboard shortcuts** - Power user shortcuts (optional)
- **Context menu** - Right-click quick actions
- **Numeric input** - Precise value entry

### 🌙 **User Experience**
- Light/Dark theme support
- Clear error messages
- No page modification (display-only)
- Lightweight & fast
- Works on any webpage (Chrome allows)

---

## 📦 Installation

### 🔧 Option 1: Load Unpacked (Recommended for Development)

1. **Download the extension:**
   - Go to [GitHub Releases](https://github.com/abishekgh-6/RotateFlow/releases)
   - Or: `git clone https://github.com/abishekgh-6/RotateFlow.git`

2. **Open Chrome Extensions page:**
   - Navigate to `chrome://extensions`
   - Or: Menu → Settings → Extensions

3. **Enable Developer Mode:**
   - Toggle **"Developer mode"** in top-right corner

4. **Load the extension:**
   - Click **"Load unpacked"**
   - Select the `RotateFlow` folder containing `manifest.json`
   - ✅ RotateFlow now appears in your extensions list!

5. **Access the extension:**
   - Click the RotateFlow icon in your toolbar
   - Pin it for easy access (click pin icon)

6. **For local files:**
   - Go to RotateFlow extension details
   - Enable **"Allow access to file URLs"**
   - Now works on local HTML/media files too!

> **Note:** Select the extracted folder, not the `.zip` file.

### 📚 Option 2: Install via Terminal

```bash
# Clone the repository
git clone https://github.com/abishekgh-6/RotateFlow.git
cd RotateFlow

# Open Chrome Extensions
# chrome://extensions

# Load unpacked and select RotateFlow folder
```

**To update later:**
```bash
cd RotateFlow
git pull origin main
# Then click "Reload" in Chrome extensions page
```

## 🚀 Usage

### Quick Start

1. **Open a webpage** with images or videos
2. **Click the RotateFlow icon** in your toolbar
3. **Select media** from the dropdown (if multiple)
4. **Adjust as needed:**
   - Use **sliders** for visual control
   - Enter **exact values** in input fields
   - Click **preset buttons** for quick actions
5. **Reset** individual media or all transforms with one click

### Popup Panel Guide

```
┌─────────────────────────────────────┐
│  RotateFlow       [Dark/Light] [?]  │
├─────────────────────────────────────┤
│  Select Media: [Image 1 of 3]   ▼  │
│  Dimensions: 1920×1080              │
├─────────────────────────────────────┤
│  🔍 ZOOM                            │
│    Slider: [════●════] 100%         │
│    Input: [100] % [50%] [100%] [200%]
│                                     │
│  🔄 ROTATE                          │
│    Slider: [════●════] 0°           │
│    Input: [0] °                     │
│    [90°] [180°] [270°]             │
│                                     │
│  📍 PAN (X, Y)                      │
│    X: [════●════] [Input] px        │
│    Y: [════●════] [Input] px        │
│    [↑] [↓] [←] [→] [Center]        │
│                                     │
│  🎨 FLIP & FILTERS                  │
│    [⇄ Flip H] [⇅ Flip V]           │
│    Brightness: [════●════] 100%    │
│    Contrast: [════●════] 100%      │
│                                     │
│  ☑ Keyboard Shortcuts Enabled       │
│                                     │
│  [Reset Zoom] [Reset All]  [Help]  │
└─────────────────────────────────────┘
```

### Direct Interaction (On Page)

Once a media element is selected in RotateFlow:

| Action | Control |
|--------|---------|
| **Zoom In/Out** | `Ctrl/Cmd + Scroll` wheel |
| **Zoom to Pointer** | Wheel scroll follows your cursor |
| **Quick Zoom** | Double-click on media |
| **Pan/Move** | `Shift + Drag` or middle-click drag |
| **Rotate** | Keyboard shortcuts (if enabled) |
| **Flip** | Keyboard shortcuts (if enabled) |

> **Tip:** Direct interaction is fastest for common adjustments!

### Context Menu (Right-Click)

Right-click any media or blank area:
- **Rotate Right** - Rotate 90° clockwise
- **Rotate Left** - Rotate 90° counter-clockwise  
- **Reset RotateFlow** - Reset all transforms

> **Note:** Context menu appears after RotateFlow has been opened once.

---

## ⌨️ Keyboard Shortcuts

### Enable/Disable Shortcuts
- ☑ Toggle **"Keyboard Shortcuts Enabled"** in the popup
- Shortcuts are **optional** and can be turned off anytime
- Setting persists across sessions

### Shortcut List

| Key | Action | Notes |
|-----|--------|-------|
| **+** / **=** | Zoom in 10% | Increment from 10% to 1000% |
| **-** | Zoom out 10% | Decrement from 1000% to 10% |
| **0** | Reset zoom to 100% | Quick reset |
| **R** | Rotate clockwise 15° | Cumulative, any angle |
| **Shift + R** | Rotate counter-clockwise 15° | Cumulative, any angle |
| **H** | Flip horizontally | Toggle on/off |
| **V** | Flip vertically | Toggle on/off |
| **↑** / **W** | Move up 10px | Fine-grained panning |
| **↓** / **S** | Move down 10px | Fine-grained panning |
| **←** / **A** | Move left 10px | Fine-grained panning |
| **→** / **D** | Move right 10px | Fine-grained panning |
| **Escape** | Deselect media | Close RotateFlow controls |

### Keyboard Notes
✅ **Shortcuts only work when:**
- A media element is selected in RotateFlow
- Keyboard shortcuts are **enabled** in popup
- You're NOT typing in a text field

❌ **Shortcuts ignored when:**
- Typing in input fields or text areas
- Extension disabled or closed
- Keyboard shortcuts toggle is OFF

---

## 🎯 Common Use Cases

### 📸 Photo Viewing & Examination
```
Problem: Photo saved sideways, hard to view
Solution: 
  1. Open RotateFlow
  2. Rotate to 90°
  3. Zoom to 150-200% for details
  4. Done!
```

### 🎥 Video Playback
```
Problem: Video embedded in wrong orientation
Solution:
  1. Select video in RotateFlow
  2. Rotate to correct orientation
  3. Zoom to fit screen
  4. Watch!
```

### 🔍 Inspecting Fine Details
```
Problem: Image too small to see details clearly
Solution:
  1. Open RotateFlow
  2. Zoom to 300-500%
  3. Pan to view different areas
  4. Adjust brightness/contrast if needed
```

### 🖼️ Working Around Page Layout
```
Problem: Image clipped by restrictive page CSS
Solution:
  1. Select media in RotateFlow
  2. Pan to reposition within visible area
  3. Adjust zoom to fit
  4. Reset when done
```

### 🎨 Screenshot/Export Workflow
```
Problem: Need to adjust media before screenshoting
Solution:
  1. Transform in RotateFlow
  2. Screenshot (transforms are display-only)
  3. Original file unchanged
  4. Works perfectly!
```

---

## 🔧 Technical Details

### Supported Media Types
- ✅ `<img>` elements (JPEG, PNG, WebP, SVG, GIF, etc.)
- ✅ `<video>` elements (MP4, WebM, Ogg, etc.)
- ✅ `<canvas>` elements
- ✅ `<iframe>` embedded content
- ✅ Background images (CSS)
- ✅ Local files (with permission)

### How It Works

**Display-Only Transformations:**
- All transforms applied via CSS (`transform` property)
- Original files **never modified**
- No downloading, re-encoding, or compression
- Purely visual changes

**How Zoom Works:**
- 10% to 1000% range (100x magnification)
- Smooth interpolation
- Pointer-following zoom centers on cursor
- No quality loss at 100% (1:1 original size)
- Pixelation expected beyond original resolution

**Per-Tab Memory:**
- Settings stored per browser tab
- Cleared when tab closed
- Each webpage's transforms independent
- No cross-site tracking

### Performance
- ✅ Lightweight (~50KB extension)
- ✅ Fast transforms (no server processing)
- ✅ GPU-accelerated (smooth animations)
- ✅ Minimal CPU usage
- ✅ No network requests

### Privacy & Security
- ✅ **No data collection** (fully local)
- ✅ **No analytics or tracking**
- ✅ **No personal data stored**
- ✅ **No external servers**
- ✅ Respects Chrome security policies
- ✅ Open-source (audit the code)

---

## 📂 Project Structure

```
RotateFlow/
│
├── manifest.json          # Manifest V3 configuration
├── background.js          # Service worker & context menus
├── content.js             # Media detection & transforms
├── index.html             # Popup UI markup
├── script.js              # Popup behavior & controls
├── style.css              # Popup styling (light/dark)
├── Logo.png               # Extension icon (48×48, 128×128)
├── README.md              # This file
└── LICENSE                # MIT License
```

### Key Components

**`manifest.json`**
- Manifest V3 configuration
- Permissions and host permissions
- Background service worker registration
- Content script configuration

**`background.js`**
- Service worker (handles lifecycle)
- Context menu setup
- Cross-script messaging

**`content.js`**
- Media element detection
- CSS transform application
- Keyboard event handling
- Direct interaction (Ctrl+scroll, drag)

**`script.js`** & **`index.html`**
- Popup UI and controls
- Slider interactions
- Media selection dropdown
- Settings persistence

---

## 🐛 Troubleshooting

### Extension Won't Load
**Problem:** "Could not load manifest"

**Solutions:**
- Verify `manifest.json` exists in root folder
- Check JSON syntax (use [JSONLint](https://jsonlint.com))
- Ensure you're loading the folder, not the `.zip` file
- Try removing and re-loading extension

### Keyboard Shortcuts Not Working
**Problem:** Pressing keys does nothing

**Check:**
1. ☑ "Keyboard Shortcuts Enabled" toggle in popup
2. ✓ A media element is selected
3. ✓ You're not typing in a text field
4. ✓ Not on a restricted page (chrome://, etc.)

**Try:**
- Reload the page (Ctrl+R)
- Re-open RotateFlow popup
- Check browser console for errors (F12 → Console)

### Transforms Not Applying
**Problem:** Sliders move but media doesn't change

**Possible causes:**
- Media element removed from page (detected!)
- Page JavaScript conflicts with CSS transforms
- Unsupported media format
- Page blocks extension scripts

**Solutions:**
- Select media again from dropdown
- Reload the page
- Try on a different website to verify
- Check browser console (F12) for errors

### Local Files Not Working
**Problem:** RotateFlow doesn't work on local files

**Solution:**
1. Go to `chrome://extensions`
2. Find RotateFlow
3. Enable **"Allow access to file URLs"**
4. Now works on local HTML/images!

### Extension Doesn't Appear in Toolbar
**Problem:** Can't find RotateFlow icon

**Solutions:**
1. Go to `chrome://extensions`
2. Verify RotateFlow is listed and **enabled**
3. If listed: Click the pin icon to add to toolbar
4. If not listed: Reload page after re-loading extension

### Media List Empty
**Problem:** Popup opens but no media found

**Causes:**
- Page has no images/videos
- Media is in restricted iframe
- Media loaded dynamically after popup opened

**Solutions:**
- Try a page like Google Images or YouTube
- Close and re-open popup
- Reload the page first, then open RotateFlow

---

## 🤝 Contributing

We welcome contributions! Whether it's bug reports, feature requests, or code improvements.

### How to Contribute

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR-USERNAME/RotateFlow.git
   cd RotateFlow
   ```

3. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make your changes**
   - Write clean, well-commented code
   - Test thoroughly
   - Follow existing code style

5. **Test locally**
   ```bash
   # Load unpacked in Chrome (chrome://extensions)
   # Test all features
   ```

6. **Commit with clear messages**
   ```bash
   git commit -m "Add: Brief description of changes"
   ```

7. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

8. **Open a Pull Request**
   - Describe what you changed and why
   - Reference any related issues
   - Include screenshots if UI changes

### Development Guidelines

- **Code style:** Vanilla JavaScript, no unnecessary dependencies
- **Browser compatibility:** Target Chrome 90+
- **Performance:** Keep transforms fast, minimal CPU usage
- **Privacy:** No external API calls, no data collection
- **Testing:** Test on multiple websites and media types
- **Comments:** Explain complex logic, especially transforms

### Areas for Contribution

- 🐛 **Bug fixes** - Report and fix issues
- ✨ **New features** - Suggest ideas in Issues
- 📚 **Documentation** - Improve README, add examples
- 🎨 **UI/UX** - Better controls or themes
- 🚀 **Performance** - Optimize for speed
- 🌍 **Localization** - Support multiple languages
- ✅ **Testing** - More thorough testing on edge cases

---

## 📋 Changelog

### Version 1.1.0 (Current)
- ✨ **Zoom control:** 10% to 1000% with presets
- ✨ **Pan control:** Move media with arrow keys and direct drag
- ✨ **Rotation presets:** Quick 90°, 180°, 270° buttons
- ✨ **Flip controls:** Horizontal and vertical flip
- ✨ **Filters:** Brightness and contrast adjustment
- ✨ **Keyboard shortcuts:** Optional, toggleable
- ✨ **Direct interaction:** Ctrl+scroll zoom, drag pan
- ✨ **Per-media selection:** Handle multiple media on page
- ✨ **Quality indicator:** Show original dimensions
- ✨ **Light/Dark mode:** Theme support
- ✨ **Numeric input:** Direct value entry for precision
- 🔧 **Improved:** Better error messages, faster performance
- 🔧 **Removed:** Features that weren't essential

### Version 1.0.0 (Initial Release)
- 🎉 First stable release
- Rotation, scaling, panning basics
- Context menu actions
- Per-tab settings

---

## ❓ FAQ

**Q: Does RotateFlow modify the original file?**
A: No! All transforms are display-only using CSS. The original file is never touched, downloaded, or modified.

**Q: Can I use RotateFlow on any website?**
A: Yes! It works on all normal websites. The only exceptions are Chrome-restricted pages (chrome://, extension pages, etc.).

**Q: Does RotateFlow collect data?**
A: No. RotateFlow is fully local with zero data collection, no analytics, no tracking, no external servers.

**Q: Can I use keyboard shortcuts?**
A: Yes! Keyboard shortcuts are optional. Toggle "Keyboard Shortcuts Enabled" in the popup. When disabled, use only the GUI.

**Q: How do I rotate beyond 360°?**
A: Rotations wrap around automatically. You can enter 405° (= 45°), 450° (= 90°), etc. in the input field.

**Q: What if media won't transform?**
A: Check that the media element is selected, shortcuts aren't disabled if using keyboard, and you're not in a restricted context. See Troubleshooting section.

**Q: Can I transform embedded videos (YouTube, Vimeo)?**
A: Yes, you can transform the video player itself. Note: YouTube/Vimeo use iframes which have some limitations, but basic transforms usually work.

**Q: Does RotateFlow work offline?**
A: Yes! RotateFlow is fully local and works offline. No internet connection needed.

**Q: Can I customize keyboard shortcuts?**
A: Currently, shortcuts are fixed. Custom remapping is under consideration for future versions.

**Q: How do I report a bug?**
A: Open an issue on [GitHub Issues](https://github.com/abishekgh-6/RotateFlow/issues) with:
- Browser version
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if helpful

**Q: Is RotateFlow available on Firefox or Safari?**
A: Currently Chrome only (Manifest V3). Firefox/Safari support is possible but not planned.

---

## 🔐 Security & Privacy

**Security:**
- ✅ No external API calls
- ✅ All code runs locally
- ✅ Respects Chrome sandbox
- ✅ Manifest V3 (modern security model)
- ✅ Open-source (auditable)

**Privacy:**
- ✅ No personal data collected
- ✅ No analytics or tracking
- ✅ No browsing history access
- ✅ No cookies or local storage
- ✅ Tab-specific storage (cleared on close)

---

## 📄 License

RotateFlow is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2026 Abishek Ghimire

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

See [LICENSE](LICENSE) file for full text.

---

## Credits & Acknowledgments

**Built with:**
- Vanilla JavaScript (no dependencies)
- Chrome Extensions Manifest V3 API
- CSS Transforms
-  Attention to detail

**Inspired by:**
- User needs for media transformation
- Chrome extension best practices
- Developer workflow efficiency

**Thanks to:**
- Chrome Extensions documentation
- Community feedback and bug reports
- Contributors who improve RotateFlow

---

## 📞 Support & Contact

### Get Help
- 🐛 **Found a bug?** [Open an issue](https://github.com/abishekgh-6/RotateFlow/issues)
- 💡 **Have an idea?** [Start a discussion](https://github.com/abishekgh-6/RotateFlow/discussions)
- ❓ **Need help?** [Check FAQ](#-faq) or Troubleshooting

### Connect
- GitHub: [@abishekgh-6](https://github.com/abishek-ghimire)
- Issues: [GitHub Issues](https://github.com/abishek-ghimire/RotateFlow/issues)
- Discussions: [GitHub Discussions](https://github.com/abishek-ghimire/RotateFlow/discussions)

### Feedback
We'd love to hear from you! Please share:
- ⭐ Star the repo if you find it useful
- 💬 Drop feedback in Discussions
- 🐛 Report bugs in Issues
- 🚀 Suggest features

---

## 🚀 Roadmap

**Planned Features:**
- [ ] Saturation control
- [ ] Hue rotation
- [ ] Custom keyboard shortcut remapping
- [ ] Transform history / Undo-Redo
- [ ] Save/load presets
- [ ] Firefox support
- [ ] Settings export/import
- [ ] Accessibility improvements
- [ ] Performance optimizations

**Under Consideration:**
- Multi-language support (i18n)
- Advanced filters (blur, sepia, etc.)
- Batch transform multiple media
- Transform persistence across sessions
- Chrome Web Store listing

---

## 📚 Resources

### Chrome Extensions Documentation
- [Get Started](https://developer.chrome.com/docs/extensions/get-started/)
- [Manifest V3](https://developer.chrome.com/docs/extensions/mv3/)
- [API Reference](https://developer.chrome.com/docs/extensions/reference/)

### Related Tools
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/) - Debugging
- [Web APIs](https://developer.mozilla.org/en-US/docs/Web/API) - Reference
- [CSS Transforms](https://developer.mozilla.org/en-US/docs/Web/CSS/transform) - Documentation

---

<div align="center">

### Made by Abishek Ghimire

**[⬆ back to top](#rotateflow)**

</div>

---

## 📖 Version Info

- **Current Version:** 1.1.0
- **Chrome Minimum:** Version 90+
- **Last Updated:** 2024
- **Status:** ✅ Active & Maintained

---

*Is RotateFlow useful to you? Please consider starring ⭐ the repository!*
