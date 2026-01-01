// Wait until HTML is fully loaded
document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("linkedinBtn")
        .addEventListener("click", shareLinkedIn);

    document.getElementById("twitterBtn")
        .addEventListener("click", shareTwitter);

    document.getElementById("instagramBtn")
        .addEventListener("click", shareInstagram);

});

// Fetch post content
async function getPost(platform) {
    try {
        const response = await fetch(`content/${platform}.json`);
        if (!response.ok) {
            throw new Error("Content file not found");
        }
        return await response.json();
    } catch (err) {
        alert("Error loading post content. Check folder structure.");
        console.error(err);
    }
}

// LinkedIn
async function shareLinkedIn() {
    const data = await getPost("linkedin");
    if (!data) return;

    const shareURL =
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(data.url)}`;

    window.open(shareURL, "_blank");
}

// Twitter (X)
async function shareTwitter() {
    const data = await getPost("twitter");
    if (!data) return;

    const shareURL =
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(data.text)}&url=${encodeURIComponent(data.url)}`;

    window.open(shareURL, "_blank");
}

// Instagram
async function shareInstagram() {
    const data = await getPost("instagram");
    if (!data) return;

    await navigator.clipboard.writeText(data.text);
    alert("Caption copied! Paste it on Instagram.");
    window.open("https://www.instagram.com", "_blank");
}
