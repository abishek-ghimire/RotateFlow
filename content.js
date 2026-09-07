(() => {
  'use strict';

  const ID_ATTRIBUTE = 'data-rotateflow-id';
  const TARGET_SELECTOR = 'video, img, canvas, iframe, object, embed';
  const MAX_POSITION = 5000;
  const states = new Map();
  let nextId = 1;
  let activeTargetId = null;
  let scanFrame = 0;
  let keyboardEnabled = true;
  let pointerDrag = null;
  let pendingVideoState = null;
  let fullscreenRecoveryTimer = 0;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, Number(value) || 0));
  const isInput = (element) => ['INPUT', 'TEXTAREA', 'SELECT'].includes(element?.tagName) || element?.isContentEditable;

  function isSupportedElement(element) {
    return element instanceof HTMLVideoElement || element instanceof HTMLImageElement || element instanceof HTMLCanvasElement
      || element instanceof HTMLIFrameElement || element instanceof HTMLObjectElement || element instanceof HTMLEmbedElement;
  }

  function isVisibleMedia(element) {
    if (!isSupportedElement(element) || !element.isConnected) return false;
    const style = window.getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) return false;
    const rect = element.getBoundingClientRect();
    return rect.width >= 50 && rect.height >= 50;
  }

  function typeFor(element) {
    if (element instanceof HTMLVideoElement) return 'Video';
    if (element instanceof HTMLImageElement) return 'Image';
    if (element instanceof HTMLCanvasElement) return 'Canvas';
    if (element instanceof HTMLIFrameElement) return 'Frame';
    return 'Embedded media';
  }

  function sourceFor(element) {
    return element.currentSrc || element.src || element.data || '';
  }

  function isYouTubePage() { return /(^|\.)youtube\.com$|(^|\.)youtube-nocookie\.com$|(^|\.)youtu\.be$/.test(location.hostname); }

  function ensureState(element) {
    let id = element.getAttribute(ID_ATTRIBUTE);
    if (!id) {
      id = `rotateflow-${nextId++}`;
      element.setAttribute(ID_ATTRIBUTE, id);
    }
    if (!states.has(id)) {
      const restored = element instanceof HTMLVideoElement && pendingVideoState ? pendingVideoState : null;
      const state = {
        id, element, zoom: restored?.zoom ?? 1, x: restored?.x ?? 0, y: restored?.y ?? 0, rotation: restored?.rotation ?? 0,
        flipHorizontal: restored?.flipHorizontal ?? false, flipVertical: restored?.flipVertical ?? false, brightness: restored?.brightness ?? 1, contrast: restored?.contrast ?? 1,
        original: { transform: element.style.transform, transformPriority: element.style.getPropertyPriority('transform'), transformOrigin: element.style.transformOrigin, transition: element.style.transition, willChange: element.style.willChange, filter: element.style.filter, filterPriority: element.style.getPropertyPriority('filter') },
        parents: []
      };
      states.set(id, state);
      if (restored) { pendingVideoState = null; if (hasTransform(state)) { applyState(state, {}, false); if (isFullscreenMedia(state.element)) scheduleFullscreenRecovery(state); } }
    }
    return states.get(id);
  }

  function scanMedia() {
    for (const [id, state] of states) {
      if (!state.element.isConnected) {
        if (isYouTubePage() && state.element instanceof HTMLVideoElement && hasTransform(state)) pendingVideoState = { zoom: state.zoom, x: state.x, y: state.y, rotation: state.rotation, flipHorizontal: state.flipHorizontal, flipVertical: state.flipVertical, brightness: state.brightness, contrast: state.contrast };
        states.delete(id);
      }
    }
    document.querySelectorAll(TARGET_SELECTOR).forEach((element) => { if (isVisibleMedia(element)) ensureState(element); });
    const preferred = getPreferredState();
    activeTargetId = preferred?.id || null;
  }

  function getSortedStates() {
    return [...states.values()].filter((state) => isVisibleMedia(state.element)).sort((a, b) => {
      const ar = a.element.getBoundingClientRect(); const br = b.element.getBoundingClientRect();
      return (br.width * br.height) - (ar.width * ar.height);
    });
  }

  function getPreferredState() {
    const candidates = getSortedStates();
    const full = fullscreenElement();
    const fullscreenVideo = candidates.find((state) => state.element instanceof HTMLVideoElement && full && (full === state.element || full.contains(state.element)));
    if (fullscreenVideo) return fullscreenVideo;
    const playingVideo = candidates.find((state) => state.element instanceof HTMLVideoElement && !state.element.paused && state.element.readyState >= 2);
    if (playingVideo) return playingVideo;
    if (isYouTubePage()) {
      const youtubeVideo = candidates.find((state) => state.element instanceof HTMLVideoElement);
      if (youtubeVideo) return youtubeVideo;
    }
    const video = candidates.find((state) => state.element instanceof HTMLVideoElement);
    if (video) return video;
    const image = candidates.find((state) => state.element instanceof HTMLImageElement);
    return image || candidates[0] || null;
  }

  function makeTransform(state) {
    const flipX = state.flipHorizontal ? -1 : 1;
    const flipY = state.flipVertical ? -1 : 1;
    return `translate3d(${state.x}px, ${state.y}px, 0) rotate(${state.rotation}deg) scale(${state.zoom}) scaleX(${flipX}) scaleY(${flipY})`;
  }

  function fullscreenElement() { return document.fullscreenElement || document.webkitFullscreenElement || null; }
  function isFullscreenMedia(element) { const full = fullscreenElement(); return Boolean(full && (full === element || full.contains(element))); }
  function hasTransform(state) { return state.zoom !== 1 || state.x !== 0 || state.y !== 0 || state.rotation !== 0 || state.flipHorizontal || state.flipVertical || state.brightness !== 1 || state.contrast !== 1; }

  function makeOverflowSafe(state) {
    if (state.parents.length) return;
    let parent = state.element.parentElement;
    let depth = 0;
    while (parent && depth < 4) {
      const computed = window.getComputedStyle(parent);
      if (['hidden', 'clip'].includes(computed.overflow) || computed.overflowX === 'hidden' || computed.overflowY === 'hidden') {
        state.parents.push({ element: parent, overflow: parent.style.overflow, overflowX: parent.style.overflowX, overflowY: parent.style.overflowY });
        parent.style.overflow = 'visible'; parent.style.overflowX = 'visible'; parent.style.overflowY = 'visible';
      }
      parent = parent.parentElement; depth += 1;
    }
  }

  function restoreOverflow(state) {
    state.parents.forEach((parent) => { parent.element.style.overflow = parent.overflow; parent.element.style.overflowX = parent.overflowX; parent.element.style.overflowY = parent.overflowY; });
    state.parents = [];
  }

  function applyState(state, values = {}, animate = true) {
    if (!state || !state.element.isConnected) return null;
    state.zoom = clamp(values.zoom ?? state.zoom, 0.1, 10);
    state.x = clamp(values.x ?? state.x, -MAX_POSITION, MAX_POSITION);
    state.y = clamp(values.y ?? state.y, -MAX_POSITION, MAX_POSITION);
    state.rotation = clamp(values.rotation ?? state.rotation, -3600, 3600);
    state.flipHorizontal = Boolean(values.flipHorizontal ?? state.flipHorizontal);
    state.flipVertical = Boolean(values.flipVertical ?? state.flipVertical);
    state.brightness = clamp(values.brightness ?? state.brightness, 0.5, 1.5);
    state.contrast = clamp(values.contrast ?? state.contrast, 0.5, 1.5);
    makeOverflowSafe(state);
    state.element.style.setProperty('transform-origin', 'center center', 'important');
    state.element.style.setProperty('will-change', 'transform, filter');
    state.element.style.setProperty('transition', animate ? 'transform 200ms ease-out, filter 200ms ease-out' : 'none');
    state.element.style.setProperty('transform', makeTransform(state), 'important');
    state.element.style.setProperty('filter', `brightness(${state.brightness}) contrast(${state.contrast})`, 'important');
    activeTargetId = state.id;
    return serializeState(state);
  }

  function resetState(state) {
    if (!state || !state.element.isConnected) return null;
    Object.assign(state, { zoom: 1, x: 0, y: 0, rotation: 0, flipHorizontal: false, flipVertical: false, brightness: 1, contrast: 1 });
    state.element.style.setProperty('transform', state.original.transform, state.original.transformPriority || '');
    state.element.style.setProperty('transform-origin', state.original.transformOrigin, '');
    state.element.style.setProperty('transition', state.original.transition, '');
    state.element.style.setProperty('will-change', state.original.willChange, '');
    state.element.style.setProperty('filter', state.original.filter, state.original.filterPriority || '');
    restoreOverflow(state);
    return serializeState(state);
  }

  function serializeState(state) {
    const rect = state.element.getBoundingClientRect();
    return { id: state.id, type: typeFor(state.element), zoom: state.zoom, rotation: state.rotation, x: state.x, y: state.y,
      flipHorizontal: state.flipHorizontal, flipVertical: state.flipVertical, brightness: state.brightness, contrast: state.contrast,
      width: Math.round(rect.width), height: Math.round(rect.height), source: sourceFor(state.element), naturalWidth: state.element.naturalWidth || 0, naturalHeight: state.element.naturalHeight || 0 };
  }

  function getTargetSummaries() {
    scanMedia();
    const preferred = getPreferredState();
    return preferred ? [{ ...serializeState(preferred), index: 1, active: true }] : [];
  }

  function resolveTarget(targetId) {
    scanMedia();
    const requested = targetId ? states.get(String(targetId)) : null;
    if (requested && isVisibleMedia(requested.element)) return requested;
    const hinted = targetId ? document.getElementById(String(targetId)) : null;
    if (hinted && isVisibleMedia(hinted)) return ensureState(hinted);
    return states.get(activeTargetId) || getSortedStates()[0] || null;
  }

  function zoomAtPoint(state, delta, clientX, clientY) {
    const rect = state.element.getBoundingClientRect();
    const oldZoom = state.zoom; const nextZoom = clamp(oldZoom + delta, 0.1, 10);
    const mx = clientX - (rect.left + rect.width / 2); const my = clientY - (rect.top + rect.height / 2);
    applyState(state, { zoom: nextZoom, x: state.x + (mx * (oldZoom - nextZoom)) / nextZoom, y: state.y + (my * (oldZoom - nextZoom)) / nextZoom });
  }

  function handleMediaClick(event) {
    const state = ensureState(event.currentTarget); activeTargetId = state.id;
    if (event.detail === 2) { event.preventDefault(); zoomAtPoint(state, 0.25, event.clientX, event.clientY); }
  }

  function handleWheel(event) {
    if (!event.ctrlKey && !event.metaKey) return;
    event.preventDefault(); zoomAtPoint(ensureState(event.currentTarget), event.deltaY < 0 ? 0.1 : -0.1, event.clientX, event.clientY);
  }

  function handlePointerDown(event) {
    if (!(event.shiftKey || event.button === 1)) return;
    const state = ensureState(event.currentTarget); activeTargetId = state.id; pointerDrag = { state, pointerId: event.pointerId, x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture?.(event.pointerId); event.preventDefault();
  }

  function handlePointerMove(event) {
    if (!pointerDrag || pointerDrag.pointerId !== event.pointerId) return;
    const { state } = pointerDrag; const dx = event.clientX - pointerDrag.x; const dy = event.clientY - pointerDrag.y;
    pointerDrag.x = event.clientX; pointerDrag.y = event.clientY; applyState(state, { x: state.x + dx, y: state.y + dy }, false); event.preventDefault();
  }

  function endPointerDrag() { pointerDrag = null; }

  function attachInteractions(state) {
    if (state.element.dataset.rotateflowBound) return;
    state.element.dataset.rotateflowBound = 'true';
    state.element.addEventListener('click', handleMediaClick, true);
    state.element.addEventListener('wheel', handleWheel, { passive: false });
    state.element.addEventListener('pointerdown', handlePointerDown, true);
    state.element.addEventListener('pointermove', handlePointerMove, true);
    state.element.addEventListener('pointerup', endPointerDrag, true);
    state.element.addEventListener('pointercancel', endPointerDrag, true);
  }

  function command(command) {
    const state = resolveTarget(); if (!state) return null;
    if (command === 'rotate-left') return applyState(state, { rotation: state.rotation - 90 });
    if (command === 'rotate-right') return applyState(state, { rotation: state.rotation + 90 });
    if (command === 'zoom-in') return applyState(state, { zoom: state.zoom + 0.1 });
    if (command === 'zoom-out') return applyState(state, { zoom: state.zoom - 0.1 });
    if (command === 'flip-horizontal') return applyState(state, { flipHorizontal: !state.flipHorizontal });
    if (command === 'flip-vertical') return applyState(state, { flipVertical: !state.flipVertical });
    if (command === 'reset') return resetState(state);
    return null;
  }

  function setKeyboardEnabled(enabled) {
    keyboardEnabled = enabled;
    chrome.storage?.local.set({ keyboardEnabled: enabled });
    const notice = document.createElement('div');
    notice.textContent = `RotateFlow shortcuts ${enabled ? 'enabled' : 'disabled'} · Press O to toggle`;
    Object.assign(notice.style, { position: 'fixed', left: '50%', bottom: '24px', transform: 'translateX(-50%)', zIndex: '2147483647', padding: '8px 12px', borderRadius: '8px', background: enabled ? '#1d4ed8' : '#334155', color: '#fff', font: '12px system-ui, sans-serif', boxShadow: '0 4px 16px rgba(0,0,0,.3)', pointerEvents: 'none' });
    document.documentElement.appendChild(notice);
    window.setTimeout(() => notice.remove(), 1600);
  }

  function handleKeydown(event) {
    if (isInput(event.target)) return;
    const key = event.key;
    if (key.toLowerCase() === 'o') { event.preventDefault(); setKeyboardEnabled(!keyboardEnabled); return; }
    if (!keyboardEnabled) return;
    const state = resolveTarget(); if (!state) return;
    const values = {};
    if (key === '+' || key === '=') values.zoom = state.zoom + 0.1;
    else if (key === '-' || key === '_') values.zoom = state.zoom - 0.1;
    else if (key === '0') values.zoom = 1;
    else if (key.toLowerCase() === 'r') values.rotation = state.rotation + (event.shiftKey ? -15 : 15);
    else if (key.toLowerCase() === 'h') values.flipHorizontal = !state.flipHorizontal;
    else if (key.toLowerCase() === 'v') values.flipVertical = !state.flipVertical;
    else if (key === 'ArrowUp' || key.toLowerCase() === 'w') values.y = state.y - 10;
    else if (key === 'ArrowDown' || key.toLowerCase() === 's') values.y = state.y + 10;
    else if (key === 'ArrowLeft' || key.toLowerCase() === 'a') values.x = state.x - 10;
    else if (key === 'ArrowRight' || key.toLowerCase() === 'd') values.x = state.x + 10;
    else if (key === 'Backspace') { event.preventDefault(); resetState(state); return; }
    else if (key === 'Escape') { activeTargetId = null; return; }
    else return;
    event.preventDefault(); applyState(state, values);
  }

  function handleMessage(message, sendResponse) {
    if (!message || typeof message.type !== 'string') return false;
    scanMedia();
    if (message.type === 'ROTATEFLOW_PING') { sendResponse({ ok: true, supported: true }); return false; }
    if (message.type === 'ROTATEFLOW_SET_SETTINGS') { keyboardEnabled = message.keyboardEnabled !== false; sendResponse({ ok: true }); return false; }
    if (message.type === 'ROTATEFLOW_GET_STATE') { const current = resolveTarget(message.targetId); sendResponse({ ok: true, targets: getTargetSummaries(), activeTargetId: current?.id || null, state: current ? serializeState(current) : null }); return false; }
    if (message.type === 'ROTATEFLOW_SELECT_TARGET') { const state = resolveTarget(message.targetId); if (!state) { sendResponse({ ok: false, error: 'No visible media was found on this page.' }); return false; } activeTargetId = state.id; sendResponse({ ok: true, activeTargetId, state: serializeState(state), targets: getTargetSummaries() }); return false; }
    if (message.type === 'ROTATEFLOW_APPLY') { const state = resolveTarget(message.targetId); if (!state) { sendResponse({ ok: false, error: 'No visible media was found on this page.' }); return false; } sendResponse({ ok: true, state: applyState(state, message.values || {}, message.animate !== false) }); return false; }
    if (message.type === 'ROTATEFLOW_RESET') { const state = resolveTarget(message.targetId); if (!state) { sendResponse({ ok: false, error: 'No visible media was found on this page.' }); return false; } sendResponse({ ok: true, state: resetState(state) }); return false; }
    if (message.type === 'ROTATEFLOW_RESET_ALL') { states.forEach(resetState); sendResponse({ ok: true, targets: getTargetSummaries() }); return false; }
    if (message.type === 'ROTATEFLOW_COMMAND') {
      const target = resolveTarget(message.targetHint || null);
      if (!target) { sendResponse({ ok: false, error: 'No visible media was found on this page.' }); return false; }
      let result = null;
      if (message.command === 'rotate-left') result = applyState(target, { rotation: target.rotation - 90 });
      else if (message.command === 'rotate-right') result = applyState(target, { rotation: target.rotation + 90 });
      else if (message.command === 'reset') result = resetState(target);
      else result = command(message.command);
      sendResponse({ ok: Boolean(result), state: result });
      return false;
    }
    return false;
  }

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => handleMessage(message, sendResponse));
  chrome.storage?.local.get({ keyboardEnabled: true }, (settings) => { keyboardEnabled = settings.keyboardEnabled !== false; });
  window.addEventListener('keydown', handleKeydown, true);

  function scheduleScan() { if (scanFrame) return; scanFrame = requestAnimationFrame(() => { scanFrame = 0; scanMedia(); states.forEach(attachInteractions); }); }
  const observer = new MutationObserver((records) => {
    let needsScan = false;
    records.forEach((record) => {
      if (record.type === 'childList') needsScan = true;
      if (record.type === 'attributes') {
        const state = [...states.values()].find((candidate) => candidate.element === record.target);
        if (state && isFullscreenMedia(state.element)) reapplyIfChanged(state);
      }
    });
    if (needsScan) scheduleScan();
  });
  observer.observe(document.documentElement || document, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });
  function reapplyIfChanged(state) {
    if (!state || !state.element.isConnected || !hasTransform(state)) return;
    const expectedTransform = makeTransform(state);
    const expectedFilter = `brightness(${state.brightness}) contrast(${state.contrast})`;
    if (state.element.style.getPropertyValue('transform') !== expectedTransform || state.element.style.getPropertyValue('filter') !== expectedFilter) applyState(state, {}, false);
  }

  function scheduleFullscreenRecovery(state) {
    window.clearTimeout(fullscreenRecoveryTimer);
    let attempts = 0;
    const recover = () => {
      if (!fullscreenElement() || !state?.element?.isConnected) return;
      reapplyIfChanged(state);
      attempts += 1;
      if (attempts < 24) fullscreenRecoveryTimer = window.setTimeout(recover, 125);
    };
    recover();
  }

  function handleFullscreenChange() {
    const full = fullscreenElement();
    if (full) {
      const target = [...states.values()].find((state) => state.element === full || full.contains(state.element));
      if (target) { activeTargetId = target.id; attachInteractions(target); if (hasTransform(target)) { applyState(target, {}, false); scheduleFullscreenRecovery(target); } }
    }
    scheduleScan();
  }
  window.addEventListener('resize', scheduleScan, { passive: true }); window.addEventListener('pageshow', scheduleScan, { passive: true });
  document.addEventListener('fullscreenchange', handleFullscreenChange, true);
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange, true);
  scanMedia(); states.forEach(attachInteractions);
})();
