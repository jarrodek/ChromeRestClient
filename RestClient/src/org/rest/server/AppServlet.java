package org.rest.server;

import java.io.IOException;
import java.text.DateFormat;
import java.util.Date;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public abstract class AppServlet extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 8585825084407013909L;
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		resp.setHeader("Access-Control-Allow-Origin", "*");
		resp.setHeader("Access-Control-Allow-Headers", "Content-Type");
	}
	
	/**
	 * Set request error in JSON
	 * @param message Message object to print
	 * @param code HTTP status code
	 * @param resp response servlet object
	 * @throws IOException 
	 */
	protected void requestError(ResponseError message, int code, HttpServletResponse resp) throws IOException{
		Gson gson = new GsonBuilder().serializeNulls().setPrettyPrinting().setDateFormat(DateFormat.FULL).create();
		String json = gson.toJson(message);
		
		resp.setHeader("Content-Type", "application/json");
		resp.setStatus(code);
		resp.getWriter().print(json);
	}
	
	
	static class ResponseError {
		final boolean error = true;
		/**
		 * Code error
		 */
		final int code;
		/**
		 * Error message
		 */
		final String message;
		/**
		 * Time of request
		 */
		final Date time;

		ResponseError(String message) {
			this.message = message;
			this.time = new Date();
			this.code = 400;
		}

		ResponseError(String message, int code) {
			this.message = message;
			this.time = new Date();
			this.code = code;
		}
	}
}
