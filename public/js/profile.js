document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM content loaded');

    // Function to fetch user profile information
    async function fetchProfile() {
        console.log('Fetching user profile...');
        try {
            const response = await fetch('/users/profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getTokenFromStorage()}`
                }
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
        // Update profileInfo div with profileData
        // For example:
        // document.getElementById('profileName').innerText = profileData.name;
        // document.getElementById('profileEmail').innerText = profileData.email;
        // ...
    }

    // Function to handle edit profile button click
    document.getElementById('editProfileButton').addEventListener('click', () => {
        console.log('Edit profile button clicked');
        // Redirect to edit profile page or show edit profile form
        window.location.href = 'edit_profile.html'; // Redirect to edit profile page
    });

    // Function to retrieve authentication token from browser storage
    function getTokenFromStorage() {
        console.log('Retrieving authentication token from storage...');
        // Retrieve token from local storage
        return localStorage.getItem('authToken');
    }

    // Initialize profile page
    console.log('Initializing profile page...');
    fetchProfile();
});
