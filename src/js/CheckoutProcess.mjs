import { getLocalStorage, setLocalStorage } from "./utils.mjs";

function money(n) {
  return `$${Number(n || 0).toFixed(2)}`;
}

function getItemPrice(item) {
  return Number(item?.FinalPrice ?? item?.ListPrice ?? item?.Price ?? 0);
}

function getItemQty(item) {
  return Number(item?.qty ?? 1);
}

function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const converted = {};
  formData.forEach((value, key) => {
    converted[key] = String(value).trim();
  });
  return converted;
}

function packageItems(cartItems) {
  return (cartItems || []).map((item) => {
    const price = getItemPrice(item);
    const quantity = getItemQty(item);
    return {
      id: item?.Id,
      name: item?.NameWithoutBrand ?? item?.Name ?? "",
      price: Number(price.toFixed(2)),
      quantity,
    };
  });
}

export default class CheckoutProcess {
  constructor(key, outputSelector, externalServices) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.externalServices = externalServices;

    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage(this.key) || [];
    this.calculateItemSubTotal();
    this.bindEvents();
  }

  bindEvents() {
    const zipEl = document.querySelector('input[name="zip"]');
    if (zipEl) {
      zipEl.addEventListener("change", () => this.calculateOrderTotal());
      zipEl.addEventListener("blur", () => this.calculateOrderTotal());
    }

    const form = document.getElementById("checkout-form");
    if (form) {
      form.addEventListener("submit", (e) => this.submitOrder(e));
    }
  }

  calculateItemSubTotal() {
    const total = (this.list || []).reduce((sum, item) => {
      return sum + getItemPrice(item) * getItemQty(item);
    }, 0);

    this.itemTotal = total;
    this.displayItemSubTotal();
  }

  calculateOrderTotal() {
    const zipEl = document.querySelector('input[name="zip"]');
    const zip = zipEl ? String(zipEl.value || "").trim() : "";

    if (zip.length < 5) {
      this.tax = 0;
      this.shipping = 0;
      this.orderTotal = this.itemTotal;
      this.displayOrderTotals();
      return;
    }

    const itemCount = (this.list || []).reduce((sum, item) => sum + getItemQty(item), 0);

    this.tax = this.itemTotal * 0.06;
    this.shipping = itemCount > 0 ? 10 + 2 * (itemCount - 1) : 0;
    this.orderTotal = this.itemTotal + this.tax + this.shipping;

    this.displayOrderTotals();
  }

  displayItemSubTotal() {
    const root = document.querySelector(this.outputSelector);
    if (!root) return;

    const subtotalEl = root.querySelector("#subtotal");
    if (subtotalEl) subtotalEl.textContent = money(this.itemTotal);
  }

  displayOrderTotals() {
    const root = document.querySelector(this.outputSelector);
    if (!root) return;

    const subtotalEl = root.querySelector("#subtotal");
    const taxEl = root.querySelector("#tax");
    const shippingEl = root.querySelector("#shipping");
    const totalEl = root.querySelector("#orderTotal");

    if (subtotalEl) subtotalEl.textContent = money(this.itemTotal);
    if (taxEl) taxEl.textContent = money(this.tax);
    if (shippingEl) shippingEl.textContent = money(this.shipping);
    if (totalEl) totalEl.textContent = money(this.orderTotal);
  }

  async submitOrder(e) {
    e.preventDefault();

    const form = e.target;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    this.calculateOrderTotal();

    const formJSON = formDataToJSON(form);
    const items = packageItems(this.list);

    const payload = {
      orderDate: new Date().toISOString(),
      ...formJSON,
      items,
      orderTotal: Number(this.orderTotal.toFixed(2)),
      shipping: Number(this.shipping.toFixed(2)),
      tax: Number(this.tax.toFixed(2)),
    };

    const result = await this.externalServices.checkout(payload);

    setLocalStorage(this.key, []);
    alert(`Order submitted! Order ID: ${result?.id ?? "N/A"}`);
    window.location.href = "/index.html";
  }
}