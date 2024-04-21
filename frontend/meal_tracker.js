document.addEventListener("DOMContentLoaded", function () {
  populateRecipeSelect();
  displayIntakeRecords();
  populateCurrentDateTime();
  setupEditButtons();
});

const intakeRecordsContainer = document.querySelector(".intake-records");

function addIntakeRecordToDOM(mealRecord) {
  const kcalValue = mealRecord.nutrients.kcal
    ? mealRecord.nutrients.kcal.toFixed(0)
    : "0";

  const recordDiv = document.createElement("div");
  recordDiv.classList.add("record");
  recordDiv.innerHTML = `
        <span>${mealRecord.mealName} - ${mealRecord.weight}g at ${mealRecord.time}, ${kcalValue} kcal</span>
        <button class="delete" data-id="${mealRecord.id}">Delete</button>
    `;

  intakeRecordsContainer.appendChild(recordDiv);
}

const trackMealForm = document.getElementById("trackMealForm");
trackMealForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const formData = new FormData(trackMealForm);
  const formObject = {};
  formData.forEach((value, key) => {
    formObject[key] = value;
  });

  fetch('/api/track-meal', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formObject),
  })
  .then(response => response.json())
  .then(data => {
    addIntakeRecordToDOM(data);
    trackMealForm.reset();
  })
  .catch(error => console.error('Error:', error));
});

intakeRecordsContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("delete")) {
    const recordDiv = event.target.parentElement;
    const recordId = recordDiv.dataset.id;
    fetch(`/api/delete-record/${recordId}`, {
      method: 'DELETE',
    })
    .then(() => {
      recordDiv.remove();
    })
    .catch(error => console.error('Error:', error));
  }
});

function populateRecipeSelect() {
  const recipeSelect = document.getElementById("recipeSelect");

  // Fetch recipes from server
  fetch('/api/recipes')
    .then(response => response.json())
    .then(recipes => {
      recipes.forEach(recipe => {
        const option = new Option(recipe.name, recipe.id);
        recipeSelect.appendChild(option);
      });
    })
    .catch(error => console.error('Error:', error));
}

function displayIntakeRecords() {
  // Fetch intake records from server
  fetch('/api/intake-records')
    .then(response => response.json())
    .then(records => {
      records.forEach(record => {
        addIntakeRecordToDOM(record);
      });
    })
    .catch(error => console.error('Error:', error));
}

function populateCurrentDateTime() {
  const mealTimeInput = document.getElementById("mealTime");
  const drinkTimeInput = document.getElementById("drinkTime");

  // Get current date and time
  const currentDate = new Date();
  const currentTime = currentDate.toTimeString().slice(0, 5); // Extract HH:MM format

  // Autofill time fields
  mealTimeInput.value = currentTime;
  drinkTimeInput.value = currentTime;
}
