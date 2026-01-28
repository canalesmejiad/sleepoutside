import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

const checkout = new CheckoutProcess("so-cart", ".order-summary");

checkout.init();

const zipInput = document.querySelector("#zip");

if (zipInput) {
    zipInput.addEventListener("blur", () => {
        if (zipInput.value.trim() !== "") {
            checkout.calculateOrderTotal();
        }
    });
}

const form = document.querySelector("#checkoutForm");

if (form) {
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!form.checkValidity()) return;

        alert("Order submitted (demo).");
    });
}