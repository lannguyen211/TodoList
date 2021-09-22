const URL = "http://localhost:3000/note";

async function getData() {
    const RESPONSE = await fetch(`${URL}`);
    const DATA = await RESPONSE.json();
    return DATA;
}

async function addData(data) {
    let option = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };

    const RESPONSE = await fetch(`${URL}`, option);
    const DATA = await RESPONSE.json();
    return DATA;
}

function handleAddData() {
    let addBtn = document.querySelector(".content-container button"),
        inputAddContent = document.querySelector('input[name="content"]');
    addBtn.addEventListener("click", (e) => {
        prepareDataAdd();
        inputAddContent.value = "";
    });
    inputAddContent.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            prepareDataAdd();
            inputAddContent.value = "";
        }
    });
}

function prepareDataAdd() {
    var newTodo = document.querySelector('input[name="content"]').value,
        dateTime = handleDateTimeText();

    let data = {
        content: newTodo,
        date: dateTime,
        checked: false,
    };

    addData(data).then(() => {
        updateView(renderTodoList);
    });
}

async function deleteData(id) {
    let option = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    };

    const RESPONSE = await fetch(`${URL}/${id}`, option);
    const DATA = await RESPONSE.json();
    return DATA;
}

function handleDeleteData(id) {
    deleteData(id).then(() => {
        let noteItem = document.querySelector(`li.item-${id}`);
        if (noteItem) noteItem.remove();
    });
}

async function updateData(data, id) {
    let option = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };

    const RESPONSE = await fetch(`${URL}/${id}`, option);
    const DATA = await RESPONSE.json();
    return DATA;
}

function changeCheckboxStatus(id) {
    let checkbox = document.querySelector(`input#toggle-${id}`),
        data = {};
    if (checkbox.checked) {
        data = { checked: true };
    } else {
        data = { checked: false };
    }

    updateData(data, id).then(() => {
        updateView(renderTodoList);
    });
}

function updateNoteContent(id) {
    let editContainer = document.querySelector(`.edit-container.edit-item-${id}`),
        updateInputValue = document.querySelector(`.edit-container.edit-item-${id} > input`).value,
        oldNoteContent = document.querySelector(`.item-${id} p.content`);

    editContainer.classList.add("hidden");

    let data = {
        content: updateInputValue,
    };

    updateData(data, id);

    if (oldNoteContent) oldNoteContent.innerText = updateInputValue;
    // .then(() => {
    //     updateView(renderTodoList);
    // });
}

function updateNoteOnKeyDown(id, e) {
    if (e.key === "Enter") {
        e.preventDefault();
        updateNoteContent(id);
    }
}

function showEditForm(id) {
    let editContainer = document.querySelector(`.edit-container.edit-item-${id}`);
    editContainer.classList.remove("hidden");
}

function updateView(callback) {
    getData().then(callback);
}

function start() {
    handleDateTimeText();
    updateView(renderTodoList);
    handleAddData();
}

start();

function handleDateTimeText() {
    var dateTimeField = document.querySelector(".date-time");

    const MONTHS = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ],
        DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var today = new Date(),
        dayOfWeek = DAYS[today.getDay()],
        date = today.getDate(),
        month = MONTHS[today.getMonth()],
        year = today.getFullYear();

    var dateTimeText = `${dayOfWeek}, ${month} ${date}, ${year}`;
    dateTimeField.innerHTML = `<p>${dateTimeText}</p>`;

    return dateTimeText;
}

function renderTodoList(todolists) {
    var todoContainer = document.querySelector(".todo-list-container");

    var htmls = todolists.map((todo) => {
        let checkboxStatus = "",
            disableItem = "",
            changeOpacity = "",
            notAllow = "";

        if (todo.checked) {
            checkboxStatus = `<input onclick="changeCheckboxStatus(${todo.id})" type="checkbox" class="toggle-checkbox" id="toggle-${todo.id}" checked>`;
            disableItem = "disabled-item";
            changeOpacity = "change-opacity";
            notAllow = "not-allowed-item";
        } else
            checkboxStatus = `<input onclick="changeCheckboxStatus(${todo.id})" type="checkbox" class="toggle-checkbox" id="toggle-${todo.id}">`;

        return `
        <li class="item-${todo.id}">
            <div class="visible-container ${changeOpacity}">
                ${checkboxStatus}
                <div class="note-content-container ${notAllow}">
                    <p class="content ${disableItem}">${todo.id}. ${todo.content}</p>
                    <div class="manager-container ${disableItem}">
                        <div onclick="showEditForm(${todo.id})" class="edit"><img src="./images/edit.png" alt="edit-icon"></div>
                        <div onclick="handleDeleteData(${todo.id})" class="delete"><img src="./images/delete.png" alt="delete-icon"></div>
                    </div>
                </div>
            </div>
            <div class="edit-container edit-item-${todo.id} hidden">
                <input onkeydown="updateNoteOnKeyDown(${todo.id}, event)" id="edit-content" type="text" value="${todo.content}">
                <button onclick="updateNoteContent(${todo.id})">Done</button>
            </div>
        </li>
        `;
    });
    todoContainer.innerHTML = htmls.join("");
}
