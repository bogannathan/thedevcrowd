import * as firebase from 'firebase'


export default {
  state: {
    user: null
  },
  mutations: {
    subscribeUserToCategory (state, payload) {
     const id = payload.id
     if (state.user.subscribedCategories.findIndex(category => category.id === id) >= 0) {
      return
     }
     state.user.subscribedCategories.push(id)
     state.user.fbCategoryKeys[id] = payload.fbCategoryKey
    },
    unsubscribeUserToCategory (state, payload) {
     const subscribedCategories = state.user.subscribedCategories
     subscribedCategories.splice(subscribedCategories.findIndex(category => category.id === payload), 1)
     Reflect.deleteProperty(state.user.fbCategoryKeys, payload)
    },
    setUser (state, payload) {
     state.user = payload
    }
  },
  actions: {
   subscribeUserToCategory ({commit, getters}, payload) {
    commit('setLoading', true)
    const user = getters.user
    firebase.database().ref('/users/' + user.id).child('/subscriptions/')
     .push(payload)
     .then(data => {
      commit('setLoading', false)
      commit('subscribeUserToCategory', {id: payload, fbCategoryKey: data.key})
     })
     .catch(error => {
      console.log(error)
      commit('setLoading', false)
     })
   },
   unsubscribeUserToCategory ({commit, getters}, payload) {
    commit('setLoading', true)
    const user = getters.user
    if(!user.fbCategoryKeys) {
     return
    }
    const fbCategoryKey = user.fbCategoryKeys[payload]
    firebase.database().ref('/users/' + user.id + '/subscriptions/').child(fbCategoryKey)
    .remove()
    .then(() => {
     commit('setLoading', false)
     commit('unsubscribeUserToCategory', payload)
    })
    .catch(error => {
     console.log(error)
     commit('setLoading', false)
    })
   },
    signUserUp ({commit}, payload) {
     commit('setLoading', true)
     commit('clearError')
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
      .then(
       user => {
        commit('setLoading', false)
        const newUser = {
         id: user.uid,
         subscribedCategories: [],
         fbCategoryKeys: {}
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
         subscribedCategories: [],
         fbCategoryKeys: {}
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
     commit('setUser',
     {id: payload.uid,
     subscribedCategories: [],
     fbCategoryKeys: {}
     })
    },
    fetchUserData ({commit, getters}) {
     commit('setLoading', true)
     firebase.database().ref('/users/' + getters.user.id + '/subscriptions/').once('value')
     .then(data => {
      const dataPairs = data.val()
      let subscribedCategories = []
      let swappedPairs = {}
      for (let key in dataPairs) {
       subscribedCategories.push(dataPairs[key])
       swappedPairs[dataPairs[key]] = key
      }
      const updatedUser = {
       id: getters.user.id,
       subscribedCategories: subscribedCategories,
       fbCategoryKeys: swappedPairs
      }
      commit('setLoading', false)
      commit('setUser', updatedUser)
      console.log(subscribedCategories)
      console.log(swappedPairs)
     })
     .catch(error => {
      console.log(error)
      commit('setLoading', false)
     })
    },
    logout ({commit}) {
     firebase.auth().signOut()
     commit('setUser', null)
    }
  },
  getters: {
    user (state) {
     return state.user
    }
  }
}
