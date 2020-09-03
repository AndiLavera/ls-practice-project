export default class Contact {
  constructor(
    { full_name: fullName, phone_number: phoneNumber, email, tags, id },
    node
  ) {
    this.fullName = fullName;
    this.phoneNumber = phoneNumber;
    this.email = email;
    this.tags = tags ? tags.split(",") : [];
    this.id = id;
    this.createNode(node);
    this.rendered = false;
  }

  createNode(node) {
    this.node = node.cloneNode(true);
    this.node.id = `contact-${this.id}`;
    this.setText();
    this.setTags();
    this.show();
  }

  render(form, submitCallback, deleteCallback, tagCallback) {
    this.bindListeners(form, submitCallback, deleteCallback, tagCallback);
    this.rendered = true;
  }

  bindListeners(form, submitCallback, deleteCallback, tagCallback) {
    this.bindEditButton(form, submitCallback);
    this.bindDeleteButton(deleteCallback);
    this.bindTags(tagCallback);
  }

  bindEditButton(form, submitCallback) {
    this.node.querySelector("a[name=edit]").addEventListener("click", (e) => {
      e.preventDefault();
      form.setContact(this);
      form.show(submitCallback);
    });
  }

  bindDeleteButton(deleteCallback) {
    this.node.querySelector("a[name=delete]").addEventListener("click", (e) => {
      deleteCallback(e, this);
    });
  }

  bindTags(tagCallback) {
    this.node
      .querySelector("dd[data-contact=tags]")
      .addEventListener("click", (e) => {
        tagCallback(e, this);
      });
  }

  update({ full_name: fullName, phone_number: phoneNumber, email, tags }) {
    this.fullName = fullName;
    this.phoneNumber = phoneNumber;
    this.email = email;
    this.tags = tags ? tags.split(",") : [];
    this.setText();
    this.removeTags(this.node.querySelector("dd[data-contact=tags]"));
    this.setTags();
  }

  setText() {
    Object.keys(this.textNodes()).forEach((key) => {
      this.node.querySelector(
        `[data-contact=${key}]`
      ).textContent = this.textNodes()[key];
    });
  }

  textNodes() {
    return {
      fullName: this.fullName,
      email: this.email,
      phoneNumber: this.phoneNumber,
    };
  }

  setTags() {
    const tagLocation = this.node.querySelector("dd[data-contact=tags]");

    this.tags.forEach((tag) => {
      const btn = document.createElement("button");
      btn.className = "btn btn-outline-primary btn-tag mr-2";
      btn.textContent = tag;
      tagLocation.append(btn);
    });
  }

  removeTags(location) {
    Array.from(location.children).forEach((node) => node.remove());
  }

  removeNode() {
    this.node.remove();
  }

  show() {
    this.node.hidden = false;
  }

  hide() {
    this.node.hidden = true;
  }

  // Searches both fullName & tags for containing substring
  includes(search) {
    if (this.fullName.toLowerCase().includes(search)) {
      return true;
    }
    let includes = false;
    this.tags.forEach((tag) => {
      if (tag.toLowerCase().includes(search)) {
        includes = true;
      }
    });

    return includes;
  }
}
