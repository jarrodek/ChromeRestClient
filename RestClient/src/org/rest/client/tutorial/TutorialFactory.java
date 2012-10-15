package org.rest.client.tutorial;

import java.util.ArrayList;

import org.rest.client.ui.TutorialDialog;
import org.rest.client.ui.TutorialDialog.Controls;
import org.rest.client.ui.desktop.TutorialDialogImpl;

import com.google.gwt.core.client.GWT;
import com.google.gwt.json.client.JSONArray;
import com.google.gwt.json.client.JSONParser;
import com.google.gwt.json.client.JSONString;
import com.google.gwt.storage.client.Storage;
import com.google.gwt.user.client.ui.RootPanel;

public class TutorialFactory {
	private final String STORAGE_KEY = "tutorials";
	private final String tutorialName;
	private ArrayList<TutorialDialog> items = new ArrayList<TutorialDialog>();
	private TutorialDialog currentItem = null;
	private boolean canRun = false;
	
	private int current = 0;

	public TutorialFactory(String tutorialName) {
		this.tutorialName = tutorialName;
		
		checkTutorialStatus();
	}
	
	
	public boolean canStartTutorial(){
		return canRun;
	}
	
	
	
	/**
	 * Check if local store contains this tutorial name. If it does, don't show
	 * tutorial.
	 */
	private void checkTutorialStatus() {
		Storage store = Storage.getLocalStorageIfSupported();
		String pastTutorials = store.getItem(STORAGE_KEY);
		if (pastTutorials == null || pastTutorials.isEmpty()) {
			canRun = true;
			return;
		}

		try {
			JSONArray val = JSONParser.parseStrict(pastTutorials).isArray();
			int len = val.size();
			for (int i = 0; i < len; i++) {
				String _name = val.get(i).isString().stringValue();
				if (_name == null)
					continue;
				if (tutorialName.equals(_name)) {
					return;
				}
			}
		} catch (Exception e) {}
		canRun = true;
	}

	public static TutorialDialog createItem() {
		return GWT.create(TutorialDialogImpl.class);
	}

	public void addItem(TutorialDialog item) {
		if(!canRun) return;
		items.add(item);
	}
	
	
	private void preserveFuturerTutorials(){
		Storage store = Storage.getLocalStorageIfSupported();
		String pastTutorials = store.getItem(STORAGE_KEY);
		JSONArray val = null;
		if (pastTutorials == null || pastTutorials.isEmpty()) {
			val = new JSONArray();
		} else {
			try {
				val = JSONParser.parseStrict(pastTutorials).isArray();
			} catch (Exception e) {
				val = new JSONArray();
			}
		}
		val.set(val.size(), new JSONString(tutorialName));
		store.setItem(STORAGE_KEY, val.toString());
	}
	
	public void start(){
		if(!canRun) return;
		preserveFuturerTutorials();
		
		current = 0;
		showNext();
	}
	
	public void showNext(){
		if(currentItem != null){
			RootPanel.get(null).remove(currentItem);
		}
		currentItem = null;
		
		int itemsSize = items.size();		
		if(itemsSize<current+1){
			//no more items...
			items.clear();
			return;
		}
		
		currentItem = items.get(current);
		boolean hasNext = false;
		boolean hasPrev = false;
		boolean isLast = false;
		if(itemsSize>current+1){
			hasNext = true;
		}
		if(current>0){
			hasPrev = true;
		}
		if(itemsSize > 1 && itemsSize == current+1){
			isLast = true;
		}
		if(isLast && hasPrev){
			currentItem.showControls(Controls.PREV_CLOSE);
		} else if(hasNext && hasPrev){
			currentItem.showControls(Controls.PREV_NEXT);
		} else if(hasPrev){
			currentItem.showControls(Controls.PREV_ONLY);
		} else if(hasNext){
			currentItem.showControls(Controls.NEXT_ONLY);
		}
		
		currentItem.setCloseHandler(new TutorialDialog.CloseTutorialHandler() {
			@Override
			public void onClose(int lastUserAction) {
				switch(lastUserAction){
				case TutorialDialog.UserAction.CLOSE:
					breakUpTutorial();
					break;
				case TutorialDialog.UserAction.NEXT:
					showNext();
					break;
				case TutorialDialog.UserAction.PREV:
					current -= 2;
					showNext();
					break;
				}
			}
		});
		RootPanel.get(null).add(currentItem);
		currentItem.show();
		current++;
	}
	
	
	private void breakUpTutorial(){
		if(currentItem != null){
			RootPanel.get(null).remove(currentItem);
		}
		currentItem = null;
		int itemsSize = items.size();
		if(itemsSize > 1 && itemsSize == current+1){
			pushGAEvent("Tutorial","Break up", tutorialName, current);
		} else {
			pushGAEvent("Tutorial","Finished", tutorialName, 0);
		}
		items.clear();
	}
	
	public void clear(){
		if(items.size() > 0){
			breakUpTutorial();
		}
	}
	
	private final native void pushGAEvent(String category, String action, String label, int value)/*-{
		$wnd._gaq.push(['_trackEvent', category, action, label, value]);
	}-*/;
}
