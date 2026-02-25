(function aplicarTemaImediato() {
  if (localStorage.getItem("theme") === "dark") {
    document.documentElement.classList.add("dark-mode");
  }
})();

document.addEventListener("DOMContentLoaded", () => {
  const btnTema = document.getElementById("toggle-theme");
  const cadastroForm = document.getElementById("form-cadastro");

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

  if (cadastroForm) {
    cadastroForm.onsubmit = async (e) => {
      e.preventDefault();

      const API_URL =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1"
          ? "http://localhost:3333"
          : "https://growtweeter.vercel.app";

      const data = {
        name: document.getElementById("reg-name").value.trim(),
        username: document.getElementById("reg-username").value.trim(),
        email: document.getElementById("reg-email").value.trim(),
        password: document.getElementById("reg-password").value,
        avatarUrl: document.getElementById("reg-avatar").value.trim(),
      };

      try {
        const res = await fetch(`${API_URL}/user`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const result = await res.json();

        if (res.ok) {
          alert("Conta criada com sucesso! Redirecionando para o login...");
          
          window.location.assign("./login.html");
          
        } else {
          alert(result.message || result.error || "Erro ao realizar cadastro");
        }
      } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Não foi possível conectar ao servidor. Verifique se o back-end está rodando.");
      }
    };
  }
});