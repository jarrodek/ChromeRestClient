package org.rest.client.ui.desktop.widget;

import com.google.gwt.user.client.ui.DialogBox;
import com.google.gwt.user.client.ui.HTML;
import com.google.gwt.user.client.ui.SimplePanel;
/**
 * Status code info dialog.
 * @author jarrod
 *
 */
public class StatusCodeInfo extends DialogBox {
  /**
   * Info label.
   */
  private HTML infoTxt;
  /**
   * Constructor.
   */
  public StatusCodeInfo() {
    setGlassEnabled(true);
    setAutoHideEnabled(true);
    setAnimationEnabled(true);
    setHTML("Status Code");
    SimplePanel simplePanel = new SimplePanel();
    setWidget(simplePanel);
    simplePanel.setWidth("400px");
    infoTxt = new HTML("New label");
    simplePanel.setWidget(infoTxt);
    infoTxt.setSize("100%", "100%");
  }
  /**
   * Status code expl.
   * @param data Info to show
   */
  public final void setInfoText(final String data) {
    this.infoTxt.setHTML(data);
  }
}
