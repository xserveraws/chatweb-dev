import Vue from 'vue'
import VueSocketIO from 'vue-socket.io'

export default function () {
  Vue.use(
    new VueSocketIO({
      debug: true,
      connection: 'http://localhost:3001',
      options: { path: '/chat-client/' }, // Optional options
    })
  )
}
