const databaseDic = {
    "admin": "1297944581839380480",
    "brooks": "1297992177228308480"
};
let sellId = 0;
let jsonBlob = `https://jsonblob.com/api/jsonBlob/${databaseDic.admin}`;

// ----------- Util ----------
// sample input 
// "2g 4s"
// "2s 4c"
// "2c 9g"
// "10p 1c"
// anything outside this convention should not work and should give a popup error
function convert2Coin(input) {
    const validFormat = /^\d+[csgp]$/;
    const inputValues = input.split(" ");
    let convertValue = 0;

    for (let value of inputValues) {
        if (!validFormat.test(value)) {
            snackBar("Invalid input format! Please use formats like '2c', '4s', '10p', etc.");
            return "error";
        }

        // Process valid values
        switch (value.slice(-1)) {
            case "c":
                convertValue += parseInt(value.slice(0, -1));
                break;
            case "s":
                convertValue += parseInt(value.slice(0, -1)) * 10;
                break;
            case "g":
                convertValue += parseInt(value.slice(0, -1)) * 100;
                break;
            case "p":
                convertValue += parseInt(value.slice(0, -1)) * 1000;
                break;
            default:
                // This case should never happen due to the regex check
                snackBar("Unknown error occurred!");
                return "error";
        }
    }
    
    return convertValue;
}


function convert4Coin(input) {
    let coins = {
        "c": Math.abs(input) % 10,
        "s": Math.abs(Math.floor(input / 10)) % 10,
        "g": Math.abs(Math.floor(input / 100)) % 10,
        "p": Math.floor(input / 1000)
    }
    
    let result = '';
    if (coins.p !== 0) result += `${coins.p}p `;
    if (coins.g !== 0) result += `${coins.g}g `;
    if (coins.s !== 0) result += `${coins.s}s `;
    if (coins.c !== 0) result += `${coins.c}c `;

    return result.trim();
}

async function changeDatabase() {
    let newDatabase = $("#databases").val();
    jsonBlob = `https://jsonblob.com/api/jsonBlob/${databaseDic[newDatabase]}`;
    fillPage();
    snackBar(`Switched to database: ${newDatabase}`);
}

// ---------- UI ----------
function snackBar(text) {
    let snackbar = $("#snackbar");
    snackbar.text(text);
    snackbar.addClass("show");
    setTimeout(function(){ snackbar.removeClass("show"); }, 4000);
}

function toggleItemForm() {
    const itemForm = $("#itemForm");
    if (itemForm.hasClass("hide")) { 
        $("#itemForm").removeClass("hide").addClass("show"); 
    } else {
        $("#itemForm").removeClass("show").addClass("hide");
    }
}

function toggleDeleteConfirmation(id) {
    const deleteConfirmation = $("#deleteConfirmation");
    if (deleteConfirmation.hasClass("hide") && id) {
        deleteConfirmation.html(`                
                <div class="dialogue-content">
                    <p>Are you sure?</p>
                    <div>
                        <button onclick="deleteItem(${id})">Yes</button>
                        <button onclick="toggleDeleteConfirmation()">No</button>
                    </div>
                </div>
            `)
        $("#deleteConfirmation").removeClass("hide").addClass("show"); 
    } else {
        $("#deleteConfirmation").removeClass("show").addClass("hide");
    }
}

// ----------- CRUD OPP -----------

async function getItems() {
    let data = [];
    await $.get(jsonBlob, function(res) {
        data = res;
    });
    return data.items;
}

async function getAll() {
    let data = [];
    await $.get(jsonBlob, function(res) {
        data = res;
    });
    return data;
}

async function deleteItem(id) {
    let data = await getAll();
    for (let i = 0; i < data.items.length; i++) {
        const item = data.items[i];
        if (item.id == id) {
            data.items.splice(i, 1);
        }
    }

    putItems(data);
    toggleDeleteConfirmation();
}

async function putItems(items, item) {
    if (item) items.items.push(item);

    await $.ajax({
        url: jsonBlob,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(items),
        success: function(res) {
            console.log('Entry saved successfully:', res);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error saving entry:', textStatus, errorThrown);
        },
    });

    fillPage();
}

async function createItem() {
    let data = [];
    await $.get(jsonBlob, function(res) {
        data = res;
    });
    
    let newId = Math.floor(Math.random() * 99999999);
    data.items.forEach(item => {
        while (newId == item.id) {
            newId += 1;
        }
    });

    let output = ""
    if (convert2Coin($("#formValue").val()) != "error") {
        output = {
            "itemName": $("#formName").val(),
            "itemPrice": convert2Coin($("#formValue").val()),
            "description": $("#formDescription").val(),
            "icon": "lock",
            "dateAdded": Date.now(),
            "id": newId
        }
    } else {
        snackBar("Error in coin conversion");
        return;
    }

    data.items.push(output);
    
    await $.ajax({
        url: jsonBlob,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(res) {
            console.log('Entry saved successfully:', res);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error saving entry:', textStatus, errorThrown);
        },
    });
    toggleItemForm();
    fillPage();
}

// ---------- Page Functionality ----------
function generateTotal(items) {
    let total = 0;
    items.forEach(item => {
        total += item.itemPrice;
    });

    return convert4Coin(total);
}

async function fillPage() {
    const container = $("#itemsContainer");
    let items = await getItems();
    let itemCount = 0;
    let rowCount = 0;

    container.html(``);
    
    items.forEach(item => {
        if (itemCount % 3 === 0) {
            container.append(`<div class="row align-items-start" id="row${rowCount}"></div>`);
        }

        const date = new Date(item.dateAdded);
        const dateConversion = `${date.getMonth()}/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`

        $(`#row${rowCount}`).append(`
            <div class="col item-display">
                <h4><span class="material-icons item-icon">${item.icon}</span>${item.itemName}</h4>
                <p>${item.description}</p>
                <div>${dateConversion}</div>
                <div class="row">
                    <div class="col">
                        <h5>${convert4Coin(item.itemPrice)}</h5>
                    </div>
                    <div class="col right">
                        <button onclick="toggleDeleteConfirmation(${item.id})" class="red">Delete</button>
                    </div>
                </div>
            </div>
        `);
        itemCount++;

        if (itemCount % 3 === 0) {
            rowCount++;
        }
    });

    $("#total").text(generateTotal(items));
}


window.onload = async function() {
    await fillPage();
}