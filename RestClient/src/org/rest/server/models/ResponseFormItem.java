package org.rest.server.models;

import java.util.List;

public class ResponseFormItem {
	public static class ResponseItemHeader{
		public String key;
		public String value;
	}
	public String key;
	public String name;
	public String url;
	public String post;
	public String method;
	public String encoding;
	public List<ResponseItemHeader> headers;
}
