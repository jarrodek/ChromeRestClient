package org.rest.client.ui.desktop;

import com.google.gwt.core.client.GWT;
import com.google.gwt.dom.client.Element;
import com.google.gwt.safehtml.client.SafeHtmlTemplates;
import com.google.gwt.safehtml.shared.SafeHtml;
import com.google.gwt.safehtml.shared.SafeHtmlUtils;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiBinderUtil;
import com.google.gwt.user.client.ui.DialogBox;

public class AddEncodingViewImpl_BinderImpl implements UiBinder<com.google.gwt.user.client.ui.DialogBox, org.rest.client.ui.desktop.AddEncodingViewImpl>, org.rest.client.ui.desktop.AddEncodingViewImpl.Binder {

  interface Template extends SafeHtmlTemplates {
    @Template("Save")
    SafeHtml html1();
     
    @Template("Cancel")
    SafeHtml html2();
     
    @Template("<div class='dialogTitle'> <span>Add new form encoding</span> </div> <div> <span id='{0}'></span> </div> <div class='{1}' id='{2}'></div> <div class='{3}'> <span id='{4}'></span> <span id='{5}'></span> </div>")
    SafeHtml html3(String arg0, String arg1, String arg2, String arg3, String arg4, String arg5);
     
  }

  Template template = GWT.create(Template.class);

  public com.google.gwt.user.client.ui.DialogBox createAndBindUi(final org.rest.client.ui.desktop.AddEncodingViewImpl owner) {

    org.rest.client.ui.desktop.AddEncodingViewImpl_BinderImpl_GenBundle clientBundleFieldNameUnlikelyToCollideWithUserSpecifiedFieldOkay = (org.rest.client.ui.desktop.AddEncodingViewImpl_BinderImpl_GenBundle) GWT.create(org.rest.client.ui.desktop.AddEncodingViewImpl_BinderImpl_GenBundle.class);
    org.rest.client.resources.AppResources appResources = (org.rest.client.resources.AppResources) GWT.create(org.rest.client.resources.AppResources.class);
    org.rest.client.ui.desktop.AddEncodingViewImpl_BinderImpl_GenCss_style style = clientBundleFieldNameUnlikelyToCollideWithUserSpecifiedFieldOkay.style();
    java.lang.String domId0 = com.google.gwt.dom.client.Document.get().createUniqueId();
    com.google.gwt.user.client.ui.TextBox encoding = (com.google.gwt.user.client.ui.TextBox) GWT.create(com.google.gwt.user.client.ui.TextBox.class);
    com.google.gwt.dom.client.DivElement errorField = null;
    java.lang.String domId1 = com.google.gwt.dom.client.Document.get().createUniqueId();
    java.lang.String domId2 = com.google.gwt.dom.client.Document.get().createUniqueId();
    com.google.gwt.user.client.ui.Button save = (com.google.gwt.user.client.ui.Button) GWT.create(com.google.gwt.user.client.ui.Button.class);
    java.lang.String domId3 = com.google.gwt.dom.client.Document.get().createUniqueId();
    com.google.gwt.user.client.ui.Button cancel = (com.google.gwt.user.client.ui.Button) GWT.create(com.google.gwt.user.client.ui.Button.class);
    com.google.gwt.user.client.ui.HTMLPanel contents = new com.google.gwt.user.client.ui.HTMLPanel(template.html3(domId0, "" + appResources.appCss().hidden() + " " + style.errorField() + "", domId1, "" + style.dialogButtons() + "", domId2, domId3).asString());
    com.google.gwt.user.client.ui.DialogBox dialog = new com.google.gwt.user.client.ui.DialogBox(false, true);

    encoding.setWidth("400px");
    save.setHTML(template.html1().asString());
    save.setStyleName("" + appResources.appCss().button() + "");
    cancel.setHTML(template.html2().asString());
    cancel.setStyleName("" + appResources.appCss().button() + "");
    contents.setStyleName("container");
    dialog.setWidget(contents);
    dialog.setGlassEnabled(true);
    dialog.setAnimationEnabled(true);

    UiBinderUtil.TempAttachment attachRecord0 = UiBinderUtil.attachToDom(contents.getElement());
    com.google.gwt.user.client.Element domId0Element = com.google.gwt.dom.client.Document.get().getElementById(domId0).cast();
    errorField = com.google.gwt.dom.client.Document.get().getElementById(domId1).cast();
    errorField.removeAttribute("id");
    com.google.gwt.user.client.Element domId2Element = com.google.gwt.dom.client.Document.get().getElementById(domId2).cast();
    com.google.gwt.user.client.Element domId3Element = com.google.gwt.dom.client.Document.get().getElementById(domId3).cast();
    attachRecord0.detach();
    contents.addAndReplaceElement(encoding, domId0Element);
    contents.addAndReplaceElement(save, domId2Element);
    contents.addAndReplaceElement(cancel, domId3Element);


    final com.google.gwt.event.dom.client.ClickHandler handlerMethodWithNameVeryUnlikelyToCollideWithUserFieldNames1 = new com.google.gwt.event.dom.client.ClickHandler() {
      public void onClick(com.google.gwt.event.dom.client.ClickEvent event) {
        owner.onDismiss(event);
      }
    };
    cancel.addClickHandler(handlerMethodWithNameVeryUnlikelyToCollideWithUserFieldNames1);

    final com.google.gwt.event.dom.client.ClickHandler handlerMethodWithNameVeryUnlikelyToCollideWithUserFieldNames2 = new com.google.gwt.event.dom.client.ClickHandler() {
      public void onClick(com.google.gwt.event.dom.client.ClickEvent event) {
        owner.onSave(event);
      }
    };
    save.addClickHandler(handlerMethodWithNameVeryUnlikelyToCollideWithUserFieldNames2);

    owner.dialog = dialog;
    owner.encoding = encoding;
    owner.errorField = errorField;
    clientBundleFieldNameUnlikelyToCollideWithUserSpecifiedFieldOkay.style().ensureInjected();

    return dialog;
  }
}
