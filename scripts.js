// Toggle the menu visibility
function toggleMenu() {
  const navLinks = document.querySelector('.nav-links');
  navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
}

// Utility function: Convert file to Base64
function getBase64(file, callback) {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function () {
    callback(reader.result);
  };
  reader.onerror = function (error) {
    console.error('Error converting file to Base64: ', error);
  };
}

// Save report to local storage
function saveReport(report) {
  let crimeReports = JSON.parse(localStorage.getItem('crimeReports')) || [];
  crimeReports.push(report);
  localStorage.setItem('crimeReports', JSON.stringify(crimeReports));

  document.getElementById('statusMessage').textContent = "Report submitted successfully!";
  document.getElementById('crimeForm').reset();
}

// Form submission handling
document.getElementById('crimeForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const crimeImage = document.getElementById('crimeImage').files[0];
  const crimeVideo = document.getElementById('crimeVideo').files[0];

  // Initialize report object with form values
  let report = {
    reporterName: document.getElementById('reporterName').value,
    category: document.getElementById('crimeCategory').value,
    description: document.getElementById('crimeDescription').value,
    location: document.getElementById('location').value,
    date: document.getElementById('date').value,
    time: document.getElementById('time').value,
    image: null,
    video: null
  };

  // Process image and video uploads
  if (crimeImage) {
    getBase64(crimeImage, function(base64Image) {
      report.image = base64Image;
      if (crimeVideo) {
        getBase64(crimeVideo, function(base64Video) {
          report.video = base64Video;
          saveReport(report);
        });
      } else {
        saveReport(report);
      }
    });
  } else if (crimeVideo) {
    getBase64(crimeVideo, function(base64Video) {
      report.video = base64Video;
      saveReport(report);
    });
  } else {
    saveReport(report);
  }
});
// Redirect to admin page on 'View Report' button click
document.getElementById('viewReportButton').addEventListener('click', function() {
  window.location.href = 'admin.html';
});