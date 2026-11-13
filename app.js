(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const createId = () => globalThis.crypto?.randomUUID?.() || `design-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
  const canvas = $('#designCanvas'), ctx = canvas.getContext('2d'), page = $('#page');
  const palettes = {
    orchid: ['#54306d', '#d485a8'], sunset: ['#c36353', '#f6c88d'],
    ocean: ['#243b66', '#82c3ca'], forest: ['#163e36', '#96b39a']
  };
  const templateThemes = [
    ['Computer','Calm desktop','DESKTOP\nWALLPAPER','grid'],['Computer','Pastel focus','MAKE SPACE\nTO THINK','dots'],['Computer','Night workspace','STAY\nCURIOUS','grain'],['Computer','Pixel sunrise','A FRESH\nSTART','lines'],['Computer','Soft screens','CLEAR YOUR\nMIND','none'],['Computer','Digital garden','IDEAS\nGROW HERE','dots'],
    ['Flower','Soft petals','BLOOM\nSLOWLY','grain'],['Flower','Wild garden','GROW WITH\nGRACE','dots'],['Flower','Spring field','HELLO\nSPRING','lines'],['Flower','Botanical notes','LET IT\nBLOOM','grid'],['Flower','Blush roses','FLOWER\nPOWER','dots'],['Flower','Daisy days','SLOW DOWN\nAND GROW','grain'],
    ['Space','Deep orbit','LOOK\nUP','dots'],['Space','Moonlight','DREAM\nBEYOND','grain'],['Space','Cosmic dust','INFINITE\nPOSSIBILITIES','dots'],['Space','Planetarium','FIND YOUR\nUNIVERSE','grid'],['Space','Starlight','KEEP\nWONDERING','lines'],['Space','Solar glow','A SKY FULL\nOF IDEAS','grain'],
    ['Christmas','Evergreen','WARM\nWISHES','grain'],['Christmas','Winter light','PEACE &\nJOY','dots'],['Christmas','Golden night','HAPPY\nHOLIDAYS','lines'],['Christmas','Snow day','LET IT\nSNOW','grid'],['Christmas','Festive sparkle','SEASON OF\nWONDER','dots'],
    ['Abstract','Color flow','MAKE IT\nHAPPEN','lines'],['Abstract','Liquid shapes','NEW\nIDEAS','dots'],['Abstract','Modern art','BE\nBOLD','grid'],['Abstract','Shape study','THINK\nDIFFERENT','diagonal'],['Abstract','Color pop','MAKE SOME\nNOISE','dots'],['Abstract','Soft geometry','FIND YOUR\nFLOW','lines'],
    ['Birthday','Confetti','MAKE A\nWISH','dots'],['Birthday','Party time','TODAY IS\nYOUR DAY','grain'],['Birthday','Sweet day','HAPPY\nBIRTHDAY','lines'],['Birthday','Cake and candles','LET’S\nCELEBRATE','dots'],['Birthday','Big year','ANOTHER YEAR\nTO SHINE','grid'],
    ['Pattern','Checkerboard','SIMPLE\nTHINGS','grid'],['Pattern','Wavy lines','GOOD\nVIBRATIONS','lines'],['Pattern','Tiny dots','TAKE IT\nEASY','dots'],['Pattern','Paper grid','MAKE ROOM\nFOR PLAY','grid'],['Pattern','Modern stripes','A LITTLE\nMORE COLOR','lines'],['Pattern','Curved repeat','STAY\nIN MOTION','dots'],
    ['Motivational','Keep going','KEEP\nGOING','grain'],['Motivational','Be here','BE HERE\nNOW','lines'],['Motivational','One day','ONE DAY\nAT A TIME','diagonal'],['Motivational','Choose joy','CHOOSE\nJOY','dots'],['Motivational','Small steps','SMALL STEPS\nEVERY DAY','grid'],['Motivational','Make today','MAKE TODAY\nCOUNT','grain'],
    ['Texture','Rose marble','SOFT\nMOMENTS','lines'],['Texture','Indigo grain','FIND YOUR\nRHYTHM','grain'],['Texture','Sandstone','TAKE A\nBREATH','diagonal'],['Texture','Canvas weave','MADE OF\nMOMENTS','grid'],['Texture','Paper grain','KEEP IT\nTACTILE','dots'],
    ['Minimal','Warm paper','LESS, BUT\nBETTER','none'],['Minimal','Quiet blue','A QUIET\nMIND','none'],['Minimal','Soft clay','JUST\nBEGIN','none'],['Minimal','Open space','ROOM TO\nTHINK','none'],['Minimal','Simple form','BEAUTY IN\nTHE EVERYDAY','none'],
    ['Nature','Forest path','GO\nOUTSIDE','grain'],['Nature','Ocean air','FRESH\nAIR','lines'],['Nature','Golden field','SLOW\nMORNINGS','dots'],['Nature','Mountain view','TAKE THE\nLONG WAY','grid'],['Nature','Desert bloom','FIND YOUR\nWILD','grain'],['Nature','River stones','FOLLOW THE\nCURRENT','lines'],
    ['Gradient','Orchid haze','CREATE\nSOMETHING','grain'],['Gradient','Blue hour','BLUE\nHOUR','none'],['Gradient','Peach glow','GOOD\nENERGY','none'],['Gradient','Citrus dream','BRIGHTER\nDAYS','dots'],['Gradient','Lavender mist','DREAM IN\nCOLOR','none']
  ];
  const templatePalettes = [
    ['#d7e8ff','#576f9a','Blue calm'],['#f3e6fb','#a7bfdc','Pastel focus'],['#141b38','#5a70aa','Midnight'],['#f8dfdf','#aa778f','Rose'],['#efb3bc','#663f70','Berry'],['#dce9c5','#78966a','Garden'],['#090a24','#6039a4','Cosmic'],['#144637','#c44747','Evergreen'],['#df6383','#f0bb69','Pop art'],['#c9a98e','#69564c','Sandstone']
  ];
  const templates = templateThemes.flatMap(([category, theme, words, texture], themeIndex) => templatePalettes.map(([color, color2, palette], paletteIndex) => {
    const name = `${theme} · ${palette}`;
    const font = category === 'Motivational' ? 'Archivo Black' : category === 'Flower' ? 'Cormorant Garamond' : paletteIndex % 4 === 0 ? 'Bebas Neue' : 'Playfair Display';
    return [name, color, color2, words, category, texture, font, 76 + ((themeIndex + paletteIndex) % 4) * 9, paletteIndex];
  }));
  const fontNames = ['Playfair Display','DM Sans','Space Grotesk','Syne','Montserrat','Poppins','Lora','Merriweather','Oswald','Bebas Neue','Anton','Cormorant Garamond','Raleway','Libre Baskerville','Abril Fatface','Pacifico','Caveat','Dancing Script','Outfit','Archivo Black','Georgia','Arial'];
  const state = {
    id: createId(), name: 'Untitled design', width: 1600, height: 1000, zoom: 70,
    background: { type: 'gradient', color: '#d4adc2', color2: '#9279a5', angle: 135, texture: 'grain', strength: 16 },
    image: null, imageData: '', imageName: '', imageFit: 'cover', imageAdjust: { brightness: 100, contrast: 100, saturation: 100, blur: 0 },
    text: { content: 'A little more\nroom to bloom', font: 'Playfair Display', size: 96, color: '#fffaf2', weight: '700', align: 'center', x: .5, y: .51, spacing: 0, shadow: true },
    shape: null, visibility: { image: true, shape: true, text: true }, selected: 'text', history: [], future: [], format: 'png', category: 'all'
  };

  const safeCopy = () => ({ ...state, image: null, history: [], future: [] });
  let committedState = JSON.stringify(safeCopy());
  let toastTimer, saveTimer;
  function toast(message) { const el = $('#toast'); el.textContent = message; el.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 2200); }
  function changed(push = true) {
    if (push) {
      state.history.push(committedState);
      if (state.history.length > 30) state.history.shift();
      state.future.length = 0;
      committedState = JSON.stringify(safeCopy());
    }
    draw(); updateInspector(); updateLayers(); scheduleSave();
  }
  function scheduleSave() {
    $('#saveState').textContent = 'Saving…'; clearTimeout(saveTimer);
    saveTimer = setTimeout(async () => {
      const project = safeCopy();
      try {
        const list = JSON.parse(localStorage.getItem('canvasly-projects') || '[]').filter(item => item.id !== project.id);
        list.unshift(project); localStorage.setItem('canvasly-projects', JSON.stringify(list)); localStorage.setItem('canvasly-current-id', project.id); localStorage.setItem('canvasly-project', JSON.stringify(project));
      } catch {}
      try { await fetch(`/api/projects/${encodeURIComponent(project.id)}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(project) }); } catch {}
      $('#saveState').textContent = 'All changes saved';
    }, 500);
  }
  function drawBackground() {
    const { background: b } = state, w = canvas.width, h = canvas.height;
    if (b.type === 'solid') { ctx.fillStyle = b.color; ctx.fillRect(0, 0, w, h); }
    else {
      const rad = b.angle * Math.PI / 180, d = Math.hypot(w, h) / 2;
      const grad = ctx.createLinearGradient(w / 2 - Math.cos(rad) * d, h / 2 - Math.sin(rad) * d, w / 2 + Math.cos(rad) * d, h / 2 + Math.sin(rad) * d);
      grad.addColorStop(0, b.color); grad.addColorStop(1, b.color2); ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
    }
  }
  function drawPhoto() {
    const im = state.image; if (state.visibility?.image === false || !im?.complete || !im.naturalWidth) return;
    const w = canvas.width, h = canvas.height, scale = state.imageFit === 'contain' ? Math.min(w / im.width, h / im.height) : Math.max(w / im.width, h / im.height);
    const dw = state.imageFit === 'stretch' ? w : im.width * scale, dh = state.imageFit === 'stretch' ? h : im.height * scale;
    ctx.save(); ctx.filter = `brightness(${state.imageAdjust.brightness}%) contrast(${state.imageAdjust.contrast}%) saturate(${state.imageAdjust.saturation}%) blur(${state.imageAdjust.blur}px)`;
    ctx.drawImage(im, (w - dw) / 2, (h - dh) / 2, dw, dh); ctx.restore();
  }
  function drawTexture() {
    const { texture, strength } = state.background, w = canvas.width, h = canvas.height;
    if (!texture || texture === 'none' || strength <= 0) return;
    const tile = document.createElement('canvas'), t = tile.getContext('2d'); tile.width = tile.height = 96; t.strokeStyle = t.fillStyle = `rgba(255,255,255,${strength / 100})`; t.lineWidth = 1;
    if (texture === 'grain') { for (let i = 0; i < 260; i++) { t.globalAlpha = Math.random() * .5; t.fillRect(Math.random() * 96, Math.random() * 96, 1.4, 1.4); } t.globalAlpha = 1; }
    if (texture === 'dots') for (let y = 5; y < 96; y += 12) for (let x = 5; x < 96; x += 12) { t.beginPath(); t.arc(x, y, 1.2, 0, 7); t.fill(); }
    if (texture === 'grid') { for (let n = 0; n < 96; n += 18) { t.beginPath(); t.moveTo(n, 0); t.lineTo(n, 96); t.moveTo(0, n); t.lineTo(96, n); t.stroke(); } }
    if (texture === 'lines') { t.save(); t.translate(48, 48); t.rotate(Math.PI / 4); for (let x = -100; x < 100; x += 13) { t.beginPath(); t.moveTo(x, -100); t.lineTo(x, 100); t.stroke(); } t.restore(); }
    ctx.fillStyle = ctx.createPattern(tile, 'repeat'); ctx.fillRect(0, 0, w, h);
  }
  function drawText() {
    if (state.visibility?.text === false) return;
    const t = state.text, w = canvas.width, size = t.size * w / 1600, lines = t.content.split('\n'), lineHeight = size * 1.15;
    ctx.save(); ctx.font = `${t.weight} ${size}px "${t.font}", Georgia, serif`; ctx.textAlign = t.align; ctx.textBaseline = 'middle'; ctx.fillStyle = t.color;
    if (t.shadow) { ctx.shadowColor = '#2414276b'; ctx.shadowBlur = size * .22; ctx.shadowOffsetY = size * .05; }
    const x = t.x * w, top = t.y * canvas.height - (lines.length - 1) * lineHeight / 2;
    lines.forEach((line, i) => {
      if (t.spacing <= 0) ctx.fillText(line, x, top + i * lineHeight, w * .8);
      else { const chars = [...line]; const widths = chars.map(c => ctx.measureText(c).width + t.spacing * w / 1600); let xx = x - widths.reduce((a, n) => a + n, 0) / 2; chars.forEach((c, j) => { ctx.fillText(c, xx, top + i * lineHeight); xx += widths[j]; }); }
    }); ctx.restore();
  }
  function drawShape() {
    const s = state.shape; if (!s || state.visibility?.shape === false) return; const x = s.x * canvas.width, y = s.y * canvas.height, z = s.size * canvas.width;
    ctx.save(); ctx.fillStyle = s.color; ctx.strokeStyle = s.color; ctx.lineWidth = Math.max(4, z / 45);
    if (s.kind === 'circle') { ctx.beginPath(); ctx.arc(x, y, z / 2, 0, Math.PI * 2); ctx.fill(); }
    else if (s.kind === 'line') { ctx.beginPath(); ctx.moveTo(x - z / 2, y); ctx.lineTo(x + z / 2, y); ctx.stroke(); }
    else if (s.kind === 'star') { ctx.font = `${z}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('✦', x, y); }
    else { ctx.beginPath(); ctx.roundRect(x - z / 2, y - z / 2, z, z, z * .05); ctx.fill(); }
    ctx.restore();
  }
  function draw() { if (canvas.width !== state.width || canvas.height !== state.height) { canvas.width = state.width; canvas.height = state.height; } ctx.clearRect(0, 0, canvas.width, canvas.height); drawBackground(); drawPhoto(); drawTexture(); drawShape(); drawText(); page.style.aspectRatio = `${state.width}/${state.height}`; }
  function redraw() { draw(); }
  function buildTemplates() {
    $('#templateGrid').innerHTML = '';
    const featured = [...new Set(templates.map(t => t[4]))].map(category => templates.find(t => t[4] === category));
    featured.forEach((item, index) => $('#templateGrid').append(makeTemplateCard(item, index, false)));
    $('#templateCount').textContent = `${templates.length} designs`;
  }
  function makeTemplateCard(item, index, large) {
    const [name, color, color2, words, category, texture] = item, card = document.createElement('article');
    card.className = large ? 'gallery-card' : 'template-card'; card.dataset.name = name.toLowerCase(); card.dataset.category = category; card.dataset.order = index;
    card.innerHTML = `<div class="template-art texture-${texture}" style="--c1:${color};--c2:${color2}"><span class="art-orb"></span><i>${escapeHtml(words).replaceAll('\n', '<br>')}</i><em>FREE</em><button class="edit-template" data-use-template="${index}">Edit this template</button></div><span class="template-name">${escapeHtml(name)}</span><small class="template-category">${category} · ${texture}</small>`;
    card.onclick = e => { if (!e.target.closest('[data-use-template]')) useTemplate(item); };
    card.querySelector('[data-use-template]').onclick = e => { e.stopPropagation(); useTemplate(item); };
    return card;
  }
  function useTemplate(item) {
    const [name, color, color2, words, category, texture, font, size, paletteIndex] = item;
    const rgb = color.match(/[\da-f]{2}/gi).map(v => parseInt(v, 16));
    state.background = { ...state.background, type: 'gradient', color, color2, texture, angle: 120 + paletteIndex * 11, strength: 12 + (paletteIndex % 5) * 3 };
    state.text = { ...state.text, content: words, font, color: (rgb[0] * .299 + rgb[1] * .587 + rgb[2] * .114) / 255 > .63 ? '#27232d' : '#fffaf2', size, weight: '700', x: .5, y: .51, align: 'center', spacing: 0, shadow: true };
    state.image = null; state.imageData = ''; state.imageName = ''; state.shape = null; state.visibility = { image: true, shape: true, text: true }; state.selected = 'text';
    $('#templatesModal').classList.add('hidden'); changed(); toast(`${name} opened in the editor`);
  }
  let galleryLimit = 60, galleryResults = [];
  function renderGallery(reset = false) {
    if (reset) galleryLimit = 60;
    const query = $('#gallerySearch').value.trim().toLowerCase(), category = $('#galleryCategory').value;
    galleryResults = templates.map((item, index) => ({ item, index })).filter(({ item }) => (!query || item[0].toLowerCase().includes(query) || item[4].toLowerCase().includes(query) || item[3].toLowerCase().includes(query)) && (category === 'all' || item[4] === category));
    const sort = $('#gallerySort').value;
    if (sort === 'az') galleryResults.sort((a, b) => a.item[0].localeCompare(b.item[0]));
    else if (sort === 'za') galleryResults.sort((a, b) => b.item[0].localeCompare(a.item[0]));
    else galleryResults.sort((a, b) => a.index - b.index);
    $('#galleryCount').textContent = `Showing ${Math.min(galleryLimit, galleryResults.length)} of ${galleryResults.length} templates`;
    $('#allTemplateGrid').replaceChildren(...galleryResults.slice(0, galleryLimit).map(({ item, index }) => makeTemplateCard(item, index, true)));
    $('#showMoreTemplates').classList.toggle('hidden', galleryLimit >= galleryResults.length);
  }
  function updateLayers() {
    const rows = [];
    if (state.image || state.imageData) rows.push(['▧', state.imageName || 'Photo background', 'image']);
    if (state.shape) rows.push(['◆', 'Shape', 'shape']);
    rows.push(['T', state.text.content.replaceAll('\n', ' ') || 'Text', 'text']);
    $('#layerList').innerHTML = rows.map(([glyph, name, id]) => `<div class="layer-row ${state.selected === id ? 'active' : ''}" data-layer="${id}"><span class="layer-glyph">${glyph}</span><b>${escapeHtml(name)}</b><button data-hide="${id}" title="Toggle visibility">${state.visibility?.[id] === false ? '○' : '◉'}</button><button data-delete="${id}" title="Delete">×</button></div>`).join('');
  }
  function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
  function sliderField(label, key, min, max, value, suffix = '') { return `<div class="field"><label>${label}<span>${value}${suffix}</span></label><input type="range" min="${min}" max="${max}" value="${value}" data-key="${key}"></div>`; }
  function updateInspector() {
    const box = $('#inspector');
    if (!state.selected) { box.innerHTML = `<div class="inspector-empty"><div class="inspector-glyph">✦</div><b>Make it yours</b><p>Select an image, text or shape on your design to see its editing tools.</p></div>`; return; }
    if (state.selected === 'text') {
      const t = state.text;
      box.innerHTML = `<h2>Text</h2><div class="field"><label>Text</label><textarea id="insText" class="ins-text">${escapeHtml(t.content)}</textarea></div><div class="field"><label>Font family</label><select id="insFont">${fontNames.map(font => `<option ${t.font === font ? 'selected' : ''}>${font}</option>`).join('')}</select></div><div class="field"><label>Font size <span>${t.size}px</span></label><input type="range" min="20" max="200" value="${t.size}" id="insSize"></div><div class="field"><label>Text color</label><div class="text-swatches">${['#fffaf2','#ffffff','#202127','#f3bd60','#f3a3b8','#a8d9cd','#a9b8f4','#b993e8'].map(color => `<button data-text-color="${color}" style="background:${color}" aria-label="Text color ${color}"></button>`).join('')}<input class="color-input" type="color" id="insTextColor" value="${t.color}" aria-label="Custom text color"></div></div><div class="section-label"><b>Alignment</b></div><div class="mini-actions">${['left', 'center', 'right'].map(a => `<button class="${t.align === a ? 'active' : ''}" data-align="${a}">${a === 'left' ? '⇤' : a === 'right' ? '⇥' : '↔'} ${a}</button>`).join('')}</div><div class="field"><label>Letter spacing <span>${t.spacing}px</span></label><input type="range" min="0" max="14" value="${t.spacing}" id="insSpacing"></div><div class="mini-actions"><button id="boldText">${t.weight === '700' ? '✓ ' : ''}Bold</button><button id="shadowText">${t.shadow ? '✓ ' : ''}Shadow</button><button class="danger" data-delete="text">Delete</button></div>`;
      $('#insText').oninput = e => { t.content = e.target.value; redraw(); updateLayers(); scheduleSave(); };
      $('#insFont').onchange = e => { t.font = e.target.value; changed(); };
      $('#insSize').oninput = e => { t.size = +e.target.value; redraw(); scheduleSave(); };
      $('#insTextColor').oninput = e => { t.color = e.target.value; redraw(); scheduleSave(); };
      $$('[data-text-color]', box).forEach(b => b.onclick = () => { t.color = b.dataset.textColor; changed(); });
      $('#insSpacing').oninput = e => { t.spacing = +e.target.value; redraw(); scheduleSave(); };
      $('#boldText').onclick = () => { t.weight = t.weight === '700' ? '500' : '700'; changed(); };
      $('#shadowText').onclick = () => { t.shadow = !t.shadow; changed(); };
      $$('[data-align]', box).forEach(b => b.onclick = () => { t.align = b.dataset.align; changed(); });
    } else if (state.selected === 'image') {
      box.innerHTML = `<h2>Photo</h2><button class="add-text-btn secondary" id="replacePhoto">↑ Replace photo</button><div class="section-label"><b>Adjust image</b></div>${sliderField('Brightness', 'brightness', 40, 160, state.imageAdjust.brightness, '%')}${sliderField('Contrast', 'contrast', 40, 160, state.imageAdjust.contrast, '%')}${sliderField('Saturation', 'saturation', 0, 200, state.imageAdjust.saturation, '%')}${sliderField('Blur', 'blur', 0, 14, state.imageAdjust.blur, 'px')}<div class="field"><label>Image fit</label><select id="imageFit"><option value="cover" ${state.imageFit === 'cover' ? 'selected' : ''}>Fill canvas</option><option value="contain" ${state.imageFit === 'contain' ? 'selected' : ''}>Fit inside</option><option value="stretch" ${state.imageFit === 'stretch' ? 'selected' : ''}>Stretch</option></select></div><div class="section-label"><b>Quick filters</b></div><div class="mini-actions"><button data-filter="original">Original</button><button data-filter="warm">Warm</button><button data-filter="mono">Mono</button></div><div class="section-label"><b>Crop</b></div><div class="mini-actions"><button data-crop="square">Square</button><button data-crop="landscape">Landscape</button><button data-crop="portrait">Portrait</button></div><div class="section-label"><button class="text-link" id="removePhoto">Remove photo</button></div>`;
      $$('[data-key]', box).forEach(input => input.oninput = () => { state.imageAdjust[input.dataset.key] = +input.value; input.previousElementSibling.querySelector('span').textContent = input.value + (input.dataset.key === 'blur' ? 'px' : '%'); redraw(); scheduleSave(); });
      $('#imageFit').onchange = e => { state.imageFit = e.target.value; changed(); };
      $('#replacePhoto').onclick = () => $('#imageFile').click(); $('#removePhoto').onclick = () => { state.image = null; state.imageData = ''; state.imageName = ''; state.selected = 'text'; changed(); };
      $$('[data-filter]', box).forEach(b => b.onclick = () => { const filter = b.dataset.filter; state.imageAdjust = filter === 'warm' ? { brightness: 105, contrast: 108, saturation: 125, blur: 0 } : filter === 'mono' ? { brightness: 100, contrast: 120, saturation: 0, blur: 0 } : { brightness: 100, contrast: 100, saturation: 100, blur: 0 }; changed(); });
      $$('[data-crop]', box).forEach(b => b.onclick = () => { const shape = b.dataset.crop; const sizes = { square: [1080, 1080], landscape: [1600, 1000], portrait: [1000, 1400] }; [state.width, state.height] = sizes[shape]; canvas.width = state.width; canvas.height = state.height; changed(); });
    } else if (state.selected === 'shape') {
      const s = state.shape; box.innerHTML = `<h2>Shape</h2><div class="field"><label>Fill color</label><input class="color-input" type="color" id="shapeColor" value="${s.color}"></div><div class="field"><label>Size <span>${Math.round(s.size * 100)}%</span></label><input type="range" min="5" max="55" value="${Math.round(s.size * 100)}" id="shapeSize"></div><button class="add-text-btn secondary danger" data-delete="shape">Delete shape</button>`;
      $('#shapeColor').oninput = e => { s.color = e.target.value; redraw(); scheduleSave(); }; $('#shapeSize').oninput = e => { s.size = +e.target.value / 100; redraw(); scheduleSave(); };
    }
  }
  function addText(text, size = 72, font = 'DM Sans') { state.text = { ...state.text, content: text, size, font, x: .5, y: .51 }; state.selected = 'text'; changed(); }
  function addShape(kind) { state.shape = { kind, color: '#ffc55b', size: kind === 'line' ? .3 : .16, x: .5, y: .5 }; state.selected = 'shape'; changed(); }
  function setPanel(name) {
    $$('.rail-item').forEach(b => b.classList.toggle('active', b.dataset.panel === name));
    $$('.panel-section').forEach(s => s.classList.add('hidden'));
    const section = $(`#panel-${name}`); if (section) section.classList.remove('hidden');
    $('#panelHeading').textContent = name[0].toUpperCase() + name.slice(1);
  }
  function useImage(file) {
    if (!file || !file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file), img = new Image();
    img.onload = () => { state.image = img; state.imageName = file.name; state.imageAdjust = { brightness: 100, contrast: 100, saturation: 100, blur: 0 }; state.visibility ||= { image: true, shape: true, text: true }; state.visibility.image = true; state.selected = 'image'; const scale = Math.min(1, 1400 / Math.max(img.naturalWidth, img.naturalHeight)); const savedCanvas = document.createElement('canvas'); savedCanvas.width = Math.round(img.naturalWidth * scale); savedCanvas.height = Math.round(img.naturalHeight * scale); savedCanvas.getContext('2d').drawImage(img, 0, 0, savedCanvas.width, savedCanvas.height); try { state.imageData = savedCanvas.toDataURL('image/webp', .78); } catch { state.imageData = ''; } addUploadThumb(file.name, url, state.imageData); changed(); toast('Photo added to your design'); };
    img.src = url;
  }
  function addUploadThumb(name, src, savedSrc = src) {
    const item = document.createElement('button'); item.className = 'upload-thumb';
    item.innerHTML = `<img src="${src}" alt=""><span>${escapeHtml(name)}</span>`;
    item.onclick = () => { const im = new Image(); im.onload = () => { state.image = im; state.imageName = name; state.imageData = savedSrc; state.selected = 'image'; changed(); }; im.src = src; };
    if ($('#uploadList .empty-uploads')) $('#uploadList').innerHTML = ''; $('#uploadList').prepend(item);
  }
  async function loadProject() {
    let list; try { const res = await fetch('/api/projects'); if (res.ok) list = await res.json(); } catch {}
    if (!Array.isArray(list) || !list.length) try { list = JSON.parse(localStorage.getItem('canvasly-projects') || '[]'); } catch {}
    if ((!list || !list.length)) {
      let old; try { old = JSON.parse(localStorage.getItem('canvasly-project')); } catch {}
      if (old) { old.id ||= createId(); list = [old]; }
    }
    if (!list?.length) return;
    const currentId = localStorage.getItem('canvasly-current-id');
    const data = list.find(item => item.id === currentId) || list[0];
    Object.assign(state, data, { image: null, history: [], future: [] }); if (!state.id) state.id = createId();
    localStorage.setItem('canvasly-current-id', state.id);
    committedState = JSON.stringify(safeCopy());
    $('#projectName').value = state.name; canvas.width = state.width; canvas.height = state.height; $('#zoomRange').value = state.zoom; setZoom(state.zoom);
    if (state.imageData) { const im = new Image(); im.onload = () => { state.image = im; redraw(); updateInspector(); updateLayers(); }; im.src = state.imageData; }
    redraw(); updateInspector(); updateLayers();
  }
  async function readProjects() {
    let list; try { const res = await fetch('/api/projects'); if (res.ok) list = await res.json(); } catch {}
    if (!Array.isArray(list) || !list.length) try { list = JSON.parse(localStorage.getItem('canvasly-projects') || '[]'); } catch {}
    return Array.isArray(list) ? list : [];
  }
  async function showProjects() {
    const current = safeCopy();
    const local = await readProjects();
    const all = [current, ...local.filter(p => p.id !== current.id)];
    $('#projectsGrid').innerHTML = all.length ? '' : '<div class="projects-empty">No saved designs yet. Start a new one to begin.</div>';
    all.forEach(project => {
      const card = document.createElement('article'); card.className = 'project-card';
      card.innerHTML = `<div class="project-preview" style="background:linear-gradient(135deg,${escapeHtml(project.background?.color || '#e6c8d5')},${escapeHtml(project.background?.color2 || '#8174a2')})"><span>${escapeHtml(project.text?.content || '').replaceAll('\n', '<br>')}</span></div><div class="project-card-info"><b>${escapeHtml(project.name || 'Untitled design')}</b><small>${project.id === state.id ? 'Current design' : 'Saved design'}</small></div><div class="project-card-actions"><button data-open-project="${escapeHtml(project.id)}">Open</button><button class="project-delete" data-delete-project="${escapeHtml(project.id)}" title="Delete this project">Delete</button></div>`;
      $('#projectsGrid').append(card);
    });
    $('#projectsModal').classList.remove('hidden');
  }
  async function openProject(id) {
    const project = (await readProjects()).find(item => item.id === id); if (!project) return toast('This design could not be found');
    Object.assign(state, project, { image: null, history: [], future: [] }); if (!state.id) state.id = createId();
    localStorage.setItem('canvasly-current-id', state.id); committedState = JSON.stringify(safeCopy());
    $('#projectName').value = state.name; canvas.width = state.width; canvas.height = state.height; setZoom(state.zoom); state.selected = 'text';
    if (state.imageData) { const im = new Image(); im.onload = () => { state.image = im; redraw(); updateLayers(); }; im.src = state.imageData; }
    redraw(); updateInspector(); updateLayers(); $('#projectsModal').classList.add('hidden'); toast('Design opened');
  }
  async function deleteProject(id) {
    if (!confirm('Delete this design permanently?')) return;
    let list = (await readProjects()).filter(project => project.id !== id);
    try { await fetch(`/api/projects/${encodeURIComponent(id)}`, { method: 'DELETE' }); } catch {}
    try { localStorage.setItem('canvasly-projects', JSON.stringify(list)); } catch {}
    if (id === state.id) {
      if (list.length) await openProject(list[0].id);
      else createNewProject();
    }
    toast('Design deleted'); await showProjects();
  }
  function createNewProject() {
    Object.assign(state, { id: createId(), name: 'Untitled design', width: 1600, height: 1000, zoom: 70,
      background: { type: 'gradient', color: '#d9b6ce', color2: '#8c7ba8', angle: 135, texture: 'grain', strength: 14 },
      image: null, imageData: '', imageName: '', imageFit: 'cover', imageAdjust: { brightness: 100, contrast: 100, saturation: 100, blur: 0 },
      text: { content: 'A little more\nroom to bloom', font: 'Playfair Display', size: 96, color: '#fffaf2', weight: '700', align: 'center', x: .5, y: .51, spacing: 0, shadow: true },
      shape: null, visibility: { image: true, shape: true, text: true }, selected: 'text', history: [], future: [], format: 'png', category: 'all' });
    committedState = JSON.stringify(safeCopy()); $('#projectName').value = state.name; canvas.width = state.width; canvas.height = state.height; setZoom(state.zoom); redraw(); updateInspector(); updateLayers(); setPanel('design'); $('#projectsModal').classList.add('hidden'); scheduleSave(); toast('New design created');
  }
  function setZoom(value) { state.zoom = Math.max(40, Math.min(120, +value)); $('#zoomRange').value = state.zoom; $('#zoomValue').textContent = `${state.zoom}%`; page.style.width = `min(${state.zoom * 11.14}px, 100%)`; }
  function undoRedo(from, to) { if (!from.length) return; to.push(JSON.stringify(safeCopy())); const next = JSON.parse(from.pop()); Object.assign(state, next); committedState = JSON.stringify(safeCopy()); canvas.width = state.width; canvas.height = state.height; $('#projectName').value = state.name; if (state.imageData) { const im = new Image(); im.onload = () => { state.image = im; redraw(); }; im.src = state.imageData; } redraw(); updateInspector(); updateLayers(); scheduleSave(); }

  buildTemplates(); updateLayers(); redraw();
  $$('.rail-item').forEach(b => b.onclick = () => setPanel(b.dataset.panel));
  function filterTemplates() {
    const query = $('#templateSearch').value.toLowerCase(), category = $('#templateCategory').value;
    $$('.template-card').forEach(card => card.classList.toggle('hidden', !(card.dataset.name.includes(query) && (category === 'all' || card.dataset.category === category))));
    $('#templateCount').textContent = `${$$('.template-card').filter(card => !card.classList.contains('hidden')).length} free designs`;
  }
  $('#templateSearch').oninput = filterTemplates; $('#templateCategory').onchange = filterTemplates;
  $('#templateSort').onchange = e => { const cards = $$('.template-card'); cards.sort((a, b) => e.target.value === 'za' ? b.dataset.name.localeCompare(a.dataset.name) : e.target.value === 'relevant' ? +a.dataset.order - +b.dataset.order : a.dataset.name.localeCompare(b.dataset.name)); cards.forEach(card => $('#templateGrid').append(card)); };
  $('#browseTemplates').onclick = () => { $('#gallerySearch').value = ''; $('#galleryCategory').value = 'all'; $('#gallerySort').value = 'relevant'; renderGallery(true); $('#templatesModal').classList.remove('hidden'); };
  $('#templatesClose').onclick = () => $('#templatesModal').classList.add('hidden');
  $('#templatesModal').onclick = e => { if (e.target === $('#templatesModal')) $('#templatesModal').classList.add('hidden'); };
  $('#gallerySearch').oninput = () => renderGallery(true); $('#galleryCategory').onchange = () => renderGallery(true); $('#gallerySort').onchange = () => renderGallery(true);
  $('#showMoreTemplates').onclick = () => { galleryLimit += 60; renderGallery(); };
  $$('.style-pills button').forEach(b => b.onclick = () => { const c = palettes[b.dataset.palette]; state.background = { ...state.background, type: 'gradient', color: c[0], color2: c[1] }; changed(); });
  $$('.gradient-swatch').forEach(b => b.onclick = () => { const sets = { sunset: ['#ffc57a', '#ed77b7'], berry: ['#7434bb', '#ec83bb'], sea: ['#39b7b1', '#2950a0'], citrus: ['#e5dc62', '#ed7e51'] }; [state.background.color, state.background.color2] = sets[b.dataset.gradient]; state.background.type = 'gradient'; changed(); });
  const bgColors = ['#ffffff', '#18191f', '#f3c0ca', '#f4d2a7', '#b5dbcf', '#c8bef0', '#9dbde0', '#f1e8d7'];
  bgColors.forEach(color => { const b = document.createElement('button'); b.className = 'color-chip'; b.style.background = color; b.onclick = () => { state.background = { ...state.background, type: 'solid', color }; changed(); }; $('#backgroundColors').append(b); });
  const custom = document.createElement('label'); custom.className = 'color-chip custom'; custom.textContent = '+'; custom.style.background = '#fafafa'; custom.innerHTML = '<input type="color" aria-label="Custom background color" value="#e8c7d8">'; custom.querySelector('input').oninput = e => { state.background = { ...state.background, type: 'solid', color: e.target.value }; changed(); }; $('#backgroundColors').append(custom);
  ['none', 'grain', 'dots', 'grid', 'lines'].forEach((kind, i) => { const b = document.createElement('button'); b.className = `texture-choice ${kind === state.background.texture ? 'active' : ''}`; b.dataset.texture = kind; b.title = kind; b.onclick = () => { state.background.texture = kind; $$('.texture-choice').forEach(x => x.classList.toggle('active', x === b)); changed(); }; $('#textureOptions').append(b); });
  $('#textureRange').oninput = e => { state.background.strength = +e.target.value; $('#textureValue').textContent = `${e.target.value}%`; redraw(); scheduleSave(); };
  $$('[data-shape]').forEach(b => b.onclick = () => addShape(b.dataset.shape));
  $$('.sticker-grid button').forEach(b => b.onclick = () => addText(b.textContent, 150, 'DM Sans'));
  $('#addHeading').onclick = () => addText('Add a heading', 96, 'Playfair Display'); $('#addSubheading').onclick = () => addText('Add a subheading', 62, 'DM Sans'); $('#addBody').onclick = () => addText('Add a little body text', 38, 'DM Sans');
  const textStyles = {
    classic: ['Make it memorable', 'Playfair Display', 88, '#fffaf2', '600'],
    bold: ['MAKE IT YOURS', 'Archivo Black', 92, '#fffaf2', '700'],
    script: ['hello, sunshine', 'Dancing Script', 112, '#fffaf2', '700'],
    poster: ['BIG IDEAS', 'Bebas Neue', 118, '#fffaf2', '700'],
    friendly: ['good things ahead', 'Poppins', 82, '#fffaf2', '600'],
    minimal: ['a quieter kind of day', 'Raleway', 68, '#fffaf2', '500']
  };
  $$('[data-style]').forEach(b => b.onclick = () => { const [content, font, size, color, weight] = textStyles[b.dataset.style]; state.text = { ...state.text, content, font, size, color, weight }; state.selected = 'text'; changed(); });
  $$('[data-file]').forEach(b => b.onclick = () => { const input = $(`#${b.dataset.file}`); input.dataset.type = b.dataset.file; input.click(); });
  $('#imageFile').onchange = e => { [...e.target.files].forEach(useImage); e.target.value = ''; };
  const drop = $('#uploadDrop'); drop.ondragover = e => { e.preventDefault(); drop.style.borderColor = '#812de1'; }; drop.ondragleave = () => drop.style.borderColor = ''; drop.ondrop = e => { e.preventDefault(); drop.style.borderColor = ''; [...e.dataTransfer.files].filter(f => f.type.startsWith('image/')).forEach(useImage); };
  page.onclick = e => { const r = page.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height; if (state.shape && Math.abs(x - state.shape.x) < .12 && Math.abs(y - state.shape.y) < .12) state.selected = 'shape'; else if (y > .25 && y < .8 && x > .1 && x < .9) state.selected = 'text'; else state.selected = state.image ? 'image' : null; updateInspector(); updateLayers(); };
  page.ondblclick = () => { state.selected = 'text'; updateInspector(); $('#insText')?.focus(); };
  $('#layerList').onclick = e => { const del = e.target.closest('[data-delete]'), hide = e.target.closest('[data-hide]'), row = e.target.closest('[data-layer]'); if (del) { if (del.dataset.delete === 'text') state.text.content = ''; else if (del.dataset.delete === 'shape') state.shape = null; else { state.image = null; state.imageData = ''; state.imageName = ''; } changed(); } else if (hide) { state.visibility ||= { image: true, shape: true, text: true }; state.visibility[hide.dataset.hide] = state.visibility[hide.dataset.hide] === false; changed(); } else if (row) { state.selected = row.dataset.layer; updateInspector(); updateLayers(); } };
  $('#inspector').onclick = e => { const del = e.target.closest('[data-delete]'); if (del) { if (del.dataset.delete === 'shape') state.shape = null; else state.text.content = ''; state.selected = null; changed(); } };
  $('#projectName').oninput = e => { state.name = e.target.value; scheduleSave(); };
  $('#zoomRange').oninput = e => setZoom(e.target.value); $('#zoomOut').onclick = () => setZoom(state.zoom - 5); $('#zoomIn').onclick = () => setZoom(state.zoom + 5); $('#fitBtn').onclick = () => setZoom(70);
  $('#undoBtn').onclick = () => undoRedo(state.history, state.future); $('#redoBtn').onclick = () => undoRedo(state.future, state.history);
  $('#exportBtn').onclick = () => $('#modal').classList.remove('hidden'); $('#modalClose').onclick = () => $('#modal').classList.add('hidden'); $('#modal').onclick = e => { if (e.target === $('#modal')) $('#modal').classList.add('hidden'); };
  $$('.download-option').forEach(b => b.onclick = () => { state.format = b.dataset.format; $$('.download-option').forEach(x => { x.classList.toggle('selected', x === b); $('b', x).textContent = x === b ? '✓' : ''; }); });
  $('#confirmExport').onclick = () => { redraw(); canvas.toBlob(blob => { if (!blob) return toast('Could not export this design'); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `${(state.name || 'canvasly-design').replace(/[^a-z0-9-_]+/gi, '-').toLowerCase()}.${state.format}`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); $('#modal').classList.add('hidden'); toast('Your design is downloaded'); }, state.format === 'jpeg' ? 'image/jpeg' : 'image/png', .92); };
  $('#helpBtn').onclick = () => toast('Upload a photo, select it, and explore the editing panel.');
  $('#projectsBtn').onclick = showProjects;
  $('#projectsClose').onclick = () => $('#projectsModal').classList.add('hidden');
  $('#projectsModal').onclick = e => { if (e.target === $('#projectsModal')) $('#projectsModal').classList.add('hidden'); };
  $('#projectsGrid').onclick = e => { const open = e.target.closest('[data-open-project]'), del = e.target.closest('[data-delete-project]'); if (open) openProject(open.dataset.openProject); else if (del) deleteProject(del.dataset.deleteProject); };
  $('#newProjectBtn').onclick = createNewProject;
  $('#deleteProjectBtn').onclick = () => deleteProject(state.id);
  $('#contextbar').innerHTML = '<button id="contextAdjust">Adjust</button><button id="contextCrop">Crop</button><span class="sep"></span><button id="contextDelete">Delete</button>';
  $('#contextAdjust').onclick = () => { state.selected = 'image'; updateInspector(); }; $('#contextCrop').onclick = () => { state.selected = 'image'; updateInspector(); $('#inspector').scrollIntoView({ behavior: 'smooth' }); }; $('#contextDelete').onclick = () => { state.image = null; state.imageData = ''; state.imageName = ''; changed(); };
  loadProject();
})();
