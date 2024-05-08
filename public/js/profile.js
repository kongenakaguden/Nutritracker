// Når HTML-dokumentet er fuldt indlæst, kør denne kode
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM content loaded');

    // Funktion til at hente brugerens profilinformation
    async function fetchProfile() {
        console.log('Fetching user profile...');
        try {
            // Send en GET-anmodning til serveren for at hente brugerprofilen
            const response = await fetch('/users/profile', {
                method: 'GET',
                credentials: 'same-origin' // Medtag sessionsoplysninger i anmodningen
            });

            // Hvis svaret ikke er OK, kast en fejl
            if (!response.ok) {
                throw new Error('Failed to fetch user profile');
            }

            // Konverter svaret til JSON og log profildata
            const profileData = await response.json();
            console.log('User profile data:', profileData);

            // Opdater UI med profildataene
            updateProfileUI(profileData);
        } catch (error) {
            // Log fejlen, hvis anmodningen mislykkes
            console.error('Error fetching user profile:', error);
        }
    }

    // Funktion til at opdatere brugergrænsefladen med profildata
    function updateProfileUI(profileData) {
        console.log('Updating profile UI with profile data:', profileData);

        // Hent profildata fra JSON-objektet
        const userProfile = profileData.profile;

        // Find profildiv'en og ryd eksisterende indhold
        const profileInfoDiv = document.getElementById('profileInfo');
        profileInfoDiv.innerHTML = '';

        // Gennemgå hver egenskab i userProfile og skab en strengrepræsentation
        for (const key in userProfile) {
            if (Object.hasOwnProperty.call(userProfile, key)) {
                const value = userProfile[key];

                // Opret en strengrepræsentation af egenskaben og dens værdi
                const propertyString = `${key}: ${value}`;

                // Opret et nyt paragraf-element og sæt dets tekst til egenskabsstrengen
                const paragraph = document.createElement('p');
                paragraph.textContent = propertyString;

                // Tilføj paragraf-elementet til profildiv'en
                profileInfoDiv.appendChild(paragraph);

                // Log egenskaben og dens værdi
                console.log(`Added property '${key}' with value '${value}' to profile UI`);
            }
        }

        // Tilføj en event listener til logout-knappen
        document.getElementById('logout-button').addEventListener('click', async function() {
            try {
                // Send en POST-anmodning til serveren for at logge brugeren ud
                const response = await fetch('/users/logout', {
                    method: 'POST',
                    credentials: 'same-origin'
                });

                // Hvis svaret ikke er OK, kast en fejl
                if (!response.ok) {
                    throw new Error('Failed to log out');
                }

                // Log succesmeddelelsen og omdiriger til login-siden
                console.log('Logged out successfully');
                window.location.href = '/login';
            } catch (error) {
                // Log fejlen, hvis logout mislykkes
                console.error('Error logging out:', error);
            }
        });

        console.log('Profile UI update completed');
    }

    // Initialiser profil-siden ved at hente profildata
    console.log('Initializing profile page...');
    fetchProfile();
});
