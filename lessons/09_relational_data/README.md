# Flexera Policy Development - Lesson 09 - Relational Data

One of the powerful things about the policy engine is its ability to combine and transform data from multiple sources into a single report. In this lesson, we will build upon the "list_policy_templates.pt" policy template to make it report policy templates along side which lesson in this training they correspond to.

## Step 1: Update the Version

We recommended that you use versioning to track changes in policy templates you develop. Let's update the policy template to version `0.2.0` by updating the `info` block like so:

```ruby
info(
  version: "0.2.0"
)
```

## Step 2: Lesson Data

Next, let's add a datasource that grabs a list of policy names and which lessons they correspond to. While we're pulling this data from a JSON file stored in this GitHub repository, in the real world you will usually be pulling this kind of data from an actual REST API.

Place the following datasource after your parameters and before the "ds_list_policy_templates" datasource:

```ruby
datasource "ds_policy_lesson_list" do
  request do
    host "raw.githubusercontent.com"
    path "/flexera-public/policy_engine_training/refs/heads/main/.data/lesson_list.json"
  end
  result do
    encoding "json"
    collect jmes_path(response, "[*]") do
      field "name", jmes_path(col_item, "name")
      field "lesson", jmes_path(col_item, "lesson")
    end
  end
end
```

## Step 3: Combined Datasource

We now have a list of policy templates and which lessons they correspond to, and a list of all of the policy templates in the organization. The next step is to relate the data in these two datasources to produce the final data that will show up in the incident.

Underneath the "ds_list_policy_templates" datasource, add the following new datasource and script:

```ruby
datasource "ds_policy_templates_with_lessons" do
  run_script $js_policy_templates_with_lessons, $ds_policy_lesson_list, $ds_list_policy_templates
end

script "js_policy_templates_with_lessons", type: "javascript" do
  parameters "policy_lesson_list", "policy_templates"
  result "policy_templates_with_lessons_filtered"
  code <<-'EOS'
EOS
end
```

We now need to begin writing our script. We know that the "name" field in the policy lesson list corresponds to the "name" field in the list of policy templates we retrieved from the Flexera REST API.

First, let's create a table whose keys are the policy template names, and whose values are the lessons they belong to. Add the following code to the start of the `script` block:

```javascript
  policy_table = {}

  _.each(policy_lesson_list, function(lesson) {
    policy_table[lesson['name']] = lesson['lesson']
  })
```

We are using the _.each function to iterate through the list and produce the described table. The resulting `policy_table` object will contain the following data:

```json
{
  "Hello World": "Lesson 02",
  "List Policy Templates": "Lesson 06"
}
```

Next, we're going to take the list of policy templates we obtained from the API and add the lesson each policy template corresponds to. Add the following code to your script:

```javascript
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

We're making use of the _.map function to create a new list. The objects in the new list are identical to the old list but with the addition of the new "lesson" key. We're using the "policy_table" object we created earlier to get the lesson using each template's name.

Note that the "policy_templates_with_lessons" list will likely contain policy templates that do not correspond to these lessons. In those cases, the value of "policy_table[template['name']]" will be *undefined*. Let's filter those out by adding the following code next:

```javascript
  policy_templates_with_lessons_filtered = _.filter(policy_templates_with_lessons, function(template) {
    return template['lesson']
  })
```

When using \_.filter, \_.find, etc. and returning a non-boolean value, the value is considered true if it is not falsy e.g. if it's not null, undefined, 0, etc. As a result, the above code should filter down to just those policy templates that had a corresponding lesson in the "ds_policy_lesson_list" datasource.

Your completed script should look like this:

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

## Step 4: Policy Block

We now need to modify our `policy` block to look at the correct datasource. Modify the beginning of the `policy` block to look like the below:

```ruby
policy "pol_list_policy_templates" do
  validate_each $ds_policy_templates_with_lessons do
    summary_template "{{ len data }} Policy Templates With Lessons Found"
```

Note that there are two changes. First, we're now validating the "ds_policy_templates_with_lessons" datasource. Second, we've updated the `summary_template` to read "Policy Templates With Lessons Found".

We still need to include the lesson in the incident though. Add the following `field` block to the end of your `export` block:

```ruby
      field "lesson" do
        label "Lesson"
      end
```

Your completed `policy` block should look like this:

```ruby
policy "pol_list_policy_templates" do
  validate_each $ds_policy_templates_with_lessons do
    summary_template "{{ len data }} Policy Templates With Lessons Found"
    check eq(val(item, "name"), "")
    escalate $esc_email
    export do
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
    end
  end
end
```

## Step 5: Testing

Let's test it! First, as usual, do an fpt check to make sure there are no syntax errors or other code problems:

```bash
fpt check list_policy_templates.pt
```

Before we run the policy template, let's make use of some of the additional fpt functionality discussed in Lesson 05. Let's retrieve the "ds_policy_lesson_list" and "ds_list_policy_templates" datasources using retrieve_data. Be sure to replace "your_credential_identifier" in the below command with the ID of the credential you created during the setup process, both in this lesson and in future lessons.

```bash
fpt retrieve_data list_policy_templates.pt --credentials="auth_flexera=your_credential_identifier" -n ds_policy_lesson_list

fpt retrieve_data list_policy_templates.pt --credentials="auth_flexera=your_credential_identifier" -n ds_list_policy_templates
```

You should now have local files named "datasource_ds_policy_lesson_list.json" and "datasource_ds_list_policy_templates.json" that contain the data for those datasources. Let's now make use of those files to run a script within the policy template. Note the use of `@` to indicate that we're sending in the contents of a local file as the value for the script parameter.

```bash
fpt script list_policy_templates.pt -n js_policy_templates_with_lessons policy_lesson_list=@datasource_ds_policy_lesson_list.json policy_templates=@datasource_ds_list_policy_templates.json
```

You should now have a local "out.json" file containing the output of the script.

Finally, let's run the policy template to make sure it works as expected:

```bash
fpt run list_policy_templates.pt --credentials="auth_flexera=your_credential_identifier"
```

You should see the policy template execution complete successfully. Assuming you haven't deleted either of the tutorial policy templates from your organization, you should see a total of two items failing the check statement:

```text
### Evaluation completed without errors
* Total validations: 1
* Total checks: 1
* Total data items: 2
* Total items failing checks: 2

Policy evaluation successful
1 validations failed and created incidents:
Incident /api/governance/projects/12345/incidents/67cf02faf2c90093549c5d24
Link: https://app.flexera.com/orgs/43210/policy/projects/12345/incidents/67cf02faf2c90093549c5d24
Severity: low
Category: Tutorial
Items: 2
Summary: 2 Policy Templates With Lessons Found
```

In [Lesson 10](https://github.com/flexera-public/policy_engine_training/blob/main/lessons/10_debugging/README.md), we will go over some common pitfalls of policy template development and how to debug a broken policy template.
