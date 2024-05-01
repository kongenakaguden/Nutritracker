document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM content loaded');

    // Function to fetch user profile information
    async function fetchProfile() {
        console.log('Fetching user profile...');
        try {
            const response = await fetch('/users/profile', {
                method: 'GET',
                credentials: 'same-origin' // Include credentials in the request
            });
            if (!response.ok) {
                throw new Error('Failed to fetch user profile');
            }
            const profileData = await response.json();
            console.log('User profile data:', profileData);
            updateProfileUI(profileData);
        } catch (error) {

            console.error('Error fetching user profile:', error);
        }
    }

// Function to update the UI with profile data
function updateProfileUI(profileData) {
    console.log('Updating profile UI with profile data:', profileData);

    // Extract user profile data from profileData object
    const userProfile = profileData.profile;

    // Update profileInfo div with userProfile data
    const profileInfoDiv = document.getElementById('profileInfo');

    // Clear any existing content
    profileInfoDiv.innerHTML = '';

    // Iterate through each property in userProfile and construct a string representation
    for (const key in userProfile) {
        if (Object.hasOwnProperty.call(userProfile, key)) {
            const value = userProfile[key];
            // Construct a string representation of the property and its value
            const propertyString = `${key}: ${value}`;
            // Create a new paragraph element
            const paragraph = document.createElement('p');
            // Set the text content of the paragraph to the constructed string
            paragraph.textContent = propertyString;
            // Append the paragraph to the profileInfo div
            profileInfoDiv.appendChild(paragraph);

            // Log the property and its value
            console.log(`Added property '${key}' with value '${value}' to profile UI`);
        }
    }

    document.getElementById('logout-button').addEventListener('click', async function() {
        try {
            // Send POST request to logout endpoint
            const response = await fetch('/users/logout', {
                method: 'POST',
                credentials: 'same-origin'
            });

            if (!response.ok) {
                throw new Error('Failed to log out');
            }

            // Handle successful response
            console.log('Logged out successfully');
            window.location.href = '/login'; 
        } catch (error) {
            console.error('Error logging out:', error);
        }
    });
    console.log('Profile UI update completed');
}

    // Initialize profile page
    console.log('Initializing profile page...');
    fetchProfile();
});
