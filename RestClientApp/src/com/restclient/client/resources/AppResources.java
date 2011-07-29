package com.restclient.client.resources;

import com.google.gwt.core.client.GWT;
import com.google.gwt.resources.client.ClientBundle;
import com.google.gwt.resources.client.ExternalTextResource;

public interface AppResources extends ClientBundle {

  AppResources INSTANCE = GWT.create(AppResources.class);
  
  @Source("statuses.json")
  ExternalTextResource asyncStatus();
  
}
