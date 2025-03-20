# Flexera Policy Development - Lesson 19 - Cloud Workflow

So far, we've only used `escalation` blocks to send emails, but they can do more than just that. Sometimes a user doesn't simply want a report of problems that they need to fix; they want to be able to quickly and easily action on them. `escalation` blocks, combined with Flexera's [Cloud Workflow Language](https://docs.flexera.com/flexera/EN/Automation/CWL.htm), can be used to allow the user to take direct action from the Flexera One user interface or even automatically upon policy execution to do things like resize or delete cloud resources.

The Cloud Workflow Language was originally developed for Flexera's Cloud Management Platform product but was extended to enable policy templates to take actions on cloud resources. This lesson will not be a deep dive into the Cloud Workflow Language itself so much as a demonstration of how it is used in policy templates and an overview of some of its basic syntax. Because actions are potentially destructive, we won't build and run a policy template in this lesson, but instead we'll use an example from the [Policy Catalog](https://github.com/flexera-public/policy_templates) to explain how it works.

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

Notice that the `automatic` field uses the "contains" function instead of being set directly to "true" like it was for our "list_policy_templates.pt" policy template. The statement "contains($param_automatic_action, "Delete Snapshots")" will only return "true" if the user selected "Delete Snapshots" for the parameter. Otherwise, it will return false and the escalation will not be automatic.

We also have a new field, `run`, which specifies a Cloud Workflow block to run along with some parameters. The first parameter, "data", will contain the full set of data from the policy incident, or if the user is selecting resources in the UI, it will contain data for the specific resources they selected. The second parameter just contains a parameter that will be used to determine which API endpoint to use when making requests to Azure.

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

The "define" reserved word is used to create a Cloud Workflow block. It is followed by the name of the block, and then the parameters for the block encapsulated in parentheses. The "return" reserved word is then followed by the name of the variable whose value to return when the block executions; this is very similar to the `result` field in a `script` block, and is mostly relevant when a Cloud Workflow block calls another Cloud Workflow block.

In this block, we're iterating through "$data" and calling another Cloud Workflow block named "delete_snapshot" for each item in the list. We're then raising an error in the UI if any errors occurred.

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

This Cloud Workflow block takes a single snapshot instance as a parameter and then issues a delete request to the Azure API, deleting that snapshot. As the "delete_snapshots" Cloud Workflow block called by the `escalation` block iterates through the list of snapshots, they will be deleted one by one.

## Cloud Workflow Syntax

The [Cloud Workflow Language Documentation](https://docs.flexera.com/flexera/EN/Automation/CWL.htm) should be reviewed for a full deep dive into the language, but we will go over some basic syntax here so that you can get started with Cloud Workflow in your own policy templates. If you already know another high level programming language, most of this should feel familiar.

### Comments

Comments can be made using `#`. Comments can be placed at the end of instructions as well as on their own lines.

```ruby
# Set number to 1
$number = 1 # We just set the number
```

### Variables

All variables begin with a `$` character. A single `$` means the variable is scoped to the specific `define` block being executed, and `$$` means the variable is globally scoped and will persist as `define` blocks call other `define` blocks.

Variables can be numbers, strings, array, or hashes. Arrays and hashes can be created using JSON notation and the array index or hash fields are referenced by placing a string or number within `[]` characters just like you would in JavaScript. Values can be appended to an array using `<<`.

```ruby
$number = 1

$string = "Hello"

$$global_array = [ "apple", "banana", "pear" ]
$$global_array[1] = "orange"
$$global_array << "cherry"

$local_hash = { "name": "apple", "type": "fruit" }
$local_hash["price"] = 0.99
```

### Boolean Logic

Boolean logic is done similarly to other languages. `&&` and `||` are used for "and" and "or". `==` and `!=` are used to determine if something is equal or not equal. `>`, `<`, `>=`, and `<=` are also available to compare numbers.

```ruby
$size == 2 && $volume >= 3 && $type == "fruit"
```

### Branching

Branching is done via "if" statements. All code between "if" and "end" is executed only if the "if" statement is true. Optionally, "elsif" and "else" statements can be used.

```ruby
if $type == "fruit"
  seeds = 1
elsif $type == "tuber"
  seeds = 0
else
  seeds = -1
end
```

### Looping

You can iterate through an array using "foreach". The first variable is the name of your iterator, and the second is the name of the array itself:

```ruby
foreach $instance in $data do
  call restart($instance) retrieve $response
end
```

You can also do a while loop to loop until a condition is no longer satisfied:

```ruby
while $status == "off" do
  call status($instance) retrieve $status
  sleep(10)
end
```

In the event that you need something more like a traditional for loop, you can simply implement this within a while loop:

```ruby
$index = 0

while $index < 5 do
  call power_off($instance) retrieve $response
  $index = $index + 1
end
```

### Built-in Functions

Cloud Workflow Language has numerous built-in functions for various operations. Parameters are passed to functions within `()` characters following the function's name:

```ruby
json_stuff = to_json(my_hash)
```

The following functions are especially useful to know:

* **http_request(*request_hash*):** Makes an API request and returns the API response. Discussed in more detail in the "API Requests" section below.
  * Note: Functions also exist for "http_get", "http_post", etc. but the above is recommended instead.
* **sleep(*seconds*):** Pause execution for the specified number of seconds. Useful when you're making API requests within a loop and need to ensure a delay between each individual request.
* **task_label(*string*):** Inserts a label into the execution log. Can be very useful for debugging.
* **type(*variable*):** Returns a string containing the type of a variable. Example: "array"
* **to_json(*hash*):** Converts a hash to a JSON string. Can be useful for some API requests, with "task_label" to store a hash in the execution logs, or when raising errors

### Calling Blocks

You can have multiple `define` blocks in a policy template that call each other using the "call" function. When the called block completes execution, the value of the variable after the word "return" in the `define` block will be stored in the variable after the word "retrieve" in the "call" function. This allows `define` blocks to be used similarly to functions in a typical high-level programming language.

```ruby
# Within a define block
call delete_snapshot($instance, $param_azure_endpoint) retrieve $delete_response

# The first line define block being called
define delete_snapshot($instance, $param_azure_endpoint) return $response do
```

### API Requests

The simplest way to make an API request is with the "http_request" function. This function takes a single parameter; a hash containing the details of the request. After attempting to make the API request, it will return a hash with the following fields:

* **code:** HTTP response code
* **headers:** Hash of HTTP response headers
* **body:** Response body

The response body will automatically be parsed as a hash if the API request returns JSON. You can reference `credentials` blocks in your policy template using the global variable syntax of `$$`. The `verb` field, despite common convention to the contrary, must be in lowercase to work correctly.

```ruby
$response = http_request(
  auth: $$auth_azure,
  https: true,
  verb: "get",
  host: "management.azure.com",
  href: "/subscriptions",
  query_strings: { "api-version": "2019-07-01" }
  headers: { "content-type": "application/json" },
  body: { "filter": "none" }
)
```

Note that, unlike a `script` block used to make an API request, an "http_request" function in Cloud Workflow executes in real time rather than simply passing request details back to a `datasource` block. This means you can do logic around the results of the request, make a request multiple times inside of a loop, etc.

### Error Handling

An error can be raised using a "raise" statement followed by a string. This will terminate execution of the Cloud Workflow and show the error in the Flexera One UI.

```ruby
raise "Missing instance! Does this instance still exist?"
```

A "sub on_error:" statement can be used to call a specific `define` block if an error occurs instead of ending execution and raising the error. Note this sub statement from our policy template example:

```ruby
sub on_error: handle_error() do
  call delete_snapshot($instance, $param_azure_endpoint) retrieve $delete_response
end
```

If an error happens during execution of "delete_snapshot", the below "handle_error" `define` block will be called:

```ruby
define handle_error() do
  if !$$errors
    $$errors = []
  end
  $$errors << $_error["type"] + ": " + $_error["message"]
  # We check for errors at the end, and raise them all together
  # Skip errors handled by this definition
  $_error_behavior = "skip"
end
```

The details of the error are stored in "$_error" automatically to be referenced as needed. This block creates a global "$$errors" array if it doesn't already exist and stores the error details in it. By setting "$_error_behavior" to "skip", the Cloud Workflow will not cease executing because of the error.

If we look at the original `define` block, we'll see that, once the loop finishes, an error will be raised to report all of the errors that occurred. This means that only one error will be reported in the Flexera One UI, and it also means that, if the user is trying to delete several snapshots, an error in one snapshot won't prevent the rest from being deleted.

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

Please proceed to [Lesson 20](https://github.com/flexera-public/policy_engine_training/blob/main/20_further_learning/README.md) for more information on how to learn about the policy engine and policy template language.
