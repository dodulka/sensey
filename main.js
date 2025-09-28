const PRODUCTS = [
    {id:'p1', title:'Футболка', price:499, img:'images/futbolka.png', desc: 'Зручна бавовняна футболка, різні розміри.'},
    {id:'p2', title:'Худі', price:1299, img:'images/hudi.png', desc: 'Тепле худі з капюшоном, м\'яка підкладка.'},
    {id:'p3', title:'Штани', price:899, img:'images/shtany.png', desc: 'Комфортні штани для щоденного носіння.'},
    {id:'p4', title:'Кросівки', price:2499, img:'images/krosivky.png', desc: 'Легкі кросівки для спорту та міста.'},
    {id:'p5', title:'Кепка', price:399, img:'images/kepka.png', desc: 'Кепка з регулюванням, універсальний розмір.'},
    {id:'p6', title:'Куртка', price:1799, img:'images/kurtka.png', desc: 'Водостійка куртка з теплою підкладкою.'},
    {id:'p7', title:'Шкарпетки (набір)', price:199, img:'images/shkarpetky.png', desc: 'Набір з 3 пар — м\'які й дихаючі.'},
    {id:'p8', title:'Рюкзак', price:1499, img:'images/ryy.png', desc: 'Просторий рюкзак з багатьма відділеннями.'},
    {id:'p9', title:'Ремінь', price:349, img:'images/remin.png', desc: 'Шкіряний ремінь, класичний дизайн.'},
    {id:'p10', title:'Спортивний костюм', price:2299, img:'images/kostt.png', desc: 'Костюм для тренувань та прогулянок.'}
  ];
  
  function getCart(){ return JSON.parse(localStorage.getItem('cart') || '[]'); }
  function saveCart(c){ localStorage.setItem('cart', JSON.stringify(c)); updateCartUI(); }
  
  function addToCart(id){
    const cart = getCart();
    const it = cart.find(x=>x.id===id);
    if(it) it.qty++;
    else cart.push({id, qty:1});
    saveCart(cart);
    const drawer = document.getElementById('cartDrawer');
    if(drawer) drawer.classList.add('open');
  }
  
  function changeQty(id, delta){
    const cart = getCart();
    const it = cart.find(x=>x.id===id);
    if(!it) return;
    it.qty += delta;
    if(it.qty <= 0){
      const idx = cart.findIndex(x=>x.id===id);
      cart.splice(idx,1);
    }
    saveCart(cart);
  }
  
  function removeFromCart(id){
    const cart = getCart().filter(x=>x.id!==id);
    saveCart(cart);
  }
  
  function updateCartUI(){
    const c = getCart();
    const cartCount = document.getElementById('cartCount');
    if(cartCount) cartCount.textContent = c.reduce((s,i)=>s+i.qty,0);
  
    const body = document.getElementById('cartBody');
    const total = document.getElementById('cartTotal');
    if(!body) return;
  
    body.innerHTML = '';
    let sum = 0;
  
    if(c.length === 0){
      body.innerHTML = '<div class="empty-cart">Кошик порожній</div>';
    } else {
      c.forEach(item=>{
        const p = PRODUCTS.find(x=>x.id === item.id);
        if(!p) return;
        const line = document.createElement('div');
        line.className = 'cart-item';
        line.innerHTML = `
          <div class="ci-left">
            <img src="${p.img}" alt="${p.title}">
          </div>
          <div class="ci-mid">
            <div class="ci-title">${p.title}</div>
            <div class="ci-price">${p.price} ₴</div>
          </div>
          <div class="ci-right">
            <button class="qty-dec">−</button>
            <span class="qty">${item.qty}</span>
            <button class="qty-inc">+</button>
            <button class="qty-rm" title="Видалити">✖</button>
          </div>
        `;

        line.querySelector('.qty-inc').addEventListener('click', ()=> changeQty(item.id, +1));
        line.querySelector('.qty-dec').addEventListener('click', ()=> changeQty(item.id, -1));
        line.querySelector('.qty-rm').addEventListener('click', ()=> removeFromCart(item.id));
  
        body.appendChild(line);
        sum += p.price * item.qty;
      });
    }
  
    if(total) total.textContent = sum + ' ₴';
  }
  

  function renderProducts(filter=''){
    const box = document.getElementById('products');
    if(!box) return;
    box.innerHTML = '';
    const list = PRODUCTS.filter(p => p.title.toLowerCase().includes(filter.toLowerCase()));
    list.forEach(p=>{
      const div = document.createElement('div');
      div.className = 'card';
      div.innerHTML = `
        <img src="${p.img}" alt="${p.title}">
        <h4>${p.title}</h4>
        <p class="price">${p.price} ₴</p>
        <div class="card-actions">
          <button class="buy-btn">Купити</button>
        </div>
      `;

      div.querySelector('.buy-btn').addEventListener('click', (e)=>{
        e.stopPropagation();
        addToCart(p.id);
      });

      div.addEventListener('click', ()=> showProduct(p.id));
      box.appendChild(div);
    });
  }
  

  function showProduct(id){
    const p = PRODUCTS.find(x=>x.id===id);
    if(!p) return;
    document.getElementById('modalImg').src = p.img;
    document.getElementById('modalTitle').textContent = p.title;
    document.getElementById('modalDesc').textContent = p.desc || '';
    document.getElementById('modalPrice').textContent = p.price + ' ₴';
    document.getElementById('modalBuy').onclick = ()=> { addToCart(p.id); closeModal(); };
    document.getElementById('productModal').style.display = 'flex';
    document.getElementById('productModal').setAttribute('aria-hidden','false');
  }
  function closeModal(){
    const m = document.getElementById('productModal');
    if(m){ m.style.display = 'none'; m.setAttribute('aria-hidden','true'); }
  }
  

  function register(e){
    e.preventDefault();
    let users = JSON.parse(localStorage.getItem('users')||'[]');
    let email = document.getElementById('regEmail').value;
    let pass = document.getElementById('regPass').value;
    let name = document.getElementById('regName').value;
    if(users.find(u=>u.email===email)){ alert('Такий користувач вже є'); return; }
    users.push({email,pass,name});
    localStorage.setItem('users', JSON.stringify(users));
    alert('Реєстрація успішна');
    window.location='auth.html';
  }
  
  function login(e){
    e.preventDefault();
    let users = JSON.parse(localStorage.getItem('users')||'[]');
    let email = document.getElementById('loginEmail') ? document.getElementById('loginEmail').value : '';
    let pass = document.getElementById('loginPass') ? document.getElementById('loginPass').value : '';
    let u = users.find(x=>x.email===email && x.pass===pass);
    if(u){
      localStorage.setItem('currentUser', JSON.stringify(u));
      alert('Вхід успішний');
      window.location='index.html';
    } else alert('Невірний логін або пароль');
  }
  

  document.addEventListener('DOMContentLoaded', ()=> {
    renderProducts();
    updateCartUI();
  

    const cartBtn = document.getElementById('cartBtn');
    const drawer = document.getElementById('cartDrawer');
    const closeCart = document.getElementById('closeCart');
    if(cartBtn) cartBtn.addEventListener('click', ()=> drawer.classList.add('open'));
    if(closeCart) closeCart.addEventListener('click', ()=> drawer.classList.remove('open'));
  

    const searchInput = document.getElementById('searchInput');
    if(searchInput) searchInput.addEventListener('input', ()=> renderProducts(searchInput.value));
  

    const checkoutBtn = document.getElementById('checkoutBtn');
    if(checkoutBtn) checkoutBtn.addEventListener('click', ()=> {
      if(getCart().length === 0){ alert('Кошик порожній'); return; }
      window.location = 'checkout.html';
    });

    const closeModalBtn = document.getElementById('closeModal');
    if(closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    if(modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  

    const modal = document.getElementById('productModal');
    if(modal) modal.addEventListener('click', (e)=> { if(e.target === modal) closeModal(); });
  });
  