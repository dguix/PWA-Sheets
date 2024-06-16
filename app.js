/*document.addEventListener('DOMContentLoaded', (event) => {
    const apiKey = '';
    const spreadsheetId = '1JjeT5685o9gbJY9xz7b8sNDQugVe0psYqMcd6kCSHbc';
    const range = ''; // Change this to the specific cell or range you want to display

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
});*/



const CLIENT_ID = '1072569223134-1gu67qgp0atsdvdj3h3ktlksokov41g4.apps.googleusercontent.com';
const API_KEY = 'AIzaSyBwppxHvm1B6k7pLQOdJJRdCNW5Zr8rHw0';
const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
const SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";

let authorizeButton = document.getElementById('authorize_button');
let signoutButton = document.getElementById('signout_button');

function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(() => {
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
    }, error => {
        console.error(JSON.stringify(error, null, 2));
    });
}

function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        listMajors();
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
    }
}

function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}

function listMajors() {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: '1JjeT5685o9gbJY9xz7b8sNDQugVe0psYqMcd6kCSHbc',
        range: 'Synthèse et indicateur!A3',
    }).then(response => {
        const range = response.result;
        if (range.values.length > 0) {
            const labels = [];
            const values = [];
            range.values.forEach(row => {
                labels.push(row[0]);
                values.push(row[1]);
            });

            const ctx = document.getElementById('myChart').getContext('2d');
            const myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'My Data',
                        data: values,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    }, error => {
        console.error('Error fetching data: ', error);
    });
}

document.addEventListener('DOMContentLoaded', handleClientLoad);
