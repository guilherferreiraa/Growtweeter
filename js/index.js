document.addEventListener("DOMContentLoaded", () => {
  const timeline = document.getElementById("timeline");
  const inputTweet = document.getElementById("tweet-content");
  const btnTweetar = document.getElementById("btn-tweetar");
  const btnTema = document.getElementById("theme-toggle");
  const btnSair = document.getElementById("logout-btn");

  const FOTO_PADRAO = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  const API_URL =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
      ? "http://localhost:3333"
      : "https://growtweeter-tn97.onrender.com";

  const token = localStorage.getItem("token");
  let user = JSON.parse(localStorage.getItem("user")) || {};
  let feed = [];

  // Redirecionamento se não houver token
  if (!token && !window.location.pathname.includes("login.html") && !window.location.pathname.includes("cadastro.html")) {
    window.location.href = "./login.html";
    return;
  }

  // Logout
  if (btnSair) {
    btnSair.onclick = (e) => {
      e.preventDefault();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "login.html";
    };
  }

  // --- RENDERIZAÇÃO DO FEED (SEM BOTÃO DE SEGUIR) ---
  function renderizarFeed() {
    if (!timeline) return;
    timeline.innerHTML = "";

    feed.forEach((tweet) => {
      const tweetElement = document.createElement("div");
      tweetElement.classList.add("tweet-card");

      const usernameAutor = tweet.arroba ? tweet.arroba.trim() : "usuario";
      const fotoAutor = `https://github.com/${usernameAutor}.png`;

      const htmlRespostas = tweet.respostas && tweet.respostas.length > 0
          ? `<div class="respostas-container" style="margin-top: 10px; margin-left: 50px; border-left: 2px solid #eff3f4; padding-left: 15px;">
            ${tweet.respostas.map((r) => `
                <div class="reply-item" style="margin-bottom: 8px; font-size: 0.9em;">
                    <span style="font-weight: bold; color: #1d9bf0;">@${r.autor}</span> 
                    <span style="color: #ffffff;">${r.conteudo}</span>
                </div>`).join("")}
        </div>` : "";

      tweetElement.innerHTML = `
        <div class="tweet-container">
            <img src="${fotoAutor}" alt="Avatar" class="avatar-tweet" 
                 onerror="this.src='${FOTO_PADRAO}'" onclick="verPerfil('${tweet.userId}')" style="cursor:pointer">
            <div class="tweet-content">
                <div class="tweet-header">
                    <div class="header-info" onclick="verPerfil('${tweet.userId}')" style="cursor: pointer;">
                        <strong>${tweet.nome}</strong> 
                        <span>@${usernameAutor}</span>
                    </div>
                </div>
                <p class="tweet-texto">${tweet.texto}</p>
                <div class="tweet-actions">
                    <button class="btn-like" id="like-btn-${tweet.id}" onclick="curtir('${tweet.id}')" 
                            style="color: ${tweet.euCurti ? "#f91880" : "#71767b"}; background: none; border: none; cursor: pointer;">
                        ${tweet.euCurti ? "❤️" : "🤍"} <span class="like-count">${tweet.likes}</span>
                    </button>
                    <button class="btn-reply" onclick="responderTweet('${tweet.id}')" 
                            style="color: #1d9bf0; margin-left: 15px; background: none; border: none; cursor: pointer;">
                        💬 ${tweet.respostas.length}
                    </button>
                </div>
                ${htmlRespostas}
            </div>
        </div>
      `;
      timeline.appendChild(tweetElement);
    });
  }

  // --- SINCRONIZAÇÃO E CARREGAMENTO ---
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
      if (!Array.isArray(usuarios)) return;

      const meuUsuario = usuarios.find((u) => u.username?.trim() === user.username?.trim());

      if (meuUsuario) {
        user.id = meuUsuario.id;
        user.name = meuUsuario.name;
        const usernameLimpo = meuUsuario.username.trim();
        const fotoReal = `https://github.com/${usernameLimpo}.png`;

        user.avatarUrl = fotoReal;
        localStorage.setItem("user", JSON.stringify(user));

        if (nameEl) nameEl.textContent = user.name;
        if (handleEl) handleEl.textContent = `@${usernameLimpo}`;
        if (sideAvatar) sideAvatar.src = fotoReal;
        if (tweetAvatar) tweetAvatar.src = fotoReal;
      }
    } catch (e) { console.error("Erro na sincronização:", e); }
    carregarTweets();
  }

  window.carregarTweets = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/tweet/feed`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const tweetsBanco = await res.json();
      if (!Array.isArray(tweetsBanco)) return;

      const tweetsPrincipais = tweetsBanco.filter((t) => !t.parentTweetId);

      feed = tweetsPrincipais.map((t) => {
        const autor = t.user || {};
        return {
            id: t.id,
            userId: autor.id || t.userId,
            nome: autor.name || "Usuário",
            arroba: autor.username || "user",
            texto: t.content,
            likes: t.likes ? t.likes.length : 0,
            euCurti: t.likes ? t.likes.some((l) => l.userId === user.id) : false,
            respostas: t.replies ? t.replies.map(r => ({
                id: r.id,
                autor: r.user?.username || "user",
                conteudo: r.content
            })) : []
        };
      });
      renderizarFeed();
    } catch (e) { console.error("Erro ao carregar tweets:", e); }
  };

 
  window.curtir = async (tweetId) => {
    const tweet = feed.find((t) => t.id === tweetId);
    if (!tweet) return;
    const jaCurtiu = tweet.euCurti;
    try {
      const res = await fetch(`${API_URL}/${jaCurtiu ? "unlike" : "like"}/${tweetId}`, {
        method: jaCurtiu ? "DELETE" : "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
          tweet.euCurti = !jaCurtiu;
          tweet.likes += jaCurtiu ? -1 : 1;
          renderizarFeed();
      }
    } catch (e) { console.error(e); }
  };

  window.responderTweet = async (tweetIdOriginal) => {
    const resposta = prompt("Digite sua resposta:");
    if (!resposta || resposta.trim() === "") return;
    try {
      const res = await fetch(`${API_URL}/tweet/${tweetIdOriginal}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: resposta, tweetId: tweetIdOriginal }),
      });
      if (res.ok) {
        alert("Resposta enviada!");
        await carregarTweets();
      }
    } catch (e) { console.error("Erro na resposta:", e); }
  };

window.verPerfil = async (id) => {
    try {
        const res = await fetch(`${API_URL}/user/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const perfil = await res.json();
        
        timeline.innerHTML = `
            <div class="perfil-info-header" style="padding: 20px; border-bottom: 1px solid #333;">
                <button onclick="window.location.reload()" style="background:none; border:none; color:#1d9bf0; cursor:pointer; font-size: 1.1em; margin-bottom:10px;">← Voltar ao Feed</button>
                <h2 style="margin: 0; color: white;">${perfil.name}</h2>
                <p style="color: #71767b; margin: 5px 0;">@${perfil.username}</p>
                <div style="display: flex; gap: 20px; margin-top: 10px;">
                    <span><strong style="color: white;">${perfil.following?.length || 0}</strong> <span style="color: #71767b;">Seguindo</span></span>
                    <span><strong style="color: white;">${perfil.followers?.length || 0}</strong> <span style="color: #71767b;">Seguidores</span></span>
                </div>
            </div>
            <div id="lista-tweets-perfil"></div>
        `;

        const containerTweets = document.getElementById("lista-tweets-perfil");

        if (perfil.tweets && perfil.tweets.length > 0) {
            perfil.tweets.forEach(t => {
                const card = document.createElement("div");
                card.classList.add("tweet-card");
                card.innerHTML = `
                    <div class="tweet-container">
                        <img src="https://github.com/${perfil.username}.png" class="avatar-tweet" onerror="this.src='${FOTO_PADRAO}'">
                        <div class="tweet-content">
                            <div class="tweet-header">
                                <strong>${perfil.name}</strong> 
                                <span style="color: #71767b;">@${perfil.username}</span>
                            </div>
                            <p class="tweet-texto">${t.content}</p>
                        </div>
                    </div>
                `;
                containerTweets.appendChild(card);
            });
        } else {
            containerTweets.innerHTML = `<div style="padding: 40px; text-align: center; color: #71767b;">Este usuário ainda não postou nada.</div>`;
        }
    } catch (e) {
        console.error(e);
    }
};

  // --- CRIAÇÃO DE TWEET ---
  if (btnTweetar && inputTweet) {
    btnTweetar.onclick = async () => {
      const texto = inputTweet.value.trim();
      if (!texto) return;
      try {
        const res = await fetch(`${API_URL}/tweet`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: texto }),
        });
        if (res.ok) {
          inputTweet.value = "";
          await carregarTweets();
        }
      } catch (e) { console.error(e); }
    };
  }

  // --- TEMA ---
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
  if (token) sincronizarUsuario();
});