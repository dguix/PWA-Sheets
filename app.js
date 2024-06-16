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

let tokenClient;
let gapiInited = false;
let gisInited = false;

const CLIENT_ID = '1072569223134-1gu67qgp0atsdvdj3h3ktlksokov41g4.apps.googleusercontent.com';
const API_KEY = 'AIzaSyBwppxHvm1B6k7pLQOdJJRdCNW5Zr8rHw0';
const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
const SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";

function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
}

async function initializeGapiClient() {
    await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
    maybeEnableButtons();
}

function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '', // defined later
    });
    gisInited = true;
    maybeEnableButtons();
}

function maybeEnableButtons() {
    if (gapiInited && gisInited) {
        document.querySelector('.g_id_signin').style.display = 'block';
        document.getElementById('signout_button').style.display = 'none';
        document.getElementById('signout_button').onclick = handleSignoutClick;
    }
}

function handleCredentialResponse(response) {
    const id_token = response.credential;
    gapi.auth.setToken({
        'access_token': id_token
    });

    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
            throw (resp);
        }
        await listMajors();
    };

    tokenClient.requestAccessToken({prompt: ''});
}

async function listMajors() {
    try {
        const response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: '1JjeT5685o9gbJY9xz7b8sNDQugVe0psYqMcd6kCSHbc',
            range: 'Synthèse et indicateur!A3',
        });
        const range = response.result;
        if (range.values.length > 0) {
            const labels = [];
            const values = [];
            range.values.forEach(row => {
                labels.push(row[0]);
                values.push(row[1]);
            });

            const ctx = document.createElement('canvas');
            document.getElementById('chart-container').appendChild(ctx);

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
    } catch (err) {
        console.error('Error fetching data: ', err);
    }
}

function handleSignoutClick() {
    google.accounts.oauth2.revoke(tokenClient.getToken().access_token, () => {
        console.log('Access token revoked');
        document.querySelector('.g_id_signin').style.display = 'block';
        document.getElementById('signout_button').style.display = 'none';
        document.getElementById('chart-container').innerHTML = '';
    });
}

window.onload = function() {
    gapiLoaded();
    gisLoaded();
};
