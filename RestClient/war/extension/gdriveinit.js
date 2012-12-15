window.addEventListener('load',function(e){
	
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
	if(query.folderId && query.action && query.userId){
		switch(query.action){
		case 'create': 
			chrome.extension.sendMessage({"payload":"gdrive","data":query}, function(response) {});
			break;
		}
		
		
	}
	
}, false);