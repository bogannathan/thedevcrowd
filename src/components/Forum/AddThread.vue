<template>
  <v-container>
      <v-layout row>
          <v-flex xs12 sm6 offset-sm3>
              <h4>Create a new Category</h4>
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
                  <v-layout row>
                   <v-flex xs12 sm6>
                    <v-btn raised
                      @click="onPickFile"
                      class="primary"
                    >Upload Image
                      <v-icon right dark>cloud_upload</v-icon>
                    </v-btn>
                    <input
                    type='file'
                    style='display: none'
                    ref='fileInput'
                    accept='image/*'
                    @change='onFilePicked'>
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
        date: new Date(),
        image: null
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
          image: this.image,
          category: this.category,
          description: this.description,
          date: this.submittableDate
        }
        this.$store.dispatch('createCategory', categoryInfo)
        this.$router.push('/categories')
      },
      onPickFile() {
       this.$refs.fileInput.click()
      },
      onFilePicked (event) {
       const files = event.target.files
       let filename = files[0].name
       if (filename.lastIndexOf('.') <= 0) {
        return alert('Please add a valid file!')
       }
       const fileReader = new FileReader()
       fileReader.addEventListener('load', () => {
        this.imageUrl= fileReader.result
       })
       fileReader.readAsDataURL(files[0])
       this.image = files[0]
      }
    }
  }
</script>
