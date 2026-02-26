# 🚀 GrowX - Rede Social Interativa (Clone X)

Bem-vindo ao **GrowX**! Este projeto é uma aplicação de rede social funcional que simula a experiência do usuário no X (Twitter). O foco principal foi criar uma interface dinâmica com manipulação de DOM, persistência de dados e uma arquitetura de API organizada.

---

## 🔗 Links Importantes
* **Site no Ar (Vercel):** https://growtweeter.vercel.app/
* **Documentação da API:** [![Postman](https://img.shields.io/badge/Postman-FF6C37?style=flat&logo=postman&logoColor=white)](https://documenter.getpostman.com/view/48950583/2sBXVmeTuz)

---

## 🔑 Acesso para Avaliação
Como o sistema possui rotas protegidas por autenticação, utilize as credenciais abaixo para testar o feed e as interações:
* **E-mail:** `teste@teste.com`
* **Senha:** `123`

> **Nota:** Se preferir, você também pode criar uma nova conta do zero através da tela de cadastro para testar o fluxo completo de registro e persistência no banco de dados.

---

## ✨ Funcionalidades principais

### 👤 Experiência do Usuário
* **Timeline Dinâmica:** Renderização em tempo real de tweets.
* **Comentários sem distrações:** Sistema de respostas limpo, sem bordas ou fundos desnecessários, com fotos de perfil integradas.
* **Sistema de Likes:** Interação visual imediata (coração).
* **Seguir/Parar de Seguir:** Gerenciamento dinâmico de conexões entre usuários.
* **Dark Mode:** Interface adaptável com troca de tema persistente (salvo no navegador).

### 🛠️ Backend & API
* **Arquitetura REST:** Rotas organizadas por recursos (Users, Tweets, Followers, Likes).
* **Integração com Banco de Dados:** Estrutura utilizando PostgreSQL e PrismaORM.
* **Gestão de Estado:** Uso de `localStorage` para manter dados do usuário e temas salvos entre sessões.

---

## 🛠️ Tecnologias Utilizadas

| Frontend | Ferramentas & Backend |
| :--- | :--- |
| **HTML5** & **CSS3** (Variáveis modernas) | **Node.js**, **TypeScript** & **Express** |
| **JavaScript (ES6+)** | **PrismaORM** & **PostgreSQL** |
| **Git/GitHub** | **JWT (Autenticação)** & **Postman** |

---

## 📸 Demonstração do Projeto

<div align="center">
  <img width="1902" height="913" alt="Demonstração do GrowX" src="/assets/demonstracao-seguidores.png" />
  <p><em>Interface principal com Dark Mode e sistema de seguidores atualizado.</em></p>
</div>
