const style = document.createElement('style');
style.textContent = `
    .tag-button {
        margin-left: 10px;
    }
    .tag-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    .tag-item {
        display: inline-block;
        margin: 0 5px 5px 0;
        padding: 4px 7px;
        background-color: #007bff;
        color: white;
        border-radius: 3px;
        cursor: pointer;
        font-size: 12px;
    }
`;
document.head.appendChild(style);

function addTagButton() {
    // Find the element with id="top-card-text-details-contact-info"
    const contactInfoElement = document.querySelector('#top-card-text-details-contact-info');
    if (contactInfoElement) {
        // Find the parent container
        const container = contactInfoElement.parentElement.parentElement;

        // Check if the button already exists
        if (!container.querySelector('button[data-tag-button]')) {
            // Create a new span
            const tagButtonContainer = document.createElement('span');

            // Create the button and add it to the span
            const tagButton = document.createElement('button');
            tagButton.innerText = 'Tags';
            tagButton.className = 'ember-view link-without-visited-state cursor-pointer text-heading-small inline-block break-words tag-button';
            // Mark the button with a custom attribute
            tagButton.setAttribute('data-tag-button', 'true');
            tagButton.onclick = addTag;
            tagButtonContainer.appendChild(tagButton);

            // Add the new span to the container
            container.appendChild(tagButtonContainer);
        }

        // Get the contact ID
        const contactId = window.location.pathname.split('/')[2];

        // Get the tags for this contact and display them
        chrome.storage.sync.get('tags', (data) => {
            const tags = data.tags || {};
            const contactTags = tags[contactId] || [];

            // Find the existing tag list and clear it
            let tagList = container.querySelector('ul[data-tag-list]');
            if (tagList) {
                tagList.innerHTML = '';
            } else {
                tagList = document.createElement('ul');
                tagList.className = 'tag-list';
                tagList.setAttribute('data-tag-list', 'true');
                container.appendChild(tagList);
            }

            contactTags.forEach(tag => {
                const tagItem = document.createElement('li');
                tagItem.className = 'ember-view link-without-visited-state cursor-pointer text-heading-small inline-block break-words tag-button';
                tagItem.innerText = '#' + tag;
                tagItem.onclick = function () {
                    // Ask for confirmation before removing the tag
                    if (!confirm('Are you sure you want to remove this tag?')) {
                        return;
                    }

                    // Remove the tag from the contact
                    const index = contactTags.indexOf(tag);
                    if (index > -1) {
                        contactTags.splice(index, 1);
                        tags[contactId] = contactTags;
                        // If there are no more profiles associated with the tag, delete it from storage
                        if (contactTags.length === 0) {
                            delete tags[contactId];
                        }
                        chrome.storage.sync.set({tags});
                        // Remove the tag item from the list
                        tagList.removeChild(tagItem);
                    }
                };
                tagList.appendChild(tagItem);
            });
        });

        // Disconnect the observer after adding the button
        observer.disconnect();
    } else {
        console.log("Contact info element not found");
    }
}

function addTag() {
    const tag = prompt('Enter a tag for this contact');
    if (!tag || !tag.trim()) {
        return;
    }
    const contactId = window.location.pathname.split('/')[2]; // Example of getting the contact ID
    chrome.storage.sync.get('tags', (data) => {
        const tags = data.tags || {};
        tags[contactId] = tags[contactId] || [];
        tags[contactId].push(tag);
        chrome.storage.sync.set({tags}, () => {
            // Update the tag list after adding the tag
            addTagButton();
        });
    });
}

const observer = new MutationObserver((mutations) => {
    mutations.forEach(() => {
        addTagButton();
    });
});

const config = {childList: true, subtree: true};

observer.observe(document.body, config);

window.onload = addTagButton;
