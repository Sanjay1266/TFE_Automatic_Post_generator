async function getPost(platform) {
    const response = await fetch(`content/${platform}.json`);
    return await response.json();
}

// LinkedIn
async function shareLinkedIn() {
    const data = await getPost("linkedin");
    const shareURL =
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(data.url)}`;

    window.open(shareURL, "_blank");
}

// Twitter (X)
async function shareTwitter() {
    const data = await getPost("twitter");
    const shareURL =
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(data.text)}&url=${encodeURIComponent(data.url)}`;

    window.open(shareURL, "_blank");
}

// Instagram
async function shareInstagram() {
    const data = await getPost("instagram");
    await navigator.clipboard.writeText(data.text);
    alert("Caption copied! Paste it in Instagram.");
    window.open("https://www.instagram.com", "_blank");
}
