package org.rest.server;

import java.io.BufferedInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map.Entry;
import java.util.UUID;

import javax.jdo.PersistenceManager;
import javax.jdo.Query;
import javax.servlet.ServletException;
import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

/**
 * Servlet for communication with extension.
 * 
 * @author Paweł Psztyć
 * 
 */
public class ExtensionServlet extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = -7475618275284475409L;

	@Override
	protected void doOptions(HttpServletRequest req, HttpServletResponse res)
			throws ServletException, IOException {
		System.out.println("doOptions: " + req.getRemoteAddr());

		HttpServletResponse response = (HttpServletResponse) res;
		response.setHeader("Access-Control-Allow-Origin", "*");
		response.setHeader("Access-Control-Allow-Headers", "Content-Type");
		super.doOptions(req, res);
	}

	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		HttpServletResponse response = (HttpServletResponse) resp;
		response.setHeader("Access-Control-Allow-Origin", "*");
		response.setHeader("Access-Control-Allow-Headers", "Content-Type");
		Gson gson = new Gson();
		resp.setHeader("Content-Type", "application/json");
		String path = req.getPathInfo();
		if(path == null || path.equals("") || path.equals("/")){
			resp.setStatus(400);
			resp.getWriter().print(
					gson.toJson(new ResponseError("No payload")));
			return;
		}
		resp.setStatus(200);
		if(path.startsWith("/list")){
			String userId = path.substring(6);
			if(userId == null || userId.length() == 0){
				resp.setStatus(400);
				resp.getWriter().print(
						gson.toJson(new ResponseError("No ID :(")));
				return;
			}
			
			if(userId.equals("me")){
				User user = getUser();
				if(user == null){
					resp.setStatus(404);
					resp.getWriter().print(
							gson.toJson(new ResponseError("Not logged in", 401)));
					return;
				}
				userId = user.getUserId();
				System.out.println(userId);
			}
			AppUser appUser = AppUser.getUserById(userId);
			if(appUser == null){
				resp.setStatus(404);
				resp.getWriter().print(
						gson.toJson(new ResponseError("Not found", 404)));
				return;
			}
			
			List<ResponseListingItem> res = new ArrayList<ExtensionServlet.ResponseListingItem>();
			List<RequestItem> items = appUser.getItemsSet();
			for(RequestItem item : items){
				ResponseListingItem _responseItem = new ResponseListingItem();
				_responseItem.key = KeyFactory.keyToString(item.getKey());
				_responseItem.name = item.getName();
				_responseItem.updated = item.getCreateDate().getTime();
				_responseItem.url = item.getUrl();
				res.add(_responseItem);
			}
			resp.getWriter().print(gson.toJson(res));
			return;
		} else {
			resp.setStatus(404);
			resp.getWriter().print(
					gson.toJson(new ResponseError("Action not found")));
			return;
		}
	}
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {

		HttpServletResponse response = (HttpServletResponse) resp;
		response.setHeader("Access-Control-Allow-Origin", "*");
		response.setHeader("Access-Control-Allow-Headers", "Content-Type");

		Gson gson = new Gson();
		resp.setHeader("Content-Type", "application/json");

		String payload = req.getParameter("p");
		if(payload == null){
			payload = req.getPathInfo();
		}
		if (payload == null || payload.trim().equals("")) {
			resp.setStatus(400);
			resp.getWriter().print(
					gson.toJson(new ResponseError("No payload")));
			return;
		} else if (payload.equals("/put")) {
			
			ServletInputStream is = req.getInputStream();
			String data = readInputStreamAsString(is);
			if (data == null || data.equals("")) {
				resp.setStatus(400);
				resp.getWriter()
						.print(gson.toJson(new ResponseError(
								"Request body is empty")));
				return;
			}
			String saveRespStr = doSaveData(data);
			resp.getWriter().print(saveRespStr);
			
		} else if (payload.equals("/get")) {
			
			String[] paramValues = req.getParameterValues("k[]");
			if (paramValues == null || paramValues.length == 0) {
				resp.setStatus(400);
				resp.getWriter()
						.print(gson.toJson(new ResponseError(
								"Import keys not given")));
				return;
			}
			List<RequestItem> items = getItemsByKeys(paramValues);
			List<ResponseFormItem> _send = new ArrayList<ResponseFormItem>();
            for (RequestItem e : items) {
            	ResponseFormItem _item = new ResponseFormItem();
            	_item.encoding = e.getEncoding();
            	_item.method = e.getMethod();
            	_item.name = e.getName();
            	_item.post = e.getPost();
            	_item.url = e.getUrl();
            	_item.key = KeyFactory.keyToString(e.getKey());
            	List<ResponseFormItem.ResponseItemHeader> passHeaders = new ArrayList<ResponseFormItem.ResponseItemHeader>();
            	for(RequestHeader _h : e.getHeaders()){
            		ResponseFormItem.ResponseItemHeader hi = new ResponseFormItem.ResponseItemHeader();
            		hi.key = _h.getName();
            		hi.value = _h.getValue();
            		passHeaders.add(hi);
            	}
            	_item.headers = passHeaders;
            	_send.add(_item);
            }
            resp.getWriter().print(gson.toJson(_send));
		} else {
			resp.setStatus(400);
			resp.getWriter()
					.print(gson.toJson(new ResponseError(
							"Unknown payload")));
			return;
		}

		resp.setStatus(200);
	}
	
	
	@SuppressWarnings("unchecked")
	private List<RequestItem> getItemsByKeys(String[] keys){
		List<RequestItem> result = new ArrayList<RequestItem>();
		if(keys.length == 0){
			return result;
		}
		List<Key> keysList = new ArrayList<Key>();
		int size = keys.length;
		
		for(int i=0; i<size; i++){
			if(i > 30) break;
			keysList.add(KeyFactory.stringToKey(keys[i]));
		}
		
		PersistenceManager pm = PMF.get().getPersistenceManager();
		Query q = pm.newQuery("select from " + RequestItem.class.getName() + " where :keys.contains(key)");
		try{
			result = (List<RequestItem>) q.execute(keysList);
			result.size();
			return result;
		} catch(Exception e){
			e.printStackTrace();
		} finally {
			pm.close();
		}
		return result;
	}
	
	/**
	 * Save data passed from extension.
	 * @param payloadData
	 * @return
	 */
	private String doSaveData(String payloadData) {
		
		User user = getUser();
		if(user == null){
			return new Gson().toJson(new ResponseError(
					"Not logged in", 401));
		}
		
		AppUser appUser = AppUser.getOrCreateUser(user);
		
		JsonParser parser = new JsonParser();
		JsonObject obj = parser.parse(payloadData).getAsJsonObject();
		Gson gson = new Gson();

		JsonElement d = obj.get("d");
		JsonArray arr = d.getAsJsonArray();
		JsonElement i = obj.get("i");
		String applicationId = i.getAsString();

		List<RequestItem> toSave = new ArrayList<RequestItem>();
		HashMap<String, Integer> uuidsMap = new HashMap<String, Integer>(); 
		
		
		int dataSize = arr.size();
		for (int _i = 0; _i < dataSize; _i++) {
			RequestItem requestItem = new RequestItem();
			requestItem.setApplicationUUID(applicationId);
			requestItem.setItemUUID(UUID.randomUUID().toString());
			
			
			JsonElement jsonItem = arr.get(_i);
			JsonObject item = jsonItem.getAsJsonObject();
			String name = item.get("n").getAsString();
			int itemId = item.get("i").getAsInt();
			requestItem.setName(name);

			JsonObject formData = item.get("d").getAsJsonObject();
			requestItem.setUrl(formData.get("url").getAsString());
			requestItem.setPost(formData.get("post").getAsString());
			requestItem.setMethod(formData.get("method").getAsString());
			requestItem.setEncoding(formData.get("formEncoding").getAsString());
			requestItem.setAppUser(appUser);
			uuidsMap.put(requestItem.getItemUUID(), itemId);
			
			List<RequestHeader> headers = new ArrayList<RequestHeader>();
			JsonArray formHeaders = formData.get("headers").getAsJsonArray();
			int headersSize = formHeaders.size();
			for (int j = 0; j < headersSize; j++) {
				JsonElement headerJsonItem = formHeaders.get(j);
				JsonObject headerObj = headerJsonItem.getAsJsonObject();
				Iterator<Entry<String, JsonElement>> it = headerObj.entrySet().iterator();
				while(it.hasNext()){
					Entry<String, JsonElement> next = it.next();
					String headerName = next.getKey();
					String headerValue = next.getValue().getAsString();
					headers.add(new RequestHeader(headerName, headerValue));
					break;
				}
			}
			requestItem.setHeaders(headers);
			requestItem.setAppUser(appUser);
			toSave.add(requestItem);
		}
		
		if (toSave.size() > 0) {
			List<SaveResponseItem> response = new ArrayList<ExtensionServlet.SaveResponseItem>();
			
			appUser.getItemsSet().addAll(toSave);
			PersistenceManager pm = PMF.get().getPersistenceManager();
			try {
				appUser = pm.makePersistent(appUser);
				List<RequestItem> items = appUser.getItemsSet();
				System.out.println("Saved items size: "+items.size()+"");
				for(RequestItem item : items){
					if(uuidsMap.containsKey(item.getItemUUID())){
						SaveResponseItem r = new SaveResponseItem();
						r.key = KeyFactory.keyToString(item.getKey());
						r.id = uuidsMap.get(item.getItemUUID());
						response.add(r);
					}
				}
				return gson.toJson(response);
			} catch (Exception e) {
				return gson.toJson(new ResponseError(
						"Persistance error: " + e.getMessage()));
			} finally {
				pm.close();
			}
		}

		return gson.toJson(new ResponseError("Data parse error. Can't parse data on server."));
	}
	
	static class SaveResponseItem {
		String key;
		Integer id;
	}
	
	
	/**
	 * Response for list of requests available to get
	 * @author Paweł Psztyć
	 *
	 */
	static class ResponseListingItem {
		String key;
		String name;
		String url;
		Long updated;
	}
	
	static class ResponseFormItem {
		static class ResponseItemHeader{
			String key;
			String value;
		}
		String key;
		String name;
		String url;
		String post;
		String method;
		String encoding;
		List<ResponseItemHeader> headers;
	}
	
	
	
	@SuppressWarnings("unused")
	private static class ResponseError {
		final boolean error = true;
		/**
		 * Code error
		 */
		final int code;
		/**
		 * Error message
		 */
		final String message;
		/**
		 * Time of request
		 */
		final long time;

		ResponseError(String message) {
			this.message = message;
			this.time = new Date().getTime();
			this.code = 400;
		}

		ResponseError(String message, int code) {
			this.message = message;
			this.time = new Date().getTime();
			this.code = code;
		}
	}

	public static String readInputStreamAsString(InputStream in)
			throws IOException {

		BufferedInputStream bis = new BufferedInputStream(in);
		ByteArrayOutputStream buf = new ByteArrayOutputStream();
		int result = bis.read();
		while (result != -1) {
			byte b = (byte) result;
			buf.write(b);
			result = bis.read();
		}
		return buf.toString();
	}
	/**
	 * Get current logged in user.
	 * @return User or null if not logged in
	 */
	private User getUser(){
		UserService userService = UserServiceFactory.getUserService();
		if(!userService.isUserLoggedIn()) return null;
		return userService.getCurrentUser();
	}
}
