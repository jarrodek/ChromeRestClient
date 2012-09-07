/*******************************************************************************
 * Copyright 2012 Paweł Psztyć
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *   http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/
package org.rest.client.request;

import java.util.ArrayList;
import java.util.List;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.core.client.JsArray;
import com.google.gwt.regexp.shared.MatchResult;
import com.google.gwt.regexp.shared.RegExp;

/**
 * Parses URL to get some informations about it.
 * 
 * <p>Script found at http://blog.stevenlevithan.com/archives/parseuri</p>
 * 
 * <p>URL like: http://usr:pwd@www.test.com:81/dir/dir.2/index.htm?q1=0&&test1&test2=value&a[]=1&a[]=2#top parses to: </p>
 * 
 * <table style="font-size:xx-small;font-family:verdana,arial,helvetica,sans-serif;cell-spacing:2px;background:#00c;"><tbody><tr><th colspan="2" style="font-size: xx-small; font-family: verdana, arial, helvetica, sans-serif; text-align: left; color: white; padding-top: 5px; padding-right: 5px; padding-bottom: 5px; padding-left: 5px; vertical-align: top; cursor: pointer; background-image: initial; background-attachment: initial; background-origin: initial; background-clip: initial; background-color: rgb(68, 68, 204); font-style: normal; background-position: initial initial; background-repeat: initial initial; " onclick="tTable(this);" title="click to collapse">object</th></tr><tr style=""><td style="font-size:xx-small;font-family:verdana,arial,helvetica,sans-serif;vertical-align:top;padding:3px;background:#cdf;cursor:pointer;" onclick="tRow(this);" title="click to collapse">anchor</td><td style="font-size:xx-small;font-family:verdana,arial,helvetica,sans-serif;vertical-align:top;padding:3px;background:#fff;">top</td></tr><tr style=""><td style="font-size:xx-small;font-family:verdana,arial,helvetica,sans-serif;vertical-align:top;padding:3px;background:#cdf;cursor:pointer;" onclick="tRow(this);" title="click to collapse">query</td><td style="font-size:xx-small;font-family:verdana,arial,helvetica,sans-serif;vertical-align:top;padding:3px;background:#fff;">q1=0&amp;&amp;test1&amp;test2=value&amp;a[]=1&amp;a[]=2</td></tr><tr style=""><td style="font-size:xx-small;font-family:verdana,arial,helvetica,sans-serif;vertical-align:top;padding:3px;background:#cdf;cursor:pointer;" onclick="tRow(this);" title="click to collapse">file</td><td style="font-size:xx-small;font-family:verdana,arial,helvetica,sans-serif;vertical-align:top;padding:3px;background:#fff;">index.htm</td></tr><tr style=""><td style="font-size:xx-small;font-family:verdana,arial,helvetica,sans-serif;vertical-align:top;padding:3px;background:#cdf;cursor:pointer;" onclick="tRow(this);" title="click to collapse">directory</td><td style="font-size:xx-small;font-family:verdana,arial,helvetica,sans-serif;vertical-align:top;padding:3px;background:#fff;">/dir/dir.2/</td></tr><tr style=""><td style="font-size:xx-small;font-family:verdana,arial,helvetica,sans-serif;vertical-align:top;padding:3px;background:#cdf;cursor:pointer;" onclick="tRow(this);" title="click to collapse">path</td><td style="font-size:xx-small;font-family:verdana,arial,helvetica,sans-serif;vertical-align:top;padding:3px;background:#fff;">/dir/dir.2/index.htm</td></tr><tr style=""><td style="font-size:xx-small;font-family:verdana,arial,helvetica,sans-serif;vertical-align:top;padding:3px;background:#cdf;cursor:pointer;" onclick="tRow(this);" title="click to collapse">relative</td><td style="font-size:xx-small;font-family:verdana,arial,helvetica,sans-serif;vertical-align:top;padding:3px;background:#fff;">/dir/dir.2/index.htm?q1=0&amp;&amp;test1&amp;test2=value&amp;a[]=1&amp;a[]=2#top</td></tr><tr style=""><td style="font-size:xx-small;font-family:verdana,arial,helvetica,sans-serif;vertical-align:top;padding:3px;background:#cdf;cursor:pointer;" onclick="tRow(this);" title="click to collapse">port</td><td style="font-size:xx-small;font-family:verdana,arial,helvetica,sans-serif;vertical-align:top;padding:3px;background:#fff;">81</td></tr><tr style=""><td style="font-size:xx-small;font-family:verdana,arial,helvetica,sans-serif;vertical-align:top;padding:3px;background:#cdf;cursor:pointer;" onclick="tRow(this);" title="click to collapse">host</td><td style="font-size:xx-small;font-family:verdana,arial,helvetica,sans-serif;vertical-align:top;padding:3px;background:#fff;">www.test.com</td></tr><tr style=""><td style="font-size:xx-small;font-family:verdana,arial,helvetica,sans-serif;vertical-align:top;padding:3px;background:#cdf;cursor:pointer;" onclick="tRow(this);" title="click to collapse">password</td><td style="font-size:xx-small;font-family:verdana,arial,helvetica,sans-serif;vertical-align:top;padding:3px;background:#fff;">pwd</td></tr><tr style=""><td style="font-size:xx-small;font-family:verdana,arial,helvetica,sans-serif;vertical-align:top;padding:3px;background:#cdf;cursor:pointer;" onclick="tRow(this);" title="click to collapse">user</td><td style="font-size:xx-small;font-family:verdana,arial,helvetica,sans-serif;vertical-align:top;padding:3px;background:#fff;">usr</td></tr><tr style=""><td style="font-size:xx-small;font-family:verdana,arial,helvetica,sans-serif;vertical-align:top;padding:3px;background:#cdf;cursor:pointer;" onclick="tRow(this);" title="click to collapse">userInfo</td><td style="font-size:xx-small;font-family:verdana,arial,helvetica,sans-serif;vertical-align:top;padding:3px;background:#fff;">usr:pwd</td></tr><tr style=""><td style="font-size:xx-small;font-family:verdana,arial,helvetica,sans-serif;vertical-align:top;padding:3px;background:#cdf;cursor:pointer;" onclick="tRow(this);" title="click to collapse">authority</td><td style="font-size:xx-small;font-family:verdana,arial,helvetica,sans-serif;vertical-align:top;padding:3px;background:#fff;">usr:pwd@www.test.com:81</td></tr><tr style=""><td style="font-size:xx-small;font-family:verdana,arial,helvetica,sans-serif;vertical-align:top;padding:3px;background:#cdf;cursor:pointer;" onclick="tRow(this);" title="click to collapse">protocol</td><td style="font-size:xx-small;font-family:verdana,arial,helvetica,sans-serif;vertical-align:top;padding:3px;background:#fff;">http</td></tr><tr style=""><td style="font-size:xx-small;font-family:verdana,arial,helvetica,sans-serif;vertical-align:top;padding:3px;background:#cdf;cursor:pointer;" onclick="tRow(this);" title="click to collapse">source</td><td style="font-size:xx-small;font-family:verdana,arial,helvetica,sans-serif;vertical-align:top;padding:3px;background:#fff;">http://usr:pwd@www.test.com:81/dir/dir.2/index.htm?q1=0&amp;&amp;test1&amp;test2=value&amp;a[]=1&amp;a[]=2#top</td></tr><tr style=""><td style="font-size:xx-small;font-family:verdana,arial,helvetica,sans-serif;vertical-align:top;padding:3px;background:#cdf;cursor:pointer;" onclick="tRow(this);" title="click to collapse">queryKey</td><td style="font-size:xx-small;font-family:verdana,arial,helvetica,sans-serif;vertical-align:top;padding:3px;background:#fff;"><table style="font-size:xx-small;font-family:verdana,arial,helvetica,sans-serif;cell-spacing:2px;background:#00c;"><tbody><tr><th colspan="2" style="font-size:xx-small;font-family:verdana,arial,helvetica,sans-serif;text-align:left;color:white;padding:5px;vertical-align:top;cursor:pointer;background:#44c;" onclick="tTable(this);" title="click to collapse">object</th></tr><tr><td style="font-size:xx-small;font-family:verdana,arial,helvetica,sans-serif;vertical-align:top;padding:3px;background:#cdf;cursor:pointer;" onclick="tRow(this);" title="click to collapse">q1</td><td style="font-size:xx-small;font-family:verdana,arial,helvetica,sans-serif;vertical-align:top;padding:3px;background:#fff;">0</td></tr><tr><td style="font-size:xx-small;font-family:verdana,arial,helvetica,sans-serif;vertical-align:top;padding:3px;background:#cdf;cursor:pointer;" onclick="tRow(this);" title="click to collapse">test1</td><td style="font-size:xx-small;font-family:verdana,arial,helvetica,sans-serif;vertical-align:top;padding:3px;background:#fff;"><em style="color:#666;">[empty string]</em></td></tr><tr><td style="font-size:xx-small;font-family:verdana,arial,helvetica,sans-serif;vertical-align:top;padding:3px;background:#cdf;cursor:pointer;" onclick="tRow(this);" title="click to collapse">test2</td><td style="font-size:xx-small;font-family:verdana,arial,helvetica,sans-serif;vertical-align:top;padding:3px;background:#fff;">value</td></tr><tr><td style="font-size:xx-small;font-family:verdana,arial,helvetica,sans-serif;vertical-align:top;padding:3px;background:#cdf;cursor:pointer;" onclick="tRow(this);" title="click to collapse">a[]</td><td style="font-size:xx-small;font-family:verdana,arial,helvetica,sans-serif;vertical-align:top;padding:3px;background:#fff;">2</td></tr></tbody></table></td></tr></tbody></table>
 * 
 * @author Paweł Psztyć
 * @see http://blog.stevenlevithan.com/archives/parseuri
 */
public class URLParser {
	RegExp mainRegexp = RegExp.compile("^(?:(?![^:@]+:[^:@\\/]*@)([^:\\/?#.]+):)?(?:\\/\\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\\/?#]*)(?::(\\d*))?)(((\\/(?:[^?#](?![^?#\\/]*\\.[^?#\\/.]+(?:[?#]|$)))*\\/?)?([^?#\\/]*))(?:\\?([^#]*))?(?:#(.*))?)","gim");
	RegExp paramsRegexp = RegExp.compile("(?:^|&)([^&=]*)=?([^&]*)", "gim");
	
	private String source = null;
	private String protocol = null;
	private String authority = null;
	private String userInfo = null;
	private String user = null;
	private String password = null;
	private String host = null;
	private String port = null;
	private String relative = null;
	private String path = null;
	private String directory = null;
	private String file = null;
	private String query = null;
	private String anchor = null;
	private List<QueryParam> paramsList = new ArrayList<URLParser.QueryParam>();
	
	/**
	 * Parse URL to get info.
	 * @param url to parse
	 */
	public URLParser parse(String url){
		int i = 14;
		
		MatchResult results = mainRegexp.exec(url);
		
		while(i-- != 0){
			String value = results.getGroup(i);
			if(value == null) continue;
			
			switch(i){
			case 13: anchor = value; break;
			case 12: query = value; break;
			case 11: file = value; break;
			case 10: directory = value; break;
			case 9: path = value; break;
			case 8: relative = value; break;
			case 7: port = value; break;
			case 6: host = value; break;
			case 5: password = value; break;
			case 4: user = value; break;
			case 3: userInfo = value; break;
			case 2: authority = value; break;
			case 1: protocol = value; break;
			case 0: source = value; break;
			}
		}
		
		if(this.query != null){
			JsArray<QueryParam> params = _parseParams(query);
			int paramsCnt = params.length();
			for(int j=0; j<paramsCnt; j++){
				QueryParam _p = params.get(j);
				paramsList.add(_p);
			}
		}
		
		return this;
	}
	
	/**
	 * Native implemetation for query params find regexp
	 * @param query
	 * @return
	 */
	private native JsArray<QueryParam> _parseParams(String query) /*-{
		var reg = /(?:^|&)([^&=]*)=?([^&]*)/g;
		QueryParam = @org.rest.client.request.URLParser.QueryParam::create(Ljava/lang/String;Ljava/lang/String;);
		var result = [];
		query.replace(reg, function ($0, $1, $2) {
			if ($1){
				result[result.length] = new QueryParam($1, $2); 
			}
		});
		return result;
	}-*/;
	
	/**
	 * Single query param
	 * @author jarrod
	 *
	 */
	public static class QueryParam extends JavaScriptObject {
		protected QueryParam() {}
		final static native QueryParam create(String key, String value) /*-{
			return {key: key, value:value};
		}-*/;
		public final native String getKey() /*-{ return this.key; }-*/;
		public final native String getValue() /*-{ return this.value;  }-*/;
	}
	/**
	 * Get source - full url. Oryginal value of the source. 
	 * Source can't be changed via any setters.
	 * In URL like: http://usr:pwd@www.test.com:81/dir/dir.2/index.htm?q1=0&&test1&test2=value&a[]=1&a[]=2#top
	 * it would be  http://usr:pwd@www.test.com:81/dir/dir.2/index.htm?q1=0&&test1&test2=value&a[]=1&a[]=2#top
	 * @return URL source text
	 */
	public String getSource() {
		return source;
	}
	
	
	/**
	 * Get protocol used in URL
	 * 
	 * Example:
	 * <p><strong>http</strong>://usr:pwd@www.test.com:81/dir/dir.2/index.htm?q1=0&&test1&test2=value&a[]=1&a[]=2#top</p>
	 * 
	 * @return the protocol value or NULL if none
	 */
	public String getProtocol() {
		return protocol;
	}
	/**
	 * Set new protocol value.
	 * <p>Note: It will not change source value</p>
	 * Example:
	 * <p><strong>http</strong>://usr:pwd@www.test.com:81/dir/dir.2/index.htm?q1=0&&test1&test2=value&a[]=1&a[]=2#top</p>
	 * @param protocol
	 */
	public void setProtocol(String protocol) {
		this.protocol = protocol;
	}
	/**
	 * Get Authority used in URL.
	 * <p>Authotity is: [USER:PASSWORD@]HOST[:PORT]</p>
	 * Example:
	 * <p>http://<strong>usr:pwd@www.test.com:81</strong>/dir/dir.2/index.htm?q1=0&&test1&test2=value&a[]=1&a[]=2#top</p>
	 * 
	 * @return the Authority value or NULL if none
	 */
	public String getAuthority() {
		return authority;
	}
	/**
	 * Set new authority value.
	 * <p>Note: It will not change source value</p>
	 * <p>Authotity is: [USER:PASSWORD@]HOST[:PORT]</p>
	 * Example:
	 * <p>http://<strong>usr:pwd@www.test.com:81</strong>/dir/dir.2/index.htm?q1=0&&test1&test2=value&a[]=1&a[]=2#top</p>
	 * @param authority
	 */
	public void setAuthority(String authority) {
		this.authority = authority;
	}
	/**
	 * Get User Info used in URL
	 * 
	 * <p>User info is: USER:PASSWORD</p>
	 * 
	 * Example:
	 * <p>http://<strong>usr:pwd</strong>@www.test.com:81/dir/dir.2/index.htm?q1=0&&test1&test2=value&a[]=1&a[]=2#top</p>
	 * 
	 * @return the User Info value or NULL if none
	 */
	public String getUserInfo() {
		return userInfo;
	}
	/**
	 * Set new userInfo value.
	 * <p>User info is: USER:PASSWORD</p>
	 * <p>Note: It will not change source value</p>
	 * Example:
	 * <p>http://<strong>usr:pwd</strong>@www.test.com:81/dir/dir.2/index.htm?q1=0&&test1&test2=value&a[]=1&a[]=2#top</p>
	 * @param userInfo
	 */
	public void setUserInfo(String userInfo) {
		this.userInfo = userInfo;
	}
	/**
	 * Get User used in URL
	 * 
	 * Example:
	 * <p>http://<strong>usr</strong>:pwd@www.test.com:81/dir/dir.2/index.htm?q1=0&&test1&test2=value&a[]=1&a[]=2#top</p>
	 * 
	 * @return the User value or NULL if none
	 */
	public String getUser() {
		return user;
	}
	/**
	 * Set new user value.
	 * <p>Note: It will not change source value</p>
	 * Example:
	 * <p>http://<strong>usr</strong>:pwd@www.test.com:81/dir/dir.2/index.htm?q1=0&&test1&test2=value&a[]=1&a[]=2#top</p>
	 * @param user
	 */
	public void setUser(String user) {
		this.user = user;
	}
	/**
	 * Get Password used in URL
	 * 
	 * Example:
	 * <p>http://usr:<strong>pwd</strong>@www.test.com:81/dir/dir.2/index.htm?q1=0&&test1&test2=value&a[]=1&a[]=2#top</p>
	 * 
	 * @return the password value or NULL if none
	 */
	public String getPassword() {
		return password;
	}
	/**
	 * Set new password value.
	 * <p>Note: It will not change source value</p>
	 * Example:
	 * <p>http://usr:<strong>pwd</strong>@www.test.com:81/dir/dir.2/index.htm?q1=0&&test1&test2=value&a[]=1&a[]=2#top</p>
	 * @param password
	 */
	public void setPassword(String password) {
		this.password = password;
	}
	
	/**
	 * Get HOST used in URL
	 * 
	 * Example:
	 * <p>http://usr:pwd@<strong>www.test.com</strong>:81/dir/dir.2/index.htm?q1=0&&test1&test2=value&a[]=1&a[]=2#top</p>
	 * 
	 * @return the host value or NULL if none
	 */
	public String getHost() {
		return host;
	}
	/**
	 * Set new HOST value used in URL.
	 * <p>Note: It will not change source value</p>
	 * Example:
	 * <p>http://usr:pwd@<strong>www.test.com</strong>:81/dir/dir.2/index.htm?q1=0&&test1&test2=value&a[]=1&a[]=2#top</p>
	 * @param host
	 */
	public void setHost(String host) {
		this.host = host;
	}
	/**
	 * Get PORT used in URL
	 * 
	 * Example:
	 * <p>http://usr:pwd@www.test.com:<strong>81</strong>/dir/dir.2/index.htm?q1=0&&test1&test2=value&a[]=1&a[]=2#top</p>
	 * 
	 * @return the port value or NULL if none
	 */
	public String getPort() {
		return port;
	}
	/**
	 * Set new PORT value used in URL.
	 * <p>Note: It will not change source value</p>
	 * Example:
	 * <p>http://usr:pwd@www.test.com:<strong>81</strong>/dir/dir.2/index.htm?q1=0&&test1&test2=value&a[]=1&a[]=2#top</p>
	 * @param port
	 */
	public void setPort(String port) {
		this.port = port;
	}
	/**
	 * Get all data after host value used in URL
	 * 
	 * Example:
	 * <p>http://usr:pwd@www.test.com:81<strong>/dir/dir.2/index.htm?q1=0&&test1&test2=value&a[]=1&a[]=2#top</strong></p>
	 * 
	 * @return the relative value or NULL if none
	 */
	public String getRelative() {
		return relative;
	}
	/**
	 * Set all data after host value used in URL
	 * <p>Note: It will not change source value</p>
	 * Example:
	 * <p>http://usr:pwd@www.test.com:81<strong>/dir/dir.2/index.htm?q1=0&&test1&test2=value&a[]=1&a[]=2#top</strong></p>
	 * @param relative
	 */
	public void setRelative(String relative) {
		this.relative = relative;
	}
	/**
	 * Get path value used in URL.
	 * Path is relative without query string and anchor value 
	 * 
	 * Example:
	 * <p>http://usr:pwd@www.test.com:81<strong>/dir/dir.2/index.htm</strong>?q1=0&&test1&test2=value&a[]=1&a[]=2#top</p>
	 * 
	 * @return the relative value or NULL if none
	 */
	public String getPath() {
		return path;
	}
	/**
	 * Set path value used in URL.
	 * <p>Note: It will not change source value</p>
	 * Example:
	 * <p>http://usr:pwd@www.test.com:81<strong>/dir/dir.2/index.htm</strong>?q1=0&&test1&test2=value&a[]=1&a[]=2#top</p>
	 * @param path
	 */
	public void setPath(String path) {
		this.path = path;
	}
	/**
	 * Get directory value used in URL.
	 * 
	 * Example:
	 * <p>http://usr:pwd@www.test.com:81<strong>/dir/dir.2/</strong>index.htm?q1=0&&test1&test2=value&a[]=1&a[]=2#top</p>
	 * 
	 * @return the directory value or NULL if none
	 */
	public String getDirectory() {
		return directory;
	}
	/**
	 * Set directory value used in URL.
	 * <p>Note: It will not change source value</p>
	 * Example:
	 * <p>http://usr:pwd@www.test.com:81<strong>/dir/dir.2/</strong>index.htm?q1=0&&test1&test2=value&a[]=1&a[]=2#top</p>
	 * @param directory
	 */
	public void setDirectory(String directory) {
		this.directory = directory;
	}
	/**
	 * Get file value used in URL.
	 * 
	 * Example:
	 * <p>http://usr:pwd@www.test.com:81/dir/dir.2/<strong>index.htm</strong>?q1=0&&test1&test2=value&a[]=1&a[]=2#top</p>
	 * 
	 * @return the file value or NULL if none
	 */
	public String getFile() {
		return file;
	}
	/**
	 * Set file value used in URL.
	 * <p>Note: It will not change source value</p>
	 * Example:
	 * <p>http://usr:pwd@www.test.com:81/dir/dir.2/<strong>index.htm</strong>?q1=0&&test1&test2=value&a[]=1&a[]=2#top</p>
	 * @param file
	 */
	public void setFile(String file) {
		this.file = file;
	}
	/**
	 * Get query value used in URL.
	 * 
	 * Example:
	 * <p>http://usr:pwd@www.test.com:81/dir/dir.2/index.htm?<strong>q1=0&&test1&test2=value&a[]=1&a[]=2</strong>#top</p>
	 * 
	 * @return the query value or NULL if none
	 */
	public String getQuery() {
		return query;
	}
	/**
	 * Set query value used in URL.
	 * <p>Note: It will not change source value</p>
	 * Example:
	 * <p>http://usr:pwd@www.test.com:81/dir/dir.2/index.htm?<strong>q1=0&&test1&test2=value&a[]=1&a[]=2</strong>#top</p>
	 * @param file
	 */
	public void setQuery(String query) {
		this.query = query;
		paramsList.clear();
		if(this.query != null){
			JsArray<QueryParam> params = _parseParams(query);
			int paramsCnt = params.length();
			for(int j=0; j<paramsCnt; j++){
				QueryParam _p = params.get(j);
				paramsList.add(_p);
			}
		}
	}
	/**
	 * Get anchor value used in URL.
	 * 
	 * Example:
	 * <p>http://usr:pwd@www.test.com:81/dir/dir.2/index.htm?q1=0&&test1&test2=value&a[]=1&a[]=2#<strong>top</strong></p>
	 * 
	 * @return the anchor value or NULL if none
	 */
	public String getAnchor() {
		return anchor;
	}
	/**
	 * Set anchor value used in URL.
	 * <p>Note: It will not change source value</p>
	 * Example:
	 * <p>http://usr:pwd@www.test.com:81/dir/dir.2/index.htm?q1=0&&test1&test2=value&a[]=1&a[]=2#<strong>top</strong></p>
	 * @param anchor
	 */
	public void setAnchor(String anchor) {
		this.anchor = anchor;
	}
	/**
	 * 
	 * @return QueryParams list
	 */
	public List<QueryParam> getParamsList() {
		return paramsList;
	}
	
	
	@Override
	public String toString() {
		StringBuilder sb = new StringBuilder();
		sb.append(getProtocol());
		sb.append("://");
		boolean hasUser = false;
		boolean hasPassword = false;
		if(user!=null && !user.isEmpty()){
			hasUser = true;
			sb.append(user);
		}
		if(password!=null && !password.isEmpty()){
			hasPassword = true;
			if(hasUser){
				sb.append(":");
			}
			sb.append(password);
		}
		if(hasPassword || hasUser){
			sb.append("@");
		}
		sb.append(getHost());
		if(port != null && !port.isEmpty()){
			sb.append(":");
			sb.append(port);
		}
		sb.append(path);
		if(query != null && !query.isEmpty()){
			sb.append("?");
			sb.append(query);
		}
		if(anchor != null && !anchor.isEmpty())
			sb.append(anchor);
		return sb.toString();
	}
}
