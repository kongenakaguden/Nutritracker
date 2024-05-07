document.addEventListener('DOMContentLoaded', function() {
    updateNutriDashboard('hourly');
});

function toggleView(viewType) {
    updateNutriDashboard(viewType);
}

async function updateNutriDashboard(viewType) {
    const dashboardContent = document.getElementById('dashboardContent');
    dashboardContent.innerHTML = ''; // Clear previous content

    if (viewType === 'hourly') {
        await renderHourlyView(dashboardContent);
    } else if (viewType === 'daily') {
        await renderDailyView(dashboardContent);
    }
}

async function renderHourlyView(container) {
    const hourlyData = await getHourlyNutritionData();
    console.log('Hourly data:', hourlyData); // Log the received data

    const table = document.createElement('table');
    table.innerHTML = `
        <tr>
            <th>Hour</th>
            <th>Energy (kcal)</th>
            <th>Water (mL)</th>
            <th>Calories Burned (kcal)</th>
        </tr>
    `;
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
    container.appendChild(table);
}


async function renderDailyView(container) {
    const dailyData = await getDailyNutritionData();
    console.log('Daily data:', dailyData); // Log the received data

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
    dailyData.forEach(data => {
        const energyIntake = data.TotalEnergy;
        const caloriesBurned = data.TotalCaloriesBurned || 0; // Default to 0 if undefined
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
    container.appendChild(table);
}




// Placeholder functions to represent data fetching or computation
async function getHourlyNutritionData() {
    const response = await fetch('/daily/hourly');
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
}

async function getDailyNutritionData() {
    const response = await fetch('/daily/daily');
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
}
