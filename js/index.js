document.addEventListener("DOMContentLoaded", () => {
  // --- SELEÇÃO DE ELEMENTOS ---
  const timeline = document.getElementById("timeline");
  const inputTweet = document.getElementById("tweet-content");
  const btnTweetar = document.getElementById("btn-tweetar");
  const btnTema = document.getElementById("theme-toggle");
  const btnSair = document.getElementById("logout-btn");

  const FOTO_PADRAO = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  const API_URL =
    window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
      ? "http://localhost:3333"
      : "https://growtweeter.vercel.app";

  const token = localStorage.getItem("token");
  let user = JSON.parse(localStorage.getItem("user")) || {};
  let feed = [];

  if (!token && !window.location.pathname.includes("login.html") && !window.location.pathname.includes("cadastro.html")) {
    window.location.href = "./login.html";
    return;
  }

  if (btnSair) {
    btnSair.onclick = (e) => {
      e.preventDefault();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "login.html";
    };
  }

  // --- RENDERIZAÇÃO DO FEED ---
  function renderizarFeed() {
    if (!timeline) return;
    timeline.innerHTML = "";

    feed.forEach((tweet) => {
      const tweetElement = document.createElement("div");
      tweetElement.classList.add("tweet-card");

      const usernameAutor = tweet.arroba ? tweet.arroba.trim() : "usuario";
      const fotoAutor = `https://github.com/${usernameAutor}.png`;

      const eMeuTweet = tweet.userId === user.id;
      
      // Ajuste na classe e texto do botão de seguir
      const btnSeguirHtml = !eMeuTweet
        ? `<button class="btn-follow-mini ${tweet.seguindo ? "following" : ""}" 
                   onclick="toggleFollow('${tweet.userId}', this)">
            ${tweet.seguindo ? "Seguindo" : "Seguir"}
           </button>`
        : "";

      tweetElement.innerHTML = `
            <div class="tweet-container">
                <img src="${fotoAutor}" alt="Avatar" class="avatar-tweet" 
                     onerror="this.src='${FOTO_PADRAO}'">
                <div class="tweet-content">
                    <div class="tweet-header">
                        <div class="header-info">
                            <strong>${tweet.nome}</strong> 
                            <span>@${usernameAutor}</span>
                        </div>
                        ${btnSeguirHtml}
                    </div>
                    <p class="tweet-texto">${tweet.texto}</p>
                    <div class="tweet-actions">
                        <button class="btn-like" onclick="curtir('${tweet.id}')" 
                                style="color: ${tweet.euCurti ? "#f91880" : "#71767b"};">
                            ${tweet.euCurti ? "❤️" : "🤍"} ${tweet.likes}
                        </button>
                    </div>
                </div>
            </div>
        `;
      timeline.appendChild(tweetElement);
    });
  }

  async function sincronizarUsuario() {
    const nameEl = document.getElementById("user-display-name");
    const handleEl = document.getElementById("user-display-handle");
    const sideAvatar = document.getElementById("user-avatar");
    const tweetAvatar = document.getElementById("user-tweet-img");

    try {
      const res = await fetch(`${API_URL}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const usuarios = await res.json();
      const meuUsuario = usuarios.find((u) => u.username.trim() === user.username.trim());

      if (meuUsuario) {
        user.id = meuUsuario.id;
        user.name = meuUsuario.name;
        const usernameLimpo = meuUsuario.username.trim();
        const fotoReal = `https://github.com/${usernameLimpo}.png`;
        
        user.avatarUrl = fotoReal;
        localStorage.setItem("user", JSON.stringify(user));

        if (nameEl) nameEl.textContent = user.name;
        if (handleEl) handleEl.textContent = `@${usernameLimpo}`;
        
        if (sideAvatar) {
            sideAvatar.src = fotoReal;
            sideAvatar.onerror = () => sideAvatar.src = FOTO_PADRAO;
        }
        if (tweetAvatar) {
            tweetAvatar.src = fotoReal;
            tweetAvatar.onerror = () => tweetAvatar.src = FOTO_PADRAO;
        }
      }
    } catch (e) { console.error("Erro na sincronização:", e); }
    carregarTweets();
  }

  async function carregarTweets() {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/tweet`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const tweetsBanco = await res.json();

      feed = tweetsBanco.map((t) => ({
        id: t.id,
        userId: t.user?.id || t.userId,
        nome: t.user?.name || t.user?.username || "Usuário",
        arroba: t.user?.username || "user",
        texto: t.content,
        likes: t.likes ? t.likes.length : 0,
        euCurti: t.likes ? t.likes.some((l) => l.userId === user.id) : false,
        seguindo: t.user?.followers ? t.user.followers.some((f) => f.followerId === user.id) : false,
      }));

      renderizarFeed();
    } catch (e) { console.error("Erro ao carregar tweets:", e); }
  }

  window.curtir = async (tweetId) => {
    const tweet = feed.find((t) => t.id === tweetId);
    if (!tweet) return;
    const jaCurtiu = tweet.euCurti;
    try {
      await fetch(`${API_URL}/${jaCurtiu ? "unlike" : "like"}/${tweetId}`, {
        method: jaCurtiu ? "DELETE" : "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      await carregarTweets();
    } catch (e) { console.error(e); }
  };

  // --- AJUSTE NA FUNÇÃO DE SEGUIR ---
  window.toggleFollow = async (userIdParaSeguir, botao) => {
    const jaSeguindo = botao.classList.contains("following");
    const endpoint = jaSeguindo ? "unfollow" : "follow";
    const metodo = jaSeguindo ? "DELETE" : "POST";

    // Otimismo: muda o visual antes da resposta do servidor para parecer mais rápido
    botao.disabled = true; 

    try {
      const res = await fetch(`${API_URL}/${endpoint}/${userIdParaSeguir}`, {
        method: metodo,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        // Se a API confirmou, recarregamos para atualizar o estado global
        await sincronizarUsuario();
      } else {
        alert("Não foi possível processar a ação. Tente novamente.");
        botao.disabled = false;
      }
    } catch (e) { 
      console.error(e);
      botao.disabled = false;
    }
  };

  if (btnTweetar && inputTweet) {
    btnTweetar.onclick = async () => {
      const texto = inputTweet.value.trim();
      if (!texto) return;
      try {
        const res = await fetch(`${API_URL}/tweet`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ content: texto }),
        });
        if (res.ok) {
          inputTweet.value = "";
          await carregarTweets();
        }
      } catch (e) { console.error(e); }
    };
  }

  const aplicarTema = (tema) => {
    document.documentElement.classList.toggle("dark-mode", tema === "dark");
    if (btnTema) btnTema.textContent = tema === "dark" ? "🌙" : "☀️";
  };

  if (btnTema) {
    btnTema.onclick = () => {
      const novoTema = document.documentElement.classList.contains("dark-mode") ? "light" : "dark";
      localStorage.setItem("theme", novoTema);
      aplicarTema(novoTema);
    };
  }

  aplicarTema(localStorage.getItem("theme") || "dark");

  if (token) {
    sincronizarUsuario();
  }
});