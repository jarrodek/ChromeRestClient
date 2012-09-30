package org.rest.server;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.TimeZone;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class MessagesServlet extends AppServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = 9187762942715084071L;

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		super.doGet(req, resp);

		String path = req.getPathInfo();
		if (path == null || path.equals("") || path.equals("/")) {
			requestError(new ResponseError("Not found"), 404, resp);
			return;
		}

		setMessagesResponse(path, resp);
	}

	private void setMessagesResponse(String path, HttpServletResponse resp)
			throws IOException {
		long since = -1;
		try {
			String _since = path.substring(path.lastIndexOf("/") + 1);
			since = Long.parseLong(_since);
		} catch (Exception e) {
			requestError(new ResponseError("Unknown time parameter"), 500, resp);
			return;
		}

		ArrayList<Message> result = Message.getMessages(since);
		GsonBuilder gsonBuilder = new GsonBuilder();
		gsonBuilder.serializeNulls();
		gsonBuilder.setPrettyPrinting();
		gsonBuilder.setDateFormat(DateFormat.FULL);
		Gson gson = gsonBuilder.create();
		String json = gson.toJson(result);
		resp.setHeader("Content-Type", "application/json");
		Calendar expires = Calendar.getInstance();
		expires.setTimeZone(TimeZone.getTimeZone("GMT"));
		expires.add(Calendar.HOUR, 24);
		// Fri, 30 Oct 1998 14:19:41 GMT
		String pattern = "EEE, d MMM yyyy HH:mm:ss z";
		SimpleDateFormat sdf = new SimpleDateFormat(pattern);
		resp.setHeader("Expires", sdf.format(expires.getTime()));
		// resp.setHeader("Last-Modified", "Mon, 29 Jun 1998 02:28:12 GMT");
		// resp.setHeader("Cache-Control", "max-age=86400, public");
		// resp.setHeader("Cache-Control",
		// "max-age=86400, must-revalidate, public");
		resp.setStatus(200);
		resp.getWriter().print(json);
		// Type fooType = new TypeToken<Key>() {}.getType();
	}
}
