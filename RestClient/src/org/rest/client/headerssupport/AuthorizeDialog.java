package org.rest.client.headerssupport;

import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Random;

import org.rest.client.headerssupport.OAuth.OauthParam;
import org.rest.client.ui.html5.HTML5InputNumber;

import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.logical.shared.SelectionEvent;
import com.google.gwt.event.logical.shared.SelectionHandler;
import com.google.gwt.user.client.ui.Anchor;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.CaptionPanel;
import com.google.gwt.user.client.ui.CheckBox;
import com.google.gwt.user.client.ui.DecoratedTabPanel;
import com.google.gwt.user.client.ui.DialogBox;
import com.google.gwt.user.client.ui.FlowPanel;
import com.google.gwt.user.client.ui.HasHorizontalAlignment;
import com.google.gwt.user.client.ui.HasVerticalAlignment;
import com.google.gwt.user.client.ui.HorizontalPanel;
import com.google.gwt.user.client.ui.Label;
import com.google.gwt.user.client.ui.PasswordTextBox;
import com.google.gwt.user.client.ui.RadioButton;
import com.google.gwt.user.client.ui.TextBox;
import com.google.gwt.user.client.ui.VerticalPanel;

public class AuthorizeDialog extends DialogBox {
	final DecoratedTabPanel formPanel;
	private int selectedTab = 0;
	final TextBox loginTextBox;
	final PasswordTextBox passBox;

	String oauthRequestType = "Request Token";
	String oauthSignMethod = "HMAC-SHA1";
	
	private String result = null;
	private TextBox oauth_consumer_key_box;
	private TextBox oauth_nonce_box;
	private TextBox oauth_request_token_box;
	private TextBox oauth_token_box;
	private HorizontalPanel accessTokenPanelLbl;
	private HorizontalPanel requestTokenPanelLbl;
	private HorizontalPanel consumerKeyPanel;
	private HorizontalPanel requestTokenPanel;
	private HorizontalPanel accessTokenPanel;
	private HorizontalPanel consumerKeyPanelLbl;
	private Label oauth_realm;
	private Label oauth_http_method;
	private final TextBox oauth_timestamp_box;
	private final HTML5InputNumber oauth_version_box;
	private final TextBox oauth_consumer_secret_box;
	private final TextBox oauth_request_token_secret;
	private final TextBox oauth_token_secret;
	private final RadioButton rdbtnSignedrequest;
	private final RadioButton methodHmacsha;
	private final RadioButton methodRsasha;
	private final RadioButton methodPlaintext;
	
	
	private String formUrl = "";
	private String formMethod = "";
	
	
	
	public AuthorizeDialog() {
		setText("Authorization");
		VerticalPanel mainPanel = new VerticalPanel();
		mainPanel.setStyleName("authorizeDialog");
		formPanel = new DecoratedTabPanel();
		mainPanel.add(formPanel);
		formPanel.setWidth("100%");
		
		FlowPanel buttonsPanel = new FlowPanel();
		Button cancel = new Button("Cancel");
		Button okButton = new Button("OK");
		buttonsPanel.add(okButton);
		buttonsPanel.add(cancel);
		buttonsPanel.addStyleName("dialogButtons");
		okButton.setStyleName("button");
		cancel.setStyleName("button");
		

		mainPanel.add(buttonsPanel);
		mainPanel.setCellHorizontalAlignment(buttonsPanel,
				HasHorizontalAlignment.ALIGN_RIGHT);
		mainPanel.setCellVerticalAlignment(buttonsPanel,
				HasVerticalAlignment.ALIGN_BOTTOM);
		mainPanel.setCellHeight(buttonsPanel, "40");

		// BASIC AUTH
		// base64 encode from login:password
		VerticalPanel basicPanel = new VerticalPanel();
		basicPanel.setWidth("300px");
		Label login = new Label("Login:");
		loginTextBox = new TextBox();
		loginTextBox.getElement().setAttribute("placeholder", "your username");
		HorizontalPanel passRow = new HorizontalPanel();
		Label pass = new Label("Password:");
		passBox = new PasswordTextBox();
		passBox.getElement().setAttribute("placeholder", "your password");
		final CheckBox showPass = new CheckBox("show password");
		basicPanel.add(login);
		basicPanel.add(loginTextBox);
		basicPanel.add(pass);
		passRow.add(passBox);
		passRow.add(showPass);
		basicPanel.add(passRow);
		/*
		 * Authorization: OAuth realm="", oauth_signature_method="HMAC-SHA1",
		 * oauth_version="2.0", oauth_nonce="nonce",
		 * oauth_timestamp="1300015009.175", oauth_consumer_key="consumerKey",
		 * oauth_token="Token",
		 * oauth_signature="dnqzPCI8FBejuw%2BBR32elua12AY%3D"
		 * 
		 * OAuth realm="", oauth_signature_method="PLAINTEXT",
		 * oauth_version="1.0", oauth_nonce="wdRr5U",
		 * oauth_timestamp="1300015222", oauth_consumer_key="b",
		 * oauth_token="c", oauth_signature="d%26e"
		 * 
		 * 
		 * 
		 * BASE STR: (HTTP Method + URL + HTTP Request Parameter String) KEY:
		 * YourConsumerSecret&TokenSecret || YourConsumerSecret&
		 * oauth_signature: hash_hmac('SHA1', base_string, key, true) - for php
		 */
		// OAUTH
		// Get an Unauthorized Request Token
		VerticalPanel oauthRequestPanel = new VerticalPanel();
		oauthRequestPanel.setWidth("100%");

		HorizontalPanel realmPanel = new HorizontalPanel();
		oauthRequestPanel.add(realmPanel);
		realmPanel.setWidth("100%");

		Label realmLabel = new Label("Realm:");
		realmPanel.add(realmLabel);
		realmPanel.setCellWidth(realmLabel, "50px");
		realmLabel.setWidth("48px");
		
		String currentURL = getCurrentURLValue();
		
		oauth_realm = new Label(currentURL);
		oauth_realm.setStyleName("noActive-Label");
		realmPanel.add(oauth_realm);

		HorizontalPanel httpMethodPanel = new HorizontalPanel();
		oauthRequestPanel.add(httpMethodPanel);
		httpMethodPanel.setWidth("100%");

		Label httpMethodLabel = new Label("HTTP Method:");
		httpMethodPanel.add(httpMethodLabel);
		httpMethodPanel.setCellWidth(httpMethodLabel, "90px");
		httpMethodLabel.setWidth("88px");

		oauth_http_method = new Label(formMethod);
		oauth_http_method.setStyleName("noActive-Label");
		httpMethodPanel.add(oauth_http_method);

		CaptionPanel requestTypeFieldset = new CaptionPanel("Type");
		oauthRequestPanel.add(requestTypeFieldset);

		HorizontalPanel horizontalPanel = new HorizontalPanel();
		requestTypeFieldset.setContentWidget(horizontalPanel);
		horizontalPanel.setSize("100%", "");

		RadioButton rdbtnRequestToken = new RadioButton("requestType",
				"Request Token");
		rdbtnRequestToken.setValue(true);

		horizontalPanel.add(rdbtnRequestToken);

		RadioButton rdbtnRequestAuthToken = new RadioButton("requestType",
				"Request Access Token");
		horizontalPanel.add(rdbtnRequestAuthToken);

		rdbtnSignedrequest = new RadioButton("requestType",
				"Signed Request");
		horizontalPanel.add(rdbtnSignedrequest);

		CaptionPanel signatureMethodFieldset = new CaptionPanel(
				"signature method");
		oauthRequestPanel.add(signatureMethodFieldset);

		HorizontalPanel methodPanel = new HorizontalPanel();
		signatureMethodFieldset.setContentWidget(methodPanel);
		methodPanel.setSize("100%", "");

		methodHmacsha = new RadioButton("sigMethod", "HMAC-SHA1");
		methodHmacsha.setValue(true);
		methodPanel.add(methodHmacsha);

		methodRsasha = new RadioButton("sigMethod", "RSA-SHA1");
		methodRsasha.setVisible(false);
		methodPanel.add(methodRsasha);

		methodPlaintext = new RadioButton("sigMethod", "PLAINTEXT");
		methodPanel.add(methodPlaintext);

		ClickHandler methodClickHandler = new ClickHandler() {
			@Override
			public void onClick(ClickEvent event) {
				RadioButton btn = (RadioButton) event.getSource();
				oauthSignMethod = btn.getHTML();
			}
		};
		methodHmacsha.addClickHandler(methodClickHandler);
		methodPlaintext.addClickHandler(methodClickHandler);
		methodRsasha.addClickHandler(methodClickHandler);

		consumerKeyPanelLbl = new HorizontalPanel();
		oauthRequestPanel.add(consumerKeyPanelLbl);
		consumerKeyPanelLbl.setWidth("100%");
		// consumer key
		Label oauth_consumer_key = new Label("Consumer key:");
		consumerKeyPanelLbl.add(oauth_consumer_key);
		oauth_consumer_key.setWidth("");
		consumerKeyPanelLbl.setCellWidth(oauth_consumer_key, "50%");

		Label lblConsumerSecret = new Label("Consumer secret:");
		consumerKeyPanelLbl.add(lblConsumerSecret);

		formPanel.add(basicPanel, "Basic");
		formPanel.add(oauthRequestPanel, "OAuth");

		consumerKeyPanel = new HorizontalPanel();
		oauthRequestPanel.add(consumerKeyPanel);
		consumerKeyPanel.setWidth("100%");
		oauth_consumer_key_box = new TextBox();
		consumerKeyPanel.add(oauth_consumer_key_box);
		consumerKeyPanel.setCellWidth(oauth_consumer_key_box, "50%");
		oauth_consumer_key_box.setMaxLength(225);
		oauth_consumer_key_box.getElement().setAttribute("placeholder",
				"Enter your key");
		oauth_consumer_key_box.setWidth("95%");

		oauth_consumer_secret_box = new TextBox();
		consumerKeyPanel.add(oauth_consumer_secret_box);
		oauth_consumer_secret_box.setWidth("95%");
		oauth_consumer_secret_box.getElement().setAttribute("placeholder","Enter your secret");
		requestTokenPanelLbl = new HorizontalPanel();
		oauthRequestPanel.add(requestTokenPanelLbl);
		requestTokenPanelLbl.setWidth("100%");

		Label lblRequestToken = new Label("Request Token");
		requestTokenPanelLbl.add(lblRequestToken);
		requestTokenPanelLbl.setCellWidth(lblRequestToken, "50%");

		Label lblRequestTokenSecret = new Label("Request Token Secret");
		requestTokenPanelLbl.add(lblRequestTokenSecret);

		requestTokenPanel = new HorizontalPanel();
		oauthRequestPanel.add(requestTokenPanel);
		requestTokenPanel.setWidth("100%");

		oauth_request_token_box = new TextBox();
		requestTokenPanel.add(oauth_request_token_box);
		requestTokenPanel.setCellWidth(oauth_request_token_box, "50%");
		oauth_request_token_box.setWidth("95%");
		oauth_request_token_box.getElement().setAttribute("placeholder","Enter request token");
		
		oauth_request_token_secret = new TextBox();
		requestTokenPanel.add(oauth_request_token_secret);
		oauth_request_token_secret.setWidth("95%");
		oauth_request_token_secret.getElement().setAttribute("placeholder","Enter request secret");

		accessTokenPanelLbl = new HorizontalPanel();
		oauthRequestPanel.add(accessTokenPanelLbl);
		accessTokenPanelLbl.setWidth("100%");

		Label lblAccessToken = new Label("Access Token");
		accessTokenPanelLbl.add(lblAccessToken);
		accessTokenPanelLbl.setCellWidth(lblAccessToken, "50%");

		Label lblAccesstokenSecret = new Label("AccessToken Secret");
		accessTokenPanelLbl.add(lblAccesstokenSecret);

		accessTokenPanel = new HorizontalPanel();
		oauthRequestPanel.add(accessTokenPanel);
		accessTokenPanel.setWidth("100%");

		oauth_token_box = new TextBox();
		accessTokenPanel.add(oauth_token_box);
		accessTokenPanel.setCellWidth(oauth_token_box, "50%");
		oauth_token_box.setWidth("95%");
		oauth_token_box.getElement().setAttribute("placeholder","Enter Access Token");
		
		oauth_token_secret = new TextBox();
		accessTokenPanel.add(oauth_token_secret);
		oauth_token_secret.setWidth("95%");
		oauth_token_secret.getElement().setAttribute("placeholder","Enter Access Secret");

		Label timestampLabel = new Label("Timestamp");
		oauthRequestPanel.add(timestampLabel);

		oauth_timestamp_box = new TextBox();
		oauthRequestPanel.add(oauth_timestamp_box);
		oauth_timestamp_box.setWidth("310px");
		oauth_timestamp_box.setValue( Math.round((new Date().getTime())/1000) + "");
		oauth_timestamp_box.getElement().setAttribute("placeholder","Can't be empty!");
		
		Label nonceLabel = new Label("Nonce");
		oauthRequestPanel.add(nonceLabel);

		HorizontalPanel noncePanel = new HorizontalPanel();
		oauthRequestPanel.add(noncePanel);

		oauth_nonce_box = new TextBox();
		noncePanel.add(oauth_nonce_box);
		oauth_nonce_box.setWidth("310px");
		oauth_nonce_box.getElement().setAttribute("placeholder","Can't be empty!");
		oauth_nonce_box.setText(generateNonce());

		Anchor nonceGenerator = new Anchor("Generate");
		noncePanel.add(nonceGenerator);
		noncePanel.setCellHorizontalAlignment(nonceGenerator,
				HasHorizontalAlignment.ALIGN_RIGHT);
		noncePanel.setCellWidth(nonceGenerator, "60px");
		noncePanel.setCellVerticalAlignment(nonceGenerator,
				HasVerticalAlignment.ALIGN_MIDDLE);
		nonceGenerator.addClickHandler(new ClickHandler() {

			@Override
			public void onClick(ClickEvent event) {
				oauth_nonce_box.setText(generateNonce());
			}

		});

		Label versionLabel = new Label("Version");
		oauthRequestPanel.add(versionLabel);

		oauth_version_box = new HTML5InputNumber();

		oauth_version_box.setText("1.0");
		oauth_version_box.setAutofocus(false);
		oauth_version_box.setAutocomplete(false);
		oauthRequestPanel.add(oauth_version_box);
		formPanel.selectTab(selectedTab);

		setWidget(mainPanel);
		mainPanel.setSize("536px", "179px");
		showPass.addClickHandler(new ClickHandler() {
			@Override
			public void onClick(ClickEvent event) {
				if (showPass.getValue()) {
					passBox.getElement().setAttribute("type", "text");
				} else {
					passBox.getElement().setAttribute("type", "password");
				}
			}
		});
		cancel.addClickHandler(new ClickHandler() {
			@Override
			public void onClick(ClickEvent event) {
				hide(true); // simulate auto-close to not trigger value check
			}
		});
		formPanel.addSelectionHandler(new SelectionHandler<Integer>() {
			@Override
			public void onSelection(SelectionEvent<Integer> event) {
				selectedTab = event.getSelectedItem();
				center();
			}
		});

		okButton.addClickHandler(new ClickHandler() {
			@Override
			public void onClick(ClickEvent event) {
				if (selectedTab == 0) {
					setBasicValue();
				} else {
					setOauthValue();
				}
				hide();
			}
		});

		ClickHandler typeRequestHandler = new ClickHandler() {
			@Override
			public void onClick(ClickEvent event) {
				RadioButton rb = (RadioButton) event.getSource();
				oauthRequestType = rb.getHTML();
				setOAuthFormControls();
			}
		};
		rdbtnRequestToken.addClickHandler(typeRequestHandler);
		rdbtnRequestAuthToken.addClickHandler(typeRequestHandler);
		rdbtnSignedrequest.addClickHandler(typeRequestHandler);
		setOAuthFormControls();
	}

	private String getCurrentURLValue(){
		String currentURL = null;
		if(formUrl == null){
			return null;
		}
		int schemePos = formUrl.indexOf(":");
		if( schemePos != -1 ){
			int authorityPos = formUrl.indexOf("/", schemePos+3);
			if(authorityPos != -1){
				currentURL = formUrl.substring(0,authorityPos +1).toLowerCase();
			}
		}
		return currentURL;
	}
	
	private void setOauthValue() {
		
		Map<String, String> oauthParams = getOauthParams();
		List<OauthParam> params = OAuth.createParamsList(oauthParams);
		String signature = OAuth.getSignatureValue(formMethod, formUrl, params);
		
		String headerValue = "OAuth realm=\""+oauthParams.get("realm")+"\",";
		Iterator<OauthParam> it = params.iterator();
		while(it.hasNext()){
			OauthParam item = it.next();
			String key = item.getKey();
			if( key.equals("oauth_consumer_secret") || key.equals("oauth_realm") || key.equals("oauth_token_secret") ){
				continue;
			}
			headerValue += item.getKey() + "=\"" + item.getValue() +"\",";
		}
		headerValue += "oauth_signature=\""+signature+"\"";
		result = headerValue;
	}

	private  Map<String, String> getOauthParams() {
		Map<String, String> oauthParameters = new HashMap<String, String>();
		oauthParameters.put("consumer_key", oauth_consumer_key_box.getText());
		oauthParameters.put("consumer_secret",
				oauth_consumer_secret_box.getText());
		
		String requestToken = "";
		String requestTokenSecret = "";
		if( oauthRequestType.equals("Request Access Token") ){
			requestToken = oauth_request_token_box.getText();
			requestTokenSecret = oauth_request_token_secret.getText();
		} else if( oauthRequestType.equals("Signed Request") ){
			requestToken = oauth_token_box.getText();
			requestTokenSecret = oauth_token_secret.getText();
		}
		
		if (!requestToken.equals("")) {
			oauthParameters.put("token", requestToken);
		}
		if (!requestTokenSecret.equals("")) {
			oauthParameters.put("token_secret", requestTokenSecret);
		}
		
		oauthParameters.put("nonce", oauth_nonce_box.getText());
		oauthParameters.put("realm", oauth_realm.getText());
		oauthParameters.put("signature_method", oauthSignMethod);
		oauthParameters.put("timestamp", oauth_timestamp_box.getText());
		oauthParameters.put("version", oauth_version_box.getText());
		return oauthParameters;
	}

	private void setOAuthFormControls() {
		if (oauthRequestType.equals("Request Token")) {
			requestTokenPanelLbl.setVisible(false);
			requestTokenPanel.setVisible(false);
			accessTokenPanelLbl.setVisible(false);
			accessTokenPanel.setVisible(false);
		} else if (oauthRequestType.equals("Request Access Token")) {
			requestTokenPanelLbl.setVisible(true);
			requestTokenPanel.setVisible(true);
			accessTokenPanelLbl.setVisible(false);
			accessTokenPanel.setVisible(false);
		} else if (oauthRequestType.equals("Signed Request")) {
			requestTokenPanelLbl.setVisible(false);
			requestTokenPanel.setVisible(false);
			accessTokenPanelLbl.setVisible(true);
			accessTokenPanel.setVisible(true);
		}
	}

	private void setBasicValue() {
		String toEncode = loginTextBox.getText() + ":" + passBox.getText();
		result = "Basic " + Base64Coder.encodeString(toEncode);
	}

	public String getResult() {
		return result;
	}

	public void setBasicVaues(String login, String pass) {
		loginTextBox.setText(login);
		passBox.setText(pass);
	}

	private String generateNonce() {
		String AB = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		Random rnd = new Random();
		int len = 16;
		StringBuilder sb = new StringBuilder(len);
		int ABlen = AB.length();
		for (int i = 0; i < len; i++) {
			int index = rnd.nextInt(ABlen);
			int end = Math.min(index + 1, ABlen);
			sb.append(AB.substring(index, end));
		}
		return sb.toString();

	}

	public void setOAuthParams(List<OauthParam> oauthParams) {
		
		Iterator<OauthParam> it = oauthParams.iterator();
		while( it.hasNext() ){
			OauthParam item = it.next();
			String field = item.getKey();
			String value = item.getValue();
			if( field.equals("oauth_timestamp") ){
				oauth_timestamp_box.setValue(value);
			}
			if( field.equals("oauth_version") ){
				oauth_version_box.setValue(value);
			}
			if( field.equals("oauth_consumer_key") ){
				oauth_consumer_key_box.setValue(value);
			}
			if( field.equals("oauth_nonce") ){
				oauth_nonce_box.setValue(value);
			}
			if( field.equals("oauth_signature_method") ){
				if( value.equals("HMAC-SHA1") ){
					methodHmacsha.setValue(true);
					oauthSignMethod = "HMAC-SHA1";
				}
				if( value.equals("RSA-SHA1") ){
					methodRsasha.setValue(true);
					oauthSignMethod = "RSA-SHA1";
				}
				if( value.equals("PLAINTEXT") ){
					methodPlaintext.setValue(true);
					oauthSignMethod = "PLAINTEXT";
				}
			}
			
			if( field.equals("oauth_token") ){
				oauth_token_box.setValue(value);
				rdbtnSignedrequest.setValue(true);
				oauthRequestType = rdbtnSignedrequest.getHTML();
				setOAuthFormControls();
			}
		}
		selectedTab = 1;
		formPanel.selectTab(selectedTab);
	}

	

	public void setFormMethod(String formMethod) {
		this.formMethod = formMethod;
		oauth_http_method.setText(formMethod);
	}

	

	public void setFormUrl(String formUrl) {
		this.formUrl = formUrl;
		String currentURL = getCurrentURLValue();
		oauth_realm.setText(currentURL);
	}
}
