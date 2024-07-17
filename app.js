const database = firebase.database();
const dashboard = document.getElementById('dashboard');

// Function to create a div element for displaying sensor data
function createSensorDiv(id, label) {
  const div = document.createElement('div');
  div.className = 'sensor-data';
  div.id = id;
  div.innerHTML = `<h3>${label}</h3><div id="${id}-value" class="loader"></div>`;
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
    sensorValueElement.classList.remove('loader');
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

// Motor Controls
const controls = [
  { id: 'motor1-toggle-button', path: 'motor1Status', label: 'Motor Control 1' },
  { id: 'motor2-toggle-button', path: 'motor2Status', label: 'Motor Control 2' },
  { id: 'motor3-toggle-button', path: 'motor3Status', label: 'Motor Control 3' },
  { id: 'motor4-toggle-button', path: 'motor4Status', label: 'Motor Control 4' },
  { id: 'motor5-toggle-button', path: 'motor5Status', label: 'Motor Control 5' }
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
    status = (status === 1) ? 0 : 1;
    database.ref(control.path).set(status);
    updateButton(button, status, control.label);
  });
});

// Function to update the button text
function updateButton(button, status, label) {
  if (status === 1) {
    button.textContent = `Turn ${label} OFF`;
  } else {
    button.textContent = `Turn ${label} ON`;
  }
}

// Function to update the predicted data table
function updatePredictedDataTable(data) {
  const table = document.getElementById('predicted-data-table');
  const rows = table.getElementsByTagName('tr');

  const categories = [
    'micro_nutrients_required_with_manual_checklist_based_on_plant_conditions',
    'nutrients_requirement_by_stage_of_crop_with_manual_checklist_based_on_plant',
    'probable_disease_control',
    'probable_disease_prevention',
    'probable_pest_control',
    'probable_pest_prevention',
    'probable_weed_removal_methods_and_tips_tools'
  ];

  categories.forEach((category, index) => {
    rows[index * 2 + 1].cells[1].textContent = data.organic[category] ? data.organic[category].join(', ') : '';
    rows[index * 2 + 1].cells[2].textContent = data.semi_organic[category] ? data.semi_organic[category].join(', ') : '';
    rows[index * 2 + 1].cells[3].textContent = data.conventional[category] ? data.conventional[category].join(', ') : '';
  });
}

// Listen for updates to predicted data
database.ref('predicted_data').on('value', (snapshot) => {
  const data = snapshot.val();
  if (data) {
    updatePredictedDataTable(data);
  }
});
