package com.google.gwt.filereader.client;

import com.google.gwt.file.client.File;

public interface AbortHandler {
	
	/**
	 * Fired when the read has been aborted. 
	 * For instance, by invoking the abort() method.
	 * It's also generate error handler with code status 3
	 * {@link FileError.ABORT_ERR}
	 * @param file File reference
	 */
	public void onAbort(File file);
}
