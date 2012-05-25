package org.rest.client.ui.desktop;

import com.google.gwt.core.client.GWT;
import com.google.gwt.resources.client.ResourcePrototype;

public class MenuItemViewImpl_RequestViewImplUiBinderImpl_GenBundle_default_InlineClientBundleGenerator implements org.rest.client.ui.desktop.MenuItemViewImpl_RequestViewImplUiBinderImpl_GenBundle {
  private static MenuItemViewImpl_RequestViewImplUiBinderImpl_GenBundle_default_InlineClientBundleGenerator _instance0 = new MenuItemViewImpl_RequestViewImplUiBinderImpl_GenBundle_default_InlineClientBundleGenerator();
  private void styleInitializer() {
    style = new org.rest.client.ui.desktop.MenuItemViewImpl_RequestViewImplUiBinderImpl_GenCss_style() {
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
        return com.google.gwt.i18n.client.LocaleInfo.getCurrentLocale().isRTL() ? ((".GD-EPHMNK{list-style:" + ("none")  + ";padding:" + ("5px"+ " " +"0")  + ";margin:" + ("4px"+ " " +"0")  + ";cursor:" + ("pointer")  + ";padding-right:" + ("10px")  + ";border-right:" + ("3px"+ " " +"white"+ " " +"solid")  + ";}.GD-EPHMNK[aria-selected=\"true\"]{color:" + ("#dd4b39")  + ";border-right:" + ("3px"+ " " +"#dd4b39"+ " " +"solid")  + ";}")) : ((".GD-EPHMNK{list-style:" + ("none")  + ";padding:" + ("5px"+ " " +"0")  + ";margin:" + ("4px"+ " " +"0")  + ";cursor:" + ("pointer")  + ";padding-left:" + ("10px")  + ";border-left:" + ("3px"+ " " +"white"+ " " +"solid")  + ";}.GD-EPHMNK[aria-selected=\"true\"]{color:" + ("#dd4b39")  + ";border-left:" + ("3px"+ " " +"#dd4b39"+ " " +"solid")  + ";}"));
      }
      public java.lang.String item(){
        return "GD-EPHMNK";
      }
    }
    ;
  }
  private static class styleInitializer {
    static {
      _instance0.styleInitializer();
    }
    static org.rest.client.ui.desktop.MenuItemViewImpl_RequestViewImplUiBinderImpl_GenCss_style get() {
      return style;
    }
  }
  public org.rest.client.ui.desktop.MenuItemViewImpl_RequestViewImplUiBinderImpl_GenCss_style style() {
    return styleInitializer.get();
  }
  private static java.util.HashMap<java.lang.String, com.google.gwt.resources.client.ResourcePrototype> resourceMap;
  private static org.rest.client.ui.desktop.MenuItemViewImpl_RequestViewImplUiBinderImpl_GenCss_style style;
  
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
      case 'style': return this.@org.rest.client.ui.desktop.MenuItemViewImpl_RequestViewImplUiBinderImpl_GenBundle::style()();
    }
    return null;
  }-*/;
}
