package org.rest.client.ui.desktop;

import com.google.gwt.core.client.GWT;
import com.google.gwt.dom.client.Element;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiBinderUtil;
import com.google.gwt.user.client.ui.Widget;

public class MenuViewImpl_RequestViewImplUiBinderImpl implements UiBinder<com.google.gwt.user.client.ui.Widget, org.rest.client.ui.desktop.MenuViewImpl>, org.rest.client.ui.desktop.MenuViewImpl.RequestViewImplUiBinder {

  public com.google.gwt.user.client.ui.Widget createAndBindUi(final org.rest.client.ui.desktop.MenuViewImpl owner) {

    org.rest.client.ui.desktop.MenuViewImpl_RequestViewImplUiBinderImpl_GenBundle clientBundleFieldNameUnlikelyToCollideWithUserSpecifiedFieldOkay = (org.rest.client.ui.desktop.MenuViewImpl_RequestViewImplUiBinderImpl_GenBundle) GWT.create(org.rest.client.ui.desktop.MenuViewImpl_RequestViewImplUiBinderImpl_GenBundle.class);
    org.rest.client.resources.AppResources appResources = (org.rest.client.resources.AppResources) GWT.create(org.rest.client.resources.AppResources.class);
    org.rest.client.ui.desktop.MenuViewImpl_RequestViewImplUiBinderImpl_GenCss_style style = clientBundleFieldNameUnlikelyToCollideWithUserSpecifiedFieldOkay.style();
    org.rest.client.ui.html5.ListPanel root = (org.rest.client.ui.html5.ListPanel) GWT.create(org.rest.client.ui.html5.ListPanel.class);

    root.setStyleName("" + style.menuPanel() + "");



    owner.root = root;
    clientBundleFieldNameUnlikelyToCollideWithUserSpecifiedFieldOkay.style().ensureInjected();

    return root;
  }
}
