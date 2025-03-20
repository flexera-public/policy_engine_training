# Flexera Policy Development - Lesson 16 - XML & Text Responses

Most REST APIs support or default to JSON for their responses, and this is what we recommend when possible. That said, occasionally a REST API will return results in XML or plain text; the policy engine provides tools for managing this.

Since Flexera's APIs all use JSON, we will be using examples from the [Flexera Policy Templates GitHub Repository](https://github.com/flexera-public/policy_templates) to go over these.

## XML Responses

If a REST API is going to provide results in xml, you will need to set the `encoding` field to "xml". You will also need to use the "xpath" function, which is the xml equivalent of the "jmes_path" function you've seen before. Consider the below example:

```ruby
result do
  encoding "xml"
  collect xpath(response, "//DescribeRegionsResponse/regionInfo/item", "array") do
    field "region", xpath(col_item, "regionName")
    field "endpoint", xpath(col_item, "regionEndpoint")
  end
end
```

Paths should follow xml conventions rather than JSON ones, using `/` characters where appropriate. Unlike the "jmes_path" function, you can specify a third parameter for the "xpath" function to indicate whether you're parsing a "simple_element" (e.g. a single data item) or an "array". If unspecified, this defaults to "simple_element", which is why you don't see this parameter being specified in the `field` fields.

Otherwise, functionality is very similar to parsing JSON, including when to use a `collect` block and when to use the reserved words "response" and "col_item".

## Text Responses

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

The above is only an example and is in no way a complete CSV parsing implementation. For example, the above would fail if the CSV file had entries contained within `"` quotes. This is just a demonstration to show how you might have to parse and reformat data retrieved as plain text.

Please proceed to [Lesson 17](https://github.com/flexera-public/policy_engine_training/blob/main/17_local_js/README.md), where we will learn about how to test `script` blocks locally.
