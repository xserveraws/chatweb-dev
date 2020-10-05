<template>
  <b-container>
    <template v-if="!disableRegister">
      <b-card style="max-width: 20rem">
        <b-input v-model="profile.name" placeholder="Name" />
        <b-button
          variant="primary"
          :disabled="disableRegister"
          @click="register"
          >Chat with admin</b-button
        >
      </b-card>
    </template>
    <b-sidebar
      id="sidebar-1"
      v-model="showSidebar"
      :title="roomID"
      no-header-close
      right
      shadow
    >
      <div class="px-3 py-2">
        <div ref="messageArea" class="message-area">
          <template v-for="(message, index) in messages">
            <div
              :key="index"
              class="d-flex flex-column"
              :class="{ 'align-items-end': message.sender == profile.name }"
            >
              <div
                class="text-left w-75 my-2 d-flex flex-column"
                :class="{ 'text-right': message.sender == profile.name }"
              >
                <div :style="{ 'font-size': '11px' }">
                  {{ message.sender }} >
                  {{ dateToString(message.timeStamp) }}
                </div>
                <div
                  class="px-2"
                  :style="{
                    'border-radius': '10px',
                    'background-color':
                      message.sender != profile.name ? 'bisque' : 'lightblue',
                  }"
                >
                  {{ message.message }}
                </div>
              </div>
            </div>
          </template>
        </div>
        <div class="sent-area">
          <b-input-group>
            <b-form-input
              v-model="form"
              :disabled="chatStatus == false"
              @keydown.13="sendMessage"
            ></b-form-input>
            <b-input-group-append>
              <b-button
                :disabled="chatStatus == false"
                variant="info"
                @click="sendMessage"
              >
                Send
              </b-button>
            </b-input-group-append>
          </b-input-group>
        </div>
      </div>
    </b-sidebar>
  </b-container>
</template>

<script>
export default {
  sockets: {
    connect() {
      console.log('socket connected')
    },
    receiveMessage(data) {
      console.log('receiveMessage', data)
      // data.timeStamp = new Date(data.timeStamp)
      console.log(data)
      this.messages.push(data)
      this.$nextTick(() => {
        const scrollHeight = this.$refs.messageArea.offsetHeight
        this.$refs.messageArea.scrollTop = scrollHeight
      })
    },
    roomID(data) {
      console.log('roomID', data)
      this.disableRegister = true
      this.showSidebar = true
      this.chatStatus = true
      this.messages = data.message
      this.roomID = data.roomID
    },
    issueClose(roomID) {
      this.chatStatus = false
    },
  },
  data() {
    return {
      showSidebar: false,
      disableRegister: false,
      roomID: null,
      profile: {
        name: 'Leo',
      },
      messages: [],
      chatStatus: false,
      form: null,
    }
  },
  created() {
    // if (process.client) {
    //   window.addEventListener('beforeunload', this.unregister)
    // }
  },
  methods: {
    register() {
      this.$socket.emit('register', this.profile.name)
    },
    unregister() {
      this.$socket.emit('unregister', this.profile.name)
    },
    sendMessage() {
      this.$socket.emit('sendMessage', {
        roomID: this.roomID,
        data: {
          sender: this.profile.name,
          message: this.form,
          timeStamp: new Date(),
        },
      })
      this.form = ''
    },
    dateToString(timeStamp) {
      return new Date(timeStamp).toLocaleTimeString()
    },
  },
}
</script>

<style>
::-webkit-scrollbar {
  width: 3px;
}
.message-area {
  margin-bottom: 50px;
  padding-right: 5px;
  padding-left: 5px;
  height: calc(100vh - 155px);
  overflow-y: scroll;
}
.sent-area {
  position: fixed;
  bottom: 10px;
}

.friend {
}
.myself {
  background-color: lightblue;
}
</style>
