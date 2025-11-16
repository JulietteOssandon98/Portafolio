const PRODUCTS = {
        cadenas: [
          {id:1, name: 'Cadena Clara', price: 24900, img: 'assets/image1.jpg'},
          {id:2, name: 'Cadena Oro Rosa', price: 39900, img: 'assets/image2.jpg'},
          {id:3, name: 'Cadena Vintage', price: 31900, img: 'assets/image3.jpg'}
        ],
        pulseras: [
          {id:4, name: 'Pulsera Trenzada', price: 19900, img: 'assets/image4.jpg'},
          {id:5, name: 'Pulsera Minimal', price: 14900, img: 'assets/image5.jpg'}
        ],
        colgantes: [
          {id:6, name: 'Colgante Corazón', price: 12900, img: 'assets/image6.jpg'}
        ],
        anillos: [
          {id:7, name: 'Anillo Fino', price: 9900, img: 'assets/image5.jpg'}
        ],
        aros: [
          {id:8, name: 'Aros Largos', price: 17900, img: 'assets/image6.jpg'}
        ],
        conjuntos: [
          {id:9, name: 'Set Classic', price: 59900, img: 'assets/image4.jpg'}
        ]
      };

      // CART state
      let cart = [];

      // Helpers
      const formatCLP = v => v.toLocaleString('es-CL', {style:'currency', currency:'CLP'});

      // Render carousel for a category
      function renderCategory(category){
        const list = PRODUCTS[category] || [];
        document.getElementById('categoryTitle').textContent = capitalize(category);

        if(list.length === 0){
          document.getElementById('productCarouselWrapper').innerHTML = '<p class="text-muted">No hay productos en esta categoría.</p>';
          return;
        }

        // Build carousel markup
        const id = 'carousel' + category;
        let indicators = '';
        let inner = '';

        list.forEach((p, i)=>{
          indicators += `<button type="button" data-bs-target="#${id}" data-bs-slide-to="${i}" ${i===0? 'class="active" aria-current="true"': ''} aria-label="Slide ${i+1}"></button>`;

          inner += `
            <div class="carousel-item ${i===0? 'active' : ''}">
              <div class="row gx-3 justify-content-center">
                <div class="col-12 col-md-6 col-lg-4">
                  <div class="card product-card p-3">
                    <img src="${p.img}" class="product-img mb-3" alt="${escapeHtml(p.name)}">
                    <div class="card-body p-0">
                      <h5 class="card-title mb-1">${escapeHtml(p.name)}</h5>
                      <p class="mb-2 text-muted">${formatCLP(p.price)}</p>
                      <div class="d-flex gap-2">
                        <button class="btn btn-sm btn-outline-primary add-to-cart" data-id="${p.id}">Agregar</button>
                        <button class="btn btn-sm btn-light">Ver</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          `;
        });

        const carouselHTML = `
          <div id="${id}" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-indicators mb-3">
              ${indicators}
            </div>
            <div class="carousel-inner">
              ${inner}
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#${id}" data-bs-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Anterior</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#${id}" data-bs-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Siguiente</span>
            </button>
          </div>
        `;

        document.getElementById('productCarouselWrapper').innerHTML = carouselHTML;

        // Attach add-to-cart handlers
        document.querySelectorAll('.add-to-cart').forEach(btn=>{
          btn.addEventListener('click', e=>{
            const id = Number(e.currentTarget.dataset.id);
            addToCart(id);
          });
        });
      }

      // Escaping helper
      function escapeHtml(unsafe){
        return unsafe.replace(/[&<>"']/g, function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#039;"}[m];});
      }

      function capitalize(s){return s.charAt(0).toUpperCase() + s.slice(1)}

      // Find product by id across categories
      function findProductById(id){
        for(const key in PRODUCTS){
          const found = PRODUCTS[key].find(p=>p.id === id);
          if(found) return found;
        }
        return null;
      }

      // Cart functions
      function addToCart(id){
        const prod = findProductById(id);
        if(!prod) return;

        const existing = cart.find(c=>c.id===id);
        if(existing) existing.qty++;
        else cart.push({id:prod.id, name:prod.name, price:prod.price, qty:1});

        renderCart();
      }

      function removeFromCart(id){
        cart = cart.filter(c=>c.id !== id);
        renderCart();
      }

      function clearCart(){
        cart = [];
        renderCart();
      }

      function renderCart(){
        const container = document.getElementById('cartItems');
        const count = cart.reduce((s,i)=>s+i.qty,0);
        document.getElementById('cartCount').textContent = count;

        if(cart.length === 0){
          container.innerHTML = '<p class="text-muted">Carrito vacío — añade productos.</p>';
          document.getElementById('cartTotal').textContent = formatCLP(0);
          return;
        }

        container.innerHTML = '';
        cart.forEach(item=>{
          const div = document.createElement('div');
          div.className = 'd-flex align-items-center justify-content-between mb-2';
          div.innerHTML = `<div><strong>${escapeHtml(item.name)}</strong><div class="text-muted small">Cantidad: ${item.qty}</div></div><div class="text-end"><div>${formatCLP(item.price * item.qty)}</div><button class="btn btn-sm btn-link text-danger remove-item" data-id="${item.id}">Quitar</button></div>`;
          container.appendChild(div);
        });

        document.querySelectorAll('.remove-item').forEach(btn=>btn.addEventListener('click', e=>{
          removeFromCart(Number(e.currentTarget.dataset.id));
        }));

        const total = cart.reduce((s,i)=>s + i.price * i.qty, 0);
        document.getElementById('cartTotal').textContent = formatCLP(total);
      }

      // Events: category click
      document.getElementById('categoryList').addEventListener('click', e=>{
        const btn = e.target.closest('button');
        if(!btn) return;
        [...document.querySelectorAll('#categoryList .nav-link')].forEach(n=>n.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.category;
        renderCategory(cat);
      });

      // Clear cart
      document.getElementById('clearCartBtn').addEventListener('click', clearCart);

      // Checkout (demo)
      document.getElementById('checkoutBtn').addEventListener('click', ()=>{
        if(cart.length === 0){
          alert('Tu carrito está vacío.');
          return;
        }
        alert('Simulación de pago: Gracias por tu compra!');
        clearCart();
        const off = bootstrap.Offcanvas.getInstance(document.getElementById('cartCanvas'));
        off.hide();
      });

      // Initialize
      renderCategory('cadenas');
      renderCart();

function renderCarousel(products, category) {
  const wrapper = document.getElementById("productCarouselWrapper");
  wrapper.innerHTML = ""; // Limpia contenido previo

  let carouselHTML = `
    <div id="productCarousel" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-inner">
  `;

  // Agrupar productos de a 3
  for (let i = 0; i < products.length; i += 3) {
    carouselHTML += `
      <div class="carousel-item ${i === 0 ? "active" : ""}">
        <div class="row">
    `;

    for (let j = i; j < i + 3 && j < products.length; j++) {
      carouselHTML += `
        <div class="col-md-4">
          <div class="card">
            <img src="${products[j].image}" class="card-img-top" alt="${products[j].name}">
            <div class="card-body">
              <h5 class="card-title">${products[j].name}</h5>
              <p class="card-text">${products[j].price}</p>
            </div>
          </div>
        </div>
      `;
    }

    carouselHTML += `
        </div>
      </div>
    `;
  }

  carouselHTML += `
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#productCarousel" data-bs-slide="prev">
        <span class="carousel-control-prev-icon"></span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#productCarousel" data-bs-slide="next">
        <span class="carousel-control-next-icon"></span>
      </button>
    </div>
  `;

  wrapper.innerHTML = carouselHTML;
}

// Ejemplo de products:
const cadenas = [
  { name: "Cadena 1", price: "$10.000", image: "assets/image1.jpg" },
  { name: "Cadena 2", price: "$12.000", image: "assets/image2.jpg" },
  { name: "Cadena 3", price: "$15.000", image: "assets/image3.jpg" },
  { name: "Cadena 4", price: "$18.000", image: "assets/image4.jpg" },
  { name: "Cadena 5", price: "$20.000", image: "assets/image5.jpg" },
  { name: "Cadena 6", price: "$22.000", image: "assets/image6.jpg" }
];

document.getElementById("categoryTitle").textContent = "Cadenas";
renderCarousel(cadenas);
