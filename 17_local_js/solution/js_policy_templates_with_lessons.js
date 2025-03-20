var _ = require('underscore')

// Parameters
var ds_policy_lesson_list = require("./datasource_ds_policy_lesson_list.json")
var ds_list_policy_templates = require("./datasource_ds_list_policy_templates.json")
var param_limit = 1

// Script
policy_table = {}

_.each(ds_policy_lesson_list, function(lesson) {
  policy_table[lesson['name']] = lesson['lesson']
})

console.log(JSON.stringify(policy_table, null, 2))

policy_templates_with_lessons = _.map(ds_list_policy_templates, function(template) {
  return {
    category: template['category'],
    id: template['id'],
    name: template['name'],
    short_description: template['short_description'],
    lesson: policy_table[template['name']]
  }
})

result = _.filter(policy_templates_with_lessons, function(template) {
  return template['lesson']
})

result = result.slice(0, param_limit)

// Output
// console.log(JSON.stringify(result, null, 2))
