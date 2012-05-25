package org.rest.client.ui.desktop;

import com.google.gwt.core.client.GWT;
import com.google.gwt.resources.client.ResourcePrototype;

public class AddEncodingViewImpl_BinderImpl_GenBundle_default_InlineClientBundleGenerator implements org.rest.client.ui.desktop.AddEncodingViewImpl_BinderImpl_GenBundle {
  private static AddEncodingViewImpl_BinderImpl_GenBundle_default_InlineClientBundleGenerator _instance0 = new AddEncodingViewImpl_BinderImpl_GenBundle_default_InlineClientBundleGenerator();
  private void styleInitializer() {
    style = new org.rest.client.ui.desktop.AddEncodingViewImpl_BinderImpl_GenCss_style() {
      private boolean injected;
      public boolean ensureInjected() {
        if (!injected) {
          injected = true;
          com.google.gwt.dom.client.StyleInjector.inject(getText());
          return true;
        }
        return false;
      }
      public String getName() {
        return "style";
      }
      public String getText() {
        return com.google.gwt.i18n.client.LocaleInfo.getCurrentLocale().isRTL() ? ((".GD-EPHMLK{-webkit-box-align:" + ("center")  + ";-moz-box-align:" + ("center")  + ";-ms-box-align:" + ("center")  + ";box-align:" + ("center")  + ";-webkit-box-orient:" + ("horizontal")  + ";-moz-box-orient:" + ("horizontal")  + ";-ms-box-orient:" + ("horizontal")  + ";box-orient:" + ("horizontal")  + ";-webkit-box-pack:" + ("start")  + ";-moz-box-pack:" + ("start")  + ";-ms-box-pack:") + (("start")  + ";box-pack:" + ("start")  + ";display:" + ("-webkit-box")  + ";display:" + ("-moz-box")  + ";display:" + ("-ms-box")  + ";display:" + ("box")  + ";margin-top:" + ("20px")  + ";}.GD-EPHMKK{padding:" + ("30px"+ " " +"40px")  + ";}.GD-EPHMJK{margin-right:" + ("10px")  + ";}.GD-EPHMMK{color:" + ("red")  + ";}")) : ((".GD-EPHMLK{-webkit-box-align:" + ("center")  + ";-moz-box-align:" + ("center")  + ";-ms-box-align:" + ("center")  + ";box-align:" + ("center")  + ";-webkit-box-orient:" + ("horizontal")  + ";-moz-box-orient:" + ("horizontal")  + ";-ms-box-orient:" + ("horizontal")  + ";box-orient:" + ("horizontal")  + ";-webkit-box-pack:" + ("start")  + ";-moz-box-pack:" + ("start")  + ";-ms-box-pack:") + (("start")  + ";box-pack:" + ("start")  + ";display:" + ("-webkit-box")  + ";display:" + ("-moz-box")  + ";display:" + ("-ms-box")  + ";display:" + ("box")  + ";margin-top:" + ("20px")  + ";}.GD-EPHMKK{padding:" + ("30px"+ " " +"40px")  + ";}.GD-EPHMJK{margin-left:" + ("10px")  + ";}.GD-EPHMMK{color:" + ("red")  + ";}"));
      }
      public java.lang.String button(){
        return "GD-EPHMJK";
      }
      public java.lang.String container(){
        return "GD-EPHMKK";
      }
      public java.lang.String dialogButtons(){
        return "GD-EPHMLK";
      }
      public java.lang.String errorField(){
        return "GD-EPHMMK";
      }
    }
    ;
  }
  private static class styleInitializer {
    static {
      _instance0.styleInitializer();
    }
    static org.rest.client.ui.desktop.AddEncodingViewImpl_BinderImpl_GenCss_style get() {
      return style;
    }
  }
  public org.rest.client.ui.desktop.AddEncodingViewImpl_BinderImpl_GenCss_style style() {
    return styleInitializer.get();
  }
  private static java.util.HashMap<java.lang.String, com.google.gwt.resources.client.ResourcePrototype> resourceMap;
  private static org.rest.client.ui.desktop.AddEncodingViewImpl_BinderImpl_GenCss_style style;
  
  public ResourcePrototype[] getResources() {
    return new ResourcePrototype[] {
      style(), 
    };
  }
  public ResourcePrototype getResource(String name) {
    if (GWT.isScript()) {
      return getResourceNative(name);
    } else {
      if (resourceMap == null) {
        resourceMap = new java.util.HashMap<java.lang.String, com.google.gwt.resources.client.ResourcePrototype>();
        resourceMap.put("style", style());
      }
      return resourceMap.get(name);
    }
  }
  private native ResourcePrototype getResourceNative(String name) /*-{
    switch (name) {
      case 'style': return this.@org.rest.client.ui.desktop.AddEncodingViewImpl_BinderImpl_GenBundle::style()();
    }
    return null;
  }-*/;
}
