<template>
  <v-container>
      <v-layout row wrap>
          <v-flex xs12>
              <v-card>
                  <v-card-title>
                      <h6 class='primary--text'>{{ category.title }}</h6>
                  </v-card-title>
                  <v-card-media
                  :src='category.imageUrl'
                  height='400px'
                  ></v-card-media>
                  <v-card-text>
                    <div class='info--text'>{{ category.topic }} - {{ category.category }}</div>
                    <div>{{ category.description }} - {{ category.date | date }}</div>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                      <v-btn class='primary'>Go to posts</v-btn>
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
        return this.$store.getters.loadedCategory(this.id)
      }
    }
  }
</script>
