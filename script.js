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

    // --- 30 Long & Meaningful Wishes ---
    const longWishes = [
        "Nhân ngày Phụ nữ Việt Nam 20/10, xin gửi đến bạn lời chúc sức khỏe, hạnh phúc và thành công. Chúc bạn luôn giữ mãi nụ cười rạng rỡ trên môi, trái tim đầy nhiệt huyết và tinh thần lạc quan để vượt qua mọi thử thách trong cuộc sống. Hãy luôn là chính mình, tỏa sáng theo cách riêng bạn nhé.",
        "Chúc mừng ngày 20/10! Cảm ơn bạn vì đã là một mảnh ghép tuyệt vời của đội Võ Thị Sáu. Mong bạn sẽ có một ngày thật ý nghĩa, nhận được nhiều hoa, quà và những lời yêu thương chân thành. Chúc cho mọi ước mơ của bạn sớm trở thành hiện thực.",
        "Nhân ngày đặc biệt này, mình muốn chúc bạn luôn xinh đẹp, không chỉ ở vẻ ngoài mà còn ở tâm hồn. Chúc bạn có một bờ vai vững chắc để tựa vào khi mệt mỏi, một trái tim rộng mở để yêu thương và được yêu thương, và một con đường sự nghiệp rộng mở phía trước.",
        "Gửi đến bạn - người phụ nữ tuyệt vời, lời chúc 20/10 ngập tràn niềm vui và tiếng cười. Mong bạn luôn tìm thấy sự bình yên trong tâm hồn, sự đủ đầy trong cuộc sống và sự trọn vẹn trong tình yêu. Bạn xứng đáng với tất cả những điều tốt đẹp nhất.",
        "Happy Vietnamese Women's Day! Chúc bạn có một ngày lễ thật trọn vẹn bên những người thân yêu. Hãy tạm gác lại những lo toan, bộn bề để nuông chiều bản thân một chút nhé. Chúc bạn mãi trẻ trung, năng động và thành công trên mọi lĩnh vực.",
        "Mỗi người phụ nữ là một bông hoa độc nhất. Nhân ngày 20/10, chúc cho bông hoa mang tên bạn sẽ luôn rực rỡ, ngát hương và kiêu hãnh khoe sắc. Chúc bạn luôn mạnh mẽ, tự tin và đạt được mọi mục tiêu mà mình đề ra.",
        "Chúc bạn một ngày 20/10 thật diệu kỳ! Mong rằng bạn sẽ luôn được bao bọc bởi sự quan tâm, chăm sóc và thấu hiểu. Chúc bạn có đủ sức mạnh để theo đuổi đam mê và đủ sự dịu dàng để làm thế giới này trở nên tốt đẹp hơn.",
        "Nhân ngày tôn vinh phái đẹp, xin gửi đến bạn những lời chúc tốt lành nhất. Chúc bạn không chỉ là một người phụ nữ thành công trong công việc mà còn là người giữ lửa hạnh phúc cho gia đình. Chúc bạn mọi sự an nhiên, vạn sự như ý.",
        "Cảm ơn bạn vì đã luôn là nguồn cảm hứng, là người đồng đội tuyệt vời. Chúc bạn một ngày 20/10 thật nhiều kỷ niệm đẹp, thật nhiều niềm vui bất ngờ. Hãy luôn yêu thương bản thân và sống một cuộc đời thật rực rỡ nhé.",
        "Ngày 20/10 đến rồi, chúc bạn luôn xinh tươi như hoa, cuộc sống ngọt ngào như kẹo và tình yêu nồng nàn như socola. Mong rằng mỗi ngày trôi qua đều là một ngày hạnh phúc và bạn sẽ luôn được làm những điều mình yêu thích.",
        "Chúc bạn không chỉ có một ngày 20/10 vui vẻ, mà 364 ngày còn lại trong năm cũng luôn ngập tràn hạnh phúc. Hãy luôn là người phụ nữ tự chủ, độc lập và lan tỏa năng lượng tích cực đến mọi người xung quanh.",
        "Gửi một chút nắng ấm, một chút gió mát và một chút hương hoa vào ngày 20/10 của bạn. Chúc bạn có một ngày thật thư thái, gặt hái được nhiều niềm vui và luôn cảm thấy mình được trân trọng, yêu thương.",
        "Nhân ngày 20/10, chúc bạn 'tay hòm chìa khóa', 'giỏi việc nước, đảm việc nhà'. Nhưng quan trọng hơn cả, chúc bạn có thời gian cho riêng mình, để theo đuổi sở thích và làm mới tâm hồn. Luôn hạnh phúc nhé!",
        "Chúc bạn một ngày lễ thật phong cách và đáng nhớ. Mong rằng bạn sẽ nhận được món quà mà mình yêu thích nhất, ăn món ăn ngon nhất và ở bên cạnh người mà bạn thương yêu nhất. Happy 20/10!",
        "Thế giới sẽ thật vô vị nếu thiếu đi nụ cười của bạn. Chúc bạn ngày 20/10 luôn mỉm cười, bởi nụ cười của bạn có sức mạnh xua tan mọi u phiền. Chúc bạn sức khỏe, bình an và may mắn.",
        "Nhân ngày Phụ nữ Việt Nam, chúc bạn luôn có một trái tim khỏe mạnh để yêu thương, một khối óc minh mẫn để quyết định và một đôi chân vững vàng để bước đi trên con đường riêng. Hãy luôn tự hào về bản thân mình.",
        "Chúc bạn ngày 20/10 có những khoảnh khắc thật 'chill', được làm những điều mình thích mà không cần bận tâm điều gì. Bạn đã vất vả nhiều rồi, hôm nay hãy để bản thân được nghỉ ngơi và tận hưởng.",
        "Gửi đến bạn lời chúc 20/10 từ tận đáy lòng. Mong rằng bạn sẽ luôn là phiên bản tốt nhất của chính mình, không ngừng học hỏi, không ngừng hoàn thiện và không ngừng tỏa sáng. Thành công đang chờ bạn phía trước.",
        "Chúc cho những vất vả của bạn sẽ được đền đáp xứng đáng, những yêu thương bạn trao đi sẽ được nhận lại trọn vẹn. Chúc bạn một ngày 20/10 thật ấm áp và một cuộc sống viên mãn sau này.",
        "Hôm nay là ngày của bạn! Hãy mặc bộ váy đẹp nhất, tô son màu bạn thích nhất và tự tin sải bước. Chúc bạn một ngày 20/10 thật lộng lẫy và tràn đầy năng lượng tích cực.",
        "Mong rằng mỗi sớm mai thức dậy, bạn đều cảm thấy yêu đời và hạnh phúc. Chúc bạn ngày 20/10 và tất cả những ngày sau đó đều là những ngày nắng đẹp, tâm hồn an yên và mọi việc thuận lợi.",
        "Nhân ngày đặc biệt này, xin được cảm ơn sự cống hiến thầm lặng của bạn. Sự chu đáo và tận tâm của bạn đã góp phần làm nên một tập thể vững mạnh. Chúc bạn thật nhiều sức khỏe và niềm vui.",
        "Chúc bạn có một 'sự nghiệp' yêu bản thân thật thành công. Hãy luôn dành thời gian chăm sóc sức khỏe thể chất và tinh thần. Vì khi bạn hạnh phúc, cả thế giới xung quanh bạn cũng sẽ hạnh phúc theo.",
        "Nhân ngày 20/10, chúc bạn luôn giữ được sự tò mò của một đứa trẻ, sự nhiệt huyết của tuổi trẻ và sự thông thái của một người từng trải. Hãy sống một cuộc đời thật phong phú và nhiều màu sắc.",
        "Chúc bạn có một tình yêu đẹp để trái tim luôn ấm áp, một tình bạn thân để sẻ chia vui buồn, và một gia đình hạnh phúc để là nơi bình yên quay về. Chúc mừng ngày 20/10!",
        "Mong rằng những áp lực trong cuộc sống sẽ không bao giờ dập tắt được nụ cười trên môi bạn. Chúc bạn luôn kiên cường, bản lĩnh và tìm thấy niềm vui trong từng khoảnh khắc. Happy Women's Day!",
        "Gửi bạn một cái ôm thật chặt qua những dòng chữ này. Chúc bạn một ngày 20/10 thật vui, không còn những muộn phiền và chỉ có những tiếng cười. Hãy luôn là chính mình và hạnh phúc nhé.",
        "Chúc bạn có một ngày lễ 'sang - xịn - mịn', được yêu chiều như một nàng công chúa. Bạn xứng đáng với tất cả những điều ngọt ngào và tuyệt vời nhất trên thế giới này. Mừng ngày 20/10.",
        "Nhân ngày 20/10, chúc cho 'chiếc thuyền' cuộc đời bạn sẽ luôn vững tay chèo, vượt qua mọi sóng gió để cập bến bờ hạnh phúc. Chúc bạn luôn bình an và thành công.",
        "Cảm ơn bạn đã tồn tại trên thế giới này và là một phần của cuộc sống chúng tôi. Sự hiện diện của bạn làm cho mọi thứ trở nên ý nghĩa hơn. Chúc bạn một ngày 20/10 thật trọn vẹn và đáng nhớ."
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
        displayRandomWish(currentName);
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
        displayRandomWish(name);
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

    // --- Typing Effect ---
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
        const signature = "<br><br>From Khánh Toàn with love &lt;3";
        const fullWish = wishContent + signature;
        const greetingContent = `<strong>Gửi ${name},</strong><br><br>`;
        typeWish(greetingContent, fullWish);
    }

    // --- Canvas & Effects Setup ---
    function setupCanvas() {
        canvas.width = wishesScreen.clientWidth;
        canvas.height = wishesScreen.clientHeight;
    }

    // --- More Beautiful Flowers Logic ---
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

    // --- Continuous Fireworks ---
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

