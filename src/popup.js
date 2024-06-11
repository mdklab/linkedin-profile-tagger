document.getElementById('filterButton').onclick = () => {
    const tag = document.getElementById('tagFilter').value;
    chrome.storage.sync.get('tags', (data) => {
        const tags = data.tags || {};
        const filteredContacts = Object.keys(tags).filter(contactId => tags[contactId].includes(tag));
        const contactList = document.getElementById('contactList');
        contactList.innerHTML = '';
        filteredContacts.forEach(contactId => {
            const listItem = document.createElement('li');
            // Here we can add the logic to display Contacts by ID
            listItem.innerText = contactId;
            contactList.appendChild(listItem);
        });
    });
};
