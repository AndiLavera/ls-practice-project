export default class Contact {
  constructor(
    { full_name: fullName, phone_number: phoneNumber, email, tags, id },
    node
  ) {
    this.fullName = fullName;
    this.phoneNumber = phoneNumber;
    this.email = email;
    this.tags = tags ? tags.split(',') : [];
    this.id = id;
    this.createNode(node);
    this.rendered = false;
  }

  createNode(node) {
    this.node = node.cloneNode(true);
    this.node.id = `contact-${this.id}`;
    this.setNodeText();
    this.setNodeTags();
    this.show();
  }

  render(form, submitCallback, deleteCallback, tagCallback) {
    this.bindListeners(form, submitCallback, deleteCallback, tagCallback);
    this.rendered = true;
  }

  bindListeners(form, submitCallback, deleteCallback, tagCallback) {
    this.node.querySelector('a[name=edit]').addEventListener('click', (e) => {
      e.preventDefault();
      form.setContactInfo(this);
      form.show(submitCallback);
    });

    this.node.querySelector('a[name=delete]').addEventListener('click', (e) => {
      deleteCallback(e, this);
    });

    this.node
      .querySelector('dd[data-contact=tags]')
      .addEventListener('click', (e) => {
        tagCallback(e, this);
      });
  }

  setNodeText() {
    this.node.querySelector('[data-contact=name]').textContent = this.fullName;
    this.node.querySelector('[data-contact=email]').textContent = this.email;
    this.node.querySelector(
      '[data-contact=phone]'
    ).textContent = this.phoneNumber;
  }

  setNodeTags() {
    this.tags.forEach((tag) => {
      const btn = document.createElement('button');
      btn.className = 'btn btn-outline-primary btn-tag mr-2';
      btn.textContent = tag;
      this.node.querySelector('dd[data-contact=tags]').append(btn);
    });
  }

  update({ full_name: fullName, phone_number: phoneNumber, email, tags }) {
    this.fullName = fullName;
    this.phoneNumber = phoneNumber;
    this.email = email;
    this.tags = tags ? tags.split(',') : [];
    this.setNodeText();
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
