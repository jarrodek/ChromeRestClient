# Roadmap

This is an overview of the roadmap for the Advanced Rest Client for next few months - up to a year.

Note, that this document is fluid and the change depends on users feedback and the environment.

Most of the planned function are described on issue tracker. New function has additional [design doc](https://github.com/jarrodek/ChromeRestClient/issues?q=is%3Aissue+is%3Aopen+label%3Adesign-doc) label. You are welcome to shape the app with your own ideas and with discussing existing ideas with the author.


## RAML integration
This is a high priority task. Projects as they are right in the app will be removed. New kind of projects - based on the [RAML 1.0](https://github.com/raml-org/raml-spec/blob/master/versions/raml-10/raml-10.md/) spec - will take their place.

As for now projects were a set of not related requests that the user would like to bound together. Google Analytics showed that projects usage is at 18%. It's a lot but the potential in using standardized notation is huge.

The launch bug is https://github.com/jarrodek/ChromeRestClient/issues/509

## Magic variables and expressions
The magic variables was described in details in my blog posts: https://restforchrome.blogspot.co.uk/2012/11/introduce-magic-variables.html.

New variables will gain ability to work in projects only (scoped variables) or globally. Besides app defined variables user will have an option to declare his own variables (both scoped and global).

New magic variables will comes with the expressions. It's a very basic scripting environment where the user will be able to define simple action like concatenation, adding or multiplying. It will use basic string and math function to define an action and the result of the action will be placed in the request like magic variables does.

### Read more
* [Support for combined variables](https://github.com/jarrodek/ChromeRestClient/issues/497)
* [Add user defined variables UI](https://github.com/jarrodek/ChromeRestClient/issues/496)
* [Add enviornment support similar to Magic Variables](https://github.com/jarrodek/ChromeRestClient/issues/214)

## Scripting environment
More about scripting environment in the design doc: [Create a scripting environment](https://github.com/jarrodek/ChromeRestClient/issues/499)

Basically, it is a system of creating and executing macros in the context of the request. It will use a JavaScript syntax to write a macro and a visual editor to execute macros in context of a request.

## RAML discovery from the history
The app is collecting history of the user interaction with different endpoint. Based on this information the app can **locally** scan for project definition (RAML definition) and reverse engineer the API structure from it. Then the app can suggest creation of the project and document the API. Next time when the user will hit the endpoint the app suggest the parameters available for the endpoint and types of the expected response.
