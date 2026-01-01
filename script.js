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
async function shareInstagram() {
    const post = await getRandomPost("instagram");
    if (!post) return;

    const hashtags = post.hashtags.map(h => `#${h}`).join(" ");
    const caption = `${post.content}\n\n${hashtags}`;

    const isAndroid = /Android/i.test(navigator.userAgent);

    // ✅ ANDROID + CHROME (FULL SHARE)
    if (isAndroid && navigator.canShare) {
        try {
            const response = await fetch(post.image);
            const blob = await response.blob();
            const file = new File([blob], "post.jpg", { type: blob.type });

            if (navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    text: caption,
                    title: "Share to Instagram"
                });
                return;
            }
        } catch (err) {
            console.warn("Web Share failed, falling back", err);
        }
    }

    // 🔁 FALLBACK (iOS / Desktop)
    try {
        await navigator.clipboard.writeText(caption);
    } catch {}

    window.open(post.image, "_blank");

    setTimeout(() => {
        window.location.href = "instagram://app";
    }, 300);
}
