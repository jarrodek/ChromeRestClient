package org.rest.client.request;

public class MessageObject {
	private final String title;
	private final String message;
	private final String created;
	
	public MessageObject(String title, String message, String created){
		this.title = title;
		this.message = message;
		this.created = created;
	}
	public String getTitle() {
		return title;
	}

	public String getMessage() {
		return message;
	}

	public String getCreated() {
		return created;
	}
}
