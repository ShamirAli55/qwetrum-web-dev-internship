const password = document.getElementById("password");
const strength = document.getElementById("strength");

password.addEventListener("input", () => {
  const value = password.value;

  if (value.length < 6) {
    strength.textContent = "Weak Password";
    strength.style.color = "red";
  } else if (value.length < 10) {
    strength.textContent = "Medium Password";
    strength.style.color = "orange";
  } else {
    strength.textContent = "Strong Password";
    strength.style.color = "green";
  }
});

function showStep(step) {
  document
    .querySelectorAll(".step")
    .forEach((s) => s.classList.remove("active"));

  document.getElementById(`step${step}`).classList.add("active");
}

// Step 1 validation
function nextStep1() {
  const name = document.getElementById("name").value.trim();
  const age = document.getElementById("age").value;
  const phone = document.getElementById("phone").value.trim();

  const phonePattern = /^03\d{9}$/;

  if (!name || !age || !phone) {
    alert("Please fill all fields");
    return;
  }

  if (age < 1 || age > 100) {
    alert("Enter valid age");
    return;
  }

  if (!phonePattern.test(phone)) {
    alert("Phone must be like 03XXXXXXXXX");
    return;
  }

  showStep(2);
}

// Step 2 validation
function nextStep2() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (!email || !password || !confirmPassword) {
    alert("Fill all fields");
    return;
  }

  if (!email.includes("@")) {
    alert("Invalid email");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  const summary = document.getElementById("summary");

  summary.innerHTML = `
    <p><strong>Name:</strong> ${document.getElementById("name").value}</p>
    <p><strong>Age:</strong> ${document.getElementById("age").value}</p>
    <p><strong>Phone:</strong> ${document.getElementById("phone").value}</p>
    <p><strong>Email:</strong> ${email}</p>
  `;

  showStep(3);
}

function prevStep(step) {
  showStep(step);
}

// Submit form
function submitForm() {
  const data = {
    name: document.getElementById("name").value,
    age: document.getElementById("age").value,
    phone: document.getElementById("phone").value,
    email: document.getElementById("email").value,
  };

  let entries = JSON.parse(localStorage.getItem("entries")) || [];

  entries.push(data);

  localStorage.setItem("entries", JSON.stringify(entries));

  alert("Form Submitted!");

  displayEntries();

  document.querySelectorAll("input").forEach((input) => (input.value = ""));

  document.getElementById("summary").innerHTML = "";
  strength.textContent = "";

  showStep(1);
}

// Show entries in table
function displayEntries() {
  const tableBody = document.getElementById("tableBody");

  const entries = JSON.parse(localStorage.getItem("entries")) || [];

  tableBody.innerHTML = "";

  entries.forEach((entry, index) => {
    tableBody.innerHTML += `
      <tr>
        <td>${entry.name}</td>
        <td>${entry.age}</td>
        <td>${entry.phone}</td>
        <td>${entry.email}</td>
        <td>
          <button class="delete-btn"
          onclick="deleteEntry(${index})">
            Delete
          </button>
        </td>
      </tr>
    `;
  });
}

// Delete entry
function deleteEntry(index) {
  let entries = JSON.parse(localStorage.getItem("entries")) || [];

  entries.splice(index, 1);

  localStorage.setItem("entries", JSON.stringify(entries));

  displayEntries();
}

displayEntries();
