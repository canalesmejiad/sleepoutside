import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

dataSource.getData().then((data) => {
  console.log("Tents data loaded:", data);
});