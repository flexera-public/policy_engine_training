# Flexera Policy Development Training

This Github repository contains lessons and resources intended to train someone on policy development.

**This is a work in progress. New lessons coming soon!**

## About The Lessons

These lessons are intended to get someone familiar with policy template development by starting simple and gradually introducing new concepts along the way. Most the lessons will walk you through creating or modifying a policy template in order to achieve specific functionality. The actual development will occur on your local workstation, but each lesson will have a "solution" folder containing correct versions of the assets that you will be creating during the lesson as a reference.

These lessons will *not* provide full coverage of every aspect of the policy template language. Once you've completed these lessons and are confident in your understanding of their contents, it is recommended that you review the official documentation for more detail. Scroll down to the Additional Resources section for more information.

**NOTE: Some aspects of this training require access to a functioning Flexera One organization. It is highly recommended that you have access to a UAT or other low risk environment to test in. None of the policy templates developed in these lessons have the potential to do anything destructive, but it is recommended that you not use a production Flexera One organization to avoid cluttering it with training assets.**

**If you do not have this access, you can still follow along and write policy templates, but you may need to read along the sections that involve the Flexera One user interface and the fpt command line tool rather than perform those steps directly.**

## Where to Begin?

It is recommended that you begin by following the steps in the [Initial Setup](https://github.com/flexera-public/policy_engine_training/blob/main/00_setup) guide to create a functioning development environment on your local workstation, and then proceed to [Lesson 01](https://github.com/flexera-public/policy_engine_training/blob/main/01_introduction).

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
* [Team Treehouse](https://teamtreehouse.com/): Training on various programming languages. JavaScript is used in policy templates, and general coding knowledge is a requirement for policy development.
* [LinkedIn Learning](https://www.linkedin.com/learning/): Training on JavaScript, public clouds, APIs, and other concepts relevant to the policy engine.
