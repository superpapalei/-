import Vuex from 'vuex'

const state = {
    painting: 0//角标名字，在menutree中使用
}

const mutations = {
    /**
     * 传入一个含名字和数字对象
     * 修改对应名字角标的值
     */
    changeBadge(state, obj) {
        state[obj.name] = obj.index
    },
    /**
     * 传入一个名字
     * 其值+1
     */
    addBadge(state, name) {
        state[name]++
    },
    /**
     * 传入一个名字
     * 其值-1
     */
    releaseBadge(state, name) {
        state[name]--
    }
}

const getters = {
    getRefund: state => {
        return state.refund
    },
    getPainting: state => {
        return state.painting
    }
}
export default {
    namespaced: true,
    state,
    mutations,
    getters
}