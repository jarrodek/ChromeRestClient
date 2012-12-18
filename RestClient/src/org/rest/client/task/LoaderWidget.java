package org.rest.client.task;

import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.Element;
import com.google.gwt.user.client.ui.HasText;

public class LoaderWidget implements HasText {

	final Element loadingInfo;
	final Element progress;
	
	public LoaderWidget() {
		loadingInfo = DOM.getElementById("loadingInfo");
		progress = DOM.getElementById("progress");
	}

	/**
	 * Sets loader text
	 */
	public void setText(String loadingText) {
		loadingInfo.setInnerText(loadingText);
	}
	/**
	 * Get displayed loader text
	 */
	public String getText() {
		return loadingInfo.getInnerText();
	}
	
	public void setProgress(int percent){
		progress.setAttribute("style", "width: "+percent+"%");
		//String calcValue = ""+percent+"% - 1px";
		//pacman.setAttribute("style", "left:-webkit-calc("+calcValue+");left:-moz-calc("+calcValue+");left:-o-calc("+calcValue+");left:calc("+calcValue+");");
	}

	public void setFatalError(String message) {
		//TODO: create error screen
		loadingInfo.setInnerText(message);
	}
}
