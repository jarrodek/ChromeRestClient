package org.rest.client.activity;

import org.rest.client.ClientFactory;

public abstract class ListActivity extends AppActivity {
	
	protected final static int PAGE_SIZE = 30;
	protected int current_page = 0;
	protected boolean fetchingNextPage = false;
	protected String recentQuery = "";
	
	protected ListActivity(ClientFactory clientFactory) {
		super(clientFactory);
	}
	
	abstract void getNextItemsPage();
	abstract void serach(String query);
	abstract void performQuery();
}
