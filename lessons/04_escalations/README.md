# Flexera Policy Development - Lesson 04 - Escalations

Policy templates can perform escalations based on raised incidents. The most common form of escalation is an email. When an incident is escalated via email, the incident itself will be emailed to a list of email addresses.

In this lesson, we're going to edit the "hello_world.pt" policy template to perform such an escalation.

## Step 1: Update the Version

Just like before, let's update the policy template to version `0.3.0` by updating the `info` block like so:

```ruby
info(
  version: "0.3.0"
)
```

## Step 2: Create a Parameter Block

Above the existing `parameter` block, add the following new `parameter` block:

```ruby
parameter "param_email" do
  type "list"
  label "Email Addresses"
  description "A list of email addresses to notify."
  default []
end
```

Unlike the other parameter, this parameter has a `type` of list. This means the user can enter multiple string values. In this case, the user would enter multiple email addresses. The default value of [] means that, by default, the list is empty and nobody will be emailed.

## Step 3: Add Escalation to Policy Block

We're now going to add an `escalate` field to the policy block. Update the policy block like so, with the `escalate` field right after the `check` field:

```ruby
policy "pol_hello_world" do
  validate $ds_hello_world do
    summary_template "{{ data.output }}"
    detail_template "{{ data.output }}"
    check eq(0, 1)
    escalate $esc_email
  end
end
```

Now when an incident is raised, the policy template will escalate to `$esc_email`.

## Step 4: Add Escalation Block

At the end of the policy template, add the following `escalation` block:

```ruby
escalation "esc_email" do
  automatic true
  label "Send Email"
  description "Send incident email"
  email $param_email
end
```

An `escalation` block dictates a course of action for an escalation. The fields indicate the following:

* `automatic` contains a boolean statement that indicates whether the escalation happens automatically when an incident is raised. In this case, it is set to "true", so it will.
* `label` and `description` contain the short and long form descriptions of what the escalation does for the UI.
* `email` contains the list of email addresses to email. In this case, it's going to send it to whatever the user specified in the parameter we added.

## Step 5: Testing

Now that we have a complete policy template, it's time to test it. This time, we're going to do an `fpt check` on the policy template first. This doesn't run the policy template, but tests it for any syntax errors or other problems.

```bash
fpt check hello_world.pt
```

If the command completes with no errors or output, that means the policy template has no issues and you should be clear to run the policy template. Since we're testing whether the policy can send an email, we'll want to include an email parameter. Since this parameter is a list, we'll want to format it like a typical list in most programming languages, encapsulated inside of single quotes, as shown below.

```bash
fpt run hello_world.pt param_email='["not_a_real@emailaddress.com", "also_not_real@emailaddress.com"]'
```

In [Lesson 05](https://github.com/flexera-public/policy_engine_training/blob/main/lessons/05_fpt/README.md), we'll use our Hello World policy template to learn a bit more about the fpt command line tool.
