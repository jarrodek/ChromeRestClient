package org.rest.client.ui.desktop;

import com.google.gwt.core.client.GWT;
import com.google.gwt.resources.client.ResourcePrototype;

public class RequestViewImpl_RequestViewImplUiBinderImpl_GenBundle_default_InlineClientBundleGenerator implements org.rest.client.ui.desktop.RequestViewImpl_RequestViewImplUiBinderImpl_GenBundle {
  private static RequestViewImpl_RequestViewImplUiBinderImpl_GenBundle_default_InlineClientBundleGenerator _instance0 = new RequestViewImpl_RequestViewImplUiBinderImpl_GenBundle_default_InlineClientBundleGenerator();
  private void styleInitializer() {
    style = new org.rest.client.ui.desktop.RequestViewImpl_RequestViewImplUiBinderImpl_GenCss_style() {
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
        return com.google.gwt.i18n.client.LocaleInfo.getCurrentLocale().isRTL() ? ((".GD-EPHMEL{height:" + ("38px")  + ";background-color:" + ("#f4f4f4")  + ";}.GD-EPHMCL{display:" + ("-webkit-box")  + ";-webkit-box-orient:" + ("horizontal")  + ";}.GD-EPHMDL{font-size:" + ("11px")  + ";width:" + ("150px")  + ";vertical-align:" + ("top")  + ";height:" + ("9px")  + ";}.GD-EPHMPK{float:" + ("left")  + ";margin-left:" + ("10px")  + ";margin-top:") + (("15px")  + ";display:" + ("inline-block")  + ";vertical-align:" + ("top")  + ";}.GD-EPHMBL{margin-top:" + ("15px")  + ";display:" + ("inline-block")  + ";vertical-align:" + ("top")  + ";}.GD-EPHMAL>*{margin-right:" + ("10px")  + ";}.GD-EPHMFL label,.GD-EPHMFL{cursor:" + ("pointer")  + ";}")) : ((".GD-EPHMEL{height:" + ("38px")  + ";background-color:" + ("#f4f4f4")  + ";}.GD-EPHMCL{display:" + ("-webkit-box")  + ";-webkit-box-orient:" + ("horizontal")  + ";}.GD-EPHMDL{font-size:" + ("11px")  + ";width:" + ("150px")  + ";vertical-align:" + ("top")  + ";height:" + ("9px")  + ";}.GD-EPHMPK{float:" + ("right")  + ";margin-right:" + ("10px")  + ";margin-top:") + (("15px")  + ";display:" + ("inline-block")  + ";vertical-align:" + ("top")  + ";}.GD-EPHMBL{margin-top:" + ("15px")  + ";display:" + ("inline-block")  + ";vertical-align:" + ("top")  + ";}.GD-EPHMAL>*{margin-left:" + ("10px")  + ";}.GD-EPHMFL label,.GD-EPHMFL{cursor:" + ("pointer")  + ";}"));
      }
      public java.lang.String actionBar(){
        return "GD-EPHMPK";
      }
      public java.lang.String actions(){
        return "GD-EPHMAL";
      }
      public java.lang.String contentTypeSection(){
        return "GD-EPHMBL";
      }
      public java.lang.String methodsWidget(){
        return "GD-EPHMCL";
      }
      public java.lang.String otherInput(){
        return "GD-EPHMDL";
      }
      public java.lang.String projectPanel(){
        return "GD-EPHMEL";
      }
      public java.lang.String radioButton(){
        return "GD-EPHMFL";
      }
      public java.lang.String requestPanel(){
        return "GD-EPHMGL";
      }
    }
    ;
  }
  private static class styleInitializer {
    static {
      _instance0.styleInitializer();
    }
    static org.rest.client.ui.desktop.RequestViewImpl_RequestViewImplUiBinderImpl_GenCss_style get() {
      return style;
    }
  }
  public org.rest.client.ui.desktop.RequestViewImpl_RequestViewImplUiBinderImpl_GenCss_style style() {
    return styleInitializer.get();
  }
  private static java.util.HashMap<java.lang.String, com.google.gwt.resources.client.ResourcePrototype> resourceMap;
  private static org.rest.client.ui.desktop.RequestViewImpl_RequestViewImplUiBinderImpl_GenCss_style style;
  
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
      case 'style': return this.@org.rest.client.ui.desktop.RequestViewImpl_RequestViewImplUiBinderImpl_GenBundle::style()();
    }
    return null;
  }-*/;
}
