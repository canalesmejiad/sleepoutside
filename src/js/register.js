import { loadHeaderFooter, alertMessage } from "./utils.mjs";
import UserService from "./UserService.mjs";

loadHeaderFooter();

const service = new UserService();
const form = document.querySelector("#register-form");

function getPayloadFromForm(formEl) {
  const fd = new FormData(formEl);
  return Object.fromEntries(fd.entries());
}

function normalizePayload(payload) {
  const clean = { ...payload };

  if (clean.avatarUrl && !String(clean.avatarUrl).trim()) {
    delete clean.avatarUrl;
  }

  delete clean.confirmPassword;

  return clean;
}

form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    alertMessage("Please fix the highlighted fields.", true);
    return;
  }

  const payload = getPayloadFromForm(form);

  if (payload.password !== payload.confirmPassword) {
    alertMessage("Passwords do not match.", true);
    return;
  }

  try {
    await service.registerUser(normalizePayload(payload));
    alertMessage("Account created successfully!", true);
    window.location.href = "/account/login.html";
  } catch (err) {
    if (err?.name === "servicesError") {
      if (typeof err.message === "string") {
        alertMessage(err.message, true);
      } else if (err.message?.message) {
        alertMessage(err.message.message, true);
      } else {
        alertMessage(Object.values(err.message), true);
      }
    } else {
      alertMessage("Registration failed. Please try again.", true);
    }

    console.error("Registration error:", err);
  }
});