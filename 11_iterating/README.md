# Flexera Policy Development - Lesson 11 - Iterating

Very often, you will need to iterate through a list of items and make an API request for each one. For example, if you wanted a list of every virtual machine in a Microsoft Azure tenant, you would first need to make a request to get a list of Azure subscriptions, and then make a request for each subscription to get a list of virtual machines for each one.

In this lesson, we'll modify the "list_policy_templates.pt" policy template to iterate through our list of policy templates to obtain the date and time the policy template was added to the Flexera organization.

## Step 1: Update the Version

As usual, let's update the policy template to version `0.4.0` by updating the info block like so:

```ruby
info(
  version: "0.4.0"
)
```

## Step 2: Add the new Datasource

Add the following datasource near the end of the policy template, right before the `policy` block, as this will be the datasource we'll configure the `policy` block to validate. Don't worry about filling out the `request` and `result` blocks just yet; we'll be adding to them in the next steps.

```ruby
datasource "ds_policy_templates_with_created_at" do
  iterate $ds_policy_templates_with_lessons
  request do
  end
  result do
  end
end
```

Notice the new `iterate` field. This field tells the datasource to iterate through another datasource and make an API request for each item in that datasource.

Notice how we're iterating through the smaller list of policy templates that have already been filtered to just the ones with lessons associated; this is because we don't actually *need* information about the other policy templates, since they won't be included in the incident. It's always good to develop your policy templates with efficiency in mind, avoiding unnecessary API calls when necessary.

## Step 3: Add the Request Block

Next, we're going to fill out our request block. Modify the request block in the new datasource to look like the below:

```ruby
  request do
    auth $auth_flexera
    verb "GET"
    host rs_governance_host
    path join(["/api/governance/projects/", rs_project_id, "/policy_templates/", val(iter_item, "id")])
    query "view", "extended"
    header "Api-Version", "1.0"
  end
```

Notice the `iter_item` reserved word. When a datasource is iterating through a list, each item in the list is referred to as `iter_item`. In this case, we're making sure to put the value of the `id` field for each item in the list at the end of the path we're requesting so that we're requesting information for each policy template in the list.

Also notice the new `query` field. This field allows us to specify query parameters for API requests. In this case, setting the view parameter to "extended" will give us additional information about the policy template. Note that, when using a `script` block for the API request, this field must be "query_params" instead of "query".

More information about this specific API call is in [our documentation](https://reference.rightscale.com/governance-policies/#/PolicyTemplate/PolicyTemplate_show) if you're curious.

## Step 4: Add the Result Block

Next, modify the result block in the new datasource to look like the below so we can properly store the results:

```ruby
  result do
    encoding "json"
    field "category", val(iter_item, "category")
    field "id", val(iter_item, "id")
    field "name", val(iter_item, "name")
    field "short_description", val(iter_item, "short_description")
    field "created_at", jmes_path(response, "created_at")
  end
```

You'll notice that we're not using a `collect` statement. This is because each individual API request is only requesting information for a *single* policy template. This means the API response is not going to contain a list. When all of the requests are finished, the results of each individual request will be compiled into a list automatically and then stored in the datasource.

This is also why the `field` statement for "created_at" uses the `response` reserved word instead of `col_item`. `col_item` is only valid within a collect statement, and in this case, we're pulling the value directly from the API response.

Note also that the rest of the `field` statements are pulling values from `iter_item`. This means they will contain information stored in the datasource we're iterating through rather than information from the API call being made. Only the "created_at" field contains information from the API call.

Your completed datasource should look like this:

```ruby
datasource "ds_policy_templates_with_created_at" do
  iterate $ds_policy_templates_with_lessons
  request do
    auth $auth_flexera
    verb "GET"
    host rs_governance_host
    path join(["/api/governance/projects/", rs_project_id, "/policy_templates/", val(iter_item, "id")])
    query "view", "extended"
    header "Api-Version", "1.0"
  end
  result do
    encoding "json"
    field "category", val(iter_item, "category")
    field "id", val(iter_item, "id")
    field "name", val(iter_item, "name")
    field "short_description", val(iter_item, "short_description")
    field "created_at", jmes_path(response, "created_at")
  end
end
```

## Step 5: Modify the Policy Block

We now need to configure our `policy` block to validate the new datasource. Modify the `validate_each` block to match the below:

```ruby
  validate_each $ds_policy_templates_with_created_at do
```

Additionally, we need to add a new `field` field to our `export` block to show the new "created_at" field. Add the following `field` field to the end of the list:

```ruby
      field "created_at" do
        label "Created At"
      end
```

Your modified `policy` block should look like this:

```ruby
policy "pol_list_policy_templates" do
  validate_each $ds_policy_templates_with_created_at do
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
      field "created_at" do
        label "Created At"
      end
    end
  end
end
```

## Step 6: Testing

Let's test it! First, as usual, do an fpt check to make sure there are no syntax errors or other code problems:

```bash
fpt check list_policy_templates.pt
```

Once we've verified there are no syntax errors, let's run the policy template:

```bash
fpt run list_policy_templates.pt --credentials="auth_flexera=your_credential_identifier"
```

If you scroll up through the output, you should see the following line, and after that, you should see the two individual API requests made as part of the iteration:

```text
### Datasource **ds\_policy\_templates\_with\_created\_at**
```
