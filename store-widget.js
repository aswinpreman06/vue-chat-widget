const chatWidget = {

    template: `
      <div>

      <div>
      <b-link class="cw-toggle" v-b-toggle.sidebar-cw><b-img src="message-circle.svg"></b-img></b-link>
    <b-sidebar id="sidebar-cw" sidebar-class="sidebar-lg cw-sidebar" bg-variant="dark" text-variant="light" no-header right shadow>

    <template #default="{ hide }">
    <div class="d-flex justify-content-between align-items-center cw-sidebar-header px-2 py-1">
    <div class="">
        <h4 class="mb-0 text-white chat-bot">
         AI Chatbot
        </h4>
    </div>
    <div class="">
    <div class="cw-close-btn" @click="hide"><b-img src="close.svg"></b-img></div>
    </div>
    </div>

    <div class="cw-container p-2">

        <div class="welcome-text">
        <h5>Hello ! 👋 How can I help you?</h5>
        </div>
        <div class="text-center">
        <div class="mb-2 px-4">
            <b-button variant="dark" size="sm" type="submit" class='product-button btn-block' @click='selectProductChat()'>
                Help me find a product
            </b-button>
            <b-button variant="dark" size="sm" type="submit" @click='selectGeneralChat()' class='article-button btn-block mt-75'>
                I have few questions
            </b-button>

        </div>
    </div>

    <div class="chats">
     <div v-for="(chats, index) in chatData" :key="chats[index]" class="chat" :class="{'cw-chat-left mb-1': chats.senderID !== 1}">

      <div class="cw-chat-avatar">
        <b-avatar size="36" class="avatar-border-2 box-shadow-1" variant="transparent" :src="chats.senderID === 1? tenantProfile: userImage" />
      </div>

      <div class="cw-chat-body">
        <div class="cw-chat-content">
         <span v-html="formatPrompt(chats.message)"></span>
        </div>
      </div>

     </div>
    </div>

      </div>
      <div class="cw-loading" v-if='chatLoading'>
      <p class="cw-loading-typing"><span>{{App_name}}</span> GPT is typing</p>
  </div>
      <div class="cw-sidebar-footer">
          
      <b-form class="cw-app-form" @submit.prevent="sendMessage">
        <b-input-group class="input-group-merge form-send-message mr-1">
        <b-form-input placeholder="Send a message" v-model="chatInputMessage"/>
        </b-input-group>

        <div class="cw-record"  @mousedown="speechToText" @mouseup="speechToTextStop" :class="{'mic-on': !speaking}">
        <b-img src="mic.svg" :class="{'mic-on': !speaking}"></b-img>
        </div>

        <div class="cw-refresh" @click="refreshChat"><b-img src="refresh.svg"></b-img></div>

        <b-button class="cw-send" variant="secondary" type="submit"><b-img src="send.svg"></b-img>
        </b-button>
      </b-form>

      </div>

    </template>

      
    </b-sidebar>
  </div>

      </div>
       

    `,
    data() {
        return {

            chatData: [],
            chatInputMessage: '',
            chatLoading: false,
            App_name: '',
            tenantProfile: "",
            tenant_id: '',
            api_key: '',
            user_id: '',
            productSelected: false,
            generalSelected: false,
            chatID: 0,
            product_template: '',
            general_template: '',
            speechRecognition: new webkitSpeechRecognition(),
            speaking: true,
        };
    },

    created() {
        this.gettenantDomain()
    },
    methods: {
        //Fetch Chat Prompts
        async ChatInstructions(tenant, api_key) {
            var myHeaders = new Headers();
            myHeaders.append('x-api-key', api_key);
            myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

            var urlencoded = new URLSearchParams();
            urlencoded.append("tenant_id", tenant);

            var requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: urlencoded,
                redirect: "follow",

            };

            const rawResponse = await fetch(
                "https://api.briks.store/api/getChatInstructions",

                requestOptions
            );

            const response = await rawResponse.json();
            this.product_template = response.data[0].gpt_products_instructions;
            this.general_template = response.data[0].gpt_general_instructions;


        },
        //To make url clikable
        formatPrompt(text) {

            var urlRegex = /(https?:\/\/[^\s]+)/g;
            return text.replace(urlRegex, (url) => {
                return `<a href="${url}" target="_blank" class="linkify">${url}</a>`;
            });
        },
        refreshChat() {
            this.chatData = []

        },
        initialize() {
            console.log('chat initialized');
        },
        //Initializing Product chat session
        selectProductChat() {

            this.chatData = []
            this.productSelected = true
            this.generalSelected = false
            this.chatData.push({
                senderID: 1,
                message: "Absolutely! Please tell me what you're looking for or select options provided to continue <br>Let's do it! 👍 ",
                // message: "Absolutely! Please tell me what you're looking for, and I'll try to find the best matching products from our collection. <br>Let's do it! 👍 ",
            })

        },

        //Initializing General chat session
        selectGeneralChat() {

            this.chatData = []
            this.generalSelected = true
            this.productSelected = false
            this.chatData.push({
                message: "Sure thing! Please ask me your questions, I will try to provide you with the best answers I can by looking at our knowledge base. We're in this together! 👍",
                time: new Date(),
                senderID: 1,
            })
        },
        async gettenantDomain() {

            const url = window.location.href
            const hostname = new URL(url);
            const domain_name = hostname.hostname.replace('.cloudweb.app', '')

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
            const urlencoded = new URLSearchParams();
            urlencoded.append("domain_name", domain_name);
            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: urlencoded,
                redirect: "follow",
            };

            const rawResponse = await fetch(
                "https://api.briks.store/api/webApp/getTenantIdByDomainName",
                requestOptions
            );

            const response = await rawResponse.json();
            if (response.status == true) {

                this.App_name = response.data[0].company_name
                this.tenantProfile = response.data[0].branding_icon
                this.api_key = response.data[0].api_key
                this.tenant_id = response.data[0].tenant_id
                this.ChatInstructions(this.tenant_id, this.api_key)

            }

        },
        //fetching chatGPT results//
        async fetchDataFromGPT(val) {
            this.chatLoading = true

            var myHeaders = new Headers();

            myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
            myHeaders.append('x-api-key', this.api_key);
            var urlencoded = new URLSearchParams();
            urlencoded.append("tenant_id", this.tenant_id);
            urlencoded.append("user_id", this.user_id);
            urlencoded.append("question", val);
            urlencoded.append("chat_id", this.chatID);
            urlencoded.append("question_type", this.generalSelected ? 'general' : 'product');
            urlencoded.append("qatemplate", this.generalSelected ? this.general_template : this.product_template);

            var requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: urlencoded,
                redirect: "follow",

            };
            const rawResponse = await fetch(

                "https://api.briks.store/api/getResultThroughChatGPT",
                requestOptions
            );
            const response = await rawResponse.json();
            this.chatInputMessage = ''
            this.chatID = response.chat_id

            var responseData = response.data.text.split('.');

            // Join the sentences into separate paragraphs with <br> tags
            var formatted_response = responseData.join('.<br>');
            this.chatData.push({
                senderID: 1,
                message: formatted_response,
                time: new Date(),
                liked: false,
                disliked: false
            })

            this.chatLoading = false;

        },

        //Sending Prompt to chatGPT//
        async sendMessage() {
            if (this.chatInputMessage == '' || this.chatInputMessage == null) {
                this.$toast({
                    component: ToastificationContent,
                    props: {
                        title: 'Please enter your message',

                        icon: 'AlertCircleIcon',

                        variant: 'warning'
                    },
                })
                return false;
            } else {

                this.chatData.push({
                    senderID: 2,
                    message: this.chatInputMessage,
                    time: new Date(),
                    liked: false,
                    disliked: false
                })
                setTimeout(this.fetchDataFromGPT(this.chatInputMessage), 5000);
            }
        },


        //Using the webkitSpeechRecognition API to listen to the user's voice
        speechToText() {
            this.speechRecognition.continuous = true;
            this.speechRecognition.interimResults = true;
            this.speechRecognition.start();
            this.speaking = false;
            // Event listener for the "result" event
            this.speechRecognition.onresult = (event) => {
                const transcript = event.results[event.results.length - 1][0].transcript;
                this.chatInputMessage = transcript;
            };

        },
        // Stopping the speech recognition.
        speechToTextStop() {

            this.speechRecognition.stop();
            this.speaking = true

        },


    },

};



const vm = new Vue({
    render: (h) => h(chatWidget),
});

vm.$mount('#chat-widget');