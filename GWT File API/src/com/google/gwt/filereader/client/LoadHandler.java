package com.google.gwt.filereader.client;

import com.google.gwt.file.client.File;

public interface LoadHandler {
	/**
	 * Fired when the read has successfully completed.
	 * @param file
	 */
	public void onLoad(File file);
}
