package org.rest.server.responses;

import java.util.Date;

public class AuthError {
	public final boolean error = true;
	/**
	 * Error message
	 */
	public final String message;
	/**
	 * Time of request
	 */
	public final long time;

	public AuthError(String message) {
		this.message = message;
		this.time = new Date().getTime();
	}
}
