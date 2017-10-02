import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    loadedCategories: [],
    user: null,
    loading: false,
    error: null
  },
  mutations: {
    createCategory (state, payload) {
      state.loadedCategories.push(payload)
    },
    setUser (state, payload) {
     state.user = payload
    },
    setLoading (state, payload) {
     state.loading = payload
    },
    setError (state, payload) {
     state.error = payload
    },
    clearError (state) {
     state.error = null
    },
    setLoadedCategories (state, payload) {
     state.loadedCategories = payload
    }
  },
  actions: {
    loadCategories ({commit}) {
     commit('setLoading', true)
     firebase.database().ref('categories').once('value')
      .then((data) => {
       const categories = []
       const obj = data.val()
       for (let key in obj) {
        categories.push({
         id: key,
         title: obj[key].title,
         description: obj[key].description,
         imageUrl: obj[key].imageUrl,
         date: obj[key].date,
         topic: obj[key].topic,
         creatorId: obj[key].creatorId
        })
       }
       commit('setLoadedCategories', categories)
       commit('setLoading', false)
      })
      .catch(
       (error) => {
        console.log(error)
        commit('setLoading', true)
       }
      )
    },
    createCategory ({commit, getters}, payload) {
      const category = {
        title: payload.title,
        topic: payload.topic,
        imageUrl: payload.imageUrl,
        description: payload.description,
        category: payload.category,
        date: payload.date.toISOString(),
        creatorId: getters.user.id
      }
      firebase.database().ref('categories').push(category)
      .then((data) => {
       const key = data.key
       commit('createCategory', {
        ...category,
        id: key
       })
      })
      .catch((error) => {
       console.log(error)
      })
    },
    signUserUp ({commit}, payload) {
     commit('setLoading', true)
     commit('clearError')
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
      .then(
       user => {
        commit('setLoading, false')
        const newUser = {
         id: user.uid,
         registeredCategories: []
        }
        commit('setUser', newUser)
       })
       .catch(
        error => {
         commit('setLoading', false)
         commit('setError', error)
         console.log(error)
        }
       )
    },
    signUserIn ({commit}, payload) {
     commit('setLoading', true)
     commit('clearError')
     firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
     .then(
       user => {
        commit('setLoading', false)
        const newUser = {
         id: user.uid,
         registeredCategories: []
        }
        commit('setUser', newUser)
       })
       .catch(
        error => {
         commit('setLoading', false)
         commit('setError', error)
         console.log(error)
        }
       )
    },
    autoSignin ({commit}, payload) {
     commit('setUser', {id: payload.uid})
    },
    logout ({commit}) {
     firebase.auth().signOut()
     commit('setUser', null)
    },
    clearError ({commit}) {
     commit('clearError')
    }
  },
  getters: {
    loadedCategories (state) {
      return state.loadedCategories.sort((categoryA, categoryB) => {
        return categoryA.date > categoryB.date
      })
    },
    featuredCategories (state, getters) {
      return getters.loadedCategories.slice(0, 5)
    },
    loadedCategory (state) {
      return (categoryId) => {
        return state.loadedCategories.find((category) => {
          return category.id === categoryId
        })
      }
    },
    user (state) {
     return state.user
    },
    loading (state) {
     return state.loading
    },
    error (state) {
     return state.error
    }
  }
})
