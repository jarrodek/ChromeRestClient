package org.rest.client.request;

import org.rest.client.RestClient;

import com.allen_sauer.gwt.log.client.Log;
import com.google.gwt.http.client.RequestException;
import com.google.gwt.xhr2.client.LoadHandler;
import com.google.gwt.xhr2.client.ProgressEvent;
import com.google.gwt.xhr2.client.RequestBuilder;
import com.google.gwt.xhr2.client.Response;

/**
 * Class to get resources from application server.
 * All assets available for application must be placed in war/static/ directory.
 * 
 * @author Paweł Psztyć
 *
 */
public class AssetRequest extends ApplicationRequest {
	
	/**
	 * Get asset from application server.
	 * Asset must be placed in war/static/ directory.
	 * 
	 * @param assetName asset to download.
	 * @param callback
	 */
	public static void getAssetString(String assetName, final AssetStringCallback callback){
		
		RequestBuilder b = getApplicationRequestBuilder(ASSETS_URL + assetName, "GET");
		b.setLoadHandler(new LoadHandler() {
			@Override
			public void onLoaded(Response response, ProgressEvent event) {
				String body = response.getResponseText();
				if(body == null){
					if(RestClient.isDebug()){
						Log.debug("Asset request response has no data.");
					}
					callback.onFailure("Asset request response has no data", null);
					return;
				}
				
				callback.onSuccess(body);
			}
			@Override
			public void onError(Response r, Throwable exception) {
				if(RestClient.isDebug()){
					Log.error("Error to load response from server. Asset can't be reached.", exception);
				}
				callback.onFailure("Error to load response from server. Asset can't be reached.", exception);
			}
		});
		try {
			b.send();
		} catch (RequestException e) {
			if(RestClient.isDebug()){
				Log.error("Error make request to server. Asset can't be reached.", e);
			}
			callback.onFailure("Error make request to server. Asset can't be reached.", null);
		}
	}
}
