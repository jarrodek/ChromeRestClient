package com.google.gwt.xhr2.client;

public interface FileReaderProgressEvent {
	/**
	 * Fired when the read has successfully completed.
	 * @param file
	 */
	public void onLoad(File file);
	/**
	 * Fired when the read has been aborted. 
	 * For instance, by invoking the abort() method.
	 * It's also generate error handler with code status 3
	 * {@link FileError.ABORT_ERR}
	 * @param file File reference
	 */
	public void onAbort(File file);
	/**
	 * While reading (and decoding) blob, and reporting partial Blob data (progess.loaded/progress.total)
	 * @param file File reference
	 * @param loaded The loaded must return the current state of progression.
	 * @param total The total must return the length of the progress, or zero if that is unknown.
	 */
	public void onProgress(File file, Double loaded, Double total);
	/**
	 * When the read has failed see {@link FileError}
	 * @param file
	 * @param error
	 */
	public void onError(File file, FileError error);
}
