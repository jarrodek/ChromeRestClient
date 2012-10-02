package com.google.gwt.filereader.client;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.file.client.Blob;

public class FileReader extends JavaScriptObject {
	protected FileReader() {
	}

	/**
	 * No data has been loaded yet.
	 */
	public static final int EMPTY = 0;
	/**
	 * Data is currently being loaded.
	 */
	public static final int LOADING = 1;
	/**
	 * The entire read request has been completed.
	 */
	public static final int DONE = 2;

	/**
	 * Create new FileReader object.
	 * 
	 * @return new FileReader object
	 */
	public static native FileReader create() /*-{
		return new $wnd.FileReader();
	}-*/;
	
	/**
	 * Called when the File is read successfully.
	 * 
	 * @param handler
	 */
	public final native void addLoadHandler(LoadHandler handler)/*-{
		this.onload = $entry(function(e) {
			handler.@com.google.gwt.filereader.client.LoadHandler::onLoad(Lcom/google/gwt/file/client/File;)(e.target);
		});
	}-*/;
	/**
	 * Add handler to abort event.
	 * @param handler
	 */
	public final native void addAbortHandler(AbortHandler handler)/*-{
		this.abort = $entry(function(e) {
			handler.@com.google.gwt.filereader.client.AbortHandler::onAbort(Lcom/google/gwt/file/client/File;)(e.target);
		});
	}-*/;
	
	public final native void addErrorHandler(ErrorHandler handler)/*-{
		this.onerror = $entry(function(e) {
			handler.@com.google.gwt.filereader.client.ErrorHandler::onError(Lcom/google/gwt/file/client/File;Lcom/google/gwt/file/client/FileError;)(e.target,e);
		});
	}-*/;
	
	/**
	 * Called when the read has successfully completed.
	 * 
	 * @param handler
	 */
	public final native void addProgressHandler(ProgressHandler handler)/*-{
		
//		this.onloadend = $entry(function(e) {
//			//$wnd.console.log('loadEnd',e);
//		});
		this.onprogress = $entry(function(e) {
			var loaded = 0, total = 0;
			if (e.lengthComputable) {
				loaded = e.loaded || 0;
				total = e.total || 0;
			}
			handler.@com.google.gwt.filereader.client.ProgressHandler::onProgress(Lcom/google/gwt/file/client/File;DD)(e.target,loaded,total);
		});
	}-*/;

	/**
	 * Abort file read. It's cause onError to be inited with code 3
	 * {@link FileError.ABORT_ERR}
	 */
	public final native void abort()/*-{
		this.abort();
	}-*/;

	public final native void readAsArrayBuffer(Blob file)/*-{
		this.readAsArrayBuffer(file);
	}-*/;

	public final native void readAsBinaryString(Blob file)/*-{
		this.readAsBinaryString(file);
	}-*/;

	public final native void readAsText(Blob file)/*-{
		this.readAsText(file);
	}-*/;
	public final native void readAsText(Blob file, String encoding)/*-{
		this.readAsText(file, encoding);
	}-*/;
	public final native void readAsDataURL(Blob file)/*-{
		this.readAsDataURL(file);
	}-*/;
}
