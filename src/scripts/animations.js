import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. Signature Preloader & Hero Word Reveals
  // ==========================================
  const preloader = document.getElementById('preloader');
  const heroWords = document.querySelectorAll('.hero-title .word, .about-hero-title .word, .portfolio-hero-title .word');

  const triggerHeroWords = () => {
    if (heroWords.length > 0) {
      gsap.to(heroWords, {
        opacity: 1,
        y: 0,
        duration: 0.65,
        stagger: 0.045,
        ease: 'power2.out',
        force3D: true,
        overwrite: 'auto'
      });
    }
  };

  if (preloader) {
    const startTime = performance.now();
    const minDisplayDuration = 1900; // Complete full SVG ring and logomark formation

    const dismissPreloader = () => {
      if (preloader.dataset.dismissed === 'true') return;
      preloader.dataset.dismissed = 'true';

      const preloaderContent = preloader.querySelector('.preloader-content');
      const tl = gsap.timeline({
        onComplete: () => {
          preloader.classList.add('loaded');
          preloader.style.display = 'none';
        }
      });

      if (preloaderContent) {
        tl.to(preloaderContent, {
          opacity: 0,
          y: -24,
          scale: 0.94,
          duration: 0.35,
          ease: 'power2.in'
        });
      }

      tl.to(preloader, {
        yPercent: -100,
        duration: 0.8,
        ease: 'power3.inOut',
        onStart: () => {
          setTimeout(triggerHeroWords, 220);
        }
      }, '-=0.1');
    };

    const handlePageReady = () => {
      const elapsed = performance.now() - startTime;
      const remainingTime = Math.max(0, minDisplayDuration - elapsed);
      setTimeout(dismissPreloader, remainingTime);
    };

    // Wait for window assets, fonts, and DOM
    if (document.readyState === 'complete') {
      handlePageReady();
    } else {
      window.addEventListener('load', handlePageReady, { once: true });
      // Fallback safeguard
      setTimeout(handlePageReady, 2200);
    }
  } else {
    triggerHeroWords();
  }


  // ==========================================
  // 2. Navbar Scroll Dynamics & ScrollSpy
  // ==========================================
  const headerNav = document.getElementById('headerNav');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navOverlay = document.getElementById('navOverlay');
  const dropdownToggle = document.getElementById('portfolioDropdownBtn');
  const dropdownMenu = document.getElementById('portfolioMenu');

  // Glassmorphic header effect on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      headerNav?.classList.add('scrolled');
    } else {
      headerNav?.classList.remove('scrolled');
    }
  }, { passive: true });

  // ScrollSpy Active Highlight for Sections
  const isHomePage = window.location.pathname === '/' || window.location.pathname === '/index.html' || window.location.pathname === '';
  if (isHomePage) {
    const sections = ['home', 'about', 'portfolio', 'contact']
      .map(id => document.getElementById(id))
      .filter(Boolean);

    const navItems = {
      home: document.querySelector('#navLinksList [data-nav="home"]'),
      about: document.querySelector('#navLinksList [data-nav="about"]'),
      portfolio: document.querySelector('#navLinksList [data-nav="portfolio"]'),
      contact: document.querySelector('#navLinksList [data-nav="contact"]')
    };

    const updateScrollSpy = () => {
      if (sections.length === 0) return;
      const scrollPos = window.scrollY + 200;

      let currentId = 'home';
      for (const section of sections) {
        if (section && section.offsetTop <= scrollPos) {
          currentId = section.id;
        }
      }

      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 80) {
        currentId = 'contact';
      }

      Object.entries(navItems).forEach(([key, item]) => {
        if (item) {
          if (key === currentId) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        }
      });
    };

    window.addEventListener('scroll', updateScrollSpy, { passive: true });
    updateScrollSpy();
  }

  // Mobile Hamburger Toggle
  if (navToggle && navMenu) {
    const toggleMenu = () => {
      const isOpen = navMenu.classList.contains('active');
      navToggle.classList.toggle('active', !isOpen);
      navMenu.classList.toggle('active', !isOpen);
      navOverlay?.classList.toggle('active', !isOpen);
      navToggle.setAttribute('aria-expanded', String(!isOpen));
      document.body.style.overflow = !isOpen ? 'hidden' : '';
    };

    navToggle.addEventListener('click', toggleMenu);
    navOverlay?.addEventListener('click', toggleMenu);

    // Close menu when clicking nav links
    navMenu.querySelectorAll('.nav-link:not(.dropdown-toggle), .dropdown-item').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 992) {
          navToggle.classList.remove('active');
          navMenu.classList.remove('active');
          navOverlay?.classList.remove('active');
          navToggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      });
    });
  }

  // Mobile Dropdown Click
  if (dropdownToggle && dropdownMenu) {
    dropdownToggle.addEventListener('click', (e) => {
      if (window.innerWidth < 992) {
        e.preventDefault();
        e.stopPropagation();
        dropdownToggle.classList.toggle('open');
        dropdownMenu.classList.toggle('open');
      }
    });
  }

  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    if (window.innerWidth >= 992) return;
    if (dropdownMenu && !dropdownMenu.contains(e.target) && dropdownToggle && !dropdownToggle.contains(e.target)) {
      dropdownToggle.classList.remove('open');
      dropdownMenu.classList.remove('open');
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 992) {
      if (navMenu?.classList.contains('active')) {
        navToggle?.classList.remove('active');
        navMenu.classList.remove('active');
        navOverlay?.classList.remove('active');
        document.body.style.overflow = '';
      }
      dropdownToggle?.classList.remove('open');
      dropdownMenu?.classList.remove('open');
    }
  }, { passive: true });

  // ==========================================
  // 3. Fast, Snappy GSAP ScrollTrigger Reveals
  // ==========================================
  const revealSections = document.querySelectorAll('.reveal-section');
  revealSections.forEach(section => {
    const items = section.querySelectorAll('.reveal-item');
    if (items.length > 0) {
      gsap.fromTo(items,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.05,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 92%',
            toggleActions: 'play none none none',
            fastScrollEnd: true
          }
        }
      );
    }
  });

  // ==========================================
  // 4. Hero Media Slideshow Cycler
  // ==========================================
  const heroSlideshows = document.querySelectorAll('.hero-slideshow-background');
  heroSlideshows.forEach(slideshow => {
    const slides = slideshow.querySelectorAll('.hero-slide');
    if (slides.length <= 1) return;
    let currentIndex = 0;
    setInterval(() => {
      slides[currentIndex].classList.remove('active');
      currentIndex = (currentIndex + 1) % slides.length;
      slides[currentIndex].classList.add('active');
    }, 4000);
  });

  // ==========================================
  // 5. Fullscreen Lightbox Modal Gallery
  // ==========================================
  const photoCards = document.querySelectorAll('.photo-card');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxSpecs = document.getElementById('lightboxSpecs');
  const lightboxLocation = document.getElementById('lightboxLocation');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');

  if (photoCards.length > 0 && lightboxModal && lightboxImg) {
    photoCards.forEach(card => {
      card.addEventListener('click', () => {
        const img = card.querySelector('.photo-img');
        const source = card.querySelector('picture source');
        const title = card.getAttribute('data-title') ||
          (card.querySelector('.photo-card-title, .photo-title') ? card.querySelector('.photo-card-title, .photo-title').textContent.trim() : '');
        const specs = card.getAttribute('data-specs') ||
          (card.querySelector('.photo-card-specs, .photo-specs') ? card.querySelector('.photo-card-specs, .photo-specs').textContent.trim() : '');
        const location = card.getAttribute('data-location') ||
          (card.querySelector('.photo-card-location, .photo-location') ? card.querySelector('.photo-card-location, .photo-location').textContent.trim() : '');

        let resolvedSrc = card.getAttribute('data-full-src') || '';
        if (!resolvedSrc && source && source.getAttribute('srcset')) {
          resolvedSrc = source.getAttribute('srcset').split(' ')[0];
        } else if (!resolvedSrc && img) {
          resolvedSrc = img.currentSrc || img.getAttribute('src') || '';
        }

        if (resolvedSrc) {
          lightboxImg.src = resolvedSrc;
          lightboxImg.alt = title || 'Expanded View';
        }
        if (lightboxTitle) lightboxTitle.textContent = title || '';
        if (lightboxSpecs) lightboxSpecs.textContent = specs || '';
        if (lightboxLocation) lightboxLocation.textContent = location || '';

        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });


    const closeLightbox = () => {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
      if (lightboxImg) lightboxImg.src = '';
    };

    lightboxCloseBtn?.addEventListener('click', closeLightbox);
    lightboxBackdrop?.addEventListener('click', closeLightbox);
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
        closeLightbox();
      }
    });
  }
});
