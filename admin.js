// Admin login handler
document.getElementById('adminLoginForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (username === "superadmin" && password === "123456") {
    document.getElementById('loginMessage').textContent = "Logged in successfully!";
    document.getElementById('reportListSection').style.display = "block";
    showReports();
  } else {
    document.getElementById('loginMessage').textContent = "Invalid login credentials!";
  }
});

// Function to display reports
function showReports() {
  const crimeReports = JSON.parse(localStorage.getItem('crimeReports')) || [];
  const reportList = document.getElementById('reportList');
  reportList.innerHTML = '';

  crimeReports.forEach((report, index) => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <strong>Report #${index + 1}</strong><br>
      <strong>Reporter Name:</strong> ${report.reporterName}<br>
      <strong>Category:</strong> ${report.category}<br>
      <strong>Description:</strong> ${report.description}<br>
      <strong>Location:</strong> ${report.location}<br>
      <strong>Date:</strong> ${report.date}<br>
      <strong>Time:</strong> ${report.time}<br>
    `;

    // Display image if available
    if (report.image) {
      const img = document.createElement('img');
      img.src = report.image;
      img.alt = "Uploaded crime image";
      img.style.width = "200px"; // Adjust size as needed
      listItem.appendChild(img);
    }

    // Display video if available
    if (report.video) {
      const video = document.createElement('video');
      video.src = report.video;
      video.controls = true;
      video.style.width = "300px"; // Adjust size as needed
      listItem.appendChild(video);
    }

    reportList.appendChild(listItem);
  });
}
