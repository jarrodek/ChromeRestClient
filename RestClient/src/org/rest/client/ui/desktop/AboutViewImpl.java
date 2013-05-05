package org.rest.client.ui.desktop;

import org.rest.client.tutorial.TutorialFactory;
import org.rest.client.ui.AboutView;
import org.rest.client.ui.TutorialDialog;
import org.rest.client.ui.TutorialDialog.Direction;
import org.rest.client.ui.desktop.widget.LicenseDialog;

import com.google.gwt.chrome.runtime.ManifestDetails;
import com.google.gwt.core.client.GWT;
import com.google.gwt.dom.client.DivElement;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.Widget;

public class AboutViewImpl extends Composite implements AboutView {
	
	private static AboutViewImplUiBinder uiBinder = GWT
			.create(AboutViewImplUiBinder.class);

	interface AboutViewImplUiBinder extends UiBinder<Widget, AboutViewImpl> {
	}
	
	
	@UiField DivElement versionField;
	
	
	public AboutViewImpl(){
		initWidget(uiBinder.createAndBindUi(this));
	}
	
	@Override
	public void setPresenter(Presenter listener) {
		
	}

	@Override
	public void setManifest(ManifestDetails manifest) {
		if(manifest == null) return;
		String version = manifest.getVersion();
		if(version == null) return;
		versionField.setInnerText("Application version: " + version);
	}

	@Override
	public void setUpTutorial(TutorialFactory factory) {
		TutorialDialog plusone = TutorialFactory.createItem();
		plusone.setAbsolutePosition(175, 123);
		plusone.setHTML("<strong>+1 me! :)</strong><br/>You may also want to review my application in <a target=\"_blank\" href=\"https://chrome.google.com/webstore/detail/advanced-rest-client-appl/hgmloofddffdnphfgcellkdfbfbjeloo/reviews?hl=en-US\">Chrome Web Store</a>");
		plusone.showArrow(Direction.BOTTOM);
		factory.addItem(plusone);
		
		TutorialDialog donate = TutorialFactory.createItem();
		donate.setAbsolutePosition(228, 204);
		donate.setHTML("<h1>Donate any value! :)</h1><br/>Please, express your gratitude donating my work. &euro; 1 is just fine if each of you donate :)");
		donate.showArrow(Direction.BOTTOM);
		factory.addItem(donate);
		
		factory.start();
	}

	@Override
	public void showDonateDialog() {
		DonateDialogViewImpl dialog = new DonateDialogViewImpl();
		dialog.show();
	}
	@UiHandler("licensing")
	void onLicensingClick(ClickEvent e){
		e.preventDefault();
		LicenseDialog dialog = new LicenseDialog();
		dialog.show();
	}

}
