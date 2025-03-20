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

// Step 8: _.map (1)
transformed_list = _.map(object_list, function(person) {
  return {
    name_capitalized: person['name'].toUpperCase(),
    age_in_days: person['age'] * 365
  }
})

console.log("Ages in days: ", JSON.stringify(transformed_list, null, 2))

// Step 8: _.map (2)
transformed_list = _.map(object_list, function(person) {
  return "Name: " + person['name'] + ", Age: " + person['age']
})

console.log("People: ", transformed_list)

// Step 9: _.contains
console.log("Contains 7: ", _.contains(number_list, 7))
console.log("Contains 11: ", _.contains(number_list, 11))

// Step 10: _.compact and _.uniq
dirty_list = [ 1, 2, 3, null, 4, 5, 0, undefined, 6, 7, 7, 7, 8, 9, 9, 9, 10, "" ]

clean_list = _.compact(dirty_list)
unique_list = _.uniq(clean_list)

console.log("Dirty list: ", dirty_list)
console.log("Clean list: ", clean_list)
console.log("Unique list: ", unique_list)

// Step 11: _.pluck
names = _.pluck(object_list, 'name')
ages = _.pluck(object_list, 'age')

console.log("Names: ", names)
console.log("Ages: ", ages)

// Step 12: _.sortBy
object_list_name_sorted = _.sortBy(object_list, "name")

number_list_divisible_sorted = _.sortBy(number_list, function(number) {
  return number % 3 != 0
})

console.log("Object list sorted by name: ", JSON.stringify(object_list_name_sorted, null, 2))
console.log("Number list sorted by divisibility by 3: ", number_list_divisible_sorted)

// Step 13: _.groupBy
object_list_grouped = _.groupBy(object_list, "name")

number_list_grouped = _.groupBy(number_list, function(number) {
  return number % 3 == 0
})

console.log("Object list grouped: ", JSON.stringify(object_list_grouped, null, 2))
console.log("Number list grouped: ", number_list_grouped)

// Step 14: _.size and _.keys
console.log("Object list size: ", object_list.length)
console.log("Object list size: ", _.size(object_list))
console.log("Object keys: ", Object.keys(object_list[0]))
console.log("Object keys: ", _.keys(object_list[0]))

// Step 15: _.first and _.last
console.log("First number: ", number_list[0])
console.log("First number: ", _.first(number_list))
console.log("Last number: ", number_list[number_list.length - 1])
console.log("Last number: ", _.last(number_list))
