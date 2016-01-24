/*
 * Copyright 2008 Netflix, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var OAuth;if(OAuth==null)OAuth={};OAuth.setProperties=function setProperties(into,from){if(into!=null&&from!=null){for(var key in from){into[key]=from[key];}}
return into;}
OAuth.setProperties(OAuth,{percentEncode:function percentEncode(s){if(s==null){return"";}
if(s instanceof Array){var e="";for(var i=0;i<s.length;++s){if(e!="")e+='&';e+=OAuth.percentEncode(s[i]);}
return e;}
s=encodeURIComponent(s);s=s.replace(/\!/g,"%21");s=s.replace(/\*/g,"%2A");s=s.replace(/\'/g,"%27");s=s.replace(/\(/g,"%28");s=s.replace(/\)/g,"%29");return s;},decodePercent:function decodePercent(s){if(s!=null){s=s.replace(/\+/g," ");}
return decodeURIComponent(s);},getParameterList:function getParameterList(parameters){if(parameters==null){return[];}
if(typeof parameters!="object"){return OAuth.decodeForm(parameters+"");}
if(parameters instanceof Array){return parameters;}
var list=[];for(var p in parameters){list.push([p,parameters[p]]);}
return list;},getParameterMap:function getParameterMap(parameters){if(parameters==null){return{};}
if(typeof parameters!="object"){return OAuth.getParameterMap(OAuth.decodeForm(parameters+""));}
if(parameters instanceof Array){var map={};for(var p=0;p<parameters.length;++p){var key=parameters[p][0];if(map[key]===undefined){map[key]=parameters[p][1];}}
return map;}
return parameters;},getParameter:function getParameter(parameters,name){if(parameters instanceof Array){for(var p=0;p<parameters.length;++p){if(parameters[p][0]==name){return parameters[p][1];}}}else{return OAuth.getParameterMap(parameters)[name];}
return null;},formEncode:function formEncode(parameters){var form="";var list=OAuth.getParameterList(parameters);for(var p=0;p<list.length;++p){var value=list[p][1];if(value==null)value="";if(form!="")form+='&';form+=OAuth.percentEncode(list[p][0])+'='+OAuth.percentEncode(value);}
return form;},decodeForm:function decodeForm(form){var list=[];var nvps=form.split('&');for(var n=0;n<nvps.length;++n){var nvp=nvps[n];if(nvp==""){continue;}
var equals=nvp.indexOf('=');var name;var value;if(equals<0){name=OAuth.decodePercent(nvp);value=null;}else{name=OAuth.decodePercent(nvp.substring(0,equals));value=OAuth.decodePercent(nvp.substring(equals+1));}
list.push([name,value]);}
return list;},setParameter:function setParameter(message,name,value){var parameters=message.parameters;if(parameters instanceof Array){for(var p=0;p<parameters.length;++p){if(parameters[p][0]==name){if(value===undefined){parameters.splice(p,1);}else{parameters[p][1]=value;value=undefined;}}}
if(value!==undefined){parameters.push([name,value]);}}else{parameters=OAuth.getParameterMap(parameters);parameters[name]=value;message.parameters=parameters;}},setParameters:function setParameters(message,parameters){var list=OAuth.getParameterList(parameters);for(var i=0;i<list.length;++i){OAuth.setParameter(message,list[i][0],list[i][1]);}},completeRequest:function completeRequest(message,accessor){if(message.method==null){message.method="GET";}
var map=OAuth.getParameterMap(message.parameters);if(map.oauth_consumer_key==null){OAuth.setParameter(message,"oauth_consumer_key",accessor.consumerKey||"");}
if(map.oauth_token==null&&accessor.token!=null){OAuth.setParameter(message,"oauth_token",accessor.token);}
if(map.oauth_version==null){OAuth.setParameter(message,"oauth_version","1.0");}
if(map.oauth_timestamp==null){OAuth.setParameter(message,"oauth_timestamp",OAuth.timestamp());}
if(map.oauth_nonce==null){OAuth.setParameter(message,"oauth_nonce",OAuth.nonce(6));}
OAuth.SignatureMethod.sign(message,accessor);},setTimestampAndNonce:function setTimestampAndNonce(message){OAuth.setParameter(message,"oauth_timestamp",OAuth.timestamp());OAuth.setParameter(message,"oauth_nonce",OAuth.nonce(6));},addToURL:function addToURL(url,parameters){newURL=url;if(parameters!=null){var toAdd=OAuth.formEncode(parameters);if(toAdd.length>0){var q=url.indexOf('?');if(q<0)newURL+='?';else newURL+='&';newURL+=toAdd;}}
return newURL;},getAuthorizationHeader:function getAuthorizationHeader(realm,parameters){var header='OAuth realm="'+OAuth.percentEncode(realm)+'"';var list=OAuth.getParameterList(parameters);for(var p=0;p<list.length;++p){var parameter=list[p];var name=parameter[0];if(name.indexOf("oauth_")==0){header+=','+OAuth.percentEncode(name)+'="'+OAuth.percentEncode(parameter[1])+'"';}}
return header;},correctTimestampFromSrc:function correctTimestampFromSrc(parameterName){parameterName=parameterName||"oauth_timestamp";var scripts=document.getElementsByTagName('script');if(scripts==null||!scripts.length)return;var src=scripts[scripts.length-1].src;if(!src)return;var q=src.indexOf("?");if(q<0)return;parameters=OAuth.getParameterMap(OAuth.decodeForm(src.substring(q+1)));var t=parameters[parameterName];if(t==null)return;OAuth.correctTimestamp(t);},correctTimestamp:function correctTimestamp(timestamp){OAuth.timeCorrectionMsec=(timestamp*1000)-(new Date()).getTime();},timeCorrectionMsec:0,timestamp:function timestamp(){var t=(new Date()).getTime()+OAuth.timeCorrectionMsec;return Math.floor(t/1000);},nonce:function nonce(length){var chars=OAuth.nonce.CHARS;var result="";for(var i=0;i<length;++i){var rnum=Math.floor(Math.random()*chars.length);result+=chars.substring(rnum,rnum+1);}
return result;}});OAuth.nonce.CHARS="0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";OAuth.declareClass=function declareClass(parent,name,newConstructor){var previous=parent[name];parent[name]=newConstructor;if(newConstructor!=null&&previous!=null){for(var key in previous){if(key!="prototype"){newConstructor[key]=previous[key];}}}
return newConstructor;}
OAuth.declareClass(OAuth,"SignatureMethod",function OAuthSignatureMethod(){});OAuth.setProperties(OAuth.SignatureMethod.prototype,{sign:function sign(message){var baseString=OAuth.SignatureMethod.getBaseString(message);var signature=this.getSignature(baseString);OAuth.setParameter(message,"oauth_signature",signature);return signature;},initialize:function initialize(name,accessor){var consumerSecret;if(accessor.accessorSecret!=null&&name.length>9&&name.substring(name.length-9)=="-Accessor")
{consumerSecret=accessor.accessorSecret;}else{consumerSecret=accessor.consumerSecret;}
this.key=OAuth.percentEncode(consumerSecret)+"&"+OAuth.percentEncode(accessor.tokenSecret);}});OAuth.setProperties(OAuth.SignatureMethod,{sign:function sign(message,accessor){var name=OAuth.getParameterMap(message.parameters).oauth_signature_method;if(name==null||name==""){name="HMAC-SHA1";OAuth.setParameter(message,"oauth_signature_method",name);}
OAuth.SignatureMethod.newMethod(name,accessor).sign(message);},newMethod:function newMethod(name,accessor){var impl=OAuth.SignatureMethod.REGISTERED[name];if(impl!=null){var method=new impl();method.initialize(name,accessor);return method;}
var err=new Error("signature_method_rejected");var acceptable="";for(var r in OAuth.SignatureMethod.REGISTERED){if(acceptable!="")acceptable+='&';acceptable+=OAuth.percentEncode(r);}
err.oauth_acceptable_signature_methods=acceptable;throw err;},REGISTERED:{},registerMethodClass:function registerMethodClass(names,classConstructor){for(var n=0;n<names.length;++n){OAuth.SignatureMethod.REGISTERED[names[n]]=classConstructor;}},makeSubclass:function makeSubclass(getSignatureFunction){var superClass=OAuth.SignatureMethod;var subClass=function(){superClass.call(this);};subClass.prototype=new superClass();subClass.prototype.getSignature=getSignatureFunction;subClass.prototype.constructor=subClass;return subClass;},getBaseString:function getBaseString(message){var URL=message.action;var q=URL.indexOf('?');var parameters;if(q<0){parameters=message.parameters;}else{parameters=OAuth.decodeForm(URL.substring(q+1));var toAdd=OAuth.getParameterList(message.parameters);for(var a=0;a<toAdd.length;++a){parameters.push(toAdd[a]);}}
return OAuth.percentEncode(message.method.toUpperCase())+'&'+OAuth.percentEncode(OAuth.SignatureMethod.normalizeUrl(URL))+'&'+OAuth.percentEncode(OAuth.SignatureMethod.normalizeParameters(parameters));},normalizeUrl:function normalizeUrl(url){var uri=OAuth.SignatureMethod.parseUri(url);var scheme=uri.protocol.toLowerCase();var authority=uri.authority.toLowerCase();var dropPort=(scheme=="http"&&uri.port==80)||(scheme=="https"&&uri.port==443);if(dropPort){var index=authority.lastIndexOf(":");if(index>=0){authority=authority.substring(0,index);}}
var path=uri.path;if(!path){path="/";}
return scheme+"://"+authority+path;},parseUri:function parseUri(str){var o={key:["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],parser:{strict:/^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@\/]*):?([^:@\/]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/}};var m=o.parser.strict.exec(str);var uri={};var i=14;while(i--)uri[o.key[i]]=m[i]||"";return uri;},normalizeParameters:function normalizeParameters(parameters){if(parameters==null){return"";}
var list=OAuth.getParameterList(parameters);var sortable=[];for(var p=0;p<list.length;++p){var nvp=list[p];if(nvp[0]!="oauth_signature"){sortable.push([OAuth.percentEncode(nvp[0])+" "+OAuth.percentEncode(nvp[1]),nvp]);}}
sortable.sort(function(a,b){if(a[0]<b[0])return-1;if(a[0]>b[0])return 1;return 0;});var sorted=[];for(var s=0;s<sortable.length;++s){sorted.push(sortable[s][1]);}
return OAuth.formEncode(sorted);}});OAuth.SignatureMethod.registerMethodClass(["PLAINTEXT","PLAINTEXT-Accessor"],OAuth.SignatureMethod.makeSubclass(function getSignature(baseString){return this.key;}));OAuth.SignatureMethod.registerMethodClass(["HMAC-SHA1","HMAC-SHA1-Accessor"],OAuth.SignatureMethod.makeSubclass(function getSignature(baseString){b64pad='=';var signature=b64_hmac_sha1(this.key,baseString);return signature;}));try{OAuth.correctTimestampFromSrc();}catch(e){}