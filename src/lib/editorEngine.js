export const EDITOR_ENGINE_SCRIPT = `
(function() {
  if (window.__editorEngineInitialized) return;
  window.__editorEngineInitialized = true;

  const style = document.createElement('style');
  style.textContent = \`
    .invito-hover {
      outline: 2px dashed rgba(212, 168, 83, 0.5) !important;
      outline-offset: 2px !important;
      cursor: pointer !important;
      transition: outline 0.15s ease;
    }
    .invito-selected {
      outline: 2px solid rgba(212, 168, 83, 1) !important;
      outline-offset: 4px !important;
      box-shadow: 0 0 15px rgba(212, 168, 83, 0.3) !important;
    }
    .invito-editing {
      outline: 2px solid #3b82f6 !important;
      outline-offset: 4px !important;
      background: rgba(59, 130, 246, 0.1) !important;
      cursor: text !important;
      caret-color: #3b82f6 !important;
      user-select: text !important;
      -webkit-user-select: text !important;
    }
    .invito-editing * {
      animation: none !important;
      user-select: text !important;
      -webkit-user-select: text !important;
    }
  \`;
  document.head.appendChild(style);

  let selectedElement = null;
  let editingElement = null;

  function isEditable(el) {
    if (!el || el === document.body || el === document.documentElement) return false;
    if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'SPAN', 'A', 'BUTTON', 'IMG'].includes(el.tagName)) return true;
    if (el.tagName === 'DIV' && el.children.length === 0 && el.textContent.trim().length > 0) return true;
    return false;
  }

  document.addEventListener('mouseover', (e) => {
    if (editingElement) return;
    if (isEditable(e.target)) {
      e.target.classList.add('invito-hover');
    }
  }, true);

  document.addEventListener('mouseout', (e) => {
    if (e.target.classList) {
      e.target.classList.remove('invito-hover');
    }
  }, true);

  document.addEventListener('click', (e) => {
    let target = e.target;
    let foundEditable = null;
    
    // Find closest editable parent
    while (target && target !== document.body && target !== document.documentElement) {
      if (isEditable(target)) {
        foundEditable = target;
        break;
      }
      target = target.parentElement;
    }

    if (editingElement && foundEditable !== editingElement) {
       editingElement.removeAttribute('contenteditable');
       editingElement.classList.remove('invito-editing');
       editingElement.style.userSelect = '';
       editingElement.style.webkitUserSelect = '';
       window.parent.postMessage({ type: 'TEXT_UPDATED', text: editingElement.innerHTML }, '*');
       editingElement = null;
    }

    if (selectedElement && selectedElement !== foundEditable) {
      selectedElement.classList.remove('invito-selected');
    }

    if (foundEditable) {
      e.preventDefault();
      e.stopPropagation();
      
      if (selectedElement === foundEditable && editingElement !== foundEditable) {
        // Second click on already selected element -> enter edit mode
        editingElement = foundEditable;
        editingElement.setAttribute('contenteditable', 'true');
        editingElement.classList.add('invito-editing');
        editingElement.style.userSelect = 'text';
        editingElement.style.webkitUserSelect = 'text';
        editingElement.focus();
        
        try {
          const selection = window.getSelection();
          const range = document.createRange();
          range.selectNodeContents(editingElement);
          selection.removeAllRanges();
          selection.addRange(range);
        } catch (err) {}
      } else if (selectedElement !== foundEditable) {
        // First click -> just select it
        selectedElement = foundEditable;
        selectedElement.classList.remove('invito-hover');
        selectedElement.classList.add('invito-selected');
        
        const bounds = selectedElement.getBoundingClientRect();
        window.parent.postMessage({
          type: 'ELEMENT_SELECTED',
          tagName: selectedElement.tagName,
          bounds: { top: bounds.top, left: bounds.left, width: bounds.width, height: bounds.height },
          text: selectedElement.textContent
        }, '*');
      }
    } else {
      if (selectedElement) {
        window.parent.postMessage({ type: 'ELEMENT_DESELECTED' }, '*');
        selectedElement = null;
      }
    }
  }, true);

  window.addEventListener('scroll', () => {
    if (selectedElement) {
      const bounds = selectedElement.getBoundingClientRect();
      window.parent.postMessage({
        type: 'ELEMENT_BOUNDS_UPDATE',
        bounds: { top: bounds.top, left: bounds.left, width: bounds.width, height: bounds.height }
      }, '*');
    }
  });

  window.addEventListener('message', (e) => {
    if (!e.data) return;

    if (e.data.type === 'RESIZE_ELEMENT' && selectedElement) {
      const newScale = e.data.scale;
      // Use the independent CSS 'scale' property so we don't break existing 'transform' animations
      if (window.getComputedStyle(selectedElement).display === 'inline') {
        selectedElement.style.display = 'inline-block';
      }
      selectedElement.style.scale = newScale;
      selectedElement.style.transformOrigin = 'center center';
      
      // Immediately report new bounds so the React overlay sticks to it
      const bounds = selectedElement.getBoundingClientRect();
      window.parent.postMessage({
        type: 'ELEMENT_BOUNDS_UPDATE',
        bounds: { top: bounds.top, left: bounds.left, width: bounds.width, height: bounds.height }
      }, '*');
    }

    if (e.data.type === 'UPDATE_TEXT' && selectedElement) {
      selectedElement.textContent = e.data.text;
      const bounds = selectedElement.getBoundingClientRect();
      window.parent.postMessage({
        type: 'ELEMENT_BOUNDS_UPDATE',
        bounds: { top: bounds.top, left: bounds.left, width: bounds.width, height: bounds.height }
      }, '*');
    }

    function applyPhoto(el, photoUrl) {
      if (!el || !photoUrl) return;
      if (el.tagName === 'IMG') {
        el.src = photoUrl;
      } else {
        el.style.backgroundImage = 'url(' + photoUrl + ')';
        el.style.backgroundSize = 'cover';
        el.style.backgroundPosition = 'center';
        el.innerHTML = '';
        el.classList.add('has-custom-photo');
      }
    }

    function ensurePhotoStyle() {
      if (!document.querySelector('style[data-photo-style]')) {
        const style = document.createElement('style');
        style.setAttribute('data-photo-style', 'true');
        style.textContent = '.has-custom-photo::before, .has-custom-photo::after { color: transparent !important; -webkit-text-fill-color: transparent !important; }';
        document.head.appendChild(style);
      }
    }

    if (e.data.type === 'UPDATE_GROOM_PHOTO' && e.data.photo) {
      ensurePhotoStyle();
      const groomSelectors = '[data-person="groom"], #groom-placeholder, #frame-groom .frame-photo-placeholder, .groom-photo, [data-groom-photo], .person-card:first-of-type .photo-placeholder, .person-card:first-of-type .photo-frame, #frame-groom';
      document.querySelectorAll(groomSelectors).forEach((el) => applyPhoto(el, e.data.photo));
    }

    if (e.data.type === 'UPDATE_BRIDE_PHOTO' && e.data.photo) {
      ensurePhotoStyle();
      const brideSelectors = '[data-person="bride"], #bride-placeholder, #frame-bride .frame-photo-placeholder, .bride-photo, [data-bride-photo], .person-card:last-of-type .photo-placeholder, .person-card:last-of-type .photo-frame, #frame-bride';
      document.querySelectorAll(brideSelectors).forEach((el) => applyPhoto(el, e.data.photo));
    }

    if (e.data.type === 'UPDATE_PHOTO' && e.data.photo) {
      ensurePhotoStyle();
      const photo = e.data.photo;
      const photoElements = document.querySelectorAll('.couple-photo img, .hero-photo, .photo-frame img, .photo-placeholder, .frame-photo-placeholder, .polaroid-photo, .photo-area, .couple-photo-placeholder, [data-invito-photo]');
      photoElements.forEach((el) => applyPhoto(el, photo));
    }
  });

  // Context Menu
  let contextMenuEl = null;
  document.addEventListener('contextmenu', (e) => {
    let target = e.target;
    let foundEditable = null;
    
    while (target && target !== document.body && target !== document.documentElement) {
      if (isEditable(target)) {
        foundEditable = target;
        break;
      }
      target = target.parentElement;
    }

    if (foundEditable || (e.target && e.target.tagName === 'IMG')) {
      e.preventDefault();
      e.stopPropagation();
      
      const el = foundEditable || e.target;
      
      if (selectedElement !== el) {
        if (selectedElement) selectedElement.classList.remove('invito-selected');
        selectedElement = el;
        selectedElement.classList.add('invito-selected');
        
        const bounds = selectedElement.getBoundingClientRect();
        window.parent.postMessage({
          type: 'ELEMENT_SELECTED',
          tagName: selectedElement.tagName,
          bounds: { top: bounds.top, left: bounds.left, width: bounds.width, height: bounds.height },
          text: selectedElement.textContent
        }, '*');
      }

      if (contextMenuEl) {
        contextMenuEl.remove();
      }

      contextMenuEl = document.createElement('div');
      contextMenuEl.style.position = 'fixed';
      contextMenuEl.style.top = e.clientY + 'px';
      contextMenuEl.style.left = e.clientX + 'px';
      contextMenuEl.style.backgroundColor = '#18181b';
      contextMenuEl.style.border = '1px solid rgba(255,255,255,0.1)';
      contextMenuEl.style.borderRadius = '12px';
      contextMenuEl.style.padding = '4px';
      contextMenuEl.style.zIndex = '999999';
      contextMenuEl.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)';
      contextMenuEl.style.minWidth = '160px';
      contextMenuEl.style.fontFamily = 'system-ui, -apple-system, sans-serif';

      if (el.tagName === 'IMG' || el.classList.contains('photo-placeholder') || el.classList.contains('frame-photo-placeholder') || el.classList.contains('couple-photo-placeholder')) {
        const replaceBtn = document.createElement('button');
        replaceBtn.textContent = '🔄 Replace Image';
        replaceBtn.style.display = 'block';
        replaceBtn.style.width = '100%';
        replaceBtn.style.textAlign = 'left';
        replaceBtn.style.padding = '10px 12px';
        replaceBtn.style.background = 'transparent';
        replaceBtn.style.border = 'none';
        replaceBtn.style.color = '#fff';
        replaceBtn.style.fontSize = '13px';
        replaceBtn.style.cursor = 'pointer';
        replaceBtn.style.borderRadius = '8px';
        replaceBtn.onmouseover = () => replaceBtn.style.backgroundColor = 'rgba(255,255,255,0.1)';
        replaceBtn.onmouseout = () => replaceBtn.style.backgroundColor = 'transparent';
        replaceBtn.onclick = () => {
          window.parent.postMessage({ type: 'TRIGGER_IMAGE_UPLOAD' }, '*');
          contextMenuEl.remove();
          contextMenuEl = null;
        };
        contextMenuEl.appendChild(replaceBtn);
      }
      
      const deselectBtn = document.createElement('button');
      deselectBtn.textContent = '✕ Deselect';
      deselectBtn.style.display = 'block';
      deselectBtn.style.width = '100%';
      deselectBtn.style.textAlign = 'left';
      deselectBtn.style.padding = '10px 12px';
      deselectBtn.style.background = 'transparent';
      deselectBtn.style.border = 'none';
      deselectBtn.style.color = 'rgba(255,255,255,0.6)';
      deselectBtn.style.fontSize = '13px';
      deselectBtn.style.cursor = 'pointer';
      deselectBtn.style.borderRadius = '8px';
      deselectBtn.onmouseover = () => deselectBtn.style.backgroundColor = 'rgba(255,255,255,0.1)';
      deselectBtn.onmouseout = () => deselectBtn.style.backgroundColor = 'transparent';
      deselectBtn.onclick = () => {
        if (selectedElement) selectedElement.classList.remove('invito-selected');
        selectedElement = null;
        window.parent.postMessage({ type: 'ELEMENT_DESELECTED' }, '*');
        contextMenuEl.remove();
        contextMenuEl = null;
      };
      contextMenuEl.appendChild(deselectBtn);

      document.body.appendChild(contextMenuEl);
    }
  }, true);

  document.addEventListener('click', () => {
    if (contextMenuEl) {
      contextMenuEl.remove();
      contextMenuEl = null;
    }
  });

})();
`;
