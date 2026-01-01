document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("linkedinBtn").addEventListener("click", shareLinkedIn);
    document.getElementById("twitterBtn").addEventListener("click", shareTwitter);
    document.getElementById("instagramBtn").addEventListener("click", shareInstagram);
});

/* Fetch JSON and return a random post */
async function getRandomPost(platform) {
    try {
        const res = await fetch(`content/${platform}.json`);
        if (!res.ok) return null;

        const data = await res.json();

        // If array → randomize
        if (Array.isArray(data)) {
            return data[Math.floor(Math.random() * data.length)];
        }

        // Fallback (single object)
        return data;
    } catch (err) {
        console.error("Failed to load content:", err);
        return null;
    }
}

/* 🔵 LINKEDIN — TEXT ONLY */
async function shareLinkedIn() {
    const post = await getRandomPost("linkedin");
    if (!post) return;

    const hashtags = post.hashtags.map(tag => `#${tag}`).join(" ");
    const text = encodeURIComponent(`${post.content}\n\n${hashtags}`);

    window.location.href =
        `https://www.linkedin.com/sharing/share-offsite/?summary=${text}`;
}

/* 🟦 TWITTER (X) — TEXT ONLY */
async function shareTwitter() {
    const post = await getRandomPost("twitter");
    if (!post) return;

    const hashtags = post.hashtags.map(tag => `#${tag}`).join(" ");
    const message = encodeURIComponent(`${post.content}\n\n${hashtags}`);

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobile) {
        window.location.href = `twitter://post?message=${message}`;
        setTimeout(() => {
            if (document.visibilityState === "visible") {
                window.location.href =
                    `https://twitter.com/intent/tweet?text=${message}`;
            }
        }, 300);
    } else {
        window.location.href =
            `https://twitter.com/intent/tweet?text=${message}`;
    }
}

/* 🟣 INSTAGRAM — COPY TEXT ONLY */
async function shareInstagram() {
    const post = await getRandomPost("instagram");
    if (!post) return;

    const hashtags = post.hashtags.map(tag => `#${tag}`).join(" ");
    const caption = `${post.content}\n\n${hashtags}`;

    await navigator.clipboard.writeText(caption);

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobile) {
        window.location.href = "instagram://app";
    } else {
        window.location.href = "https://www.instagram.com/";
    }
}
