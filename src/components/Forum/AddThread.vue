<template>
  <v-container>
      <v-layout row>
          <v-flex xs12 sm6 offset-sm3>
              <h4>Create a new Meetup</h4>
          </v-flex>
      </v-layout>
      <v-layout row>
          <v-flex xs12>
              <form @submit.prevent='onCreateCategory'>
                  <v-layout xs12 sm6 offset-sm3>
                      <v-text-field
                        name='title'
                        label='title'
                        id='title'
                        v-model= 'title'
                        required
                      ></v-text-field>
                  </v-layout>
                  <v-layout xs12 sm6 offset-sm3>
                      <v-text-field
                        name='category'
                        label='category'
                        id='category'
                        v-model= 'category'
                        required
                      ></v-text-field>
                  </v-layout>
                  <v-layout xs12 sm6 offset-sm3>
                      <v-text-field
                        name='topic'
                        label='Topic'
                        id='topic'
                        v-model= 'topic'
                        required
                      ></v-text-field>
                  </v-layout>
                  <v-layout xs12 sm6 offset-sm3>
                      <v-flex xs12 sm6 offset-sm3>
                         <input type='file'></input>
                      </v-flex>
                  </v-layout>
                  <v-layout row>
                      <v-flex xs12 sm6 offset-sm3>
                          <img :src='imageUrl' width='200'></img>
                      </v-flex>
                  </v-layout>
                  <v-layout xs12 sm6 offset-sm3>
                      <v-text-field
                        name='description'
                        label='description'
                        id='description'
                        v-model= 'description'
                        required
                        multi-line
                      ></v-text-field>
                  </v-layout>
                  <v-layout row wrap>
                      <v-flex xs12 sm6 offset-sm3 lg4>
                          <v-date-picker v-model="date" landscape></v-date-picker>
                      </v-flex>
                  </v-layout>
                  <v-layout row>
                      <v-flex xs12 sm6 offset-sm-3>
                          <v-btn type='submit' class='primary' :disabled='!formIsValid'>Add Thread</v-btn>
                      </v-flex>
                  </v-layout>
              </form>
          </v-flex>
      </v-layout>
  </v-container>
</template>

<script>
  export default {
    data () {
      return {
        title: '',
        category: '',
        imageUrl: '',
        description: '',
        topic: '',
        date: new Date()
      }
    },
    computed: {
      formIsValid () {
        return this.title !== '' &&
        this.location !== '' &&
        this.topic !== '' &&
        this.description !== ''
      },
      submittableDate () {
        const date = new Date(this.date)
        return date
      }
    },
    methods: {
      onCreateCategory () {
        if (!this.formIsValid) {
          return
        }
        const categoryInfo = {
          title: this.title,
          topic: this.topic,
          imageUrl: this.imageUrl,
          category: this.category,
          description: this.description,
          date: this.submittableDate
        }
        this.$store.dispatch('createCategory', categoryInfo)
        this.$router.push('/categories')
      }
    }
  }
</script>
