document.addEventListener("DOMContentLoaded", function () {
  // Hent elementet for måltidstabellens krop
  const mealTableBody = document.getElementById("meal-table-body");

  // Funktion til at beregne næringsstofværdier pr. 100g af et måltid
  function calculateNutrientValuesPer100g(meal) {
    // Beregn den samlede vægt af måltidet
    const totalWeight = meal.ingredients.reduce(
      (total, ingredient) => total + ingredient.amount,
      0
    );

    // Beregn de faktiske næringsstofindhold for måltidet
    const totalNutrients = meal.ingredients.reduce(
      (totals, ingredient) => {
        // Her justerer vi næringsstofindholdet baseret på den anvendte mængde
        totals.kulhydrater +=
          (ingredient.nutrients.kulhydrater * ingredient.amount) / 100;
        totals.protein +=
          (ingredient.nutrients.protein * ingredient.amount) / 100;
        totals.fedt += (ingredient.nutrients.fedt * ingredient.amount) / 100;
        totals.vand += (ingredient.nutrients.vand * ingredient.amount) / 100;
        totals.calories +=
          (ingredient.nutrients.kalorier * ingredient.amount) / 100;
        return totals;
      },
      { kulhydrater: 0, protein: 0, fedt: 0, vand: 0, calories: 0 }
    );

    // Normaliser det samlede næringsstofindhold for at få indholdet pr. 100g af måltidet
    return {
      kulhydrater: (totalNutrients.kulhydrater / totalWeight) * 100,
      protein: (totalNutrients.protein / totalWeight) * 100,
      fedt: (totalNutrients.fedt / totalWeight) * 100,
      vand: (totalNutrients.vand / totalWeight) * 100,
      calories: (totalNutrients.calories / totalWeight) * 100,
    };
  }

  // Funktion til at få den samlede vægt af et måltid
  function getTotalWeight(meal) {
    return meal.ingredients.reduce((total, ingredient) => {
      return total + ingredient.amount;
    }, 0);
  }

  // Funktion til at vise måltider
  function displayMeals() {
    mealTableBody.innerHTML = ""; // Ryd eksisterende rækker

    // Fetch meals from backend
    fetch('/meal-overview/meals')
      .then(response => response.json())
      .then(data => {
        console.log('Meals fetched:', data);
        // Loop through fetched meals and display them
        data.forEach(meal => {
          const totalWeight = getTotalWeight(meal);
          const nutrientValuesPer100g = calculateNutrientValuesPer100g(
            meal,
            totalWeight
          );

          // Opret en ny række med måltidsdata
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${meal.name}</td>
            <td>${nutrientValuesPer100g.calories.toFixed(2)} Kcal/100g</td>
            <td>${meal.ingredients.length}</td>
            <td>N/A</td> <!-- Placeholder for Times Eaten -->
            <td>Carbohydrates: ${nutrientValuesPer100g.kulhydrater.toFixed(
              2
            )}g, Protein: ${nutrientValuesPer100g.protein.toFixed(
              2
            )}g, Fat: ${nutrientValuesPer100g.fedt.toFixed(
              2
            )}g, Water: ${nutrientValuesPer100g.vand.toFixed(2)}g</td>
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

  displayMeals(); // Initial visning af måltider
});
