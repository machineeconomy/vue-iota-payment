<template>
  <span>
    <button v-if="state === 'init'" @click="payWithIota">
      <slot></slot>
    </button>
    <div v-else-if="state === 'show_qr_code'">
      <img v-if="qrCodeData" :src="qrCodeData.src" alt="QR CODE" />
      <br />
      <a
        class="btn btn-primary"
        :href="`iota://${data.payment.address}/?amount=${data.payment.value}`"
      >Pay with Trinity</a>
    </div>
    <div v-else-if="state === 'transaction_incoming'"></div>
  </span>
</template>

<script>
import axios from "axios";
import * as IotaQR from "@tangle-frost/iota-qr-lib/pkg/iota-qr-lib.js";

export default {
  name: 'IotaPayment',
  data() {
    return {
      data: null,
      state: "init"
    };
  },
  computed: {
    order() {
      return this.$store.state.order;
    }
  },
  methods: {
    payWithIota() {
      const self = this;
      axios
        .post(
          this.$payOptons.url + this.$payOptons.path,
          this.order
        )
        .then(function(response) {
          console.log("response");
          console.log(response);
          self.data = response.data;
          self.pay_with_iota = true;
          self.$socket.client.emit("storeClientInfo", {
            paymentOrPayoutId: response.data.payment.id
          });
          const paymentData = IotaQR.TrinityPaymentQR.generatePaymentData(
            response.data.payment.address,
            response.data.payment.value,
            "EINFACHIOTA",
            ""
          );
          IotaQR.TrinityPaymentQR.renderHtml(paymentData, "png", 8).then(
            qrCodeData => {
              self.state = "show_qr_code";
              self.qrCodeData = qrCodeData;
              console.log("qr_code_data", qrCodeData);
              console.log("qr_code_data", qrCodeData.src);
            }
          );
        })
        .catch(function(error) {
          console.log("CLG");
          console.log(error);
          self.data.status = "error";
        });
    }
  },
  sockets: {
    connect() {
      console.log("socket connected");
    },
    payments(payment) {
      console.log("payments", payment);
      if (payment.status === "paymentArrived") {
        this.state = "transaction_incoming";
      } else if (payment.status === "paymentSuccess") {
        console.log("emit payment");
        this.$emit("paymentSuccess", payment);
      }
    },
    disconnect() {
      console.log("socket disconnect");
    }
  }
};
</script>
