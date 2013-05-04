 package org.rest.server;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Date;
import java.util.Enumeration;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class TestDataServlet extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = 745992985840230143L;

	@Override
	protected void doOptions(HttpServletRequest req, HttpServletResponse res)
			throws ServletException, IOException {
		HttpServletResponse response = (HttpServletResponse) res;
		response.setHeader("Access-Control-Allow-Origin", "*");
		response.setHeader("Access-Control-Allow-Headers", "Content-Type");
		super.doOptions(req, res);
	}
	
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		
		String payload = req.getParameter("p");
		if (payload == null || payload.equals("")) {
			resp.addHeader("Location", "/RestClient.html");
			resp.setStatus(307);
		} else if (payload.equals("meta")) {
			resp.setContentType("text/html");
			resp.setStatus(200);
			resp.setHeader("Link", "</.meta>; rel=meta");
			resp.getWriter().println("abc");
		} else if (payload.equals("error")) {
			resp.setContentType("application/x-custom+json; version=1");
			resp.setStatus(200);
			String json = "\n{\n\"companies\": \"http://localhost:8080/companies/\"\n}\n";
			resp.getWriter().println(json);
		} else if (payload.equals("json")) {
			resp.setContentType("application/json");
			resp.setStatus(200);
			String json = "{\"requests\":[ {\"key\":\"Accept\",\"desc\":\"Content-Types that are acceptable.\",\"example\":\"Accept: text/plain\"}, {\"key\":\"Accept-Charset\",\"desc\":\"Character sets that are acceptable\",\"example\":\"Accept-Charset: utf-8\"}, {\"key\":\"Accept-Encoding\",\"desc\":\"Acceptable encodings\",\"example\":\"Accept-Encoding: <compress | gzip | deflate | identity>\"}, {\"key\":\"Accept-Language\",\"desc\":\"Acceptable languages for response\",\"example\":\"Accept-Language: en-US\"}, {\"key\":\"Authorization\",\"desc\":\"Authentication credentials for HTTP authentication\",\"example\":\"Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==\"}, {\"key\":\"Cache-Control\",\"desc\":\"Used to specify directives that MUST be obeyed by all caching mechanisms along the request/response chain\",\"example\":\"Cache-Control: no-cache\"}, {\"key\":\"Connection\",\"desc\":\"What type of connection the user-agent would prefer\",\"example\":\"Connection: close\"}, {\"key\":\"Cookie\",\"desc\":\"an HTTP cookie previously sent by the server with Set-Cookie\",\"example\":\"Cookie: $Version=1; Skin=new;\"}, {\"key\":\"Content-Length\",\"desc\":\"The length of the request body in octets (8-bit bytes)\",\"example\":\"Content-Length: 348\"}, {\"key\":\"Content-Type\",\"desc\":\"The mime type of the body of the request (used with POST and PUT requests)\",\"example\":\"Content-Type: application/x-www-form-urlencoded\"}, {\"key\":\"Date\",\"desc\":\"The date and time that the message was sent\",\"example\":\"Date: Tue, 15 Nov 1994 08:12:31 GMT\"}, {\"key\":\"Expect\",\"desc\":\"Indicates that particular server behaviors are required by the client\",\"example\":\"Expect: 100-continue\"}, {\"key\":\"From\",\"desc\":\"The email address of the user making the request\",\"example\":\"From: user@example.com\"}, {\"key\":\"Host\",\"desc\":\"The domain name of the server (for virtual hosting), mandatory since HTTP/1.1\",\"example\":\"Host: en.wikipedia.org\"}, {\"key\":\"If-Match\",\"desc\":\"Only perform the action if the client supplied entity matches the same entity on the server. This is mainly for methods like PUT to only update a resource if it has not been modified since the user last updated it.\",\"example\":\"If-Match: '737060cd8c284d8af7ad3082f209582d'\"}, {\"key\":\"If-Modified-Since\",\"desc\":\"Allows a 304 Not Modified to be returned if content is unchanged\",\"example\":\"If-Modified-Since: Sat, 29 Oct 1994 19:43:31 GMT\"}, {\"key\":\"If-None-Match\",\"desc\":\"Allows a 304 Not Modified to be returned if content is unchanged, see HTTP ETag\",\"example\":\"If-None-Match: '737060cd8c284d8af7ad3082f209582d'\"}, {\"key\":\"If-Range\",\"desc\":\"If the entity is unchanged, send me the part(s) that I am missing; otherwise, send me the entire new entity\",\"example\":\"If-Range: '737060cd8c284d8af7ad3082f209582d'\"}, {\"key\":\"If-Unmodified-Since\",\"desc\":\"Only send the response if the entity has not been modified since a specific time.\",\"example\":\"If-Unmodified-Since: Sat, 29 Oct 1994 19:43:31 GMT\"}, {\"key\":\"Max-Forwards\",\"desc\":\"Limit the number of times the message can be forwarded through proxies or gateways.\",\"example\":\"Max-Forwards: 10\"}, {\"key\":\"Pragma\",\"desc\":\"Implementation-specific headers that may have various effects anywhere along the request-response chain\",\"example\":\"Pragma: no-cache\"}, {\"key\":\"Proxy-Authorization\",\"desc\":\"Authorization credentials for connecting to a proxy.\",\"example\":\"Proxy-Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==\"}, {\"key\":\"Range\",\"desc\":\"Request only part of an entity. Bytes are numbered from 0.\",\"example\":\"Range: bytes=500-999\"}, {\"key\":\"Referer\",\"desc\":\"This is the address of the previous web page from which a link to the currently requested page was followed.\",\"example\":\"Referer: http://en.wikipedia.org/wiki/Main_Page\"}, {\"key\":\"TE\",\"desc\":\"The transfer encodings the user agent is willing to accept: the same values as for the response header Transfer-Encoding can be used, plus the 'trailers' value (related to the 'chunked' transfer method) to notify the server it accepts to receive additional headers (the trailers) after the last, zero-sized, chunk.\",\"example\":\"TE: trailers, deflate\"}, {\"key\":\"Upgrade\",\"desc\":\"Ask the server to upgrade to another protocol\",\"example\":\"Upgrade: HTTP/2.0, SHTTP/1.3, IRC/6.9, RTA/x11\"}, {\"key\":\"User-Agent\",\"desc\":\"The user agent string of the user agent\",\"example\":\"User-Agent: Mozilla/5.0 (Linux; X11)\"}, {\"key\":\"Via\",\"desc\":\"Informs the server of proxies through which the request was sent.\",\"example\":\"Via: 1.0 fred, 1.1 nowhere.com (Apache/1.1)\"}, {\"key\":\"Warning\",\"desc\":\"A general warning about possible problems with the entity body.\",\"example\":\"Warning: 199 Miscellaneous warning\"}]}";
			resp.getWriter().println(json);
		} else if (payload.equals("xml")) {
			
			resp.setHeader("X-debug-url1", "http://www.127.0.1.1:8888/ChromeSMS.html");
			
			String file = req.getParameter("f");
			if (file == null || file.equals("")) {
				file = "file.xml";
			}

			StringBuffer fileData = new StringBuffer(1000);
			BufferedReader reader = new BufferedReader(new FileReader(
					"WEB-INF/res/" + file));
			char[] buf = new char[1024];
			int numRead = 0;
			while ((numRead = reader.read(buf)) != -1) {
				String readData = String.valueOf(buf, 0, numRead);
				fileData.append(readData);
				buf = new char[1024];
			}
			reader.close();
//			resp.setContentType("application/atom+xml;charset=utf-8");
			resp.getWriter().println(fileData.toString());
		} else if ( payload.equals("auth") ){
			resp.setStatus(401);
			resp.setHeader("WWW-Authenticate", "Basic realm=\"Secure Area\"");
			resp.setContentType("text/html");
		} else if ( payload.equals("json2") ){
			
			StringBuilder sb = new StringBuilder();
			sb.append("{");
			sb.append("\"aaa\"").append(":").append("[null]").append(",");
			sb.append("\"count\"").append(":").append("5").append(",");
			sb.append("\"fruits\"").append(":").append("[\"apple\",\"banana\",\"orange\",\"lemon\",\"grapes\"]").append(",");
			sb.append("\"nullValue\"").append(":").append("\"null\"").append(",");
			sb.append("\"ok\"").append(":").append("true").append(",");
			sb.append("\"link\"").append(":").append("\"https://www.google.pl/webhp?sourceid=chrome-instant&ion=1&ie=UTF-8#hl=en&sclient=psy-ab&q=javascript%20find%20links%20in%20text&oq=&gs_l=&pbx=1&fp=4f8778963b1a64d3&ion=1&bav=on.2,or.r_gc.r_pw.r_cp.r_qf.&biw=1215&bih=938\"").append(",");
			sb.append("\"link2\"").append(":").append("\"https://www.google.pl/webhp?sourceid\"").append(",");
			sb.append("\"link3\"").append(":").append("\"file:///file\"").append(",");
			sb.append("\"link4\"").append(":").append("\"ftp://www.google.pl/webhp?sourceid\"").append(",");
			sb.append("\"link5\"").append(":").append("\"http://www.google.pl/webhp?sourceid\"").append(",");
			sb.append("\"link6\"").append(":").append("\"/somepoint.php\"").append(",");
			sb.append("\"long\"").append(":").append("18014398509481984419").append(",");
			sb.append("\"array\"").append(":").append("[\"string1\",\"string2\",\"string3 string3 string3 string3 string3 string3\"]").append(",");
			sb.append("\"deep\"").append(":");
				sb.append("[");
					sb.append("{");
					sb.append("\"aaa\"").append(":").append("[null]").append(",");
					sb.append("\"count\"").append(":").append("5").append(",");
					sb.append("\"fruits\"").append(":").append("[\"apple\",\"banana\",\"orange\",\"lemon\",\"grapes\"]").append(",");
					sb.append("\"nullValue\"").append(":").append("\"null\"").append(",");
					sb.append("\"ok\"").append(":").append("true").append(",");
					sb.append("\"long\"").append(":").append("18014398509481984419").append(",");
					sb.append("\"array\"").append(":").append("[\"string1\",\"string2\",\"string3 string3 string3 string3 string3 string3\"]").append(",");
					sb.append("\"deep\"").append(":");
						sb.append("[");
							sb.append("{");
							sb.append("\"aaa\"").append(":").append("[null]").append(",");
							sb.append("\"count\"").append(":").append("5").append(",");
							sb.append("\"fruits\"").append(":").append("[\"apple\",\"banana\",\"orange\",\"lemon\",\"grapes\"]").append(",");
							sb.append("\"nullValue\"").append(":").append("\"null\"").append(",");
							sb.append("\"ok\"").append(":").append("true").append(",");
							sb.append("\"long\"").append(":").append("18014398509481984419").append(",");
							sb.append("\"array\"").append(":").append("[\"string1\",\"string2\",\"string3 string3 string3 string3 string3 string3\"]").append(",");
							sb.append("\"deep\"").append(":").append("[").append("]");
							sb.append("}");
							sb.append(",");
							sb.append("\"test\"");
						sb.append("]");
					sb.append("}").append(",").append("{");
						sb.append("\"aaa\"").append(":").append("[null]").append(",");
						sb.append("\"count\"").append(":").append("5").append(",");
						sb.append("\"fruits\"").append(":").append("[\"apple\",\"banana\",\"orange\",\"lemon\",\"grapes\"]").append(",");
						sb.append("\"nullValue\"").append(":").append("\"null\"").append(",");
						sb.append("\"ok\"").append(":").append("true").append(",");
						sb.append("\"long\"").append(":").append("18014398509481984419").append(",");
						sb.append("\"array\"").append(":").append("[\"string1\",\"string2\",\"string3 string3 string3 string3 string3 string3\"]").append(",");
						sb.append("\"deep\"").append(":");
							sb.append("[");
								sb.append("\"long\"").append(",").append("18014398509481984419");
							sb.append("]");
					sb.append("}");
				sb.append("]");
			sb.append("}");
			resp.setContentType("application/json");
			resp.setStatus(200);
//			resp.getWriter().println("{\"companies\":\"http://localhost:8080/companies/\"");
			resp.getWriter().println(sb.toString());
		} else if ( payload.equals("json3") ){
			
			StringBuilder sb = new StringBuilder();
			sb.append("{");
			sb.append("\"aaa\"").append(":").append("[null]").append(",");
			sb.append("\"count\"").append(":").append("5").append(",");
			sb.append("\"fruits\"").append(":").append("[\"apple\",\"banana\",\"orange\",\"lemon\",\"grapes\"]").append(",");
			sb.append("\"nullValue\"").append(":").append("\"null\"").append(",");
			sb.append("\"ok\"").append(":").append("true").append(",");
			sb.append("\"link\"").append(":").append("\"https://www.google.pl/webhp?sourceid=chrome-instant&ion=1&ie=UTF-8#hl=en&sclient=psy-ab&q=javascript%20find%20links%20in%20text&oq=&gs_l=&pbx=1&fp=4f8778963b1a64d3&ion=1&bav=on.2,or.r_gc.r_pw.r_cp.r_qf.&biw=1215&bih=938\"").append(",");
			sb.append("\"link2\"").append(":").append("\"https://www.google.pl/webhp?sourceid\"").append(",");
			sb.append("\"link3\"").append(":").append("\"file:///file\"").append(",");
			sb.append("\"link4\"").append(":").append("\"ftp://www.google.pl/webhp?sourceid\"").append(",");
			sb.append("\"link5\"").append(":").append("\"http://www.google.pl/webhp?sourceid\"").append(",");
			sb.append("\"long\"").append(":").append("18014398509481984419").append(",");
			sb.append("\"array\"").append(":").append("[\"string1\",\"string2\",\"string3 string3 string3 string3 string3 string3\"]").append(",");
			sb.append("\"deep\"").append(":");
				sb.append("[");
					sb.append("{");
					sb.append("\"aaa\"").append(":").append("[null]").append(",");
					sb.append("\"count\"").append(":").append("5").append(",");
					sb.append("\"fruits\"").append(":").append("[\"apple\",\"banana\",\"orange\",\"lemon\",\"grapes\"]").append(",");
					sb.append("\"nullValue\"").append(":").append("\"null\"").append(",");
					sb.append("\"ok\"").append(":").append("true").append(",");
					sb.append("\"long\"").append(":").append("18014398509481984419").append(",");
					sb.append("\"array\"").append(":").append("[\"string1\",\"string2\",\"string3 string3 string3 string3 string3 string3\"]").append(",");
					sb.append("\"deep\"").append(":");
						sb.append("[");
							sb.append("{");
							sb.append("\"aaa\"").append(":").append("[null]").append(",");
							sb.append("\"count\"").append(":").append("5").append(",");
							sb.append("\"fruits\"").append(":").append("[\"apple\",\"banana\",\"orange\",\"lemon\",\"grapes\"]").append(",");
							sb.append("\"nullValue\"").append(":").append("\"null\"").append(",");
							sb.append("\"ok\"").append(":").append("true").append(",");
							sb.append("\"long\"").append(":").append("18014398509481984419").append(",");
							sb.append("\"array\"").append(":").append("[\"string1\",\"string2\",\"string3 string3 string3 string3 string3 string3\"]").append(",");
							sb.append("\"deep\"").append(":").append("[").append("]");
							sb.append("}");
							sb.append(",");
							sb.append("\"test\"");
						sb.append("]");
					sb.append("}").append(",").append("{");
						sb.append("\"aaa\"").append(":").append("[null]").append(",");
						sb.append("\"count\"").append(":").append("5").append(",");
						sb.append("\"fruits\"").append(":").append("[\"apple\",\"banana\",\"orange\",\"lemon\",\"grapes\"]").append(",");
						sb.append("\"nullValue\"").append(":").append("\"null\"").append(",");
						sb.append("\"ok\"").append(":").append("true").append(",");
						sb.append("\"long\"").append(":").append("18014398509481984419").append(",");
						sb.append("\"array\"").append(":").append("[\"string1\",\"string2\",\"string3 string3 string3 string3 string3 string3\"]").append(",");
						sb.append("\"deep\"").append(":");
							sb.append("[");
								sb.append("\"long\"").append(",").append("18014398509481984419");
							sb.append("]");
					sb.append("}");
				sb.append("]");
			sb.append("}");
			resp.setContentType("text/html");
			resp.setStatus(200);
//			resp.getWriter().println("{\"companies\":\"http://localhost:8080/companies/\"");
			resp.getWriter().println(sb.toString());
		} else if (payload.equals("cookie")){

			@SuppressWarnings("unchecked")
			Enumeration<String> headersNames = req.getHeaderNames();
			System.out.println("======== HEADERS LIST ==========");
			while(headersNames.hasMoreElements()){
				String _hn = headersNames.nextElement();
				String _hv = req.getHeader(_hn);
				System.out.println("Received header: " + _hn + " with value: " + _hv);
			}
			
			
			long t = new Date().getTime();
			
			Cookie c2 = new Cookie("testcookie_"+t, "another value : " + t);
			resp.addCookie(c2);
			
			Cookie c = new Cookie("cookieName", "cookie value");
//			c.setDomain("127.0.0.1");
//			c.setMaxAge(100000);
			resp.addCookie(c);
			
			
			resp.setContentType("text/plain");
			resp.setStatus(200);
			resp.getWriter().println("Cookie set.");
		} else if( payload.equals("links") ){
			
			resp.setHeader("X-debug-url1", "http://127.0.1.1:8888/ChromeSMS.html?gwt.codesvr=127.0.1.1:9997#send-sms");
			resp.setHeader("X-debug-url2", "http://127.0.1.1:8888/ChromeSMS.html?gwt.codesvr=127.0.1.1:9997");
			resp.setHeader("X-debug-url3", "http://www.127.0.1.1:8888/ChromeSMS.html");
			
			resp.setContentType("text/plain");
			resp.setStatus(200);
			resp.getWriter().println("OK");
		} else if( payload.equals("oneline") ){
			resp.setContentType("text/plain");
			resp.setStatus(200);
			resp.getWriter().println("OK");
		} else if(payload.equals("statuscode")){
			resp.setContentType("text/plain");
			
			resp.sendError(HttpServletResponse.SC_CONFLICT, "message goes here");
			Cookie c2 = new Cookie("TestServlet", "cookie value from test servlet");
			resp.addCookie(c2);
			resp.getWriter().println("OK - body");
		} else if(payload.equals("redirect")){
			resp.setStatus(307);
			resp.setHeader("X-redirect-info", "Redirect to second level");
			resp.setHeader("Location", "http://127.0.0.1:8888/test?p=redirect2");
			//resp.sendRedirect("http://127.0.0.1:8888/test?p=redirect2");
		} else if(payload.equals("redirect2")){
			resp.setStatus(301);
			resp.setHeader("Location", "http://127.0.0.1:8888/test?p=xml");
		}

	}

	@Override
	protected void doPut(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		StringBuffer jb = new StringBuffer();
		String line = null;
		try {
			BufferedReader reader = req.getReader();
			while ((line = reader.readLine()) != null){
				
				jb.append(line);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		resp.getWriter().println("RESPONSE:");
		resp.getWriter().println(jb.toString());
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		PrintWriter writer = resp.getWriter();
		
		
		@SuppressWarnings("unchecked")
		Enumeration<String> names = req.getParameterNames();
		writer.println("=====PARAMS====");
		while(names.hasMoreElements()){
			String key = names.nextElement();
			String value = req.getParameter(key);
			writer.println("key="+key+", value="+value);
		}
		writer.println("===============");
		writer.println("Payload:");
		writer.println("===============");
		try{
			BufferedReader reader = req.getReader();
			while(true){
				String line = reader.readLine();
				if(line == null) break;
				writer.println(line);
			}
		} catch(Exception e){
			writer.println("unable read payload.");
		}
		writer.println("===============");
		@SuppressWarnings("unchecked")
		Enumeration<String> headersNames = req.getHeaderNames();
		writer.println("======== HEADERS LIST ==========");
		while(headersNames.hasMoreElements()){
			String _hn = headersNames.nextElement();
			String _hv = req.getHeader(_hn);
			writer.println("Received header: " + _hn + ": " + _hv);
		}
		writer.println("===============");
	}
}
