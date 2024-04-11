document.addEventListener("DOMContentLoaded", function () {
  populateRecipeSelect();
  displayIntakeRecords();
});

const trackMealForm = document.getElementById("trackMealForm");
const intakeRecordsContainer = document.querySelector(".intake-records");

function populateRecipeSelect() {
  const recipeSelect = document.getElementById("recipeSelect");

  // Funktion til at udfylde dropdown-menuen med opskrifter fra localstorage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key.startsWith("trackedMeal-")) {
      try {
        const meal = JSON.parse(localStorage.getItem(key));
        if (meal && meal.name) {
          const option = new Option(meal.name, meal.name);
          recipeSelect.appendChild(option);
        }
      } catch (e) {
        console.error("Error parsing meal data from localStorage:", e);
      }
    }
  }
}
// Vis de optagede måltider (trackedMeal)
function displayIntakeRecords() {
  intakeRecordsContainer.innerHTML = ""; 

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith("trackedMeal-")) {
      const mealRecord = JSON.parse(localStorage.getItem(key));
      addIntakeRecordToDOM(mealRecord);
    }
  }
}
// Funktion til at tilføje et måltids optagelse til DOM
function addIntakeRecordToDOM(mealRecord) {
  const kcalValue = mealRecord.nutrients.kcal
    ? mealRecord.nutrients.kcal.toFixed(0)
    : "0";

  const recordDiv = document.createElement("div");
  recordDiv.classList.add("record");
  recordDiv.innerHTML = `
        <span>${mealRecord.mealName} - ${mealRecord.weight}g at ${mealRecord.time}, ${kcalValue} kcal</span>
        <button class="delete" onclick="deleteRecord(this.parentElement)">Delete</button>
    `;

  intakeRecordsContainer.appendChild(recordDiv);
}

// Event listener for formular, der registrerer måltidsindtag
trackMealForm.addEventListener("submit", function (event) {
  event.preventDefault();
  // Henter data fra formular og beregner næringsindhold
  const selectedMealName =
    recipeSelect.options[recipeSelect.selectedIndex].value;
  const mealWeight = parseFloat(document.getElementById("mealWeight").value);
  const mealTime = document.getElementById("mealTime").value;
  const drinkVolume = parseFloat(document.getElementById("drinkVolume").value);
  const drinkTime = document.getElementById("drinkTime").value;
  const currentDate = new Date().toISOString().split("T")[0]; //Få data om dagens dato
  const combinedDateTime = `${currentDate}T${mealTime}`; // Kombiner dato og tid
  // Find det valgte måltid i localStorage
  let selectedMealData = null;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key.startsWith("trackedMeal-")) {
      const mealData = JSON.parse(localStorage.getItem(key));
      if (mealData.name === selectedMealName) {
        selectedMealData = mealData;
        break;
      }
    }
  }

  if (!selectedMealData || !selectedMealData.ingredients) {
    alert("Selected meal data not found or incomplete!");
    return;
  }

  // Udregn det samlede næringsindhold for et måltid
  let totalNutrients = { kcal: 0, protein: 0, fat: 0, fibre: 0 };
  selectedMealData.ingredients.forEach((ingredient) => {
    totalNutrients.kcal += ingredient.nutrients.kalorier || 0;
    totalNutrients.protein += ingredient.nutrients.protein || 0;
    totalNutrients.fat += ingredient.nutrients.fedt || 0;
    totalNutrients.fibre += ingredient.nutrients.fibre || 0; 
  });

  // Ændre næring baseret på måltidets vægt.
  const nutrientMultiplier = mealWeight / 100;
  const nutrients = {
    kcal: totalNutrients.kcal * nutrientMultiplier,
    protein: totalNutrients.protein * nutrientMultiplier,
    fat: totalNutrients.fat * nutrientMultiplier,
    fibre: totalNutrients.fibre * nutrientMultiplier,
  };
  // Opretter et måltids optagelsesrecord
  const mealRecord = {
    id: Date.now(),
    mealName: selectedMealName,
    weight: mealWeight,
    time: mealTime,
    drink: drinkVolume,
    drinkTime: drinkTime,
    nutrients: nutrients,
    time: combinedDateTime, 
  };

  const timestamp = new Date().toISOString().replace(/[-:.T]/g, "");
  const trackedMealKey = `trackedMeal-${timestamp}`;

  localStorage.setItem(trackedMealKey, JSON.stringify(mealRecord));

  addIntakeRecordToDOM(mealRecord);
  trackMealForm.reset();
});

function deleteRecord(recordDiv) {
  const recordId = recordDiv.dataset.id;
  localStorage.removeItem(recordId);
  recordDiv.remove();
}
