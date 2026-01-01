document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("linkedinBtn").addEventListener("click", shareLinkedIn);
    document.getElementById("twitterBtn").addEventListener("click", shareTwitter);
    document.getElementById("instagramBtn").addEventListener("click", shareInstagram);
});

async function getPost(platform) {
    try {
        const res = await fetch(`content/${platform}.json`);
        if (!res.ok) throw new Error("Content not found");
        return await res.json();
    } catch (e) {
        console.error(e);
        return null;
    }
}

/* LinkedIn */
async function shareLinkedIn() {
    const data = await getPost("linkedin");
    if (!data) return;

    // Try app first (one-click)
    window.location.href =
        `linkedin://shareArticle?mini=true&url=${encodeURIComponent(data.url)}`;
}

/* Twitter (X) */
async function shareTwitter() {
    const data = await getPost("twitter");
    if (!data) return;

    const message = encodeURIComponent(`${data.text} ${data.url}`);

    // Try app first (text prefilled)
    window.location.href =
        `twitter://post?message=${message}`;
}

/* Instagram */
async function shareInstagram() {
    const data = await getPost("instagram");
    if (!data) return;

    // Copy caption silently
    await navigator.clipboard.writeText(data.text);

    // Open app directly
    window.location.href = "instagram://app";
}
