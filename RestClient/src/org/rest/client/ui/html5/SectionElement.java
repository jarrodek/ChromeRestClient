/*******************************************************************************
 * Copyright 2012 Paweł Psztyć
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *   http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/
package org.rest.client.ui.html5;

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
