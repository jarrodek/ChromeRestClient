package org.rest.client.ui.desktop.widget;

import com.google.gwt.core.client.GWT;
import com.google.gwt.resources.client.ResourcePrototype;

public class RequestBodyWidget_BinderImpl_GenBundle_default_InlineClientBundleGenerator implements org.rest.client.ui.desktop.widget.RequestBodyWidget_BinderImpl_GenBundle {
  private static RequestBodyWidget_BinderImpl_GenBundle_default_InlineClientBundleGenerator _instance0 = new RequestBodyWidget_BinderImpl_GenBundle_default_InlineClientBundleGenerator();
  private void styleInitializer() {
    style = new org.rest.client.ui.desktop.widget.RequestBodyWidget_BinderImpl_GenCss_style() {
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
        return com.google.gwt.i18n.client.LocaleInfo.getCurrentLocale().isRTL() ? ((".GD-EPHMIL{box-sizing:" + ("border-box")  + ";width:" + ("100%")  + ";height:" + ("100px")  + ";border:" + ("none")  + ";}.GD-EPHMJL{list-style-type:" + ("disc")  + ";margin-right:" + ("30px")  + ";margin-bottom:" + ("15px")  + ";}.GD-EPHMHL ul{-webkit-box-orient:" + ("vertical")  + ";}")) : ((".GD-EPHMIL{box-sizing:" + ("border-box")  + ";width:" + ("100%")  + ";height:" + ("100px")  + ";border:" + ("none")  + ";}.GD-EPHMJL{list-style-type:" + ("disc")  + ";margin-left:" + ("30px")  + ";margin-bottom:" + ("15px")  + ";}.GD-EPHMHL ul{-webkit-box-orient:" + ("vertical")  + ";}"));
      }
      public java.lang.String filesContainer(){
        return "GD-EPHMHL";
      }
      public java.lang.String rawInput(){
        return "GD-EPHMIL";
      }
      public java.lang.String selectedFilesList(){
        return "GD-EPHMJL";
      }
    }
    ;
  }
  private static class styleInitializer {
    static {
      _instance0.styleInitializer();
    }
    static org.rest.client.ui.desktop.widget.RequestBodyWidget_BinderImpl_GenCss_style get() {
      return style;
    }
  }
  public org.rest.client.ui.desktop.widget.RequestBodyWidget_BinderImpl_GenCss_style style() {
    return styleInitializer.get();
  }
  private static java.util.HashMap<java.lang.String, com.google.gwt.resources.client.ResourcePrototype> resourceMap;
  private static org.rest.client.ui.desktop.widget.RequestBodyWidget_BinderImpl_GenCss_style style;
  
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
      case 'style': return this.@org.rest.client.ui.desktop.widget.RequestBodyWidget_BinderImpl_GenBundle::style()();
    }
    return null;
  }-*/;
}
