/**
 * EZ STUDIO - Quotation Calculator & Online System Interactions
 * Bundles system, services catalog, search, dynamic cart drawer, multi-quantity steppers, modal & PDF print.
 */

document.addEventListener('DOMContentLoaded', () => {
  const servicesGrid = document.getElementById('servicesGrid');
  if (!servicesGrid) return;

  // Services Database
  const SERVICES_DATA = [
    {
      id: "photography",
      name: "Photoshoot",
      category: "Visual",
      priceMin: 100,
      priceMax: 150,
      badge: "Photography Service",
      desc: "High-resolution photography services for your brand, including product photography, portrait photography, and event photography. (this service is per hour)",
      deliverables: ["Pose/Concept Guidance and Assistance", "Unlimited Photoshoot", "RAW Pictures", "Selected Edited images"]
    },
    {
      id: "videography",
      name: "Videoshoot",
      category: "Visual",
      priceMin: 100,
      priceMax: 150,
      badge: "Videography Service",
      desc: "High-resolution videography services for your brand, including product videography, portrait videography, and event videography. (this service is per hour)",
      deliverables: ["Pose/Concept Guidance and Assistance", "Unlimited Videoshoot", "RAW Video", "Simple Edited Video"]
    },
    {
      id: "videography-max",
      name: "Videoshoot MAX",
      category: "Visual",
      priceMin: 150,
      priceMax: 250,
      badge: "Advanced Videography",
      desc: "Delivering end-to-end video production services for large-scale events, conferences, and high-stakes commercial projects. (this service is per hour)",
      deliverables: ["Full event coverage", "Pre-production Planning", "On-Site Coordination", "High quality edited video (reels + full length)"]
    },
    {
      id: "video-editing",
      name: "Video Editing",
      category: "Visual",
      priceMin: 100,
      priceMax: 500,
      badge: "Video Editing Service",
      desc: "We transform your raw footage into captivating narratives with seamless editing, dynamic transitions, and professional color grading.",
      deliverables: ["Up to 60 seconds Edited video", "4K resolution", "Optimized for social media"]
    },
    {
      id: "poster-design",
      name: "Poster Design",
      category: "Design",
      priceMin: 150,
      priceMax: 300,
      badge: "Poster Design Service",
      desc: "High-resolution poster design services for your brand, including product poster design, portrait poster design, and event poster design.",
      deliverables: ["Unique and Creative Design", "High Resolution Poster design", "2D Poster Design"]
    },
    {
      id: "logo-design",
      name: "Logo Design",
      category: "Design",
      priceMin: 100,
      priceMax: 250,
      badge: "Logo Design Service",
      desc: "Unique and creative logo design services for your brand, including product logo design, portrait logo design, and event logo design.",
      deliverables: ["Unique and Creative Design", "High Resolution Logo design", "2D Logo Design"]
    },
    {
      id: "branding",
      name: "Branding & Identity",
      category: "Design",
      priceMin: 50,
      priceMax: 250,
      badge: "Branding Service",
      desc: "Branding direction and consultation, with early sketch, basic design, and one final design.",
      deliverables: ["Creative Consultation", "Early Sketch", "Concept Design", "Final Design"]
    },
    {
      id: "custom-branding",
      name: "Custom Branding",
      category: "Design",
      priceMin: 50,
      priceMax: 150,
      badge: "Branding Design",
      desc: "Custom Design for your branding including; template, business card design, and more",
      deliverables: ["Business Card Design", "Template Design", "Concept Design", "Final Design"]
    },
    {
      id: "2d-motion",
      name: "2D Motion",
      category: "Motion",
      priceMin: 100,
      priceMax: 300,
      badge: "Motion Graphic",
      desc: "High-retention motion graphic design for any kind of video. 2D text animation, dynamic typography, and kinetic text effects.",
      deliverables: ["Custom Audio Easing EFXs", "Vertical 9:16 Format Setup", "Fast 24-Hour Review Turnaround"]
    },
    {
      id: "3d-motion",
      name: "3D Motion Graphic",
      category: "Motion",
      priceMin: 300,
      priceMax: 1000,
      badge: "3D Motion",
      desc: "High-retention motion graphic design for cinematic 3D video. 3D composition, dynamic sound design, and visual effects.",
      deliverables: ["Clean Quad Polygonal Mesh", "High-Resolution UV Maps", "PBR Texture Channels (4K)", "OBJ/FBX & Blend File Delivery"]
    },
    {
      id: "web-landing",
      name: "Landing Page",
      category: "Web",
      priceMin: 500,
      priceMax: 1000,
      badge: "Website Design Service",
      desc: "Transform your brand with a stunning, high-performance website. Basic landing page design for new brand identity.",
      deliverables: ["Landing Page Design", "Modern Visual Assets", "Responsive Optimization", "Deployment Setup"]
    },
    {
      id: "web-full",
      name: "Web Design",
      category: "Web",
      priceMin: 1000,
      priceMax: 2000,
      badge: "Website Design Service",
      desc: "Transform your brand with a stunning, high-performance website. Full functional website for new brand identity.",
      deliverables: ["Full Functional Website Design", "Dynamic Design", "Responsive Design", "Search Engine Optimized"]
    }
  ];

  // Curated Bundles Database
  const BUNDLES_DATA = [
    {
      id: "brand-starter",
      name: "Brand Starter",
      badge: "Starter Package",
      tag: "BRANDING // IDENTITY",
      desc: "Complete visual identity package including custom logo creation, promotional posters, and interactive sticker assets.",
      items: [
        { serviceId: "logo-design", quantity: 1 },
        { serviceId: "branding", quantity: 2 },
        { serviceId: "custom-branding", quantity: 3 }
      ]
    },
    {
      id: "brand-pro",
      name: "Brand Professional",
      badge: "Professional Package",
      tag: "BRANDING // IDENTITY",
      desc: "Advanced brand development with custom logo design, comprehensive brand guideline creation, and professional website development.",
      items: [
        { serviceId: "logo-design", quantity: 1 },
        { serviceId: "branding", quantity: 2 },
        { serviceId: "custom-branding", quantity: 3 },
        { serviceId: "web-full", quantity: 1 }
      ]
    },
    {
      id: "event-videography",
      name: "Large Event Coverage",
      badge: "Event Coverage",
      tag: "CINEMATIC // LARGE EVENT",
      desc: "Full-scale event video shoot with advanced on-site production, dynamic storytelling, and high-end color grading.",
      items: [
        { serviceId: "videography-max", quantity: 5 },
        { serviceId: "video-editing", quantity: 3 }
      ]
    },
    {
      id: "creator-editor",
      name: "Creator Editor",
      badge: "Creator's Choice",
      tag: "VIDEO EDITING // CREATOR",
      desc: "Professional video editing services for creators and businesses, with fast turnaround times.",
      items: [
        { serviceId: "videography", quantity: 3 },
        { serviceId: "video-editing", quantity: 6 }
      ]
    }
  ];

  // State Variables
  let cart = [];
  let currentCategory = 'all';
  let searchQuery = '';

  // DOM Elements
  const bundlesGrid = document.getElementById('bundlesGrid');
  const serviceSearchInput = document.getElementById('serviceSearchInput');
  const categoryFilters = document.getElementById('categoryFilters');
  const cartItemsList = document.getElementById('cartItemsList');
  const btnClearCart = document.getElementById('btnClearCart');
  const subtotalMin = document.getElementById('subtotalMin');
  const subtotalMax = document.getElementById('subtotalMax');
  const subtotalRange = document.getElementById('subtotalRange');
  const btnPrintQuotation = document.getElementById('btnPrintQuotation');
  const detailsModal = document.getElementById('detailsModal');
  const detailsModalBody = document.getElementById('detailsModalBody');
  const detailsModalCloseBtn = document.getElementById('detailsModalCloseBtn');
  const detailsModalOverlay = document.getElementById('detailsModalOverlay');

  // Render Curated Bundles
  const renderBundles = () => {
    if (!bundlesGrid) return;
    bundlesGrid.innerHTML = '';

    BUNDLES_DATA.forEach(bundle => {
      let bundleMin = 0;
      let bundleMax = 0;

      bundle.items.forEach(bItem => {
        const s = SERVICES_DATA.find(srv => srv.id === bItem.serviceId);
        if (s) {
          bundleMin += s.priceMin * bItem.quantity;
          bundleMax += s.priceMax * bItem.quantity;
        }
      });

      const card = document.createElement('div');
      card.className = 'bundle-card reveal-item';
      card.innerHTML = `
        <div class="bundle-card-top">
          <span class="bundle-tag">${bundle.tag}</span>
          <span class="bundle-badge">${bundle.badge}</span>
        </div>
        <h3 class="bundle-card-title">${bundle.name}</h3>
        <p class="bundle-card-desc">${bundle.desc}</p>
        <div class="bundle-items-box">
          <div class="bundle-items-header">
            <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2.5" fill="none" style="color: var(--clr-teal);">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Package Includes:
          </div>
          <ul class="bundle-items-list">
            ${bundle.items.map(bItem => {
              const s = SERVICES_DATA.find(srv => srv.id === bItem.serviceId);
              return `
                <li class="bundle-item-entry">
                  <span class="bundle-item-name">${s ? s.name : bItem.serviceId}</span>
                  <span class="bundle-item-qty">${bItem.quantity}x</span>
                </li>
              `;
            }).join('')}
          </ul>
        </div>
        <div class="bundle-footer">
          <div class="bundle-price-block">
            <span class="bundle-price-label">Estimated Range</span>
            <span class="bundle-price-val">RM${bundleMin} - RM${bundleMax}</span>
          </div>
          <button class="btn-add-bundle" data-bundle-id="${bundle.id}">
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Add Bundle</span>
          </button>
        </div>
      `;
      bundlesGrid.appendChild(card);
    });

    bundlesGrid.querySelectorAll('.btn-add-bundle').forEach(btn => {
      btn.addEventListener('click', () => {
        const bundleId = btn.getAttribute('data-bundle-id');
        addBundleToCart(bundleId, btn);
      });
    });
  };

  // Add Bundle to Cart Action
  const addBundleToCart = (bundleId, btnEl) => {
    const bundle = BUNDLES_DATA.find(b => b.id === bundleId);
    if (!bundle) return;

    bundle.items.forEach(bItem => {
      const service = SERVICES_DATA.find(item => item.id === bItem.serviceId);
      if (!service) return;

      const cartItem = cart.find(item => item.id === bItem.serviceId);
      if (cartItem) {
        cartItem.quantity += bItem.quantity;
      } else {
        cart.push({ ...service, quantity: bItem.quantity });
      }
    });

    updateCart();
    renderServices();

    if (btnEl) {
      const originalHTML = btnEl.innerHTML;
      btnEl.classList.add('added-success');
      btnEl.innerHTML = `
        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>Bundle Added!</span>
      `;
      setTimeout(() => {
        btnEl.classList.remove('added-success');
        btnEl.innerHTML = originalHTML;
      }, 1800);
    }
  };

  // Cart Operations
  const addToCart = (id, quantity = 1) => {
    const service = SERVICES_DATA.find(item => item.id === id);
    if (!service) return;

    const cartItem = cart.find(item => item.id === id);
    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      cart.push({ ...service, quantity });
    }

    updateCart();
    renderServices();
  };

  const setCartQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    const cartItem = cart.find(item => item.id === id);
    if (cartItem) {
      cartItem.quantity = quantity;
    } else {
      const service = SERVICES_DATA.find(item => item.id === id);
      if (service) cart.push({ ...service, quantity });
    }

    updateCart();
    renderServices();
  };

  const removeFromCart = (id) => {
    const cartIndex = cart.findIndex(item => item.id === id);
    if (cartIndex > -1) {
      cart.splice(cartIndex, 1);
    }
    updateCart();
    renderServices();
  };

  // Render Services Grid
  const renderServices = () => {
    servicesGrid.innerHTML = '';

    const filtered = SERVICES_DATA.filter(service => {
      const matchesCategory = currentCategory === 'all' || service.category === currentCategory;
      const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.desc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
      servicesGrid.innerHTML = `<div class="cart-empty-message" style="grid-column: span 3; padding: 3rem 0; font-size: 1.1rem;">No services match your search query. Try another keyword!</div>`;
      return;
    }

    filtered.forEach(service => {
      const cartItem = cart.find(item => item.id === service.id);
      const card = document.createElement('div');
      card.className = 'service-card-new reveal-item';
      card.innerHTML = `
        <span class="service-card-category">${service.category} // ${service.badge}</span>
        <h3 class="service-card-title">${service.name}</h3>
        <p class="service-card-desc">${service.desc}</p>
        <div class="service-card-price-range">
          <span class="label">ESTIMATED PRICE RANGE:</span>
          RM${service.priceMin} - RM${service.priceMax}
        </div>
        <div class="service-card-actions">
          <button class="btn-card-details" data-id="${service.id}">View Details</button>
          ${cartItem ? `
            <div class="card-qty-stepper">
              <button class="btn-card-qty btn-card-qty-minus" data-id="${service.id}" aria-label="Decrease quantity">−</button>
              <span class="card-qty-num">${cartItem.quantity} in Cart</span>
              <button class="btn-card-qty btn-card-qty-plus" data-id="${service.id}" aria-label="Increase quantity">+</button>
            </div>
          ` : `
            <button class="btn-card-add" data-id="${service.id}">Add to Cart</button>
          `}
        </div>
      `;
      servicesGrid.appendChild(card);
    });

    servicesGrid.querySelectorAll('.btn-card-details').forEach(btn => {
      btn.addEventListener('click', () => {
        const serviceId = btn.getAttribute('data-id');
        openModal(serviceId);
      });
    });

    servicesGrid.querySelectorAll('.btn-card-add').forEach(btn => {
      btn.addEventListener('click', () => {
        const serviceId = btn.getAttribute('data-id');
        addToCart(serviceId, 1);
      });
    });

    servicesGrid.querySelectorAll('.btn-card-qty-minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const serviceId = btn.getAttribute('data-id');
        const cartItem = cart.find(item => item.id === serviceId);
        if (cartItem) {
          setCartQuantity(serviceId, cartItem.quantity - 1);
        }
      });
    });

    servicesGrid.querySelectorAll('.btn-card-qty-plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const serviceId = btn.getAttribute('data-id');
        const cartItem = cart.find(item => item.id === serviceId);
        if (cartItem) {
          setCartQuantity(serviceId, cartItem.quantity + 1);
        }
      });
    });
  };

  // Open Details Modal
  const openModal = (id) => {
    const service = SERVICES_DATA.find(item => item.id === id);
    if (!service) return;

    const cartItem = cart.find(item => item.id === service.id);
    let modalQty = cartItem ? cartItem.quantity : 1;

    const renderModalContent = () => {
      detailsModalBody.innerHTML = `
        <span class="modal-category">${service.category} // ${service.badge}</span>
        <h2 class="modal-title">${service.name}</h2>
        <div class="modal-price-range">Estimated Price: RM${service.priceMin} - RM${service.priceMax} <span style="font-size: 0.85rem; color: var(--clr-text-muted); font-weight: 500;">/ unit</span></div>
        <p class="modal-desc">${service.desc}</p>
        
        <h4 class="modal-section-title">What this service covers:</h4>
        <ul class="modal-deliverables-list">
          ${service.deliverables.map(del => `<li>${del}</li>`).join('')}
        </ul>

        <div class="modal-qty-container">
          <span class="modal-qty-label">Select Quantity / Units:</span>
          <div class="modal-qty-row">
            <div class="qty-stepper modal-stepper">
              <button class="btn-qty btn-modal-qty-minus" aria-label="Decrease quantity">−</button>
              <span class="qty-number" id="modalQtyDisplay">${modalQty}</span>
              <button class="btn-qty btn-modal-qty-plus" aria-label="Increase quantity">+</button>
            </div>
            <div class="modal-calc-total">
              <span class="calc-label" id="modalCalcLabel">Estimated for ${modalQty} ${modalQty === 1 ? 'unit' : 'units'}:</span>
              <span class="calc-range" id="modalCalcRange">RM${service.priceMin * modalQty} - RM${service.priceMax * modalQty}</span>
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 0.8rem;">
          ${cartItem ? `
            <button class="btn-secondary btn-modal-remove" style="border: 1px solid rgba(254, 93, 38, 0.3); color: var(--clr-orange); justify-content: center; padding: 0.9rem 1.2rem;">
              Remove
            </button>
          ` : ''}
          <button class="btn-primary btn-modal-submit" style="flex: 1; border: none; justify-content: center; padding: 0.9rem 1.5rem;">
            ${cartItem ? `Update Cart (${modalQty} ${modalQty === 1 ? 'unit' : 'units'})` : `Add to Cart (${modalQty} ${modalQty === 1 ? 'unit' : 'units'})`}
          </button>
        </div>
      `;

      const minusBtn = detailsModalBody.querySelector('.btn-modal-qty-minus');
      const plusBtn = detailsModalBody.querySelector('.btn-modal-qty-plus');
      const qtyDisplay = detailsModalBody.querySelector('#modalQtyDisplay');
      const calcLabel = detailsModalBody.querySelector('#modalCalcLabel');
      const calcRange = detailsModalBody.querySelector('#modalCalcRange');
      const submitBtn = detailsModalBody.querySelector('.btn-modal-submit');
      const removeBtn = detailsModalBody.querySelector('.btn-modal-remove');

      minusBtn.addEventListener('click', () => {
        if (modalQty > 1) {
          modalQty--;
          qtyDisplay.textContent = modalQty;
          calcLabel.textContent = `Estimated for ${modalQty} ${modalQty === 1 ? 'unit' : 'units'}:`;
          calcRange.textContent = `RM${service.priceMin * modalQty} - RM${service.priceMax * modalQty}`;
          submitBtn.textContent = cartItem ? `Update Cart (${modalQty} ${modalQty === 1 ? 'unit' : 'units'})` : `Add to Cart (${modalQty} ${modalQty === 1 ? 'unit' : 'units'})`;
        }
      });

      plusBtn.addEventListener('click', () => {
        modalQty++;
        qtyDisplay.textContent = modalQty;
        calcLabel.textContent = `Estimated for ${modalQty} ${modalQty === 1 ? 'unit' : 'units'}:`;
        calcRange.textContent = `RM${service.priceMin * modalQty} - RM${service.priceMax * modalQty}`;
        submitBtn.textContent = cartItem ? `Update Cart (${modalQty} ${modalQty === 1 ? 'unit' : 'units'})` : `Add to Cart (${modalQty} ${modalQty === 1 ? 'unit' : 'units'})`;
      });

      submitBtn.addEventListener('click', () => {
        setCartQuantity(service.id, modalQty);
        closeModal();
      });

      if (removeBtn) {
        removeBtn.addEventListener('click', () => {
          removeFromCart(service.id);
          closeModal();
        });
      }
    };

    renderModalContent();
    detailsModal.classList.add('active');
  };

  const closeModal = () => {
    if (detailsModal) detailsModal.classList.remove('active');
  };

  if (detailsModalCloseBtn) detailsModalCloseBtn.addEventListener('click', closeModal);
  if (detailsModalOverlay) detailsModalOverlay.addEventListener('click', closeModal);

  // Update Cart Panel & Subtotals
  const updateCart = () => {
    cartItemsList.innerHTML = '';

    if (cart.length === 0) {
      cartItemsList.innerHTML = `<div class="cart-empty-message">No items added yet. Click on services to build your quotation.</div>`;
      subtotalMin.textContent = 'RM0';
      subtotalMax.textContent = 'RM0';
      subtotalRange.textContent = 'RM0';
      if (btnClearCart) btnClearCart.style.display = 'none';
      return;
    }

    if (btnClearCart) btnClearCart.style.display = 'inline-flex';

    cart.forEach(item => {
      const row = document.createElement('div');
      row.className = 'cart-item-row';
      row.innerHTML = `
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-unit-price">RM${item.priceMin} - RM${item.priceMax} ea</div>
        </div>
        <div class="cart-item-controls">
          <div class="qty-stepper">
            <button class="btn-qty btn-cart-qty-minus" data-id="${item.id}" aria-label="Decrease quantity">−</button>
            <span class="qty-number">${item.quantity}</span>
            <button class="btn-qty btn-cart-qty-plus" data-id="${item.id}" aria-label="Increase quantity">+</button>
          </div>
          <div class="cart-item-total">RM${item.priceMin * item.quantity} - RM${item.priceMax * item.quantity}</div>
          <button class="btn-cart-remove" data-id="${item.id}" aria-label="Remove item">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      `;
      cartItemsList.appendChild(row);
    });

    cartItemsList.querySelectorAll('.btn-cart-qty-minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const serviceId = btn.getAttribute('data-id');
        const cartItem = cart.find(item => item.id === serviceId);
        if (cartItem) {
          setCartQuantity(serviceId, cartItem.quantity - 1);
        }
      });
    });

    cartItemsList.querySelectorAll('.btn-cart-qty-plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const serviceId = btn.getAttribute('data-id');
        const cartItem = cart.find(item => item.id === serviceId);
        if (cartItem) {
          setCartQuantity(serviceId, cartItem.quantity + 1);
        }
      });
    });

    cartItemsList.querySelectorAll('.btn-cart-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const serviceId = btn.getAttribute('data-id');
        removeFromCart(serviceId);
      });
    });

    const minSum = cart.reduce((sum, item) => sum + (item.priceMin * item.quantity), 0);
    const maxSum = cart.reduce((sum, item) => sum + (item.priceMax * item.quantity), 0);

    subtotalMin.textContent = `RM${minSum}`;
    subtotalMax.textContent = `RM${maxSum}`;
    subtotalRange.textContent = `RM${minSum} - RM${maxSum}`;
  };

  // Remove All from Cart
  if (btnClearCart) {
    btnClearCart.addEventListener('click', () => {
      if (cart.length === 0) return;
      cart = [];
      updateCart();
      renderServices();
    });
  }

  // Category Toggles
  if (categoryFilters) {
    categoryFilters.querySelectorAll('.filter-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        const activeFilter = categoryFilters.querySelector('.filter-pill.active');
        if (activeFilter) activeFilter.classList.remove('active');
        btn.classList.add('active');
        currentCategory = btn.getAttribute('data-category');
        renderServices();
      });
    });
  }

  // Search Keyup
  if (serviceSearchInput) {
    serviceSearchInput.addEventListener('keyup', (e) => {
      searchQuery = e.target.value;
      renderServices();
    });
  }

  // Print Trigger Handler
  if (btnPrintQuotation) {
    btnPrintQuotation.addEventListener('click', () => {
      if (cart.length === 0) {
        alert("Please add at least one service to your selection before generating a quotation PDF.");
        return;
      }

      const now = new Date();
      const printDate = document.getElementById('printDate');
      const printQuoteId = document.getElementById('printQuoteId');
      const printTableBody = document.getElementById('printTableBody');

      if (printDate) {
        printDate.textContent = now.toLocaleDateString('en-MY', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }

      if (printQuoteId) {
        printQuoteId.textContent = `EZQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      }

      if (printTableBody) {
        printTableBody.innerHTML = '';
        cart.forEach(item => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>
              <div style="font-weight: 750;">${item.name}</div>
              <div style="font-size: 0.8rem; color: #555555; margin-top: 0.2rem;">${item.desc}</div>
            </td>
            <td>${item.category}</td>
            <td style="text-align: center; font-weight: 700;">${item.quantity}</td>
            <td style="text-align: right; color: #555555;">RM${item.priceMin} - RM${item.priceMax}</td>
            <td style="text-align: right; font-weight: 750;">RM${item.priceMin * item.quantity} - RM${item.priceMax * item.quantity}</td>
          `;
          printTableBody.appendChild(tr);
        });
      }

      const minSum = cart.reduce((sum, item) => sum + (item.priceMin * item.quantity), 0);
      const maxSum = cart.reduce((sum, item) => sum + (item.priceMax * item.quantity), 0);

      const printTotalMin = document.getElementById('printTotalMin');
      const printTotalMax = document.getElementById('printTotalMax');
      const printTotalRange = document.getElementById('printTotalRange');

      if (printTotalMin) printTotalMin.textContent = `RM${minSum}`;
      if (printTotalMax) printTotalMax.textContent = `RM${maxSum}`;
      if (printTotalRange) printTotalRange.textContent = `RM${minSum} - RM${maxSum}`;

      window.print();
    });
  }

  // Initial Load
  renderBundles();
  renderServices();
});
