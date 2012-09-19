package org.rest.client.request;

public class ApplicationSession {
	/**
	 * User is connected to application
	 */
	public static final int CONNECTED = 1;
	/**
	 * User is not logged in 
	 */
	public static final int DISCONNECTED = 0;
	/**
	 * User status is unknown
	 */
	public static final int UNKNOWN = 2;

	private final int state;
	private final String userId;

	/**
	 * Shortcut method to create session object with unknown state (eg. failure
	 * to get response from server)
	 */
	public ApplicationSession() {
		this.state = UNKNOWN;
		this.userId = null;
	}
	/**
	 * Create user session object with known status but without user id
	 * @param state
	 */
	public ApplicationSession(int state) {
		this(state, null);
	}
	/**
	 * Create session object.
	 * @param state Session state either {@link #CONNECTED}, {@link #DISCONNECTED} or {@link #UNKNOWN} 
	 * @param userId application user id or null if unknown
	 */
	public ApplicationSession(int state, String userId) {
		this.state = state;
		this.userId = userId;
	}
	/**
	 * @return the state
	 */
	public final int getState() {
		return state;
	}
	/**
	 * @return the userId
	 */
	public final String getUserId() {
		return userId;
	}
}
