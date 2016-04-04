package org.rest.server;

import java.io.BufferedInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.Map.Entry;

import javax.jdo.PersistenceManager;
import javax.jdo.Query;
import javax.servlet.ServletException;
import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.rest.server.models.ResponseFormItem;
import org.rest.server.models.ResponseListingItem;
import org.rest.server.models.SaveResponseItem;
import org.rest.server.responses.AuthError;
import org.rest.server.responses.IdentityDebugResponse;
import org.rest.server.responses.ResponseError;

import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.oauth.OAuthRequestException;
import com.google.appengine.api.oauth.OAuthService;
import com.google.appengine.api.oauth.OAuthServiceFactory;
import com.google.appengine.api.oauth.OAuthServiceFailureException;
import com.google.appengine.api.users.User;
//import com.google.appengine.api.utils.SystemProperty;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

public class DataImportExportServlet extends HttpServlet {
	OAuthService oauth = OAuthServiceFactory.getOAuthService();
	private final static String SCOPE = "https://www.googleapis.com/auth/userinfo.email";
	static Set<String> allowedClients = new HashSet<>();

	static {
		allowedClients.add("10525470235-vtm8ckt9v43r1gbbjqhp01tnnr0ol41j.apps.googleusercontent.com");
	}

	private static final long serialVersionUID = 8132927710530459474L;

	private User getAuthAuth() throws OAuthRequestException, OAuthServiceFailureException {
		User user = oauth.getCurrentUser(SCOPE);
		if (user == null) {
			throw new OAuthRequestException("Not authorized");
		}
		/*if (SystemProperty.environment.value() != SystemProperty.Environment.Value.Production) {
			return user;
		}*/
		String tokenAudience = oauth.getClientId(SCOPE);
		if (!allowedClients.contains(tokenAudience)) {
			throw new OAuthRequestException(
					"audience of token '" + tokenAudience + "' is not in allowed list " + allowedClients);
		}
		return user;
	}

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setHeader("Content-Type", "application/json");
		User user = null;
		try {
			user = getAuthAuth();
		} catch (OAuthRequestException e) {
			Gson gson = new Gson();
			String errorResp = gson.toJson(new AuthError("Auth error (1)" + e.getMessage()));
			resp.setStatus(404);
			resp.getWriter().print(errorResp);
			return;
		} catch (OAuthServiceFailureException e) {
			Gson gson = new Gson();
			String errorResp = gson.toJson(new AuthError("Auth error (2)" + e.getMessage()));
			resp.setStatus(404);
			resp.getWriter().print(errorResp);
			return;
		}
		String path = req.getPathInfo();
		if (path.startsWith("/data/list")) {
			listData(user, req, resp);
		} else if (path.startsWith("/data/_debug/identity")) {
			Gson gson = new Gson();
			String data = gson.toJson(new IdentityDebugResponse(user));
			resp.setStatus(200);
			resp.getWriter().print(data);
			return;
		} else {
			Gson gson = new Gson();
			resp.setStatus(404);
			resp.getWriter().print(gson.toJson(new ResponseError("Action not found")));
		}
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setHeader("Content-Type", "application/json");
		User user = null;
		try {
			user = getAuthAuth();
		} catch (OAuthRequestException e) {
			Gson gson = new Gson();
			String errorResp = gson.toJson(new AuthError("Auth error (3)" + e.getMessage()));
			resp.setStatus(404);
			resp.getWriter().print(errorResp);
			return;
		} catch (OAuthServiceFailureException e) {
			Gson gson = new Gson();
			String errorResp = gson.toJson(new AuthError("Auth error (4)" + e.getMessage()));
			resp.setStatus(404);
			resp.getWriter().print(errorResp);
			return;
		}
		Gson gson = new Gson();
		String payload = req.getParameter("p");
		if (payload == null) {
			payload = req.getPathInfo();
		}
		if (payload == null || payload.trim().equals("")) {
			resp.setStatus(400);
			resp.getWriter().print(gson.toJson(new ResponseError("No payload")));
			return;
		} else if (payload.equals("/put")) {
			ServletInputStream is = req.getInputStream();
			String data = readInputStreamAsString(is);
			if (data == null || data.equals("")) {
				resp.setStatus(400);
				resp.getWriter().print(gson.toJson(new ResponseError("Request body is empty")));
				return;
			}
			String saveRespStr = doSaveData(user, data);
			resp.getWriter().print(saveRespStr);

		} else if (payload.equals("/get")) {

			String[] paramValues = req.getParameterValues("k[]");
			if (paramValues == null || paramValues.length == 0) {
				resp.setStatus(400);
				resp.getWriter().print(gson.toJson(new ResponseError("Import keys not given")));
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
				for (RequestHeader _h : e.getHeaders()) {
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
			resp.getWriter().print(gson.toJson(new ResponseError("Unknown payload")));
			return;
		}

		resp.setStatus(200);
	}

	protected void listData(User user, HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		String path = req.getPathInfo();
		String userId = null;
		Gson gson = new Gson();

		if (path.equals("/data/list")) {
			userId = "me";
		} else {
			try {
				userId = path.substring(11);
			} catch (Exception e) {
			}
		}
		if (userId == null || userId.length() == 0) {
			resp.setStatus(400);
			resp.getWriter().print(gson.toJson(new ResponseError("No ID :(")));
			return;
		}
		if (userId.equals("me")) {
			userId = user.getUserId();
		}
		AppUser appUser = AppUser.getUserById(userId);
		if (appUser == null) {
			resp.setStatus(404);
			resp.getWriter().print(gson.toJson(new ResponseError("Owner user not found: " + userId, 404)));
			return;
		}

		List<ResponseListingItem> res = new ArrayList<ResponseListingItem>();
		List<RequestItem> items = appUser.getItemsSet();
		for (RequestItem item : items) {
			ResponseListingItem _responseItem = new ResponseListingItem();
			_responseItem.key = KeyFactory.keyToString(item.getKey());
			_responseItem.name = item.getName();
			_responseItem.updated = item.getCreateDate().getTime();
			_responseItem.url = item.getUrl();
			res.add(_responseItem);
		}
		resp.getWriter().print(gson.toJson(res));
		return;
	}

	@SuppressWarnings("unchecked")
	private List<RequestItem> getItemsByKeys(String[] keys) {
		List<RequestItem> result = new ArrayList<RequestItem>();
		if (keys.length == 0) {
			return result;
		}
		List<Key> keysList = new ArrayList<Key>();
		int size = keys.length;

		for (int i = 0; i < size; i++) {
			if (i > 30)
				break;
			keysList.add(KeyFactory.stringToKey(keys[i]));
		}

		PersistenceManager pm = PMF.get().getPersistenceManager();
		Query q = pm.newQuery("select from " + RequestItem.class.getName() + " where :keys.contains(key)");
		try {
			result = (List<RequestItem>) q.execute(keysList);
			result.size();
			return result;
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			pm.close();
		}
		return result;
	}

	/**
	 * Save data passed from extension.
	 * 
	 * @param payloadData
	 * @return
	 */
	private String doSaveData(User user, String payloadData) {

		if (user == null) {
			return new Gson().toJson(new ResponseError("Not logged in", 401));
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
			JsonElement url = formData.get("url");
			JsonElement post = formData.get("post");
			JsonElement method = formData.get("method");
			JsonElement formEncoding = formData.get("formEncoding");
			requestItem.setUrl(url == null ? "" : url.getAsString());
			requestItem.setPost(post == null ? "" : post.getAsString());
			requestItem.setMethod(method == null ? "" : method.getAsString());
			requestItem.setEncoding(formEncoding == null ? "" : formEncoding.getAsString());
			requestItem.setAppUser(appUser);
			uuidsMap.put(requestItem.getItemUUID(), itemId);

			List<RequestHeader> headers = new ArrayList<RequestHeader>();
			JsonArray formHeaders = formData.get("headers").getAsJsonArray();
			int headersSize = formHeaders.size();
			for (int j = 0; j < headersSize; j++) {
				JsonElement headerJsonItem = formHeaders.get(j);
				JsonObject headerObj = headerJsonItem.getAsJsonObject();
				Iterator<Entry<String, JsonElement>> it = headerObj.entrySet().iterator();
				while (it.hasNext()) {
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
			List<SaveResponseItem> response = new ArrayList<SaveResponseItem>();

			appUser.getItemsSet().addAll(toSave);
			PersistenceManager pm = PMF.get().getPersistenceManager();
			try {
				appUser = pm.makePersistent(appUser);
				List<RequestItem> items = appUser.getItemsSet();
				System.out.println("Saved items size: " + items.size() + "");
				for (RequestItem item : items) {
					if (uuidsMap.containsKey(item.getItemUUID())) {
						SaveResponseItem r = new SaveResponseItem();
						r.key = KeyFactory.keyToString(item.getKey());
						r.id = uuidsMap.get(item.getItemUUID());
						response.add(r);
					}
				}
				return gson.toJson(response);
			} catch (Exception e) {
				return gson.toJson(new ResponseError("Persistance error: " + e.getMessage()));
			} finally {
				pm.close();
			}
		}

		return gson.toJson(new ResponseError("Data parse error. Can't parse data on server."));
	}

	public static String readInputStreamAsString(InputStream in) throws IOException {

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
}
