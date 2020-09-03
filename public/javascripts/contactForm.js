export default class ContactForm {
  constructor(modal) {
    this.modal = modal;
    this.form = modal.querySelector("form");
    this.inputs = [];
    Array.from(this.form.querySelectorAll("input")).forEach((elm) => {
      if (elm.type !== "submit") {
        this.inputs.push(elm);
      }
    });
  }

  isValid(input) {
    return input.value !== "";
  }

  addClass(input, klass) {
    input.classList.add(klass);
  }

  removeClass(input, klass) {
    input.classList.remove(klass);
  }

  validateInputs() {
    let valid = true;
    this.inputs.forEach((input) => {
      if (this.isValid(input)) {
        this.removeClass(input, "is-invalid");
        this.addClass(input, "is-valid");
      } else {
        valid = false;
        this.removeClass(input, "is-valid");
        this.addClass(input, "is-invalid");
      }
    });
    return valid;
  }

  resetInputs() {
    this.inputs.forEach((elm) => {
      this.removeClass(elm, "is-invalid");
      this.removeClass(elm, "is-valid");
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

  // Puts the contact values into the inputs for easy editing
  setContactInfo(contact) {
    this.contact = contact;
    this.inputs.forEach((elm) => {
      let { name } = elm;
      if (name.includes("_")) {
        name = this.camelCase(name);
      }
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

  camelCase(name) {
    const names = name.split("_");
    const letter = names[1].charAt(0).toUpperCase();
    names[1] = letter + names[1].slice(1);
    return names.join("");
  }
}
