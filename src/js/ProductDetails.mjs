import { setLocalStorage, getLocalStorage } from "./utils.mjs";

export default class ProductDetails {
    constructor(productId, dataSource) {
        this.productId = productId;
        this.product = {};
        this.dataSource = dataSource;
    }

    async init() {

        this.product = await this.dataSource.findProductById(this.productId);


        this.renderProductDetails();


        document
            .getElementById("addToCart")
            .addEventListener("click", this.addProductToCart.bind(this));
    }

    addProductToCart() {

        const cart = getLocalStorage("so-cart") || [];


        cart.push(this.product);


        setLocalStorage("so-cart", cart);
    }

    renderProductDetails() {

        document.querySelector(".divider h2").textContent = this.product.Brand;
        document.querySelector(".divider h1").textContent = this.product.Name;

        document.querySelector(".product-image img").src = this.product.Image;
        document.querySelector(".product-image img").alt = this.product.Name;

        document.querySelector(".product-price").textContent = `$${this.product.FinalPrice}`;
        document.querySelector(".product-color").textContent = this.product.Colors?.join(", ") || "";
        document.querySelector(".product-description").textContent = this.product.Description;
    }
}