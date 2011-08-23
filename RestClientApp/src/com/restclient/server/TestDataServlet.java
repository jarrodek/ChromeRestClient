package com.restclient.server;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.repackaged.org.json.JSONException;
import com.google.appengine.repackaged.org.json.JSONObject;

public class TestDataServlet extends HttpServlet {

	private Object monitor = new Object();

	/**
	 * 
	 */
	private static final long serialVersionUID = 745992985840230143L;

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		// synchronized (monitor) {
		// try {
		// monitor.wait(100);
		// } catch (InterruptedException e) {
		// e.printStackTrace();
		// }
		// }

		String payload = req.getParameter("p");
		if (payload == null || payload.equals("")) {
			resp.addHeader("Location", "/RestClientApp.html");
			resp.setStatus(307);
		} else if (payload.equals("json")) {
			JSONObject resp_obj = new JSONObject();
			List<String> testArray = new ArrayList<String>();
			testArray.add("apple");
			testArray.add("banana");
			testArray.add("orange");
			testArray.add("lemon");
			testArray.add("grapes");
			String[] arr = new String[3];
			arr[0] = "string1";
			arr[1] = "string2";
			arr[2] = "string3";
			try {
				
				resp_obj.put("fruits", testArray);
				resp_obj.put("ok", true);
				resp_obj.put("count", 5);
				resp_obj.put("array", arr);
				resp_obj.put("nullValue", "null");
				resp_obj.append("aaa", null);
				resp_obj.put("long", "18014398509481984419");
				
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			resp.setContentType("application/json");
			resp.setStatus(200);
			resp.getWriter().println(resp_obj.toString());
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

		synchronized (monitor) {
			try {
				monitor.wait(2000);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}

		resp.getWriter().println("OK");
	}
}
