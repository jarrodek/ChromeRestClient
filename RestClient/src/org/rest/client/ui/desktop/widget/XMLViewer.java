package org.rest.client.ui.desktop.widget;

import java.util.ArrayList;

import org.rest.client.dom.NodeAttribute;
import org.rest.client.dom.XMLDocument;
import org.rest.client.dom.XMLNode;
import org.rest.client.ui.html5.HTML5Element;
import org.rest.client.util.ElementWrapper;

import com.google.gwt.core.client.GWT;
import com.google.gwt.core.client.JsArray;
import com.google.gwt.dom.client.Document;
import com.google.gwt.dom.client.Node;
import com.google.gwt.dom.client.NodeList;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.resources.client.CssResource;
import com.google.gwt.safehtml.shared.SafeHtmlUtils;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.HTML;
import com.google.gwt.user.client.ui.HTMLPanel;
import com.google.gwt.user.client.ui.Widget;

public class XMLViewer extends Composite {
	
	interface Binder extends UiBinder<Widget, XMLViewer> {}
	
	interface ParserStyle extends CssResource {
		
		String prettyPrint();
		String comment();
		String punctuation();
		String tagname();
		String attname();
		String attribute();
		String cdata();
		String inline();
		String arrowExpanded();
		String arrowEmpty();
		String processing();
		String node();
		String opened();
	}
	
	@UiField HTML result;
	@UiField ParserStyle style;
	
	
	public XMLViewer (Document xml, HTMLPanel xmlPanel){
		
		initWidget(GWT.<Binder> create(Binder.class).createAndBindUi(this));
		
		NodeList<Node> nodes = null;
		XMLDocument doc = null;
		try{
			nodes = xml.getChildNodes();
			doc = (XMLDocument) xml;
		} catch( Exception e ){}
		
		if( nodes == null || doc == null ){
			//TODO parse error
			return;
		}
		String enc = doc.getXmlEncoding();
		String ver = doc.getXmlVersion();
		int cnt = nodes.getLength();
		String data = "<div class=\""+style.prettyPrint()+"\">";
		if( enc != null && enc != null ){
			data += "<span class=\""+style.processing()+"\">&lt;?xml version=\""+ver+"\" encoding=\""+enc+"\"?&gt;</span>";
		}
		for( int i = 0; i< cnt; i++ ){
			data += parse(nodes.getItem(i), 0);
		}
		data += "</div>";
		result.setHTML(data);
		xmlPanel.add(this);
		addEditorSupport();
	}
	
	
	private String parse(Node node, int indent){
		
		int indentValue = indent * 10;
		
		String parsed = "";
		
		String name = node.getNodeName();
		int type = node.getNodeType();
		boolean hasChildren = node.hasChildNodes();
		int childrenCount = 0;
		if( hasChildren ){
			childrenCount = node.getChildCount();
		}
		XMLNode nodeElement = ((XMLNode) node);
		
		JsArray<NodeAttribute> attr;
		switch(type){
			case Document.ELEMENT_NODE: //ELEMENT_NODE, value null
				boolean showArrows = false;
				
				if ( childrenCount > 1 ){
					parsed += "<span class=\""+style.arrowExpanded()+"\">&nbsp;</span>";
					indent++;
					showArrows = true;
				}
				
				parsed += "<span class=\""+style.punctuation()+"\">&lt;</span>";
				parsed += "<span class=\""+style.tagname()+"\">"+name+"</span>";
				attr = nodeElement.getAttributes();
				if( attr != null && attr.length() > 0 ){
					for( int i=0; i< attr.length(); i++ ){
						parsed += " " + this.getAttributesString( attr.get(i) );
					}
				}
				if( hasChildren ){
					parsed += "<span class=\""+style.punctuation()+"\">&gt;</span>";
					NodeList<Node> children = node.getChildNodes();
					
					boolean showInline = false;
					if(childrenCount == 1 && Document.TEXT_NODE == children.getItem(0).getNodeType() ){
						//simple: only one child - text - show response inline.
						showInline = true;
					}
					
					int nextIndent = indent;
					if( showInline ){
						parsed += "<div class=\""+style.inline()+"\">";
						nextIndent = 0;
					} else {
						nextIndent++;
					}
					
					for(int i=0; i<childrenCount; i++){
						parsed += this.parse( children.getItem(i), nextIndent );
					}
					
					if( showInline ){
						parsed += "</div>";
					}
					
					if( showArrows ){
						parsed += "<span class=\""+style.arrowEmpty()+"\">&nbsp;</span>";						
					}
					
					parsed += "<span class=\""+style.punctuation()+"\">&lt;/</span>";
					parsed += "<span class=\""+style.tagname()+"\">"+name+"</span>";
					parsed += "<span class=\""+style.punctuation()+"\">&gt;</span>";
				} else {
					parsed += "<span class=\""+style.punctuation()+"\"> /&gt;</span>";
				}
				
				break;
			case 2: //ATTRIBUTE_NODE, attribute value
				parsed += "ATTRIBUTE_NODE";
//				Log.debug(parsed);
				return "";
			case Document.TEXT_NODE: //TEXT_NODE, content of node
				String value = node.getNodeValue();
				if( value.equals("") ){
					return "";
				}
				parsed += node.getNodeValue();
				break;
			case 4: //CDATA_SECTION_NODE, content of node
				parsed += "<span class=\""+style.cdata()+"\">&lt;![CDATA[</span>";
				parsed += SafeHtmlUtils.htmlEscape( node.getNodeValue() ).replace("\n", "<br/>");
				parsed += "<span class=\""+style.cdata()+"\">]]&gt;</span>";
				break;
			case 5: //ENTITY_REFERENCE_NODE, value null
				parsed += "ENTITY_REFERENCE_NODE";
//				Log.debug(parsed);
				return "";
			case 6: //ENTITY_NODE, value null
				parsed += "ENTITY_NODE";
//				Log.debug(parsed);
				return "";
			case 7: //PROCESSING_INSTRUCTION_NODE, content of node
				parsed += "PROCESSING_INSTRUCTION_NODE";
//				Log.debug(parsed);
				return "";
			case 8: //COMMENT_NODE, comment text
				parsed += "<span class=\""+style.comment()+"\">&lt;--";
				parsed += node.getNodeValue();
				parsed += "--&gt</span>";
				break;
			case Document.DOCUMENT_NODE: //DOCUMENT_NODE, value null
				parsed += "DOCUMENT_NODE";
//				Log.debug(parsed);
				return "";
			case 10: //DOCUMENT_TYPE_NODE, value null
				parsed += "DOCUMENT_TYPE_NODE";
//				Log.debug(parsed);
				return "";
			case 11: //DOCUMENT_FRAGMENT_NODE, value null
				parsed += "DOCUMENT_FRAGMENT_NODE";
//				Log.debug(parsed);
				return "";
			case 12: //NOTATION_NODE, value null
				parsed += "NOTATION_NODE";
//				Log.debug(parsed);
				return "";
		}
		
		parsed = "<div class=\""+style.node()+"\" style=\"text-indent: "+indentValue+"px;\">"+parsed+"</div>";
		return parsed;
	}
	
	private String getAttributesString(NodeAttribute attr){
		String data = "<span class=\""+style.attname()+"\">";
		data += attr.getName();
		data += "</span>";
		data += "<span class=\""+style.punctuation()+"\">=</span>";
		data += "<span class=\""+style.attribute()+"\">&quot;";
		data += attr.getValue();
		data += "&quot;</span>";
		return data;
	}
	
	private void addEditorSupport(){
		HTML5Element root = (HTML5Element) result.getElement();
		ArrayList<HTML5Element> nodes = new ArrayList<HTML5Element>();
		root.querySelectorAll("div."+style.node(), nodes);
		int listCnt = nodes.size();
		for( int i=0; i< listCnt; i++ ){
			nodes.get(i).putData("id", i);
		}
		ArrayList<HTML5Element> arrows = new ArrayList<HTML5Element>();
		root.querySelectorAll("span."+style.arrowExpanded(), arrows);
		listCnt = arrows.size();
		
		for( int i=0; i < listCnt; i++ ){
			final HTML5Element currentElement = arrows.get(i);
			ElementWrapper wrapper = new ElementWrapper(currentElement);
			wrapper.addClickHandler(new ClickHandler() {
				@Override
				public void onClick(ClickEvent event) {
					boolean close = true;
					ArrayList<HTML5Element> markers = new ArrayList<HTML5Element>();
					HTML5Element parent = (HTML5Element)currentElement.getParentElement();
					parent.querySelectorAll("span."+style.arrowEmpty(),markers);
					
					HTML5Element marker = markers.get(markers.size()-1);
					
					if( parent.getClassList().contains(style.opened())){
						close = false;
						parent.getClassList().remove(style.opened());
						marker.setInnerText("");
					} else {
						parent.getClassList().add( style.opened() );
						marker.setInnerText("(...)");
					}
					
					String id = parent.getDataString("id");
					HTML5Element wrapper = (HTML5Element)parent.getParentElement();
					ArrayList<HTML5Element> nodes = new ArrayList<HTML5Element>();
					wrapper.querySelectorAll("div[data-id=\"" + id + "\"] > ." + style.node(), nodes);
					int cnt = nodes.size();
					for(int i = 0; i < cnt; i++){
						if( close ){
							nodes.get(i).getClassList().add("hidden");
						} else {
							nodes.get(i).getClassList().remove("hidden");
						}
					}
				}
			});
		}
	}
	
}