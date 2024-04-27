document.addEventListener("DOMContentLoaded", function () {
  // Get the meal table body element
  const mealTableBody = document.getElementById("meal-table-body");

  // Function to display meals
  function displayMeals() {
    mealTableBody.innerHTML = ""; // Clear existing rows

    // Fetch meals from the backend
    fetch('meal-overview/meals')
      .then(response => response.json())
      .then(data => {
        console.log('Meals fetched:', data);
        // Loop through fetched meals and display them
        data.forEach(meal => {
          // Create a new row with meal data
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${meal.name}</td>
            <td>${meal.nutrient_values.kalorier.toFixed(2)} Kcal/100g</td>
            <td>${meal.ingredients.length}</td>
            <td>N/A</td> <!-- Placeholder for Times Eaten -->
            <td>Carbohydrates: ${meal.nutrient_values.kulhydrater.toFixed(2)}g, Protein: ${meal.nutrient_values.protein.toFixed(2)}g, Fat: ${meal.nutrient_values.fedt.toFixed(2)}g, Water: ${meal.nutrient_values.vand.toFixed(2)}g</td>
            <td><button class="remove-button" onclick="removeMeal('${meal.id}')">Remove</button></td>
          `;
          mealTableBody.appendChild(row);
        });
      })
      .catch(error => {
        console.error('Error fetching meals:', error);
        alert('Error fetching meals. Please try again later.');
      });
  }

  displayMeals(); // Initial display of meals
});