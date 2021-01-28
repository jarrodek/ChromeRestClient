# Advanced Rest Client Application - Chrome Application

This project is deprecated and no longer maintained. Please, use [ARC desktop client](https://github.com/advanced-rest-client/arc-electron) instead.

## Why is this deprecated?

Chrome application had a long a really good run. But Google decided to end this project in favor of PWA. Unfortunately PWAs aren't the right path for an API testing application as there are several restrictions built into the web platform (like CORS). Because of that a desktop client based on the Electron project was created.

## Moving the data

There's no way to automatically migrate the data from one application to another. These are completely different applications. Instead use the export option in the Chrome Client to export the data. You can then import the same data into the desktop client.
