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
package org.rest.client.ui.html5;

import com.google.gwt.event.logical.shared.ValueChangeEvent;
import com.google.gwt.event.logical.shared.ValueChangeHandler;
import com.google.gwt.user.client.ui.TextBox;

/**
 * Numeric type input widger
 * @author Paweł Psztyć
 *
 */
public class HTML5InputNumber extends TextBox {
	/**
	 * Creates new input element type number.
	 */
	public HTML5InputNumber() {
		super();
		getElement().setAttribute("type", "number");
	}
	/**
	 * Creates new input element type number with defined min and max values
	 * @param min minimal range
	 * @param max maximal range
	 */
	public HTML5InputNumber(float min, float max) {
		super();
		getElement().setAttribute("type", "number");
		setMin(min);
		setMax(max);
	}
	/**
	 * Creates new input element type number with defined min, max and step values
	 * @param min minimal range
	 * @param max maximal range
	 * @param step step on value change
	 */
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
	
	/**
	 * @return true if this field is mark as required
	 */
	public boolean isRequired(){
		String required = getElement().getAttribute("required");
		if( required.equals("") ){
			return false;
		}
		return true;
	}
}
