const jsonBlob = "https://jsonblob.com/api/jsonBlob/1182735710951432192";

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

        fullData.inventory.push(newItem);
        console.log(fullData);

        await $.ajax({
            url: jsonBlob,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(fullData),
            success: function(data) {
                console.log('Entry saved successfully:', data);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('Error saving entry:', textStatus, errorThrown);
            },
        });
        
        $("#itemName").val("");
        $("#itemCost").val("");
        await getData();
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

async function addCoins() {
    var fullData = await getData();
    var coins = parseFloat(fullData.coins.toFixed(3));
    coins += parseFloat($("#coinNum").val());
    console.log(typeof(coins), fullData.coins);
    fullData.coins = coins;

    await $.ajax({
        url: jsonBlob,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(fullData),
        success: function(data) {
            console.log('Entry saved successfully:', data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error saving entry:', textStatus, errorThrown);
        },
    });

    $("#coinNum").val("");
    await getData();
}

async function deleteData(id) {
    console.log("delete");
    id = parseInt(id);
    var fullData = await getData();
    fullData.inventory.splice(id, 1);

    await $.ajax({
        url: jsonBlob,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(fullData),
        success: function(data) {
            console.log('Entry saved successfully:', data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error saving entry:', textStatus, errorThrown);
        },
    });

    await getData();
}

async function getData() {
    var response = [];
    $("#output").html(``);
    await $.get(jsonBlob, function(data) {
        response = data;
        var netWorth = 0;
        var id = 0;
        data.inventory.forEach(item => {
            netWorth += item.cost;
            var itemCost = item.cost;
            itemCost = (itemCost / 10) + "";
            itemCost = itemCost.split(".");
            if (parseInt(itemCost[1]) > 9) {
                itemCost[1] = `${itemCost[1].charAt(0)}.${itemCost[1].substring(1,2)}`
            } else if (itemCost[1] == undefined) {
                itemCost[1] = 0; 
            }
            itemCost = `${itemCost[0]}g, ${itemCost[1]}s`
            $("#output").append(`<div class="num" id=${id}><p><b>${item.item}: </b>${itemCost}  <button onclick="deleteData(${id})">Delete</button></p><div>`);
            id++;
        });
        var coins = data.coins;
        netWorth += coins;
        coins = (coins / 10) + "";
        coins = coins.split(".");
        if (parseInt(coins[1]) > 9) {
            coins[1] = `${coins[1].charAt(0)}.${coins[1].substring(1,2)}`
        }
        $("#coinTotal").html(`<div class="num">${coins[0]}g, ${coins[1]}s</div>`);

        console.log(netWorth);
        netWorth = (netWorth / 10) + "";
        netWorth = netWorth.split(".");
        if (parseInt(netWorth[1]) > 9) {
            netWorth[1] = `${netWorth[1].charAt(0)}.${netWorth[1].substring(1,2)}`
        }
        $("#netWorth").html(`<div class="num">${netWorth[0]}g, ${netWorth[1]}s</div>`);
    });
    return response;
}

function snackBar() {
    var x = document.getElementById("snackbar");
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

window.onload = async function() {
    await getData();
    $("#inventoryForm").on("submit", saveData);
    $("#coinSubmit").click(addCoins);
}
