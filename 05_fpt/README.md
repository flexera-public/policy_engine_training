# Flexera Policy Development - Lesson 05 - fpt

So far, we've used fpt to check the syntax of policy templates and to run them. fpt also offers other functionality that can be very useful in policy template development which we'll explore here.

Note: If you are not able to use fpt because you do not have access to a Flexera One account, it is recommended that you still read along to get a sense of how to use fpt before moving on to the next lesson.

## Step 1: --help

fpt has a lot of documentation built right into the fpt command itself. Run the following command:

```bash
fpt --help
```

You should see a general list of all of the command line options for fpt. If you want to know more about a specific command, add `--help` after the command. As an example, run this command:

```bash
fpt run --help
```

You should see a brief description of what the run option does and the various flags you can use with it.

## Step 2: retrieve_data

One of the most useful functions of fpt is the ability to retrieve a datasource and store its contents as a local file. This can be handy for debugging or when you need to know what the output of a specific API call looks like.

Let's test this with our Hello World policy template. First, let's view the help info for *retrieve_data*:

```bash
fpt retrieve_data --help
```

Based on the help information, we know we can use the `-n` flag to specify the datasource we want to pull. Let's do that now by running this command:

```bash
fpt retrieve_data hello_world.pt -n ds_hello_world
```

If the command completed successfully, you should see the message "Wrote datasource_ds_hello_world.json" and a new file, datasource_ds_hello_world.json, should have appeared in VSCode. Click on the file and it should look like this:

```json
{
  "output": "Hello World"
}
```

## Step 3: script

fpt can also be used to run individual scripts within a policy template. This can be useful for quickly debugging scripts. Let's view the help info for *script*:

```bash
fpt script --help
```

Based on the help output, functionality for *script* is very similar to *retrieve_data*. We can specify the script we want to run using the `-n` flag and set values for the various parameters in the script.

One key difference is we can use the @ symbol to indicate a local file as a value for a parameter; this can be used in conjunction with *retrieve_data* to send in datasource data to test a script.

Let's run the script in the Hello World policy template. Run the following command:

```bash
fpt script 05_fpt/solution/hello_world.pt -n js_hello_world greeting_target="Japan"
```

If all went according to plan, you should see output that looks like this:

```text
Running script "js_hello_world" from hello_world.pt and writing hello_world to out.json
JavaScript finished, duration=12.676�s
```

The out.json file will contain the contents of the result variable for the script. In this case, it should look like this:

```json
{
  "output": "Hello Japan"
}
```

## Step 4: Managing Multiple Organizations

Some users may need to do work for multiple Flexera organizations. Maybe you're a Flexera employee or contractor working with several clients. Maybe you're a Flexera user but have both a UAT and a production organization.

fpt allows you to work with multiple organizations by adding each one as its own account. You should be able to see the account you added during the initial setup with this command:

```bash
fpt config show
```

This should list every account you've added. You can add more accounts just like you added the first one with the "fpt config account" command. When performing a retrieve_data or run on a policy template, you can specify the account with the --account parameter, like so:

```bash
fpt run policy_template.pt --account="myaccount"
```

## Common Errors

Occasionally, something will go wrong when using fpt. Most errors are self-explanatory and easy to fix, but there are a couple that may be a bit perplexing and these are described below.

### ERROR: Data Retrieval can't take longer than 2m0s

While policy templates running in the Flexera platform only timeout if they take longer than an hour to execute (or if an individual datasource takes longer than 30 minutes), fpt can only run for 2 minutes and will give this error if execution takes longer than that.

There's no way to extend this limit, so workarounds are necessary. The best workaround is to shrink the data set you're working with, either by filtering down the data using parameters already in your policy template, or by adding temporary debug code that shrinks data sets to enable execution to complete more quickly.

### ERROR: credential: not found

This error usually means you've specified a credential that does not exist. Make sure the credential exists, and make sure you're using the credential *identifier*, not the name, in your fpt command if the two aren't identical.

This can also happen if you've configured the wrong host in fpt for your account. This most commonly happens for users on the app.flexera.com shard, since there are two possible hosts; governance-3.rightscale.com and governance-4.rightscale.com. This can be fixed by rerunning the fpt config command and setting the correct host.

Now that we've gone over the most common uses for fpt, move on to [Lesson 06](https://github.com/flexera-public/policy_engine_training/blob/main/06_api/README.md), where we will write a brand new policy template and make use of APIs.
