document.addEventListener("DOMContentLoaded", () => {
    const linkedinBtn = document.getElementById("linkedinBtn");
    const twitterBtn = document.getElementById("twitterBtn");
    const instagramBtn = document.getElementById("instagramBtn");

    if (linkedinBtn) linkedinBtn.addEventListener("click", shareLinkedIn);
    if (twitterBtn) twitterBtn.addEventListener("click", shareTwitter);
    if (instagramBtn) instagramBtn.addEventListener("click", shareInstagram);
});

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

async function shareLinkedIn() {
    const post = await getRandomPost("linkedin");
    if (!post) return;

    const hashtags = post.hashtags.map(tag => `#${tag}`).join(" ");
    const text = `${post.content}\n\n${hashtags}`;

    const linkedInUrl = "https://www.linkedin.com/feed/?shareActive=true";
    window.open(linkedInUrl, "_blank");

    setTimeout(() => {
        navigator.clipboard.writeText(text)
            .then(() => {
                alert("✅ Content copied to clipboard.\nPaste it in LinkedIn to post.");
            })
            .catch(err => console.error("Clipboard failed", err));
    }, 100);
}

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

function shareInstagram() {
    getRandomPost("instagram").then(post => {
        if (!post) return;

        const hashtags = post.hashtags.map(tag => `#${tag}`).join(" ");
        const caption = `${post.content}\n\n${hashtags}`;

        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

        if (isMobile) {
            window.location.href = "instagram://app";

            setTimeout(() => {
                navigator.clipboard.writeText(caption)
                    .then(() => {
                        alert("✅ Content copied to clipboard.\nPaste it while posting on Instagram.");
                    })
                    .catch(() => {});
            }, 100);

            setTimeout(() => {
                if (document.visibilityState === "visible") {
                    window.open("https://www.instagram.com/", "_blank");
                }
            }, 1200);
        } else {
            navigator.clipboard.writeText(caption).then(() => {
                alert("✅ Content copied to clipboard.\nPaste it while posting on Instagram.");
                window.open("https://www.instagram.com/", "_blank");
            });
        }
    });
}
