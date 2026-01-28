import { getLocalStorage } from "./utils.mjs";

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;

    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage(this.key) || [];
    this.calculateItemSubTotal(); 
  }

  calculateItemSubTotal() {
    this.itemTotal = this.list.reduce((sum, item) => {
      const price = Number(item?.FinalPrice ?? item?.Final_Price ?? item?.price ?? 0);
      return sum + price;
    }, 0);

    const subtotalEl = document.querySelector(`${this.outputSelector} #subtotal`);
    if (subtotalEl) subtotalEl.textContent = this.formatMoney(this.itemTotal);
  }

  calculateOrderTotal() {
    this.tax = this.itemTotal * 0.06;

    const itemCount = this.list.length;
    this.shipping = itemCount > 0 ? 10 + Math.max(0, itemCount - 1) * 2 : 0;

    this.orderTotal = this.itemTotal + this.tax + this.shipping;

    this.displayOrderTotals();
  }

  displayOrderTotals() {
    const taxEl = document.querySelector(`${this.outputSelector} #tax`);
    const shippingEl = document.querySelector(`${this.outputSelector} #shipping`);
    const totalEl = document.querySelector(`${this.outputSelector} #orderTotal`);

    if (taxEl) taxEl.textContent = this.formatMoney(this.tax);
    if (shippingEl) shippingEl.textContent = this.formatMoney(this.shipping);
    if (totalEl) totalEl.textContent = this.formatMoney(this.orderTotal);
  }

  formatMoney(amount) {
    return `$${Number(amount || 0).toFixed(2)}`;
  }
}