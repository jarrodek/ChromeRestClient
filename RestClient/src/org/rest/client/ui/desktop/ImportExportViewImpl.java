package org.rest.client.ui.desktop;

import org.rest.client.importparser.ImportResult;
import org.rest.client.request.RequestImportListItem;
import org.rest.client.ui.ImportExportView;

import com.google.gwt.core.client.GWT;
import com.google.gwt.core.client.JsArray;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.Widget;

public class ImportExportViewImpl extends Composite implements ImportExportView {

	private static ImportExportViewImplUiBinder uiBinder = GWT.create(ImportExportViewImplUiBinder.class);

	interface ImportExportViewImplUiBinder extends UiBinder<Widget, ImportExportViewImpl> { // NO_UCD (use private)
	}

		

	public ImportExportViewImpl() {
		initWidget(uiBinder.createAndBindUi(this));
	}

	@Override
	public void setPresenter(Presenter listener) {
		
	}
	

	@Override
	public void resetImportView() {
		
	}

	@Override
	public void resetExportView() {
	}

	@Override
	public void showImportTable(ImportResult result) {
		
	}


	@Override
	public void setIsUserView() {
		updateShareLink();
	}

	
	@Override
	public void updateShareLink() {
		
	}

	@Override
	public void setIsNotUserView() {
		
	}

	@Override
	public void resetServerView() {
		
	}


	@Override
	public void showServerImportTable(JsArray<RequestImportListItem> items) {
		
	}
}
