document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("linkedinBtn").addEventListener("click", shareLinkedIn);
    document.getElementById("twitterBtn").addEventListener("click", shareTwitter);
    document.getElementById("instagramBtn").addEventListener("click", shareInstagram);
});

/* Fetch post content from JSON */
async function getPost(platform) {
    try {
        const res = await fetch(`content/${platform}.json`);
        if (!res.ok) return null;
        return await res.json();
    } catch {
        return null;
    }
}

/* 🔵 LINKEDIN — ALWAYS BROWSER (AUTO-TYPED TEXT + URL) */
async function shareLinkedIn() {
    const data = await getPost("linkedin");
    if (!data) return;

    const text = encodeURIComponent(data.text);
    const url = encodeURIComponent(data.url);

    window.location.href =
        `https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${text}`;
}

/* 🟦 TWITTER (X) — APP FIRST, WEB FALLBACK */
async function shareTwitter() {
    const data = await getPost("twitter");
    if (!data) return;

    const message = encodeURIComponent(`${data.text} ${data.url}`);
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobile) {
        // Try opening app
        window.location.href = `twitter://post?message=${message}`;

        // If app not installed, browser fallback
        setTimeout(() => {
            if (document.visibilityState === "visible") {
                window.location.href =
                    `https://twitter.com/intent/tweet?text=${message}`;
            }
        }, 300);
    } else {
        // Desktop → browser
        window.location.href =
            `https://twitter.com/intent/tweet?text=${message}`;
    }
}

/* 🟣 INSTAGRAM — APP ON MOBILE, WEB ON DESKTOP */
async function shareInstagram() {
    const data = await getPost("instagram");
    if (!data) return;

    // Auto-copy caption (maximum allowed)
    await navigator.clipboard.writeText(data.text);

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobile) {
        // Mobile → open app
        window.location.href = "instagram://app";
    } else {
        // Desktop → open website
        window.location.href = "https://www.instagram.com/";
    }
}
