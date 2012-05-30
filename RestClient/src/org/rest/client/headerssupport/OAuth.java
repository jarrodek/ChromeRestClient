package org.rest.client.headerssupport;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.google.gwt.http.client.URL;

public class OAuth {
	
	private OAuth(){}
	
	
	public static class OauthParam {
		private String key;
		private String value;
		public OauthParam(){}
		public OauthParam(String key, String value){
			setKey(key, true);
			setValue(value);
		}
		public String getKey(){
			return this.key;
		}
		public void setKey(String key, boolean addPrefix){
			if( addPrefix && !key.startsWith("oauth_") ){
				key = "oauth_" + key;
			}
			this.key = key;
		}
		public String getValue(){
			return this.value;
		}
		public void setValue(String value){
			this.value = value;
		}
	}
	
	
	
	public static String getBaseString( String httpMethod, String requestUrl, List<OauthParam> params ){
		StringBuilder sb = new StringBuilder();
		sb.append(httpMethod.toUpperCase());
		sb.append("&");
		sb.append( percentEncode( normalizeUrl(requestUrl) ) );
		sb.append("&");
		List<String> pass = new ArrayList<String>();
		pass.add("oauth_consumer_key");
		pass.add("oauth_nonce");
		pass.add("oauth_signature_method");
		pass.add("oauth_timestamp");
		pass.add("oauth_version");
		pass.add("oauth_token");
		
		//create new list of required oauth params and 
		//URL request params
		
		List<OauthParam> paramsAll = new ArrayList<OAuth.OauthParam>();
		Iterator<OauthParam> it = params.iterator();
		while(it.hasNext()){
			OauthParam item = it.next();
			if( pass !=null && !pass.contains( item.getKey() ) ){
				continue;
			}
			paramsAll.add(item);
		}
		Map<String, String> urlParams = getQueryParams(requestUrl);
		//Log.debug("urlParams.size: "+urlParams.size()+", for url: "+requestUrl);
		Set<String> set = urlParams.keySet();
		Iterator<String> itp = set.iterator();
		while( itp.hasNext() ){
			String paramKey = itp.next();
			String paramValue = urlParams.get(paramKey);
			OauthParam p = new OauthParam();
			p.setKey(paramKey, false);
			p.setValue(paramValue);
			paramsAll.add( p );
		}
		
		
		sb.append( normalizeParameters(paramsAll,null) );
		return sb.toString();
	}
	
	public static List<OauthParam> createParamsList(Map<String, String> oauthParams){
		List<OauthParam> params = new ArrayList<OauthParam>();
		Set<String> keySet = oauthParams.keySet();
		Iterator<String> it = keySet.iterator();
		while( it.hasNext() ){
			String key = it.next();
			String value = oauthParams.get(key);
			OauthParam p = new OauthParam(key, value);
			params.add(p);
		}
		return params;
	}
	
	
	public static String getKey(List<OauthParam> params){
		String consumerSecret = null;
		String tokenSecret = null;
		Iterator<OauthParam> it = params.iterator();
		while(it.hasNext()){
			OauthParam item = it.next();
			String key = item.getKey();
			if( key.equals("oauth_token_secret") ){
				tokenSecret = item.getValue();
			} else if( key.equals("oauth_consumer_secret") ){
				consumerSecret = item.getValue();
			}
		}
		String key = consumerSecret + "&";
		if(tokenSecret != null){
			key += tokenSecret;
		}
		return key;
	}
	
	public static String getParamValue(List<OauthParam> params, String key){
		
		String result = null;
		Iterator<OauthParam> it = params.iterator();
		while(it.hasNext()){
			OauthParam item = it.next();
			if( item.getKey().equals(key) ){
				result = item.getValue();
				break;
			}
		}
		return result;
	}
	
	public static String getSignatureValue(String httpMethod, String requestUrl, List<OauthParam> params){
		
		String key = getKey(params);
		String cryptMethod = getParamValue(params, "oauth_signature_method");
		if(cryptMethod == null){
			cryptMethod = "HMAC-SHA1";
		}
		String cryptedString = "";
		
		//Log.debug(cryptMethod);
		
		if( cryptMethod.endsWith("SHA1") ){
			String baseString = getBaseString(httpMethod, requestUrl, params);
			//Log.debug(baseString);
			cryptedString = cryptSH1(key, baseString);
			//Log.debug(cryptedString);
			cryptedString = percentEncode( cryptedString );
		} else if( cryptMethod.equals("PLAINTEXT") ) {
			cryptedString = percentEncode( percentEncode( key ) );
		}
		
		
		//Log.debug(cryptedString);
		return cryptedString;
	}
	
	public static String normalizeParameters(final List<OauthParam> params, final List<String> pass){
		Collections.sort(params, new Comparator<OauthParam>() {
			@Override
			public int compare(OauthParam o1, OauthParam o2) {
				return o1.getKey().compareTo(o2.getKey());
			}
		});
		StringBuilder normalized = new StringBuilder();
		Iterator<OauthParam> it = params.iterator();
		while(it.hasNext()){
			OauthParam item = it.next();
			if( pass !=null && !pass.contains( item.getKey() ) ){
				//Log.debug("Drop key: "+item.getKey());
				continue;
			}
			if( normalized.length() != 0 ){
				normalized.append("&");
			}
			
			normalized.append( item.getKey() );
			normalized.append("=");
			normalized.append( item.getValue() );
		}
		return percentEncode( normalized.toString() );
	}
	
	public static native String cryptSH1(String key, String baseString)/*-{
		return $wnd.b64_hmac_sha1(key, baseString)+"=";//pad = at end
	}-*/;
	
	/**
	 * @see http://code.google.com/p/oauth/source/browse/code/javascript/oauth.js
	 * @param url
	 */
	public static native String normalizeUrl(String url)/*-{
		var o = {key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
                 parser: {strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@\/]*):?([^:@\/]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/ }};
        var m = o.parser.strict.exec(url);
        var uri = {};
        var i = 14;
        while (i--) uri[o.key[i]] = m[i] || "";
        var scheme = uri.protocol.toLowerCase();
        var authority = uri.authority.toLowerCase();
        var dropPort = (scheme == "http" && uri.port == 80)
                    || (scheme == "https" && uri.port == 443);
        if (dropPort) {
            // find the last : in the authority
            var index = authority.lastIndexOf(":");
            if (index >= 0) {
                authority = authority.substring(0, index);
            }
        }
        var path = uri.path;
        if (!path) {
            path = "/"; // conforms to RFC 2616 section 3.2.2
        }
        // we know that there is no query and no fragment here.
        return scheme + "://" + authority + path;
	}-*/;
	
	
	private static Map<String,String> getQueryParams(String url){
		Map<String,String> result = new HashMap<String, String>();
		if( url == null || url.equals("") || url.indexOf("?") == -1 ){
			return result;
		}
		
		String query= url.substring(url.indexOf("?")+1);
		if( query.indexOf("#")!=-1 ){
			query = query.substring( 0, query.indexOf("#") );
		}
		
		String[] params = query.split("&");
		if( params.length == 0 ){
			return result;
		}
		
		for( String param : params ){
			String[] _chunk = param.split("=");
			if( _chunk.length == 1 ){
				String _tmp = _chunk[0]; 
				_chunk = new String[2];
				_chunk[0] = _tmp;
				_chunk[1] = "";
			}
			result.put(_chunk[0], _chunk[1]);
		}
		return result;
	}
	
	
	public static String percentEncode(String param){
		if( param == null || param.equals("") ){
			return "";
		}
		param = URL.encodePathSegment(param);
		param = param.replace("!", "%21");
		param = param.replace("*", "%2A");
		param = param.replace("'", "%27");
		param = param.replace("(", "%28");
		param = param.replace(")", "%29");
		
		return param;
	}
}
