const IotaPaymentModule = {
    state: { order: {} },
    mutations: {
        setOrder(state, order) {
            state.order = order
        }
    },

    getters: {
        gettOrder() {
            return state.order
        }
    }
}

export default IotaPaymentModule