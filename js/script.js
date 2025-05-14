// Handle user signup
function signup() {
    const name = document.getElementById("signup-name").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value.trim();
    const phone = document.getElementById("signup-phone").value.trim();
    const address = document.getElementById("signup-address").value.trim();

    if (!name || !email || !password || !phone || !address) {
        alert("Please fill in all fields.");
        return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    // Validate password strength
    if (password.length < 6) {
        alert("Password must be at least 6 characters long.");
        return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Check if email already exists
    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
        alert("User with this email already exists.");
        return;
    }

    users.push({ name, email, password, phone, address });
    localStorage.setItem("users", JSON.stringify(users));
    alert("Signup successful! Please login.");
    window.location.href = "login.html";
}

// Handle user login
function login() {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    // Admin login (hardcoded)
    if (email === "admin@gmail.com" && password === "1234") {
        sessionStorage.setItem("loggedInUser", email);
        sessionStorage.setItem("role", "admin");
        alert("Welcome, Admin!");
        window.location.href = "index.html";
        return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const validUser = users.find(
        (user) => user.email === email && user.password === password
    );

    if (validUser) {
        sessionStorage.setItem("loggedInUser", validUser.email);
        sessionStorage.setItem("role", "user");
        alert(`Welcome, ${validUser.name}!`);
        window.location.href = "index.html";
    } else {
        alert("Invalid email or password.");
    }
}

let projects = JSON.parse(localStorage.getItem("projects")) || [];

function loadProjects() {
    const loggedInUser = sessionStorage.getItem("loggedInUser");
    const userRole = sessionStorage.getItem("role");
    const container = document.getElementById("project-container");
    const adminForm = document.getElementById("admin-form");

    container.innerHTML = "";

    if (userRole === "admin") {
        adminForm.style.display = "block";
    } else {
        adminForm.style.display = "none";
    }

    projects.forEach((project, index) => {
        const projectCard = document.createElement("div");
        projectCard.className = "project-card";

        const feedbackHtml = project.feedback?.map(f => `<li>${f}</li>`).join("") || "";

        projectCard.innerHTML = `
            <img src="${project.image}" alt="Project Image" />
            <h3>${project.name}</h3>
            <p>By: ${project.user}</p>
            <div class="rating">
                <strong>Rating:</strong> ${project.rating || 0}/5
                ${userRole === "user" ? `
                <br>
                <input type="number" min="1" max="5" id="rate-${index}" placeholder="Rate 1-5">
                <input type="text" id="feedback-${index}" placeholder="Leave a comment">
                <button onclick="submitFeedback(${index})">Submit</button>` : ''}
            </div>
            <ul><strong>Feedback:</strong> ${feedbackHtml}</ul>
            ${userRole === "admin" ? `
                <div class="admin-controls">
                    <button onclick="editProject(${index})">Edit</button>
                    <button onclick="deleteProject(${index})">Delete</button>
                </div>
            ` : ''}
        `;

        container.appendChild(projectCard);
    });
}

function addProject() {
    const nameInput = document.getElementById("projectName");
    const userInput = document.getElementById("userName");
    const fileInput = document.getElementById("imageFile");
    const file = fileInput.files[0];

    const name = nameInput.value;
    const user = userInput.value;

    if (!name || !user || !file) {
        alert("All fields required.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const imageData = e.target.result;

        const project = {
            name: name,
            user: user,
            image: imageData,
            rating: 0,
            feedback: []
        };

        projects.push(project);
        localStorage.setItem("projects", JSON.stringify(projects));

        alert("Project added!");
        nameInput.value = '';
        userInput.value = '';
        fileInput.value = '';
        loadProjects();
    };

    reader.readAsDataURL(file);
}

function editProject(index) {
    const project = projects[index];
    const name = prompt("Edit Project Name", project.name);
    const user = prompt("Edit User Name", project.user);
    const image = prompt("Edit Image URL", project.image);

    if (name && user && image) {
        projects[index] = { ...project, name, user, image };
        localStorage.setItem("projects", JSON.stringify(projects));
        loadProjects();
    }
}

function deleteProject(index) {
    if (confirm("Are you sure to delete this project?")) {
        projects.splice(index, 1);
        localStorage.setItem("projects", JSON.stringify(projects));
        loadProjects();
    }
}

function submitFeedback(index) {
    const ratingInput = document.getElementById(`rate-${index}`);
    const feedbackInput = document.getElementById(`feedback-${index}`);
    const rating = parseInt(ratingInput.value);
    const feedback = feedbackInput.value.trim();

    if ((rating >= 1 && rating <= 5) || feedback) {
        if (rating >= 1 && rating <= 5) {
            projects[index].rating = rating;
        }

        if (feedback) {
            if (!projects[index].feedback) {
                projects[index].feedback = [];
            }
            projects[index].feedback.push(feedback);
        }

        localStorage.setItem("projects", JSON.stringify(projects));
        loadProjects();
    } else {
        alert("Please enter a rating (1-5) or a comment.");
    }
}

const services = [
  { name: "Wedding Photography", amount: 500 },
  { name: "Pre-Wedding Shoot", amount: 300 },
  { name: "Reception Photography", amount: 400 },
  { name: "Birthday Photography", amount: 200 },
  { name: "Out-Door Photography", amount: 350 },
  { name: "Puberty Ceremony Photography", amount: 250 },
  { name: "Casual Photography", amount: 150 },
  { name: "Wild-Life Photography", amount: 600 },
];

let photographers = JSON.parse(localStorage.getItem("photographers")) || [];
let selectedService = null;
let totalAmount = 0;

function loadServices() {
  const container = document.getElementById("services-container");
  container.innerHTML = "";

  services.forEach((service, index) => {
    const serviceCard = document.createElement("div");
    serviceCard.className = "service-card";

    serviceCard.innerHTML = `
      <img src="images/image${index + 1}.jpg" alt="${service.name}">
      <div class="service-description">
        <h3>${service.name}</h3>
        <p>Price: $${service.amount}</p>
        <button onclick="bookService(${index})">Book Now</button>
      </div>
    `;

    container.appendChild(serviceCard);
  });
}

function bookService(index) {
  selectedService = services[index];
  totalAmount = selectedService.amount;

  // Display the selected service details
  document.getElementById("booked-service").innerText = `Service: ${selectedService.name}`;
  document.getElementById("service-amount").innerText = `Amount: $${selectedService.amount}`;
  document.getElementById("total-amount").innerText = `Total: $${totalAmount}`;

  // Populate the additional services dropdown
  const additionalServiceSelect = document.getElementById("additional-service");
  additionalServiceSelect.innerHTML = `<option value="">Select a service</option>`;
  services.forEach((service, i) => {
    if (i !== index) {
      additionalServiceSelect.innerHTML += `<option value="${i}" data-amount="${service.amount}">${service.name} - $${service.amount}</option>`;
    }
  });

  // Populate the external photographers dropdown
  const photographerSelect = document.getElementById("external-photographer");
  photographerSelect.innerHTML = `<option value="">Select a photographer</option>`;
  photographers.forEach((photographer, i) => {
    photographerSelect.innerHTML += `<option value="${i}" data-amount="100">${photographer.name} - $100</option>`; // Assuming $100 for each photographer
  });

  // Add event listeners for additional services and photographers
  additionalServiceSelect.addEventListener("change", updateTotalAmount);
  photographerSelect.addEventListener("change", updateTotalAmount);

  // Show the booking popup
  document.getElementById("booking-popup").classList.remove("hidden");
}

function updateTotalAmount() {
  let additionalServiceAmount = 0;
  let photographerAmount = 0;

  // Get the selected additional service amount
  const additionalServiceSelect = document.getElementById("additional-service");
  const selectedAdditionalService = additionalServiceSelect.options[additionalServiceSelect.selectedIndex];
  if (selectedAdditionalService && selectedAdditionalService.dataset.amount) {
    additionalServiceAmount = parseFloat(selectedAdditionalService.dataset.amount);
  }

  // Get the selected photographer amount
  const photographerSelect = document.getElementById("external-photographer");
  const selectedPhotographer = photographerSelect.options[photographerSelect.selectedIndex];
  if (selectedPhotographer && selectedPhotographer.dataset.amount) {
    photographerAmount = parseFloat(selectedPhotographer.dataset.amount);
  }

  // Calculate the total amount
  totalAmount = selectedService.amount + additionalServiceAmount + photographerAmount;

  // Update the total amount display
  document.getElementById("total-amount").innerText = `Total: $${totalAmount}`;
}

function closePopup() {
  document.querySelectorAll(".popup").forEach((popup) => popup.classList.add("hidden"));
}

function checkout() {
  document.getElementById("booking-popup").classList.add("hidden");
  document.getElementById("payment-popup").classList.remove("hidden");
}

function processPayment() {
  const cardName = document.getElementById("card-name").value;
  const cardNumber = document.getElementById("card-number").value;
  const expiryDate = document.getElementById("expiry-date").value;
  const cvv = document.getElementById("cvv").value;

  if (cardName === "Thivi" && cardNumber === "1234567812345678" && expiryDate === "12/25" && cvv === "123") {
    alert("Payment Successful!");
    notifyAdmin(); // Notify admin after successful payment
    closePopup();
  } else {
    alert("Invalid payment details.");
  }
}

function notifyAdmin() {
  const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
  bookings.push({
    service: selectedService.name,
    amount: totalAmount,
    photographer: document.getElementById("external-photographer").value || "None",
  });
  localStorage.setItem("bookings", JSON.stringify(bookings));
}

function loadPhotographers() {
  const userRole = sessionStorage.getItem("role");
  const container = document.getElementById("photographers-container");
  const adminForm = document.getElementById("admin-photographer-form");

  container.innerHTML = "";

  if (userRole === "admin") {
    adminForm.style.display = "block";
  } else {
    adminForm.style.display = "none";
  }

  photographers.forEach((photographer, index) => {
    const photographerCard = document.createElement("div");
    photographerCard.className = "photographer-card";

    photographerCard.innerHTML = `
      <img src="${photographer.image}" alt="Photographer Image">
      <h3>${photographer.name}</h3>
      ${userRole === "admin" ? `
        <div class="admin-controls">
          <button onclick="editPhotographer(${index})">Edit</button>
          <button onclick="deletePhotographer(${index})">Delete</button>
        </div>
      ` : ''}
    `;

    container.appendChild(photographerCard);
  });
}

function addPhotographer() {
  const nameInput = document.getElementById("photographerName");
  const fileInput = document.getElementById("photographerImage");
  const file = fileInput.files[0];

  const name = nameInput.value;

  if (!name || !file) {
    alert("All fields required.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const imageData = e.target.result;

    const photographer = {
      name: name,
      image: imageData
    };

    photographers.push(photographer);
    localStorage.setItem("photographers", JSON.stringify(photographers));

    alert("Photographer added!");
    nameInput.value = '';
    fileInput.value = '';
    loadPhotographers();
  };

  reader.readAsDataURL(file);
}

function editPhotographer(index) {
  const photographer = photographers[index];
  const name = prompt("Edit Photographer Name", photographer.name);
  const image = prompt("Edit Image URL", photographer.image);

  if (name && image) {
    photographers[index] = { ...photographer, name, image };
    localStorage.setItem("photographers", JSON.stringify(photographers));
    loadPhotographers();
  }
}

function deletePhotographer(index) {
  if (confirm("Are you sure to delete this photographer?")) {
    photographers.splice(index, 1);
    localStorage.setItem("photographers", JSON.stringify(photographers));
    loadPhotographers();
  }
}

function toggleAnswer(questionElement) {
    const answer = questionElement.nextElementSibling; // Get the next sibling (the answer)
    if (answer.style.display === "block") {
        answer.style.display = "none"; // Hide the answer
    } else {
        answer.style.display = "block"; // Show the answer
    }
}

function loadPageContent() {
  const userRole = sessionStorage.getItem("role"); // Get the user's role
  const adminOrders = document.getElementById("admin-orders");

  if (userRole === "admin") {
    // Show admin-specific content
    adminOrders.style.display = "block";
    loadOrders(); // Load orders for admin
  } else {
    // Hide admin-specific content
    adminOrders.style.display = "none";
  }

  loadProjects(); // Load projects for all users
}

function loadOrders() {
  const orders = JSON.parse(localStorage.getItem("bookings")) || [];
  const container = document.getElementById("orders-container");
  container.innerHTML = "";

  if (orders.length === 0) {
    container.innerHTML = "<p>No orders available.</p>";
    return;
  }

  orders.forEach((order, index) => {
    const orderCard = document.createElement("div");
    orderCard.className = "order-card";

    orderCard.innerHTML = `
      <h3>Order ${index + 1}</h3>
      <p>Service: ${order.service}</p>
      <p>Amount: $${order.amount}</p>
      <p>Photographer: ${order.photographer}</p>
    `;

    container.appendChild(orderCard);
  });
}

window.onload = function () {
    const currentPage = window.location.pathname.split("/").pop();

    if (currentPage === "index.html") {
        loadPageContent();
    } else if (currentPage === "external.html") {
        loadPhotographers();
    } else if (currentPage === "services.html") {
        loadServices();
    } else if (currentPage === "faq.html") {
        loadFAQ(); // Add a new function to handle FAQ content
    }
};
