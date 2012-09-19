package org.rest.shared;
/**
 * List of server paths recognizable by servlets.
 * @author Paweł Psztyć
 *
 */
public class ServerPaths {
	/**
	 * Get suggestion data list.
	 */
	public static final String SUGGESTIONS_LISTING = "/list";
	/**
	 * Download import data
	 */
	public static final String GET_IMPORT_DATA = "/get";
	/**
	 * Send data to server
	 */
	public static final String EXPORT_DATA = "/put";
}
