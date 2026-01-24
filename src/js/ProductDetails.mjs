export default class ProductDetails {
    constructor(productId, dataSource) {
        this.productId = productId;
        this.product = null;
        this.dataSource = dataSource;
    }

    async init() {
        this.product = await this.dataSource.findProductById(this.productId);
        this.renderProductDetails();
        document
            .getElementById("addToCart")
            .addEventListener("click", this.addToCart.bind(this));
    }

    normalizeImagePath(image) {
        if (!image) return "";
        if (image.startsWith("http")) return image;
        if (image.startsWith("/")) return image;
        return `/${image}`;
    }

    renderProductDetails() {
        const image = this.normalizeImagePath(this.product.Image);

        document.querySelector(".product-brand").textContent = this.product.Brand?.Name ?? "";
        document.querySelector(".product-name").textContent = this.product.Name ?? "";
        document.querySelector(".product-card__price").textContent = `$${Number(this.product.FinalPrice).toFixed(2)}`;

        const colorName = this.product.Colors?.[0]?.ColorName ?? "";
        document.querySelector(".product__color").textContent = colorName ? `Color: ${colorName}` : "";

        document.querySelector(".product__description").textContent = this.product.Description ?? "";

        const imgEl = document.querySelector(".product-image");
        imgEl.src = image;
        imgEl.alt = this.product.Name ?? "Product image";
    }

    addToCart() {
        const event = new CustomEvent("addToCart", { detail: this.product });
        window.dispatchEvent(event);
    }
}