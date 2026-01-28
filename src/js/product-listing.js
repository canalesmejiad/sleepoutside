import { getParam, loadHeaderFooter } from "./utils.mjs";
import ExternalServices from "./externalservices.mjs";
import ProductList from "./ProductList.mjs";

loadHeaderFooter();

const category = getParam("category") || "tents";
const dataSource = new ExternalServices();
const listElement = document.querySelector(".product-list");

const productList = new ProductList(category, dataSource, listElement);
productList.init();