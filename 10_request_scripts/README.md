# Flexera Policy Development - Lesson 10 - Request Scripts

While most REST API requests made in the policy engine are made by specifying various fields in a `request` block within the datasource, it is also possible to call a `script` block within a `request` block instead. This can be useful for a handful of scenarios:

* Sometimes you might need to do some logic for the API call that will determine headers, query parameters, or the path of the API call. A common use case here is when you need to send in a date range; if your `request` block calls a script, a script can calculate the date values to send in.

* The verb field in a `request` block will only take a string; it cannot reference a parameter or datasource, which means it can't be dynamically determined during execution. You *can* do this in a `script` block though. This can be relevant in situations where, for example, you might need to do either a POST or a PATCH request depending on whether you are creating a new item or modifying an existing one.

Let's modify the "list_policy_templates.pt" policy template to use a `script` block for an API request.

## Step 1: Update the Version

As usual, let's update the policy template to version `0.3.0` by updating the info block like so:

```ruby
info(
  version: "0.3.0"
)
```

## Step 2: Update the Datasource

The first thing we need to do is update the `request` block on the datasource to call a script. Modify the `request` block for the `ds_list_policy_templates` datasource on line 42 to the following, replacing all of the fields with a single `run_script` field:

```ruby
  request do
    run_script $js_list_policy_templates, "GET", rs_governance_host, rs_project_id
  end
```

Notice how, in this instance, the `run_script` field is *inside* of a request block. This will execute the script and then the result of the script will be used by the datasource to call a REST API. The parameters we are passing are all information that we will need to create the API request. Note that, in this instance, we're passing the raw string "GET" as a parameter; parameters for a `run_script` statement can include string or numerical values in addition to variables.

**NOTE: The REST API call is not made during execution of the `script` block. JavaScript executed within the `script` block is entirely self-contained and has no access to the internet. The result of the `script` block contains the information about the REST API call and is passed to the policy engine, which then makes the API call the same as it would with the method previously used.**

## Step 3: Create a Script Block

Directly underneath the modified datasource, add the following `script` block:

```ruby
script "js_list_policy_templates", type: "javascript" do
  parameters "verb", "governance_host", "project_id"
  result "request"
  code <<-'EOS'
  request = {
    auth: "auth_flexera",
    verb: verb,
    host: governance_host,
    path: "/api/governance/projects/" + project_id + "/policy_templates",
    headers: {
      "API-Version": "1.0"
    }
  }
EOS
end
```

When this script finishes execution, the result will be an object with fields that correspond to the various parts of an API call. Note that the `auth` field is in quotes and without the `$` symbol; only within a `script` block is this the correct formatting to reference a `credentials` block. Any other values needed for the API call, such as parameters, datasources, and reserved words, should be passed as parameters to the `script` block and referenced accordingly.

## Step 4: Testing

Let's test it! First, as usual, do an fpt check to make sure there are no syntax errors or other code problems:

```bash
fpt check list_policy_templates.pt
```

Once we've verified there are no syntax errors, let's run the policy template:

```bash
fpt run list_policy_templates.pt --credentials="auth_flexera=your_credential_identifier"
```

The policy template should complete execution just as it did before we changed it. This means the `script` block is working as expected.

That's it for Lesson 10. Please move on to [Lesson 11](https://github.com/flexera-public/policy_engine_training/blob/main/11_iterating/README.md), where we will learn how to iterate through a datasource to make several API calls.
