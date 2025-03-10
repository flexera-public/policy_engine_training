# Flexera Policy Development - Lesson 07 - Underscore.js

In order to overcome some of the syntactic limitations of JavaScript, the JavaScript interpreter included in the policy template language is bundled with the [Underscore.js](https://underscorejs.org/) library. This library adds a lot of functionality common in other high-level programming languages.

**NOTE: This section assumes a basic familiarity with writing JavaScript code. If you are not familiar with JavaScript, it is recommended that you use an external resource, such as [Team Treehouse](https://teamtreehouse.com/) or [LinkedIn Learning](https://www.linkedin.com/learning/), to get a good basic foundation in JavaScript development before proceeding.**

## Basic Syntax

Underscore.js functions begin with an `_.` followed by the name of the function. Each function takes 1 to 3 parameters. In many cases, as you will see soon, many functions take a function itself as a parameter during normal use.

## Step 1: Create an empty JavaScript file

Either in VSCode or your command line, create a new file called `learn_underscore.js` inside the root directory of the GitHub repository. In VSCode, you can right-click in the empty space in the Explorer section then click `New File` to create this file.

Once this file has been created, open it in VSCode by clicking on it on the left.

## Step 2: Require the Underscore Library

At the top of the new file, put the following to require the Underscore.js library. This ensures that the library is available for use:

```javascript
var _ = require('underscore')
```

Note that this is never necessary in policy templates because the library is already baked in. We only need to do it here because we're writing and executing a script directly with Node.js.

## Step 3: Fictional Data

In order to experiment with Underscore.js, we need some variables with some data in them. Add the following to the script:

```javascript
number_list = [ 5, 3, 7, 2, 8, 4, 1, 6 ]

object_list = [
  { name: 'moe', age: 40 },
  { name: 'larry', age: 50 },
  { name: 'curly', age: 60 }
]
```

## Step 4: \_.each

\_.each is used to iterate through a list without having to manually craft a for loop. The first argument is the list that you're iterating through, and the second argument is a function whose only argument is the name used for each item in the list while iterating.

Let's try it out. Add this to the end of your script:

```javascript
console.log("The number list:")

_.each(number_list, function(number) {
  console.log(number)
})
```

The \_.each function will loop through our number list and log each number to the screen. Run the following command and you should see the following output:

```text
> node learn_underscore.js
The number list:
5
3
7
2
8
4
1
6
```

## Step 5: \_.filter

\_.filter is used to find all items in a list that matches some criteria and returns a list containing them. The first argument is the list that you're iterating through, and the second argument is a function that returns a true or false boolean value to indicate whether the given item in the list should be included in the result.

We're going to take our number list and filter only for numbers divisible by 2. Delete the code we added in step 4 and replace it with this:

```javascript
filtered_list = _.filter(number_list, function(number) {
  return number % 2 == 0
})

console.log("The filtered number list: ", filtered_list)
```

The % operator is similar to the / operator, but instead of doing full floating point division, it returns the remainder. This means `number % 2` should always return 0 if a number is divisible by 2.

Run the script again to test:

```text
> node learn_underscore.js
The filtered number list:  [ 2, 8, 4, 6 ]
```

## Step 6: \_.reject

\_.reject is the inverted version of \_.filter. Instead of filtering for the entries in a list that match, it removes the entries that match and keeps the rest.

Let's test this out. Replace \_.filter with \_.reject in the script like so:

```javascript
filtered_list = _.reject(number_list, function(number) {
  return number % 2 == 0
})

console.log("The filtered number list: ", filtered_list)
```

Now we should only get odd numbers instead of even ones. Run the script again to test:

```text
> node learn_underscore.js
The filtered number list:  [ 5, 3, 7, 1 ]
```

## Step 7: \_.find

\_.find is very similar to filter, except instead of returning a list containing all of the matching items, it returns only the first item that matches instead. This is useful for situations where you know the item you're looking for is only going to appear once in a list.

Let's test this out. Replace \_.reject with \_.find in the script like so:

```javascript
filtered_list = _.find(number_list, function(number) {
  return number % 2 == 0
})

console.log("The filtered number list: ", filtered_list)
```

Now we should get only the first number that matches. Run the script again to test:

```text
> node learn_underscore.js
The filtered number list:  2
```

## Step 8: \_.map

\_.map will take every item in a list, perform an operation on it, and return a list containing the transformed elements. This effectively allows you to transform all of the data in a list in the same way for each item.

Let's try it out. Delete everything in the test script below the `number_list` and `object_list` variables and replace it with the below:

```javascript
transformed_list = _.map(object_list, function(person) {
  return {
    name_capitalized: person['name'].toUpperCase(),
    age_in_days: person['age'] * 365
  }
})

console.log("Ages in days: ", JSON.stringify(transformed_list, null, 2))
```

Now run the script and you should see each item in the list transformed. Instead of having an `age` key, you will see an `age_in_days` key instead with the age expressed in days instead of years, and instead of a `name` key, you should see a `name_capitalized` key with the name shown in uppercase letters.

```text
> node learn_underscore.js
Ages in days:  [
  {
    "name": "moe",
    "age_in_days": 14600
  },
  {
    "name": "larry",
    "age_in_days": 18250
  },
  {
    "name": "curly",
    "age_in_days": 21900
  }
]
```

Note that the transformation doesn't need to retain the same data structure. Let's modify our code to the below:

```javascript
transformed_list = _.map(object_list, function(person) {
  return "Name: " + person['name'] + ", Age: " + person['age']
})

console.log("People: ", transformed_list)
```

Now run the script and you should see that the list now contains a series of strings instead of JavaScript objects:

```text
> node learn_underscore.js
People:  [
  'Name: moe, Age: 40',
  'Name: larry, Age: 50',
  'Name: curly, Age: 60'
]
```

## Step 9: \_.contains

\_.contains will return either true or false based on whether a list contains a specific value. The first parameter is the list and the second parameter is the value we're testing.

Delete everything in the test script below the `number_list` and `object_list` variables and replace it with the below:

```javascript
console.log("Contains 7: ", _.contains(number_list, 7))
console.log("Contains 11: ", _.contains(number_list, 11))
```

When you run the script, you should see that the first call of _.contains comes back "true" and the second one comes back "false". This is because the variable `number_list` does contain a value of 7 but does not contain a value of 11.

```text
> node learn_underscore.js
Contains 7:  true
Contains 11:  false
```

## Step 10: \_.compact and \_.uniq

\_.uniq will take a list and remove any redundant values so that it contains only unique values. For example, if the string "peacock" appears in the list 3 times, the list returned by \_.uniq will only contain the first instance of that value and dispense with the other two.

\_.compact will take a list and return a version of it with all falsy values removed. In JavaScript, the following values are considered "falsy":

* false
* null
* undefined
* NaN
* 0
* "" (empty string)

Let's try these out. Delete everything in the test script below the `number_list` and `object_list` variables and replace it with the below:

```javascript
dirty_list = [ 1, 2, 3, null, 4, 5, 0, undefined, 6, 7, 7, 7, 8, 9, 9, 9, 10, "" ]

clean_list = _.compact(dirty_list)
unique_list = _.uniq(clean_list)

console.log("Clean list: ", clean_list)
console.log("Unique list: ", unique_list)
```

When you run the script, you should see that `clean_list` has all of the previously-described falsy values removed, and `unique_list` does not contain the extra values of 7 and 9.

```text
> node learn_underscore.js
Dirty list:  [
  1,    2,         3,
  null, 4,         5,
  0,    undefined, 6,
  7,    7,         7,
  8,    9,         9,
  9,    10,        ''
]
Clean list:  [
  1,  2, 3, 4, 5, 6,
  7,  7, 7, 8, 9, 9,
  9, 10
]
Unique list:  [
  1, 2, 3, 4,  5,
  6, 7, 8, 9, 10
]
```

## Step 11: \_.pluck

\_.pluck will produce a list consisting of all of the values of a specific key in a list of objects. This saves you the time of having to do this with \_.map. This is useful when you only need one field from a list of objects in order to do further operations with it.

Let's give it a go. Delete everything in the test script below the `number_list` and `object_list` variables and replace it with the below:

```javascript
names = _.pluck(object_list, 'name')
ages = _.pluck(object_list, 'age')

console.log("Names: ", names)
console.log("Ages: ", ages)
```

When you run the script, you should see that the new `names` and `ages` variables contain lists with only the values of the `name` and `age` keys from the `object_list` variable.

```text
> node learn_underscore.js
Names:  [ 'moe', 'larry', 'curly' ]
Ages:  [ 40, 50, 60 ]
```

## Step 12: \_.sortBy

\_.sortBy takes a list of objects and returns a sorted list. The first parameter is the list, and the second parameter is either a key to sort the objects by, or a function to define how to sort the list.

Let's try both. Delete everything in the test script below the `number_list` and `object_list` variables and replace it with the below:

```javascript
object_list_name_sorted = _.sortBy(object_list, "name")

number_list_divisible_sorted = _.sortBy(number_list, function(number) {
  return number % 3 != 0
})

console.log("Object list sorted by name: ", JSON.stringify(object_list_name_sorted, null, 2))
console.log("Number list sorted by divisibility by 3: ", number_list_divisible_sorted)
```

When you run the script, you should see that the object list has been rearranged so that the values are now in alphabetical order by name. The number list has been sorted so that numbers divisible by three are at the beginning of the list.

```text
> node learn_underscore.js
Object list sorted by name:  [
  {
    "name": "curly",
    "age": 60
  },
  {
    "name": "larry",
    "age": 50
  },
  {
    "name": "moe",
    "age": 40
  }
]
Number list sorted by divisibility by 3:  [
  3, 6, 5, 7,
  2, 8, 4, 1
]
```

## Step 13: \_.groupBy

\_.groupBy will take every item in a list and categorize them as sublists within an object based on some criteria. Similar to \_.sortBy, the second parameter can either be a field that you want to group by, or a function that groups everything by some value you return.

Let's try both. Delete everything in the test script below the `number_list` and `object_list` variables and replace it with the below:

```javascript
object_list_grouped = _.groupBy(object_list, "name")

number_list_grouped = _.groupBy(number_list, function(number) {
  return number % 3 == 0
})

console.log("Object list grouped: ", JSON.stringify(object_list_grouped, null, 2))
console.log("Number list grouped: ", number_list_grouped)
```

When you run the script, you should see that `object_list_grouped` is an object. Each key in this object corresponds to a name in the original list, and contains a list of every value from the list whose name matched that key.

`number_list_grouped`, by contrast, has two keys, true and false, that contain the numbers that are and are not divisible by 3 respectively.

```text
> node learn_underscore.js
Object list grouped:  {
  "moe": [
    {
      "name": "moe",
      "age": 40
    }
  ],
  "larry": [
    {
      "name": "larry",
      "age": 50
    }
  ],
  "curly": [
    {
      "name": "curly",
      "age": 60
    }
  ]
}
Number list grouped:  { false: [ 5, 7, 2, 8, 4, 1 ], true: [ 3, 6 ] }
```

## Step 14: \_.size and \_.keys

\_.size returns the length of a list and \_.keys returns a list of keys in an object. Functionally, they are identical to the .length method lists natively have and the Object.keys() function built into JavaScript.

Let's try both. Delete everything in the test script below the `number_list` and `object_list` variables and replace it with the below:

```javascript
console.log("Object list size: ", object_list.length)
console.log("Object list size: ", _.size(object_list))
console.log("Object keys: ", Object.keys(object_list[0]))
console.log("Object keys: ", _.keys(object_list[0]))
```

When you run the script, you should see the number of values in the `object_list` list returned, as well as the keys for the first value in that list. Note how the native JavaScript functionality for each produces identical results.

```text
> node learn_underscore.js
Object list size:  3
Object list size:  3
Object keys:  [ 'name', 'age' ]
Object keys:  [ 'name', 'age' ]
```

## Step 15: \_.first and \_.last

\_.first and \_.last return the first and last values of a list respectively. They are for convenience and replicate functionality that already exists in JavaScript natively.

Let's try both. Delete everything in the test script below the `number_list` and `object_list` variables and replace it with the below:

```javascript
console.log("First number: ", number_list[0])
console.log("First number: ", _.first(number_list))
console.log("Last number: ", number_list[number_list.length - 1])
console.log("Last number: ", _.last(number_list))
```

When you run the script, you should see the first value and last value of the list. Note how the native JavaScript syntax produces identical results.

## Further Reading

This is far from a complete list of everything Underscore.js has to offer. The above are just the most commonly used functions. It is recommended that you read the [Underscore.js documentation](https://underscorejs.org/) to get a better sense of everything it can do, and use this as a reference if you encounter any Underscore.js functions that you do not recognize.

After doing so, please move on to [Lesson 08](https://github.com/flexera-public/policy_engine_training/blob/main/08_relational_data), where we will make use of some of this functionality to relate some data sets.
