package org.rest.client.ui.desktop.widget;

import com.google.gwt.core.client.GWT;
import com.google.gwt.dom.client.Element;
import com.google.gwt.safehtml.client.SafeHtmlTemplates;
import com.google.gwt.safehtml.shared.SafeHtml;
import com.google.gwt.safehtml.shared.SafeHtmlUtils;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiBinderUtil;
import com.google.gwt.user.client.ui.Widget;

public class RequestBodyWidget_BinderImpl implements UiBinder<com.google.gwt.user.client.ui.Widget, org.rest.client.ui.desktop.widget.RequestBodyWidget>, org.rest.client.ui.desktop.widget.RequestBodyWidget.Binder {

  interface Template extends SafeHtmlTemplates {
    @Template("Add new value")
    SafeHtml html1();
     
    @Template("")
    SafeHtml html2();
     
    @Template("Add new file field")
    SafeHtml html3();
     
    @Template("")
    SafeHtml html4();
     
    @Template("<div class='{0}'> <span id='{1}'></span> <span id='{2}'></span> <span id='{3}'></span> <span class='{4}'>Payload</span> </div> <div class='{5}' id='{6}'> <section class='{7}' data-tab='raw'> <span id='{8}'></span> </section> <section class='{9}' data-tab='form'> <span id='{10}'></span> <span id='{11}'></span> </section> <section class='{12}' data-tab='file'> <span id='{13}'></span> <span id='{14}'></span> </section> </div>")
    SafeHtml html5(String arg0, String arg1, String arg2, String arg3, String arg4, String arg5, String arg6, String arg7, String arg8, String arg9, String arg10, String arg11, String arg12, String arg13, String arg14);
     
  }

  Template template = GWT.create(Template.class);

  public com.google.gwt.user.client.ui.Widget createAndBindUi(final org.rest.client.ui.desktop.widget.RequestBodyWidget owner) {

    org.rest.client.ui.desktop.widget.RequestBodyWidget_BinderImpl_GenBundle clientBundleFieldNameUnlikelyToCollideWithUserSpecifiedFieldOkay = (org.rest.client.ui.desktop.widget.RequestBodyWidget_BinderImpl_GenBundle) GWT.create(org.rest.client.ui.desktop.widget.RequestBodyWidget_BinderImpl_GenBundle.class);
    org.rest.client.resources.AppResources appResources = (org.rest.client.resources.AppResources) GWT.create(org.rest.client.resources.AppResources.class);
    org.rest.client.ui.desktop.widget.RequestBodyWidget_BinderImpl_GenCss_style style = clientBundleFieldNameUnlikelyToCollideWithUserSpecifiedFieldOkay.style();
    java.lang.String domId0 = com.google.gwt.dom.client.Document.get().createUniqueId();
    com.google.gwt.user.client.ui.InlineLabel rawTab = (com.google.gwt.user.client.ui.InlineLabel) GWT.create(com.google.gwt.user.client.ui.InlineLabel.class);
    java.lang.String domId1 = com.google.gwt.dom.client.Document.get().createUniqueId();
    com.google.gwt.user.client.ui.InlineLabel formTab = (com.google.gwt.user.client.ui.InlineLabel) GWT.create(com.google.gwt.user.client.ui.InlineLabel.class);
    java.lang.String domId2 = com.google.gwt.dom.client.Document.get().createUniqueId();
    com.google.gwt.user.client.ui.InlineLabel filesTab = (com.google.gwt.user.client.ui.InlineLabel) GWT.create(com.google.gwt.user.client.ui.InlineLabel.class);
    com.google.gwt.dom.client.DivElement tabContent = null;
    java.lang.String domId3 = com.google.gwt.dom.client.Document.get().createUniqueId();
    java.lang.String domId4 = com.google.gwt.dom.client.Document.get().createUniqueId();
    com.google.gwt.user.client.ui.TextArea payloadRawInput = (com.google.gwt.user.client.ui.TextArea) GWT.create(com.google.gwt.user.client.ui.TextArea.class);
    java.lang.String domId5 = com.google.gwt.dom.client.Document.get().createUniqueId();
    com.google.gwt.user.client.ui.Anchor addValue = (com.google.gwt.user.client.ui.Anchor) GWT.create(com.google.gwt.user.client.ui.Anchor.class);
    java.lang.String domId6 = com.google.gwt.dom.client.Document.get().createUniqueId();
    com.google.gwt.user.client.ui.HTMLPanel payloadFormPanel = new com.google.gwt.user.client.ui.HTMLPanel(template.html2().asString());
    java.lang.String domId7 = com.google.gwt.dom.client.Document.get().createUniqueId();
    com.google.gwt.user.client.ui.Anchor addFile = (com.google.gwt.user.client.ui.Anchor) GWT.create(com.google.gwt.user.client.ui.Anchor.class);
    java.lang.String domId8 = com.google.gwt.dom.client.Document.get().createUniqueId();
    com.google.gwt.user.client.ui.HTMLPanel filesFormPanel = new com.google.gwt.user.client.ui.HTMLPanel(template.html4().asString());
    com.google.gwt.user.client.ui.HTMLPanel f_HTMLPanel1 = new com.google.gwt.user.client.ui.HTMLPanel(template.html5("" + appResources.appCss().tabs() + "", domId0, domId1, domId2, "" + appResources.appCss().tabCaption() + "", "" + appResources.appCss().tabsContent() + "", domId3, "" + appResources.appCss().tabContent() + " " + appResources.appCss().tabContentCurrent() + "", domId4, "" + appResources.appCss().tabContent() + "", domId5, domId6, "" + appResources.appCss().tabContent() + "", domId7, domId8).asString());

    rawTab.setText("Raw");
    rawTab.setStyleName("" + appResources.appCss().tabHadler() + " " + appResources.appCss().tabHandlercurrent() + "");
    formTab.setText("Form");
    formTab.setStyleName("" + appResources.appCss().tabHadler() + "");
    filesTab.setText("Files");
    filesTab.setStyleName("" + appResources.appCss().tabHadler() + "");
    payloadRawInput.setStyleName("" + style.rawInput() + "");
    addValue.setHTML(template.html1().asString());
    addValue.setStyleName("" + appResources.appCss().addValueAnchor() + "");
    addValue.setHref("#");
    addFile.setHTML(template.html3().asString());
    addFile.setStyleName("" + appResources.appCss().addValueAnchor() + "");
    addFile.setHref("#");
    filesFormPanel.setStyleName("" + style.filesContainer() + "");
    f_HTMLPanel1.setStyleName("" + appResources.appCss().tabsPanel() + "");

    UiBinderUtil.TempAttachment attachRecord0 = UiBinderUtil.attachToDom(f_HTMLPanel1.getElement());
    com.google.gwt.user.client.Element domId0Element = com.google.gwt.dom.client.Document.get().getElementById(domId0).cast();
    com.google.gwt.user.client.Element domId1Element = com.google.gwt.dom.client.Document.get().getElementById(domId1).cast();
    com.google.gwt.user.client.Element domId2Element = com.google.gwt.dom.client.Document.get().getElementById(domId2).cast();
    tabContent = com.google.gwt.dom.client.Document.get().getElementById(domId3).cast();
    tabContent.removeAttribute("id");
    com.google.gwt.user.client.Element domId4Element = com.google.gwt.dom.client.Document.get().getElementById(domId4).cast();
    com.google.gwt.user.client.Element domId5Element = com.google.gwt.dom.client.Document.get().getElementById(domId5).cast();
    com.google.gwt.user.client.Element domId6Element = com.google.gwt.dom.client.Document.get().getElementById(domId6).cast();
    com.google.gwt.user.client.Element domId7Element = com.google.gwt.dom.client.Document.get().getElementById(domId7).cast();
    com.google.gwt.user.client.Element domId8Element = com.google.gwt.dom.client.Document.get().getElementById(domId8).cast();
    attachRecord0.detach();
    f_HTMLPanel1.addAndReplaceElement(rawTab, domId0Element);
    f_HTMLPanel1.addAndReplaceElement(formTab, domId1Element);
    f_HTMLPanel1.addAndReplaceElement(filesTab, domId2Element);
    f_HTMLPanel1.addAndReplaceElement(payloadRawInput, domId4Element);
    f_HTMLPanel1.addAndReplaceElement(addValue, domId5Element);
    f_HTMLPanel1.addAndReplaceElement(payloadFormPanel, domId6Element);
    f_HTMLPanel1.addAndReplaceElement(addFile, domId7Element);
    f_HTMLPanel1.addAndReplaceElement(filesFormPanel, domId8Element);


    final com.google.gwt.event.dom.client.ClickHandler handlerMethodWithNameVeryUnlikelyToCollideWithUserFieldNames1 = new com.google.gwt.event.dom.client.ClickHandler() {
      public void onClick(com.google.gwt.event.dom.client.ClickEvent event) {
        owner.onAddValue(event);
      }
    };
    addValue.addClickHandler(handlerMethodWithNameVeryUnlikelyToCollideWithUserFieldNames1);

    final com.google.gwt.event.dom.client.ClickHandler handlerMethodWithNameVeryUnlikelyToCollideWithUserFieldNames2 = new com.google.gwt.event.dom.client.ClickHandler() {
      public void onClick(com.google.gwt.event.dom.client.ClickEvent event) {
        owner.onAddFile(event);
      }
    };
    addFile.addClickHandler(handlerMethodWithNameVeryUnlikelyToCollideWithUserFieldNames2);

    owner.filesFormPanel = filesFormPanel;
    owner.filesTab = filesTab;
    owner.formTab = formTab;
    owner.payloadFormPanel = payloadFormPanel;
    owner.payloadRawInput = payloadRawInput;
    owner.rawTab = rawTab;
    owner.style = style;
    owner.tabContent = tabContent;
    clientBundleFieldNameUnlikelyToCollideWithUserSpecifiedFieldOkay.style().ensureInjected();

    return f_HTMLPanel1;
  }
}
