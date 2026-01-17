import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
    const id = product.Id ?? product.id ?? "";
    const brand = product.Brand?.Name ?? product.Brand ?? product.brand ?? "Brand";
    const name = product.Name ?? product.name ?? "Product";
    const price = product.FinalPrice ?? product.Price ?? product.price ?? 0;

    const imgSrc =
        product.Image ??
        product.Images?.Primary ??
        product.ImageSrc ??
        product.image ??
        "";

    let image = imgSrc;
    if (image && !image.startsWith("/") && !image.startsWith("http")) {
        image = `/${image}`;
    }
    if (!image) {
        image = "/images/banner-sm.jpg";
    }

    return `
    <li class="product-card">
      <a href="product_pages/?product=${id}">
        <img src="${image}" alt="${name}" />
        <h3 class="card__brand">${brand}</h3>
        <h2 class="card__name">${name}</h2>
        <p class="product-card__price">$${price}</p>
      </a>
    </li>
  `;
}

export default class ProductList {
    constructor(category, dataSource, listElement) {
        this.category = category;
        this.dataSource = dataSource;
        this.listElement = listElement;
        this.list = [];
    }

    async init() {
        this.list = await this.dataSource.getData();
        this.renderList(this.list);
    }

    renderList(list) {
        renderListWithTemplate(
            productCardTemplate,
            this.listElement,
            list,
            "afterbegin",
            true
        );
    }
}