# LESS Tutorial



LESS is a CSS pre-processor that enables customizable, manageable and reusable style sheet for website. LESS is a dynamic style sheet language that extends the capability of CSS. LESS is also cross browser friendly.

# Audience

This tutorial will help both students as well as professionals who want to make their websites or personal blogs more attractive.

# Prerequisites

You should be familiar with −

- Basic word processing using any text editor.
- How to create directories and files.
- How to navigate through different directories.
- Internet browsing using popular browsers like Internet Explorer or Firefox.
- Developing simple webpages using HTML or XHTML.

If you are new to HTML and XHTML, then we suggest you go through our HTML Tutorial or XHTML Tutorial first.

# LESS - Overview

LESS is a CSS pre-processor that enables customizable, manageable and reusable style sheet for website. LESS is a dynamic style sheet language that extends the capability of CSS. LESS is also cross browser friendly.

CSS Preprocessor is a scripting language that extends CSS and gets compiled into regular CSS syntax, so that it can be read by your web browser. It provides functionalities like *variables*, *functions*, *mixins* and *operations* that allow you to build dynamic CSS.

## Why LESS?

Let us now understand why do we use LESS.

- LESS supports creating cleaner, cross-browser friendly CSS faster and easier.
- LESS is designed in JavaScript and also created to be used in *live*, which compiles faster than other CSS pre-processors.
- LESS keeps your code in modular way which is really important by making it readable and easily changeable.
- Faster maintenance can be achieved by the use of LESS *variables*.

## History

LESS was designed by **Alexis Sellier** in 2009. LESS is an open-source. The first version of LESS was written in Ruby; in the later versions, the use of Ruby was replaced by JavaScript.

## Features

- Cleaner and more readable code can be written in an organized way.
- We can define styles and it can be reused throughout the code.
- LESS is based on JavaScript and is a super set of CSS.
- LESS is an agile tool that sorts out the problem of code redundancy.

## Advantages

- LESS easily generates CSS that works across the browsers.
- LESS enables you to write better and well organized code by using *nesting*.
- Maintenance can be achieved faster by the use of *variables*.
- LESS enables you to reuse the whole classes easily by referencing them in your rule sets.
- LESS provides the use of *operations* that makes coding faster and saves time.

## Disadvantages

- It takes time to learn if you are new to CSS preprocessing.
- Due to the tight coupling between the modules, more efforts should be taken to reuse and/or test dependent modules.
- LESS has less framework compared to older preprocessor like SASS, which consists of frameworks *Compass*, *Gravity* and *Susy*.

# LESS - Installation

In this chapter, we will understand, in a step-by-step manner, how to install LESS.

## System Requirements for LESS

- **Operating System** − Cross-platform
- **Browser Support** − IE (Internet Explorer 8+), Firefox, Google Chrome, Safari.

## Installation of LESS

Let us now understand the installation of LESS.

**Step 1** − We need **NodeJs** to run LESS examples. To download NodeJs, open the link [https://nodejs.org/en/](https://nodejs.org/en/), you will see a screen as shown below −

Dowload the *Latest Features* version of the zip file.

**Step 2** − Run the setup to install the *Node.js* on your system.

**Step 3** − Next, Install LESS on the server via NPM (Node Package Manager). Run the following command in the command prompt.

```
npm install -g less
```

**Step 4** − After successful installation of LESS, you will see the following lines on the command prompt −

```
`-- less@2.6.1
   +-- errno@0.1.4
   | `-- prr@0.0.0
   +-- graceful-fs@4.1.3
   +-- image-size@0.4.0
   +-- mime@1.3.4
   +-- mkdirp@0.5.1
   | `-- minimist@0.0.8
   +-- promise@7.1.1
   | `-- asap@2.0.3
   +-- request@2.69.0
   | +-- aws-sign2@0.6.0
   | +-- aws4@1.3.2
   | | `-- lru-cache@4.0.0
   | |   +-- pseudomap@1.0.2
   | |   `-- yallist@2.0.0
   | +-- bl@1.0.3
   | | `-- readable-stream@2.0.6
   | |   +-- core-util-is@1.0.2
   | |   +-- inherits@2.0.1
   | |   +-- isarray@1.0.0
   | |   +-- process-nextick-args@1.0.6
   | |   +-- string_decoder@0.10.31
   | |   `-- util-deprecate@1.0.2
   | +-- caseless@0.11.0
   | +-- combined-stream@1.0.5
   | | `-- delayed-stream@1.0.0
   | +-- extend@3.0.0
   | +-- forever-agent@0.6.1
   | +-- form-data@1.0.0-rc4
   | | `-- async@1.5.2
   | +-- har-validator@2.0.6
   | | +-- chalk@1.1.1
   | | | +-- ansi-styles@2.2.0
   | | | | `-- color-convert@1.0.0
   | | | +-- escape-string-regexp@1.0.5
   | | | +-- has-ansi@2.0.0
   | | | | `-- ansi-regex@2.0.0
   | | | +-- strip-ansi@3.0.1
   | | | `-- supports-color@2.0.0
   | | +-- commander@2.9.0
   | | | `-- graceful-readlink@1.0.1
   | | +-- is-my-json-valid@2.13.1
   | | | +-- generate-function@2.0.0
   | | | +-- generate-object-property@1.2.0
   | | | | `-- is-property@1.0.2
   | | | +-- jsonpointer@2.0.0
   | | | `-- xtend@4.0.1
   | | `-- pinkie-promise@2.0.0
   | |   `-- pinkie@2.0.4
   | +-- hawk@3.1.3
   | | +-- boom@2.10.1
   | | +-- cryptiles@2.0.5
   | | +-- hoek@2.16.3
   | | `-- sntp@1.0.9
   | +-- http-signature@1.1.1
   | | +-- assert-plus@0.2.0
   | | +-- jsprim@1.2.2
   | | | +-- extsprintf@1.0.2
   | | | +-- json-schema@0.2.2
   | | | `-- verror@1.3.6
   | | `-- sshpk@1.7.4
   | |   +-- asn1@0.2.3
   | |   +-- dashdash@1.13.0
   | |   | `-- assert-plus@1.0.0
   | |   +-- ecc-jsbn@0.1.1
   | |   +-- jodid25519@1.0.2
   | |   +-- jsbn@0.1.0
   | |   `-- tweetnacl@0.14.1
   | +-- is-typedarray@1.0.0
   | +-- isstream@0.1.2
   | +-- json-stringify-safe@5.0.1
   | +-- mime-types@2.1.10
   | | `-- mime-db@1.22.0
   | +-- node-uuid@1.4.7
   | +-- oauth-sign@0.8.1
   | +-- qs@6.0.2
   | +-- stringstream@0.0.5
   | +-- tough-cookie@2.2.2
   | `-- tunnel-agent@0.4.2
   `-- source-map@0.5.3

```

## Example

Following is a simple example of LESS.

### hello.htm

```
<!doctype html>
   <head>
      <link rel = "stylesheet" href = "style.css" type = "text/css" />
   </head>
   
   <body>
      <h1>Welcome to TutorialsPoint</h1>
      <h3>Hello!!!!!</h3>
   </body>
</html>
```

Let us now create a file *style.less* which is quite similar to CSS, the only difference is that it will be saved with *.less* extension. Both the files, *.html* and *.less* should be created inside the folder **nodejs**.

### style.less

```
@primarycolor: #FF7F50;
@color:#800080;
h1 {
   color: @primarycolor;
}

h3 {
   color: @color;
}
```

Compile *style.less* file to *style.css* by using the following command −

```
lessc style.less style.css
```

When you run the above command, it will create the *style.css* file automatically. Whenever you change the LESS file, it's necessary to run the above command in the cmd and then the *style.css* file will get updated.

The *style.css* file will have the following code when you run the above command −

### style.css

```
h1 {
  color: #FF7F50;
}

h3 {
  color: #800080;
}
```

## Output

Let us now carry out the following steps to see how the above code works −

- Save the above html code in the **hello.htm** file.
- Open this HTML file in a browser, the following output will gets displayed.

















<https://www.tutorialspoint.com/less/index.htm>

