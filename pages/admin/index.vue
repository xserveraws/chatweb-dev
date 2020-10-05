<template>
  <div>
    Admin
    <b-button @click="getRoom">getroom</b-button>
    <ul>
      <template v-for="room in Object.keys(roomsList)">
        <li :key="room" class="my-2">
          {{ `${room} -> ${roomsList[room].client.name}` }}
          <template v-if="roomsList[room].status">
            <b-button variant="primary" @click="register(room)">JOIN</b-button>
          </template>
          <template v-else>
            <b-button disabled> CLOSE </b-button>
          </template>
        </li>
      </template>
    </ul>
    <b-sidebar
      id="sidebar-1"
      v-model="showSidebar"
      :title="roomID"
      no-header-close
      right
      shadow
    >
      <b-button variant="warning" @click="closeIssue">close issue</b-button>
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
              @keydown.13="sendMessage"
            ></b-form-input>
            <b-input-group-append>
              <b-button variant="info" @click="sendMessage">Send</b-button>
            </b-input-group-append>
          </b-input-group>
        </div>
      </div>
    </b-sidebar>
  </div>
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
      this.showSidebar = true
      this.messages = data.message
      this.roomID = data.roomID
    },
    adminReload() {
      this.getRoom()
    },
  },
  data() {
    return {
      roomsList: [],
      showSidebar: false,
      roomID: null,
      profile: {
        name: 'Admin',
      },
      messages: [],
      form: null,
    }
  },
  created() {},
  methods: {
    getRoom() {
      this.$axios.get('http://localhost:3001/roomslist').then((result) => {
        console.log('http://localhost:3001/roomslist', result.data)
        this.roomsList = result.data
      })
    },
    register(roomID) {
      this.$socket.emit('registerAdmin', roomID)
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
    closeIssue() {
      this.$socket.emit('closeIssue', this.roomID)
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
  height: calc(100vh - 195px);
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
