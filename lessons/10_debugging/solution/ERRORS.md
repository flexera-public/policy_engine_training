# Lesson 09 - Error List

## Line 13

Line incorrectly begins with "paraeter" instead of "parameter".

## Line 43

The reference to the "auth_flexera" `credential` block is missing the preceding `$` symbol. It should be "$auth_flexera", not "auth_flexera".

## Line 61

The second parameter of the `run_script` field should be "ds_policy_lesson_list", not "ds_policy_list".

## Line 71

The variable is incorrectly spelled. It should be "policy_table", not "policy_tablee"

## Line 74

The _.map function is mapping `policy_lesson_list` when it should be mapping `policy_templates`.

## Lines 94/115

The `escalation` block is named `esc_email_list` but is referenced as `esc_email` in the `policy` block.
