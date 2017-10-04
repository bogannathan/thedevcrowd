<template>
	  <v-dialog persistent v-model='subscribeDialogue'>
				  <v-btn accent slot='activator'>
							  {{ userIsSubscribed ? 'Unsubscribe' : 'Subscribe'}}
						</v-btn>
						<v-card>
							  <v-container>
										  <v-layout row wrap>
													  <v-flex xs12>
																  <v-card-title v-if='userIsSubscribed'>Unsubscribe from Category?</v-card-title>
																		<v-card-title v-else>Subscribe to Category?</v-card-title>
															</v-flex>
												</v-layout>
												<v-divider></v-divider>
												<v-layout row wrap>
													  <v-flex xs12>
																  <v-card-text>You can always change your mind later.</v-card-text>
															</v-flex>
												</v-layout>
												<v-layout row wrap>
													  <v-flex xs12>
																<v-card-actions>
																	  <v-btn class='red--text darken-1' flat @click='subscribeDialogue = false'>Cancel</v-btn>
																			<v-btn class='green--text darken-1' flat @click='onAgree'>Confirm</v-btn>
																</v-card-actions>
															</v-flex>
												</v-layout>
									</v-container>
						</v-card>
			</v-dialog>
</template>

<script>
  export default {
			props: ['categoryId'],
			data () {
				return {
					subscribeDialogue: false
				}
			},
			computed: {
				userIsSubscribed () {
					return this.$store.getters.user.subscribedCategories.findIndex(categoryId => {
						return categoryId === this.categoryId
					}) >= 0
				}
			},
			methods: {
				onAgree () {

				}
			}
		}
</script>
