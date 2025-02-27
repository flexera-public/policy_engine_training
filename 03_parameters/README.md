# Flexera Policy Development - Lesson 03 - Parameters

Sometimes you need to enable the user to manipulate what the policy template is going to do. This is done via parameter blocks, which allow the user to specify values that have an impact on what the policy template does.

In this lesson, we're going to edit the `hello_world.pt` policy template created in Lesson 02 so that the user can decide who or what the policy template is saying hello to.

## Step 1: Update the Version

It is recommended that you use versioning to track changes in policy templates you develop. Let's update the policy template to version `0.2.0` by updating the info block like so:

```ruby
info(
  version: "0.2.0"
)
```

Note that, while you can version policy templates however you like, we generally recommend using [semantic versioning](https://semver.org/).

## Step 2: Create a Parameter Block

Below the policy template's metadata, but above the datasource, add the following:

```ruby
parameter "param_greeting_target" do
  type "string"
  label "Greeting Target"
  description "Whatever it is we're greeting."
  default "World"
end
```

This creates a parameter block with the following fields:

* `type` determines what kind of information the user is going to enter into the parameter. In this case, a string.
* `label` is the name of the parameter that the user will see in the user interface.
* `description` is a longer description of what the parameter does that the user will see in the user interface.
* `default` is the default value. If no default is specified, the user will always need to manually enter a value.

## Step 3: Add the Parameter to our Datasource Block

Now that we have a parameter block, let's add it to our datasource block. Add the parameter to the `run_script` field of the `ds_hello_world` datasource like so:

```ruby
datasource "ds_hello_world" do
  run_script $js_hello_world, $param_greeting_target
end
```

Now the datasource will send the contents of the parameter to the script.

## Step 4: Add the Parameter to our JavaScript Block

A datasource can only send a parameter to a script if the script is configured to accept it. Add a new line between the `script` and `result` lines of the JavaScript block with the parameter like so:

```ruby
script "js_hello_world", type: "javascript" do
  parameters "greeting_target"
  result "hello_world"
```

Now, when the datasource passes `$param_greeting_target` as a parameter, this will be stored in the `greeting_target` variable when the JavaScript block executes.

## Step 5: Use the Parameter in JavaScript Code

Passing the parameter into the JavaScript block alone doesn't do much. We need to make use of the new `greeting_target` variable in our code. Modify the code section of the JavaScript block like so:

```javascript
  hello_world = {
    output: "Hello " + greeting_target
  }
```

Now the value of the output key will be the string "Hello " followed by whatever the user specified for the parameter we added.

Your `hello_world.pt` file should now look similar or identical to the one in the `03_parameters/solution` directory of the repository.

## Step 6: Testing

Now that we have a complete policy template, it's time to test it. This time, we're going to do an `fpt check` on the policy template first. This doesn't run the policy template, but tests it for any syntax errors or other problems.

In your command line, make sure you're in the root directory of the Github repository and run this command:

```bash
fpt check hello_world.pt
```

If the command completes with no errors or output, that means the policy template has no issues and you should be clear to run the policy template. Let's do so now with this command:

```bash
fpt run hello_world.pt
```

If all went according to plan, you should see the same thing you saw when running the policy template from lesson 02:

```text
Policy evaluation successful
1 validations failed and created incidents:
Incident /api/governance/projects/12345/incidents/67c616c68ff63cc546ff82ee
Link: https://app.flexera.compolicy/projects/12345/incidents/67c616c68ff63cc546ff82ee
Severity: low
Category: Tutorial
Items: 1
Summary: Hello World
Detail:
Hello World
```

The value "World" is seen above because we didn't specify a value for the parameter we added and it has a default value of "World". Let's try setting it to something else; run this command instead to specify a value for the parameter:

```bash
fpt run hello_world.pt param_greeting_target="Jupiter"
```

Now when the policy template executions, we should see "Jupiter" in place of "World":

```text
Policy evaluation successful
1 validations failed and created incidents:
Incident /api/governance/projects/12345/incidents/67c617458ff63cc546ff82ef
Link: https://app.flexera.com/orgs/43210/policy/projects/12345/incidents/67c617458ff63cc546ff82ef
Severity: low
Category: Tutorial
Items: 1
Summary: Hello Jupiter
Detail:
Hello Jupiter
```

In [Lesson 04](https://github.com/flexera-public/policy_engine_training/blob/main/04_escalations/README.md), we'll learn about parameters containing lists and how to email incidents.
