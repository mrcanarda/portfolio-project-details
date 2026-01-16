// Gallery Animation (Main)
        const gallerySection = document.getElementById('gallerySection');
        const galleryContainer = document.getElementById('galleryContainer');
        const galleryItems = document.querySelectorAll('.gallery-item');

        function updateGallery() {
            const rect = gallerySection.getBoundingClientRect();
            const sectionHeight = gallerySection.offsetHeight;
            const windowHeight = window.innerHeight;
            
            if (rect.bottom < 0) return;
            if (rect.top > windowHeight) return;
            
            const scrolled = -rect.top;
            const scrollProgress = Math.max(0, Math.min(1, scrolled / (sectionHeight - windowHeight)));
            
            const { width: imageWidth, gap } = getImageDimensions(galleryContainer, galleryItems);
            const maxTranslate = (imageWidth + gap) * 2;
            
            const easedProgress = scrollProgress < 0.5
                ? 4 * scrollProgress * scrollProgress * scrollProgress
                : 1 - Math.pow(-2 * scrollProgress + 2, 3) / 2;
            
            const translateX = -easedProgress * maxTranslate;
            galleryContainer.style.transform = `translateX(${translateX}px)`;
        }

        // Projects Gallery Animation
        const projectsGallerySection = document.getElementById('projectsGallerySection');
        const projectsGalleryContainer = document.getElementById('projectsGalleryContainer');
        const projectsGalleryItems = document.querySelectorAll('.projects-gallery-item');

        function updateProjectsGallery() {
            const rect = projectsGallerySection.getBoundingClientRect();
            const sectionHeight = projectsGallerySection.offsetHeight;
            const windowHeight = window.innerHeight;
            
            if (rect.bottom < 0) return;
            if (rect.top > windowHeight) return;
            
            const scrolled = -rect.top;
            const scrollProgress = Math.max(0, Math.min(1, scrolled / (sectionHeight - windowHeight)));
            
            const { width: imageWidth, gap } = getImageDimensions(projectsGalleryContainer, projectsGalleryItems);
            const maxTranslate = (imageWidth + gap) * 2;
            
            const easedProgress = scrollProgress < 0.5
                ? 4 * scrollProgress * scrollProgress * scrollProgress
                : 1 - Math.pow(-2 * scrollProgress + 2, 3) / 2;
            
            const translateX = -easedProgress * maxTranslate;
            projectsGalleryContainer.style.transform = `translateX(${translateX}px)`;
        }

        function getImageDimensions(container, items) {
            if (items.length === 0) return { width: 0, gap: 0 };
            
            const firstItem = items[0];
            const itemWidth = firstItem.offsetWidth;
            const containerStyle = window.getComputedStyle(container);
            const gap = parseFloat(containerStyle.gap) || 40;
            
            return { width: itemWidth, gap: gap };
        }

        // Testimonial Word Animation
        const testimonialSection = document.getElementById('testimonialSection');
        const testimonialQuote = document.getElementById('testimonialQuote');
        
        function splitTextIntoWords() {
            const text = testimonialQuote.textContent.trim();
            const words = text.split(/\s+/);
            
            testimonialQuote.innerHTML = words.map(word => 
                `<span class="word">${word}</span>`
            ).join(' ');
        }

        function updateTestimonial() {
            const rect = testimonialSection.getBoundingClientRect();
            const sectionHeight = testimonialSection.offsetHeight;
            const windowHeight = window.innerHeight;
            
            if (rect.bottom < 0) return;
            if (rect.top > windowHeight) return;
            
            const scrolled = Math.max(0, -rect.top);
            const scrollProgress = Math.min(1, scrolled / (sectionHeight - windowHeight));
            
            const words = testimonialQuote.querySelectorAll('.word');
            const totalWords = words.length;
            
            words.forEach((word, index) => {
                const wordThreshold = index / totalWords;
                
                if (scrollProgress >= wordThreshold) {
                    word.classList.add('revealed');
                } else {
                    word.classList.remove('revealed');
                }
            });

            // Author bilgilerini de reveal et
            const authorElements = document.querySelectorAll('.author-name, .author-company');
            authorElements.forEach(el => {
                if (scrollProgress >= 0.95) {
                    el.classList.add('revealed');
                } else {
                    el.classList.remove('revealed');
                }
            });
        }

        // Final Quote - Image Fade In + Zoom Out, Text Fade Out
        const finalQuoteSection = document.getElementById('finalQuoteSection');
        const quoteImage = document.querySelector('.quote-image');
        const finalQuoteText = document.getElementById('finalQuoteText');

        function updateQuoteZoom() {
            const rect = finalQuoteSection.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const sectionHeight = finalQuoteSection.offsetHeight;
            
            if (rect.bottom < 0 || rect.top > windowHeight) {
                return;
            }
            
            const scrolled = Math.max(0, -rect.top);
            const scrollProgress = Math.min(1, scrolled / (sectionHeight - windowHeight));
            
            const startScale = 3.0;
            const endScale = 1.0;
            const currentScale = startScale - (scrollProgress * (startScale - endScale));
            
            const imageOpacity = scrollProgress;
            const textOpacity = 1 - Math.pow(scrollProgress, 1.5);
            
            quoteImage.style.transform = `scale(${currentScale})`;
            quoteImage.style.opacity = imageOpacity;
            finalQuoteText.style.opacity = textOpacity;
        }

        // Scroll Event Listener
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    updateGallery();
                    updateTestimonial();
                    updateQuoteZoom();
                    updateProjectsGallery();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });

        // Resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                updateGallery();
                updateTestimonial();
                updateQuoteZoom();
                updateProjectsGallery();
            }, 250);
        });

        // İlk yükleme
        splitTextIntoWords();
        updateGallery();
        updateTestimonial();
        updateQuoteZoom();
        updateProjectsGallery();

        // Custom Cursor for Projects
        const customCursor = document.getElementById('customCursor');
        const projectItems = document.querySelectorAll('.projects-gallery-item');

        // Track mouse position
        document.addEventListener('mousemove', (e) => {
            customCursor.style.left = e.clientX + 'px';
            customCursor.style.top = e.clientY + 'px';
        });

        // Show/hide cursor on project hover
        projectItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                customCursor.classList.add('active');
            });

            item.addEventListener('mouseleave', () => {
                customCursor.classList.remove('active');
            });
        });