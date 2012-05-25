package com.allen_sauer.gwt.log.client;

import java.util.Date;
import com.google.gwt.core.client.GWT;
import com.allen_sauer.gwt.log.client.LogUtil;
import com.google.gwt.core.client.Duration;

public class LogMessageFormatterImpl implements com.allen_sauer.gwt.log.client.LogMessageFormatter {
  
  private double BIG_BANG = Duration.currentTimeMillis();
  
  public String format(String logLevelText, String category, String message, Throwable throwable) {
    if (category == null) {
      category = "<null category>";
    }
    if (message == null) {
      message = "<null message>";
    }
    StackTraceElement ste = GWT.isScript() ? null : LogUtil.getCallingStackTraceElement(throwable);
    return ""
     + "("
     + (ste == null ? "-" : ste.getFileName()) // "%F"
     + ":"
     + (ste == null ? "-" : ste.getLineNumber()) // "%L"
     + ") "
     + (LogUtil.formatDate(new Date(), "yyyy-MM-dd HH:mm:ss,SSS")) // "%d"
     + " ["
     + (LogUtil.padRight(logLevelText, 5)) // "%-5p"
     + "] "
     + (message) // "%m"
     + ""
     + ("\n") // "%n"
     + "";
  }
}
