<template>
  <v-container>
      <v-layout row wrap v-for='category in categories' :key='category.id' class='mb-2'>
          <v-flex xs 12 sm10 md8 offset-sm1 offset-md2>
              <v-card class='info' >
                  <v-container>
                      <v-layout row>
                          <v-flex xs5 sm4 md3>
                              <v-card-media :src='category.imageUrl' height='125px'></v-card-media>
                          </v-flex>
                          <v-flex xs7 sm8 md9>
                            <v-card-title primary-title>
                              <div>
                                <h4 class='white--text mb-0'>{{ category.title }}</h4>
                                <div>{{ category.date | date }}</div>
                              </div>
                            </v-card-title>
                            <v-card-actions>
                                <v-btn flat :to="'/categories/' + category.id">
                                  <v-icon left>arrow_forward</v-icon>
                                  View this forum
                                </v-btn>
                            </v-card-actions>
                          </v-flex>
                      </v-layout>
                  </v-container>
              </v-card>
          </v-flex>
      </v-layout>
  </v-container>
</template>

<script>
  export default {
    computed: {
      categories () {
        return this.$store.getters.loadedCategories
      }
    }
  }
</script>
