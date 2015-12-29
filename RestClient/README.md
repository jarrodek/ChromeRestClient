Advanced Rest Client Application for Google Chrome
=================

The web developers helper program to create and test custom HTTP requests.

This is a source code for the application. 

##Installation
Go to [Chrome Web Store][cws_url] and install the app from there.

[![Available on Chrome Web Store][cws_logo]][cws_url]


##Project philosophy

###Free for all
The app is and will be free to use for everyone. It's open source project and you can involve in its development.

###Easy to use
As a UX designer and developer I promise to develop easiest to use tool from them all. Every part of the UI and app's functionality is based on real users requirements. All you can find there is what you really need to work with REST services.

###Quality and stability
The app should work as desired. I take it serious if it comes to release and I've prepared complex testing and releasing process so the final release should be free of bugs.
If you however find a bug in the released version, please, [file a bug report][issue_tracker] on project's Github page. 

##Developing
If you want to run this project from source code there is some things you need to do before it will work.

You must download GWT and AppEngine SDK. To develop using GWT framework is the best to use [Eclipse][configure_eclipse].
Note: Right now use GWT version 2.6.0. The app is broken under 2.7.0 version.

You also need [Ant][ant_download] in your PATH.

Library that isn't in Maven repository is gwt-html-database. However WebSQL is deprecated and project will move to IndexedDb soon. Library can be found in /RestClient/lib/.

With Node.js installed, run the following one liner:
```
npm install -g gulp bower && npm install && bower install
```
To develop ARC you need to run `gulp dev` task in RestClient directory. It will watch for changes in relevant files in `dev/` folder and copy it to the `war/` folder. After you recompile the project (refresh the page) it will use new, precompiled files.

When you finish your changes then you must to compile the project using GWT compiler and:

Run `gulp build:dev` `gulp build:beta` or `gulp build:stable` (depends on build type) from RestClient directory

Generated extension will be available in RestClient/extension/ directory. 
Extensions generated files are in RestClient/extension/source/ directory. You can load this folder into Chrome extenstions developer mode to test the app.  

##Contact
You can contact me using my [Google+ account][gp_profile]. 
Also, follow ARC's [profile on Google Plus][gp_appprofile] or read application [blog][app_blog].

##License
This project is licensed under Apache License 2.0.
See the LICENSE file for more details. 



[cws_url]: https://chrome.google.com/webstore/detail/advanced-rest-client/hgmloofddffdnphfgcellkdfbfbjeloo?utm_source=gitgub&utp_campaign=app&utm_medium=installation
[cws_logo]: https://developer.chrome.com/webstore/images/ChromeWebStore_BadgeWBorder_v2_340x96.png "Get from Chrome Web Store"
[issue_tracker]: https://github.com/jarrodek/ChromeRestClient/issues
[gp_profile]: https://plus.google.com/+PawelPsztyc
[gp_appprofile]: https://plus.google.com/b/117577071661965941720/117577071661965941720
[app_blog]: restforchrome.blogspot.com
[configure_eclipse]: http://www.gwtproject.org/usingeclipse.html
[ant_download]: configure_eclipse