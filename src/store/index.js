import Vue from 'vue'
import Vuex from 'vuex'
import category from './category'
import user from './user'
import shared from './shared'

Vue.use(Vuex)

export const store = new Vuex.Store({
 modules: {
  category: category,
  user: user,
  shared: shared
 }
})
