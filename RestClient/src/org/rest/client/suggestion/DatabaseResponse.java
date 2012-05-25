package org.rest.client.suggestion;

import com.google.gwt.user.client.ui.SuggestOracle.Suggestion;

import java.util.List;
/**
 * Class to hold a response from database request.
 */
public interface DatabaseResponse {
  
  /**
   * Get the query string that was sent to the server.
   * 
   * @return The query.
   */
  public String getQuery();
  
  /**
   * Does the response include all possible suggestions for the query.
   * 
   * @return True or false.
   */
  public boolean isComplete();
  
  /**
   * Filter the suggestions we got back from the storage.
   * 
   * @param query The query string.
   * @param limit The number of suggestions to return.
   * @return The suggestions.
   */
  public List<Suggestion> filter(String query, int limit);
}
