// Definerer basis URL'er for API-kald
const searchFromString = 'https://nutrimonapi.azurewebsites.net/api/FoodItems/BySearch/';
const foodInformation = 'https://nutrimonapi.azurewebsites.net/api/FoodItems/';
const apiKey = "168990";

// Finder knappen i DOM'en
let button = document.getElementById("searchButton");

// Asynkron funktion til at hente fødevareID baseret på søgeord
async function fetchFoodID() {
    // Henter søgeinput og formatterer det
    let searchInput = document.getElementById("searchInput").value;
    let inputWord = searchInput.charAt(0).toUpperCase() + searchInput.slice(1);

    try {
        // Udfører et API-kald for at finde fødevare baseret på søgeord
        let response = await fetch(searchFromString + inputWord, {
            method: 'GET',
            headers: {
                'X-API-Key': apiKey
            }
        });

        if (response.status !== 200) {
            throw new Error("Request not successful");
        }

        let data = await response.json();

        // Opdaterer DOM med fødevarenavn og ID
        if (data.length > 0) {
            document.getElementById("foodName").innerText = data[0].foodName;
            document.getElementById("productID").innerText = data[0].foodID;
            return data[0].foodID;
        } else {
            throw new Error("No food items found");
        }
    } catch (error) {
        console.error("Error fetching food ID:", error);
    }
}

// Tilføjer en event listener til søgeknappen
document.getElementById("searchButton").addEventListener("click", fetchFoodID);

// Asynkron funktion til at hente ernæringsoplysninger
async function fetchNutrition(sortKey, id) {
    try {
        let foodID = await fetchFoodID();
        let response = await fetch(`https://nutrimonapi.azurewebsites.net/api/FoodCompSpecs/ByItem/${foodID}/BySortKey/${sortKey}`, {
            method: 'GET',
            headers: {
                'X-API-Key': apiKey, 
                'FoodID': foodID,
                'SortKey': sortKey
            }
        });

        if (response.status !== 200) {
            throw new Error("Request not successful");
        }

        let data = await response.json();

        if (typeof data !== "object") {
            throw new Error("Data is not an object");
        }

        // Konverterer og afrunder ernæringsværdier
        let result = parseInt(data[0].resVal);
        result = Math.round(result);
        result = result.toString();

        // Opdaterer DOM med ernæringsoplysninger
        if (sortKey === "1030" || sortKey === "1010") {
            document.getElementById(id).innerText = result + ' kcal';
        } else {
            document.getElementById(id).innerText = `${result} g`;
        }
    } catch (error) {
        console.error("Error fetching nutrition data:", error);
    }
}

// Tilføjer event listener til søgeknappen for at hente flere ernæringsdata
document.getElementById("searchButton").addEventListener("click", async () => {
    try {
        await fetchNutrition("1010", "energyKj");
        await fetchNutrition("1030", "energyKcal");
        await fetchNutrition("1110", "protein");
        await fetchNutrition("1240", "fibre");
        await fetchNutrition("1310", "fedt");
        await fetchNutrition("1220", "kulhydrater");
        await fetchNutrition("1620", "vand");
        await fetchNutrition("1610", "tørstof");
    } catch (error) {
        console.error("Error in button click event:", error);
    }
});

// Asynkron funktion til at hente taksonomisk navn og fødevaregruppe
async function taxNameAndFoodGroup() {
    try {
        let foodID = await fetchFoodID();

        let response = await fetch(`https://nutrimonapi.azurewebsites.net/api/FoodItems/${foodID}`, {
            method: 'GET',
            headers: {
                'X-API-Key': apiKey,
                'FoodID': foodID
            }
        });

        if (response.status !== 200) {
            throw new Error("Request not successful");
        }

        let data = await response.json();

        // Opdaterer DOM med taksonomisk navn og fødevaregruppe
        document.getElementById("taxonomic").innerText = data.taxonomicName;
        document.getElementById("foodGroup").innerText = data.foodGroup;
    } catch (error) {
        console.error("Error fetching taxonomic name and food group:", error);
    }
}

// Tilføjer event listener til søgeknappen for at hente taksonomisk navn og fødevaregruppe
document.getElementById("searchButton").addEventListener("click", taxNameAndFoodGroup);
