package com.restclient.client.storage;

import com.google.gwt.xhr2.client.FileList;

public class FilesObject {
	private String name;
	private FileList files;
	
	public FilesObject(String name, FileList files){
		this.name = name;
		this.files = files;
	}
	/**
	 * @param name the name to set
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
	 * @param files the files to set
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
		if( !(obj instanceof FilesObject) ){
			return false;
		}
		return this.getFiles().equals( (((FilesObject) obj).getName()) );
	}
}
