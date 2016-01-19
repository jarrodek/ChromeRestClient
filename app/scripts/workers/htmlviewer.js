self.onmessage = function(e) {
	
    var data = e.data;
    if(typeof data == "string"){
    	data = JSON.parse(data);
    }
    
    var result = "";
    for(var i in data.html){
    	var str = data.html[i].string;
    	var style = data.html[i].style;
		if(str == null){
			continue;
		}
		if(str == "\n"){
			result += "<br>";
		} else if (style != null) {
			result += '<span class="cm-' + style + '">' + SafeHtmlUtils.htmlEscape(str) + "</span>";
		} else {
			result += SafeHtmlUtils.htmlEscape(str);
		}
    }
    
    var domainAndPath = data.url;
    
    var domain = domainAndPath;
	var domainSlashPos = domainAndPath.indexOf("/", domainAndPath.indexOf("://")+3);
	if(domainSlashPos > 0){
		domain = domainAndPath.substring(0,domainSlashPos);
	}
    var protocol = domain.substr(0, domain.indexOf("/"));
    
    var reg = /(href|src)<\/span>=<span class="cm-string">&quot;([^<"]+)&quot;/gim;
    if(reg.test(result)){
	    while((line = reg.exec(result)) != null){ 
	    	//0 - whole match
	    	//1 - href|src group
	    	//2 - ([^<"&]+) group
	    	//index - start index
	    	//input - the result variable
	    	var wholeLine = line[0];
	    	var attrName = line[1];
	    	var url = line[2];
	    	var fullHref = "about:blank";
			if(url.indexOf("://")!=-1){
				fullHref = url;
			} else if(url.indexOf("/")===0){
				if(url[1] == "/"){
					//case where href depends on base domain protocol
					fullHref = protocol + url;
				} else {
					fullHref = domain + url;
				}
			} else {
				fullHref = domainAndPath + url;
			}
	    	var replacement = attrName + '</span>=<span class="cm-string">';
			replacement += '&quot;<a title="Click to insert into URL field" response-anchor href="'+fullHref+'">'+url+'</a>&quot;';
			result = result.replace(wholeLine, replacement);
	    }
    }
    
    self.postMessage(result);
};

var SafeHtmlUtils = {
	AMP_RE: /&/gm,
	GT_RE: />/gm,
	LT_RE: /</gm,
	SQUOT_RE: /'/gm,
	QUOT_RE: /"/gm,

	htmlEscape: function(s){
		if (s.indexOf("&") != -1) {
	      s = s.replace(SafeHtmlUtils.AMP_RE, '&amp;')
	    }
	    if (s.indexOf("<") != -1) {
	    	s = s.replace(SafeHtmlUtils.LT_RE, '&lt;')
	    }
	    if (s.indexOf(">") != -1) {
	    	s = s.replace(SafeHtmlUtils.GT_RE, '&gt;')
	    }
	    if (s.indexOf("\"") != -1) {
	    	s = s.replace(SafeHtmlUtils.QUOT_RE, '&quot;')
	    }
	    if (s.indexOf("'") != -1) {
	    	s = s.replace(SafeHtmlUtils.SQUOT_RE, '&#39;')
	    }
	    return s;
	}
}