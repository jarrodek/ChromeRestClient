package org.rest.client.ui;

import java.util.Date;

import com.google.gwt.user.client.ui.IsWidget;

public interface HistoryListItemView extends IsWidget {
	
	void setPresenter(HistoryView presenter);
	void setMethod(String method);
	void setURL(String url);
	void setItemId(int id);
	void setDate(Date date);
}
