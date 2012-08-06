package org.rest.client.util;

import java.util.ArrayList;
import java.util.Iterator;

public class CodeMirrorHelper implements Iterable<CodeMirrorElement> {
	
	private ArrayList<CodeMirrorElement> elements = new ArrayList<CodeMirrorElement>();
	private Iterator<CodeMirrorElement> it;
	
	@Override
	public Iterator<CodeMirrorElement> iterator() {
		if(it == null){
			it = elements.iterator();
		}
		return it;
	}
	
	public void add(CodeMirrorElement e){
		elements.add(e);
	}
	
	public void remove(CodeMirrorElement e){
		elements.remove(e);
	}
	
	public void clear(){
		elements.clear();
		it = null;
	}
}
