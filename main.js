document.addEventListener("DOMContentLoaded", () => {
      setTimeout(() => {
        document.getElementById("puzzle-loader").classList.add("fade-out");
        setTimeout(() => {
          document.getElementById("puzzle-loader").style.display = "none";
          document.body.style.overflow = "auto";
        }, 1000);
      }, 5000);

      // Load reports from localStorage on page load
      loadReports();

      // Handle form submission
      const reportForm = document.getElementById('report-form');
      reportForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('report-title').value;
        const description = document.getElementById('report-description').value;
        const timestamp = new Date().toLocaleString();

        const report = { title, description, timestamp };

        // Save to localStorage
        saveReport(report);

        // Clear form
        reportForm.reset();

        // Reload reports
        loadReports();
      });

      // Handle login button click
      const loginBtn = document.getElementById('login-btn');
      loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
        loginModal.show();
      });

      // Handle login form submission
      const loginForm = document.getElementById('login-form');
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        const messageDiv = document.getElementById('auth-message');

        // Get users from localStorage
        let users = JSON.parse(localStorage.getItem('users')) || [];

        // Check if user exists and password matches
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
          messageDiv.innerHTML = '<div class="alert alert-success">Login berhasil! Selamat datang, ' + username + '.</div>';
          // Hide modal after successful login
          setTimeout(() => {
            const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
            loginModal.hide();
            // Change login button to logout
            loginBtn.textContent = 'Logout';
            loginBtn.id = 'logout-btn';
            // Add logout functionality
            document.getElementById('logout-btn').addEventListener('click', (e) => {
              e.preventDefault();
              location.reload(); // Simple logout by reloading page
            });
          }, 2000);
        } else {
          messageDiv.innerHTML = '<div class="alert alert-danger">Username atau password salah.</div>';
        }
      });

      // Handle register form submission
      const registerForm = document.getElementById('register-form');
      registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        const messageDiv = document.getElementById('auth-message');

        // Get users from localStorage
        let users = JSON.parse(localStorage.getItem('users')) || [];

        // Check if username already exists
        const existingUser = users.find(u => u.username === username);
        if (existingUser) {
          messageDiv.innerHTML = '<div class="alert alert-danger">Username sudah digunakan.</div>';
          return;
        }

        // Check if passwords match
        if (password !== confirmPassword) {
          messageDiv.innerHTML = '<div class="alert alert-danger">Password dan konfirmasi password tidak cocok.</div>';
          return;
        }

        // Create new user
        const newUser = { username, email, password };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        messageDiv.innerHTML = '<div class="alert alert-success">Pendaftaran berhasil! Silakan login.</div>';
        // Clear form
        registerForm.reset();
        // Switch to login tab
        setTimeout(() => {
          const loginTab = document.getElementById('login-tab');
          loginTab.click();
        }, 2000);
      });
    });

    function saveReport(report) {
      let reports = JSON.parse(localStorage.getItem('reports')) || [];
      reports.push(report);
      localStorage.setItem('reports', JSON.stringify(reports));
    }

    function loadReports() {
      const reportsList = document.getElementById('reports-list');
      reportsList.innerHTML = '';
      let reports = JSON.parse(localStorage.getItem('reports')) || [];

      if (reports.length === 0) {
        reportsList.innerHTML = '<p class="text-center text-muted">Belum ada laporan yang dikirim.</p>';
        return;
      }

      reports.forEach((report, index) => {
        const reportItem = document.createElement('div');
        reportItem.className = 'list-group-item list-group-item-action';
        reportItem.innerHTML = `
          <h5 class="mb-1">${report.title}</h5>
          <p class="mb-1">${report.description}</p>
          <small class="text-muted">Dikirim pada: ${report.timestamp}</small>
          <button class="btn btn-danger btn-sm float-end" onclick="deleteReport(${index})">Hapus</button>
        `;
        reportsList.appendChild(reportItem);
      });
    }

    function deleteReport(index) {
      let reports = JSON.parse(localStorage.getItem('reports')) || [];
      reports.splice(index, 1);
      localStorage.setItem('reports', JSON.stringify(reports));
      loadReports();
    }
