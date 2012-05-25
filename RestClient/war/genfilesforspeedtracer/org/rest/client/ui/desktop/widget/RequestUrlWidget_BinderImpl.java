package org.rest.client.ui.desktop.widget;

import com.google.gwt.core.client.GWT;
import com.google.gwt.dom.client.Element;
import com.google.gwt.safehtml.client.SafeHtmlTemplates;
import com.google.gwt.safehtml.shared.SafeHtml;
import com.google.gwt.safehtml.shared.SafeHtmlUtils;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiBinderUtil;
import com.google.gwt.user.client.ui.Widget;

public class RequestUrlWidget_BinderImpl implements UiBinder<com.google.gwt.user.client.ui.Widget, org.rest.client.ui.desktop.widget.RequestUrlWidget>, org.rest.client.ui.desktop.widget.RequestUrlWidget.Binder {

  interface Template extends SafeHtmlTemplates {
    @Template("Add")
    SafeHtml html1();
     
    @Template("")
    SafeHtml html2();
     
    @Template("<span id='{0}'></span>  <span id='{1}'></span>  <div class='{2}' id='{3}'> <span id='{4}'></span>  <span id='{5}'></span>  <section class='{6}'> <p class='{7}'> Query parameters <span id='{8}'></span> </p>  <span id='{9}'></span> </section>  <section class='{10}'> <span id='{11}'></span> </section> </div>")
    SafeHtml html3(String arg0, String arg1, String arg2, String arg3, String arg4, String arg5, String arg6, String arg7, String arg8, String arg9, String arg10, String arg11);
     
  }

  Template template = GWT.create(Template.class);

  public com.google.gwt.user.client.ui.Widget createAndBindUi(final org.rest.client.ui.desktop.widget.RequestUrlWidget owner) {

    org.rest.client.ui.desktop.widget.RequestUrlWidget_BinderImpl_GenBundle clientBundleFieldNameUnlikelyToCollideWithUserSpecifiedFieldOkay = (org.rest.client.ui.desktop.widget.RequestUrlWidget_BinderImpl_GenBundle) GWT.create(org.rest.client.ui.desktop.widget.RequestUrlWidget_BinderImpl_GenBundle.class);
    org.rest.client.resources.AppResources appResources = (org.rest.client.resources.AppResources) GWT.create(org.rest.client.resources.AppResources.class);
    org.rest.client.ui.desktop.widget.RequestUrlWidget_BinderImpl_GenCss_style style = clientBundleFieldNameUnlikelyToCollideWithUserSpecifiedFieldOkay.style();
    java.lang.String domId0 = com.google.gwt.dom.client.Document.get().createUniqueId();
    com.google.gwt.user.client.ui.InlineLabel toggleView = (com.google.gwt.user.client.ui.InlineLabel) GWT.create(com.google.gwt.user.client.ui.InlineLabel.class);
    java.lang.String domId1 = com.google.gwt.dom.client.Document.get().createUniqueId();
    com.google.gwt.user.client.ui.SuggestBox urlField = owner.urlField;
    com.google.gwt.dom.client.DivElement detailedPanel = null;
    java.lang.String domId2 = com.google.gwt.dom.client.Document.get().createUniqueId();
    java.lang.String domId3 = com.google.gwt.dom.client.Document.get().createUniqueId();
    com.google.gwt.user.client.ui.TextBox detailedHostField = (com.google.gwt.user.client.ui.TextBox) GWT.create(com.google.gwt.user.client.ui.TextBox.class);
    java.lang.String domId4 = com.google.gwt.dom.client.Document.get().createUniqueId();
    com.google.gwt.user.client.ui.TextBox detailedPathField = (com.google.gwt.user.client.ui.TextBox) GWT.create(com.google.gwt.user.client.ui.TextBox.class);
    java.lang.String domId5 = com.google.gwt.dom.client.Document.get().createUniqueId();
    com.google.gwt.user.client.ui.Anchor addParam = (com.google.gwt.user.client.ui.Anchor) GWT.create(com.google.gwt.user.client.ui.Anchor.class);
    java.lang.String domId6 = com.google.gwt.dom.client.Document.get().createUniqueId();
    com.google.gwt.user.client.ui.HTMLPanel paramsContainer = new com.google.gwt.user.client.ui.HTMLPanel(template.html2().asString());
    java.lang.String domId7 = com.google.gwt.dom.client.Document.get().createUniqueId();
    com.google.gwt.user.client.ui.TextBox detailedHashField = (com.google.gwt.user.client.ui.TextBox) GWT.create(com.google.gwt.user.client.ui.TextBox.class);
    com.google.gwt.user.client.ui.HTMLPanel f_HTMLPanel1 = new com.google.gwt.user.client.ui.HTMLPanel(template.html3(domId0, domId1, "hidden " + style.detailedPanel() + " " + style.opened() + "", domId2, domId3, domId4, "" + style.paramsSection() + "", "" + style.sectionTitle() + "", domId5, domId6, "" + style.hashSection() + "", domId7).asString());

    toggleView.setStyleName("" + appResources.appCss().handlerImageClosed() + " " + appResources.appCss().handlerImageContainer() + " " + style.urlToggleHandlerImage() + "");
    urlField.setStyleName("" + style.fullWidthRelativeInput() + " " + style.urlInput() + "");
    detailedHostField.setStyleName("" + style.fullWidthRelativeInput() + " " + style.urlInput() + "");
    detailedHostField.setTitle("HOST value");
    detailedPathField.setStyleName("" + style.fullWidthRelativeInput() + " " + style.pathInput() + "");
    detailedPathField.setTitle("PATH value");
    addParam.setHTML(template.html1().asString());
    addParam.setStyleName("" + style.addParamAnchor() + "");
    addParam.setHref("#");
    detailedHashField.setStyleName("" + style.fullWidthRelativeInput() + "");
    detailedHashField.setTitle("PATH value");
    f_HTMLPanel1.setStyleName("" + style.urlPanel() + "");

    UiBinderUtil.TempAttachment attachRecord0 = UiBinderUtil.attachToDom(f_HTMLPanel1.getElement());
    com.google.gwt.user.client.Element domId0Element = com.google.gwt.dom.client.Document.get().getElementById(domId0).cast();
    com.google.gwt.user.client.Element domId1Element = com.google.gwt.dom.client.Document.get().getElementById(domId1).cast();
    detailedPanel = com.google.gwt.dom.client.Document.get().getElementById(domId2).cast();
    detailedPanel.removeAttribute("id");
    com.google.gwt.user.client.Element domId3Element = com.google.gwt.dom.client.Document.get().getElementById(domId3).cast();
    com.google.gwt.user.client.Element domId4Element = com.google.gwt.dom.client.Document.get().getElementById(domId4).cast();
    com.google.gwt.user.client.Element domId5Element = com.google.gwt.dom.client.Document.get().getElementById(domId5).cast();
    com.google.gwt.user.client.Element domId6Element = com.google.gwt.dom.client.Document.get().getElementById(domId6).cast();
    com.google.gwt.user.client.Element domId7Element = com.google.gwt.dom.client.Document.get().getElementById(domId7).cast();
    attachRecord0.detach();
    f_HTMLPanel1.addAndReplaceElement(toggleView, domId0Element);
    f_HTMLPanel1.addAndReplaceElement(urlField, domId1Element);
    f_HTMLPanel1.addAndReplaceElement(detailedHostField, domId3Element);
    f_HTMLPanel1.addAndReplaceElement(detailedPathField, domId4Element);
    f_HTMLPanel1.addAndReplaceElement(addParam, domId5Element);
    f_HTMLPanel1.addAndReplaceElement(paramsContainer, domId6Element);
    f_HTMLPanel1.addAndReplaceElement(detailedHashField, domId7Element);


    final com.google.gwt.event.dom.client.ClickHandler handlerMethodWithNameVeryUnlikelyToCollideWithUserFieldNames1 = new com.google.gwt.event.dom.client.ClickHandler() {
      public void onClick(com.google.gwt.event.dom.client.ClickEvent event) {
        owner.onAddParam(event);
      }
    };
    addParam.addClickHandler(handlerMethodWithNameVeryUnlikelyToCollideWithUserFieldNames1);

    final com.google.gwt.event.dom.client.ClickHandler handlerMethodWithNameVeryUnlikelyToCollideWithUserFieldNames2 = new com.google.gwt.event.dom.client.ClickHandler() {
      public void onClick(com.google.gwt.event.dom.client.ClickEvent event) {
        owner.onToggleView(event);
      }
    };
    toggleView.addClickHandler(handlerMethodWithNameVeryUnlikelyToCollideWithUserFieldNames2);

    owner.detailedHashField = detailedHashField;
    owner.detailedHostField = detailedHostField;
    owner.detailedPanel = detailedPanel;
    owner.detailedPathField = detailedPathField;
    owner.paramsContainer = paramsContainer;
    owner.style = style;
    owner.toggleView = toggleView;
    clientBundleFieldNameUnlikelyToCollideWithUserSpecifiedFieldOkay.style().ensureInjected();

    return f_HTMLPanel1;
  }
}
