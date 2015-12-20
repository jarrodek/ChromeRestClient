package org.rest.client.request;

public class MessageObject {
	private final String actionUrl;
	private final String message;
	private final String created;
	
	public MessageObject(String actionUrl, String message, String created){
		this.actionUrl = actionUrl;
		this.message = message;
		this.created = created;
	}
	public String getActionUrl() {
		return actionUrl;
	}

	public String getMessage() {
		return message;
	}

	public String getCreated() {
		return created;
	}
}
