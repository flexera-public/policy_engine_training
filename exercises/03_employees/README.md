# Flexera Policy Development - Exercise 03 - Employees and Department Heads

## Exercise

Create a new policy template with the name "Employees and Department Heads". The file name can be anything you like. This policy template should include the following datasources:

```ruby
datasource "ds_employees" do
  run_script $js_employees
end

script "js_employees", type: "javascript" do
  result "list"
  code <<-'EOS'
  list = [
    { name: "Jane Austen", location: "APAC", team: "Violet" },
    { name: "John Adams", location: "EMEA", team: "Red" },
    { name: "Alice Cooper", location: "US", team: "Green" },
    { name: "Edgar Allan Poe", location: "US", team: "Blue" },
    { name: "Charlie Chaplin", location: "US", team: "Orange" }
  ]
EOS
end

datasource "ds_teams" do
  run_script $js_teams
end

script "js_teams", type: "javascript" do
  result "list"
  code <<-'EOS'
  list = [
    { team: "Violet", department: "Engineering" },
    { team: "Red", department: "Engineering" },
    { team: "Green", department: "Sales" },
    { team: "Blue", department: "Sales" },
    { team: "Orange", department: "Marketing" }
  ]
EOS
end

datasource "ds_department_heads" do
  run_script $js_department_heads
end

script "js_department_heads", type: "javascript" do
  result "list"
  code <<-'EOS'
  list = [
    { department: "Engineering", head: "Jim Smith" },
    { department: "Sales", head: "Jane Doe" },
    { department: "Marketing", head: "John Johnson" }
  ]
EOS
end
```

These datasources are meant to mimic a common pattern seen in REST APIs. The first list, "ds_employees", is a list of employees, their location, and what teams they are on. The second list, "ds_teams", is a list of teams and what departments they belong to. The final list, "ds_department_heads", is a list of departments and their respective department heads.

Write additional datasources as needed to combine these into a new list of employees that includes: name, location, team, department, department_head. An incident should be raised listing the employees and should include all of these fields. The resulting incident should also be emailed via an `escalation` block.

When you've finished the policy template, test it using the "fpt run" command and verify that it works. If you run into any difficulties getting your new policy template to execute, follow the process outlined in [Lesson 10](https://github.com/flexera-public/policy_engine_training/blob/main/lessons/10_debugging/README.md) before looking at the solution.

When you've completed the exercise, or if you need additional help, you can review the [completed policy template in the "solution" directory](https://github.com/flexera-public/policy_engine_training/blob/main/exercises/exercises/03_employees/solution/employees.pt). Note that your policy template may not look identical; there is more than one way to complete this exercise.

If you're following the lesson plan, please move on to [Lesson 11](https://github.com/flexera-public/policy_engine_training/blob/main/lessons/11_request_scripts/README.md).
