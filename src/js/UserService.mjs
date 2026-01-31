const baseURL = import.meta.env.VITE_SERVER_URL;

function buildUrl(path) {
  const base = baseURL.endsWith("/") ? baseURL : `${baseURL}/`;
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${base}${cleanPath}`;
}

async function convertToJson(res) {
  let jsonResponse;

  try {
    jsonResponse = await res.json();
  } catch (e) {
    const text = await res.text().catch(() => "");
    jsonResponse = { message: text || "Unknown error" };
  }

  if (res.ok) return jsonResponse;

  throw {
    name: "servicesError",
    message: jsonResponse,
  };
}

export default class UserService {
  async registerUser(payload) {
    const response = await fetch(buildUrl("users"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return convertToJson(response);
  }
}