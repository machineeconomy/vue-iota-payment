<template>
  <span>
    <button v-if="state === 'init'" @click="payWithIota">
      <slot></slot>
    </button>
    <div v-else-if="state === 'show_qr_code'">
      <qrcode v-if="qrCodeData" :src="qrCodeData" :options="{ width: 200 }"></qrcode>

      <br />
      <a
        class="btn btn-primary"
        :href="`iota://${data.payment.address}/?amount=${data.payment.value}`"
        >Pay with Trinity</a
      >
    </div>
    <div v-else-if="state === 'transaction_incoming'"></div>
  </span>
</template>

<script>

export default {
  data() {
    return {
      data: null,
      state: 'init'
    }
  },
  computed: {
    order() {
      return this.$store.state.order
    }
  },
  methods: {
    payWithIota() {
      const self = this
      this.$axios
        .post(
          `http://localhost:5000/api/pay_with_iota?id=${this.order._id}`,
          this.order
        )
        .then(function(response) {
          console.log('response')
          console.log(response)
          self.data = response.data
          self.pay_with_iota = true
          self.$socket.client.emit('storeClientInfo', {
            customId: response.data.payment.id
          })
          self.qrCodeData = response.data.payment.address
          
        })
        .catch(function(error) {
          console.log('CLG')
          console.log(error)
          self.data.status = 'error'
        })
    }
  },
  sockets: {
    connect() {
      console.log('socket connected')
    },
    payments(payment) {
      console.log('payments', payment)
      if (payment.status === 'paymentArrived') {
        this.state = 'transaction_incoming'
      } else if (payment.status === 'paymentSuccess') {
        console.log('emit payment')
        this.$emit('paymentSuccess', payment)
      }
    },
    disconnect() {
      console.log('socket disconnect')
    }
  }
}
</script>
