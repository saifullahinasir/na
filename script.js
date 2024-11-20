const users = JSON.parse(localStorage.getItem("users")) || [];

function registerUser() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;
  const registerMessage = document.getElementById("registerMessage");

  // Check if the username is already taken
  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    registerMessage.textContent = "Username already taken. Please choose another.";
    return;
  }

  // Add the new user to the users array
  users.push({ username, password, role, name: username });
  localStorage.setItem("users", JSON.stringify(users));
  registerMessage.textContent = "Registration successful! You can now log in.";
}

function loginUser() {
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;
  const loginMessage = document.getElementById("loginMessage");

  // Find the user in the users array
  const user = users.find(user => user.username === username && user.password === password);
  if (user) {
    sessionStorage.setItem("role", user.role);
    sessionStorage.setItem("name", user.name);

    // Redirect to the appropriate portal
    window.location.href = user.role === "teacher" ? "teacher.html" : "student.html";
  } else {
    loginMessage.textContent = "Invalid username or password.";
  }
}

function displayUserInfo() {
  const role = sessionStorage.getItem("role");
  const name = sessionStorage.getItem("name");

  if (role === "teacher") {
    document.getElementById("teacherName").textContent = name;
  } else if (role === "student") {
    document.getElementById("studentName").textContent = name;
  }
}

function uploadFile() {
  const role = sessionStorage.getItem("role");

  // Only allow upload if the user is a teacher
  if (role !== "teacher") {
    alert("You do not have permission to upload materials.");
    return;
  }

  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];
  const materialsList = document.getElementById("materialsList");

  if (file) {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
      <span>${file.name}</span>
      <a href="${URL.createObjectURL(file)}" download="${file.name}">Download</a>
    `;
    materialsList.appendChild(listItem);
  } else {
    alert("Please select a file to upload.");
  }
}

document.addEventListener("DOMContentLoaded", displayUserInfo);
document.getElementById('crimeForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  // Get form data
  const reportData = {
    reporterName: document.getElementById('reporterName').value,
    category: document.getElementById('crimeCategory').value,
    description: document.getElementById('crimeDescription').value,
    location: document.getElementById('location').value,
    date: document.getElementById('date').value,
    time: document.getElementById('time').value,
  };

  // Handle image upload
  const imageFile = document.getElementById('crimeImage').files[0];
  if (imageFile) {
    reportData.image = await toBase64(imageFile);
  }

  // Handle video upload
  const videoFile = document.getElementById('crimeVideo').files[0];
  if (videoFile) {
    reportData.video = await toBase64(videoFile);
  }

  // Save report data
  const crimeReports = JSON.parse(localStorage.getItem('crimeReports')) || [];
  crimeReports.push(reportData);
  localStorage.setItem('crimeReports', JSON.stringify(crimeReports));

  document.getElementById('statusMessage').textContent = "Report submitted successfully!";
});

// Function to convert file to Base64
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}
