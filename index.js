const API_URL = "https://aafthab-ahamed.github.io/Scholara/api/users";

async function fetchUsers() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const data = await response.json();
    console.log("Users:", data.users);
    return data.users;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

document.addEventListener("DOMContentLoaded", fetchUsers, () => {
  const loginForm = document.getElementById("login-form");
  const errorMessage = document.getElementById("error-message");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();

      try {
        const response = await fetch(
          "https://aafthab-ahamed.github.io/Scholara/api/users"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        const users = data.users;

        // Check credentials
        const user = users.find(
          (u) => u.username === username && u.password === password
        );

        if (!user) {
          throw new Error("Invalid username or password");
        }

        console.log("Login successful:", user);

        // Save user data to localStorage and redirect
        localStorage.setItem(
          "currentUser",
          JSON.stringify({ username: user.username, role: user.role })
        );
        window.location.href = "/index.html";
      } catch (error) {
        console.error("Login error:", error);
        if (errorMessage) {
          errorMessage.textContent = error.message || "Login failed";
          errorMessage.style.display = "block";
        }
      }
    });
  }
});

function renderMenuAndContent(role) {
  const navLinks = document.querySelector(".nav-links");
  const menus = {
    administrator: `
      <li><a href="#">Manage Students</a></li>
      <li><a href="#">System Settings</a></li>
      <li><a href="#">Reports</a></li>`,
    teacher: `
      <li><a href="#">Enter Grades</a></li>
      <li><a href="#">Class Data</a></li>`,
    student: `
      <li><a href="#">My Profile</a></li>
      <li><a href="#">Updates</a></li>`,
  };

  if (navLinks) {
    navLinks.innerHTML =
      menus[role] || `<li><a href="index.html">Home</a></li>`;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Fetch the JSON data
    const response = await fetch(
      "https://aafthab-ahamed.github.io/Scholara/api/users"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const data = await response.json();
    const users = data.users;

    // Count users with role: "student"
    const totalStudents = users.filter(
      (user) => user.role === "student"
    ).length;

    // Update the total students in the DOM
    const totalStudentsElement = document.getElementById("total-students");
    if (totalStudentsElement) {
      totalStudentsElement.textContent = totalStudents;
    }
  } catch (error) {
    console.error("Error fetching users:", error);
  }
});
