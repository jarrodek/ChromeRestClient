package com.google.gwt.filereader.client;

import com.google.gwt.file.client.File;

public interface ProgressHandler {
	
	/**
	 * While reading (and decoding) blob, and reporting partial Blob data (progess.loaded/progress.total)
	 * @param file File reference
	 * @param loaded The loaded must return the current state of progression.
	 * @param total The total must return the length of the progress, or zero if that is unknown.
	 */
	public void onProgress(File file, double loaded, double total);
	
}
