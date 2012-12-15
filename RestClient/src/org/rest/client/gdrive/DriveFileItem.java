package org.rest.client.gdrive;

import com.google.gwt.core.client.JavaScriptObject;

public final class DriveFileItem extends JavaScriptObject {
	protected DriveFileItem(){}
	
	
	public native String getKind() /*-{
		return this.kind;
	}-*/;
	public native String getEtag() /*-{
		return this.etag;
	}-*/;
	public native String getSelfLink() /*-{
		return this.selfLink;
	}-*/;
	public native String getWebContentLink() /*-{
		return this.webContentLink;
	}-*/;
	public native String getAlternateLink() /*-{
		return this.alternateLink;
	}-*/;
	public native String getModifiedDate() /*-{
		return this.modifiedDate;
	}-*/;
	public native String getMimeType() /*-{
		return this.mimeType;
	}-*/;
	public native String getModifiedByMeDate() /*-{
		return this.modifiedByMeDate;
	}-*/;
	public native String getLastViewedByMeDate() /*-{
		return this.lastViewedByMeDate;
	}-*/;
	public native String getDownloadUrl() /*-{
		return this.downloadUrl;
	}-*/;
	public native String getOriginalFilename() /*-{
		return this.originalFilename;
	}-*/;
	public native String getFileExtensione() /*-{
		return this.fileExtension;
	}-*/;
	public native String getMd5Checksum() /*-{
		return this.md5Checksum;
	}-*/;
	public native String getFileSize() /*-{
		var res = 0;
		try{
			res = parseInt(this.fileSize,10);
		} catch(e){}
		return res;
	}-*/;
	public native String getQuotaBytesUsed() /*-{
		var res = 0;
		try{
			res = parseInt(this.quotaBytesUsed,10);
		} catch(e){}
		return res;
	}-*/;
	public native String getLastModifyingUserName() /*-{
		return this.lastModifyingUserName;
	}-*/;
	public native boolean isEditable() /*-{
		return !!this.editable;
	}-*/;
	public native boolean isWritersCanShare() /*-{
		return !!this.writersCanShare;
	}-*/;
	
	
	public native String getCreatedDate() /*-{
		return this.createdDate;
	}-*/;
	public native String getIconLink() /*-{
		return this.iconLink;
	}-*/;
	public native String getId() /*-{
		return this.id;
	}-*/;
	public native String getTitle() /*-{
		return this.title;
	}-*/;
}
