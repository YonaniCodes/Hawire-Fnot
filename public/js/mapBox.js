 
document.addEventListener('DOMContentLoaded', function() {
    const mapElement = document.getElementById('map');

    // Check if the element exists
    if (mapElement) {
        const locations = mapElement.dataset.locations; // Access the dataset
        console.log(locations); // This will log the JSON string

        // If you need to parse the JSON string into an object
        if (locations) {
            const locationsArray = JSON.parse(locations);
            console.log(locationsArray);
        } else {
            console.error("The data-locations attribute is not set.");
        }
    } else {
        console.error("Element with ID 'map' not found.");
    }
}); 