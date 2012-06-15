package org.rest.client.ui.desktop;

import org.rest.client.ui.AboutView;

import com.google.gwt.core.client.GWT;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.Widget;

public class AboutViewImpl extends Composite implements AboutView {
	
	private static AboutViewImplUiBinder uiBinder = GWT
			.create(AboutViewImplUiBinder.class);

	interface AboutViewImplUiBinder extends UiBinder<Widget, AboutViewImpl> {
	}
	
	public AboutViewImpl(){
		initWidget(uiBinder.createAndBindUi(this));
	}
	
	@Override
	public void setPresenter(Presenter listener) {
		
	}

}
