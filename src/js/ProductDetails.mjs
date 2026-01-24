import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {
    constructor(productId, dataSource) {
        this.productId = productId;
        this.product = null;
        this.dataSource = dataSource;
    }

    async init() {
        this.product = await this.dataSource.findProductById(this.productId);
        this.renderProductDetails();

        const btn = document.getElementById("addToCart");
        if (btn) btn.addEventListener("click", this.addProductToCart.bind(this));
    }

    getImageUrl(p) {
        return (
            p?.Images?.PrimaryLarge ||
            p?.Images?.PrimaryMedium ||
            p?.Images?.PrimaryExtraLarge ||
            ""
        );
    }

    renderProductDetails() {
        const p = this.product;

        document.querySelector(".product-brand").textContent = p?.Brand?.Name ?? "";
        document.querySelector(".product-name").textContent =
            p?.NameWithoutBrand ?? p?.Name ?? "";

        document.querySelector(".product-card__price").textContent = `$${Number(
            p?.FinalPrice ?? 0
        ).toFixed(2)}`;

        const colorName = p?.Colors?.[0]?.ColorName ?? "";
        document.querySelector(".product__color").textContent = colorName
            ? `Color: ${colorName}`
            : "";

        const desc = p?.DescriptionHtmlSimple
            ? p.DescriptionHtmlSimple.replace(/<[^>]*>/g, "")
            : p?.Description ?? "";
        document.querySelector(".product__description").textContent = desc;

        const imgEl = document.querySelector(".product-image");
        imgEl.src = this.getImageUrl(p);
        imgEl.alt = p?.NameWithoutBrand ?? p?.Name ?? "Product image";
    }

    addProductToCart() {
        if (!this.product?.Id) return;

        const cartItems = getLocalStorage("so-cart") || [];

        const existingItem = cartItems.find((item) => item.Id === this.product.Id);

        if (existingItem) {
            existingItem.qty = (existingItem.qty || 1) + 1;
        } else {
            cartItems.push({ ...this.product, qty: 1 });
        }

        setLocalStorage("so-cart", cartItems);
    }
}