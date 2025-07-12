// Mock data - simulating Freemarker template data
let employees = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@company.com",
    department: "Engineering",
    role: "Senior Developer",
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@company.com",
    department: "Marketing",
    role: "Marketing Manager",
  },
  {
    id: 3,
    firstName: "Mike",
    lastName: "Johnson",
    email: "mike.johnson@company.com",
    department: "Sales",
    role: "Sales Representative",
  },
  {
    id: 4,
    firstName: "Sarah",
    lastName: "Williams",
    email: "sarah.williams@company.com",
    department: "HR",
    role: "HR Specialist",
  },
  {
    id: 5,
    firstName: "David",
    lastName: "Brown",
    email: "david.brown@company.com",
    department: "Finance",
    role: "Financial Analyst",
  },
  {
    id: 6,
    firstName: "Lisa",
    lastName: "Davis",
    email: "lisa.davis@company.com",
    department: "Engineering",
    role: "Lead Developer",
  },
];

// Global variables
let filteredEmployees = [...employees];
let currentPage = 1;
let itemsPerPage = 10;
let isEditing = false;
let currentEmployeeId = null;
let currentFilters = {
  search: "",
  name: "",
  department: "",
  role: "",
};

// Initialize the application
document.addEventListener("DOMContentLoaded", function () {
  populateFilterOptions();
  renderEmployees();
  setupEventListeners();
});

function setupEventListeners() {
  // Search functionality
  document
    .getElementById("searchInput")
    .addEventListener("input", function (e) {
      currentFilters.search = e.target.value.trim();
      applyAllFilters();
    });

  // Form submission
  document
    .getElementById("employeeForm")
    .addEventListener("submit", handleFormSubmit);

  // Close modals when clicking outside
  document
    .getElementById("filterModal")
    .addEventListener("click", function (e) {
      if (e.target === this) closeFilterModal();
    });

  document
    .getElementById("employeeModal")
    .addEventListener("click", function (e) {
      if (e.target === this) closeEmployeeModal();
    });

  // Close modals with Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeFilterModal();
      closeEmployeeModal();
    }
  });
}

function populateFilterOptions() {
  const departments = [...new Set(employees.map((emp) => emp.department))];
  const roles = [...new Set(employees.map((emp) => emp.role))];

  const departmentSelect = document.getElementById("filterDepartment");
  const roleSelect = document.getElementById("filterRole");

  departments.forEach((dept) => {
    const option = document.createElement("option");
    option.value = dept;
    option.textContent = dept;
    departmentSelect.appendChild(option);
  });

  roles.forEach((role) => {
    const option = document.createElement("option");
    option.value = role;
    option.textContent = role;
    roleSelect.appendChild(option);
  });
}

function renderEmployees() {
  const container = document.getElementById("employeesContainer");
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const employeesToShow = filteredEmployees.slice(startIndex, endIndex);

  if (employeesToShow.length === 0) {
    container.innerHTML = `
                    <div class="no-results">
                        <h3>No employees found</h3>
                        <p>Try adjusting your search or filter criteria.</p>
                        <button class="btn btn-primary" onclick="resetToMainPage()">Back to Main Page</button>
                    </div>
                `;
  } else {
    container.innerHTML = `
                    <div class="employees-grid">
                        ${employeesToShow
                          .map(
                            (employee) => `
                            <div class="employee-card">
                                <div class="employee-header">
                                    <div class="employee-info">
                                        <h3>${employee.firstName} ${employee.lastName}</h3>
                                        <div class="employee-id">#${employee.id}</div>
                                    </div>
                                </div>
                                <div class="employee-details">
                                    <p><strong>Email:</strong> ${employee.email}</p>
                                    <p><strong>Department:</strong> ${employee.department}</p>
                                    <p><strong>Role:</strong> ${employee.role}</p>
                                </div>
                                <div class="employee-actions">
                                    <button class="btn btn-primary btn-small" onclick="editEmployee(${employee.id})">Edit</button>
                                    <button class="btn btn-danger btn-small" onclick="deleteEmployee(${employee.id})">Delete</button>
                                </div>
                            </div>
                        `
                          )
                          .join("")}
                    </div>
                `;
  }

  updatePagination();
}

function updatePagination() {
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  document.getElementById(
    "pageInfo"
  ).textContent = `Page ${currentPage} of ${totalPages}`;
  document.getElementById("prevBtn").disabled = currentPage === 1;
  document.getElementById("nextBtn").disabled =
    currentPage === totalPages || totalPages === 0;
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    renderEmployees();
  }
}

function nextPage() {
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderEmployees();
  }
}

function changeItemsPerPage() {
  itemsPerPage = parseInt(document.getElementById("itemsPerPage").value);
  currentPage = 1;
  renderEmployees();
}

function applyAllFilters() {
  try {
    filteredEmployees = employees.filter((employee) => {
      const matchesSearch =
        !currentFilters.search ||
        employee.firstName
          .toLowerCase()
          .includes(currentFilters.search.toLowerCase()) ||
        employee.lastName
          .toLowerCase()
          .includes(currentFilters.search.toLowerCase()) ||
        employee.email
          .toLowerCase()
          .includes(currentFilters.search.toLowerCase());

      const matchesName =
        !currentFilters.name ||
        employee.firstName
          .toLowerCase()
          .includes(currentFilters.name.toLowerCase());

      const matchesDepartment =
        !currentFilters.department ||
        employee.department === currentFilters.department;

      const matchesRole =
        !currentFilters.role ||
        employee.role.toLowerCase().includes(currentFilters.role.toLowerCase());

      return matchesSearch && matchesName && matchesDepartment && matchesRole;
    });

    currentPage = 1;
    renderEmployees();
  } catch (error) {
    console.error("Error applying filters:", error);
    showAlert("Error applying filters. Please try again.", "error");
  }
}

function openFilterModal() {
  document.getElementById("filterModal").style.display = "flex";
}

function closeFilterModal() {
  document.getElementById("filterModal").style.display = "none";
}

function applyFilters() {
  currentFilters.name = document.getElementById("filterName").value.trim();
  currentFilters.department = document.getElementById("filterDepartment").value;
  currentFilters.role = document.getElementById("filterRole").value;

  applyAllFilters();
  closeFilterModal();
}

function clearFilters() {
  document.getElementById("filterName").value = "";
  document.getElementById("filterDepartment").value = "";
  document.getElementById("filterRole").value = "";
  document.getElementById("searchInput").value = "";

  currentFilters = {
    search: "",
    name: "",
    department: "",
    role: "",
  };

  applyAllFilters();
  closeFilterModal();
}

function openAddModal() {
  isEditing = false;
  currentEmployeeId = null;
  document.getElementById("modalTitle").textContent = "Add Employee";
  document.getElementById("employeeForm").reset();
  clearFormErrors();
  document.getElementById("employeeModal").style.display = "flex";
}

function closeEmployeeModal() {
  document.getElementById("employeeModal").style.display = "none";
  document.getElementById("employeeForm").reset();
  clearFormErrors();
}

function editEmployee(id) {
  const employee = employees.find((emp) => emp.id === id);
  if (!employee) return;

  isEditing = true;
  currentEmployeeId = id;
  document.getElementById("modalTitle").textContent = "Edit Employee";

  document.getElementById("firstName").value = employee.firstName;
  document.getElementById("lastName").value = employee.lastName;
  document.getElementById("email").value = employee.email;
  document.getElementById("department").value = employee.department;
  document.getElementById("role").value = employee.role;

  clearFormErrors();
  document.getElementById("employeeModal").style.display = "flex";
}

function deleteEmployee(id) {
  if (confirm("Are you sure you want to delete this employee?")) {
    employees = employees.filter((emp) => emp.id !== id);
    applyAllFilters();
    showAlert("Employee deleted successfully!", "success");
  }
}

function handleFormSubmit(e) {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  const formData = {
    firstName: document.getElementById("firstName").value.trim(),
    lastName: document.getElementById("lastName").value.trim(),
    email: document.getElementById("email").value.trim(),
    department: document.getElementById("department").value,
    role: document.getElementById("role").value.trim(),
  };

  if (isEditing) {
    const employeeIndex = employees.findIndex(
      (emp) => emp.id === currentEmployeeId
    );
    if (employeeIndex !== -1) {
      employees[employeeIndex] = { ...employees[employeeIndex], ...formData };
      showAlert("Employee updated successfully!", "success");
    }
  } else {
    const newEmployee = {
      id: Math.max(...employees.map((emp) => emp.id)) + 1,
      ...formData,
    };
    employees.push(newEmployee);
    showAlert("Employee added successfully!", "success");
  }

  closeEmployeeModal();
  applyAllFilters();
  populateFilterOptions();
}

function validateForm() {
  let isValid = true;
  clearFormErrors();

  // Validate first name
  const firstName = document.getElementById("firstName").value.trim();
  if (!firstName) {
    showFieldError("firstName", "First name is required");
    isValid = false;
  }

  // Validate last name
  const lastName = document.getElementById("lastName").value.trim();
  if (!lastName) {
    showFieldError("lastName", "Last name is required");
    isValid = false;
  }

  // Validate email
  const email = document.getElementById("email").value.trim();
  if (!email) {
    showFieldError("email", "Email is required");
    isValid = false;
  } else if (!isValidEmail(email)) {
    showFieldError("email", "Please enter a valid email address");
    isValid = false;
  } else {
    // Check for duplicate email
    const existingEmployee = employees.find(
      (emp) =>
        emp.email.toLowerCase() === email.toLowerCase() &&
        emp.id !== currentEmployeeId
    );
    if (existingEmployee) {
      showFieldError("email", "Email already exists");
      isValid = false;
    }
  }

  // Validate department
  const department = document.getElementById("department").value;
  if (!department) {
    showFieldError("department", "Department is required");
    isValid = false;
  }

  // Validate role
  const role = document.getElementById("role").value.trim();
  if (!role) {
    showFieldError("role", "Role is required");
    isValid = false;
  }

  return isValid;
}

function showFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const errorElement = document.getElementById(fieldId + "Error");

  field.parentElement.classList.add("error");
  errorElement.textContent = message;
  errorElement.style.display = "block";
}

function clearFormErrors() {
  const formGroups = document.querySelectorAll(".form-group");
  formGroups.forEach((group) => {
    group.classList.remove("error");
    const errorElement = group.querySelector(".error-message");
    if (errorElement) {
      errorElement.style.display = "none";
    }
  });
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showAlert(message, type) {
  const alertElement = document.getElementById(
    type === "success" ? "successAlert" : "errorAlert"
  );
  alertElement.textContent = message;
  alertElement.style.display = "block";

  setTimeout(() => {
    alertElement.style.display = "none";
  }, 5000);
}

function resetToMainPage() {
  // Clear all filters and search
  document.getElementById("searchInput").value = "";
  document.getElementById("filterName").value = "";
  document.getElementById("filterDepartment").value = "";
  document.getElementById("filterRole").value = "";

  // Reset filters object
  currentFilters = {
    search: "",
    name: "",
    department: "",
    role: "",
  };

  // Reset pagination
  currentPage = 1;

  // Apply filters (which will show all employees)
  applyAllFilters();

  // Show success message
  showAlert("Filters cleared - showing all employees", "success");
}
