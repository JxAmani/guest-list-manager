const guestNameInput = document.getElementById('input');
const addGuestButton = document.getElementById('addGuestButton');
const guestListUL = document.getElementById('guestList');
const messageArea = document.getElementById('messageArea');

let guests = [];// mutable array

const MAX_GUESTS = 10;

function showMessage(message, type = 'warning') {//default type is warning
    messageArea.textContent = message;// inserting text
    messageArea.className = `message-area show ${type}`;//in css its styled as a class
    setTimeout(() => {
        messageArea.classList.remove('show');
    }, 3000);//3 seconds
}
//each guest has a unique identifier get current time and convert it to a base 36 string, gets a random number and converts it to a base 36 string 
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function renderGuestList() {
    guestListUL.innerHTML = '';//clear previous list

    guests.forEach(guest => {//iterates over each guest
        const listItem = document.createElement('li');//crated an li element in the code
        listItem.classList.add('guest-item');//gave li a class name called guest-item

        const guestNameSpan = document.createElement('span');//created a span element
        guestNameSpan.classList.add('guest-name');//gave span a class name caled guest-name
        guestNameSpan.textContent = guest.name;// set it as text content

        const actionsDiv = document.createElement('div');//created a div
        actionsDiv.classList.add('guest-actions');//gave div a class name called guest-actions

        const rsvpButton = document.createElement('button');//created a button
        rsvpButton.classList.add('rsvp-btn');//gave the button a class name called rsvp-btn
        rsvpButton.textContent = guest.attending ? 'Mark Not Attending' : 'Mark Attending';//changes its text based on gust.attending
        rsvpButton.title = 'Click to toggle RSVP status';

        const rsvpStatusSpan = document.createElement('span');// created a span
        rsvpStatusSpan.classList.add('rsvp-status');//gave the span a class name called rsvp-status
        rsvpStatusSpan.textContent = guest.attending ? 'Attending' : 'Not Attending';
        rsvpStatusSpan.classList.add(guest.attending ? 'attending' : 'not-attending');

        rsvpButton.addEventListener('click', () => toggleRSVP(guest.id));

        const removeButton = document.createElement('button');//created a button
        removeButton.classList.add('remove-btn');//gave the button a class name called remove-btn
        removeButton.innerHTML = '<i class="fas fa-trash-alt"></i> Remove';// trash icon

        removeButton.addEventListener('click', () => removeGuest(guest.id));

        const editButton = document.createElement('button');//created a button
        editButton.textContent = 'Edit';
        editButton.classList.add('edit-btn');//gave the button a class name called remove-btn
        editButton.addEventListener('click', () => editGuest(guest.id));

        if (guest.addedTime) {
            const timeSpan = document.createElement('span');// created a span
            timeSpan.classList.add('added-time');//gave the span a class name called added-time
            const date = new Date(guest.addedTime);
            timeSpan.textContent = `Added: ${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
            listItem.appendChild(timeSpan);
        }

        listItem.appendChild(guestNameSpan);
        actionsDiv.appendChild(rsvpStatusSpan);
        actionsDiv.appendChild(rsvpButton);
        actionsDiv.appendChild(editButton);
        actionsDiv.appendChild(removeButton);

        listItem.appendChild(actionsDiv);

        guestListUL.appendChild(listItem);
    });
}

function addGuest() {
    const name = guestNameInput.value.trim();

    if (name === '') {
        showMessage('Please enter a guest name.', 'error');
        return;
    }

    if (guests.length >= MAX_GUESTS) {
        showMessage(`Guest list is full! (Max ${MAX_GUESTS} guests)`, 'warning');
        guestNameInput.value = '';
        return;
    }

    const newGuest = {
        id: generateUniqueId(),
        name: name,
        attending: true,
        addedTime: Date.now()
    };

    guests.push(newGuest);

    renderGuestList();

    guestNameInput.value = '';
    showMessage(`'${name}' added to the list!`, 'success');
}

function removeGuest(idToRemove) {
    const removedGuestName = guests.find(guest => guest.id === idToRemove)?.name;
    guests = guests.filter(guest => guest.id !== idToRemove);

    renderGuestList();
    if (removedGuestName) {
        showMessage(`'${removedGuestName}' removed from the list.`, 'info');
    }
}

function toggleRSVP(idToToggle) {
    guests = guests.map(guest =>
        guest.id === idToToggle ? { ...guest, attending: !guest.attending } : guest
    );

    renderGuestList();
    const guestName = guests.find(guest => guest.id === idToToggle)?.name;
    const status = guests.find(guest => guest.id === idToToggle)?.attending ? 'Attending' : 'Not Attending';
    if (guestName) {
        showMessage(`'${guestName}' is now ${status}.`, 'info');
    }
}

function editGuest(idToEdit) {
    const guestToEdit = guests.find(guest => guest.id === idToEdit);
    if (guestToEdit) {
        const newName = prompt(`Edit name for "${guestToEdit.name}":`, guestToEdit.name);
        if (newName !== null && newName.trim() !== '') {
            guests = guests.map(guest =>
                guest.id === idToEdit ? { ...guest, name: newName.trim() } : guest
            );
            renderGuestList();
            showMessage(`'${guestToEdit.name}' updated to '${newName.trim()}'.`, 'success');
        } else if (newName !== null) {
            showMessage('Guest name cannot be empty.', 'error');
        }
    }
}

addGuestButton.addEventListener('click', addGuest);

guestNameInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        addGuest();
    }
});

renderGuestList();