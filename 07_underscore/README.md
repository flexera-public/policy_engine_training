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

## Step 4: _.each

_.each is used to iterate through a list without having to manually craft a for loop. The first argument is the list that you?re iterating through, and the second argument is a function whose only argument is the name used for each item in the list while iterating.

Let's try it out. Add this to the end of your script:

```javascript
console.log("The number list:")

_.each(number_list, function(number) {
  console.log(number)
})
```

The _.each function will loop through our number list and log each number to the screen. Run the following command and you should see the following output:

```text
? node learn_underscore.js
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

## Step 5: _.filter

_.filter is used to find all items in a list that matches some criteria and returns a list containing them. The first argument is the list that you?re iterating through, and the second argument is a function that returns a true or false boolean value to indicate whether the given item in the list should be included in the result.

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
? node learn_underscore.js
The filtered number list:  [ 2, 8, 4, 6 ]
```

## Step 6: _.reject

_.reject is the inverted version of _.filter. Instead of filtering for the entries in a list that match, it removes the entries that match and keeps the rest.

Let's test this out. Replace _.filter with _.reject in the script like so:

```javascript
filtered_list = _.reject(number_list, function(number) {
  return number % 2 == 0
})

console.log("The filtered number list: ", filtered_list)
```

Now we should only get odd numbers instead of even ones. Run the script again to test:

```text
? node learn_underscore.js
The filtered number list:  [ 5, 3, 7, 1 ]
```

## Step 7: _.find

_.find is very similar to filter, except instead of returning a list containing all of the matching items, it returns only the first item that matches instead. This is useful for situations where you know the item you're looking for is only going to appear once in a list.

Let's test this out. Replace _.reject with _.find in the script like so:

```javascript
filtered_list = _.find(number_list, function(number) {
  return number % 2 == 0
})

console.log("The filtered number list: ", filtered_list)
```

Now we should get only the first number that matches. Run the script again to test:

```text
? node learn_underscore.js
The filtered number list:  2
```
