package org.rest.client.ui.desktop;

import java.util.ArrayList;
import java.util.List;

import org.rest.client.RestClient;
import org.rest.client.Shortcut;
import org.rest.client.ShortcutType;
import org.rest.client.event.ShortcutChangeEvent;
import org.rest.client.ui.ShortcutView;

import com.allen_sauer.gwt.log.client.Log;
import com.google.gwt.core.client.GWT;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.KeyDownEvent;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.TextBox;
import com.google.gwt.user.client.ui.ToggleButton;
import com.google.gwt.user.client.ui.Widget;
import com.google.web.bindery.event.shared.EventBus;

public class ShortcutViewImpl extends Composite implements ShortcutView {
	
	private static AboutViewImplUiBinder uiBinder = GWT
			.create(AboutViewImplUiBinder.class);

	interface AboutViewImplUiBinder extends UiBinder<Widget, ShortcutViewImpl> {
	}
	
	private final static List<Integer> excludeList;
	static {
		excludeList = new ArrayList<Integer>();
		excludeList.add(8); //backspace
		excludeList.add(9); //TAB
		excludeList.add(13); //ENTER
		excludeList.add(20); //CAPSLOCK
		excludeList.add(0); //FN
		excludeList.add(16); //SHIFT
		excludeList.add(17); //CTRL
		excludeList.add(18); //ALT
	}
	
	@UiField ToggleButton openRequestCtrlToggle;
	@UiField ToggleButton openRequestShiftToggle;
	@UiField ToggleButton openRequestAltToggle;
	@UiField ToggleButton saveRequestCtrlToggle;
	@UiField ToggleButton saveRequestShiftToggle;
	@UiField ToggleButton saveRequestAltToggle;
	@UiField ToggleButton sendRequestCtrlToggle;
	@UiField ToggleButton sendRequestShiftToggle;
	@UiField ToggleButton sendRequestAltToggle;
	@UiField ToggleButton historyCtrlToggle;
	@UiField ToggleButton historyShiftToggle;
	@UiField ToggleButton historyAltToggle;
	
	@UiField TextBox openLetter;
	@UiField TextBox saveLetter;
	@UiField TextBox sendLetter;
	@UiField TextBox historyLetter;
	
	private int openKeyCode = -1;
	private int saveKeyCode = -1;
	private int sendKeyCode = -1;
	private int historyKeyCode = -1;
	
	public ShortcutViewImpl(){
		initWidget(uiBinder.createAndBindUi(this));
	}
	
	@Override
	public void setPresenter(Presenter listener) {
		
	}

	@Override
	public void setShortcuts(List<Shortcut> list) {
		for(Shortcut item : list){
			int cc = item.getCharCode();
			char[] chars = Character.toChars(cc);
			if(chars.length != 1) continue;
			
			String charIdentifier = Character.toString(chars[0]);
			if(charIdentifier == null) {
				Log.warn("Shortcut editor. charIdentifier is null.");
				continue;
			}
			
			ShortcutType type = item.getType();
			if(type == null) {
				Log.warn("Shortcut editor. type is null.");
				continue;
			}
			
			if(type.equals(ShortcutType.OPEN_REQUEST)){
				openLetter.setValue(charIdentifier);
				openKeyCode = item.getCharCode();
				openRequestCtrlToggle.setValue(item.isCtrl());
				openRequestAltToggle.setValue(item.isAlt());
				openRequestShiftToggle.setValue(item.isShift());
			} else if(type.equals(ShortcutType.SAVE_REQUEST)){
				saveLetter.setValue(charIdentifier);
				saveKeyCode = item.getCharCode();
				saveRequestCtrlToggle.setValue(item.isCtrl());
				saveRequestAltToggle.setValue(item.isAlt());
				saveRequestShiftToggle.setValue(item.isShift());
			} else if(type.equals(ShortcutType.SEND_REQUEST)){
				sendLetter.setValue(charIdentifier);
				sendKeyCode = item.getCharCode();
				sendRequestCtrlToggle.setValue(item.isCtrl());
				sendRequestAltToggle.setValue(item.isAlt());
				sendRequestShiftToggle.setValue(item.isShift());
			} else if(type.equals(ShortcutType.HISTORY_TAB)){
				historyLetter.setValue(charIdentifier);
				historyKeyCode = item.getCharCode();
				historyCtrlToggle.setValue(item.isCtrl());
				historyAltToggle.setValue(item.isAlt());
				historyShiftToggle.setValue(item.isShift());
			}
		}
	}
	
	@UiHandler({"openRequestCtrlToggle","openRequestShiftToggle","openRequestAltToggle",
		"saveRequestCtrlToggle","saveRequestShiftToggle","saveRequestAltToggle",
		"sendRequestCtrlToggle","sendRequestShiftToggle","sendRequestAltToggle",
		"historyCtrlToggle","historyShiftToggle","historyAltToggle",})
	void onMetaChange(ClickEvent e){
		ToggleButton button = (ToggleButton)e.getSource();
		
		Shortcut sc = new Shortcut();
		if(button.equals(openRequestCtrlToggle)
				|| button.equals(openRequestShiftToggle)
				|| button.equals(openRequestAltToggle)){
			sc.setCharCode(openKeyCode);
			sc.setAlt(openRequestAltToggle.getValue().booleanValue());
			sc.setCtrl(openRequestCtrlToggle.getValue().booleanValue());
			sc.setShift(openRequestShiftToggle.getValue().booleanValue());
			sc.setType(ShortcutType.OPEN_REQUEST);
		} else if(button.equals(saveRequestCtrlToggle)
				|| button.equals(saveRequestShiftToggle)
				|| button.equals(saveRequestAltToggle)){
			sc.setCharCode(saveKeyCode);
			sc.setAlt(saveRequestAltToggle.getValue().booleanValue());
			sc.setCtrl(saveRequestCtrlToggle.getValue().booleanValue());
			sc.setShift(saveRequestShiftToggle.getValue().booleanValue());
			sc.setType(ShortcutType.SAVE_REQUEST);
		} else if(button.equals(sendRequestCtrlToggle)
				|| button.equals(sendRequestShiftToggle)
				|| button.equals(sendRequestAltToggle)){
			sc.setCharCode(sendKeyCode);
			sc.setAlt(sendRequestAltToggle.getValue().booleanValue());
			sc.setCtrl(sendRequestCtrlToggle.getValue().booleanValue());
			sc.setShift(sendRequestShiftToggle.getValue().booleanValue());
			sc.setType(ShortcutType.SEND_REQUEST);
		}  else if(button.equals(historyCtrlToggle)
				|| button.equals(historyShiftToggle)
				|| button.equals(historyAltToggle)){
			sc.setCharCode(historyKeyCode);
			sc.setAlt(historyAltToggle.getValue().booleanValue());
			sc.setCtrl(historyCtrlToggle.getValue().booleanValue());
			sc.setShift(historyShiftToggle.getValue().booleanValue());
			sc.setType(ShortcutType.HISTORY_TAB);
		}
		
		ShortcutChangeEvent event = new ShortcutChangeEvent(sc);
		EventBus eventBus = RestClient.getClientFactory().getEventBus();
		eventBus.fireEvent(event);
	}
	
	@UiHandler({"sendLetter","saveLetter","openLetter","historyLetter"})
	void onSendLetterChange(KeyDownEvent event) {
		TextBox tb = (TextBox)event.getSource();
		if(tb == null) return;
		
		int cc = event.getNativeKeyCode();
		if(excludeList.contains(cc)){
			return;
		}
		
		event.preventDefault();
		event.stopPropagation();
		tb.cancelKey();
		String boxName = tb.getName();
		char[] chars = Character.toChars(cc);
		String charIdentifier = null;
		if(chars.length == 1) {
			charIdentifier = Character.toString(chars[0]);
		}
		
		if(excludeList.contains(cc)){
			charIdentifier = null;
		}
		
		if(charIdentifier == null){
			cc = -1;
		}
		
		tb.setValue(charIdentifier);
		
		if(RestClient.isDebug()){
			Log.debug("Shortcut change to character " + charIdentifier + ", with code: " + cc);
		}
		
		Shortcut sc = new Shortcut();
		sc.setCharCode(cc);
		
		if(boxName.equals("openLetter")){
			openKeyCode = cc;
			sc.setAlt(openRequestAltToggle.getValue().booleanValue());
			sc.setCtrl(openRequestCtrlToggle.getValue().booleanValue());
			sc.setShift(openRequestShiftToggle.getValue().booleanValue());
			sc.setType(ShortcutType.OPEN_REQUEST);
		} else if(boxName.equals("saveLetter")){
			saveKeyCode = cc;
			sc.setAlt(saveRequestAltToggle.getValue().booleanValue());
			sc.setCtrl(saveRequestCtrlToggle.getValue().booleanValue());
			sc.setShift(saveRequestShiftToggle.getValue().booleanValue());
			sc.setType(ShortcutType.SAVE_REQUEST);
		} else if(boxName.equals("sendLetter")){
			sendKeyCode = cc;
			sc.setAlt(sendRequestAltToggle.getValue().booleanValue());
			sc.setCtrl(sendRequestCtrlToggle.getValue().booleanValue());
			sc.setShift(sendRequestShiftToggle.getValue().booleanValue());
			sc.setType(ShortcutType.SEND_REQUEST);
		} else if(boxName.equals("historyLetter")){
			historyKeyCode = cc;
			sc.setAlt(historyAltToggle.getValue().booleanValue());
			sc.setCtrl(historyCtrlToggle.getValue().booleanValue());
			sc.setShift(historyShiftToggle.getValue().booleanValue());
			sc.setType(ShortcutType.HISTORY_TAB);
		}
		
		ShortcutChangeEvent e = new ShortcutChangeEvent(sc);
		EventBus eventBus = RestClient.getClientFactory().getEventBus();
		eventBus.fireEvent(e);
	}
}
