# Flexera Policy Development - Lesson 19 - Go Template Syntax

The `summary_template` and `detail_template` fields within a `validate` or `validate_each` block support [Go Template Syntax](https://pkg.go.dev/text/template). This allows variables to be interpolated and tables to be created within the incident. You've already seen some of this before with "{{ len data }}"; in this lesson, we'll add some additional Go template syntax to the "list_policy_templates.pt" policy template.

## Step 1: Update the Version

As usual, let's update the policy template to version `0.6.0` by updating the `info` block like so:

```ruby
info(
  version: "0.6.0"
)
```

## Step 2: Applied Policy Datasource

At the beginning of the "Datasources & Scripts" section of the policy template, add the following new datasource:

```ruby
###############################################################################
# Datasources & Scripts
###############################################################################

datasource "ds_applied_policy" do
  request do
    auth $auth_flexera
    host rs_governance_host
    path join(["/api/governance/projects/", rs_project_id, "/applied_policies/", policy_id])
    header "Api-Version", "1.0"
  end
end
```

This new datasource will gather all of the metadata for the policy template as it executes. The "policy_id" reserved word will contain the id of the applied policy itself.

Note the lack of a `result` block. When there is no `result` block, the policy engine will simply assume the response is in JSON and store the unmodified JSON as the datasource.
