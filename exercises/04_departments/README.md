# Flexera Policy Development - Exercise 04 - Departments

## Exercise

Create a new policy template with the name "Departments". The file name can be anything you like. This policy template should include the following datasource:

* **ds_departments**
  * Request:
    * Host: raw.githubusercontent.com
    * Path: /flexera-public/policy_engine_training/refs/heads/main/.data/departments.json
    * *Note: No authentication is needed for this request.*
  * Result:
    * The [response](https://raw.githubusercontent.com/flexera-public/policy_engine_training/refs/heads/main/.data/departments.json) is a JSON list. Each object in the list has the following fields: department, head

Make a second datasource that iterates through "ds_departments" to gather detailed information for each department:

* **ds_departments_detailed**
  * Request:
    * Host: raw.githubusercontent.com
    * Path: /flexera-public/policy_engine_training/refs/heads/main/.data/departments/{{ Name of Department }}.json
      * Replace {{ Name of Department }} with the name of the department that you're gathering details for. This will correspond to the "department" field in "ds_departments".
  * Result:
    * The [response](https://raw.githubusercontent.com/flexera-public/policy_engine_training/refs/heads/main/.data/departments/Engineering.json) is a JSON object with the following fields: name, head, teams, employee_count, annual_budget.
      * "annual_budget" is an object with two fields: amount, currency

An incident should be raised listing the departments and should include the department name, head, employee count, and annual budget. The resulting incident should also be emailed via an `escalation` block.

When you've finished the policy template, test it using the "fpt run" command and verify that it works. If you run into any difficulties getting your new policy template to execute, follow the process outlined in [Lesson 10](https://github.com/flexera-public/policy_engine_training/blob/main/lessons/10_debugging/README.md) to debug the policy template before looking at the solution.

When you've completed the exercise, or if you need additional help, you can review the [completed policy template in the "solution" directory](https://github.com/flexera-public/policy_engine_training/blob/main/exercises/04_departments/solution/departments.pt). Note that your policy template may not look identical; there is more than one way to complete this exercise.

If you're following the lessons in order, please move on to [Lesson 11](https://github.com/flexera-public/policy_engine_training/blob/main/lessons/11_request_scripts/README.md).
