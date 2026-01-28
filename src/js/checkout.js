import { loadHeaderFooter } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

const service = new ExternalServices();
const checkout = new CheckoutProcess("so-cart", "#orderSummary", service);
checkout.init();