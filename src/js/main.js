import { loadHeaderFooter } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";

loadHeaderFooter();

const listElement = document.querySelector(".product-list");

if (listElement) {
    const dataSource = new ProductData("tents");
    const productList = new ProductList("tents", dataSource, listElement);
    productList.init();
}