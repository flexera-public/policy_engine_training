# Flexera Policy Development - Lesson 02 - Hello World

We're now going to develop our very first policy template! This policy template will simply create an incident that states "Hello World".

## Step 1: Create an empty Policy Template

Either in VSCode or your command line, create a new file called `hello_world.pt` inside the root directory of the GitHub repository. In VSCode, you can right-click in the empty space in the Explorer section then click `New File` to create this file.

Once this file has been created, open it in VSCode by clicking on it on the left.

## Step 2: Policy Metadata

The first thing we need to add to the policy template is metadata. This code defines the name of the policy template, the version number, and other important metadata about the policy template. The metadata should always be the first thing in the policy template. Add the following into your newly created `hello_world.pt` file:

```ruby
name "Hello World"
rs_pt_ver 20180301
type "policy"
short_description "Hello World"
long_description ""
category "Tutorial"
severity "low"
default_frequency "weekly"
info(
  version: "0.1.0"
)
```

To briefly go over what each of these defines:

* `name` indicates the name of the policy template. If you upload the template into Flexera One, this is the name that will be shown.
* `rs_pt_ver` indicates the version of the policy template language to use. This should always be set to "20180301"
* `type` simply indicates that this is a policy template and should always be set to "policy"
* `short_description` is a brief description of what the policy template does. This will appear in Flexera One underneath the name when the policy template is uploaded.
* `long_description` is defunct and should always be an empty string.
* `category` is the category of the policy template. In most cases, this will be something like "Cost", "Compliance", "Security", etc.
* `severity` is the default severity level of any incidents raised by the policy template.
* `default_frequency` is the default schedule for the policy template to execute.
* `info` contains any other metadata we want to define for the policy template. At minimum, a version number should be present here, but any other arbitrary metadata in *key: "value"* format can be included here too.

## Step 3: Datasource Block

Now that we have our metadata in place, add the following in the policy template below the metadata:

```ruby
datasource "ds_hello_world" do
  run_script $js_hello_world
end
```

Policy templates follow a straight-forward structure of code blocks. Each block begins with a single line containing the type of block, the name of the block, and the word ?do? to signify that it is a block. This code defines a *datasource* block.

Indented within the block are various fields. In this case, we only have one field, *run_script*, that defines a script that this datasource is going to run. Once the script runs, the data it produces will be stored in the datasource.

Code blocks are referred elsewhere by their name with a `$` character preceding it. In the next step, we're going to add a JavaScript block with the name `js_hello_world`, which is being referenced here, and later on, this datasource will be referred to by `$ds_hello_world`.

## Step 4: JavaScript Block

Next, add the following code below the datasource block we created above:

```ruby
script "js_hello_world", type: "javascript" do
  result "hello_world"
  code <<-'EOS'
EOS
end
```

This defines a special kind of block called a JavaScript block. JavaScript blocks can be used to run JavaScript. Any tasks that require a real programming language in a policy template are generally done in these blocks.

This block has the following fields:

* `type` is always on the same line as the JavaScript block's name and is always set to `javascript`.
* `result` contains the name of the variable that will contain the result. When the script finishes execution, whatever is stored in this variable name will become the value of the datasource calling this JavaScript block.
* `code` contains the JavaScript code that the block will execute. While you can technically put all of your code on a single line contained in double quotes, it is recommended that you use the `<<-'EOS'` and `EOS` formatting shown above to allow the use of multiple lines.

## Step 5: JavaScript Code

We now have a JavaScript block but it doesn't currently have any code. Let's fix that. Add the following code between the `<<-'EOS'` and `EOS` lines in your JavaScript block:

```javascript
  hello_world = {
    output: "Hello World"
  }
```

This JavaScript code sets the variable "hello_world" to a JavaScript object. This object has one key, `output`, set to the value of "Hello World". Because "hello_world" is the name of the variable specified in the `result` field of our JavaScript block, and because this JavaScript block is being called by the `ds_hello_world` datasource, when this policy template executes, this JavaScript object is what will be stored in `$ds_hello_world`.

The completed datasource and JavaScript blocks should look like this:

```ruby
datasource "ds_hello_world" do
  run_script $js_hello_world
end

script "js_hello_world", type: "javascript" do
  result "hello_world"
  code <<-'EOS'
  hello_world = {
    output: "Hello World"
  }
EOS
end
```

## Step 6: Policy Block

Now we've got a valid datasource that will contain data, but what do we do with it? Every policy template has a policy block that assesses datasources and raises incidents. Add the following code below the JavaScript block:

```ruby
policy "pol_hello_world" do
  validate $ds_hello_world do
    summary_template "{{ data.output }}"
    detail_template "{{ data.output }}"
    check eq(0, 1)
  end
end
```

This creates a policy block named `pol_hello_world`.

* The `validate` field indicates that we're checking the contents of `$ds_hello_world` to determine if an incident should be raised.
* The `summary_template` field is the title or subject of the incident if it is raised. We are using Go template syntax to interpolate the contents of the datasource.
  * {{ }} indicates that we want to show the value of a variable.
  * `data` is a keyword that refers to the contents of whatever datasource we're validating. In this case, `$ds_hello_world`.
  * `.output` indicates that we want the value of the output key.
* The `detail_template` field is typically a more thorough description of the incident. In this case, we're setting it to the same value as `summary_template` for simplicity.
* The `check` field contains a boolean statement that returns either true or false. An incident is raised if the statement is false.
  * In this case, we're using the policy template language's native eq function to determine if the values 0 and 1 are equal. Since they are not, this will always return false, causing an incident to be raised.

When this policy template executes, the check statement should return false, causing the incident to be raised. The incident's title and summary will contain the value of the output field in the datasource, which we set to "Hello World" in the JavaScript block.

Your `hello_world.pt` file should now look similar or identical to the one in the `02_hello_world/solution` directory of the repository.

## Step 7: Testing

Now that we have a complete policy template, it's time to test it. We can test it with the `fpt` command. In your command line, make sure you're in the root directory of the Github repository and run this command:

```bash
fpt run hello_world.pt
```

This command will upload the policy template to the Flexera One organization you configured during the initial setup and then run the policy template once. You should see a bunch of text logging the execution of the policy template, and if the policy template worked as expected, there should be no errors and you should see this at the end:

```text
Policy evaluation successful
1 validations failed and created incidents:
Incident /api/governance/projects/7954/incidents/67c610a66272a88b53450495
Link: https://app.flexera.com/orgs/6/policy/projects/7954/incidents/67c610a66272a88b53450495
Severity: low
Category: Tutorial
Items: 1
Summary: Hello World
Detail:
Hello World
```

Congratulations on your first policy template! In lesson 03, we'll take a look at parameters.
