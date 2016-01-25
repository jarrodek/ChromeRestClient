package org.rest.client;

import java.util.Date;
import java.util.HashMap;

import org.rest.client.log.Log;

import com.google.gwt.regexp.shared.MatchResult;
import com.google.gwt.regexp.shared.RegExp;
import com.google.gwt.user.client.Random;

public class MagicVariables {
	
	HashMap<String, String> randGroupObjects = new HashMap<String, String>();
	HashMap<String, String> nowGroupObjects = new HashMap<String, String>();
	
	public String apply(String input){
		if(!SyncAdapter.magicVars) {
			Log.debug("Applying Magic variables: function disabled.");
			Log.warn("This oprion is deprecated and will be removed from settings. \nAll requests will be forced to apply magic variables.");
			return input;
		}
		try{
			input = applyRandom(input);
			input = applyTime(input);
		} catch(Exception e){
			Log.error("Error applying Magic Variables",e);
		}
		return input;
	}
	
	
	private String applyRandom(String input){
		input = input.replace("${random}", Random.nextInt(Integer.MAX_VALUE)+"");
		Log.debug("Applying Magic variables: random strings");
//		Log.debug("input: " + input);
		RegExp pattern = RegExp.compile("\\$\\{random:\\d+\\}","gm");
		for (MatchResult result = pattern.exec(input); result != null; result = pattern.exec(input)) {
			String group = result.getGroup(0);
//			Log.debug("group: " + group);
			String randStr = null;
			if(randGroupObjects.containsKey(group)) {
				randStr = randGroupObjects.get(group); 
			} else {
				randStr = Random.nextInt(Integer.MAX_VALUE)+"";
				randGroupObjects.put(group, randStr);
			}
			randGroupObjects.put(group,randStr);
			input = input.replace(group, randStr);
		}
				
		return input;
	}
	
	private String applyTime(String input){
		Log.debug("Applying Magic variables: time");
		input = input.replace("${now}", new Date().getTime()+"");
		
		RegExp pattern = RegExp.compile("\\$\\{now:(\\d+)\\}","gm");
		for (MatchResult result = pattern.exec(input); result != null; result = pattern.exec(input)) {
			String group = result.getGroup(0);
			String randStr = null;
			if(nowGroupObjects.containsKey(group)) {
				randStr = nowGroupObjects.get(group); 
			} else {
				randStr = new Date().getTime()+"";
				nowGroupObjects.put(group, randStr);
			}
			nowGroupObjects.put(group,randStr);
			input = input.replace(group, randStr);
		}
		return input;
	}
	
}
