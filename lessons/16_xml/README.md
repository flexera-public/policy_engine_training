# Flexera Policy Development - Lesson 16 - XML & Text Responses

Most REST APIs support or default to JSON for their responses, and this is what we recommend when possible. That said, occasionally a REST API will return results in XML or plain text; the policy engine provides tools for managing this. We will modify the "list_policy_templates.pt" policy template to pull some of our data via XML.

## Step 1: Update the Version

It's considered best practice to use [semantic versioning](https://github.com/flexera-public/policy_templates/blob/master/VERSIONING.md) when versioning your policy templates. Let's update the policy template to version `0.5.1` by updating the `info` block like so:

```ruby
info(
  version: "0.5.2"
)
```

We're changing the patch version instead of the minor version because our changes won't actually impact how the policy template functions.

## Step 2: Modify the ds_policy_lesson_list Datasource

We're going to modify the "ds_policy_lesson_list" datasource to pull the list of lessons from an XML source instead of a JSON source. Modify the datasource to match the following:

```ruby
datasource "ds_policy_lesson_list" do
  request do
    host "raw.githubusercontent.com"
    path "/flexera-public/policy_engine_training/refs/heads/main/.data/lessons/lessons.xml"
  end
  result do
    encoding "xml"
    collect xpath(response, "//lessons/item", "array") do
      field "name", xpath(col_item, "name")
      field "lesson", xpath(col_item, "lesson")
    end
  end
end
```

Note the following differences from the original version:

* The `path` field now points to an XML file instead of a JSON one. Note that, in real world usage, your path typically won't be an actual file but an API endpoint of some sort. You can [view this XML file here](https://github.com/flexera-public/policy_engine_training/blob/main/.data/lessons/lessons.xml) to see how it is formatted.
* The `encoding` field is now set to "xml". This tells the policy engine to parse the results as XML.
* The `collect` field is now using the "xpath" function. This is the XML equivalent of the "jmes_path" function.
  * You can specify a third parameter for the "xpath" function to indicate whether you're parsing a "simple_element" (e.g. a single data item) or an "array". If unspecified, this defaults to "simple_element", which is why you don't see this parameter being specified in the `field` fields.
  * XML paths should be expressed using standard XML notation with the `/` character.
* The `field` statements now use "xpath" instead of "jmes_path" to parse XML.
* The reserved words "response" and "col_item" are used in the same way they are used for JSON.

## Step 3: Testing

Let's verify that none of our changes broke the policy template. Do an fpt check to make sure there are no syntax errors or other code problems:

```bash
fpt check list_policy_templates.pt
```

Once we've verified there are no syntax errors, let's run the policy template. Once the policy template finishes execution, scroll through the output and make sure everything looks normal.

```bash
fpt run list_policy_templates.pt --credentials="auth_flexera=your_credential_identifier"
```

The results should be exactly the same as they were previously.

## A Note on Text Responses

Occasionally, a REST API will return some form of plain text as the response. In those cases, you can store the entire response as a string with the following `result` block:

```ruby
result do
  encoding "text"
end
```

Note that, when setting the `encoding` field to "text", no other fields are valid. The above is the complete `result` block you should use to store the response as plain text.

In most cases, you're going to want to parse the text and convert it to something more useful in a `script` block. The below example parses a CSV and converts it to JSON:

```ruby
script "js_parse_csv", type: "javascript" do
  parameters "csv_raw"
  result "result"
  code <<-'EOS'
  lines = _.filter(csv_raw.split("\n"), function(line) {
    return line && line.trim()
  })

  headers = lines.shift().split(",")

  result = _.map(lines, function(line) {
    entry = {}
    columns = line.split(",")

    entry = _.each(columns, function(column, index) {
      entry[headers[index]] = column
    })

    return entry
  })
EOS
end
```

The above is only an example and is in no way a complete CSV parsing implementation. For example, the above would fail if the CSV file had entries contained within `"` quotes. This is just a demonstration to show how you might have to parse and reformat data retrieved as plain text using various JavaScript functions.

Please proceed to [Lesson 17](https://github.com/flexera-public/policy_engine_training/blob/main/lessons/17_local_js/README.md), where we will learn about how to test `script` blocks locally.
