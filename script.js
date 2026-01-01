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
        if (!res.ok) throw new Error("Failed to fetch content");

        const data = await res.json();

        // If array → randomize
        if (Array.isArray(data)) {
            return data[Math.floor(Math.random() * data.length)];
        }

        // Fallback for single object
        return data;
    } catch (err) {
        console.error(`Error loading ${platform} content:`, err);
        return null;
    }
}

/* ===============================
   🔵 LINKEDIN
   (Uses OG-based share.html)
================================ */
async function shareLinkedIn() {
    const post = await getRandomPost("linkedin");
    if (!post) return;

    const hashtags = post.hashtags.map(tag => `#${tag}`).join(" ");
    const fullText = `${post.content}\n\n${hashtags}`;
    const encodedText = encodeURIComponent(fullText);

    // share.html MUST be publicly hosted
    const sharePage =
        `https://yourdomain.com/share.html?text=${encodedText}&cb=${Date.now()}`;

    window.location.href =
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(sharePage)}`;
}

/* ===============================
   🟦 TWITTER (X)
================================ */
async function shareTwitter() {
    const post = await getRandomPost("twitter");
    if (!post) return;

    // Build tweet text
    const tweetText = post.url
        ? `${post.text}\n${post.url}`
        : post.text;

    const message = encodeURIComponent(tweetText);

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobile) {
        // Try opening X app
        window.location.href = `twitter://post?message=${message}`;

        // Browser fallback
        setTimeout(() => {
            if (document.visibilityState === "visible") {
                window.location.href =
                    `https://twitter.com/intent/tweet?text=${message}`;
            }
        }, 300);
    } else {
        // Desktop browser
        window.location.href =
            `https://twitter.com/intent/tweet?text=${message}`;
    }
}

/* ===============================
   🟣 INSTAGRAM
   (Clipboard + open app/site)
================================ */
async function shareInstagram() {
    const post = await getRandomPost("instagram");
    if (!post) return;

    const hashtags = post.hashtags.map(tag => `#${tag}`).join(" ");
    const caption = `${post.content}\n\n${hashtags}`;

    try {
        await navigator.clipboard.writeText(caption);
    } catch (err) {
        console.error("Clipboard copy failed:", err);
        return;
    }

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobile) {
        window.location.href = "instagram://app";
    } else {
        window.location.href = "https://www.instagram.com/";
    }
}
