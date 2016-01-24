package org.rest.server.responses;

import com.google.appengine.api.users.User;

public class IdentityDebugResponse {
	public final String authDomain;
	public final String email;
	public final String federatedIdentity;
	public final String nickname;
	public final String userId;

	public IdentityDebugResponse(User user) {
		authDomain = user.getAuthDomain();
		email = user.getEmail();
		federatedIdentity = user.getFederatedIdentity();
		nickname = user.getNickname();
		userId = user.getUserId();
	}
}
