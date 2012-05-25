package org.rest.client.ui.desktop;

import com.google.gwt.core.client.GWT;
import com.google.gwt.dom.client.Element;
import com.google.gwt.safehtml.client.SafeHtmlTemplates;
import com.google.gwt.safehtml.shared.SafeHtml;
import com.google.gwt.safehtml.shared.SafeHtmlUtils;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiBinderUtil;
import com.google.gwt.user.client.ui.Widget;

public class RequestViewImpl_RequestViewImplUiBinderImpl implements UiBinder<com.google.gwt.user.client.ui.Widget, org.rest.client.ui.desktop.RequestViewImpl>, org.rest.client.ui.desktop.RequestViewImpl.RequestViewImplUiBinder {

  interface Template extends SafeHtmlTemplates {
    @Template("<span id='{0}'></span> <span id='{1}'></span> <span id='{2}'></span> <span id='{3}'></span> <span id='{4}'></span> <span id='{5}'></span> <span id='{6}'></span> <span id='{7}'></span> <span id='{8}'></span>")
    SafeHtml html1(String arg0, String arg1, String arg2, String arg3, String arg4, String arg5, String arg6, String arg7, String arg8);
     
    @Template("Clear")
    SafeHtml html2();
     
    @Template("Send")
    SafeHtml html3();
     
    @Template("<span id='{0}'></span>  <span id='{1}'></span>  <span id='{2}'></span>  <span id='{3}'></span>  <div class='{4}' id='{5}'> <span id='{6}'></span> <span class='{7}'> Set \"Content-Type\" header to overwrite this value. </span> </div> <div class='{8}'> <div class='{9}'> <progress id='{10}'></progress> <span id='{11}'></span> <span id='{12}'></span> </div> </div>")
    SafeHtml html4(String arg0, String arg1, String arg2, String arg3, String arg4, String arg5, String arg6, String arg7, String arg8, String arg9, String arg10, String arg11, String arg12);
     
  }

  Template template = GWT.create(Template.class);

  public com.google.gwt.user.client.ui.Widget createAndBindUi(final org.rest.client.ui.desktop.RequestViewImpl owner) {

    org.rest.client.ui.desktop.RequestViewImpl_RequestViewImplUiBinderImpl_GenBundle clientBundleFieldNameUnlikelyToCollideWithUserSpecifiedFieldOkay = (org.rest.client.ui.desktop.RequestViewImpl_RequestViewImplUiBinderImpl_GenBundle) GWT.create(org.rest.client.ui.desktop.RequestViewImpl_RequestViewImplUiBinderImpl_GenBundle.class);
    org.rest.client.resources.AppResources appResources = (org.rest.client.resources.AppResources) GWT.create(org.rest.client.resources.AppResources.class);
    org.rest.client.ui.desktop.RequestViewImpl_RequestViewImplUiBinderImpl_GenCss_style style = clientBundleFieldNameUnlikelyToCollideWithUserSpecifiedFieldOkay.style();
    java.lang.String domId0 = com.google.gwt.dom.client.Document.get().createUniqueId();
    org.rest.client.ui.desktop.widget.RequestUrlWidget urlWidget = (org.rest.client.ui.desktop.widget.RequestUrlWidget) GWT.create(org.rest.client.ui.desktop.widget.RequestUrlWidget.class);
    java.lang.String domId1 = com.google.gwt.dom.client.Document.get().createUniqueId();
    java.lang.String domId2 = com.google.gwt.dom.client.Document.get().createUniqueId();
    com.google.gwt.user.client.ui.RadioButton radioGet = new com.google.gwt.user.client.ui.RadioButton("method");
    java.lang.String domId3 = com.google.gwt.dom.client.Document.get().createUniqueId();
    com.google.gwt.user.client.ui.RadioButton radioPost = new com.google.gwt.user.client.ui.RadioButton("method");
    java.lang.String domId4 = com.google.gwt.dom.client.Document.get().createUniqueId();
    com.google.gwt.user.client.ui.RadioButton radioPut = new com.google.gwt.user.client.ui.RadioButton("method");
    java.lang.String domId5 = com.google.gwt.dom.client.Document.get().createUniqueId();
    com.google.gwt.user.client.ui.RadioButton radioPatch = new com.google.gwt.user.client.ui.RadioButton("method");
    java.lang.String domId6 = com.google.gwt.dom.client.Document.get().createUniqueId();
    com.google.gwt.user.client.ui.RadioButton radioDelete = new com.google.gwt.user.client.ui.RadioButton("method");
    java.lang.String domId7 = com.google.gwt.dom.client.Document.get().createUniqueId();
    com.google.gwt.user.client.ui.RadioButton radioHead = new com.google.gwt.user.client.ui.RadioButton("method");
    java.lang.String domId8 = com.google.gwt.dom.client.Document.get().createUniqueId();
    com.google.gwt.user.client.ui.RadioButton radioOptions = new com.google.gwt.user.client.ui.RadioButton("method");
    java.lang.String domId9 = com.google.gwt.dom.client.Document.get().createUniqueId();
    com.google.gwt.user.client.ui.RadioButton radioOther = new com.google.gwt.user.client.ui.RadioButton("method");
    java.lang.String domId10 = com.google.gwt.dom.client.Document.get().createUniqueId();
    com.google.gwt.user.client.ui.TextBox otherMethodValue = (com.google.gwt.user.client.ui.TextBox) GWT.create(com.google.gwt.user.client.ui.TextBox.class);
    com.google.gwt.user.client.ui.HTMLPanel f_HTMLPanel1 = new com.google.gwt.user.client.ui.HTMLPanel(template.html1(domId2, domId3, domId4, domId5, domId6, domId7, domId8, domId9, domId10).asString());
    java.lang.String domId11 = com.google.gwt.dom.client.Document.get().createUniqueId();
    org.rest.client.ui.desktop.widget.RequestHeadersWidget requestHeaders = (org.rest.client.ui.desktop.widget.RequestHeadersWidget) GWT.create(org.rest.client.ui.desktop.widget.RequestHeadersWidget.class);
    java.lang.String domId12 = com.google.gwt.dom.client.Document.get().createUniqueId();
    org.rest.client.ui.desktop.widget.RequestBodyWidget requestBody = (org.rest.client.ui.desktop.widget.RequestBodyWidget) GWT.create(org.rest.client.ui.desktop.widget.RequestBodyWidget.class);
    com.google.gwt.dom.client.DivElement contentTypeContainer = null;
    java.lang.String domId13 = com.google.gwt.dom.client.Document.get().createUniqueId();
    java.lang.String domId14 = com.google.gwt.dom.client.Document.get().createUniqueId();
    com.google.gwt.user.client.ui.ListBox contentTypeInput = (com.google.gwt.user.client.ui.ListBox) GWT.create(com.google.gwt.user.client.ui.ListBox.class);
    com.google.gwt.dom.client.Element progressIndicator = null;
    java.lang.String domId15 = com.google.gwt.dom.client.Document.get().createUniqueId();
    java.lang.String domId16 = com.google.gwt.dom.client.Document.get().createUniqueId();
    com.google.gwt.user.client.ui.Button clearButton = (com.google.gwt.user.client.ui.Button) GWT.create(com.google.gwt.user.client.ui.Button.class);
    java.lang.String domId17 = com.google.gwt.dom.client.Document.get().createUniqueId();
    com.google.gwt.user.client.ui.Button sendButton = (com.google.gwt.user.client.ui.Button) GWT.create(com.google.gwt.user.client.ui.Button.class);
    com.google.gwt.user.client.ui.HTMLPanel root = new com.google.gwt.user.client.ui.HTMLPanel(template.html4(domId0, domId1, domId11, domId12, "" + style.contentTypeSection() + "", domId13, domId14, "" + appResources.appCss().inlineNote() + "", "" + style.actionBar() + "", "" + style.actions() + "", domId15, domId16, domId17).asString());

    radioGet.setStyleName("" + style.radioButton() + "");
    radioGet.setText("GET");
    radioGet.setChecked(true);
    radioPost.setStyleName("" + style.radioButton() + "");
    radioPost.setText("POST");
    radioPut.setStyleName("" + style.radioButton() + "");
    radioPut.setText("PUT");
    radioPatch.setStyleName("" + style.radioButton() + "");
    radioPatch.setText("PATCH");
    radioDelete.setStyleName("" + style.radioButton() + "");
    radioDelete.setText("DELETE");
    radioHead.setStyleName("" + style.radioButton() + "");
    radioHead.setText("HEAD");
    radioOptions.setStyleName("" + style.radioButton() + "");
    radioOptions.setText("OPTIONS");
    radioOther.setStyleName("" + style.radioButton() + "");
    radioOther.setText("Other");
    otherMethodValue.addStyleName("" + style.otherInput() + "");
    otherMethodValue.setEnabled(false);
    f_HTMLPanel1.setStyleName("" + style.methodsWidget() + "");
    contentTypeInput.setStyleName("" + appResources.appCss().selectControl() + "");
    contentTypeInput.setTitle("Select form encoding");
    clearButton.setHTML(template.html2().asString());
    clearButton.setTitle("Clear current form settings");
    sendButton.setHTML(template.html3().asString());
    sendButton.setTitle("Send current data");
    root.setStyleName("" + style.requestPanel() + "");

    UiBinderUtil.TempAttachment attachRecord0 = UiBinderUtil.attachToDom(root.getElement());
    com.google.gwt.user.client.Element domId0Element = com.google.gwt.dom.client.Document.get().getElementById(domId0).cast();
    UiBinderUtil.TempAttachment attachRecord1 = UiBinderUtil.attachToDom(f_HTMLPanel1.getElement());
    com.google.gwt.user.client.Element domId2Element = com.google.gwt.dom.client.Document.get().getElementById(domId2).cast();
    com.google.gwt.user.client.Element domId3Element = com.google.gwt.dom.client.Document.get().getElementById(domId3).cast();
    com.google.gwt.user.client.Element domId4Element = com.google.gwt.dom.client.Document.get().getElementById(domId4).cast();
    com.google.gwt.user.client.Element domId5Element = com.google.gwt.dom.client.Document.get().getElementById(domId5).cast();
    com.google.gwt.user.client.Element domId6Element = com.google.gwt.dom.client.Document.get().getElementById(domId6).cast();
    com.google.gwt.user.client.Element domId7Element = com.google.gwt.dom.client.Document.get().getElementById(domId7).cast();
    com.google.gwt.user.client.Element domId8Element = com.google.gwt.dom.client.Document.get().getElementById(domId8).cast();
    com.google.gwt.user.client.Element domId9Element = com.google.gwt.dom.client.Document.get().getElementById(domId9).cast();
    com.google.gwt.user.client.Element domId10Element = com.google.gwt.dom.client.Document.get().getElementById(domId10).cast();
    attachRecord1.detach();
    f_HTMLPanel1.addAndReplaceElement(radioGet, domId2Element);
    f_HTMLPanel1.addAndReplaceElement(radioPost, domId3Element);
    f_HTMLPanel1.addAndReplaceElement(radioPut, domId4Element);
    f_HTMLPanel1.addAndReplaceElement(radioPatch, domId5Element);
    f_HTMLPanel1.addAndReplaceElement(radioDelete, domId6Element);
    f_HTMLPanel1.addAndReplaceElement(radioHead, domId7Element);
    f_HTMLPanel1.addAndReplaceElement(radioOptions, domId8Element);
    f_HTMLPanel1.addAndReplaceElement(radioOther, domId9Element);
    f_HTMLPanel1.addAndReplaceElement(otherMethodValue, domId10Element);
    com.google.gwt.user.client.Element domId1Element = com.google.gwt.dom.client.Document.get().getElementById(domId1).cast();
    com.google.gwt.user.client.Element domId11Element = com.google.gwt.dom.client.Document.get().getElementById(domId11).cast();
    com.google.gwt.user.client.Element domId12Element = com.google.gwt.dom.client.Document.get().getElementById(domId12).cast();
    contentTypeContainer = com.google.gwt.dom.client.Document.get().getElementById(domId13).cast();
    contentTypeContainer.removeAttribute("id");
    com.google.gwt.user.client.Element domId14Element = com.google.gwt.dom.client.Document.get().getElementById(domId14).cast();
    progressIndicator = com.google.gwt.dom.client.Document.get().getElementById(domId15).cast();
    progressIndicator.removeAttribute("id");
    com.google.gwt.user.client.Element domId16Element = com.google.gwt.dom.client.Document.get().getElementById(domId16).cast();
    com.google.gwt.user.client.Element domId17Element = com.google.gwt.dom.client.Document.get().getElementById(domId17).cast();
    attachRecord0.detach();
    root.addAndReplaceElement(urlWidget, domId0Element);
    root.addAndReplaceElement(f_HTMLPanel1, domId1Element);
    root.addAndReplaceElement(requestHeaders, domId11Element);
    root.addAndReplaceElement(requestBody, domId12Element);
    root.addAndReplaceElement(contentTypeInput, domId14Element);
    root.addAndReplaceElement(clearButton, domId16Element);
    root.addAndReplaceElement(sendButton, domId17Element);


    final com.google.gwt.event.dom.client.ClickHandler handlerMethodWithNameVeryUnlikelyToCollideWithUserFieldNames1 = new com.google.gwt.event.dom.client.ClickHandler() {
      public void onClick(com.google.gwt.event.dom.client.ClickEvent event) {
        owner.onClearButton(event);
      }
    };
    clearButton.addClickHandler(handlerMethodWithNameVeryUnlikelyToCollideWithUserFieldNames1);

    owner.contentTypeContainer = contentTypeContainer;
    owner.contentTypeInput = contentTypeInput;
    owner.otherMethodValue = otherMethodValue;
    owner.radioDelete = radioDelete;
    owner.radioGet = radioGet;
    owner.radioHead = radioHead;
    owner.radioOptions = radioOptions;
    owner.radioOther = radioOther;
    owner.radioPatch = radioPatch;
    owner.radioPost = radioPost;
    owner.radioPut = radioPut;
    owner.requestBody = requestBody;
    owner.requestHeaders = requestHeaders;
    owner.root = root;
    owner.urlWidget = urlWidget;
    clientBundleFieldNameUnlikelyToCollideWithUserSpecifiedFieldOkay.style().ensureInjected();

    return root;
  }
}
