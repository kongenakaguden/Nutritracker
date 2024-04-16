document.addEventListener('DOMContentLoaded', function() {
    generateNutriReport();
});

function generateNutriReport() {
    const reportTableBody = document.querySelector('.report-container table tbody');
    reportTableBody.innerHTML = ''; // Denne er brugt til at fjerne den række som jeg har skrevet som eksempel.
    const dailyData = {};

    // Loop through localStorage to aggregate data
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('trackedMeal-')) {
            const mealRecord = JSON.parse(localStorage.getItem(key));

            // Extract the date part from the combined date-time property
            const recordDate = new Date(mealRecord.time).toISOString().split('T')[0];

            // Initialize daily data for this date if it doesn't exist
            if (!dailyData[recordDate]) {
                dailyData[recordDate] = { totalMeals: 0, water: 0, kcal: 0, protein: 0, fat: 0, fibre: 0 };
            }

            // Aggregate data for this date
            dailyData[recordDate].totalMeals += 1;
            dailyData[recordDate].water += mealRecord.drink ? parseFloat(mealRecord.drink) : 0;
            dailyData[recordDate].kcal += mealRecord.nutrients.kcal ? parseFloat(mealRecord.nutrients.kcal) : 0;
            dailyData[recordDate].protein += mealRecord.nutrients.protein ? parseFloat(mealRecord.nutrients.protein) : 0;
            dailyData[recordDate].fat += mealRecord.nutrients.fat ? parseFloat(mealRecord.nutrients.fat) : 0;
            dailyData[recordDate].fibre += mealRecord.nutrients.fibre ? parseFloat(mealRecord.nutrients.fibre) : 0;
        }
    }


    // Lav ny række i tabllen for hver dato
    for (const [date, data] of Object.entries(dailyData)) {
        const row = document.createElement('tr');
        //Indsæt data i rækken
        row.innerHTML = `
            <td>${date}</td>
            <td>${data.totalMeals}</td>
            <td>${data.water.toFixed(1)} L</td>
            <td>${data.kcal.toFixed(0)}</td>
            <td>${data.protein.toFixed(0)} g</td>
            <td>${data.fat.toFixed(0)} g</td>
            <td>${data.fibre.toFixed(0)} g</td>
        `;
        reportTableBody.appendChild(row);
    }
}
