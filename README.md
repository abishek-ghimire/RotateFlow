# RotateFlow

RotateFlow is a **Manifest V3 Chrome extension** for transforming images and videos in the browser. It changes the display only, so the original media is never downloaded, re-encoded, or modified.

## Features

- **Primary media selection:** shows one relevant image or video instead of thumbnail and canvas duplicates.
- **YouTube support:** prefers a playing video and keeps transforms through fullscreen changes.
- **Transform controls:**
  - **Zoom:** 10%–1000% with pointer-centered scrolling.
  - **Pan:** sliders, numeric values, Shift-drag, and middle-button drag.
  - **Rotation:** exact numeric entry plus 45°, 90°, and 180° presets.
  - **Flip:** horizontal and vertical controls.
  - **Filters:** brightness and contrast from 50%–150%.
- **Usability:** per-setting reset buttons, light/dark theme, local-file support, and context-menu actions.
- **Keyboard shortcuts:** optional shortcuts with `O` to enable or disable them.

## Installation

### Option 1: Download ZIP

1. Open the [RotateFlow repository](https://github.com/abishek-ghimire/RotateFlow).
2. Select **Code → Download ZIP**.
3. Extract the ZIP file.
4. Open `chrome://extensions` and enable **Developer mode**.
5. Click **Load unpacked** and choose the folder containing `manifest.json`.

### Option 2: Clone the repository

1. Run:

   ```bash
   git clone https://github.com/abishek-ghimire/RotateFlow.git
   cd RotateFlow
   ```

2. Open `chrome://extensions`.
3. Enable **Developer mode**.
4. Click **Load unpacked** and select the cloned folder.

For local files, open RotateFlow’s extension details and enable **Allow access to file URLs**. After updates, click **Reload** on the extension card.

## Usage

1. Open a page containing an image or video.
2. Click the **RotateFlow** toolbar button.
3. Adjust a slider or enter an exact value in a **Type value** field.
4. Use the individual **Reset** buttons or **Reset target** when needed.

### Shortcuts

- `+` / `-`: zoom in or out.
- `0`: reset zoom.
- `R` / `Shift+R`: rotate 15° clockwise or counter-clockwise.
- `H` / `V`: flip horizontally or vertically.
- Arrow keys or `W/A/S/D`: pan.
- `O`: toggle keyboard shortcuts.
- `Backspace`: reset the selected media.

Shortcuts are ignored while typing in a form field.

## Files

- `manifest.json`: extension configuration.
- `background.js`: service worker and context menus.
- `content.js`: media detection and transformations.
- `index.html`: popup markup.
- `script.js`: popup behavior.
- `style.css`: popup styling.

## Privacy and license

- **Local-only:** no accounts, uploads, analytics, or external processing.
- **Display-only:** source media remains unchanged.
- **License:** MIT; see [LICENSE](LICENSE).
