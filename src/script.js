const guestNameInput = document.getElementById('input');
const addGuestButton = document.getElementById('addGuestButton');
const guestListUL = document.getElementById('guestList');
const messageArea = document.getElementById('messageArea');

let guests = [];// mutable array

const MAX_GUESTS = 10;
//Dispearing message bar that informs you what you're doing
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
        rsvpButton.textContent = guest.attending ? 'Mark Not Attending' : 'Mark Attending';//changes its text based on guest.attending
        rsvpButton.title = 'Click to toggle RSVP status';//meaning to change status to either mark attending or mark not attending

        const rsvpStatusSpan = document.createElement('span');// created a span
        rsvpStatusSpan.classList.add('rsvp-status');//gave the span a class name called rsvp-status
        rsvpStatusSpan.textContent = guest.attending ? 'Attending' : 'Not Attending';//changes its text based on guest.attending
        rsvpStatusSpan.classList.add(guest.attending ? 'attending' : 'not-attending');//meaning to change status to either attending or not attending

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
            const date = new Date(guest.addedTime);//display time
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
    const name = guestNameInput.value.trim();//remove whitespace of the user

    if (name === '') {//dont put a name
        showMessage('Please enter a guest name.', 'error');
        return;
    }

    if (guests.length >= MAX_GUESTS) { //if no. of guest exceed 10
        showMessage(`Guest list is full! (Max ${MAX_GUESTS} guests)`, 'warning');//notification
        guestNameInput.value = '';
        return;
    }

    const newGuest = {
        id: generateUniqueId(),
        name: name,
        attending: true,// Setting default rsvp to attending
        addedTime: Date.now()//Timestamp
    };

    guests.push(newGuest);//to be done for every guest

    renderGuestList();

    guestNameInput.value = '';//empty string
    showMessage(`'${name}' added to the list!`, 'success');//message when user adds a name to the input bar
}

/*Removes a guest from the list. idToRemove - ID of the guest to remove.*/
function removeGuest(idToRemove) {
    const removedGuestName = guests.find(guest => guest.id === idToRemove)?.name;//id and id to remove same thing
    guests = guests.filter(guest => guest.id !== idToRemove);//.filter unwanted items

    renderGuestList();
    if (removedGuestName) {//message bar
        showMessage(`'${removedGuestName}' removed from the list.`, 'info');//user removes name
    }
}

/*(Toggle-change) Toggles the RSVP status for a guest. idToToggle - ID of the guest whose RSVP status to toggle.*/
function toggleRSVP(idToToggle) {
    guests = guests.map(guest =>
        guest.id === idToToggle ? { ...guest, attending: !guest.attending } : guest
    );

    renderGuestList();
    const guestName = guests.find(guest => guest.id === idToToggle)?.name;
    const status = guests.find(guest => guest.id === idToToggle)?.attending ? 'Attending' : 'Not Attending';
    if (guestName) {
        showMessage(`'${guestName}' is now ${status}.`, 'info');//when they choose on the rsvp button
    }
}

/*Edits the name of an existing guest.{string} idToEdit - ID of the guest to edit.*/
function editGuest(idToEdit) {
    const guestToEdit = guests.find(guest => guest.id === idToEdit);//id same as id to edit
    if (guestToEdit) {
        const newName = prompt(`Edit name for "${guestToEdit.name}":`, guestToEdit.name);//to change the name
        if (newName !== null && newName.trim() !== '') {
            guests = guests.map(guest =>
                guest.id === idToEdit ? { ...guest, name: newName.trim() } : guest
            );
            renderGuestList();
            showMessage(`'${guestToEdit.name}' updated to '${newName.trim()}'.`, 'success');//when the edit works
        } else if (newName !== null) {
            showMessage('Guest name cannot be empty.', 'error');//if they delete everything
        }
    }
}
//either enter or clicking enter will give output

// Event listener for the 'Add Guest' button.
addGuestButton.addEventListener('click', addGuest);

// Clicking 'Enter' key press in the guest name input.
guestNameInput.addEventListener('keypress', (event) => {
    if (event.key === 'enter') {
        addGuest();//calling function
    }
});

renderGuestList(); 
