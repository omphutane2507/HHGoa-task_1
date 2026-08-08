document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('generator-form');
    const photoUpload = document.getElementById('photo-upload');
    const fileNameDisplay = document.getElementById('file-name');
    const generateBtn = document.getElementById('generate-btn');
    const downloadBtn = document.getElementById('download-btn');
    const shareBtn = document.getElementById('share-btn');
    const actionsSection = document.getElementById('actions-section');
    const placeholderOverlay = document.getElementById('placeholder-overlay');
    
    const canvas = document.getElementById('id-canvas');
    const ctx = canvas.getContext('2d');
    
    // Set internal resolution of the canvas (Instagram portrait ratio 4:5 for nice X/Twitter sharing)
    const WIDTH = 1080;
    const HEIGHT = 1350;
    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    let uploadedImage = null;
    let generatedImageUrl = null;

    const BUILDER_TITLES = [
        "10X SHIPPER",
        "TERMINAL DWELLER",
        "PROTOCOL ARCHITECT",
        "VOID NAVIGATOR",
        "BASED BUILDER",
        "FULL-STACK WIZARD",
        "SYSTEMS SCHOLAR",
        "PIXEL PUSHER",
        "BASE-LAYER DEGEN"
    ];

    photoUpload.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        fileNameDisplay.textContent = file.name;
        
        let blob = file;
        // Check if file is HEIC
        if (file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic')) {
            fileNameDisplay.textContent = 'Converting HEIC...';
            try {
                if (typeof heic2any !== 'undefined') {
                    blob = await heic2any({ blob: file, toType: 'image/jpeg' });
                    if (Array.isArray(blob)) blob = blob[0];
                    fileNameDisplay.textContent = file.name + ' (Converted)';
                } else {
                    fileNameDisplay.textContent = 'Conversion failed (heic2any not loaded). Try JPG/PNG.';
                    return;
                }
            } catch (err) {
                console.error("HEIC conversion failed", err);
                fileNameDisplay.textContent = 'Conversion failed. Try JPG/PNG.';
                return;
            }
        }

        const url = URL.createObjectURL(blob);
        const img = new Image();
        img.onload = () => {
            uploadedImage = img;
            URL.revokeObjectURL(url);
        };
        img.src = url;
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!uploadedImage) {
            alert('Please upload a photo.');
            return;
        }

        const name = document.getElementById('builder-name').value.trim();
        const stack = document.getElementById('builder-stack').value.trim();
        const randomTitle = BUILDER_TITLES[Math.floor(Math.random() * BUILDER_TITLES.length)];

        // Ensure fonts are loaded before drawing.
        document.fonts.ready.then(() => {
            drawIDCard(name, stack, randomTitle);
            
            placeholderOverlay.classList.add('hidden');
            actionsSection.classList.remove('hidden');
            generatedImageUrl = canvas.toDataURL('image/png');
        });
    });

    function drawIDCard(name, stack, title) {
        // 1. Tropical Green Background
        ctx.fillStyle = '#116c3b';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        const margin = 40;

        // 2. Yellow & Pink Borders (Retro Vibe)
        ctx.strokeStyle = '#f8e31a';
        ctx.lineWidth = 12;
        ctx.strokeRect(margin, margin, WIDTH - margin * 2, HEIGHT - margin * 2);

        ctx.strokeStyle = '#ec0d68';
        ctx.lineWidth = 4;
        ctx.strokeRect(margin + 16, margin + 16, WIDTH - (margin + 16) * 2, HEIGHT - (margin + 16) * 2);

        // 3. Header Text: HACKER HOUSE (Yellow, Serif, Tall)
        ctx.fillStyle = '#f8e31a';
        ctx.textAlign = 'center';
        
        ctx.save();
        ctx.scale(1, 1.4); // Stretch text vertically
        ctx.font = '400 130px "Playfair Display", serif';
        ctx.fillText('HACKER HOUSE', WIDTH / 2, (margin + 150) / 1.4);
        ctx.restore();

        // 4. Hindi Text Overlay (Pink, Sans, with White Stroke)
        ctx.save();
        ctx.font = '900 70px sans-serif';
        ctx.textAlign = 'center';
        
        // Add shadow for depth
        ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.strokeText('गोवा', WIDTH / 2, margin + 140);
        
        ctx.fillStyle = '#ec0d68'; // Pink
        ctx.fillText('गोवा', WIDTH / 2, margin + 140);
        ctx.restore();

        // 5. Subheader Date & Location
        ctx.fillStyle = '#f8e31a';
        ctx.font = '400 28px "Space Mono", monospace';
        ctx.fillText('GOA, INDIA · 28 - 31 OCT 2026', WIDTH / 2, margin + 220);

        // 6. Photo Polaroid Style (Off-white block with photo inside)
        const photoSize = 600;
        const photoX = (WIDTH - photoSize) / 2;
        const photoY = margin + 280;

        ctx.save();
        // Add shadow to polaroid
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 5;
        ctx.fillStyle = '#fffbf0';
        ctx.fillRect(photoX - 30, photoY - 30, photoSize + 60, photoSize + 160);
        ctx.restore();
        
        // Draw the uploaded image, cropped to square
        drawCroppedImage(uploadedImage, photoX, photoY, photoSize, photoSize);

        // Border around the photo itself
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.strokeRect(photoX, photoY, photoSize, photoSize);

        // Name on the polaroid
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.font = '700 48px "Space Mono", monospace';
        ctx.fillText(name.toUpperCase(), WIDTH / 2, photoY + photoSize + 75);
        
        // 7. Stack / Role
        ctx.fillStyle = '#f8e31a';
        ctx.font = '700 42px "Space Mono", monospace';
        ctx.fillText(stack.toUpperCase(), WIDTH / 2, photoY + photoSize + 220);

        // 8. Title Badge (Pink pill/rectangle with white text)
        ctx.font = '700 32px "Space Mono", monospace';
        const titleWidth = ctx.measureText(title).width + 80;
        
        ctx.fillStyle = '#ec0d68';
        ctx.fillRect((WIDTH - titleWidth) / 2, photoY + photoSize + 260, titleWidth, 60);

        ctx.fillStyle = '#ffffff';
        ctx.fillText(title, WIDTH / 2, photoY + photoSize + 302);

        // 9. Bottom graphics (2:47PM STUDIO logo imitation)
        ctx.fillStyle = '#f8e31a';
        ctx.textAlign = 'left';
        ctx.font = '700 40px "Space Mono", monospace';
        ctx.fillText('2:47PM', margin + 40, HEIGHT - margin - 50);
        ctx.fillText('STUDIO', margin + 40, HEIGHT - margin - 10);

        // Right side badge 
        ctx.fillStyle = '#f8e31a'; // Yellow background
        ctx.fillRect(WIDTH - margin - 220, HEIGHT - margin - 80, 180, 60);
        
        ctx.strokeStyle = '#ec0d68'; // Pink dotted/dashed border like screenshot 1 button
        ctx.lineWidth = 4;
        ctx.setLineDash([8, 8]);
        ctx.strokeRect(WIDTH - margin - 216, HEIGHT - margin - 76, 172, 52);
        ctx.setLineDash([]); // reset

        ctx.fillStyle = '#116c3b'; // Green text inside
        ctx.textAlign = 'center';
        ctx.font = '700 24px "Space Mono", monospace';
        ctx.fillText('BUILDER ID', WIDTH - margin - 130, HEIGHT - margin - 42);
        
        ctx.textAlign = 'left'; // Reset
    }

    function drawCroppedImage(img, x, y, w, h) {
        const imgRatio = img.width / img.height;
        const canvasRatio = w / h;
        let sWidth, sHeight, sx, sy;

        if (imgRatio > canvasRatio) {
            // Image is wider than needed
            sHeight = img.height;
            sWidth = sHeight * canvasRatio;
            sx = (img.width - sWidth) / 2;
            sy = 0;
        } else {
            // Image is taller than needed
            sWidth = img.width;
            sHeight = sWidth / canvasRatio;
            sx = 0;
            sy = (img.height - sHeight) / 2;
        }

        ctx.drawImage(img, sx, sy, sWidth, sHeight, x, y, w, h);
    }

    downloadBtn.addEventListener('click', () => {
        if (!generatedImageUrl) return;
        const a = document.createElement('a');
        a.href = generatedImageUrl;
        a.download = `HH_GOA_ID_${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });

    shareBtn.addEventListener('click', () => {
        const text = encodeURIComponent("Just claimed my official HH Goa 2026 Builder ID. Let's ship. 🚢🔥\n\nCheck your radar at hhgoa.com\n\n#FrameInGoa");
        const url = `https://twitter.com/intent/tweet?text=${text}`;
        window.open(url, '_blank');
    });
});
