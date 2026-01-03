// Translations object (defined early so getTranslation can access it)
const translations = {
    en: {
        // Navigation
        'nav-about': 'About me',
        'nav-speaking': 'Speaking',
        'nav-testimonials': 'Testimonials',
        'nav-trainings': 'Trainings',
        'nav-publications': 'Publications',
        'nav-contact': 'Contact',
        // About Me
        'about-title': 'About Me',
        'about-p1': 'With 20 years of experience in global organizations and a decade focused on continuous improvement, I am specialized in transforming through strategic alignment, data-driven decision-making, and operational excellence. I\'m certified as a Master Black Belt, Agile Coach, and Scrum Master, and I continuously evolve my skillset to drive meaningful, lasting change.',
        'about-p2': 'I\'m passionate about empowering teams and individuals to become strategic business partners by unlocking their potential through innovation, agility, and purpose-driven leadership. I can develop already built teams or build teams from the scratch, based on my experience.',
        'about-specializations': 'Specializations:',
        'about-spec1-title': 'Continuous Improvement mindset:',
        'about-spec1-text': 'Designing and implementing systems, structures, ways of working, strategies, mindset for an individual, a team, a division or department that align with personal and business goals to deliver sustainable operational excellence.',
        'about-spec2-title': 'Leadership:',
        'about-spec2-text': 'Leading and coaching into high performing, cross-functional teams to generate measurable value across every type of business landscape.',
        'about-spec3-title': 'Strategy to Execution:',
        'about-spec3-text': 'Building a strategy for individuals and teams and ensuring to bridge the gap between vision and implementation to have both ambitious and actionable plans.',
        'about-spec4-title': 'Technology-Driven Transformation:',
        'about-spec4-text': 'Ensuring people and technology work together and support in identifying the type of automations needed',
        'about-spec5-title': 'Stakeholder Engagement:',
        'about-spec5-text': 'Building strong, collaborative and relationships that foster transparency, trust, and long-term value creation.',
        'about-purpose-title': 'What is my purpose?',
        'about-purpose-text': 'To coach and develop individuals and entrepreneurs in their day-to-day business, to improve their activities, reduce and eliminate waste, decrease costs, and become better in everything they do with clear and tangible actions and results.',
        'about-collaboration': 'Collaboration & partnerships in:',
        'about-collab1': 'Adapted Trainings for individuals & teams',
        'about-collab2': 'Consultant business owners',
        'about-collab3': 'Speaker conferences',
        // Speaking
        'speaking-title': 'Speaking Engagements',
        'speaking-location-label': 'Location',
        'speaking-date-label': 'Date:',
        'speaking-more-info': 'More information in the links below:',
        'speaking-read-more': 'Read More →',
        // Trainings
        'trainings-title': 'Trainings',
        'trainings-learn-more': 'Learn More',
        'trainings-read-more': 'Read More →',
        'back-to-trainings': '← Back to Trainings',
        // Publications
        'publications-title': 'Publications',
        'publications-read-more': 'Read More →',
        'back-to-publications': '← Back to Publications',
        // Speaking
        'back-to-speaking': '← Back to Speaking',
        // Legal pages
        'back-to-home': '← Back to Home',
        // Contact
        'contact-title': 'Contact',
        'contact-email-label': 'Email:',
        'contact-phone-label': 'Phone:',
        'contact-location-label': 'Location:',
        'contact-location-value': 'Bucharest, Romania',
        // Footer
        'footer-quick-links': 'Quick Links',
        'footer-connect': 'Connect',
        'footer-legal': 'Legal',
        'footer-privacy': 'Privacy Policy',
        'footer-terms': 'Terms of Service',
        'footer-copyright': '© 2026 Sibel Ibram. All rights reserved.'
    },
    ro: {
        // Navigation
        'nav-about': 'Despre mine',
        'nav-speaking': 'Prezentări',
        'nav-testimonials': 'Testimoniale',
        'nav-trainings': 'Training',
        'nav-publications': 'Publicații',
        'nav-contact': 'Contact',
        // About Me
        'about-title': 'Despre mine',
        'about-p1': 'Cu 20 de ani de experiență în organizații globale și un deceniu dedicat îmbunătățirii continue, sunt specializată în transformare prin aliniere strategică, luarea deciziilor bazate pe date și excelență operațională. Sunt certificată ca Master Black Belt, Agile Coach și Scrum Master și îmi dezvolt constant competențele pentru a genera schimbări semnificative și durabile.',
        'about-p2': 'Sunt pasionată de a sprijini echipele și oamenii să devină parteneri strategici de afaceri, prin valorificarea potențialului lor prin inovație, agilitate și un leadership orientat spre obiective clare. Pot dezvolta echipe deja formate sau construi echipe de la zero, bazându-mă pe experiența mea.',
        'about-specializations': 'Specializări:',
        'about-spec1-title': 'Mentalitate de Îmbunătățire Continuă:',
        'about-spec1-text': 'Proiectarea și implementarea sistemelor, structurilor, modurilor de lucru, strategiilor și mentalității pentru un individ, o echipă, o divizie sau un departament, aliniate la obiectivele personale și de business, pentru a livra excelență operațională sustenabilă.',
        'about-spec2-title': 'Leadership:',
        'about-spec2-text': 'Conducerea și coaching-ul echipelor sa fie performante, multifuncționale, pentru a genera valoare măsurabilă în orice tip de mediu de afaceri.',
        'about-spec3-title': 'De la Strategie la Execuție:',
        'about-spec3-text': 'Construirea unei strategii pentru indivizi și echipe și asigurarea punții dintre viziune și implementare, pentru a avea planuri ambițioase și realizabile.',
        'about-spec4-title': 'Transformare bazată pe Tehnologie:',
        'about-spec4-text': 'Asigurarea colaborării dintre oameni și tehnologie și sprijin în identificarea tipului de automatizări necesare',
        'about-spec5-title': 'Construirea de relații puternice:',
        'about-spec5-text': 'colaborative, care promovează transparența, încrederea și crearea de valoare pe termen lung.',
        'about-purpose-title': 'Care este scopul meu?',
        'about-purpose-text': 'Să ghidez și să dezvolt indivizi și antreprenori în activitățile lor zilnice, pentru a-și îmbunătăți procesele, a reduce și elimina pierderile, a diminua costurile și a deveni mai buni în tot ceea ce fac, prin acțiuni și rezultate clare și tangibile.',
        'about-collaboration': 'Colaborare & parteneriate în:',
        'about-collab1': 'Traininguri adaptate pentru indivizi și echipe',
        'about-collab2': 'Consultanță pentru proprietarii de afaceri',
        'about-collab3': 'Speaker la conferințe',
        // Speaking
        'speaking-title': 'Prezentări',
        'speaking-location-label': 'Locație',
        'speaking-date-label': 'Data:',
        'speaking-more-info': 'Mai multe informații în linkurile de mai jos:',
        'speaking-read-more': 'Citește mai mult →',
        // Trainings
        'trainings-title': 'Training',
        'trainings-learn-more': 'Află mai mult',
        'trainings-read-more': 'Citește mai mult →',
        'back-to-trainings': '← Înapoi la Training',
        // Publications
        'publications-title': 'Publicații',
        'publications-read-more': 'Citește mai mult →',
        'back-to-publications': '← Înapoi la Publicații',
        // Speaking
        'back-to-speaking': '← Înapoi la Prezentări',
        // Legal pages
        'back-to-home': '← Înapoi la Pagina Principală',
        // Contact
        'contact-title': 'Contact',
        'contact-email-label': 'Email:',
        'contact-phone-label': 'Telefon:',
        'contact-location-label': 'Locație:',
        'contact-location-value': 'București, România',
        // Footer
        'footer-quick-links': 'Linkuri rapide',
        'footer-connect': 'Contact',
        'footer-legal': 'Legal',
        'footer-privacy': 'Politica de confidențialitate',
        'footer-terms': 'Termeni și condiții',
        'footer-copyright': '© 2026 Sibel Ibram. Toate drepturile rezervate.'
    }
};

// Function to get translated text (accessible globally, available immediately)
window.getTranslation = function(key, lang) {
    if (!lang) {
        lang = localStorage.getItem('preferredLanguage') || 'en';
    }
    if (translations[lang] && translations[lang][key]) {
        return translations[lang][key];
    }
    // Fallback to English if translation not found
    if (translations.en && translations.en[key]) {
        return translations.en[key];
    }
    return key; // Return key if no translation found
};

// Navigation functionality
document.addEventListener('DOMContentLoaded', () => {
    // Get all navigation buttons and sections
    const navButtons = document.querySelectorAll('.nav-btn');
    const contentSections = document.querySelectorAll('.content-section');
    const landingPage = document.getElementById('landing-page');
    const footerLinks = document.querySelectorAll('.footer-section a[data-section]');

    // Sections that are part of the landing page (scrollable)
    const landingPageSections = ['about', 'speaking', 'testimonials'];
    
    // Sections that are separate pages (switchable)
    const separateSections = ['trainings', 'publications', 'contact'];
    
    // Function to update active nav button (define early so we can use it)
    function updateActiveNavButton(sectionId, isScrollUpdate = false) {
        // Remove active class from all nav buttons
        navButtons.forEach(btn => {
            btn.classList.remove('active');
        });

        // Add active class to corresponding nav button
        const activeBtn = document.querySelector(`.nav-btn[data-section="${sectionId}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }
    
    // Check hash IMMEDIATELY to prevent flicker - set initial state before anything renders
    let sectionIdToShow = null;
    const hash = window.location.hash;
    
    if (hash) {
        // If hash exists, use it
        sectionIdToShow = hash.substring(1); // Remove the #
        // Store in sessionStorage for back button support
        if (separateSections.includes(sectionIdToShow) || landingPageSections.includes(sectionIdToShow)) {
            sessionStorage.setItem('lastSection', sectionIdToShow);
            // Mark that we have an explicit hash (user navigated to a section)
            sessionStorage.setItem('hadHash', 'true');
        }
    } else {
        // No hash on initial load
        // Check if we came from a detail page (back button scenario)
        const referrer = document.referrer;
        const isFromDetailPage = referrer && (
            referrer.includes('training-detail.html') || 
            referrer.includes('publication-detail.html') || 
            referrer.includes('speaking-detail.html')
        );
        
        if (isFromDetailPage) {
            // Only restore the hash if the user had explicitly navigated to a section (had a hash)
            const hadHash = sessionStorage.getItem('hadHash');
            if (hadHash === 'true') {
                // Restore the last section from sessionStorage
                const lastSection = sessionStorage.getItem('lastSection');
                if (lastSection && (separateSections.includes(lastSection) || landingPageSections.includes(lastSection))) {
                    sectionIdToShow = lastSection;
                    // Update URL hash without triggering navigation
                    history.replaceState(null, '', `#${lastSection}`);
                }
            } else {
                // User started at / (no hash), so clear lastSection to ensure clean state
                sessionStorage.removeItem('lastSection');
            }
        } else {
            // User opened / directly (not from a detail page) - clear flags to ensure clean state
            sessionStorage.removeItem('hadHash');
            sessionStorage.removeItem('lastSection');
        }
    }
    
    // Apply the section to show
    if (sectionIdToShow) {
        if (separateSections.includes(sectionIdToShow)) {
            // Hide landing page immediately if going to a separate section
            if (landingPage) {
                landingPage.classList.remove('active');
            }
            // Hide all sections first
            contentSections.forEach(section => {
                section.classList.remove('active');
            });
            // Show target section
            const targetSection = document.getElementById(sectionIdToShow);
            if (targetSection) {
                targetSection.classList.add('active');
            }
            // Update nav button
            updateActiveNavButton(sectionIdToShow);
            // Scroll to top immediately to prevent any flicker
            window.scrollTo(0, 0);
        } else if (landingPageSections.includes(sectionIdToShow)) {
            // Ensure landing page is visible for landing page sections
            if (landingPage) {
                landingPage.classList.add('active');
            }
            contentSections.forEach(section => {
                section.classList.remove('active');
            });
            updateActiveNavButton(sectionIdToShow);
        }
    }

    // Function to scroll to a section within the landing page
    function scrollToLandingSection(sectionId) {
        // Store section in sessionStorage for back button support
        sessionStorage.setItem('lastSection', sectionId);
        // Mark that user explicitly navigated (has hash)
        sessionStorage.setItem('hadHash', 'true');
        // Update URL hash
        history.replaceState(null, '', `#${sectionId}`);
        
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            // Show landing page if hidden
            if (landingPage) {
                landingPage.classList.add('active');
            }
            
            // Hide all separate sections
            contentSections.forEach(section => {
                section.classList.remove('active');
            });

            // Mark that we're doing a programmatic scroll
            isProgrammaticScroll = true;
            updateActiveNavButton(sectionId);

            // Scroll to the target section
            const headerOffset = 80; // Account for sticky header
            const elementPosition = targetSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Reset programmatic scroll flag after scroll completes
            setTimeout(() => {
                isProgrammaticScroll = false;
            }, 1000);
        }
    }

    // Function to switch to a separate section
    function switchToSeparateSection(sectionId) {
        // Store section in sessionStorage for back button support
        sessionStorage.setItem('lastSection', sectionId);
        // Mark that user explicitly navigated (has hash)
        sessionStorage.setItem('hadHash', 'true');
        // Update URL hash
        history.replaceState(null, '', `#${sectionId}`);
        
        // Hide landing page
        if (landingPage) {
            landingPage.classList.remove('active');
        }

        // Hide all sections
        contentSections.forEach(section => {
            section.classList.remove('active');
        });

        // Show selected section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            
            // Scroll to top of page
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Update active nav button
        updateActiveNavButton(sectionId);
    }

    // Track if we're currently scrolling programmatically (to avoid conflicts)
    let isProgrammaticScroll = false;

    // Set up scroll-based highlighting for landing page sections
    function setupScrollHighlighting() {
        const landingSections = landingPageSections.map(id => document.getElementById(id)).filter(Boolean);
        
        if (landingSections.length === 0) return;

        function updateActiveSectionOnScroll() {
            // Only update if landing page is active and not during programmatic scroll
            if (!landingPage || !landingPage.classList.contains('active') || isProgrammaticScroll) {
                return;
            }

            const headerOffset = 150; // Offset from top of viewport
            let currentSection = null;
            let minDistance = Infinity;

            landingSections.forEach(section => {
                const rect = section.getBoundingClientRect();
                const sectionTop = rect.top;
                const sectionBottom = rect.bottom;
                
                // Check if section is near the top of viewport (within header offset area)
                // We want to highlight the section that's closest to the header offset position
                if (sectionTop <= headerOffset && sectionBottom >= headerOffset) {
                    // Section spans the header offset - this is the active one
                    const distance = Math.abs(sectionTop - headerOffset);
                    if (distance < minDistance) {
                        minDistance = distance;
                        currentSection = section.id;
                    }
                } else if (sectionTop > headerOffset && sectionTop < headerOffset + 300) {
                    // Section is just below the header - check if it's the closest
                    const distance = sectionTop - headerOffset;
                    if (distance < minDistance) {
                        minDistance = distance;
                        currentSection = section.id;
                    }
                } else if (sectionTop < headerOffset && sectionBottom > headerOffset - 100) {
                    // Section is above but still partially visible
                    const distance = headerOffset - sectionBottom;
                    if (distance < minDistance && distance >= 0) {
                        minDistance = distance;
                        currentSection = section.id;
                    }
                }
            });

            // If we found a section, update the nav button
            if (currentSection) {
                updateActiveNavButton(currentSection, true);
            }
        }

        // Throttle scroll events for better performance
        let scrollTimeout;
        function handleScroll() {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            scrollTimeout = setTimeout(updateActiveSectionOnScroll, 50);
        }

        // Check initial position
        setTimeout(updateActiveSectionOnScroll, 100);

        // Listen to scroll events
        window.addEventListener('scroll', handleScroll, { passive: true });

        // Also check when landing page becomes active
        const landingPageObserver = new MutationObserver(() => {
            if (landingPage && landingPage.classList.contains('active')) {
                setTimeout(updateActiveSectionOnScroll, 100);
            }
        });

        if (landingPage) {
            landingPageObserver.observe(landingPage, {
                attributes: true,
                attributeFilter: ['class']
            });
        }
    }

    // Add click event listeners to nav buttons
    navButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = button.getAttribute('data-section');
            
            if (landingPageSections.includes(sectionId)) {
                // Scroll to section within landing page
                scrollToLandingSection(sectionId);
            } else if (separateSections.includes(sectionId)) {
                // Switch to separate section
                switchToSeparateSection(sectionId);
            }
        });
    });

    // Add click event listeners to footer links
    footerLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-section');
            
            if (landingPageSections.includes(sectionId)) {
                scrollToLandingSection(sectionId);
            } else if (separateSections.includes(sectionId)) {
                switchToSeparateSection(sectionId);
            }
        });
    });

    // Function to translate the page
    function translatePage(lang) {
        // Update HTML lang attribute
        document.documentElement.lang = lang;
        
        // Translate all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                if (element.tagName === 'INPUT' && element.type === 'submit') {
                    element.value = translations[lang][key];
                } else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translations[lang][key];
                } else {
                    element.textContent = translations[lang][key];
                }
            }
        });
        
        // Translate elements with data-i18n-html for HTML content
        document.querySelectorAll('[data-i18n-html]').forEach(element => {
            const key = element.getAttribute('data-i18n-html');
            if (translations[lang] && translations[lang][key]) {
                element.innerHTML = translations[lang][key];
            }
        });
    }

    // Language switch functionality
    const langButtons = document.querySelectorAll('.lang-btn');
    
    langButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all language buttons
            langButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            const selectedLang = button.getAttribute('data-lang');
            
            // Store language preference
            localStorage.setItem('preferredLanguage', selectedLang);
            
            // Translate the page
            translatePage(selectedLang);
            
            // Reload content for the new language
            if (typeof reloadContent === 'function') {
                reloadContent();
            }
        });
    });

    // Function to get language from URL parameter or localStorage
    function getInitialLanguage() {
        // Check URL parameter first
        const urlParams = new URLSearchParams(window.location.search);
        const langParam = urlParams.get('lang');
        
        if (langParam === 'ro' || langParam === 'en') {
            // Save to localStorage if URL parameter is present
            localStorage.setItem('preferredLanguage', langParam);
            return langParam;
        }
        
        // Fall back to saved preference or default to English
        return localStorage.getItem('preferredLanguage') || 'en';
    }

    // Load language preference and translate
    const initialLang = getInitialLanguage();
    const initialLangBtn = document.querySelector(`.lang-btn[data-lang="${initialLang}"]`);
    if (initialLangBtn) {
        langButtons.forEach(btn => btn.classList.remove('active'));
        initialLangBtn.classList.add('active');
    }
    // Always translate the page, even if there are no language buttons (for detail pages)
    translatePage(initialLang);


    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Initialize scroll-based highlighting
    setupScrollHighlighting();

    // Load speaking engagements from Firebase or fallback data
    loadSpeakingEngagements();
    
    // Handle hash fragment changes (when clicking links with hash after page load)
    function handleHashChange() {
        const hash = window.location.hash;
        if (hash) {
            const sectionId = hash.substring(1); // Remove the #
            // Store in sessionStorage for back button support
            if (separateSections.includes(sectionId) || landingPageSections.includes(sectionId)) {
                sessionStorage.setItem('lastSection', sectionId);
                // Mark that user explicitly navigated (has hash)
                sessionStorage.setItem('hadHash', 'true');
            }
            if (landingPageSections.includes(sectionId)) {
                // Scroll to section within landing page
                scrollToLandingSection(sectionId);
            } else if (separateSections.includes(sectionId)) {
                // Switch to separate section
                switchToSeparateSection(sectionId);
            }
        }
    }
    
    // Listen for hash changes (when clicking links with hash after page has loaded)
    window.addEventListener('hashchange', () => {
        handleHashChange();
    });
});

// Function to render speaking engagements
function renderSpeakingEngagements(speakingData) {
    const speakingList = document.getElementById('speaking-list');
    if (!speakingList) return;

    // Clear existing content
    speakingList.innerHTML = '';

    // Get current language
    const currentLang = localStorage.getItem('preferredLanguage') || 'en';
    const dateLabel = currentLang === 'ro' ? 'Data:' : 'Date:';
    const moreInfoLabel = currentLang === 'ro' 
        ? 'Mai multe informații în linkurile de mai jos:' 
        : 'More information in the links below:';

    // Render each speaking engagement
    speakingData.forEach(item => {
        const speakingItem = document.createElement('div');
        speakingItem.className = 'speaking-item';
        
        const linksHTML = item.links && item.links.length > 0 
            ? `<p class="speaking-links">
                <span data-i18n="speaking-more-info">${moreInfoLabel}</span><br>
                ${item.links.map((link, index) => 
                    `<a href="${link.url}" target="_blank" rel="noopener noreferrer">${link.text || `LinkedIn Link ${index + 1}`}</a>`
                ).join('<br>')}
               </p>`
            : '';

        // Check if description exists to show "Read more" button
        const hasDescription = item.description && item.description.trim().length > 0;
        const itemId = item.id || 'fallback_' + Math.random().toString(36).substr(2, 9);
        const readMoreText = typeof getTranslation === 'function' ? getTranslation('speaking-read-more') : 'Read More →';
        const readMoreButton = hasDescription 
            ? `<a href="speaking-detail.html?id=${itemId}" class="read-more-speaking" data-i18n="speaking-read-more">${readMoreText}</a>`
            : '';

        // Show short description on main page if available
        const shortDescHTML = item.shortDescription && item.shortDescription.trim().length > 0
            ? `<p class="speaking-short-description">${item.shortDescription}</p>`
            : '';

        // Format date as dd/mm/yyyy (European format)
        let formattedDate = '';
        if (item.date) {
          if (item.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
            // It's in YYYY-MM-DD format (from date input)
            const [year, month, day] = item.date.split('-');
            formattedDate = `${day}/${month}/${year}`;
          } else {
            // Try to parse as date
            try {
              const dateObj = new Date(item.date);
              if (!isNaN(dateObj.getTime())) {
                const day = String(dateObj.getDate()).padStart(2, '0');
                const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                const year = dateObj.getFullYear();
                formattedDate = `${day}/${month}/${year}`;
              } else {
                formattedDate = item.date;
              }
            } catch (e) {
              formattedDate = item.date;
            }
          }
        }

        speakingItem.innerHTML = `
            <div class="speaking-image">
                <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="speaking-details">
                <h2>${item.title}</h2>
                <p class="speaking-location">${item.location}</p>
                ${formattedDate ? `<p class="speaking-date"><span data-i18n="speaking-date-label">${dateLabel}</span> ${formattedDate}</p>` : ''}
                ${shortDescHTML}
                ${readMoreButton}
                ${linksHTML}
            </div>
        `;
        
        speakingList.appendChild(speakingItem);
    });
}

// Function to load speaking engagements
function loadSpeakingEngagements() {
    // Fallback data structure (matches current content)
    const fallbackData = [
        {
            title: 'SSWO Europe 2025',
            location: 'Amsterdam',
            date: 'October 2025',
            description: 'R2R Value Creation Topic.',
            image: '../Resources/1762348223344.jpeg',
            links: [
                {
                    url: 'https://www.linkedin.com/posts/european-shared-services-and-outsourcing-week_deep-dives-bold-debates-and-fresh-perspectives-activity-7386765638884671488-N9ly/?utm_source=share&utm_medium=member_desktop&rcm=ACoAAAMzgvUBStSv_zj9m_niHdxtabkuc9gdlcY',
                    text: 'LinkedIn Link 1'
                },
                {
                    url: 'https://www.linkedin.com/search/results/all/?keywords=%23ssowautumn&origin=HASH_TAG_FROM_FEED&sid=r1%3B',
                    text: 'LinkedIn Link 2'
                }
            ]
        }
    ];

    // TODO: Replace this with Firebase integration
    // Example Firebase code (commented out):
    /*
    import { initializeApp } from 'firebase/app';
    import { getFirestore, collection, getDocs } from 'firebase/firestore';
    
    const firebaseConfig = {
        // Your Firebase config
    };
    
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    async function loadFromFirebase() {
        const speakingCollection = collection(db, 'speakingEngagements');
        const snapshot = await getDocs(speakingCollection);
        const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        renderSpeakingEngagements(data);
    }
    
    loadFromFirebase().catch(() => {
        // Fallback to static data if Firebase fails
        renderSpeakingEngagements(fallbackData);
    });
    */

    // For now, use fallback data
    renderSpeakingEngagements(fallbackData);
}

