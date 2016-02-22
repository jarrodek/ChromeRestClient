/**
 * Listens for the app launching then creates the window.
 *
 * @see http://developer.chrome.com/apps/app.runtime.html
 * @see http://developer.chrome.com/apps/app.window.html
 */
chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create(
    'app/index.html#saved', {
      id: 'arc-window',
      bounds: {
        width: 800,
        height: 600
      }
    }
  );
});

/**
 * Called when user use one of the commands registered in the manifest file.
 */
chrome.commands.onCommand.addListener(function(command) {
  console.log('Command:', command);
});
