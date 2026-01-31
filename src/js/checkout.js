import { loadHeaderFooter } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

const service = new ExternalServices();
const checkout = new CheckoutProcess("so-cart", ".order-summary", service);
checkout.init();

const form = document.querySelector("#checkout-form");
const messageEl = document.querySelector("#checkout-message");
const zipInput = document.querySelector('input[name="zip"]');

function showMessage(text, type = "error") {
    if (!messageEl) return;
    messageEl.textContent = text;
    messageEl.className = type;
    messageEl.style.display = "block";
}

function clearMessage() {
    if (!messageEl) return;
    messageEl.textContent = "";
    messageEl.className = "";
    messageEl.style.display = "none";
}

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

    clearMessage();

    if (!form.checkValidity()) {
        form.reportValidity();
        showMessage("⚠️ Please fix the highlighted fields.", "error");
        return;
    }

    const payload = getPayloadFromForm(form);

    try {
        await checkout.checkout(payload);
        localStorage.removeItem("so-cart");
        window.location.href = "/checkout/success.html";
    } catch (err) {
        let msg = "❌ Checkout failed. Please try again.";

        if (err?.name === "servicesError") {
            if (typeof err.message === "string") msg = err.message;
            else if (err.message?.message) msg = err.message.message;
            else {
                msg = Object.entries(err.message)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(" | ");
            }
        }

        showMessage(msg, "error");
        console.error("Checkout error:", err);
    }
});