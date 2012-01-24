package com.restclient.client.storage;

/**
 * Class only for insert data to database.
 * 
 * @author jarrod
 * 
 */
public class ExportedDataInsertItem {
	private int referenceId;
	private String type;

	public ExportedDataInsertItem() {

	}

	/**
	 * @param type
	 *            the type to set
	 * @return 
	 */
	public ExportedDataInsertItem setType(String type) {
		this.type = type;
		return this;
	}

	/**
	 * @return the type
	 */
	public String getType() {
		return type;
	}

	/**
	 * @return the reference_id
	 */
	public final int getReferenceId() {
		return referenceId;
	}

	/**
	 * @param referenceId the reference_id to set
	 */
	public final void setReferenceId(int referenceId) {
		this.referenceId = referenceId;
	}

	
}
