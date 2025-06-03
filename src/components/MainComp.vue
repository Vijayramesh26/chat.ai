<template>
  <v-app dark>
    <!-- <v-dialog v-model="showCard">
      <v-card class="pa-4 mx-auto mt-8" max-width="400" color="#1e1e1e" dark elevation="8">
        <v-card-title>Hello, {{ username }}</v-card-title>
        <v-card-text>Welcome back! Ready to ask something?</v-card-text>
      </v-card>
    </v-dialog> -->
    <v-dialog v-model="dialog" max-width="500" class="rounded-lg" persistent>
      <v-card>


        <!-- Name input -->
        <v-card v-if="username == ''" class="pa-5" dark elevation="10">
          <v-card-title class="headline">Enter your name</v-card-title>
          <v-card-text>
            <v-text-field v-model="nameInput" label="Your name" outlined dense></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="handleSave">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-card>
    </v-dialog>
    <!-- Navigation Drawer -->
    <v-navigation-drawer v-model="drawer" app :temporary="$vuetify.breakpoint.mobile"
      :permanent="!$vuetify.breakpoint.mobile" class="grey darken-4" width="280">
      <!-- Sidebar Header -->
      <div class="pa-4">
        <v-btn icon @click="drawer = !drawer">
          <v-icon color="grey lighten-1">mdi-menu</v-icon>
        </v-btn>
      </div>

      <!-- New Chat -->
      <v-list-item class="px-4 mb-2" @click="startNewChat">
        <v-list-item-icon>
          <v-icon color="grey lighten-1">mdi-plus</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="grey--text text--lighten-1">New chat</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <!-- Explore Gems -->
      <v-list-item class="px-4 mb-4">
        <v-list-item-icon>
          <v-icon color="grey lighten-1">mdi-diamond-stone</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="grey--text text--lighten-1">Explore Gems</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <!-- Recent Section -->
      <div class="px-4 mb-2">
        <div class="grey--text text--lighten-1 text-caption font-weight-medium">Recent</div>
      </div>

      <!-- Recent Chat Items -->
      <v-list dense class="py-0">
        <v-list-item v-for="item in recentChats" :key="item.id" class="px-4 py-2">
          <v-list-item-content>
            <v-list-item-title class="grey--text text--lighten-2 text-body-2">
              {{ item.title }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <!-- Show More -->
      <v-list-item class="px-4 mt-2">
        <v-list-item-content>
          <v-list-item-title class="grey--text text--lighten-1 text-body-2">
            Show more
            <v-icon small class="ml-1">mdi-chevron-down</v-icon>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <!-- Settings & Help at Bottom -->
      <template v-slot:append>
        <v-list-item class="px-4">
          <v-list-item-icon>
            <v-icon color="grey lighten-1">mdi-cog</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="grey--text text--lighten-1">Settings & help</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-navigation-drawer>

    <!-- App Bar -->
    <v-app-bar app flat class="grey darken-4" height="64">
      <!-- Mobile Menu Button -->
      <v-btn v-if="$vuetify.breakpoint.mobile" icon @click="drawer = !drawer" class="mr-2">
        <v-icon color="grey lighten-1">mdi-menu</v-icon>
      </v-btn>

      <!-- Left side - Title and Version -->
      <div class="d-flex align-center">
        <!-- <h2 class="white--text font-weight-regular mr-2">Chat.ai</h2> -->
         <v-img src="../assets/chat_ai_logo.png" width="125"></v-img>
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn text small class="grey--text text--lighten-1" v-bind="attrs" v-on="on">
              {{ selectedModel }}
              <v-icon small class="ml-1">mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item v-for="model in availableModels" :key="model.value" @click="selectedModel = model.label">
              <v-list-item-title>{{ model.label }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>

      <v-spacer></v-spacer>

      <!-- Right side - Search, Upgrade, Avatar -->
      <div class="d-flex align-center">
        <v-btn icon class="mr-2">
          <v-icon>mdi-magnify</v-icon>
        </v-btn>

        <!-- Hide upgrade button on mobile -->
        <v-btn v-if="!$vuetify.breakpoint.mobile" outlined small class="red--text text--lighten-1 mr-4"
          style="border-color: #ef5350">
          <v-icon small class="mr-1">mdi-arrow-up</v-icon>
          Upgrade
        </v-btn>

        <v-avatar size="32" class="black">
          <span class="white--text text--lighten-1 font-weight-bold">{{ username[0] }}</span>
        </v-avatar>
      </div>
    </v-app-bar>

    <!-- Main Content -->
    <v-main class="black">
      <!-- Chat Container with Fixed Layout -->
      <div class="chat-layout">
        <!-- Messages Area -->
        <div class="messages-container" ref="messagesContainer">
          <!-- Initial Greeting (shown when no messages) -->
          <div v-if="messages.length === 0" class="greeting-container">
            <h1 class="greeting-text">
              <span class="blue--text text--lighten-1">Hello, </span>
              <span class="red--text text--lighten-1">{{ username }}</span>
            </h1>
          </div>

          <!-- Chat Messages -->
          <div v-else class="messages-list">
            <div v-for="message in messages" :key="message.id" class="message-item">
              <!-- User Message -->
              <div v-if="message.type === 'user'" class="d-flex justify-end">
                <div class="message-bubble primary white--text" color="">
                  {{ message.content }}
                </div>
              </div>

              <!-- AI Response -->
              <div v-if="message.type === 'ai'" class="d-flex justify-start flex-column "> 
                <div class="message-bubble grey lighten-4 overflow-x-auto" :style="{ maxWidth: $vuetify.breakpoint.mobile ? '100%' : '70%' }"
              
                  v-html="message.id === messages[messages.length - 1].id ? formatMarkdown(typedContent) : formatMarkdown(message.content)">
                </div>
                <div class="d-flex align-end justify-left">
                  <v-btn small  outlined @click="copyText(message.content)">
                    <v-icon small color="white" class="mt-2 ">mdi-content-copy</v-icon>
                  </v-btn>
                </div>
              </div> 
            </div>

            <!-- Loading Message -->
            <div v-if="isLoading" class="d-flex justify-start">
              <div class="message-bubble grey lighten-4">
                <div class="d-flex align-center">
                  <!-- <v-progress-circular indeterminate size="15" width="2" class="mr-2"></v-progress-circular> -->
                  <v-icon class="blue--text text--lighten-4 spin">mdi-star-four-points</v-icon>
                  <span>Thinking...</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Fixed Input Area -->
        <!-- Error Alert -->
        <v-alert v-if="errorMessage" type="error" dismissible @input="errorMessage = ''" class="mx-4 mb-2">
          {{ errorMessage }}
        </v-alert>

        <!-- Input Card -->
        <div class="input-wrapper">
          <v-card class="input-card grey darken-3 mx-3" elevation="2">
            <v-form @submit.prevent="sendMessage">
              <div class="input-row">
                <!-- Add Button -->
                <v-btn icon color="grey lighten-4">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>

                <!-- Input Field -->
                <div class="input-field-wrapper">
                  <v-text-field autofocus v-model="currentMessage" ref="messageInput" placeholder="Ask anything" solo flat
                    hide-details dark background-color="transparent" :disabled="isLoading"
                    @keyup.enter="sendMessage"></v-text-field>
                </div>

                <!-- Action Buttons -->
                <div class="action-buttons">
                  <!-- Desktop: Show text buttons -->

                  <v-btn icon small color="grey lighten-2">
                    <v-icon small>mdi-file-search</v-icon>
                  </v-btn>

                  <v-btn icon color="grey lighten-2">
                    <v-icon>mdi-microphone</v-icon>
                  </v-btn>

                  <!-- Send Button -->
                  <v-btn icon color="blue" :disabled="!currentMessage.trim() || isLoading" @click="sendMessage">
                    <v-icon>mdi-send</v-icon>
                  </v-btn>
                </div>
              </div>
            </v-form>
          </v-card>
        </div>
        <div class="d-flex align-center justify-center mt-1 grey--text text--darken-3 caption">Chat.ai can make mistakes, so double-check it</div>
      </div>
      <Snackbar />
    </v-main>
  </v-app>
</template>

<script>
import { marked } from "marked";

import Snackbar from "./Snackbar.vue"
export default {
  components: {
    Snackbar
  },
  name: 'Chat.aiInterface',
  data() {
    return {
      // for slow text
      typedContent: '',
      username: '',
      nameInput: '',
      showWelcome: false,
      dialog: false, // Controls v-dialog visibility
      drawer: false,
      currentMessage: '',
      isLoading: false,
      messages: [],
      messageIdCounter: 1,
      errorMessage: '',
      selectedModel: 'Beta',
      availableModels: [
        // { label: 'Beta', value: 'gemini-2.0-flash' },
        // { label: '1.5 Pro', value: 'gemini-1.5-pro' },
        // { label: '1.5 Flash', value: 'gemini-1.5-flash' }
      ],
      // Replace with your actual chat.ai API key
      apiKey: process.env.VUE_APP_GEMINI_API_KEY, //'AIzaSyA2jtqVHHYrO-ebcOw0nMZjWoT-XjHadFc',
      recentChats: [
        { id: 1, title: 'UI UX Design Guide' },
        { id: 2, title: 'Go Programming  ...' },
        { id: 3, title: 'Vue.js Vuetify ...' },
      ]
    }
  },
  created() {
    this.checkLocalStorage()
  },
  mounted() {
    // Set initial drawer state based on screen size
    this.drawer = !this.$vuetify.breakpoint.mobile;
    // this.checkLocalStorage();

  },
  // updated() {
  //   this.scrollToBottom()
  // },
  watch: {
    messages() {
      this.$nextTick(() => {
        const container = this.$refs.messagesContainer;
        if (container) container.scrollTop = container.scrollHeight;
      });
    },
    '$vuetify.breakpoint.mobile'(isMobile) {
      // Auto-close drawer on mobile, open on desktop
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
        await new Promise(resolve => setTimeout(resolve, 10)); // 20ms per character
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
        // this.errorMessage = 'Please set your Chat.ai API key in the component';
        this.MessageBar('E')
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
      this.isLoading = true;
      this.errorMessage = '';

      // Close drawer on mobile after sending message
      if (this.$vuetify.breakpoint.mobile) {
        this.drawer = false;
      }

      try {
        const response = await this.callchataiAPI(messageToSend);
        this.currentMessage = '';
        const aiMessage = {
          id: this.messageIdCounter++,
          type: 'ai',
          content: response,
          timestamp: new Date()
        };
        // Call the slow effect
        this.startTyping(response);
        this.messages.push(aiMessage);
      } catch (error) {
        console.error('Error calling chat.ai API:', error);
        this.MessageBar('E')
        // this.errorMessage = `Error: ${error.message}`;

        // const errorMessage = {
        //   id: this.messageIdCounter++,
        //   type: 'ai',
        //   content: 'Sorry, I encountered an error while processing your request. Please check your API key and try again.',
        //   timestamp: new Date()
        // };

        // this.messages.push(errorMessage);
      } finally {
        this.isLoading = false;
        // this.$nextTick(() => {
        this.scrollToBottom();
        // });
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

      // try {
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

      // } catch (error) {
        // console.error(' API call failed:', error);
        // throw error;
      // }
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
/* Fixed Chat Layout */
.chat-layout {
  display: flex;
  flex-direction: column;
  height: 90vh;
  max-width: 100%;
  overflow: hidden;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px 0;
  min-height: 0;
}

.greeting-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 0 20px;
}

.greeting-text {
  font-size: 2.5rem;
  font-weight: 300;
  text-align: center;
}

.messages-list {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

.message-item {
  margin-bottom: 16px;
  width: 100%;
}


.message-bubble {
  /* max-width: 70%; */
  padding: 12px 16px;
  border-radius: 12px;
  word-wrap: break-word;
  font-size: 16px;
  line-height: 1.5;
}


/* Fixed Input Container */
.input-container {
  flex-shrink: 0;
  padding: 16px;
  background-color: #424242;
}

.input-wrapper {
  max-width: 800px;
  margin: 0 auto;
}

.input-card {
  border-radius: 50px !important;
}

.input-row {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  gap: 8px;
}

.input-field-wrapper {
  flex: 1;
  min-width: 0;
}



.action-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}



.input-btn {
  color: #bdbdbd !important;
}

/* Mobile Responsive */
@media (max-width: 600px) {
  .greeting-text {
    font-size: 2rem;
  }

  .messages-list {
    padding: 0 12px;
  }

  /* .message-bubble {
    max-width: 85%;
    font-size: 14px;
  } */

  .input-container {
    padding: 12px;
  }

  .input-row {
    padding: 6px 12px;
    gap: 4px;
  }

  .action-buttons {
    gap: 4px;
  }
}

/* Custom scrollbar */
.messages-container::-webkit-scrollbar {
  width: 6px;
}

.messages-container::-webkit-scrollbar-track {
  background: #424242;
}

.messages-container::-webkit-scrollbar-thumb {
  background: #616161;
  border-radius: 3px;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: #757575;
}

/* Prevent horizontal overflow */
* {
  box-sizing: border-box;
}

.chat-layout,
.messages-container,
.input-container {
  max-width: 100%;
  overflow-x: hidden;
}

@keyframes spin {
    from {
        transform:rotate(0deg);
    }
    to {
        transform:rotate(360deg);
    }
}

.spin {
  animation-name: spin;
  animation-duration: 1000ms;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}
</style>