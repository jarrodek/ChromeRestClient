package org.rest.client.gdrive.api;

import java.util.Date;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.core.client.JsArray;

public class DriveListItem extends DriveItem {
	protected DriveListItem() {
	}

	/**
	 * The ID of the file.
	 * 
	 * @return value or NULL if excluded from response
	 */
	public final native String getId() /*-{
		return this.id || null;
	}-*/;

	/**
	 * A link for downloading the content of the file in a browser using cookie
	 * based authentication. In cases where the content is shared publicly, the
	 * content can be downloaded without any credentials.
	 * 
	 * @return value or NULL if excluded from response
	 */
	public final native String getWebContentLink() /*-{
		return this.webContentLink || null;
	}-*/;

	/**
	 * A link for opening the file in using a relevant Google editor or viewer.
	 * 
	 * @return value or NULL if excluded from response
	 */
	public final native String getAlternateLink() /*-{
		return this.alternateLink || null;
	}-*/;

	/**
	 * A link for embedding the file.
	 * 
	 * @return value or NULL if excluded from response
	 */
	public final native String getEmbedLink() /*-{
		return this.embedLink || null;
	}-*/;

	/**
	 * A link to the file's thumbnail.
	 * 
	 * @return value or NULL if excluded from response
	 */
	public final native String getThumbnailLink() /*-{
		return this.thumbnailLink || null;
	}-*/;

	/**
	 * The title of the this file. Used to identify file or folder name.
	 * 
	 * @return value or NULL if excluded from response
	 */
	public final native String getTitle() /*-{
		return this.title || null;
	}-*/;

	/**
	 * The MIME type of the file.
	 * 
	 * @return value or NULL if excluded from response
	 */
	public final native String getMimeType() /*-{
		return this.mimeType || null;
	}-*/;

	/**
	 * A short description of the file.
	 * 
	 * @return value or NULL if excluded from response
	 */
	public final native String getDescription() /*-{
		return this.description || null;
	}-*/;

	/**
	 * Short lived download URL for the file. This is only populated for files
	 * with content stored in Drive.
	 * 
	 * @return value or NULL if excluded from response
	 */
	public final native String getDownloadUrl() /*-{
		return this.downloadUrl || null;
	}-*/;

	/**
	 * The original filename if the file was uploaded manually, or the original
	 * title if the file was inserted through the API. Note that renames of the
	 * title will not change the original filename. This will only be populated
	 * on files with content stored in Drive.
	 * 
	 * @return value or NULL if excluded from response
	 */
	public final native String getOriginalFilename() /*-{
		return this.originalFilename || null;
	}-*/;

	/**
	 * The file extension used when downloading this file. This field is read
	 * only. To set the extension, include it on title when creating the file.
	 * This is populated only for files with content stored in Drive.
	 * 
	 * @return value or NULL if excluded from response
	 */
	public final native String getFileExtension() /*-{
		return this.fileExtension || null;
	}-*/;

	/**
	 * An MD5 checksum for the content of this file. This is populated only for
	 * files with content stored in Drive.
	 * 
	 * @return value or NULL if excluded from response
	 */
	public final native String getMd5Checksum() /*-{
		return this.md5Checksum || null;
	}-*/;

	/**
	 * Name of the last user to modify this file. This will only be populated if
	 * a user has edited this file.
	 * 
	 * @return value or NULL if excluded from response
	 */
	public final native String getLastModifyingUserName() /*-{
		return this.lastModifyingUserName || null;
	}-*/;

	/**
	 * Indexable text attributes for the file. This property can only be
	 * written, and is not returned by files.get. For more information, see <a
	 * href
	 * ="https://developers.google.com/drive/practices#saving_indexable_text"
	 * >Saving indexable text</a>.
	 * 
	 * @return value or NULL if excluded from response
	 */
	public final native String getIndexableText() /*-{
		if (!this.indexableText)
			return null;
		return this.indexableText.text || null;
	}-*/;

	/**
	 * Create time for this file (formatted ISO8601 timestamp).
	 * 
	 * @return value or NULL if excluded from response
	 */
	public final native Date getCreatedDate() /*-{
		if (!this.createdDate)
			return null;
		return new Date(this.createdDate);
	}-*/;

	/**
	 * Last time this file was modified by anyone (formatted RFC 3339
	 * timestamp). This is only mutable on update when the setModifiedDate
	 * parameter is set.
	 * 
	 * @return value or NULL if excluded from response
	 */
	public final native Date getModifiedDate() /*-{
		if (!this.modifiedDate)
			return null;
		return new Date(this.modifiedDate);
	}-*/;

	/**
	 * Last time this file was modified by the currently authenticated user
	 * (formatted RFC 3339 timestamp).
	 * 
	 * @return value or NULL if excluded from response
	 */
	public final native Date getModifiedByMeDate() /*-{
		if (!this.modifiedByMeDate)
			return null;
		return new Date(this.modifiedByMeDate);
	}-*/;

	/**
	 * Last time this file was viewed by the user (formatted RFC 3339
	 * timestamp).
	 * 
	 * @return value or NULL if excluded from response
	 */
	public final native Date getLastViewedByMeDate() /*-{
		if (!this.lastViewedByMeDate)
			return null;
		return new Date(this.lastViewedByMeDate);
	}-*/;

	/**
	 * Time at which this file was shared with the user (formatted RFC 3339
	 * timestamp).
	 * 
	 * @return value or NULL if excluded from response
	 */
	public final native Date getSharedWithMeDate() /*-{
		if (!this.sharedWithMeDate)
			return null;
		return new Date(this.sharedWithMeDate);
	}-*/;

	/**
	 * Whether the file can be edited by the current user.
	 * 
	 * @return value or NULL if excluded from response
	 */
	public final native Boolean isEditable() /*-{
		return !!(this.editable)
	}-*/;

	/**
	 * Whether writers can share the document with other users.
	 * 
	 * @return value or NULL if excluded from response
	 */
	public final native Boolean isWritersCanShare() /*-{
		return !!(this.writersCanShare)
	}-*/;

	/**
	 * Whether this file has been explicitly trashed, as opposed to recursively
	 * trashed. This will only be populated if the file is trashed.
	 * 
	 * @return value or NULL if excluded from response
	 */
	public final native Boolean getExplicitlyTrashed() /*-{
		return !!(this.explicitlyTrashed)
	}-*/;

	/**
	 * The size of the file in bytes. This is populated only for files with
	 * content stored in Drive.
	 * 
	 * @return value or NULL if excluded from response
	 */
	public final native Long getFileSize() /*-{
		return this.fileSize || null
	}-*/;

	/**
	 * The number of quota bytes used by this file.
	 * 
	 * @return value or NULL if excluded from response
	 */
	public final native Long getQuotaBytesUsed() /*-{
		return this.quotaBytesUsed || null
	}-*/;

	/**
	 * A group of labels for the file.
	 * 
	 * @return value or NULL if excluded from response
	 */
	public final native DriveLabels getLabels() /*-{
		return this.labels || null
	}-*/;

	/**
	 * Collection of parent folders which contain this file. Setting this field
	 * will put the file in all of the provided folders. On insert, if no
	 * folders are provided, the file will be placed in the default root folder.
	 * 
	 * @return
	 */
	public final native JsArray<DriveParentResource> getParents() /*-{
		return this.parents || null;
	}-*/;
	/**
	 * Name(s) of the owner(s) of this file.
	 * @return
	 */
	public final native JsArray<JavascriptString> getOwnerNames() /*-{
		return this.ownerNames || null;
	}-*/;
	/**
	 * Links for exporting Google Docs to specific formats.
	 * @return
	 */
	public final native JavaScriptObject getExportLinks() /*-{
		return this.exportLinks || null;
	}-*/;

	// "userPermission": permissions Resource,
	// example:
	// "userPermission": {
	// "kind": "drive#permission",
	// "etag": "\"uZ1AIUC0pgPmSVr-o7JbttiNnkw/rAtqHUdjRdYB6Fcykl0Erg-6WII\"",
	// "id": "me",
	// "selfLink":
	// "https://www.googleapis.com/drive/v2/files/0AqOAKhuJe43VdGVvTXpTMGdFRnkySmljb3lGT3RWcGc/permissions/me",
	// "role": "owner",
	// "type": "user"
	// },
	// API:
	// {
	// "kind": "drive#permission",
	// "etag": etag,
	// "id": string,
	// "selfLink": string,
	// "name": string,
	// "role": string,
	// "additionalRoles": [
	// string
	// ],
	// "type": string,
	// "value": string,
	// "authKey": string,
	// "withLink": boolean,
	// "photoLink": string
	// }

	// "imageMediaMetadata": {
	// "width": integer,
	// "height": integer,
	// "rotation": integer,
	// "location": {
	// "latitude": double,
	// "longitude": double,
	// "altitude": double
	// }
	// }
}
