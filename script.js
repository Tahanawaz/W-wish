/* ============================================================
   BIRTHDAY WEBSITE FOR WAJIHA — script.js
   Change FRIEND_SINCE below to the day you two became friends.
============================================================ */

/* ==========================
   LOADER
========================== */
let pageRevealed = false;

window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    const enterSurprise = document.getElementById("enterSurprise");
    const loaderSub = loader.querySelector(".loader-sub");

    const revealSurprise = () => {
        pageRevealed = true;
        loader.classList.add("hidden");
        setTimeout(() => {
            loader.style.display = "none";
        }, 900);
    };

    enterSurprise.addEventListener("click", async () => {
        if (await playMusic()) revealSurprise();
    });

    setTimeout(async () => {
        if (await playMusic()) {
            revealSurprise();
            return;
        }

        /* Chrome/Safari may require one gesture before audible playback. */
        loader.classList.add("ready");
        loaderSub.textContent = "Tap once to start the music";
        enterSurprise.hidden = false;
    }, 3200);
});

/* ==========================
   SCROLL PROGRESS BAR
========================== */
const progressBar = document.getElementById("progressBar");

function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + "%";
}

/* ==========================
   STARFIELD BACKGROUND
========================== */
(function () {
    const canvas = document.getElementById("starsCanvas");
    const ctx = canvas.getContext("2d");
    let stars = [];
    const STAR_COUNT = 110;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createStars() {
        stars = [];
        for (let i = 0; i < STAR_COUNT; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 1.4 + 0.3,
                alpha: Math.random(),
                da: (Math.random() - 0.5) * 0.012,
            });
        }
    }

    function drawStars() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const s of stars) {
            s.alpha += s.da;
            if (s.alpha <= 0.1 || s.alpha >= 1) s.da *= -1;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(139, 92, 246, " + s.alpha * 0.5 + ")";
            ctx.fill();
        }
        requestAnimationFrame(drawStars);
    }

    resize();
    createStars();
    drawStars();

    window.addEventListener("resize", () => {
        resize();
        createStars();
    });
})();

/* ==========================
   TYPEWRITER EFFECT
========================== */
const TYPE_TEXT = "To Dear Wajiha 🎂❤️";
const typingEl = document.getElementById("typing");
const cursorBlink = document.getElementById("cursorBlink");
let typeIndex = 0;

function typeWriter() {
    if (typeIndex < TYPE_TEXT.length) {
        typingEl.textContent += TYPE_TEXT.charAt(typeIndex);
        typeIndex++;
        const delay = TYPE_TEXT.charAt(typeIndex - 1) === " " ? 70 : 90 + Math.random() * 50;
        setTimeout(typeWriter, delay);
    } else {
        setTimeout(() => {
            cursorBlink.style.opacity = "0";
        }, 2500);
    }
}

setTimeout(typeWriter, 3500);

/*==========================
   ALWAYS-ON MUSIC
  ========================== */
const music = document.getElementById("music");
const startBtn = document.getElementById("startBtn");
const MUSIC_START_TIME = 3;

/* Preload during the loader, then start at the exact reveal moment. */
music.volume = 0.7;

function skipSilentIntro() {
    if (music.readyState >= 1 && music.currentTime < MUSIC_START_TIME) {
        music.currentTime = MUSIC_START_TIME;
    }
}

function playMusic() {
    skipSilentIntro();
    const playPromise = music.play();
    if (playPromise !== undefined) {
        return playPromise.then(() => true).catch(() => false);
    }
    return Promise.resolve(!music.paused);
}

/* Prepare the starting point while the loader is visible. */
music.addEventListener("loadedmetadata", () => {
    skipSilentIntro();
}, { once: true });

/* Audible autoplay can be blocked by the browser. Any interaction unlocks
   it automatically; there is deliberately no pause/off control on the page. */
const keepMusicPlaying = () => {
    if (pageRevealed && music.paused) playMusic();
};

["pointerdown", "click", "touchstart", "keydown"].forEach((eventName) => {
    document.addEventListener(eventName, keepMusicPlaying, { passive: true });
});

window.addEventListener("pageshow", keepMusicPlaying);
window.addEventListener("focus", keepMusicPlaying);
document.addEventListener("visibilitychange", () => {
    if (!document.hidden) keepMusicPlaying();
});

music.addEventListener("pause", () => {
    if (pageRevealed && !document.hidden) setTimeout(keepMusicPlaying, 250);
});

/* The loop normally returns to 0, so skip the same silent intro each time. */
music.addEventListener("timeupdate", () => {
    if (music.currentTime < 0.25) skipSilentIntro();
});

startBtn.addEventListener("click", (e) => {
    e.preventDefault();
    playMusic();
    document.getElementById("timeline").scrollIntoView({ behavior: "smooth" });
});

/* ==========================
   NAVBAR + BACK-TO-TOP + PROGRESS
========================== */
const navbar = document.getElementById("navbar");
const scrollHint = document.getElementById("scrollHint");
const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
    const y = window.scrollY;
    navbar.classList.toggle("scrolled", y > 60);
    backToTop.classList.toggle("visible", y > 500);
    if (scrollHint) scrollHint.style.opacity = y > 150 ? "0" : "";
    updateProgress();
}, { passive: true });

backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ==========================
   ACTIVE NAV LINK ON SCROLL
========================== */
const sections = document.querySelectorAll("section[id]");
const navLinkEls = document.querySelectorAll(".nav-link");

const sectionObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute("id");
                navLinkEls.forEach((link) => {
                    link.classList.toggle("active", link.getAttribute("href") === "#" + id);
                });
            }
        });
    },
    { threshold: 0.35 }
);

sections.forEach((sec) => sectionObserver.observe(sec));

/* ==========================
   HAMBURGER MENU
========================== */
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("open");
});

navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navLinks.classList.remove("open");
    });
});

/* ==========================
   IMAGE PLACEHOLDERS
   (shows a pretty placeholder if a pic isn't uploaded yet)
========================== */
function makePlaceholder(label) {
    const svg =
        '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="620">' +
        '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
        '<stop offset="0" stop-color="#ede4ff"/><stop offset="1" stop-color="#fde8b6"/>' +
        "</linearGradient></defs>" +
        '<rect width="600" height="620" fill="url(#g)"/>' +
        '<text x="300" y="290" font-size="70" text-anchor="middle">🎓</text>' +
        '<text x="300" y="370" font-size="30" fill="#7c3aed" text-anchor="middle" font-family="Georgia, serif" font-style="italic">' +
        label +
        "</text>" +
        "</svg>";
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

document.querySelectorAll(".photo img").forEach((img, i) => {
    img.addEventListener("error", function handler() {
        img.removeEventListener("error", handler);
        img.src = makePlaceholder("Your Photo " + (i + 1));
    });
});

/* ==========================
   LETTER
========================== */
const openLetter = document.getElementById("openLetter");
const message = document.getElementById("message");
const envelopeSeal = document.getElementById("envelopeSeal");

function toggleLetter() {
    message.classList.toggle("show");
    const span = openLetter.querySelector("span");
    span.textContent = message.classList.contains("show") ? "Close Letter" : "Open The Letter";
}

openLetter.addEventListener("click", toggleLetter);
envelopeSeal.addEventListener("click", toggleLetter);

/* ==========================
   FLOATING SPARKLES
========================== */
const sparkContainer = document.querySelector(".spark-container");
const sparkEmojis = ["✨", "🌟", "💫", "🎉", "🎓", "❤️", "🎂f"];

function createSpark() {
    const spark = document.createElement("div");
    spark.className = "spark";
    spark.textContent = sparkEmojis[Math.floor(Math.random() * sparkEmojis.length)];
    spark.style.left = Math.random() * 100 + "vw";
    spark.style.fontSize = 15 + Math.random() * 22 + "px";
    spark.style.animationDuration = 6 + Math.random() * 6 + "s";
    sparkContainer.appendChild(spark);
    setTimeout(() => spark.remove(), 12500);
}

setInterval(createSpark, 700);

/* ==========================
   SPARKLE CURSOR TRAIL (desktop only)
========================== */
(function () {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let lastTrail = 0;
    document.addEventListener("mousemove", (e) => {
        const now = Date.now();
        if (now - lastTrail < 90) return;
        lastTrail = now;

        const t = document.createElement("div");
        t.className = "trail-spark";
        t.textContent = "✨";
        t.style.left = e.clientX + "px";
        t.style.top = e.clientY + "px";
        document.body.appendChild(t);
        setTimeout(() => t.remove(), 900);
    });
})();

/* ==========================
   FRIENDSHIP COUNTER (Live)
   >>> Change this date to the day you two became friends <<<
========================== */
const FRIEND_SINCE = new Date("2024-01-27T00:00:00");

const elDays = document.getElementById("counterDays");
const elHours = document.getElementById("counterHours");
const elMins = document.getElementById("counterMins");
const elSecs = document.getElementById("counterSecs");

function updateCounter() {
    const diff = Date.now() - FRIEND_SINCE.getTime();
    if (diff < 0) return;

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);

    elDays.textContent = String(days).padStart(3, "0");
    elHours.textContent = String(hours).padStart(2, "0");
    elMins.textContent = String(mins).padStart(2, "0");
    elSecs.textContent = String(secs).padStart(2, "0");
}

updateCounter();
setInterval(updateCounter, 1000);

/* ==========================
   SCROLL REVEAL
========================== */
const revealElements = document.querySelectorAll(
    ".journey-item, .photo, .flip-card, .counter-box, .envelope, .surprise-wrap"
);

revealElements.forEach((el) => el.classList.add("reveal-element"));

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.12, rootMargin: "0px 0px -30px 0px" }
);

revealElements.forEach((el) => revealObserver.observe(el));

/* ==========================
   FLIP CARDS (tap support for mobile)
========================== */
document.querySelectorAll(".flip-card").forEach((card) => {
    card.addEventListener("click", () => {
        card.classList.toggle("flipped");
    });
});

/* ==========================
   GALLERY LIGHTBOX
========================== */
const photos = document.querySelectorAll(".photo");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");
const lightboxCounter = document.getElementById("lightboxCounter");
let currentPhoto = 0;

function showPhoto() {
    const img = photos[currentPhoto].querySelector("img");
    lightboxImg.src = img.src; // read live so placeholders work too
    lightboxCounter.textContent = (currentPhoto + 1) + " / " + photos.length;
}

function openLightbox(i) {
    currentPhoto = i;
    showPhoto();
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
}

function nextPhoto() {
    currentPhoto = (currentPhoto + 1) % photos.length;
    showPhoto();
}

function prevPhoto() {
    currentPhoto = (currentPhoto - 1 + photos.length) % photos.length;
    showPhoto();
}

photos.forEach((photo, i) => {
    photo.addEventListener("click", () => openLightbox(i));
});

lightboxClose.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
});

lightboxPrev.addEventListener("click", (e) => {
    e.stopPropagation();
    prevPhoto();
});

lightboxNext.addEventListener("click", (e) => {
    e.stopPropagation();
    nextPhoto();
});

document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") prevPhoto();
    if (e.key === "ArrowRight") nextPhoto();
});

// Swipe support
let touchStartX = 0;

lightbox.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

lightbox.addEventListener("touchend", (e) => {
    const diff = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(diff) > 50) {
        if (diff > 0) prevPhoto();
        else nextPhoto();
    }
}, { passive: true });

/* ==========================
   SURPRISE + GIFT BOX
========================== */
const surpriseBtn = document.getElementById("surpriseBtn");
const finalMessage = document.getElementById("finalMessage");
const giftBox = document.getElementById("giftBox");
let surpriseOpened = false;

function openSurprise() {
    if (surpriseOpened) {
        launchFireworks();
        launchConfetti();
        launchBalloons();
        return;
    }
    surpriseOpened = true;
    giftBox.classList.add("opened");
    surpriseBtn.querySelector("span").textContent = "Celebrate Again 🎉";

    setTimeout(() => {
        finalMessage.style.display = "block";
        finalMessage.scrollIntoView({ behavior: "smooth", block: "center" });
        launchConfetti();
        launchBalloons();
    }, 600);
}

surpriseBtn.addEventListener("click", openSurprise);
giftBox.addEventListener("click", openSurprise);

/* ==========================
   BLOW OUT THE CANDLE
========================== */
const cakeFlame = document.getElementById("cakeFlame");
const cakeSmoke = document.getElementById("cakeSmoke");
const cakeHint = document.getElementById("cakeHint");
const wishMessage = document.getElementById("wishMessage");
const cake = document.getElementById("cake");
let candleBlown = false;

function blowCandle() {
    if (candleBlown) return;
    candleBlown = true;

    cakeFlame.classList.add("blown");
    cakeSmoke.classList.add("rising");
    cakeHint.textContent = "✨ Your wish has been made ✨";

    setTimeout(() => {
        wishMessage.classList.add("granted");
        launchFireworks();
        launchConfetti();
    }, 900);
}

cakeFlame.addEventListener("click", (e) => {
    e.stopPropagation();
    blowCandle();
});

cake.addEventListener("click", blowCandle);

/* ==========================
   FIREWORKS (particle physics)
========================== */
const fwCanvas = document.getElementById("canvas");
const fwCtx = fwCanvas.getContext("2d");

function resizeFireworks() {
    fwCanvas.width = window.innerWidth;
    fwCanvas.height = window.innerHeight;
}

resizeFireworks();
window.addEventListener("resize", resizeFireworks);

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.alpha = 1;
        this.color = color;
        this.radius = Math.random() * 2.5 + 1;
        this.decay = Math.random() * 0.014 + 0.009;
        this.gravity = 0.045;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.vx *= 0.99;
        this.alpha -= this.decay;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = Math.max(this.alpha, 0);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.restore();
    }
}

let particles = [];
let fwAnimating = false;

function fireworkBurst(x, y) {
    const hue = Math.random() * 360;
    const count = 55 + Math.random() * 40;
    for (let i = 0; i < count; i++) {
        particles.push(new Particle(x, y, "hsl(" + hue + ", 85%, " + (42 + Math.random() * 16) + "%)"));
    }
}

function animateFireworks() {
    fwCtx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);

    for (const p of particles) {
        p.update();
        p.draw(fwCtx);
    }

    particles = particles.filter((p) => p.alpha > 0);

    if (particles.length > 0) {
        requestAnimationFrame(animateFireworks);
    } else {
        fwAnimating = false;
        fwCtx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);
    }
}

function launchFireworks() {
    const w = fwCanvas.width;
    const h = fwCanvas.height;

    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            fireworkBurst(
                80 + Math.random() * (w - 160),
                70 + Math.random() * (h * 0.5)
            );
            if (!fwAnimating) {
                fwAnimating = true;
                animateFireworks();
            }
        }, i * 320);
    }
}

/* ==========================
   CONFETTI
========================== */
(function addConfettiKeyframes() {
    const style = document.createElement("style");
    style.textContent =
        "@keyframes confettiFall {" +
        "0% { transform: translateY(-12px) rotate(0deg); opacity: 1; }" +
        "100% { transform: translateY(105vh) rotate(620deg); opacity: 0; }" +
        "}";
    document.head.appendChild(style);
})();

function launchConfetti() {
    const colors = ["#8b5cf6", "#a78bfa", "#fbbf24", "#fcd34d", "#22d3ee", "#7c3aed", "#f59e0b"];
    const total = 90;

    for (let i = 0; i < total; i++) {
        const c = document.createElement("div");
        const size = 6 + Math.random() * 7;
        c.style.cssText =
            "position:fixed;top:-12px;left:" + Math.random() * 100 + "vw;" +
            "width:" + size + "px;height:" + size * (Math.random() > 0.5 ? 1 : 0.4) + "px;" +
            "background:" + colors[Math.floor(Math.random() * colors.length)] + ";" +
            "border-radius:" + (Math.random() > 0.5 ? "50%" : "2px") + ";" +
            "pointer-events:none;z-index:10001;opacity:0;" +
            "animation:confettiFall " + (2.5 + Math.random() * 3) + "s ease-in " + Math.random() * 1.4 + "s forwards;";
        document.body.appendChild(c);
        setTimeout(() => c.remove(), 8000);
    }
}

/* ==========================
   BALLOONS
========================== */
const balloonContainer = document.getElementById("balloonContainer");
const balloonColors = [
    "linear-gradient(135deg, #8b5cf6, #a78bfa)",
    "linear-gradient(135deg, #fbbf24, #fcd34d)",
    "linear-gradient(135deg, #22d3ee, #67e8f9)",
    "linear-gradient(135deg, #d946ef, #f0abfc)",
    "linear-gradient(135deg, #34d399, #6ee7b7)",
];

function launchBalloons() {
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            const b = document.createElement("div");
            b.className = "balloon";
            b.style.left = 5 + Math.random() * 88 + "vw";
            b.style.background = balloonColors[Math.floor(Math.random() * balloonColors.length)];
            b.style.animationDuration = 6 + Math.random() * 4 + "s";
            balloonContainer.appendChild(b);
            setTimeout(() => b.remove(), 11000);
        }, i * 350);
    }
}
