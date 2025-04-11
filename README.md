# Flexera Policy Development Training

This Github repository contains lessons and resources intended to train someone on policy development.

**This is a work in progress. Please use the [Issues](https://github.com/flexera-public/policy_engine_training/issues) page both for errors and general feedback.**

## Prerequisites

* These lessons focus specifically on *developing* policy templates and assume that you are already familiar with making use of policy templates as an end-user in the Flexera One platform. Some basics are covered in the first lesson, but if you're unfamiliar with policy templates more generally, it is recommended that you review the [Policy Engine Documentation](https://docs.flexera.com/flexera/EN/Automation/AboutPolicies.htm) and experiment with using policy templates from the Policy Catalog.

* You will need a basic level of familiarity with REST APIs and how they work. The [Learning REST APIs](https://www.linkedin.com/learning/learning-rest-apis/welcome?u=2217194) course on LinkedIn Learning is recommended, but many other resources for learning about REST APIs are available on most technical learning platforms.

* You will need a basic level of proficiency in JavaScript. If you've never used JavaScript, but are already well-versed in another high-level programming language, you should be able to pick it up quickly. There are many resources available for learning JavaScript, such as the [JavaScript Essential Training](https://www.linkedin.com/learning/javascript-essential-training/javascript-the-soil-from-which-the-modern-web-grows?u=2217194) course on LinkedIn Learning, if you need to get up to speed.

* While Git is only very lightly used during these lessons, some familiarity with Git and version control is recommended if you intend to develop policy templates. Resources for learning how to use Git are widely available, such as the [Git Essential Training](https://www.linkedin.com/learning/git-essential-training-19417064/get-started-with-git?u=2217194) course on LinkedIn Learning.

## Where to Begin?

We recommended that you begin by following the steps in the [Initial Setup](https://github.com/flexera-public/policy_engine_training/blob/main/setup/README.md) guide to create a functioning development environment on your local workstation, and then proceed to [Lesson 01](https://github.com/flexera-public/policy_engine_training/blob/main/lessons/01_introduction/README.md).

## Syllabus

*Note: Each lesson builds upon ideas and concepts in the previous lesson. We recommended that you proceed in order rather than skip around.*

* **[Initial Setup](https://github.com/flexera-public/policy_engine_training/blob/main/setup/README.md)**
  * **[Windows (PowerShell)](https://github.com/flexera-public/policy_engine_training/blob/main/setup/windows_powershell/README.md)**
  * **[Windows (WSL2)](https://github.com/flexera-public/policy_engine_training/blob/main/setup/windows_wsl2/README.md)**
  * **[macOS](https://github.com/flexera-public/policy_engine_training/blob/main/setup/macos/README.md)**
  * **[Linux](https://github.com/flexera-public/policy_engine_training/blob/main/setup/linux/README.md)**
* **[Lesson 01](https://github.com/flexera-public/policy_engine_training/blob/main/lessons/01_introduction/README.md) - Introduction:** A basic description of policy templates, what they do, and how they are used.
* **[Lesson 02](https://github.com/flexera-public/policy_engine_training/blob/main/lessons/02_hello_world/README.md) - Hello World:** Create a very basic policy template.
* **[Lesson 03](https://github.com/flexera-public/policy_engine_training/blob/main/lessons/03_parameters/README.md) - Parameters:** Learn how to enable user input in policy templates with parameters.
  * **[Exercise 01](https://github.com/flexera-public/policy_engine_training/blob/main/exercises/01_summation/README.md) - Summation:** Create a policy template to report the sum of two numbers.
* **[Lesson 04](https://github.com/flexera-public/policy_engine_training/blob/main/lessons/04_escalations/README.md) - Escalations:** Learn how to escalate incidents in policy templates.
* **[Lesson 05](https://github.com/flexera-public/policy_engine_training/blob/main/lessons/05_fpt/README.md) - fpt:** Deep dive into the fpt command line tool.
* **[Lesson 06](https://github.com/flexera-public/policy_engine_training/blob/main/lessons/06_api/README.md) - APIs:** Learn how to call REST APIs within a policy template.
  * **[Exercise 02](https://github.com/flexera-public/policy_engine_training/blob/main/exercises/02_tutorial_templates/README.md) - Tutorial Policy Templates:** Create a policy template to report a list of tutorial policy templates.
* **[Lesson 07](https://github.com/flexera-public/policy_engine_training/blob/main/lessons/07_pagination/README.md) - Pagination:** Learn how to handle paginated results from REST APIs.
* **[Lesson 08](https://github.com/flexera-public/policy_engine_training/blob/main/lessons/08_underscore/README.md) - Underscore.js:** Learn more about the Underscore.js library included in the policy engine.
* **[Lesson 09](https://github.com/flexera-public/policy_engine_training/blob/main/lessons/09_relational_data/README.md) - Relational Data:** Learn how to relate data from two different datasources..
* **[Lesson 10](https://github.com/flexera-public/policy_engine_training/blob/main/lessons/10_debugging/README.md) - Debugging:** Learn the flow and process for debugging malfunctioning policy templates.
  * **[Exercise 03](https://github.com/flexera-public/policy_engine_training/blob/main/exercises/03_employees/README.md) - Employees:** Create a policy template to report a list of employees and their department heads
* **[Lesson 11](https://github.com/flexera-public/policy_engine_training/blob/main/lessons/11_request_scripts/README.md) - Request Scripts:** Learn how to encapsulate API requests within script blocks.
* **[Lesson 12](https://github.com/flexera-public/policy_engine_training/blob/main/lessons/12_iterating/README.md) - Iterating:** Learn how to iterate through a datasource to make multiple API requests.
* **[Lesson 13](https://github.com/flexera-public/policy_engine_training/blob/main/lessons/13_optimization/README.md) - Optimization:** Learn how to optimize policy templates for lower memory usage and faster execution.
* **[Lesson 14](https://github.com/flexera-public/policy_engine_training/blob/main/lessons/14_misc/README.md) - Miscellaneous:** Learn a few miscellaneous things not covered in previous lessons.
  * **[Exercise 04](https://github.com/flexera-public/policy_engine_training/blob/main/exercises/04_departments/README.md) - Departments:** Create a policy template to reported detailed information about an organization's departments.
* **[Lesson 15](https://github.com/flexera-public/policy_engine_training/blob/main/lessons/15_best_practices/README.md) - Best Practices:** Learn some best practices for policy template formatting.
* **[Lesson 16](https://github.com/flexera-public/policy_engine_training/blob/main/lessons/16_xml/README.md) - XML & Text Responses:** Learn how to parse XML and text responses from APIs.
* **[Lesson 17](https://github.com/flexera-public/policy_engine_training/blob/main/lessons/17_local_js/README.md) - Local JavaScript Testing:** Learn how to test script blocks locally using node.js.
* **[Lesson 18](https://github.com/flexera-public/policy_engine_training/blob/main/lessons/18_go_template/README.md) - Go Template Syntax:** Learn how to use Go template syntax and Markdown in incidents.
  * **[Exercise 05](https://github.com/flexera-public/policy_engine_training/blob/main/exercises/05_employees_table/README.md) - Employees Table:** Modify the policy template from Exercise 03 to present the results as a table using Go template syntax and Markdown.
* **[Lesson 19](https://github.com/flexera-public/policy_engine_training/blob/main/lessons/19_cwf/README.md) - Cloud Workflow:** Learn about how Cloud Workflow Language can be used to add policy actions.
* **[Lesson 20](https://github.com/flexera-public/policy_engine_training/blob/main/lessons/20_further_learning/README.md) - Further Learning:** Learn where to go to continue learning about policy development.

## About The Lessons

These lessons are intended to get someone familiar with policy template development by starting simple and gradually introducing new concepts along the way. Most the lessons will walk you through creating or modifying a policy template in order to achieve specific functionality. The actual development will occur on your local workstation, but each lesson will have a "solution" folder containing correct versions of the assets that you will be creating during the lesson as a reference.

These lessons will *not* provide full coverage of every aspect of the policy template language. Once you've completed these lessons and are confident in your understanding of their contents, we recommended that you review the official documentation for more detail. Scroll down to the Reference Materials section for more information.

**NOTE: Some aspects of this training require access to a functioning Flexera One organization. It is highly recommended that you have access to a UAT or other low risk environment to test in. None of the policy templates developed in these lessons have the potential to do anything destructive, but we recommended that you not use a production Flexera One organization to avoid cluttering it with training assets.**

**If you do not have this access, you can still follow along and write policy templates, but you may need to read along the sections that involve the Flexera One user interface and the fpt command line tool rather than perform those steps directly.**

## Reference Materials

* [Policy Engine Documentation](https://docs.flexera.com/flexera/EN/Automation/AboutPolicies.htm)
* [Policy Template Language Documentation](https://docs.flexera.com/flexera/EN/Automation/PTL.htm)
* [Flexera Policy Templates GitHub Repository](https://github.com/flexera-public/policy_templates)
* [Cloud Workflow Language Documentation](https://docs.flexera.com/flexera/EN/Automation/CWL.htm)
* [Flexera One API Documentation](https://developer.flexera.com/)
* [Flexera CMP Documentation](https://docs.rightscale.com/)
* [fpt Documentation](https://github.com/flexera-public/policy_sdk/blob/master/cmd/fpt/README.md)

## Other Useful Resources

* [Underscore.js](https://underscorejs.org/): Documentation for the Underscore.js library.
* [Go Template](https://pkg.go.dev/text/template): Information on Go template syntax.
* [Markdown](https://www.markdownguide.org/): Information on Markdown.
* [LinkedIn Learning](https://www.linkedin.com/learning/): Training on JavaScript, public clouds, APIs, and other concepts relevant to the policy engine. The [JavaScript Essential Training](https://www.linkedin.com/learning/javascript-essential-training/javascript-the-soil-from-which-the-modern-web-grows?u=2217194) course should cover what is needed for policy template development.

## Repository Information

*Note: This is not of interest if you're just here to learn policy development. This section is intended for developers and other interested parties that need more detailed information about how this GitHub repository is configured.*

### Pull Requests

Anyone can make a pull request to the "main" branch. Pull requests can only be merged once the pull request has been reviewed and approved by at least one person on the "Policy Developers" team. This team consists of Flexera employees with expertise on policy development.

When a pull request is made, the following automated tests will occur:

* [CodeQL](https://codeql.github.com/) will check the code in the pull request for vulnerabilities.
* [Dangerfile](https://danger.systems/guides/dangerfile) will do tests for syntax and spelling. The [Dangerfile file](https://github.com/flexera-public/policy_engine_training/blob/main/Dangerfile) in the root directory of the repository, along with the files in the [.dangerfile directory](https://github.com/flexera-public/policy_engine_training/blob/main/.dangerfile/), contain the specific tests that are performed.

Any issues identified by automated testing will be raised as notes within the pull request as either warnings or errors. There is no hard requirement for all tests to pass to merge a pull request but every warning or error should be reviewed in detail to ensure it hasn't identified a legitimate problem.

### Branch Structure

The "main" branch is the production branch intended for day-to-day usage. Other branches are for development and, once development work is done, should be merged into the "main" branch via pull request. Branches should be deleted after being merged.

### Directory Structure

* **/**: The root directory of the repository contains various configuration files used by git, GitHub, Dangerfile, VSCode, etc. as well as this [README.md](https://github.com/flexera-public/policy_engine_training/blob/main/README.md) file.
* **/.dangerfile**: Contains various tests that are executed via [Dangerfile](https://danger.systems/guides/dangerfile) when a pull request is made to the "main" branch.
* **/.data**: Contains fake data for simulating API responses.
* **/.github**: Contains Github-specific configurations, such as issue templates and workflows.
* **/.vscode**: Contains configuration data for VSCode.
* **/exercises**: Contains exercises where the student needs to build their own policy template.
* **/lessons**: Contains lessons with interactive development to learn policy template development.
* **/setup**: Contains instructions for the student to configure their local workstation.

### GitHub Workflows

The following GitHub Workflows perform automated tasks for this repository:

* **[Test Changes](https://github.com/flexera-public/policy_engine_training/blob/main/.github/workflows/test-changes.yaml)**: Performs Dangerfile testing when a pull request to the "main" branch is made.
