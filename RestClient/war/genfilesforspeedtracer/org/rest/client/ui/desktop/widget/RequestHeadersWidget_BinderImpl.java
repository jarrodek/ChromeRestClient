package org.rest.client.ui.desktop.widget;

import com.google.gwt.core.client.GWT;
import com.google.gwt.dom.client.Element;
import com.google.gwt.safehtml.client.SafeHtmlTemplates;
import com.google.gwt.safehtml.shared.SafeHtml;
import com.google.gwt.safehtml.shared.SafeHtmlUtils;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiBinderUtil;
import com.google.gwt.user.client.ui.Widget;

public class RequestHeadersWidget_BinderImpl implements UiBinder<com.google.gwt.user.client.ui.Widget, org.rest.client.ui.desktop.widget.RequestHeadersWidget>, org.rest.client.ui.desktop.widget.RequestHeadersWidget.Binder {

  interface Template extends SafeHtmlTemplates {
    @Template("Add new header")
    SafeHtml html1();
     
    @Template("")
    SafeHtml html2();
     
    @Template("<div class='{0}'> <span id='{1}'></span> <span id='{2}'></span> <span class='{3}'>Headers</span> </div> <div class='{4}' id='{5}'> <section class='{6}' data-tab='raw'> <span id='{7}'></span> </section> <section class='{8}' data-tab='form'> <span id='{9}'></span> <span id='{10}'></span> </section> </div>")
    SafeHtml html3(String arg0, String arg1, String arg2, String arg3, String arg4, String arg5, String arg6, String arg7, String arg8, String arg9, String arg10);
     
  }

  Template template = GWT.create(Template.class);

  public com.google.gwt.user.client.ui.Widget createAndBindUi(final org.rest.client.ui.desktop.widget.RequestHeadersWidget owner) {

    org.rest.client.ui.desktop.widget.RequestHeadersWidget_BinderImpl_GenBundle clientBundleFieldNameUnlikelyToCollideWithUserSpecifiedFieldOkay = (org.rest.client.ui.desktop.widget.RequestHeadersWidget_BinderImpl_GenBundle) GWT.create(org.rest.client.ui.desktop.widget.RequestHeadersWidget_BinderImpl_GenBundle.class);
    org.rest.client.resources.AppResources appResources = (org.rest.client.resources.AppResources) GWT.create(org.rest.client.resources.AppResources.class);
    org.rest.client.ui.desktop.widget.RequestHeadersWidget_BinderImpl_GenCss_style style = clientBundleFieldNameUnlikelyToCollideWithUserSpecifiedFieldOkay.style();
    java.lang.String domId0 = com.google.gwt.dom.client.Document.get().createUniqueId();
    com.google.gwt.user.client.ui.InlineLabel rawTab = (com.google.gwt.user.client.ui.InlineLabel) GWT.create(com.google.gwt.user.client.ui.InlineLabel.class);
    java.lang.String domId1 = com.google.gwt.dom.client.Document.get().createUniqueId();
    com.google.gwt.user.client.ui.InlineLabel formTab = (com.google.gwt.user.client.ui.InlineLabel) GWT.create(com.google.gwt.user.client.ui.InlineLabel.class);
    com.google.gwt.dom.client.DivElement tabContent = null;
    java.lang.String domId2 = com.google.gwt.dom.client.Document.get().createUniqueId();
    java.lang.String domId3 = com.google.gwt.dom.client.Document.get().createUniqueId();
    com.google.gwt.user.client.ui.TextArea headersRawInput = (com.google.gwt.user.client.ui.TextArea) GWT.create(com.google.gwt.user.client.ui.TextArea.class);
    java.lang.String domId4 = com.google.gwt.dom.client.Document.get().createUniqueId();
    com.google.gwt.user.client.ui.Anchor addHeader = (com.google.gwt.user.client.ui.Anchor) GWT.create(com.google.gwt.user.client.ui.Anchor.class);
    java.lang.String domId5 = com.google.gwt.dom.client.Document.get().createUniqueId();
    com.google.gwt.user.client.ui.HTMLPanel headersFormPanel = new com.google.gwt.user.client.ui.HTMLPanel(template.html2().asString());
    com.google.gwt.user.client.ui.HTMLPanel f_HTMLPanel1 = new com.google.gwt.user.client.ui.HTMLPanel(template.html3("" + appResources.appCss().tabs() + "", domId0, domId1, "" + appResources.appCss().tabCaption() + "", "" + appResources.appCss().tabsContent() + "", domId2, "" + appResources.appCss().tabContent() + " " + appResources.appCss().tabContentCurrent() + "", domId3, "" + appResources.appCss().tabContent() + "", domId4, domId5).asString());

    rawTab.setText("Raw");
    rawTab.setStyleName("" + appResources.appCss().tabHadler() + " " + appResources.appCss().tabHandlercurrent() + "");
    formTab.setText("Form");
    formTab.setStyleName("" + appResources.appCss().tabHadler() + "");
    headersRawInput.setStyleName("" + style.rawInput() + "");
    addHeader.setHTML(template.html1().asString());
    addHeader.setStyleName("" + appResources.appCss().addValueAnchor() + "");
    addHeader.setHref("#");
    f_HTMLPanel1.setStyleName("" + appResources.appCss().tabsPanel() + "");

    UiBinderUtil.TempAttachment attachRecord0 = UiBinderUtil.attachToDom(f_HTMLPanel1.getElement());
    com.google.gwt.user.client.Element domId0Element = com.google.gwt.dom.client.Document.get().getElementById(domId0).cast();
    com.google.gwt.user.client.Element domId1Element = com.google.gwt.dom.client.Document.get().getElementById(domId1).cast();
    tabContent = com.google.gwt.dom.client.Document.get().getElementById(domId2).cast();
    tabContent.removeAttribute("id");
    com.google.gwt.user.client.Element domId3Element = com.google.gwt.dom.client.Document.get().getElementById(domId3).cast();
    com.google.gwt.user.client.Element domId4Element = com.google.gwt.dom.client.Document.get().getElementById(domId4).cast();
    com.google.gwt.user.client.Element domId5Element = com.google.gwt.dom.client.Document.get().getElementById(domId5).cast();
    attachRecord0.detach();
    f_HTMLPanel1.addAndReplaceElement(rawTab, domId0Element);
    f_HTMLPanel1.addAndReplaceElement(formTab, domId1Element);
    f_HTMLPanel1.addAndReplaceElement(headersRawInput, domId3Element);
    f_HTMLPanel1.addAndReplaceElement(addHeader, domId4Element);
    f_HTMLPanel1.addAndReplaceElement(headersFormPanel, domId5Element);


    final com.google.gwt.event.dom.client.ClickHandler handlerMethodWithNameVeryUnlikelyToCollideWithUserFieldNames1 = new com.google.gwt.event.dom.client.ClickHandler() {
      public void onClick(com.google.gwt.event.dom.client.ClickEvent event) {
        owner.onAddHeader(event);
      }
    };
    addHeader.addClickHandler(handlerMethodWithNameVeryUnlikelyToCollideWithUserFieldNames1);

    owner.formTab = formTab;
    owner.headersFormPanel = headersFormPanel;
    owner.headersRawInput = headersRawInput;
    owner.rawTab = rawTab;
    owner.tabContent = tabContent;
    clientBundleFieldNameUnlikelyToCollideWithUserSpecifiedFieldOkay.style().ensureInjected();

    return f_HTMLPanel1;
  }
}
