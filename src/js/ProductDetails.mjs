const baseURL = import.meta.env.VITE_SERVER_URL;

function getImageUrl(image) {
    if (!image) return "";
    if (image.startsWith("http")) return image;
    if (image.startsWith("/")) return `${baseURL}${image.slice(1)}`;
    return `${baseURL}${image}`;
}

export default class ProductDetails {
    constructor(productId, dataSource) {
        this.productId = productId;
        this.product = null;
        this.dataSource = dataSource;
    }

    async init() {
        this.product = await this.dataSource.findProductById(this.productId);
        this.renderProductDetails();
    }

    renderProductDetails() {
        if (!this.product) return;

        const brandEl = document.querySelector(".product-brand");
        const nameEl = document.querySelector(".product-name");
        const imgEl = document.querySelector(".product-image");
        const priceEl = document.querySelector(".product-card__price");
        const colorEl = document.querySelector(".product__color");
        const descEl = document.querySelector(".product__description");

        brandEl.textContent = this.product.Brand?.Name ?? "";
        nameEl.textContent = this.product.Name ?? "";

        imgEl.src = getImageUrl(this.product.Image);
        imgEl.alt = this.product.Name ?? "Product image";

        const finalPrice = Number(this.product.FinalPrice);
        priceEl.textContent = Number.isFinite(finalPrice) ? `$${finalPrice.toFixed(2)}` : "";

        const firstColor = this.product.Colors?.[0]?.ColorName ?? "";
        colorEl.textContent = firstColor ? `Color: ${firstColor}` : "";

        descEl.textContent = this.product.Description ?? "";
    }
}