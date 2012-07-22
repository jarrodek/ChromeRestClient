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

import com.google.gwt.xhr2.client.FileList;

public class FilesObject {
	private String name;
	private FileList files;

	public FilesObject(String name, FileList files) {
		this.name = name;
		this.files = files;
	}

	/**
	 * @param name
	 *            the name to set
	 */
	public void setName(String name) {
		this.name = name;
	}

	/**
	 * @return the name
	 */
	public String getName() {
		return name;
	}

	/**
	 * @param files
	 *            the files to set
	 */
	public void setFiles(FileList files) {
		this.files = files;
	}

	/**
	 * @return the files
	 */
	public FileList getFiles() {
		return files;
	}

	@Override
	public boolean equals(Object obj) {
		if (!(obj instanceof FilesObject)) {
			return false;
		}
		return this.getFiles().equals((((FilesObject) obj).getName()));
	}
}
