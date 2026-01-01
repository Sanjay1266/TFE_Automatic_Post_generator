document.addEventListener("DOMContentLoaded", () => {
    const linkedinBtn = document.getElementById("linkedinBtn");
    const twitterBtn = document.getElementById("twitterBtn");
    const instagramBtn = document.getElementById("instagramBtn");

    if (linkedinBtn) linkedinBtn.addEventListener("click", shareLinkedIn);
    if (twitterBtn) twitterBtn.addEventListener("click", shareTwitter);
    if (instagramBtn) instagramBtn.addEventListener("click", shareInstagram);
});

/* ===============================
   FETCH + RANDOMIZE POST
================================ */
async function getRandomPost(platform) {
    try {
        const res = await fetch(`content/${platform}.json`);
        if (!res.ok) throw new Error(`Failed to fetch ${platform} content`);
        const data = await res.json();
        return Array.isArray(data)
            ? data[Math.floor(Math.random() * data.length)]
            : data;
    } catch (err) {
        console.error(err);
        return null;
    }
}

/* ===============================
   💼 LINKEDIN
================================ */
async function shareLinkedIn() {
    const post = await getRandomPost("linkedin");
    if (!post) return;

    const sharePage =
        `https://anokhatechfest.com/share.html?id=${post.id}&cb=${Date.now()}`;

    window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(sharePage)}`,
        "_blank"
    );
}

/* ===============================
   🐦 TWITTER (X)
================================ */
async function shareTwitter() {
    const post = await getRandomPost("twitter");
    if (!post) return;

    const tweetText = post.url
        ? `${post.text}\n${post.url}`
        : post.text;

    const message = encodeURIComponent(tweetText);
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobile) {
        window.location.href = `twitter://post?message=${message}`;
        setTimeout(() => {
            if (document.visibilityState === "visible") {
                window.open(
                    `https://twitter.com/intent/tweet?text=${message}`,
                    "_blank"
                );
            }
        }, 500);
    } else {
        window.open(
            `https://twitter.com/intent/tweet?text=${message}`,
            "_blank"
        );
    }
}

/* ===============================
   📸 INSTAGRAM (FIXED)
================================ */
function shareInstagram() {
    // ⚠️ MUST NOT be async (gesture-safe)
    getRandomPost("instagram").then(post => {
        if (!post) return;

        const hashtags = post.hashtags.map(tag => `#${tag}`).join(" ");
        const caption = `${post.content}\n\n${hashtags}`;

        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

        if (isMobile) {
            // 1️⃣ OPEN APP FIRST (gesture-safe)
            window.location.href = "instagram://app";

            // 2️⃣ COPY TEXT AFTER
            setTimeout(() => {
                navigator.clipboard.writeText(caption)
                    .then(() => {
                        alert("✅ Content copied to clipboard.\nPaste it while posting on Instagram.");
                    })
                    .catch(() => {});
            }, 100);

            // 3️⃣ FALLBACK IF APP NOT OPENED
            setTimeout(() => {
                if (document.visibilityState === "visible") {
                    window.open("https://www.instagram.com/", "_blank");
                }
            }, 1200);
        } else {
            // Desktop
            navigator.clipboard.writeText(caption).then(() => {
                alert("✅ Content copied to clipboard.\nPaste it while posting on Instagram.");
                window.open("https://www.instagram.com/", "_blank");
            });
        }
    });
}
