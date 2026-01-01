document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("linkedinBtn");
    if (btn) btn.addEventListener("click", shareLinkedIn);
});

/* 🔀 Fetch & Randomize LinkedIn Content */
async function getRandomLinkedInPost() {
    try {
        const res = await fetch("content/linkedin.json");
        if (!res.ok) throw new Error("Failed to load JSON");

        const posts = await res.json();
        return posts[Math.floor(Math.random() * posts.length)];
    } catch (err) {
        console.error("Error:", err);
        return null;
    }
}

/* 🔵 SHARE TO LINKEDIN (AUTO-FILL VIA OG URL) */
async function shareLinkedIn() {
    const post = await getRandomLinkedInPost();
    if (!post) return;

    // Build final post text
    const hashtags = post.hashtags.map(tag => `#${tag}`).join(" ");
    const fullText = `${post.content}\n\n${hashtags}`;

    // Encode text for URL
    const encodedText = encodeURIComponent(fullText);

    // Share page (OG metadata page)
    const sharePage =
        `https://yourdomain.com/share.html?text=${encodedText}&cb=${Date.now()}`;

    // Open LinkedIn share dialog
    window.location.href =
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(sharePage)}`;
}
