import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
    const image = product.Image?.startsWith("/") ? product.Image : `/${product.Image}`;

    return `
    <li class="product-card">
      <a href="product_pages/?product=${product.Id}">
        <img src="${image}" alt="${product.Name}">
        <h3 class="card__brand">${product.Brand.Name}</h3>
        <h2 class="card__name">${product.Name}</h2>
        <p class="product-card__price">$${product.FinalPrice}</p>
      </a>
    </li>
  `;
}

export default class ProductList {
    constructor(category, dataSource, listElement) {
        this.category = category;
        this.dataSource = dataSource;
        this.listElement = listElement;
    }

    async init() {
        const list = await this.dataSource.getData();

        const allowedIds = new Set([
            "cedar-ridge-rimrock-2",
            "marmot-ajax-3",
            "northface-alpine-3",
            "northface-talus-4",
        ]);

        const filteredList = list.filter((p) => allowedIds.has(p.Id));

        this.renderList(filteredList);
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