const database = firebase.database();
const dashboard = document.getElementById('dashboard');
/*
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
  { id: 't', label: 'Temperature' },
  { id: 'time', label: 'Time' },
  { id: 'date', label: 'Date' }
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
    updateSensorData('time', data.time);
    updateSensorData('date', data.date);
  }
});
*/

/* -------------------------------------------------Motor Section Start---------------------------------------------------------------------- */

// Motor Controls
const controls = [
  { id: 'valve1-toggle-button', path: 'Valve1-Status', label: 'Valve 1' },
  { id: 'valve2-toggle-button', path: 'Valve2-Status', label: 'Valve 2' },
  { id: 'valve3-toggle-button', path: 'Valve3-Status', label: 'Valve 3' },
  { id: 'valve4-toggle-button', path: 'Valve4-Status', label: 'Valve 4' },
  { id: 'valve5-toggle-button', path: 'Valve5-Status', label: 'Valve 5' },
  { id: 'motor-on-button', path: 'motorStatus', label: 'Motor' },
  { id: 'Auto-on-button', path: 'motorAutoON', label: 'Auto' }
];

controls.forEach(control => {
  const button = document.getElementById(control.id);
  let status = 0;

  // Fetch initial status
  database.ref(control.path).on('value', (snapshot) => {
    status = snapshot.val();
    updateButton(button, status, control.label);
  });

  // Add click event listener
  button.addEventListener('click', () => {
    status = (status === 1) ? 0: 1;
    database.ref(control.path).set(status);
    updateButton(button, status, control.label);
  });
});

// Function to update the button text
function updateButton(button, status, label) {
  if (status === 0) {
    button.textContent = ` ${label} ON`;
  } else {
    button.textContent = ` ${label} OFF`;
  }
}

/* -------------------------------------------------End---------------------------------------------------------------------- */

/* -------------------------------------------------Predicted Data Table Start---------------------------------------------------------------------- */

// Function to update predicted data in the table
function updatePredictedData(recordId, field, values) {
  const elementId = `${field}_${recordId}`;
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = values.join(', ');
  }
}

// Listen for updates to predicted data
database.ref('predicted_data').on('value', (snapshot) => {
  const data = snapshot.val();
  if (data) {
    const records = [
      'micro_nutrients_required_with_manual_checklist_based_on_plant_conditions',
      'nutrients_requirement_by_stage_of_crop_with_manual_checklist_based_on_plant',
      'probable_disease_control',
      'probable_disease_prevention',
      'probable_pest_control',
      'probable_pest_prevention',
      'probable_weed_removal_methods_and_tips_tools'
    ];
    const fields = ['conventional', 'organic', 'semi_organic'];
    records.forEach((record, recordIndex) => {
      fields.forEach((field) => {
        if (data[field] && data[field][record]) {
          updatePredictedData(recordIndex + 1, field, data[field][record]);
        }
      });
    });
  }
});

/* -------------------------------------------------End---------------------------------------------------------------------- */

// Function to show the weather parameters section
document.getElementById('valve1-button').addEventListener('click', () => {
  document.getElementById('main-page').style.display = 'none';
  document.getElementById('plant-sensor-dashboard').style.display = 'block';
});

// Function to go back to the main page
document.getElementById('back-button').addEventListener('click', () => {
  document.getElementById('plant-sensor-dashboard').style.display = 'none';
  document.getElementById('main-page').style.display = 'block';
});


/* -------------------------------------------------display MOTOR data and Alerts---------------------------------------------------------------------- */


// Fetch and display MOTOR data
database.ref('MOTOR').on('child_added', (snapshot) => {
  const motorData = snapshot.val();
  if (motorData) {
    document.getElementById('Phase1Voltage').value = motorData.Phase1Voltage;
    document.getElementById('Phase1Current').value = motorData.Phase1Current;
    
    document.getElementById('Phase1PowerFactor').value = motorData.Phase1PowerFactor;
    
    document.getElementById('Phase2Voltage').value = motorData.Phase2Voltage;
    document.getElementById('Phase2Current').value = motorData.Phase2Current;
    
    document.getElementById('Phase2PowerFactor').value = motorData.Phase2PowerFactor;
    
    document.getElementById('Phase3Voltage').value = motorData.Phase3Voltage;
    document.getElementById('Phase3Current').value = motorData.Phase3Current;
   
    document.getElementById('Phase3PowerFactor').value = motorData.Phase3PowerFactor;
    
    document.getElementById('totalPower').value = motorData.totalPower;
  }
});

// Fetch and display ALERTS data
database.ref('ALERTS').on('child_added', (snapshot) => {
  const alertData = snapshot.val();
  if (alertData && alertData.message) {
    document.getElementById('alert-message').textContent = alertData.message;
  }
});
/*-------------------------------------------------End---------------------------------------------------------------------- */




// Plant dashboard
document.getElementById('valve1-button').addEventListener('click', () => {
  document.getElementById('main-page').style.display = 'none';
  document.getElementById('plant1-sensor-dashboard').style.display = 'block';
});

// Function to go back to the main page
document.getElementById('back-button').addEventListener('click', () => {
  document.getElementById('plant1-sensor-dashboard').style.display = 'none';
  document.getElementById('main-page').style.display = 'block';
});


/*-------------------------------------------------Guage draft---------------------------------------------------------------------- */

// Function to update the sensor data in interface
function updateSensorData(sensorId, value) {
  const station1Element = document.getElementById(`${sensorId}-value`);
  const valve1Element = document.getElementById(`${sensorId.replace(/soil-moisture(\d)/i, 'soil-moisture$1-gauge')}`);
  
  // Determine gauge fill elements
  const station1Gauge = document.getElementById(`${sensorId}-gauge`);
  const valve1Gauge = document.getElementById(`${sensorId.replace(/soil-moisture(\d)/i, 'soil-moisture$1-gauge')}`);
  
  if (station1Element) {
    station1Element.textContent = value;
  }

  if (station1Gauge) {
    station1Gauge.style.width = `${value}%`;
  }

  if (valve1Element) {
    valve1Element.textContent = value + '%';
  }

  if (valve1Gauge) {
    valve1Gauge.style.width = `${value}%`;
  }
}
/*-------------------------------------------------End---------------------------------------------------------------------- */

/*-------------------------------------------------Function to update the sensor data on the dashboard---------------------------------------------------------------------- */

// Function to update the sensor data on the dashboard
function updateSensorData(sensorId, value) {
  const sensorValueElement = document.getElementById(`${sensorId}-value`);
  if (sensorValueElement) {
    sensorValueElement.textContent = value;
  }
}

// Fetch and display data for interface
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
    updateSensorData('time', data.time);
    updateSensorData('date', data.date);

    document.getElementById('light-intensity-gauge').textContent = data.I + '%';
    document.getElementById('humidity-gauge').textContent = data.h + '%';
    document.getElementById('temperature-gauge').textContent = data.t + '°C';
    document.getElementById('leaf-wetness1-gauge').textContent = data.D1 + '%';
    document.getElementById('leaf-wetness2-gauge').textContent = data.D2 + '%';
    document.getElementById('soil-moisture1-gauge').textContent = data.a + '%'; // Soil Moisture Top
    document.getElementById('soil-moisture2-gauge').textContent = data.b + '%'; // Soil Moisture Middle
    document.getElementById('soil-moisture3-gauge').textContent = data.c + '%'; // Soil Moisture Bottom
    document.getElementById('soil-temperature-gauge').textContent = data.S + '°C';
  }
});
/*-------------------------------------------------End---------------------------------------------------------------------- */

/*-------------------------------------------------Auto log off ---------------------------------------------------------------------- */

// Auto log off when not in use
let inactivityTime = 60 * 60 * 1000; // 60 minutes in milliseconds
let timer;

function resetTimer() {
    // Clear the current timer
    clearTimeout(timer);
    // Set a new timer to log out or redirect after 10 minutes of inactivity
    timer = setTimeout(() => {
        alert("Session expired due to inactivity. Please log in again.");
        firebase.auth().signOut().then(() => {
            window.location.href = 'login.html'; // Redirect to login page
        });
    }, inactivityTime);
}

// Reset timer on user activity
function setupActivityListeners() {
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('click', resetTimer);
    window.addEventListener('scroll', resetTimer);
}

// Start tracking user activity
setupActivityListeners();
resetTimer(); // Initialize timer when the page loads

/*-------------------------------------------------End---------------------------------------------------------------------- */
