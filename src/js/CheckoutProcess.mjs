import { getLocalStorage } from "./utils.mjs";

export default class CheckoutProcess {
  constructor(key, outputSelector, externalServices) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.externalServices = externalServices;
    this.items = [];
    this.subtotal = 0;
    this.tax = 0;
    this.shipping = 0;
    this.total = 0;
  }

  init() {
    this.items = getLocalStorage(this.key) || [];
    this.calculateSubtotal();
  }

  calculateSubtotal() {
    this.subtotal = this.items.reduce(
      (sum, item) => sum + item.FinalPrice * (item.qty || 1),
      0
    );
    this.renderTotals();
  }

  calculateOrder(zip) {
    this.tax = this.subtotal * 0.06;
    this.shipping = this.items.length > 0 ? 10 + (this.items.length - 1) * 2 : 0;
    this.total = this.subtotal + this.tax + this.shipping;
    this.renderTotals();
  }

  renderTotals() {
    const el = document.querySelector(this.outputSelector);
    if (!el) return;

    el.innerHTML = `
      <p>Subtotal: $${this.subtotal.toFixed(2)}</p>
      <p>Tax (6%): $${this.tax.toFixed(2)}</p>
      <p>Shipping: $${this.shipping.toFixed(2)}</p>
      <p><strong>Order Total: $${this.total.toFixed(2)}</strong></p>
    `;
  }

  async checkout(payload) {
    try {
      const result = await this.externalServices.checkout(payload);
      return result;
    } catch (err) {
      if (err?.name === "servicesError") {
        throw err;
      }

      throw {
        name: "servicesError",
        message: { message: "Network error. Please try again." },
      };
    }
  }
}