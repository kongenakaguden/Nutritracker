// Når hele HTML-dokumentet er indlæst, opdateres dashboardet med 'hourly'-visningen
document.addEventListener('DOMContentLoaded', function() {
    updateNutriDashboard('hourly');
});

// Skift mellem 'hourly' og 'daily' visning
function toggleView(viewType) {
    updateNutriDashboard(viewType);
}

// Opdater dashboardet baseret på valgte visningstype
async function updateNutriDashboard(viewType) {
    // Find dashboard-elementet og ryd tidligere indhold
    const dashboardContent = document.getElementById('dashboardContent');
    dashboardContent.innerHTML = ''; // Ryd tidligere indhold

    // Opdater indholdet baseret på den valgte visningstype
    if (viewType === 'hourly') {
        await renderHourlyView(dashboardContent);
    } else if (viewType === 'daily') {
        await renderDailyView(dashboardContent);
    }
}

// Render 'hourly'-visningen med data fra timebasis
async function renderHourlyView(container) {
    // Hent timebaseret ernæringsdata
    const hourlyData = await getHourlyNutritionData();
    console.log('Hourly data:', hourlyData); // Log de modtagne data

    // Opret en tabel med kolonneoverskrifter for 'hourly'-data
    const table = document.createElement('table');
    table.innerHTML = `
        <tr>
            <th>Hour</th>
            <th>Energy (kcal)</th>
            <th>Water (mL)</th>
            <th>Calories Burned (kcal)</th>
        </tr>
    `;
    // Gennemgå time-dataene og tilføj en række for hver time
    hourlyData.forEach(data => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${data.Hour}</td>
            <td>${data.Energy}</td>
            <td>${data.Water || 'N/A'}</td>
            <td>${data.CaloriesBurned || 'N/A'}</td>
        `;
        table.appendChild(row);
    });
    // Tilføj tabellen til dashboardet
    container.appendChild(table);
}

// Render 'daily'-visningen med data fra dagsbasis
async function renderDailyView(container) {
    // Hent daglig ernæringsdata
    const dailyData = await getDailyNutritionData();
    console.log('Daily data:', dailyData); // Log de modtagne data

    // Opret en tabel med kolonneoverskrifter for 'daily'-data
    const table = document.createElement('table');
    table.innerHTML = `
        <tr>
            <th>Date</th>
            <th>Total Energy (kcal)</th>
            <th>Total Water (L)</th>
            <th>Total Calories Burned (kcal)</th>
            <th>Caloric Balance</th>
        </tr>
    `;
    // Gennemgå daglige data og tilføj en række for hver dag
    dailyData.forEach(data => {
        const energyIntake = data.TotalEnergy;
        const caloriesBurned = data.TotalCaloriesBurned || 0; // Standard til 0, hvis ikke defineret
        const caloricBalance = energyIntake - caloriesBurned;
        const caloricStatus = caloricBalance > 0 ? 'Surplus' : 'Deficit';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(data.Date).toLocaleDateString()}</td>
            <td>${energyIntake}</td>
            <td>${data.TotalWater}</td>
            <td>${caloriesBurned}</td>
            <td>${caloricBalance} kcal (${caloricStatus})</td>
        `;
        table.appendChild(row);
    });
    // Tilføj tabellen til dashboardet
    container.appendChild(table);
}

// Funktion til at hente timebaserede ernæringsdata via en API-anmodning
async function getHourlyNutritionData() {
    const response = await fetch('/daily/hourly');
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
}

// Funktion til at hente daglige ernæringsdata via en API-anmodning
async function getDailyNutritionData() {
    const response = await fetch('/daily/daily');
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
}
