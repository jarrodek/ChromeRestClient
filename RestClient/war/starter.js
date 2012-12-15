var _gaq = [ [ '_setAccount', 'UA-18021184-6' ], [ '_trackPageview' ],
		[ '_setDomainName', 'none' ], [ '_setAllowLinker', true ] ];
var bouncerate_timer = 0;
function trackDrop() {
	if (bouncerate_timer == 1) {
		_gaq.push([ '_trackEvent', 'Zamykanie', 'Strona', location.pathname ]);
	}
}
setTimeout(function() {
	bouncerate_timer = 1;
}, 60000);
window.onbeforeunload = trackDrop;
(function() {
	var ga = document.createElement('script');
	ga.type = 'text/javascript';
	ga.async = true;
	ga.src = 'https://ssl.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(ga, s);
})();
window.URL = window.webkitURL || window.URL;

function initStarter() {
	centerDialog();
	window.addEventListener('resize', centerDialog, false);

	var ua = navigator.userAgent.toLowerCase();
	if(ua.indexOf("chrome") == -1){
		var c = document.querySelector('.dialogInformationContent');
		c.innerHTML = '<strong>This application works with Google Chrome browser only</strong>';
		var button = document.querySelector('#actionButton');
		button.onclick = function(){
			window.location.assign('https://www.google.com/chrome');
		}
		button.innerHTML = 'Get Chrome';
		document.querySelector('.dialogButtons').classList.remove('hidden');
		return;
	}
}

function centerDialog() {
	var d = document.querySelector('#starterDialog');
	var left = document.width / 2 - d.offsetWidth / 2;
	var top = document.height / 2 - d.offsetHeight / 2;
	d.style.setProperty('top', top + "px");
	d.style.setProperty('left', left + "px");
}

initStarter();