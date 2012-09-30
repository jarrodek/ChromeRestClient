package org.rest.client.suggestion;

import com.google.gwt.user.client.ui.SuggestOracle.Suggestion;

public class UrlSuggestion implements Suggestion {

	/**
	 * The url to suggest.
	 */
	private String url;
	private final boolean isHistory;

	/**
	 * Suggestion cass.
	 * 
	 * @param url
	 */
	public UrlSuggestion(String url, boolean isHistory) {
		this.url = url;
		this.isHistory = isHistory;
	}

	/**
	 * Gets the display string associated with this suggestion. The
	 * interpretation of the display string depends upon the value of its
	 * oracle's
	 * {@link com.google.gwt.user.client.ui.SuggestOracle#isDisplayStringHTML()}
	 * .
	 * 
	 * @return the display string for this suggestion
	 */
	@Override
	public String getDisplayString() {
		String titleStr = url.replace("\"", "\\\"");
		String result = "<div class=\"url-suggestion-item\" title=\""+titleStr+"\"><span class=\"url-value\">"+url+"</span>";
		if(isHistory){
			result += " <span class=\"url-history\">(from chrome history)</span>";
		} else {
			result += " <span class=\"url-history\">(from saved)</span>";
		}
		result += "</div>";
		return result;
	}

	/**
	 * Gets the replacement string associated with this suggestion. When this
	 * suggestion is selected, the replacement string will be entered into the
	 * SuggestBox's text box.
	 * 
	 * @return the string to be entered into the SuggestBox's text box when this
	 *         suggestion is selected
	 */
	@Override
	public String getReplacementString() {
		return url;
	}

}
