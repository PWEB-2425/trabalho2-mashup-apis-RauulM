### API Mashup App – Trabalho #2

Deployed at: [https://trabalho2-mashup-apis-rauulm.onrender.com/]

---

## Elementos do grupo

- Raul Moreira 22249
- Hugo Freitas 29659

---

## Objetivo

Aplicação web com autenticação de utilizadores, mashup de duas APIs externas (clima e resumo enciclopédico), e persistência de histórico no MongoDB.

---

## Tecnologias Usadas

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Autenticação**: express-session
- **Base de Dados**: MongoDB Atlas (via Mongoose)
- **APIs Externas**:
  - [OpenWeatherMap](https://openweathermap.org/api) – previsão do tempo
  - [Wikipedia REST API](https://www.mediawiki.org/wiki/API:REST_API) – resumo da cidade

---

## Funcionalidades

- Registo e login de utilizadores com senhas encriptadas
- Sessão ativa após login (mantida com cookies e `express-session`)
- Tela de dashboard protegida por sessão
- Input de pesquisa: cidade → retorna clima e resumo da Wikipedia
- Histórico de pesquisas guardado por utilizador no MongoDB
- Logout disponível com redirecionamento para login

---

###  Instalação Local

## 1. Clonar o repositório
```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio/trabalho2-api-mashup
```

## 2. Instalar dependencias e iniciar o servidor (nao adicionei o .env ao gitignore)

npm install

## 3. Criar o .env

MONGO_URI=your_mongodb_uri
SESSION_SECRET=your_secret_key
OPENWEATHER_KEY=your_openweather_api_key

npm start

## 3. Aceder ao localhost:3000

Depois de aceder ao localhost:3000 testar as funcionalidades.
Ja existe um conta criada com username=teste e password=teste mas e possivel criar um novo tambem


