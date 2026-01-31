async function convertToJson(res) {
  const jsonResponse = await res.json();

  if (res.ok) return jsonResponse;

  throw {
    name: "servicesError",
    message: jsonResponse,
  };
}

const baseURL = import.meta.env.VITE_SERVER_URL;

function buildUrl(path) {
  const base = baseURL.endsWith("/") ? baseURL : `${baseURL}/`;
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${base}${cleanPath}`;
}

export default class ExternalServices {
  async getData(category) {
    const url = buildUrl(`products/search/${category}`);
    const response = await fetch(url);
    const data = await convertToJson(response);
    return data.Result ?? [];
  }

  async findProductById(id) {
    const response = await fetch(buildUrl(`product/${id}`));
    const data = await convertToJson(response);
    return data.Result ?? data;
  }

  async checkout(payload) {
    const response = await fetch(buildUrl("checkout"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return await convertToJson(response);
  }
}