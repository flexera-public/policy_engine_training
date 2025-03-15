# Flexera Policy Development - Lesson 14 - Miscellaneous

In this lesson, we're going to cover a collection of things that are not large enough, in and of themselves, to warrant an entire lesson. We will continue to modify the "list_policy_templates.pt" policy template to add various bits of new functionality.

## Step 1: Update the Version

As usual, let's update the policy template to version `0.5.0` by updating the `info` block like so:

```ruby
info(
  version: "0.5.0"
)
```

## Step 2: Add Parameter Category

First, we're going to add a `category` field to our email parameter. Modify the parameter to match the below:

```ruby
parameter "param_email" do
  type "list"
  label "Email Addresses"
  category "Policy Settings"
  description "A list of email addresses to notify."
  default []
end
```

Currently, the `category` field does not have any effect, but it is likely that a future UI update in Flexera One will label and sort parameters by their category in the UI for ease of use. For this reason, it is recommended that you include this field and use it to group your parameters together by function.

You can categorize your parameters however you like, but it is recommended that you use a consistent set of category values across your policy templates to make things easier for your users. If you're not sure what values to use, the [Flexera Policy Templates GitHub Repository](https://github.com/flexera-public/policy_templates) provides many examples that may help.

## Step 3: Add allowed_pattern to Parameter

The policy engine lets your restrict user input with a regex pattern. This is useful when you want to ensure that the user only enters values for a parameter that make sense for that parameter's specific purpose.

Email addresses are a perfect example of such a use case. We don't want someone to enter "steve" or "email%address.com" because these are not valid email addresses.

Modify the parameter again to add the `allowed_pattern` field:

```ruby
parameter "param_email" do
  type "list"
  label "Email Addresses"
  category "Policy Settings"
  description "A list of email addresses to notify."
  allowed_pattern /^([\w\.\-]+)@([\w\-]+)((\.(\w){2,24})+)$/
  default []
end
```

Regex itself is outside of the scope of these lessons, but the regex above should only match valid email addresses. Your regex pattern should always be contained within two `/` characters.

Similar to `allowed_pattern`, there is also `allowed_values`, which lets you specify a set of hard values. Consider the following example from our policy catalog (**but do not add it to the "list_policy_templates.pt" policy template**):

```ruby
parameter "param_azure_endpoint" do
  type "string"
  category "Policy Settings"
  label "Azure Endpoint"
  description "Select the API endpoint to use for Azure. Use default value of management.azure.com unless using Azure China."
  allowed_values "management.azure.com", "management.chinacloudapi.cn"
  default "management.azure.com"
end
```

This is a string parameter and the `allowed_values` field has two values. When the user applies this policy template in the Flexera One UI, they will see a dropdown menu with only these two strings as options. If this were a list parameter, the values would appear as options they can add to a list. In both cases, they will not be able to type a custom value.

Note that, for both `allowed_values` and `allowed_pattern`, if you specify a default value, it must be valid. For `allowed_values`, that means it must be one of the listed values, and for `allowed_pattern`, it must match the regex pattern.

## Step 4: Add Limit Parameter

We're going to give the user to option to limit the number of policy templates returned in the results. Add the following `parameter` block beneath your email parameter:

```ruby
parameter "param_limit" do
  type "number"
  label "Result Limit"
  category "Policy Settings"
  description "Limit the number of results to return."
  min_value 1
  default 100
end
```

Note that the `type` field is set to number; this limits the user to entering a numerical value. The `min_value` field allows us to specify a minimum value to prevent the user from entering values that don't make sense. In this case, we're limiting them to a minimum value of 1 to prevent them from entering 0 or a negative number.

There is also a `max_value` field you can use to specify a maximum value, and both fields can be employed to constrain the user to a range of values. Note that, just like with `allowed_values` and `allowed_pattern`, if you include a `default` field, its value must meet the criteria of your `min_value` and/or `max_value` fields.

## Step 5: Use Limit Parameter

Of course, this new parameter won't actually do anything unless we use it. Modify both the `run_script` field for the "ds_policy_templates_with_lessons" datasource and the `parameters` field for the "js_policy_templates_with_lessons" `script` block to use the new parameter. See below:

```ruby
datasource "ds_policy_templates_with_lessons" do
  run_script $js_policy_templates_with_lessons, $ds_policy_lesson_list, $ds_list_policy_templates, $param_limit
end

script "js_policy_templates_with_lessons", type: "javascript" do
  parameters "policy_lesson_list", "policy_templates", "param_limit"
```

Then add the following to the end of the script. This will automatically limit the number of values in the list that we're returning.

```javascript
policy_templates_with_lessons_filtered = policy_templates_with_lessons_filtered.slice(0, limit)
```

Your completed datasource and script should look like the following:

```ruby
datasource "ds_policy_templates_with_lessons" do
  run_script $js_policy_templates_with_lessons, $ds_policy_lesson_list, $ds_list_policy_templates, $param_limit
end

script "js_policy_templates_with_lessons", type: "javascript" do
  parameters "policy_lesson_list", "policy_templates", "limit"
  result "policy_templates_with_lessons_filtered"
  code <<-'EOS'
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

  policy_templates_with_lessons_filtered = policy_templates_with_lessons_filtered.slice(0, limit)
EOS
end
```

## Step 6: Add Hash Excludes

When producing incidents, an incident is considered "new" if some information in the incident has changed. For example, if you have a policy template running daily, and on Wednesday the incident contains the same data as on Tuesday, this is not considered a new incident and will not be reported as such in the UI.

The `hash_exclude` field allows you to specify fields in the `export` block for the platform to ignore when determining if the incident is new or not. This is useful for information that you expect to change from execution to execution but does not indicate that the incident is reporting new information, such as the age of a resource, resource metrics, etc.

There is also a `hash_include` field that can be used instead of `hash_exclude`. As you might expect, *only* the fields specified in the `hash_include` field will be considered when determining if the incident is new.

Let's add a `hash_exclude` field in our `validate_each` block for the "id" data field in our policy template. That way, if someone were to delete and reupload one of our training policies, granting it a new id, it won't be considered a new policy template:

```ruby
    escalate $esc_email
    hash_exclude "id"
    export do
```

## Step 7: Add Resource Level to Export

When writing policy templates that report individual resources, it is recommended that you add the `resource_level` field and set it to "true". This will allow the user to perform actions against individual resources in the UI if your policy template has actions. When setting `resource_level` to true, your `export` block must contain an "id" field.

Since policy templates can be considered resources, let's add this statement to our policy like so:

```ruby
    export do
      resource_level true
      field "id" do
```

Your fully modified `policy` block should look like this:

```ruby
policy "pol_list_policy_templates" do
  validate_each $ds_policy_templates_with_created_at do
    summary_template "{{ len data }} Policy Templates With Lessons Found"
    check eq(val(item, "name"), "")
    escalate $esc_email
    hash_exclude "id"
    export do
      resource_level true
      field "id" do
        label "ID"
      end
      field "name" do
        label "Name"
      end
      field "category" do
        label "Category"
      end
      field "short_description" do
        label "Description"
      end
      field "lesson" do
        label "Lesson"
      end
      field "created_at" do
        label "Created At"
      end
    end
  end
end
```

## Step 8: Testing

Let's try out our changes. Do an fpt check to make sure there are no syntax errors or other code problems:

```bash
fpt check list_policy_templates.pt
```

Once we've verified there are no syntax errors, let's run the policy template. Let's set our new limit parameter to 1 to verify that the incident only contains one result when we do that:

```bash
fpt run list_policy_templates.pt param_limit=1 --credentials="auth_flexera=your_credential_identifier"
```

If you scroll up through the output, you should see that only one item was returned:

````
1 items failed check:

```json
[
  {
    "category": "Tutorial",
    "created_at": "2024-03-25T20:17:19Z",
    "id": "60170dbd4582b9963de482bd",
    "name": "Hello World",
    "short_description": "Hello World"
  }
]
```
````

Please proceed to [Lesson 15](https://github.com/flexera-public/policy_engine_training/blob/main/15_cwf/README.md), where we will learn about Cloud Workflow and how to use it for policy actions.
