const API_URL = 'api/products.php';

const state = {
  gender: 'вся',
  type:   'вся',
  brand:  '',
  sort:   'price_desc'   
};
const catalog = document.getElementById('catalog');


async function loadProducts() {
  const params = new URLSearchParams(state);

  try {
    const res = await fetch(`${API_URL}?${params.toString()}`);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const products = await res.json();

    if (products.error) throw new Error(products.error);
    renderProducts(products);
  } catch (err) {
    console.error(err);
    catalog.innerHTML = '<p class="error">Не удалось загрузить каталог</p>';
  }
}


function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, s => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[s]));
}

function renderProducts(products) {
  if (!products.length) {
    catalog.innerHTML = '<p class="empty">Ничего не найдено</p>';
    return;
  }


  const rows = chunk(products, 3);

  catalog.innerHTML = rows.map(row => `
    <div class="flex__catalog">
      ${row.map(p => `
        <div class="card__product" data-id="${p.id}">
          <div class="card__img">
            <img src="img/${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}">
          </div>
          <div class="card__info">
            <div class="name"><p>${escapeHtml(p.name)}</p></div>
            <div class="price"><p>Цена: ${p.price} руб</p></div>
          </div>
        </div>
      `).join('')}
    </div>
  `).join('');


  catalog.querySelectorAll('.card__product').forEach(card => {
    card.addEventListener('click', () => openPopup(card));
  });
}


document.querySelectorAll('.dropdown-content a').forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    const dropdown = item.closest('.dropdown');
    const btn = dropdown.querySelector('.dropbtn');
    btn.textContent = item.textContent;

    const value = item.getAttribute('data-value');

    if (dropdown.classList.contains('filter-gender')) state.gender = value.toLowerCase();
    if (dropdown.classList.contains('filter-type'))   state.type   = value.toLowerCase();
    if (dropdown.classList.contains('filter-sort'))   state.sort   = value;

    loadProducts();
  });
});


const brandLinks = document.querySelectorAll('.brend__container a');

brandLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const clickedBrand = link.getAttribute('data-brand');


    state.brand = (state.brand === clickedBrand) ? '' : clickedBrand;

    brandLinks.forEach(l => {
      const div = l.querySelector('.card-brend');
      const isActive = state.brand !== '' && l.getAttribute('data-brand') === state.brand;
      div.classList.toggle('selected', isActive);
    });

    loadProducts();
  });
});


const popup      = document.getElementById('popup');
const popupImg   = document.getElementById('popup-img');
const popupName  = document.getElementById('popup-name');
const popupPrice = document.getElementById('popup-price');
const popupClose = document.getElementById('popup-close');

function openPopup(card) {
  const img   = card.querySelector('.card__img img');
  const name  = card.querySelector('.name p');
  const price = card.querySelector('.price p');

  popupImg.src     = img.src;
  popupImg.alt     = img.alt || '';
  popupName.textContent  = name.textContent;
  popupPrice.textContent = price.textContent;

  popup.style.display = 'flex';
}

popupClose.addEventListener('click', () => popup.style.display = 'none');
popup.addEventListener('click', e => {
  if (e.target === popup) popup.style.display = 'none';
});


loadProducts();