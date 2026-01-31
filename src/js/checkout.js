import { loadHeaderFooter, alertMessage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

const service = new ExternalServices();
const checkout = new CheckoutProcess("so-cart", ".order-summary", service);
checkout.init();

const form = document.querySelector("#checkout-form");
const zipInput = document.querySelector('input[name="zip"]');

function getPayloadFromForm(formEl) {
  const fd = new FormData(formEl);
  return Object.fromEntries(fd.entries());
}

zipInput?.addEventListener("input", (e) => {
  const zip = String(e.target.value || "").trim();
  if (zip.length >= 5) checkout.calculateOrder(zip);
});

form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    alertMessage("Please fix the highlighted fields.", true);
    return;
  }

  const payload = getPayloadFromForm(form);

  try {
    await checkout.checkout(payload);
    localStorage.removeItem("so-cart");
    window.location.href = "/checkout/success.html";
  } catch (err) {
    if (err?.name === "servicesError") {
      if (typeof err.message === "string") {
        alertMessage(err.message, true);
      } else if (err.message?.message) {
        alertMessage(err.message.message, true);
      } else {
        alertMessage(Object.values(err.message), true);
      }
    } else {
      alertMessage("Checkout failed. Please try again.", true);
    }

    console.error("Checkout error:", err);
  }
});