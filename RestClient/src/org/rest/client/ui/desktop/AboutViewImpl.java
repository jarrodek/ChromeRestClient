package org.rest.client.ui.desktop;

import org.rest.client.ui.AboutView;

import com.google.gwt.core.client.GWT;
import com.google.gwt.dom.client.Element;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.Widget;

public class AboutViewImpl extends Composite implements AboutView {
	
	private static AboutViewImplUiBinder uiBinder = GWT
			.create(AboutViewImplUiBinder.class);

	interface AboutViewImplUiBinder extends UiBinder<Widget, AboutViewImpl> {
	}
	
	@UiField Element about;
	
	public AboutViewImpl(){
		initWidget(uiBinder.createAndBindUi(this));
	}
	
	@Override
	public void setPresenter(Presenter listener) {
		
	}

	@Override
	public void showDonateDialog() {
		_showDonateDialog(this);
	}
	
	public final native void _showDonateDialog(AboutViewImpl context) /*-{
		var about = this.@org.rest.client.ui.desktop.AboutViewImpl::about;
		if(!about) return;
		about.showDonate();
	}-*/;
}
