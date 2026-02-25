(function aplicarTemaImediato() {
  if (localStorage.getItem("theme") === "dark") {
    document.documentElement.classList.add("dark-mode");
  }
})();

document.addEventListener("DOMContentLoaded", () => {
  const btnTema = document.getElementById("toggle-theme");
  const loginForm = document.getElementById("form-login");

  if (localStorage.getItem("token")) {
    window.location.assign("./index.html");
    return;
  }

  const gerenciarTema = (tema) => {
    const isDark = tema === "dark";
    document.documentElement.classList.toggle("dark-mode", isDark);
    if (btnTema) btnTema.textContent = isDark ? "🌙" : "☀️";
  };

  if (btnTema) {
    btnTema.onclick = () => {
      const novoTema = document.documentElement.classList.contains("dark-mode")
        ? "light"
        : "dark";
      localStorage.setItem("theme", novoTema);
      gerenciarTema(novoTema);
    };
    gerenciarTema(localStorage.getItem("theme") || "light");
  }

  if (loginForm) {
    loginForm.onsubmit = async (e) => {
      e.preventDefault();

      const API_URL =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1"
          ? "http://localhost:3333"
          : "https://growtweeter.vercel.app";

      const email = document.getElementById("login-email").value.trim();
      const password = document.getElementById("login-password").value;

      try {
        const res = await fetch(`${API_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (res.ok) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));

          window.location.assign("./index.html");
        } else {
          alert(data.message || data.error || "E-mail ou senha incorretos.");
        }
      } catch (error) {
        console.error("Erro no login:", error);
        alert("Erro ao conectar com o servidor. Verifique sua conexão.");
      }
    };
  }
});