const nameInput = document.getElementById("ad");
const modelInput = document.getElementById("model");
const priceInput = document.getElementById("fiyat");
const form = document.getElementById("form");
const bttn = document.getElementById("btn");
const wrapper = document.querySelector(".wrapper");
const info = document.querySelector(".info");
const search = document.getElementById("arama");
let alert = document.getElementById("alertID");

eventListener();

function eventListener() {
    form.addEventListener('submit', addProductToUI);
    document.addEventListener("DOMContentLoaded", function () {
        let products = Storage.getProductsFromStorage();
        UI.storageProductsToUI(products);
    });
    info.addEventListener('click', deleteProduct);
    search.addEventListener('keyup', filterProducts);
}

// Constructor

class Urunler {
    constructor(productName, productModel, productPrice) {
        this.productName = productName;
        this.productModel = productModel;
        this.productPrice = productPrice;
    }
}

function addProductToUI(e) {
    const productName = nameInput.value.trim();
    const productModel = modelInput.value.trim();
    const productPrice = priceInput.value.trim();
    const urunlerim = new Urunler(productName, productModel, productPrice);
    if (productModel == "" || productName == "" || productPrice == "") {
        UI.showAlert("danger", "Hatalı Giriş")
    } else {
        let control = false;
        const products = Storage.getProductsFromStorage();
        products.forEach(function (product) {
            if (productName === product.productName) {
                control = true;
            }
        });

        if (control === false) {
            UI.urunEkle(urunlerim);
            Storage.addProductsToStorage(urunlerim);
            UI.showAlert("success", "Başarılı Giriş");
            nameInput.value = "";
            modelInput.value = "";
            priceInput.value = "";

        } else {
            UI.showAlert("danger", "Aynı Marka Girilemez");
        }
    }
    e.preventDefault();
}

class UI {
    static urunEkle(urunlerim) {
        const info = document.querySelector(".info");
        const infoWrapper = document.createElement("div");
        infoWrapper.className = "info-details";
        infoWrapper.innerHTML += `
       <p class="info-marka">${urunlerim.productName}</p>
       <p class="info-model">${urunlerim.productModel}</</p>
       <p class="info-price">${urunlerim.productPrice}</</p>
       <p class="trash-btn" id="trash"><i class="fas fa-trash-alt"></i></p>
       `;
        info.appendChild(infoWrapper);
    }

    static showAlert(type, message) {
        if (alert == null) {
            alert = document.createElement("div");
            alert.className = `alert alert-${type}`;
            alert.textContent = `${message}`;
            alert.id = "alertID";
            wrapper.appendChild(alert);
        } else {
            alert.className = `alert alert-${type}`;
            alert.textContent = `${message}`;
            document.getElementById("alertID").style.display = 'block';
        }
        setTimeout(function () {
            document.getElementById("alertID").style.display = 'none';
        }, 1800)
    }

    static storageProductsToUI(products) {
        products.forEach(function (product) {
            const info = document.querySelector(".info");
            const infoWrapper = document.createElement("div");
            infoWrapper.className = "info-details";
            infoWrapper.innerHTML += `
            <p class="info-marka">${product.productName}</p>
            <p class="info-model">${product.productModel}</</p>
            <p class="info-price">${product.productPrice}</</p>
            <p class="trash-btn" id="trash"><i class="fas fa-trash-alt"></i></p>
            `;
            info.appendChild(infoWrapper);
        });
    }


    static removeBtn(element) {
        element.parentElement.remove();
    }
    static removeBtn2(element) {
        element.parentElement.parentElement.remove();
    }
}

function deleteProduct(e) {
    if (e.target.className === "trash-btn") {
        UI.removeBtn(e.target);
        UI.showAlert("success", "Silme Başarılı");
        Storage.deleteProductFromStorage(e.target.previousElementSibling.previousElementSibling.previousElementSibling.textContent);
    } else if (e.target.className === "fas fa-trash-alt") {
        UI.removeBtn2(e.target);
    }
}


class Storage {
    static addProductsToStorage(urunlerim) {
        let products = Storage.getProductsFromStorage();
        products.push(urunlerim);

        localStorage.setItem("products", JSON.stringify(products))
    }

    static getProductsFromStorage() {
        let products;
        if (localStorage.getItem("products") === null) {
            products = [];
        } else {
            products = JSON.parse(localStorage.getItem("products"));
        }
        return products;
    }

    static deleteProductFromStorage(productName) {
        let products = this.getProductsFromStorage();

        products.forEach(function (product, index) {
            if (product.productName === productName) {
                products.splice(index, 1);
            }
        });

        localStorage.setItem("products", JSON.stringify(products));
    }
}

function filterProducts(e) {
    const filterValue = e.target.value.toLowerCase();
    const products = document.querySelectorAll(".info-details");
    products.forEach(function (product) {
        const text = product.textContent.toLowerCase();
        if (text.indexOf(filterValue) === -1) {
            product.setAttribute("style", "display:none !important");
        } else {
            product.setAttribute("style", "display:flex");
        }
    })
}