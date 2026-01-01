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

    const appLink = `linkedin://shareArticle?mini=true&url=${encodeURIComponent(data.url)}`;
    const webLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(data.url)}`;

    window.location.href = appLink;
    setTimeout(() => window.location.href = webLink, 1500);
}

/* Twitter (X) */
async function shareTwitter() {
    const data = await getPost("twitter");
    if (!data) return;

    const message = encodeURIComponent(`${data.text} ${data.url}`);

    const appLink = `twitter://post?message=${message}`;
    const webLink = `https://twitter.com/intent/tweet?text=${message}`;

    window.location.href = appLink;
    setTimeout(() => window.location.href = webLink, 1500);
}

/* Instagram */
async function shareInstagram() {
    const data = await getPost("instagram");
    if (!data) return;

    // Copy caption silently
    await navigator.clipboard.writeText(data.text);

    const appLink = "instagram://app";
    const webLink = "https://www.instagram.com";

    window.location.href = appLink;
    setTimeout(() => window.location.href = webLink, 1500);
}
