/*global chrome*/
console.log('This is a popup!');
import jsonview from '@pgrabovets/json-view';

// const memory = {};

const elementIds = {
    getCartButton: 'action-get-primary-cart',
    createCartForm: 'create-cart-form',
};

const actions = {
    getCart: 'get-primary-cart',
};

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    console.log(tabs);
    const currentTab = tabs[0];

    console.log('current tab');

    chrome.runtime.sendMessage({ action: 'inject-content-script', tabId: currentTab.id }).then((response) => {
        console.log(response.msg);
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const getCartElement = document.getElementById(elementIds.getCartButton);
    getCartElement.addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            const currentTab = tabs[0];

            console.log(currentTab, getCartElement);

            chrome.tabs.sendMessage(currentTab.id, { action: actions.getCart }).then((response) => {
                console.log(response);
                document.querySelector('.json-container').innerHTML = '';

                const tree = jsonview.create(response.json);
                jsonview.render(tree, document.querySelector('.json-container'));
            });
        });
    });

    const createCartForm = document.getElementById(elementIds.createCartForm);
    createCartForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const values = Object.fromEntries(formData);
        console.log(values);
    });
});
