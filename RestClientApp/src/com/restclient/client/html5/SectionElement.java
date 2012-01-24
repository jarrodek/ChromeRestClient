package com.restclient.client.html5;

import com.google.gwt.dom.client.Element;
import com.google.gwt.dom.client.TagName;
/**
 * Generic block container.
 * 
 * @see <a href="http://dev.w3.org/html5/spec/Overview.html#the-section-element">W3C HTML5 Specification</a>
 */
@TagName(SectionElement.TAG)
public class SectionElement extends Element {
	static final String TAG = "section";
	
	 /**
	   * Assert that the given {@link Element} is compatible with this class and
	   * automatically typecast it.
	   */
	  public static SectionElement as(Element elem) {
	    assert elem.getTagName().equalsIgnoreCase(TAG);
	    return (SectionElement) elem;
	  }

	  protected SectionElement() {
	  }
}
