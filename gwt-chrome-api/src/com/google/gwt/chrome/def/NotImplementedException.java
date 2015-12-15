package com.google.gwt.chrome.def;

public class NotImplementedException extends UnsupportedOperationException {

	/**
	 * 
	 */
	private static final long serialVersionUID = 5612852304146483837L;
	private static final java.lang.String DEFAULT_MESSAGE = "Code is not implemented";
	
	
	public NotImplementedException(){
		super(DEFAULT_MESSAGE);
	}

}
