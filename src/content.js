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
            tagButton.innerText = 'Tag';
            tagButton.className = 'ember-view link-without-visited-state cursor-pointer text-heading-small inline-block break-words';
            tagButton.style = 'margin-left: 10px;';
            // Mark the button with a custom attribute
            tagButton.setAttribute('data-tag-button', 'true');
            tagButton.onclick = addTag;
            tagButtonContainer.appendChild(tagButton);

            // Add the new span to the container
            container.appendChild(tagButtonContainer);
        }

        // Disconnect the observer after adding the button
        observer.disconnect();
    } else {
        console.log("Contact info element not found");
    }
}

function addTag() {
    const tag = prompt('Enter a tag for this contact:');
    const contactId = window.location.pathname.split('/')[2]; // Example of getting the contact ID
    chrome.storage.sync.get('tags', (data) => {
        const tags = data.tags || {};
        tags[contactId] = tags[contactId] || [];
        tags[contactId].push(tag);
        chrome.storage.sync.set({ tags });
    });
}

const observer = new MutationObserver((mutations) => {
    mutations.forEach(() => {
        addTagButton();
    });
});

const config = { childList: true, subtree: true };

observer.observe(document.body, config);

window.onload = addTagButton;
