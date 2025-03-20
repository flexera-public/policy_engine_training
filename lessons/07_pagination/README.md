# Flexera Policy Development - Lesson 07 - Pagination

Sometimes a REST API will return results in a paginated fashion where additional API requests need to be made to retrieve the additional pages. Different APIs handle this differently, and the policy engine uses `pagination` blocks to define how to handle pagination for a particular API request.

Since these lessons are focusing very specifically on the Flexera policy API, where pagination is not used, this lesson will use examples from the [Policy Catalog](https://github.com/flexera-public/policy_templates) to show how `pagination` blocks work. It is also recommended that you read the [official documentation](https://docs.flexera.com/flexera/EN/Automation/RetrieveData.htm#automationrefinfo_2830531361_1127423) for more detail.

## Example: Microsoft Azure

Consider the following datasource for retrieving Azure subscriptions:

```ruby
datasource "ds_azure_subscriptions" do
  request do
    auth $auth_azure
    pagination $pagination_azure
    host $param_azure_endpoint
    path "/subscriptions/"
    query "api-version", "2020-01-01"
    header "User-Agent", "RS Policies"
  end
  result do
    encoding "json"
    collect jmes_path(response, "value[*]") do
      field "id", jmes_path(col_item, "subscriptionId")
      field "name", jmes_path(col_item, "displayName")
      field "state", jmes_path(col_item, "state")
    end
  end
end
```

You'll notice a new field in the `request` block called `pagination`. This field determines how the datasource should handle pages if the API responds with paginated results. The `pagination` field should always point to the name of a `pagination` block with the usual `$` syntax. Let's take a look at that `pagination` block:

```ruby
pagination "pagination_azure" do
  get_page_marker do
    body_path "nextLink"
  end
  set_page_marker do
    uri true
  end
end
```

A `pagination` block always contains two additional blocks within it:

* `get_page_marker` determines how to obtain the data necessary to request the next page from the API response.
* `set_page_marker` determines how to modify the API request in order to obtain the next page.

Each of these blocks will contain a field indicating how to handle each thing. In this example:

* `body_path` means that we're obtaining the information for the next page from a field in the API response body itself. In this case, the "nextLink" field in the body of the response will tell us how to get the next page.

* `uri` being set to true means that the data gathered from the `get_page_marker` block is a full web URL and the next request should be made against that URL.

To make this more clear, let's look at a fictional response for the API request in our datasource above:

```json
{
  "value": [
    {
      "id": "/subscriptions/2f6a5d20-8c3e-44b9-9bff-d45a0f6b6abc",
      "subscriptionId": "2f6a5d20-8c3e-44b9-9bff-d45a0f6b6abc",
      "displayName": "Production Subscription",
      "state": "Enabled",
      "subscriptionPolicies": {
        "locationPlacementId": "Public_2014-09-01",
        "quotaId": "EnterpriseAgreement_2014-09-01",
        "spendingLimit": "Off"
      }
    },
    {
      "id": "/subscriptions/5d7c8f15-1e3c-4f78-a3f1-9e8e1b4a9def",
      "subscriptionId": "5d7c8f15-1e3c-4f78-a3f1-9e8e1b4a9def",
      "displayName": "Development Subscription",
      "state": "Enabled",
      "subscriptionPolicies": {
        "locationPlacementId": "Public_2014-09-01",
        "quotaId": "MSDN_2014-09-01",
        "spendingLimit": "On"
      }
    }
  ],
  "nextLink": "https://management.azure.com/subscriptions?api-version=2022-12-01&%24skiptoken=eyJuZXh0UGFnZSI6IjIifQ%3d%3d"
}
```

Normally you would not need pagination after only 2 results, but this is just an example to demonstrate the point. Notice how the response contains a key named "nextLink" that contains a URL. That URL is where the request needs to be made to get the next page of data. Our `pagination` block tells the datasource how to interpret this API response in order to request the next page.

## Supported get_page_marker Fields

Not every API handles pagination the same way. For this reason, different field options are available for the `get_page_marker` and `set_page_marker` blocks.

### header

The `header` field can be used to get the next page from a field in the API's response header. You would just specify the name of the "header" field expected in the response like so:

```ruby
  get_page_marker do
    header "nextToken"
  end
```

### body_path

The `body_path` field can be used to get the next page from a field in the API's response body. You would just specify the name of the field in the body like so:

```ruby
  get_page_marker do
    body_path "newPage"
  end
```

## Supported set_page_marker Fields

The following fields can be used within the `set_page_marker` block to interpret the data gathered in the `get_page_marker` block.

### query

The `query` field should be used when the data gathered in the `get_page_marker` block is the value for a query parameter. The field should be set to the query parameter key that we need to set the value for:

```ruby
  set_page_marker do
    query "nextPage"
  end
```

### header

The `header` field should be used when the data gathered in the `get_page_marker` block is the value for a "header" field. The field should be set to the "header" field that we need to set the value for:

```ruby
  set_page_marker do
    header "nextPage"
  end
```

### body_field

The `body_field` field should be used when the data gathered in the `get_page_marker` block is the value for a field in the JSON body of the request. The field should be set to the "body" field that we need to set the value for:

```ruby
  set_page_marker do
    body_field "nextPage"
  end
```

### uri

The `uri` field should be used when the data gathered in the `get_page_marker` block is the full URL to request the next page from. This field should always be given a value of true when used.

```ruby
  set_page_marker do
    uri true
  end
```

## Figuring Out Pagination

All of the above is of course not very useful unless you know how the API in question handles pagination! There are two main sources of information for this:

* The documentation for the API in question should contain information on how pagination works. You can then write a `pagination` block that matches the documentation.
* You can make a call to the API directly via a tool like Postman and review the response and experiment to figure out how the pagination works and then make the appropriate `pagination` block.
* For major cloud providers in particular, you can likely find examples in existing policy templates in our [Policy Catalog](https://github.com/flexera-public/policy_templates) that you can just copy and paste into your policy template.

That's it for pagination. Please move on to [Lesson 08](https://github.com/flexera-public/policy_engine_training/blob/main/lessons/08_underscore/README.md) to learn more about the Underscore.js library.
