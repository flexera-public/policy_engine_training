# Flexera Policy Development - Lesson 18 - Local JavaScript Testing

While fpt's script functionality is very useful, it can sometimes be a bit awkward to use and limiting when testing complex `script` blocks. For that reason, you may sometimes want to test your JavaScript directly with a local JavaScript interpreter such as node.js. In this lesson, we'll walk through how to do this using the "list_policy_templates.pt" policy template we've been developing.

NOTE: The version of JavaScript in the policy engine is several years old. Some newer syntax, such as "let", is not supported even though it may work when using a newer interpreter locally. Bear this in mind during development.

## Step 1: Retrieving Datasources

We're going to test the "js_policy_templates_with_lessons" script locally. To do that, we need local copies of every datasource that this script receives as a parameter. We'll use fpt to do this. Run the following commands:

```bash
fpt retrieve_data list_policy_templates.pt --credentials="auth_flexera=your_credential_identifier" -n ds_policy_lesson_list

fpt retrieve_data list_policy_templates.pt --credentials="auth_flexera=your_credential_identifier" -n ds_list_policy_templates
```

This should create local files named "datasource_ds_policy_lesson_list.json" and "datasource_ds_list_policy_templates.json" that contain the datasources.

## Step 2: Create JS File

In the same directory you created "list_policy_templates.pt" and stored the above JSON files, create a new file called "js_policy_templates_with_lessons.js". Open this file in your editor and add the following to the top:

```javascript
var _ = require('underscore')
```

This ensures that the Underscore.js library is included. This happens automatically in the policy engine but we have to include it manually when running a local JavaScript file through an interpreter.

If you followed the setup guide included in these lessons, you should already have node.js installed with the Underscore.js library. If you're using a different interpreter, be sure to install the Underscore.js library.

## Step 3: Add Parameters

Next, we will need to add our parameters, including the JSON files we pulled via fpt. Add this to the script next:

```javascript
// Parameters
var ds_policy_lesson_list = require("./datasource_ds_policy_lesson_list.json")
var ds_list_policy_templates = require("./datasource_ds_list_policy_templates.json")
var param_limit = 100
```

For local JSON files, we make use of require to store data from them. For our limit parameter, we simply set the value directly. Note that this means you can very quickly modify parameter values for testing, which can be useful for debugging.

## Step 4: Add Script

It's time to add the script. Simply paste the script itself from the policy template into our local JS file. Place a comment above it to indicate that this is our script. It should look like the below:

```javascript
// Script
policy_table = {}

_.each(ds_policy_lesson_list, function(lesson) {
  policy_table[lesson['name']] = lesson['lesson']
})

policy_templates_with_lessons = _.map(ds_list_policy_templates, function(template) {
  return {
    category: template['category'],
    id: template['id'],
    name: template['name'],
    short_description: template['short_description'],
    lesson: policy_table[template['name']]
  }
})

result = _.filter(policy_templates_with_lessons, function(template) {
  return template['lesson']
})

result = result.slice(0, param_limit)
```

## Step 5: Add Output

We could run the script now, but we won't actually see anything if we do. Let's add some output to the end to actually output the results of the script:

```javascript
// Output
console.log(JSON.stringify(result, null, 2))
```

It is recommended that you use the `JSON.stringify` function when outputting JSON objects or lists. This ensures that the output is formatted in a way that is easy to read.

## Step 6: Run Script

It's time to run our script! Run the script using node.js with the following command:

```bash
node js_policy_templates_with_lessons.js
```

Assuming everything was done correctly, the script should execute and you should see output like the below:

```text
[
  {
    "category": "Tutorial",
    "id": "60170dbd4582b9963de482bd",
    "name": "Hello World",
    "short_description": "Hello World",
    "lesson": "Lesson 02"
  },
  {
    "category": "Tutorial",
    "id": "70dbd01b48294b58d963de26",
    "name": "List Policy Templates",
    "short_description": "Lists all policy templates uploaded to the Flexera organization.",
    "lesson": "Lesson 06"
  }
]
```

Let's test what happens if we modify one of our parameters. Change the "param_limit" variable to 1:

```javascript
var param_limit = 1
```

Now run the script again. You should see only one item in the response:

```text
[
  {
    "category": "Tutorial",
    "id": "60170dbd4582b9963de482bd",
    "name": "Hello World",
    "short_description": "Hello World",
    "lesson": "Lesson 02"
  }
]
```

## Step 7: Debugging

If you're running a `script` block locally, you're likely trying to troubleshoot a problem with your script. Since the script is running as a local JS file, you can very quickly experiment with changes and observe the result. Once you have a working version of the script, you can simply paste it into the policy template.

You can also use `console.log` statements to identify issues during execution. Suppose we had an issue that we suspected was with the "policy_table" variable. Add the following `console.log` statement after we've assembled the table:

```javascript
policy_table = {}

_.each(ds_policy_lesson_list, function(lesson) {
  policy_table[lesson['name']] = lesson['lesson']
})

console.log(JSON.stringify(policy_table, null, 2))
```

Now temporarily comment out the output so that it doesn't get in the way of observing "policy_table":

```javascript
// Output
// console.log(JSON.stringify(result, null, 2))
```

Now when we run the script, we should only see the value of the "policy_table" variable after we've added data to it with the \_.each loop. Run the script and you should see this output:

```text
{
  "Hello World": "Lesson 02",
  "List Policy Templates": "Lesson 06"
}
```

That's it for now. Please proceed to [Lesson 19](https://github.com/flexera-public/policy_engine_training/blob/main/18_local_js/README.md) for more information on how to learn about the policy engine and policy template language.
