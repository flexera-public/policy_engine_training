# Flexera Policy Development Training

This Github repository contains lessons and resources intended to train someone on policy development.

**This is a work in progress. Please use the [Issues](https://github.com/flexera-public/policy_engine_training/issues) page both for errors and general feedback.**

## About The Lessons

These lessons are intended to get someone familiar with policy template development by starting simple and gradually introducing new concepts along the way. Most the lessons will walk you through creating or modifying a policy template in order to achieve specific functionality. The actual development will occur on your local workstation, but each lesson will have a "solution" folder containing correct versions of the assets that you will be creating during the lesson as a reference.

These lessons will *not* provide full coverage of every aspect of the policy template language. Once you've completed these lessons and are confident in your understanding of their contents, we recommended that you review the official documentation for more detail. Scroll down to the Additional Resources section for more information.

**NOTE: Some aspects of this training require access to a functioning Flexera One organization. It is highly recommended that you have access to a UAT or other low risk environment to test in. None of the policy templates developed in these lessons have the potential to do anything destructive, but we recommended that you not use a production Flexera One organization to avoid cluttering it with training assets.**

**If you do not have this access, you can still follow along and write policy templates, but you may need to read along the sections that involve the Flexera One user interface and the fpt command line tool rather than perform those steps directly.**

## Where to Begin?

We recommended that you begin by following the steps in the [Initial Setup](https://github.com/flexera-public/policy_engine_training/blob/main/00_setup/README.md) guide to create a functioning development environment on your local workstation, and then proceed to [Lesson 01](https://github.com/flexera-public/policy_engine_training/blob/main/01_introduction/README.md).

## Additional Resources

Resources specific to Flexera and the Policy Engine:

* [Policy Engine Documentation](https://docs.flexera.com/flexera/EN/Automation/AboutPolicies.htm)
* [Policy Template Language Documentation](https://docs.flexera.com/flexera/EN/Automation/PTL.htm)
* [Flexera Policy Templates GitHub Repository](https://github.com/flexera-public/policy_templates)
* [Cloud Workflow Language Documentation](https://docs.flexera.com/flexera/EN/Automation/CWL.htm)
* [Flexera One API Documentation](https://developer.flexera.com/)
* [Flexera CMP Documentation](https://docs.rightscale.com/)
* [fpt Documentation](https://github.com/flexera-public/policy_sdk/blob/master/cmd/fpt/README.md)

General Resources:

* [Underscore.js](https://underscorejs.org/): Documentation for the Underscore.js library.
* [Go Template](https://pkg.go.dev/text/template): Information on Go template syntax.
* [Markdown](https://www.markdownguide.org/): Information on Markdown.
* [Team Treehouse](https://teamtreehouse.com/): Training on various programming languages. JavaScript is used in policy templates, and general coding knowledge is a requirement for policy development.
* [LinkedIn Learning](https://www.linkedin.com/learning/): Training on JavaScript, public clouds, APIs, and other concepts relevant to the policy engine.

## Syllabus

Note: Each lesson builds upon ideas and concepts in the previous lesson. We recommended that you proceed in order rather than skip around.

* **[Initial Setup](https://github.com/flexera-public/policy_engine_training/blob/main/00_setup/README.md)**
  * **[Windows (PowerShell)](https://github.com/flexera-public/policy_engine_training/blob/main/00_setup/windows_powershell/README.md)**
  * **[Windows (WSL2)](https://github.com/flexera-public/policy_engine_training/blob/main/00_setup/windows_wsl2/README.md)**
  * **[macOS](https://github.com/flexera-public/policy_engine_training/blob/main/00_setup/macos/README.md)**
  * **[Linux](https://github.com/flexera-public/policy_engine_training/blob/main/00_setup/linux/README.md)**
* **[Lesson 01](https://github.com/flexera-public/policy_engine_training/blob/main/01_introduction/README.md) - Introduction:** A basic description of policy templates, what they do, and how they are used.
* **[Lesson 02](https://github.com/flexera-public/policy_engine_training/blob/main/02_hello_world/README.md) - Hello World:** Create a very basic policy template.
* **[Lesson 03](https://github.com/flexera-public/policy_engine_training/blob/main/03_parameters/README.md) - Parameters:** Learn how to enable user input in policy templates with parameters.
* **[Lesson 04](https://github.com/flexera-public/policy_engine_training/blob/main/04_escalations/README.md) - Escalations:** Learn how to escalate incidents in policy templates.
* **[Lesson 05](https://github.com/flexera-public/policy_engine_training/blob/main/05_fpt/README.md) - fpt:** Deep dive into the fpt command line tool.
* **[Lesson 06](https://github.com/flexera-public/policy_engine_training/blob/main/06_api/README.md) - APIs:** Learn how to call REST APIs within a policy template.
* **[Lesson 07](https://github.com/flexera-public/policy_engine_training/blob/main/07_pagination/README.md) - Pagination:** Learn how to handle paginated results from REST APIs.
* **[Lesson 08](https://github.com/flexera-public/policy_engine_training/blob/main/08_underscore/README.md) - Underscore.js:** Learn more about the Underscore.js library included in the policy engine.
* **[Lesson 09](https://github.com/flexera-public/policy_engine_training/blob/main/09_relational_data/README.md) - Relational Data:** Learn how to relate data from two different datasources.
* **[Lesson 10](https://github.com/flexera-public/policy_engine_training/blob/main/10_debugging/README.md) - Debugging:** Learn the flow and process for debugging malfunctioning policy templates.
* **[Lesson 11](https://github.com/flexera-public/policy_engine_training/blob/main/11_request_scripts/README.md) - Request Scripts:** Learn how to encapsulate API requests within script blocks.
* **[Lesson 12](https://github.com/flexera-public/policy_engine_training/blob/main/12_iterating/README.md) - Iterating:** Learn how to iterate through a datasource to make multiple API requests.
* **[Lesson 13](https://github.com/flexera-public/policy_engine_training/blob/main/13_optimization/README.md) - Optimization:** Learn how to optimize policy templates for lower memory usage and faster execution.
* **[Lesson 14](https://github.com/flexera-public/policy_engine_training/blob/main/14_misc/README.md) - Miscellaneous:** Learn a few miscellaneous things not covered in previous lessons.
* **[Lesson 15](https://github.com/flexera-public/policy_engine_training/blob/main/15_cwf/README.md) - Cloud Workflow:** Learn about how Cloud Workflow language can be used to add policy actions.
* **[Lesson 16](https://github.com/flexera-public/policy_engine_training/blob/main/16_best_practices/README.md) - Best Practices:** Learn some best practices for policy template formatting.
* **[Lesson 17](https://github.com/flexera-public/policy_engine_training/blob/main/17_xml/README.md) - XML & Text Responses:** Learn how to parse XML and text responses from APIs.
* **[Lesson 18](https://github.com/flexera-public/policy_engine_training/blob/main/18_local_js/README.md) - Local JavaScript Testing:** Learn how to test script blocks locally using node.js.
* **[Lesson 19](https://github.com/flexera-public/policy_engine_training/blob/main/19_go_template/README.md) - Go Template Syntax:** Learn how to use Go template syntax and Markdown in incidents.
* **[Lesson 20](https://github.com/flexera-public/policy_engine_training/blob/main/20_further_learning/README.md) - Further Learning:** Learn where to go to continue learning about policy development.
