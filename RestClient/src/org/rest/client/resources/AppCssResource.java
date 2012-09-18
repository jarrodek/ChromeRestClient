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
package org.rest.client.resources;

import com.google.gwt.resources.client.CssResource;

public interface AppCssResource extends CssResource {
	String handlerImageClosed();
	String handlerImageOpened();
	String handlerImageContainer();
	
	/* Notes */
	String inlineNote();
	
	/* TABS	 */
	String tabsPanel();
	String tabs();
	String tabHadler();
	String tabCaption();
	String tabHandlercurrent();
	String tabsContent();
	String tabContent();
	String tabContentCurrent();
	
	/* Remove button */
	String removeButton();
	String formCtrl();
	
	/* Select control */
	String selectControl();
	
	/* Form controls */
	String addValueAnchor();
	String formRow();
	String formKeyInput();
	String formValueInput();
	
	/* Buttons */
	String submit();
	String green();
	String nomargin();
	String button();
	String dialogButtons();
	String inlineButtonsGroup();
	String inlineButton();
	String inlineButtonChecked();
	String inlineButtonHover();
	
	/* Controls visibility */
	String hidden();
	
	/* Headers fill support */
	String w3cError();
	
	/* Image for loader */
	String loaderImage();
	
	/* Position children in center of this container */
	String flexCenter();
	String flex();
	
	
	String statusCodeHintImage();
	
	/* HISTORY/SAVED request list */
	String historyWrapper();
	String historyListRow();
	String historyMethod();
	String historyUrl();
	String historyDate();
	String historyAction();
	String historyUrlValue();
	String historySelectButton();
	String historyHeaders();
	String historyPayload();
	String historyEncoding();
	String historyDetailed();
	String historySelected();
	String historyFlex1();
	
}
