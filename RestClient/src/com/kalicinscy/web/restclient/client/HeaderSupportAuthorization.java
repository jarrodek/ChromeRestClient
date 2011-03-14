package com.kalicinscy.web.restclient.client;

import java.util.ArrayList;
import java.util.List;

import com.google.gwt.event.logical.shared.CloseEvent;
import com.google.gwt.event.logical.shared.CloseHandler;
import com.google.gwt.event.logical.shared.HasValueChangeHandlers;
import com.google.gwt.event.logical.shared.ValueChangeEvent;
import com.google.gwt.event.logical.shared.ValueChangeHandler;
import com.google.gwt.event.shared.GwtEvent;
import com.google.gwt.event.shared.HandlerManager;
import com.google.gwt.event.shared.HandlerRegistration;
import com.google.gwt.event.shared.HasHandlers;
import com.google.gwt.regexp.shared.RegExp;
import com.google.gwt.regexp.shared.SplitResult;
import com.google.gwt.user.client.ui.PopupPanel;
import com.kalicinscy.web.restclient.client.api.Base64Coder;
import com.kalicinscy.web.restclient.client.api.OAuth.OauthParam;
import com.kalicinscy.web.restclient.client.ui.AuthorizeDialog;

public class HeaderSupportAuthorization implements HeaderSupport, HasHandlers, HasValueChangeHandlers<String> {
	
	AuthorizeDialog dialog = new AuthorizeDialog();
	private HandlerManager handlerManager = new HandlerManager(this);
	
	
	String value = null;
	String[] baseParams = null;
	List<OauthParam> oauthParams = null;
	
	public HeaderSupportAuthorization(){
		this.value = null;
		this.baseParams = null;
		this.oauthParams = null;
	}
	
	
	@Override
	public void setValue(String value) {
		this.value = value;
		try{
			String basicValue = Base64Coder.decodeString(value);
			String[] params = basicValue.split(":");
			if( params.length == 2 ){
				baseParams = params;
			}
		} catch( IllegalArgumentException e ){} //it's not base64 string
		
		oauthParams = createOAuthParamsFromHeader(value);
	}
	
	private List<OauthParam> createOAuthParamsFromHeader(String value){
		//OAuth realm="http://term.ie/",oauth_timestamp="1300117632",oauth_consumer_key="key",oauth_nonce="4DYBRVWI8GJB3BN1",oauth_token="accesskey",oauth_signature_method="HMAC-SHA1",oauth_version="1.0",oauth_signature="SEaeQCf6pCZToVvv4UHXt2YVGjA%3D"
		value = value.trim();
		if( !value.toLowerCase().startsWith("oauth") ){
			return null;
		}
		RegExp compiled = RegExp.compile( "oauth\\s+", "gim" );
		value = compiled.replace( value , "");
		compiled = RegExp.compile( ",\\s?", "gim" );
		
		List<OauthParam> authParams = new ArrayList<OauthParam>();
		
		SplitResult params = compiled.split(value);
		int len = params.length();
		for( int i=0; i<len;i++ ){
			String oauth_par = params.get(i);
			if( oauth_par.startsWith("realm") || oauth_par.contains("signature") ){
				continue;
			}
			String[] _tmp = oauth_par.split("=");
			if( _tmp.length == 1 ){
				_tmp[1] = "";
			}
			if( _tmp[1].startsWith("\"") ){
				_tmp[1] = _tmp[1].substring(1);
			}
			if( _tmp[1].endsWith("\"") ){
				_tmp[1] = _tmp[1].substring(0,_tmp[1].lastIndexOf("\""));
			}
			OauthParam p = new OauthParam();
			p.setKey(_tmp[0], false);
			p.setValue(_tmp[1]);
			authParams.add(p);
		}
		return authParams;
	}

	@Override
	public void openDialog() {
		dialog.center();
		dialog.show();
		
		if( baseParams != null ){
			dialog.setBasicVaues(baseParams[0], baseParams[1]);
		} else if( oauthParams != null ){
			dialog.setOAuthParams(oauthParams);
		}
		
		dialog.addCloseHandler( new CloseHandler<PopupPanel>() {
			@Override
			public void onClose(CloseEvent<PopupPanel> event) {
				if( !event.isAutoClosed() ){
					value = dialog.getResult();
					notyfiValueChanged();
				}
			}
		});
	}
	
	@Override
	public void fireEvent(GwtEvent<?> event) {
		handlerManager.fireEvent(event);
	}
	
	private void notyfiValueChanged(){
		ValueChangeEvent.fire(this, value);
	}

	@Override
	public HandlerRegistration addValueChangeHandler(ValueChangeHandler<String> handler) {
		return handlerManager.addHandler( ValueChangeEvent.getType(), handler );
	}

	
}
