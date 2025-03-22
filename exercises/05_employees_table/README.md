# Flexera Policy Development - Exercise 05 - Employees Table

## Exercise

In this exercise, you'll be modifying the template created in [Exercise 03](https://github.com/flexera-public/policy_engine_training/blob/main/exercises/03_employees/README.md). If you've completed this exercise but no longer have the policy template, you can use the [solution to Exercise 03](https://github.com/flexera-public/policy_engine_training/blob/main/exercises/03_employees/solution/employees.pt) as your starting point.

Make the following modifications to the policy template:

* Add a Flexera `credentials` block to the policy template so that the template can authenticate to Flexera APIs.
* Add a `datasource` block to obtain the applied policy's name during execution. This is equivalent to the "ds_applied_policy" datasource in [Lesson 18](https://github.com/flexera-public/policy_engine_training/blob/main/lessons/18_go_template/README.md).
* Add the applied policy's name to the `summary_template` field in the `validate_each` block using Go template syntax.
* Delete the `export` block and replace it with a table showing the results. You will need to use both Go template syntax and Markdown to achieve this.

When you've finished the policy template, test it using the "fpt run" command and verify that it works. If you run into any difficulties getting your new policy template to execute, follow the process outlined in [Lesson 10](https://github.com/flexera-public/policy_engine_training/blob/main/lessons/10_debugging/README.md) to debug the policy template before looking at the solution.

When you've completed the exercise, or if you need additional help, you can review the [completed policy template in the "solution" directory](https://github.com/flexera-public/policy_engine_training/blob/main/exercises/05_employees_table/solution/employees_table.pt). Note that your policy template may not look identical; there is more than one way to complete this exercise.

If you're following the lessons in order, please move on to [Lesson 19](https://github.com/flexera-public/policy_engine_training/blob/main/lessons/19_cwf/README.md).
