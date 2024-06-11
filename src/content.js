function addTagButton() {
    const profileActions = document.querySelector('.pv-s-profile-actions');
    if (profileActions) {
        const tagButton = document.createElement('button');
        tagButton.innerText = 'Tag';
        tagButton.onclick = addTag;
        profileActions.appendChild(tagButton);
    }
}

function addTag() {
    const tag = prompt('Enter a tag for this contact:');
    // Get Contact ID
    const contactId = window.location.pathname.split('/')[2];
    chrome.storage.sync.get('tags', (data) => {
        const tags = data.tags || {};
        tags[contactId] = tags[contactId] || [];
        tags[contactId].push(tag);
        chrome.storage.sync.set({ tags });
    });
}

window.onload = addTagButton;
