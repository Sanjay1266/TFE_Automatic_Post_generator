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

        // Randomize if array
        if (Array.isArray(data)) {
            return data[Math.floor(Math.random() * data.length)];
        }

        return data;
    } catch (err) {
        console.error(`Error loading ${platform} content:`, err);
        alert(`Failed to load ${platform} content. Please try again.`);
        return null;
    }
}

/* ===============================
   💼 LINKEDIN
================================ */
async function shareLinkedIn() {
    const post = await getRandomPost("linkedin");
    if (!post) return;

    const hashtags = post.hashtags.map(tag => `#${tag}`).join(" ");
    const fullText = `${post.content}\n\n${hashtags}`;
    const encodedText = encodeURIComponent(fullText);

    // ⚠️ IMPORTANT: Replace with your actual domain
    const sharePage = `https://anokhatechfest.com/share.html?text=${encodedText}&cb=${Date.now()}`;

    window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(sharePage)}`,
        '_blank'
    );
}

/* ===============================
   🐦 TWITTER (X)
================================ */
async function shareTwitter() {
    const post = await getRandomPost("twitter");
    if (!post) return;

    const tweetText = post.url ? `${post.text}\n${post.url}` : post.text;
    const message = encodeURIComponent(tweetText);

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobile) {
        // Try Twitter app first
        window.location.href = `twitter://post?message=${message}`;

        // Fallback to web
        setTimeout(() => {
            if (document.visibilityState === "visible") {
                window.open(`https://twitter.com/intent/tweet?text=${message}`, '_blank');
            }
        }, 500);
    } else {
        // Desktop
        window.open(`https://twitter.com/intent/tweet?text=${message}`, '_blank');
    }
}

/* ===============================
   📸 INSTAGRAM
================================ */
async function shareInstagram() {
    const post = await getRandomPost("instagram");
    if (!post) return;

    const hashtags = post.hashtags.map(tag => `#${tag}`).join(" ");
    const caption = `${post.content}\n\n${hashtags}`;

    try {
        await navigator.clipboard.writeText(caption);
        
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

        if (isMobile) {
            alert("Caption copied! Opening Instagram app...");
            window.location.href = "instagram://app";
        } else {
            alert("Caption copied to clipboard! Opening Instagram...\n\nPaste it when creating your post.");
            window.open("https://www.instagram.com/", '_blank');
        }
    } catch (err) {
        console.error("Clipboard copy failed:", err);
        alert("Failed to copy caption. Please try again.");
    }
}