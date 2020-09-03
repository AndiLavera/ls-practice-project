import ContactManager from './contactManager.js';

document.addEventListener('DOMContentLoaded', () => {
  const contactManager = new ContactManager();
  contactManager.getContacts();
  contactManager.bindListeners();
});
