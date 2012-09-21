package com.google.gwt.filereader.client;

import com.google.gwt.file.client.File;
import com.google.gwt.file.client.FileError;

public interface ErrorHandler {
	/**
	 * When the read has failed see {@link FileError}
	 * @param file
	 * @param error
	 */
	public void onError(File file, FileError error);
}
