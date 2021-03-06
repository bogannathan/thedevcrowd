import * as firebase from 'firebase'

export default {
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
      }]
  },
  mutations: {
    createCategory (state, payload) {
      state.loadedCategories.push(payload)
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
    }
  }
}
