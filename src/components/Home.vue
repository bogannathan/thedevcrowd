<template>
    <v-container>
        <v-layout row wrap class='mb-2'>
            <v-flex xs12 sm6 class='text-sm-right text-xs-center'>
                <v-btn large router to='/categories' class='info'>Explore the Forum</v-btn>
            </v-flex>
            <v-flex xs12 sm6 class='text-sm-left text-xs-center'>
                <v-btn large router to='/category/new' class='info'>Add Thread</v-btn>
            </v-flex>
        </v-layout>
        <v-layout>
           <v-flex xs12 sm6 offset-sm-3>
              <v-progress-circular
              indeterminate class="primary--text"
              :width='7'
              :size='70'
              v-if='loading'
              ></v-progress-circular>
           </v-flex>
        </v-layout>
        <v-layout row wrap class='mb-2'>
          <v-flex xs12>
            <v-carousel dark style='cursor: pointer' v-if='!loading'>
                <v-carousel-item
                v-for="category in categories"
                :src="category.imageUrl"
                :key="category.id"
                @click='onLoadForum(category.id)'>
                  <div class='title' >{{ category.title }}</div>
                </v-carousel-item>
            </v-carousel>
          </v-flex>
        </v-layout>
        <v-layout>
            <v-flex xs12 class='text-xs-center'>
                <p>Join the dev crowd!</p>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
  export default {
   // beforeCreate() 
    computed: {
      categories () {
        return this.$store.getters.featuredCategories
      },
       loading() {
        return this.$store.getters.loading
       }
    },
    methods: {
      onLoadForum (id) {
        this.$router.push('/categories/' + id)
      }
    }
  }
</script>

<style scoped >
  .title {
    position: absolute;
    bottom: 50px;
    background-color: rgba(0,0,0,0.5);
    color: white;
    font-size: 2em;
    padding: 15px;
  }
</style>
