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
package org.rest.client.mvp;

import org.rest.client.place.AboutPlace;
import org.rest.client.place.HistoryPlace;
import org.rest.client.place.ImportExportPlace;
import org.rest.client.place.RequestPlace;
import org.rest.client.place.SavedPlace;
import org.rest.client.place.SettingsPlace;
import org.rest.client.place.ShortcutPlace;
import org.rest.client.place.SocketPlace;

import com.google.gwt.place.shared.PlaceHistoryMapper;
import com.google.gwt.place.shared.WithTokenizers;

/**
 * PlaceHistoryMapper interface is used to attach all places which the
 * PlaceHistoryHandler should be aware of. This is done via the @WithTokenizers
 * annotation or by extending PlaceHistoryMapperWithFactory and creating a
 * separate TokenizerFactory.
 */
@WithTokenizers({ AboutPlace.Tokenizer.class, RequestPlace.Tokenizer.class,
		SettingsPlace.Tokenizer.class, ShortcutPlace.Tokenizer.class,
		HistoryPlace.Tokenizer.class, SavedPlace.Tokenizer.class,
		ImportExportPlace.Tokenizer.class, SocketPlace.Tokenizer.class })
public interface AppPlaceHistoryMapper extends PlaceHistoryMapper {

}
