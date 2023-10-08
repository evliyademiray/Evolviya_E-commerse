//!HTML'den gelenler
const categoryList = document.querySelector(".categories");
const productList = document.querySelector(".products");
const basketBtn = document.querySelector("#basket-btn");
const closeBtn = document.querySelector("#close-btn");
const modal = document.querySelector(".modal-wrapper");
const basketList = document.querySelector("#list");
const totalInfo = document.querySelector("#total");

//!Olay İzleyicileri
//HTMLnin yüklenme anın izler
document.addEventListener("DOMContentLoaded", () => {
  fetchCategories();
  fetchProducts();
});

/*
Kategori bilgilerini alma
1-API'ye istek at
2-Gelen veriyi işle
3-Verileri ekrana basacak fonksiyonu çalıştır
4-Hata oluşursa kullanıcıyı bilgilendir
*/
const baseUrl = "https://fakestoreapi.com";
function fetchCategories() {
  fetch(`${baseUrl}/products/categories`)
    .then((response) => response.json())
    .then(renderCategories);
  // .catch((err) => alert("Kategorileri alırken hata oluştu"));
}
//Her bir kategori için ekranakart oluşturur
function renderCategories(categories) {
  // console.log(categories);
  categories.forEach((category) => {
    //1 - Div oluştur
    const categoryDiv = document.createElement("div");
    //2- Div'e class ekleme
    categoryDiv.classList.add("category");
    //3- İçeriğini belirleme
    const randomNum = Math.round(Math.random() * 1000);
    categoryDiv.innerHTML = `
        <img src="https://picsum.photos/640/640?r=${randomNum}">
        <h2>${category}</h2>
        `;
    //4 - HTML'e gönderme
    categoryList.appendChild(categoryDiv);
  });
}
//data değişkenini global scope da tanımladık
//bu sayede bütün fonksiyonlar bu değere erişebilecek
let data;
//Ürünler verisini çeken fonksiyon
async function fetchProducts() {
  try {
    //API'ya istek at
    const response = await fetch(`${baseUrl}/products`);
    //Gelen cevabı işle
    data = await response.json();
    //Ekrana bas
    renderProducts(data);
    // console.log(data);
  } catch (err) {
    // alert("Ürünleri alırken hata oluştu");
  }
}
//Ürünleri ekrana basar
function renderProducts(products) {
  //Her bir ürün için bir ürün kartı oluşturma

  const cartsHTML = products
    .map(
      (product) =>
        `
   <div class="card">
   <div class="img-wrapper">
  <img src="${product.image}">
  </div>
  <h4>${product.title}</h4>
  <h4>${product.category}</h4>
  <div class="info">
      <span>${product.price}$</span>
      <button onclick="addToBasket(${product.id})">Sepete Ekle</button>
  </div>
</div>
`
    )
    .join(" ");
  //Hazırladığımız htmlyi ekrana basma
  productList.innerHTML = cartsHTML;
}
//!Sepet işlemleri
let basket = [];
let total = 0;

//modalı açar
basketBtn.addEventListener("click", () => {
  modal.classList.add("active");
  renderBasket();
});
//dışarıya veya çarpıya tıkladığında modalı kapatır
document.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("modal-wrapper") ||
    e.target.id === "close-btn"
  ) {
    modal.classList.remove("active");
  }
});
function addToBasket(id) {
  //id'sinden yola cıkarak objenin değerlerini bulma
  const product = data.find((i) => i.id === id);
  //Sepete ürün önce eklendiyse bulma
  const found = basket.find((i) => i.id == id);
  if (found) {
    //miktar arttır
    found.amount++;
  } else {
    //sepete ürünü ekler
    basket.push({ ...product, amount: 1 });
  }
  //bildirim verme
  Toastify({
    text: "Ürünü sepete ekledin :)",
    duration: 3500,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "linear-gradient(#ffdee9 , #b5fffc 100%);",
    },
    onClick: function(){} // Callback after click
  }).showToast();
}
//sepete elemanları listeleme
function renderBasket() {
  basketList.innerHTML = basket
    .map(
      (item) => `
                <div class="item">
                    <img src="${item.image}">
                    <h3 class="title">${item.title.slice(0, 20) + "..."}</h3>
                    <h4 class="price">$${item.price}</h4>
                    <p>miktar:${item.amount}</p>
                    <img onclick="handleDelete(${item.id})" id="delete-img" src="/images/trash.png">
                </div>
`
    )
    .join(" ");
  calculateTotal();
}
//toplam ürün sayı ve fiyatını hesaplar
function calculateTotal() {
  //reduce > diziyi döner ve elemanların belirlediğimiz
  //değerlerini toplar
  const total = basket.reduce(
    (sum, i) => sum + i.price * i.amount,
     0
     );
    // toplam miktar hesaplama

    const amount = basket.reduce((sum,i)=> sum + i.amount,0)

    //Hesapladığımız bilgileri ekrana basma
     totalInfo.innerHTML=`
     <span id="count">${amount} Ürün</span>
     Toplam:
     <span id="price">${total.toFixed(2)}</span>$
     `
}
//Elemanı siler
function handleDelete(deleteId){
  //kaldırılacak ürünü diziden çıkarma
  basket = basket.filter((i)=> i.id !== deleteId)
  //listeyi günceller
  renderBasket();
  //toplamı günceller
  calculateTotal();
}
