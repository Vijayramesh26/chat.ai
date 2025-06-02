## 📘 Chat.ai – Personal AI Chatbot App

A minimal AI-powered chatbot interface inspired by ChatGPT, built using **Vue 3** + **Vuetify 3**, with support for personalized user greetings and a clean UI for interactive chats.

---

### 🚀 Features

* ✨ Clean, dark-mode UI
* 👋 Personalized greeting (`Hello, Vijay`)
* 💬 Chat input with voice/text support
* 🧠 OpenAI (or custom AI) integration ready
* 🧭 Sidebar for navigating chat history and categories
* 🔐 Support for user sessions and greetings (future-ready)

---

### 🛠 Tech Stack

| Tool           | Purpose                        |
| -------------- | ------------------------------ |
| Vue 2          | Frontend framework             |
| Vuetify 2      | UI framework (Material Design) |
| Vuex           | (Optional) State management    |
| Gemini API     | AI response generation         | 

---

### 📂 Project Structure

```bash
├── public/
│   └── index.html
├── src/
│   ├── assets/              # Images, icons, etc.
│   ├── components/
│   │   └── MainComp.vue     # Main chat UI
│   ├── views/
│   │   └── ChatAi.vue       # Main entry page
│   ├── router/
│   │   └── index.js         # App routes
│   ├── App.vue
│   └── main.js
├── .env                     # API keys, config
├── package.json
└── README.md                # This file
```

---

### 📥 Installation

```bash
git clone https://github.com/yourusername/chat-ai-app.git
cd chat-ai-app
npm install
```

---

### 🧪 Development

```bash
npm run dev
```

---

### 🛠 Build for Production

```bash
npm run build
```

---

### 🔧 Environment Setup

Create a `.env` file in the root:

```env
VUE_APP_GEMINI_API_KEY=your_openai_key_here
VUE_APP_GEMINI_BASE_API_URL=https://api.openai.com/v1
```

---

### 🧠 AI Backend (Optional)

Use your own backend (Node.js, Go, Python) to proxy OpenAI or other LLM requests if needed.

---

### ✅ Completed Tasks

* [x] Welcome screen with dynamic name greeting
* [x] Responsive layout using Vuetify
* [x] Chat input component
* [x] Sidebar with history and categories

---

### 🧩 Planned Features

* [ ] Theme switcher (dark/light mode)
* [ ] User login & session storage
* [ ] Integration with OpenAI API
* [ ] Export chat history
* [ ] Voice-to-text and text-to-speech

---

### 👨‍💻 Author

**Vijay**
\[https://github.com/Vijayramesh26/]

---

### 📄 License

MIT License

---
