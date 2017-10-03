<template>
	  <v-dialog width='350px' persistent v-model='editDialogue'>
				<v-btn fab accent slot='activator'>
					  <v-icon>edit</v-icon>
				</v-btn>
				<v-card>
					 <v-container>
							  <v-layout row wrap>
										  <v-flex xs12>
													  <v-card-title>Edit Category</v-card-title>
												</v-flex>
									</v-layout>
									<v-divider></v-divider>
									<v-layout row wrap>
										  <v-flex xs12>
													 <v-card-text>
															<v-text-field
																	name='title'
																	label='title'
																	id='title'
																	v-model='editedTitle'
																	required
															></v-text-field>
															<v-text-field
																	name='description'
																	label='description'
																	id='description'
																	v-model= 'editedDescription'
																	required
																	multi-line
															></v-text-field>
														</v-card-text>
												</v-flex>
									</v-layout>
									<v-layout row wrap>
										  <v-flex xs12>
													 <v-date-picker v-model='editableDate' style='width: 100%' actions>
															 <template scope='{save, cancel}'>
																</template>
														</v-date-picker>
												</v-flex>
									</v-layout>
									<v-layout v-if='showError' class='mb-3'>
										  <v-flex style='color: red'>
													  Please fill out all required fields.
												</v-flex>
								</v-layout>
									<v-divider></v-divider>
									<v-layout row wrap>
										  <v-flex xs12>
													  <v-card-actions>
																  <v-btn flat class='blue--text darken-2' @click='editDialogue=false'>Close</v-btn>
																		<v-btn flat class='blue--text darken-2' @click='onSaveChanges'>Save</v-btn>
															</v-card-actions>
												</v-flex>
									</v-layout>
						</v-container>
				</v-card>
			</v-dialog>
</template>

<script>
  export default {
			props: ['category'],
			data () {
				return {
					editDialogue: false,
					editedTitle: this.category.title,
					editedDescription: this.category.description,
					editableDate: null,
					showError: false
				}
			},
			methods: {
				onSaveChanges () {
					const newDate = new Date(this.category.date)
					const newDay = new Date(this.editableDate).getUTCDate()
					const newMonth = new Date(this.editableDate).getUTCMonth()
					const newYear = new Date(this.editableDate).getUTCFullYear()
					newDate.setUTCDate(newDay)
					newDate.setUTCMonth(newMonth)
					newDate.setUTCFullYear(newYear)

				if (this.editedTitle.trim() === '' || this.editedDescription.trim() === '') {
						return this.showError = true
					}
					this.editDialogue = false

					this.$store.dispatch('updateCategoryData', {
						id: this.category.id,
						title: this.editedTitle,
						description: this.editedDescription,
						date: newDate
					})
				},
				created () {
					this.editableDate = new Date(this.category.date)
				}
			}
		}
</script>
