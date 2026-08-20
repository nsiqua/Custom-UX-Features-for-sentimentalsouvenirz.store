document.addEventListener("DOMContentLoaded", function() {
    const videos = document.querySelectorAll('.woo-hover-video');
    
    // --- DESKTOP: Hover to play ---
    videos.forEach(video => {
        const productCard = video.closest('.product');
        if(productCard) {
            productCard.addEventListener('mouseenter', () => {
                video.play();
                video.style.opacity = '1';
            });
            productCard.addEventListener('mouseleave', () => {
                video.pause();
                video.currentTime = 0; 
                video.style.opacity = '0';
            });
        }
    });

    // --- MOBILE: YouTube-Style Center Play via IntersectionObserver ---
    if (window.matchMedia("(hover: none)").matches) {
        let visibleVideos = new Set();
        let scrollTimeout;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    visibleVideos.add(entry.target);
                } else {
                    visibleVideos.delete(entry.target);
                    entry.target.pause();
                    entry.target.currentTime = 0;
                    entry.target.style.opacity = '0';
                }
            });
            updateCenterVideo();
        }, { threshold: 0.2 }); 

        videos.forEach(video => observer.observe(video));

        window.addEventListener('scroll', () => {
            if (!scrollTimeout) {
                scrollTimeout = requestAnimationFrame(() => {
                    updateCenterVideo();
                    scrollTimeout = null;
                });
            }
        }, { passive: true });

        function updateCenterVideo() {
            if (visibleVideos.size === 0) return;
            
            let closestVideo = null;
            let minDistance = Infinity;
            const windowCenter = window.innerHeight / 2;

            visibleVideos.forEach(video => {
                const rect = video.getBoundingClientRect();
                const videoCenter = rect.top + (rect.height / 2);
                const distance = Math.abs(windowCenter - videoCenter);
                
                if (distance < minDistance) {
                    minDistance = distance;
                    closestVideo = video;
                }
            });

            visibleVideos.forEach(video => {
                if (video === closestVideo) {
                    let playPromise = video.play();
                    if (playPromise !== undefined) playPromise.catch(e => {}); 
                    video.style.opacity = '1';
                } else {
                    video.pause();
                    video.currentTime = 0;
                    video.style.opacity = '0';
                }
            });
        }
    }
});
