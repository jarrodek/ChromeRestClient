package com.google.gwt.xhr2.client;

public class ProgressEvent {
	
	private final boolean lengthComputable;
	private final double loaded;
	private final double total;
	
	public static ProgressEvent initProgressEvent(boolean lengthComputable, double loaded, double total){
		return new ProgressEvent(lengthComputable, loaded, total);
	}
	
	public ProgressEvent( boolean lengthComputable, double loaded, double total ){
		this.lengthComputable = lengthComputable;
		this.loaded = loaded;
		this.total = total;
	}


	public boolean isLengthComputable() {
		return lengthComputable;
	}


	public double getLoaded() {
		return loaded;
	}


	public double getTotal() {
		return total;
	}
}
