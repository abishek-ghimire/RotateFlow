(() => {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const controls = ['rotation', 'scale', 'positionX', 'positionY'].map($);
  const buttons = [$('rotateLeft'), $('rotateRight'), $('centerButton'), $('resetButton'), $('resetAllButton')];
  let activeTabId = null;
  let activeTargetId = null;
  let applyTimer = null;
  let initialized = false;

  function setError(message) {
    const error = $('error');
    error.textContent = message || '';
    error.hidden = !message;
  }

  function setStatus(message) {
    $('status').textContent = message || '';
  }

  function setEnabled(enabled) {
    controls.forEach((control) => { control.disabled = !enabled; });
    buttons.forEach((button) => { button.disabled = !enabled; });
    $('targetSelect').disabled = !enabled;
  }

  function sendToTab(message) {
    return new Promise((resolve, reject) => {
      if (!activeTabId) {
        reject(new Error('No active tab is available.'));
        return;
      }
      chrome.tabs.sendMessage(activeTabId, message, (response) => {
        const lastError = chrome.runtime.lastError;
        if (lastError) {
          reject(new Error(lastError.message || 'RotateFlow cannot access this page.'));
          return;
        }
        if (!response) {
          reject(new Error('The page did not respond. Reload the page and try again.'));
          return;
        }
        resolve(response);
      });
    });
  }

  function formatRotation(value) {
    return `${Math.round(Number(value) || 0)}°`;
  }

  function formatScale(value) {
    return `${(Number(value) || 0).toFixed(1)}×`;
  }

  function syncLabels() {
    $('rotationValue').textContent = formatRotation($('rotation').value);
    $('scaleValue').textContent = formatScale($('scale').value);
    $('positionXValue').textContent = `${Math.round(Number($('positionX').value) || 0)} px`;
    $('positionYValue').textContent = `${Math.round(Number($('positionY').value) || 0)} px`;
  }

  function setInputs(state) {
    if (!state) return;
    $('rotation').value = state.rotation;
    $('scale').value = state.scale;
    $('positionX').value = Math.max(-500, Math.min(500, state.x));
    $('positionY').value = Math.max(-500, Math.min(500, state.y));
    syncLabels();
  }

  function updateTargetList(targets) {
    const select = $('targetSelect');
    const previous = activeTargetId;
    select.replaceChildren();
    targets.forEach((target) => {
      const option = document.createElement('option');
      option.value = target.id;
      option.textContent = `${target.index}. ${target.type} (${target.width}×${target.height})`;
      option.selected = target.id === activeTargetId;
      select.appendChild(option);
    });

    if (!targets.length) {
      const option = document.createElement('option');
      option.value = '';
      option.textContent = 'No visible media found';
      select.appendChild(option);
      activeTargetId = null;
      setEnabled(false);
      $('targetMeta').textContent = 'Open a page containing a visible video, image, canvas, or embedded media.';
      return;
    }

    if (!targets.some((target) => target.id === activeTargetId)) {
      activeTargetId = targets[0].id;
    }
    select.value = activeTargetId;
    $('targetMeta').textContent = `${targets.length} visible media target${targets.length === 1 ? '' : 's'} detected.`;
    if (previous !== activeTargetId) setStatus('Target selected.');
  }

  function valuesFromInputs() {
    return {
      rotation: Number($('rotation').value),
      scale: Number($('scale').value),
      x: Number($('positionX').value),
      y: Number($('positionY').value)
    };
  }

  async function applyValues() {
    if (!activeTargetId || !initialized) return;
    try {
      const response = await sendToTab({
        type: 'ROTATEFLOW_APPLY',
        targetId: activeTargetId,
        values: valuesFromInputs()
      });
      if (!response.ok) throw new Error(response.error || 'Unable to apply the transform.');
      setInputs(response.state);
      setError('');
      setStatus('Applied.');
    } catch (error) {
      setError(error.message);
    }
  }

  function queueApply() {
    syncLabels();
    window.clearTimeout(applyTimer);
    applyTimer = window.setTimeout(applyValues, 45);
  }

  async function refreshState() {
    try {
      const response = await sendToTab({ type: 'ROTATEFLOW_GET_STATE', targetId: activeTargetId });
      if (!response.ok) throw new Error(response.error || 'Unable to inspect this page.');
      initialized = true;
      activeTargetId = response.activeTargetId;
      updateTargetList(response.targets || []);
      setInputs(response.state);
      if (response.targets?.length) setEnabled(true);
      setError('');
      setStatus(response.targets?.length ? 'Ready.' : 'No media detected.');
    } catch (error) {
      initialized = false;
      setEnabled(false);
      setError('RotateFlow cannot access this page. Try a normal website tab, enable “Allow access to file URLs” for local files, or reload the tab.');
      setStatus('Unavailable on this page.');
    }
  }

  async function selectTarget(targetId) {
    if (!targetId) return;
    try {
      const response = await sendToTab({ type: 'ROTATEFLOW_SELECT_TARGET', targetId });
      if (!response.ok) throw new Error(response.error || 'Unable to select that media target.');
      activeTargetId = response.activeTargetId;
      updateTargetList(response.targets || []);
      setInputs(response.state);
      setError('');
      setStatus('Target selected.');
    } catch (error) {
      setError(error.message);
    }
  }

  async function rotateBy(degrees) {
    if (!activeTargetId) return;
    const nextRotation = Math.max(-360, Math.min(360, Number($('rotation').value) + degrees));
    $('rotation').value = nextRotation;
    syncLabels();
    await applyValues();
  }

  async function resetTarget() {
    try {
      const response = await sendToTab({ type: 'ROTATEFLOW_RESET', targetId: activeTargetId });
      if (!response.ok) throw new Error(response.error || 'Unable to reset the target.');
      setInputs(response.state);
      setStatus('Target reset.');
      setError('');
    } catch (error) {
      setError(error.message);
    }
  }

  async function resetAll() {
    try {
      const response = await sendToTab({ type: 'ROTATEFLOW_RESET_ALL' });
      if (!response.ok) throw new Error(response.error || 'Unable to reset the page.');
      updateTargetList(response.targets || []);
      const current = response.targets?.find((target) => target.id === activeTargetId) || response.targets?.[0];
      if (current) setInputs(current);
      setStatus('All targets reset.');
      setError('');
    } catch (error) {
      setError(error.message);
    }
  }

  function toggleTheme() {
    const dark = document.body.classList.toggle('dark');
    $('themeButton').setAttribute('aria-pressed', String(dark));
    try { localStorage.setItem('rotateflow-theme', dark ? 'dark' : 'light'); } catch (_) { /* storage can be unavailable */ }
  }

  $('targetSelect').addEventListener('change', (event) => selectTarget(event.target.value));
  controls.forEach((control) => control.addEventListener('input', queueApply));
  $('rotateLeft').addEventListener('click', () => rotateBy(-90));
  $('rotateRight').addEventListener('click', () => rotateBy(90));
  $('centerButton').addEventListener('click', () => {
    $('positionX').value = '0';
    $('positionY').value = '0';
    queueApply();
  });
  $('resetButton').addEventListener('click', resetTarget);
  $('resetAllButton').addEventListener('click', resetAll);
  $('themeButton').addEventListener('click', toggleTheme);

  try {
    if (localStorage.getItem('rotateflow-theme') === 'dark') document.body.classList.add('dark');
  } catch (_) { /* storage can be unavailable */ }

  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    const lastError = chrome.runtime.lastError;
    if (lastError || !tabs?.[0]?.id) {
      setEnabled(false);
      setError('No active browser tab is available.');
      return;
    }
    activeTabId = tabs[0].id;
    refreshState();
  });
})();
