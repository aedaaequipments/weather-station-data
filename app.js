// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDnn3kkfrVD71xLl0lg-EFZepEdxHL8Aig",
  authDomain: "gsma7670c.firebaseapp.com",
  databaseURL: "https://gsma7670c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "gsma7670c",
  storageBucket: "gsma7670c.appspot.com",
  messagingSenderId: "351373262732",
  appId: "1:351373262732:web:2c308099230251131320a9",
  measurementId: "G-45B69FTJWH"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const database = firebase.database();
const dashboard = document.getElementById('dashboard');

// Function to create a div element for displaying sensor data
function createSensorDiv(id, label) {
  const div = document.createElement('div');
  div.className = 'sensor-data';
  div.id = id;
  div.innerHTML = `<h3>${label}</h3><p id="${id}-value">Loading...</p>`;
  return div;
}

// Add divs for each sensor with new readable labels
const sensors = [
  { id: 'D1', label: 'Leaf Wetness 1' },
  { id: 'D2', label: 'Leaf Wetness 2' },
  { id: 'I', label: 'Light Intensity' },
  { id: 'S', label: 'Soil Temperature' },
  { id: 'a', label: 'Soil Moisture 1' },
  { id: 'b', label: 'Soil Moisture 2' },
  { id: 'c', label: 'Soil Moisture 3' },
  { id: 'h', label: 'Humidity' },
  { id: 't', label: 'Temperature' }
];


sensors.forEach(sensor => {
  dashboard.appendChild(createSensorDiv(sensor.id, sensor.label));
});

// Function to update the sensor data on the dashboard
function updateSensorData(sensorId, value) {
  const sensorValueElement = document.getElementById(`${sensorId}-value`);
  if (sensorValueElement) {
    sensorValueElement.textContent = value;
  }
}

// Listen for new data entries
database.ref('VER1').on('child_added', (snapshot) => {
  const data = snapshot.val();
  if (data) {
    updateSensorData('D1', data.D1);
    updateSensorData('D2', data.D2);
    updateSensorData('I', data.I);
    updateSensorData('S', data.S);
    updateSensorData('a', data.a);
    updateSensorData('b', data.b);
    updateSensorData('c', data.c);
    updateSensorData('h', data.h);
    updateSensorData('t', data.t);
  }
});

// LED Control
const ledToggleButton = document.getElementById('led-toggle-button');
let ledStatus = "OFF";

// Fetch initial LED status
database.ref('ledStatus').on('value', (snapshot) => {
  ledStatus = snapshot.val();
  updateLedButton();
});

// Function to update the LED button text
function updateLedButton() {
  if (ledStatus === "ON") {
    ledToggleButton.textContent = "Turn LED OFF";
  } else {
    ledToggleButton.textContent = "Turn LED ON";
  }
}

// Function to toggle LED status
ledToggleButton.addEventListener('click', () => {
  ledStatus = (ledStatus === "ON") ? "OFF" : "ON";
  database.ref('ledStatus').set(ledStatus);
  updateLedButton();
});