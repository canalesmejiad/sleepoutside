import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  const finalPrice = Number(product.FinalPrice);
  const msrp = Number(product.SuggestedRetailPrice);

  const hasDiscount = msrp && finalPrice < msrp;
  const savings = hasDiscount ? (msrp - finalPrice).toFixed(2) : null;

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

  return `
    <li class="product-card">
      <a href="/product_pages/index.html?product=${product.Id}">
        ${discountBadge}
        <img src="${product.Images.PrimaryMedium}" alt="${product.Name}">
        <h3 class="card__brand">${product.Brand.Name}</h3>
        <h2 class="card__name">${product.NameWithoutBrand}</h2>
        ${priceHtml}
      </a>
    </li>
  `;
}

function formatCategory(category) {
  return category
    .split("-")
    .map(w => w[0].toUpperCase() + w.slice(1))
    .join(" ");
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

    const titleEl = document.querySelector(".page-title");
    if (titleEl) {
      titleEl.textContent = `Top Products: ${formatCategory(this.category)}`;
    }
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