# Flexera Policy Development - Lesson 06 - APIs

Thus far we've only used the policy engine to produce an output based on values provided by the user, but the real power of the policy engine is its ability to leverage REST APIs to gather data from external sources.

In this lesson, we will use one of Flexera's REST APIs to get a list of policy templates and show them in an incident. If you are unfamiliar with REST APIs and how they work, it is recommended that you use an external resource, such as LinkedIn Learning or Udemy, to learn about them before proceeding with this lesson.

Note: To actually run the policy template we will be creating in this lesson, you will need to create a Flexera credential in your Flexera One organization as described in the [Initial Setup](https://github.com/flexera-public/policy_engine_training/blob/main/00_setup).

## Step 1: Create an empty Policy Template

Either in VSCode or your command line, create a new file called `list_policy_templates.pt` inside the root directory of the GitHub repository. In VSCode, you can right-click in the empty space in the Explorer section then click `New File` to create this file.

Once this file has been created, open it in VSCode by clicking on it on the left.

## Step 2: Policy Metadata and Email Parameter

Just like with our first policy template, we will need to add some metadata. We will also be including an email parameter to enable emailing of incidents raised by this policy template. Add this to the beginning of your new policy template:

```ruby
name "List Policy Templates"
rs_pt_ver 20180301
type "policy"
short_description "Lists all policy templates uploaded to the Flexera organization."
long_description ""
severity "low"
category "Tutorial"
default_frequency "weekly"
info(
  version: "0.1.0"
)

parameter "param_email" do
  type "list"
  label "Email Addresses"
  description "A list of email addresses to notify."
  default []
end
```

## Step 3: Credentials

For this policy template, we're going to add a credentials block. This allows the policy template to authenticate to a REST API. When the user applies the policy template, this credentials block will prompt the user to select a credential that they have stored in the Automation -> Credentials section of Flexera One.

Add the following to the policy template below the email parameter:

```ruby
credentials "auth_flexera" do
  schemes "oauth2"
  label "Flexera"
  description "Select Flexera One OAuth2 credentials"
  tags "provider=flexera"
end
```

This block has the following fields:

* `schemes` is the authorization scheme used by the credential. In most cases, this will be "oauth2"
* `label` and `description` are the name and short description of the credential that the user will see in the UI for this credential when applying the policy template.
* `tags` are key=value pairs of metadata for the credential. Most credentials will have a provider tag that indicates what cloud provider, SaaS tool, or service the credential is for. Examples: flexera, azure, aws

## Step 4: Datasource Request

So far, we've only used datasources to run JavaScript. Their primary use, however, is in making API calls. In this policy template, we're going to make an API call to retrieve a list of policy templates. You can learn more about this API call in the [documentation](https://reference.rightscale.com/governance-policies/#/PolicyTemplate/PolicyTemplate_index).

Underneath the credentials block, add the following code:

```ruby
datasource "ds_list_policy_templates" do
  request do
    auth $auth_flexera
    verb "GET"
    host rs_governance_host
    path join(["/api/governance/projects/", rs_project_id, "/policy_templates"])
    header "Api-Version", "1.0"
  end
end
```

As you've seen previously with the validate block inside of the policy block, blocks can contain blocks. In this case, the datasource block, instead of having a run_script field, has a request block.

The request block provides the details needed to make a call to a REST API. This block has the following fields:

* `auth` contains the name of the credential block used for authenticating to the API. In rare situations where an API does not require authentication, this field can be omitted.
* `verb` contains the specific HTTP request that we're going to make. If the verb field is not present, the policy engine will assume we're making a GET request. Examples: GET, POST, PATCH
* `host` contains the fully-qualified domain name of the API that we're making the request to. Examples: api.flexera.com, management.azure.com
  * In this specific instance, we're making use of the reserved word `rs_governance_host`. Reserved words are constants built into the policy template language that are populated with a value upon policy execution. In this case, `rs_governance_host` will always be populated with the appropriate host for making API requests to the Flexera Governance API. A full list of reserved words is in the [documentation](https://docs.flexera.com/flexera/EN/Automation/ReservedWordReference.htm#automationrefinfo_2159364277_1123431).
* `path` contains the URL path that we're making the request against. Examples: /optima/orgs/12345/billUploads, /subscriptions/
  * The `rs_project_id` reserved word will always be populated with the Flexera project that the policy template is being executed within. This value is needed for some API calls to Flexera APIs.
  * The `join` function is being used to combine a list of strings into a single string. Functions, like reserved words, are built into the policy template language. A full list of functions is in the [documentation](https://docs.flexera.com/flexera/EN/Automation/Functions.htm#automationrefinfo_2159364277_1123433)

## Step 5: Datasource Result

We've defined the request but not how to parse the response from the API. As shown in the [documentation](https://reference.rightscale.com/governance-policies/#/PolicyTemplate/PolicyTemplate_index), this API responds with JSON, and the policy engine natively supports parsing JSON and XML. To parse the JSON from the response, add the following result block inside of the datasource, underneath the request block:

```ruby
  result do
    encoding "json"
    collect jmes_path(response, "items[*]") do
      field "category", jmes_path(col_item, "category")
      field "id", jmes_path(col_item, "id")
      field "name", jmes_path(col_item, "name")
      field "short_description", jmes_path(col_item, "short_description")
    end
  end
```

There's a lot going on in this block, so let's go over the various fields:

* `encoding` describes the data format that the API is going to respond with. The supported values are "json", "xml", and "text".
* Because we're requesting a list of things from this API, the API is going to respond with JSON that contains a list. The `collect` block is used to grab items from a list and form a new list from that data.
  * The `jmes_path` function retrieves the data stored in a particular JSON key or path from something. The first parameter is the variable, datasource, etc. that contains the JSON we're extracting from, and the second parameter is the path.
  * The `response` reserved word contains the full response from the API.
  * The "items[\*]" path indicates that we want to grab all items contained in a list that is stored in the key "items". If an API is returning a flat list, rather than a JSON object with a key containing a list, you can use "[\*]" for the path instead.
* Within the `collect` block, we have various `field` fields that define the values we're going to store. The first value in each `field` field is the name we're going to use to store the data in, and the second value is where we're going to get that data.
  * It is not required that the name of each field match the JSON key in the API response, but in most cases, it is recommended.
  * The `col_item` reserved word is only valid inside of a `collect` block and represents each item in the list that we're iterating through.
  * The `jmes_path` function is being used to retrieve specific keys from each item.

The result of this result block will be a list of objects that each have a "category" key, "id" key, "name" key, and "short_description" key. The values of these keys will correspond to the values of the equivalently-named keys in each item in the list the API returned.

Your final, complete datasource should look like this:

```ruby
datasource "ds_list_policy_templates" do
  request do
    auth $auth_flexera
    verb "GET"
    host rs_governance_host
    path join(["/api/governance/projects/", rs_project_id, "/policy_templates"])
    header "Api-Version", "1.0"
  end
  result do
    encoding "json"
    collect jmes_path(response, "items[*]") do
      field "category", jmes_path(col_item, "category")
      field "id", jmes_path(col_item, "id")
      field "name", jmes_path(col_item, "name")
      field "short_description", jmes_path(col_item, "short_description")
    end
  end
end
```

## Step 6: Policy Block

Now that we have our list of policy templates, we need to raise an incident. Add the following policy block after your datasource:

```ruby
policy "pol_list_policy_templates" do
  validate_each $ds_list_policy_templates do
    summary_template "{{ len data }} Policy Templates Found"
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
    end
  end
end
```

You'll notice some new fields in this policy block. Let's go over them:

* `validate_each` works similarly to `validate`. The difference is that the validation will run against each item in a list rather than against the entire datasource. This is the recommended approach when validating a datasource that contains a list.
* The `summary_template` field contains a new Go templating construct. `len` returns the number of items in a list and `data` refers to the full contents of the datasource. As a result, `{{ len data }}` will be converted to a number representing the number of policy templates in the incident.
* The `item` reserved word is only valid in the `check` field when using `validate_each` and refers to each individual item in the list that we're iterating through.
  * In this case, we're using the `val` function to check the `name` field of each item to see if is an empty string. If it's not, the check statement resolves to false, and that item is included in the incident. Since every policy template has a name, this should mean every policy template in our list will be included in the incident.
* Instead of a `detail_template` field, we have an `export` block. This will create a table in the incident.
  * Every `export` block contains a series of `field` blocks. The name of each `field` block corresponds to a key in each item of the list.
    * Note: You can use the `path` field within a `field` block to specify the key if you need the key to be different than the name of the field itself. This is only necessary for a handful of niche use cases.
  * Each `field` block contains a `label` field that dictates what that column in the incident table will be labelled. This is generally something more human-readable than the name of the key itself.
  * Every `validate` or `validate_each` block must contain either a `detail_template` field, an `export` block, or both. If both are present, the table produced by the `export` block will appear beneath the text of the `detail_template` in the incident.

## Step 7: Email Block

Finally, let's add an escalation block to the end. This is the same email block we used for the Hello World policy template.

```ruby
escalation "esc_email" do
  automatic true
  label "Send Email"
  description "Send incident email"
  email $param_email
end
```

## Step 5: Testing

It's time to test! As usual, let's start by running a check to make sure we have no syntax errors:

```bash
fpt check list_policy_templates
```

Assuming there are no errors, let's run the policy template. Since this policy template has a credential, we have to specify the credential in our run statement. Be sure to replace "your_credential_identifier" in the below command with the ID of the credential you created during the setup process, both in this lesson and in future lessons.

```bash
fpt run list_policy_templates.pt param_email='["not_a_real@emailaddress.com", "also_not_real@emailaddress.com"]' --credentials="auth_flexera=your_credential_identifier"
```

You should see the policy template execution complete successfully. If you scroll through the output, you should see a full list of policy templates that would be included in the incident.

Finally, let's store the list of policies locally to review at our leisure using the retrieve_data command:

```bash
fpt retrieve_data list_policy_templates.pt param_email='["not_a_real@emailaddress.com", "also_not_real@emailaddress.com"]' --credentials="auth_flexera=your_credential_identifier" -n ds_list_policy_templates
```

This should create a file named datasource_ds_list_policy_templates that contains the list of policy templates stored in that datasource. Note that your list may differ from the example in this repository; your Flexera organization may contain additional policy templates.

Please move on to [Lesson 07](https://github.com/flexera-public/policy_engine_training/blob/main/07_pagination/README.md), where we will learn about API pagination.
