# RotateFlow

RotateFlow is a lightweight Chrome extension for rotating, zooming, panning, flipping, and adjusting images and videos directly in the browser. It changes the display only; the original media is never downloaded, re-encoded, or modified.

## Features

- One primary media target at a time, with playing videos preferred over canvases and thumbnails.
- Zoom from 10% to 1000%, rotation, panning, flips, brightness, and contrast.
- Sliders, exact numeric inputs, preset buttons, and per-setting reset buttons.
- Direct controls: Ctrl/Cmd-scroll to zoom, double-click to zoom, and Shift-drag or middle-button drag to pan.
- Optional keyboard shortcuts, including `O` to turn shortcuts on or off.
- Light and dark themes, context-menu actions, local-file support, and fullscreen recovery for video players such as YouTube.

## Installation

### Option 1: Download the ZIP

1. Open the [RotateFlow GitHub page](https://github.com/abishek-ghimire/RotateFlow).
2. Choose **Code → Download ZIP** and extract the archive.
3. Open `chrome://extensions`, enable **Developer mode**, and choose **Load unpacked**.
4. Select the extracted folder containing `manifest.json`.

### Option 2: Clone the repository

```bash
git clone https://github.com/abishek-ghimire/RotateFlow.git
cd RotateFlow
```

Then open `chrome://extensions`, enable **Developer mode**, and load the cloned folder. Click **Reload** on the extension card after pulling updates.

For local HTML, image, or video files, open RotateFlow’s extension details and enable **Allow access to file URLs**.

## Use it

Open a page with media and click the RotateFlow toolbar button. The extension chooses the most relevant visible image or video. Use the sliders or the labeled **Type value** fields, then press Enter or leave the field to apply a value.

`+` and `-` zoom, `R` rotates, `H` and `V` flip, arrow keys or `W/A/S/D` pan, and `O` toggles keyboard shortcuts. Shortcuts are ignored while typing in a form field.

## Project files

```text
manifest.json   Chrome extension configuration
background.js   Service worker and context menus
content.js      Media detection and transformations
index.html      Popup markup
script.js       Popup behavior
style.css       Popup styling
```

## Privacy and license

RotateFlow is local-only and has no analytics, accounts, uploads, or external processing. It is released under the MIT License; see [LICENSE](LICENSE).
