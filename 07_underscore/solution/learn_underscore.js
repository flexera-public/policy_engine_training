// Step 2: Require the Underscore Library
var _ = require('underscore')

// Step 3: Fictional Data
number_list = [ 5, 3, 7, 2, 8, 4, 1, 6 ]

object_list = [
  { name: 'moe', age: 40 },
  { name: 'larry', age: 50 },
  { name: 'curly', age: 60 }
]

// Step 4: _.each
console.log("The number list:")

_.each(number_list, function(number) {
  console.log(number)
})

// Step 5: _.filter
filtered_list = _.filter(number_list, function(number) {
  return number % 2 == 0
})

console.log("The filtered number list: ", filtered_list)

// Step 6: _.reject
filtered_list = _.reject(number_list, function(number) {
  return number % 2 == 0
})

console.log("The filtered number list: ", filtered_list)

// Step 7: _.find
filtered_list = _.find(number_list, function(number) {
  return number % 2 == 0
})

console.log("The filtered number list: ", filtered_list)
