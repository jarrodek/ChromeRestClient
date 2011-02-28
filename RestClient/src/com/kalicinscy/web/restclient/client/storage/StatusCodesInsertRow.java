package com.kalicinscy.web.restclient.client.storage;
/**
 * Class only for insert data to database.
 * @author jarrod
 *
 */
public class StatusCodesInsertRow {
  private Integer code;
  private String label;
  private String desc;
  public StatusCodesInsertRow(){
    
  }
  /**
   * @param code the code to set
   */
  public StatusCodesInsertRow setCode(Integer code) {
    this.code = code;
    return this;
  }
  /**
   * @return the status code
   */
  public Integer getCode() {
    return code;
  }
  /**
   * @param label the label to set
   */
  public StatusCodesInsertRow setLabel(String label) {
    this.label = label;
    return this;
  }
  /**
   * @return the label
   */
  public String getLabel() {
    return label;
  }
  /**
   * @param desc the desc to set
   */
  public StatusCodesInsertRow setDesc(String desc) {
    this.desc = desc;
    return this;
  }
  /**
   * @return the desc
   */
  public String getDesc() {
    return desc;
  }
}
