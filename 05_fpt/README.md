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

Let's test this with our Hello World policy template. First, let's view the help info for retrieve_data:

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

