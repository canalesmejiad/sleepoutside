function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

export default class ProductData {
  constructor(category) {
    this.category = category;
    this.baseUrl =
      import.meta.env.VITE_SERVER_URL ||
      "https://wdd330-backend.onrender.com/";
    this.searchPath = "products/search/";
    this.productPath = "product/";
  }

  getData() {
    const url = new URL(
      `${this.searchPath}${this.category}`,
      this.baseUrl
    );
    return fetch(url).then(convertToJson);
  }

  async findProductById(id) {
    const url = new URL(`${this.productPath}${id}`, this.baseUrl);
    return fetch(url).then(convertToJson);
  }
}