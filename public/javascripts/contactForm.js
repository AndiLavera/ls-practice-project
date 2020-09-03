import camelCase from "./camelCase.js";

export default class ContactForm {
  constructor(modal) {
    this.modal = modal;
    this.form = modal.querySelector("form");
    this.inputs = [];
    this.fetchInputs();
  }

  fetchInputs() {
    Array.from(this.form.querySelectorAll("input")).forEach((elm) => {
      if (elm.type !== "submit") {
        this.inputs.push(elm);
      }
    });
  }

  isValid(input) {
    return input.value !== "";
  }

  addIsValidClass(input) {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
  }

  addIsInValidClass(input) {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
  }

  validateInputs() {
    let valid = true;
    this.inputs.forEach((input) => {
      if (this.isValid(input)) {
        this.addIsValidClass(input);
      } else {
        valid = false;
        this.addIsInValidClass(input);
      }
    });

    return valid;
  }

  resetInputs() {
    this.inputs.forEach((elm) => {
      elm.classList.remove("is-valid");
      elm.classList.remove("is-invalid");
    });
    this.form.reset();
  }

  bindListeners() {
    this.form
      .querySelector("button[name=close]")
      .addEventListener("click", this.resetInputs.bind(this));
  }

  addSubmitListener(submitCallback) {
    this.submitCallback = submitCallback;
    this.form.addEventListener("submit", submitCallback);
  }

  removeSubmitListener() {
    this.form.removeEventListener("submit", this.submitCallback);
    this.submitCallback = undefined;
  }

  jsonifyInputs() {
    const data = {};
    this.inputs.forEach((elm) => {
      data[elm.name] = elm.value;
    });
    return JSON.stringify(data);
  }

  setContact(contact) {
    this.contact = contact;
    this.setContactInputs(contact);
  }

  setContactInputs(contact) {
    this.inputs.forEach((elm) => {
      let { name } = elm;
      name = name.includes("_") ? camelCase(name) : name;
      elm.value = contact[name];
    });
  }

  // Binds an event listener on each 'show' invocation
  // Due to the fact we only have 1 form, we need to
  // rebind the submit callback depending on if we are
  // creating a new contact or updating an existing contact
  show(callback) {
    $(this.modal).modal("show");
    this.addSubmitListener(callback);
  }

  hide() {
    $(this.modal).modal("hide");
    this.removeSubmitListener();
    this.contact = undefined;
  }
}
