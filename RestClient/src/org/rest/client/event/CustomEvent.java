/**
 * 
 */
package org.rest.client.event;

/**
 * @author jarrod
 * 
 */
public enum CustomEvent {

	//
	// Application events
	//

	/**
	 * Application is loaded and ready to use event.
	 */
	APPLICATION_READY("arc:ready"),
	/**
	 * User has added new encoding value to application.<br/>
	 * This event has additional attribute "data" with new encoding value.
	 * <p>
	 * <b>Note:</b> "data" attribute can have NULL value if user cancels dialog.
	 * <br/>
	 * <b>Note 2:</b> there is no sure that this value has been saved to
	 * storage. Same event is for handler that handle data save and to fire
	 * external event.
	 * </p>
	 * <p>
	 * For example (javascript):
	 * 
	 * <pre>
	 * var fn = function(e){
	 * 	var addedEncoding = e.data;
	 * 	//you can do something with new encoding value
	 * }
	 * document.addEventListener('arc:addencoding', fn);
	 * </pre>
	 * 
	 * </p>
	 */
	ADD_ENCODING("arc:addencoding"),
	/**
	 * Event fired each time when URL field value has changed.<br/>
	 * URL value change even when any part of URL's detailed view has change.<br/>
	 * This event has additional attribute "data" with new URL value.
	 * <p>
	 * For example:
	 * 
	 * <pre>
	 * document.addEventListener('arc:urlchange', function(e){ var newUrl = e.data; //do something... });
	 * </pre>
	 * 
	 * </p>
	 * <p>
	 * <b>Note</b> This event will have "data" attribute with new URL value. It
	 * can be either empty string or NULL ("undefined" in javascript).
	 * </p>
	 */
	URL_CHANGE("arc:urlchange"),
	/**
	 * This event is fired when user want to perform an Start Request action.
	 * This event has additional attribute "data" with (java double) start time.
	 * <p>
	 * For example:
	 * <pre>
	 * document.addEventListener('arc:httpstart', function(e){ var startTime = parseInt(e.data); //do something... });
	 * </pre>
	 * </p>
	 */
	REQUEST_START_ACTION("arc:start"),
	/**
	 * This event is fired when request has stopped either by error or success.
	 * This event has additional attribute "data" with (java double) end time.
	 * <p>
	 * For example:
	 * <pre>
	 * document.addEventListener('arc:httpstop', function(e){ var endTime = parseInt(e.data); //do something... });
	 * </pre>
	 * </p>
	 */
	REQUEST_STOP("arc:httpstop"),
	//
	// UI controls
	//

	/**
	 * User clears input form event.
	 */
	CLEAR_ALL("arc:clear"),
	/**
	 * User toggle URL view from detailed to normal and vice versa.<br/>
	 * This event has additional attribute "data" with possible values:
	 * <ul>
	 * <li>String "simple" - for simple (normal) view</li>
	 * <li>String "detailed" - for detailed view</li>
	 * </ul>
	 * <p>
	 * For example (javascript):
	 * 
	 * <pre>
	 * var fn = function(e){
	 * 	var currentView = e.data;
	 * 	if(currentView == 'simple'){
	 * 	   // Now user see only one, simple URL field
	 * 	} else {
	 * 	   //...
	 * 	}
	 * }
	 * document.addEventListener('arc:urltoggle', fn);
	 * </pre>
	 * 
	 * </p>
	 */
	URL_FIELD_TOGGLE("arc:urltoggle"),
	/**
	 * User change HTTP method to new value.<br/>
	 * This event has additional attribute "data" with value as current HTTP
	 * method.
	 * <p>
	 * For example (javascript):
	 * 
	 * <pre>
	 * var fn = function(e){
	 * 	var currentHttpMethod = e.data;
	 * 	// do something with this information....
	 * }
	 * document.addEventListener('arc:urltoggle', fn);
	 * </pre>
	 * 
	 * Note: data attribute may be undefined if user selects "Other" and input
	 * field is empty.
	 * </p>
	 */
	HTTP_METHOD_CHANGE("arc:metodchange"),
	/**
	 * User clears history store.<br/>
	 */
	CLEAR_HISTORY("arc:historyclear");
	
	

	private final String evenNamet;

	CustomEvent(String event) {
		this.evenNamet = event;
	}

	public String getValue() {
		return evenNamet;
	}

	@Override
	public String toString() {
		return evenNamet;
	}
}
