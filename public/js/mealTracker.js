// Når hele HTML-dokumentet er indlæst, kør disse funktioner for at opsætte siden
document.addEventListener("DOMContentLoaded", function () {
    populateCurrentDateTime();  // Indstil de nuværende dato- og tidsfelter
    setupIngredientTracking();  // Opsæt ingredienssporingsformularen
    setupMealTracking();  // Opsæt måltidssporingsformularen
    //displayIntakeRecords();  // Valgfri funktion, kommenteret ud
    fetchAndPopulateMeals();  // Hent og udfyld måltidsdropdownen
    setupSearchButton();  // Opsæt søgeknappen
    fetchAndDisplayIntakeRecords();  // Hent og vis tidligere indtagelsesposter
  });
  
  // Global variabel til at gemme alle ingredienser
  let allIngredients = [];
  
  // Indstil de nuværende dato- og tidsfelter
  function populateCurrentDateTime() {
    const mealTimeInput = document.getElementById("mealTime");
    const drinkTimeInput = document.getElementById("drinkTime");
  
    // Indstil dato og tid til den nuværende dato og klokkeslæt
    const currentDate = new Date();
    const date = currentDate.toISOString().slice(0, 10);
    const time = currentDate.toTimeString().slice(0, 5);
    const dateTime = `${date}T${time}`;
  
    // Sæt værdierne i måltids- og drikketidsfelterne
    mealTimeInput.value = dateTime;
    drinkTimeInput.value = dateTime;
  }
  
  // Hent måltider fra serveren og udfyld måltidsdropdownen
  function fetchAndPopulateMeals() {
    const select = document.getElementById('meal-dropdown');
    if (!select) {
        console.error("Meal dropdown element not found!");
        return;
    }
  
    console.log("fetching meals");
    fetch('/meal-tracker/meals')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            return response.json();
        })
        .then(data => {
            console.log("Meals fetched", data);
            const meals = data.meals;  // Forventet nøgle i svaret
            meals.forEach(meal => {
                // Opret en ny mulighed for hvert måltid og tilføj til dropdownen
                const option = document.createElement('option');
                option.value = meal.id;
                option.text = meal.name;
                select.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching meals:', error));
  }
  
  // Opsæt måltidssporingsformularen
  function setupMealTracking() {
    const trackMealForm = document.getElementById("trackMealForm");
    trackMealForm.addEventListener("submit", function (event) {
        // Forhindr standardformularindsendelsen
        event.preventDefault();
  
        // Hent brugerens nuværende placering
        navigator.geolocation.getCurrentPosition(function (position) {
            const { latitude, longitude } = position.coords;
            const location = `${latitude}, ${longitude}`;
  
            // Hent værdier fra formularfelterne
            const mealDropdown = document.getElementById('meal-dropdown');
            const mealId = mealDropdown.options[mealDropdown.selectedIndex].value;
            const weight = document.getElementById('mealWeight').value;
            const datetime = new Date(document.getElementById('mealTime').value).toISOString();
  
            const waterVolume = document.getElementById('drinkVolume').value;
            const waterDatetime = new Date(document.getElementById('drinkTime').value).toISOString();
  
            // Opret JSON-data til POST-anmodningen
            const data = {
                mealId,
                weight,
                datetime,
                location,
                waterVolume,
                waterDatetime
            };
  
            // Send dataene til serveren for at registrere måltidet
            fetch('/meal-tracker/track-meal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Meal tracked successfully:', data);
                alert('Meal tracked successfully!');
            })
            .catch(error => console.error('Error:', error));
  
        }, function (error) {
            console.error('Error getting location:', error);
            alert('Error getting location, please ensure you have granted location access.');
        });
    });
  }
  
  // Opsæt ingredienssporingsformularen
  function setupIngredientTracking() {
    const ingredientsListElement = document.getElementById("ingredientsList");
    if (!ingredientsListElement) {
        console.error("The ingredients list element doesn't exist!");
        return;
    }
    fetchAndDisplayIngredients(ingredientsListElement);
  }
  
  // Hent og vis ingredienser i listen
  function fetchAndDisplayIngredients(ingredientsListElement) {
    fetch("https://nutrimonapi.azurewebsites.net/api/FoodItems", {
        headers: { "X-API-Key": "168890" }
    })
    .then(response => response.json())
    .then(data => {
        allIngredients = data;  // Gem alle hentede ingredienser
        console.log("All Ingredients Loaded:", allIngredients); 
        renderIngredientsList(data.slice(0, 5), ingredientsListElement);
    })
    .catch(error => console.error("Error fetching data:", error));
  }
  
  // Opsæt søgeknappen
  function setupSearchButton() {
    const searchButton = document.getElementById("search-button");
    const searchBox = document.getElementById("search-box");
    searchButton.addEventListener("click", function (event) {
        event.preventDefault();
        // Filtrér ingredienser og vis kun de første fem
        const filteredIngredients = filterIngredients(searchBox.value).slice(0, 5);
        const ingredientsListElement = document.getElementById("ingredientsList");
        renderIngredientsList(filteredIngredients, ingredientsListElement);
    });
  }
  
  // Filtrér ingredienser baseret på en søgeforespørgsel
  function filterIngredients(query) {
    return allIngredients.filter(ingredient => {
        return ingredient.foodName && ingredient.foodName.toLowerCase().includes(query.toLowerCase());
    });
  }
  
  // Vis ingredienserne i en liste
  function renderIngredientsList(ingredients, ingredientsListElement) {
    ingredientsListElement.innerHTML = '';  // Ryd listen først
  
    ingredients.forEach(ingredient => {
        // Opret et listeelement for hver ingrediens
        const listItem = document.createElement('li');
        listItem.textContent = ingredient.foodName;
  
        // Tilføj et inputfelt til at angive mængden
        const amountInput = document.createElement('input');
        amountInput.type = 'number';
        amountInput.placeholder = 'Amount (g)';
        listItem.appendChild(amountInput);
  
        // Tilføj en knap til at tilføje ingrediensen til måltidet
        const addButton = document.createElement('button');
        addButton.textContent = 'Add';
        addButton.onclick = () => {
            if (amountInput.value) {
                addIngredient(ingredient.foodName, ingredient.foodID, amountInput.value);
            } else {
                alert('Please enter a valid amount');
            }
        };
        listItem.appendChild(addButton);
  
        ingredientsListElement.appendChild(listItem);
    });
  }
  
  // Hent kalorieindhold for en specifik ingrediens
  async function fetchCalories(foodID) {
    try {
        const response = await fetch(`https://nutrimonapi.azurewebsites.net/api/FoodCompSpecs/ByItem/${foodID}/BySortKey/1030`, {
            method: 'GET',
            headers: {
                'X-API-Key': '168890'
            }
        });
  
        if (!response.ok) {
            throw new Error(`API call failed: ${response.status}`);
        }
  
        const data = await response.json();
  
        if (data.length > 0 && data[0].resVal) {
            return parseFloat(data[0].resVal);
        } else {
            throw new Error('Calorie data not found in the response');
        }
    } catch (error) {
        console.error("Error fetching calorie data:", error);
        return 0;
    }
  }
  
  // Tilføj en ingrediens til måltidet og spor det
  async function addIngredient(ingredientName, foodID, amount) {
    if (!amount || parseFloat(amount) <= 0) {
        alert('Please enter a valid amount');
        return;
    }
  
    // Hent brugerens placering og opret JSON-data
    navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const location = `${latitude}, ${longitude}`;
  
        try {
            const calories = await fetchCalories(foodID);
            const totalCalories = (calories / 100) * amount;
  
            const ingredientData = {
                userId: 1,  // Dette vil blive overskrevet af serveren ved hjælp af sessiondata
                ingredient: ingredientName,
                weight: parseFloat(amount),
                datetime: new Date().toISOString(),
                location: location,
                totalCalories
            };
  
            fetch('/meal-tracker/track-ingredient', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(ingredientData)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Ingredient tracked successfully:', data);
                alert('Ingredient tracked successfully!');
            })
            .catch(error => console.error('Error:', error));
        } catch (error) {
            console.error('Error fetching calorie data:', error);
            alert('Failed to fetch calorie data');
        }
    }, (error) => {
        console.error('Error getting location:', error);
        alert('Error getting location, please ensure you have granted location access.');
    });
  }
  
  // Hent og vis tidligere indtagelsesposter
  function fetchAndDisplayIntakeRecords() {
    fetch('/meal-tracker/intake-records')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (Array.isArray(data.intakeRecords)) {
                displayIntakeRecords(data.intakeRecords);
            } else {
                console.error("Received data is not an array:", data.intakeRecords);
            }
        })
        .catch(error => console.error('Error fetching intake records:', error));
  }
  
  // Vis indtagelsesposter i UI
  function displayIntakeRecords(records) {
    const recordsContainer = document.querySelector('.intake-records');
    recordsContainer.innerHTML = '<h3>Your Intake Records</h3>'; // Ryd eksisterende indhold

    records.forEach(record => {
        // Opret et div-element for hver post
        const recordDiv = document.createElement('div');
        recordDiv.className = 'record';
        recordDiv.setAttribute('data-id', record.id); // Tilføj data-id attribut med record ID

        // Tilføj information om posten
        const recordSpan = document.createElement('span');
        recordSpan.textContent = `${record.mealName} - ${record.weight}g at ${new Date(record.datetime).toLocaleString()}, ${record.TotalCalories} kcal`;

        // Tilføj redigerings- og sletknapper
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'edit';

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete';

        recordDiv.appendChild(recordSpan);
        recordDiv.appendChild(editButton);
        recordDiv.appendChild(deleteButton);

        recordsContainer.appendChild(recordDiv);
    });

    // Efter records er tilføjet, tilknyt event handlers
    attachEventHandlers();
}

function attachEventHandlers() {
    document.querySelectorAll('.delete').forEach(button => {
        button.removeEventListener('click', handleDelete); // Fjern tidligere event handler for at undgå dobbeltbinding
        button.addEventListener('click', handleDelete); // Tilføj event handler
    });

    document.querySelectorAll('.edit').forEach(button => {
        button.removeEventListener('click', handleEdit); // Fjern tidligere event handler
        button.addEventListener('click', handleEdit); // Tilføj event handler
    });
}

function handleDelete(event) {
    const recordDiv = event.target.closest('.record');
    const recordId = recordDiv.getAttribute('data-id');
    console.log('Deleting record with ID:', recordId); // Log the ID being deleted

    fetch(`/meal-tracker/delete/${recordId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            console.log('Record deleted successfully');
            recordDiv.remove();
        } else {
            throw new Error('Failed to delete the record');
        }
    })
    .catch(error => console.error('Error:', error));
}

function handleEdit(event) {
    const recordDiv = event.target.parentNode;
    const recordId = recordDiv.getAttribute('data-id');
    window.location.href = `/meal-tracker/edit-record/${recordId}`; // Naviger til redigeringssiden
}



  