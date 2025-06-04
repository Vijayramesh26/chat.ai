<template>
  <v-app dark>
    <!-- Name Input Dialog -->
    <v-dialog v-model="dialog" max-width="500" persistent>
      <v-card v-if="username == ''" class="pa-5" dark elevation="10">
        <v-card-title class="headline">Welcome to Chat.ai</v-card-title>
        <v-card-text>
          <v-text-field v-model="nameInput" label="Enter your name" outlined dense autofocus></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="handleSave" :disabled="!nameInput.trim()">
            Get Started
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Navigation Drawer -->
    <v-navigation-drawer v-model="drawer" app :temporary="$vuetify.breakpoint.mobile"
      :permanent="!$vuetify.breakpoint.mobile" class="elevation-4" color="#1a1a1a" width="280">
      <!-- Sidebar Header -->
      <div class="pa-4 border-bottom">
        <v-btn block outlined color="primary" class="text-none" @click="startNewChat">
          <v-icon left>mdi-plus</v-icon>
          New Chat
        </v-btn>
      </div>

      <!-- Explore Section -->
      <v-list-item class="px-4 py-3" link>
        <v-list-item-icon>
          <v-icon color="blue lighten-2">mdi-diamond-stone</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="grey--text text--lighten-2">Explore Gems</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider class="mx-4"></v-divider>

      <!-- Recent Section -->
      <div class="px-4 py-3">
        <div class="grey--text text--lighten-1 text-caption font-weight-bold mb-2">RECENT CHATS</div>
        <v-list dense class="transparent">
          <v-list-item v-for="item in recentChats" :key="item.id" class="px-2 py-1 rounded" link>
            <v-list-item-content>
              <v-list-item-title class="grey--text text--lighten-3 text-body-2">
                {{ item.title }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-btn text small class="grey--text text--lighten-1 mt-2 text-none">
          Show more
          <v-icon small class="ml-1">mdi-chevron-down</v-icon>
        </v-btn>
      </div>

      <!-- Settings at Bottom -->
      <template v-slot:append>
        <v-divider></v-divider>
        <v-list-item class="px-4" link>
          <v-list-item-icon>
            <v-icon color="grey lighten-1">mdi-cog</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="grey--text text--lighten-2">Settings & Help</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-navigation-drawer>

    <!-- App Bar -->
    <v-app-bar app flat color="#1a1a1a" height="70" elevation="2">
      <!-- Mobile Menu Button -->
      <v-btn v-if="$vuetify.breakpoint.mobile" icon @click="drawer = !drawer" class="mr-3">
        <v-icon color="grey lighten-1">mdi-menu</v-icon>
      </v-btn>

      <!-- Logo and Model Selector -->
      <div class="d-flex align-center">
        <div class="d-flex align-center mr-4">
          <!-- <h2 class="blue--text text--lighten-1 font-weight-bold mr-1">Chat</h2>
          <h2 class="white--text font-weight-light">.ai</h2> -->
          <v-img src="../assets/chat_ai_logo.png" width="100"></v-img>
          <span class="ml-1 grey--text text--darken-1 text-capitalize caption">Beta</span>
        </div>

        <!-- <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn 
              text 
              small 
              class="grey--text text--lighten-1 text-none" 
              v-bind="attrs" 
              v-on="on"
            >
              {{ selectedModel }}
              <v-icon small class="ml-1">mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item v-for="model in availableModels" :key="model.value" @click="selectedModel = model.label">
              <v-list-item-title>{{ model.label }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu> -->
      </div>

      <v-spacer></v-spacer>

      <!-- Right side actions -->
      <div class="d-flex align-center">
        <v-btn icon class="mr-2">
          <v-icon color="grey lighten-1">mdi-magnify</v-icon>
        </v-btn>

        <v-btn v-if="!$vuetify.breakpoint.mobile" outlined small color="orange" class="mr-4 text-none">
          <v-icon small class="mr-1">mdi-arrow-up</v-icon>
          Upgrade
        </v-btn>

        <v-avatar size="36" color="primary">
          <span class="white--text font-weight-bold">{{ username[0] }}</span>
        </v-avatar>
      </div>
    </v-app-bar>

    <!-- Main Content -->
    <v-main class="black">
      <div class="chat-layout">
        <!-- Messages Area -->
        <div class="messages-container" ref="messagesContainer">
          <!-- Welcome Screen -->
          <div v-if="messages.length === 0" class="welcome-container">
            <div class="text-center d-flex flex-column align-center">
              <!-- <v-icon size="80" color="blue lighten-2" class="mb-4">mdi-robot-outline</v-icon> -->
              <!-- <v-img src="../assets/chat_ai_logo.png" width="150" ></v-img> -->

              <h1 class="display-1 font-weight-light mb-2">
                <span class="blue--text text--lighten-1">Hello, </span>
                <span class="red--text text--lighten-1">{{ username }}</span>
              </h1>
              <p class="grey--text text--lighten-1 text-h6">How can I help you today?</p>

              <!-- Suggestion Cards -->
              <div class="suggestion-cards mt-8" v-if="!$vuetify.breakpoint.mobile">
                <v-row justify="center">
                  <v-col cols="12" sm="6" md="4" v-for="suggestion in suggestions" :key="suggestion.id">
                    <v-card class="suggestion-card pa-4" outlined hover @click="currentMessage = suggestion.text">
                      <v-icon color="blue lighten-2" class="mb-2">{{ suggestion.icon }}</v-icon>
                      <div class="text-body-2 font-weight-medium">{{ suggestion.title }}</div>
                      <div class="text-caption grey--text">{{ suggestion.description }}</div>
                    </v-card>
                  </v-col>
                </v-row>
              </div>
            </div>
          </div>

          <!-- Chat Messages -->
          <div v-else class="messages-list">
            <div v-for="message in messages" :key="message.id" class="message-wrapper">
              <!-- User Message -->
              <div v-if="message.type === 'user'" class="user-message-container">
                <div class="user-message">
                  {{ message.content }}
                </div>
              </div>

              <!-- AI Response -->
              <div v-if="message.type === 'ai'" class="ai-message-container">
                <v-avatar size="32" class="mr-3">
                  <!-- <v-icon color="white">mdi-robot</v-icon> -->
                  <v-img src="../assets/favicon.png"></v-img>
                </v-avatar>
                <div class="ai-message-content overflow-x-auto">
                  <div class="ai-message"
                    v-html="message.id === messages[messages.length - 1].id ? formatMarkdown(typedContent) : formatMarkdown(message.content)">
                  </div>
                  <div class="message-actions mt-2">
                    <v-btn x-small text color="grey lighten-1" @click="copyText(message.content)">
                      <v-icon x-small class="mr-1">mdi-content-copy</v-icon>
                      Copy
                    </v-btn>
                    <v-btn x-small text color="grey lighten-1">
                      <v-icon x-small class="mr-1">mdi-thumb-up-outline</v-icon>
                      Like
                    </v-btn>
                  </div>
                </div>
              </div>
            </div>

            <!-- Loading Message -->
            <div v-if="isLoading" class="ai-message-container">
              <v-avatar size="32" class="mr-3">
                <!-- <v-icon color="white" class="spin">mdi-robot</v-icon> -->
                <v-img src="../assets/favicon.png"></v-img>
              </v-avatar>
              <!-- <div class="ai-message-content">
                <div class="loading-message">
                  <v-icon class="blue--text text--lighten-2 mr-2 pulse">mdi-circle</v-icon> -->
              <span class="grey--text text--lighten-2">Thinking...</span>
              <!-- </div>
              </div> -->
            </div>
          </div>
        </div>

        <!-- Error Alert -->
        <v-alert v-if="errorMessage" type="error" dismissible @input="errorMessage = ''" class="mx-4 mb-2">
          {{ errorMessage }}
        </v-alert>

        <!-- Input Area -->
        <div class="input-wrapper">
          <v-card class="input-card elevation-8 grey darken-4" >
            <v-form @submit.prevent="sendMessage">
              <div class="input-container">
                <v-btn icon color="grey lighten-2" class="mr-2">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>

                <v-text-field v-model="currentMessage" ref="messageInput" placeholder="Ask anything..." solo flat
                  hide-details dark background-color="transparent" :disabled="isLoading" @keyup.enter="sendMessage"
                  class="message-input" autofocus></v-text-field>

                <div class="action-buttons">
                  <v-btn icon color="grey lighten-2">
                    <v-icon>mdi-paperclip</v-icon>
                  </v-btn>
                  <v-btn icon color="grey lighten-2">
                    <v-icon>mdi-microphone</v-icon>
                  </v-btn>
                  <!-- <v-btn icon class="grey darken-1 d-flex align-center justify-center" :disabled="!currentMessage.trim() || isLoading" @click="sendMessage">
                    <v-icon :class="!currentMessage.trim() || isLoading
                      ? 'grey--text text--lighten-1'
                      : 'blue--text text--darken-1'"  >mdi-send</v-icon>
                  </v-btn> -->
                   <!-- Send Button -->
                  <v-btn icon color="blue" :disabled="!currentMessage.trim() || isLoading" @click="sendMessage">
                    <v-icon>mdi-send</v-icon>
                  </v-btn>
                </div>
              </div>
            </v-form>
          </v-card>

          <div class="disclaimer">
            <span class="grey--text text--darken-1 caption">
              Chat.ai can make mistakes, so double-check it.
            </span>
          </div>
        </div>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import { marked } from "marked";

export default {
  name: 'ChatAiInterface',
  data() {
    return {
      typedContent: '',
      username: '',
      nameInput: '',
      showWelcome: false,
      dialog: false,
      drawer: false,
      currentMessage: '',
      isLoading: false,
      messages: [],
      messageIdCounter: 1,
      errorMessage: '',
      selectedModel: 'Beta',
      availableModels: [
        { label: 'Beta', value: 'gemini-2.0-flash' },
        { label: '1.5 Pro', value: 'gemini-1.5-pro' },
        { label: '1.5 Flash', value: 'gemini-1.5-flash' }
      ],
      apiKey: process.env.VUE_APP_GEMINI_API_KEY,
      recentChats: [
        { id: 1, title: 'UI UX Design Guide' },
        { id: 2, title: 'Go Programming ...' },
        { id: 3, title: 'Vue.js Vuetify ...' },
      ],
      suggestions: [
        {
          id: 1,
          icon: 'mdi-lightbulb-outline',
          title: 'Creative Ideas',
          description: 'Get inspiration for projects',
          text: 'I need some creative ideas for a new mobile app'
        },
        {
          id: 2,
          icon: 'mdi-code-tags',
          title: 'Coding Help',
          description: 'Get help with programming',
          text: 'Help me understand async/await in JavaScript'
        },
        {
          id: 3,
          icon: 'mdi-school-outline',
          title: 'Learn Something',
          description: 'Explain a concept',
          text: 'Explain quantum computing in simple terms'
        }
      ]
    }
  },
  created() {
    this.checkLocalStorage()
  },
  mounted() {
    this.drawer = !this.$vuetify.breakpoint.mobile;
  },
  watch: {
    messages() {
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },
    '$vuetify.breakpoint.mobile'(isMobile) {
      this.drawer = !isMobile;
    }
  },
  methods: {
    copyText(textToCopy) {
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          console.log('Copied!');
        })
        .catch(err => {
          console.error('Failed to copy:', err);
        });
    },

    async startTyping(fullMessage) {
      this.typedContent = '';
      for (let i = 0; i < fullMessage.length; i++) {
        this.typedContent += fullMessage[i];
        await new Promise(resolve => setTimeout(resolve, 10)); // 10ms per character
      }
      this.scrollToBottom()
    },

    formatMarkdown(text) {
      return marked(text); // Optional: if you still want markdown support
    },

    async sendMessage() {
      if (!this.currentMessage.trim() || this.isLoading) return;

      // Check if API key is set
      if (!this.apiKey || this.apiKey === 'YOUR_API_KEY') {
        this.errorMessage = 'Please set your Chat.ai API key in the environment variables';
        return;
      }

      const userMessage = {
        id: this.messageIdCounter++,
        type: 'user',
        content: this.currentMessage.trim(),
        timestamp: new Date()
      };

      this.messages.push(userMessage);
      const messageToSend = this.currentMessage.trim();
      this.currentMessage = '';
      this.isLoading = true;
      this.errorMessage = '';

      // Close drawer on mobile after sending message
      if (this.$vuetify.breakpoint.mobile) {
        this.drawer = false;
      }

      try {
        const response = await this.callchataiAPI(messageToSend);

        const aiMessage = {
          id: this.messageIdCounter++,
          type: 'ai',
          content: response,
          timestamp: new Date()
        };

        // Call the slow typing effect
        this.startTyping(response);
        this.messages.push(aiMessage);
      } catch (error) {
        console.error('Error calling chat.ai API:', error);
        this.errorMessage = `Error: ${error.message}`;
      } finally {
        this.isLoading = false;
        this.scrollToBottom();
      }
    },

    async callchataiAPI(message) {
      // Get the current model value
      const currentModel = this.availableModels.find(
        model => model.label === this.selectedModel
      );
      const modelName = currentModel ? currentModel.value : 'gemini-1.5-flash';

      // Use the correct API endpoint
      const apiUrl = `${process.env.VUE_APP_GEMINI_BASE_API_URL}${modelName}:generateContent?key=${this.apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: message
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorData}`);
      }

      const data = await response.json();

      // Extract the response text from Chat.ai API response
      if (data.candidates && data.candidates.length > 0) {
        const candidate = data.candidates[0];
        if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
          return candidate.content.parts[0].text;
        }
      }

      throw new Error('No valid response received from Chat.ai API');
    },

    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messagesContainer;
        if (container) container.scrollTop = container.scrollHeight;
        this.$refs.messageInput?.focus();
      });
    },

    startNewChat() {
      this.messages = [];
      this.currentMessage = '';
      this.errorMessage = '';

      // Close drawer on mobile after starting new chat
      if (this.$vuetify.breakpoint.mobile) {
        this.drawer = false;
      }
    },

    checkLocalStorage() {
      const storedName = localStorage.getItem('username');
      if (storedName) {
        this.username = storedName;
      } else {
        this.dialog = true;
      }
    },

    handleSave() {
      const trimmed = this.nameInput.trim();
      if (trimmed.length > 0) {
        localStorage.setItem('username', trimmed);
        this.username = trimmed;
        this.dialog = false;
      } else {
        this.errorMessage = "Name cannot be empty.";
      }
    },
  }
}
</script>

<style scoped>
/* .main-bg {
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
} */

.chat-layout {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 70px);
  max-width: 100%;
  overflow: hidden;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px 0;
  min-height: 0;
}

.welcome-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 0 20px;
}

.suggestion-cards {
  max-width: 600px;
  margin: 0 auto;
}

.suggestion-card {
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  cursor: pointer;
  transition: all 0.3s ease;
}

.suggestion-card:hover {
  background: rgba(255, 255, 255, 0.1) !important;
  transform: translateY(-2px);
}

.messages-list {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

.message-wrapper {
  margin-bottom: 24px;
}

.user-message-container {
  display: flex;
  justify-content: flex-end;
}

.user-message {
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
  color: white;
  padding: 12px 18px;
  border-radius: 18px 18px 4px 18px;
  max-width: 70%;
  word-wrap: break-word;
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.3);
}

.ai-message-container {
  display: flex;
  align-items: flex-start;
  background: rgba(255, 255, 255, 0.05);
  color: #e0e0e0;
  padding: 16px 20px;
  border-radius: 4px 18px 18px 18px;
  border-left: 3px solid #2196F3;
  word-wrap: break-word;
  line-height: 1.6;
}

.ai-message-content {
  flex: 1;
  /* max-width: 70%; */

}

/* .ai-message {
  background: rgba(255, 255, 255, 0.05);
  color: #e0e0e0;
  padding: 16px 20px;
  border-radius: 4px 18px 18px 18px;
  border-left: 3px solid #2196F3;
  word-wrap: break-word;
  line-height: 1.6;
} */

.loading-message {
  background: rgba(255, 255, 255, 0.05);
  padding: 16px 20px;
  border-radius: 4px 18px 18px 18px;
  border-left: 3px solid #2196F3;
  display: flex;
  align-items: center;
}

.message-actions {
  display: flex;
  gap: 8px;
}

.input-wrapper {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}

.input-card {
  border-radius: 25px !important; 
  backdrop-filter: blur(10px);
}

.input-container {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  gap: 12px;
}

.message-input {
  flex: 1;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* .send-btn {
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%) !important;
} */

.disclaimer {
  text-align: center;
  margin-top: 12px;
}

.border-bottom {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

/* Animations */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
}

.spin {
  animation: spin 2s linear infinite;
}

.pulse {
  animation: pulse 1.5s ease-in-out infinite;
}

/* Scrollbar */
.messages-container::-webkit-scrollbar {
  width: 6px;
}

.messages-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

.messages-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* Mobile Responsive */
@media (max-width: 600px) {

  .user-message,
  .ai-message-content {
    max-width: 85%;
  }

  .messages-list {
    padding: 0 12px;
  }

  .input-wrapper {
    padding: 12px;
  }

  .suggestion-cards .col {
    padding: 4px;
  }
}
</style>