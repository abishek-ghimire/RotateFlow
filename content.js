(() => {
  'use strict';

  const ID_ATTRIBUTE = 'data-rotateflow-id';
  const TARGET_SELECTOR = 'video, img, canvas, iframe, object, embed';
  const MAX_POSITION = 5000;
  const states = new Map();
  let nextId = 1;
  let activeTargetId = null;
  let scanFrame = 0;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, Number(value) || 0));

  function isSupportedElement(element) {
    return element instanceof HTMLVideoElement
      || element instanceof HTMLImageElement
      || element instanceof HTMLCanvasElement
      || element instanceof HTMLIFrameElement
      || element instanceof HTMLObjectElement
      || element instanceof HTMLEmbedElement;
  }

  function isVisibleMedia(element) {
    if (!isSupportedElement(element) || !element.isConnected) return false;
    const style = window.getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) return false;
    const rect = element.getBoundingClientRect();
    return rect.width > 4 && rect.height > 4;
  }

  function typeFor(element) {
    if (element instanceof HTMLVideoElement) return 'Video';
    if (element instanceof HTMLImageElement) return 'Image';
    if (element instanceof HTMLCanvasElement) return 'Canvas';
    if (element instanceof HTMLIFrameElement) return 'Frame';
    return 'Embedded media';
  }

  function ensureState(element) {
    let id = element.getAttribute(ID_ATTRIBUTE);
    if (!id) {
      id = `rotateflow-${nextId++}`;
      element.setAttribute(ID_ATTRIBUTE, id);
    }
    if (!states.has(id)) {
      states.set(id, {
        id,
        element,
        rotation: 0,
        scale: 1,
        x: 0,
        y: 0,
        original: {
          transform: element.style.transform,
          transformOrigin: element.style.transformOrigin,
          transition: element.style.transition,
          willChange: element.style.willChange
        },
        parents: []
      });
    }
    return states.get(id);
  }

  function scanMedia() {
    document.querySelectorAll(TARGET_SELECTOR).forEach((element) => {
      if (isVisibleMedia(element)) ensureState(element);
    });
    for (const [id, state] of states) {
      if (!state.element.isConnected) states.delete(id);
    }
    if (activeTargetId && !states.has(activeTargetId)) activeTargetId = null;
    if (!activeTargetId) activeTargetId = getSortedStates()[0]?.id || null;
  }

  function getSortedStates() {
    return [...states.values()]
      .filter((state) => isVisibleMedia(state.element))
      .sort((a, b) => {
        const aRect = a.element.getBoundingClientRect();
        const bRect = b.element.getBoundingClientRect();
        return (bRect.width * bRect.height) - (aRect.width * aRect.height);
      });
  }

  function makeTransform(state) {
    return `translate3d(${state.x}px, ${state.y}px, 0) rotate(${state.rotation}deg) scale(${state.scale})`;
  }

  function makeOverflowSafe(state) {
    if (state.parents.length) return;
    let parent = state.element.parentElement;
    let depth = 0;
    while (parent && depth < 4) {
      const computed = window.getComputedStyle(parent);
      if (computed.overflow === 'hidden' || computed.overflowX === 'hidden' || computed.overflowY === 'hidden' || computed.overflow === 'clip') {
        state.parents.push({
          element: parent,
          overflow: parent.style.overflow,
          overflowX: parent.style.overflowX,
          overflowY: parent.style.overflowY
        });
        parent.style.overflow = 'visible';
        parent.style.overflowX = 'visible';
        parent.style.overflowY = 'visible';
      }
      parent = parent.parentElement;
      depth += 1;
    }
  }

  function restoreOverflow(state) {
    for (const parent of state.parents) {
      parent.element.style.overflow = parent.overflow;
      parent.element.style.overflowX = parent.overflowX;
      parent.element.style.overflowY = parent.overflowY;
    }
    state.parents = [];
  }

  function applyState(state, values = {}, animate = true) {
    if (!state || !state.element.isConnected) return null;
    state.rotation = clamp(values.rotation ?? state.rotation, -360, 360);
    state.scale = clamp(values.scale ?? state.scale, 0.1, 8);
    state.x = clamp(values.x ?? state.x, -MAX_POSITION, MAX_POSITION);
    state.y = clamp(values.y ?? state.y, -MAX_POSITION, MAX_POSITION);
    makeOverflowSafe(state);

    state.element.style.transformOrigin = 'center center';
    state.element.style.willChange = 'transform';
    state.element.style.transition = animate ? 'transform 160ms ease-out' : 'none';
    state.element.style.transform = makeTransform(state);
    activeTargetId = state.id;
    return serializeState(state);
  }

  function resetState(state) {
    if (!state || !state.element.isConnected) return null;
    state.rotation = 0;
    state.scale = 1;
    state.x = 0;
    state.y = 0;
    state.element.style.transform = state.original.transform;
    state.element.style.transformOrigin = state.original.transformOrigin;
    state.element.style.transition = state.original.transition;
    state.element.style.willChange = state.original.willChange;
    restoreOverflow(state);
    return serializeState(state);
  }

  function serializeState(state) {
    return {
      id: state.id,
      type: typeFor(state.element),
      rotation: state.rotation,
      scale: state.scale,
      x: state.x,
      y: state.y
    };
  }

  function getTargetSummaries() {
    scanMedia();
    return getSortedStates().map((state, index) => {
      const rect = state.element.getBoundingClientRect();
      return {
        ...serializeState(state),
        index: index + 1,
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        active: state.id === activeTargetId
      };
    });
  }

  function resolveTarget(targetId) {
    scanMedia();
    const requested = targetId ? states.get(String(targetId)) : null;
    if (requested && isVisibleMedia(requested.element)) return requested;

    // Context menus expose the clicked element's regular DOM id. Map it to
    // RotateFlow state when the page provides one.
    const hintedElement = targetId ? document.getElementById(String(targetId)) : null;
    if (hintedElement && isVisibleMedia(hintedElement)) return ensureState(hintedElement);

    return states.get(activeTargetId) || getSortedStates()[0] || null;
  }

  function rotateBy(degrees, targetId) {
    const state = resolveTarget(targetId);
    if (!state) return null;
    return applyState(state, { rotation: state.rotation + degrees });
  }

  function handleMessage(message, sendResponse) {
    if (!message || typeof message.type !== 'string') return false;
    scanMedia();

    if (message.type === 'ROTATEFLOW_PING') {
      sendResponse({ ok: true, supported: true });
      return false;
    }

    if (message.type === 'ROTATEFLOW_GET_STATE') {
      const current = resolveTarget(message.targetId);
      sendResponse({
        ok: true,
        targets: getTargetSummaries(),
        activeTargetId: current?.id || null,
        state: current ? serializeState(current) : null
      });
      return false;
    }

    if (message.type === 'ROTATEFLOW_SELECT_TARGET') {
      const state = resolveTarget(message.targetId);
      if (!state) {
        sendResponse({ ok: false, error: 'No visible media was found on this page.' });
        return false;
      }
      activeTargetId = state.id;
      sendResponse({ ok: true, activeTargetId, state: serializeState(state), targets: getTargetSummaries() });
      return false;
    }

    if (message.type === 'ROTATEFLOW_APPLY') {
      const state = resolveTarget(message.targetId);
      if (!state) {
        sendResponse({ ok: false, error: 'No visible media was found on this page.' });
        return false;
      }
      sendResponse({ ok: true, state: applyState(state, message.values || {}, message.animate !== false) });
      return false;
    }

    if (message.type === 'ROTATEFLOW_RESET') {
      const state = resolveTarget(message.targetId);
      if (!state) {
        sendResponse({ ok: false, error: 'No visible media was found on this page.' });
        return false;
      }
      sendResponse({ ok: true, state: resetState(state) });
      return false;
    }

    if (message.type === 'ROTATEFLOW_RESET_ALL') {
      states.forEach(resetState);
      sendResponse({ ok: true, targets: getTargetSummaries() });
      return false;
    }

    if (message.type === 'ROTATEFLOW_COMMAND') {
      if (message.command === 'rotate-left') {
        const state = rotateBy(-90, message.targetHint || null);
        sendResponse({ ok: Boolean(state), state });
      } else if (message.command === 'rotate-right') {
        const state = rotateBy(90, message.targetHint || null);
        sendResponse({ ok: Boolean(state), state });
      } else if (message.command === 'reset') {
        const state = resolveTarget(message.targetHint || null);
        sendResponse({ ok: Boolean(state), state: state ? resetState(state) : null });
      } else {
        sendResponse({ ok: false, error: 'Unknown RotateFlow command.' });
      }
      return false;
    }

    return false;
  }

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => handleMessage(message, sendResponse));

  function scheduleScan() {
    if (scanFrame) return;
    scanFrame = window.requestAnimationFrame(() => {
      scanFrame = 0;
      scanMedia();
    });
  }

  const observer = new MutationObserver(scheduleScan);
  observer.observe(document.documentElement || document, { childList: true, subtree: true });
  window.addEventListener('resize', scheduleScan, { passive: true });
  scanMedia();
})();
