document.addEventListener("DOMContentLoaded", function () {
  populateCurrentDateTime();
  setupIngredientTracking();
  setupMealTracking();
  //displayIntakeRecords();
  fetchAndPopulateMeals();
  setupSearchButton();
  fetchAndDisplayIntakeRecords();
});

let allIngredients = [];  // This will store all fetched ingredients

function populateCurrentDateTime() {
  const mealTimeInput = document.getElementById("mealTime");
  const drinkTimeInput = document.getElementById("drinkTime");

  const currentDate = new Date();
  const date = currentDate.toISOString().slice(0, 10);
  const time = currentDate.toTimeString().slice(0, 5);
  const dateTime = `${date}T${time}`;

  mealTimeInput.value = dateTime;
  drinkTimeInput.value = dateTime;
}

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
          const meals = data.meals;  // Ensure your backend sends an object with a `meals` key
          meals.forEach(meal => {
              const option = document.createElement('option');
              option.value = meal.id;
              option.text = meal.name;
              select.appendChild(option);
          });
      })
      .catch(error => console.error('Error fetching meals:', error));
}

function setupMealTracking() {
    const trackMealForm = document.getElementById("trackMealForm");
    trackMealForm.addEventListener("submit", function (event) {
        event.preventDefault();
  
        navigator.geolocation.getCurrentPosition(function (position) {
            // Successfully retrieved the position
            const { latitude, longitude } = position.coords;
            const location = `${latitude}, ${longitude}`; // Format location as a string
  
            const mealDropdown = document.getElementById('meal-dropdown');
            const mealId = mealDropdown.options[mealDropdown.selectedIndex].value;
            const weight = document.getElementById('mealWeight').value;
            const datetime = new Date(document.getElementById('mealTime').value).toISOString(); // Format datetime
  
            const waterVolume = document.getElementById('drinkVolume').value; // Get water volume
            const waterDatetime = new Date(document.getElementById('drinkTime').value).toISOString(); // Format water datetime
  
            const data = {
                mealId,
                weight,
                datetime,
                location,
                waterVolume, // Include water volume in the data
                waterDatetime // Include water datetime in the data
            };

  
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
            // Error in retrieving position
            console.error('Error getting location:', error);
            alert('Error getting location, please ensure you have granted location access.');
        });
    });
  }
  

function setupIngredientTracking() {
  const ingredientsListElement = document.getElementById("ingredientsList");
  if (!ingredientsListElement) {
      console.error("The ingredients list element doesn't exist!");
      return;
  }
  fetchAndDisplayIngredients(ingredientsListElement);
}

function fetchAndDisplayIngredients(ingredientsListElement) {
  fetch("https://nutrimonapi.azurewebsites.net/api/FoodItems", {
      headers: { "X-API-Key": "168890" }
  })
  .then(response => response.json())
  .then(data => {
      allIngredients = data;  // Store all fetched ingredients
      console.log("All Ingredients Loaded:", allIngredients); // Check what's loaded
      renderIngredientsList(data.slice(0, 5), ingredientsListElement);
  })
  .catch(error => console.error("Error fetching data:", error));
}
function setupSearchButton() {
  const searchButton = document.getElementById("search-button");
  const searchBox = document.getElementById("search-box");
  searchButton.addEventListener("click", function (event) {
      event.preventDefault();
      const filteredIngredients = filterIngredients(searchBox.value).slice(0, 5);  // Slice the results to display only the top 5
      const ingredientsListElement = document.getElementById("ingredientsList");
      renderIngredientsList(filteredIngredients, ingredientsListElement);
  });
}


function filterIngredients(query) {
  return allIngredients.filter(ingredient => {
      return ingredient.foodName && ingredient.foodName.toLowerCase().includes(query.toLowerCase());
  });
}

function renderIngredientsList(ingredients, ingredientsListElement) {
  ingredientsListElement.innerHTML = '';  // Clear the list first

  ingredients.forEach(ingredient => {
      const listItem = document.createElement('li');
      listItem.textContent = ingredient.foodName;

      const amountInput = document.createElement('input');
      amountInput.type = 'number';
      amountInput.placeholder = 'Amount (g)';
      listItem.appendChild(amountInput);

      const addButton = document.createElement('button');
      addButton.textContent = 'Add';
      // Ensure you pass the correct foodID and foodName when the Add button is clicked
      addButton.onclick = () => {
          if(amountInput.value) { // Check if amount is entered before proceeding
              addIngredient(ingredient.foodName, ingredient.foodID, amountInput.value);
          } else {
              alert('Please enter a valid amount');
          }
      };
      listItem.appendChild(addButton);

      ingredientsListElement.appendChild(listItem);
  });
}



// Function to fetch calorie data for a specific food item
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
          return parseFloat(data[0].resVal);  // Convert the result to a floating point number
      } else {
          throw new Error('Calorie data not found in the response');
      }
  } catch (error) {
      console.error("Error fetching calorie data:", error);
      return 0;  // Return a default value, adjust as needed
  }
}

async function addIngredient(ingredientName, foodID, amount) {
  if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
  }

  navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const location = `${latitude}, ${longitude}`;

      try {
          const calories = await fetchCalories(foodID);  // Fetch calories
          const totalCalories = (calories / 100) * amount;  // Calculate total calories based on the amount

          const ingredientData = {
              userId: 1,  // This will be overwritten by the server using session data
              ingredient: ingredientName,
              weight: parseFloat(amount),
              datetime: new Date().toISOString(),
              location: location,
              totalCalories: totalCalories  // Add totalCalories to the data sent
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

function fetchAndDisplayIntakeRecords() {
  fetch('/meal-tracker/intake-records')
      .then(response => response.json())
      .then(data => {
          console.log(data); // Check the structure of the data
          if (Array.isArray(data.intakeRecords)) {
              displayIntakeRecords(data.intakeRecords);
          } else {
              console.error("Received data is not an array:", data.intakeRecords);
          }
      })
      .catch(error => console.error('Error fetching intake records:', error));
}


function displayIntakeRecords(records) {
  const recordsContainer = document.querySelector('.intake-records');
  recordsContainer.innerHTML = '<h3>Your Intake Records</h3>'; // Clear any existing content

  records.forEach(record => {
      const recordDiv = document.createElement('div');
      recordDiv.className = 'record';

      const recordSpan = document.createElement('span');
      recordSpan.textContent = `${record.mealName} - ${record.weight}g at ${new Date(record.datetime).toLocaleString()}, ${record.TotalCalories} kcal`;

      const editButton = document.createElement('button');
      editButton.textContent = 'Edit';
      editButton.className = 'edit';
      // Optionally add onClick for edit functionality

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.className = 'delete';
      // Optionally add onClick for delete functionality

      recordDiv.appendChild(recordSpan);
      recordDiv.appendChild(editButton);
      recordDiv.appendChild(deleteButton);

      recordsContainer.appendChild(recordDiv);
  });
}



