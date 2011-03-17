package com.kalicinscy.web.restclient.client.api;

import com.google.gwt.event.logical.shared.ValueChangeEvent;
import com.google.gwt.event.logical.shared.ValueChangeHandler;
import com.google.gwt.user.client.ui.TextBox;

public class HTML5InputNumber extends TextBox {

	public HTML5InputNumber() {
		super();
		getElement().setAttribute("type", "number");
	}
	public HTML5InputNumber(float min, float max) {
		super();
		getElement().setAttribute("type", "number");
		setMin(min);
		setMax(max);
	}
	public HTML5InputNumber(float min, float max, float step) {
		super();
		getElement().setAttribute("type", "number");
		setMin(min);
		setMax(max);
		setStep(step);
	}
	
	/**
	 * Force widget to check on change if value is
	 * less than getMax() and grater than getMin().
	 * Otherwise set min or max value.
	 */
	public void setValueBoundCheckerActive(){
		ValueChangeHandler<String> numberFieldValueChange = new ValueChangeHandler<String>() {
			@Override
			public void onValueChange(ValueChangeEvent<String> event) {
				String value = event.getValue();
				int v = 0;
				try{
					v = Integer.parseInt(value);
				} catch( NumberFormatException e ){}
				HTML5InputNumber el = (HTML5InputNumber) event.getSource();
				if( v > el.getMax() ){
					el.setValue( el.getMax()+"" );
				} else if( v < el.getMin() ){
					el.setValue( el.getMin()+"" );
				}
			}
		};
		addValueChangeHandler(numberFieldValueChange);
	}
	
	
	/**
	 * Specifies whether the element represents an input control for which a UA
	 * is meant to store the value entered by the user (so that the UA can
	 * prefill the form later).
	 * 
	 * @param state
	 */
	public void setAutocomplete(boolean state) {
		String value = state ? "on":"off";
		getElement().setAttribute("autocomplete", value);
	}
	/**
	 * Specifies that the element represents a control to which a UA is meant to give focus as soon as the document is loaded.
	 * @param state
	 */
	public void setAutofocus(boolean state){
		if( state ){
			getElement().setAttribute("autofocus", "autofocus");
		} else {
			getElement().removeAttribute("autofocus");
		}
	}
	/**
	 * The expected lower bound for the element’s value
	 * @param min Minimal value
	 */
	public void setMin(float min){
		getElement().setAttribute("min", ""+min);
	}
	/**
	 * Field minimal possible value.
	 * @return The expected lower bound for the element’s value
	 */
	public float getMin(){
		String min = getElement().getAttribute("min");
		if( min.equals("") ){
			return -99999999;
		}
		return Float.parseFloat(min);
	}
	/**
	 * The expected upper bound for the element’s value
	 * @param max maximal value
	 */
	public void setMax(float max){
		getElement().setAttribute("max", ""+max);
	}
	/**
	 * Field maximal possible value.
	 * @return The expected upper bound for the element’s value
	 */
	public float getMax(){
		String max = getElement().getAttribute("max");
		if( max.equals("") ){
			return 999999999;
		}
		return Float.parseFloat(max);
	}
	/**
	 * Specifies the value granularity of the element’s value.
	 * @param step
	 */
	public void setStep(float step){
		getElement().setAttribute("step", ""+step);
	}
	/**
	 * 
	 * @return the value granularity of the element’s value
	 */
	public float getStep(){
		String step = getElement().getAttribute("step");
		if( step.equals("") ){
			return 1;
		}
		return Float.parseFloat(step);
	}
	/**
	 * Specifies that the element is a required part of form submission.
	 * @param required
	 */
	public void setRequired(boolean required){
		if( required ){
			getElement().setAttribute("required", "required");
		} else {
			getElement().removeAttribute("required");
		}
	}
	
	public boolean isRequired(){
		String required = getElement().getAttribute("required");
		if( required.equals("") ){
			return false;
		}
		return true;
	}
}
