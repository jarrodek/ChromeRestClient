window.intent = window.intent || window.webkitIntent;

window.addEventListener("load", function() {
	if (window.intent) {
		chrome.extension.sendMessage({"payload":"runFromIntent", 'intent':window.intent}, function(response) {
			window.open('', '_self', ''); //bug fix
			window.close();
		});
    }
});