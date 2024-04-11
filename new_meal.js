// Når dokumentet er indlæst, udfør følgende funktion
document.addEventListener("DOMContentLoaded", function () {
    // Henter elementer fra DOM
    const ingredientsListElement = document.getElementById("ingredientsList");
    const selectedIngredientsElement = document.getElementById("selected-ingredients");
    const searchBox = document.getElementById("search-box");
    const searchButton = document.getElementById("search-button");
    const refreshButton = document.getElementById("refresh");

    // Initialiserer variabler til opbevaring af ingredienser og det aktuelle måltid
    let allIngredients = [];
    let currentMeal = {
        name: "",
        ingredients: []
    };

    // Tilføjer event listener til inputfelt for måltidsnavn
    const mealNameInput = document.getElementById("mealName");
    mealNameInput.addEventListener("input", function () {
        currentMeal.name = mealNameInput.value;
    });

    // Funktion til at hente og vise ingredienser
    function fetchAndDisplayIngredients() {
        fetch("https://nutrimonapi.azurewebsites.net/api/FoodItems", {
            headers: {
                "X-API-Key": "168890"
            }
        })
        .then(response => response.json())
        .then(data => {
            allIngredients = data;
            renderIngredientsList(allIngredients.slice(0, 5));
        })
        .catch(error => console.error("Error fetching data:", error));
    };

    // Funktion til at vise en liste over ingredienser
    function renderIngredientsList(ingredients) {
        ingredientsListElement.innerHTML = '';
        ingredients.forEach(ingredient => {
            let listItem = document.createElement('li');
            listItem.textContent = ingredient.foodName;

            let amountInput = document.createElement('input');
            amountInput.type = 'number';
            amountInput.placeholder = 'Mængde (g)';
            amountInput.className = 'ingredient-amount';
            listItem.appendChild(amountInput);

            let addButton = document.createElement('button');
            addButton.textContent = 'Tilføj';
            addButton.onclick = function() { addIngredientToMeal(ingredient, amountInput.value); };
            listItem.appendChild(addButton);

            ingredientsListElement.appendChild(listItem);
        });
    };

    // Asynkron funktion til at tilføje en ingrediens til måltidet
    async function addIngredientToMeal(ingredient, amountStr) {
        const amount = parseFloat(amountStr); // Konverterer mængden til et flydende tal
    
        if (isNaN(amount) || amount <= 0) {
            alert('Indtast venligst en gyldig mængde');
            return;
        }
    
        let nutrientValues = await getNutrientValues(ingredient.foodID, amount);
    
        let listItem = document.createElement('li');
        listItem.textContent = `${ingredient.foodName} - ${amount}g, Kulhydrater: ${nutrientValues.kulhydrater}g, Protein: ${nutrientValues.protein}g, Fedt: ${nutrientValues.fedt}g, Kalorier: ${nutrientValues.kalorier}g, Vand: ${nutrientValues.vand}g`;
    
        let removeButton = document.createElement('button');
        removeButton.textContent = 'Fjern';
        removeButton.onclick = function() { listItem.remove(); };
        listItem.appendChild(removeButton);
    
        selectedIngredientsElement.appendChild(listItem);
    
        currentMeal.ingredients.push({ 
            foodName: ingredient.foodName, 
            amount: amount,
            nutrients: nutrientValues
        });
    };
    
    // Asynkron funktion til at hente næringsværdier baseret på fødevareID og sortKey
async function fetchNutritionValue(foodID, sortKey) {
    try {
        // Laver et API-kald for at hente næringsværdier
        const response = await fetch(`https://nutrimonapi.azurewebsites.net/api/FoodCompSpecs/ByItem/${foodID}/BySortKey/${sortKey}`, {
            method: 'GET',
            headers: {
                'X-API-Key': '168890'
            }
        });

        // Tjekker for fejl i svaret
        if (!response.ok) {
            throw new Error(`API-opkald fejlede: ${response.status}`);
        }

        // Parser svaret til JSON
        const data = await response.json();

        // Tjekker om data indeholder de ønskede værdier
        if (data.length > 0 && data[0].resVal) {
            return parseFloat(data[0].resVal); // Konverterer resultatet til et flydende tal
        } else {
            throw new Error('Næringsdata ikke fundet i svaret');
        }
    } catch (error) {
        console.error("Fejl ved hentning af næringsdata:", error);
        return 0; // Returnerer en standardværdi, justér efter behov
    }
};

// Asynkron funktion til at hente næringsværdier for en bestemt ingrediens
async function getNutrientValues(foodID, amount) {
    // Henter individuelle næringsværdier
    let carbsValue = await fetchNutritionValue(foodID, "1220");
    let proteinValue = await fetchNutritionValue(foodID, "1110");
    let fatValue = await fetchNutritionValue(foodID, "1310");
    let kcalValue = await fetchNutritionValue(foodID, "1030");
    let waterValue = await fetchNutritionValue(foodID, "1620");

    // Returnerer næringsværdier justeret for mængde
    return {
        kulhydrater: (carbsValue / 100) * amount,
        protein: (proteinValue / 100) * amount,
        fedt: (fatValue / 100) * amount,
        kalorier: (kcalValue / 100) * amount,
        vand: (waterValue / 100) * amount
    };
};

// Tilføjer event listener til knappen for at gemme det aktuelle måltid
const saveMealButton = document.getElementById("saveMealButton");
saveMealButton.addEventListener("click", function () {
    // Tjekker om måltid har navn og ingredienser før gemning
    if (currentMeal.name && currentMeal.ingredients.length > 0) {
        localStorage.setItem(currentMeal.name, JSON.stringify(currentMeal));
        alert("Måltid gemt!");
        currentMeal = { name: "", ingredients: [] };
    } else {
        alert("Tilføj venligst et navn og mindst en ingrediens til måltidet.");
    }
})

// Funktion til at filtrere ingredienser baseret på en søgeforespørgsel
function filterIngredients(query) {
    return allIngredients.filter(ingredient => {
        return ingredient.foodName && ingredient.foodName.toLowerCase().includes(query.toLowerCase());
    });
}

// Tilføjer event listeners til søge- og opdateringsknapper
searchButton.addEventListener("click", function (event) {
    event.preventDefault();
    const filteredIngredients = filterIngredients(searchBox.value);
    renderIngredientsList(filteredIngredients.slice(0, 5));
});

refreshButton.addEventListener("click", function (event) {
    event.preventDefault();
    fetchAndDisplayIngredients();
});

// Udfører initial visning af ingredienser
fetchAndDisplayIngredients();
})