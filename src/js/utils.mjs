export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = false
) {
  if (clear) parentElement.innerHTML = "";
  const htmlStrings = list.map(templateFn).join("");
  parentElement.insertAdjacentHTML(position, htmlStrings);
}

export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) callback(data);
}

export async function loadTemplate(path) {
  const res = await fetch(path);
  return await res.text();
}

export async function loadHeaderFooter() {
  const header = await loadTemplate("/partials/header.html");
  const footer = await loadTemplate("/partials/footer.html");

  const headerEl = qs("#main-header");
  const footerEl = qs("#main-footer");

  if (headerEl) renderWithTemplate(header, headerEl);
  if (footerEl) renderWithTemplate(footer, footerEl);
}
export function alertMessage(message, scroll = true) {
  const alert = document.createElement("div");
  alert.classList.add("alert");

  if (Array.isArray(message)) {
    alert.innerHTML = message
      .map(
        (msg) => `
        <div class="alert-item">
          <span>${msg}</span>
          <button class="close-alert">×</button>
        </div>
      `
      )
      .join("");
  } else {
    alert.innerHTML = `
      <div class="alert-item">
        <span>${message}</span>
        <button class="close-alert">×</button>
      </div>
    `;
  }

  alert.addEventListener("click", (e) => {
    if (e.target.classList.contains("close-alert")) {
      alert.remove();
    }
  });

  const main = document.querySelector("main");
  main.prepend(alert);

  if (scroll) window.scrollTo(0, 0);
}
