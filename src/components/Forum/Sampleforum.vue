<template>
  <v-container>
     <v-layout row wrap v-if='loading'>
       <v-flex xs12 sm6 offset-sm-3>
         <v-progress-circular
         indeterminate class="primary--text"
         :width='7'
         :size='70'
         v-if='loading'
         ></v-progress-circular>
        </v-flex>
      </v-layout>
      <v-layout row wrap v-else>
          <v-flex xs12>
              <v-card>
                  <v-card-title>
                      <h6 class='primary--text'>{{ category.title }}</h6>
                      <template v-if='userIsCreator'>
                         <v-spacer></v-spacer>
                         <app-edit-category-details-dialogue :category='category'></app-edit-category-details-dialogue>
                      </template>
                  </v-card-title>
                  <v-card-media
                  :src='category.imageUrl'
                  height='400px'
                  ></v-card-media>
                  <v-card-text >
                    <div class='info--text'>{{ category.topic }} - {{ category.category }}</div>
                    <div>{{ category.description }} - {{ category.date | date }} and {{ category.id }}</div>
                  </v-card-text>
																		<v-card-actions>
						            <v-spacer></v-spacer>
						            <app-category-subscription-dialogue
						              :categoryId="category.id"></app-category-subscription-dialogue>
						          </v-card-actions>
              </v-card>
          </v-flex>
      </v-layout>
  </v-container>
</template>

<script>
  export default {
    props: ['id'],
    computed: {
      category () {
       console.log(this.id)
							console.log('another check')
        return this.$store.getters.loadedCategory(this.id)
      },
      userIsAuthenticated () {
       return this.$store.getters.user !== null && this.$store.getters.user !== undefined
      },
      userIsCreator () {
       if (!this.userIsAuthenticated) {
        return false
       }
        return this.$store.getters.user.id === this.category.creatorId
      },
      loading () {
        return this.$store.getters.loading
      }
    }
  }
</script>
