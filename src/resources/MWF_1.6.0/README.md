***Team:*** Storefront & Services Design
***Product:*** Microsoft Web Framework (MWF)
***Description:*** A modern and responsive web framework (HTML, CSS, JavaScript) built to meet Microsoft's Modern Design Language.

## DEPENDENCIES
1. Normalizer
2. Modernizr
3. Picturefill
4. Hammer

### IE8 ONLY
1. bind-polyfill
2. indexOf-polyfill

## GET STARTED AS A CONTRIBUTOR
### Installation and configuration on development environment (windows, mac, or other)
1. Install Git on http://git-scm.com/download
    a. Launch "Git Bash" application.
    b. Set your Git Identity.
        $ git config --global user.name "John Doe"
1. Configure credential manager to eliminate the need to continually login on every time pulling with Git.
    a. Windows
        $ git config --global credential.helper wincred
    b. Mac
        $ git config --global credential.helper osxkeychain
        $ git config --global user.email "johndoe@example.com"
    c.  Verify your Git settings are accurate
        $ git config --list
1. Download and install the latest 'mature and dependable' version of Node https://nodejs.org/en/ to manage our dependencies.
1. Install Grunt http://gruntjs.com/getting-started command tools.
	$ npm install -g grunt-cli
1. Install Phantom.js
	a. Windows (command prompt)
		$ npm install phantomjs-prebuilt -g
		$ copy %AppData%\npm\node_modules\phantomjs-prebuilt\lib\phantom\bin\phantomjs.exe %AppData%\npm
	b. Mac
		$ sudo npm install phantomjs-prebuilt -g
1. Install Ruby http://rubyinstaller.org/ Select the option to add ruby executables to path
1. Reboot.
	a. Windows
		$ gem update --system
		$ gem install scss_lint
	b. Mac
	   i. If this fails for Mac with a permissions issue
		$ sudo gem install -n /usr/local/bin scss_lint
1. Clone solution hosted on Git and map to local work directory.
    a. Change directory to your preferred working directory.
        $ cd /Source/Web/MWF
    b. Perform a clone on the remote repository to get source code locally.
        $ git clone https://microsoft.visualstudio.com/DefaultCollection/Universal%20Store/_git/SSD.Framework.OneUI
    c. When prompted for user name enter your Microsoft email address.
    d. When prompted for a password use your newly created security token.
    e. Change direction one level deeper into MWF where package.json resides.
        $ cd SSD.Framework.OneUI
1. Install all solution dependencies.
        $ npm install

### TESTING AND VALIDATION
    $ grunt
    >>  Done, without errors.

## INTERNAL DOCUMENTATION
### DEVELOPING
https://microsoft.sharepoint.com/teams/osg_unistore/sf/_layouts/OneNote.aspx?id=%2Fteams%2Fosg_unistore%2Fsf%2FTools%20SFT%2FSMERF%2FOneUI%20RedTiger&wd=target%28MWF%201.0%2FDesign%20Integration%2FGetting%20started.one%7C8ABF4314-D368-4E60-9913-FE697F123DA6%2F%29

### GUIDANCE https://microsoft.sharepoint.com/teams/osg_unistore/sf/_layouts/OneNote.aspx?id=%2Fteams%2Fosg_unistore%2Fsf%2FTools%20SFT%2FSMERF%2FOneUI%20RedTiger&wd=target%28MWF%201.0%2FDesign%20Integration%2FGuidance.one%7C322DC330-C56C-406A-BDFB-FF9ABE5AA16F%2F%29

### CONTRIBUTING POLICY
http://www.getmwf.com/developers/about/contribution-policy.html

## MWF CORE NODE PACKAGE CONSUMPTION
https://microsoft.sharepoint.com/teams/osg_unistore/sf/_layouts/OneNote.aspx?id=%2Fteams%2Fosg_unistore%2Fsf%2FTools%20SFT%2FSMERF%2FOneUI%20RedTiger&wd=target%28MWF%201.0%2FDesign%20Integration%2FNPM.one%7CE72CE5D8-3E2A-4FA8-95FC-BF8AD1B6F59A%2FMWF%20Node%20Packaging%7C788649EC-686C-4533-8DE3-9D39D7CEAACB%2F%29

## MWF NODE PUBLISHING
https://microsoft.sharepoint.com/teams/osg_unistore/sf/_layouts/OneNote.aspx?id=%2Fteams%2Fosg_unistore%2Fsf%2FTools%20SFT%2FSMERF%2FOneUI%20RedTiger&wd=target%28MWF%201.0%2FDesign%20Integration%2FNPM.one%7CE72CE5D8-3E2A-4FA8-95FC-BF8AD1B6F59A%2FMWF%20Node%20Publishing%7C19FE6894-E825-4ADE-AF8D-ECB6C64063D7%2F%29
