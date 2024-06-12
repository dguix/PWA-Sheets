document.addEventListener('DOMContentLoaded', (event) => {
    const apiKey = 'AIzaSyBwppxHvm1B6k7pLQOdJJRdCNW5Zr8rHw0';
    const spreadsheetId = '1JjeT5685o9gbJY9xz7b8sNDQugVe0psYqMcd6kCSHbc';
    const range = 'Synthèse et indicateur!A3'; // Change this to the specific cell or range you want to display

    //https://docs.google.com/spreadsheets/d/1JjeT5685o9gbJY9xz7b8sNDQugVe0psYqMcd6kCSHbc/edit?usp=sharing

    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const cellData = data.values[0][0];
            document.getElementById('sheet-data').innerText = cellData;
        })
        .catch(error => console.error('Error fetching data:', error));
});

document.addEventListener('DOMContentLoaded', (event) => {
    const chartUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTV4t110oAudnXg52BqPnQP3suHaDDBwXw58M6uBPNhSPaUdGH2eW-J8LRpagYl2tDi4KiTwoVnZRkK/pubchart?oid=1862197747&format=image';
    document.getElementById('sheets-chart').src = chartUrl;
});

