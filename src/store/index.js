import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    loadedCategories: [  {
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/47/New_york_times_square-terabass.jpg',
        id: 'afajfjadfaadfa323',
        title: 'Meetup in New York',
        date: new Date(),
        location: 'New York',
        description: 'New York, New York!'
      },
      {
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Paris_-_Blick_vom_gro%C3%9Fen_Triumphbogen.jpg',
        id: 'aadsfhbkhlk1241',
        title: 'Meetup in Paris',
        date: new Date(),
        location: 'Paris',
        description: 'It\'s Paris!'
      }],
    user: null,
    loading: false,
    error: null
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
    },
    updateCategory (state, payload) {
     const category = state.loadedCategories.find(category => {
      return category.id === payload.id
     })
     if (payload.title) {
      category.title = payload.title
     }
     if (payload.date) {
      category.date = payload.date
     }
     if (payload.description) {
      category.description = payload.description
     }
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
         category: obj[key].category,
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
        commit('setLoading', false)
       }
      )
    },
    createCategory ({commit, getters}, payload) {
      const category = {
        title: payload.title,
        topic: payload.topic,
        description: payload.description,
        category: payload.category,
        date: payload.date.toISOString(),
        creatorId: getters.user.id
      }
      let imageUrl
      let key
      firebase.database().ref('categories').push(category)
      .then((data) => {
       key = data.key
       return key
      })
      .then(key => {
       const filename = payload.image.name
       const ext = filename.slice(filename.lastIndexOf('.'))
       return firebase.storage().ref('categories/' + key + ext).put(payload.image)
      })
      .then(imageData => {
        imageUrl = imageData.metadata.downloadURLs[0]
        console.log(key)
        return firebase.database().ref('categories').child(key).update({imageUrl: imageUrl})
        console.log('imageUrl')
      })
      .then(() => {
       commit('createCategory', {
        ...category,
        imageUrl: imageUrl,
        id: key
       })
      })
      .catch((error) => {
       console.log(error)
      })
    },
    updateCategoryData ({commit}, payload) {
     commit('setLoading', true)
     const updateObj = {}
     if (payload.title) {
      updateObj.title = payload.title
     }
     if (payload.description) {
      updateObj.description = payload.description
     }
     if (payload.date) {
      updateObj.date = payload.date
     }
     firebase.database().ref('categories').child(payload.id).update(updateObj)
     .then(() => {
      commit('setLoading', false)
      commit('updateCategory', payload)
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
         console.log(categoryId)
         console.log('check')
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
