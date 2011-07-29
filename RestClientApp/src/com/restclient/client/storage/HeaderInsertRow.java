package com.restclient.client.storage;
/**
 * Class only for insert data to database.
 * @author jarrod
 *
 */
public class HeaderInsertRow {
  private String name;
  private String desc;
  private String example;
  private String type;
  public HeaderInsertRow(){
    
  }
  /**
   * @param type the type to set
   */
  public HeaderInsertRow setType(String type) {
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
   * @param example the example to set
   */
  public HeaderInsertRow setExample(String example) {
    this.example = example;
    return this;
  }
  /**
   * @return the example
   */
  public String getExample() {
    return example;
  }
  /**
   * @param desc the desc to set
   */
  public HeaderInsertRow setDesc(String desc) {
    this.desc = desc;
    return this;
  }
  /**
   * @return the desc
   */
  public String getDesc() {
    return desc;
  }
  /**
   * @param name the name to set
   */
  public HeaderInsertRow setName(String name) {
    this.name = name;
    return this;
  }
  /**
   * @return the name
   */
  public String getName() {
    return name;
  }
}
