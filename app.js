document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const photoUpload = document.getElementById('photo-upload');
    const fileNameDisplay = document.getElementById('file-name');
    const downloadBtn = document.getElementById('download-btn');
    const shareBtn = document.getElementById('share-btn');
    const actionsSection = document.getElementById('actions-section');
    const placeholderOverlay = document.getElementById('placeholder-overlay');
    const canvasWrapper = document.getElementById('canvas-wrapper');
    const canvas = document.getElementById('id-canvas');
    const ctx = canvas.getContext('2d');

    const heroTitle = document.getElementById('hero-title');
    const heroSubtitle = document.getElementById('hero-subtitle');

    // UI Panels
    const detailsSection = document.getElementById('details-section');
    const photoTools = document.getElementById('photo-tools');
    const frameThemesPanel = document.getElementById('frame-themes-panel');

    // Inputs
    const nameInput = document.getElementById('builder-name');
    const stackInput = document.getElementById('builder-stack');
    const titleDisplay = document.getElementById('builder-title');
    const titleDisplay2 = document.getElementById('builder-title-2');
    const clearTitle2Btn = document.getElementById('clear-title-2-btn');

    // Sliders
    const zoomSlider = document.getElementById('zoom-slider');
    const rotateSlider = document.getElementById('rotate-slider');
    const brightnessSlider = document.getElementById('brightness-slider');

    // --- State ---
    const state = {
        template: 'builderID', // 'builderID' (Format B) or 'frame' (Format A)
        photo: null,
        transform: { zoom: 1, rotate: 0, x: 0, y: 0, flip: false },
        filters: { brightness: 1 },
        builderName: '',
        builderStack: '',
        builderTitle: 'THE SHIPPER',
        builderTitle2: 'FULL-STACK WIZARD',
        frameTheme: 'default'
    };

    let generatedImageUrl = null;
    let isDragging = false;
    let dragStart = { x: 0, y: 0 };

    // Preload Images
    const goaLogo = new Image();
    goaLogo.src = 'goa_hindi.svg';
    goaLogo.onload = () => render();

    const themeImages = {
        beach: new Image(),
        party: new Image(),
        beer: new Image(),
        tree: new Image()
    };

    themeImages.beach.src = 'theme_beach.png';
    themeImages.party.src = 'theme_party.png';
    themeImages.beer.src = 'theme_beer.png';
    themeImages.tree.src = 'theme_tree.png';

    Object.values(themeImages).forEach(img => {
        img.onload = () => render();
    });

    const BUILDER_TITLES = [
        "10X SHIPPER", "TERMINAL DWELLER", "PROTOCOL ARCHITECT",
        "VOID NAVIGATOR", "BASED BUILDER", "FULL-STACK WIZARD",
        "SYSTEMS SCHOLAR", "PIXEL PUSHER", "BASE-LAYER DEGEN",
        "RUST MAXI", "CSS WIZARD", "PROMPT ENGINEER", "AI OVERLORD"
    ];

    // Screens & Navigation
    const selectionScreen = document.getElementById('selection-screen');
    const workspaceScreen = document.getElementById('workspace-screen');
    const activeModeBadge = document.getElementById('active-mode-badge');
    const backBtn = document.getElementById('back-to-selection-btn');

    // --- Template Switching ---
    function setTemplate(template) {
        state.template = template;

        if (template === 'frame') {
            // FORMAT A: PFP FRAME / OVERLAY
            if (heroTitle) heroTitle.textContent = "PFP FRAME GENERATOR";
            if (heroSubtitle) heroSubtitle.textContent = "Stand out on X. Wrap your photo in branded HH Goa 2026 vibes.";
            if (activeModeBadge) activeModeBadge.textContent = "PFP FRAME";

            detailsSection.classList.add('hidden');
            frameThemesPanel.classList.remove('hidden');

            if (canvasWrapper) {
                canvasWrapper.classList.remove('portrait');
                canvasWrapper.classList.add('square');
            }
            canvas.width = 1080;
            canvas.height = 1080;
        } else {
            // FORMAT B: BUILDER ID CARD
            if (heroTitle) heroTitle.textContent = "BUILDER ID GENERATOR";
            if (heroSubtitle) heroSubtitle.textContent = "Less Noise. More Signal. Generate your official radar card.";
            if (activeModeBadge) activeModeBadge.textContent = "BUILDER ID CARD";

            detailsSection.classList.remove('hidden');
            frameThemesPanel.classList.add('hidden');

            if (canvasWrapper) {
                canvasWrapper.classList.remove('square');
                canvasWrapper.classList.add('portrait');
            }
            canvas.width = 1080;
            canvas.height = 1350;
        }

        if (state.photo) {
            photoTools.classList.remove('hidden');
        }

        render();
    }

    // --- Event Listeners ---
    // Handle Choice Buttons on Initial Screen
    document.querySelectorAll('.choice-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const template = btn.dataset.template;

            if (selectionScreen) selectionScreen.classList.add('hidden');
            if (workspaceScreen) workspaceScreen.classList.remove('hidden');

            setTemplate(template);
        });
    });

    // Handle Back to Choice Screen
    if (backBtn) {
        backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (workspaceScreen) workspaceScreen.classList.add('hidden');
            if (selectionScreen) selectionScreen.classList.remove('hidden');

            if (heroTitle) heroTitle.textContent = "BUILDER ID & PFP FRAME GENERATOR";
            if (heroSubtitle) heroSubtitle.textContent = "Less Noise. More Signal. Select an option to start.";
        });
    }

    // Frame Themes
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.frameTheme = btn.dataset.theme;
            render();
        });
    });

    // Inputs (Format B only)
    nameInput.addEventListener('input', (e) => { state.builderName = e.target.value; render(); });
    stackInput.addEventListener('input', (e) => { state.builderStack = e.target.value; render(); });

    document.getElementById('regenerate-title-btn').addEventListener('click', (e) => {
        e.preventDefault();
        state.builderTitle = BUILDER_TITLES[Math.floor(Math.random() * BUILDER_TITLES.length)];
        titleDisplay.textContent = state.builderTitle;
        render();
    });

    document.getElementById('regenerate-title-2-btn').addEventListener('click', (e) => {
        e.preventDefault();
        state.builderTitle2 = BUILDER_TITLES[Math.floor(Math.random() * BUILDER_TITLES.length)];
        titleDisplay2.textContent = state.builderTitle2;
        render();
    });

    if (clearTitle2Btn) {
        clearTitle2Btn.addEventListener('click', (e) => {
            e.preventDefault();
            state.builderTitle2 = '';
            titleDisplay2.textContent = 'NONE';
            render();
        });
    }

    // Photo Upload
    photoUpload.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        fileNameDisplay.textContent = file.name;

        let blob = file;
        if (file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic')) {
            fileNameDisplay.textContent = 'Converting HEIC...';
            try {
                if (typeof heic2any !== 'undefined') {
                    blob = await heic2any({ blob: file, toType: 'image/jpeg' });
                    if (Array.isArray(blob)) blob = blob[0];
                    fileNameDisplay.textContent = file.name + ' (Converted)';
                } else {
                    fileNameDisplay.textContent = 'Conversion failed (heic2any not loaded).';
                    return;
                }
            } catch (err) {
                console.error("HEIC conversion failed", err);
                return;
            }
        }

        const url = URL.createObjectURL(blob);
        const img = new Image();
        img.onload = () => {
            state.photo = img;
            resetTransform();
            if (placeholderOverlay) placeholderOverlay.classList.add('hidden');
            photoTools.classList.remove('hidden');
            actionsSection.classList.remove('hidden');
            URL.revokeObjectURL(url);
            render();
        };
        img.src = url;
    });

    // Sliders & Tools
    zoomSlider.addEventListener('input', (e) => { state.transform.zoom = parseFloat(e.target.value); render(); });
    rotateSlider.addEventListener('input', (e) => { state.transform.rotate = parseInt(e.target.value); render(); });
    brightnessSlider.addEventListener('input', (e) => { state.filters.brightness = parseFloat(e.target.value); render(); });

    document.getElementById('auto-fit-btn').addEventListener('click', (e) => {
        e.preventDefault();
        state.transform.zoom = 1;
        state.transform.x = 0;
        state.transform.y = 0;
        zoomSlider.value = 1;
        render();
    });

    document.getElementById('flip-btn').addEventListener('click', (e) => {
        e.preventDefault();
        state.transform.flip = !state.transform.flip;
        render();
    });

    document.getElementById('reset-photo-btn').addEventListener('click', (e) => {
        e.preventDefault();
        resetTransform();
    });

    function resetTransform() {
        state.transform = { zoom: 1, rotate: 0, x: 0, y: 0, flip: false };
        state.filters = { brightness: 1 };
        zoomSlider.value = 1;
        rotateSlider.value = 0;
        brightnessSlider.value = 1;
        render();
    }

    // Canvas Dragging
    canvas.addEventListener('mousedown', (e) => {
        if (!state.photo) return;
        isDragging = true;
        dragStart = { x: e.offsetX, y: e.offsetY };
    });

    canvas.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dx = e.offsetX - dragStart.x;
        const dy = e.offsetY - dragStart.y;

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        state.transform.x += dx * scaleX;
        state.transform.y += dy * scaleY;

        dragStart = { x: e.offsetX, y: e.offsetY };
        render();
    });

    window.addEventListener('mouseup', () => { isDragging = false; });
    canvas.addEventListener('mouseleave', () => { isDragging = false; });

    // Touch events for mobile dragging
    canvas.addEventListener('touchstart', (e) => {
        if (!state.photo || e.touches.length !== 1) return;
        isDragging = true;
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        dragStart = { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
    }, { passive: true });

    canvas.addEventListener('touchmove', (e) => {
        if (!isDragging || e.touches.length !== 1) return;
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const touchX = touch.clientX - rect.left;
        const touchY = touch.clientY - rect.top;

        const dx = touchX - dragStart.x;
        const dy = touchY - dragStart.y;

        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        state.transform.x += dx * scaleX;
        state.transform.y += dy * scaleY;

        dragStart = { x: touchX, y: touchY };
        render();
    }, { passive: true });

    window.addEventListener('touchend', () => { isDragging = false; });

    const form = document.getElementById('generator-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
        });
    }

    // --- Main Render Dispatcher ---
    function render() {
        document.fonts.ready.then(() => {
            const WIDTH = canvas.width;
            const HEIGHT = canvas.height;

            if (state.template === 'frame') {
                renderFormatA(WIDTH, HEIGHT);
            } else {
                renderFormatB(WIDTH, HEIGHT);
            }

            generatedImageUrl = canvas.toDataURL('image/png');
        });
    }

    // --- Format A: PFP Frame / Overlay ---
    function renderFormatA(WIDTH, HEIGHT) {
        let bgColor = '#116c3b';
        let borderColor1 = '#f8e31a';
        let borderColor2 = '#ec0d68';
        let bgImage = null;

        if (state.frameTheme === 'beach') {
            borderColor1 = '#ffe4b5';
            borderColor2 = '#00ced1';
            bgImage = themeImages.beach;
        } else if (state.frameTheme === 'party') {
            borderColor1 = '#ff007f';
            borderColor2 = '#00ffff';
            bgImage = themeImages.party;
        } else if (state.frameTheme === 'beer') {
            borderColor1 = '#f5deb3';
            borderColor2 = '#ff8c00';
            bgImage = themeImages.beer;
        } else if (state.frameTheme === 'tree') {
            borderColor1 = '#32cd32';
            borderColor2 = '#228b22';
            bgImage = themeImages.tree;
        }

        // Background Fill
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        if (bgImage && bgImage.complete && bgImage.naturalWidth > 0) {
            const imgRatio = bgImage.width / bgImage.height;
            const canvasRatio = WIDTH / HEIGHT;
            let sWidth, sHeight, sx, sy;

            if (imgRatio > canvasRatio) {
                sHeight = bgImage.height;
                sWidth = sHeight * canvasRatio;
                sx = (bgImage.width - sWidth) / 2;
                sy = 0;
            } else {
                sWidth = bgImage.width;
                sHeight = sWidth / canvasRatio;
                sx = 0;
                sy = (bgImage.height - sHeight) / 2;
            }

            ctx.drawImage(bgImage, sx, sy, sWidth, sHeight, 0, 0, WIDTH, HEIGHT);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
            ctx.fillRect(0, 0, WIDTH, HEIGHT);
        }

        const margin = 40;

        // Outer Borders
        ctx.strokeStyle = borderColor1;
        ctx.lineWidth = 12;
        ctx.strokeRect(margin, margin, WIDTH - margin * 2, HEIGHT - margin * 2);

        ctx.strokeStyle = borderColor2;
        ctx.lineWidth = 4;
        ctx.strokeRect(margin + 16, margin + 16, WIDTH - (margin + 16) * 2, HEIGHT - (margin + 16) * 2);

        // Header Branding
        drawHeader(margin, borderColor1, WIDTH);

        // Photo Area for PFP Frame (Square photo centered cleanly below header)
        const photoSize = 650;
        const photoX = (WIDTH - photoSize) / 2;
        const photoY = 270;

        // White shadow frame
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 5;
        ctx.fillStyle = '#fffbf0';
        ctx.fillRect(photoX - 12, photoY - 12, photoSize + 24, photoSize + 24);
        ctx.restore();

        // Photo clip & render
        ctx.save();
        ctx.beginPath();
        ctx.rect(photoX, photoY, photoSize, photoSize);
        ctx.clip();

        if (state.photo) {
            const img = state.photo;
            const imgRatio = img.width / img.height;
            let sWidth, sHeight;
            if (imgRatio > 1) {
                sHeight = photoSize;
                sWidth = sHeight * imgRatio;
            } else {
                sWidth = photoSize;
                sHeight = sWidth / imgRatio;
            }

            ctx.translate(photoX + photoSize / 2 + state.transform.x, photoY + photoSize / 2 + state.transform.y);
            ctx.rotate(state.transform.rotate * Math.PI / 180);
            ctx.scale(state.transform.zoom, state.transform.zoom);
            if (state.transform.flip) {
                ctx.scale(-1, 1);
            }
            ctx.filter = `brightness(${state.filters.brightness})`;
            ctx.drawImage(img, -sWidth / 2, -sHeight / 2, sWidth, sHeight);
        } else {
            ctx.fillStyle = '#ddd';
            ctx.fillRect(photoX, photoY, photoSize, photoSize);
            ctx.fillStyle = '#999';
            ctx.textAlign = 'center';
            ctx.font = '700 36px "Space Mono", monospace';
            ctx.fillText('NO PHOTO', photoX + photoSize / 2, photoY + photoSize / 2 + 10);
        }
        ctx.restore();

        // Inner photo border
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 4;
        ctx.strokeRect(photoX, photoY, photoSize, photoSize);

        // Footer Badge & Stamps
        drawFooterBadge('PFP FRAME', margin, WIDTH, HEIGHT);

        ctx.fillStyle = borderColor1;
        ctx.textAlign = 'left';
        ctx.font = '700 28px "Space Mono", monospace';
        ctx.fillText('HH GOA', margin + 30, HEIGHT - margin - 35);
        ctx.font = '700 20px "Space Mono", monospace';
        ctx.fillText('OFFICIAL PROFILE', margin + 30, HEIGHT - margin - 12);
    }

    // --- Format B: Builder ID Card ---
    function renderFormatB(WIDTH, HEIGHT) {
        let bgColor = '#116c3b';
        let borderColor1 = '#f8e31a';
        let borderColor2 = '#ec0d68';
        let bgImage = null;

        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        const margin = 40;

        ctx.strokeStyle = borderColor1;
        ctx.lineWidth = 12;
        ctx.strokeRect(margin, margin, WIDTH - margin * 2, HEIGHT - margin * 2);

        ctx.strokeStyle = borderColor2;
        ctx.lineWidth = 4;
        ctx.strokeRect(margin + 16, margin + 16, WIDTH - (margin + 16) * 2, HEIGHT - (margin + 16) * 2);

        drawHeader(margin, borderColor1, WIDTH);

        const photoSize = 600;
        const photoX = (WIDTH - photoSize) / 2;
        let photoY = margin + 280;

        drawPhotoArea(photoX, photoY, photoSize);
        drawBuilderIDText(photoX, photoY, photoSize, WIDTH);

        drawFooterBadge('BUILDER ID', margin, WIDTH, HEIGHT);

        ctx.fillStyle = borderColor1;
        ctx.textAlign = 'left';
        ctx.font = '700 40px "Space Mono", monospace';
        ctx.fillText('2:47PM', margin + 40, HEIGHT - margin - 50);
        ctx.fillText('STUDIO', margin + 40, HEIGHT - margin - 10);
    }

    // Shared Header
    function drawHeader(margin, titleColor, WIDTH) {
        ctx.fillStyle = titleColor;
        ctx.textAlign = 'center';
        ctx.save();
        ctx.scale(1, 1.3);
        ctx.font = '400 115px "Playfair Display", serif';
        ctx.fillText('HACKER HOUSE', WIDTH / 2, (margin + 125) / 1.3);
        ctx.restore();

        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;
        if (goaLogo.complete && goaLogo.naturalWidth > 0) {
            const logoWidth = 130;
            const logoHeight = (logoWidth / goaLogo.width) * goaLogo.height;
            ctx.drawImage(goaLogo, (WIDTH - logoWidth) / 2, margin + 95, logoWidth, logoHeight);
        }
        ctx.restore();

        ctx.fillStyle = titleColor;
        ctx.font = '400 24px "Space Mono", monospace';
        ctx.fillText('GOA, INDIA · 28 - 31 OCT 2026', WIDTH / 2, margin + 200);
    }

    // Format B Photo Area
    function drawPhotoArea(x, y, size) {
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 5;
        ctx.fillStyle = '#fffbf0';

        let boxHeight = size + 160;
        ctx.fillRect(x - 30, y - 30, size + 60, boxHeight);
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.rect(x, y, size, size);
        ctx.clip();

        if (state.photo) {
            const img = state.photo;
            const imgRatio = img.width / img.height;
            let sWidth, sHeight;
            if (imgRatio > 1) {
                sHeight = size;
                sWidth = sHeight * imgRatio;
            } else {
                sWidth = size;
                sHeight = sWidth / imgRatio;
            }

            ctx.translate(x + size / 2 + state.transform.x, y + size / 2 + state.transform.y);
            ctx.rotate(state.transform.rotate * Math.PI / 180);
            ctx.scale(state.transform.zoom, state.transform.zoom);
            if (state.transform.flip) {
                ctx.scale(-1, 1);
            }
            ctx.filter = `brightness(${state.filters.brightness})`;
            ctx.drawImage(img, -sWidth / 2, -sHeight / 2, sWidth, sHeight);
        } else {
            ctx.fillStyle = '#ddd';
            ctx.fillRect(x, y, size, size);
            ctx.fillStyle = '#999';
            ctx.textAlign = 'center';
            ctx.font = '700 32px "Space Mono", monospace';
            ctx.fillText('NO PHOTO', x + size / 2, y + size / 2 + 10);
        }
        ctx.restore();

        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, size, size);
    }

    // Format B Text Fields
    function drawBuilderIDText(x, y, size, WIDTH) {
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.font = '700 48px "Space Mono", monospace';
        ctx.fillText((state.builderName || 'NAME').toUpperCase(), WIDTH / 2, y + size + 60);

        ctx.fillStyle = '#000000';
        ctx.font = '700 36px "Space Mono", monospace';
        ctx.fillText((state.builderStack || 'ROLE').toUpperCase(), WIDTH / 2, y + size + 120);

        ctx.font = '700 32px "Space Mono", monospace';

        const titleText = state.builderTitle;
        if (titleText && titleText.trim() !== '') {
            const titleWidth = ctx.measureText(titleText).width + 80;
            ctx.fillStyle = '#ec0d68';
            ctx.fillRect((WIDTH - titleWidth) / 2, y + size + 160, titleWidth, 60);
            ctx.fillStyle = '#ffffff';
            ctx.fillText(titleText, WIDTH / 2, y + size + 202);
        }

        const titleText2 = state.builderTitle2;
        if (titleText2 && titleText2.trim() !== '' && titleText2 !== 'NONE') {
            const titleWidth2 = ctx.measureText(titleText2).width + 80;
            ctx.fillStyle = '#f8e31a';
            ctx.fillRect((WIDTH - titleWidth2) / 2, y + size + 230, titleWidth2, 60);
            ctx.fillStyle = '#116c3b';
            ctx.fillText(titleText2, WIDTH / 2, y + size + 272);
        }
    }

    // Shared Footer Badge
    function drawFooterBadge(text, margin, WIDTH, HEIGHT) {
        ctx.fillStyle = '#f8e31a';
        ctx.fillRect(WIDTH - margin - 220, HEIGHT - margin - 80, 180, 60);

        ctx.strokeStyle = '#ec0d68';
        ctx.lineWidth = 4;
        ctx.setLineDash([8, 8]);
        ctx.strokeRect(WIDTH - margin - 216, HEIGHT - margin - 76, 172, 52);
        ctx.setLineDash([]);

        ctx.fillStyle = '#116c3b';
        ctx.textAlign = 'center';
        ctx.font = '700 22px "Space Mono", monospace';
        ctx.fillText(text, WIDTH - margin - 130, HEIGHT - margin - 42);

        ctx.textAlign = 'left';
    }

    // Download Handler
    downloadBtn.addEventListener('click', () => {
        if (!generatedImageUrl) return;
        const a = document.createElement('a');
        a.href = generatedImageUrl;
        const prefix = state.template === 'frame' ? 'HH_GOA_PFP_FRAME' : 'HH_GOA_BUILDER_ID';
        a.download = `${prefix}_${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });

    // Share to X Handler
    shareBtn.addEventListener('click', () => {
        const textStr = state.template === 'frame'
            ? "Just framed my profile picture for HH Goa 2026! 🌴🌊\n\nCreate yours at hhgoa.com\n\n#FrameInGoa"
            : "Just claimed my official HH Goa 2026 Builder ID. Let's ship. 🚢🔥\n\nCheck your radar at hhgoa.com\n\n#FrameInGoa";
        const text = encodeURIComponent(textStr);
        const url = `https://twitter.com/intent/tweet?text=${text}`;
        window.open(url, '_blank');
    });

    // Initial Header Title for selection screen
    if (heroTitle) heroTitle.textContent = "BUILDER ID & PFP FRAME GENERATOR";
    if (heroSubtitle) heroSubtitle.textContent = "Less Noise. More Signal. Select an option to start.";
});
