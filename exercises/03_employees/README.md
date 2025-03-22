# Flexera Policy Development - Exercise 03 - Employees and Department Heads

## Exercise

Create a new policy template with the name "Employees and Department Heads". The file name can be anything you like. This policy template should include the following datasources:

* **ds_employee**
  * Request:
    * Host: raw.githubusercontent.com
    * Path: /flexera-public/policy_engine_training/refs/heads/main/exercises/03_employees/data/employees.json
    * *Note: No authentication is needed for this request.*
  * Result:
    * Collect [*]
      * field "name" comes from the field "name" in the response
      * field "location" comes from the field "location" in the response
      * field "team" comes from the field "team" in the response

* **ds_teams**
  * Request:
    * Host: raw.githubusercontent.com
    * Path: /flexera-public/policy_engine_training/refs/heads/main/exercises/03_employees/data/teams.json
    * *Note: No authentication is needed for this request.*
  * Result:
    * Collect [*]
      * field "team" comes from the field "team" in the response
      * field "department" comes from the field "department" in the response

* **ds_departments**
  * Request:
    * Host: raw.githubusercontent.com
    * Path: /flexera-public/policy_engine_training/refs/heads/main/exercises/03_employees/data/departments.json
    * *Note: No authentication is needed for this request.*
  * Result:
    * Collect [*]
      * field "department" comes from the field "department" in the response
      * field "head" comes from the field "head" in the response

These datasources are meant to mimic a common pattern seen in REST APIs. The first list, "ds_employees", is a list of employees, their location, and what teams they are on. The second list, "ds_teams", is a list of teams and what departments they belong to. The final list, "ds_departments", is a list of departments and their respective department heads.

Write additional datasources as needed to combine these into a new list of employees that includes: name, location, team, department, department_head. An incident should be raised listing the employees and should include all of these fields. The resulting incident should also be emailed via an `escalation` block.

When you've finished the policy template, test it using the "fpt run" command and verify that it works. If you run into any difficulties getting your new policy template to execute, follow the process outlined in [Lesson 10](https://github.com/flexera-public/policy_engine_training/blob/main/lessons/10_debugging/README.md) to debug the policy template before looking at the solution.

When you've completed the exercise, or if you need additional help, you can review the [completed policy template in the "solution" directory](https://github.com/flexera-public/policy_engine_training/blob/main/exercises/03_employees/solution/employees.pt). Note that your policy template may not look identical; there is more than one way to complete this exercise.

If you're following the lesson plan, please move on to [Lesson 11](https://github.com/flexera-public/policy_engine_training/blob/main/lessons/11_request_scripts/README.md).
