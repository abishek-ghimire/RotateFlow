(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const sliderIds = ['zoom', 'positionX', 'positionY', 'rotation', 'brightness', 'contrast'];
  const inputPairs = { zoom: 'zoomInput', positionX: 'positionXInput', positionY: 'positionYInput', rotation: 'rotationInput', brightness: 'brightnessInput', contrast: 'contrastInput' };
  const buttonIds = ['zoomOut', 'zoomIn', 'centerButton', 'rotateLeft', 'rotateRight', 'rotate45', 'rotate180', 'flipH', 'flipV', 'resetButton', 'resetAllButton'];
  let activeTabId = null, activeTargetId = null, applyTimer = null, initialized = false;

  function setError(message) { $('error').textContent = message || ''; $('error').hidden = !message; }
  function setStatus(message) { $('status').textContent = message || ''; }
  function setEnabled(enabled) { [...sliderIds, ...Object.values(inputPairs), ...buttonIds].forEach((id) => { if ($(id)) $(id).disabled = !enabled; }); document.querySelectorAll('.reset-setting').forEach((button) => { button.disabled = !enabled; }); $('targetPickerButton').disabled = !enabled; if (!enabled) closeTargetPicker(); }
  function sendToTab(message) { return new Promise((resolve, reject) => { if (!activeTabId) return reject(new Error('No active tab is available.')); chrome.tabs.sendMessage(activeTabId, message, (response) => { const error = chrome.runtime.lastError; if (error) return reject(new Error(error.message || 'RotateFlow cannot access this page.')); if (!response) return reject(new Error('The page did not respond. Reload the page and try again.')); resolve(response); }); }); }
  function injectContentScript() { return new Promise((resolve, reject) => { chrome.scripting.executeScript({ target: { tabId: activeTabId, allFrames: false }, files: ['content.js'] }, () => { const error = chrome.runtime.lastError; if (error) reject(new Error(error.message || 'Chrome blocked script access to this page.')); else resolve(); }); }); }
  async function ensureContentScript() { try { const ping = await sendToTab({ type: 'ROTATEFLOW_PING' }); if (ping?.ok) return; } catch (_) {} await injectContentScript(); const ping = await sendToTab({ type: 'ROTATEFLOW_PING' }); if (!ping?.ok) throw new Error('RotateFlow content script did not start on this page.'); }
  function pageAccessError(error) { const message = String(error?.message || error || ''); if (/Cannot access contents of the page|The extensions gallery cannot be scripted|Cannot access a chrome/i.test(message)) return 'Chrome blocks extensions on this internal page. Open a normal webpage or local file instead.'; if (/file|scheme|permission|blocked|inject/i.test(message)) return 'Chrome blocked this local file. In chrome://extensions → RotateFlow → Details, enable “Allow access to file URLs”, then reload the local file and the extension.'; return `RotateFlow could not connect to this tab. Reload the page and try again. (${message})`; }
  function stateValues() { return { zoom: Number($('zoom').value) / 100, x: Number($('positionX').value), y: Number($('positionY').value), rotation: Number($('rotation').value), brightness: Number($('brightness').value) / 100, contrast: Number($('contrast').value) / 100 }; }
  function updateLabels() { $('zoomValue').textContent = `${$('zoom').value}%`; $('positionXValue').textContent = `${$('positionX').value} px`; $('positionYValue').textContent = `${$('positionY').value} px`; $('rotationValue').textContent = `${$('rotation').value}°`; $('brightnessValue').textContent = `${$('brightness').value}%`; $('contrastValue').textContent = `${$('contrast').value}%`; }
  function setInputs(state) {
    if (!state) return;
    const values = { zoom: Math.round(state.zoom * 100), positionX: Math.round(state.x), positionY: Math.round(state.y), rotation: Math.round(state.rotation), brightness: Math.round(state.brightness * 100), contrast: Math.round(state.contrast * 100) };
    Object.entries(values).forEach(([id, value]) => { $(id).value = value; if (inputPairs[id]) $(inputPairs[id]).value = value; });
    $('flipH').classList.toggle('active', Boolean(state.flipHorizontal)); $('flipV').classList.toggle('active', Boolean(state.flipVertical));
    const quality = values.zoom > 100 ? `Zoomed to ${values.zoom}%; original ${state.naturalWidth || '?'}×${state.naturalHeight || '?'}` : values.zoom < 100 ? 'Viewing at reduced size' : 'No quality loss at 100% zoom';
    $('qualityNote').textContent = quality;
    updateLabels();
  }
  function closeTargetPicker() { const menu = $('targetPickerMenu'); if (!menu) return; menu.hidden = true; $('targetPickerButton').setAttribute('aria-expanded', 'false'); }
  function updateTargetList(targets) {
    const menu = $('targetPickerMenu'); menu.replaceChildren(); $('targetCount').textContent = targets.length ? `${targets.length} found` : '';
    if (!targets.length) { $('targetPickerLabel').textContent = 'No visible media found'; activeTargetId = null; setEnabled(false); $('targetMeta').textContent = 'Open a page containing visible media at least 50×50 pixels.'; return; }
    if (!targets.some((target) => target.id === activeTargetId)) activeTargetId = targets[0].id;
    targets.forEach((target) => { const option = document.createElement('button'); option.type = 'button'; option.className = 'target-option'; option.dataset.targetId = target.id; option.setAttribute('role', 'option'); option.setAttribute('aria-selected', String(target.id === activeTargetId)); option.textContent = `${target.index}. ${target.type} · ${target.width}×${target.height}`; option.addEventListener('click', () => { closeTargetPicker(); selectTarget(target.id); }); menu.appendChild(option); });
    const current = targets.find((target) => target.id === activeTargetId); $('targetPickerLabel').textContent = `${current.index}. ${current.type} · ${current.width}×${current.height}`; $('targetMeta').textContent = `${current.type} selected. Shift-drag or Ctrl/Cmd-scroll directly on media.`;
  }
  async function refreshState() { try { await ensureContentScript(); const response = await sendToTab({ type: 'ROTATEFLOW_GET_STATE', targetId: activeTargetId }); if (!response.ok) throw new Error(response.error); initialized = true; activeTargetId = response.activeTargetId; updateTargetList(response.targets || []); setInputs(response.state); if (response.targets?.length) setEnabled(true); setError(''); setStatus(response.targets?.length ? 'Ready.' : 'No media detected.'); } catch (error) { initialized = false; setEnabled(false); setError(pageAccessError(error)); setStatus('Unavailable on this page.'); } }
  async function selectTarget(targetId) { try { const response = await sendToTab({ type: 'ROTATEFLOW_SELECT_TARGET', targetId }); if (!response.ok) throw new Error(response.error); activeTargetId = response.activeTargetId; updateTargetList(response.targets || []); setInputs(response.state); setError(''); setStatus('Target selected.'); } catch (error) { setError(error.message); } }
  async function applyValues(extra = {}) { if (!activeTargetId || !initialized) return; try { const response = await sendToTab({ type: 'ROTATEFLOW_APPLY', targetId: activeTargetId, values: { ...stateValues(), ...extra } }); if (!response.ok) throw new Error(response.error); setInputs(response.state); setError(''); setStatus('Applied.'); } catch (error) { setError(error.message); } }
  function queueApply() { updateLabels(); clearTimeout(applyTimer); applyTimer = setTimeout(() => applyValues(), 45); }
  function setControlValue(id, value) { const inputId = inputPairs[id]; $(id).value = value; if (inputId) $(inputId).value = value; queueApply(); }
  function resetSetting(setting) {
    const defaults = { zoom: 100, positionX: 0, positionY: 0, rotation: 0, brightness: 100, contrast: 100 };
    if (Object.prototype.hasOwnProperty.call(defaults, setting)) setControlValue(setting, defaults[setting]);
    else if (setting === 'flipHorizontal') applyValues({ flipHorizontal: false });
    else if (setting === 'flipVertical') applyValues({ flipVertical: false });
  }
  function applyTypedValue(sliderId) {
    const input = $(inputPairs[sliderId]);
    const slider = $(sliderId);
    const raw = Number(input.value);
    const value = Number.isFinite(raw) ? Math.max(Number(slider.min), Math.min(Number(slider.max), raw)) : Number(slider.value);
    setControlValue(sliderId, value);
  }
  async function resetTarget() { try { const response = await sendToTab({ type: 'ROTATEFLOW_RESET', targetId: activeTargetId }); if (!response.ok) throw new Error(response.error); setInputs(response.state); setStatus('Target reset.'); setError(''); } catch (error) { setError(error.message); } }
  async function resetAll() { if (!confirm('Reset transformations for all visible media?')) return; try { const response = await sendToTab({ type: 'ROTATEFLOW_RESET_ALL' }); if (!response.ok) throw new Error(response.error); updateTargetList(response.targets || []); const current = response.targets?.find((target) => target.id === activeTargetId) || response.targets?.[0]; if (current) setInputs(current); setStatus('All targets reset.'); setError(''); } catch (error) { setError(error.message); } }
  function toggleTheme() { const dark = document.body.classList.toggle('dark'); $('themeButton').setAttribute('aria-pressed', String(dark)); localStorage.setItem('rotateflow-theme', dark ? 'dark' : 'light'); }
  function bind() {
    $('targetPickerButton').addEventListener('click', () => { const menu = $('targetPickerMenu'); const opening = menu.hidden; menu.hidden = !opening; $('targetPickerButton').setAttribute('aria-expanded', String(opening)); if (opening) menu.querySelector('.target-option[aria-selected="true"]')?.focus(); });
    document.addEventListener('click', (event) => { if (!event.target.closest('.target-picker')) closeTargetPicker(); });
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeTargetPicker(); });
    sliderIds.forEach((id) => $(id).addEventListener('input', queueApply));
    Object.entries(inputPairs).forEach(([sliderId, inputId]) => { const input = $(inputId); input.addEventListener('change', () => applyTypedValue(sliderId)); input.addEventListener('keydown', (event) => { if (event.key === 'Enter') { event.preventDefault(); applyTypedValue(sliderId); input.blur(); } }); });
    document.querySelectorAll('[data-reset]').forEach((button) => button.addEventListener('click', () => resetSetting(button.dataset.reset)));
    $('zoomOut').addEventListener('click', () => setControlValue('zoom', Math.max(10, Number($('zoom').value) - 10))); $('zoomIn').addEventListener('click', () => setControlValue('zoom', Math.min(1000, Number($('zoom').value) + 10)));
    $('centerButton').addEventListener('click', () => { $('positionX').value = '0'; $('positionXInput').value = '0'; $('positionY').value = '0'; $('positionYInput').value = '0'; queueApply(); });
    $('rotateLeft').addEventListener('click', () => setControlValue('rotation', Number($('rotation').value) - 15)); $('rotateRight').addEventListener('click', () => setControlValue('rotation', Number($('rotation').value) + 15)); $('rotate45').addEventListener('click', () => setControlValue('rotation', 45)); $('rotate180').addEventListener('click', () => setControlValue('rotation', 180));
    $('flipH').addEventListener('click', () => applyValues({ flipHorizontal: !$('flipH').classList.contains('active') })); $('flipV').addEventListener('click', () => applyValues({ flipVertical: !$('flipV').classList.contains('active') }));
    $('resetButton').addEventListener('click', resetTarget); $('resetAllButton').addEventListener('click', resetAll); $('themeButton').addEventListener('click', toggleTheme);
    $('keyboardToggle').addEventListener('change', async () => { const enabled = $('keyboardToggle').checked; $('keyboardStatus').textContent = enabled ? 'Shortcuts enabled: R rotate, H/V flip, +/- zoom, arrows pan.' : 'Shortcuts disabled. Use the controls or direct media gestures.'; await chrome.storage.local.set({ keyboardEnabled: enabled }); try { await sendToTab({ type: 'ROTATEFLOW_SET_SETTINGS', keyboardEnabled: enabled }); } catch (_) {} });
  }
  bind();
  try { if (localStorage.getItem('rotateflow-theme') === 'dark') document.body.classList.add('dark'); } catch (_) {}
  chrome.storage.local.get({ keyboardEnabled: true }, (settings) => { $('keyboardToggle').checked = settings.keyboardEnabled !== false; });
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => { if (chrome.runtime.lastError || !tabs?.[0]?.id) return; activeTabId = tabs[0].id; refreshState(); });
})();
