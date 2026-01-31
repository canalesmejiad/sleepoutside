import { getLocalStorage, setLocalStorage, loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const cartList = document.querySelector(".product-list");

function getCartItems() {
  return getLocalStorage("so-cart") || [];
}

function saveCart(items) {
  setLocalStorage("so-cart", items);
}

function getImageUrl(p) {
  return (
    p?.Images?.PrimaryMedium ||
    p?.Images?.PrimaryLarge ||
    p?.Images?.PrimaryExtraLarge ||
    ""
  );
}

function groupItems(items) {
  const map = new Map();

  items.forEach((item) => {
    const id = item.Id;
    if (!map.has(id)) {
      map.set(id, { ...item, qty: 1 });
    } else {
      map.get(id).qty += 1;
    }
  });

  return Array.from(map.values());
}

function calculateSubtotal(items) {
  return items.reduce(
    (sum, item) => sum + Number(item.FinalPrice) * item.qty,
    0
  );
}

function renderTotal(items) {
  const totalEl = document.querySelector(".cart-total");
  if (!totalEl) return;

  const total = calculateSubtotal(items);
  totalEl.textContent = `$${total.toFixed(2)}`;
}

function removeOneItem(productId) {
  const cart = getCartItems();
  const index = cart.findIndex((p) => p.Id === productId);

  if (index !== -1) {
    cart.splice(index, 1);
    saveCart(cart);
    renderCart();
  }
}

function cartItemTemplate(item) {
  return `
    <li class="cart-card divider">
      <img class="cart-card__image" src="${getImageUrl(item)}" alt="${item.Name}">
      <div>
        <h2 class="card__name">${item.Name}</h2>
        <p class="cart-card__color">${item.Colors?.[0]?.ColorName ?? ""}</p>
        <p class="cart-card__quantity">qty: ${item.qty}</p>
        <button class="remove-one" data-id="${item.Id}">Remove one</button>
      </div>
      <p class="cart-card__price">$${(item.FinalPrice * item.qty).toFixed(2)}</p>
    </li>
  `;
}

function renderCart() {
  const rawItems = getCartItems();
  const groupedItems = groupItems(rawItems);

  cartList.innerHTML = groupedItems.map(cartItemTemplate).join("");

  document.querySelectorAll(".remove-one").forEach((btn) => {
    btn.addEventListener("click", () => {
      removeOneItem(btn.dataset.id);
    });
  });

  renderTotal(groupedItems);
}

renderCart();