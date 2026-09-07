# RotateFlow

RotateFlow is a small Manifest V3 Chrome extension for changing how images, videos, canvases, and embedded media are displayed in the browser. It rotates, zooms, pans, flips, and adjusts brightness or contrast without downloading, re-encoding, or changing the original file.

## What it does

- Detects visible images, videos, canvases, iframes, and embedded media.
- Lets you choose a target when a page has more than one media element.
- Supports zoom from 10% to 1000%, rotation, panning, horizontal and vertical flips, brightness, and contrast.
- Provides sliders, clearly labeled numeric inputs, preset buttons, and a reset button for each setting.
- Keeps state separately for each target during the tab session.
- Works with normal webpages and local files when Chrome grants file-URL access.
- Includes a light/dark popup, context-menu actions, fullscreen recovery, and optional keyboard shortcuts.

All changes are display-only. RotateFlow does not edit the source media.

## Install for development

1. Clone the repository or download it from GitHub.
2. Open `chrome://extensions` in Chrome and turn on **Developer mode**.
3. Click **Load unpacked** and select the folder containing `manifest.json`.
4. Pin RotateFlow if you want quick access from the toolbar.
5. For local HTML, image, or video files, open RotateFlow’s extension details and enable **Allow access to file URLs**.

After pulling updates, click **Reload** on the extension card.

```bash
git clone https://github.com/abishek-ghimire/RotateFlow.git
cd RotateFlow
```

## Use it

Open a page with media and click the RotateFlow toolbar button. Select a target, move a slider, or type an exact value in the **Type value** field. Press Enter or leave the field to apply the value. Each setting has its own reset button, while **Reset target** and **Reset all** are available for larger resets.

You can also work directly on the page:

| Action | How |
|---|---|
| Zoom toward the pointer | Ctrl/Cmd + mouse wheel |
| Quick zoom | Double-click the media |
| Pan | Shift-drag or middle-button drag |
| Rotate or flip | Keyboard shortcuts when enabled |
| Quick rotation | Right-click and choose a RotateFlow action |

### Keyboard shortcuts

Keyboard controls are optional. Use the popup toggle or press **O** on the page to enable or disable them. The setting is remembered.

| Key | Action |
|---|---|
| `+` / `-` | Zoom in or out |
| `0` | Reset zoom |
| `R` / `Shift+R` | Rotate 15° clockwise or counter-clockwise |
| `H` / `V` | Flip horizontally or vertically |
| Arrow keys or `W/A/S/D` | Pan by 10 pixels |
| `Backspace` | Reset the selected media |
| `O` | Toggle keyboard shortcuts |
| `Escape` | Deselect the current media |

Shortcuts are ignored while typing in a form field. Chrome internal pages and some restricted frames cannot be modified by extensions.

## Project files

```text
manifest.json   Extension configuration
background.js   Context-menu service worker
content.js      Media detection, transforms, interactions, fullscreen recovery
index.html      Popup markup
script.js       Popup behavior and state synchronization
style.css       Popup styling
Logo.png        Extension icon
```

## Privacy

RotateFlow is local-only. It has no analytics, account system, upload flow, or external processing service. The original media remains where it was opened.

## License

MIT. See [LICENSE](LICENSE).
