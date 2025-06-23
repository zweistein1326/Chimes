document.addEventListener('DOMContentLoaded', (event) => {
    const scrollElements = document.querySelectorAll('.scroll-text');

    // 1. Wrap each word in a span so we can animate it individually
    scrollElements.forEach(el => {
        const words = el.textContent.trim().split(/\s+/); // Split text into words
        el.innerHTML = ''; // Clear the original text
        
        words.forEach(word => {
            const span = document.createElement('span');
            span.className = 'scroll-word';
            span.textContent = word;
            el.appendChild(span);
            // Add a space back between the words
            el.appendChild(document.createTextNode(' '));
        });
    });

    /**
     * Handles the scroll event to update word opacity based on scroll depth.
     */
    const handleScroll = () => {
        const windowHeight = window.innerHeight;

        scrollElements.forEach(el => {
            const words = el.querySelectorAll('.scroll-word');
            if (words.length === 0) return;

            const rect = el.getBoundingClientRect();
            
            // Define the vertical range in the viewport where the animation occurs.
            const animationStart = windowHeight; 
            const animationEnd = windowHeight * 0.1;
            const animationDistance = animationStart - animationEnd;

            // Calculate how far the element's top is from the animation start point.
            const currentPosition = animationStart - rect.top;

            // Calculate the progress of the animation as a value between 0 and 1.
            let progress = currentPosition / animationDistance;
            
            // Clamp the progress value to ensure it stays between 0 and 1.
            progress = Math.max(0, Math.min(1, progress));

            // 2. Determine how many words should be fully visible based on progress
            const wordsToShow = Math.floor(progress * words.length);

            // 3. Update the opacity for each word
            words.forEach((word, index) => {
                if (index < wordsToShow) {
                    word.style.opacity = 1;
                } else {
                    word.style.opacity = 0.2; // Keep remaining words dim
                }
            });
        });
    };

    window.addEventListener('scroll', handleScroll);
    // Run the function once on load to set the initial state.
    handleScroll();

    // Hover effect for accordion-tiles;
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        item.addEventListener('click', () => {
            // Toggle the 'active' class on the clicked item
            item.classList.toggle('active');
            
            // Optional: Close other accordion items when one is opened
            accordionItems.forEach(otherItem => {
                // Check that the other header is not the one that was just clicked
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
        });
    });

    accordionItems.forEach((item) => {
        // Fades the item when the mouse enters
        item.addEventListener('mouseover', () => {
            item.style.opacity = 0.5;
        });

        // Restores the item's opacity when the mouse leaves
        item.addEventListener('mouseout', () => {
            item.style.opacity = 1;
        });
    });

    let lastScrollY = window.scrollY;
    const nav = document.getElementById('navigation');
    // The point after which the scroll animation should start
    const scrollThreshold = 80; 

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > scrollThreshold) {
            // Scrolling Down
            if (currentScrollY > lastScrollY) {
                nav.classList.add('nav-hidden');
            } 
            // Scrolling Up
            else {
                nav.classList.remove('nav-hidden');
            }
        } 
        // We are near the top of the page, so the navbar should always be visible
        else {
            nav.classList.remove('nav-hidden');
        }

        // Update lastScrollY for the next scroll event
        lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
    });

    // --- Custom Cursor Logic ---
        const cursor = document.querySelector('.custom-cursor');

        // State variables for cursor behavior
        let mouseX = 0;
        let mouseY = 0;
        let lastScrollYCursor = window.scrollY;
        let scrollSpeed = 0;
        let scrollTimeout = null;
        let hoverScale = 1;

        // Update mouse coordinates on move
        window.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Calculate scroll speed
        window.addEventListener('scroll', () => {
            scrollSpeed = Math.abs(window.scrollY - lastScrollYCursor);
            lastScrollYCursor = window.scrollY;
            
            clearTimeout(scrollTimeout);
            // Reset speed to 0 if scrolling stops for 100ms
            scrollTimeout = setTimeout(() => {
                scrollSpeed = 0;
            }, 100);
        });

        // Add hover listeners to all button elements
        document.querySelectorAll('button').forEach(button => {
            button.addEventListener('mouseenter', () => {
                hoverScale = 2; // Enlarge cursor on hover
            });
            button.addEventListener('mouseleave', () => {
                hoverScale = 1; // Return to default size on leave
            });
        });

        // Animation loop for smooth cursor updates
        const animateCursor = () => {
            // Calculate vertical scale based on scroll speed.
            // Math.min is used to clamp the maximum stretch value.
            const scrollScaleY = Math.min(1 + scrollSpeed / 4, 4);

            // Apply all transforms: position, centering, hover scale, and scroll scale
            cursor.style.transform = `
                translate3d(${mouseX}px, ${mouseY}px, 0) 
                translate(-50%, -50%) 
                scale(${hoverScale}) 
                scaleY(${scrollScaleY})
            `;

            // Continue the animation loop
            requestAnimationFrame(animateCursor);
        }

        // Start the cursor animation
        animateCursor();

});