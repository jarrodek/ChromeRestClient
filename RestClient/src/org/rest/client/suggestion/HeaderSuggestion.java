package org.rest.client.suggestion;

import com.google.gwt.user.client.ui.SuggestOracle.Suggestion;

public class HeaderSuggestion implements Suggestion {

  /**
   * The header name to suggest.
   */
  private String name;
  /**
   * Suggestion class.
   * @param url
   */
  public HeaderSuggestion(String name) {
    this.name = name;
  }
  
  /**
   * Gets the display string associated with this suggestion. The
   * interpretation of the display string depends upon the value of
   * its oracle's {@link com.google.gwt.user.client.ui.SuggestOracle#isDisplayStringHTML()}.
   *
   * @return the display string for this suggestion
   */
  @Override
  public String getDisplayString() {
	  String display = name;
//	  if(HeadersFillSupport.isNotSupportedW3C(name)){
//		  display += "<span class=\"suggestion-header-not-supported\">(not supported)</span>";
//	  }
	  return display;
  }
  /**
   * Gets the replacement string associated with this suggestion. When
   * this suggestion is selected, the replacement string will be entered
   * into the SuggestBox's text box.
   *
   * @return the string to be entered into the SuggestBox's text box when
   *         this suggestion is selected
   */
  @Override
  public String getReplacementString() {
    return name;
  }

}
