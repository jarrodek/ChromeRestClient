function addXMLArrowSupport(element){
	var nodes = element.querySelectorAll('div.node');
	var nodesCnt = nodes.length;
	for(var i = 0; i < nodesCnt; i++){
		nodes[i].dataset["id"] = i;
	}
	
	var arrows = element.querySelectorAll('span.xml-arrow-expanded');
	var cnt = arrows.length;
	
	function handler(e){
		var close = true;
		var markers = this.parentNode.querySelectorAll("span.xml-arrow-empty");
		var marker = markers[markers.length-1];
		if( this.parentNode.classList.contains("opened") ){
			close = false;
			this.parentNode.classList.remove("opened");
			marker.innerText = '';
		} else {
			this.parentNode.classList.add("opened");
			marker.innerText = '(...)';
			
		}
		var id = this.parentNode.dataset['id'];
		var nodes = this.parentNode.parentNode.querySelectorAll('div[data-id="'+id+'"] > div.node');
		var cnt = nodes.length;
		for(var i = 0; i < cnt; i++){
			if( close ){
				nodes[i].classList.add("hidden");
			} else {
				nodes[i].classList.remove("hidden");
			}
		}
	}
	
	for(var i = 0; i < cnt; i++){
		arrows[i].addEventListener('click',handler,false);
	}
}