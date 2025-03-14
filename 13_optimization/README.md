# Flexera Policy Development - Lesson 13 - Optimization

When dealing with small data sets, you may never experience any pressure to optimize your policy templates. As the amount of data your policy template manages grows, however, you might find that you run into problems of scale. In particular, it is possible for a policy template to run out of memory, at which point execution will fail. Policy templates also have a hard limit of 1 hour for total execution time, and 30 minutes for the execution time of individual datasources.

For that reason, it is good to follow a few best practices when developing policy templates to ensure they are well optimized. We'll go over those in this lesson.

## Efficient Use of APIs

Often, just changing how your API calls are made can increase the efficiency of your policy. Always consider the following:

### Reduce # of API Requests

If the data set you are iterating through contains items you know you won’t need data for, pre-filtering that data can greatly speed up policy execution. If the API allows for bulk requests, where data can be obtained for a large number of items at once with a single request, that can help as well.

### Filter via API

If you're gathering a large set of data and then filtering it down in a `script` block, look at the documentation of the API you're using and see if the API itself supports filtering via a header or query parameter. If it does, use that instead, or at least use it to reduce the data set as much as possible in advance.

## JavaScript Coding Practices

There’s no escaping the occasional need to use `script` blocks to manipulate data. In those cases, good coding practices can significantly reduce policy execution time.

### String Combining / Concatenation

While it may be convenient and easily readable, making use of mathematical operators, such as `+`, to combine strings is actually very inefficient, and in policies where the operation has to be done thousands of times within a loop, this can make a very large difference in how quickly your script executes. Here is an example of a script that, with a large enough data set, would take a very long time to complete:

```javascript
mystring = ""

_.each(ds_some_datasource, function(item) {
  mystring += item['value'] + ',' + item['another_value'] + ',' + item['third_value'] + "\n"
})
```

A much more efficient way to do this is to combine all of the relevant elements into a list, and then use the join function to combine the list into a string at the end. By default, join will add a comma between elements, but this can be resolved by playing an empty string as the parameter, like in the below example:

```javascript
mylist = []

_.each(ds_some_datasource, function(item) {
  mylist.push(item['value'], ',', item['another_value'], ',', item['third_value'], "\n")
})

mystring = mylist.join('')
```

### Make Use of Underscore.js

Underscore.js, discussed in detail in [Lesson 08](https://github.com/flexera-public/policy_engine_training/blob/main/08_underscore/README.md), is a JavaScript library that adds a lot of Python-like functionality, and it is included in the Policy Engine. In most cases, if a task can be completed using an underscore.js function instead of manually, the former will not only be more efficient from a development perspective, but it will execute more quickly as well due to Underscore.js routines being well-optimized.

### Reduce Looping (Especially Nested Looping)

Looping through a large data set can take a long time, but what takes even longer is looping through another large data set for every loop of the first data set. Reducing or eliminating loops can make a huge difference.

One very effective workaround, in some cases, is to store the contents of the nested data set in an object, rather than a list, whose keys correspond to some field in the data set of the top-level loop. This is easier to explain via example; note the following inefficient JavaScript code:

```javascript
result = []

_.each(ds_employees, function(employee) {
  _.each(ds_expenses, function(expense) {
    if (employee['id'] = expense['employee_id']) {
      employee['expense_amount'] = expense['amount']
    }
  })

  result.push(employee)
})
```

The above code iterates through each employee, and for each of those iterations, it iterates through a full list of expenses to find one that matches. This is extremely inefficient; searching a list by checking each item one by one is very slow. If each list were 1000 items long, this would result in over a million loops!

Here is an example of how to do it more efficiently using an object. In this example, the key in `expense_object` correlates to the "id" field in `ds_employees`. This means we don't have to do a loop through the entire expenses list for each employee, significantly improving speed of execution:

```javascript
result = []

expense_object = {}
_.each(ds_expenses, function(expense) { expense_object[expense['employee_id']] = expense })

_.each(ds_employees, function(employee) {
  id = employee['id']
  employee['expense_amount'] = expense_object[id]['amount']
  result.push(employee)
})
```

You may have noticed that we did something similar in the "list_policy_templates.pt" policy template we've been developing. We used the same coding pattern to associate each policy template with its lesson.

```javascript
policy_table = {}

_.each(policy_lesson_list, function(lesson) {
  policy_table[lesson['name']] = lesson['lesson']
})

policy_templates_with_lessons = _.map(policy_templates, function(template) {
  return {
    category: template['category'],
    id: template['id'],
    name: template['name'],
    short_description: template['short_description'],
    lesson: policy_table[template['name']]
  }
})
```

No policy work this time! You've completed Lesson 13. Please move on to [Lesson 14](https://github.com/flexera-public/policy_engine_training/blob/main/14_misc/README.md).
