import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  const imageRaw = product.Image || "";
  const image = imageRaw.startsWith("http")
    ? imageRaw
    : imageRaw.startsWith("/")
      ? imageRaw
      : `/${imageRaw}`;

  const finalPrice = Number(product.FinalPrice) || 0;
  const msrp = Number(product.SuggestedRetailPrice) || 0;

  const hasDiscount = msrp > 0 && finalPrice > 0 && finalPrice < msrp;
  const savings = hasDiscount ? (msrp - finalPrice).toFixed(2) : "";

  const discountBadge = hasDiscount
    ? `<p class="discount-badge">SAVE $${savings}</p>`
    : "";

  const priceHtml = hasDiscount
    ? `
      <p class="product-card__price">
        <span class="price--original">$${msrp.toFixed(2)}</span>
        <span class="price--final">$${finalPrice.toFixed(2)}</span>
      </p>
    `
    : `<p class="product-card__price">$${finalPrice.toFixed(2)}</p>`;

  const brand =
    product?.Brand?.Name ||
    product?.Brand ||
    product?.brand ||
    "";

  return `
    <li class="product-card">
      <a href="/product_pages/index.html?product=${product.Id}">
        ${discountBadge}
        <img src="${image}" alt="${product.Name || "Product"}">
        <h3 class="card__brand">${brand}</h3>
        <h2 class="card__name">${product.Name || ""}</h2>
        ${priceHtml}
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
    const list = await this.dataSource.getData(this.category);
    this.renderList(list);
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