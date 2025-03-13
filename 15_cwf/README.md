# Flexera Policy Development - Lesson 15 - Cloud Workflow

So far, we've only used `escalation` blocks to send emails, but they can do more than just that. Sometimes a user doesn't simply want a report of problems that they need to fix; they want to be able to quickly and easily action on them. `escalation` blocks, combined with Flexera's [Cloud Workflow Language](https://docs.flexera.com/flexera/EN/Automation/CWL.htm), can be used to allow the user to take direct action from the Flexera One user interface or even automatically upon policy execution to do things like resize or delete cloud resources.

The Cloud Workflow Language was originally developed for Flexera's CMP product but was extended to enable policy templates to take actions on cloud resources. This lesson will not be a deep dive into the Cloud Workflow Language itself so much as a demonstration of how it is used in policy templates. Because actions are potentially destructive, we won't build and run a policy template in this lesson, but instead we'll use an example from the [Policy Catalog](https://github.com/flexera-public/policy_templates) to explain how it works.

## Parameter Block

While not strictly required, in most cases, you're going to want a parameter that let's the user choose whether or not to automatically apply an action. Take a look at this example from the [Azure Old Snapshots](https://github.com/flexera-public/policy_templates/blob/master/cost/azure/old_snapshots/azure_delete_old_snapshots.pt) policy template:

```ruby
parameter "param_automatic_action" do
  type "list"
  category "Actions"
  label "Automatic Actions"
  description "When this value is set, this policy will automatically take the selected action."
  allowed_values [ "Delete Snapshots" ]
  default []
end
```

This parameter allows the user to automatically delete snapshots reported in the incident. The parameter can then be referenced in an `escalation` block to determine if it automatically executes or not. Because this is a list parameter, additional options could easily be added to allow the user to take combinations of actions.

## Policy Block

Just like an email escalation, the escalation to delete snapshots has to be included in the `policy` block. In the [Azure Old Snapshots](https://github.com/flexera-public/policy_templates/blob/master/cost/azure/old_snapshots/azure_delete_old_snapshots.pt) policy template, we find this:

```ruby
    escalate $esc_email
    escalate $esc_delete_snapshot
```

Note how there are multiple `escalate` fields. This is allowed and enables performing multiple actions.

## Escalation Block

In the same policy template, we can find the following `escalation` block:

```ruby
escalation "esc_delete_snapshot" do
  automatic contains($param_automatic_action, "Delete Snapshots")
  label "Delete Snapshots"
  description "Approval to delete all selected snapshots"
  run "delete_snapshots", data, $param_azure_endpoint
end
```

Notice that the `automatic` field, rather than being set directly to "true" like it was for our "list_policy_templates.pt" policy template, it uses the `contains()` function. The statement `contains($param_automatic_action, "Delete Snapshots")` will only return "true" if the user selected "Delete Snapshots" for the parameter. Otherwise, it will return false and the escalation will not be automatic.

We also have a new field, `run`, which specifies a Cloud Workflow block to run along with some parameters. The first parameter, `data`, will contain the full set of data from the policy incident, or if the user is selecting resources in the UI, it will contain data for the specific resources they selected. The second parameter just contains a parameter that will be used to determine which API endpoint to use when making requests to Azure.

## Cloud Workflow Block

Further down in the policy template, you will find the "delete_snapshots" block being called by this `escalation` block:

```ruby
define delete_snapshots($data, $param_azure_endpoint) return $all_responses do
  $$all_responses = []

  foreach $instance in $data do
    sub on_error: handle_error() do
      call delete_snapshot($instance, $param_azure_endpoint) retrieve $delete_response
    end
  end

  if inspect($$errors) != "null"
    raise join($$errors, "\n")
  end
end
```

The `define` reserved word is used to create a Cloud Workflow block. It is followed by the name of the block, and then the parameters for the block encapsulated in parentheses. The `return` reserved word is then followed by the name of the variable whose value to return when the block executions; this is very similar to the `result` field in a script block, and is mostly relevant when a Cloud Workflow block calls another Cloud Workflow block.

We won't go into the details of Cloud Workflow language here, but at a surface level, you can likely see that we're iterating through $data and calling another Cloud Workflow block named "delete_snapshot" for each item in the list. We're then raising an error in the UI if any errors occurred.

Let's take a look at the "delete_snapshot" block being called above:

```ruby
define delete_snapshot($instance, $param_azure_endpoint) return $response do
  $host = $param_azure_endpoint
  $href = $instance["id"]
  $params = "?api-version=2019-07-01"
  $url = $host + $href + $params
  task_label("DELETE " + $url)

  $response = http_request(
    auth: $$auth_azure,
    https: true,
    verb: "delete",
    host: $host,
    href: $href,
    query_strings: { "api-version": "2019-07-01" }
  )

  task_label("Delete Azure snapshot response: " + $instance["id"] + " " + to_json($response))
  $$all_responses << to_json({"req": "DELETE " + $url, "resp": $response})

  if $response["code"] != 204 && $response["code"] != 202 && $response["code"] != 200
    raise "Unexpected response deleting Azure snapshot: "+ $instance["id"] + " " + to_json($response)
  else
    task_label("Delete Azure snapshot successful: " + $instance["id"])
  end
end
```

This Cloud Workflow block takes a single snapshot and then issues a delete request to the Azure API, deleting that snapshot. As the "delete_snapshots" Cloud Workflow block called by the `escalation` block iterates through the list of snapshots, they will be deleted one by one.

**THIS IS A WORK IN PROGRESS. MORE LESSONS COMING SOON**
