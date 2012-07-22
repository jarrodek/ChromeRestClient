/*******************************************************************************
 * Copyright 2012 Paweł Psztyć
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *   http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/
package org.rest.client.event;

import com.google.web.bindery.event.shared.Event;
import com.google.web.bindery.event.shared.EventBus;
import com.google.web.bindery.event.shared.HandlerRegistration;

/**
 * This event is fired when request state has changed. 
 * <p>For example it will be called when request finish uploading data or when uploading is in progress.</p>
 * 
 * </p>
 */
public class RequestChangeEvent extends Event<RequestChangeEvent.Handler> {
	public static final Type<Handler> TYPE = new Type<Handler>();
	
	public static final int UPLOAD_START = 0;
	public static final int UPLOAD_PROGRESS = 1;
	public static final int UPLOAD_END = 2;
	public static final int DOWNLOAD_PROGRESS = 3;

	/**
	 * Register an handler for this event.
	 * 
	 * @param eventBus
	 * @param handler
	 * @return
	 */
	public static HandlerRegistration register(EventBus eventBus,
			Handler handler) {
		return eventBus.addHandler(TYPE, handler);
	}

	/**
	 * Handles {@link RequestChangeEvent}.
	 */
	public interface Handler{
		/**
		 * Called when request has stopped either with error or success.
		 * @param time Time when event occurred.
		 */
		void onChange(RequestChangeEvent event);
	}
	
	private final int type;
	private final double total;
	private final double loaded;
	
	/**
	 * Create request change event.
	 * @param type Change type. On of {@link #UPLOAD_END}, {@link #UPLOAD_PROGRESS}, {@link #UPLOAD_START} or {@link #DOWNLOAD_PROGRESS}
	 */
	public RequestChangeEvent(int type){
		this.type = type;
		this.total = -1;
		this.loaded = -1;
	}
	/**
	 * Create request change event.
	 * @param type Change type. One of {@link #UPLOAD_END}, {@link #UPLOAD_PROGRESS}, {@link #UPLOAD_START} or {@link #DOWNLOAD_PROGRESS}
	 * @param total For {@link #UPLOAD_PROGRESS} type total amount of payload data to send
	 * @param loaded For {@link #UPLOAD_PROGRESS} type current loaded payload data.
	 */
	public RequestChangeEvent(int type, double total, double loaded){
		this.type = type;
		this.total = total;
		this.loaded = loaded;
	}
	/**
	 * @return Change type. One of {@link #UPLOAD_END}, {@link #UPLOAD_PROGRESS}, {@link #UPLOAD_START} or {@link #DOWNLOAD_PROGRESS}
	 */
	public int getChangeType(){
		return this.type;
	}
	/**
	 * Only available when {@link #getChangeType()} is equal {@link #UPLOAD_PROGRESS}
	 * @return Total amount of payload data to send or -1 if type is not {@link #UPLOAD_PROGRESS}
	 */
	public double getTotal() {
		return total;
	}
	/**
	 * Only available when {@link #getChangeType()} is equal {@link #UPLOAD_PROGRESS}
	 * @return Current loaded payload data or -1 if type is not {@link #UPLOAD_PROGRESS}
	 */
	public double getLoaded() {
		return loaded;
	}

	@Override
	protected void dispatch(Handler handler) {
		handler.onChange(this);
	}

	@Override
	public Event.Type<Handler> getAssociatedType() {
		return TYPE;
	}
}
