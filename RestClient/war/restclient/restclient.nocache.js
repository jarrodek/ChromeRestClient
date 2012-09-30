function restclient(){
  var $intern_0 = '', $intern_36 = '" for "gwt:onLoadErrorFn"', $intern_34 = '" for "gwt:onPropertyErrorFn"', $intern_21 = '"><\/script>', $intern_10 = '#', $intern_50 = '.cache.html', $intern_12 = '/', $intern_24 = '//', $intern_47 = '20F171D97F4D4439CA035C5968D73DE8', $intern_48 = '42CDDEE15A7262DF160607F1CBD694AA', $intern_49 = ':', $intern_28 = '::', $intern_58 = '<script defer="defer">restclient.onInjectionDone(\'restclient\')<\/script>', $intern_20 = '<script id="', $intern_31 = '=', $intern_11 = '?', $intern_33 = 'Bad handler "', $intern_57 = 'DOMContentLoaded', $intern_22 = 'SCRIPT', $intern_19 = '__gwt_marker_restclient', $intern_23 = 'base', $intern_15 = 'baseUrl', $intern_4 = 'begin', $intern_3 = 'bootstrap', $intern_14 = 'clear.cache.gif', $intern_30 = 'content', $intern_9 = 'end', $intern_5 = 'gwt.codesvr=', $intern_6 = 'gwt.hosted=', $intern_7 = 'gwt.hybrid', $intern_51 = 'gwt/clean/clean.css', $intern_35 = 'gwt:onLoadErrorFn', $intern_32 = 'gwt:onPropertyErrorFn', $intern_29 = 'gwt:property', $intern_56 = 'head', $intern_45 = 'hosted.html?restclient', $intern_55 = 'href', $intern_37 = 'iframe', $intern_13 = 'img', $intern_41 = 'inside_extension', $intern_38 = "javascript:''", $intern_52 = 'link', $intern_44 = 'loadExternalRefs', $intern_25 = 'meta', $intern_40 = 'moduleRequested', $intern_8 = 'moduleStartup', $intern_26 = 'name', $intern_43 = 'no', $intern_39 = 'position:absolute;width:0;height:0;border:none', $intern_53 = 'rel', $intern_1 = 'restclient', $intern_17 = 'restclient.nocache.js', $intern_27 = 'restclient::', $intern_16 = 'script', $intern_46 = 'selectingPermutation', $intern_2 = 'startup', $intern_54 = 'stylesheet', $intern_18 = 'undefined', $intern_42 = 'yes';
  var $wnd = window, $doc = document, $stats = $wnd.__gwtStatsEvent?function(a){
    return $wnd.__gwtStatsEvent(a);
  }
  :null, $sessionId = $wnd.__gwtStatsSessionId?$wnd.__gwtStatsSessionId:null, scriptsDone, loadDone, bodyDone, base = $intern_0, metaProps = {}, values = [], providers = [], answers = [], softPermutationId = 0, onLoadErrorFunc, propertyErrorFunc;
  $stats && $stats({moduleName:$intern_1, sessionId:$sessionId, subSystem:$intern_2, evtGroup:$intern_3, millis:(new Date).getTime(), type:$intern_4});
  if (!$wnd.__gwt_stylesLoaded) {
    $wnd.__gwt_stylesLoaded = {};
  }
  if (!$wnd.__gwt_scriptsLoaded) {
    $wnd.__gwt_scriptsLoaded = {};
  }
  function isHostedMode(){
    var result = false;
    try {
      var query = $wnd.location.search;
      return (query.indexOf($intern_5) != -1 || (query.indexOf($intern_6) != -1 || $wnd.external && $wnd.external.gwtOnLoad)) && query.indexOf($intern_7) == -1;
    }
     catch (e) {
    }
    isHostedMode = function(){
      return result;
    }
    ;
    return result;
  }

  function maybeStartModule(){
    if (scriptsDone && loadDone) {
      var iframe = $doc.getElementById($intern_1);
      var frameWnd = iframe.contentWindow;
      if (isHostedMode()) {
        frameWnd.__gwt_getProperty = function(name){
          return computePropValue(name);
        }
        ;
      }
      restclient = null;
      frameWnd.gwtOnLoad(onLoadErrorFunc, $intern_1, base, softPermutationId);
      $stats && $stats({moduleName:$intern_1, sessionId:$sessionId, subSystem:$intern_2, evtGroup:$intern_8, millis:(new Date).getTime(), type:$intern_9});
    }
  }

  function computeScriptBase(){
    function getDirectoryOfFile(path){
      var hashIndex = path.lastIndexOf($intern_10);
      if (hashIndex == -1) {
        hashIndex = path.length;
      }
      var queryIndex = path.indexOf($intern_11);
      if (queryIndex == -1) {
        queryIndex = path.length;
      }
      var slashIndex = path.lastIndexOf($intern_12, Math.min(queryIndex, hashIndex));
      return slashIndex >= 0?path.substring(0, slashIndex + 1):$intern_0;
    }

    function ensureAbsoluteUrl(url){
      if (url.match(/^\w+:\/\//)) {
      }
       else {
        var img = $doc.createElement($intern_13);
        img.src = url + $intern_14;
        url = getDirectoryOfFile(img.src);
      }
      return url;
    }

    function tryMetaTag(){
      var metaVal = __gwt_getMetaProperty($intern_15);
      if (metaVal != null) {
        return metaVal;
      }
      return $intern_0;
    }

    function tryNocacheJsTag(){
      var scriptTags = $doc.getElementsByTagName($intern_16);
      for (var i = 0; i < scriptTags.length; ++i) {
        if (scriptTags[i].src.indexOf($intern_17) != -1) {
          return getDirectoryOfFile(scriptTags[i].src);
        }
      }
      return $intern_0;
    }

    function tryMarkerScript(){
      var thisScript;
      if (typeof isBodyLoaded == $intern_18 || !isBodyLoaded()) {
        var markerId = $intern_19;
        var markerScript;
        $doc.write($intern_20 + markerId + $intern_21);
        markerScript = $doc.getElementById(markerId);
        thisScript = markerScript && markerScript.previousSibling;
        while (thisScript && thisScript.tagName != $intern_22) {
          thisScript = thisScript.previousSibling;
        }
        if (markerScript) {
          markerScript.parentNode.removeChild(markerScript);
        }
        if (thisScript && thisScript.src) {
          return getDirectoryOfFile(thisScript.src);
        }
      }
      return $intern_0;
    }

    function tryBaseTag(){
      var baseElements = $doc.getElementsByTagName($intern_23);
      if (baseElements.length > 0) {
        return baseElements[baseElements.length - 1].href;
      }
      return $intern_0;
    }

    function isLocationOk(){
      var loc = $doc.location;
      return loc.href == loc.protocol + $intern_24 + loc.host + loc.pathname + loc.search + loc.hash;
    }

    var tempBase = tryMetaTag();
    if (tempBase == $intern_0) {
      tempBase = tryNocacheJsTag();
    }
    if (tempBase == $intern_0) {
      tempBase = tryMarkerScript();
    }
    if (tempBase == $intern_0) {
      tempBase = tryBaseTag();
    }
    if (tempBase == $intern_0 && isLocationOk()) {
      tempBase = getDirectoryOfFile($doc.location.href);
    }
    tempBase = ensureAbsoluteUrl(tempBase);
    base = tempBase;
    return tempBase;
  }

  function processMetas(){
    var metas = document.getElementsByTagName($intern_25);
    for (var i = 0, n = metas.length; i < n; ++i) {
      var meta = metas[i], name = meta.getAttribute($intern_26), content;
      if (name) {
        name = name.replace($intern_27, $intern_0);
        if (name.indexOf($intern_28) >= 0) {
          continue;
        }
        if (name == $intern_29) {
          content = meta.getAttribute($intern_30);
          if (content) {
            var value, eq = content.indexOf($intern_31);
            if (eq >= 0) {
              name = content.substring(0, eq);
              value = content.substring(eq + 1);
            }
             else {
              name = content;
              value = $intern_0;
            }
            metaProps[name] = value;
          }
        }
         else if (name == $intern_32) {
          content = meta.getAttribute($intern_30);
          if (content) {
            try {
              propertyErrorFunc = eval(content);
            }
             catch (e) {
              alert($intern_33 + content + $intern_34);
            }
          }
        }
         else if (name == $intern_35) {
          content = meta.getAttribute($intern_30);
          if (content) {
            try {
              onLoadErrorFunc = eval(content);
            }
             catch (e) {
              alert($intern_33 + content + $intern_36);
            }
          }
        }
      }
    }
  }

  function __gwt_getMetaProperty(name){
    var value = metaProps[name];
    return value == null?null:value;
  }

  function unflattenKeylistIntoAnswers(propValArray, value){
    var answer = answers;
    for (var i = 0, n = propValArray.length - 1; i < n; ++i) {
      answer = answer[propValArray[i]] || (answer[propValArray[i]] = []);
    }
    answer[propValArray[n]] = value;
  }

  function computePropValue(propName){
    var value = providers[propName](), allowedValuesMap = values[propName];
    if (value in allowedValuesMap) {
      return value;
    }
    var allowedValuesList = [];
    for (var k in allowedValuesMap) {
      allowedValuesList[allowedValuesMap[k]] = k;
    }
    if (propertyErrorFunc) {
      propertyErrorFunc(propName, allowedValuesList, value);
    }
    throw null;
  }

  var frameInjected;
  function maybeInjectFrame(){
    if (!frameInjected) {
      frameInjected = true;
      var iframe = $doc.createElement($intern_37);
      iframe.src = $intern_38;
      iframe.id = $intern_1;
      iframe.style.cssText = $intern_39;
      iframe.tabIndex = -1;
      $doc.body.appendChild(iframe);
      $stats && $stats({moduleName:$intern_1, sessionId:$sessionId, subSystem:$intern_2, evtGroup:$intern_8, millis:(new Date).getTime(), type:$intern_40});
      iframe.contentWindow.location.replace(base + initialHtml);
    }
  }

  providers[$intern_41] = function(){
    {
      return chrome && typeof chrome.webRequest != $intern_18?$intern_42:$intern_43;
    }
  }
  ;
  values[$intern_41] = {no:0, yes:1};
  restclient.onScriptLoad = function(){
    if (frameInjected) {
      loadDone = true;
      maybeStartModule();
    }
  }
  ;
  restclient.onInjectionDone = function(){
    scriptsDone = true;
    $stats && $stats({moduleName:$intern_1, sessionId:$sessionId, subSystem:$intern_2, evtGroup:$intern_44, millis:(new Date).getTime(), type:$intern_9});
    maybeStartModule();
  }
  ;
  processMetas();
  computeScriptBase();
  var strongName;
  var initialHtml;
  if (isHostedMode()) {
    if ($wnd.external && ($wnd.external.initModule && $wnd.external.initModule($intern_1))) {
      $wnd.location.reload();
      return;
    }
    initialHtml = $intern_45;
    strongName = $intern_0;
  }
  $stats && $stats({moduleName:$intern_1, sessionId:$sessionId, subSystem:$intern_2, evtGroup:$intern_3, millis:(new Date).getTime(), type:$intern_46});
  if (!isHostedMode()) {
    try {
      unflattenKeylistIntoAnswers([$intern_42], $intern_47);
      unflattenKeylistIntoAnswers([$intern_43], $intern_48);
      strongName = answers[computePropValue($intern_41)];
      var idx = strongName.indexOf($intern_49);
      if (idx != -1) {
        softPermutationId = Number(strongName.substring(idx + 1));
        strongName = strongName.substring(0, idx);
      }
      initialHtml = strongName + $intern_50;
    }
     catch (e) {
      return;
    }
  }
  var onBodyDoneTimerId;
  function onBodyDone(){
    if (!bodyDone) {
      bodyDone = true;
      if (!__gwt_stylesLoaded[$intern_51]) {
        var l = $doc.createElement($intern_52);
        __gwt_stylesLoaded[$intern_51] = l;
        l.setAttribute($intern_53, $intern_54);
        l.setAttribute($intern_55, base + $intern_51);
        $doc.getElementsByTagName($intern_56)[0].appendChild(l);
      }
      maybeStartModule();
      if ($doc.removeEventListener) {
        $doc.removeEventListener($intern_57, onBodyDone, false);
      }
      if (onBodyDoneTimerId) {
        clearInterval(onBodyDoneTimerId);
      }
    }
  }

  if ($doc.addEventListener) {
    $doc.addEventListener($intern_57, function(){
      maybeInjectFrame();
      onBodyDone();
    }
    , false);
  }
  var onBodyDoneTimerId = setInterval(function(){
    if (/loaded|complete/.test($doc.readyState)) {
      maybeInjectFrame();
      onBodyDone();
    }
  }
  , 50);
  $stats && $stats({moduleName:$intern_1, sessionId:$sessionId, subSystem:$intern_2, evtGroup:$intern_3, millis:(new Date).getTime(), type:$intern_9});
  $stats && $stats({moduleName:$intern_1, sessionId:$sessionId, subSystem:$intern_2, evtGroup:$intern_44, millis:(new Date).getTime(), type:$intern_4});
  $doc.write($intern_58);
}

restclient();
