import IotaPaymentComponent from "./IotaPayment.vue";
import IotaPaymentModule from './IotaPayment.module.js'

import io from 'socket.io-client'
import VueSocketIO from 'vue-socket.io-extended'

export default {
  install(Vue, options) {
    if (!options.store) console.log('Please provide a vuex store!!')

    if (!options.url) options.url = 'http://localhost:5000'
    if (!options.path) options.path = '/'

    options.path = options.path + '/socket'
    Vue.use(
      VueSocketIO,
      io(options.url, { path: options.path }),
      {
        store: options.store
      }
    )
    // Let's register our component globally
    // https://vuejs.org/v2/guide/components-registration.html
    Vue.component("iota-payment", IotaPaymentComponent);
    options.store.registerModule('IotaPayment', IotaPaymentModule)
  }
}