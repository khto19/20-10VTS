document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const welcomeScreen = document.getElementById('welcome-screen');
    const wishesScreen = document.getElementById('wishes-screen');
    const nameForm = document.getElementById('name-form');
    const nameInput = document.getElementById('name-input');
    const wishTextEl = document.getElementById('wish-text');
    const newWishBtn = document.getElementById('new-wish-btn');
    const backBtn = document.getElementById('back-btn');
    const fireworksToggle = document.getElementById('fireworks-toggle');
    const musicToggle = document.getElementById('music-toggle');
    const canvas = document.getElementById('fireworks-canvas'); // All effects on this canvas

    // --- State ---
    let currentName = '';
    let fireworksEnabled = true;
    let animationFrameId;
    let musicPlaying = false;
    let typeIntervalId = null; // For typing effect
    let fireworkLaunchIntervalId = null; // For continuous fireworks
    const particles = []; // Unified array for all fireworks effects
    const flowers = []; // Array for falling flowers

    // --- Music Setup (Audio File) ---
    const backgroundMusic = new Audio('nhacnen.mp3');
    backgroundMusic.loop = true;

    // --- Long Wishes (Letters) ---
    const longWishes = [
        "Nhân ngày 20/10, mình muốn gửi đến bạn những lời chúc chân thành nhất. Chúc bạn luôn là bông hoa xinh đẹp, rạng rỡ và toả ngát hương thơm. Mong bạn mỗi ngày đều là một ngày vui, trọn vẹn và ý nghĩa, luôn được yêu thương và trân trọng.",
        "Chúc bạn một ngày 20/10 thật đặc biệt! Cảm ơn bạn vì đã luôn là nguồn năng lượng tích cực, lan toả nụ cười và sự ấm áp đến mọi người. Hãy luôn tự tin, yêu đời và vững bước trên con đường mình đã chọn nhé.",
        "Hôm nay là một ngày để tôn vinh bạn. Chúc bạn có thật nhiều quà, thật nhiều hoa và những lời chúc ngọt ngào. Nhưng hơn hết, mong bạn luôn tìm thấy niềm vui trong những điều bình dị, có sức khoẻ dồi dào và bình an trong tâm hồn.",
        "Gửi đến bạn một giỏ hoa yêu thương và những lời chúc tốt đẹp nhất. Mong rằng mọi khó khăn sẽ lùi xa, nhường chỗ cho may mắn và thành công. Hãy luôn là chính mình, một phiên bản tuyệt vời và không thể thay thế.",
        "Nhân ngày Phụ nữ Việt Nam, chúc bạn luôn giữ được ngọn lửa nhiệt huyết trong tim. Dù ở vai trò nào, bạn cũng thật tuyệt vời. Chúc cho mọi dự định của bạn đều thành hiện thực và cuộc sống luôn mỉm cười với bạn.",
        "Chúc bạn có một ngày 20/10 ngập tràn hạnh phúc bên gia đình và những người thân yêu. Bạn xứng đáng nhận được tất cả những điều tốt đẹp nhất trên đời. Cảm ơn bạn vì đã là một phần không thể thiếu của đội Võ Thị Sáu.",
        "Mong rằng ngày hôm nay sẽ mang đến cho bạn nhiều bất ngờ thú vị. Hãy tạm gác lại mọi lo toan, bộn bề để tận hưởng trọn vẹn ngày của riêng mình. Chúc bạn luôn xinh đẹp, trẻ trung và yêu đời.",
        "Nhân ngày 20/10, xin gửi đến bạn lời cảm ơn chân thành vì những đóng góp và nỗ lực không ngừng nghỉ. Bạn là một người đồng đội tuyệt vời. Chúc bạn luôn khoẻ mạnh, hạnh phúc và thành công hơn nữa trong tương lai.",
        "Chúc bạn một ngày lễ thật vui và ý nghĩa. Hãy luôn tự hào về bản thân và những gì bạn đã làm được. Bạn là nguồn cảm hứng cho rất nhiều người. Mong bạn sẽ luôn toả sáng theo cách riêng của mình.",
        "Ngày 20/10 là để nhắc nhớ rằng bạn quan trọng và đặc biệt biết bao. Chúc bạn luôn được bao bọc bởi tình yêu thương, nhận được sự quan tâm và thấu hiểu. Hãy luôn mỉm cười thật tươi nhé!",
        "Chúc bạn có một ngày thật thư giãn và nuông chiều bản thân. Bạn đã làm việc rất chăm chỉ rồi. Mong rằng bạn sẽ có những giây phút bình yên, nạp lại năng lượng để tiếp tục chinh phục những thử thách mới.",
        "Gửi ngàn lời chúc tốt đẹp đến bạn trong ngày 20/10. Chúc bạn luôn xinh đẹp như những đóa hoa, mạnh mẽ như những viên kim cương và luôn được sống trong hạnh phúc, đủ đầy.",
        "Cảm ơn bạn vì đã luôn là một người chị, người em, người bạn đáng tin cậy. Sự hiện diện của bạn làm cho tập thể trở nên gắn kết hơn. Chúc bạn một ngày 20/10 thật nhiều niềm vui và kỷ niệm đáng nhớ.",
        "Hôm nay, hãy để cho bản thân được toả sáng rực rỡ nhất. Chúc bạn luôn tự tin vào giá trị của mình, dám ước mơ và dám thực hiện. Thế giới sẽ thật tuyệt vời khi có bạn.",
        "Chúc bạn có một ngày 20/10 thật ngọt ngào như những viên kẹo, thơm ngát như những đóa hoa và ấm áp như vòng tay của những người thương yêu. Hãy luôn hạnh phúc nhé!",
    ];

    // --- Event Listeners ---
    nameForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = nameInput.value.trim();
        if (name) {
            currentName = name;
            showWishesScreen(name);
        } else {
            nameInput.classList.add('error');
            setTimeout(() => nameInput.classList.remove('error'), 500);
        }
    });

    newWishBtn.addEventListener('click', () => {
        displayRandomWish(currentName, false);
    });

    backBtn.addEventListener('click', showWelcomeScreen);

    fireworksToggle.addEventListener('click', () => {
        fireworksEnabled = !fireworksEnabled;
        fireworksToggle.textContent = fireworksEnabled ? 'Tắt pháo hoa' : 'Bật pháo hoa';
        fireworksToggle.classList.toggle('active', fireworksEnabled);
    });

    musicToggle.addEventListener('click', () => {
        musicPlaying = !musicPlaying;
        if (musicPlaying) {
            backgroundMusic.play().catch(e => console.log("User needs to interact with the page first."));
        } else {
            backgroundMusic.pause();
        }
        musicToggle.classList.toggle('active', musicPlaying);
    });

    // --- Core Functions ---
    function showScreen(screenToShow) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        screenToShow.classList.add('active');
    }

    function showWishesScreen(name) {
        displayRandomWish(name, true);
        showScreen(wishesScreen);
        fireworksEnabled = true;
        fireworksToggle.textContent = 'Tắt pháo hoa';
        fireworksToggle.classList.add('active');
        launchFireworks(); // No duration, runs continuously
    }

    function showWelcomeScreen() {
        showScreen(welcomeScreen);
        nameInput.value = '';
        stopFireworks();
        if (musicPlaying) {
            backgroundMusic.pause();
            musicPlaying = false;
            musicToggle.classList.remove('active');
        }
    }

    // --- NEW: Typing Effect ---
    function typeWish(greeting, wish) {
        if (typeIntervalId) clearInterval(typeIntervalId); // Stop any previous typing
        wishTextEl.innerHTML = greeting;

        let charIndex = 0;
        typeIntervalId = setInterval(() => {
            if (charIndex < wish.length) {
                wishTextEl.innerHTML += wish.charAt(charIndex);
                charIndex++;
            } else {
                clearInterval(typeIntervalId);
                typeIntervalId = null;
            }
        }, 35); // Adjust typing speed here (milliseconds)
    }

    function displayRandomWish(name) {
        const randomIndex = Math.floor(Math.random() * longWishes.length);
        const wishContent = longWishes[randomIndex];
        const greetingContent = `<strong>Gửi ${name},</strong><br><br>`;
        typeWish(greetingContent, wishContent);
    }

    // --- Canvas & Effects Setup ---
    function setupCanvas() {
        canvas.width = wishesScreen.clientWidth;
        canvas.height = wishesScreen.clientHeight;
    }

    // --- NEW: More Beautiful Flowers Logic ---
    class Flower {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 5 + 8;
            this.speedY = Math.random() * 0.5 + 0.4;
            this.speedX = Math.random() * 0.4 - 0.2;
            this.rotationSpeed = Math.random() * 0.02 - 0.01;
            this.angle = 0;
            this.opacity = Math.random() * 0.7 + 0.3;
            this.color = Math.random() > 0.4 ? '#ffb6c1' : '#ffc0cb'; // LightPink and Pink
        }
        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.angle += this.rotationSpeed;
            if (this.y > canvas.height + this.size) {
                this.y = -this.size;
                this.x = Math.random() * canvas.width;
            }
        }
        draw(ctx) {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);

            // Draw petals
            ctx.fillStyle = this.color;
            for (let i = 0; i < 5; i++) {
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.quadraticCurveTo(this.size / 2, -this.size, 0, -this.size * 1.5);
                ctx.quadraticCurveTo(-this.size / 2, -this.size, 0, 0);
                ctx.fill();
                ctx.rotate((Math.PI * 2) / 5);
            }
            
            // Draw center
            ctx.fillStyle = '#ffeea0'; // Soft yellow
            ctx.beginPath();
            ctx.arc(0, 0, this.size / 4, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }
    }

    function initFlowers() {
        if (canvas.width === 0) setupCanvas();
        flowers.length = 0;
        const flowerCount = 20;
        for (let i = 0; i < flowerCount; i++) {
            flowers.push(new Flower());
        }
    }

    // --- Optimized Fireworks Logic ---
    class Particle {
        constructor(x, y, color, type) {
            this.x = x; this.y = y; this.color = color; this.type = type; this.alpha = 1;
            if (type === 'firework') {
                this.sx = Math.random() * 4 - 2; this.sy = Math.random() * -3 - (canvas.height / 70);
                this.size = 2; this.targetY = Math.random() * (canvas.height / 2) + (canvas.height / 4);
            } else if (type === 'explosion') {
                const angle = Math.random() * Math.PI * 2; const speed = Math.random() * 8 + 2;
                this.sx = Math.cos(angle) * speed; this.sy = Math.sin(angle) * speed;
                this.friction = 0.96; this.gravity = 0.1; this.decay = Math.random() * 0.02 + 0.015; this.size = 2;
            } else if (type === 'trail') {
                this.sx = Math.random() * 2 - 1; this.sy = Math.random() * 2 - 1; this.gravity = 0.05;
                this.decay = Math.random() * 0.05 + 0.05; this.size = 1;
            }
        }
        update() {
            if (this.type === 'firework') {
                this.x += this.sx; this.y += this.sy; this.sy += 0.04;
                if (Math.random() > 0.4) particles.push(new Particle(this.x, this.y, this.color, 'trail'));
                if (this.y <= this.targetY || this.sy >= 0) {
                    this.alpha = 0;
                    // More brilliant explosion
                    for (let i = 0; i < 150; i++) particles.push(new Particle(this.x, this.y, this.color, 'explosion'));
                }
            } else {
                this.x += this.sx; this.y += this.sy;
                if (this.type === 'explosion') { this.sx *= this.friction; this.sy *= this.friction; this.sy += this.gravity; } 
                else { this.sy += this.gravity; }
                this.alpha -= this.decay;
            }
        }
        draw(ctx) {
            ctx.save(); ctx.globalAlpha = this.alpha; ctx.fillStyle = this.color; ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill(); ctx.restore();
        }
    }

    // --- NEW: Continuous Fireworks ---
    function launchFireworks() {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        setupCanvas();
        if (fireworksEnabled) {
            // Initial burst
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    if (!fireworksEnabled) return;
                    const color = `hsl(${Math.random() * 360}, 100%, 60%)`;
                    particles.push(new Particle(Math.random() * canvas.width, canvas.height, color, 'firework'));
                }, i * 200 + 200);
            }
        }
        // Continuous launch
        fireworkLaunchIntervalId = setInterval(() => {
            if (fireworksEnabled) {
                const color = `hsl(${Math.random() * 360}, 100%, 60%)`;
                particles.push(new Particle(Math.random() * canvas.width, canvas.height, color, 'firework'));
            }
        }, 1200); // Launch a new one every 1.2 seconds
        loop();
    }
    
    function stopFireworks() {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        if (fireworkLaunchIntervalId) clearInterval(fireworkLaunchIntervalId);
        animationFrameId = null;
        fireworkLaunchIntervalId = null;
        particles.length = 0;
        const ctx = canvas.getContext('2d');
        if (canvas.width > 0) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    function loop() {
        const ctx = canvas.getContext('2d');
        if (canvas.width > 0) {
            ctx.fillStyle = 'rgba(255, 253, 247, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        flowers.forEach(f => { f.update(); f.draw(ctx); });
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update(); particles[i].draw(ctx);
            if (particles[i].alpha <= 0) particles.splice(i, 1);
        }
        animationFrameId = requestAnimationFrame(loop);
    }
    
    // --- Initial Setup ---
    initFlowers();
    window.addEventListener('resize', () => {
        setupCanvas();
        initFlowers();
    });
});

