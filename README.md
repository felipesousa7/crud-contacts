# Autenticação com Next.js, Firebase e Material-UI

Este projeto implementa a funcionalidade de autenticação utilizando Next.js como framework front-end, Firebase para a autenticação e armazenamento de dados, e Material-UI para a interface de usuário. O projeto inclui páginas de login, registro, e funcionalidades como exibição de mensagens de sucesso ou erro através do Snackbar do Material-UI.

## Tecnologias Utilizadas

- Next.js
- Firebase Authentication
- Firebase Firestore
- Material-UI
- Tailwind CSS

## Instalação

1. Clone o repositório: `git clone https://github.com/seu-usuario/nome-do-repositorio.git`
2. Acesse o diretório do projeto: `cd nome-do-repositorio`
3. Instale as dependências: `npm install` ou `yarn install`

## Configuração do Firebase

Antes de executar o projeto, é necessário configurar o Firebase:

1. Crie um projeto no Firebase: [console.firebase.google.com](https://console.firebase.google.com)
2. Copie as credenciais do projeto e adicione ao arquivo `.env.local` conforme o exemplo abaixo:

```plaintext
NEXT_PUBLIC_FIREBASE_API_KEY=seu-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=seu-app-id
```

3. Habilite a autenticação por e-mail/senha no console do Firebase.
4. Crie uma coleção "contacts" no Firestore para armazenar os contatos.

## Executando o Projeto

Após configurar o Firebase, você pode executar o projeto localmente:

- Desenvolvimento: `npm run dev` ou `yarn dev`
- Produção: `npm run build` + `npm start` ou `yarn build` + `yarn start`

Acesse o projeto em [http://localhost:3000](http://localhost:3000).

## Funcionalidades

- Página de login com autenticação Firebase.
- Página de registro de usuário.
- Adição, remoção e listagem de contatos utilizando o Firestore.
- Exibição de mensagens de sucesso ou erro utilizando o Snackbar do Material-UI.

## Estrutura do Projeto

A estrutura do projeto é organizada da seguinte forma:

- `/pages`: Páginas do Next.js, incluindo login, registro e outras páginas relacionadas à autenticação.
- `/components`: Componentes reutilizáveis, como formulários, botões, etc.
- `/firebase`: Configuração e funções para interação com o Firebase.
- `/context`: Contexto de autenticação utilizando o AuthContext do React.
- `/styles`: Estilos globais e configuração do Tailwind CSS.