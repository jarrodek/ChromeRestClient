package org.rest.client.ui.desktop;

import java.util.List;

import org.rest.client.storage.store.objects.RequestObject;
import org.rest.client.ui.SavedView;

import com.google.gwt.core.client.GWT;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.Widget;

public class SavedViewImpl extends Composite implements SavedView {
	
	private static SavedViewImplUiBinder uiBinder = GWT
			.create(SavedViewImplUiBinder.class);

	interface SavedViewImplUiBinder extends UiBinder<Widget, SavedViewImpl> {
	}
	
	public SavedViewImpl(){
		initWidget(uiBinder.createAndBindUi(this));
	}
	
	@Override
	public void setPresenter(Presenter listener) {
		
	}

	@Override
	public void setData(List<RequestObject> data) {
		
	}
}
