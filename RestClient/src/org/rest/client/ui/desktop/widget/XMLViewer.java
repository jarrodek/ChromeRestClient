package org.rest.client.ui.desktop.widget;

import org.rest.client.RestClient;
import org.rest.client.dom.NodeAttribute;
import org.rest.client.dom.XMLDocument;
import org.rest.client.dom.XMLNode;
import org.rest.client.dom.worker.WebWorkerError;
import org.rest.client.dom.worker.Worker;
import org.rest.client.dom.worker.WorkerMessageHandler;

import com.allen_sauer.gwt.log.client.Log;
import com.google.gwt.core.client.GWT;
import com.google.gwt.core.client.JsArray;
import com.google.gwt.dom.client.Document;
import com.google.gwt.dom.client.Node;
import com.google.gwt.dom.client.NodeList;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONString;
import com.google.gwt.safehtml.shared.SafeHtmlUtils;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.dom.client.Element;
import com.google.gwt.user.client.Timer;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.HTML;
import com.google.gwt.user.client.ui.HTMLPanel;
import com.google.gwt.user.client.ui.Widget;

public class XMLViewer extends Composite {
	
	private final String prettyPrint = "XML_parser_prettyPrint";
	private final String XML_parser_node = "XML_parser_node";
	private final String punctuation = "XML_parser_punctuation";
	private final String comment = "XML_parser_comment";
	private final String tagname = "XML_parser_tagname";
	private final String attname = "XML_parser_attname";
	private final String attribute = "XML_parser_attribute";
	private final String cdata = "XML_parser_cdata";
	private final String inline = "XML_parser_inline";
	private final String arrowExpanded = "XML_parser_arrowExpanded";
	private final String arrowEmpty = "XML_parser_arrowEmpty";
	private final String processing = "XML_parser_processing";
	private final String opened = "XML_parser_opened";
	private final String nodeMargin = "XML_parser_nodeMargin";
	private final String collapseIndicator = "XML_parser_collapseIndicator";
	
	
	interface Binder extends UiBinder<Widget, XMLViewer> {
	}

	@UiField HTML result;

	public XMLViewer(final String xml, HTMLPanel xmlPanel,
			final Document fallbackXml) {
		initWidget(GWT.<Binder> create(Binder.class).createAndBindUi(this));
		xmlPanel.add(this);

		new Timer() {
			@Override
			public void run() {
				Worker xmlWorker = new Worker("/workers/xmlviewer.js");
				xmlWorker.onMessage(new WorkerMessageHandler() {
					@Override
					public void onMessage(String message) {
						result.setHTML(message);
						addNativeControls(result.getElement());
					}

					@Override
					public void onError(WebWorkerError err) {
						if (RestClient.isDebug()) {
							Log.error("Error in web worker", err);
						}
						Log.info("This XML contains errors and can't be parsed. Trying fallback method.");
						//
						// Fallback for broken XMLs
						//
						if(fallbackXml != null){
							parseFallback(fallbackXml);
						} else {
							result.setHTML("<div class=\"parse-error\">Sorry, but this is not a valid XML :(</div>");
						}
					}
				});

				JSONObject styleData = new JSONObject();
				styleData.put("prettyPrint", new JSONString(prettyPrint));
				styleData.put("node", new JSONString(XML_parser_node));
				styleData.put("punctuation", new JSONString(punctuation));
				styleData.put("comment", new JSONString(comment));
				styleData.put("tagname", new JSONString(tagname));
				styleData.put("attname", new JSONString(attname));
				styleData.put("attribute", new JSONString(attribute));
				styleData.put("cdata", new JSONString(cdata));
				styleData.put("inline", new JSONString(inline));
				styleData.put("arrowExpanded", new JSONString(arrowExpanded));
				styleData.put("arrowEmpty", new JSONString(arrowEmpty));
				styleData.put("processing", new JSONString(processing));
				styleData.put("opened", new JSONString(opened));
				styleData.put("nodeMargin", new JSONString(nodeMargin));
				styleData.put("collapseIndicator", new JSONString(collapseIndicator));

				JSONObject post = new JSONObject();
				post.put("style", styleData);
				post.put("data", new JSONString(xml));

				xmlWorker.postMessage(post.getJavaScriptObject());
			}
		}.schedule(300);
	}
	
	
	
	
	
	private final native void addNativeControls(Element element)/*-{
		element.addEventListener('click', function(e) {
			if (!e.target)
				return;
			if (!e.target.getAttribute("colapse-marker"))
				return;
			var parent = e.target.parentNode;
			var expanded = parent.dataset['expanded'];
			if (!expanded || expanded == "true") {
				parent.dataset['expanded'] = "false";
			} else {
				parent.dataset['expanded'] = "true";
			}
		}, true);
	}-*/;

	

	private void parseFallback(Document xml) {
		NodeList<Node> nodes = null;
		XMLDocument doc = null;
		try {
			nodes = xml.getChildNodes();
			doc = (XMLDocument) xml;
		} catch (Exception e) {
		}

		if (nodes == null || doc == null) {
			result.setHTML("<div class=\"parse-error\">Sorry, but can't parse this file as XML :(</div>");
			return;
		}
		int nodesCnt = nodes.getLength();
		
    	
		String data = "<div class=\"" + prettyPrint + "\">";
    	for(int i = 0; i<nodesCnt; i++){
    		data += parse(nodes.getItem(i));
		}
    	data += "</div>";
		
		
		result.setHTML(data);
		addNativeControls(result.getElement());
	}

	private String parse(Node node) {

		String parsed = "";
		int type = node.getNodeType();
		
		switch (type) {
		case Document.ELEMENT_NODE: // ELEMENT_NODE, value null
			parsed = parseElement(node);

			break;
		case 2: // ATTRIBUTE_NODE, attribute value
			parsed += "ATTRIBUTE_NODE";
			// Log.debug(parsed);
			return "";
		case Document.TEXT_NODE: // TEXT_NODE, content of node
			String value = node.getNodeValue();
			if (value.equals("")) {
				return "";
			}
			value = SafeHtmlUtils.htmlEscape(value);
			if(value == ""){
				return "";
			}
			parsed += value;
			break;
		case 4: // CDATA_SECTION_NODE, content of node
			parsed += "<span colapse-marker=\"true\" class=\""+arrowExpanded+"\">&nbsp;</span>";
			parsed += "<span class=\"" + cdata + "\">&lt;![CDATA[</span>";
			parsed += "<div collapsible style=\"white-space: pre;\">";
			parsed += SafeHtmlUtils.htmlEscape(node.getNodeValue()).replace(
					"\n", "<br/>");
			parsed += "</div><span class=\"" + cdata + "\">]]&gt;</span>";
			break;
		case 5: // ENTITY_REFERENCE_NODE, value null
			parsed += "ENTITY_REFERENCE_NODE";
			// Log.debug(parsed);
			return "";
		case 6: // ENTITY_NODE, value null
			parsed += "ENTITY_NODE";
			// Log.debug(parsed);
			return "";
		case 7: // PROCESSING_INSTRUCTION_NODE, content of node
			parsed += "<div class=\""+processing+"\">&lt;?xml "+node.getNodeValue()+" ?&gt;</div>";
			return "";
		case 8: // COMMENT_NODE, comment text
			parsed += "<div class=\"" + comment + "\">&lt;--";
			parsed += node.getNodeValue();
			parsed += "--&gt</div>";
			break;
		case Document.DOCUMENT_NODE: // DOCUMENT_NODE, value null
			parsed += "DOCUMENT_NODE";
			// Log.debug(parsed);
			return "";
		case 10: // DOCUMENT_TYPE_NODE, value null
			parsed += "DOCUMENT_TYPE_NODE";
			// Log.debug(parsed);
			return "";
		case 11: // DOCUMENT_FRAGMENT_NODE, value null
			parsed += "DOCUMENT_FRAGMENT_NODE";
			// Log.debug(parsed);
			return "";
		case 12: // NOTATION_NODE, value null
			parsed += "NOTATION_NODE";
			// Log.debug(parsed);
			return "";
		}

		parsed = "<div class=\"" + XML_parser_node + "\">" + parsed + "</div>";
		return parsed;
	}





	private String parseElement(Node node) {
		boolean hasChildren = node.hasChildNodes();
		int childrenCount = 0;
		if (hasChildren) {
			childrenCount = node.getChildCount();
		}
		String parsed = "";
		boolean showArrows = false;
		NodeList<Node> children = node.getChildNodes();
		if (childrenCount > 1 ) {
			parsed += "<span colapse-marker=\"true\" class=\"" + arrowExpanded + "\">&nbsp;</span>";
			showArrows = true;
		}
		parsed += "<span class=\"" + punctuation + "\">&lt;</span>";
		XMLNode nodeElement = ((XMLNode) node);
		JsArray<NodeAttribute> attr;
		String name = node.getNodeName();
		parsed += "<span class=\"" + tagname + "\">" + name + "</span>";
		attr = nodeElement.getAttributes();
		if (attr != null && attr.length() > 0) {
			for (int i = 0; i < attr.length(); i++) {
				parsed += " " + this.getAttributesString(attr.get(i));
			}
		}
		
		if (hasChildren) {
			
			parsed += "<span class=\"" + punctuation + "\">&gt;</span>";
			
			boolean showInline = false;
			if (childrenCount == 1 && Document.TEXT_NODE == children.getItem(0).getNodeType()) {
				// simple: only one child - text - show response inline.
				showInline = true;
			}
			if (showInline) {
				parsed += "<div class=\"" + inline + "\">";
			} else {
				parsed += "<div collapse-indicator class=\""+collapseIndicator+"\">...</div>";
				parsed += "<div collapsible class=\""+nodeMargin+"\">";
			}

			for (int i = 0; i < childrenCount; i++) {
				parsed += this.parse(children.getItem(i));
			}

			parsed += "</div>";			

			if (showArrows) {
				parsed += "<span arrowEmpty class=\"" + arrowEmpty + "\">&nbsp;</span>";
			}

			parsed += "<span class=\"" + punctuation + "\">&lt;/</span>";
			parsed += "<span class=\"" + tagname + "\">" + name + "</span>";
			parsed += "<span class=\"" + punctuation + "\">&gt;</span>";
		} else {
			parsed += "<span class=\"" + punctuation + "\"> /&gt;</span>";
		}
		return parsed;
	}
	
	
	private String getAttributesString(NodeAttribute attr) {
		String data = "<span class=\"" + attname + "\">";
		data += attr.getName();
		data += "</span>";
		data += "<span class=\"" + punctuation + "\">=</span>";
		data += "<span class=\"" + attribute + "\">&quot;";
		data += attr.getValue();
		data += "&quot;</span>";
		return data;
	}
}