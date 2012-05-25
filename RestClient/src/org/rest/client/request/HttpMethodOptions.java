/*******************************************************************************
 * Copyright 2012 Paweł Psztyć
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *   http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/
package org.rest.client.request;

public class HttpMethodOptions {

	private static String[] methodsWithoutPayload = { "get", "head" };

	/**
	 * Check if selected HTTP Method should have message body. See <a href=
	 * "http://tools.ietf.org/html/draft-ietf-httpbis-p2-semantics-14#section-7"
	 * >http://tools.ietf.org/html/draft-ietf-httpbis-p2-semantics-14#section-7<
	 * /a> for more information.
	 * 
	 * @param method
	 *            Any String representing HTTP Method
	 * @return false if message body should not be included to request
	 */
	public static boolean hasBody(String method) {
		method = method.toLowerCase();
		for (String _m : methodsWithoutPayload) {
			if (_m.equals(method)) {
				return false;
			}
		}
		return true;
	}

}
