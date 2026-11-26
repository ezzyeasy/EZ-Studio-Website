document.addEventListener("DOMContentLoaded",()=>{const l=document.getElementById("servicesGrid");if(!l)return;const p=[{id:"photography",name:"Photoshoot",category:"Visual",priceMin:100,priceMax:150,badge:"Photography Service",desc:"High-resolution photography services for your brand, including product photography, portrait photography, and event photography. (this service is per hour)",deliverables:["Pose/Concept Guidance and Assistance","Unlimited Photoshoot","RAW Pictures","Selected Edited images"]},{id:"videography",name:"Videoshoot",category:"Visual",priceMin:100,priceMax:150,badge:"Videography Service",desc:"High-resolution videography services for your brand, including product videography, portrait videography, and event videography. (this service is per hour)",deliverables:["Pose/Concept Guidance and Assistance","Unlimited Videoshoot","RAW Video","Simple Edited Video"]},{id:"videography-max",name:"Videoshoot MAX",category:"Visual",priceMin:150,priceMax:250,badge:"Advanced Videography",desc:"Delivering end-to-end video production services for large-scale events, conferences, and high-stakes commercial projects. (this service is per hour)",deliverables:["Full event coverage","Pre-production Planning","On-Site Coordination","High quality edited video (reels + full length)"]},{id:"video-editing",name:"Video Editing",category:"Visual",priceMin:100,priceMax:500,badge:"Video Editing Service",desc:"We transform your raw footage into captivating narratives with seamless editing, dynamic transitions, and professional color grading.",deliverables:["Up to 60 seconds Edited video","4K resolution","Optimized for social media"]},{id:"poster-design",name:"Poster Design",category:"Design",priceMin:150,priceMax:300,badge:"Poster Design Service",desc:"High-resolution poster design services for your brand, including product poster design, portrait poster design, and event poster design.",deliverables:["Unique and Creative Design","High Resolution Poster design","2D Poster Design"]},{id:"logo-design",name:"Logo Design",category:"Design",priceMin:100,priceMax:250,badge:"Logo Design Service",desc:"Unique and creative logo design services for your brand, including product logo design, portrait logo design, and event logo design.",deliverables:["Unique and Creative Design","High Resolution Logo design","2D Logo Design"]},{id:"branding",name:"Branding & Identity",category:"Design",priceMin:50,priceMax:250,badge:"Branding Service",desc:"Branding direction and consultation, with early sketch, basic design, and one final design.",deliverables:["Creative Consultation","Early Sketch","Concept Design","Final Design"]},{id:"custom-branding",name:"Custom Branding",category:"Design",priceMin:50,priceMax:150,badge:"Branding Design",desc:"Custom Design for your branding including; template, business card design, and more",deliverables:["Business Card Design","Template Design","Concept Design","Final Design"]},{id:"2d-motion",name:"2D Motion",category:"Motion",priceMin:100,priceMax:300,badge:"Motion Graphic",desc:"High-retention motion graphic design for any kind of video. 2D text animation, dynamic typography, and kinetic text effects.",deliverables:["Custom Audio Easing EFXs","Vertical 9:16 Format Setup","Fast 24-Hour Review Turnaround"]},{id:"3d-motion",name:"3D Motion Graphic",category:"Motion",priceMin:300,priceMax:1e3,badge:"3D Motion",desc:"High-retention motion graphic design for cinematic 3D video. 3D composition, dynamic sound design, and visual effects.",deliverables:["Clean Quad Polygonal Mesh","High-Resolution UV Maps","PBR Texture Channels (4K)","OBJ/FBX & Blend File Delivery"]},{id:"web-landing",name:"Landing Page",category:"Web",priceMin:500,priceMax:1e3,badge:"Website Design Service",desc:"Transform your brand with a stunning, high-performance website. Basic landing page design for new brand identity.",deliverables:["Landing Page Design","Modern Visual Assets","Responsive Optimization","Deployment Setup"]},{id:"web-full",name:"Web Design",category:"Web",priceMin:1e3,priceMax:2e3,badge:"Website Design Service",desc:"Transform your brand with a stunning, high-performance website. Full functional website for new brand identity.",deliverables:["Full Functional Website Design","Dynamic Design","Responsive Design","Search Engine Optimized"]}],D=[{id:"brand-starter",name:"Brand Starter",badge:"Starter Package",tag:"BRANDING // IDENTITY",desc:"Complete visual identity package including custom logo creation, promotional posters, and interactive sticker assets.",items:[{serviceId:"logo-design",quantity:1},{serviceId:"branding",quantity:2},{serviceId:"custom-branding",quantity:3}]},{id:"brand-pro",name:"Brand Professional",badge:"Professional Package",tag:"BRANDING // IDENTITY",desc:"Advanced brand development with custom logo design, comprehensive brand guideline creation, and professional website development.",items:[{serviceId:"logo-design",quantity:1},{serviceId:"branding",quantity:2},{serviceId:"custom-branding",quantity:3},{serviceId:"web-full",quantity:1}]},{id:"event-videography",name:"Large Event Coverage",badge:"Event Coverage",tag:"CINEMATIC // LARGE EVENT",desc:"Full-scale event video shoot with advanced on-site production, dynamic storytelling, and high-end color grading.",items:[{serviceId:"videography-max",quantity:5},{serviceId:"video-editing",quantity:3}]},{id:"creator-editor",name:"Creator Editor",badge:"Creator's Choice",tag:"VIDEO EDITING // CREATOR",desc:"Professional video editing services for creators and businesses, with fast turnaround times.",items:[{serviceId:"videography",quantity:3},{serviceId:"video-editing",quantity:6}]}];let s=[],E="all",C="";const M=document.getElementById("bundlesGrid"),L=document.getElementById("serviceSearchInput"),$=document.getElementById("categoryFilters"),y=document.getElementById("cartItemsList"),m=document.getElementById("btnClearCart"),R=document.getElementById("subtotalMin"),B=document.getElementById("subtotalMax"),w=document.getElementById("subtotalRange"),S=document.getElementById("btnPrintQuotation"),x=document.getElementById("detailsModal"),u=document.getElementById("detailsModalBody"),A=document.getElementById("detailsModalCloseBtn"),T=document.getElementById("detailsModalOverlay"),P=()=>{M&&(M.innerHTML="",D.forEach(i=>{let t=0,n=0;i.items.forEach(a=>{const d=p.find(o=>o.id===a.serviceId);d&&(t+=d.priceMin*a.quantity,n+=d.priceMax*a.quantity)});const e=document.createElement("div");e.className="bundle-card reveal-item",e.innerHTML=`
        <div class="bundle-card-top">
          <span class="bundle-tag">${i.tag}</span>
          <span class="bundle-badge">${i.badge}</span>
        </div>
        <h3 class="bundle-card-title">${i.name}</h3>
        <p class="bundle-card-desc">${i.desc}</p>
        <div class="bundle-items-box">
          <div class="bundle-items-header">
            <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2.5" fill="none" style="color: var(--clr-teal);">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Package Includes:
          </div>
          <ul class="bundle-items-list">
            ${i.items.map(a=>{const d=p.find(o=>o.id===a.serviceId);return`
                <li class="bundle-item-entry">
                  <span class="bundle-item-name">${d?d.name:a.serviceId}</span>
                  <span class="bundle-item-qty">${a.quantity}x</span>
                </li>
              `}).join("")}
          </ul>
        </div>
        <div class="bundle-footer">
          <div class="bundle-price-block">
            <span class="bundle-price-label">Estimated Range</span>
            <span class="bundle-price-val">RM${t} - RM${n}</span>
          </div>
          <button class="btn-add-bundle" data-bundle-id="${i.id}">
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Add Bundle</span>
          </button>
        </div>
      `,M.appendChild(e)}),M.querySelectorAll(".btn-add-bundle").forEach(i=>{i.addEventListener("click",()=>{const t=i.getAttribute("data-bundle-id");H(t,i)})}))},H=(i,t)=>{const n=D.find(e=>e.id===i);if(n&&(n.items.forEach(e=>{const a=p.find(o=>o.id===e.serviceId);if(!a)return;const d=s.find(o=>o.id===e.serviceId);d?d.quantity+=e.quantity:s.push({...a,quantity:e.quantity})}),b(),g(),t)){const e=t.innerHTML;t.classList.add("added-success"),t.innerHTML=`
        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>Bundle Added!</span>
      `,setTimeout(()=>{t.classList.remove("added-success"),t.innerHTML=e},1800)}},V=(i,t=1)=>{const n=p.find(a=>a.id===i);if(!n)return;const e=s.find(a=>a.id===i);e?e.quantity+=t:s.push({...n,quantity:t}),b(),g()},v=(i,t)=>{if(t<=0){I(i);return}const n=s.find(e=>e.id===i);if(n)n.quantity=t;else{const e=p.find(a=>a.id===i);e&&s.push({...e,quantity:t})}b(),g()},I=i=>{const t=s.findIndex(n=>n.id===i);t>-1&&s.splice(t,1),b(),g()},g=()=>{l.innerHTML="";const i=p.filter(t=>{const n=E==="all"||t.category===E,e=t.name.toLowerCase().includes(C.toLowerCase())||t.desc.toLowerCase().includes(C.toLowerCase());return n&&e});if(i.length===0){l.innerHTML='<div class="cart-empty-message" style="grid-column: span 3; padding: 3rem 0; font-size: 1.1rem;">No services match your search query. Try another keyword!</div>';return}i.forEach(t=>{const n=s.find(a=>a.id===t.id),e=document.createElement("div");e.className="service-card-new reveal-item",e.innerHTML=`
        <span class="service-card-category">${t.category} // ${t.badge}</span>
        <h3 class="service-card-title">${t.name}</h3>
        <p class="service-card-desc">${t.desc}</p>
        <div class="service-card-price-range">
          <span class="label">ESTIMATED PRICE RANGE:</span>
          RM${t.priceMin} - RM${t.priceMax}
        </div>
        <div class="service-card-actions">
          <button class="btn-card-details" data-id="${t.id}">View Details</button>
          ${n?`
            <div class="card-qty-stepper">
              <button class="btn-card-qty btn-card-qty-minus" data-id="${t.id}" aria-label="Decrease quantity">−</button>
              <span class="card-qty-num">${n.quantity} in Cart</span>
              <button class="btn-card-qty btn-card-qty-plus" data-id="${t.id}" aria-label="Increase quantity">+</button>
            </div>
          `:`
            <button class="btn-card-add" data-id="${t.id}">Add to Cart</button>
          `}
        </div>
      `,l.appendChild(e)}),l.querySelectorAll(".btn-card-details").forEach(t=>{t.addEventListener("click",()=>{const n=t.getAttribute("data-id");F(n)})}),l.querySelectorAll(".btn-card-add").forEach(t=>{t.addEventListener("click",()=>{const n=t.getAttribute("data-id");V(n,1)})}),l.querySelectorAll(".btn-card-qty-minus").forEach(t=>{t.addEventListener("click",()=>{const n=t.getAttribute("data-id"),e=s.find(a=>a.id===n);e&&v(n,e.quantity-1)})}),l.querySelectorAll(".btn-card-qty-plus").forEach(t=>{t.addEventListener("click",()=>{const n=t.getAttribute("data-id"),e=s.find(a=>a.id===n);e&&v(n,e.quantity+1)})})},F=i=>{const t=p.find(d=>d.id===i);if(!t)return;const n=s.find(d=>d.id===t.id);let e=n?n.quantity:1;(()=>{u.innerHTML=`
        <span class="modal-category">${t.category} // ${t.badge}</span>
        <h2 class="modal-title">${t.name}</h2>
        <div class="modal-price-range">Estimated Price: RM${t.priceMin} - RM${t.priceMax} <span style="font-size: 0.85rem; color: var(--clr-text-muted); font-weight: 500;">/ unit</span></div>
        <p class="modal-desc">${t.desc}</p>
        
        <h4 class="modal-section-title">What this service covers:</h4>
        <ul class="modal-deliverables-list">
          ${t.deliverables.map(N=>`<li>${N}</li>`).join("")}
        </ul>

        <div class="modal-qty-container">
          <span class="modal-qty-label">Select Quantity / Units:</span>
          <div class="modal-qty-row">
            <div class="qty-stepper modal-stepper">
              <button class="btn-qty btn-modal-qty-minus" aria-label="Decrease quantity">−</button>
              <span class="qty-number" id="modalQtyDisplay">${e}</span>
              <button class="btn-qty btn-modal-qty-plus" aria-label="Increase quantity">+</button>
            </div>
            <div class="modal-calc-total">
              <span class="calc-label" id="modalCalcLabel">Estimated for ${e} ${e===1?"unit":"units"}:</span>
              <span class="calc-range" id="modalCalcRange">RM${t.priceMin*e} - RM${t.priceMax*e}</span>
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 0.8rem;">
          ${n?`
            <button class="btn-secondary btn-modal-remove" style="border: 1px solid rgba(254, 93, 38, 0.3); color: var(--clr-orange); justify-content: center; padding: 0.9rem 1.2rem;">
              Remove
            </button>
          `:""}
          <button class="btn-primary btn-modal-submit" style="flex: 1; border: none; justify-content: center; padding: 0.9rem 1.5rem;">
            ${n?`Update Cart (${e} ${e===1?"unit":"units"})`:`Add to Cart (${e} ${e===1?"unit":"units"})`}
          </button>
        </div>
      `;const d=u.querySelector(".btn-modal-qty-minus"),o=u.querySelector(".btn-modal-qty-plus"),h=u.querySelector("#modalQtyDisplay"),f=u.querySelector("#modalCalcLabel"),r=u.querySelector("#modalCalcRange"),c=u.querySelector(".btn-modal-submit"),k=u.querySelector(".btn-modal-remove");d.addEventListener("click",()=>{e>1&&(e--,h.textContent=e,f.textContent=`Estimated for ${e} ${e===1?"unit":"units"}:`,r.textContent=`RM${t.priceMin*e} - RM${t.priceMax*e}`,c.textContent=n?`Update Cart (${e} ${e===1?"unit":"units"})`:`Add to Cart (${e} ${e===1?"unit":"units"})`)}),o.addEventListener("click",()=>{e++,h.textContent=e,f.textContent=`Estimated for ${e} ${e===1?"unit":"units"}:`,r.textContent=`RM${t.priceMin*e} - RM${t.priceMax*e}`,c.textContent=n?`Update Cart (${e} ${e===1?"unit":"units"})`:`Add to Cart (${e} ${e===1?"unit":"units"})`}),c.addEventListener("click",()=>{v(t.id,e),q()}),k&&k.addEventListener("click",()=>{I(t.id),q()})})(),x.classList.add("active")},q=()=>{x&&x.classList.remove("active")};A&&A.addEventListener("click",q),T&&T.addEventListener("click",q);const b=()=>{if(y.innerHTML="",s.length===0){y.innerHTML='<div class="cart-empty-message">No items added yet. Click on services to build your quotation.</div>',R.textContent="RM0",B.textContent="RM0",w.textContent="RM0",m&&(m.style.display="none");return}m&&(m.style.display="inline-flex"),s.forEach(n=>{const e=document.createElement("div");e.className="cart-item-row",e.innerHTML=`
        <div class="cart-item-info">
          <div class="cart-item-name">${n.name}</div>
          <div class="cart-item-unit-price">RM${n.priceMin} - RM${n.priceMax} ea</div>
        </div>
        <div class="cart-item-controls">
          <div class="qty-stepper">
            <button class="btn-qty btn-cart-qty-minus" data-id="${n.id}" aria-label="Decrease quantity">−</button>
            <span class="qty-number">${n.quantity}</span>
            <button class="btn-qty btn-cart-qty-plus" data-id="${n.id}" aria-label="Increase quantity">+</button>
          </div>
          <div class="cart-item-total">RM${n.priceMin*n.quantity} - RM${n.priceMax*n.quantity}</div>
          <button class="btn-cart-remove" data-id="${n.id}" aria-label="Remove item">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      `,y.appendChild(e)}),y.querySelectorAll(".btn-cart-qty-minus").forEach(n=>{n.addEventListener("click",()=>{const e=n.getAttribute("data-id"),a=s.find(d=>d.id===e);a&&v(e,a.quantity-1)})}),y.querySelectorAll(".btn-cart-qty-plus").forEach(n=>{n.addEventListener("click",()=>{const e=n.getAttribute("data-id"),a=s.find(d=>d.id===e);a&&v(e,a.quantity+1)})}),y.querySelectorAll(".btn-cart-remove").forEach(n=>{n.addEventListener("click",()=>{const e=n.getAttribute("data-id");I(e)})});const i=s.reduce((n,e)=>n+e.priceMin*e.quantity,0),t=s.reduce((n,e)=>n+e.priceMax*e.quantity,0);R.textContent=`RM${i}`,B.textContent=`RM${t}`,w.textContent=`RM${i} - RM${t}`};m&&m.addEventListener("click",()=>{s.length!==0&&(s=[],b(),g())}),$&&$.querySelectorAll(".filter-pill").forEach(i=>{i.addEventListener("click",()=>{const t=$.querySelector(".filter-pill.active");t&&t.classList.remove("active"),i.classList.add("active"),E=i.getAttribute("data-category"),g()})}),L&&L.addEventListener("keyup",i=>{C=i.target.value,g()}),S&&S.addEventListener("click",()=>{if(s.length===0){alert("Please add at least one service to your selection before generating a quotation PDF.");return}const i=new Date,t=document.getElementById("printDate"),n=document.getElementById("printQuoteId"),e=document.getElementById("printTableBody");t&&(t.textContent=i.toLocaleDateString("en-MY",{year:"numeric",month:"long",day:"numeric"})),n&&(n.textContent=`EZQ-2026-${Math.floor(1e3+Math.random()*9e3)}`),e&&(e.innerHTML="",s.forEach(r=>{const c=document.createElement("tr");c.innerHTML=`
            <td>
              <div style="font-weight: 750;">${r.name}</div>
              <div style="font-size: 0.8rem; color: #555555; margin-top: 0.2rem;">${r.desc}</div>
            </td>
            <td>${r.category}</td>
            <td style="text-align: center; font-weight: 700;">${r.quantity}</td>
            <td style="text-align: right; color: #555555;">RM${r.priceMin} - RM${r.priceMax}</td>
            <td style="text-align: right; font-weight: 750;">RM${r.priceMin*r.quantity} - RM${r.priceMax*r.quantity}</td>
          `,e.appendChild(c)}));const a=s.reduce((r,c)=>r+c.priceMin*c.quantity,0),d=s.reduce((r,c)=>r+c.priceMax*c.quantity,0),o=document.getElementById("printTotalMin"),h=document.getElementById("printTotalMax"),f=document.getElementById("printTotalRange");o&&(o.textContent=`RM${a}`),h&&(h.textContent=`RM${d}`),f&&(f.textContent=`RM${a} - RM${d}`),window.print()}),P(),g()});
