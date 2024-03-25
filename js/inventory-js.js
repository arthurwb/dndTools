const databaseDic = {
    "brooks": "1182735710951432192",
    "jesse": "1219354949451636736"
};
var sellId = 0;
var currentDatabase = "brooks";
var jsonBlob = `https://jsonblob.com/api/jsonBlob/${databaseDic.jesse}`;
var yipee = document.getElementById("yipee");
var auughhh = document.getElementById("auughhh");

async function saveData() {
    try {
        event.preventDefault();

        var item = $("#itemName").val();
        var cost = $("#itemCost").val();

        if (typeof(cost) == "string") {
            cost = parseFloat(cost);
        }

        var fullData = await getData();

        var id = 0;
        if (fullData.inventory[fullData.inventory.length - 1]) {
            var id = fullData.inventory[fullData.inventory.length - 1].id + 1;
        }

        var newItem = {
            "id": id,
            "item": item,
            "cost": cost
        }

        fullData.inventory.push(newItem);

        await setData(fullData);
        
        $("#itemName").val("");
        $("#itemCost").val("");
        await testExpNet(fullData, cost);
        await fillPage();
    } catch (error) {
        snackBar("Input Error");
        console.error('An error occurred:', error);
    }
}

async function testExpNet (data, coin) {
    console.log("expNet + : " + coin);
    console.log("expNet = :" + data.expNet);
    data.expNet += coin;
    playSound();
    console.log("expNet new = :" + data.expNet);
    await setData(data);
}

async function addCoins() {
    var preCoins = parseFloat($("#coinNum").val());

    if ($("#coinNum").val() != "") {
        var data = await getData();

        var coins = parseFloat(data.coins.toFixed(3));
        coins += preCoins;
        data.coins = coins;

        preCoins > 0 ? await testExpNet(data, preCoins) : await setData(data);
    } else {
        snackBar("invalid input");
    }

    $("#coinNum").val("");
    await fillPage();
}

async function deleteData(id) {
    id = parseInt(id);
    var fullData = await getData();
    fullData.expNet -= fullData.inventory[id].cost;
    fullData.inventory.splice(id, 1);
    var item = fullData.inventory.find(item=>item.id===sellId);
    console.log(item);
    await setData(fullData);
}

async function deleteFill(id) {
    await deleteData(id);
    await fillPage();
}

async function sellData(option) {
    var data = await getData();
    var input = $("#sellInput").val().replace(/\s+/g, '');;
    if (option == "sell" && $("#sellInput").val() != "") {
        var data = await getData();
        var sellAmt = parseFloat($("#sellInput").val());
        data.coins += sellAmt;
        
        await testExpNet(data, sellAmt);
        await setData(data);
        await deleteData(sellId);
        playSound();
    } else if (option == "some") {
        console.log(input);
        var split = input.split(",");
        console.log(split);
        if (split[1] == undefined) {
            snackBar("Incorrect input format, use 'sell price, remaining amount'");
        } else {
            data.coins += parseFloat(split[0]);
            console.log(sellId);
            data.inventory[sellId].cost = parseFloat(split[1]);

            await setData(data);
            playSound();
        }
    } else {
        if (option != "cancel") { snackBar("incorrect input"); }
    }
    $("#sellInput").val("");
    $("#sellDialog").removeClass("show").addClass("hide");
    fillPage();
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
        $("#output").append(`<div class="num" id=${id}><p><b>${item.item}: </b>${itemCost}  <button onclick="deleteFill(${id})">Delete</button> <button onclick="showSellDialog(${id})">Sell</button></p><div>`);
        id++;
    });
    
    var coins = data.coins;
    var expNetWorth = data.expNet;
    console.log(expNetWorth);
    netWorth += coins;
    data.currentNet = netWorth;

    expNetWorth = formatNum(expNetWorth);
    $("#expNetWorth").html(`<div>${expNetWorth[0]}g, ${expNetWorth[1]}s <button onclick="showExpDialog()">Edit</button></div>`);
    $("#expNetWorthDialog").html(`<div>${expNetWorth[0]}g, ${expNetWorth[1]}s</div>`);

    coins = formatNum(coins);
    $("#coinTotal").html(`<div>${coins[0]}g, ${coins[1]}s</div>`);

    netWorth = formatNum(netWorth);
    $("#netWorth").html(`<div>${netWorth[0]}g, ${netWorth[1]}s</div>`);

    await setData(data);
}

function showExpDialog() {
    $("#editExpDialog").removeClass("hide").addClass("show");
}

function showSellDialog(id) {
    sellId = id;
    $("#sellDialog").removeClass("hide").addClass("show");
}

async function editExp(option) {
    var input = $("#expUserInput").val();
    var data = await getData();
    
    if (/^\d+$/.test(input)) {
        input = parseInt(input);
        switch (option) {
            case 'add':
                data.expNet += input;
                break;
            case 'sub':
                data.expNet -= input;
                break;
            default:
                break;
        }
        await setData(data);
    } else {
        snackBar("incorrect input");
    }

    $("#expUserInput").val("");
    $("#editExpDialog").removeClass("show").addClass("hide");
    fillPage();
}

function formatNum(num) {
    num = (num / 10) + "";
    num = num.split(".");
    if (parseInt(num[1]) > 9) {
        num[1] = `${num[1].charAt(0)}.${num[1].substring(1,2)}`
    } else if (num[1] == undefined) {
        num[1] = "0";
    }
    return num;
}

function snackBar(text) {
    var snackbar = $("#snackbar");
    snackbar.text(text);
    snackbar.addClass("show");
    setTimeout(function(){ snackbar.removeClass("show"); }, 8000);
}

function playSound() {
    var num = Math.floor(Math.random() * 5) + 1;
    num == 1 ? auughhh.play() : yipee.play();
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
    snackBar(`Switched to database: ${currentDatabase}`)
}

window.onload = async function() {
    await fillPage();
    $("#inventoryForm").on("submit", saveData);
    $("#coinSubmit").click(addCoins);
    $("#switchDatabase").click(switchDatabase);
}
