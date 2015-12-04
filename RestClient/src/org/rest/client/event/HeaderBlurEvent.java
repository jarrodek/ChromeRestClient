package org.rest.client.event;

import com.google.gwt.event.shared.EventHandler;
import com.google.gwt.event.shared.GwtEvent;

public class HeaderBlurEvent extends GwtEvent<HeaderBlurEvent.Handler> {
	public static interface Handler extends EventHandler {
	    void onHeaderBlur(HeaderBlurEvent event);
	}
	
	public static Type<Handler> TYPE = new Type<Handler>();
	
	@Override
    public Type<Handler> getAssociatedType() {
        return TYPE;
    }

    @Override
    protected void dispatch(Handler handler) {
        handler.onHeaderBlur(this);
    }

}
