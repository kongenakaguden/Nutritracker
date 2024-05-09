document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('editRecordForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const recordId = document.querySelector('input[name="id"]').value;        const weight = document.getElementById('weight').value;
        const datetime = document.getElementById('datetime').value;

        const data = {
            weight: weight,
            datetime: datetime
        };

        fetch(`/meal-tracker/update-record/${recordId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Update successful:', data);
            alert('Record updated successfully!');
            window.location.href = '/meal-tracker';  // Redirect or update UI as needed
        })
        .catch(error => {
            console.error('Error updating record:', error);
            alert('Failed to update record.');
        });
    });
});
