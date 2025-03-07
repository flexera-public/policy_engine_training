# Flexera Policy Development - Initial Setup

In order to begin this training, you will need to ensure a series of tools are installed for interacting with the Flexera policy engine. These same tools will be used for policy development proper.

## Step 1: Command Line

You will need access to a command line interface. Every modern operating system comes with one, and in the case of Windows, you have a couple of options.

### Windows - PowerShell

The native, default command line application for Windows is PowerShell. Simply type *PowerShell* in the application search and you should find it right away.

### Windows - WSL2

Windows also offers a Linux command line for users that prefer this. Please consult [Microsoft's documentation](https://learn.microsoft.com/en-us/windows/wsl/install) for instructions if you wish to go this route.

### macOS

macOS comes with a bash terminal built in that you can use. Simply type *Terminal* in the application search and you should find it right away.

### Linux

Most Linux distributions come with a bash or similar terminal out of the box. Please consult the documentation of your specific Linux distribution for more information.

## Step 2: Git

To interact with this GitHub repository, you will need the git command line tool. Please follow the instructions for the specific OS and command line tool you are using.

### Windows - PowerShell

Git for Windows can be [downloaded and installed directly from the Git website](https://git-scm.com/downloads/win). Simply click the link at the top to get the latest version and run the executable file that downloads. Once you've completed the installation steps below, you can verify that git is installed with the `git -v` command like so:

```bash
> git -v
git version 2.43.0
```

### Windows - WSL2

For WSL2, you should install git using the native package manager for whichever Linux distribution you opted to use. For the default, Ubuntu, running the following command in WSL2 should install git for you.

```bash
sudo apt update; sudo apt install git -y
```

### macOS

Git can most easily be installed on macOS using the Homebrew tool. This is a tool that enables macOS to easily download and update command line applications. To install Homebrew, run the following command in the Terminal:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Once Homebrew is installed, you can install git with the following command:

```bash
brew install git
```

### Linux

For Linux, you should install git using the native package manager for your distribution. For Ubuntu, running the following command in GNOME Terminal should install git for you.

```bash
sudo apt update; sudo apt install git -y
```

## Step 3: Clone the Git Repository

Now that we have git installed, we need to clone this repository locally. You can do this by running the following command in your command line:

### Windows - PowerShell

```powershell
git clone https://github.com/flexera-public/policy_engine_training $env:USERPROFILE\policy_engine_training
```

### Windows - WSL2 / macOS / Linux

```bash
git clone https://github.com/flexera-public/policy_engine_training ~/policy_engine_training
```

## Step 4: VSCode

In order to develop policy templates, you will need a text editor. Our recommendation is VSCode; it is free, available on all platforms, and this repository has built-in configurations for it. If you prefer to use a different editor, that is fine too.

To install VSCode, please follow the instructions on the [VSCode website](https://code.visualstudio.com/download) for your specific operating system. Note that, if you're using WSL2, a normal Windows installation of VSCode should natively integrate with it and should not need to be installed from the WSL2 command line.

## Step 5: fpt

fpt is Flexera's native policy template development and testing tool. Installation will vary depending on your operating system and command line configuration. Once you've completed the installation steps below, you can verify that fpt is installed with the `fpt -v` command like so:

```bash
> fpt -v
fpt v1.5.0 - 2022-04-27 21:17:14 - 4a0a2e0052c9081144087448231e8b6fb6306906
```

### Windows - PowerShell

Run the following commands to download fpt and configure PowerShell to add it to your PATH. It is recommended that you restart your PowerShell terminal after doing this to ensure the new configurations are in effect.

```powershell
Invoke-WebRequest -Uri "https://binaries.rightscale.com/rsbin/fpt/v1.5.0/fpt-windows-amd64.zip" -OutFile "$env:USERPROFILE\fpt-windows-amd64.zip"

Expand-Archive -Path "$env:USERPROFILE\fpt-windows-amd64.zip" -DestinationPath "$env:USERPROFILE"

[System.Environment]::SetEnvironmentVariable("PATH", $env:PATH + ";$env:USERPROFILE\fpt", [System.EnvironmentVariableTarget]::User)
```

### Windows - WSL2

For WSL2, we are going to use the Linux binary for fpt. Note that the below assumes you have access to the `wget` command line tool and are using bash; this should be the case for most distributions.

```bash
wget https://binaries.rightscale.com/rsbin/fpt/v1.5.0/fpt-linux-amd64.tgz -O ~/fpt-linux-amd64.tgz

tar -xzvf ~/fpt-linux-amd64.tgz -C ~/

echo 'export PATH=$PATH:$HOME/fpt' >> ~/.bashrc

source ~/.bashrc
```

### macOS

Run the following commands to download fpt and configure zsh to add it to your PATH.

```bash
wget https://binaries.rightscale.com/rsbin/fpt/v1.5.0/fpt-darwin-amd64.tgz -O ~/fpt-darwin-amd64.tgz

tar -xzvf ~/fpt-linux-amd64.tgz -C ~/

echo 'export PATH=$PATH:$HOME/fpt' >> ~/.zshrc

source ~/.zshrc
```

### Linux

Run the following commands to download fpt and configure bash to add it to your PATH. Note that the below assumes you have access to the `wget` command line tool and are using bash; this should be the case for most distributions.

```bash
wget https://binaries.rightscale.com/rsbin/fpt/v1.5.0/fpt-linux-amd64.tgz -O ~/fpt-linux-amd64.tgz

tar -xzvf ~/fpt-linux-amd64.tgz -C ~/

echo 'export PATH=$PATH:$HOME/fpt' >> ~/.bashrc

source ~/.bashrc
```

## Step 6: Configure fpt for Flexera One

If you do not have access to a Flexera One organization, you should skip this section. You will still be able to follow the tutorial, but you will not be able to do the sections that involve the `fpt` command.

In order to configure `fpt`, you will need access to a Flexera One organization with access to Flexera's automation engine. While nothing that will be done in this tutorial is destructive, it is recommended that you use a UAT or test account for this tutorial to avoid cluttering a production environment.

### Gather Necessary Info

#### Create / Obtain API Token

The first thing you'll need is an API token for Flexera One. [Follow the documentation to generate one](https://docs.flexera.com/flexera/EN/FlexeraAPI/GenerateRefreshToken.htm) and then save it somewhere secure. We will need this token later.

#### Obtain Flexera One Project ID

What the `fpt` tool refers to as an Account ID is actually the Project ID. You can obtain this from the address bar in your browser while visiting the Automation -> Templates page. For example, for the following URL, the Project ID would be **78901**. Save this information somewhere secure for later use.

```url
https://app.flexera.com/orgs/23456/automation/projects/78901/policy-templates
```

#### Obtain Flexera One API Host

The final piece of information we'll need is the API host. You can infer this from the specific geographic instance of Flexera One that you log into:

* app.flexera.com: `governance-3.rightscale.com` or `governance-4.rightscale.com`
* app.flexera.eu: `api.eu-central-1.policy-eu.flexeraeng.com`
* app.flexera.au: `api.ap-southeast-2.policy-apac.flexeraeng.com`

Unfortunately, there is not an easy way to know which of the above two hosts is correct if you use the `app.flexera.com` instance. It is recommended that you try `governance-4.rightscale.com` first and then redo the configuration below with `governance-3.rightscale.com` instead if you run into problems.

### Configure fpt

Now that we have all of the information we need, it is time to configure fpt. Run the following command from your command line, replacing `example` with a simple human-readable name for the Flexera organization.

```bash
fpt config account example
```

When prompted, enter the information we gathered above.

* `Account ID` should be the Project ID we obtained from the URL in the address bar.
* `API endpoint host` should be the matching endpoint from the table above.
* `Refresh token` should be the one you generated in Flexera One from the instructions in the documentation.
* `Flexera One` should always be `true`. The RightScale dashboard is defunct and no longer in use.

You should be able to verify that your configuration was put into place with the following command:

```bash
fpt config show
```

If you run into issues when attempting to use the configuration, simply rerun the `fpt config account` command for the account in question to reconfigure it.

## Step 7: Create an Automation Credential in Flexera One

In order to make calls to the Flexera API via the policy engine, we'll need to create a credential in Flexera One. Credentials can be added in the Automation -> Credentials section of the Flexera One UI. Use the following settings for your credential:

* **Credential Type**: OAuth2
* **Credential Name**: Can be any arbitrary value. Should be set to something that makes it easy to identify the credential.
* **Credential Identifier**: Can be any arbitrary value. Whatever identifier makes the most sense.
* **Credential Description**: Can be any arbitrary value. Describe the credential here for anyone else that might need to know what it is used for.
* **Grant Type**: Refresh Token
* **Token URL**: Depends on the region.
  * **North America**: https://login.flexera.com/oidc/token
  * **Europe**: https://login.flexera.eu/oidc/token
  * **APAC**: https://login.flexera.au/oidc/token
* **Client Authentication Method**: Token
* **Token**: The API token you generated in Step 6.
* **Additional Headers**: Leave blank.
* **Scopes**: Leave blank.
* **Provider**: flexera

Note: Your user in Flexera One will need access to everything in the "Automation" category in order to make proper use of this credential in these lessons.

## Step 8: Launch VSCode

The final step is to launch VSCode and verify everything works as expected. In all configurations, you should be able to run the following commands to launch VSCode with the repository loaded in:

```bash
cd ~/policy_engine_training
code .
```

VSCode should launch. If prompted to install extensions, it is recommended that you install them.

You should now be configured and ready for the tutorial. Please proceed to [Lesson 01](https://github.com/flexera-public/policy_engine_training/blob/main/01_introduction).
