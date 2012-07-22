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
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		
		String payload = req.getParameter("p");
		if (payload == null || payload.equals("")) {
			resp.addHeader("Location", "/RestClientApp.html");
			resp.setStatus(307);
		} else if (payload.equals("json")) {
//			JSONObject resp_obj = new JSONObject();
//			List<String> testArray = new ArrayList<String>();
//			testArray.add("apple");
//			testArray.add("banana");
//			testArray.add("orange");
//			testArray.add("lemon");
//			testArray.add("grapes");
//			String[] arr = new String[3];
//			arr[0] = "string1";
//			arr[1] = "string2";
//			arr[2] = "string3";
//			try {
//				
//				resp_obj.put("fruits", testArray);
//				resp_obj.put("ok", true);
//				resp_obj.put("count", 5);
//				resp_obj.put("array", arr);
//				resp_obj.put("nullValue", "null");
//				resp_obj.put("htmlvalue", "<a href=\"#\">test link</a>");
//				resp_obj.append("aaa", null);
//				resp_obj.put("long", "18014398509481984419");
//				
//			} catch (JSONException e) {
//				e.printStackTrace();
//			}
			resp.setContentType("application/json");
			resp.setStatus(200);
//			resp.getWriter().println(resp_obj.toString());
		} else if (payload.equals("xml")) {
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
			resp.getWriter().println(fileData.toString());
		} else if ( payload.equals("auth") ){
			resp.setStatus(401);
			resp.setHeader("WWW-Authenticate", "Basic realm=\"Secure Area\"");
			resp.setContentType("text/html");
		} else if ( payload.equals("json2") ){
			String response = "{\"aaa\":[null],\"count\":5,\"fruits\":[\"apple\",\"banana\",\"orange\",\"lemon\",\"grapes\"],\"nullValue\":\"null\",\"ok\":true,\"long\":18014398509481984419,\"array\":[\"string1\",\"string2\",\"string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 string3 \"]}";
			resp.setContentType("application/json");
			resp.setStatus(200);
			resp.getWriter().println(response);
		} else if (payload.equals("cookie")){
//			Cookie c = new Cookie("cookieName", "cookie value");
//			c.setDomain("127.0.0.1");
//			c.setMaxAge(100000);
//			resp.addCookie(c);
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
	}
}
