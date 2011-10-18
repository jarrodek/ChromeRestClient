package com.restclient.client.resources;

import com.google.gwt.user.cellview.client.CellList;

/**
 * 
 * Overwrite for default GWT cell resource
 * @author Paweł Psztyć
 *
 */
public interface CellResources extends com.google.gwt.user.cellview.client.CellList.Resources {
	@Source("cellListResources.css")
	CellList.Style cellListStyle();
}
