package org.rest.client.ui.desktop;

import java.util.ArrayList;
import java.util.List;

import org.rest.client.RestClient;
import org.rest.client.headerssupport.AuthorizeDialog;
import org.rest.client.headerssupport.Base64Coder;
import org.rest.client.headerssupport.HeaderSupport;
import org.rest.client.headerssupport.OAuth.OauthParam;
import org.rest.client.ui.RequestView;

import com.allen_sauer.gwt.log.client.Log;
import com.google.gwt.core.client.Callback;
import com.google.gwt.event.logical.shared.CloseEvent;
import com.google.gwt.event.logical.shared.CloseHandler;
import com.google.gwt.regexp.shared.RegExp;
import com.google.gwt.regexp.shared.SplitResult;
import com.google.gwt.user.client.ui.PopupPanel;

public class HeaderSupportAuthorizationImpl implements HeaderSupport {
	
	AuthorizeDialog dialog = new AuthorizeDialog();
	private Callback<String, String> callback;
	String value = null;
	String[] baseParams = null;
	List<OauthParam> oauthParams = null;
	
	public HeaderSupportAuthorizationImpl(){
		this.value = null;
		this.baseParams = null;
		this.oauthParams = null;
	}
	
	
	@Override
	public void setValue(String value) {
		this.value = value;
		
		if(value.toLowerCase().startsWith("basic")){
			String basicValue = value.substring(6);
			try{
				String encoded = Base64Coder.decodeString(basicValue);
				String[] params = encoded.split(":");
				if( params.length == 2 ){
					baseParams = params;
				}
			} catch( IllegalArgumentException e ){
				Log.warn("IllegalArgumentException "+e.getMessage());
			}
		} else {
			oauthParams = createOAuthParamsFromHeader(value);
		}
	}
	
	private List<OauthParam> createOAuthParamsFromHeader(String value){
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
		RequestView rv = RestClient.getClientFactory().getRequestView();
		dialog.setFormMethod(rv.getMethod());
		dialog.setFormUrl(rv.getUrl());
		
		dialog.center();
		dialog.show();
		
		if(baseParams != null){
			dialog.setBasicVaues(baseParams[0], baseParams[1]);
		} else if(oauthParams != null){
			dialog.setOAuthParams(oauthParams);
		}
		
		dialog.addCloseHandler( new CloseHandler<PopupPanel>() {
			@Override
			public void onClose(CloseEvent<PopupPanel> event) {
				if( !event.isAutoClosed() ){
					value = dialog.getResult();
					callback.onSuccess(value);
				}
			}
		});
	}


	@Override
	public void setOnResultHandler(Callback<String, String> callback) {
		this.callback = callback;
	}
		
}
