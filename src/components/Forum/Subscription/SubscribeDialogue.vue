<template>
	  <v-dialog persistent v-model='subscribeDialog'>
				<v-btn accent slot='activator'>
					 {{ userIsSubscribed ? 'Unsubscribe' : 'Subscribe'}}
				</v-btn>
				<v-card>
					 <v-container>
							  <v-layout row wrap>
										  <v-flex xs12>
													  <v-card-title v-if='userIsSubscribed'>Unsubscribe from this forum?</v-card-title>
															<v-card-title v-else>Subscribe to this forum?</v-card-title>
										</v-flex>
									</v-layout>
									<v-divider></v-divider>
									<v-layout row wrap>
										  <v-flex xs12>
													 <v-card-text>
															  You can always change your decision later on.
														</v-card-text>
												</v-flex>
									</v-layout>
									<v-layout row wrap>
										  <v-flex xs12>
													  <v-card-actions>
																  <v-btn
																		style='color: red' flat
																		@click='subscribeDialog = false'>Cancel</v-btn>
																		<v-btn style='color: green' flat
																		@click='onAgree'>Confirm</v-btn>
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
					subscribeDialog: false
				}
			},
			computed: {
				userIsSubscribed () {
					console.log(categoryId)
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
