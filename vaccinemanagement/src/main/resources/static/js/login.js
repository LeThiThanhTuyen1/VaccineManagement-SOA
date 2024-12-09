document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const userName = document.getElementById('userName').value;
      const password = document.getElementById('password').value;

      const response = await fetch('http://localhost:8080/api/auth/login', {
      	method: 'POST',
      	headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName, password })
      });

      const data = await response.text();
        alert(data);
});