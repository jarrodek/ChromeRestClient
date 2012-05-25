package org.rest.client.mvp;

import com.google.gwt.place.impl.AbstractPlaceHistoryMapper;
import org.rest.client.mvp.AppPlaceHistoryMapper;
import com.google.gwt.place.shared.Place;
import com.google.gwt.place.shared.PlaceTokenizer;
import com.google.gwt.place.impl.AbstractPlaceHistoryMapper.PrefixAndToken;
import com.google.gwt.core.client.GWT;

public class AppPlaceHistoryMapperImpl extends AbstractPlaceHistoryMapper<Void> implements AppPlaceHistoryMapper {
  
  protected PrefixAndToken getPrefixAndToken(Place newPlace) {
    return null;
  }
  
  protected PlaceTokenizer<?> getTokenizer(String prefix) {
    return null;
  }

}
