import { loadHeaderFooter } from "./utils.mjs";
import ExternalServices from "./externalservices.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

const service = new ExternalServices();
const checkout = new CheckoutProcess("so-cart", ".order-summary", service);
checkout.init();