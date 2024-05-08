// Vent på, at hele HTML-dokumentet er indlæst
document.addEventListener('DOMContentLoaded', function() {
    // Find aktivitetsformularen og aktivitetsmeddelelsen ved hjælp af deres id'er
    var activityForm = document.getElementById('activityForm');
    var activityMessage = document.getElementById('activityMessage');

    // Tilføj en event listener for 'submit'-begivenheden til aktivitetsformularen
    activityForm.addEventListener('submit', function(event) {
        // Forhindr standardformularindsendelsesadfærd
        event.preventDefault();

        // Find de valgte værdier fra dropdown-menuen og varighedsfeltet
        var activitySelect = document.getElementById('activity');
        var selectedActivity = activitySelect.value;

        var durationInput = document.getElementById('duration');
        var duration = parseFloat(durationInput.value); // Konverter varigheden til et tal

        // Definér en objekt med kalorier pr. time for hver aktivitet
        var activityCaloriesPerHour = {
            "Almindelig gang": 215,
            "Gang ned af trapper": 414,
            "Gang op af trapper": 1079,
            // Flere aktiviteter ...
            "Hugge og slæbe på brænde": 1168
        };

        // Beregn forbrændte kalorier baseret på varighed
        var caloriesBurnedPerHour = activityCaloriesPerHour[selectedActivity];
        var caloriesBurned = (caloriesBurnedPerHour / 60) * duration;

        // Opret et JSON-objekt med dataene, der skal sendes i POST-anmodningen
        var data = {
            activity: selectedActivity,
            duration: duration,
            caloriesBurned: caloriesBurned
        };

        // Lav en POST-anmodning til serveren med de beregnede data
        fetch('/activity/track', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            // Kontroller, om anmodningen lykkedes
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to submit activity data');
            }
        })
        .then(data => {
            // Log succesmeddelelsen, når dataene er blevet indsendt korrekt
            console.log('Activity data submitted successfully:', data);
        })
        .catch(error => {
            // Log fejlen, hvis anmodningen mislykkes
            console.error('Error submitting activity data:', error);
        });

        // Vis resultatet af kalorieberegningen på skærmen
        activityMessage.textContent = `Calories burned for ${duration} minutes of ${selectedActivity}: ${caloriesBurned.toFixed(2)} kcal`;
    });

    // Tilføj en event listener til BMR-beregneren
    document.getElementById('bmrForm').addEventListener('submit', function(event) {
        // Forhindr standardformularindsendelsesadfærd
        event.preventDefault();

        // Hent vægt, alder og køn fra formularen
        const weight = parseFloat(document.getElementById('weight').value);
        const age = parseInt(document.getElementById('age').value);
        const gender = document.getElementById('gender').value;

        let bmr;
        // Beregn BMR baseret på køn
        if (gender === 'male') {
            // Beregn BMR for mænd
            bmr = 10 * weight + 6.25 * age - 5;
        } else if (gender === 'female') {
            // Beregn BMR for kvinder
            bmr = 10 * weight + 6.25 * age - 161;
        }

        // Vis resultatet af BMR-beregningen på skærmen
        document.getElementById('bmrResult').textContent = `Your Basal Metabolic Rate (BMR) is: ${bmr.toFixed(2)} calories per day`;
    });
});
