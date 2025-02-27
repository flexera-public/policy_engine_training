# Flexera Policy Development - Lesson 09 - Debugging

So far, we've only been focused on how to build a policy template, but sometimes you build a policy template, and it doesn't work correctly, or you're tasked with repairing a broken policy template developed by someone else. In this lesson, we'll go over some common problems and how to debug and solve them.

## Step 1: Copy the Broken Template

For this lesson, we'll be using a pre-written template that is already broken and fixing it. You should recognize this template, as it is the one we developed in the previous lesson.

Please copy this template to the root of the repository. You should be able to do this using the below command:

### Windows (PowerShell)

```powershell
Copy-Item -Path "09_debugging\solutions\list_policy_templates_broken.pt" -Destination .
```

### Windows (WSL2), macOS, and Linux

```bash
cp 09_debugging/solutions/list_policy_templates_broken.pt .
```
