# Flexera Policy Development - Initial Setup - macOS

## Step 1: Command Line

You will need access to a command line interface. macOS comes with a zsh terminal built in that you can use. Simply type *Terminal* in the application search and you should find it right away.

## Step 2: Homebrew

The Homebrew tool will be used to install some command line applications. If you don't already have Homebrew installed, run this command to install it:

```zsh
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

## Step 3: Node.js

Node.js will be used in some lessons as a simple way to quickly run JavaScript files. You can use a different interpreter if you prefer, but the lessons will give instructions using Node.js

Using Homebrew, you can install Node.js with the following command:

```zsh
brew install node
```

Once Node.js is installed, run the following command to install the Underscore.js library:

```zsh
npm install underscore
```

## Step 4: Git

To interact with this GitHub repository, you will need the git command line tool. Using Homebrew, you can install git with the following command:

```zsh
brew install git
```

## Step 5: Clone the Git Repository

Now that we have git installed, we need to clone this repository locally. You can do this by running the following command in your command line:

```zsh
git clone https://github.com/flexera-public/policy_engine_training ~/policy_engine_training
```

## Step 6: VSCode

In order to develop policy templates, you will need a text editor. Our recommendation is VSCode; it is free, available on all platforms, and this repository has built-in configurations for it. If you prefer to use a different editor, that is fine too.

To install VSCode, please follow the instructions on the [VSCode website](https://code.visualstudio.com/download) for your specific operating system.

## Step 7: fpt

fpt is Flexera's native policy template development and testing tool. Run the following commands to download fpt and configure bash to add it to your PATH.

```zsh
wget https://binaries.rightscale.com/rsbin/fpt/v1.5.0/fpt-darwin-amd64.tgz -O ~/fpt-darwin-amd64.tgz

tar -xzvf ~/fpt-linux-amd64.tgz -C ~/

echo 'export PATH=$PATH:$HOME/fpt' >> ~/.zshrc

source ~/.zshrc
```

Once you've completed the installation steps below, you can verify that fpt is installed with the `fpt -v` command, like so:

```zsh
> fpt -v
fpt v1.5.0 - 2022-04-27 21:17:14 - 4a0a2e0052c9081144087448231e8b6fb6306906
```

Note: The version number you see may be higher than the above if fpt has been updated since these lessons were created.

## Step 8: Configure fpt for Flexera One

If you do not have access to a Flexera One organization, you should skip this section. You will still be able to follow the tutorial, but you will not be able to do the sections that involve the `fpt` command.

In order to configure `fpt`, you will need access to a Flexera One organization with access to Flexera's automation engine. While nothing that will be done in this tutorial is destructive, we recommended that you use a UAT or test account for this tutorial to avoid cluttering a production environment.

### Gather Necessary Info

#### Create / Obtain API Token

The first thing you'll need is an API token for Flexera One. [Follow the documentation to generate one](https://docs.flexera.com/flexera/EN/FlexeraAPI/GenerateRefreshToken.htm) and then save it somewhere secure. We will need this token later.

#### Obtain Flexera One Project ID

What the `fpt` tool refers to as an Account ID is actually the Project ID. You can obtain this from the address bar in your browser while visiting the Automation → Templates page. For example, for the following URL, the Project ID would be **78901**. Save this information somewhere secure for later use.

```url
https://app.flexera.com/orgs/23456/automation/projects/78901/policy-templates
```

#### Obtain Flexera One API Host

The final piece of information we'll need is the API host. You can infer this from the specific geographic instance of Flexera One that you log into:

* app.flexera.com: `governance-3.rightscale.com` or `governance-4.rightscale.com`
* app.flexera.eu: `api.eu-central-1.policy-eu.flexeraeng.com`
* app.flexera.au: `api.ap-southeast-2.policy-apac.flexeraeng.com`

Unfortunately, there is not an easy way to know which of the above two hosts is correct if you use the `app.flexera.com` instance. We recommended that you try `governance-4.rightscale.com` first and then redo the configuration below with `governance-3.rightscale.com` instead if you run into problems.

### Configure fpt

Now that we have all of the information we need, it is time to configure fpt. Run the following command from your command line, replacing `example` with a simple human-readable name for the Flexera organization.

```zsh
fpt config account example
```

When prompted, enter the information we gathered above.

* `Account ID` should be the Project ID we obtained from the URL in the address bar.
* `API endpoint host` should be the matching endpoint from the table above.
* `Refresh token` should be the one you generated in Flexera One from the instructions in the documentation.
* `Flexera One` should always be `true`. The RightScale dashboard is defunct and no longer in use.

You should be able to verify that your configuration was put into place with the following command:

```zsh
fpt config show
```

If you run into issues when attempting to use the configuration, simply rerun the `fpt config account` command for the account in question to reconfigure it.

## Step 9: Create an Automation Credential in Flexera One

In order to make calls to the Flexera API via the policy engine, we'll need to create a credential in Flexera One. Credentials can be added in the Automation → Credentials section of the Flexera One UI. Use the following settings for your credential:

* **Credential Type**: OAuth2
* **Credential Name**: Can be any arbitrary value. Should be set to something that makes it easy to identify the credential.
* **Credential Identifier**: Can be any arbitrary value. Whatever identifier makes the most sense.
* **Credential Description**: Can be any arbitrary value. Describe the credential here for anyone else that might need to know what it is used for.
* **Grant Type**: Refresh Token
* **Token URL**: Depends on the region.
  * **North America**: https:&#8203;//login.flexera.com/oidc/token
  * **Europe**: https:&#8203;//login.flexera.eu/oidc/token
  * **APAC**: https:&#8203;//login.flexera.au/oidc/token
* **Client Authentication Method**: Token
* **Token**: The API token you generated in Step 6.
* **Additional Headers**: Leave blank.
* **Scopes**: Leave blank.
* **Provider**: flexera

Note: Your user in Flexera One will need access to everything in the "Automation" category in order to make proper use of this credential in these lessons.

## Step 10: Launch VSCode

The final step is to launch VSCode and verify everything works as expected. You should be able to run the following commands to launch VSCode with the repository loaded in:

```zsh
cd ~/policy_engine_training
code .
```

VSCode should launch. This repository contains configuration files for VSCode to recommend certain extensions to assist in policy template development, so if you are prompted to install extensions, we recommended that you install them.

You should now be configured and ready for the tutorial. Please proceed to [Lesson 01](https://github.com/flexera-public/policy_engine_training/blob/main/01_introduction/README.md).
