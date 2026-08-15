const MENU_IDS = {
  rotateLeft: 'rotate-left',
  rotateRight: 'rotate-right',
  reset: 'reset-transform'
};

function createContextMenus() {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: 'rotateflow-root',
      title: 'RotateFlow',
      contexts: ['page', 'image', 'video']
    });
    chrome.contextMenus.create({
      id: MENU_IDS.rotateLeft,
      parentId: 'rotateflow-root',
      title: 'Rotate left 90°',
      contexts: ['page', 'image', 'video']
    });
    chrome.contextMenus.create({
      id: MENU_IDS.rotateRight,
      parentId: 'rotateflow-root',
      title: 'Rotate right 90°',
      contexts: ['page', 'image', 'video']
    });
    chrome.contextMenus.create({
      id: MENU_IDS.reset,
      parentId: 'rotateflow-root',
      title: 'Reset media transform',
      contexts: ['page', 'image', 'video']
    });
  });
}

function sendCommand(tabId, command, targetHint) {
  if (!tabId) return;
  chrome.tabs.sendMessage(tabId, { type: 'ROTATEFLOW_COMMAND', command, targetHint }, () => {
    // A page can legitimately have no receiving content script, for example a
    // Chrome internal page. Reading lastError prevents an uncaught extension error.
    void chrome.runtime.lastError;
  });
}

chrome.runtime.onInstalled.addListener(createContextMenus);
chrome.runtime.onStartup.addListener(createContextMenus);

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (!tab?.id) return;
  const command = info.menuItemId === MENU_IDS.rotateLeft
    ? 'rotate-left'
    : info.menuItemId === MENU_IDS.rotateRight
      ? 'rotate-right'
      : info.menuItemId === MENU_IDS.reset
        ? 'reset'
        : null;
  if (command) sendCommand(tab.id, command, info.targetElementId || null);
});
