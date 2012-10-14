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

import com.google.gwt.core.client.GWT;
import com.google.gwt.resources.client.ClientBundle;
import com.google.gwt.resources.client.ImageResource;
import com.google.gwt.resources.client.ImageResource.ImageOptions;
import com.google.gwt.resources.client.ImageResource.RepeatStyle;

public interface AppResources extends ClientBundle {
	
	public static final AppResources INSTANCE =  GWT.create(AppResources.class);
	
	@Source("handler_arrow_right.png")
	@ImageOptions(repeatStyle=RepeatStyle.None)
	ImageResource handlerArrowRight();
	
	@Source("handler_arrow_down.png")
	@ImageOptions(repeatStyle=RepeatStyle.None)
	ImageResource handlerArrowDown();
	
	@Source("triangle.png")
	@ImageOptions(repeatStyle=RepeatStyle.None)
	ImageResource tutorialTrialngle();
	
	@Source("app.css")
	AppCssResource appCss();
}
