document.addEventListener('DOMContentLoaded', function() {
    updateNutriDashboard();
});

function updateNutriDashboard() {
    const todayDate = new Date().toISOString().split('T')[0];
    let mealsToday = 0, energyToday = 0, waterToday = 0, proteinToday = 0;

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('trackedMeal-')) {
            const mealRecord = JSON.parse(localStorage.getItem(key));
            const recordDate = new Date(mealRecord.time).toISOString().split('T')[0];

            if (recordDate === todayDate) {
                mealsToday += 1;
                energyToday += mealRecord.nutrients.kcal || 0;
                waterToday += mealRecord.drink || 0;
                proteinToday += mealRecord.nutrients.protein || 0;
            }
        }
    }

    // Opdater dashboard elementer.
    document.getElementById('mealsToday').textContent = mealsToday;
    document.getElementById('energyToday').textContent = `${energyToday.toFixed(0)} kcal`;
    document.getElementById('waterToday').textContent = `${waterToday.toFixed(1)} L`;
    document.getElementById('proteinToday').textContent = `${proteinToday.toFixed(0)} g`;
}
