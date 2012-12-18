var _gaq = [ [ '_setAccount', 'UA-18021184-6' ], [ '_trackPageview' ],
		[ '_setDomainName', 'none' ], [ '_setAllowLinker', true ] ];
var bouncerate_timer = 0;
function trackDrop() {
	if (bouncerate_timer == 1) {
		_gaq.push([ '_trackEvent', 'Closing', 'Page', location.pathname ]);
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
	var loader = document.querySelector('.loaderContainer');
	var ua = navigator.userAgent.toLowerCase();
	if(ua.indexOf("chrome") == -1){
		var c = document.querySelector('.browserMissmatch');
		c.classList.remove('hidden');
		loader.classList.add('hidden');
		return;
	}
	
	window.setTimeout(function(){
		var info = document.querySelector('.noARCInstalled');
		if(!info) return;
		info.classList.remove('hidden');
		loader.classList.add('hidden');
	},1000);
}

initStarter();