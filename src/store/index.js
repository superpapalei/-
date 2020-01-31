import Vuex from "vuex"
import Vue from 'vue'
import NavTabs from './navTabs'
import Badge from './badge'

Vue.use(Vuex)
//引入多个store
export default new Vuex.Store({
    modules: {
        navTabs: NavTabs,
        badge: Badge
    }
})