# RotateFlow

RotateFlow is a Manifest V3 Chrome extension for rotating, repositioning, and scaling visible media directly on webpages. It works without downloading or modifying the original media.

## Features

RotateFlow detects visible videos, images, canvases, iframes, and embedded media. It lets you select a specific target when a page contains more than one media element, then apply rotation, scaling, horizontal movement, and vertical movement instantly. Transform state is maintained independently for each browser tab and detected media target.

The extension also reduces clipping by making nearby restrictive overflow containers visible while a transform is active, restores the original inline styles when a target is reset, provides left/right 90-degree context-menu actions, and includes a light/dark popup theme with accessible labels and error messages.

## Installation

RotateFlow is installed as an **unpacked extension** through Chrome’s Extensions page. Chrome requires the archive to be extracted before it can be loaded; do not select the `.zip` file itself in the **Load unpacked** dialog.[1]

### Option 1: Download or upload a ZIP file

This option is useful when you received `RotateFlow.zip`, downloaded the repository from GitHub, or want to install the extension without using Git.

1. Download the ZIP archive from the [RotateFlow GitHub repository](https://github.com/abishekgh-6/RotateFlow) by selecting **Code** and then **Download ZIP**. If the ZIP was provided to you separately, save or upload it to your computer first.
2. Extract the ZIP archive. On Windows, right-click the archive and choose **Extract All**. On macOS or Linux, double-click the archive or use the system archive utility.
3. Open Google Chrome and navigate to [`chrome://extensions`](chrome://extensions).
4. Enable **Developer mode** using the switch in the upper-right corner.
5. Click **Load unpacked**.
6. Select the extracted RotateFlow folder—the folder that directly contains `manifest.json`, `background.js`, `content.js`, and `index.html`.
7. Pin RotateFlow to the Chrome toolbar if desired, open a webpage containing media, and click the RotateFlow icon.

If the extracted archive contains an additional wrapper folder such as `RotateFlow-main`, open that folder and select the inner directory only if it is the one containing `manifest.json`. Chrome must load the folder, not the ZIP archive.

### Option 2: Clone and update through the terminal

This option is useful when you want to keep the extension synchronized with GitHub and update it with `git pull`.

First, make sure [Git](https://git-scm.com/downloads) is installed. Then run:

```bash
git clone https://github.com/abishekgh-6/RotateFlow.git
cd RotateFlow
```

RotateFlow does not require `npm install`, a build command, or additional dependencies. The repository is ready to load directly in Chrome. Continue with these steps:

1. Open Google Chrome and navigate to [`chrome://extensions`](chrome://extensions).
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select the cloned `RotateFlow` directory—the directory containing `manifest.json`.
5. Open a media webpage and click the RotateFlow toolbar icon.

To update an existing terminal installation later, run:

```bash
cd RotateFlow
git pull origin main
```

Then return to [`chrome://extensions`](chrome://extensions) and click the **Reload** button on the RotateFlow card.

## Using RotateFlow

After installation, open a normal webpage containing a video, image, canvas, iframe, or embedded media and click the RotateFlow toolbar icon. Select a target if multiple media elements are detected. Use the controls to rotate, scale, or reposition the target. **Center** resets only its position, **Reset target** restores the selected target, and **Reset all** restores every detected target on the page.

You can also right-click a webpage, image, or video and use the **RotateFlow** submenu to rotate left, rotate right, or reset the selected media transform.

## Local files and protected pages

To use RotateFlow on local `file://` pages, open [`chrome://extensions`](chrome://extensions), find RotateFlow, select **Details**, and enable **Allow access to file URLs**.[2]

Chrome internal pages such as `chrome://settings`, the Chrome Web Store, and other protected browser pages cannot be modified by extensions. RotateFlow reports these pages as unavailable instead of failing silently.

## Updating or reinstalling

For a ZIP installation, download or receive the latest ZIP, extract it to a new folder, and use the **Reload** or **Remove** and **Load unpacked** controls on [`chrome://extensions`](chrome://extensions). For a terminal installation, run `git pull origin main` from the cloned repository and reload the extension in Chrome.

If Chrome reports that the manifest is missing, make sure you selected the directory that directly contains `manifest.json`, not the ZIP archive or an outer parent directory.

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

The repository has been checked with JSON validation, JavaScript syntax checks, whitespace checks, and a headless Chrome smoke test. The smoke test confirmed that the content script detects both image and canvas media targets.

## Notes

Transformations use CSS on the current webpage. A page can still override extension styling through its own scripts, and Chrome’s protected internal pages remain inaccessible by design. On a local file, Chrome’s **Allow access to file URLs** setting is required.

## References

[1]: https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world "Chrome Extensions: Hello World tutorial"
[2]: https://developer.chrome.com/docs/extensions/develop/concepts/match-patterns "Chrome Extensions: Match patterns"
