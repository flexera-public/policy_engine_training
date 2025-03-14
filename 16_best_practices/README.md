# Flexera Policy Development - Lesson 14 - Best Practices

In this lesson, we'll go over some best practices when it comes to formatting your policy templates. Following formatting guidelines will make your templates readable to others and easier to update. We will modify the "list_policy_templates.pt" policy template to bring it up to standard.

## Step 1: Update the Version

It's considered best practice to use [semantic versioning](https://semver.org/) when versioning your policy templates. Let's update the policy template to version `0.5.1` by updating the info block like so:

```ruby
info(
  version: "0.5.1"
)
```

We're changing the patch version instead of the minor version because our changes won't actually impact how the policy template functions.

## Step 2: Policy Block Order & Comments

You should always keep policy blocks of the same type, such as `credentials` blocks, `parameter` blocks, etc. in a group next to each other. The only exception are `datasource` and `script` blocks, where it is recommended that the `script` block immediately follow the `datasource` block calling the script.

Additionally, we recommend ordering these groups within a policy template to follow a logical flow like the below. This ensures that, when reading the policy template from top to bottom, you can follow what the policy template will do upon execution.

* Metadata
* Parameters
* Credentials
* Pagination
* Datasources & Scripts
* Policy
* Escalations
* Cloud Workflow

Review the "list_policy_templates.pt" policy template and you'll see it already follows this order.

Each section after the policy metadata should have a comments indicating the beginning of the section. Let's modify the policy template accordingly. Before your parameter blocks, add the following comments:

```ruby
###############################################################################
# Parameters
###############################################################################
```

The result should look something like this:

```ruby
info(
  version: "0.5.1"
)

###############################################################################
# Parameters
###############################################################################

parameter "param_email" do
  type "list"
  label "Email Addresses"
```

Now add equivalent comments to the appropriate sections throughout the policy template. You can copy and paste from the below:

```ruby
###############################################################################
# Authentication
###############################################################################
```

```ruby
###############################################################################
# Datasources & Scripts
###############################################################################
```

```ruby
###############################################################################
# Policy
###############################################################################
```

```ruby
###############################################################################
# Escalations
###############################################################################
```

## Step 3: Naming Script Parameters & Result Variables

It is recommended that, in most cases, the parameters in your `script` block match the names of those parameters in the `run_script` field of the `datasource` block calling the `script` block. The exception of course is when parameters in the `run_script` field don't have clean names, such as manual values/strings or calls to built-in policy language functions.

It is also recommended that the `result` field of the `script` block be set to either "result" or "request" depending on whether the script is being called within a `request` block.

Let's update the policy to reflect the above. Modify the "js_policy_lesson_list" `script` block so that we're storing our list in the "result" variable instead of the "list" variable:

```ruby
script "js_policy_lesson_list", type: "javascript" do
  result "result"
  code <<-'EOS'
  result = [
```

For the "js_policy_lesson_list" `script` block, modify the parameters to match the `run_script` field in the "ds_list_policy_templates" `datasource` block. Since "GET" is a hardcoded value that could hypothetically be something else, leave that one named "verb". Don't forget to update references to these variables in the script itself as well.

Since this `script` block is called within a `request` block, and the `result` field is already set to "request", we do not need to change it.

```ruby
script "js_list_policy_templates", type: "javascript" do
  parameters "verb", "rs_governance_host", "rs_project_id"
  result "request"
  code <<-'EOS'
  request = {
    auth: "auth_flexera",
    verb: verb,
    host: rs_governance_host,
    path: "/api/governance/projects/" + rs_project_id + "/policy_templates",
    headers: {
      "API-Version": "1.0"
    }
  }
EOS
end
```

Finally, let's modify the "js_policy_templates_with_lessons" `script` block to match these guidelines as well. Change the names in the `parameters` field and the variable in the `result` field, and make sure the script itself is modified to match the new values.

```ruby
script "js_policy_templates_with_lessons", type: "javascript" do
  parameters "ds_policy_lesson_list", "ds_list_policy_templates", "param_limit"
  result "result"
  code <<-'EOS'
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
EOS
end
```

## Step 4: Testing

Let's verify that none of our changes broke the policy template. Do an fpt check to make sure there are no syntax errors or other code problems:

```bash
fpt check list_policy_templates.pt
```

Once we've verified there are no syntax errors, let's run the policy template. Once the policy template finishes execution, scroll through the output and make sure everything looks normal.

```bash
fpt run list_policy_templates.pt --credentials="auth_flexera=your_credential_identifier"
```

## Block Naming Conventions

The policy template we've been developing already followed some recommended conventions that we will review here. In particular, we recommend beginning the names of your various blocks with a prefix indicating the type of block it is followed by `_`. We recommend using the following prefixes for the names of each kind of block:

* **parameter block:** param_
* **credentials block:** auth_
* **pagination block:** pagination_
* **datasource block:** ds_
* **script block:** js_
* **policy block:** pol_
* **escalation block:** esc_

## Label & Description Fields

Many blocks allow you to use a `label` field and a `description` field. It is recommended that you always include both of these fields.

The `label` field should always be short (less than 30 characters when possible), capitalized, and act as the name for the block. This is how the user will see the block labelled in the UI.

The `description` field should be a longer description written in 1 to 3 complete sentences. The UI will show this to the user in smaller text to explain what the block does.

See the example below from the [Flexera Policy Templates GitHub Repository](https://github.com/flexera-public/policy_templates) and note the difference between the two fields:

```ruby
parameter "param_regions_list" do
  type "list"
  category "Filters"
  label "Allow/Deny Regions List"
  description "A list of allowed or denied regions. Both region IDs, such as 'us-east-1', and names, such as 'US East (N. Virginia)', are accepted. Leave blank to check all regions."
  default []
end
```

