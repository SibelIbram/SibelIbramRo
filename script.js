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

    // Function to scroll to a section within the landing page
    function scrollToLandingSection(sectionId) {
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

    // Function to update active nav button
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

    // Translations object
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
            'about-p1': 'With 20 years of experience in global organizations and a decade focused on continuous improvement my work and myself, I am specialized in transforming Finance and HR operations through strategic alignment, data-driven decision-making, and operational excellence. I\'m certified as a Master Black Belt, Agile Coach, and Scrum Master, and I continuously evolve my skillset to drive meaningful, lasting change.',
            'about-p2': 'I\'m passionate about empowering teams and individuals to become strategic business partners by unlocking their potential through innovation, agility, and purpose-driven leadership. I can develop already built teams or build teams from the scratch in every domain of business based on my experience.',
            'about-specializations': 'Specializations:',
            'about-spec1-title': 'Continuous Improvement mindset:',
            'about-spec1-text': 'Designing and implementing systems, structures, ways of working, strategies, mindset for an individual, a team, a division or department that align with personal and business goals to deliver sustainable operational excellence.',
            'about-spec2-title': 'Leadership:',
            'about-spec2-text': 'Leading and coaching into high performing, cross-functional teams to generate measurable value across every type of business landscape.',
            'about-spec3-title': 'Strategy to Execution:',
            'about-spec3-text': 'Building a strategy for individuals, team, department and company and ensuring to bridge the gap between vision and implementation to have both ambitious and actionable plans.',
            'about-spec4-title': 'Technology-Driven Transformation:',
            'about-spec4-text': 'Ensuring people and technology work together and support in identifying the type of automations needed',
            'about-spec5-title': 'Stakeholder Engagement:',
            'about-spec5-text': 'Building strong, collaborative and relationships that foster transparency, trust, and long-term value creation.',
            'about-purpose-title': 'What is my purpose?',
            'about-purpose-text': 'To coach and develop individuals and entrepreneurs in their day to day business, to improve their activities, reduce and eliminate waste, and become better in everything they do with clear and tangible actions and results.',
            'about-p3': 'I can deliver individual and team trainings, coach and develop based on my experience. I can work in partnership with business leaders to improve their business and build long lasting strategy.',
            'about-collaboration': 'Collaboration and partnerships in:',
            'about-collab1': 'Trainings individuals & teams',
            'about-collab2': 'Consultant business owners',
            'about-collab3': 'Speaker conferences',
            'about-collab4': 'Coaching individuals & teams',
            'about-collab5': 'Writing and speaking',
            // Speaking
            'speaking-title': 'Speaking Engagements',
            'speaking-location-label': 'Location',
            'speaking-date-label': 'Date:',
            'speaking-location-label': 'Location',
            'speaking-more-info': 'More information in the links below:',
            'speaking-location-label': 'Location',
            // Trainings
            'trainings-title': 'Trainings',
            'trainings-learn-more': 'Learn More',
            // Publications
            'publications-title': 'Publications',
            'publications-read-more': 'Read More →',
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
            'footer-copyright': '© 2025 Sibel Ibram. All rights reserved.'
        },
        ro: {
            // Navigation
            'nav-about': 'Despre mine',
            'nav-speaking': 'Prezentări',
            'nav-testimonials': 'Testimoniale',
            'nav-trainings': 'Formări',
            'nav-publications': 'Publicații',
            'nav-contact': 'Contact',
            // About Me
            'about-title': 'Despre mine',
            'about-p1': 'Cu 20 de ani de experiență în organizații globale și un deceniu axat pe îmbunătățire continuă a muncii și a mea, sunt specializat în transformarea operațiunilor de Finanțe și Resurse Umane prin aliniere strategică, luare de decizii bazată pe date și excelență operațională. Sunt certificat ca Master Black Belt, Agile Coach și Scrum Master, și îmi evoluez continuu competențele pentru a genera schimbări semnificative și durabile.',
            'about-p2': 'Sunt pasionat de a împuternici echipele și persoanele să devină parteneri de afaceri strategici prin deblocarea potențialului lor prin inovație, agilitate și leadership orientat pe scop. Pot dezvolta echipe deja construite sau pot construi echipe de la zero în orice domeniu de afaceri bazat pe experiența mea.',
            'about-specializations': 'Specializări:',
            'about-spec1-title': 'Mentalitate de îmbunătățire continuă:',
            'about-spec1-text': 'Proiectarea și implementarea sistemelor, structurilor, modalităților de lucru, strategiilor, mentalității pentru o persoană, o echipă, o divizie sau departament care se aliniază cu obiectivele personale și de afaceri pentru a livra excelență operațională durabilă.',
            'about-spec2-title': 'Leadership:',
            'about-spec2-text': 'Conducerea și coaching-ul echipelor de înaltă performanță, cross-funcționale pentru a genera valoare măsurabilă în orice tip de peisaj de afaceri.',
            'about-spec3-title': 'De la Strategie la Execuție:',
            'about-spec3-text': 'Construirea unei strategii pentru persoane, echipă, departament și companie și asigurarea legăturii între viziune și implementare pentru a avea planuri atât ambițioase cât și acționabile.',
            'about-spec4-title': 'Transformare bazată pe tehnologie:',
            'about-spec4-text': 'Asigurarea că oamenii și tehnologia lucrează împreună și sprijină identificarea tipului de automatizări necesare',
            'about-spec5-title': 'Angajarea stakeholderilor:',
            'about-spec5-text': 'Construirea unor relații puternice, collaborative care promovează transparența, încrederea și crearea de valoare pe termen lung.',
            'about-purpose-title': 'Care este scopul meu?',
            'about-purpose-text': 'Să antrenez și să dezvolt persoane și antreprenori în activitatea lor zilnică de afaceri, să îmbunătățesc activitățile lor, să reduc și să elimin risipa, și să devin mai buni în tot ce fac cu acțiuni și rezultate clare și tangibile.',
            'about-p3': 'Pot livra formări individuale și de echipă, pot antrena și dezvolta bazat pe experiența mea. Pot lucra în parteneriat cu liderii de afaceri pentru a îmbunătăți afacerea lor și a construi o strategie de durată.',
            'about-collaboration': 'Colaborare și parteneriate în:',
            'about-collab1': 'Formări persoane & echipe',
            'about-collab2': 'Consultant proprietari de afaceri',
            'about-collab3': 'Prezentări conferințe',
            'about-collab4': 'Coaching persoane & echipe',
            'about-collab5': 'Scriere și prezentări',
            // Speaking
            'speaking-title': 'Prezentări',
            'speaking-location-label': 'Locație',
            'speaking-date-label': 'Data:',
            'speaking-more-info': 'Mai multe informații în linkurile de mai jos:',
            'speaking-location-label': 'Locație',
            // Trainings
            'trainings-title': 'Formări',
            'trainings-learn-more': 'Află mai mult',
            // Publications
            'publications-title': 'Publicații',
            'publications-read-more': 'Citește mai mult →',
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
            'footer-copyright': '© 2025 Sibel Ibram. Toate drepturile rezervate.'
        }
    };

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
        translatePage(initialLang);
    }


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

        speakingItem.innerHTML = `
            <div class="speaking-image">
                <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="speaking-details">
                <h2>${item.title}</h2>
                <p class="speaking-location">${item.location}</p>
                <p class="speaking-date"><span data-i18n="speaking-date-label">${dateLabel}</span> ${item.date}</p>
                <p class="speaking-description">${item.description}</p>
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

