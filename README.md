# RotateFlow

RotateFlow is a Chrome extension for rotating, scaling, and repositioning media on webpages.

## Features

- Detects videos, images, canvases, iframes, and embedded media.
- Selects a target when a page contains multiple media elements.
- Rotates, scales, and moves media instantly.
- Keeps settings separately for each tab and media target.
- Helps prevent clipping caused by restrictive page layouts.
- Supports reset controls and right-click rotation actions.
- Includes light/dark mode and clear error messages.

## Installation

### Option 1: Install from a ZIP file

1. Download the ZIP from [GitHub](https://github.com/abishekgh-6/RotateFlow) using **Code → Download ZIP**, then extract it.
2. Open [`chrome://extensions`](chrome://extensions) and enable **Developer mode**.
3. Click **Load unpacked** and select the extracted folder containing `manifest.json`.
4. Open a webpage with media and click the RotateFlow toolbar icon.

> Select the extracted folder, not the `.zip` file. For local files, enable **Allow access to file URLs** in the extension details.

### Option 2: Install with the terminal

```bash
git clone https://github.com/abishekgh-6/RotateFlow.git
cd RotateFlow
```

Then open [`chrome://extensions`](chrome://extensions), enable **Developer mode**, click **Load unpacked**, and select the `RotateFlow` folder.

To update later:

```bash
cd RotateFlow
git pull origin main
```

Click **Reload** on the RotateFlow card in Chrome after updating.

## Usage

Open a webpage containing media and click the RotateFlow icon. Select a target, then adjust rotation, scale, or position. Use **Center**, **Reset target**, or **Reset all** as needed. Right-click a page, image, or video to access the RotateFlow context menu.

Chrome internal pages such as `chrome://settings` cannot be modified by extensions.

## Project structure

```text
RotateFlow/
├── manifest.json       # Manifest V3 configuration
├── background.js       # Service worker and context menus
├── content.js          # Media detection and transforms
├── index.html          # Popup markup
├── script.js           # Popup behavior
├── style.css           # Popup styling
├── Logo.png            # Extension icon
└── README.md
```

## Verification

The extension has been checked with manifest validation, JavaScript syntax checks, whitespace checks, and a headless Chrome media smoke test.

## References

[1]: https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world "Chrome Extensions: Hello World tutorial"
[2]: https://developer.chrome.com/docs/extensions/develop/concepts/match-patterns "Chrome Extensions: Match patterns"
