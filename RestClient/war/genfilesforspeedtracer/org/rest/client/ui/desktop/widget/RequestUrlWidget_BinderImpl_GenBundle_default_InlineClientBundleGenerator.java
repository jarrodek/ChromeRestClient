package org.rest.client.ui.desktop.widget;

import com.google.gwt.core.client.GWT;
import com.google.gwt.resources.client.ResourcePrototype;

public class RequestUrlWidget_BinderImpl_GenBundle_default_InlineClientBundleGenerator implements org.rest.client.ui.desktop.widget.RequestUrlWidget_BinderImpl_GenBundle {
  private static RequestUrlWidget_BinderImpl_GenBundle_default_InlineClientBundleGenerator _instance0 = new RequestUrlWidget_BinderImpl_GenBundle_default_InlineClientBundleGenerator();
  private void styleInitializer() {
    style = new org.rest.client.ui.desktop.widget.RequestUrlWidget_BinderImpl_GenCss_style() {
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
        return com.google.gwt.i18n.client.LocaleInfo.getCurrentLocale().isRTL() ? ((".GD-EPHMNL{border-radius:" + ("2px")  + ";border:" + ("1px"+ " " +"solid"+ " " +"#aaa")  + ";position:" + ("absolute")  + ";left:" + ("0")  + ";right:" + ("0")  + ";top:" + ("7px")  + ";height:" + ("20px")  + ";}.GD-EPHMFM{right:" + ("15px")  + ";}.GD-EPHMGM{position:" + ("relative")  + ";min-height:" + ("40px")  + ";width:") + (("100%")  + ";}.GD-EPHMPL{min-height:" + ("80px")  + ";margin-bottom:" + ("20px")  + ";}.GD-EPHMBM{top:" + ("40px")  + ";}.GD-EPHMAM{position:" + ("relative")  + ";margin-top:" + ("55px")  + ";}.GD-EPHMCM{display:" + ("-webkit-box")  + ";}.GD-EPHMEM{font-weight:" + ("bold")  + ";margin-bottom:" + ("4px")  + ";margin-right:" + ("2px")  + ";}.GD-EPHMDM{width:" + ("800px") ) + (";}.GD-EPHMOL{position:" + ("relative")  + ";min-height:" + ("40px")  + ";margin-top:" + ("10px")  + ";}.GD-EPHMLL{margin-right:" + ("7px")  + ";}.GD-EPHMHM{position:" + ("relative")  + ";top:" + ("7px")  + ";}")) : ((".GD-EPHMNL{border-radius:" + ("2px")  + ";border:" + ("1px"+ " " +"solid"+ " " +"#aaa")  + ";position:" + ("absolute")  + ";right:" + ("0")  + ";left:" + ("0")  + ";top:" + ("7px")  + ";height:" + ("20px")  + ";}.GD-EPHMFM{left:" + ("15px")  + ";}.GD-EPHMGM{position:" + ("relative")  + ";min-height:" + ("40px")  + ";width:") + (("100%")  + ";}.GD-EPHMPL{min-height:" + ("80px")  + ";margin-bottom:" + ("20px")  + ";}.GD-EPHMBM{top:" + ("40px")  + ";}.GD-EPHMAM{position:" + ("relative")  + ";margin-top:" + ("55px")  + ";}.GD-EPHMCM{display:" + ("-webkit-box")  + ";}.GD-EPHMEM{font-weight:" + ("bold")  + ";margin-bottom:" + ("4px")  + ";margin-left:" + ("2px")  + ";}.GD-EPHMDM{width:" + ("800px") ) + (";}.GD-EPHMOL{position:" + ("relative")  + ";min-height:" + ("40px")  + ";margin-top:" + ("10px")  + ";}.GD-EPHMLL{margin-left:" + ("7px")  + ";}.GD-EPHMHM{position:" + ("relative")  + ";top:" + ("7px")  + ";}"));
      }
      public java.lang.String addParamAnchor(){
        return "GD-EPHMLL";
      }
      public java.lang.String detailedPanel(){
        return "GD-EPHMML";
      }
      public java.lang.String fullWidthRelativeInput(){
        return "GD-EPHMNL";
      }
      public java.lang.String hashSection(){
        return "GD-EPHMOL";
      }
      public java.lang.String opened(){
        return "GD-EPHMPL";
      }
      public java.lang.String paramsSection(){
        return "GD-EPHMAM";
      }
      public java.lang.String pathInput(){
        return "GD-EPHMBM";
      }
      public java.lang.String queryParamRow(){
        return "GD-EPHMCM";
      }
      public java.lang.String queryParamValueInput(){
        return "GD-EPHMDM";
      }
      public java.lang.String sectionTitle(){
        return "GD-EPHMEM";
      }
      public java.lang.String urlInput(){
        return "GD-EPHMFM";
      }
      public java.lang.String urlPanel(){
        return "GD-EPHMGM";
      }
      public java.lang.String urlToggleHandlerImage(){
        return "GD-EPHMHM";
      }
    }
    ;
  }
  private static class styleInitializer {
    static {
      _instance0.styleInitializer();
    }
    static org.rest.client.ui.desktop.widget.RequestUrlWidget_BinderImpl_GenCss_style get() {
      return style;
    }
  }
  public org.rest.client.ui.desktop.widget.RequestUrlWidget_BinderImpl_GenCss_style style() {
    return styleInitializer.get();
  }
  private static java.util.HashMap<java.lang.String, com.google.gwt.resources.client.ResourcePrototype> resourceMap;
  private static org.rest.client.ui.desktop.widget.RequestUrlWidget_BinderImpl_GenCss_style style;
  
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
      case 'style': return this.@org.rest.client.ui.desktop.widget.RequestUrlWidget_BinderImpl_GenBundle::style()();
    }
    return null;
  }-*/;
}
