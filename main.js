

const chatWidget = {

    template: `
      <div>
      <div>
      <b-link class="cw-toggle" v-b-toggle.sidebar-cw>
      <svg xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
    </b-link>
    <b-sidebar id="sidebar-cw" sidebar-class="sidebar-lg cw-sidebar" right no-header>

    <template #default="{ hide }">
    <div class="cw-sidebar-header">
    <div class="">
        <h4 class="chat-bot">
        {{App_name}} AI Assistant <span class="muted-text font-size-small">v1.4</span> 
        </h4>
    </div>
    
    <div class="action-buttons">

    <div class="" v-if='tenant_id !==undefined'>
    <b-dropdown class="action-dropdown" variant="link" toggle-class="text-decoration-none" right no-caret>
    <template #button-content>
    <div class="">
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  </div>
    </template>

    <b-dropdown-item  @click='IsLoggedIn=true' v-if='!isLogged'>
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
    <span>Sign In</span>
    </b-dropdown-item>
    
    
    <b-dropdown-item @click='openChatHistory' >
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
    <span>Chat History</span>
    </b-dropdown-item>
    
    <b-dropdown-item @click='sendEmail'>
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
    <span>Send Email</span>
    </b-dropdown-item>

    <b-dropdown-item  @click='signOut' v-if='isLogged'>
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
    <span>Sign Out</span>
    </b-dropdown-item>
  </b-dropdown>
</div>

    <div class="cw-close-btn" @click="closeChat">
    <svg xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
  </div>
    </div>
    </div>

    <div class="cw-container">
    <div  v-if='show' :class="isClassActive ? 'toast-success' : 'toast-failed'">
    {{toast_content}}
   </div>

        <div class="welcome-text">
        <h5>Hello! {{userName}} 👋 How can I help you?</h5>
        </div>
        
        <!-- <div class="text-center">
         <div class="cw-buttons">
            <button size="sm" type="submit" class='cw-option-button cw-mb-1' @click='selectProductChat()'>
                Help me find a product
            </button>
            <button type="submit" @click='selectGeneralChat()' class='cw-option-button'>
                I have few questions
            </button>
         </div>
        </div> -->

    <div class="chats">
     <div v-for="(chats, index) in chatData" :key="chats[index]" class="chat" :class="{'cw-chat-left mb-1': chats.senderID !== 1}">
      <div class="cw-chat-avatar">
        <b-avatar size="36" class="" :src="chats.senderID === 1? tenantProfile: userImage" :text="avatarText(userName)"/>
      </div>
      <div class="cw-chat-body">
        <div class="cw-chat-content">
         <span v-html="convertToLink(chats.message)" @click="handleClickEvent"></span>
        </div>
      </div>
     </div>
    </div>
    <video width="260" height="160" controls class="chat-video-player" v-if='isVideo' id='my-video'>
    <source :src="video_url" type="video/mp4">
    <source src="movie.ogg" type="video/ogg">
    Your browser does not support the video tag.
</video>
      </div>
      <div class="cw-loading" v-if='chatLoading'>
      <p class="cw-loading-typing"><span>{{App_name}}</span> GPT is typing</p>
  </div>
  <div class="closed-session" v-if='history' @click='newChat'>
  <p>New Chat</p>
</div>

    <div class="emailus-button">
    <button type="" class="emailus-btn" @click='sendEmail'>
    <svg xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
    <span>Email to us</span></button>
    </div>

      <div class="cw-sidebar-footer" v-if='!history'>
          
      <b-form class="cw-app-form" @submit.prevent="sendMessage">
        <b-input-group class="input-group-merge form-send-message cw-mr-1">
        <b-form-input placeholder="Send a message" v-model="chatInputMessage" style="background-color: #292b30 !important; color: #fff;" />
        </b-input-group>

        <div class="cw-record"  @mousedown="speechToText" @mouseup="speechToTextStop" :class="{'mic-on': !speaking}">
        <b-img src="https://cloud360bucket.s3.ap-southeast-2.amazonaws.com/public/mic.svg" :class="{'mic-on': !speaking}"></b-img>
        </div>

        <div class="cw-refresh" @click="refreshChat">
        <svg xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        >
        <polyline points="23 4 23 10 17 10" />
        <polyline points="1 20 1 14 7 14" />
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
        </svg>
      </div>

        <button class="cw-send-button" type="submit" :disabled='checkSend'>
        <svg xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
      </svg>
        </button>
      </b-form>

      </div>

      <div class="cw-banner" v-if='IsLoggedIn'>
      <div class="cw-banner-signin">
      <div class="">
      <p>Please log in to get access to more personalized services.</p>
      </div>

      <div class="">
      <button class="outline-button" @click='continueChat'>Continue As a Guest</button>
      <button class="outline-button sign-in-btn" v-b-toggle.cw-signin-collapse>Sign In</button>
      </div>

      <b-collapse id="cw-signin-collapse" class="cw-collapse">
        <div class="cw-row">
        <div class="cw-col-7 cw-col-sm-6 cw-banner-email padding-right-0">
        <b-form-input placeholder="Email Address" v-model='email_address' />
        </div>
        <div class="cw-col-5 cw-col-sm-6">
        <button class="cw-send-button" type="submit" @click="sendOTP" > {{send_otp}}</button>
        </div>
      
        <div class="cw-col-12 cw-col-sm-12 cw-banner-email padding-right-0 margin-top-1" v-if='isVerify'>
        <b-form-input placeholder="Enter name" v-model='user_name' />
        </div>
    
        </div>

        <div class="cw-row cw-otp-inputs" v-if='isVerify'>
        <div class="cw-col-12 padding-right-0 margin-top-1">
        <label class="cw-text-muted"> Enter the OTP</label>
        </div>

        <div class="cw-col-2 padding-right-0" v-for="(field, index) in inputFields" :key="index">
        <input :ref="'inputField' + index" @input="handleInput(index)" maxlength="1" class="cw-otp-input" v-model="inputFields[index]" />
        </div>
 
        </div>

        <button type="" class="cw-send-button margin-top-1" @click='verifyOTP' v-if='isVerify'>
            Continue
        </button>
      </b-collapse>

      </div>
      </div>


      <!-- Send E-mail Overlay -->
      <div class="cw-send-email-banner" v-if='isEnquiry'>
        <div class="">
            <p class="">Send us an email and one of our team member will get back to you soon.</p>
        </div>

        <div class="cw-row margin-top-1">
        <div class="cw-col-12 cw-mb-1">
        <label class="">Select Category / Topic</label>
        <b-form-select v-model="category" :options="categoryList" style=""></b-form-select>
        </div>

        <div class="cw-col-12 cw-mb-1">
        <label class="">Enter your message</label>
        <b-form-textarea placeholder="" rows="4" max-rows="8" class="" v-model='enquiry_message' />
        </div>

        <div class="cw-col-12 cw-mb-1">
        <label class="">Uploads</label>
        <b-form-file v-model="file" placeholder="Choose a file or drop it here..." drop-placeholder="Drop file here..."></b-form-file>
        </div>

        <div class="cw-col-12">
        <button class="outline-button cw-mr-1" @click='cancelEnquiry'>Cancel</button>
        <button class="cw-send-button" type="submit" @click='insertUpdateSupportTickets'>Email to us</button>
        </div>

        </div>
      </div>

      <!-- End Send E-mail Overlay -->
      
    </template>
    </b-sidebar>


    <b-sidebar id="sidebar-ch" sidebar-class="sidebar-md ch-sidebar" backdrop no-header>
    <template #default="{ hide }">
    <div class="ch-sidebar-header">
    <div class="">
        <h4 class="chat-bot">
        Chat History
        </h4>
    </div>

    <div class="cw-close-btn" @click="hide">
    <svg xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
  </div>
    </div>
    <div class="ch-container">
    <div class="ch-list" v-for="(chat,index) in userChatLists" :key="index" @click="showChatDetails(chat)">
    <p> {{chat.question}}</p>
    </div>
    </div>
    </template>
    </b-sidebar>
  </div>
      </div>
    `,

    data() {
        return {
            isEnquiry: false,
            enquiry_message: '',
            chatData: [],
            chatInputMessage: '',
            chatLoading: false,
            App_name: '',
            tenantProfile: "",
            userImage: '',
            tenant_id: '',
            api_key: '',
            user_id: null,
            productSelected: false,
            generalSelected: false,
            chatID: 0,
            speechRecognition: new webkitSpeechRecognition(),
            speaking: true,
            IsLoggedIn: false,
            apiRequest: 0,
            email_address: '',
            send_otp: 'Send OTP',
            login_id: '',
            isVerify: false,
            user_name: '',
            isContinue: true,
            inputFields: Array(4).fill(""),
            userName: '',
            show: false,
            toast_content: '',
            isClassActive: false,
            isLogged: false,
            user_id: null,
            userChatLists: [],
            history: false,
            video_url: '',
            isVideo: false,
            checkSend: false,
            tenantDetails: '',
            category: null,
            categoryList: [{
                    text: "Enquiry",
                    value: 'Enquiry'
                },
                {
                    text: "Sales",
                    value: 'Sales'
                },
                {
                    text: "Support",
                    value: 'Support'
                },
                {
                    text: "Payment Support",
                    value: 'Payment Support'
                },
            ],
            file: null,
        };
    },

    created() {

        this.getTenantDetailsById()
    },

    methods: {
        openChatHistory() {
            if (this.isLogged == false) {
                this.IsLoggedIn = true
                return false;
            } else {

                this.$root.$emit('bv::toggle::collapse', "sidebar-ch")
            }

        },
        sendEmail() {
            if (this.isLogged == false) {
                this.IsLoggedIn = true
                return false;
            } else {
                this.isEnquiry = true
            }

        },
        newChat() {
            this.chatData = []
            this.chatID = 0
            this.initializeChat = true;
            this.history = false
        },



        handleInput(index) {
            if (index < this.inputFields.length - 1) {
                this.$refs['inputField' + (index + 1)][0].focus();
            }
        },


        convertToLink(inputString) {

            const urlPattern = /\b(https?:\/\/[^\s()]+\S)\b/g;

            const coloredString = inputString.replace(urlPattern, (url) => {
                const cleanedURL = url.replace(/^[(]/, '').replace(/[)]$/, '');
                return `<span class="link-url" >${cleanedURL}</span>`;
            });
            return coloredString;
        },

        openLink(event) {
            const clickedUrl = event.target.textContent;
            this.isVideoUrl(clickedUrl)
        },

        handleClickEvent(event) {
            if (event.target.classList.contains("link-url")) {
                this.openLink(event);
            }
        },
        isVideoUrl(url) {

            const videoExtensions = ['mp4', 'avi', 'mov', 'mkv', 'wmv', 'flv', 'webm', 'm4v', '3gp', 'ts', 'vob', 'ogv', 'divx', 'rmvb', 'mpg', 'rm', 'asf', 'mov', 'mpeg2', 'mpv'];

            for (var i = 0; i < videoExtensions.length; i++) {
                if (url.includes(videoExtensions[i])) {

                    this.isVideo = true
                    this.video_url = url
                    const videoElement = document.getElementById('my-video');

            videoElement.src = res.url;

            videoElement.load();

            

                    return false
                }

            }
            window.open(url, '_blank')
        },
        cancelEnquiry() {
            this.isEnquiry = false,
                this.file = null,
                this.category = null,
                this.enquiry_message = ''
        },
        async insertUpdateSupportTickets() {

            if (this.category == "" || this.category == null) {
                this.showToast('Please select category', false)

                return false;
            } else if (this.enquiry_message == "" || this.enquiry_message == null) {
                this.showToast('Please enter your message', false)
                return false;
            } else {

                var myHeaders = new Headers();

                // myHeaders.append("x-access-token", authentication);
                myHeaders.append('x-api-key', this.api_key);

                const formData = new FormData();
                const widgetData = localStorage.getItem("widgetData")

                if (widgetData !== null) {

                    this.user_id = JSON.parse(widgetData).user_id


                }
                formData.append("tenant_id", this.tenant_id);
                formData.append("support_call_id", 0);
                formData.append("user_id", this.user_id);
                formData.append("assigned_to", null);
                formData.append("question", this.enquiry_message);
                formData.append("support_category", this.category);
                formData.append("priority", "Low");
                formData.append("status", "New");
                formData.append("turn_around_time", 24);
                formData.append("description", null);
                formData.append("last_updated", null);
                formData.append("is_active", 1);
                formData.append("updatedby", null);
                formData.append("uploads[]", this.file);
                formData.append("chat_id", this.chatID);
                var requestOptions = {
                    method: "POST",
                    headers: myHeaders,
                    body: formData,
                    redirect: "follow",
                };

                const rawResponse = await fetch(

                    "https://api.briks.store/api/supportTickets/insertUpdateSupportTickets",

                    requestOptions
                );

                const response = await rawResponse.json();
                console.log(response)

                if (response.data[0].status == 1) {
                    this.showToast('Thank you! We recieved your email and will contact you ASAP.', true)

                    this.isEnquiry = false;
                    this.enquiry_message = ''
                    this.category = null
                    this.chatID = 0
                } else if (response.data[0].status == 0) {
                    this.showToast('Oops, something went wrong, please try again.', false)

                    this.isEnquiry = false;
                    this.enquiry_message = ''
                    this.category = ''
                    this.chatID = 0
                }
            }

        },


        /* Avatar text for profile */
        avatarText(full_name) {
            if (!full_name) return ''
            const nameArray = full_name.split(' ')
            return nameArray.map(word => word.charAt(0).toUpperCase()).join('')
        },

        /*Toast validation*/
        showToast(toastContent, isActive) {
            this.show = true;
            this.isClassActive = isActive
            this.toast_content = toastContent
            setTimeout(() => {
                this.show = false;
            }, 3000); // Hide the toast after 3 seconds
        },


        //To refresh Chat
        refreshChat() {
            this.chatData = []
            this.chatLoading = false
            this.checkSend = false
        },

        continueChat() {
            this.IsLoggedIn = false
            this.isContinue = false
        },

        //Initializing Product chat session
        selectProductChat() {
            this.chatData = []
            this.productSelected = true
            this.generalSelected = false
            this.chatData.push({
                senderID: 1,
                message: "Absolutely! Please tell me what you're looking for to continue.<br>Let's do it! 👍 ",
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
        //Fetch Tenant Details
        async getTenantDetailsById() {
            const chat_widget = document.getElementById('chatWidget');
            this.api_key = chat_widget.getAttribute('key');

            const myHeaders = new Headers();
            myHeaders.append('x-api-key', this.api_key);
            myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
            const urlencoded = new URLSearchParams();
            urlencoded.append("tenant_id", null);
            urlencoded.append("user_type", "public_user");
            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: urlencoded,
                redirect: "follow",
            };
            const rawResponse = await fetch(

                "https://api.briks.store/api/tenantInfo",
                requestOptions
            );

            const response = await rawResponse.json();
            this.tenantDetails = response
            if (this.tenantDetails.data.length != 0) {
                this.App_name = this.tenantDetails.data[0].organisation_display_name
                this.tenantProfile = this.tenantDetails.data[0].branding_icon
                this.tenant_id = this.tenantDetails.data[0].tenant_id
                const widgetData = localStorage.getItem("widgetData")

                if (widgetData !== null) {

                    this.user_id = JSON.parse(widgetData).user_id
                    this.getUserDetailsByID(this.tenant_id, this.api_key, this.user_id)


                }

            } else {
                this.App_name = ""
                this.tenantProfile = ""
                this.tenant_id = ""

            }

        },


        //fetching chatGPT results
        async fetchDataFromGPT(val) {
            this.chatLoading = true
            this.chatInputMessage = ''
            this.checkSend = true
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
            myHeaders.append('x-api-key', this.api_key);
            var urlencoded = new URLSearchParams();
            urlencoded.append("tenant_id", this.tenant_id);
            urlencoded.append("user_id", this.user_id);
            urlencoded.append("question", val);
            urlencoded.append("chat_id", this.chatID);
            urlencoded.append("question_type", this.generalSelected ? 'general' : 'product');


            var requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: urlencoded,
                redirect: "follow",
            };
            const rawResponse = await fetch(

                "https://api.briks.store/api/chat",
                requestOptions
            );

            // const reader = rawResponse.body.getReader();
            let currentMessage = {
                senderID: 1,
                message: '', // Initialize an empty message
                time: new Date(),
                liked: false,
                disliked: false,
            };
            let chatlength = this.chatData.length;
            this.chatData.push(currentMessage)
            for (const reader = rawResponse.body.getReader();;) {
                const {
                    value,
                    done
                } = await reader.read();

                if (done) {
                    break;
                }

                setTimeout(() => {
                    var chunk = new TextDecoder().decode(value);
                    const regex = /{{~(\d+)~}}/;
                    const match = chunk.match(regex);
                    if (match) {
                        this.chatID = parseInt(match[1]);

                    }
                    let messageval = this.chatData[chatlength].message;
                    const modifiedSentence = chunk.replace(/{{~\d+~}}/g, '');
                    this.chatData[chatlength].message = messageval + modifiedSentence;
                }, 100);

                // return false;

            }

            this.chatLoading = false
            this.checkSend = false

        },

        //Sending Prompt to chatGPT
        async sendMessage() {

            if (this.tenantDetails.data.length == 0) {
                this.showToast('API authentication failed, please contact support team.', false)
                return false
            }

            const widgetData = localStorage.getItem("widgetData")
            this.apiRequest++
            if (this.chatInputMessage == '' || this.chatInputMessage == null) {
                this.showToast('Please enter your message', false)
                return false;
            } else if (widgetData == null && this.apiRequest == 3 && this.isContinue) {
                this.IsLoggedIn = true
                this.chatLoading = false
                return false

            } else {
                this.isVideo = false
                this.video_url = ''

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
        //Fetch User Details
        async getUserDetailsByID(tenant_id, api_key, userID) {



            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
            myHeaders.append('x-api-key', api_key);

            var urlencoded = new URLSearchParams();
            urlencoded.append("tenant_id", tenant_id);
            urlencoded.append("user_id", userID);
            var requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: urlencoded,
                redirect: "follow",
            };

            const rawResponse = await fetch(

                "https://api.briks.store/api/userInfo",
                requestOptions
            );

            const response = await rawResponse.json();
            if (response.data.length == 0) {
                this.userName = ''
                this.isLogged = false
            } else {
                this.userName = response.data[0].full_name
                this.userImage = response.data[0].profile_url
                this.isLogged = true
                this.getChatHistoryBasedOnUserId(userID, api_key, tenant_id)
            }
        },

        //Fetch Chat History using ID
        async getChatHistoryBasedOnUserId(userID, api_key, tenant_id) {

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
            myHeaders.append('x-api-key', api_key);
            var urlencoded = new URLSearchParams();
            urlencoded.append("tenant_id", tenant_id);
            urlencoded.append("user_id", userID);

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: urlencoded,
                redirect: "follow"
            };
            const rawResponse = await fetch(

                "https://api.briks.store/api/getChatHistoryBasedOnUserId",
                requestOptions
            );
            const response = await rawResponse.json();
            if (response.data.length !== 0) {
                this.userChatLists = response.data.reverse()
            }

        },

        async showChatDetails(chat) {


            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
            myHeaders.append('x-api-key', this.api_key);
            var urlencoded = new URLSearchParams();
            urlencoded.append("tenant_id", this.tenant_id);
            urlencoded.append("chat_id", chat.chat_id);

            var requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: urlencoded,
                redirect: "follow"
            };
            const rawResponse = await fetch(

                "https://api.briks.store/api/getChatHistoryBasedOnChatId",
                requestOptions
            );
            const response = await rawResponse.json();
            if (response.status == true) {
                // this.history = true;
                this.$root.$emit('bv::toggle::collapse', "sidebar-ch")
                this.history = true;
                const chats = response.data[0].chat_history_json.chat.chat
                this.chatID = response.data[0].chat_id
                this.chatData = []
                this.chatData.push({
                    message: 'Sure! Here is the chat history you looking for',
                    time: new Date(),
                    senderID: 1,
                    history: 1

                })
                this.initializeChat = true;
                chats.forEach((chat) => {
                    this.chatData.push({
                        message: chat.question,
                        time: new Date(),
                        senderID: 2,
                        liked: chat.likeDislike == "like" ? true : false,
                        disliked: chat.likeDislike == 'dislike' ? true : false
                    })
                    this.chatData.push({
                        message: chat.message,
                        time: new Date(),
                        senderID: 1,
                        liked: chat.likeDislike == "like" ? true : false,
                        disliked: chat.likeDislike == 'dislike' ? true : false
                    })
                });
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
        async sendOTP() {
            if (this.email_address == '' || this.email_address == null) {
                this.showToast('Please enter your email ID', false)
                return false;
            } else {

                const myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
                const urlencoded = new URLSearchParams();
                urlencoded.append("email", this.email_address);
                urlencoded.append("tenant_id", this.tenant_id);
                const requestOptions = {
                    method: "POST",
                    headers: myHeaders,
                    body: urlencoded,
                    redirect: "follow",
                };

                const rawResponse = await fetch(
                    "https://api.briks.store/api/UserSignIn",
                    requestOptions
                );

                const response = await rawResponse.json();

                if (response.status == true) {
                    this.isVerify = true
                    this.user_name = response.data[0].full_name
                    this.login_id = response.data[0].user_id
                    this.send_otp = 'Resend'
                    this.showToast('An OTP has been sent to your email. Please verify.', true)
                    return false;
                } else {
                    this.showToast(response.message, false)
                }

            }
        },
        closeChat() {
            this.getChatHistoryBasedOnUserId(this.user_id, this.api_key, this.tenant_id)
            
                this.history = false
            this.$root.$emit('bv::toggle::collapse', "sidebar-cw")
            this.chatData = []
            this.initializeChat = false;
            this.IsLoggedIn = false;
            this.user_name = '',
                this.email_address = ''
            this.chatInputMessage = ''
            this.send_otp = 'Send OTP'
            this.isVideo = false
            this.video_url = ''
            this.inputFields = Array(4).fill("")
            this.isEnquiry = false,
                this.file = null,
                this.category = null,
                this.enquiry_message = ''
            this.isVerify = false
            this.chatLoading = false
            this.checkSend = false


        },
        signOut() {
            localStorage.removeItem('widgetData');
            this.userName = ''
            this.userImage = ''
            this.user_id = null
            this.isLogged = false
            this.showToast('You have successfully signed out', true)
            this.history = false
            this.chatData = []
            this.initializeChat = false;
            setTimeout(() => {
                this.$root.$emit('bv::toggle::collapse', "sidebar-cw")
            }, 2000);

            return false;
        },
        async verifyOTP() {

            const concatenatedNumber = this.inputFields.join("");
           

            if (this.user_name == "" || this.user_name == null) {
                this.showToast('Please enter your name', false)
                return false;
            } else {
                const myHeaders = new Headers();

                myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
                const urlencoded = new URLSearchParams();
                urlencoded.append("email", this.email_address);
                urlencoded.append("tenant_id", this.tenant_id);
                urlencoded.append("user_otp", concatenatedNumber);
                urlencoded.append("user_name", this.user_name);
                urlencoded.append("user_id", this.login_id);
                const requestOptions = {
                    method: "POST",
                    headers: myHeaders,
                    body: urlencoded,
                    redirect: "follow",
                };

                const rawResponse = await fetch(
                    "https://api.briks.store/api/verifyOTPAndSignIn",
                    requestOptions
                );

                const response = await rawResponse.json();
                if (response.status == true) {

                    this.isVerify = false
                    this.IsLoggedIn = false
                    this.isLogged = true
                    localStorage.setItem("widgetData", JSON.stringify(response.data[0]))
                    // localStorage.setItem('user_id',response.data[0].user_id)
                    this.user_id = response.data[0].user_id
                    this.getUserDetailsByID(this.tenant_id, this.api_key, this.user_id)
                    this.userName = response.data[0].full_name
                    this.user_name = ''
                    this.inputFields = Array(4).fill("")
                    this.email_address = ''
                    this.send_otp = 'Send OTP'
                    this.showToast(`Welcome ${response.data[0].full_name}, you have logged in successfully!`, true)


                    return false;
                } else {
                    this.showToast(`${response.message}`, false)
                    return false;
                }
            }
        },


    },

};



const vm = new Vue({
    
    render: (h) => h(chatWidget),
});

vm.$mount('#chat-widget');
window.chatWidgetInstance = vm;
