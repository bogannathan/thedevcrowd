import Vue from 'vue'
import Vuetify from 'vuetify'
import './stylus/main.styl'
import App from './App'
import router from './router'
import { store } from './store'
import DateFilter from './filters/date'
import * as firebase from 'firebase'
import firebaseConfig from '../firebaseconfig'
import AlertCmp from './components/Shared/Alert.vue'
import EditCategoryDetailsDialogue from './components/Forum/Edit/EditCategoryDialogue.vue'

Vue.use(Vuetify)
Vue.config.productionTip = false

Vue.filter('date', DateFilter)
Vue.component('app-alert', AlertCmp)
Vue.component('app-edit-category-details-dialogue', EditCategoryDetailsDialogue)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  created () {
    firebase.initializeApp({
      apiKey: firebaseConfig.apiKey,
      authDomain: firebaseConfig.authDomain,
      databaseURL: firebaseConfig.databaseURL,
      projectId: 'thedevcrowd',
      storageBucket: firebaseConfig.storageBucket
    })
    firebase.auth().onAuthStateChanged((user) => {
     if (user) {
      this.$store.dispatch('autoSignin', user)
     }
    })
    this.$store.dispatch('loadCategories')
  }
})
