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
function displayAllTags() {
    chrome.storage.sync.get('tags', (data) => {
        const tags = data.tags || {};
        const tagList = document.getElementById('tagList');
        tagList.innerHTML = ''; // Clear the list

        // Get all unique tags
        const allTags = new Set();
        for (let contactId in tags) {
            for (let tag of tags[contactId]) {
                if (tag && tag.trim()) {
                    allTags.add(tag);
                }
            }
        }

        // Display each tag in the list
        for (let tag of allTags) {
            const li = document.createElement('li');
            li.textContent = tag;
            li.onclick = function() {
                document.getElementById('tagFilter').value = tag;
                filterContactsByTag();
            };
            tagList.appendChild(li);
        }
    });
}

function filterContactsByTag() {
    const tag = document.getElementById('tagFilter').value;
    chrome.storage.sync.get('tags', (data) => {
        const tags = data.tags || {};
        const filteredContacts = Object.keys(tags).filter(contactId => tags[contactId].includes(tag));
        const contactList = document.getElementById('contactList');
        contactList.innerHTML = '';
        filteredContacts.forEach(contactId => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = `https://www.linkedin.com/in/${contactId}`;
            link.textContent = contactId;
            link.target = '_blank'; // Open the link in a new tab
            listItem.appendChild(link);
            contactList.appendChild(listItem);
        });
    });
}

document.getElementById('filterButton').onclick = filterContactsByTag;

// Call the function when the page loads
window.onload = displayAllTags;
