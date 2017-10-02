import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    loadedCategories: [
      {
        imageUrl: 'http://blog.cashcrate.com/wp-content/uploads/2013/07/forum.jpg',
        id: '1',
        title: 'Forum category1',
        date: new Date(),
        topic: 'topic 1',
        description: 'description 1',
        category: 'category 1'
      },
      { imageUrl: 'http://sporkmarketing.com/wp-content/uploads/2013/07/forum-posting-marketing.jpg',
        id: 'asdldddd;kfj',
        title: 'Forum category2',
        date: '2017-07-18',
        topic: new Date(),
        description: 'descript 2',
        category: 'cateogyr 2'
      }
    ],
    user: {
      id: 'asdfjlasd',
      registeredCategories: ['asdldddd;kfj']
    }
  },
  mutations: {
    createCategory (state, payload) {
      state.loadedCategories.push(payload)
    },
    setUser (state, payload) {
     state.user = payload
    }
  },
  actions: {
    createCategory ({commit}, payload) {
      const category = {
        title: payload.title,
        topic: payload.topic,
        imageUrl: payload.imageUrl,
        description: payload.description,
        category: payload.category,
        date: payload.date,
        id: 'asfldkjfalsdkfj'
      }
      //store in firebase to store it
      commit('createCategory', category)
    },
    signUserUp ({commit}, payload) {
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
      .then(
       user => {
        const newUser = {
         id: user.uid,
         registeredCategories: []
        }
        commit('setUser', newUser)
       })
       .catch(
        error => {
         console.log(error)
        }
       )
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
    }
  }
})
