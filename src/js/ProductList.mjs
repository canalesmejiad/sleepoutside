export default class ProductList {
    constructor(category, dataSource, listElement) {
      this.category = category;
      this.dataSource = dataSource;
      this.listElement = listElement;
      this.list = [];
    }
  
    async init() {
      this.list = await this.dataSource.getData();
      // por ahora solo confirmamos que llega la data
      // el render completo viene en el siguiente step
      this.renderList(this.list);
    }
  
    renderList(list) {
      // temporal: muestra algo simple para comprobar que funciona
      const html = list
        .map((item) => `<li>${item.Name} - $${item.FinalPrice ?? item.Price}</li>`)
        .join("");
  
      this.listElement.innerHTML = html;
    }
  }