
let userProfile = {};

document.addEventListener('DOMContentLoaded', async function() {
    // Fetch user profile information
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

    // Add event listener to the form for submitting the updated profile
    document.getElementById('edit-profile-form').addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent the default form submission behavior

        // Get form data
    const formData = new FormData(this);

    // Extract user profile data from the form data
    const updatedProfileData = {
        username: formData.get('username'),
        email: formData.get('email'),
        weight: formData.get('weight'),
        age: formData.get('age'),
        gender: formData.get('gender')
    };

    // Check if any of the form fields have been changed
    const isProfileChanged = Object.keys(updatedProfileData).some(key => {
        return updatedProfileData[key] !== userProfile[key];
    });

    if (isProfileChanged) {
        try {
            // Send PUT request to update profile
            const response = await fetch('/users/update-profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedProfileData),
                credentials: 'same-origin'
            });
    
            if (!response.ok) {
                throw new Error('Failed to update profile');
            }
    
            // Handle successful response
            console.log('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    } else {
        console.log('No changes detected in profile. Form submission cancelled.');
    }
});

// Function to update the UI with profile data
// Function to update the UI with profile data
function updateProfileUI(profileData) {
    console.log('Updating profile UI with profile data:', profileData);

    // Extract user profile data from profileData object
    userProfile = profileData.profile; // This line seems correct

    // Check if userProfile is actually being assigned correctly
    console.log('User profile:', userProfile); // Log userProfile to verify its contents

    // Update input fields with userProfile data
    document.getElementById('username').value = userProfile.Username || '';
    console.log('Username field value:', document.getElementById('username').value);
    document.getElementById('email').value = userProfile.Email || '';
    console.log('Email field value:', document.getElementById('email').value);
    document.getElementById('weight').value = userProfile.Weight || '';
    console.log('Weight field value:', document.getElementById('weight').value);
    document.getElementById('age').value = userProfile.Age || '';
    console.log('Age field value:', document.getElementById('age').value);

    // Update gender select field
    const genderSelect = document.getElementById('gender');
    if (userProfile.gender === 'male') {
        genderSelect.value = 'male';
    } else if (userProfile.gender === 'female') {
        genderSelect.value = 'female';
    }

    // Log completion of profile UI update
    console.log('Profile UI update completed');
}

});
