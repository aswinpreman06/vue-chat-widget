// import feather from 'feather-icons';
// import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
// import 'bootstrap/dist/css/bootstrap.css';
// import 'bootstrap-vue/dist/bootstrap-vue.css';

// Vue.use(BootstrapVue);
// Vue.use(IconsPlugin);
const chatWidget = {

    template: `
      <div>
      <div class="new-widget" v-if="isShow">
      <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
                <div class="">
                    <h4 class="mb-0 text-white chat-bot">
                        {{App_name}} AI Chatbot
                    </h4>
                </div>
                <div class="cg-close ml-75" @click="closeChat">
                    X
                    </div>
            </div>
            <div class='ml-5 mb-4'>
            <h5 class='user-name'>
                <b>
                    Hello {{userName}}! 👋 How can I help you?
                </b>

            </h5>
        </div>
        
      </div>
      <button @click='check' class='briks-aswin' v-if='isButton'>
      <img src="chat.png" class='chat-image'/>
      </button>
      </div>
       

    `,
    data() {
        return {
            greeting: 'Hello, World!',
            isShow: false,
            isButton:true
        };
    },
    // mounted() {
    //     // Initialize feather-icons after the component is mounted
    //     feather.replace();
    //   },
    methods: {
        initialize() {
            console.log('chat initialized');
        },
        check() {
            // alert('chat Initialized');
            this.isShow = !this.isShow;
            this.isButton=false;
        },
        closeChat(){
            this.isButton=true;
            this.isShow=false;
        }
    },

};



const vm = new Vue({
    render: (h) => h(chatWidget),
});

vm.$mount('#chat-widget');