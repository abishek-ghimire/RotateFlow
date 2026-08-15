# RotateFlow

RotateFlow is a Manifest V3 Chrome extension for rotating, repositioning, and scaling visible media directly on webpages. It works without downloading or modifying the original media.

## Features

The repaired extension provides the following behavior:

- Detects visible videos, images, canvases, iframes, and embedded media.
- Lets you select a specific media target when a page contains more than one.
- Applies rotation, scale, horizontal position, and vertical position changes instantly.
- Keeps transform state independently inside each browser tab and per detected target.
- Reduces clipping by making nearby restrictive overflow containers visible while a transform is active.
- Restores the original inline styles and overflow values when a target is reset.
- Provides left/right 90-degree context-menu actions and a reset action.
- Includes a light/dark popup theme and accessible labels, status text, and error messages.

## Installation

1. Clone or download this repository.
2. Open `chrome://extensions` in Chrome.
3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select the `RotateFlow` directory.
6. For local `file://` pages, enable **Allow access to file URLs** on the RotateFlow extension card.

After installation, open a normal webpage containing media and click the RotateFlow toolbar icon. Chrome internal pages such as `chrome://settings` cannot be modified by extensions; the popup reports this as an unavailable page rather than failing silently.

## Project structure

```text
RotateFlow/
├── manifest.json       # Manifest V3 permissions and entry points
├── background.js       # Service worker and context-menu commands
├── content.js          # Media discovery and CSS transform state
├── index.html          # Popup markup
├── script.js           # Popup controls and tab messaging
├── style.css           # Popup layout and themes
├── Logo.png            # Extension icon and popup branding
└── README.md
```

## Verification

The repository has been checked with JSON validation, JavaScript syntax checks, and a headless Chrome smoke test. The smoke page confirmed that the content script injects stable target identifiers onto both an image and a canvas.

## Notes

Transformations use CSS on the current webpage. A page can still override extension styling through its own scripts, and Chrome’s protected internal pages remain inaccessible by design. On a local file, Chrome’s **Allow access to file URLs** setting is required.
