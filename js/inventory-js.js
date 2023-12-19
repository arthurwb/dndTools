const databaseDic = {
    "brooks": "1182735710951432192",
    "jesse": "1186691754790608896"
};
var currentDatabase = "brooks";
var jsonBlob = `https://jsonblob.com/api/jsonBlob/${databaseDic.brooks}`;

async function saveData() {
    try {
        event.preventDefault();

        var item = $("#itemName").val();
        var cost = $("#itemCost").val();

        if (typeof(cost) == "string") {
            cost = parseFloat(cost);
        }
        console.log(item, cost);

        var fullData = await getData();
        var newItem = {
            "id": fullData.inventory.length,
            "item": item,
            "cost": cost
        }
        fullData.expNet += cost;

        fullData.inventory.push(newItem);
        console.log(fullData);

        await setData(fullData);
        
        $("#itemName").val("");
        $("#itemCost").val("");
        await fillPage();
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

async function addCoins() {
    var fullData = await getData();
    var coins = parseFloat(fullData.coins.toFixed(3));
    coins += parseFloat($("#coinNum").val());
    fullData.expNet += parseFloat($("#coinNum").val());
    console.log(typeof(coins), fullData.coins);
    fullData.coins = coins;

    await setData(fullData);

    $("#coinNum").val("");
    await fillPage();
}

async function deleteData(id) {
    console.log("delete");
    id = parseInt(id);
    var fullData = await getData();
    fullData.inventory.splice(id, 1);

    await setData(fullData);

    await fillPage();
}

async function setData(data) {
    await $.ajax({
        url: jsonBlob,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(data) {
            console.log('Entry saved successfully:', data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error saving entry:', textStatus, errorThrown);
        },
    });
}

async function getData() {
    var response = [];
    await $.get(jsonBlob, function(data) {
        response = data;
    });
    return response;
}

async function fillPage() {
    $("#output").html(``);

    var data = await getData();
    var netWorth = 0;
    var id = 0;
    data.inventory.forEach(item => {
        netWorth += item.cost;
        var itemCost = formatNum(item.cost);
        itemCost = `${itemCost[0]}g, ${itemCost[1]}s`
        $("#output").append(`<div class="num" id=${id}><p><b>${item.item}: </b>${itemCost}  <button onclick="deleteData(${id})">Delete</button></p><div>`);
        id++;
    });
    
    var coins = data.coins;
    var expNetWorth = data.expNet;
    netWorth += coins;

    expNetWorth = formatNum(expNetWorth);
    $("#expNetWorth").html(`<div>${expNetWorth[0]}g, ${expNetWorth[1]}s <button onclick="showExpDialog()">Edit</button></div>`);
    $("#expNetWorthDialog").html(`<div>${expNetWorth[0]}g, ${expNetWorth[1]}s</div>`);

    coins = formatNum(coins);
    $("#coinTotal").html(`<div>${coins[0]}g, ${coins[1]}s</div>`);

    netWorth = formatNum(netWorth);
    $("#netWorth").html(`<div>${netWorth[0]}g, ${netWorth[1]}s</div>`);
}

function showExpDialog() {
    $("#editExpDialog").removeClass("hide").addClass("show");
}

async function editExp(option) {
    var input = $("#expUserInput").val();
    var data = await getData();
    
    if (/^\d+$/.test(input) || input == "") {
        input = parseInt(input);
        switch (option) {
            case 'add':
                data.expNet += input;
                break;
            case 'sub':
                data.expNet -= input;
                break;
            case 'cancel':
                break;
            default:
                break;
        }
        setData(data);
    } else {
        snackBar();
    }

    $("#expUserInput").val("");
    $("#editExpDialog").removeClass("show").addClass("hide");
    fillPage();
}

function formatNum(num) {
    console.log(num);
    num = (num / 10) + "";
    num = num.split(".");
    if (parseInt(num[1]) > 9) {
        num[1] = `${num[1].charAt(0)}.${num[1].substring(1,2)}`
    } else if (num[1] == undefined) {
        num[1] = "0";
    }
    return num;
}

function snackBar() {
    var x = document.getElementById("snackbar");
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

function switchDatabase() {
    if (currentDatabase == "brooks") {
        currentDatabase = "jesse";
        jsonBlob = `https://jsonblob.com/api/jsonBlob/${databaseDic.jesse}`;
        $("#switchDatabase").text("Database: Jesse");
    } else if (currentDatabase == "jesse") {
        currentDatabase = "brooks";
        jsonBlob = `https://jsonblob.com/api/jsonBlob/${databaseDic.brooks}`;
        $("#switchDatabase").text("Database: Brooks");
    }
    fillPage();
}

window.onload = async function() {
    await fillPage();
    $("#inventoryForm").on("submit", saveData);
    $("#coinSubmit").click(addCoins);
    $("#switchDatabase").click(switchDatabase);
}
