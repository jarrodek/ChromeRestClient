window.addEventListener('load',function(e){
	
	var info = document.querySelector('.noARCInstalled');
	if(info) {
		info.parentNode.removeChild(info);
	}
	
	var query = window.location.search.replace('?state=','');
	if(!query){
		return;
	}
	var query = decodeURIComponent(query);
	if(!query){
		return;
	}
	try{
		query = JSON.parse(query);
	} catch(e){
		return;
	}
	if(query.action){
		switch(query.action){
		case 'create':
			//query.folderId && 
			chrome.extension.sendMessage({"payload":"gdrive","data":query}, function(response) {
				if(response.assignUrl){
					window.location.assign(response.assignUrl);
				}
			});
			break;
		case 'open':
			chrome.extension.sendMessage({"payload":"gdrive","data":query}, function(response) {
				if(response.assignUrl){
					window.location.assign(response.assignUrl);
				}
			});
			break;
		}
	}
}, false);