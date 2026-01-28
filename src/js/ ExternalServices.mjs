function convertToJson(res) {
  if (res.ok) return res.json();
  throw new Error(`Bad Response: ${res.status}`);
}

const baseURL = import.meta.env.VITE_SERVER_URL;

export default class ExternalServices {
  async getData(category) {
    const url = `${baseURL}products/search/${category}`;
    const response = await fetch(url);
    const data = await convertToJson(response);
    return data.Result ?? [];
  }

  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    return data.Result ?? data;
  }

  async submitOrder(order) {
    const response = await fetch(`${baseURL}checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    });

    return convertToJson(response);
  }
}