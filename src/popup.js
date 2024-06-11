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
    let contacts;
    chrome.storage.sync.get('contacts', (data) => {
        contacts = data.contacts || {};
    })
    const tag = document.getElementById('tagFilter').value.trim().toLowerCase();
    chrome.storage.sync.get('tags', (data) => {
        const tags = data.tags || {};
        const filteredContacts = Object.keys(tags).filter(contactId =>
            tags[contactId].map(t => t.trim().toLowerCase()).includes(tag)
        );
        const contactList = document.getElementById('contactList');
        contactList.innerHTML = '';
        filteredContacts.forEach(contactId => {
            const contact = contacts[contactId];

            const listItem = document.createElement('li');

            const contactInfo = document.createElement('div');
            contactInfo.className = 'contact-info';

            const contactImage = document.createElement('img');
            const link = document.createElement('a');
            // Create and append the contact image
            if (contact && contact.img) {
                contactImage.className = 'contact-img';
                contactImage.src = contact.img;
                contactInfo.appendChild(contactImage);
            }

            link.href = `https://www.linkedin.com/in/${contactId}`;
            link.textContent = contact ? contact.name : contactId;
            link.target = '_blank'; // Open the link in a new tab
            contactInfo.appendChild(link);

            listItem.appendChild(contactInfo);
            contactList.appendChild(listItem);
        });
    });
}

document.getElementById('filterButton').onclick = filterContactsByTag;

// Call the function when the page loads
window.onload = displayAllTags;

function exportTagsToCSV() {
    chrome.storage.sync.get('tags', (data) => {
        const tags = data.tags || {};
        let csvContent = "data:text/csv;charset=utf-8,";
        Object.entries(tags).forEach(([contactId, contactTags]) => {
            const row = contactId + ',' + contactTags.join(',');
            csvContent += row + '\r\n';
        });
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'tags.csv');
        document.body.appendChild(link);
        link.click();
    });
}
document.getElementById('exportButton').addEventListener('click', exportTagsToCSV);

document.getElementById('importButton').addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            console.log('CSV content:', event.target.result);
            importTagsFromCSV(event.target.result);
        };
        reader.readAsText(file);
    };
    input.click();
});

function importTagsFromCSV(csvContent) {
    console.log('Importing tags from CSV...');
    const lines = csvContent.split('\n');
    const tags = {};
    lines.forEach(line => {
        const [contactId, ...contactTags] = line.split(',');
        tags[contactId] = contactTags.filter(tag => tag && tag.trim() !== '');
    });
    console.log('Parsed tags:', tags);
    chrome.storage.sync.set({tags}, () => {
        if (chrome.runtime.lastError) {
            console.error('Error saving tags:', chrome.runtime.lastError);
        } else {
            console.log('Tags saved successfully');
            // Refresh tags list
            displayAllTags();
        }
    });
}
