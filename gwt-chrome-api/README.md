GWT Chrome Extensions API
=================

An library helping to use Chrome Extension APIs in GWT development mode.


Using
===
To use this module add build project (see Build section) and add gwt-chrome-extension-[gwt-version].jar to your project path.
Next alter DevExtension/manifest.json file and set permissions that your app require.
Finally load extension in chrome://extensions page. You must enable developer mode to load unpacked extension. You should point to DevExtension/ directory as an extension source file.

Now you can use it in your project.

TODO
===
Alter source code to use new API.

Build
===
First change build.properties file and update path to the GWT SDK location in `GWT_HOME`.
Then set up `GWT_VERSION` to your SDK's version. 

License
===

This project is licenced under Apache License 2.0.
See the LICENSE file for more details. 