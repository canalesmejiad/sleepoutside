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
        document.querySelector(".product-brand").textContent = this.product.Brand;
        document.querySelector(".product-name").textContent = this.product.Name;

        const img = document.querySelector(".product-image");
        img.src = this.product.Image;
        img.alt = this.product.Name;

        document.querySelector(".product-card__price").textContent = `$${this.product.FinalPrice}`;

        const colors = Array.isArray(this.product.Colors)
            ? this.product.Colors.join(", ")
            : this.product.Colors || "";
        document.querySelector(".product__color").textContent = colors;

        document.querySelector(".product__description").textContent = this.product.Description;

        const btn = document.getElementById("addToCart");
        btn.dataset.id = this.product.Id;
    }
}