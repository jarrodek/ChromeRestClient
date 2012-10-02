package com.google.gwt.file.client;
/**
 * ErrorCode representation class.
 * 
 * This class is used to report errors asynchronously. 
 * The FileReader object's error attribute is a FileError object, 
 * and is accessed asynchronously through the onerror event handler 
 * when error events are generated.
 * @author jarrod
 *
 */
public class FileError {
	/**
	 * Constructor.
	 * @param code on error code.
	 */
	public FileError(int code){
		this.code = code;
	}
	/**
	 * Get ERROR code.
	 * @return error code.
	 */
	public int getCode(){
		return code;
	}
	
	/**
	 * User agents MUST use this code 
	 * if the File or Blob resource 
	 * could not be found at the time 
	 * the read was processed
	 */
	public static final int NOT_FOUND_ERR = 1;
	/**
	 * User agents MAY use this code if:
	 * <ul><li>it is determined that certain files are unsafe for access within a Web application</li>
	 * <li>it is determined that too many read calls are being made on File or Blob resources</li>
	 * <li>it is determined that the file has changed on disk since the user selected it</li>
	 * This is a security error code to be used in situations not covered by any other error codes.
	 */
	public static final int SECURITY_ERR = 2;
	/**
	 * User agents MUST use this code if the read operation was aborted, 
	 * typically with a call to abort()
	 */
	public static final int ABORT_ERR = 3;
	   
	/**
	 * User agents MUST use this code 
	 * if the File or Blob cannot be read, 
	 * typically due due to permission problems 
	 * that occur after a reference to a File 
	 * or Blob has been acquired 
	 * (e.g. concurrent lock with another application).
	 */
	public static final int NOT_READABLE_ERR = 4;
	/**
	 * User agents MAY use this code 
	 * if URL length limitations for Data URLs 
	 * in their implementations place limits on the 
	 * File or Blob data that can be represented 
	 * as a Data URL [DataURL]. 
	 * User agents MUST NOT use this code 
	 * for the asynchronous readAsText() call 
	 * and MUST NOT use this code for 
	 * the synchronous readAsText() call, 
	 * since encoding is determined by the 
	 * encoding determination algorithm.
	 */
	public static final int ENCODING_ERR = 5;
	/**
	 * The error code.
	 */
	public final int code;
}
