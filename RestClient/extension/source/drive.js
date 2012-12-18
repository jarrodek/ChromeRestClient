const CLIENT_ID = '10525470235.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/drive.install https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.readonly.metadata';
const boundary = 'ARCFormBoundary49nr1hyovoq1tt9';
const delimiter = "\r\n--" + boundary + "\r\n";
const close_delim = "\r\n--" + boundary + "--";
const appMimeType = 'application/restclient+data';
const appFileExtension = 'arc';

window.driveInitialized = false;
window.pickerInitialized = false;
window.__arc_pickercallback = [];
window.__arc_authcallback = [];
window.__arc_loadApiCallback = [];

function appendLoader() {
	var wrapper = document.createElement('div');
	var loader = document.createElement('div');
	loader.classList.add('loaderImage');
	wrapper.classList.add('actionDomLoader');
	wrapper.appendChild(loader);
	document.body.appendChild(wrapper);
}
function removeLoader() {
	var loader = document.body.querySelector('.actionDomLoader');
	if (loader) {
		loader.parentNode.removeChild(loader);
	}
}

function loadApi(callback) {
	if (window.driveInitialized) {
		callback();
		return;
	}
	appendLoader();

	window.__arc_loadApiCallback.push(callback);

	var script = document.createElement("script");
	script.src = "https://apis.google.com/js/client.js?onload=handleDriveClientLoad";
	script.type = "text/javascript";
	script.async = true;
	document.getElementsByTagName("head")[0].appendChild(script);
}

/**
 * Google Drive integration. Initalize Google Drive library.
 */
function handleDriveClientLoad() {
	gapi.client.load('drive', 'v2', function() {
		window.driveInitialized = true;
		removeLoader();
		if (!window.__arc_loadApiCallback
				|| window.__arc_loadApiCallback.length == 0)
			return;
		while (window.__arc_loadApiCallback.length > 0) {
			var clb = window.__arc_loadApiCallback.shift();
			clb.call(window);
		}

	});
}


window.addEventListener("message", function(e){
	if (e.origin != location.origin) {
		return;
	};
	var response = e.data;
	if (!(response && response.source && response.source == "dev:cs"))
		return;
	if (!(response && response.payload))
		return;
	var responseAsObject = (response.response && response.response == 'object');
	if(!responseAsObject){
		//string receiver
		return;
	}
	
	switch(response.payload){
	case 'checkDriveAuth':
		handleDriveAuthResult(response.data);
		break;
	case 'gdriveAuth':
		handleDriveAuthResult(response.data);
		break;
		
	}
	
}, false);



/**
 * Check if the current user has authorized the application.
 */
function checkDriveAuth(callback) {
	if (!window.driveInitialized) {
		window.setTimeout(function() {
			loadApi(function() {
				checkDriveAuth(callback);
			});
		}, 1);
		return;
	}
	
	var payload = {
		'payload': 'checkDriveAuth',
		'response': 'object'
	}
	if(chrome.runtime){
		chrome.runtime.getBackgroundPage(function(backgroundPage){
			backgroundPage.requestAction(payload, function(response){
				var authResult = response.data;
				if(authResult && authResult.access_token){
					gapi.auth.setToken({'access_token':authResult.access_token});
				}
				callback(response.data);
			});
		});
	} else {
		window.__arc_authcallback.push(callback);
		payload.source = 'dev:gwt';
		window.postMessage(payload, window.location.href);
	}
	
//	gapi.auth.authorize({
//		'client_id' : CLIENT_ID,
//		'scope' : SCOPES,
//		'immediate' : true
//	}, handleDriveAuthResult);
}
function gdriveAuth(callback, forceNew) {
	forceNew = forceNew || false;
	if (!window.driveInitialized) {
		window.setTimeout(function() {
			loadApi(function() {
				gdriveAuth(callback);
			});
		}, 1);
		return;
	}
	
	
	var payload = {
		'payload': 'gdriveAuth',
		'response': 'object',
		'forceNew': forceNew
	}
	if(chrome.runtime){
		chrome.runtime.getBackgroundPage(function(backgroundPage){
			backgroundPage.requestAction(payload, function(response){
				var authResult = response.data;
				if(authResult && authResult.access_token){
					gapi.auth.setToken({'access_token':authResult.access_token});
				}
				callback(response.data);
			});
		});
	} else {
		window.__arc_authcallback.push(callback);
		payload.source = 'dev:gwt';
		window.postMessage(payload, window.location.href);
	}
	
	
//	window.setTimeout(function() {
//		window.__arc_authcallback.push(callback);
//		gapi.auth.authorize({
//			'client_id' : CLIENT_ID,
//			'scope' : SCOPES,
//			'immediate' : false
//		}, handleDriveAuthResult);
//	}, 250);
}
function handleDriveAuthResult(authResult) {
	
	if(authResult && authResult.access_token){
		gapi.auth.setToken({'access_token':authResult.access_token});
	}
	
	if (!window.__arc_authcallback || window.__arc_authcallback.length == 0)
		return;
	while (window.__arc_authcallback.length > 0) {
		var clb = window.__arc_authcallback.shift();
		clb.call(window, authResult);
	}

}

function gdriveLoadPicker(callback) {

	if (window.pickerInitialized) {
		callback.call(window);
		return;
	}
	appendLoader();

	window.__arc_pickercallback.push(callback);

	var script = document.createElement("script");
	script.src = "https://www.google.com/jsapi?callback=handlePickerLoad";
	script.type = "text/javascript";
	script.async = true;
	document.getElementsByTagName("head")[0].appendChild(script);
}
function handlePickerLoad() {
	google.load("picker", "1", {
		"callback" : function() {
			window.pickerInitialized = true;
			removeLoader();
			if (!window.__arc_pickercallback
					|| window.__arc_pickercallback.length == 0)
				return;
			while (window.__arc_pickercallback.length > 0) {
				var clb = window.__arc_pickercallback.shift();
				clb.call(window);
			}
		}
	});
}
//function gdriveGetFolders(nextPageToken, query, clb) {
//	var q = "mimeType='application/vnd.google-apps.folder'";
//	if (query) {
//		q += " and title contains '" + query + "' and trashed = false";
//	}
//	var params = {
//		'q' : q,
//		'maxResults' : 25,
//		'fields' : 'items(createdDate,iconLink,id,title),nextLink,nextPageToken'
//	};
//	if (nextPageToken != null) {
//		params.pageToken = nextPageToken
//	}
//	var request = gapi.client.request({
//		'path' : '/drive/v2/files',
//		'method' : 'GET',
//		'params' : params
//	});
//	request.execute(function(res) {
//		clb(res);
//	});
//}
function gdriveInsertArcFile(parentId, filename, content, callback) {
	try {
		if (typeof content == "object") {
			content = JSON.stringify(content);
		}

		var metadata = {
			'title' : filename + '.' + appFileExtension,
			'mimeType' : appMimeType,
			"parents" : [ {
				"id" : parentId
			} ]
		};
		var base64Data = btoa(content);
		var multipartRequestBody = delimiter
				+ 'Content-Type: application/json\r\n\r\n'
				+ JSON.stringify(metadata) + delimiter + 'Content-Type: '
				+ appMimeType + '\r\n'
				+ 'Content-Transfer-Encoding: base64\r\n' + '\r\n' + base64Data
				+ close_delim;
		var request = gapi.client.request({
			'path' : '/upload/drive/v2/files',
			'method' : 'POST',
			'params' : {
				'uploadType' : 'multipart'
			},
			'headers' : {
				'Content-Type' : 'multipart/mixed; boundary="' + boundary + '"'
			},
			'body' : multipartRequestBody
		});
		request.execute(callback);
	} catch (e) {
		callback({'error':e});
	}
}
function gdriveUpdateArcFile(fileId, content, callback){
	try {
		if (typeof content == "object") {
			content = JSON.stringify(content);
		}
		var metadata = {
			'mimeType' : appMimeType
		};
		var base64Data = btoa(content);
		var multipartRequestBody = "" 
				+ delimiter
				+ 'Content-Type: application/json\r\n\r\n'
				+ JSON.stringify(metadata) 
				+ delimiter 
				+ 'Content-Type: ' + appMimeType + '\r\n'
				+ 'Content-Transfer-Encoding: base64\r\n\r\n' 
				+ base64Data
				+ close_delim;
		var request = gapi.client.request({
			'path' : '/upload/drive/v2/files/' + fileId,
			'method' : 'PUT',
			'params' : {
				'uploadType' : 'multipart'
			},
			'headers' : {
				'Content-Type' : 'multipart/mixed; boundary="' + boundary + '"'
			},
			'body' : multipartRequestBody
		});
		request.execute(callback);
	} catch (e) {
		callback({'error':e});
	}
}

function gdriveGetFileMeta(fileId, callback) {
	var request = gapi.client.request({
		'path' : '/drive/v2/files/'+fileId,
		'method' : 'GET',
		'params' : {
			'fields' : 'downloadUrl,title,etag'
		}
	});
	request.execute(function(resp) {
		callback(resp);
	});
}
function gdriveDownloadFile(downloadUrl, callback) {
	var accessToken = gapi.auth.getToken().access_token;
	var xhr = new XMLHttpRequest();
	xhr.open('GET', downloadUrl);
	xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
	xhr.onload = function() {
		callback(xhr.responseText);
	};
	xhr.onerror = function() {
		callback(null);
	};
	xhr.send();
}
	