package org.rest.client.importparser;

import java.util.ArrayList;

import org.rest.client.RestClient;
import org.rest.client.jso.FileImportData;
import org.rest.client.jso.ProjectObject;
import org.rest.client.jso.RequestObject;
import org.rest.client.log.Log;

import com.google.gwt.core.client.JavaScriptException;
import com.google.gwt.core.client.JsArray;

/**
 * Parser for imported data from file.
 * @author Pawel Psztyc
 *
 */
public class ImportParser {
	
	
	public interface ImportParserHandler {
		void onParse(ImportResult result);
		void onError(Throwable e);
	}
	
	
	private final String input;
	private ArrayList<RequestObject> requestsResult = new ArrayList<RequestObject>();
	private ArrayList<ProjectObject> projectsResult = new ArrayList<ProjectObject>();
	
	public ImportParser(String data){
		this.input = data;
	}
	/**
	 * Use native JSON.parse function to transform data to JavaScriptObject.
	 * If the file is not an export file an error will be returned by the callback function.
	 * @param data Input data from file.
	 * @return Parsed data
	 * @throws JavaScriptException If the data is not a valid JSON string.
	 */
	private final native FileImportData parseData(String data) throws JavaScriptException /*-{
		return JSON.parse(data);
	}-*/;
	
	/**
	 * Parse import file content and result with overlay JSNI object.
	 * The {@link ImportParserHandler#onError(Throwable)} will be called when the file is not containing export data.
	 * @param callback A callback function to be called after data read.
	 */
	public void parse(final ImportParserHandler callback){
		if(this.input == null) {
			callback.onError(new Throwable("The file you are trying to import is empty."));
			return;
		}
		FileImportData data = null;
		try {
			data = parseData(input);
		} catch(Exception e){
			callback.onError(new Throwable("The file you are trying to import is invalid."));
			if(RestClient.isDebug()){
				Log.error("Error parse import file", e);
			}
			return;
		}
		
		if(!data.isValid()){
			callback.onError(new Throwable("The file you are trying to import is invalid."));
			if(RestClient.isDebug()){
				Log.error("Imported file is not app's file.");
				Log.debug(this.input);
			}
			return;
		}
		JsArray<RequestObject> requests = data.getRequests();
		if(requests.length() == 0){
			callback.onError(new Throwable("There's nothing to import from the file."));
			if(RestClient.isDebug()){
				Log.error("Requests array is empty.");
				Log.debug(this.input);
			}
			return;
		}
		JsArray<ProjectObject> projects = data.getProjects();
		
		ImportResult ir = new ImportResult();
		ir.projects = projects;
		ir.requests = requests;
		callback.onParse(ir);
	}
	
	
	
}
