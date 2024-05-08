// Opret en global variabel til at gemme brugerprofilen
let userProfile = {};

// Når HTML-dokumentet er fuldt indlæst, hentes og vises brugerens profil
document.addEventListener('DOMContentLoaded', async function() {
    // Hent brugerens profilinformation
    try {
        const response = await fetch('/users/profile', {
            method: 'GET',
            credentials: 'same-origin' // Inkludér sessionoplysninger i anmodningen
        });
        if (!response.ok) {
            // Hvis der er en fejl i svaret, kast en fejl
            throw new Error('Failed to fetch user profile');
        }
        // Konverter svaret til JSON og opdater UI
        const profileData = await response.json();
        console.log('User profile data:', profileData);
        updateProfileUI(profileData);
    } catch (error) {
        // Log fejlmeddelelsen, hvis anmodningen mislykkes
        console.error('Error fetching user profile:', error);
    }

    // Tilføj en event listener til formularen for at opdatere profilen
    document.getElementById('edit-profile-form').addEventListener('submit', async function(event) {
        // Forhindre standardformularens indsendelsesadfærd
        event.preventDefault();

        // Hent formulardata som et FormData-objekt
        const formData = new FormData(this);

        // Uddrag brugerprofildata fra formularen
        const updatedProfileData = {
            username: formData.get('username'),
            email: formData.get('email'),
            weight: formData.get('weight'),
            age: formData.get('age'),
            gender: formData.get('gender')
        };

        // Kontrollér, om nogen af formularfelterne er blevet ændret
        const isProfileChanged = Object.keys(updatedProfileData).some(key => {
            return updatedProfileData[key] !== userProfile[key];
        });

        // Hvis profilen er blevet ændret, opdater den via en PUT-anmodning
        if (isProfileChanged) {
            try {
                // Send en PUT-anmodning for at opdatere profilen
                const response = await fetch('/users/update-profile', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedProfileData),
                    credentials: 'same-origin'
                });
        
                if (!response.ok) {
                    // Hvis svaret ikke er OK, kast en fejl
                    throw new Error('Failed to update profile');
                }
        
                // Log succesmeddelelsen, hvis opdateringen lykkedes
                console.log('Profile updated successfully');
            } catch (error) {
                // Log fejlmeddelelsen, hvis opdateringen mislykkes
                console.error('Error updating profile:', error);
            }
        } else {
            // Hvis ingen ændringer blev fundet, annullér indsendelsen
            console.log('No changes detected in profile. Form submission cancelled.');
        }
    });

    // Funktion til at opdatere UI med profilinformation
    function updateProfileUI(profileData) {
        console.log('Updating profile UI with profile data:', profileData);

        // Uddrag brugerprofil fra det modtagne dataobjekt
        userProfile = profileData.profile;

        // Kontrollér, om userProfile tildeles korrekt
        console.log('User profile:', userProfile);

        // Opdater inputfelterne med brugerprofilens data
        document.getElementById('username').value = userProfile.Username || '';
        console.log('Username field value:', document.getElementById('username').value);
        document.getElementById('email').value = userProfile.Email || '';
        console.log('Email field value:', document.getElementById('email').value);
        document.getElementById('weight').value = userProfile.Weight || '';
        console.log('Weight field value:', document.getElementById('weight').value);
        document.getElementById('age').value = userProfile.Age || '';
        console.log('Age field value:', document.getElementById('age').value);

        // Opdater kønsvalget baseret på profildata
        const genderSelect = document.getElementById('gender');
        if (userProfile.gender === 'male') {
            genderSelect.value = 'male';
        } else if (userProfile.gender === 'female') {
            genderSelect.value = 'female';
        }

        // Log, at UI-opdateringen er fuldført
        console.log('Profile UI update completed');
    }
});
