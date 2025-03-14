# Flexera Policy Development - Lesson 20 - Further Learning

Congratulations! If you've made it this far, and followed along with all of the lessons, you should have a good basic grasp of policy development. Before proceeding, it is recommended that you take some time to experiment! Make your own changes to "hello_world.pt" or "list_policy_templates.pt" and see what happens when you run them. Experiment with making new policy templates that use various Flexera APIs.

This will solidify what you've learned here, and you can always come back to these lessons as a reference if you get stuck. Inside this repository, each lesson includes a "solution" directory that contains all of the artifacts produced during the lesson that you can use to start over if you break something.

## Policy Template Language Documentation

The [Policy Template Language Documentation](https://docs.flexera.com/flexera/EN/Automation/PTL.htm) is very useful...if you already grasp how everything works. Fortunately, you should now be in a place where you don't need the docs to teach you that, so you should read through them to learn more detailed information, including additional fields and functionality, about the policy template language.

While all of the information in the documentation is useful, it's worth reviewing the following in particular:

* [Reserved Word Reference](https://docs.flexera.com/flexera/EN/Automation/ReservedWordReference.htm): This is a full list of all of the policy template language reserved words and what they do. Examples we've used in the lessons include "rs_project_id", "response", and "col_item".
* [Functions](https://docs.flexera.com/flexera/EN/Automation/Functions.htm): This is a full list of all of the policy template language functions and what they do. Examples we've used in the lessons include "val", "eq", and "jmes_path".

Note that you may see reference to block types not covered in these lessons, such as `resolution`, `resources`, or `permission`. These are largely defunct now and should not be used.

## Flexera Policy Templates GitHub Repository

The [Flexera Policy Templates GitHub Repository](https://github.com/flexera-public/policy_templates) is where Flexera stores all of the policy templates used in the public Policy Catalog. Reviewing these policy templates can give you a good grasp of how to solve specific problems and can also provide examples you can use in your own policy templates, saving you the effort of reinventing the wheel unnecessarily.

## Cloud Workflow Language Documentation

The Cloud Workflow Language is essentially a high-level programming language unto itself, which is why it is not covered in detail in these lessons. To learn more, it is recommended that you read through the [Cloud Workflow Language Documentation](https://docs.flexera.com/flexera/EN/Automation/CWL.htm).

Note that the Cloud Workflow Language was originally developed for the Flexera Cloud Management Platform. You will see references to resources beginning with the `@` symbol and other artifacts specific to the Cloud Management Platform that you can largely ignore for policy template development. The main things to focus on are the basic syntax of the language itself as well as how to make API calls.
