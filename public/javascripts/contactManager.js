import Contact from "./contact.js";
import ContactForm from "./contactForm.js";

export default class ContactManager {
  constructor() {
    this.form = new ContactForm(document.getElementById("contactModal"));
    this.contacts = [];
    this.card = document.querySelector("div[data-name=contact-card]");
    this.cardLocation = document.getElementById("contacts");
    this.contactButton = document.getElementById("addContactButton");
    this.searchBar = document.getElementById("search-bar");
  }

  addContact(e) {
    e.preventDefault();
    if (this.form.validateInputs()) {
      this.form.hide();
      const data = this.form.jsonifyInputs();

      this.openRequest("POST", "/api/contacts/");

      this.request.addEventListener("load", () => {
        const { response } = this.request;
        const contact = this.generateNewContact(response);
        this.addToScreen(contact);
      });

      this.request.send(data);
      this.form.reset();
    }
  }

  updateContact(e) {
    e.preventDefault();
    if (this.form.validateInputs()) {
      const { contact } = this.form;
      this.form.hide();
      const data = this.form.jsonifyInputs();
      this.openRequest("PUT", `/api/contacts/${contact.id}`);

      this.request.addEventListener("load", () => {
        const { response } = this.request;
        contact.update(response);
      });

      this.request.send(data);
      this.form.reset();
    }
  }

  deleteContact(e, contact) {
    e.preventDefault();
    if (window.confirm(`Do you want to delete ${contact.fullName}`)) {
      const endpoint = `/api/contacts/${contact.id}`;
      this.openRequest("DELETE", endpoint);
      this.request.addEventListener("load", () => {
        contact.removeNode();
      });

      this.request.send();
    }
  }

  openRequest(method, endpoint) {
    this.request = new XMLHttpRequest();
    this.request.open(method, endpoint);
    this.request.responseType = "json";
    this.request.setRequestHeader("Content-Type", "application/json");
  }

  // Gets all contacts, generates a new contact object, adds card to screen
  getContacts() {
    this.openRequest("GET", "/api/contacts");

    this.request.addEventListener("load", () => {
      this.generateContacts(this.request);
    });

    this.request.send();
  }

  generateContacts({ response }) {
    response.forEach((contact) => {
      this.newContact(contact);
    });
  }

  newContact(payload) {
    const contact = new Contact(payload, this.card.cloneNode(true));
    this.contacts.push(contact);
    this.addToScreen(contact);
    return contact;
  }

  addToScreen(contact) {
    if (!contact.rendered) {
      this.cardLocation.append(contact.node);
      contact.render(this.form, ...this.contactCallbacks());
    }
  }

  bindListeners() {
    this.bindForm();
    this.bindContactButton();
    this.bindSearchBar();
  }

  bindForm() {
    this.form.bindListeners();
  }

  bindContactButton() {
    this.contactButton.addEventListener("click", (e) => {
      this.form.show(this.addContact.bind(this));
    });
  }

  bindSearchBar() {
    this.searchBar.addEventListener("keyup", (e) => {
      this.searchForContact(e.target.value.toLowerCase());
    });
  }

  searchForContact(search) {
    this.contacts.forEach((contact) => {
      contact.includes(search) ? contact.show() : contact.hide();
    });
  }

  contactCallbacks() {
    const submitCallback = this.updateContact.bind(this);
    const deleteCallback = this.deleteContact.bind(this);
    const tagCallback = function (e) {
      document.getElementById("search-bar").value = e.target.textContent;
      this.searchForContact(e.target.textContent);
    }.bind(this);

    return [submitCallback, deleteCallback, tagCallback];
  }
}
