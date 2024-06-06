// validation email 
function isValidEmail(email) {
    const regex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    return regex.test(email);
}

//validation phone number must at least 9 character and at most 10 charactor
function isValidPhone(phone) {
    const regex = /^\d{9,10}$/; // Example for 9 or 10-digit phone numbers
    return regex.test(phone);
}

//create contact and store in local storage on browser
function addContact(name, email, phone) {
    //create table for store data from input
    const tableRow = document.createElement('tr');

    const nameData = document.createElement('td');
    nameData.textContent = name;
    tableRow.appendChild(nameData);

    const emailData = document.createElement('td');
    emailData.textContent = email;
    tableRow.appendChild(emailData);

    const phoneData = document.createElement('td');
    phoneData.textContent = phone;
    tableRow.appendChild(phoneData);

    const actionData = document.createElement('td');

    //create and append delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('btn', 'btn-danger', 'btn-sm');
    deleteButton.addEventListener('click', function() {
        tableRow.remove();
        saveContacts();
    });
    actionData.appendChild(deleteButton);

    //create and fix edit button
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.classList.add('btn', 'btn-primary', 'btn-sm', 'ml-2');

    //get value from each input 
    editButton.addEventListener('click', function() {
        document.getElementById('editName').value = name;
        document.getElementById('editEmail').value = email;
        document.getElementById('editPhone').value = phone;
        var editContactModal = document.getElementById('editContactModal');
        var bsModal = new bootstrap.Modal(editContactModal);
        bsModal.show();

        // Store the index of the contact being edited
        const contactTableRows = document.getElementById('contactList').children;
        for (let i = 0; i < contactTableRows.length; i++) {
            if (contactTableRows[i] === tableRow) {
                contactIndexToUpdate = i;
                break;
            }
        }
    });
    actionData.appendChild(editButton);

    //append the data to table
    tableRow.appendChild(actionData);
    document.getElementById('contactList').appendChild(tableRow);
}

//get data from local storage
function loadContacts() {
    const savedContacts = JSON.parse(localStorage.getItem('contacts')) || [];
    savedContacts.forEach(contact => addContact(...contact.split(' - ')));
}

//save data to local storage
function saveContacts() {
    const contacts = Array.from(document.getElementById('contactList').children).map(li => li.querySelector('span').textContent);
    localStorage.setItem('contacts', JSON.stringify(contacts));
}

//update contact info 
function updateContact(name, email, phone) {
    const contactIndex = getContactIndexToUpdate();

    if (contactIndex !== -1) {
        const contactList = document.getElementById('contactList');
        const listItems = contactList.children;
        const listItemToUpdate = listItems[contactIndex];
        const contactInfoToUpdate = listItemToUpdate.querySelector('span');
        contactInfoToUpdate.textContent = `${name} - ${email} - ${phone}`;

        const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
        contacts[contactIndex] = `${name} - ${email} - ${phone}`;
        localStorage.setItem('contacts', JSON.stringify(contacts));

    }
}
window.onload = loadContacts;
let contactIndexToUpdate = -1; // Global variable to store the index of the contact being edited

document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    if (isValidEmail(email) && isValidPhone(phone)) {
        addContact(name, email, phone);
        saveContacts();
        // Clear the input fields
        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
        document.getElementById('phone').value = '';
    } else {
        alert('Invalid email or phone number');
    }
});

document.getElementById('saveChanges').addEventListener('click', function() {
    const name = document.getElementById('editName').value;
    const email = document.getElementById('editEmail').value;
    const phone = document.getElementById('editPhone').value;
    if (isValidEmail(email) && isValidPhone(phone)) {
        updateContact(name, email, phone);
        saveContacts();
        $('#editContactModal').modal('hide');
    } else {
        alert('Invalid email or phone number');
    }
});

function getContactIndexToUpdate() {
    return contactIndexToUpdate;
}
