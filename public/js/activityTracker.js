document.addEventListener('DOMContentLoaded', function() {
    var activityForm = document.getElementById('activityForm');
    var activityMessage = document.getElementById('activityMessage');

    activityForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission behavior

        var activitySelect = document.getElementById('activity');
        var selectedActivity = activitySelect.value;

        var durationInput = document.getElementById('duration');
        var duration = parseFloat(durationInput.value); // Convert duration to a floating-point number

        // Calories burned per hour for each activity
        var activityCaloriesPerHour = {
            "Almindelig gang": 215,
            "Gang ned af trapper": 414,
            "Gang op af trapper": 1079,
            "Slå græs med manuel græsslåmaskine": 281,
            "Lave mad og redde senge": 236,
            "Luge ukrudt": 362,
            "Rydde sne": 481,
            "Læse eller se TV": 74,
            "Stå oprejst": 89,
            "Cykling i roligt tempo": 310,
            "Tørre støv af": 163,
            "Vaske gulv": 281,
            "Pudse vinduer": 259,
            "Cardio": 814,
            "Hård styrketræning": 348,
            "Badminton": 318,
            "Volleyball": 318,
            "Bordtennis": 236,
            "Dans i højt tempo": 355,
            "Dans i moderat tempo": 259,
            "Fodbold": 510,
            "Rask gang": 384,
            "Golf": 244,
            "Håndbold": 466,
            "Squash": 466,
            "Jogging": 666,
            "Langrend": 405,
            "Løb i moderat tempo": 872,
            "Løb i hurtigt tempo": 1213,
            "Ridning": 414,
            "Skøjteløb": 273,
            "Svømning": 296,
            "Cykling i højt tempo": 658,
            "Bilreparation": 259,
            "Gravearbejde": 414,
            "Landbrugsarbejde": 236,
            "Let kontorarbejde": 185,
            "Male hus": 215,
            "Murerarbejde": 207,
            "Hugge og slæbe på brænde": 1168
        };

        // Calculate calories burned
        var caloriesBurnedPerHour = activityCaloriesPerHour[selectedActivity];
        var caloriesBurned = (caloriesBurnedPerHour / 60) * duration;

        // Create a JSON object with the data to be sent in the POST request
        var data = {
            activity: selectedActivity,
            duration: duration,
            caloriesBurned: caloriesBurned
        };

        // Make a POST request to the server with the calculated data
        fetch('/activity/track', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to submit activity data');
            }
        })
        .then(data => {
            console.log('Activity data submitted successfully:', data);
            // You can do something here if needed, like displaying a success message
        })
        .catch(error => {
            console.error('Error submitting activity data:', error);
            // You can handle errors here, like displaying an error message
        });
    
    
        // Display the result
        activityMessage.textContent = `Calories burned for ${duration} minutes of ${selectedActivity}: ${caloriesBurned.toFixed(2)} kcal`;
    });

   // BMR Calculator
   document.getElementById('bmrForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission behavior

    const weight = parseFloat(document.getElementById('weight').value);
    const age = parseInt(document.getElementById('age').value);
    const gender = document.getElementById('gender').value;

    let bmr;
    if (gender === 'male') {
        // Calculate BMR for males
        bmr = 10 * weight + 6.25 * age - 5;
    } else if (gender === 'female') {
        // Calculate BMR for females
        bmr = 10 * weight + 6.25 * age - 161;
    }

    // Display the BMR result
        document.getElementById('bmrResult').textContent = `Your Basal Metabolic Rate (BMR) is: ${bmr.toFixed(2)} calories per day`;
    });
});