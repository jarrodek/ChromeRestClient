package org.rest.server.responses;

import java.util.Date;

public class ResponseError {
	public final boolean error = true;
	/**
	 * Code error
	 */
	public final int code;
	/**
	 * Error message
	 */
	public final String message;
	/**
	 * Time of request
	 */
	public final long time;

	public ResponseError(String message) {
		this.message = message;
		this.time = new Date().getTime();
		this.code = 400;
	}

	public ResponseError(String message, int code) {
		this.message = message;
		this.time = new Date().getTime();
		this.code = code;
	}
}
