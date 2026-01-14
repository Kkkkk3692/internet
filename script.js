// Конфигурация Firebase
const firebaseConfig = {
    apiKey: "ТВОЙ_API_KEY",
    projectId: "ТВОЙ_PROJECT_ID",
    appId: "ТВОЙ_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function showPage(page) {
    const app = document.getElementById('app');
    app.innerHTML = "";

    if (page === 'catalog') {
        db.collection("products").onSnapshot((snapshot) => {
            app.innerHTML = "";
            snapshot.forEach(doc => {
                const p = doc.data();
                app.innerHTML += `
                    <div class="card">
                        <img src="${p.img}">
                        <div class="card-body">
                            <h3>${p.name}</h3>
                            <p class="price">${p.price} ₽</p>
                            <button class="btn main-btn" onclick="addToCart('${p.name}', ${p.price})">Купить</button>
                        </div>
                    </div>`;
            });
        });
    } else if (page === 'profile') {
        app.innerHTML = `
            <div class="card-body">
                <h2>Личный кабинет</h2>
                <button class="btn main-btn" onclick="openModal()">➕ Выставить свой товар</button>
                <button class="btn" onclick="alert('Выход...')">Выйти</button>
            </div>`;
    } else if (page === 'cart') {
        let total = cart.reduce((s, i) => s + i.price, 0);
        app.innerHTML = `<div class="card-body"><h2>Корзина</h2>
            ${cart.map((i, idx) => `<p>${i.name} - ${i.price}₽ <span onclick="removeItem(${idx})">❌</span></p>`).join('')}
            <hr><h3>Итого: ${total} ₽</h3>
            <button class="btn main-btn" onclick="pay()">Оплатить сейчас</button>
        </div>`;
    }
}

// Функции
function addToCart(name, price) {
    cart.push({name, price});
    updateCart();
}

function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    document.getElementById('cartCount').innerText = cart.length;
}

function openModal() { document.getElementById('modal').style.display = 'block'; }
function closeModal() { document.getElementById('modal').style.display = 'none'; }

function saveProduct() {
    const name = document.getElementById('pName').value;
    const price = Number(document.getElementById('pPrice').value);
    const img = document.getElementById('pImg').value;

    db.collection("products").add({ name, price, img, date: new Date() })
    .then(() => { closeModal(); showPage('catalog'); });
}

function pay() {
    if(cart.length === 0) return alert("Корзина пуста");
    alert("Оплата прошла! Ваш заказ принят.");
    cart = [];
    updateCart();
    showPage('catalog');
}

// Поиск
function searchProduct() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const text = card.querySelector('h3').innerText.toLowerCase();
        card.style.display = text.includes(query) ? 'block' : 'none';
    });
}

// Старт
showPage('catalog');
updateCart();
