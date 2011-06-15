package com.kalicinscy.web.restclient.client;

import com.allen_sauer.gwt.log.client.Log;
import com.google.gwt.core.client.JsArray;
import com.google.gwt.dom.client.Document;
import com.google.gwt.dom.client.Node;
import com.google.gwt.dom.client.NodeList;
import com.google.gwt.safehtml.shared.SafeHtmlUtils;
import com.google.gwt.user.client.ui.HTML;
import com.kalicinscy.web.restclient.client.api.XMLDocument;
import com.kalicinscy.web.restclient.client.api.XMLNode;

public class XMLviewer {
	
	private static final String COMMENT_CLASS = "xml-comment";
	private static final String PUNCTUATION_CLASS = "xml-punctuation";
	private static final String TAG_NAME_CLASS = "xml-tagname";
	private static final String ATTR_NAME_CLASS = "xml-attname";
	private static final String ATTR_VALUE_CLASS = "xml-attribute";
	private static final String CDATA_CLASS = "xml-cdata";
	private static final String INLINE_CLASS = "xml-inline";
	private static final String ARROW_CLASS_EXPANDED = "xml-arrow-expanded";
	private static final String ARROW_CLASS_EMPTY = "xml-arrow-empty";
	
	
	
	Document data = null;
	
	public XMLviewer (Document xml){
		
		this.data = xml;
	}
	
	
	public void setHTML(HTML body){
		String data = "<div class=\"pretty-print\">";
		NodeList<Node> nodes = this.data.getChildNodes();
		XMLDocument doc = (XMLDocument)this.data;
		String enc = doc.getXmlEncoding();
		String ver = doc.getXmlVersion();
		
		if( enc != null && enc != null ){
			data += "<span class=\"xml-processing\">&lt;?xml version=\""+ver+"\" encoding=\""+enc+"\"?&gt;</span>";
		}
		int cnt = nodes.getLength();
		for( int i = 0; i< cnt; i++ ){
			data += parse(nodes.getItem(i), 0);
		}
		data += "</div>";
		//HTML body = new HTML(data);
		body.setHTML(data);
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
					parsed += "<span class=\""+XMLviewer.ARROW_CLASS_EXPANDED+"\">&nbsp;</span>";
					indent++;
					showArrows = true;
				}
				
				parsed += "<span class=\""+XMLviewer.PUNCTUATION_CLASS+"\">&lt;</span>";
				parsed += "<span class=\""+XMLviewer.TAG_NAME_CLASS+"\">"+name+"</span>";
				attr = nodeElement.getAttributes();
				if( attr != null && attr.length() > 0 ){
					for( int i=0; i< attr.length(); i++ ){
						parsed += " " + this.getAttributesString( attr.get(i) );
					}
				}
				if( hasChildren ){
					parsed += "<span class=\""+XMLviewer.PUNCTUATION_CLASS+"\">&gt;</span>";
					NodeList<Node> children = node.getChildNodes();
					
					boolean showInline = false;
					if( childrenCount == 1 && Document.TEXT_NODE == children.getItem(0).getNodeType() ){
						//simple: only one child - text - show response inline.
						showInline = true;
					}
					
					int nextIndent = indent;
					if( showInline ){
						parsed += "<div class=\""+XMLviewer.INLINE_CLASS+"\">";
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
						parsed += "<span class=\""+XMLviewer.ARROW_CLASS_EMPTY+"\">&nbsp;</span>";						
					}
					
					parsed += "<span class=\""+XMLviewer.PUNCTUATION_CLASS+"\">&lt;/</span>";
					parsed += "<span class=\""+XMLviewer.TAG_NAME_CLASS+"\">"+name+"</span>";
					parsed += "<span class=\""+XMLviewer.PUNCTUATION_CLASS+"\">&gt;</span>";
				} else {
					parsed += "<span class=\""+XMLviewer.PUNCTUATION_CLASS+"\"> /&gt;</span>";
				}
				
				break;
			case 2: //ATTRIBUTE_NODE, attribute value
				parsed += "ATTRIBUTE_NODE";
				Log.debug(parsed);
				return "";
			case Document.TEXT_NODE: //TEXT_NODE, content of node
				String value = node.getNodeValue();
				if( value.equals("") ){
					return "";
				}
				parsed += node.getNodeValue();
				break;
			case 4: //CDATA_SECTION_NODE, content of node
				parsed += "<span class=\""+XMLviewer.CDATA_CLASS+"\">&lt;![CDATA[</span>";
				parsed += SafeHtmlUtils.htmlEscape( node.getNodeValue() ).replace("\n", "<br/>");
				parsed += "<span class=\""+XMLviewer.CDATA_CLASS+"\">]]&gt;</span>";
				break;
			case 5: //ENTITY_REFERENCE_NODE, value null
				parsed += "ENTITY_REFERENCE_NODE";
				Log.debug(parsed);
				return "";
			case 6: //ENTITY_NODE, value null
				parsed += "ENTITY_NODE";
				Log.debug(parsed);
				return "";
			case 7: //PROCESSING_INSTRUCTION_NODE, content of node
				parsed += "PROCESSING_INSTRUCTION_NODE";
				Log.debug(parsed);
				return "";
			case 8: //COMMENT_NODE, comment text
				parsed += "<span class=\""+COMMENT_CLASS+"\">&lt;--";
				parsed += node.getNodeValue();
				parsed += "--&gt</span>";
				break;
			case Document.DOCUMENT_NODE: //DOCUMENT_NODE, value null
				parsed += "DOCUMENT_NODE";
				Log.debug(parsed);
				return "";
			case 10: //DOCUMENT_TYPE_NODE, value null
				parsed += "DOCUMENT_TYPE_NODE";
				Log.debug(parsed);
				return "";
			case 11: //DOCUMENT_FRAGMENT_NODE, value null
				parsed += "DOCUMENT_FRAGMENT_NODE";
				Log.debug(parsed);
				return "";
			case 12: //NOTATION_NODE, value null
				parsed += "NOTATION_NODE";
				Log.debug(parsed);
				return "";
		}
		
		parsed = "<div class=\"node\" style=\"text-indent: "+indentValue+"px;\">"+parsed+"</div>";
		return parsed;
	}
	
	private String getAttributesString(NodeAttribute attr){
		String data = "<span class=\""+XMLviewer.ATTR_NAME_CLASS+"\">";
		data += attr.getName();
		data += "</span>";
		data += "<span class=\""+XMLviewer.PUNCTUATION_CLASS+"\">=</span>";
		data += "<span class=\""+XMLviewer.ATTR_VALUE_CLASS+"\">&quot;";
		data += attr.getValue();
		data += "&quot;</span>";
		return data;
	}
	
}