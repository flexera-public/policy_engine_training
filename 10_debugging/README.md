# Flexera Policy Development - Lesson 10 - Debugging

So far, we've only been focused on how to build a policy template, but sometimes you build a policy template, and it doesn't work correctly, or you're tasked with repairing a broken policy template developed by someone else. In this lesson, we'll go over some common problems and how to debug and solve them.

## Step 1: Copy the Broken Template

For this lesson, we'll be using a pre-written template that is already broken and fixing it. You should recognize this template, as it is the one we developed in the previous lesson, albeit with some modifications to break it.

Please copy this template to the root of the repository. You should be able to do this using the below command:

### Windows (PowerShell)

```powershell
Copy-Item -Path "09_debugging\solutions\list_policy_templates_broken.pt" -Destination .
```

### Windows (WSL2), macOS, and Linux

```bash
cp 09_debugging/solutions/list_policy_templates_broken.pt .
```

## Step 2: Fixing Syntax Errors

Let's begin by running fpt check against the policy template. You should get an error back:

```text
> fpt check list_policy_templates_broken.pt
Checking list_policy_templates_broken.pt
1 syntax error found:
  origin: template: list_policy_templates_broken.pt, line: 13
  problem: Undefined variable or method
  summary: 'paraeter' is undefined.
  resolution: Review the list of built-in methods and reserved words at https://docs.rightscale.com/policies/reference/v20180301/policy_template_language.html

ERROR: compilation errors occurred
```

We found a syntax error. You'll notice the following fields:

* The `origin` indicates the policy template and line the error occurs on.
* The `problem` tells you the type of error.
* The `summary` describes the error in more detail.
* The `resolution` gives advice on how to resolve the error.

In this case, diagnosis is pretty simple if we look at line 13 of the "list_policy_templates_broken.pt" file:

```ruby
paraeter "param_email" do
```

This should be "parameter", not "paraeter". Correct this, save the file, and run fpt check once again. You should get the below response:

```text
> fpt check list_policy_templates_broken.pt
Checking list_policy_templates_broken.pt
5 syntax errors found:
  origin: template: list_policy_templates_broken.pt, line: 43
  problem: Undefined variable or method
  summary: 'auth_flexera' is undefined.
  resolution: Review the list of built-in methods and reserved words at https://docs.rightscale.com/policies/reference/v20180301/policy_template_language.html

  origin: template: list_policy_templates_broken.pt, line: 42
  problem: Request missing host
  summary: A request must have either a 'host' or 'run_script'.
  resolution: Please pass either a 'host' or a 'run_script' (no other fields may be passed along with 'run_script').

  origin: template: list_policy_templates_broken.pt, line: 61
  problem: Invalid field value
  summary: Field 'run_script' from datasource 'ds_policy_templates_with_lessons' must be a array but is actually '[$js_policy_templates_with_lessons, nil, $ds_list_policy_templates]' which is an array.
  resolution: Replace current value with one of the correct type.

  origin: template: list_policy_templates_broken.pt, line: 60
  problem: Missing datasource fields
  summary: A datasource must contain one of: 'field', 'request', or 'run_script'.
  resolution: Please add 'field'(s), 'request', or 'run_script'.

  origin: template: list_policy_templates_broken.pt, line: 94
  problem: Invalid escalate argument
  summary: Policy validate_each escalate declared with an argument.
  resolution: Please pass an 'escalation' reference; '' is a nilclass.

ERROR: compilation errors occurred
```

It's not uncommon for some errors to not make themselves known until other errors have been fixed. This is why it's important to keep looping through fpt check until we no longer get any errors back.

It looks like we've found 5 errors. Let's start with fixing the first error:

```text
  origin: template: list_policy_templates_broken.pt, line: 43
  problem: Undefined variable or method
  summary: 'auth_flexera' is undefined.
  resolution: Review the list of built-in methods and reserved words at https://docs.rightscale.com/policies/reference/v20180301/policy_template_language.html
```

When we look at line 43 in the template, we can see a reference to the "auth_flexera" referenced in the summary above:

```ruby
  request do
    auth auth_flexera
    verb "GET"
```

The issue here is that we didn't precede "auth_flexera" with the `$` symbol. Because of this, the policy engine tried to parse it as a built-in function or reserved word. Correct this by adding the `$` symbol and saving the file.

```ruby
  request do
    auth $auth_flexera
    verb "GET"
```

Now run fpt check again and verify that the error is gone:

```text
> fpt check list_policy_templates_broken.pt
Checking list_policy_templates_broken.pt
3 syntax errors found:
  origin: template: list_policy_templates_broken.pt, line: 61
  problem: Invalid field value
  summary: Field 'run_script' from datasource 'ds_policy_templates_with_lessons' must be a array but is actually '[$js_policy_templates_with_lessons, nil, $ds_list_policy_templates]' which is an array.
  resolution: Replace current value with one of the correct type.

  origin: template: list_policy_templates_broken.pt, line: 60
  problem: Missing datasource fields
  summary: A datasource must contain one of: 'field', 'request', or 'run_script'.
  resolution: Please add 'field'(s), 'request', or 'run_script'.

  origin: template: list_policy_templates_broken.pt, line: 94
  problem: Invalid escalate argument
  summary: Policy validate_each escalate declared with an argument.
  resolution: Please pass an 'escalation' reference; '' is a nilclass.

ERROR: compilation errors occurred
```

Notice that we went from 5 errors to 3 errors. It's not uncommon for a single mistake to produce multiple errors, so it is best practice to run fpt check after correcting each error to avoid trying to diagnose things unnecessarily.

Let's tackle this error next:

```text
  origin: template: list_policy_templates_broken.pt, line: 61
  problem: Invalid field value
  summary: Field 'run_script' from datasource 'ds_policy_templates_with_lessons' must be a array but is actually '[$js_policy_templates_with_lessons, nil, $ds_list_policy_templates]' which is an array.
  resolution: Replace current value with one of the correct type.
```

This error can be a bit confusing the first time you see it because it looks self-contradictory. What does it mean to say that something "must be an array" but is something "which is an array"?

It's actually far simpler than it seems though. This error typically occurs when your `run_script` field has an error in one of its parameters. Notice the list in the error message:

```text
[$js_policy_templates_with_lessons, nil, $ds_list_policy_templates]
```

The error was reported for line 61, so let's compare this to line 61 in the policy template:

```ruby
  run_script $js_policy_templates_with_lessons, $ds_policy_list, $ds_list_policy_templates
```

Notice how the first and third items in the list correspond to the parameters in the policy template, but the second item says "nil". This means that the second parameter doesn't actually reference a valid value.

And sure enough, if you try to find "ds_policy_list" anywhere in the policy template, you'll discover it doesn't exist. In this case, this parameter is supposed to be the "ds_policy_lesson_list" datasource. Let's correct this:

```ruby
  run_script $js_policy_templates_with_lessons, $ds_policy_lesson_list, $ds_list_policy_templates
```

Now when you run fpt check, we should be down to a single syntax error:

```text
> fpt check list_policy_templates_broken.pt
Checking list_policy_templates_broken.pt
1 syntax error found:
  origin: template: list_policy_templates_broken.pt, line: 94
  problem: Invalid escalate argument
  summary: Policy validate_each escalate declared with an argument.
  resolution: Please pass an 'escalation' reference; '' is a nilclass.

ERROR: compilation errors occurred
```

This error is telling us that an `escalate` field has an invalid argument. If we look at line 94 in the policy template, we'll find this:

```ruby
    escalate $esc_email
```

This *looks* correct, but if you search for any references to "esc_email" in the policy template, you won't find any. If you scroll down to the `escalation` block on line 115, you'll notice it has a different name:

```ruby
escalation "esc_email_list" do
```

Either name is fine, but they need to match so that the `escalate` field references a valid `escalation` block. Modify line 115 so that the `escalation` block is named "esc_email" so that they match:

```ruby
escalation "esc_email" do
```

Now if you run fpt check on the policy template, you should get no syntax errors.

## Step 3: Fixing Runtime Errors

Now that we've fixed all the syntax errors, let's run the policy template. Be sure to replace "your_credential_identifier" in the below command with the ID of the credential you created during the setup process, both in this lesson and in future lessons.

```bash
fpt run list_policy_templates_broken.pt --credentials="auth_flexera=your_credential_identifier"
```

The policy template should fail to complete its run with an error. Not all errors will show up during a check; some errors only become apparent when attempting to run the policy template.

```text
Summary:
  script execution failed
Detail:
  execution failed: ReferenceError: 'policy_tablee' is not defined
Location:
  datasource "ds_policy_templates_with_lessons"
    script "js_policy_templates_with_lessons"
```

Runtime errors will indicate the datasource and, if relevant, script that the error occurred on. In this case, we know the error occurred in the `js_policy_templates_with_lessons` script.

When the error is within a `script` block, the error will be a JavaScript error. In this case, it looks like we're trying to reference "policy_tablee", which is not defined.

This pretty straightforwardly looks like a typo. If we search for "policy_tablee" in the policy template, we find this code:

```javascript
  policy_table = {}

  _.each(policy_lesson_list, function(lesson) {
    policy_tablee[lesson['name']] = lesson['lesson']
  })
```

Correct the typo by changing "policy_tablee" to "policy_table", save that change, and then run the policy template again:

```bash
fpt run list_policy_templates_broken.pt --credentials="auth_flexera=your_credential_identifier"
```

The policy template should now complete execution without issue.

## Step 4: Fixing Other Errors

We're not quite done yet. The policy template no longer has any syntax errors, and runs without generating any runtime errors, but if we scroll up through the output from the run, we'll see the following:

````text
Validation of **$ds\_policy\_templates\_with\_lessons** failed
2 items failed check:

```json
[
  {
    "category": null,
    "id": null,
    "lesson": "Lesson 02",
    "name": "Hello World",
    "short_description": null
  },
  {
    "category": null,
    "id": null,
    "lesson": "Lesson 06",
    "name": "List Policy Templates",
    "short_description": null
  }
]
```
````

These are the two items that would appear in the policy incident, but for some reason, only the "lesson" and "name" fields have values. Everything else is null, which is definitely not correct.

This doesn't cause any problems on a technical level; the policy template is able to complete execution and raise an incident. The end user of this policy template probably wants to see these values though.

To diagnose this, let's do a retrieve_data. We will be omitting the `-n` flag so that we pull every datasource in the policy template:

```bash
fpt retrieve_data list_policy_templates_broken.pt --credentials="auth_flexera=your_credential_identifier"
```

All three datasources should now be local JSON files. Let's start by looking at the "datasource_ds_policy_templates_with_lessons.json" file, which corresponds to the datasource that gets validated at the end of execution.

```json
[
  {
    "category": null,
    "id": null,
    "lesson": "Lesson 02",
    "name": "Hello World",
    "short_description": null
  },
  {
    "category": null,
    "id": null,
    "lesson": "Lesson 06",
    "name": "List Policy Templates",
    "short_description": null
  }
]
```

We see more or less the same thing we saw in the fpt run output. We know the values for the "category", "id", and "short_description" fields are derived from the "ds_list_policy_templates" datasource, since that's the datasource we're transforming with \_.map in the "js_policy_templates_with_lessons" script.

Let's take a look at the "datasource_ds_list_policy_templates.json" to see if the problem is with the data coming in.

```json
[
  {
    "category": "Tutorial",
    "id": "60170dbd4582b9963de482bd",
    "name": "Hello World",
    "short_description": "Hello World"
  },
  {
    "category": "Tutorial",
    "id": "70dbd01b48294b58d963de26",
    "name": "List Policy Templates",
    "short_description": "Lists all policy templates uploaded to the Flexera organization."
  }
]
```

You should see something similar to the above. And this does not appear to be the source of the problem. The datasource contains the fields that are showing up as null in our incident.

From the above, we can infer that something is happening during the execution of the "js_policy_templates_with_lessons" script to cause these fields to not be populated. Let's add some code to output the contents of various variables during execution of this script and then run it with the fpt script command. Modify the script to match the below:

```javascript
  policy_table = {}

  _.each(policy_lesson_list, function(lesson) {
    policy_table[lesson['name']] = lesson['lesson']
  })

  console.log("policy_table:")
  console.log(policy_table)

  policy_templates_with_lessons = _.map(policy_lesson_list, function(template) {
    return {
      category: template['category'],
      id: template['id'],
      name: template['name'],
      short_description: template['short_description'],
      lesson: policy_table[template['name']]
    }
  })

  console.log("policy_templates_with_lessons:")
  console.log(policy_templates_with_lessons)

  policy_templates_with_lessons_filtered = _.filter(policy_templates_with_lessons, function(template) {
    return template['lesson']
  })

  console.log("policy_templates_with_lessons_filtered:")
  console.log(policy_templates_with_lessons_filtered)
```

The "console.log()" function will output information to the screen. In this case, we're outputting the contents of each variable as the script progresses to see if we can identify exactly where the problem is.

Now run the script with the following command:

```bash
fpt script list_policy_templates_broken.pt -n js_policy_templates_with_lessons policy_lesson_list=@datasource_ds_policy_lesson_list.json policy_templates=@datasource_ds_list_policy_templates.json
```

In the output, we should see the "console.log()" results:

```text
console.log: "policy_table:"
console.log: >
  {
    "Hello World": "Lesson 02",
    "List Policy Templates": "Lesson 06"
  }
console.log: "policy_templates_with_lessons:"
console.log: >
  [
    {
      "lesson": "Lesson 02",
      "name": "Hello World"
    },
    {
      "lesson": "Lesson 06",
      "name": "List Policy Templates"
    }
  ]
console.log: "policy_templates_with_lessons_filtered:"
console.log: >
  [
    {
      "lesson": "Lesson 02",
      "name": "Hello World"
    },
    {
      "lesson": "Lesson 06",
      "name": "List Policy Templates"
    }
  ]
```

The "policy_table" variable looks correct, but the "policy_templates_with_lessons" variable is missing the keys that are coming back as null. If we look at the code, we see that this should not be the case:

```javascript
  policy_templates_with_lessons = _.map(policy_lesson_list, function(template) {
    return {
      category: template['category'],
      id: template['id'],
      name: template['name'],
      short_description: template['short_description'],
      lesson: policy_table[template['name']]
    }
  })
```

The variable "template" represents each value of the list we're iterating through. The keys we're referencing for "template" in the return statement look to be the correct keys that *should* contain the data. This must mean the list we're iterating through is a list of items that lack these keys.

What is the list we're iterating through? It looks like "policy_lesson_list", *which is not the correct list*. We're supposed to be iterating through the list of policy templates we retrieved from Flexera's APIs. Let's fix this by changing the \_.map statement to the below:

```javascript
  policy_templates_with_lessons = _.map(policy_templates, function(template) {
```

Let's run the script again now that we've made this change:

```bash
fpt script list_policy_templates_broken.pt -n js_policy_templates_with_lessons policy_lesson_list=@datasource_ds_policy_lesson_list.json policy_templates=@datasource_ds_list_policy_templates.json
```

The output should now correctly show all of the fields being populated:

```text
console.log: "policy_table:"
console.log: >
  {
    "Hello World": "Lesson 02",
    "List Policy Templates": "Lesson 06"
  }
console.log: "policy_templates_with_lessons:"
console.log: >
  [
    {
      "category": "Tutorial",
      "id": "60170dbd4582b9963de482bd",
      "lesson": "Lesson 02",
      "name": "Hello World",
      "short_description": "Hello World"
    },
    {
      "category": "Tutorial",
      "id": "70dbd01b48294b58d963de26",
      "lesson": "Lesson 06",
      "name": "List Policy Templates",
      "short_description": "Lists all policy templates uploaded to the Flexera organization."
    }
  ]
console.log: "policy_templates_with_lessons_filtered:"
console.log: >
  [
    {
      "category": "Tutorial",
      "id": "60170dbd4582b9963de482bd",
      "lesson": "Lesson 02",
      "name": "Hello World",
      "short_description": "Hello World"
    },
    {
      "category": "Tutorial",
      "id": "70dbd01b48294b58d963de26",
      "lesson": "Lesson 06",
      "name": "List Policy Templates",
      "short_description": "Lists all policy templates uploaded to the Flexera organization."
    }
  ]
```

Let's remove out debugging code now to avoid having it clutter our policy template. Revert the script to this:

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

  policy_templates_with_lessons_filtered = _.filter(policy_templates_with_lessons, function(template) {
    return template['lesson']
  })
```

Finally, let's run the policy template and verify that the incident now looks correct:

```bash
fpt run list_policy_templates_broken.pt --credentials="auth_flexera=your_credential_identifier"
```

You should now see this in the output:

````text
Validation of **$ds\_policy\_templates\_with\_lessons** failed
2 items failed check:

```json
[
  {
    "category": "Tutorial",
    "id": "6601dbd2b9d482358e09bd74",
    "lesson": "Lesson 02",
    "name": "Hello World",
    "short_description": "Hello World"
  },
  {
    "category": "Tutorial",
    "id": "67c9c7b5df70036692533615",
    "lesson": "Lesson 06",
    "name": "List Policy Templates",
    "short_description": "Lists all policy templates uploaded to the Flexera organization."
  }
]
```
````

There are of course many more errors and problems that can occur, and in more complex policy templates, diagnosis may be more involved, but the basic process is always the same.

That's it for Lesson 10. Please move on to [Lesson 11](https://github.com/flexera-public/policy_engine_training/blob/main/11_request_scripts/README.md), where we will go over some common pitfalls of policy template development and how to debug a broken policy template.
