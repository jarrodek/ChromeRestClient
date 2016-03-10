(function() { 'use strict';var h,aa=aa||{},k=this,m=function(a){return void 0!==a},ba=function(){},ca=function(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&
"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";else if("function"==b&&"undefined"==typeof a.call)return"object";return b},n=function(a){return"array"==ca(a)},da=function(a){var b=ca(a);return"array"==b||"object"==b&&"number"==typeof a.length},p=function(a){return"string"==typeof a},ea=function(a){return"number"==typeof a},q=function(a){return"function"==ca(a)},r=function(a){var b=typeof a;return"object"==b&&null!=a||"function"==b},fa=
function(a,b,c){return a.call.apply(a.bind,arguments)},ga=function(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}},t=function(a,b,c){t=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?fa:ga;return t.apply(null,arguments)},ha=function(a,b){var c=Array.prototype.slice.call(arguments,
1);return function(){var b=c.slice();b.push.apply(b,arguments);return a.apply(this,b)}},u=Date.now||function(){return+new Date},v=function(a,b){var c=a.split("."),d=k;c[0]in d||!d.execScript||d.execScript("var "+c[0]);for(var e;c.length&&(e=c.shift());)!c.length&&m(b)?d[e]=b:d=d[e]?d[e]:d[e]={}},w=function(a,b){function c(){}c.prototype=b.prototype;a.P=b.prototype;a.prototype=new c;a.ie=function(a,c,f){for(var g=Array(arguments.length-2),l=2;l<arguments.length;l++)g[l-2]=arguments[l];return b.prototype[c].apply(a,
g)}};Function.prototype.bind=Function.prototype.bind||function(a,b){if(1<arguments.length){var c=Array.prototype.slice.call(arguments,1);c.unshift(this,a);return t.apply(null,c)}return t(this,a)};var x=function(a){if(Error.captureStackTrace)Error.captureStackTrace(this,x);else{var b=Error().stack;b&&(this.stack=b)}a&&(this.message=String(a))};w(x,Error);x.prototype.name="CustomError";var ia=String.prototype.trim?function(a){return a.trim()}:function(a){return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g,"")},ja=function(a,b){return a<b?-1:a>b?1:0};var y=Array.prototype,ka=y.indexOf?function(a,b,c){return y.indexOf.call(a,b,c)}:function(a,b,c){c=null==c?0:0>c?Math.max(0,a.length+c):c;if(p(a))return p(b)&&1==b.length?a.indexOf(b,c):-1;for(;c<a.length;c++)if(c in a&&a[c]===b)return c;return-1},la=y.forEach?function(a,b,c){y.forEach.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=p(a)?a.split(""):a,f=0;f<d;f++)f in e&&b.call(c,e[f],f,a)},ma=y.some?function(a,b,c){return y.some.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=p(a)?a.split(""):
a,f=0;f<d;f++)if(f in e&&b.call(c,e[f],f,a))return!0;return!1},na=y.every?function(a,b,c){return y.every.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=p(a)?a.split(""):a,f=0;f<d;f++)if(f in e&&!b.call(c,e[f],f,a))return!1;return!0},pa=function(a){var b;a:{b=oa;for(var c=a.length,d=p(a)?a.split(""):a,e=0;e<c;e++)if(e in d&&b.call(void 0,d[e],e,a)){b=e;break a}b=-1}return 0>b?null:p(a)?a.charAt(b):a[b]},qa=function(a,b){var c=ka(a,b),d;(d=0<=c)&&y.splice.call(a,c,1);return d},ra=function(a){return y.concat.apply(y,
arguments)},sa=function(a,b,c){return 2>=arguments.length?y.slice.call(a,b):y.slice.call(a,b,c)};var ta="StopIteration"in k?k.StopIteration:Error("StopIteration"),ua=function(){};ua.prototype.next=function(){throw ta;};ua.prototype.Sb=function(){return this};var va=function(a,b,c){for(var d in a)b.call(c,a[d],d,a)},wa=function(a){var b=[],c=0,d;for(d in a)b[c++]=a[d];return b},xa=function(a){var b=[],c=0,d;for(d in a)b[c++]=d;return b},ya=function(a,b){var c;a:{for(c in a)if(b.call(void 0,a[c],c,a))break a;c=void 0}return c&&a[c]},za="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" "),Aa=function(a,b){for(var c,d,e=1;e<arguments.length;e++){d=arguments[e];for(c in d)a[c]=d[c];for(var f=0;f<za.length;f++)c=
za[f],Object.prototype.hasOwnProperty.call(d,c)&&(a[c]=d[c])}},Ba=function(a){var b=arguments.length;if(1==b&&n(arguments[0]))return Ba.apply(null,arguments[0]);for(var c={},d=0;d<b;d++)c[arguments[d]]=!0;return c};var z=function(a,b){this.p={};this.b=[];this.Ja=this.j=0;var c=arguments.length;if(1<c){if(c%2)throw Error("Uneven number of arguments");for(var d=0;d<c;d+=2)this.set(arguments[d],arguments[d+1])}else a&&this.ha(a)};z.prototype.t=function(){Ca(this);for(var a=[],b=0;b<this.b.length;b++)a.push(this.p[this.b[b]]);return a};z.prototype.H=function(){Ca(this);return this.b.concat()};z.prototype.T=function(a){return A(this.p,a)};
z.prototype.remove=function(a){return A(this.p,a)?(delete this.p[a],this.j--,this.Ja++,this.b.length>2*this.j&&Ca(this),!0):!1};var Ca=function(a){if(a.j!=a.b.length){for(var b=0,c=0;b<a.b.length;){var d=a.b[b];A(a.p,d)&&(a.b[c++]=d);b++}a.b.length=c}if(a.j!=a.b.length){for(var e={},c=b=0;b<a.b.length;)d=a.b[b],A(e,d)||(a.b[c++]=d,e[d]=1),b++;a.b.length=c}};h=z.prototype;h.get=function(a,b){return A(this.p,a)?this.p[a]:b};
h.set=function(a,b){A(this.p,a)||(this.j++,this.b.push(a),this.Ja++);this.p[a]=b};h.ha=function(a){var b;a instanceof z?(b=a.H(),a=a.t()):(b=xa(a),a=wa(a));for(var c=0;c<b.length;c++)this.set(b[c],a[c])};h.forEach=function(a,b){for(var c=this.H(),d=0;d<c.length;d++){var e=c[d],f=this.get(e);a.call(b,f,e,this)}};h.clone=function(){return new z(this)};h.Nb=function(){Ca(this);for(var a={},b=0;b<this.b.length;b++){var c=this.b[b];a[c]=this.p[c]}return a};
h.Sb=function(a){Ca(this);var b=0,c=this.b,d=this.p,e=this.Ja,f=this,g=new ua;g.next=function(){for(;;){if(e!=f.Ja)throw Error("The map has changed since the iterator was created");if(b>=c.length)throw ta;var g=c[b++];return a?g:d[g]}};return g};var A=function(a,b){return Object.prototype.hasOwnProperty.call(a,b)};var Da,Ea,Fa={id:"hitType",name:"t",valueType:"text",maxLength:void 0,defaultValue:void 0},Ga={id:"sessionControl",name:"sc",valueType:"text",maxLength:void 0,defaultValue:void 0},Ha={id:"description",name:"cd",valueType:"text",maxLength:2048,defaultValue:void 0},Ia={id:"eventCategory",name:"ec",valueType:"text",maxLength:150,defaultValue:void 0},Ja={id:"eventAction",name:"ea",valueType:"text",maxLength:500,defaultValue:void 0},Ka={id:"eventLabel",name:"el",valueType:"text",maxLength:500,defaultValue:void 0},
La={id:"eventValue",name:"ev",valueType:"integer",maxLength:void 0,defaultValue:void 0},Ma={zd:Fa,$c:{id:"anonymizeIp",name:"aip",valueType:"boolean",maxLength:void 0,defaultValue:void 0},Kd:{id:"queueTime",name:"qt",valueType:"integer",maxLength:void 0,defaultValue:void 0},fd:{id:"cacheBuster",name:"z",valueType:"text",maxLength:void 0,defaultValue:void 0},Qd:Ga,Rd:{id:"sessionGroup",name:"sg",valueType:"text",maxLength:void 0,defaultValue:void 0},ge:{id:"userId",name:"uid",valueType:"text",maxLength:void 0,
defaultValue:void 0},Hd:{id:"nonInteraction",name:"ni",valueType:"boolean",maxLength:void 0,defaultValue:void 0},qd:Ha,$d:{id:"title",name:"dt",valueType:"text",maxLength:1500,defaultValue:void 0},bd:{id:"appId",name:"aid",valueType:"text",maxLength:150,defaultValue:void 0},cd:{id:"appInstallerId",name:"aiid",valueType:"text",maxLength:150,defaultValue:void 0},td:Ia,sd:Ja,ud:Ka,vd:La,Td:{id:"socialNetwork",name:"sn",valueType:"text",maxLength:50,defaultValue:void 0},Sd:{id:"socialAction",name:"sa",
valueType:"text",maxLength:50,defaultValue:void 0},Ud:{id:"socialTarget",name:"st",valueType:"text",maxLength:2048,defaultValue:void 0},ce:{id:"transactionId",name:"ti",valueType:"text",maxLength:500,defaultValue:void 0},be:{id:"transactionAffiliation",name:"ta",valueType:"text",maxLength:500,defaultValue:void 0},de:{id:"transactionRevenue",name:"tr",valueType:"currency",maxLength:void 0,defaultValue:void 0},ee:{id:"transactionShipping",name:"ts",valueType:"currency",maxLength:void 0,defaultValue:void 0},
fe:{id:"transactionTax",name:"tt",valueType:"currency",maxLength:void 0,defaultValue:void 0},od:{id:"currencyCode",name:"cu",valueType:"text",maxLength:10,defaultValue:void 0},Dd:{id:"itemPrice",name:"ip",valueType:"currency",maxLength:void 0,defaultValue:void 0},Ed:{id:"itemQuantity",name:"iq",valueType:"integer",maxLength:void 0,defaultValue:void 0},Bd:{id:"itemCode",name:"ic",valueType:"text",maxLength:500,defaultValue:void 0},Cd:{id:"itemName",name:"in",valueType:"text",maxLength:500,defaultValue:void 0},
Ad:{id:"itemCategory",name:"iv",valueType:"text",maxLength:500,defaultValue:void 0},md:{id:"campaignSource",name:"cs",valueType:"text",maxLength:100,defaultValue:void 0},kd:{id:"campaignMedium",name:"cm",valueType:"text",maxLength:50,defaultValue:void 0},ld:{id:"campaignName",name:"cn",valueType:"text",maxLength:100,defaultValue:void 0},jd:{id:"campaignKeyword",name:"ck",valueType:"text",maxLength:500,defaultValue:void 0},gd:{id:"campaignContent",name:"cc",valueType:"text",maxLength:500,defaultValue:void 0},
hd:{id:"campaignId",name:"ci",valueType:"text",maxLength:100,defaultValue:void 0},yd:{id:"gclid",name:"gclid",valueType:"text",maxLength:void 0,defaultValue:void 0},pd:{id:"dclid",name:"dclid",valueType:"text",maxLength:void 0,defaultValue:void 0},Jd:{id:"pageLoadTime",name:"plt",valueType:"integer",maxLength:void 0,defaultValue:void 0},rd:{id:"dnsTime",name:"dns",valueType:"integer",maxLength:void 0,defaultValue:void 0},Vd:{id:"tcpConnectTime",name:"tcp",valueType:"integer",maxLength:void 0,defaultValue:void 0},
Pd:{id:"serverResponseTime",name:"srt",valueType:"integer",maxLength:void 0,defaultValue:void 0},Id:{id:"pageDownloadTime",name:"pdt",valueType:"integer",maxLength:void 0,defaultValue:void 0},Ld:{id:"redirectResponseTime",name:"rrt",valueType:"integer",maxLength:void 0,defaultValue:void 0},Wd:{id:"timingCategory",name:"utc",valueType:"text",maxLength:150,defaultValue:void 0},Zd:{id:"timingVar",name:"utv",valueType:"text",maxLength:500,defaultValue:void 0},Yd:{id:"timingValue",name:"utt",valueType:"integer",
maxLength:void 0,defaultValue:void 0},Xd:{id:"timingLabel",name:"utl",valueType:"text",maxLength:500,defaultValue:void 0},wd:{id:"exDescription",name:"exd",valueType:"text",maxLength:150,defaultValue:void 0},xd:{id:"exFatal",name:"exf",valueType:"boolean",maxLength:void 0,defaultValue:"1"}},Na=function(a){if(1>a||200<a)throw Error("Expected dimension index range 1-200, but was : "+a);return{id:"dimension"+a,name:"cd"+a,valueType:"text",maxLength:150,defaultValue:void 0}},Oa=function(a){if(1>a||200<
a)throw Error("Expected metric index range 1-200, but was : "+a);return{id:"metric"+a,name:"cm"+a,valueType:"integer",maxLength:void 0,defaultValue:void 0}};var Pa=function(a){if(1>a)return"0";if(3>a)return"1-2";a=Math.floor(Math.log(a-1)/Math.log(2));return Math.pow(2,a)+1+"-"+Math.pow(2,a+1)},Qa=function(a,b){for(var c=0,d=a.length-1,e=0;c<=d;){var f=Math.floor((c+d)/2),e=a[f];if(b<=e){d=0==f?0:a[f-1];if(b>d)return(d+1).toString()+"-"+e.toString();d=f-1}else if(b>e){if(f>=a.length-1)return(a[a.length-1]+1).toString()+"+";c=f+1}}return"<= 0"};var B=function(){this.gb=[]},Ra=function(){return new B};h=B.prototype;h.when=function(a){this.gb.push(a);return this};h.Rb=function(a){var b=arguments;this.when(function(a){return 0<=ka(b,a.ub())});return this};h.Yc=function(a,b){var c=sa(arguments,1);this.when(function(b){b=b.V().get(a);return 0<=ka(c,b)});return this};h.mb=function(a,b){if(r(this.e))throw Error("Filter has already been set.");this.e=r(b)?t(a,b):a;return this};
h.ia=function(){if(0==this.gb.length)throw Error("Must specify at least one predicate using #when or a helper method.");if(!r(this.e))throw Error("Must specify a delegate filter using #applyFilter.");return t(function(a){na(this.gb,function(b){return b(a)})&&this.e(a)},this)};var C=function(){this.lb=!1;this.zb="";this.Kb=!1;this.ya=null};C.prototype.Wb=function(a){this.lb=!0;this.zb=a||" - ";return this};C.prototype.Sc=function(){this.Kb=!0;return this};C.prototype.Dc=function(){return Sa(this,Pa)};C.prototype.Ec=function(a){return Sa(this,ha(Qa,a))};
var Sa=function(a,b){if(null!=a.ya)throw Error("LabelerBuilder: Only one labeling strategy may be used.");a.ya=t(function(a){var d=a.V().get(La),e=a.V().get(Ka);ea(d)&&(d=b(d),null!=e&&this.lb&&(d=e+this.zb+d),a.V().set(Ka,d))},a);return a};C.prototype.ia=function(){if(null==this.ya)throw Error("LabelerBuilder: a labeling strategy must be specified prior to calling build().");return Ra().Rb("event").mb(t(function(a){this.ya(a);this.Kb&&a.V().remove(La)},this)).ia()};var Ua=function(a,b){var c=Array.prototype.slice.call(arguments),d=c.shift();if("undefined"==typeof d)throw Error("[goog.string.format] Template required");return d.replace(/%([0\-\ \+]*)(\d+)?(\.(\d+))?([%sfdiu])/g,function(a,b,d,l,D,N,Y,Z){if("%"==N)return"%";var Nb=c.shift();if("undefined"==typeof Nb)throw Error("[goog.string.format] Not enough arguments");arguments[0]=Nb;return Ta[N].apply(null,arguments)})},Ta={s:function(a,b,c){return isNaN(c)||""==c||a.length>=c?a:a=-1<b.indexOf("-",0)?a+Array(c-
a.length+1).join(" "):Array(c-a.length+1).join(" ")+a},f:function(a,b,c,d,e){d=a.toString();isNaN(e)||""==e||(d=parseFloat(a).toFixed(e));var f;f=0>a?"-":0<=b.indexOf("+")?"+":0<=b.indexOf(" ")?" ":"";0<=a&&(d=f+d);if(isNaN(c)||d.length>=c)return d;d=isNaN(e)?Math.abs(a).toString():Math.abs(a).toFixed(e);a=c-d.length-f.length;return d=0<=b.indexOf("-",0)?f+d+Array(a+1).join(" "):f+Array(a+1).join(0<=b.indexOf("0",0)?"0":" ")+d},d:function(a,b,c,d,e,f,g,l){return Ta.f(parseInt(a,10),b,c,d,0,f,g,l)}};
Ta.i=Ta.d;Ta.u=Ta.d;var Va=function(a){if("function"==typeof a.t)return a.t();if(p(a))return a.split("");if(da(a)){for(var b=[],c=a.length,d=0;d<c;d++)b.push(a[d]);return b}return wa(a)},Wa=function(a,b){if("function"==typeof a.forEach)a.forEach(b,void 0);else if(da(a)||p(a))la(a,b,void 0);else{var c;if("function"==typeof a.H)c=a.H();else if("function"!=typeof a.t)if(da(a)||p(a)){c=[];for(var d=a.length,e=0;e<d;e++)c.push(e)}else c=xa(a);else c=void 0;for(var d=Va(a),e=d.length,f=0;f<e;f++)b.call(void 0,d[f],c&&c[f],
a)}};var E=function(a){this.w=new z;if(0<arguments.length%2)throw Error("Uneven number of arguments to ParameterMap constructor.");for(var b=arguments,c=0;c<b.length;c+=2)this.set(b[c],b[c+1])};E.prototype.set=function(a,b){if(null==b)throw Error("undefined-or-null value for key: "+a.name);this.w.set(a.name,{key:a,value:b})};E.prototype.remove=function(a){this.w.remove(a.name)};E.prototype.get=function(a){a=this.w.get(a.name,null);return null===a?null:a.value};E.prototype.ha=function(a){this.w.ha(a.w)};
var Xa=function(a,b){la(a.w.t(),function(a){b(a.key,a.value)})};E.prototype.Nb=function(){var a={};Xa(this,function(b,c){a[b.id]=c});return a};E.prototype.clone=function(){var a=new E;a.w=this.w.clone();return a};E.prototype.toString=function(){var a={};Xa(this,function(b,c){a[b.id]=c});return JSON.stringify(a)};var F=function(a){this.e=a};h=F.prototype;h.Yb=function(a){var b=new F(t(this.M,this));b.I=Ia;b.Q=a;return b};h.action=function(a){var b=new F(t(this.M,this));b.I=Ja;b.Q=a;return b};h.label=function(a){var b=new F(t(this.M,this));b.I=Ka;b.Q=a;return b};h.value=function(a){var b=new F(t(this.M,this));b.I=La;b.Q=a;return b};h.fc=function(a){var b=new F(t(this.M,this));b.I=Na(a.index);b.Q=a.value;return b};h.vc=function(a){var b=new F(t(this.M,this));b.I=Oa(a.index);b.Q=a.value;return b};
h.send=function(a){var b=new E;this.M(b);return a.send("event",b)};h.M=function(a){null!=this.I&&null!=this.Q&&!a.w.T(this.I.name)&&a.set(this.I,this.Q);r(this.e)&&this.e(a)};var Ya=new F(ba);var G=function(){this.aa=this.aa;this.Ca=this.Ca};G.prototype.aa=!1;G.prototype.ma=function(){this.aa||(this.aa=!0,this.o())};G.prototype.o=function(){if(this.Ca)for(;this.Ca.length;)this.Ca.shift()()};var Za=function(a,b){this.type=a;this.currentTarget=this.target=b;this.defaultPrevented=this.X=!1;this.Hb=!0};Za.prototype.preventDefault=function(){this.defaultPrevented=!0;this.Hb=!1};var $a=function(a){$a[" "](a);return a};$a[" "]=ba;var H;a:{var ab=k.navigator;if(ab){var bb=ab.userAgent;if(bb){H=bb;break a}}H=""};var cb=function(){return-1!=H.indexOf("Edge")||-1!=H.indexOf("Trident")||-1!=H.indexOf("MSIE")};var I=function(){return-1!=H.indexOf("Edge")};var db=-1!=H.indexOf("Opera")||-1!=H.indexOf("OPR"),J=cb(),eb=-1!=H.indexOf("Gecko")&&!(-1!=H.toLowerCase().indexOf("webkit")&&!I())&&!(-1!=H.indexOf("Trident")||-1!=H.indexOf("MSIE"))&&!I(),fb=-1!=H.toLowerCase().indexOf("webkit")&&!I(),gb=function(){var a=H;if(eb)return/rv\:([^\);]+)(\)|;)/.exec(a);if(J&&I())return/Edge\/([\d\.]+)/.exec(a);if(J)return/\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a);if(fb)return/WebKit\/(\S+)/.exec(a)},hb=function(){var a=k.document;return a?a.documentMode:void 0},ib=
function(){if(db&&k.opera){var a=k.opera.version;return q(a)?a():a}var a="",b=gb();b&&(a=b?b[1]:"");return J&&!I()&&(b=hb(),b>parseFloat(a))?String(b):a}(),jb={},K=function(a){var b;if(!(b=jb[a])){b=0;for(var c=ia(String(ib)).split("."),d=ia(String(a)).split("."),e=Math.max(c.length,d.length),f=0;0==b&&f<e;f++){var g=c[f]||"",l=d[f]||"",D=/(\d*)(\D*)/g,N=/(\d*)(\D*)/g;do{var Y=D.exec(g)||["","",""],Z=N.exec(l)||["","",""];if(0==Y[0].length&&0==Z[0].length)break;b=ja(0==Y[1].length?0:parseInt(Y[1],
10),0==Z[1].length?0:parseInt(Z[1],10))||ja(0==Y[2].length,0==Z[2].length)||ja(Y[2],Z[2])}while(0==b)}b=jb[a]=0<=b}return b},kb=k.document,lb=hb(),mb=!kb||!J||!lb&&I()?void 0:lb||("CSS1Compat"==kb.compatMode?parseInt(ib,10):5);var nb=!J||J&&(I()||9<=mb),ob=J&&!K("9"),pb=!fb||K("528"),qb=eb&&K("1.9b")||J&&K("8")||db&&K("9.5")||fb&&K("528"),rb=eb&&!K("8")||J&&!K("9");var sb=function(a,b){Za.call(this,a?a.type:"");this.relatedTarget=this.currentTarget=this.target=null;this.charCode=this.keyCode=this.button=this.screenY=this.screenX=this.clientY=this.clientX=this.offsetY=this.offsetX=0;this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1;this.sb=this.state=null;if(a){var c=this.type=a.type;this.target=a.target||a.srcElement;this.currentTarget=b;var d=a.relatedTarget;if(d){if(eb){var e;a:{try{$a(d.nodeName);e=!0;break a}catch(f){}e=!1}e||(d=null)}}else"mouseover"==
c?d=a.fromElement:"mouseout"==c&&(d=a.toElement);this.relatedTarget=d;this.offsetX=fb||void 0!==a.offsetX?a.offsetX:a.layerX;this.offsetY=fb||void 0!==a.offsetY?a.offsetY:a.layerY;this.clientX=void 0!==a.clientX?a.clientX:a.pageX;this.clientY=void 0!==a.clientY?a.clientY:a.pageY;this.screenX=a.screenX||0;this.screenY=a.screenY||0;this.button=a.button;this.keyCode=a.keyCode||0;this.charCode=a.charCode||("keypress"==c?a.keyCode:0);this.ctrlKey=a.ctrlKey;this.altKey=a.altKey;this.shiftKey=a.shiftKey;
this.metaKey=a.metaKey;this.state=a.state;this.sb=a;a.defaultPrevented&&this.preventDefault()}};w(sb,Za);sb.prototype.preventDefault=function(){sb.P.preventDefault.call(this);var a=this.sb;if(a.preventDefault)a.preventDefault();else if(a.returnValue=!1,ob)try{if(a.ctrlKey||112<=a.keyCode&&123>=a.keyCode)a.keyCode=-1}catch(b){}};var tb="closure_listenable_"+(1E6*Math.random()|0),ub=function(a){return!(!a||!a[tb])},vb=0;var wb=function(a,b,c,d,e){this.O=a;this.proxy=null;this.src=b;this.type=c;this.ka=!!d;this.sa=e;this.key=++vb;this.removed=this.ja=!1},xb=function(a){a.removed=!0;a.O=null;a.proxy=null;a.src=null;a.sa=null};var L=function(a){this.src=a;this.k={};this.fa=0};L.prototype.add=function(a,b,c,d,e){var f=a.toString();a=this.k[f];a||(a=this.k[f]=[],this.fa++);var g=yb(a,b,d,e);-1<g?(b=a[g],c||(b.ja=!1)):(b=new wb(b,this.src,f,!!d,e),b.ja=c,a.push(b));return b};L.prototype.remove=function(a,b,c,d){a=a.toString();if(!(a in this.k))return!1;var e=this.k[a];b=yb(e,b,c,d);return-1<b?(xb(e[b]),y.splice.call(e,b,1),0==e.length&&(delete this.k[a],this.fa--),!0):!1};
var zb=function(a,b){var c=b.type;if(!(c in a.k))return!1;var d=qa(a.k[c],b);d&&(xb(b),0==a.k[c].length&&(delete a.k[c],a.fa--));return d};L.prototype.removeAll=function(a){a=a&&a.toString();var b=0,c;for(c in this.k)if(!a||c==a){for(var d=this.k[c],e=0;e<d.length;e++)++b,xb(d[e]);delete this.k[c];this.fa--}return b};L.prototype.ba=function(a,b,c,d){a=this.k[a.toString()];var e=-1;a&&(e=yb(a,b,c,d));return-1<e?a[e]:null};
var yb=function(a,b,c,d){for(var e=0;e<a.length;++e){var f=a[e];if(!f.removed&&f.O==b&&f.ka==!!c&&f.sa==d)return e}return-1};var Ab="closure_lm_"+(1E6*Math.random()|0),Bb={},Cb=0,Db=function(a,b,c,d,e){if(n(b)){for(var f=0;f<b.length;f++)Db(a,b[f],c,d,e);return null}c=Eb(c);return ub(a)?a.listen(b,c,d,e):Fb(a,b,c,!1,d,e)},Fb=function(a,b,c,d,e,f){if(!b)throw Error("Invalid event type");var g=!!e,l=Gb(a);l||(a[Ab]=l=new L(a));c=l.add(b,c,d,e,f);if(c.proxy)return c;d=Hb();c.proxy=d;d.src=a;d.O=c;a.addEventListener?a.addEventListener(b.toString(),d,g):a.attachEvent(Ib(b.toString()),d);Cb++;return c},Hb=function(){var a=Jb,
b=nb?function(c){return a.call(b.src,b.O,c)}:function(c){c=a.call(b.src,b.O,c);if(!c)return c};return b},Kb=function(a,b,c,d,e){if(n(b)){for(var f=0;f<b.length;f++)Kb(a,b[f],c,d,e);return null}c=Eb(c);return ub(a)?a.cb(b,c,d,e):Fb(a,b,c,!0,d,e)},Lb=function(a,b,c,d,e){if(n(b))for(var f=0;f<b.length;f++)Lb(a,b[f],c,d,e);else c=Eb(c),ub(a)?a.jb(b,c,d,e):a&&(a=Gb(a))&&(b=a.ba(b,c,!!d,e))&&Mb(b)},Mb=function(a){if(ea(a)||!a||a.removed)return!1;var b=a.src;if(ub(b))return zb(b.B,a);var c=a.type,d=a.proxy;
b.removeEventListener?b.removeEventListener(c,d,a.ka):b.detachEvent&&b.detachEvent(Ib(c),d);Cb--;(c=Gb(b))?(zb(c,a),0==c.fa&&(c.src=null,b[Ab]=null)):xb(a);return!0},Ib=function(a){return a in Bb?Bb[a]:Bb[a]="on"+a},Pb=function(a,b,c,d){var e=!0;if(a=Gb(a))if(b=a.k[b.toString()])for(b=b.concat(),a=0;a<b.length;a++){var f=b[a];f&&f.ka==c&&!f.removed&&(f=Ob(f,d),e=e&&!1!==f)}return e},Ob=function(a,b){var c=a.O,d=a.sa||a.src;a.ja&&Mb(a);return c.call(d,b)},Jb=function(a,b){if(a.removed)return!0;if(!nb){var c;
if(!(c=b))a:{c=["window","event"];for(var d=k,e;e=c.shift();)if(null!=d[e])d=d[e];else{c=null;break a}c=d}e=c;c=new sb(e,this);d=!0;if(!(0>e.keyCode||void 0!=e.returnValue)){a:{var f=!1;if(0==e.keyCode)try{e.keyCode=-1;break a}catch(g){f=!0}if(f||void 0==e.returnValue)e.returnValue=!0}e=[];for(f=c.currentTarget;f;f=f.parentNode)e.push(f);for(var f=a.type,l=e.length-1;!c.X&&0<=l;l--){c.currentTarget=e[l];var D=Pb(e[l],f,!0,c),d=d&&D}for(l=0;!c.X&&l<e.length;l++)c.currentTarget=e[l],D=Pb(e[l],f,!1,
c),d=d&&D}return d}return Ob(a,new sb(b,this))},Gb=function(a){a=a[Ab];return a instanceof L?a:null},Qb="__closure_events_fn_"+(1E9*Math.random()>>>0),Eb=function(a){if(q(a))return a;a[Qb]||(a[Qb]=function(b){return a.handleEvent(b)});return a[Qb]};var M=function(){G.call(this);this.B=new L(this);this.Tb=this;this.fb=null};w(M,G);M.prototype[tb]=!0;h=M.prototype;h.addEventListener=function(a,b,c,d){Db(this,a,b,c,d)};h.removeEventListener=function(a,b,c,d){Lb(this,a,b,c,d)};
h.dispatchEvent=function(a){var b,c=this.fb;if(c){b=[];for(var d=1;c;c=c.fb)b.push(c),++d}c=this.Tb;d=a.type||a;if(p(a))a=new Za(a,c);else if(a instanceof Za)a.target=a.target||c;else{var e=a;a=new Za(d,c);Aa(a,e)}var e=!0,f;if(b)for(var g=b.length-1;!a.X&&0<=g;g--)f=a.currentTarget=b[g],e=Rb(f,d,!0,a)&&e;a.X||(f=a.currentTarget=c,e=Rb(f,d,!0,a)&&e,a.X||(e=Rb(f,d,!1,a)&&e));if(b)for(g=0;!a.X&&g<b.length;g++)f=a.currentTarget=b[g],e=Rb(f,d,!1,a)&&e;return e};
h.o=function(){M.P.o.call(this);this.B&&this.B.removeAll(void 0);this.fb=null};h.listen=function(a,b,c,d){return this.B.add(String(a),b,!1,c,d)};h.cb=function(a,b,c,d){return this.B.add(String(a),b,!0,c,d)};h.jb=function(a,b,c,d){return this.B.remove(String(a),b,c,d)};var Rb=function(a,b,c,d){b=a.B.k[String(b)];if(!b)return!0;b=b.concat();for(var e=!0,f=0;f<b.length;++f){var g=b[f];if(g&&!g.removed&&g.ka==c){var l=g.O,D=g.sa||g.src;g.ja&&zb(a.B,g);e=!1!==l.call(D,d)&&e}}return e&&0!=d.Hb};
M.prototype.ba=function(a,b,c,d){return this.B.ba(String(a),b,c,d)};var Sb=function(a,b,c){this.tc=c;this.dc=a;this.Gc=b;this.Ba=0;this.ta=null};Sb.prototype.get=function(){var a;0<this.Ba?(this.Ba--,a=this.ta,this.ta=a.next,a.next=null):a=this.dc();return a};Sb.prototype.put=function(a){this.Gc(a);this.Ba<this.tc&&(this.Ba++,a.next=this.ta,this.ta=a)};var Tb=function(a){k.setTimeout(function(){throw a;},0)},Ub,Vb=function(){var a=k.MessageChannel;"undefined"===typeof a&&"undefined"!==typeof window&&window.postMessage&&window.addEventListener&&-1==H.indexOf("Presto")&&(a=function(){var a=document.createElement("IFRAME");a.style.display="none";a.src="";document.documentElement.appendChild(a);var b=a.contentWindow,a=b.document;a.open();a.write("");a.close();var c="callImmediate"+Math.random(),d="file:"==b.location.protocol?"*":b.location.protocol+
"//"+b.location.host,a=t(function(a){if(("*"==d||a.origin==d)&&a.data==c)this.port1.onmessage()},this);b.addEventListener("message",a,!1);this.port1={};this.port2={postMessage:function(){b.postMessage(c,d)}}});if("undefined"!==typeof a&&!cb()){var b=new a,c={},d=c;b.port1.onmessage=function(){if(m(c.next)){c=c.next;var a=c.ob;c.ob=null;a()}};return function(a){d.next={ob:a};d=d.next;b.port2.postMessage(0)}}return"undefined"!==typeof document&&"onreadystatechange"in document.createElement("SCRIPT")?
function(a){var b=document.createElement("SCRIPT");b.onreadystatechange=function(){b.onreadystatechange=null;b.parentNode.removeChild(b);b=null;a();a=null};document.documentElement.appendChild(b)}:function(a){k.setTimeout(a,0)}};var Wb=function(){this.Ka=this.Z=null},Yb=new Sb(function(){return new Xb},function(a){a.reset()},100);Wb.prototype.add=function(a,b){var c=Yb.get();c.set(a,b);this.Ka?this.Ka.next=c:this.Z=c;this.Ka=c};Wb.prototype.remove=function(){var a=null;this.Z&&(a=this.Z,this.Z=this.Z.next,this.Z||(this.Ka=null),a.next=null);return a};var Xb=function(){this.next=this.scope=this.Wa=null};Xb.prototype.set=function(a,b){this.Wa=a;this.scope=b;this.next=null};
Xb.prototype.reset=function(){this.next=this.scope=this.Wa=null};var cc=function(a,b){Zb||$b();ac||(Zb(),ac=!0);bc.add(a,b)},Zb,$b=function(){if(k.Promise&&k.Promise.resolve){var a=k.Promise.resolve();Zb=function(){a.then(dc)}}else Zb=function(){var a=dc;!q(k.setImmediate)||k.Window&&k.Window.prototype&&k.Window.prototype.setImmediate==k.setImmediate?(Ub||(Ub=Vb()),Ub(a)):k.setImmediate(a)}},ac=!1,bc=new Wb,dc=function(){for(var a=null;a=bc.remove();){try{a.Wa.call(a.scope)}catch(b){Tb(b)}Yb.put(a)}ac=!1};var ec=function(a){a.prototype.then=a.prototype.then;a.prototype.$goog_Thenable=!0},fc=function(a){if(!a)return!1;try{return!!a.$goog_Thenable}catch(b){return!1}};var P=function(a,b){this.m=0;this.D=void 0;this.S=this.G=this.l=null;this.ra=this.Va=!1;if(a==gc)O(this,2,b);else try{var c=this;a.call(b,function(a){O(c,2,a)},function(a){O(c,3,a)})}catch(d){O(this,3,d)}},hc=function(){this.next=this.context=this.da=this.Da=this.L=null;this.Na=!1};hc.prototype.reset=function(){this.context=this.da=this.Da=this.L=null;this.Na=!1};
var ic=new Sb(function(){return new hc},function(a){a.reset()},100),jc=function(a,b,c){var d=ic.get();d.Da=a;d.da=b;d.context=c;return d},gc=function(){};P.prototype.then=function(a,b,c){return kc(this,q(a)?a:null,q(b)?b:null,c)};ec(P);P.prototype.cancel=function(a){0==this.m&&cc(function(){var b=new lc(a);mc(this,b)},this)};
var mc=function(a,b){if(0==a.m)if(a.l){var c=a.l;if(c.G){for(var d=0,e=null,f=null,g=c.G;g&&(g.Na||(d++,g.L==a&&(e=g),!(e&&1<d)));g=g.next)e||(f=g);e&&(0==c.m&&1==d?mc(c,b):(f?(d=f,d.next==c.S&&(c.S=d),d.next=d.next.next):nc(c),oc(c,e,3,b)))}a.l=null}else O(a,3,b)},qc=function(a,b){a.G||2!=a.m&&3!=a.m||pc(a);a.S?a.S.next=b:a.G=b;a.S=b},kc=function(a,b,c,d){var e=jc(null,null,null);e.L=new P(function(a,g){e.Da=b?function(c){try{var e=b.call(d,c);a(e)}catch(N){g(N)}}:a;e.da=c?function(b){try{var e=
c.call(d,b);!m(e)&&b instanceof lc?g(b):a(e)}catch(N){g(N)}}:g});e.L.l=a;qc(a,e);return e.L};P.prototype.Pb=function(a){this.m=0;O(this,2,a)};P.prototype.Qb=function(a){this.m=0;O(this,3,a)};
var O=function(a,b,c){if(0==a.m){if(a==c)b=3,c=new TypeError("Promise cannot resolve to itself");else{if(fc(c)){a.m=1;b=c;c=a.Pb;var d=a.Qb;b instanceof P?qc(b,jc(c||ba,d||null,a)):b.then(c,d,a);return}if(r(c))try{if(d=c.then,q(d)){rc(a,c,d);return}}catch(e){b=3,c=e}}a.D=c;a.m=b;a.l=null;pc(a);3!=b||c instanceof lc||sc(a,c)}},rc=function(a,b,c){a.m=1;var d=!1,e=function(b){d||(d=!0,a.Pb(b))},f=function(b){d||(d=!0,a.Qb(b))};try{c.call(b,e,f)}catch(g){f(g)}},pc=function(a){a.Va||(a.Va=!0,cc(a.gc,a))},
nc=function(a){var b=null;a.G&&(b=a.G,a.G=b.next,b.next=null);a.G||(a.S=null);return b};P.prototype.gc=function(){for(var a=null;a=nc(this);)oc(this,a,this.m,this.D);this.Va=!1};var oc=function(a,b,c,d){b.L&&(b.L.l=null);if(2==c)b.Da.call(b.context,d);else if(null!=b.da){if(!b.Na)for(;a&&a.ra;a=a.l)a.ra=!1;b.da.call(b.context,d)}ic.put(b)},sc=function(a,b){a.ra=!0;cc(function(){a.ra&&tc.call(null,b)})},tc=Tb,lc=function(a){x.call(this,a)};w(lc,x);lc.prototype.name="cancel";/*
 Portions of this code are from MochiKit, received by
 The Closure Authors under the MIT license. All other code is Copyright
 2005-2009 The Closure Authors. All Rights Reserved.
*/
var Q=function(a,b){this.Fa=[];this.Cb=a;this.rb=b||null;this.ca=this.C=!1;this.D=void 0;this.hb=this.Xb=this.Oa=!1;this.Ia=0;this.l=null;this.Qa=0};Q.prototype.cancel=function(a){if(this.C)this.D instanceof Q&&this.D.cancel();else{if(this.l){var b=this.l;delete this.l;a?b.cancel(a):(b.Qa--,0>=b.Qa&&b.cancel())}this.Cb?this.Cb.call(this.rb,this):this.hb=!0;this.C||this.A(new uc)}};Q.prototype.qb=function(a,b){this.Oa=!1;vc(this,a,b)};
var vc=function(a,b,c){a.C=!0;a.D=c;a.ca=!b;wc(a)},yc=function(a){if(a.C){if(!a.hb)throw new xc;a.hb=!1}};Q.prototype.v=function(a){yc(this);vc(this,!0,a)};Q.prototype.A=function(a){yc(this);vc(this,!1,a)};Q.prototype.n=function(a,b){return zc(this,a,null,b)};var zc=function(a,b,c,d){a.Fa.push([b,c,d]);a.C&&wc(a);return a};Q.prototype.then=function(a,b,c){var d,e,f=new P(function(a,b){d=a;e=b});zc(this,d,function(a){a instanceof uc?f.cancel():e(a)});return f.then(a,b,c)};ec(Q);
var Ac=function(a){var b=new Q;zc(a,b.v,b.A,b);return b},Bc=function(a){return ma(a.Fa,function(a){return q(a[1])})},wc=function(a){if(a.Ia&&a.C&&Bc(a)){var b=a.Ia,c=Cc[b];c&&(k.clearTimeout(c.ua),delete Cc[b]);a.Ia=0}a.l&&(a.l.Qa--,delete a.l);for(var b=a.D,d=c=!1;a.Fa.length&&!a.Oa;){var e=a.Fa.shift(),f=e[0],g=e[1],e=e[2];if(f=a.ca?g:f)try{var l=f.call(e||a.rb,b);m(l)&&(a.ca=a.ca&&(l==b||l instanceof Error),a.D=b=l);fc(b)&&(d=!0,a.Oa=!0)}catch(D){b=D,a.ca=!0,Bc(a)||(c=!0)}}a.D=b;d&&(l=t(a.qb,a,
!0),d=t(a.qb,a,!1),b instanceof Q?(zc(b,l,d),b.Xb=!0):b.then(l,d));c&&(b=new Dc(b),Cc[b.ua]=b,a.Ia=b.ua)},Ec=function(a){var b=new Q;b.v(a);return b},Gc=function(){var a=Fc,b=new Q;b.A(a);return b},xc=function(){x.call(this)};w(xc,x);xc.prototype.message="Deferred has already fired";xc.prototype.name="AlreadyCalledError";var uc=function(){x.call(this)};w(uc,x);uc.prototype.message="Deferred was canceled";uc.prototype.name="CanceledError";
var Dc=function(a){this.ua=k.setTimeout(t(this.Tc,this),0);this.na=a};Dc.prototype.Tc=function(){delete Cc[this.ua];throw this.na;};var Cc={};var Hc=function(a){this.qa=[];this.e=a};Hc.prototype.R=function(a){if(!q(a))throw Error("Invalid filter. Must be a function.");this.qa.push(a)};Hc.prototype.send=function(a,b){if(0==this.qa.length)return this.e.send(a,b);var c=new R(a,b);return Ic(this,0,c).n(function(){if(!c.Sa)return this.e.send(a,b)},this)};var Ic=function(a,b,c){return Ec().n(function(){return this.qa[b](c)},a).n(function(){if(++b<this.qa.length&&!c.Sa)return Ic(this,b,c)},a)},R=function(a,b){this.Wc=a;this.Cc=b;this.Sa=!1};
R.prototype.ub=function(){return this.Wc};R.prototype.V=function(){return this.Cc};R.prototype.cancel=function(){this.Sa=!0};Ba("area base br col command embed hr img input keygen link meta param source track wbr".split(" "));var Jc=function(a,b){this.width=a;this.height=b};Jc.prototype.clone=function(){return new Jc(this.width,this.height)};Jc.prototype.floor=function(){this.width=Math.floor(this.width);this.height=Math.floor(this.height);return this};!eb&&!J||J&&J&&(I()||9<=mb)||eb&&K("1.9.1");J&&K("9");var Kc={id:"apiVersion",name:"v",valueType:"text",maxLength:void 0,defaultValue:void 0},Lc={id:"appName",name:"an",valueType:"text",maxLength:100,defaultValue:void 0},Mc={id:"appVersion",name:"av",valueType:"text",maxLength:100,defaultValue:void 0},Nc={id:"clientId",name:"cid",valueType:"text",maxLength:void 0,defaultValue:void 0},Oc={id:"language",name:"ul",valueType:"text",maxLength:20,defaultValue:void 0},Pc={id:"libVersion",name:"_v",valueType:"text",maxLength:void 0,defaultValue:void 0},Qc={id:"sampleRateOverride",
name:"usro",valueType:"integer",maxLength:void 0,defaultValue:void 0},Rc={id:"screenColors",name:"sd",valueType:"text",maxLength:20,defaultValue:void 0},Sc={id:"screenResolution",name:"sr",valueType:"text",maxLength:20,defaultValue:void 0},Tc={id:"trackingId",name:"tid",valueType:"text",maxLength:void 0,defaultValue:void 0},Uc={id:"viewportSize",name:"vp",valueType:"text",maxLength:20,defaultValue:void 0},Vc={ad:Kc,dd:Lc,ed:Mc,nd:Nc,Fd:Oc,Gd:Pc,Md:Qc,Nd:Rc,Od:Sc,ae:Tc,he:Uc},Xc=function(a){if(!p(a))return a;
var b=Wc(a,Ma);if(r(b))return b;b=Wc(a,Vc);if(r(b))return b;b=/^dimension(\d+)$/.exec(a);if(null!==b)return Na(parseInt(b[1],10));b=/^metric(\d+)$/.exec(a);if(null!==b)return Oa(parseInt(b[1],10));throw Error(a+" is not a valid parameter name.");},Wc=function(a,b){var c=ya(b,function(b){return b.id==a&&"metric"!=a&&"dimension"!=a});return r(c)?c:null};var S=function(a,b){this.ac=b;this.q=b.Xa();this.Fb=new E;this.ib=!1};h=S.prototype;h.set=function(a,b){if(null==b)throw Error("Value must be defined and not null. Parameter="+a.id);var c=Xc(a);this.Fb.set(c,b)};h.R=function(a){this.ac.R(a)};h.send=function(a,b){if(a instanceof F)return a.send(this);var c=this.Fb.clone();b instanceof E?c.ha(b):r(b)&&va(b,function(a,b){null!=a&&c.set(Xc(b),a)},this);this.ib&&(this.ib=!1,c.set(Ga,"start"));return this.q.send(a,c)};
h.Hc=function(a){var b={description:a};this.set(Ha,a);return this.send("appview",b)};h.Ic=function(a,b,c,d){return this.send("event",{eventCategory:a,eventAction:b,eventLabel:c,eventValue:d})};h.Kc=function(a,b,c){return this.send("social",{socialNetwork:a,socialAction:b,socialTarget:c})};h.Jc=function(a,b){return this.send("exception",{exDescription:a,exFatal:b})};h.Ib=function(a,b,c,d,e){return this.send("timing",{timingCategory:a,timingVar:b,timingLabel:d,timingValue:c,sampleRateOverride:e})};
h.jc=function(){this.ib=!0};h.Rc=function(a,b,c,d){return new Yc(this,a,b,c,d)};var Yc=function(a,b,c,d,e){this.Ob=a;this.Zb=b;this.Xc=c;this.rc=d;this.Ea=e;this.Qc=u()};Yc.prototype.send=function(){var a=this.Ob.Ib(this.Zb,this.Xc,u()-this.Qc,this.rc,this.Ea);this.Ob=null;return a};var Zc=function(a,b,c,d,e){this.sc=a;this.Ub=b;this.Vb=c;this.g=d;this.$b=e};
Zc.prototype.mc=function(a){var b=new S(0,this.$b.create());b.set(Pc,this.sc);b.set(Kc,1);b.set(Lc,this.Ub);b.set(Mc,this.Vb);b.set(Tc,a);(a=navigator.language||navigator.browserLanguage)&&b.set(Oc,a);(a=screen.colorDepth+"-bit")&&b.set(Rc,a);(a=[screen.width,screen.height].join("x"))&&b.set(Sc,a);a=window.document;a="CSS1Compat"==a.compatMode?a.documentElement:a.body;a=new Jc(a.clientWidth,a.clientHeight);(a=[a.width,a.height].join("x"))&&b.set(Uc,a);return b};Zc.prototype.kc=function(){return Ac(this.g.ea)};var $c=function(a,b,c,d,e,f){Q.call(this,e,f);this.bb=a;this.Ta=[];this.tb=!!b;this.ic=!!c;this.cc=!!d;for(b=this.Bb=0;b<a.length;b++)zc(a[b],t(this.vb,this,b,!0),t(this.vb,this,b,!1));0!=a.length||this.tb||this.v(this.Ta)};w($c,Q);$c.prototype.vb=function(a,b,c){this.Bb++;this.Ta[a]=[b,c];this.C||(this.tb&&b?this.v([a,c]):this.ic&&!b?this.A(c):this.Bb==this.bb.length&&this.v(this.Ta));this.cc&&!b&&(c=null);return c};$c.prototype.A=function(a){$c.P.A.call(this,a);for(a=0;a<this.bb.length;a++)this.bb[a].cancel()};
var ad=function(a){return(new $c(a,!1,!0)).n(function(a){for(var c=[],d=0;d<a.length;d++)c[d]=a[d][1];return c})};var bd=function(){for(var a="xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".split(""),b=0,c=a.length;b<c;b++)switch(a[b]){case "x":a[b]=Math.floor(16*Math.random()).toString(16);break;case "y":a[b]=(Math.floor(4*Math.random())+8).toString(16)}return a.join("")};var T=function(a){this.J=a;this.Ea=100;this.pb=[];this.W=this.ga=null;this.ea=cd(this);this.ea.n(function(){this.Jb=Db(this.J,"a",t(this.nc,this))},this)},cd=function(a){return dd(a).n(function(){return this},a)},dd=function(a){return ad([ed(a),fd(a)])};T.prototype.nc=function(){U(this);var a=gd(this),b=this.xa();dd(this).n(function(){a!=gd(this)&&hd(this,"analytics.user-id");b!=this.xa()&&hd(this,"analytics.tracking-permitted")},this)};var id=function(a,b){U(a);a.pb.push(b)};
T.prototype.Oc=function(a){U(this);var b=this.W!=a;this.W=a;this.J.set("analytics.tracking-permitted",a.toString());b&&hd(this,"analytics.tracking-permitted")};T.prototype.xa=function(){U(this);var a;if(a=this.W)a=k._gaUserPrefs,a=!(a&&a.ioo&&a.ioo());return a};
var ed=function(a){return a.J.get("analytics.tracking-permitted").n(function(a){this.W=!0;if(m(a))switch(a){case "true":this.W=!0;break;case "false":this.W=!1}},a)},gd=function(a){U(a);if(!p(a.ga))throw Error("Invalid state. UserID is not a string.");return a.ga},fd=function(a){return a.J.get("analytics.user-id").n(function(a){m(a)?this.ga=a:jd(this)},a)},jd=function(a){a.ga=bd();return a.J.set("analytics.user-id",a.ga).n(function(){hd(this,"analytics.user-id")},a)};
T.prototype.Nc=function(a){U(this);this.Ea=a};var kd=function(a){U(a);return a.Ea};T.prototype.Fc=function(){return jd(this)};var hd=function(a,b){la(a.pb,function(a){a(b)})};T.prototype.ma=function(){null!=this.Jb&&Mb(this.Jb)};var U=function(a){if(!Ac(a.ea).C)throw Error("Settings object accessed prior to entering ready state.");};var ld=function(){M.call(this);this.eb="google-analytics";this.J=chrome.storage.local;chrome.storage.onChanged.addListener(t(this.Ac,this))};w(ld,M);ld.prototype.Ac=function(a){md(this,a)&&this.dispatchEvent("a")};var md=function(a,b){return ma(xa(b),function(a){return 0==a.lastIndexOf(this.eb,0)},a)};ld.prototype.get=function(a){var b=new Q,c=this.eb+"."+a;this.J.get(c,function(a){chrome.runtime.lastError?b.A(chrome.runtime.lastError):(a=a[c],b.v(null!=a?a.toString():void 0))});return b};
ld.prototype.set=function(a,b){var c=new Q,d={};d[this.eb+"."+a]=b;this.J.set(d,function(){chrome.runtime.lastError?c.A(chrome.runtime.lastError):c.v()});return c};var V=function(){};V.lc=function(){return V.yb?V.yb:V.yb=new V};V.prototype.send=function(){return Ec()};var nd=function(a){this.ec=a};nd.prototype.send=function(a,b){this.ec.push({pc:a,Bc:b});return Ec()};var od=function(a,b,c){this.g=a;this.U=[];this.K={enabled:new nd(this.U),disabled:c};this.q=this.K.enabled;zc(Ac(this.g.ea),ha(this.zc,b),this.yc,this)};od.prototype.zc=function(a){if(null===this.U)throw Error("Channel setup already completed.");this.K.enabled=a();pd(this);la(this.U,function(a){this.send(a.pc,a.Bc)},this);this.U=null;id(this.g,t(this.xc,this))};
od.prototype.yc=function(){if(null===this.U)throw Error("Channel setup already completed.");this.q=this.K.enabled=this.K.disabled;this.U=null};od.prototype.send=function(a,b){return this.q.send(a,b)};var pd=function(a){a.q=a.g.xa()?a.K.enabled:a.K.disabled};od.prototype.xc=function(a){switch(a){case "analytics.tracking-permitted":pd(this)}};var qd=function(a,b){this.Ra=[];var c=t(function(){this.pa=new Hc(b.Xa());la(this.Ra,function(a){this.pa.R(a)},this);this.Ra=null;return this.pa},this);this.q=new od(a,c,V.lc())};qd.prototype.Xa=function(){return this.q};qd.prototype.R=function(a){this.pa?this.pa.R(a):this.Ra.push(a)};var rd=function(a,b){this.g=a;this.Pc=b};rd.prototype.create=function(){return new qd(this.g,this.Pc)};var sd=function(a,b){M.call(this);this.wa=a||1;this.Y=b||k;this.Pa=t(this.Uc,this);this.ab=u()};w(sd,M);h=sd.prototype;h.enabled=!1;h.h=null;h.Uc=function(){if(this.enabled){var a=u()-this.ab;0<a&&a<.8*this.wa?this.h=this.Y.setTimeout(this.Pa,this.wa-a):(this.h&&(this.Y.clearTimeout(this.h),this.h=null),this.dispatchEvent("tick"),this.enabled&&(this.h=this.Y.setTimeout(this.Pa,this.wa),this.ab=u()))}};h.start=function(){this.enabled=!0;this.h||(this.h=this.Y.setTimeout(this.Pa,this.wa),this.ab=u())};
h.stop=function(){this.enabled=!1;this.h&&(this.Y.clearTimeout(this.h),this.h=null)};h.o=function(){sd.P.o.call(this);this.stop();delete this.Y};var td=function(a,b,c){if(q(a))c&&(a=t(a,c));else if(a&&"function"==typeof a.handleEvent)a=t(a.handleEvent,a);else throw Error("Invalid listener argument");return 2147483647<b?-1:k.setTimeout(a,b||0)};var W=function(a){G.call(this);this.Ya=a;this.b={}};w(W,G);var ud=[];W.prototype.listen=function(a,b,c,d){n(b)||(b&&(ud[0]=b.toString()),b=ud);for(var e=0;e<b.length;e++){var f=Db(a,b[e],c||this.handleEvent,d||!1,this.Ya||this);if(!f)break;this.b[f.key]=f}return this};W.prototype.cb=function(a,b,c,d){return vd(this,a,b,c,d)};var vd=function(a,b,c,d,e,f){if(n(c))for(var g=0;g<c.length;g++)vd(a,b,c[g],d,e,f);else{b=Kb(b,c,d||a.handleEvent,e,f||a.Ya||a);if(!b)return a;a.b[b.key]=b}return a};
W.prototype.jb=function(a,b,c,d,e){if(n(b))for(var f=0;f<b.length;f++)this.jb(a,b[f],c,d,e);else c=c||this.handleEvent,e=e||this.Ya||this,c=Eb(c),d=!!d,b=ub(a)?a.ba(b,c,d,e):a?(a=Gb(a))?a.ba(b,c,d,e):null:null,b&&(Mb(b),delete this.b[b.key]);return this};W.prototype.removeAll=function(){va(this.b,Mb);this.b={}};W.prototype.o=function(){W.P.o.call(this);this.removeAll()};W.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented");};var wd=function(){M.call(this);this.oa=new W(this);pb&&(qb?this.oa.listen(rb?document.body:window,["online","offline"],this.wb):(this.Eb=pb?navigator.onLine:!0,this.h=new sd(250),this.oa.listen(this.h,"tick",this.oc),this.h.start()))};w(wd,M);wd.prototype.oc=function(){var a=pb?navigator.onLine:!0;a!=this.Eb&&(this.Eb=a,this.wb())};wd.prototype.wb=function(){this.dispatchEvent((pb?navigator.onLine:1)?"online":"offline")};
wd.prototype.o=function(){wd.P.o.call(this);this.oa.ma();this.oa=null;this.h&&(this.h.ma(),this.h=null)};var xd=function(a,b){this.g=a;this.e=b};xd.prototype.send=function(a,b){b.set(Nc,gd(this.g));return this.e.send(a,b)};var yd=function(a){this.e=a};yd.prototype.send=function(a,b){zd(b);Ad(b);return this.e.send(a,b)};var zd=function(a){Xa(a,function(b,c){m(b.maxLength)&&"text"==b.valueType&&0<b.maxLength&&c.length>b.maxLength&&a.set(b,c.substring(0,b.maxLength))})},Ad=function(a){Xa(a,function(b,c){m(b.defaultValue)&&c==b.defaultValue&&a.remove(b)})};var Fc={status:"device-offline",la:void 0},Bd={status:"rate-limited",la:void 0},Cd={status:"sampled-out",la:void 0},Dd={status:"sent",la:void 0};var Ed=function(a,b){this.Vc=a;this.e=b};Ed.prototype.send=function(a,b){var c;c=this.Vc;var d=c.Lb(),e=Math.floor((d-c.Ab)*c.hc);0<e&&(c.$=Math.min(c.$+e,c.uc),c.Ab=d);1>c.$?c=!1:(--c.$,c=!0);return c||"item"==a||"transaction"==a?this.e.send(a,b):Ec(Bd)};var Fd=function(){this.$=60;this.uc=500;this.hc=5E-4;this.Lb=function(){return(new Date).getTime()};this.Ab=this.Lb()};var Gd=function(a,b){this.g=a;this.e=b};Gd.prototype.send=function(a,b){var c=b.get(Nc),c=parseInt(c.split("-")[1],16),d;"timing"!=a?d=kd(this.g):((d=b.get(Qc))&&b.remove(Qc),d=d||kd(this.g));return c<655.36*d?this.e.send(a,b):Ec(Cd)};var Hd=/^(?:([^:/?#.]+):)?(?:\/\/(?:([^/?#]*)@)?([^/#?]*?)(?::([0-9]+))?(?=[/#?]|$))?([^?#]+)?(?:\?([^#]*))?(?:#(.*))?$/,Jd=function(a){if(Id){Id=!1;var b=k.location;if(b){var c=b.href;if(c&&(c=(c=Jd(c)[3]||null)?decodeURI(c):c)&&c!=b.hostname)throw Id=!0,Error();}}return a.match(Hd)},Id=fb,Kd=function(a,b){for(var c=a.split("&"),d=0;d<c.length;d++){var e=c[d].indexOf("="),f=null,g=null;0<=e?(f=c[d].substring(0,e),g=c[d].substring(e+1)):f=c[d];b(f,g?decodeURIComponent(g.replace(/\+/g," ")):"")}};var Ld=function(){};Ld.prototype.nb=null;var Nd=function(a){var b;(b=a.nb)||(b={},Md(a)&&(b[0]=!0,b[1]=!0),b=a.nb=b);return b};var Od,Pd=function(){};w(Pd,Ld);var Qd=function(a){return(a=Md(a))?new ActiveXObject(a):new XMLHttpRequest},Md=function(a){if(!a.xb&&"undefined"==typeof XMLHttpRequest&&"undefined"!=typeof ActiveXObject){for(var b=["MSXML2.XMLHTTP.6.0","MSXML2.XMLHTTP.3.0","MSXML2.XMLHTTP","Microsoft.XMLHTTP"],c=0;c<b.length;c++){var d=b[c];try{return new ActiveXObject(d),a.xb=d}catch(e){}}throw Error("Could not create ActiveXObject. ActiveX might be disabled, or MSXML might not be installed");}return a.xb};Od=new Pd;var X=function(a){M.call(this);this.headers=new z;this.Ma=a||null;this.F=!1;this.La=this.a=null;this.za=this.$a="";this.N=this.Za=this.va=this.Ua=!1;this.Ha=0;this.Ga=null;this.Gb="";this.kb=this.Zc=!1};w(X,M);var Rd=/^https?$/i,Sd=["POST","PUT"],Td=[],Ud=function(a,b,c){var d=new X;Td.push(d);b&&d.listen("complete",b);d.cb("ready",d.bc);d.send(a,"POST",c,void 0)};X.prototype.bc=function(){this.ma();qa(Td,this)};
X.prototype.send=function(a,b,c,d){if(this.a)throw Error("[goog.net.XhrIo] Object is active with another request="+this.$a+"; newUri="+a);b=b?b.toUpperCase():"GET";this.$a=a;this.za="";this.Ua=!1;this.F=!0;this.a=this.Ma?Qd(this.Ma):Qd(Od);this.La=this.Ma?Nd(this.Ma):Nd(Od);this.a.onreadystatechange=t(this.Db,this);try{this.Za=!0,this.a.open(b,String(a),!0),this.Za=!1}catch(e){this.na(5,e);return}a=c||"";var f=this.headers.clone();d&&Wa(d,function(a,b){f.set(b,a)});d=pa(f.H());c=k.FormData&&a instanceof
k.FormData;!(0<=ka(Sd,b))||d||c||f.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");f.forEach(function(a,b){this.a.setRequestHeader(b,a)},this);this.Gb&&(this.a.responseType=this.Gb);"withCredentials"in this.a&&(this.a.withCredentials=this.Zc);try{Vd(this),0<this.Ha&&((this.kb=Wd(this.a))?(this.a.timeout=this.Ha,this.a.ontimeout=t(this.Mb,this)):this.Ga=td(this.Mb,this.Ha,this)),this.va=!0,this.a.send(a),this.va=!1}catch(g){this.na(5,g)}};
var Wd=function(a){return J&&K(9)&&ea(a.timeout)&&m(a.ontimeout)},oa=function(a){return"content-type"==a.toLowerCase()};X.prototype.Mb=function(){"undefined"!=typeof aa&&this.a&&(this.za="Timed out after "+this.Ha+"ms, aborting",this.dispatchEvent("timeout"),this.abort(8))};X.prototype.na=function(a,b){this.F=!1;this.a&&(this.N=!0,this.a.abort(),this.N=!1);this.za=b;Xd(this);Yd(this)};var Xd=function(a){a.Ua||(a.Ua=!0,a.dispatchEvent("complete"),a.dispatchEvent("error"))};
X.prototype.abort=function(){this.a&&this.F&&(this.F=!1,this.N=!0,this.a.abort(),this.N=!1,this.dispatchEvent("complete"),this.dispatchEvent("abort"),Yd(this))};X.prototype.o=function(){this.a&&(this.F&&(this.F=!1,this.N=!0,this.a.abort(),this.N=!1),Yd(this,!0));X.P.o.call(this)};X.prototype.Db=function(){this.aa||(this.Za||this.va||this.N?Zd(this):this.wc())};X.prototype.wc=function(){Zd(this)};
var Zd=function(a){if(a.F&&"undefined"!=typeof aa&&(!a.La[1]||4!=$d(a)||2!=ae(a)))if(a.va&&4==$d(a))td(a.Db,0,a);else if(a.dispatchEvent("readystatechange"),4==$d(a)){a.F=!1;try{var b=ae(a),c;a:switch(b){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:c=!0;break a;default:c=!1}var d;if(!(d=c)){var e;if(e=0===b){var f=Jd(String(a.$a))[1]||null;if(!f&&self.location)var g=self.location.protocol,f=g.substr(0,g.length-1);e=!Rd.test(f?f.toLowerCase():"")}d=e}if(d)a.dispatchEvent("complete"),
a.dispatchEvent("success");else{var l;try{l=2<$d(a)?a.a.statusText:""}catch(D){l=""}a.za=l+" ["+ae(a)+"]";Xd(a)}}finally{Yd(a)}}},Yd=function(a,b){if(a.a){Vd(a);var c=a.a,d=a.La[0]?ba:null;a.a=null;a.La=null;b||a.dispatchEvent("ready");try{c.onreadystatechange=d}catch(e){}}},Vd=function(a){a.a&&a.kb&&(a.a.ontimeout=null);ea(a.Ga)&&(k.clearTimeout(a.Ga),a.Ga=null)},$d=function(a){return a.a?a.a.readyState:0},ae=function(a){try{return 2<$d(a)?a.a.status:-1}catch(b){return-1}};var be=function(a,b,c){this.r=a||null;this.qc=!!c},ce=function(a){a.c||(a.c=new z,a.j=0,a.r&&Kd(a.r,function(b,c){a.add(decodeURIComponent(b.replace(/\+/g," ")),c)}))};h=be.prototype;h.c=null;h.j=null;h.add=function(a,b){ce(this);this.r=null;a=de(this,a);var c=this.c.get(a);c||this.c.set(a,c=[]);c.push(b);this.j++;return this};h.remove=function(a){ce(this);a=de(this,a);return this.c.T(a)?(this.r=null,this.j-=this.c.get(a).length,this.c.remove(a)):!1};h.T=function(a){ce(this);a=de(this,a);return this.c.T(a)};
h.H=function(){ce(this);for(var a=this.c.t(),b=this.c.H(),c=[],d=0;d<b.length;d++)for(var e=a[d],f=0;f<e.length;f++)c.push(b[d]);return c};h.t=function(a){ce(this);var b=[];if(p(a))this.T(a)&&(b=ra(b,this.c.get(de(this,a))));else{a=this.c.t();for(var c=0;c<a.length;c++)b=ra(b,a[c])}return b};h.set=function(a,b){ce(this);this.r=null;a=de(this,a);this.T(a)&&(this.j-=this.c.get(a).length);this.c.set(a,[b]);this.j++;return this};
h.get=function(a,b){var c=a?this.t(a):[];return 0<c.length?String(c[0]):b};h.toString=function(){if(this.r)return this.r;if(!this.c)return"";for(var a=[],b=this.c.H(),c=0;c<b.length;c++)for(var d=b[c],e=encodeURIComponent(String(d)),d=this.t(d),f=0;f<d.length;f++){var g=e;""!==d[f]&&(g+="="+encodeURIComponent(String(d[f])));a.push(g)}return this.r=a.join("&")};h.clone=function(){var a=new be;a.r=this.r;this.c&&(a.c=this.c.clone(),a.j=this.j);return a};
var de=function(a,b){var c=String(b);a.qc&&(c=c.toLowerCase());return c};var ee=function(a,b){this.Mc=a;this.Aa=b};ee.prototype.send=function(a,b){if(pb&&!navigator.onLine)return Gc();var c=new Q,d=fe(a,b);d.length>this.Aa?c.A({status:"payload-too-big",la:Ua("Encoded hit length == %s, but should be <= %s.",d.length,this.Aa)}):Ud(this.Mc,function(){c.v(Dd)},d);return c};var fe=function(a,b){var c=new be;c.add(Fa.name,a);Xa(b,function(a,b){c.add(a.name,b.toString())});return c.toString()};var ge=function(a,b,c){this.g=a;this.Lc=b;this.Aa=c};ge.prototype.Xa=function(){if(!this.q){if(!Ac(this.g.ea).C)throw Error("Cannot construct shared channel prior to settings being ready.");new wd;var a=new yd(new ee(this.Lc,this.Aa)),b=new Fd;this.q=new xd(this.g,new Gd(this.g,new Ed(b,a)))}return this.q};var he=new z,ie=function(){Da||(Da=new T(new ld));return Da};v("goog.async.Deferred",Q);v("goog.async.Deferred.prototype.addCallback",Q.prototype.n);v("goog.async.Deferred.prototype.callback",Q.prototype.v);v("goog.async.Deferred.prototype.then",Q.prototype.then);v("goog.events.EventTarget",M);v("goog.events.EventTarget.prototype.listen",M.prototype.listen);
v("analytics.getService",function(a,b){var c=he.get(a,null),d=b||chrome.runtime.getManifest().version;if(null===c){c=ie();if(!Ea){var e=ie();Ea=new rd(e,new ge(e,"https://www.google-analytics.com/collect",8192))}c=new Zc("ca1.6.0",a,d,c,Ea);he.set(a,c)}return c});v("analytics.internal.GoogleAnalyticsService",Zc);v("analytics.internal.GoogleAnalyticsService.prototype.getTracker",Zc.prototype.mc);v("analytics.internal.GoogleAnalyticsService.prototype.getConfig",Zc.prototype.kc);
v("analytics.internal.ServiceSettings",T);v("analytics.internal.ServiceSettings.prototype.setTrackingPermitted",T.prototype.Oc);v("analytics.internal.ServiceSettings.prototype.isTrackingPermitted",T.prototype.xa);v("analytics.internal.ServiceSettings.prototype.setSampleRate",T.prototype.Nc);v("analytics.internal.ServiceSettings.prototype.resetUserId",T.prototype.Fc);v("analytics.internal.ServiceTracker",S);v("analytics.internal.ServiceTracker.prototype.send",S.prototype.send);
v("analytics.internal.ServiceTracker.prototype.sendAppView",S.prototype.Hc);v("analytics.internal.ServiceTracker.prototype.sendEvent",S.prototype.Ic);v("analytics.internal.ServiceTracker.prototype.sendSocial",S.prototype.Kc);v("analytics.internal.ServiceTracker.prototype.sendException",S.prototype.Jc);v("analytics.internal.ServiceTracker.prototype.sendTiming",S.prototype.Ib);v("analytics.internal.ServiceTracker.prototype.startTiming",S.prototype.Rc);v("analytics.internal.ServiceTracker.Timing",Yc);
v("analytics.internal.ServiceTracker.Timing.prototype.send",Yc.prototype.send);v("analytics.internal.ServiceTracker.prototype.forceSessionStart",S.prototype.jc);v("analytics.internal.ServiceTracker.prototype.addFilter",S.prototype.R);v("analytics.internal.FilterChannel.Hit",R);v("analytics.internal.FilterChannel.Hit.prototype.getHitType",R.prototype.ub);v("analytics.internal.FilterChannel.Hit.prototype.getParameters",R.prototype.V);v("analytics.internal.FilterChannel.Hit.prototype.cancel",R.prototype.cancel);
v("analytics.ParameterMap",E);v("analytics.ParameterMap.Entry",E.Entry);v("analytics.ParameterMap.prototype.set",E.prototype.set);v("analytics.ParameterMap.prototype.get",E.prototype.get);v("analytics.ParameterMap.prototype.remove",E.prototype.remove);v("analytics.ParameterMap.prototype.toObject",E.prototype.Nb);v("analytics.HitTypes.APPVIEW","appview");v("analytics.HitTypes.EVENT","event");v("analytics.HitTypes.SOCIAL","social");v("analytics.HitTypes.TRANSACTION","transaction");
v("analytics.HitTypes.ITEM","item");v("analytics.HitTypes.TIMING","timing");v("analytics.HitTypes.EXCEPTION","exception");va(Ma,function(a){var b=a.id.replace(/[A-Z]/,"_$&").toUpperCase();v("analytics.Parameters."+b,a)});v("analytics.filters.EventLabelerBuilder",C);v("analytics.filters.EventLabelerBuilder.prototype.appendToExistingLabel",C.prototype.Wb);v("analytics.filters.EventLabelerBuilder.prototype.stripValue",C.prototype.Sc);v("analytics.filters.EventLabelerBuilder.prototype.powersOfTwo",C.prototype.Dc);
v("analytics.filters.EventLabelerBuilder.prototype.rangeBounds",C.prototype.Ec);v("analytics.filters.EventLabelerBuilder.prototype.build",C.prototype.ia);v("analytics.filters.FilterBuilder",B);v("analytics.filters.FilterBuilder.builder",Ra);v("analytics.filters.FilterBuilder.prototype.when",B.prototype.when);v("analytics.filters.FilterBuilder.prototype.whenHitType",B.prototype.Rb);v("analytics.filters.FilterBuilder.prototype.whenValue",B.prototype.Yc);
v("analytics.filters.FilterBuilder.prototype.applyFilter",B.prototype.mb);v("analytics.filters.FilterBuilder.prototype.build",B.prototype.ia);v("analytics.EventBuilder",F);v("analytics.EventBuilder.builder",function(){return Ya});v("analytics.EventBuilder.prototype.category",F.prototype.Yb);v("analytics.EventBuilder.prototype.action",F.prototype.action);v("analytics.EventBuilder.prototype.label",F.prototype.label);v("analytics.EventBuilder.prototype.value",F.prototype.value);
v("analytics.EventBuilder.prototype.dimension",F.prototype.fc);v("analytics.EventBuilder.prototype.metric",F.prototype.vc);v("analytics.EventBuilder.prototype.send",F.prototype.send); }).call(this);

!function(n,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):n.Dexie=t()}(this,function(){"use strict";function n(n,t){return"object"!=typeof t&&(t=t()),R(t).forEach(function(e){n[e]=t[e]}),n}function t(t){return{from:function(e){return t.prototype=Object.create(e.prototype),t.prototype.constructor=t,{extend:function(r){n(t.prototype,"object"!=typeof r?r(e.prototype):r)}}}}}function e(n,t,e){return U.call(n,t,e)}function r(n,t){return t(n)}function o(a,h){function y(){qn.on("versionchange",function(n){qn.close(),qn.on("error").fire(new kn("Database version changed by other database connection."))})}function b(n){this._cfg={version:n,storesSource:null,dbschema:{},tables:{},contentUpgrade:null},this.stores({})}function P(n,t,o,i){if(0===n){R(On).forEach(function(n){U(t,n,On[n].primKey,On[n].indexes)});var u=qn._createTransaction(Fn,jn,On);u.idbtrans=t,u.idbtrans.onerror=j(o,["populating database"]),u.on("error").subscribe(o),J.newPSD(function(){J.PSD.trans=u;try{qn.on("populate").fire(u)}catch(n){i.onerror=t.onerror=function(n){n.preventDefault()};try{t.abort()}catch(e){}t.db.close(),o(n)}})}else{var c=[],a=En.filter(function(t){return t._cfg.version===n})[0];if(!a)throw new kn("Dexie specification of currently installed DB version is missing");On=qn._dbSchema=a._cfg.dbschema;var s=!1,f=En.filter(function(t){return t._cfg.version>n});f.forEach(function(n){var i=On,u=n._cfg.dbschema;wn(i,t),wn(u,t),On=qn._dbSchema=u;var a=O(i,u);a.add.forEach(function(n){c.push(function(t,e){U(t,n[0],n[1].primKey,n[1].indexes),e()})}),a.change.forEach(function(n){if(n.recreate)throw new kn("Not yet support for changing primary key");c.push(function(t,e){var r=t.objectStore(n.name);n.add.forEach(function(n){Q(r,n)}),n.change.forEach(function(n){r.deleteIndex(n.name),Q(r,n)}),n.del.forEach(function(n){r.deleteIndex(n)}),e()})}),n._cfg.contentUpgrade&&c.push(function(t,i){s=!0;var c=qn._createTransaction(Fn,e(t.db.objectStoreNames),u);c.idbtrans=t;var a=0;c._promise=r(c._promise,function(n){return function(t,e,r){function o(n){return function(){n.apply(this,arguments),0===--a&&i()}}return++a,n.call(this,t,function(n,t,r){arguments[0]=o(n),arguments[1]=o(t),e.apply(this,arguments)},r)}}),t.onerror=j(o,["running upgrader function for version",n._cfg.version]),c.on("error").subscribe(o),n._cfg.contentUpgrade(c),0===a&&i()}),s&&bn()||c.push(function(n,t){G(u,n),t()})});var h=function(){try{c.length?c.shift()(t,h):W(On,t)}catch(n){i.onerror=t.onerror=function(n){n.preventDefault()};try{t.abort()}catch(e){}t.db.close(),o(n)}};h()}}function O(n,t){var e={del:[],add:[],change:[]};for(var r in n)t[r]||e.del.push(r);for(var r in t){var o=n[r],i=t[r];if(o){var u={name:r,def:t[r],recreate:!1,del:[],add:[],change:[]};if(o.primKey.src!==i.primKey.src)u.recreate=!0,e.change.push(u);else{var c=o.indexes.reduce(function(n,t){return n[t.name]=t,n},{}),a=i.indexes.reduce(function(n,t){return n[t.name]=t,n},{});for(var s in c)a[s]||u.del.push(s);for(var s in a){var f=c[s],h=a[s];f?f.src!==h.src&&u.change.push(h):u.add.push(h)}(u.recreate||u.del.length>0||u.add.length>0||u.change.length>0)&&e.change.push(u)}}else e.add.push([r,i])}return e}function U(n,t,e,r){var o=n.db.createObjectStore(t,e.keyPath?{keyPath:e.keyPath,autoIncrement:e.auto}:{autoIncrement:e.auto});return r.forEach(function(n){Q(o,n)}),o}function W(n,t){R(n).forEach(function(e){t.db.objectStoreNames.contains(e)||U(t,e,n[e].primKey,n[e].indexes)})}function G(n,t){for(var e=0;e<t.db.objectStoreNames.length;++e){var r=t.db.objectStoreNames[e];null!==n[r]&&void 0!==n[r]||t.db.deleteObjectStore(r)}}function Q(n,t){n.createIndex(t.name,t.keyPath,{unique:t.unique,multiEntry:t.multi})}function X(n,t){throw new kn("Table "+t[0]+" not part of transaction. Original Scope Function Source: "+o.Promise.PSD.trans.scopeFunc.toString())}function Z(n,t,e,r){this.name=n,this.schema=e,this.hook=Cn[n]?Cn[n].hook:v(null,{creating:[s,i],reading:[c,u],updating:[f,i],deleting:[d,i]}),this._tpf=t,this._collClass=r||en}function $(n,t,e,r){Z.call(this,n,t,e,r||rn)}function nn(n,t,e,r){function o(n,t,e,r){return i._promise(n,e,r)}var i=this;this.db=qn,this.mode=n,this.storeNames=t,this.idbtrans=null,this.on=v(this,["complete","error"],"abort"),this._reculock=0,this._blockedFuncs=[],this._psd=null,this.active=!0,this._dbschema=e,r&&(this.parent=r),this._tpf=o,this.tables=Object.create(Tn);for(var u=t.length-1;-1!==u;--u){var c=t[u],a=qn._tableFactory(n,e[c],o);this.tables[c]=a,this[c]||(this[c]=a)}}function tn(n,t,e){this._ctx={table:n,index:":id"===t?null:t,collClass:n._collClass,or:e}}function en(n,t){var e=null,r=null;if(t)try{e=t()}catch(o){try{throw new kn(o)}catch(i){r=i}}var u=n._ctx;this._ctx={table:u.table,index:u.index,isPrimKey:!u.index||u.table.schema.primKey.keyPath&&u.index===u.table.schema.primKey.name,range:e,op:"openCursor",dir:"next",unique:"",algorithm:null,filter:null,isMatch:null,offset:0,limit:1/0,error:r,or:u.or}}function rn(){en.apply(this,arguments)}function on(n,t){return n._cfg.version-t._cfg.version}function un(n,t,e,r,o,i){e.forEach(function(e){var u=qn._tableFactory(r,o[e],t);n.forEach(function(n){n[e]||(i?Object.defineProperty(n,e,{configurable:!0,enumerable:!0,get:function(){var n=J.PSD&&J.PSD.trans;return n&&n.db===qn?n.tables[e]:u}}):n[e]=u)})})}function cn(n){n.forEach(function(n){for(var t in n)n[t]instanceof Z&&delete n[t]})}function an(n,t,e,r,o,i){var c=J.PSD;i=i||u,n.onerror||(n.onerror=j(o)),t?n.onsuccess=g(function(u){var c=n.result;if(c){var a=function(){c["continue"]()};t(c,function(n){a=n},r,o)&&e(i(c.value),c,function(n){a=n}),a()}else r()},o,c):n.onsuccess=g(function(t){var o=n.result;if(o){var u=function(){o["continue"]()};e(i(o.value),o,function(n){u=n}),u()}else r()},o,c)}function sn(n){var t=[];return n.split(",").forEach(function(n){n=n.trim();var e=n.replace("&","").replace("++","").replace("*",""),r=0!==e.indexOf("[")?e:n.substring(n.indexOf("[")+1,n.indexOf("]")).split("+");t.push(new A(e,r||null,-1!==n.indexOf("&"),-1!==n.indexOf("*"),-1!==n.indexOf("++"),M(r),-1!==r.indexOf(".")))}),t}function fn(n,t){return Pn.cmp(n,t)}function hn(n,t){return fn(n,t)<0?n:t}function ln(n,t){return fn(n,t)>0?n:t}function dn(n,t){return Pn.cmp(n,t)}function pn(n,t){return Pn.cmp(t,n)}function vn(n,t){return t>n?-1:n===t?0:1}function yn(n,t){return n>t?-1:n===t?0:1}function mn(n,t){return n?t?function(){return n.apply(this,arguments)&&t.apply(this,arguments)}:n:t}function bn(){return navigator.userAgent.indexOf("Trident")>=0||navigator.userAgent.indexOf("MSIE")>=0}function gn(){if(qn.verno=Kn.version/10,qn._dbSchema=On={},jn=e(Kn.objectStoreNames,0),0!==jn.length){var n=Kn.transaction(F(jn),"readonly");jn.forEach(function(t){for(var e=n.objectStore(t),r=e.keyPath,o=r&&"string"==typeof r&&-1!==r.indexOf("."),i=new A(r,r||"",!1,!1,!!e.autoIncrement,r&&"string"!=typeof r,o),u=[],c=0;c<e.indexNames.length;++c){var a=e.index(e.indexNames[c]);r=a.keyPath,o=r&&"string"==typeof r&&-1!==r.indexOf(".");var s=new A(a.name,r,!!a.unique,!!a.multiEntry,!1,r&&"string"!=typeof r,o);u.push(s)}On[t]=new B(t,i,u,{})}),un([Cn],qn._transPromiseFactory,R(On),Fn,On)}}function wn(n,t){for(var r=t.db.objectStoreNames,o=0;o<r.length;++o)for(var i=r[o],u=t.objectStore(i),c=0;c<u.indexNames.length;++c){var a=u.indexNames[c],s=u.index(a).keyPath,f="string"==typeof s?s:"["+e(s).join("+")+"]";if(n[i]){var h=n[i].idxByName[f];h&&(h.name=a)}}}var _n=h&&h.addons||o.addons,xn=o.dependencies,Pn=xn.indexedDB,Sn=xn.IDBKeyRange,Dn=xn.TypeError,kn=xn.Error,On=this._dbSchema={},En=[],jn=[],Cn={},Tn={},Kn=null,In=!0,An=null,Bn=!1,Nn="readonly",Fn="readwrite",qn=this,Rn=[],Mn=!0,Un=!!q();this.version=function(n){if(Kn)throw new kn("Cannot add version when database is open");this.verno=Math.max(this.verno,n);var t=En.filter(function(t){return t._cfg.version===n})[0];return t?t:(t=new b(n),En.push(t),En.sort(on),t)},n(b.prototype,{stores:function(t){this._cfg.storesSource=this._cfg.storesSource?n(this._cfg.storesSource,t):t;var e={};En.forEach(function(t){n(e,t._cfg.storesSource)});var r=this._cfg.dbschema={};return this._parseStoresSpec(e,r),On=qn._dbSchema=r,cn([Cn,qn,Tn]),un([Tn],X,R(r),Fn,r),un([Cn,qn,this._cfg.tables],qn._transPromiseFactory,R(r),Fn,r,!0),jn=R(r),this},upgrade:function(n){var t=this;return H(function(){n(qn._createTransaction(Fn,R(t._cfg.dbschema),t._cfg.dbschema))}),this._cfg.contentUpgrade=n,this},_parseStoresSpec:function(n,t){R(n).forEach(function(e){if(null!==n[e]){var r={},o=sn(n[e]),i=o.shift();if(i.multi)throw new kn("Primary key cannot be multi-valued");i.keyPath&&x(r,i.keyPath,i.auto?0:i.keyPath),o.forEach(function(n){if(n.auto)throw new kn("Only primary key can be marked as autoIncrement (++)");if(!n.keyPath)throw new kn("Index must have a name and cannot be an empty string");x(r,n.keyPath,n.compound?n.keyPath.map(function(){return""}):"")}),t[e]=new B(e,i,o,r)}})}}),this._allTables=Cn,this._tableFactory=function(n,t,e){return n===Nn?new Z(t.name,e,t,en):new $(t.name,e,t)},this._createTransaction=function(n,t,e,r){return new nn(n,t,e,r)},this._transPromiseFactory=function(n,t,e){if(!In||J.PSD&&J.PSD.letThrough){var r=qn._createTransaction(n,t,On);return r._promise(n,function(n,t){r.error(function(n){qn.on("error").fire(n)}),J.newPSD(function(){J.PSD.trans=r,e(function(t){r.complete(function(){n(t)})},t,r)})})}Bn||qn.open();var o=new J(function(r,i){Rn.push({resume:function(){var u=qn._transPromiseFactory(n,t,e);o.onuncatched=u.onuncatched,u.then(r,i)}})});return o},this._whenReady=function(n){return Y||!In||J.PSD&&J.PSD.letThrough?new J(n):(Bn||qn.open(),new J(function(t,e){Rn.push({resume:function(){n(t,e)}})}))},this.verno=0,this.open=function(){return new J(function(n,t){function e(n){try{r.transaction.abort()}catch(e){}if(Kn)try{Kn.close()}catch(e){}Kn=null,Bn=!1,An=n,In=!1,t(An),Rn.forEach(function(n){n.resume()}),Rn=[]}if(Y&&n(qn),Kn)return void n(qn);if(Bn)return void qn._whenReady(function(){n(qn)},function(n){t(n)});var r,o=!1;try{if(An=null,Bn=!0,En.length>0&&(Mn=!1),!Pn)throw new kn("indexedDB API not found. If using IE10+, make sure to run your code on a server URL (not locally). If using Safari, make sure to include indexedDB polyfill.");if(r=Mn?Pn.open(a):Pn.open(a,Math.round(10*qn.verno)),!r)throw new kn("IndexedDB API not available");r.onerror=j(e,["opening database",a]),r.onblocked=function(n){qn.on("blocked").fire(n)},r.onupgradeneeded=g(function(n){if(Mn&&!qn._allowEmptyDB){r.onerror=function(n){n.preventDefault()},r.transaction.abort(),r.result.close();var t=Pn.deleteDatabase(a);t.onsuccess=t.onerror=function(){e(new kn("Database '"+a+"' doesnt exist"))}}else{0===n.oldVersion&&(o=!0),r.transaction.onerror=j(e);var i=n.oldVersion>Math.pow(2,62)?0:n.oldVersion;P(i/10,r.transaction,e,r)}},e),r.onsuccess=g(function(t){if(Bn=!1,Kn=r.result,Mn)gn();else if(Kn.objectStoreNames.length>0)try{wn(On,Kn.transaction(F(Kn.objectStoreNames),Nn))}catch(t){}Kn.onversionchange=qn.on("versionchange").fire,Un||K(function(n){return-1===n.indexOf(a)?n.push(a):void 0}),J.newPSD(function(){function t(){In=!1,Rn.forEach(function(n){n.resume()}),Rn=[],n(qn)}J.PSD.letThrough=!0;try{var r=qn.on.ready.fire();r&&"function"==typeof r.then?r.then(t,function(n){Kn.close(),Kn=null,e(n)}):m(t)}catch(o){e(o)}})},e)}catch(i){e(i)}})},this.close=function(){Kn&&(Kn.close(),Kn=null,In=!0,An=null)},this["delete"]=function(){var n=arguments;return new J(function(t,e){function r(){qn.close();var n=Pn.deleteDatabase(a);n.onsuccess=function(){Un||K(function(n){var t=n.indexOf(a);return t>=0?n.splice(t,1):void 0}),t()},n.onerror=j(e,["deleting",a]),n.onblocked=function(){qn.on("blocked").fire()}}if(n.length>0)throw new kn("Arguments not allowed in db.delete()");Bn?Rn.push({resume:r}):r()})},this.backendDB=function(){return Kn},this.isOpen=function(){return null!==Kn},this.hasFailed=function(){return null!==An},this.dynamicallyOpened=function(){return Mn},this.name=a,Object.defineProperty(this,"tables",{get:function(){return R(Cn).map(function(n){return Cn[n]})}}),this.on=v(this,"error","populate","blocked",{ready:[p,i],versionchange:[l,i]}),this.on.ready.subscribe=r(this.on.ready.subscribe,function(n){return function(t,e){function r(){return e||qn.on.ready.unsubscribe(r),t.apply(this,arguments)}n.call(this,r),qn.isOpen()&&(In?Rn.push({resume:r}):r())}}),H(function(){qn.on("populate").fire(qn._createTransaction(Fn,jn,On)),qn.on("error").fire(new kn)}),this.transaction=function(n,t,o){function i(t,e){var i=null;try{if(s)throw s;i=qn._createTransaction(n,f,On,u);var c=f.map(function(n){return i.tables[n]});c.push(i);var a,h=0;J.newPSD(function(){J.PSD.trans=i,i.scopeFunc=o,u&&(i.idbtrans=u.idbtrans,i._promise=r(i._promise,function(n){return function(t,e,r){function o(n){return function(t){var e;return J._rootExec(function(){e=n(t),J._tickFinalize(function(){0===--h&&i.active&&(i.active=!1,i.on.complete.fire())})}),e}}return++h,n.call(this,t,function(n,t,r){return e(o(n),o(t),r)},r)}})),i.complete(function(){t(a)}),i.error(function(n){i.idbtrans&&(i.idbtrans.onerror=T);try{i.abort()}catch(t){}u&&(u.active=!1,u.on.error.fire(n));var r=e(n);u||r||qn.on.error.fire(n)}),J._rootExec(function(){a=o.apply(i,c),a&&"function"==typeof a.next&&"function"==typeof a["throw"]&&(a=I(a))})}),(!i.idbtrans||u&&0===h)&&i._nop()}catch(l){i&&i.idbtrans&&(i.idbtrans.onerror=T),i&&i.abort(),u&&u.on.error.fire(l),m(function(){e(l)||qn.on("error").fire(l)})}}t=e(arguments,1,arguments.length-1),o=arguments[arguments.length-1];var u=J.PSD&&J.PSD.trans;u&&u.db===qn&&-1===n.indexOf("!")||(u=null);var c=-1!==n.indexOf("?");n=n.replace("!","").replace("?","");var a=M(t[0])?t.reduce(function(n,t){return n.concat(t)}):t,s=null,f=a.map(function(n){return"string"==typeof n?n:(n instanceof Z||(s=s||new Dn("Invalid type. Arguments following mode must be instances of Table or String")),n.name)});return"r"==n||n==Nn?n=Nn:"rw"==n||n==Fn?n=Fn:s=new kn("Invalid transaction mode: "+n),u&&(s||(u&&u.mode===Nn&&n===Fn&&(c?u=null:s=s||new kn("Cannot enter a sub-transaction with READWRITE mode when parent transaction is READONLY")),u&&f.forEach(function(n){u.tables.hasOwnProperty(n)||(c?u=null:s=s||new kn("Table "+n+" not included in parent transaction. Parent Transaction function: "+u.scopeFunc.toString()))}))),u?u._promise(n,i,"lock"):qn._whenReady(i)},this.table=function(n){if(Y&&Mn)return new $(n);if(!Cn.hasOwnProperty(n))throw new kn("Table does not exist");return Cn[n]},n(Z.prototype,function(){function n(){throw new kn("Current Transaction is READONLY")}return{_trans:function(n,t,e){return this._tpf(n,[this.name],t,e)},_idbstore:function(n,t,e){if(Y)return new J(t);var r=this;return this._tpf(n,[this.name],function(n,e,o){t(n,e,o.idbtrans.objectStore(r.name),o)},e)},get:function(n,t){var e=this;return this._idbstore(Nn,function(t,r,o){Y&&t(e.schema.instanceTemplate);var i=o.get(n);i.onerror=j(r,["getting",n,"from",e.name]),i.onsuccess=function(){t(e.hook.reading.fire(i.result))}}).then(t)},where:function(n){return new tn(this,n)},count:function(n){return this.toCollection().count(n)},offset:function(n){return this.toCollection().offset(n)},limit:function(n){return this.toCollection().limit(n)},reverse:function(){return this.toCollection().reverse()},filter:function(n){return this.toCollection().and(n)},each:function(n){var t=this;return Y&&n(t.schema.instanceTemplate),this._idbstore(Nn,function(e,r,o){var i=o.openCursor();i.onerror=j(r,["calling","Table.each()","on",t.name]),an(i,null,n,e,r,t.hook.reading.fire)})},toArray:function(n){var t=this;return this._idbstore(Nn,function(n,e,r){Y&&n([t.schema.instanceTemplate]);var o=[],i=r.openCursor();i.onerror=j(e,["calling","Table.toArray()","on",t.name]),an(i,null,function(n){o.push(n)},function(){n(o)},e,t.hook.reading.fire)}).then(n)},orderBy:function(n){return new this._collClass(new tn(this,n))},toCollection:function(){return new this._collClass(new tn(this))},mapToClass:function(n,t){this.schema.mappedClass=n;var e=Object.create(n.prototype);t&&E(e,t),this.schema.instanceTemplate=e;var r=function(t){if(!t)return t;var e=Object.create(n.prototype);for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r]);return e};return this.schema.readHook&&this.hook.reading.unsubscribe(this.schema.readHook),this.schema.readHook=r,this.hook("reading",r),n},defineClass:function(n){return this.mapToClass(o.defineClass(n),n)},add:n,put:n,"delete":n,clear:n,update:n}}),t($).from(Z).extend(function(){function n(n,t,e,r){return function(o){o.stopPropagation&&o.stopPropagation(),o.preventDefault&&o.preventDefault(),n.push(o.target.error),e&&e.onerror&&J.newPSD(function(){J.PSD.trans=r,e.onerror(o.target.error)}),t&&t(n)}}function t(n,t,e,r){return e?function(o){e.onsuccess&&J.newPSD(function(){J.PSD.trans=r,e.onsuccess(o.target.result)}),t&&t(n)}:function(){t(n)}}return{bulkAdd:function(e){var r=this.hook.creating.fire;return this._idbstore(Fn,function(o,u,c,a){if(!c.keyPath)throw new kn("bulkAdd() only support inbound keys");if(0===e.length)return o([]);var s,f,h,l=[];if(r!==i){var d=c.keyPath,p={onerror:null,onsuccess:null};f=n(l,null,p,a),h=t(l,null,p,a);for(var v=0,y=e.length;y>v;++v){var m=e[v],b=_(m,d),g=r.call(p,b,m,a);void 0===b&&void 0!==g&&(m=D(m),x(m,d,g)),s=c.add(m),y-1>v&&(s.onerror=f,p.onsuccess&&(s.onsuccess=h),p.onerror=null,p.onsuccess=null)}s.onerror=n(l,o,p,a),s.onsuccess=t(l,o,p,a)}else{f=n(l);for(var v=0,y=e.length;y>v;++v)s=c.add(e[v]),s.onerror=f;s.onerror=n(l,o),s.onsuccess=t(l,o)}})},add:function(n,t){var e=this,r=this.hook.creating.fire;return this._idbstore(Fn,function(o,u,c,a){var s={onsuccess:null,onerror:null};if(r!==i){var f=t||(c.keyPath?_(n,c.keyPath):void 0),h=r.call(s,f,n,a);void 0===f&&void 0!==h&&(c.keyPath?x(n,c.keyPath,h):t=h)}var l=void 0!==t?c.add(n,t):c.add(n);l.onerror=j(function(n){return s.onerror&&J.newPSD(function(){J.PSD.trans=a,s.onerror(n)}),u(n)},["adding",n,"into",e.name]),l.onsuccess=function(t){var e=c.keyPath;e&&x(n,e,t.target.result),s.onsuccess&&J.newPSD(function(){J.PSD.trans=a,s.onsuccess(t.target.result)}),o(l.result)}})},put:function(n,t){var e=this,r=this.hook.creating.fire,o=this.hook.updating.fire;return r!==i||o!==i?this._trans(Fn,function(r,o,i){var u=t||e.schema.primKey.keyPath&&_(n,e.schema.primKey.keyPath);void 0===u?i.tables[e.name].add(n).then(r,o):(i._lock(),n=D(n),i.tables[e.name].where(":id").equals(u).modify(function(t){this.value=n}).then(function(r){return 0===r?i.tables[e.name].add(n,t):u})["finally"](function(){i._unlock()}).then(r,o))}):this._idbstore(Fn,function(r,o,i){var u=void 0!==t?i.put(n,t):i.put(n);u.onerror=j(o,["putting",n,"into",e.name]),u.onsuccess=function(t){var e=i.keyPath;e&&x(n,e,t.target.result),r(u.result)}})},"delete":function(n){return this.hook.deleting.subscribers.length?this.where(":id").equals(n)["delete"]():this._idbstore(Fn,function(t,e,r){var o=r["delete"](n);o.onerror=j(e,["deleting",n,"from",r.name]),o.onsuccess=function(n){t(o.result)}})},clear:function(){return this.hook.deleting.subscribers.length?this.toCollection()["delete"]():this._idbstore(Fn,function(n,t,e){var r=e.clear();r.onerror=j(t,["clearing",e.name]),r.onsuccess=function(t){n(r.result)}})},update:function(n,t){if("object"!=typeof t||M(t))throw new kn("db.update(keyOrObject, modifications). modifications must be an object.");if("object"!=typeof n||M(n))return this.where(":id").equals(n).modify(t);R(t).forEach(function(e){x(n,e,t[e])});var e=_(n,this.schema.primKey.keyPath);return void 0===e&&J.reject(new kn("Object does not contain its primary key")),this.where(":id").equals(e).modify(t)}}}),n(nn.prototype,{_lock:function(){return++this._reculock,1===this._reculock&&J.PSD&&(J.PSD.lockOwnerFor=this),this},_unlock:function(){if(0===--this._reculock)for(J.PSD&&(J.PSD.lockOwnerFor=null);this._blockedFuncs.length>0&&!this._locked();){var n=this._blockedFuncs.shift();try{n()}catch(t){}}return this},_locked:function(){return this._reculock&&(!J.PSD||J.PSD.lockOwnerFor!==this)},_nop:function(n){this.tables[this.storeNames[0]].get(0).then(n)},_promise:function(n,t,e){var r=this;return J.newPSD(function(){var i;return r._locked()?i=new J(function(o,i){r._blockedFuncs.push(function(){r._promise(n,t,e).then(o,i)})}):(i=r.active?new J(function(i,u){if(!r.idbtrans&&n){if(!Kn)throw new kn(An?"Database not open. Following error in populate, ready or upgrade function made Dexie.open() fail: "+An:"Database not open");var c=r.idbtrans=Kn.transaction(F(r.storeNames),r.mode);c.onerror=function(n){r.on("error").fire(n&&n.target.error),n.preventDefault(),r.abort()},c.onabort=function(n){m(function(){r.on("error").fire(new kn("Transaction aborted for unknown reason"))}),r.active=!1,r.on("abort").fire(n)},c.oncomplete=function(n){r.active=!1,r.on("complete").fire(n)}}e&&r._lock();try{t(i,u,r)}catch(a){o.ignoreTransaction(function(){r.on("error").fire(a)}),r.abort();try{throw new kn(a)}catch(s){u(s)}}}):J.reject(C(new kn("Transaction is inactive. Original Scope Function Source: "+r.scopeFunc.toString()))),r.active&&e&&i["finally"](function(){r._unlock()})),i.onuncatched=function(n){o.ignoreTransaction(function(){r.on("error").fire(n)}),r.abort()},i})},complete:function(n){return this.on("complete",n)},error:function(n){return this.on("error",n)},abort:function(){if(this.idbtrans&&this.active)try{this.active=!1,this.idbtrans.abort(),this.on.error.fire(new kn("Transaction Aborted"))}catch(n){}},table:function(n){if(!this.tables.hasOwnProperty(n))throw new kn("Table "+n+" not in transaction");return this.tables[n]}}),n(tn.prototype,function(){function n(n,t,e){var r=n instanceof tn?new n._ctx.collClass(n):n;try{throw e?new e(t):new Dn(t)}catch(o){r._ctx.error=o}return r}function t(n){return new n._ctx.collClass(n,function(){return Sn.only("")}).limit(0)}function r(n){return e(1===n.length&&M(n[0])?n[0]:n)}function o(n){return"next"===n?function(n){return n.toUpperCase()}:function(n){return n.toLowerCase()}}function i(n){return"next"===n?function(n){return n.toLowerCase()}:function(n){return n.toUpperCase()}}function u(n,t,e,r,o,i){for(var u=Math.min(n.length,r.length),c=-1,a=0;u>a;++a){var s=t[a];if(s!==r[a])return o(n[a],e[a])<0?n.substr(0,a)+e[a]+e.substr(a+1):o(n[a],r[a])<0?n.substr(0,a)+r[a]+e.substr(a+1):c>=0?n.substr(0,c)+t[c]+e.substr(c+1):null;o(n[a],s)<0&&(c=a)}return u<r.length&&"next"===i?n+e.substr(n.length):u<n.length&&"prev"===i?n.substr(0,e.length):0>c?null:n.substr(0,c)+r[c]+e.substr(c+1)}function c(n,t,e,r){function c(n){a=o(n),s=i(n),f="next"===n?vn:yn;var t=e.map(function(n){return{lower:s(n),upper:a(n)}}).sort(function(n,t){return f(n.lower,t.lower)});h=t.map(function(n){return n.upper}),l=t.map(function(n){return n.lower}),d=n,p="next"===n?"":r}var a,s,f,h,l,d,p,v=e.length;c("next");var y=new n._ctx.collClass(n,function(){return Sn.bound(h[0],l[v-1]+r)});y._ondirectionchange=function(n){c(n)};var m=0;return y._addAlgorithm(function(n,e,r){var o=n.key;if("string"!=typeof o)return!1;var i=s(o);if(t(i,l,m))return!0;for(var c=null,a=m;v>a;++a){var y=u(o,i,h[a],l[a],f,d);null===y&&null===c?m=a+1:(null===c||f(c,y)>0)&&(c=y)}return e(null!==c?function(){n["continue"](c+p)}:r),!1}),y}return{between:function(e,r,o,i){o=o!==!1,i=i===!0;try{return fn(e,r)>0||0===fn(e,r)&&(o||i)&&(!o||!i)?t(this):new this._ctx.collClass(this,function(){return Sn.bound(e,r,!o,!i)})}catch(u){return n(this,z)}},equals:function(n){return new this._ctx.collClass(this,function(){return Sn.only(n)})},above:function(n){return new this._ctx.collClass(this,function(){return Sn.lowerBound(n,!0)})},aboveOrEqual:function(n){return new this._ctx.collClass(this,function(){return Sn.lowerBound(n)})},below:function(n){return new this._ctx.collClass(this,function(){return Sn.upperBound(n,!0)})},belowOrEqual:function(n){return new this._ctx.collClass(this,function(){return Sn.upperBound(n)})},startsWith:function(t){return"string"!=typeof t?n(this,"String expected"):this.between(t,t+L,!0,!0)},startsWithIgnoreCase:function(t){return"string"!=typeof t?n(this,"String expected"):""===t?this.startsWith(t):c(this,function(n,t){return 0===n.indexOf(t[0])},[t],L)},equalsIgnoreCase:function(t){return"string"!=typeof t?n(this,"String expected"):c(this,function(n,t){return n===t[0]},[t],"")},anyOfIgnoreCase:function(e){var o=r(arguments);return 0===o.length?t(this):o.every(function(n){return"string"==typeof n})?c(this,function(n,t){return-1!==t.indexOf(n)},o,""):n(this,"anyOfIgnoreCase() only works with strings")},startsWithAnyOfIgnoreCase:function(e){var o=r(arguments);return 0===o.length?t(this):o.every(function(n){return"string"==typeof n})?c(this,function(n,t){return t.some(function(t){return 0===n.indexOf(t)})},o,L):n(this,"anyOfIgnoreCase() only works with strings")},anyOf:function(e){var o=r(arguments),i=dn;try{o.sort(i)}catch(u){return n(this,z)}if(0===o.length)return t(this);var c=new this._ctx.collClass(this,function(){return Sn.bound(o[0],o[o.length-1])});c._ondirectionchange=function(n){i="next"===n?dn:pn,o.sort(i)};var a=0;return c._addAlgorithm(function(n,t,e){for(var r=n.key;i(r,o[a])>0;)if(++a,a===o.length)return t(e),!1;return 0===i(r,o[a])?!0:(t(function(){n["continue"](o[a])}),!1)}),c},notEqual:function(n){return this.inAnyRange([[-(1/0),n],[n,V]],{includeLowers:!1,includeUppers:!1})},noneOf:function(t){var e=r(arguments);if(0===e.length)return new this._ctx.collClass(this);try{e.sort(dn)}catch(o){return n(this,z)}var i=e.reduce(function(n,t){return n?n.concat([[n[n.length-1][1],t]]):[[-(1/0),t]]},null);return i.push([e[e.length-1],V]),this.inAnyRange(i,{includeLowers:!1,includeUppers:!1})},inAnyRange:function(e,r){function o(n,t){for(var e=0,r=n.length;r>e;++e){var o=n[e];if(fn(t[0],o[1])<0&&fn(t[1],o[0])>0){o[0]=hn(o[0],t[0]),o[1]=ln(o[1],t[1]);break}}return e===r&&n.push(t),n}function i(n,t){return h(n[0],t[0])}function u(n){return!p(n)&&!v(n)}var c=this._ctx;if(0===e.length)return t(this);if(!e.every(function(n){return void 0!==n[0]&&void 0!==n[1]&&dn(n[0],n[1])<=0}))return n(this,"First argument to inAnyRange() must be an Array of two-value Arrays [lower,upper] where upper must not be lower than lower",kn);var a,s=!r||r.includeLowers!==!1,f=r&&r.includeUppers===!0,h=dn;try{a=e.reduce(o,[]),a.sort(i)}catch(l){return n(this,z)}var d=0,p=f?function(n){return dn(n,a[d][1])>0}:function(n){return dn(n,a[d][1])>=0},v=s?function(n){return pn(n,a[d][0])>0}:function(n){return pn(n,a[d][0])>=0},y=p,m=new c.collClass(this,function(){return Sn.bound(a[0][0],a[a.length-1][1],!s,!f)});return m._ondirectionchange=function(n){"next"===n?(y=p,h=dn):(y=v,h=pn),a.sort(i)},m._addAlgorithm(function(n,t,e){for(var r=n.key;y(r);)if(++d,d===a.length)return t(e),!1;return u(r)?!0:0===fn(r,a[d][1])||0===fn(r,a[d][0])?!1:(t(function(){h===dn?n["continue"](a[d][0]):n["continue"](a[d][1])}),!1)}),m},startsWithAnyOf:function(e){var o=r(arguments);return o.every(function(n){return"string"==typeof n})?0===o.length?t(this):this.inAnyRange(o.map(function(n){return[n,n+L]})):n(this,"startsWithAnyOf() only works with strings")}}}),n(en.prototype,function(){function n(n,t){n.filter=mn(n.filter,t)}function t(n,t){n.isMatch=mn(n.isMatch,t)}function e(n,t){if(n.isPrimKey)return t;var e=n.table.schema.idxByName[n.index];if(!e)throw new kn("KeyPath "+n.index+" on object store "+t.name+" is not indexed");return n.isPrimKey?t:t.index(e.name)}function r(n,t){return e(n,t)[n.op](n.range||null,n.dir+n.unique)}function o(n,t,e,o,i){n.or?!function(){function u(){2===++f&&e()}function c(n,e,r){if(!a||a(e,r,u,o)){var i=e.primaryKey.toString();s.hasOwnProperty(i)||(s[i]=!0,t(n,e,r))}}var a=n.filter,s={},f=0;n.or._iterate(c,u,o,i),an(r(n,i),n.algorithm,c,u,o,n.table.hook.reading.fire)}():an(r(n,i),mn(n.algorithm,n.filter),t,e,o,n.table.hook.reading.fire)}function i(n){return n.table.schema.instanceTemplate}return{_read:function(n,t){var e=this._ctx;return e.error?e.table._trans(null,function(n,t){t(e.error)}):e.table._idbstore(Nn,n).then(t)},_write:function(n){var t=this._ctx;return t.error?t.table._trans(null,function(n,e){e(t.error)}):t.table._idbstore(Fn,n,"locked")},_addAlgorithm:function(n){var t=this._ctx;t.algorithm=mn(t.algorithm,n)},_iterate:function(n,t,e,r){return o(this._ctx,n,t,e,r)},each:function(n){var t=this._ctx;return Y&&n(i(t)),this._read(function(e,r,i){o(t,n,e,r,i)})},count:function(n){if(Y)return J.resolve(0).then(n);var t=this,r=this._ctx;if(r.filter||r.algorithm||r.or){var i=0;return this._read(function(n,t,e){o(r,function(){return++i,!1},function(){n(i)},t,e)},n)}return this._read(function(n,o,i){var u=e(r,i),c=r.range?u.count(r.range):u.count();c.onerror=j(o,["calling","count()","on",t.name]),c.onsuccess=function(t){n(Math.min(t.target.result,Math.max(0,r.limit-r.offset)))}},n)},sortBy:function(n,t){function e(n,t){return t?e(n[o[t]],t-1):n[i]}function r(n,t){var r=e(n,u),o=e(t,u);return o>r?-c:r>o?c:0}var o=n.split(".").reverse(),i=o[0],u=o.length-1,c="next"===this._ctx.dir?1:-1;return this.toArray(function(n){return n.sort(r)}).then(t)},toArray:function(n){var t=this._ctx;return this._read(function(n,e,r){Y&&n([i(t)]);var u=[];o(t,function(n){u.push(n)},function(){n(u)},e,r)},n)},offset:function(t){var e=this._ctx;return 0>=t?this:(e.offset+=t,e.or||e.algorithm||e.filter?n(e,function(n,e,r){return--t<0}):n(e,function(n,e,r){return 0===t?!0:1===t?(--t,!1):(e(function(){n.advance(t),t=0}),!1)}),this)},limit:function(t){return this._ctx.limit=Math.min(this._ctx.limit,t),n(this._ctx,function(n,e,r){return--t<=0&&e(r),t>=0}),this},until:function(t,e){var r=this._ctx;return Y&&t(i(r)),n(this._ctx,function(n,r,o){return t(n.value)?(r(o),e):!0}),this},first:function(n){return this.limit(1).toArray(function(n){return n[0]}).then(n)},last:function(n){return this.reverse().first(n)},and:function(e){return Y&&e(i(this._ctx)),n(this._ctx,function(n){return e(n.value)}),t(this._ctx,e),this},or:function(n){return new tn(this._ctx.table,n,this)},reverse:function(){return this._ctx.dir="prev"===this._ctx.dir?"next":"prev",this._ondirectionchange&&this._ondirectionchange(this._ctx.dir),this},desc:function(){return this.reverse()},eachKey:function(n){var t=this._ctx;return Y&&n(_(i(this._ctx),this._ctx.index?this._ctx.table.schema.idxByName[this._ctx.index].keyPath:this._ctx.table.schema.primKey.keyPath)),t.isPrimKey||(t.op="openKeyCursor"),this.each(function(t,e){n(e.key,e)})},eachUniqueKey:function(n){return this._ctx.unique="unique",this.eachKey(n)},keys:function(n){var t=this._ctx;t.isPrimKey||(t.op="openKeyCursor");var e=[];return Y?new J(this.eachKey.bind(this)).then(function(n){return[n]}).then(n):this.each(function(n,t){e.push(t.key)}).then(function(){return e}).then(n)},uniqueKeys:function(n){return this._ctx.unique="unique",this.keys(n)},firstKey:function(n){return this.limit(1).keys(function(n){return n[0]}).then(n)},lastKey:function(n){return this.reverse().firstKey(n)},distinct:function(){var t={};return n(this._ctx,function(n){var e=n.primaryKey.toString(),r=t.hasOwnProperty(e);return t[e]=!0,!r}),this}}}),t(rn).from(en).extend({modify:function(t){var e=this,r=this._ctx,o=r.table.hook,u=o.updating.fire,c=o.deleting.fire;return Y&&"function"==typeof t&&t.call({value:r.table.schema.instanceTemplate},r.table.schema.instanceTemplate),this._write(function(o,a,s,f){function h(n,t,e){function o(n){return O.push(n),E.push(i.primKey),i.onerror&&J.newPSD(function(){J.PSD.trans=f,i.onerror(n)}),d(),!0}C=t.primaryKey;var i={primKey:t.primaryKey,value:n,onsuccess:null,onerror:null};if(p.call(i,n)!==!1){var u=!i.hasOwnProperty("value");++b,w(function(){var e=u?t["delete"]():t.update(i.value);e.onerror=j(o,u?["deleting",n,"from",r.table.name]:["modifying",n,"on",r.table.name]),e.onsuccess=function(n){i.onsuccess&&J.newPSD(function(){J.PSD.trans=f,i.onsuccess(i.value)}),++g,d()}},o)}else i.onsuccess&&i.onsuccess(i.value)}function l(n){return n&&(O.push(n),E.push(C)),a(new N("Error modifying one or more objects",O,g,E))}function d(){P&&g+O.length===b&&(O.length>0?l():o(g))}var p;if("function"==typeof t)p=u===i&&c===i?t:function(n){var e=D(n);if(t.call(this,n)===!1)return!1;
if(this.hasOwnProperty("value")){var r=k(e,this.value),o=u.call(this,r,this.primKey,e,f);o&&(n=this.value,R(o).forEach(function(t){x(n,t,o[t])}))}else c.call(this,this.primKey,n,f)};else if(u===i){var v=R(t),y=v.length;p=function(n){for(var e=!1,r=0;y>r;++r){var o=v[r],i=t[o];_(n,o)!==i&&(x(n,o,i),e=!0)}return e}}else{var m=t;t=S(m),p=function(e){var r=!1,o=u.call(this,t,this.primKey,D(e),f);return o&&n(t,o),R(t).forEach(function(n){var o=t[n];_(e,n)!==o&&(x(e,n,o),r=!0)}),o&&(t=S(m)),r}}var b=0,g=0,P=!1,O=[],E=[],C=null;e._iterate(h,function(){P=!0,d()},l,s)})},"delete":function(){return this.modify(function(){delete this.value})}}),n(this,{Collection:en,Table:Z,Transaction:nn,Version:b,WhereClause:tn,WriteableCollection:rn,WriteableTable:$}),y(),_n.forEach(function(n){n(qn)})}function i(){}function u(n){return n}function c(n,t){return n===u?t:function(e){return t(n(e))}}function a(n,t){return function(){n.apply(this,arguments),t.apply(this,arguments)}}function s(n,t){return n===i?t:function(){var e=n.apply(this,arguments);void 0!==e&&(arguments[0]=e);var r=this.onsuccess,o=this.onerror;this.onsuccess=null,this.onerror=null;var i=t.apply(this,arguments);return r&&(this.onsuccess=this.onsuccess?a(r,this.onsuccess):r),o&&(this.onerror=this.onerror?a(o,this.onerror):o),void 0!==i?i:e}}function f(t,e){return t===i?e:function(){var r=t.apply(this,arguments);void 0!==r&&n(arguments[0],r);var o=this.onsuccess,i=this.onerror;this.onsuccess=null,this.onerror=null;var u=e.apply(this,arguments);return o&&(this.onsuccess=this.onsuccess?a(o,this.onsuccess):o),i&&(this.onerror=this.onerror?a(i,this.onerror):i),void 0===r?void 0===u?void 0:u:void 0===u?r:n(r,u)}}function h(n,t){return n===i?t:function(){return n.apply(this,arguments)===!1?!1:t.apply(this,arguments)}}function l(n,t){return n===i?t:function(){return t.apply(this,arguments)===!1?!1:n.apply(this,arguments)}}function d(n,t){return n===i?t:function(){n.apply(this,arguments),t.apply(this,arguments)}}function p(n,t){return n===i?t:function(){var e=n.apply(this,arguments);if(e&&"function"==typeof e.then){var r=this,o=arguments;return e.then(function(){return t.apply(r,o)})}return t.apply(this,arguments)}}function v(n,t){function r(n,t,e){if(M(n))return u(n);if("object"==typeof n)return o(n);t||(t=h),e||(e=i);var r={subscribers:[],fire:e,subscribe:function(n){r.subscribers.push(n),r.fire=t(r.fire,n)},unsubscribe:function(n){r.subscribers=r.subscribers.filter(function(t){return t!==n}),r.fire=r.subscribers.reduce(t,e)}};return a[n]=s[n]=r,r}function o(n){R(n).forEach(function(t){var e=n[t];if(M(e))r(t,n[t][0],n[t][1]);else{if("asap"!==e)throw new Error("Invalid event config");var o=r(t,null,function(){var n=arguments;o.subscribers.forEach(function(t){m(function(){t.apply(W,n)})})});o.subscribe=function(n){-1===o.subscribers.indexOf(n)&&o.subscribers.push(n)},o.unsubscribe=function(n){var t=o.subscribers.indexOf(n);-1!==t&&o.subscribers.splice(t,1)}}})}function u(n){function t(){return e?!1:void(e=!0)}var e=!1;n.forEach(function(n){r(n).subscribe(t)})}var c=arguments,a={},s=function(t,r){if(r){var o=e(arguments,1),i=a[t];return i.subscribe.apply(i,o),n}return"string"==typeof t?a[t]:void 0};s.addEventType=r;for(var f=1,l=c.length;l>f;++f)r(c[f]);return s}function y(n){if(!n)throw new Error("Assertion failed")}function m(n){W.setImmediate?setImmediate(n):setTimeout(n,0)}function b(n){var t=setTimeout(n,1e3);clearTimeout(t)}function g(n,t,e){return function(){var r=J.PSD;J.PSD=e;try{n.apply(this,arguments)}catch(o){t(o)}finally{J.PSD=r}}}function w(n,t){try{n()}catch(e){t(e)}}function _(n,t){if(n.hasOwnProperty(t))return n[t];if(!t)return n;if("string"!=typeof t){for(var e=[],r=0,o=t.length;o>r;++r){var i=_(n,t[r]);e.push(i)}return e}var u=t.indexOf(".");if(-1!==u){var c=n[t.substr(0,u)];return void 0===c?void 0:_(c,t.substr(u+1))}}function x(n,t,e){if(n&&void 0!==t&&!("isFrozen"in Object&&Object.isFrozen(n)))if("string"!=typeof t&&"length"in t){y("string"!=typeof e&&"length"in e);for(var r=0,o=t.length;o>r;++r)x(n,t[r],e[r])}else{var i=t.indexOf(".");if(-1!==i){var u=t.substr(0,i),c=t.substr(i+1);if(""===c)void 0===e?delete n[u]:n[u]=e;else{var a=n[u];a||(a=n[u]={}),x(a,c,e)}}else void 0===e?delete n[t]:n[t]=e}}function P(n,t){"string"==typeof t?x(n,t,void 0):"length"in t&&[].map.call(t,function(t){x(n,t,void 0)})}function S(n){var t={};for(var e in n)n.hasOwnProperty(e)&&(t[e]=n[e]);return t}function D(n){if(!n||"object"!=typeof n)return n;var t;if(M(n)){t=[];for(var e=0,r=n.length;r>e;++e)t.push(D(n[e]))}else if(n instanceof Date)t=new Date,t.setTime(n.getTime());else{t=n.constructor?Object.create(n.constructor.prototype):{};for(var o in n)n.hasOwnProperty(o)&&(t[o]=D(n[o]))}return t}function k(n,t){var e={};for(var r in n)n.hasOwnProperty(r)&&(t.hasOwnProperty(r)?n[r]!==t[r]&&JSON.stringify(n[r])!=JSON.stringify(t[r])&&(e[r]=t[r]):e[r]=void 0);for(var r in t)t.hasOwnProperty(r)&&!n.hasOwnProperty(r)&&(e[r]=t[r]);return e}function O(n){if("function"==typeof n)return new n;if(M(n))return[O(n[0])];if(n&&"object"==typeof n){var t={};return E(t,n),t}return n}function E(n,t){return R(t).forEach(function(e){var r=O(t[e]);n[e]=r}),n}function j(n,t){return function(e){var r=e&&e.target.error||new Error;if(t){var o=" occurred when "+t.map(function(n){switch(typeof n){case"function":return n();case"string":return n;default:return JSON.stringify(n)}}).join(" ");r.name?r.toString=function(){return r.name+o+(r.message?". "+r.message:"")}:r+=o}return n(r),e&&(e.stopPropagation&&e.stopPropagation(),e.preventDefault&&e.preventDefault()),!1}}function C(n){try{throw n}catch(t){return t}}function T(n){n.preventDefault()}function K(n){var t,e=o.dependencies.localStorage;if(!e)return n([]);try{t=JSON.parse(e.getItem("Dexie.DatabaseNames")||"[]")}catch(r){t=[]}n(t)&&e.setItem("Dexie.DatabaseNames",JSON.stringify(t))}function I(n){function t(n){return function(t){var r=n(t),o=r.value;return r.done?o:o&&"function"==typeof o.then?o.then(i,u):Array.isArray(o)?e(o,0):i(o)}}function e(n,t){if(t===n.length)return i(n);var r=n[t];return r.constructor&&"function"==typeof r.constructor.all?r.constructor.all(n).then(i,u):e(n,t+1)}var r=function(t){return n.next(t)},o=function(t){return n["throw"](t)},i=t(r),u=t(o);return t(r)()}function A(n,t,e,r,o,i,u){this.name=n,this.keyPath=t,this.unique=e,this.multi=r,this.auto=o,this.compound=i,this.dotted=u;var c="string"==typeof t?t:t&&"["+[].join.call(t,"+")+"]";this.src=(e?"&":"")+(r?"*":"")+(o?"++":"")+c}function B(n,t,e,r){this.name=n,this.primKey=t||new A,this.indexes=e||[new A],this.instanceTemplate=r,this.mappedClass=null,this.idxByName=e.reduce(function(n,t){return n[t.name]=t,n},{})}function N(n,t,e,r){this.name="ModifyError",this.failures=t,this.failedKeys=r,this.successCount=e,this.message=t.join("\n")}function F(n){return 1===n.length?n[0]:n}function q(){var n=o.dependencies.indexedDB,t=n&&(n.getDatabaseNames||n.webkitGetDatabaseNames);return t&&t.bind(n)}var R=Object.keys,M=Array.isArray,U=[].slice;if("undefined"==typeof W)var W=self||window;var L=String.fromCharCode(65535),V=function(){try{return IDBKeyRange.only([[]]),[[]]}catch(n){return L}}(),z="Invalid key provided. Keys must be of type string, number, Date or Array<string | number | Date>.",J=function(){function n(n,t){m.push([n,e(arguments,1)])}function t(){var n=m;m=[];for(var t=0,e=n.length;e>t;++t){var r=n[t];r[0].apply(W,r[1])}}function r(n){if("object"!=typeof this)throw new TypeError("Promises must be constructed via new");if("function"!=typeof n)throw new TypeError("not a function");this._state=null,this._value=null,this._deferreds=[],this._catched=!1;var t=this,e=!0;this._PSD=r.PSD;try{l(this,n,function(n){e?p(a,t,n):a(t,n)},function(n){return e?(p(s,t,n),!1):s(t,n)})}finally{e=!1}}function o(e,o){if(null===e._state)return void e._deferreds.push(o);var i=e._state?o.onFulfilled:o.onRejected;if(null===i)return(e._state?o.resolve:o.reject)(e._value);var u,a=y;y=!1,p=n;try{var s=r.PSD;r.PSD=e._PSD,u=i(e._value),e._state||u&&"function"==typeof u.then&&u._state===!1||c(e),o.resolve(u)}catch(f){var h=o.reject(f);if(!h&&e.onuncatched)try{e.onuncatched(f)}catch(f){}}finally{if(r.PSD=s,a){do{for(;m.length>0;)t();var l=g.pop();if(l)try{l()}catch(f){}}while(g.length>0||m.length>0);p=d,y=!0}}}function u(e){var r=y;y=!1,p=n;try{e()}finally{if(r){do{for(;m.length>0;)t();var o=g.pop();if(o)try{o()}catch(i){}}while(g.length>0||m.length>0);p=d,y=!0}}}function c(n){n._catched=!0,n._parent&&c(n._parent)}function a(n,t){var e=r.PSD;r.PSD=n._PSD;try{if(t===n)throw new TypeError("A promise cannot be resolved with itself.");if(t&&("object"==typeof t||"function"==typeof t)&&"function"==typeof t.then)return void l(n,function(n,e){t.then(n,e)},function(t){a(n,t)},function(t){s(n,t)});n._state=!0,n._value=t,f.call(n)}catch(o){s(o)}finally{r.PSD=e}}function s(n,t){var e=r.PSD;if(r.PSD=n._PSD,n._state=!1,n._value=t,f.call(n),!n._catched)try{n.onuncatched&&n.onuncatched(n._value),r.on.error.fire(n._value)}catch(o){}return r.PSD=e,n._catched}function f(){for(var n=0,t=this._deferreds.length;t>n;n++)o(this,this._deferreds[n]);this._deferreds=[]}function h(n,t,e,r){this.onFulfilled="function"==typeof n?n:null,this.onRejected="function"==typeof t?t:null,this.resolve=e,this.reject=r}function l(n,t,e,r){var o=!1;try{t(function(n){o||(o=!0,e(n))},function(t){return o?n._catched:(o=!0,r(t))})}catch(i){if(o)return;return r(i)}}var d=W.setImmediate||function(n){var t=e(arguments,1);setTimeout(function(){n.apply(W,t)},0)};b(function(){d=p=n=function(n){var t=arguments;setTimeout(function(){n.apply(W,e(t,1))},0)}});var p=d,y=!0,m=[],g=[];return r.on=v(null,"error"),r.all=function(){var n=e(1===arguments.length&&M(arguments[0])?arguments[0]:arguments);return new r(function(t,e){function r(i,u){try{if(u&&("object"==typeof u||"function"==typeof u)){var c=u.then;if("function"==typeof c)return void c.call(u,function(n){r(i,n)},e)}n[i]=u,0===--o&&t(n)}catch(a){e(a)}}if(0===n.length)return t([]);for(var o=n.length,i=0;i<n.length;i++)r(i,n[i])})},r.prototype.then=function(n,t){var e=this,i=new r(function(r,i){null===e._state?o(e,new h(n,t,r,i)):p(o,e,new h(n,t,r,i))});return i._PSD=this._PSD,i.onuncatched=this.onuncatched,i._parent=this,i},r.prototype._then=function(n,t){o(this,new h(n,t,i,i))},r.prototype["catch"]=function(n){if(1===arguments.length)return this.then(null,n);var t=arguments[0],e=arguments[1];return"function"==typeof t?this.then(null,function(n){return n instanceof t?e(n):r.reject(n)}):this.then(null,function(n){return n&&n.name===t?e(n):r.reject(n)})},r.prototype["finally"]=function(n){return this.then(function(t){return n(),t},function(t){return n(),r.reject(t)})},r.prototype.onuncatched=null,r.resolve=function(n){if(n&&"function"==typeof n.then)return n;var t=new r(function(){});return t._state=!0,t._value=n,t},r.reject=function(n){var t=new r(function(){});return t._state=!1,t._value=n,t},r.race=function(n){return new r(function(t,e){n.map(function(n){n.then(t,e)})})},r.PSD=null,r.newPSD=function(n){var t=r.PSD;r.PSD=t?Object.create(t):{};try{return n()}finally{r.PSD=t}},r._rootExec=u,r._tickFinalize=function(n){if(y)throw new Error("Not in a virtual tick");g.push(n)},r}(),H=function(){},Y=!1;t(N).from(Error),o["delete"]=function(n){var t=new o(n),e=t["delete"]();return e.onblocked=function(n){return t.on("blocked",n),this},e},o.exists=function(n){return new o(n).open().then(function(n){return n.close(),!0},function(){return!1})},o.getDatabaseNames=function(n){return new J(function(n,t){var r=q();if(r){var o=r();o.onsuccess=function(t){n(e(t.target.result,0))},o.onerror=j(t)}else K(function(t){return n(t),!1})}).then(n)},o.defineClass=function(t){function e(e){e?n(this,e):Y&&E(this,t)}return e},o.applyStructure=E,o.ignoreTransaction=function(n){return J.newPSD(function(){return J.PSD.trans=null,n()})},o.vip=function(n){return J.newPSD(function(){return J.PSD.letThrough=!0,n()})},o.async=function(n){return function(){try{var t=I(n.apply(this,arguments));return t&&"function"==typeof t.then?t:o.Promise.resolve(t)}catch(e){return o.Promise.reject(e)}}},o.spawn=function(n,t,e){try{var r=I(n.apply(e,t||[]));return r&&"function"==typeof r.then?r:o.Promise.resolve(r)}catch(i){return o.Promise.reject(i)}},Object.defineProperty(o,"currentTransaction",{get:function(){return J.PSD&&J.PSD.trans||null}}),o.Promise=J,o.derive=t,o.extend=n,o.override=r,o.events=v,o.getByKeyPath=_,o.setByKeyPath=x,o.delByKeyPath=P,o.shallowClone=S,o.deepClone=D,o.addons=[],o.fakeAutoComplete=H,o.asap=m,o.ModifyError=N,o.MultiModifyError=N,o.IndexSpec=A,o.TableSchema=B,o.MaxKey=V;var G=W.idbModules&&W.idbModules.shimIndexedDB?W.idbModules:{};return o.dependencies={indexedDB:G.shimIndexedDB||W.indexedDB||W.mozIndexedDB||W.webkitIndexedDB||W.msIndexedDB,IDBKeyRange:G.IDBKeyRange||W.IDBKeyRange||W.webkitIDBKeyRange,Error:W.Error||String,SyntaxError:W.SyntaxError||String,TypeError:W.TypeError||String,localStorage:null!=("undefined"!=typeof chrome&&null!==chrome?chrome.storage:void 0)?null:W.localStorage},o.semVer="1.3.2",o.version=o.semVer.split(".").map(function(n){return parseInt(n)}).reduce(function(n,t,e){return n+t/Math.pow(10,2*e)}),b(function(){o.fakeAutoComplete=H=b,o.fake=Y=!0}),o["default"]=o,o});
//# sourceMappingURL=dist/dexie.min.js.map
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CacheEntry = CacheEntry;

var _comment = require('./comment');

var _dateTime = require('./date-time');

function CacheEntry() {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  _comment.Comment.call(this, opts.comment);
  _dateTime.DateTime.call(this, 'expires', opts.expires, true);
  _dateTime.DateTime.call(this, 'lastAccess', opts.expires, true);

  Object.defineProperty(this, 'eTag', {
    enumerable: true,
    writable: true,
    value: opts.eTag
  });

  Object.defineProperty(this, 'hitCount', {
    enumerable: true,
    writable: true,
    value: opts.hitCount
  });
}

},{"./comment":2,"./date-time":6}],2:[function(require,module,exports){
'use strict';

// jshint unused:false

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Comment = Comment;
function Comment(comment) {
  Object.defineProperty(this, 'comment', {
    enumerable: true,
    writable: true,
    value: comment
  });
}

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Content = Content;

var _comment = require('./comment');

var _util = require('./util');

// jshint unused:false
function Content() {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  _comment.Comment.call(this, opts.comment);

  Object.defineProperty(this, 'size', {
    enumerable: true,

    get: function get() {
      if (this.text) {
        return _util.util.str2ab(this.text).byteLength;
      }

      return 0;
    },

    set: function set() {
      throw Error('not allowed');
    }
  });

  Object.defineProperty(this, 'compression', {
    enumerable: true,
    writable: true,
    value: opts.compression
  });

  Object.defineProperty(this, 'mimeType', {
    enumerable: true,
    writable: true,
    value: opts.mimeType || 'application/octet-stream'
  });

  Object.defineProperty(this, 'encoding', {
    enumerable: true,
    writable: true,
    value: opts.encoding
  });

  Object.defineProperty(this, 'text', {
    enumerable: true,
    writable: true,
    value: opts.text
  });
}

},{"./comment":2,"./util":16}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Cookie = Cookie;

var _comment = require('./comment');

var _dateTime = require('./date-time');

// jshint unused:false
function Cookie() {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  if (!opts.name || !opts.value) {
    throw new Error('missing required fields');
  }

  _comment.Comment.call(this, opts.comment);
  _dateTime.DateTime.call(this, 'expires', opts.expires, true);

  Object.defineProperty(this, 'name', {
    enumerable: true,
    writable: true,
    value: opts.name
  });

  Object.defineProperty(this, 'value', {
    enumerable: true,
    writable: true,
    value: opts.value
  });

  Object.defineProperty(this, 'path', {
    enumerable: true,
    writable: true,
    value: opts.path
  });

  Object.defineProperty(this, 'domain', {
    enumerable: true,
    writable: true,
    value: opts.domain
  });

  Object.defineProperty(this, 'httpOnly', {
    enumerable: true,
    writable: true,
    value: typeof opts.httpOnly === 'boolean' ? opts.httpOnly : false
  });

  Object.defineProperty(this, 'secure', {
    enumerable: true,
    writable: true,
    value: typeof opts.secure === 'boolean' ? opts.secure : false
  });
}

},{"./comment":2,"./date-time":6}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Creator = Creator;

var _comment = require('./comment');

var _version = require('./version');

// jshint unused:false
function Creator() {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  if (!opts.name) {
    throw new Error('name required');
  }

  _comment.Comment.call(this, opts.comment);
  _version.Version.call(this, opts.version);

  Object.defineProperty(this, 'name', {
    enumerable: true,
    writable: true,
    value: opts.name
  });
}

},{"./comment":2,"./version":17}],6:[function(require,module,exports){
'use strict';

// jshint unused:false

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DateTime = DateTime;
function DateTime(name, value) {
  var date = new Date();

  switch (Object.prototype.toString.call(value)) {
    case '[object Undefined]':
      date = undefined;
      break;

    case '[object Date]':
      date = value;
      break;

    case '[object String]':
      date.setTime(Date.parse(value));
      break;

    case '[object Number]':
      date.setTime(value);
      break;
  }

  Object.defineProperty(this, name || 'dateTime', {
    enumerable: true,
    writable: true,
    value: date ? date.toISOString() : undefined
  });
}

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Entry = Entry;

var _cacheEntry = require('./cache-entry');

var _comment = require('./comment');

var _dateTime = require('./date-time');

var _request = require('./request');

var _response = require('./response');

// jshint unused:false
function Entry() {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  if (!opts.startedDateTime || !opts.request || !opts.response) {
    throw new Error('missing required fields');
  }

  opts.cache = opts.cache || {};
  opts.timings = opts.timings || {};

  _comment.Comment.call(this, opts.comment);
  _dateTime.DateTime.call(this, 'startedDateTime', opts.startedDateTime);

  Object.defineProperty(this, 'pageref', {
    enumerable: true,
    writable: true,
    value: opts.pageref
  });

  Object.defineProperty(this, 'time', {
    enumerable: true,
    writable: true,
    value: opts.time !== undefined ? opts.time : -1
  });

  Object.defineProperty(this, 'connection', {
    enumerable: true,
    writable: true,
    value: opts.connection
  });

  Object.defineProperty(this, 'serverIPAddress', {
    enumerable: true,
    writable: true,
    value: opts.serverIPAddress
  });

  Object.defineProperty(this, 'timings', {
    enumerable: true,
    writable: true,
    value: {
      blocked: opts.timings.blocked !== undefined ? opts.timings.blocked : -1,
      connect: opts.timings.connect !== undefined ? opts.timings.connect : -1,
      dns: opts.timings.dns !== undefined ? opts.timings.dns : -1,
      receive: opts.timings.receive !== undefined ? opts.timings.receive : -1,
      send: opts.timings.send !== undefined ? opts.timings.send : -1,
      wait: opts.timings.wait !== undefined ? opts.timings.wait : -1,
      comment: opts.timings.comment
    }
  });

  Object.defineProperty(this, 'cache', {
    enumerable: true,
    writable: true,
    value: {
      beforeRequest: opts.cache.beforeRequest ? opts.cache.beforeRequest instanceof _cacheEntry.CacheEntry ? opts.cache.beforeRequest : new _cacheEntry.CacheEntry(opts.cache.beforeRequest) : null,
      afterRequest: opts.cache.afterRequest ? opts.cache.afterRequest instanceof _cacheEntry.CacheEntry ? opts.cache.afterRequest : new _cacheEntry.CacheEntry(opts.cache.afterRequest) : null,
      comment: opts.cache.comment
    }
  });

  Object.defineProperty(this, 'request', {
    enumerable: true,

    get: function get() {
      return this._request;
    },

    set: function set(value) {
      value = value instanceof _request.Request ? value : new _request.Request(value);
      this._request = value;
    }
  });

  Object.defineProperty(this, 'response', {
    enumerable: true,

    get: function get() {
      return this._response;
    },

    set: function set(value) {
      value = value instanceof _response.Response ? value : new _response.Response(value);
      this._response = value;
    }
  });
  if (opts.request) {
    this.request = opts.request;
  } else if (opts._request) {
    this.request = opts._request;
  }
  if (opts.response) {
    this.response = opts.response;
  } else if (opts._response) {
    this.response = opts._response;
  }
}
/**
 * Associate existing page with this Entry object.
 */
Entry.prototype.setPage = function (page) {
  if (!page || !page.id) {
    throw new Error('The page does not have id property.');
  }
  this.pageref = page.id;
};
/**
 * Override toJSON behaviour so it will eliminate
 * all _* properies and replace it with a proper ones.
 */
Entry.prototype.toJSON = function () {
  var copy = Object.assign({}, this);
  var keys = Object.keys(copy);
  var under = keys.filter(function (key) {
    return key.indexOf('_') === 0;
  });
  under.forEach(function (key) {
    var realKey = key.substr(1);
    copy[realKey] = copy[key];
    delete copy[key];
  });
  return copy;
};

},{"./cache-entry":1,"./comment":2,"./date-time":6,"./request":14,"./response":15}],8:[function(require,module,exports){
'use strict';

var _cacheEntry = require('./cache-entry');

var _comment = require('./comment');

var _content = require('./content');

var _cookie = require('./cookie');

var _creator = require('./creator');

var _dateTime = require('./date-time');

var _entry = require('./entry');

var _log = require('./log');

var _page = require('./page');

var _pair = require('./pair');

var _param = require('./param');

var _postData = require('./post-data');

var _request = require('./request');

var _response = require('./response');

var _version = require('./version');

// jshint unused:false
var HAR = {
  Browser: _creator.Creator,
  CacheEntry: _cacheEntry.CacheEntry,
  Comment: _comment.Comment,
  Content: _content.Content,
  Cookie: _cookie.Cookie,
  Creator: _creator.Creator,
  DateTime: _dateTime.DateTime,
  Entry: _entry.Entry,
  Header: _pair.Pair,
  Log: _log.Log,
  Page: _page.Page,
  Param: _param.Param,
  PostData: _postData.PostData,
  Query: _pair.Pair,
  Request: _request.Request,
  Response: _response.Response,
  Version: _version.Version
};
module.exports = HAR;
window.HAR = HAR;

},{"./cache-entry":1,"./comment":2,"./content":3,"./cookie":4,"./creator":5,"./date-time":6,"./entry":7,"./log":9,"./page":10,"./pair":11,"./param":12,"./post-data":13,"./request":14,"./response":15,"./version":17}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Log = Log;

var _comment = require('./comment');

var _creator = require('./creator');

var _entry = require('./entry');

var _page = require('./page');

var _version = require('./version');

function Log() {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  // internal properties
  Object.defineProperties(this, {
    _pages: {
      enumerable: false,
      configurable: false,
      writable: true,
      value: []
    },

    _entries: {
      enumerable: false,
      configurable: false,
      writable: true,
      value: []
    }
  });

  _comment.Comment.call(this, opts.comment);
  _version.Version.call(this, opts.version);

  Object.defineProperty(this, 'creator', {
    enumerable: true,
    value: opts.creator instanceof _creator.Creator ? opts.creator : new _creator.Creator(opts.creator)
  });

  Object.defineProperty(this, 'browser', {
    enumerable: true,
    value: opts.browser ? opts.browser instanceof _creator.Creator ? opts.browser : new _creator.Creator(opts.browser) : undefined
  });

  Object.defineProperty(this, 'pages', {
    enumerable: true,

    get: function get() {
      return this._pages;
    },

    set: function set(pages) {
      this._pages = [];
      pages.forEach(this.addPage, this);
    }
  });

  Object.defineProperty(this, 'entries', {
    enumerable: true,

    get: function get() {
      return this._entries;
    },

    set: function set(entries) {
      this._entries = [];
      entries.forEach(this.addEntry, this);
    }
  });

  if (opts.pages) {
    opts.pages.forEach(this.addPage, this);
  } else if (opts._pages) {
    opts._pages.forEach(this.addPage, this);
  }

  if (opts.entries) {
    opts.entries.forEach(this.addEntry, this);
  } else if (opts._entries) {
    opts._entries.forEach(this.addEntry, this);
  }
}

Log.prototype.addPage = function (page) {
  page = page instanceof _page.Page ? page : new _page.Page(page);
  this._pages.push(page);
  return this;
};

Log.prototype.addEntry = function (entry, pageref) {
  entry.pageref = pageref || entry.pageref;
  entry = entry instanceof _entry.Entry ? entry : new _entry.Entry(entry);
  this._entries.push(entry);
  return this;
};
/**
 * Override toJSON behaviour so it will eliminate
 * all _* properies and replace it with a proper ones.
 */
Log.prototype.toJSON = function () {
  var copy = Object.assign({}, this);
  var keys = Object.keys(copy);
  var under = keys.filter(function (key) {
    return key.indexOf('_') === 0;
  });
  under.forEach(function (key) {
    var realKey = key.substr(1);
    copy[realKey] = copy[key];
    delete copy[key];
  });
  return copy;
};

},{"./comment":2,"./creator":5,"./entry":7,"./page":10,"./version":17}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Page = Page;

var _comment = require('./comment');

var _dateTime = require('./date-time');

var _util = require('./util');

// jshint unused:false
function Page(options) {
  var opts = options || {};

  opts.pageTimings = opts.pageTimings || {};

  _comment.Comment.call(this, opts.comment);
  _dateTime.DateTime.call(this, 'startedDateTime', opts.startedDateTime);

  Object.defineProperty(this, 'id', {
    enumerable: true,
    writable: true,
    value: opts.id || _util.util.makeid(Math.ceil(10 / 2)).toString('hex').slice(0, 10)
  });

  Object.defineProperty(this, 'title', {
    enumerable: true,
    writable: true,
    value: opts.title || ''
  });

  Object.defineProperty(this, 'pageTimings', {
    enumerable: true,
    writable: true,
    value: {
      onLoad: opts.pageTimings.onLoad !== undefined ? opts.pageTimings.onLoad : -1,
      onContentLoad: opts.pageTimings.onContentLoad !== undefined ? opts.pageTimings.onContentLoad : -1
    }
  });
}

},{"./comment":2,"./date-time":6,"./util":16}],11:[function(require,module,exports){
'use strict';

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Pair = Pair;

var _comment = require('./comment');

// jshint unused:false
function Pair(name, value, comment) {
  var opts = {
    name: name,
    value: value,
    comment: comment
  };

  if ((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object') {
    opts = name;
  }

  _comment.Comment.call(this, opts.comment);

  Object.defineProperty(this, 'name', {
    enumerable: true,
    writable: true,
    value: opts.name || ''
  });

  Object.defineProperty(this, 'value', {
    enumerable: true,
    writable: true,
    value: opts.value || ''
  });
}

},{"./comment":2}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Param = Param;

var _comment = require('./comment');

// jshint unused:false
function Param() {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  _comment.Comment.call(this, opts.comment);

  Object.defineProperty(this, 'name', {
    enumerable: true,
    writable: true,
    value: opts.name || ''
  });

  Object.defineProperty(this, 'value', {
    enumerable: true,
    writable: true,
    value: opts.value || ''
  });

  Object.defineProperty(this, 'contentType', {
    enumerable: true,
    writable: true,
    value: opts.contentType || undefined
  });

  Object.defineProperty(this, 'fileName', {
    enumerable: true,
    writable: true,
    value: opts.fileName || undefined
  });
}

},{"./comment":2}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PostData = PostData;

var _comment = require('./comment');

var _param = require('./param');

function PostData() {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  // internal properties
  Object.defineProperties(this, {
    _params: {
      enumerable: false,
      configurable: false,
      writable: true,
      value: []
    }
  });

  _comment.Comment.call(this, opts.comment);

  Object.defineProperty(this, 'mimeType', {
    enumerable: true,
    writable: true,
    value: opts.mimeType || 'application/octet-stream'
  });

  Object.defineProperty(this, 'text', {
    enumerable: true,
    writable: true,
    value: opts.text || ''
  });

  Object.defineProperty(this, 'params', {
    enumerable: true,

    get: function get() {
      return this._params;
    },

    set: function set(params) {
      this._params = [];
      params.forEach(this.addParam, this);
    }
  });

  if (opts.params) {
    opts.params.forEach(this.addParam, this);
  }
}

PostData.prototype.addParam = function (param) {
  this._params.push(new _param.Param(param));

  return this;
};
/**
 * Override toJSON behaviour so it will eliminate
 * all _* properies and replace it with a proper ones.
 */
PostData.prototype.toJSON = function () {
  var copy = Object.assign({}, this);
  var keys = Object.keys(copy);
  var under = keys.filter(function (key) {
    return key.indexOf('_') === 0;
  });
  under.forEach(function (key) {
    var realKey = key.substr(1);
    copy[realKey] = copy[key];
    delete copy[key];
  });
  return copy;
};

},{"./comment":2,"./param":12}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Request = Request;

var _comment = require('./comment');

var _cookie = require('./cookie');

var _pair = require('./pair');

var Header = _interopRequireWildcard(_pair);

var Query = _interopRequireWildcard(_pair);

var _postData = require('./post-data');

var _util = require('./util');

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
      }
    }newObj.default = obj;return newObj;
  }
}

// jshint unused:false
function Request() {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  if (!opts.url) {
    throw new Error('url required');
  }

  // internal properties
  Object.defineProperties(this, {
    _headers: {
      enumerable: false,
      configurable: false,
      writable: true,
      value: []
    },

    _queryString: {
      enumerable: false,
      configurable: false,
      writable: true,
      value: []
    },

    _cookies: {
      enumerable: false,
      configurable: false,
      writable: true,
      value: []
    },

    _postData: {
      enumerable: false,
      configurable: false,
      writable: true,
      value: new _postData.PostData()
    },

    _url: {
      enumerable: true,
      configurable: false,
      writable: true,
      value: ''
    }
  });

  _comment.Comment.call(this, opts.comment);

  Object.defineProperty(this, 'method', {
    enumerable: true,
    value: opts.method || ''
  });

  Object.defineProperty(this, 'url', {
    enumerable: true,

    get: function get() {
      return this._url;
    },

    set: function set(url) {
      var _this = this;

      this._url = url;
      var parser = document.createElement('a');
      parser.href = url;
      if (parser.search.length > 0) {
        var params = parser.search.substr(1).split(/[&|;]/gi);
        params.forEach(function (param) {
          var parts = param.split('=');
          _this.addQuery({
            name: parts[0],
            value: parts[1]
          });
        });
      }
    }
  });

  Object.defineProperty(this, 'httpVersion', {
    enumerable: true,
    value: opts.httpVersion || ''
  });

  Object.defineProperty(this, 'headersSize', {
    enumerable: true,

    get: function get() {
      var headers = _util.util.toObject(this._headers);
      var keys = Object.keys(headers);

      var values = keys.map(function (key) {
        return headers[key];
      });

      var headersString = this.method + this.url + keys.join() + values.join();

      // startline: [method] [url] HTTP/1.1\r\n = 12
      // endline: \r\n = 2
      // every header + \r\n = * 2
      // add 2 for each combined header
      return _util.util.str2ab(headersString).byteLength + keys.length * 2 + 2 + 12 + 2;
    },

    set: function set() {
      throw Error('not allowed');
    }
  });

  Object.defineProperty(this, 'bodySize', {
    enumerable: true,

    get: function get() {
      if (this._postData && this._postData.text) {
        return _util.util.str2ab(this._postData.text).byteLength;
      }

      return 0;
    },

    set: function set() {
      throw Error('not allowed');
    }
  });

  Object.defineProperty(this, 'postData', {
    enumerable: true,

    get: function get() {
      return this._postData;
    },

    set: function set(postData) {
      postData = postData instanceof _postData.PostData ? postData : new _postData.PostData(postData);
      this._postData = postData;
    }
  });

  Object.defineProperty(this, 'headers', {
    enumerable: true,

    get: function get() {
      return this._headers;
    },

    set: function set(headers) {
      this._headers = [];
      headers.forEach(this.addHeader, this);
    }
  });

  Object.defineProperty(this, 'queryString', {
    enumerable: true,

    get: function get() {
      return this._queryString;
    },

    set: function set(queryString) {
      this._queryString = [];
      queryString.forEach(this.addQuery, this);
    }
  });

  Object.defineProperty(this, 'cookies', {
    enumerable: true,

    get: function get() {
      return this._cookies;
    },

    set: function set(cookies) {
      this._cookies = [];
      cookies.forEach(this.addCookie, this);
    }
  });

  if (opts.url) {
    this.url = opts.url;
  } else if (opts._url) {
    this.url = opts._url;
  }

  if (opts.headers) {
    opts.headers.forEach(this.addHeader, this);
  } else if (opts._headers) {
    opts._headers.forEach(this.addHeader, this);
  }

  if (opts.queryString) {
    opts.queryString.forEach(this.addQuery, this);
  } else if (opts._queryString) {
    opts._queryString.forEach(this.addQuery, this);
  }

  if (opts.cookies) {
    opts.cookies.forEach(this.addCookie, this);
  } else if (opts._cookies) {
    opts._cookies.forEach(this.addCookie, this);
  }

  if (opts.postData) {
    this.postData = opts.postData;
  } else if (opts._postData) {
    this.postData = opts._postData;
  }
}

Request.prototype.addHeader = function (header) {
  header = header instanceof Header.Pair ? header : new Header.Pair(header);
  this._headers.push(header);
  return this;
};

Request.prototype.addQuery = function (query) {
  query = query instanceof Query.Pair ? query : new Query.Pair(query);
  this._queryString.push(query);
  return this;
};

Request.prototype.addCookie = function (options) {
  options = options instanceof _cookie.Cookie ? options : new _cookie.Cookie(options);
  this._cookies.push(options);
  return this;
};
/**
 * Override toJSON behaviour so it will eliminate
 * all _* properies and replace it with a proper ones.
 */
Request.prototype.toJSON = function () {
  var copy = Object.assign({}, this);
  var keys = Object.keys(copy);
  var under = keys.filter(function (key) {
    return key.indexOf('_') === 0;
  });
  under.forEach(function (key) {
    var realKey = key.substr(1);
    copy[realKey] = copy[key];
    delete copy[key];
  });
  return copy;
};

},{"./comment":2,"./cookie":4,"./pair":11,"./post-data":13,"./util":16}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Response = Response;

var _comment = require('./comment');

var _content = require('./content');

var _cookie = require('./cookie');

var _pair = require('./pair');

var Header = _interopRequireWildcard(_pair);

var _util = require('./util');

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
      }
    }newObj.default = obj;return newObj;
  }
}

/* global Content, util, Header, Cookie */
// jshint unused:false
function Response() {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  if (!opts.status || !opts.statusText) {
    throw new Error('missing required fields');
  }

  // internal properties
  Object.defineProperties(this, {
    _headers: {
      enumerable: false,
      configurable: false,
      writable: true,
      value: []
    },

    _cookies: {
      enumerable: false,
      configurable: false,
      writable: true,
      value: []
    },

    _content: {
      enumerable: false,
      configurable: false,
      writable: true,
      value: new _content.Content()
    }
  });

  _comment.Comment.call(this, opts.comment);

  Object.defineProperty(this, 'status', {
    enumerable: true,
    value: opts.status
  });

  Object.defineProperty(this, 'statusText', {
    enumerable: true,
    value: opts.statusText
  });

  Object.defineProperty(this, 'httpVersion', {
    enumerable: true,
    value: opts.httpVersion || 'HTTP/1.1'
  });

  Object.defineProperty(this, 'redirectURL', {
    enumerable: true,
    value: opts.redirectURL || ''
  });

  Object.defineProperty(this, 'headersSize', {
    enumerable: true,

    get: function get() {
      var headers = _util.util.toObject(this._headers);
      var keys = Object.keys(headers);

      var values = keys.map(function (key) {
        return headers[key];
      });

      var headersString = keys.join() + values.join();

      // endline: \r\n = 2
      // every header + \r\n = * 2
      // add 2 for each combined header
      return _util.util.str2ab(headersString).byteLength + keys.length * 2 + 2 + 2;
    },

    set: function set() {
      throw Error('not allowed');
    }
  });

  Object.defineProperty(this, 'bodySize', {
    enumerable: true,

    get: function get() {
      return this._content.size;
    },

    set: function set() {
      throw Error('not allowed');
    }
  });

  Object.defineProperty(this, 'content', {
    enumerable: true,

    get: function get() {
      return this._content;
    },

    set: function set(content) {
      content = content instanceof _content.Content ? content : new _content.Content(content);
      this._content = content;
    }
  });

  Object.defineProperty(this, 'headers', {
    enumerable: true,

    get: function get() {
      return this._headers;
    },

    set: function set(headers) {
      this._headers = [];
      headers.forEach(this.addHeader, this);
    }
  });

  Object.defineProperty(this, 'cookies', {
    enumerable: true,

    get: function get() {
      return this._cookies;
    },

    set: function set(cookies) {
      this._cookies = [];
      cookies.forEach(this.addCookie, this);
    }
  });
  if (opts.headers) {
    opts.headers.forEach(this.addHeader, this);
  } else if (opts._headers) {
    opts._headers.forEach(this.addHeader, this);
  }
  if (opts.cookies) {
    opts.cookies.forEach(this.addCookie, this);
  } else if (opts._cookies) {
    opts._cookies.forEach(this.addCookie, this);
  }
  if (opts.content) {
    this.content = opts.content;
  } else if (opts._content) {
    this.content = opts._content;
  }
}

Response.prototype.addHeader = function (header) {
  header = header instanceof Header.Pair ? header : new Header.Pair(header);
  this._headers.push(header);
  return this;
};

Response.prototype.addCookie = function (options) {
  options = options instanceof _cookie.Cookie ? options : new _cookie.Cookie(options);
  this._cookies.push(options);
  return this;
};
/**
 * Override toJSON behaviour so it will eliminate
 * all _* properies and replace it with a proper ones.
 */
Response.prototype.toJSON = function () {
  var copy = Object.assign({}, this);
  var keys = Object.keys(copy);
  var under = keys.filter(function (key) {
    return key.indexOf('_') === 0;
  });
  under.forEach(function (key) {
    var realKey = key.substr(1);
    copy[realKey] = copy[key];
    delete copy[key];
  });
  return copy;
};

},{"./comment":2,"./content":3,"./cookie":4,"./pair":11,"./util":16}],16:[function(require,module,exports){
'use strict';

// jshint unused:false

Object.defineProperty(exports, "__esModule", {
  value: true
});
var util = exports.util = {
  toObject: function toObject(array) {
    return array.reduce(function (obj, pair) {
      if (obj[pair.name] === undefined) {
        obj[pair.name] = pair.value;
        return obj;
      }

      // convert to array
      var arr = [obj[pair.name], pair.value];

      obj[pair.name] = arr;

      return obj;
    }, {});
  },

  toArray: function toArray(obj) {
    return Object.keys(obj).map(function (name) {
      return {
        name: name,
        value: obj[name]
      };
    });
  },

  str2ab: function str2ab(str) {
    var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
    var bufView = new Uint16Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  },

  makeid: function makeid(size) {
    if (typeof size !== 'number') {
      throw new Error('Size must be a number');
    }
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < size; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }
};

},{}],17:[function(require,module,exports){
'use strict';

// jshint unused:false

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Version = Version;
function Version(version) {
  if (!version) {
    throw new Error('version required');
  }

  Object.defineProperty(this, 'version', {
    enumerable: true,
    writable: true,
    value: version.toString()
  });
}

},{}]},{},[8])
/**
 * @license
 * lodash 4.6.1 <https://lodash.com/>
 * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
;(function() {

  /** Used as a safe reference for `undefined` in pre-ES5 environments. */
  var undefined;

  /** Used as the semantic version number. */
  var VERSION = '4.6.1';

  /** Used as the size to enable large array optimizations. */
  var LARGE_ARRAY_SIZE = 200;

  /** Used as the `TypeError` message for "Functions" methods. */
  var FUNC_ERROR_TEXT = 'Expected a function';

  /** Used to stand-in for `undefined` hash values. */
  var HASH_UNDEFINED = '__lodash_hash_undefined__';

  /** Used as the internal argument placeholder. */
  var PLACEHOLDER = '__lodash_placeholder__';

  /** Used to compose bitmasks for wrapper metadata. */
  var BIND_FLAG = 1,
      BIND_KEY_FLAG = 2,
      CURRY_BOUND_FLAG = 4,
      CURRY_FLAG = 8,
      CURRY_RIGHT_FLAG = 16,
      PARTIAL_FLAG = 32,
      PARTIAL_RIGHT_FLAG = 64,
      ARY_FLAG = 128,
      REARG_FLAG = 256,
      FLIP_FLAG = 512;

  /** Used to compose bitmasks for comparison styles. */
  var UNORDERED_COMPARE_FLAG = 1,
      PARTIAL_COMPARE_FLAG = 2;

  /** Used as default options for `_.truncate`. */
  var DEFAULT_TRUNC_LENGTH = 30,
      DEFAULT_TRUNC_OMISSION = '...';

  /** Used to detect hot functions by number of calls within a span of milliseconds. */
  var HOT_COUNT = 150,
      HOT_SPAN = 16;

  /** Used to indicate the type of lazy iteratees. */
  var LAZY_FILTER_FLAG = 1,
      LAZY_MAP_FLAG = 2,
      LAZY_WHILE_FLAG = 3;

  /** Used as references for various `Number` constants. */
  var INFINITY = 1 / 0,
      MAX_SAFE_INTEGER = 9007199254740991,
      MAX_INTEGER = 1.7976931348623157e+308,
      NAN = 0 / 0;

  /** Used as references for the maximum length and index of an array. */
  var MAX_ARRAY_LENGTH = 4294967295,
      MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1,
      HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH >>> 1;

  /** `Object#toString` result references. */
  var argsTag = '[object Arguments]',
      arrayTag = '[object Array]',
      boolTag = '[object Boolean]',
      dateTag = '[object Date]',
      errorTag = '[object Error]',
      funcTag = '[object Function]',
      genTag = '[object GeneratorFunction]',
      mapTag = '[object Map]',
      numberTag = '[object Number]',
      objectTag = '[object Object]',
      regexpTag = '[object RegExp]',
      setTag = '[object Set]',
      stringTag = '[object String]',
      symbolTag = '[object Symbol]',
      weakMapTag = '[object WeakMap]',
      weakSetTag = '[object WeakSet]';

  var arrayBufferTag = '[object ArrayBuffer]',
      float32Tag = '[object Float32Array]',
      float64Tag = '[object Float64Array]',
      int8Tag = '[object Int8Array]',
      int16Tag = '[object Int16Array]',
      int32Tag = '[object Int32Array]',
      uint8Tag = '[object Uint8Array]',
      uint8ClampedTag = '[object Uint8ClampedArray]',
      uint16Tag = '[object Uint16Array]',
      uint32Tag = '[object Uint32Array]';

  /** Used to match empty string literals in compiled template source. */
  var reEmptyStringLeading = /\b__p \+= '';/g,
      reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
      reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;

  /** Used to match HTML entities and HTML characters. */
  var reEscapedHtml = /&(?:amp|lt|gt|quot|#39|#96);/g,
      reUnescapedHtml = /[&<>"'`]/g,
      reHasEscapedHtml = RegExp(reEscapedHtml.source),
      reHasUnescapedHtml = RegExp(reUnescapedHtml.source);

  /** Used to match template delimiters. */
  var reEscape = /<%-([\s\S]+?)%>/g,
      reEvaluate = /<%([\s\S]+?)%>/g,
      reInterpolate = /<%=([\s\S]+?)%>/g;

  /** Used to match property names within property paths. */
  var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
      reIsPlainProp = /^\w*$/,
      rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]/g;

  /** Used to match `RegExp` [syntax characters](http://ecma-international.org/ecma-262/6.0/#sec-patterns). */
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g,
      reHasRegExpChar = RegExp(reRegExpChar.source);

  /** Used to match leading and trailing whitespace. */
  var reTrim = /^\s+|\s+$/g,
      reTrimStart = /^\s+/,
      reTrimEnd = /\s+$/;

  /** Used to match backslashes in property paths. */
  var reEscapeChar = /\\(\\)?/g;

  /** Used to match [ES template delimiters](http://ecma-international.org/ecma-262/6.0/#sec-template-literal-lexical-components). */
  var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;

  /** Used to match `RegExp` flags from their coerced string values. */
  var reFlags = /\w*$/;

  /** Used to detect hexadecimal string values. */
  var reHasHexPrefix = /^0x/i;

  /** Used to detect bad signed hexadecimal string values. */
  var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

  /** Used to detect binary string values. */
  var reIsBinary = /^0b[01]+$/i;

  /** Used to detect host constructors (Safari > 5). */
  var reIsHostCtor = /^\[object .+?Constructor\]$/;

  /** Used to detect octal string values. */
  var reIsOctal = /^0o[0-7]+$/i;

  /** Used to detect unsigned integer values. */
  var reIsUint = /^(?:0|[1-9]\d*)$/;

  /** Used to match latin-1 supplementary letters (excluding mathematical operators). */
  var reLatin1 = /[\xc0-\xd6\xd8-\xde\xdf-\xf6\xf8-\xff]/g;

  /** Used to ensure capturing order of template delimiters. */
  var reNoMatch = /($^)/;

  /** Used to match unescaped characters in compiled string literals. */
  var reUnescapedString = /['\n\r\u2028\u2029\\]/g;

  /** Used to compose unicode character classes. */
  var rsAstralRange = '\\ud800-\\udfff',
      rsComboMarksRange = '\\u0300-\\u036f\\ufe20-\\ufe23',
      rsComboSymbolsRange = '\\u20d0-\\u20f0',
      rsDingbatRange = '\\u2700-\\u27bf',
      rsLowerRange = 'a-z\\xdf-\\xf6\\xf8-\\xff',
      rsMathOpRange = '\\xac\\xb1\\xd7\\xf7',
      rsNonCharRange = '\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf',
      rsQuoteRange = '\\u2018\\u2019\\u201c\\u201d',
      rsSpaceRange = ' \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000',
      rsUpperRange = 'A-Z\\xc0-\\xd6\\xd8-\\xde',
      rsVarRange = '\\ufe0e\\ufe0f',
      rsBreakRange = rsMathOpRange + rsNonCharRange + rsQuoteRange + rsSpaceRange;

  /** Used to compose unicode capture groups. */
  var rsAstral = '[' + rsAstralRange + ']',
      rsBreak = '[' + rsBreakRange + ']',
      rsCombo = '[' + rsComboMarksRange + rsComboSymbolsRange + ']',
      rsDigits = '\\d+',
      rsDingbat = '[' + rsDingbatRange + ']',
      rsLower = '[' + rsLowerRange + ']',
      rsMisc = '[^' + rsAstralRange + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + ']',
      rsFitz = '\\ud83c[\\udffb-\\udfff]',
      rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
      rsNonAstral = '[^' + rsAstralRange + ']',
      rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
      rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
      rsUpper = '[' + rsUpperRange + ']',
      rsZWJ = '\\u200d';

  /** Used to compose unicode regexes. */
  var rsLowerMisc = '(?:' + rsLower + '|' + rsMisc + ')',
      rsUpperMisc = '(?:' + rsUpper + '|' + rsMisc + ')',
      reOptMod = rsModifier + '?',
      rsOptVar = '[' + rsVarRange + ']?',
      rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
      rsSeq = rsOptVar + reOptMod + rsOptJoin,
      rsEmoji = '(?:' + [rsDingbat, rsRegional, rsSurrPair].join('|') + ')' + rsSeq,
      rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';

  /**
   * Used to match [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks) and
   * [combining diacritical marks for symbols](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks_for_Symbols).
   */
  var reComboMark = RegExp(rsCombo, 'g');

  /** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
  var reComplexSymbol = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');

  /** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
  var reHasComplexSymbol = RegExp('[' + rsZWJ + rsAstralRange  + rsComboMarksRange + rsComboSymbolsRange + rsVarRange + ']');

  /** Used to match non-compound words composed of alphanumeric characters. */
  var reBasicWord = /[a-zA-Z0-9]+/g;

  /** Used to match complex or compound words. */
  var reComplexWord = RegExp([
    rsUpper + '?' + rsLower + '+(?=' + [rsBreak, rsUpper, '$'].join('|') + ')',
    rsUpperMisc + '+(?=' + [rsBreak, rsUpper + rsLowerMisc, '$'].join('|') + ')',
    rsUpper + '?' + rsLowerMisc + '+',
    rsUpper + '+',
    rsDigits,
    rsEmoji
  ].join('|'), 'g');

  /** Used to detect strings that need a more robust regexp to match words. */
  var reHasComplexWord = /[a-z][A-Z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;

  /** Used to assign default `context` object properties. */
  var contextProps = [
    'Array', 'Buffer', 'Date', 'Error', 'Float32Array', 'Float64Array',
    'Function', 'Int8Array', 'Int16Array', 'Int32Array', 'Map', 'Math', 'Object',
    'Reflect', 'RegExp', 'Set', 'String', 'Symbol', 'TypeError', 'Uint8Array',
    'Uint8ClampedArray', 'Uint16Array', 'Uint32Array', 'WeakMap', '_',
    'clearTimeout', 'isFinite', 'parseInt', 'setTimeout'
  ];

  /** Used to make template sourceURLs easier to identify. */
  var templateCounter = -1;

  /** Used to identify `toStringTag` values of typed arrays. */
  var typedArrayTags = {};
  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
  typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
  typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
  typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
  typedArrayTags[uint32Tag] = true;
  typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
  typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
  typedArrayTags[dateTag] = typedArrayTags[errorTag] =
  typedArrayTags[funcTag] = typedArrayTags[mapTag] =
  typedArrayTags[numberTag] = typedArrayTags[objectTag] =
  typedArrayTags[regexpTag] = typedArrayTags[setTag] =
  typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;

  /** Used to identify `toStringTag` values supported by `_.clone`. */
  var cloneableTags = {};
  cloneableTags[argsTag] = cloneableTags[arrayTag] =
  cloneableTags[arrayBufferTag] = cloneableTags[boolTag] =
  cloneableTags[dateTag] = cloneableTags[float32Tag] =
  cloneableTags[float64Tag] = cloneableTags[int8Tag] =
  cloneableTags[int16Tag] = cloneableTags[int32Tag] =
  cloneableTags[mapTag] = cloneableTags[numberTag] =
  cloneableTags[objectTag] = cloneableTags[regexpTag] =
  cloneableTags[setTag] = cloneableTags[stringTag] =
  cloneableTags[symbolTag] = cloneableTags[uint8Tag] =
  cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] =
  cloneableTags[uint32Tag] = true;
  cloneableTags[errorTag] = cloneableTags[funcTag] =
  cloneableTags[weakMapTag] = false;

  /** Used to map latin-1 supplementary letters to basic latin letters. */
  var deburredLetters = {
    '\xc0': 'A',  '\xc1': 'A', '\xc2': 'A', '\xc3': 'A', '\xc4': 'A', '\xc5': 'A',
    '\xe0': 'a',  '\xe1': 'a', '\xe2': 'a', '\xe3': 'a', '\xe4': 'a', '\xe5': 'a',
    '\xc7': 'C',  '\xe7': 'c',
    '\xd0': 'D',  '\xf0': 'd',
    '\xc8': 'E',  '\xc9': 'E', '\xca': 'E', '\xcb': 'E',
    '\xe8': 'e',  '\xe9': 'e', '\xea': 'e', '\xeb': 'e',
    '\xcC': 'I',  '\xcd': 'I', '\xce': 'I', '\xcf': 'I',
    '\xeC': 'i',  '\xed': 'i', '\xee': 'i', '\xef': 'i',
    '\xd1': 'N',  '\xf1': 'n',
    '\xd2': 'O',  '\xd3': 'O', '\xd4': 'O', '\xd5': 'O', '\xd6': 'O', '\xd8': 'O',
    '\xf2': 'o',  '\xf3': 'o', '\xf4': 'o', '\xf5': 'o', '\xf6': 'o', '\xf8': 'o',
    '\xd9': 'U',  '\xda': 'U', '\xdb': 'U', '\xdc': 'U',
    '\xf9': 'u',  '\xfa': 'u', '\xfb': 'u', '\xfc': 'u',
    '\xdd': 'Y',  '\xfd': 'y', '\xff': 'y',
    '\xc6': 'Ae', '\xe6': 'ae',
    '\xde': 'Th', '\xfe': 'th',
    '\xdf': 'ss'
  };

  /** Used to map characters to HTML entities. */
  var htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '`': '&#96;'
  };

  /** Used to map HTML entities to characters. */
  var htmlUnescapes = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&#96;': '`'
  };

  /** Used to determine if values are of the language type `Object`. */
  var objectTypes = {
    'function': true,
    'object': true
  };

  /** Used to escape characters for inclusion in compiled string literals. */
  var stringEscapes = {
    '\\': '\\',
    "'": "'",
    '\n': 'n',
    '\r': 'r',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  /** Built-in method references without a dependency on `root`. */
  var freeParseFloat = parseFloat,
      freeParseInt = parseInt;

  /** Detect free variable `exports`. */
  var freeExports = (objectTypes[typeof exports] && exports && !exports.nodeType)
    ? exports
    : undefined;

  /** Detect free variable `module`. */
  var freeModule = (objectTypes[typeof module] && module && !module.nodeType)
    ? module
    : undefined;

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports = (freeModule && freeModule.exports === freeExports)
    ? freeExports
    : undefined;

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = checkGlobal(freeExports && freeModule && typeof global == 'object' && global);

  /** Detect free variable `self`. */
  var freeSelf = checkGlobal(objectTypes[typeof self] && self);

  /** Detect free variable `window`. */
  var freeWindow = checkGlobal(objectTypes[typeof window] && window);

  /** Detect `this` as the global object. */
  var thisGlobal = checkGlobal(objectTypes[typeof this] && this);

  /**
   * Used as a reference to the global object.
   *
   * The `this` value is used if it's the global object to avoid Greasemonkey's
   * restricted `window` object, otherwise the `window` object is used.
   */
  var root = freeGlobal ||
    ((freeWindow !== (thisGlobal && thisGlobal.window)) && freeWindow) ||
      freeSelf || thisGlobal || Function('return this')();

  /*--------------------------------------------------------------------------*/

  /**
   * Adds the key-value `pair` to `map`.
   *
   * @private
   * @param {Object} map The map to modify.
   * @param {Array} pair The key-value pair to add.
   * @returns {Object} Returns `map`.
   */
  function addMapEntry(map, pair) {
    // Don't return `Map#set` because it doesn't return the map instance in IE 11.
    map.set(pair[0], pair[1]);
    return map;
  }

  /**
   * Adds `value` to `set`.
   *
   * @private
   * @param {Object} set The set to modify.
   * @param {*} value The value to add.
   * @returns {Object} Returns `set`.
   */
  function addSetEntry(set, value) {
    set.add(value);
    return set;
  }

  /**
   * A faster alternative to `Function#apply`, this function invokes `func`
   * with the `this` binding of `thisArg` and the arguments of `args`.
   *
   * @private
   * @param {Function} func The function to invoke.
   * @param {*} thisArg The `this` binding of `func`.
   * @param {...*} args The arguments to invoke `func` with.
   * @returns {*} Returns the result of `func`.
   */
  function apply(func, thisArg, args) {
    var length = args.length;
    switch (length) {
      case 0: return func.call(thisArg);
      case 1: return func.call(thisArg, args[0]);
      case 2: return func.call(thisArg, args[0], args[1]);
      case 3: return func.call(thisArg, args[0], args[1], args[2]);
    }
    return func.apply(thisArg, args);
  }

  /**
   * A specialized version of `baseAggregator` for arrays.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} setter The function to set `accumulator` values.
   * @param {Function} iteratee The iteratee to transform keys.
   * @param {Object} accumulator The initial aggregated object.
   * @returns {Function} Returns `accumulator`.
   */
  function arrayAggregator(array, setter, iteratee, accumulator) {
    var index = -1,
        length = array.length;

    while (++index < length) {
      var value = array[index];
      setter(accumulator, value, iteratee(value), array);
    }
    return accumulator;
  }

  /**
   * Creates a new array concatenating `array` with `other`.
   *
   * @private
   * @param {Array} array The first array to concatenate.
   * @param {Array} other The second array to concatenate.
   * @returns {Array} Returns the new concatenated array.
   */
  function arrayConcat(array, other) {
    var index = -1,
        length = array.length,
        othIndex = -1,
        othLength = other.length,
        result = Array(length + othLength);

    while (++index < length) {
      result[index] = array[index];
    }
    while (++othIndex < othLength) {
      result[index++] = other[othIndex];
    }
    return result;
  }

  /**
   * A specialized version of `_.forEach` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns `array`.
   */
  function arrayEach(array, iteratee) {
    var index = -1,
        length = array.length;

    while (++index < length) {
      if (iteratee(array[index], index, array) === false) {
        break;
      }
    }
    return array;
  }

  /**
   * A specialized version of `_.forEachRight` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns `array`.
   */
  function arrayEachRight(array, iteratee) {
    var length = array.length;

    while (length--) {
      if (iteratee(array[length], length, array) === false) {
        break;
      }
    }
    return array;
  }

  /**
   * A specialized version of `_.every` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {boolean} Returns `true` if all elements pass the predicate check, else `false`.
   */
  function arrayEvery(array, predicate) {
    var index = -1,
        length = array.length;

    while (++index < length) {
      if (!predicate(array[index], index, array)) {
        return false;
      }
    }
    return true;
  }

  /**
   * A specialized version of `_.filter` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {Array} Returns the new filtered array.
   */
  function arrayFilter(array, predicate) {
    var index = -1,
        length = array.length,
        resIndex = 0,
        result = [];

    while (++index < length) {
      var value = array[index];
      if (predicate(value, index, array)) {
        result[resIndex++] = value;
      }
    }
    return result;
  }

  /**
   * A specialized version of `_.includes` for arrays without support for
   * specifying an index to search from.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {*} target The value to search for.
   * @returns {boolean} Returns `true` if `target` is found, else `false`.
   */
  function arrayIncludes(array, value) {
    return !!array.length && baseIndexOf(array, value, 0) > -1;
  }

  /**
   * This function is like `arrayIncludes` except that it accepts a comparator.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {*} target The value to search for.
   * @param {Function} comparator The comparator invoked per element.
   * @returns {boolean} Returns `true` if `target` is found, else `false`.
   */
  function arrayIncludesWith(array, value, comparator) {
    var index = -1,
        length = array.length;

    while (++index < length) {
      if (comparator(value, array[index])) {
        return true;
      }
    }
    return false;
  }

  /**
   * A specialized version of `_.map` for arrays without support for iteratee
   * shorthands.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the new mapped array.
   */
  function arrayMap(array, iteratee) {
    var index = -1,
        length = array.length,
        result = Array(length);

    while (++index < length) {
      result[index] = iteratee(array[index], index, array);
    }
    return result;
  }

  /**
   * Appends the elements of `values` to `array`.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {Array} values The values to append.
   * @returns {Array} Returns `array`.
   */
  function arrayPush(array, values) {
    var index = -1,
        length = values.length,
        offset = array.length;

    while (++index < length) {
      array[offset + index] = values[index];
    }
    return array;
  }

  /**
   * A specialized version of `_.reduce` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {*} [accumulator] The initial value.
   * @param {boolean} [initAccum] Specify using the first element of `array` as the initial value.
   * @returns {*} Returns the accumulated value.
   */
  function arrayReduce(array, iteratee, accumulator, initAccum) {
    var index = -1,
        length = array.length;

    if (initAccum && length) {
      accumulator = array[++index];
    }
    while (++index < length) {
      accumulator = iteratee(accumulator, array[index], index, array);
    }
    return accumulator;
  }

  /**
   * A specialized version of `_.reduceRight` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {*} [accumulator] The initial value.
   * @param {boolean} [initAccum] Specify using the last element of `array` as the initial value.
   * @returns {*} Returns the accumulated value.
   */
  function arrayReduceRight(array, iteratee, accumulator, initAccum) {
    var length = array.length;
    if (initAccum && length) {
      accumulator = array[--length];
    }
    while (length--) {
      accumulator = iteratee(accumulator, array[length], length, array);
    }
    return accumulator;
  }

  /**
   * A specialized version of `_.some` for arrays without support for iteratee
   * shorthands.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {boolean} Returns `true` if any element passes the predicate check, else `false`.
   */
  function arraySome(array, predicate) {
    var index = -1,
        length = array.length;

    while (++index < length) {
      if (predicate(array[index], index, array)) {
        return true;
      }
    }
    return false;
  }

  /**
   * The base implementation of methods like `_.max` and `_.min` which accepts a
   * `comparator` to determine the extremum value.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee The iteratee invoked per iteration.
   * @param {Function} comparator The comparator used to compare values.
   * @returns {*} Returns the extremum value.
   */
  function baseExtremum(array, iteratee, comparator) {
    var index = -1,
        length = array.length;

    while (++index < length) {
      var value = array[index],
          current = iteratee(value);

      if (current != null && (computed === undefined
            ? current === current
            : comparator(current, computed)
          )) {
        var computed = current,
            result = value;
      }
    }
    return result;
  }

  /**
   * The base implementation of methods like `_.find` and `_.findKey`, without
   * support for iteratee shorthands, which iterates over `collection` using
   * `eachFunc`.
   *
   * @private
   * @param {Array|Object} collection The collection to search.
   * @param {Function} predicate The function invoked per iteration.
   * @param {Function} eachFunc The function to iterate over `collection`.
   * @param {boolean} [retKey] Specify returning the key of the found element instead of the element itself.
   * @returns {*} Returns the found element or its key, else `undefined`.
   */
  function baseFind(collection, predicate, eachFunc, retKey) {
    var result;
    eachFunc(collection, function(value, key, collection) {
      if (predicate(value, key, collection)) {
        result = retKey ? key : value;
        return false;
      }
    });
    return result;
  }

  /**
   * The base implementation of `_.findIndex` and `_.findLastIndex` without
   * support for iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {Function} predicate The function invoked per iteration.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseFindIndex(array, predicate, fromRight) {
    var length = array.length,
        index = fromRight ? length : -1;

    while ((fromRight ? index-- : ++index < length)) {
      if (predicate(array[index], index, array)) {
        return index;
      }
    }
    return -1;
  }

  /**
   * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseIndexOf(array, value, fromIndex) {
    if (value !== value) {
      return indexOfNaN(array, fromIndex);
    }
    var index = fromIndex - 1,
        length = array.length;

    while (++index < length) {
      if (array[index] === value) {
        return index;
      }
    }
    return -1;
  }

  /**
   * This function is like `baseIndexOf` except that it accepts a comparator.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @param {Function} comparator The comparator invoked per element.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseIndexOfWith(array, value, fromIndex, comparator) {
    var index = fromIndex - 1,
        length = array.length;

    while (++index < length) {
      if (comparator(array[index], value)) {
        return index;
      }
    }
    return -1;
  }

  /**
   * The base implementation of `_.reduce` and `_.reduceRight`, without support
   * for iteratee shorthands, which iterates over `collection` using `eachFunc`.
   *
   * @private
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {*} accumulator The initial value.
   * @param {boolean} initAccum Specify using the first or last element of `collection` as the initial value.
   * @param {Function} eachFunc The function to iterate over `collection`.
   * @returns {*} Returns the accumulated value.
   */
  function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
    eachFunc(collection, function(value, index, collection) {
      accumulator = initAccum
        ? (initAccum = false, value)
        : iteratee(accumulator, value, index, collection);
    });
    return accumulator;
  }

  /**
   * The base implementation of `_.sortBy` which uses `comparer` to define the
   * sort order of `array` and replaces criteria objects with their corresponding
   * values.
   *
   * @private
   * @param {Array} array The array to sort.
   * @param {Function} comparer The function to define sort order.
   * @returns {Array} Returns `array`.
   */
  function baseSortBy(array, comparer) {
    var length = array.length;

    array.sort(comparer);
    while (length--) {
      array[length] = array[length].value;
    }
    return array;
  }

  /**
   * The base implementation of `_.sum` without support for iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {number} Returns the sum.
   */
  function baseSum(array, iteratee) {
    var result,
        index = -1,
        length = array.length;

    while (++index < length) {
      var current = iteratee(array[index]);
      if (current !== undefined) {
        result = result === undefined ? current : (result + current);
      }
    }
    return result;
  }

  /**
   * The base implementation of `_.times` without support for iteratee shorthands
   * or max array length checks.
   *
   * @private
   * @param {number} n The number of times to invoke `iteratee`.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the array of results.
   */
  function baseTimes(n, iteratee) {
    var index = -1,
        result = Array(n);

    while (++index < n) {
      result[index] = iteratee(index);
    }
    return result;
  }

  /**
   * The base implementation of `_.toPairs` and `_.toPairsIn` which creates an array
   * of key-value pairs for `object` corresponding to the property names of `props`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array} props The property names to get values for.
   * @returns {Object} Returns the new array of key-value pairs.
   */
  function baseToPairs(object, props) {
    return arrayMap(props, function(key) {
      return [key, object[key]];
    });
  }

  /**
   * The base implementation of `_.unary` without support for storing wrapper metadata.
   *
   * @private
   * @param {Function} func The function to cap arguments for.
   * @returns {Function} Returns the new function.
   */
  function baseUnary(func) {
    return function(value) {
      return func(value);
    };
  }

  /**
   * The base implementation of `_.values` and `_.valuesIn` which creates an
   * array of `object` property values corresponding to the property names
   * of `props`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array} props The property names to get values for.
   * @returns {Object} Returns the array of property values.
   */
  function baseValues(object, props) {
    return arrayMap(props, function(key) {
      return object[key];
    });
  }

  /**
   * Used by `_.trim` and `_.trimStart` to get the index of the first string symbol
   * that is not found in the character symbols.
   *
   * @private
   * @param {Array} strSymbols The string symbols to inspect.
   * @param {Array} chrSymbols The character symbols to find.
   * @returns {number} Returns the index of the first unmatched string symbol.
   */
  function charsStartIndex(strSymbols, chrSymbols) {
    var index = -1,
        length = strSymbols.length;

    while (++index < length && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
    return index;
  }

  /**
   * Used by `_.trim` and `_.trimEnd` to get the index of the last string symbol
   * that is not found in the character symbols.
   *
   * @private
   * @param {Array} strSymbols The string symbols to inspect.
   * @param {Array} chrSymbols The character symbols to find.
   * @returns {number} Returns the index of the last unmatched string symbol.
   */
  function charsEndIndex(strSymbols, chrSymbols) {
    var index = strSymbols.length;

    while (index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
    return index;
  }

  /**
   * Checks if `value` is a global object.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {null|Object} Returns `value` if it's a global object, else `null`.
   */
  function checkGlobal(value) {
    return (value && value.Object === Object) ? value : null;
  }

  /**
   * Compares values to sort them in ascending order.
   *
   * @private
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {number} Returns the sort order indicator for `value`.
   */
  function compareAscending(value, other) {
    if (value !== other) {
      var valIsNull = value === null,
          valIsUndef = value === undefined,
          valIsReflexive = value === value;

      var othIsNull = other === null,
          othIsUndef = other === undefined,
          othIsReflexive = other === other;

      if ((value > other && !othIsNull) || !valIsReflexive ||
          (valIsNull && !othIsUndef && othIsReflexive) ||
          (valIsUndef && othIsReflexive)) {
        return 1;
      }
      if ((value < other && !valIsNull) || !othIsReflexive ||
          (othIsNull && !valIsUndef && valIsReflexive) ||
          (othIsUndef && valIsReflexive)) {
        return -1;
      }
    }
    return 0;
  }

  /**
   * Used by `_.orderBy` to compare multiple properties of a value to another
   * and stable sort them.
   *
   * If `orders` is unspecified, all values are sorted in ascending order. Otherwise,
   * specify an order of "desc" for descending or "asc" for ascending sort order
   * of corresponding values.
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @param {boolean[]|string[]} orders The order to sort by for each property.
   * @returns {number} Returns the sort order indicator for `object`.
   */
  function compareMultiple(object, other, orders) {
    var index = -1,
        objCriteria = object.criteria,
        othCriteria = other.criteria,
        length = objCriteria.length,
        ordersLength = orders.length;

    while (++index < length) {
      var result = compareAscending(objCriteria[index], othCriteria[index]);
      if (result) {
        if (index >= ordersLength) {
          return result;
        }
        var order = orders[index];
        return result * (order == 'desc' ? -1 : 1);
      }
    }
    // Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications
    // that causes it, under certain circumstances, to provide the same value for
    // `object` and `other`. See https://github.com/jashkenas/underscore/pull/1247
    // for more details.
    //
    // This also ensures a stable sort in V8 and other engines.
    // See https://code.google.com/p/v8/issues/detail?id=90 for more details.
    return object.index - other.index;
  }

  /**
   * Gets the number of `placeholder` occurrences in `array`.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} placeholder The placeholder to search for.
   * @returns {number} Returns the placeholder count.
   */
  function countHolders(array, placeholder) {
    var length = array.length,
        result = 0;

    while (length--) {
      if (array[length] === placeholder) {
        result++;
      }
    }
    return result;
  }

  /**
   * Used by `_.deburr` to convert latin-1 supplementary letters to basic latin letters.
   *
   * @private
   * @param {string} letter The matched letter to deburr.
   * @returns {string} Returns the deburred letter.
   */
  function deburrLetter(letter) {
    return deburredLetters[letter];
  }

  /**
   * Used by `_.escape` to convert characters to HTML entities.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @returns {string} Returns the escaped character.
   */
  function escapeHtmlChar(chr) {
    return htmlEscapes[chr];
  }

  /**
   * Used by `_.template` to escape characters for inclusion in compiled string literals.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @returns {string} Returns the escaped character.
   */
  function escapeStringChar(chr) {
    return '\\' + stringEscapes[chr];
  }

  /**
   * Gets the index at which the first occurrence of `NaN` is found in `array`.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {number} fromIndex The index to search from.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {number} Returns the index of the matched `NaN`, else `-1`.
   */
  function indexOfNaN(array, fromIndex, fromRight) {
    var length = array.length,
        index = fromIndex + (fromRight ? 0 : -1);

    while ((fromRight ? index-- : ++index < length)) {
      var other = array[index];
      if (other !== other) {
        return index;
      }
    }
    return -1;
  }

  /**
   * Checks if `value` is a host object in IE < 9.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
   */
  function isHostObject(value) {
    // Many host objects are `Object` objects that can coerce to strings
    // despite having improperly defined `toString` methods.
    var result = false;
    if (value != null && typeof value.toString != 'function') {
      try {
        result = !!(value + '');
      } catch (e) {}
    }
    return result;
  }

  /**
   * Checks if `value` is a valid array-like index.
   *
   * @private
   * @param {*} value The value to check.
   * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
   * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
   */
  function isIndex(value, length) {
    value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
    length = length == null ? MAX_SAFE_INTEGER : length;
    return value > -1 && value % 1 == 0 && value < length;
  }

  /**
   * Converts `iterator` to an array.
   *
   * @private
   * @param {Object} iterator The iterator to convert.
   * @returns {Array} Returns the converted array.
   */
  function iteratorToArray(iterator) {
    var data,
        result = [];

    while (!(data = iterator.next()).done) {
      result.push(data.value);
    }
    return result;
  }

  /**
   * Converts `map` to an array.
   *
   * @private
   * @param {Object} map The map to convert.
   * @returns {Array} Returns the converted array.
   */
  function mapToArray(map) {
    var index = -1,
        result = Array(map.size);

    map.forEach(function(value, key) {
      result[++index] = [key, value];
    });
    return result;
  }

  /**
   * Replaces all `placeholder` elements in `array` with an internal placeholder
   * and returns an array of their indexes.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {*} placeholder The placeholder to replace.
   * @returns {Array} Returns the new array of placeholder indexes.
   */
  function replaceHolders(array, placeholder) {
    var index = -1,
        length = array.length,
        resIndex = 0,
        result = [];

    while (++index < length) {
      var value = array[index];
      if (value === placeholder || value === PLACEHOLDER) {
        array[index] = PLACEHOLDER;
        result[resIndex++] = index;
      }
    }
    return result;
  }

  /**
   * Converts `set` to an array.
   *
   * @private
   * @param {Object} set The set to convert.
   * @returns {Array} Returns the converted array.
   */
  function setToArray(set) {
    var index = -1,
        result = Array(set.size);

    set.forEach(function(value) {
      result[++index] = value;
    });
    return result;
  }

  /**
   * Gets the number of symbols in `string`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {number} Returns the string size.
   */
  function stringSize(string) {
    if (!(string && reHasComplexSymbol.test(string))) {
      return string.length;
    }
    var result = reComplexSymbol.lastIndex = 0;
    while (reComplexSymbol.test(string)) {
      result++;
    }
    return result;
  }

  /**
   * Converts `string` to an array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the converted array.
   */
  function stringToArray(string) {
    return string.match(reComplexSymbol);
  }

  /**
   * Used by `_.unescape` to convert HTML entities to characters.
   *
   * @private
   * @param {string} chr The matched character to unescape.
   * @returns {string} Returns the unescaped character.
   */
  function unescapeHtmlChar(chr) {
    return htmlUnescapes[chr];
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Create a new pristine `lodash` function using the `context` object.
   *
   * @static
   * @memberOf _
   * @category Util
   * @param {Object} [context=root] The context object.
   * @returns {Function} Returns a new `lodash` function.
   * @example
   *
   * _.mixin({ 'foo': _.constant('foo') });
   *
   * var lodash = _.runInContext();
   * lodash.mixin({ 'bar': lodash.constant('bar') });
   *
   * _.isFunction(_.foo);
   * // => true
   * _.isFunction(_.bar);
   * // => false
   *
   * lodash.isFunction(lodash.foo);
   * // => false
   * lodash.isFunction(lodash.bar);
   * // => true
   *
   * // Use `context` to mock `Date#getTime` use in `_.now`.
   * var mock = _.runInContext({
   *   'Date': function() {
   *     return { 'getTime': getTimeMock };
   *   }
   * });
   *
   * // Create a suped-up `defer` in Node.js.
   * var defer = _.runInContext({ 'setTimeout': setImmediate }).defer;
   */
  function runInContext(context) {
    context = context ? _.defaults({}, context, _.pick(root, contextProps)) : root;

    /** Built-in constructor references. */
    var Date = context.Date,
        Error = context.Error,
        Math = context.Math,
        RegExp = context.RegExp,
        TypeError = context.TypeError;

    /** Used for built-in method references. */
    var arrayProto = context.Array.prototype,
        objectProto = context.Object.prototype;

    /** Used to resolve the decompiled source of functions. */
    var funcToString = context.Function.prototype.toString;

    /** Used to check objects for own properties. */
    var hasOwnProperty = objectProto.hasOwnProperty;

    /** Used to generate unique IDs. */
    var idCounter = 0;

    /** Used to infer the `Object` constructor. */
    var objectCtorString = funcToString.call(Object);

    /**
     * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
     * of values.
     */
    var objectToString = objectProto.toString;

    /** Used to restore the original `_` reference in `_.noConflict`. */
    var oldDash = root._;

    /** Used to detect if a method is native. */
    var reIsNative = RegExp('^' +
      funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
      .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
    );

    /** Built-in value references. */
    var Buffer = moduleExports ? context.Buffer : undefined,
        Reflect = context.Reflect,
        Symbol = context.Symbol,
        Uint8Array = context.Uint8Array,
        clearTimeout = context.clearTimeout,
        enumerate = Reflect ? Reflect.enumerate : undefined,
        getPrototypeOf = Object.getPrototypeOf,
        getOwnPropertySymbols = Object.getOwnPropertySymbols,
        iteratorSymbol = typeof (iteratorSymbol = Symbol && Symbol.iterator) == 'symbol' ? iteratorSymbol : undefined,
        objectCreate = Object.create,
        propertyIsEnumerable = objectProto.propertyIsEnumerable,
        setTimeout = context.setTimeout,
        splice = arrayProto.splice;

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeCeil = Math.ceil,
        nativeFloor = Math.floor,
        nativeIsFinite = context.isFinite,
        nativeJoin = arrayProto.join,
        nativeKeys = Object.keys,
        nativeMax = Math.max,
        nativeMin = Math.min,
        nativeParseInt = context.parseInt,
        nativeRandom = Math.random,
        nativeReverse = arrayProto.reverse;

    /* Built-in method references that are verified to be native. */
    var Map = getNative(context, 'Map'),
        Set = getNative(context, 'Set'),
        WeakMap = getNative(context, 'WeakMap'),
        nativeCreate = getNative(Object, 'create');

    /** Used to store function metadata. */
    var metaMap = WeakMap && new WeakMap;

    /** Detect if properties shadowing those on `Object.prototype` are non-enumerable. */
    var nonEnumShadows = !propertyIsEnumerable.call({ 'valueOf': 1 }, 'valueOf');

    /** Used to lookup unminified function names. */
    var realNames = {};

    /** Used to detect maps, sets, and weakmaps. */
    var mapCtorString = Map ? funcToString.call(Map) : '',
        setCtorString = Set ? funcToString.call(Set) : '',
        weakMapCtorString = WeakMap ? funcToString.call(WeakMap) : '';

    /** Used to convert symbols to primitives and strings. */
    var symbolProto = Symbol ? Symbol.prototype : undefined,
        symbolValueOf = symbolProto ? symbolProto.valueOf : undefined,
        symbolToString = symbolProto ? symbolProto.toString : undefined;

    /*------------------------------------------------------------------------*/

    /**
     * Creates a `lodash` object which wraps `value` to enable implicit method
     * chaining. Methods that operate on and return arrays, collections, and
     * functions can be chained together. Methods that retrieve a single value or
     * may return a primitive value will automatically end the chain sequence and
     * return the unwrapped value. Otherwise, the value must be unwrapped with
     * `_#value`.
     *
     * Explicit chaining, which must be unwrapped with `_#value` in all cases,
     * may be enabled using `_.chain`.
     *
     * The execution of chained methods is lazy, that is, it's deferred until
     * `_#value` is implicitly or explicitly called.
     *
     * Lazy evaluation allows several methods to support shortcut fusion. Shortcut
     * fusion is an optimization to merge iteratee calls; this avoids the creation
     * of intermediate arrays and can greatly reduce the number of iteratee executions.
     * Sections of a chain sequence qualify for shortcut fusion if the section is
     * applied to an array of at least two hundred elements and any iteratees
     * accept only one argument. The heuristic for whether a section qualifies
     * for shortcut fusion is subject to change.
     *
     * Chaining is supported in custom builds as long as the `_#value` method is
     * directly or indirectly included in the build.
     *
     * In addition to lodash methods, wrappers have `Array` and `String` methods.
     *
     * The wrapper `Array` methods are:
     * `concat`, `join`, `pop`, `push`, `shift`, `sort`, `splice`, and `unshift`
     *
     * The wrapper `String` methods are:
     * `replace` and `split`
     *
     * The wrapper methods that support shortcut fusion are:
     * `at`, `compact`, `drop`, `dropRight`, `dropWhile`, `filter`, `find`,
     * `findLast`, `head`, `initial`, `last`, `map`, `reject`, `reverse`, `slice`,
     * `tail`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, and `toArray`
     *
     * The chainable wrapper methods are:
     * `after`, `ary`, `assign`, `assignIn`, `assignInWith`, `assignWith`, `at`,
     * `before`, `bind`, `bindAll`, `bindKey`, `castArray`, `chain`, `chunk`,
     * `commit`, `compact`, `concat`, `conforms`, `constant`, `countBy`, `create`,
     * `curry`, `debounce`, `defaults`, `defaultsDeep`, `defer`, `delay`,
     * `difference`, `differenceBy`, `differenceWith`, `drop`, `dropRight`,
     * `dropRightWhile`, `dropWhile`, `extend`, `extendWith`, `fill`, `filter`,
     * `flatten`, `flattenDeep`, `flattenDepth`, `flip`, `flow`, `flowRight`,
     * `fromPairs`, `functions`, `functionsIn`, `groupBy`, `initial`, `intersection`,
     * `intersectionBy`, `intersectionWith`, `invert`, `invertBy`, `invokeMap`,
     * `iteratee`, `keyBy`, `keys`, `keysIn`, `map`, `mapKeys`, `mapValues`,
     * `matches`, `matchesProperty`, `memoize`, `merge`, `mergeWith`, `method`,
     * `methodOf`, `mixin`, `negate`, `nthArg`, `omit`, `omitBy`, `once`, `orderBy`,
     * `over`, `overArgs`, `overEvery`, `overSome`, `partial`, `partialRight`,
     * `partition`, `pick`, `pickBy`, `plant`, `property`, `propertyOf`, `pull`,
     * `pullAll`, `pullAllBy`, `pullAllWith`, `pullAt`, `push`, `range`,
     * `rangeRight`, `rearg`, `reject`, `remove`, `rest`, `reverse`, `sampleSize`,
     * `set`, `setWith`, `shuffle`, `slice`, `sort`, `sortBy`, `splice`, `spread`,
     * `tail`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, `tap`, `throttle`,
     * `thru`, `toArray`, `toPairs`, `toPairsIn`, `toPath`, `toPlainObject`,
     * `transform`, `unary`, `union`, `unionBy`, `unionWith`, `uniq`, `uniqBy`,
     * `uniqWith`, `unset`, `unshift`, `unzip`, `unzipWith`, `update`, `values`,
     * `valuesIn`, `without`, `wrap`, `xor`, `xorBy`, `xorWith`, `zip`, `zipObject`,
     * `zipObjectDeep`, and `zipWith`
     *
     * The wrapper methods that are **not** chainable by default are:
     * `add`, `attempt`, `camelCase`, `capitalize`, `ceil`, `clamp`, `clone`,
     * `cloneDeep`, `cloneDeepWith`, `cloneWith`, `deburr`, `each`, `eachRight`,
     * `endsWith`, `eq`, `escape`, `escapeRegExp`, `every`, `find`, `findIndex`,
     * `findKey`, `findLast`, `findLastIndex`, `findLastKey`, `first`, `floor`,
     * `forEach`, `forEachRight`, `forIn`, `forInRight`, `forOwn`, `forOwnRight`,
     * `get`, `gt`, `gte`, `has`, `hasIn`, `head`, `identity`, `includes`,
     * `indexOf`, `inRange`, `invoke`, `isArguments`, `isArray`, `isArrayBuffer`,
     * `isArrayLike`, `isArrayLikeObject`, `isBoolean`, `isBuffer`, `isDate`,
     * `isElement`, `isEmpty`, `isEqual`, `isEqualWith`, `isError`, `isFinite`,
     * `isFunction`, `isInteger`, `isLength`, `isMap`, `isMatch`, `isMatchWith`,
     * `isNaN`, `isNative`, `isNil`, `isNull`, `isNumber`, `isObject`, `isObjectLike`,
     * `isPlainObject`, `isRegExp`, `isSafeInteger`, `isSet`, `isString`,
     * `isUndefined`, `isTypedArray`, `isWeakMap`, `isWeakSet`, `join`, `kebabCase`,
     * `last`, `lastIndexOf`, `lowerCase`, `lowerFirst`, `lt`, `lte`, `max`,
     * `maxBy`, `mean`, `min`, `minBy`, `noConflict`, `noop`, `now`, `pad`,
     * `padEnd`, `padStart`, `parseInt`, `pop`, `random`, `reduce`, `reduceRight`,
     * `repeat`, `result`, `round`, `runInContext`, `sample`, `shift`, `size`,
     * `snakeCase`, `some`, `sortedIndex`, `sortedIndexBy`, `sortedLastIndex`,
     * `sortedLastIndexBy`, `startCase`, `startsWith`, `subtract`, `sum`, `sumBy`,
     * `template`, `times`, `toInteger`, `toJSON`, `toLength`, `toLower`,
     * `toNumber`, `toSafeInteger`, `toString`, `toUpper`, `trim`, `trimEnd`,
     * `trimStart`, `truncate`, `unescape`, `uniqueId`, `upperCase`, `upperFirst`,
     * `value`, and `words`
     *
     * @name _
     * @constructor
     * @category Seq
     * @param {*} value The value to wrap in a `lodash` instance.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var wrapped = _([1, 2, 3]);
     *
     * // Returns an unwrapped value.
     * wrapped.reduce(_.add);
     * // => 6
     *
     * // Returns a wrapped value.
     * var squares = wrapped.map(square);
     *
     * _.isArray(squares);
     * // => false
     *
     * _.isArray(squares.value());
     * // => true
     */
    function lodash(value) {
      if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
        if (value instanceof LodashWrapper) {
          return value;
        }
        if (hasOwnProperty.call(value, '__wrapped__')) {
          return wrapperClone(value);
        }
      }
      return new LodashWrapper(value);
    }

    /**
     * The function whose prototype all chaining wrappers inherit from.
     *
     * @private
     */
    function baseLodash() {
      // No operation performed.
    }

    /**
     * The base constructor for creating `lodash` wrapper objects.
     *
     * @private
     * @param {*} value The value to wrap.
     * @param {boolean} [chainAll] Enable chaining for all wrapper methods.
     */
    function LodashWrapper(value, chainAll) {
      this.__wrapped__ = value;
      this.__actions__ = [];
      this.__chain__ = !!chainAll;
      this.__index__ = 0;
      this.__values__ = undefined;
    }

    /**
     * By default, the template delimiters used by lodash are like those in
     * embedded Ruby (ERB). Change the following template settings to use
     * alternative delimiters.
     *
     * @static
     * @memberOf _
     * @type {Object}
     */
    lodash.templateSettings = {

      /**
       * Used to detect `data` property values to be HTML-escaped.
       *
       * @memberOf _.templateSettings
       * @type {RegExp}
       */
      'escape': reEscape,

      /**
       * Used to detect code to be evaluated.
       *
       * @memberOf _.templateSettings
       * @type {RegExp}
       */
      'evaluate': reEvaluate,

      /**
       * Used to detect `data` property values to inject.
       *
       * @memberOf _.templateSettings
       * @type {RegExp}
       */
      'interpolate': reInterpolate,

      /**
       * Used to reference the data object in the template text.
       *
       * @memberOf _.templateSettings
       * @type {string}
       */
      'variable': '',

      /**
       * Used to import variables into the compiled template.
       *
       * @memberOf _.templateSettings
       * @type {Object}
       */
      'imports': {

        /**
         * A reference to the `lodash` function.
         *
         * @memberOf _.templateSettings.imports
         * @type {Function}
         */
        '_': lodash
      }
    };

    /*------------------------------------------------------------------------*/

    /**
     * Creates a lazy wrapper object which wraps `value` to enable lazy evaluation.
     *
     * @private
     * @constructor
     * @param {*} value The value to wrap.
     */
    function LazyWrapper(value) {
      this.__wrapped__ = value;
      this.__actions__ = [];
      this.__dir__ = 1;
      this.__filtered__ = false;
      this.__iteratees__ = [];
      this.__takeCount__ = MAX_ARRAY_LENGTH;
      this.__views__ = [];
    }

    /**
     * Creates a clone of the lazy wrapper object.
     *
     * @private
     * @name clone
     * @memberOf LazyWrapper
     * @returns {Object} Returns the cloned `LazyWrapper` object.
     */
    function lazyClone() {
      var result = new LazyWrapper(this.__wrapped__);
      result.__actions__ = copyArray(this.__actions__);
      result.__dir__ = this.__dir__;
      result.__filtered__ = this.__filtered__;
      result.__iteratees__ = copyArray(this.__iteratees__);
      result.__takeCount__ = this.__takeCount__;
      result.__views__ = copyArray(this.__views__);
      return result;
    }

    /**
     * Reverses the direction of lazy iteration.
     *
     * @private
     * @name reverse
     * @memberOf LazyWrapper
     * @returns {Object} Returns the new reversed `LazyWrapper` object.
     */
    function lazyReverse() {
      if (this.__filtered__) {
        var result = new LazyWrapper(this);
        result.__dir__ = -1;
        result.__filtered__ = true;
      } else {
        result = this.clone();
        result.__dir__ *= -1;
      }
      return result;
    }

    /**
     * Extracts the unwrapped value from its lazy wrapper.
     *
     * @private
     * @name value
     * @memberOf LazyWrapper
     * @returns {*} Returns the unwrapped value.
     */
    function lazyValue() {
      var array = this.__wrapped__.value(),
          dir = this.__dir__,
          isArr = isArray(array),
          isRight = dir < 0,
          arrLength = isArr ? array.length : 0,
          view = getView(0, arrLength, this.__views__),
          start = view.start,
          end = view.end,
          length = end - start,
          index = isRight ? end : (start - 1),
          iteratees = this.__iteratees__,
          iterLength = iteratees.length,
          resIndex = 0,
          takeCount = nativeMin(length, this.__takeCount__);

      if (!isArr || arrLength < LARGE_ARRAY_SIZE ||
          (arrLength == length && takeCount == length)) {
        return baseWrapperValue(array, this.__actions__);
      }
      var result = [];

      outer:
      while (length-- && resIndex < takeCount) {
        index += dir;

        var iterIndex = -1,
            value = array[index];

        while (++iterIndex < iterLength) {
          var data = iteratees[iterIndex],
              iteratee = data.iteratee,
              type = data.type,
              computed = iteratee(value);

          if (type == LAZY_MAP_FLAG) {
            value = computed;
          } else if (!computed) {
            if (type == LAZY_FILTER_FLAG) {
              continue outer;
            } else {
              break outer;
            }
          }
        }
        result[resIndex++] = value;
      }
      return result;
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates an hash object.
     *
     * @private
     * @constructor
     * @returns {Object} Returns the new hash object.
     */
    function Hash() {}

    /**
     * Removes `key` and its value from the hash.
     *
     * @private
     * @param {Object} hash The hash to modify.
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function hashDelete(hash, key) {
      return hashHas(hash, key) && delete hash[key];
    }

    /**
     * Gets the hash value for `key`.
     *
     * @private
     * @param {Object} hash The hash to query.
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function hashGet(hash, key) {
      if (nativeCreate) {
        var result = hash[key];
        return result === HASH_UNDEFINED ? undefined : result;
      }
      return hasOwnProperty.call(hash, key) ? hash[key] : undefined;
    }

    /**
     * Checks if a hash value for `key` exists.
     *
     * @private
     * @param {Object} hash The hash to query.
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function hashHas(hash, key) {
      return nativeCreate ? hash[key] !== undefined : hasOwnProperty.call(hash, key);
    }

    /**
     * Sets the hash `key` to `value`.
     *
     * @private
     * @param {Object} hash The hash to modify.
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     */
    function hashSet(hash, key, value) {
      hash[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates a map cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [values] The values to cache.
     */
    function MapCache(values) {
      var index = -1,
          length = values ? values.length : 0;

      this.clear();
      while (++index < length) {
        var entry = values[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * Removes all key-value entries from the map.
     *
     * @private
     * @name clear
     * @memberOf MapCache
     */
    function mapClear() {
      this.__data__ = {
        'hash': new Hash,
        'map': Map ? new Map : [],
        'string': new Hash
      };
    }

    /**
     * Removes `key` and its value from the map.
     *
     * @private
     * @name delete
     * @memberOf MapCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function mapDelete(key) {
      var data = this.__data__;
      if (isKeyable(key)) {
        return hashDelete(typeof key == 'string' ? data.string : data.hash, key);
      }
      return Map ? data.map['delete'](key) : assocDelete(data.map, key);
    }

    /**
     * Gets the map value for `key`.
     *
     * @private
     * @name get
     * @memberOf MapCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function mapGet(key) {
      var data = this.__data__;
      if (isKeyable(key)) {
        return hashGet(typeof key == 'string' ? data.string : data.hash, key);
      }
      return Map ? data.map.get(key) : assocGet(data.map, key);
    }

    /**
     * Checks if a map value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf MapCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function mapHas(key) {
      var data = this.__data__;
      if (isKeyable(key)) {
        return hashHas(typeof key == 'string' ? data.string : data.hash, key);
      }
      return Map ? data.map.has(key) : assocHas(data.map, key);
    }

    /**
     * Sets the map `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf MapCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the map cache object.
     */
    function mapSet(key, value) {
      var data = this.__data__;
      if (isKeyable(key)) {
        hashSet(typeof key == 'string' ? data.string : data.hash, key, value);
      } else if (Map) {
        data.map.set(key, value);
      } else {
        assocSet(data.map, key, value);
      }
      return this;
    }

    /*------------------------------------------------------------------------*/

    /**
     *
     * Creates a set cache object to store unique values.
     *
     * @private
     * @constructor
     * @param {Array} [values] The values to cache.
     */
    function SetCache(values) {
      var index = -1,
          length = values ? values.length : 0;

      this.__data__ = new MapCache;
      while (++index < length) {
        this.push(values[index]);
      }
    }

    /**
     * Checks if `value` is in `cache`.
     *
     * @private
     * @param {Object} cache The set cache to search.
     * @param {*} value The value to search for.
     * @returns {number} Returns `true` if `value` is found, else `false`.
     */
    function cacheHas(cache, value) {
      var map = cache.__data__;
      if (isKeyable(value)) {
        var data = map.__data__,
            hash = typeof value == 'string' ? data.string : data.hash;

        return hash[value] === HASH_UNDEFINED;
      }
      return map.has(value);
    }

    /**
     * Adds `value` to the set cache.
     *
     * @private
     * @name push
     * @memberOf SetCache
     * @param {*} value The value to cache.
     */
    function cachePush(value) {
      var map = this.__data__;
      if (isKeyable(value)) {
        var data = map.__data__,
            hash = typeof value == 'string' ? data.string : data.hash;

        hash[value] = HASH_UNDEFINED;
      }
      else {
        map.set(value, HASH_UNDEFINED);
      }
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates a stack cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [values] The values to cache.
     */
    function Stack(values) {
      var index = -1,
          length = values ? values.length : 0;

      this.clear();
      while (++index < length) {
        var entry = values[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * Removes all key-value entries from the stack.
     *
     * @private
     * @name clear
     * @memberOf Stack
     */
    function stackClear() {
      this.__data__ = { 'array': [], 'map': null };
    }

    /**
     * Removes `key` and its value from the stack.
     *
     * @private
     * @name delete
     * @memberOf Stack
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function stackDelete(key) {
      var data = this.__data__,
          array = data.array;

      return array ? assocDelete(array, key) : data.map['delete'](key);
    }

    /**
     * Gets the stack value for `key`.
     *
     * @private
     * @name get
     * @memberOf Stack
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function stackGet(key) {
      var data = this.__data__,
          array = data.array;

      return array ? assocGet(array, key) : data.map.get(key);
    }

    /**
     * Checks if a stack value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf Stack
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function stackHas(key) {
      var data = this.__data__,
          array = data.array;

      return array ? assocHas(array, key) : data.map.has(key);
    }

    /**
     * Sets the stack `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf Stack
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the stack cache object.
     */
    function stackSet(key, value) {
      var data = this.__data__,
          array = data.array;

      if (array) {
        if (array.length < (LARGE_ARRAY_SIZE - 1)) {
          assocSet(array, key, value);
        } else {
          data.array = null;
          data.map = new MapCache(array);
        }
      }
      var map = data.map;
      if (map) {
        map.set(key, value);
      }
      return this;
    }

    /*------------------------------------------------------------------------*/

    /**
     * Removes `key` and its value from the associative array.
     *
     * @private
     * @param {Array} array The array to query.
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function assocDelete(array, key) {
      var index = assocIndexOf(array, key);
      if (index < 0) {
        return false;
      }
      var lastIndex = array.length - 1;
      if (index == lastIndex) {
        array.pop();
      } else {
        splice.call(array, index, 1);
      }
      return true;
    }

    /**
     * Gets the associative array value for `key`.
     *
     * @private
     * @param {Array} array The array to query.
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function assocGet(array, key) {
      var index = assocIndexOf(array, key);
      return index < 0 ? undefined : array[index][1];
    }

    /**
     * Checks if an associative array value for `key` exists.
     *
     * @private
     * @param {Array} array The array to query.
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function assocHas(array, key) {
      return assocIndexOf(array, key) > -1;
    }

    /**
     * Gets the index at which the first occurrence of `key` is found in `array`
     * of key-value pairs.
     *
     * @private
     * @param {Array} array The array to search.
     * @param {*} key The key to search for.
     * @returns {number} Returns the index of the matched value, else `-1`.
     */
    function assocIndexOf(array, key) {
      var length = array.length;
      while (length--) {
        if (eq(array[length][0], key)) {
          return length;
        }
      }
      return -1;
    }

    /**
     * Sets the associative array `key` to `value`.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     */
    function assocSet(array, key, value) {
      var index = assocIndexOf(array, key);
      if (index < 0) {
        array.push([key, value]);
      } else {
        array[index][1] = value;
      }
    }

    /*------------------------------------------------------------------------*/

    /**
     * Used by `_.defaults` to customize its `_.assignIn` use.
     *
     * @private
     * @param {*} objValue The destination value.
     * @param {*} srcValue The source value.
     * @param {string} key The key of the property to assign.
     * @param {Object} object The parent object of `objValue`.
     * @returns {*} Returns the value to assign.
     */
    function assignInDefaults(objValue, srcValue, key, object) {
      if (objValue === undefined ||
          (eq(objValue, objectProto[key]) && !hasOwnProperty.call(object, key))) {
        return srcValue;
      }
      return objValue;
    }

    /**
     * This function is like `assignValue` except that it doesn't assign
     * `undefined` values.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {string} key The key of the property to assign.
     * @param {*} value The value to assign.
     */
    function assignMergeValue(object, key, value) {
      if ((value !== undefined && !eq(object[key], value)) ||
          (typeof key == 'number' && value === undefined && !(key in object))) {
        object[key] = value;
      }
    }

    /**
     * Assigns `value` to `key` of `object` if the existing value is not equivalent
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {string} key The key of the property to assign.
     * @param {*} value The value to assign.
     */
    function assignValue(object, key, value) {
      var objValue = object[key];
      if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
          (value === undefined && !(key in object))) {
        object[key] = value;
      }
    }

    /**
     * Aggregates elements of `collection` on `accumulator` with keys transformed
     * by `iteratee` and values set by `setter`.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} setter The function to set `accumulator` values.
     * @param {Function} iteratee The iteratee to transform keys.
     * @param {Object} accumulator The initial aggregated object.
     * @returns {Function} Returns `accumulator`.
     */
    function baseAggregator(collection, setter, iteratee, accumulator) {
      baseEach(collection, function(value, key, collection) {
        setter(accumulator, value, iteratee(value), collection);
      });
      return accumulator;
    }

    /**
     * The base implementation of `_.assign` without support for multiple sources
     * or `customizer` functions.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @returns {Object} Returns `object`.
     */
    function baseAssign(object, source) {
      return object && copyObject(source, keys(source), object);
    }

    /**
     * The base implementation of `_.at` without support for individual paths.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {string[]} paths The property paths of elements to pick.
     * @returns {Array} Returns the new array of picked elements.
     */
    function baseAt(object, paths) {
      var index = -1,
          isNil = object == null,
          length = paths.length,
          result = Array(length);

      while (++index < length) {
        result[index] = isNil ? undefined : get(object, paths[index]);
      }
      return result;
    }

    /**
     * Casts `value` to an empty array if it's not an array like object.
     *
     * @private
     * @param {*} value The value to inspect.
     * @returns {Array} Returns the array-like object.
     */
    function baseCastArrayLikeObject(value) {
      return isArrayLikeObject(value) ? value : [];
    }

    /**
     * Casts `value` to `identity` if it's not a function.
     *
     * @private
     * @param {*} value The value to inspect.
     * @returns {Array} Returns the array-like object.
     */
    function baseCastFunction(value) {
      return typeof value == 'function' ? value : identity;
    }

    /**
     * Casts `value` to a path array if it's not one.
     *
     * @private
     * @param {*} value The value to inspect.
     * @returns {Array} Returns the cast property path array.
     */
    function baseCastPath(value) {
      return isArray(value) ? value : stringToPath(value);
    }

    /**
     * The base implementation of `_.clamp` which doesn't coerce arguments to numbers.
     *
     * @private
     * @param {number} number The number to clamp.
     * @param {number} [lower] The lower bound.
     * @param {number} upper The upper bound.
     * @returns {number} Returns the clamped number.
     */
    function baseClamp(number, lower, upper) {
      if (number === number) {
        if (upper !== undefined) {
          number = number <= upper ? number : upper;
        }
        if (lower !== undefined) {
          number = number >= lower ? number : lower;
        }
      }
      return number;
    }

    /**
     * The base implementation of `_.clone` and `_.cloneDeep` which tracks
     * traversed objects.
     *
     * @private
     * @param {*} value The value to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @param {boolean} [isFull] Specify a clone including symbols.
     * @param {Function} [customizer] The function to customize cloning.
     * @param {string} [key] The key of `value`.
     * @param {Object} [object] The parent object of `value`.
     * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
     * @returns {*} Returns the cloned value.
     */
    function baseClone(value, isDeep, isFull, customizer, key, object, stack) {
      var result;
      if (customizer) {
        result = object ? customizer(value, key, object, stack) : customizer(value);
      }
      if (result !== undefined) {
        return result;
      }
      if (!isObject(value)) {
        return value;
      }
      var isArr = isArray(value);
      if (isArr) {
        result = initCloneArray(value);
        if (!isDeep) {
          return copyArray(value, result);
        }
      } else {
        var tag = getTag(value),
            isFunc = tag == funcTag || tag == genTag;

        if (isBuffer(value)) {
          return cloneBuffer(value, isDeep);
        }
        if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
          if (isHostObject(value)) {
            return object ? value : {};
          }
          result = initCloneObject(isFunc ? {} : value);
          if (!isDeep) {
            result = baseAssign(result, value);
            return isFull ? copySymbols(value, result) : result;
          }
        } else {
          if (!cloneableTags[tag]) {
            return object ? value : {};
          }
          result = initCloneByTag(value, tag, isDeep);
        }
      }
      // Check for circular references and return its corresponding clone.
      stack || (stack = new Stack);
      var stacked = stack.get(value);
      if (stacked) {
        return stacked;
      }
      stack.set(value, result);

      // Recursively populate clone (susceptible to call stack limits).
      (isArr ? arrayEach : baseForOwn)(value, function(subValue, key) {
        assignValue(result, key, baseClone(subValue, isDeep, isFull, customizer, key, value, stack));
      });
      return (isFull && !isArr) ? copySymbols(value, result) : result;
    }

    /**
     * The base implementation of `_.conforms` which doesn't clone `source`.
     *
     * @private
     * @param {Object} source The object of property predicates to conform to.
     * @returns {Function} Returns the new function.
     */
    function baseConforms(source) {
      var props = keys(source),
          length = props.length;

      return function(object) {
        if (object == null) {
          return !length;
        }
        var index = length;
        while (index--) {
          var key = props[index],
              predicate = source[key],
              value = object[key];

          if ((value === undefined && !(key in Object(object))) || !predicate(value)) {
            return false;
          }
        }
        return true;
      };
    }

    /**
     * The base implementation of `_.create` without support for assigning
     * properties to the created object.
     *
     * @private
     * @param {Object} prototype The object to inherit from.
     * @returns {Object} Returns the new object.
     */
    function baseCreate(proto) {
      return isObject(proto) ? objectCreate(proto) : {};
    }

    /**
     * The base implementation of `_.delay` and `_.defer` which accepts an array
     * of `func` arguments.
     *
     * @private
     * @param {Function} func The function to delay.
     * @param {number} wait The number of milliseconds to delay invocation.
     * @param {Object} args The arguments to provide to `func`.
     * @returns {number} Returns the timer id.
     */
    function baseDelay(func, wait, args) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      return setTimeout(function() { func.apply(undefined, args); }, wait);
    }

    /**
     * The base implementation of methods like `_.difference` without support for
     * excluding multiple arrays or iteratee shorthands.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Array} values The values to exclude.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of filtered values.
     */
    function baseDifference(array, values, iteratee, comparator) {
      var index = -1,
          includes = arrayIncludes,
          isCommon = true,
          length = array.length,
          result = [],
          valuesLength = values.length;

      if (!length) {
        return result;
      }
      if (iteratee) {
        values = arrayMap(values, baseUnary(iteratee));
      }
      if (comparator) {
        includes = arrayIncludesWith;
        isCommon = false;
      }
      else if (values.length >= LARGE_ARRAY_SIZE) {
        includes = cacheHas;
        isCommon = false;
        values = new SetCache(values);
      }
      outer:
      while (++index < length) {
        var value = array[index],
            computed = iteratee ? iteratee(value) : value;

        if (isCommon && computed === computed) {
          var valuesIndex = valuesLength;
          while (valuesIndex--) {
            if (values[valuesIndex] === computed) {
              continue outer;
            }
          }
          result.push(value);
        }
        else if (!includes(values, computed, comparator)) {
          result.push(value);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.forEach` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array|Object} Returns `collection`.
     */
    var baseEach = createBaseEach(baseForOwn);

    /**
     * The base implementation of `_.forEachRight` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array|Object} Returns `collection`.
     */
    var baseEachRight = createBaseEach(baseForOwnRight, true);

    /**
     * The base implementation of `_.every` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if all elements pass the predicate check, else `false`
     */
    function baseEvery(collection, predicate) {
      var result = true;
      baseEach(collection, function(value, index, collection) {
        result = !!predicate(value, index, collection);
        return result;
      });
      return result;
    }

    /**
     * The base implementation of `_.fill` without an iteratee call guard.
     *
     * @private
     * @param {Array} array The array to fill.
     * @param {*} value The value to fill `array` with.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns `array`.
     */
    function baseFill(array, value, start, end) {
      var length = array.length;

      start = toInteger(start);
      if (start < 0) {
        start = -start > length ? 0 : (length + start);
      }
      end = (end === undefined || end > length) ? length : toInteger(end);
      if (end < 0) {
        end += length;
      }
      end = start > end ? 0 : toLength(end);
      while (start < end) {
        array[start++] = value;
      }
      return array;
    }

    /**
     * The base implementation of `_.filter` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     */
    function baseFilter(collection, predicate) {
      var result = [];
      baseEach(collection, function(value, index, collection) {
        if (predicate(value, index, collection)) {
          result.push(value);
        }
      });
      return result;
    }

    /**
     * The base implementation of `_.flatten` with support for restricting flattening.
     *
     * @private
     * @param {Array} array The array to flatten.
     * @param {number} depth The maximum recursion depth.
     * @param {boolean} [isStrict] Restrict flattening to arrays-like objects.
     * @param {Array} [result=[]] The initial result value.
     * @returns {Array} Returns the new flattened array.
     */
    function baseFlatten(array, depth, isStrict, result) {
      result || (result = []);

      var index = -1,
          length = array.length;

      while (++index < length) {
        var value = array[index];
        if (depth > 0 && isArrayLikeObject(value) &&
            (isStrict || isArray(value) || isArguments(value))) {
          if (depth > 1) {
            // Recursively flatten arrays (susceptible to call stack limits).
            baseFlatten(value, depth - 1, isStrict, result);
          } else {
            arrayPush(result, value);
          }
        } else if (!isStrict) {
          result[result.length] = value;
        }
      }
      return result;
    }

    /**
     * The base implementation of `baseForIn` and `baseForOwn` which iterates
     * over `object` properties returned by `keysFunc` invoking `iteratee` for
     * each property. Iteratee functions may exit iteration early by explicitly
     * returning `false`.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @returns {Object} Returns `object`.
     */
    var baseFor = createBaseFor();

    /**
     * This function is like `baseFor` except that it iterates over properties
     * in the opposite order.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @returns {Object} Returns `object`.
     */
    var baseForRight = createBaseFor(true);

    /**
     * The base implementation of `_.forIn` without support for iteratee shorthands.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Object} Returns `object`.
     */
    function baseForIn(object, iteratee) {
      return object == null ? object : baseFor(object, iteratee, keysIn);
    }

    /**
     * The base implementation of `_.forOwn` without support for iteratee shorthands.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Object} Returns `object`.
     */
    function baseForOwn(object, iteratee) {
      return object && baseFor(object, iteratee, keys);
    }

    /**
     * The base implementation of `_.forOwnRight` without support for iteratee shorthands.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Object} Returns `object`.
     */
    function baseForOwnRight(object, iteratee) {
      return object && baseForRight(object, iteratee, keys);
    }

    /**
     * The base implementation of `_.functions` which creates an array of
     * `object` function property names filtered from `props`.
     *
     * @private
     * @param {Object} object The object to inspect.
     * @param {Array} props The property names to filter.
     * @returns {Array} Returns the new array of filtered property names.
     */
    function baseFunctions(object, props) {
      return arrayFilter(props, function(key) {
        return isFunction(object[key]);
      });
    }

    /**
     * The base implementation of `_.get` without support for default values.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to get.
     * @returns {*} Returns the resolved value.
     */
    function baseGet(object, path) {
      path = isKey(path, object) ? [path + ''] : baseCastPath(path);

      var index = 0,
          part,
          length = path.length;

      while (object != null && index < length) {
        part = path[index++];
        if (isArrayLike(object) && /^-\d+$/.test(part)) {
          part = object.length + (+part);
        }

        object = object[part];
      }
      return (index && index == length) ? object : undefined;
    }

    /**
     * The base implementation of `_.has` without support for deep paths.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array|string} key The key to check.
     * @returns {boolean} Returns `true` if `key` exists, else `false`.
     */
    function baseHas(object, key) {
      // Avoid a bug in IE 10-11 where objects with a [[Prototype]] of `null`,
      // that are composed entirely of index properties, return `false` for
      // `hasOwnProperty` checks of them.
      return hasOwnProperty.call(object, key) ||
        (typeof object == 'object' && key in object && getPrototypeOf(object) === null);
    }

    /**
     * The base implementation of `_.hasIn` without support for deep paths.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array|string} key The key to check.
     * @returns {boolean} Returns `true` if `key` exists, else `false`.
     */
    function baseHasIn(object, key) {
      return key in Object(object);
    }

    /**
     * The base implementation of `_.inRange` which doesn't coerce arguments to numbers.
     *
     * @private
     * @param {number} number The number to check.
     * @param {number} start The start of the range.
     * @param {number} end The end of the range.
     * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
     */
    function baseInRange(number, start, end) {
      return number >= nativeMin(start, end) && number < nativeMax(start, end);
    }

    /**
     * The base implementation of methods like `_.intersection`, without support
     * for iteratee shorthands, that accepts an array of arrays to inspect.
     *
     * @private
     * @param {Array} arrays The arrays to inspect.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of shared values.
     */
    function baseIntersection(arrays, iteratee, comparator) {
      var includes = comparator ? arrayIncludesWith : arrayIncludes,
          length = arrays[0].length,
          othLength = arrays.length,
          othIndex = othLength,
          caches = Array(othLength),
          maxLength = Infinity,
          result = [];

      while (othIndex--) {
        var array = arrays[othIndex];
        if (othIndex && iteratee) {
          array = arrayMap(array, baseUnary(iteratee));
        }
        maxLength = nativeMin(array.length, maxLength);
        caches[othIndex] = !comparator && (iteratee || (length >= 120 && array.length >= 120))
          ? new SetCache(othIndex && array)
          : undefined;
      }
      array = arrays[0];

      var index = -1,
          seen = caches[0];

      outer:
      while (++index < length && result.length < maxLength) {
        var value = array[index],
            computed = iteratee ? iteratee(value) : value;

        if (!(seen
              ? cacheHas(seen, computed)
              : includes(result, computed, comparator)
            )) {
          othIndex = othLength;
          while (--othIndex) {
            var cache = caches[othIndex];
            if (!(cache
                  ? cacheHas(cache, computed)
                  : includes(arrays[othIndex], computed, comparator))
                ) {
              continue outer;
            }
          }
          if (seen) {
            seen.push(computed);
          }
          result.push(value);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.invert` and `_.invertBy` which inverts
     * `object` with values transformed by `iteratee` and set by `setter`.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} setter The function to set `accumulator` values.
     * @param {Function} iteratee The iteratee to transform values.
     * @param {Object} accumulator The initial inverted object.
     * @returns {Function} Returns `accumulator`.
     */
    function baseInverter(object, setter, iteratee, accumulator) {
      baseForOwn(object, function(value, key, object) {
        setter(accumulator, iteratee(value), key, object);
      });
      return accumulator;
    }

    /**
     * The base implementation of `_.invoke` without support for individual
     * method arguments.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the method to invoke.
     * @param {Array} args The arguments to invoke the method with.
     * @returns {*} Returns the result of the invoked method.
     */
    function baseInvoke(object, path, args) {
      if (!isKey(path, object)) {
        path = baseCastPath(path);
        object = parent(object, path);
        path = last(path);
      }
      var func = object == null ? object : object[path];
      return func == null ? undefined : apply(func, object, args);
    }

    /**
     * The base implementation of `_.isEqual` which supports partial comparisons
     * and tracks traversed objects.
     *
     * @private
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @param {Function} [customizer] The function to customize comparisons.
     * @param {boolean} [bitmask] The bitmask of comparison flags.
     *  The bitmask may be composed of the following flags:
     *     1 - Unordered comparison
     *     2 - Partial comparison
     * @param {Object} [stack] Tracks traversed `value` and `other` objects.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     */
    function baseIsEqual(value, other, customizer, bitmask, stack) {
      if (value === other) {
        return true;
      }
      if (value == null || other == null || (!isObject(value) && !isObjectLike(other))) {
        return value !== value && other !== other;
      }
      return baseIsEqualDeep(value, other, baseIsEqual, customizer, bitmask, stack);
    }

    /**
     * A specialized version of `baseIsEqual` for arrays and objects which performs
     * deep comparisons and tracks traversed objects enabling objects with circular
     * references to be compared.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Function} [customizer] The function to customize comparisons.
     * @param {number} [bitmask] The bitmask of comparison flags. See `baseIsEqual` for more details.
     * @param {Object} [stack] Tracks traversed `object` and `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function baseIsEqualDeep(object, other, equalFunc, customizer, bitmask, stack) {
      var objIsArr = isArray(object),
          othIsArr = isArray(other),
          objTag = arrayTag,
          othTag = arrayTag;

      if (!objIsArr) {
        objTag = getTag(object);
        objTag = objTag == argsTag ? objectTag : objTag;
      }
      if (!othIsArr) {
        othTag = getTag(other);
        othTag = othTag == argsTag ? objectTag : othTag;
      }
      var objIsObj = objTag == objectTag && !isHostObject(object),
          othIsObj = othTag == objectTag && !isHostObject(other),
          isSameTag = objTag == othTag;

      if (isSameTag && !objIsObj) {
        stack || (stack = new Stack);
        return (objIsArr || isTypedArray(object))
          ? equalArrays(object, other, equalFunc, customizer, bitmask, stack)
          : equalByTag(object, other, objTag, equalFunc, customizer, bitmask, stack);
      }
      if (!(bitmask & PARTIAL_COMPARE_FLAG)) {
        var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
            othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

        if (objIsWrapped || othIsWrapped) {
          stack || (stack = new Stack);
          return equalFunc(objIsWrapped ? object.value() : object, othIsWrapped ? other.value() : other, customizer, bitmask, stack);
        }
      }
      if (!isSameTag) {
        return false;
      }
      stack || (stack = new Stack);
      return equalObjects(object, other, equalFunc, customizer, bitmask, stack);
    }

    /**
     * The base implementation of `_.isMatch` without support for iteratee shorthands.
     *
     * @private
     * @param {Object} object The object to inspect.
     * @param {Object} source The object of property values to match.
     * @param {Array} matchData The property names, values, and compare flags to match.
     * @param {Function} [customizer] The function to customize comparisons.
     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
     */
    function baseIsMatch(object, source, matchData, customizer) {
      var index = matchData.length,
          length = index,
          noCustomizer = !customizer;

      if (object == null) {
        return !length;
      }
      object = Object(object);
      while (index--) {
        var data = matchData[index];
        if ((noCustomizer && data[2])
              ? data[1] !== object[data[0]]
              : !(data[0] in object)
            ) {
          return false;
        }
      }
      while (++index < length) {
        data = matchData[index];
        var key = data[0],
            objValue = object[key],
            srcValue = data[1];

        if (noCustomizer && data[2]) {
          if (objValue === undefined && !(key in object)) {
            return false;
          }
        } else {
          var stack = new Stack,
              result = customizer ? customizer(objValue, srcValue, key, object, source, stack) : undefined;

          if (!(result === undefined
                ? baseIsEqual(srcValue, objValue, customizer, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG, stack)
                : result
              )) {
            return false;
          }
        }
      }
      return true;
    }

    /**
     * The base implementation of `_.iteratee`.
     *
     * @private
     * @param {*} [value=_.identity] The value to convert to an iteratee.
     * @returns {Function} Returns the iteratee.
     */
    function baseIteratee(value) {
      var type = typeof value;
      if (type == 'function') {
        return value;
      }
      if (value == null) {
        return identity;
      }
      if (type == 'object') {
        return isArray(value)
          ? baseMatchesProperty(value[0], value[1])
          : baseMatches(value);
      }
      return property(value);
    }

    /**
     * The base implementation of `_.keys` which doesn't skip the constructor
     * property of prototypes or treat sparse arrays as dense.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */
    function baseKeys(object) {
      return nativeKeys(Object(object));
    }

    /**
     * The base implementation of `_.keysIn` which doesn't skip the constructor
     * property of prototypes or treat sparse arrays as dense.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */
    function baseKeysIn(object) {
      object = object == null ? object : Object(object);

      var result = [];
      for (var key in object) {
        result.push(key);
      }
      return result;
    }

    // Fallback for IE < 9 with es6-shim.
    if (enumerate && !propertyIsEnumerable.call({ 'valueOf': 1 }, 'valueOf')) {
      baseKeysIn = function(object) {
        return iteratorToArray(enumerate(object));
      };
    }

    /**
     * The base implementation of `_.map` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns the new mapped array.
     */
    function baseMap(collection, iteratee) {
      var index = -1,
          result = isArrayLike(collection) ? Array(collection.length) : [];

      baseEach(collection, function(value, key, collection) {
        result[++index] = iteratee(value, key, collection);
      });
      return result;
    }

    /**
     * The base implementation of `_.matches` which doesn't clone `source`.
     *
     * @private
     * @param {Object} source The object of property values to match.
     * @returns {Function} Returns the new function.
     */
    function baseMatches(source) {
      var matchData = getMatchData(source);
      if (matchData.length == 1 && matchData[0][2]) {
        var key = matchData[0][0],
            value = matchData[0][1];

        return function(object) {
          if (object == null) {
            return false;
          }
          return object[key] === value &&
            (value !== undefined || (key in Object(object)));
        };
      }
      return function(object) {
        return object === source || baseIsMatch(object, source, matchData);
      };
    }

    /**
     * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
     *
     * @private
     * @param {string} path The path of the property to get.
     * @param {*} srcValue The value to match.
     * @returns {Function} Returns the new function.
     */
    function baseMatchesProperty(path, srcValue) {
      return function(object) {
        var objValue = get(object, path);
        return (objValue === undefined && objValue === srcValue)
          ? hasIn(object, path)
          : baseIsEqual(srcValue, objValue, undefined, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG);
      };
    }

    /**
     * The base implementation of `_.merge` without support for multiple sources.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @param {number} srcIndex The index of `source`.
     * @param {Function} [customizer] The function to customize merged values.
     * @param {Object} [stack] Tracks traversed source values and their merged counterparts.
     */
    function baseMerge(object, source, srcIndex, customizer, stack) {
      if (object === source) {
        return;
      }
      var props = (isArray(source) || isTypedArray(source))
        ? undefined
        : keysIn(source);

      arrayEach(props || source, function(srcValue, key) {
        if (props) {
          key = srcValue;
          srcValue = source[key];
        }
        if (isObject(srcValue)) {
          stack || (stack = new Stack);
          baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
        }
        else {
          var newValue = customizer
            ? customizer(object[key], srcValue, (key + ''), object, source, stack)
            : undefined;

          if (newValue === undefined) {
            newValue = srcValue;
          }
          assignMergeValue(object, key, newValue);
        }
      });
    }

    /**
     * A specialized version of `baseMerge` for arrays and objects which performs
     * deep merges and tracks traversed objects enabling objects with circular
     * references to be merged.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @param {string} key The key of the value to merge.
     * @param {number} srcIndex The index of `source`.
     * @param {Function} mergeFunc The function to merge values.
     * @param {Function} [customizer] The function to customize assigned values.
     * @param {Object} [stack] Tracks traversed source values and their merged counterparts.
     */
    function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
      var objValue = object[key],
          srcValue = source[key],
          stacked = stack.get(srcValue);

      if (stacked) {
        assignMergeValue(object, key, stacked);
        return;
      }
      var newValue = customizer
        ? customizer(objValue, srcValue, (key + ''), object, source, stack)
        : undefined;

      var isCommon = newValue === undefined;

      if (isCommon) {
        newValue = srcValue;
        if (isArray(srcValue) || isTypedArray(srcValue)) {
          if (isArray(objValue)) {
            newValue = objValue;
          }
          else if (isArrayLikeObject(objValue)) {
            newValue = copyArray(objValue);
          }
          else {
            isCommon = false;
            newValue = baseClone(srcValue, !customizer);
          }
        }
        else if (isPlainObject(srcValue) || isArguments(srcValue)) {
          if (isArguments(objValue)) {
            newValue = toPlainObject(objValue);
          }
          else if (!isObject(objValue) || (srcIndex && isFunction(objValue))) {
            isCommon = false;
            newValue = baseClone(srcValue, !customizer);
          }
          else {
            newValue = objValue;
          }
        }
        else {
          isCommon = false;
        }
      }
      stack.set(srcValue, newValue);

      if (isCommon) {
        // Recursively merge objects and arrays (susceptible to call stack limits).
        mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
      }
      stack['delete'](srcValue);
      assignMergeValue(object, key, newValue);
    }

    /**
     * The base implementation of `_.orderBy` without param guards.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.
     * @param {string[]} orders The sort orders of `iteratees`.
     * @returns {Array} Returns the new sorted array.
     */
    function baseOrderBy(collection, iteratees, orders) {
      var index = -1;
      iteratees = arrayMap(iteratees.length ? iteratees : Array(1), getIteratee());

      var result = baseMap(collection, function(value, key, collection) {
        var criteria = arrayMap(iteratees, function(iteratee) {
          return iteratee(value);
        });
        return { 'criteria': criteria, 'index': ++index, 'value': value };
      });

      return baseSortBy(result, function(object, other) {
        return compareMultiple(object, other, orders);
      });
    }

    /**
     * The base implementation of `_.pick` without support for individual
     * property names.
     *
     * @private
     * @param {Object} object The source object.
     * @param {string[]} props The property names to pick.
     * @returns {Object} Returns the new object.
     */
    function basePick(object, props) {
      object = Object(object);
      return arrayReduce(props, function(result, key) {
        if (key in object) {
          result[key] = object[key];
        }
        return result;
      }, {});
    }

    /**
     * The base implementation of  `_.pickBy` without support for iteratee shorthands.
     *
     * @private
     * @param {Object} object The source object.
     * @param {Function} predicate The function invoked per property.
     * @returns {Object} Returns the new object.
     */
    function basePickBy(object, predicate) {
      var result = {};
      baseForIn(object, function(value, key) {
        if (predicate(value, key)) {
          result[key] = value;
        }
      });
      return result;
    }

    /**
     * The base implementation of `_.property` without support for deep paths.
     *
     * @private
     * @param {string} key The key of the property to get.
     * @returns {Function} Returns the new function.
     */
    function baseProperty(key) {
      return function(object) {
        return object == null ? undefined : object[key];
      };
    }

    /**
     * A specialized version of `baseProperty` which supports deep paths.
     *
     * @private
     * @param {Array|string} path The path of the property to get.
     * @returns {Function} Returns the new function.
     */
    function basePropertyDeep(path) {
      return function(object) {
        return baseGet(object, path);
      };
    }

    /**
     * The base implementation of `_.pullAllBy` without support for iteratee
     * shorthands.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {Array} values The values to remove.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns `array`.
     */
    function basePullAll(array, values, iteratee, comparator) {
      var indexOf = comparator ? baseIndexOfWith : baseIndexOf,
          index = -1,
          length = values.length,
          seen = array;

      if (iteratee) {
        seen = arrayMap(array, baseUnary(iteratee));
      }
      while (++index < length) {
        var fromIndex = 0,
            value = values[index],
            computed = iteratee ? iteratee(value) : value;

        while ((fromIndex = indexOf(seen, computed, fromIndex, comparator)) > -1) {
          if (seen !== array) {
            splice.call(seen, fromIndex, 1);
          }
          splice.call(array, fromIndex, 1);
        }
      }
      return array;
    }

    /**
     * The base implementation of `_.pullAt` without support for individual
     * indexes or capturing the removed elements.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {number[]} indexes The indexes of elements to remove.
     * @returns {Array} Returns `array`.
     */
    function basePullAt(array, indexes) {
      var length = array ? indexes.length : 0,
          lastIndex = length - 1;

      while (length--) {
        var index = indexes[length];
        if (lastIndex == length || index != previous) {
          var previous = index;
          if (isIndex(index)) {
            splice.call(array, index, 1);
          }
          else if (!isKey(index, array)) {
            var path = baseCastPath(index),
                object = parent(array, path);

            if (object != null) {
              delete object[last(path)];
            }
          }
          else {
            delete array[index];
          }
        }
      }
      return array;
    }

    /**
     * The base implementation of `_.random` without support for returning
     * floating-point numbers.
     *
     * @private
     * @param {number} lower The lower bound.
     * @param {number} upper The upper bound.
     * @returns {number} Returns the random number.
     */
    function baseRandom(lower, upper) {
      return lower + nativeFloor(nativeRandom() * (upper - lower + 1));
    }

    /**
     * The base implementation of `_.range` and `_.rangeRight` which doesn't
     * coerce arguments to numbers.
     *
     * @private
     * @param {number} start The start of the range.
     * @param {number} end The end of the range.
     * @param {number} step The value to increment or decrement by.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Array} Returns the new array of numbers.
     */
    function baseRange(start, end, step, fromRight) {
      var index = -1,
          length = nativeMax(nativeCeil((end - start) / (step || 1)), 0),
          result = Array(length);

      while (length--) {
        result[fromRight ? length : ++index] = start;
        start += step;
      }
      return result;
    }

    /**
     * The base implementation of `_.set`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to set.
     * @param {*} value The value to set.
     * @param {Function} [customizer] The function to customize path creation.
     * @returns {Object} Returns `object`.
     */
    function baseSet(object, path, value, customizer) {
      path = isKey(path, object) ? [path + ''] : baseCastPath(path);

      var index = -1,
          length = path.length,
          lastIndex = length - 1,
          nested = object;

      while (nested != null && ++index < length) {
        var key = path[index];
        if (isObject(nested)) {
          var newValue = value;
          if (index != lastIndex) {
            var objValue = nested[key];
            newValue = customizer ? customizer(objValue, key, nested) : undefined;
            if (newValue === undefined) {
              newValue = objValue == null
                ? (isIndex(path[index + 1]) ? [] : {})
                : objValue;
            }
          }
          assignValue(nested, key, newValue);
        }
        nested = nested[key];
      }
      return object;
    }

    /**
     * The base implementation of `setData` without support for hot loop detection.
     *
     * @private
     * @param {Function} func The function to associate metadata with.
     * @param {*} data The metadata.
     * @returns {Function} Returns `func`.
     */
    var baseSetData = !metaMap ? identity : function(func, data) {
      metaMap.set(func, data);
      return func;
    };

    /**
     * The base implementation of `_.slice` without an iteratee call guard.
     *
     * @private
     * @param {Array} array The array to slice.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns the slice of `array`.
     */
    function baseSlice(array, start, end) {
      var index = -1,
          length = array.length;

      if (start < 0) {
        start = -start > length ? 0 : (length + start);
      }
      end = end > length ? length : end;
      if (end < 0) {
        end += length;
      }
      length = start > end ? 0 : ((end - start) >>> 0);
      start >>>= 0;

      var result = Array(length);
      while (++index < length) {
        result[index] = array[index + start];
      }
      return result;
    }

    /**
     * The base implementation of `_.some` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if any element passes the predicate check, else `false`.
     */
    function baseSome(collection, predicate) {
      var result;

      baseEach(collection, function(value, index, collection) {
        result = predicate(value, index, collection);
        return !result;
      });
      return !!result;
    }

    /**
     * The base implementation of `_.sortedIndex` and `_.sortedLastIndex` which
     * performs a binary search of `array` to determine the index at which `value`
     * should be inserted into `array` in order to maintain its sort order.
     *
     * @private
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {boolean} [retHighest] Specify returning the highest qualified index.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     */
    function baseSortedIndex(array, value, retHighest) {
      var low = 0,
          high = array ? array.length : low;

      if (typeof value == 'number' && value === value && high <= HALF_MAX_ARRAY_LENGTH) {
        while (low < high) {
          var mid = (low + high) >>> 1,
              computed = array[mid];

          if ((retHighest ? (computed <= value) : (computed < value)) && computed !== null) {
            low = mid + 1;
          } else {
            high = mid;
          }
        }
        return high;
      }
      return baseSortedIndexBy(array, value, identity, retHighest);
    }

    /**
     * The base implementation of `_.sortedIndexBy` and `_.sortedLastIndexBy`
     * which invokes `iteratee` for `value` and each element of `array` to compute
     * their sort ranking. The iteratee is invoked with one argument; (value).
     *
     * @private
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function} iteratee The iteratee invoked per element.
     * @param {boolean} [retHighest] Specify returning the highest qualified index.
     * @returns {number} Returns the index at which `value` should be inserted into `array`.
     */
    function baseSortedIndexBy(array, value, iteratee, retHighest) {
      value = iteratee(value);

      var low = 0,
          high = array ? array.length : 0,
          valIsNaN = value !== value,
          valIsNull = value === null,
          valIsUndef = value === undefined;

      while (low < high) {
        var mid = nativeFloor((low + high) / 2),
            computed = iteratee(array[mid]),
            isDef = computed !== undefined,
            isReflexive = computed === computed;

        if (valIsNaN) {
          var setLow = isReflexive || retHighest;
        } else if (valIsNull) {
          setLow = isReflexive && isDef && (retHighest || computed != null);
        } else if (valIsUndef) {
          setLow = isReflexive && (retHighest || isDef);
        } else if (computed == null) {
          setLow = false;
        } else {
          setLow = retHighest ? (computed <= value) : (computed < value);
        }
        if (setLow) {
          low = mid + 1;
        } else {
          high = mid;
        }
      }
      return nativeMin(high, MAX_ARRAY_INDEX);
    }

    /**
     * The base implementation of `_.sortedUniq`.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @returns {Array} Returns the new duplicate free array.
     */
    function baseSortedUniq(array) {
      return baseSortedUniqBy(array);
    }

    /**
     * The base implementation of `_.sortedUniqBy` without support for iteratee
     * shorthands.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @returns {Array} Returns the new duplicate free array.
     */
    function baseSortedUniqBy(array, iteratee) {
      var index = 0,
          length = array.length,
          value = array[0],
          computed = iteratee ? iteratee(value) : value,
          seen = computed,
          resIndex = 1,
          result = [value];

      while (++index < length) {
        value = array[index],
        computed = iteratee ? iteratee(value) : value;

        if (!eq(computed, seen)) {
          seen = computed;
          result[resIndex++] = value;
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.uniqBy` without support for iteratee shorthands.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new duplicate free array.
     */
    function baseUniq(array, iteratee, comparator) {
      var index = -1,
          includes = arrayIncludes,
          length = array.length,
          isCommon = true,
          result = [],
          seen = result;

      if (comparator) {
        isCommon = false;
        includes = arrayIncludesWith;
      }
      else if (length >= LARGE_ARRAY_SIZE) {
        var set = iteratee ? null : createSet(array);
        if (set) {
          return setToArray(set);
        }
        isCommon = false;
        includes = cacheHas;
        seen = new SetCache;
      }
      else {
        seen = iteratee ? [] : result;
      }
      outer:
      while (++index < length) {
        var value = array[index],
            computed = iteratee ? iteratee(value) : value;

        if (isCommon && computed === computed) {
          var seenIndex = seen.length;
          while (seenIndex--) {
            if (seen[seenIndex] === computed) {
              continue outer;
            }
          }
          if (iteratee) {
            seen.push(computed);
          }
          result.push(value);
        }
        else if (!includes(seen, computed, comparator)) {
          if (seen !== result) {
            seen.push(computed);
          }
          result.push(value);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.unset`.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to unset.
     * @returns {boolean} Returns `true` if the property is deleted, else `false`.
     */
    function baseUnset(object, path) {
      path = isKey(path, object) ? [path + ''] : baseCastPath(path);
      object = parent(object, path);
      var key = last(path);
      return (object != null && has(object, key)) ? delete object[key] : true;
    }

    /**
     * The base implementation of `_.update`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to update.
     * @param {Function} updater The function to produce the updated value.
     * @param {Function} [customizer] The function to customize path creation.
     * @returns {Object} Returns `object`.
     */
    function baseUpdate(object, path, updater, customizer) {
      return baseSet(object, path, updater(baseGet(object, path)), customizer);
    }

    /**
     * The base implementation of methods like `_.dropWhile` and `_.takeWhile`
     * without support for iteratee shorthands.
     *
     * @private
     * @param {Array} array The array to query.
     * @param {Function} predicate The function invoked per iteration.
     * @param {boolean} [isDrop] Specify dropping elements instead of taking them.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Array} Returns the slice of `array`.
     */
    function baseWhile(array, predicate, isDrop, fromRight) {
      var length = array.length,
          index = fromRight ? length : -1;

      while ((fromRight ? index-- : ++index < length) &&
        predicate(array[index], index, array)) {}

      return isDrop
        ? baseSlice(array, (fromRight ? 0 : index), (fromRight ? index + 1 : length))
        : baseSlice(array, (fromRight ? index + 1 : 0), (fromRight ? length : index));
    }

    /**
     * The base implementation of `wrapperValue` which returns the result of
     * performing a sequence of actions on the unwrapped `value`, where each
     * successive action is supplied the return value of the previous.
     *
     * @private
     * @param {*} value The unwrapped value.
     * @param {Array} actions Actions to perform to resolve the unwrapped value.
     * @returns {*} Returns the resolved value.
     */
    function baseWrapperValue(value, actions) {
      var result = value;
      if (result instanceof LazyWrapper) {
        result = result.value();
      }
      return arrayReduce(actions, function(result, action) {
        return action.func.apply(action.thisArg, arrayPush([result], action.args));
      }, result);
    }

    /**
     * The base implementation of methods like `_.xor`, without support for
     * iteratee shorthands, that accepts an array of arrays to inspect.
     *
     * @private
     * @param {Array} arrays The arrays to inspect.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of values.
     */
    function baseXor(arrays, iteratee, comparator) {
      var index = -1,
          length = arrays.length;

      while (++index < length) {
        var result = result
          ? arrayPush(
              baseDifference(result, arrays[index], iteratee, comparator),
              baseDifference(arrays[index], result, iteratee, comparator)
            )
          : arrays[index];
      }
      return (result && result.length) ? baseUniq(result, iteratee, comparator) : [];
    }

    /**
     * This base implementation of `_.zipObject` which assigns values using `assignFunc`.
     *
     * @private
     * @param {Array} props The property names.
     * @param {Array} values The property values.
     * @param {Function} assignFunc The function to assign values.
     * @returns {Object} Returns the new object.
     */
    function baseZipObject(props, values, assignFunc) {
      var index = -1,
          length = props.length,
          valsLength = values.length,
          result = {};

      while (++index < length) {
        assignFunc(result, props[index], index < valsLength ? values[index] : undefined);
      }
      return result;
    }

    /**
     * Creates a clone of  `buffer`.
     *
     * @private
     * @param {Buffer} buffer The buffer to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Buffer} Returns the cloned buffer.
     */
    function cloneBuffer(buffer, isDeep) {
      if (isDeep) {
        return buffer.slice();
      }
      var result = new buffer.constructor(buffer.length);
      buffer.copy(result);
      return result;
    }

    /**
     * Creates a clone of `arrayBuffer`.
     *
     * @private
     * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
     * @returns {ArrayBuffer} Returns the cloned array buffer.
     */
    function cloneArrayBuffer(arrayBuffer) {
      var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
      new Uint8Array(result).set(new Uint8Array(arrayBuffer));
      return result;
    }

    /**
     * Creates a clone of `map`.
     *
     * @private
     * @param {Object} map The map to clone.
     * @returns {Object} Returns the cloned map.
     */
    function cloneMap(map) {
      return arrayReduce(mapToArray(map), addMapEntry, new map.constructor);
    }

    /**
     * Creates a clone of `regexp`.
     *
     * @private
     * @param {Object} regexp The regexp to clone.
     * @returns {Object} Returns the cloned regexp.
     */
    function cloneRegExp(regexp) {
      var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
      result.lastIndex = regexp.lastIndex;
      return result;
    }

    /**
     * Creates a clone of `set`.
     *
     * @private
     * @param {Object} set The set to clone.
     * @returns {Object} Returns the cloned set.
     */
    function cloneSet(set) {
      return arrayReduce(setToArray(set), addSetEntry, new set.constructor);
    }

    /**
     * Creates a clone of the `symbol` object.
     *
     * @private
     * @param {Object} symbol The symbol object to clone.
     * @returns {Object} Returns the cloned symbol object.
     */
    function cloneSymbol(symbol) {
      return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
    }

    /**
     * Creates a clone of `typedArray`.
     *
     * @private
     * @param {Object} typedArray The typed array to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the cloned typed array.
     */
    function cloneTypedArray(typedArray, isDeep) {
      var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
      return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
    }

    /**
     * Creates an array that is the composition of partially applied arguments,
     * placeholders, and provided arguments into a single array of arguments.
     *
     * @private
     * @param {Array|Object} args The provided arguments.
     * @param {Array} partials The arguments to prepend to those provided.
     * @param {Array} holders The `partials` placeholder indexes.
     * @params {boolean} [isCurried] Specify composing for a curried function.
     * @returns {Array} Returns the new array of composed arguments.
     */
    function composeArgs(args, partials, holders, isCurried) {
      var argsIndex = -1,
          argsLength = args.length,
          holdersLength = holders.length,
          leftIndex = -1,
          leftLength = partials.length,
          rangeLength = nativeMax(argsLength - holdersLength, 0),
          result = Array(leftLength + rangeLength),
          isUncurried = !isCurried;

      while (++leftIndex < leftLength) {
        result[leftIndex] = partials[leftIndex];
      }
      while (++argsIndex < holdersLength) {
        if (isUncurried || argsIndex < argsLength) {
          result[holders[argsIndex]] = args[argsIndex];
        }
      }
      while (rangeLength--) {
        result[leftIndex++] = args[argsIndex++];
      }
      return result;
    }

    /**
     * This function is like `composeArgs` except that the arguments composition
     * is tailored for `_.partialRight`.
     *
     * @private
     * @param {Array|Object} args The provided arguments.
     * @param {Array} partials The arguments to append to those provided.
     * @param {Array} holders The `partials` placeholder indexes.
     * @params {boolean} [isCurried] Specify composing for a curried function.
     * @returns {Array} Returns the new array of composed arguments.
     */
    function composeArgsRight(args, partials, holders, isCurried) {
      var argsIndex = -1,
          argsLength = args.length,
          holdersIndex = -1,
          holdersLength = holders.length,
          rightIndex = -1,
          rightLength = partials.length,
          rangeLength = nativeMax(argsLength - holdersLength, 0),
          result = Array(rangeLength + rightLength),
          isUncurried = !isCurried;

      while (++argsIndex < rangeLength) {
        result[argsIndex] = args[argsIndex];
      }
      var offset = argsIndex;
      while (++rightIndex < rightLength) {
        result[offset + rightIndex] = partials[rightIndex];
      }
      while (++holdersIndex < holdersLength) {
        if (isUncurried || argsIndex < argsLength) {
          result[offset + holders[holdersIndex]] = args[argsIndex++];
        }
      }
      return result;
    }

    /**
     * Copies the values of `source` to `array`.
     *
     * @private
     * @param {Array} source The array to copy values from.
     * @param {Array} [array=[]] The array to copy values to.
     * @returns {Array} Returns `array`.
     */
    function copyArray(source, array) {
      var index = -1,
          length = source.length;

      array || (array = Array(length));
      while (++index < length) {
        array[index] = source[index];
      }
      return array;
    }

    /**
     * Copies properties of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy properties from.
     * @param {Array} props The property names to copy.
     * @param {Object} [object={}] The object to copy properties to.
     * @returns {Object} Returns `object`.
     */
    function copyObject(source, props, object) {
      return copyObjectWith(source, props, object);
    }

    /**
     * This function is like `copyObject` except that it accepts a function to
     * customize copied values.
     *
     * @private
     * @param {Object} source The object to copy properties from.
     * @param {Array} props The property names to copy.
     * @param {Object} [object={}] The object to copy properties to.
     * @param {Function} [customizer] The function to customize copied values.
     * @returns {Object} Returns `object`.
     */
    function copyObjectWith(source, props, object, customizer) {
      object || (object = {});

      var index = -1,
          length = props.length;

      while (++index < length) {
        var key = props[index];

        var newValue = customizer
          ? customizer(object[key], source[key], key, object, source)
          : source[key];

        assignValue(object, key, newValue);
      }
      return object;
    }

    /**
     * Copies own symbol properties of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy symbols from.
     * @param {Object} [object={}] The object to copy symbols to.
     * @returns {Object} Returns `object`.
     */
    function copySymbols(source, object) {
      return copyObject(source, getSymbols(source), object);
    }

    /**
     * Creates a function like `_.groupBy`.
     *
     * @private
     * @param {Function} setter The function to set accumulator values.
     * @param {Function} [initializer] The accumulator object initializer.
     * @returns {Function} Returns the new aggregator function.
     */
    function createAggregator(setter, initializer) {
      return function(collection, iteratee) {
        var func = isArray(collection) ? arrayAggregator : baseAggregator,
            accumulator = initializer ? initializer() : {};

        return func(collection, setter, getIteratee(iteratee), accumulator);
      };
    }

    /**
     * Creates a function like `_.assign`.
     *
     * @private
     * @param {Function} assigner The function to assign values.
     * @returns {Function} Returns the new assigner function.
     */
    function createAssigner(assigner) {
      return rest(function(object, sources) {
        var index = -1,
            length = sources.length,
            customizer = length > 1 ? sources[length - 1] : undefined,
            guard = length > 2 ? sources[2] : undefined;

        customizer = typeof customizer == 'function'
          ? (length--, customizer)
          : undefined;

        if (guard && isIterateeCall(sources[0], sources[1], guard)) {
          customizer = length < 3 ? undefined : customizer;
          length = 1;
        }
        object = Object(object);
        while (++index < length) {
          var source = sources[index];
          if (source) {
            assigner(object, source, index, customizer);
          }
        }
        return object;
      });
    }

    /**
     * Creates a `baseEach` or `baseEachRight` function.
     *
     * @private
     * @param {Function} eachFunc The function to iterate over a collection.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new base function.
     */
    function createBaseEach(eachFunc, fromRight) {
      return function(collection, iteratee) {
        if (collection == null) {
          return collection;
        }
        if (!isArrayLike(collection)) {
          return eachFunc(collection, iteratee);
        }
        var length = collection.length,
            index = fromRight ? length : -1,
            iterable = Object(collection);

        while ((fromRight ? index-- : ++index < length)) {
          if (iteratee(iterable[index], index, iterable) === false) {
            break;
          }
        }
        return collection;
      };
    }

    /**
     * Creates a base function for methods like `_.forIn`.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new base function.
     */
    function createBaseFor(fromRight) {
      return function(object, iteratee, keysFunc) {
        var index = -1,
            iterable = Object(object),
            props = keysFunc(object),
            length = props.length;

        while (length--) {
          var key = props[fromRight ? length : ++index];
          if (iteratee(iterable[key], key, iterable) === false) {
            break;
          }
        }
        return object;
      };
    }

    /**
     * Creates a function that wraps `func` to invoke it with the optional `this`
     * binding of `thisArg`.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {number} bitmask The bitmask of wrapper flags. See `createWrapper` for more details.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createBaseWrapper(func, bitmask, thisArg) {
      var isBind = bitmask & BIND_FLAG,
          Ctor = createCtorWrapper(func);

      function wrapper() {
        var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
        return fn.apply(isBind ? thisArg : this, arguments);
      }
      return wrapper;
    }

    /**
     * Creates a function like `_.lowerFirst`.
     *
     * @private
     * @param {string} methodName The name of the `String` case method to use.
     * @returns {Function} Returns the new function.
     */
    function createCaseFirst(methodName) {
      return function(string) {
        string = toString(string);

        var strSymbols = reHasComplexSymbol.test(string)
          ? stringToArray(string)
          : undefined;

        var chr = strSymbols ? strSymbols[0] : string.charAt(0),
            trailing = strSymbols ? strSymbols.slice(1).join('') : string.slice(1);

        return chr[methodName]() + trailing;
      };
    }

    /**
     * Creates a function like `_.camelCase`.
     *
     * @private
     * @param {Function} callback The function to combine each word.
     * @returns {Function} Returns the new compounder function.
     */
    function createCompounder(callback) {
      return function(string) {
        return arrayReduce(words(deburr(string)), callback, '');
      };
    }

    /**
     * Creates a function that produces an instance of `Ctor` regardless of
     * whether it was invoked as part of a `new` expression or by `call` or `apply`.
     *
     * @private
     * @param {Function} Ctor The constructor to wrap.
     * @returns {Function} Returns the new wrapped function.
     */
    function createCtorWrapper(Ctor) {
      return function() {
        // Use a `switch` statement to work with class constructors.
        // See http://ecma-international.org/ecma-262/6.0/#sec-ecmascript-function-objects-call-thisargument-argumentslist
        // for more details.
        var args = arguments;
        switch (args.length) {
          case 0: return new Ctor;
          case 1: return new Ctor(args[0]);
          case 2: return new Ctor(args[0], args[1]);
          case 3: return new Ctor(args[0], args[1], args[2]);
          case 4: return new Ctor(args[0], args[1], args[2], args[3]);
          case 5: return new Ctor(args[0], args[1], args[2], args[3], args[4]);
          case 6: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
          case 7: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
        }
        var thisBinding = baseCreate(Ctor.prototype),
            result = Ctor.apply(thisBinding, args);

        // Mimic the constructor's `return` behavior.
        // See https://es5.github.io/#x13.2.2 for more details.
        return isObject(result) ? result : thisBinding;
      };
    }

    /**
     * Creates a function that wraps `func` to enable currying.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {number} bitmask The bitmask of wrapper flags. See `createWrapper` for more details.
     * @param {number} arity The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createCurryWrapper(func, bitmask, arity) {
      var Ctor = createCtorWrapper(func);

      function wrapper() {
        var length = arguments.length,
            args = Array(length),
            index = length,
            placeholder = getPlaceholder(wrapper);

        while (index--) {
          args[index] = arguments[index];
        }
        var holders = (length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder)
          ? []
          : replaceHolders(args, placeholder);

        length -= holders.length;
        if (length < arity) {
          return createRecurryWrapper(
            func, bitmask, createHybridWrapper, wrapper.placeholder, undefined,
            args, holders, undefined, undefined, arity - length);
        }
        var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
        return apply(fn, this, args);
      }
      return wrapper;
    }

    /**
     * Creates a `_.flow` or `_.flowRight` function.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new flow function.
     */
    function createFlow(fromRight) {
      return rest(function(funcs) {
        funcs = baseFlatten(funcs, 1);

        var length = funcs.length,
            index = length,
            prereq = LodashWrapper.prototype.thru;

        if (fromRight) {
          funcs.reverse();
        }
        while (index--) {
          var func = funcs[index];
          if (typeof func != 'function') {
            throw new TypeError(FUNC_ERROR_TEXT);
          }
          if (prereq && !wrapper && getFuncName(func) == 'wrapper') {
            var wrapper = new LodashWrapper([], true);
          }
        }
        index = wrapper ? index : length;
        while (++index < length) {
          func = funcs[index];

          var funcName = getFuncName(func),
              data = funcName == 'wrapper' ? getData(func) : undefined;

          if (data && isLaziable(data[0]) &&
                data[1] == (ARY_FLAG | CURRY_FLAG | PARTIAL_FLAG | REARG_FLAG) &&
                !data[4].length && data[9] == 1
              ) {
            wrapper = wrapper[getFuncName(data[0])].apply(wrapper, data[3]);
          } else {
            wrapper = (func.length == 1 && isLaziable(func)) ? wrapper[funcName]() : wrapper.thru(func);
          }
        }
        return function() {
          var args = arguments,
              value = args[0];

          if (wrapper && args.length == 1 &&
              isArray(value) && value.length >= LARGE_ARRAY_SIZE) {
            return wrapper.plant(value).value();
          }
          var index = 0,
              result = length ? funcs[index].apply(this, args) : value;

          while (++index < length) {
            result = funcs[index].call(this, result);
          }
          return result;
        };
      });
    }

    /**
     * Creates a function that wraps `func` to invoke it with optional `this`
     * binding of `thisArg`, partial application, and currying.
     *
     * @private
     * @param {Function|string} func The function or method name to wrap.
     * @param {number} bitmask The bitmask of wrapper flags. See `createWrapper` for more details.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {Array} [partials] The arguments to prepend to those provided to the new function.
     * @param {Array} [holders] The `partials` placeholder indexes.
     * @param {Array} [partialsRight] The arguments to append to those provided to the new function.
     * @param {Array} [holdersRight] The `partialsRight` placeholder indexes.
     * @param {Array} [argPos] The argument positions of the new function.
     * @param {number} [ary] The arity cap of `func`.
     * @param {number} [arity] The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createHybridWrapper(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
      var isAry = bitmask & ARY_FLAG,
          isBind = bitmask & BIND_FLAG,
          isBindKey = bitmask & BIND_KEY_FLAG,
          isCurried = bitmask & (CURRY_FLAG | CURRY_RIGHT_FLAG),
          isFlip = bitmask & FLIP_FLAG,
          Ctor = isBindKey ? undefined : createCtorWrapper(func);

      function wrapper() {
        var length = arguments.length,
            index = length,
            args = Array(length);

        while (index--) {
          args[index] = arguments[index];
        }
        if (isCurried) {
          var placeholder = getPlaceholder(wrapper),
              holdersCount = countHolders(args, placeholder);
        }
        if (partials) {
          args = composeArgs(args, partials, holders, isCurried);
        }
        if (partialsRight) {
          args = composeArgsRight(args, partialsRight, holdersRight, isCurried);
        }
        length -= holdersCount;
        if (isCurried && length < arity) {
          var newHolders = replaceHolders(args, placeholder);
          return createRecurryWrapper(
            func, bitmask, createHybridWrapper, wrapper.placeholder, thisArg,
            args, newHolders, argPos, ary, arity - length
          );
        }
        var thisBinding = isBind ? thisArg : this,
            fn = isBindKey ? thisBinding[func] : func;

        length = args.length;
        if (argPos) {
          args = reorder(args, argPos);
        } else if (isFlip && length > 1) {
          args.reverse();
        }
        if (isAry && ary < length) {
          args.length = ary;
        }
        if (this && this !== root && this instanceof wrapper) {
          fn = Ctor || createCtorWrapper(fn);
        }
        return fn.apply(thisBinding, args);
      }
      return wrapper;
    }

    /**
     * Creates a function like `_.invertBy`.
     *
     * @private
     * @param {Function} setter The function to set accumulator values.
     * @param {Function} toIteratee The function to resolve iteratees.
     * @returns {Function} Returns the new inverter function.
     */
    function createInverter(setter, toIteratee) {
      return function(object, iteratee) {
        return baseInverter(object, setter, toIteratee(iteratee), {});
      };
    }

    /**
     * Creates a function like `_.over`.
     *
     * @private
     * @param {Function} arrayFunc The function to iterate over iteratees.
     * @returns {Function} Returns the new invoker function.
     */
    function createOver(arrayFunc) {
      return rest(function(iteratees) {
        iteratees = arrayMap(baseFlatten(iteratees, 1), getIteratee());
        return rest(function(args) {
          var thisArg = this;
          return arrayFunc(iteratees, function(iteratee) {
            return apply(iteratee, thisArg, args);
          });
        });
      });
    }

    /**
     * Creates the padding for `string` based on `length`. The `chars` string
     * is truncated if the number of characters exceeds `length`.
     *
     * @private
     * @param {string} string The string to create padding for.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padding for `string`.
     */
    function createPadding(string, length, chars) {
      length = toInteger(length);

      var strLength = stringSize(string);
      if (!length || strLength >= length) {
        return '';
      }
      var padLength = length - strLength;
      chars = chars === undefined ? ' ' : (chars + '');

      var result = repeat(chars, nativeCeil(padLength / stringSize(chars)));
      return reHasComplexSymbol.test(chars)
        ? stringToArray(result).slice(0, padLength).join('')
        : result.slice(0, padLength);
    }

    /**
     * Creates a function that wraps `func` to invoke it with the optional `this`
     * binding of `thisArg` and the `partials` prepended to those provided to
     * the wrapper.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {number} bitmask The bitmask of wrapper flags. See `createWrapper` for more details.
     * @param {*} thisArg The `this` binding of `func`.
     * @param {Array} partials The arguments to prepend to those provided to the new function.
     * @returns {Function} Returns the new wrapped function.
     */
    function createPartialWrapper(func, bitmask, thisArg, partials) {
      var isBind = bitmask & BIND_FLAG,
          Ctor = createCtorWrapper(func);

      function wrapper() {
        var argsIndex = -1,
            argsLength = arguments.length,
            leftIndex = -1,
            leftLength = partials.length,
            args = Array(leftLength + argsLength),
            fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;

        while (++leftIndex < leftLength) {
          args[leftIndex] = partials[leftIndex];
        }
        while (argsLength--) {
          args[leftIndex++] = arguments[++argsIndex];
        }
        return apply(fn, isBind ? thisArg : this, args);
      }
      return wrapper;
    }

    /**
     * Creates a `_.range` or `_.rangeRight` function.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new range function.
     */
    function createRange(fromRight) {
      return function(start, end, step) {
        if (step && typeof step != 'number' && isIterateeCall(start, end, step)) {
          end = step = undefined;
        }
        // Ensure the sign of `-0` is preserved.
        start = toNumber(start);
        start = start === start ? start : 0;
        if (end === undefined) {
          end = start;
          start = 0;
        } else {
          end = toNumber(end) || 0;
        }
        step = step === undefined ? (start < end ? 1 : -1) : (toNumber(step) || 0);
        return baseRange(start, end, step, fromRight);
      };
    }

    /**
     * Creates a function that wraps `func` to continue currying.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {number} bitmask The bitmask of wrapper flags. See `createWrapper` for more details.
     * @param {Function} wrapFunc The function to create the `func` wrapper.
     * @param {*} placeholder The placeholder value.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {Array} [partials] The arguments to prepend to those provided to the new function.
     * @param {Array} [holders] The `partials` placeholder indexes.
     * @param {Array} [argPos] The argument positions of the new function.
     * @param {number} [ary] The arity cap of `func`.
     * @param {number} [arity] The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createRecurryWrapper(func, bitmask, wrapFunc, placeholder, thisArg, partials, holders, argPos, ary, arity) {
      var isCurry = bitmask & CURRY_FLAG,
          newArgPos = argPos ? copyArray(argPos) : undefined,
          newHolders = isCurry ? holders : undefined,
          newHoldersRight = isCurry ? undefined : holders,
          newPartials = isCurry ? partials : undefined,
          newPartialsRight = isCurry ? undefined : partials;

      bitmask |= (isCurry ? PARTIAL_FLAG : PARTIAL_RIGHT_FLAG);
      bitmask &= ~(isCurry ? PARTIAL_RIGHT_FLAG : PARTIAL_FLAG);

      if (!(bitmask & CURRY_BOUND_FLAG)) {
        bitmask &= ~(BIND_FLAG | BIND_KEY_FLAG);
      }
      var newData = [
        func, bitmask, thisArg, newPartials, newHolders, newPartialsRight,
        newHoldersRight, newArgPos, ary, arity
      ];

      var result = wrapFunc.apply(undefined, newData);
      if (isLaziable(func)) {
        setData(result, newData);
      }
      result.placeholder = placeholder;
      return result;
    }

    /**
     * Creates a function like `_.round`.
     *
     * @private
     * @param {string} methodName The name of the `Math` method to use when rounding.
     * @returns {Function} Returns the new round function.
     */
    function createRound(methodName) {
      var func = Math[methodName];
      return function(number, precision) {
        number = toNumber(number);
        precision = toInteger(precision);
        if (precision) {
          // Shift with exponential notation to avoid floating-point issues.
          // See [MDN](https://mdn.io/round#Examples) for more details.
          var pair = (toString(number) + 'e').split('e'),
              value = func(pair[0] + 'e' + (+pair[1] + precision));

          pair = (toString(value) + 'e').split('e');
          return +(pair[0] + 'e' + (+pair[1] - precision));
        }
        return func(number);
      };
    }

    /**
     * Creates a set of `values`.
     *
     * @private
     * @param {Array} values The values to add to the set.
     * @returns {Object} Returns the new set.
     */
    var createSet = !(Set && new Set([1, 2]).size === 2) ? noop : function(values) {
      return new Set(values);
    };

    /**
     * Creates a function that either curries or invokes `func` with optional
     * `this` binding and partially applied arguments.
     *
     * @private
     * @param {Function|string} func The function or method name to wrap.
     * @param {number} bitmask The bitmask of wrapper flags.
     *  The bitmask may be composed of the following flags:
     *     1 - `_.bind`
     *     2 - `_.bindKey`
     *     4 - `_.curry` or `_.curryRight` of a bound function
     *     8 - `_.curry`
     *    16 - `_.curryRight`
     *    32 - `_.partial`
     *    64 - `_.partialRight`
     *   128 - `_.rearg`
     *   256 - `_.ary`
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {Array} [partials] The arguments to be partially applied.
     * @param {Array} [holders] The `partials` placeholder indexes.
     * @param {Array} [argPos] The argument positions of the new function.
     * @param {number} [ary] The arity cap of `func`.
     * @param {number} [arity] The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createWrapper(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
      var isBindKey = bitmask & BIND_KEY_FLAG;
      if (!isBindKey && typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      var length = partials ? partials.length : 0;
      if (!length) {
        bitmask &= ~(PARTIAL_FLAG | PARTIAL_RIGHT_FLAG);
        partials = holders = undefined;
      }
      ary = ary === undefined ? ary : nativeMax(toInteger(ary), 0);
      arity = arity === undefined ? arity : toInteger(arity);
      length -= holders ? holders.length : 0;

      if (bitmask & PARTIAL_RIGHT_FLAG) {
        var partialsRight = partials,
            holdersRight = holders;

        partials = holders = undefined;
      }
      var data = isBindKey ? undefined : getData(func);

      var newData = [
        func, bitmask, thisArg, partials, holders, partialsRight, holdersRight,
        argPos, ary, arity
      ];

      if (data) {
        mergeData(newData, data);
      }
      func = newData[0];
      bitmask = newData[1];
      thisArg = newData[2];
      partials = newData[3];
      holders = newData[4];
      arity = newData[9] = newData[9] == null
        ? (isBindKey ? 0 : func.length)
        : nativeMax(newData[9] - length, 0);

      if (!arity && bitmask & (CURRY_FLAG | CURRY_RIGHT_FLAG)) {
        bitmask &= ~(CURRY_FLAG | CURRY_RIGHT_FLAG);
      }
      if (!bitmask || bitmask == BIND_FLAG) {
        var result = createBaseWrapper(func, bitmask, thisArg);
      } else if (bitmask == CURRY_FLAG || bitmask == CURRY_RIGHT_FLAG) {
        result = createCurryWrapper(func, bitmask, arity);
      } else if ((bitmask == PARTIAL_FLAG || bitmask == (BIND_FLAG | PARTIAL_FLAG)) && !holders.length) {
        result = createPartialWrapper(func, bitmask, thisArg, partials);
      } else {
        result = createHybridWrapper.apply(undefined, newData);
      }
      var setter = data ? baseSetData : setData;
      return setter(result, newData);
    }

    /**
     * A specialized version of `baseIsEqualDeep` for arrays with support for
     * partial deep comparisons.
     *
     * @private
     * @param {Array} array The array to compare.
     * @param {Array} other The other array to compare.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Function} customizer The function to customize comparisons.
     * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual` for more details.
     * @param {Object} stack Tracks traversed `array` and `other` objects.
     * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
     */
    function equalArrays(array, other, equalFunc, customizer, bitmask, stack) {
      var index = -1,
          isPartial = bitmask & PARTIAL_COMPARE_FLAG,
          isUnordered = bitmask & UNORDERED_COMPARE_FLAG,
          arrLength = array.length,
          othLength = other.length;

      if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(array);
      if (stacked) {
        return stacked == other;
      }
      var result = true;
      stack.set(array, other);

      // Ignore non-index properties.
      while (++index < arrLength) {
        var arrValue = array[index],
            othValue = other[index];

        if (customizer) {
          var compared = isPartial
            ? customizer(othValue, arrValue, index, other, array, stack)
            : customizer(arrValue, othValue, index, array, other, stack);
        }
        if (compared !== undefined) {
          if (compared) {
            continue;
          }
          result = false;
          break;
        }
        // Recursively compare arrays (susceptible to call stack limits).
        if (isUnordered) {
          if (!arraySome(other, function(othValue) {
                return arrValue === othValue || equalFunc(arrValue, othValue, customizer, bitmask, stack);
              })) {
            result = false;
            break;
          }
        } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, customizer, bitmask, stack))) {
          result = false;
          break;
        }
      }
      stack['delete'](array);
      return result;
    }

    /**
     * A specialized version of `baseIsEqualDeep` for comparing objects of
     * the same `toStringTag`.
     *
     * **Note:** This function only supports comparing values with tags of
     * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {string} tag The `toStringTag` of the objects to compare.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Function} customizer The function to customize comparisons.
     * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual` for more details.
     * @param {Object} stack Tracks traversed `object` and `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function equalByTag(object, other, tag, equalFunc, customizer, bitmask, stack) {
      switch (tag) {
        case arrayBufferTag:
          if ((object.byteLength != other.byteLength) ||
              !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
            return false;
          }
          return true;

        case boolTag:
        case dateTag:
          // Coerce dates and booleans to numbers, dates to milliseconds and booleans
          // to `1` or `0` treating invalid dates coerced to `NaN` as not equal.
          return +object == +other;

        case errorTag:
          return object.name == other.name && object.message == other.message;

        case numberTag:
          // Treat `NaN` vs. `NaN` as equal.
          return (object != +object) ? other != +other : object == +other;

        case regexpTag:
        case stringTag:
          // Coerce regexes to strings and treat strings primitives and string
          // objects as equal. See https://es5.github.io/#x15.10.6.4 for more details.
          return object == (other + '');

        case mapTag:
          var convert = mapToArray;

        case setTag:
          var isPartial = bitmask & PARTIAL_COMPARE_FLAG;
          convert || (convert = setToArray);

          if (object.size != other.size && !isPartial) {
            return false;
          }
          // Assume cyclic values are equal.
          var stacked = stack.get(object);
          if (stacked) {
            return stacked == other;
          }
          // Recursively compare objects (susceptible to call stack limits).
          return equalArrays(convert(object), convert(other), equalFunc, customizer, bitmask | UNORDERED_COMPARE_FLAG, stack.set(object, other));

        case symbolTag:
          if (symbolValueOf) {
            return symbolValueOf.call(object) == symbolValueOf.call(other);
          }
      }
      return false;
    }

    /**
     * A specialized version of `baseIsEqualDeep` for objects with support for
     * partial deep comparisons.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Function} customizer The function to customize comparisons.
     * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual` for more details.
     * @param {Object} stack Tracks traversed `object` and `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function equalObjects(object, other, equalFunc, customizer, bitmask, stack) {
      var isPartial = bitmask & PARTIAL_COMPARE_FLAG,
          objProps = keys(object),
          objLength = objProps.length,
          othProps = keys(other),
          othLength = othProps.length;

      if (objLength != othLength && !isPartial) {
        return false;
      }
      var index = objLength;
      while (index--) {
        var key = objProps[index];
        if (!(isPartial ? key in other : baseHas(other, key))) {
          return false;
        }
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      var result = true;
      stack.set(object, other);

      var skipCtor = isPartial;
      while (++index < objLength) {
        key = objProps[index];
        var objValue = object[key],
            othValue = other[key];

        if (customizer) {
          var compared = isPartial
            ? customizer(othValue, objValue, key, other, object, stack)
            : customizer(objValue, othValue, key, object, other, stack);
        }
        // Recursively compare objects (susceptible to call stack limits).
        if (!(compared === undefined
              ? (objValue === othValue || equalFunc(objValue, othValue, customizer, bitmask, stack))
              : compared
            )) {
          result = false;
          break;
        }
        skipCtor || (skipCtor = key == 'constructor');
      }
      if (result && !skipCtor) {
        var objCtor = object.constructor,
            othCtor = other.constructor;

        // Non `Object` object instances with different constructors are not equal.
        if (objCtor != othCtor &&
            ('constructor' in object && 'constructor' in other) &&
            !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
              typeof othCtor == 'function' && othCtor instanceof othCtor)) {
          result = false;
        }
      }
      stack['delete'](object);
      return result;
    }

    /**
     * Gets metadata for `func`.
     *
     * @private
     * @param {Function} func The function to query.
     * @returns {*} Returns the metadata for `func`.
     */
    var getData = !metaMap ? noop : function(func) {
      return metaMap.get(func);
    };

    /**
     * Gets the name of `func`.
     *
     * @private
     * @param {Function} func The function to query.
     * @returns {string} Returns the function name.
     */
    function getFuncName(func) {
      var result = (func.name + ''),
          array = realNames[result],
          length = hasOwnProperty.call(realNames, result) ? array.length : 0;

      while (length--) {
        var data = array[length],
            otherFunc = data.func;
        if (otherFunc == null || otherFunc == func) {
          return data.name;
        }
      }
      return result;
    }

    /**
     * Gets the appropriate "iteratee" function. If the `_.iteratee` method is
     * customized this function returns the custom method, otherwise it returns
     * `baseIteratee`. If arguments are provided the chosen function is invoked
     * with them and its result is returned.
     *
     * @private
     * @param {*} [value] The value to convert to an iteratee.
     * @param {number} [arity] The arity of the created iteratee.
     * @returns {Function} Returns the chosen function or its result.
     */
    function getIteratee() {
      var result = lodash.iteratee || iteratee;
      result = result === iteratee ? baseIteratee : result;
      return arguments.length ? result(arguments[0], arguments[1]) : result;
    }

    /**
     * Gets the "length" property value of `object`.
     *
     * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
     * that affects Safari on at least iOS 8.1-8.3 ARM64.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {*} Returns the "length" value.
     */
    var getLength = baseProperty('length');

    /**
     * Gets the property names, values, and compare flags of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the match data of `object`.
     */
    function getMatchData(object) {
      var result = toPairs(object),
          length = result.length;

      while (length--) {
        result[length][2] = isStrictComparable(result[length][1]);
      }
      return result;
    }

    /**
     * Gets the native function at `key` of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {string} key The key of the method to get.
     * @returns {*} Returns the function if it's native, else `undefined`.
     */
    function getNative(object, key) {
      var value = object[key];
      return isNative(value) ? value : undefined;
    }

    /**
     * Gets the argument placeholder value for `func`.
     *
     * @private
     * @param {Function} func The function to inspect.
     * @returns {*} Returns the placeholder value.
     */
    function getPlaceholder(func) {
      var object = hasOwnProperty.call(lodash, 'placeholder') ? lodash : func;
      return object.placeholder;
    }

    /**
     * Creates an array of the own symbol properties of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of symbols.
     */
    var getSymbols = getOwnPropertySymbols || function() {
      return [];
    };

    /**
     * Gets the `toStringTag` of `value`.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */
    function getTag(value) {
      return objectToString.call(value);
    }

    // Fallback for IE 11 providing `toStringTag` values for maps, sets, and weakmaps.
    if ((Map && getTag(new Map) != mapTag) ||
        (Set && getTag(new Set) != setTag) ||
        (WeakMap && getTag(new WeakMap) != weakMapTag)) {
      getTag = function(value) {
        var result = objectToString.call(value),
            Ctor = result == objectTag ? value.constructor : null,
            ctorString = typeof Ctor == 'function' ? funcToString.call(Ctor) : '';

        if (ctorString) {
          switch (ctorString) {
            case mapCtorString: return mapTag;
            case setCtorString: return setTag;
            case weakMapCtorString: return weakMapTag;
          }
        }
        return result;
      };
    }

    /**
     * Gets the view, applying any `transforms` to the `start` and `end` positions.
     *
     * @private
     * @param {number} start The start of the view.
     * @param {number} end The end of the view.
     * @param {Array} transforms The transformations to apply to the view.
     * @returns {Object} Returns an object containing the `start` and `end`
     *  positions of the view.
     */
    function getView(start, end, transforms) {
      var index = -1,
          length = transforms.length;

      while (++index < length) {
        var data = transforms[index],
            size = data.size;

        switch (data.type) {
          case 'drop':      start += size; break;
          case 'dropRight': end -= size; break;
          case 'take':      end = nativeMin(end, start + size); break;
          case 'takeRight': start = nativeMax(start, end - size); break;
        }
      }
      return { 'start': start, 'end': end };
    }

    /**
     * Checks if `path` exists on `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array|string} path The path to check.
     * @param {Function} hasFunc The function to check properties.
     * @returns {boolean} Returns `true` if `path` exists, else `false`.
     */
    function hasPath(object, path, hasFunc) {
      if (object == null) {
        return false;
      }
      var result = hasFunc(object, path);
      if (!result && !isKey(path)) {
        path = baseCastPath(path);

        var index = -1,
            length = path.length;

        while (object != null && ++index < length) {
          var key = path[index];
          if (!(result = hasFunc(object, key))) {
            break;
          }
          object = object[key];
        }
      }
      var length = object ? object.length : undefined;
      return result || (
        !!length && isLength(length) && isIndex(path, length) &&
        (isArray(object) || isString(object) || isArguments(object))
      );
    }

    /**
     * Initializes an array clone.
     *
     * @private
     * @param {Array} array The array to clone.
     * @returns {Array} Returns the initialized clone.
     */
    function initCloneArray(array) {
      var length = array.length,
          result = array.constructor(length);

      // Add properties assigned by `RegExp#exec`.
      if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
        result.index = array.index;
        result.input = array.input;
      }
      return result;
    }

    /**
     * Initializes an object clone.
     *
     * @private
     * @param {Object} object The object to clone.
     * @returns {Object} Returns the initialized clone.
     */
    function initCloneObject(object) {
      return (typeof object.constructor == 'function' && !isPrototype(object))
        ? baseCreate(getPrototypeOf(object))
        : {};
    }

    /**
     * Initializes an object clone based on its `toStringTag`.
     *
     * **Note:** This function only supports cloning values with tags of
     * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
     *
     * @private
     * @param {Object} object The object to clone.
     * @param {string} tag The `toStringTag` of the object to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the initialized clone.
     */
    function initCloneByTag(object, tag, isDeep) {
      var Ctor = object.constructor;
      switch (tag) {
        case arrayBufferTag:
          return cloneArrayBuffer(object);

        case boolTag:
        case dateTag:
          return new Ctor(+object);

        case float32Tag: case float64Tag:
        case int8Tag: case int16Tag: case int32Tag:
        case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
          return cloneTypedArray(object, isDeep);

        case mapTag:
          return cloneMap(object);

        case numberTag:
        case stringTag:
          return new Ctor(object);

        case regexpTag:
          return cloneRegExp(object);

        case setTag:
          return cloneSet(object);

        case symbolTag:
          return cloneSymbol(object);
      }
    }

    /**
     * Creates an array of index keys for `object` values of arrays,
     * `arguments` objects, and strings, otherwise `null` is returned.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array|null} Returns index keys, else `null`.
     */
    function indexKeys(object) {
      var length = object ? object.length : undefined;
      if (isLength(length) &&
          (isArray(object) || isString(object) || isArguments(object))) {
        return baseTimes(length, String);
      }
      return null;
    }

    /**
     * Checks if the given arguments are from an iteratee call.
     *
     * @private
     * @param {*} value The potential iteratee value argument.
     * @param {*} index The potential iteratee index or key argument.
     * @param {*} object The potential iteratee object argument.
     * @returns {boolean} Returns `true` if the arguments are from an iteratee call, else `false`.
     */
    function isIterateeCall(value, index, object) {
      if (!isObject(object)) {
        return false;
      }
      var type = typeof index;
      if (type == 'number'
          ? (isArrayLike(object) && isIndex(index, object.length))
          : (type == 'string' && index in object)) {
        return eq(object[index], value);
      }
      return false;
    }

    /**
     * Checks if `value` is a property name and not a property path.
     *
     * @private
     * @param {*} value The value to check.
     * @param {Object} [object] The object to query keys on.
     * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
     */
    function isKey(value, object) {
      if (typeof value == 'number') {
        return true;
      }
      return !isArray(value) &&
        (reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
          (object != null && value in Object(object)));
    }

    /**
     * Checks if `value` is suitable for use as unique object key.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
     */
    function isKeyable(value) {
      var type = typeof value;
      return type == 'number' || type == 'boolean' ||
        (type == 'string' && value != '__proto__') || value == null;
    }

    /**
     * Checks if `func` has a lazy counterpart.
     *
     * @private
     * @param {Function} func The function to check.
     * @returns {boolean} Returns `true` if `func` has a lazy counterpart, else `false`.
     */
    function isLaziable(func) {
      var funcName = getFuncName(func),
          other = lodash[funcName];

      if (typeof other != 'function' || !(funcName in LazyWrapper.prototype)) {
        return false;
      }
      if (func === other) {
        return true;
      }
      var data = getData(other);
      return !!data && func === data[0];
    }

    /**
     * Checks if `value` is likely a prototype object.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
     */
    function isPrototype(value) {
      var Ctor = value && value.constructor,
          proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

      return value === proto;
    }

    /**
     * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` if suitable for strict
     *  equality comparisons, else `false`.
     */
    function isStrictComparable(value) {
      return value === value && !isObject(value);
    }

    /**
     * Merges the function metadata of `source` into `data`.
     *
     * Merging metadata reduces the number of wrappers used to invoke a function.
     * This is possible because methods like `_.bind`, `_.curry`, and `_.partial`
     * may be applied regardless of execution order. Methods like `_.ary` and `_.rearg`
     * modify function arguments, making the order in which they are executed important,
     * preventing the merging of metadata. However, we make an exception for a safe
     * combined case where curried functions have `_.ary` and or `_.rearg` applied.
     *
     * @private
     * @param {Array} data The destination metadata.
     * @param {Array} source The source metadata.
     * @returns {Array} Returns `data`.
     */
    function mergeData(data, source) {
      var bitmask = data[1],
          srcBitmask = source[1],
          newBitmask = bitmask | srcBitmask,
          isCommon = newBitmask < (BIND_FLAG | BIND_KEY_FLAG | ARY_FLAG);

      var isCombo =
        ((srcBitmask == ARY_FLAG) && (bitmask == CURRY_FLAG)) ||
        ((srcBitmask == ARY_FLAG) && (bitmask == REARG_FLAG) && (data[7].length <= source[8])) ||
        ((srcBitmask == (ARY_FLAG | REARG_FLAG)) && (source[7].length <= source[8]) && (bitmask == CURRY_FLAG));

      // Exit early if metadata can't be merged.
      if (!(isCommon || isCombo)) {
        return data;
      }
      // Use source `thisArg` if available.
      if (srcBitmask & BIND_FLAG) {
        data[2] = source[2];
        // Set when currying a bound function.
        newBitmask |= bitmask & BIND_FLAG ? 0 : CURRY_BOUND_FLAG;
      }
      // Compose partial arguments.
      var value = source[3];
      if (value) {
        var partials = data[3];
        data[3] = partials ? composeArgs(partials, value, source[4]) : copyArray(value);
        data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : copyArray(source[4]);
      }
      // Compose partial right arguments.
      value = source[5];
      if (value) {
        partials = data[5];
        data[5] = partials ? composeArgsRight(partials, value, source[6]) : copyArray(value);
        data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : copyArray(source[6]);
      }
      // Use source `argPos` if available.
      value = source[7];
      if (value) {
        data[7] = copyArray(value);
      }
      // Use source `ary` if it's smaller.
      if (srcBitmask & ARY_FLAG) {
        data[8] = data[8] == null ? source[8] : nativeMin(data[8], source[8]);
      }
      // Use source `arity` if one is not provided.
      if (data[9] == null) {
        data[9] = source[9];
      }
      // Use source `func` and merge bitmasks.
      data[0] = source[0];
      data[1] = newBitmask;

      return data;
    }

    /**
     * Used by `_.defaultsDeep` to customize its `_.merge` use.
     *
     * @private
     * @param {*} objValue The destination value.
     * @param {*} srcValue The source value.
     * @param {string} key The key of the property to merge.
     * @param {Object} object The parent object of `objValue`.
     * @param {Object} source The parent object of `srcValue`.
     * @param {Object} [stack] Tracks traversed source values and their merged counterparts.
     * @returns {*} Returns the value to assign.
     */
    function mergeDefaults(objValue, srcValue, key, object, source, stack) {
      if (isObject(objValue) && isObject(srcValue)) {
        baseMerge(objValue, srcValue, undefined, mergeDefaults, stack.set(srcValue, objValue));
      }
      return objValue;
    }

    /**
     * Gets the parent value at `path` of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array} path The path to get the parent value of.
     * @returns {*} Returns the parent value.
     */
    function parent(object, path) {
      return path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
    }

    /**
     * Reorder `array` according to the specified indexes where the element at
     * the first index is assigned as the first element, the element at
     * the second index is assigned as the second element, and so on.
     *
     * @private
     * @param {Array} array The array to reorder.
     * @param {Array} indexes The arranged array indexes.
     * @returns {Array} Returns `array`.
     */
    function reorder(array, indexes) {
      var arrLength = array.length,
          length = nativeMin(indexes.length, arrLength),
          oldArray = copyArray(array);

      while (length--) {
        var index = indexes[length];
        array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined;
      }
      return array;
    }

    /**
     * Sets metadata for `func`.
     *
     * **Note:** If this function becomes hot, i.e. is invoked a lot in a short
     * period of time, it will trip its breaker and transition to an identity function
     * to avoid garbage collection pauses in V8. See [V8 issue 2070](https://code.google.com/p/v8/issues/detail?id=2070)
     * for more details.
     *
     * @private
     * @param {Function} func The function to associate metadata with.
     * @param {*} data The metadata.
     * @returns {Function} Returns `func`.
     */
    var setData = (function() {
      var count = 0,
          lastCalled = 0;

      return function(key, value) {
        var stamp = now(),
            remaining = HOT_SPAN - (stamp - lastCalled);

        lastCalled = stamp;
        if (remaining > 0) {
          if (++count >= HOT_COUNT) {
            return key;
          }
        } else {
          count = 0;
        }
        return baseSetData(key, value);
      };
    }());

    /**
     * Converts `string` to a property path array.
     *
     * @private
     * @param {string} string The string to convert.
     * @returns {Array} Returns the property path array.
     */
    function stringToPath(string) {
      var result = [];
      toString(string).replace(rePropName, function(match, number, quote, string) {
        result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
      });
      return result;
    }

    /**
     * Creates a clone of `wrapper`.
     *
     * @private
     * @param {Object} wrapper The wrapper to clone.
     * @returns {Object} Returns the cloned wrapper.
     */
    function wrapperClone(wrapper) {
      if (wrapper instanceof LazyWrapper) {
        return wrapper.clone();
      }
      var result = new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__);
      result.__actions__ = copyArray(wrapper.__actions__);
      result.__index__  = wrapper.__index__;
      result.__values__ = wrapper.__values__;
      return result;
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates an array of elements split into groups the length of `size`.
     * If `array` can't be split evenly, the final chunk will be the remaining
     * elements.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to process.
     * @param {number} [size=0] The length of each chunk.
     * @returns {Array} Returns the new array containing chunks.
     * @example
     *
     * _.chunk(['a', 'b', 'c', 'd'], 2);
     * // => [['a', 'b'], ['c', 'd']]
     *
     * _.chunk(['a', 'b', 'c', 'd'], 3);
     * // => [['a', 'b', 'c'], ['d']]
     */
    function chunk(array, size) {
      size = nativeMax(toInteger(size), 0);

      var length = array ? array.length : 0;
      if (!length || size < 1) {
        return [];
      }
      var index = 0,
          resIndex = 0,
          result = Array(nativeCeil(length / size));

      while (index < length) {
        result[resIndex++] = baseSlice(array, index, (index += size));
      }
      return result;
    }

    /**
     * Creates an array with all falsey values removed. The values `false`, `null`,
     * `0`, `""`, `undefined`, and `NaN` are falsey.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to compact.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.compact([0, 1, false, 2, '', 3]);
     * // => [1, 2, 3]
     */
    function compact(array) {
      var index = -1,
          length = array ? array.length : 0,
          resIndex = 0,
          result = [];

      while (++index < length) {
        var value = array[index];
        if (value) {
          result[resIndex++] = value;
        }
      }
      return result;
    }

    /**
     * Creates a new array concatenating `array` with any additional arrays
     * and/or values.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to concatenate.
     * @param {...*} [values] The values to concatenate.
     * @returns {Array} Returns the new concatenated array.
     * @example
     *
     * var array = [1];
     * var other = _.concat(array, 2, [3], [[4]]);
     *
     * console.log(other);
     * // => [1, 2, 3, [4]]
     *
     * console.log(array);
     * // => [1]
     */
    var concat = rest(function(array, values) {
      if (!isArray(array)) {
        array = array == null ? [] : [Object(array)];
      }
      values = baseFlatten(values, 1);
      return arrayConcat(array, values);
    });

    /**
     * Creates an array of unique `array` values not included in the other
     * given arrays using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons. The order of result values is determined by the
     * order they occur in the first array.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {...Array} [values] The values to exclude.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.difference([3, 2, 1], [4, 2]);
     * // => [3, 1]
     */
    var difference = rest(function(array, values) {
      return isArrayLikeObject(array)
        ? baseDifference(array, baseFlatten(values, 1, true))
        : [];
    });

    /**
     * This method is like `_.difference` except that it accepts `iteratee` which
     * is invoked for each element of `array` and `values` to generate the criterion
     * by which they're compared. Result values are chosen from the first array.
     * The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {...Array} [values] The values to exclude.
     * @param {Function|Object|string} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.differenceBy([3.1, 2.2, 1.3], [4.4, 2.5], Math.floor);
     * // => [3.1, 1.3]
     *
     * // The `_.property` iteratee shorthand.
     * _.differenceBy([{ 'x': 2 }, { 'x': 1 }], [{ 'x': 1 }], 'x');
     * // => [{ 'x': 2 }]
     */
    var differenceBy = rest(function(array, values) {
      var iteratee = last(values);
      if (isArrayLikeObject(iteratee)) {
        iteratee = undefined;
      }
      return isArrayLikeObject(array)
        ? baseDifference(array, baseFlatten(values, 1, true), getIteratee(iteratee))
        : [];
    });

    /**
     * This method is like `_.difference` except that it accepts `comparator`
     * which is invoked to compare elements of `array` to `values`. Result values
     * are chosen from the first array. The comparator is invoked with two arguments:
     * (arrVal, othVal).
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {...Array} [values] The values to exclude.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
     *
     * _.differenceWith(objects, [{ 'x': 1, 'y': 2 }], _.isEqual);
     * // => [{ 'x': 2, 'y': 1 }]
     */
    var differenceWith = rest(function(array, values) {
      var comparator = last(values);
      if (isArrayLikeObject(comparator)) {
        comparator = undefined;
      }
      return isArrayLikeObject(array)
        ? baseDifference(array, baseFlatten(values, 1, true), undefined, comparator)
        : [];
    });

    /**
     * Creates a slice of `array` with `n` elements dropped from the beginning.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to drop.
     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.drop([1, 2, 3]);
     * // => [2, 3]
     *
     * _.drop([1, 2, 3], 2);
     * // => [3]
     *
     * _.drop([1, 2, 3], 5);
     * // => []
     *
     * _.drop([1, 2, 3], 0);
     * // => [1, 2, 3]
     */
    function drop(array, n, guard) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      n = (guard || n === undefined) ? 1 : toInteger(n);
      return baseSlice(array, n < 0 ? 0 : n, length);
    }

    /**
     * Creates a slice of `array` with `n` elements dropped from the end.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to drop.
     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.dropRight([1, 2, 3]);
     * // => [1, 2]
     *
     * _.dropRight([1, 2, 3], 2);
     * // => [1]
     *
     * _.dropRight([1, 2, 3], 5);
     * // => []
     *
     * _.dropRight([1, 2, 3], 0);
     * // => [1, 2, 3]
     */
    function dropRight(array, n, guard) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      n = (guard || n === undefined) ? 1 : toInteger(n);
      n = length - n;
      return baseSlice(array, 0, n < 0 ? 0 : n);
    }

    /**
     * Creates a slice of `array` excluding elements dropped from the end.
     * Elements are dropped until `predicate` returns falsey. The predicate is
     * invoked with three arguments: (value, index, array).
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': true },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': false }
     * ];
     *
     * _.dropRightWhile(users, function(o) { return !o.active; });
     * // => objects for ['barney']
     *
     * // The `_.matches` iteratee shorthand.
     * _.dropRightWhile(users, { 'user': 'pebbles', 'active': false });
     * // => objects for ['barney', 'fred']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.dropRightWhile(users, ['active', false]);
     * // => objects for ['barney']
     *
     * // The `_.property` iteratee shorthand.
     * _.dropRightWhile(users, 'active');
     * // => objects for ['barney', 'fred', 'pebbles']
     */
    function dropRightWhile(array, predicate) {
      return (array && array.length)
        ? baseWhile(array, getIteratee(predicate, 3), true, true)
        : [];
    }

    /**
     * Creates a slice of `array` excluding elements dropped from the beginning.
     * Elements are dropped until `predicate` returns falsey. The predicate is
     * invoked with three arguments: (value, index, array).
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': false },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': true }
     * ];
     *
     * _.dropWhile(users, function(o) { return !o.active; });
     * // => objects for ['pebbles']
     *
     * // The `_.matches` iteratee shorthand.
     * _.dropWhile(users, { 'user': 'barney', 'active': false });
     * // => objects for ['fred', 'pebbles']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.dropWhile(users, ['active', false]);
     * // => objects for ['pebbles']
     *
     * // The `_.property` iteratee shorthand.
     * _.dropWhile(users, 'active');
     * // => objects for ['barney', 'fred', 'pebbles']
     */
    function dropWhile(array, predicate) {
      return (array && array.length)
        ? baseWhile(array, getIteratee(predicate, 3), true)
        : [];
    }

    /**
     * Fills elements of `array` with `value` from `start` up to, but not
     * including, `end`.
     *
     * **Note:** This method mutates `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to fill.
     * @param {*} value The value to fill `array` with.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [1, 2, 3];
     *
     * _.fill(array, 'a');
     * console.log(array);
     * // => ['a', 'a', 'a']
     *
     * _.fill(Array(3), 2);
     * // => [2, 2, 2]
     *
     * _.fill([4, 6, 8, 10], '*', 1, 3);
     * // => [4, '*', '*', 10]
     */
    function fill(array, value, start, end) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      if (start && typeof start != 'number' && isIterateeCall(array, value, start)) {
        start = 0;
        end = length;
      }
      return baseFill(array, value, start, end);
    }

    /**
     * This method is like `_.find` except that it returns the index of the first
     * element `predicate` returns truthy for instead of the element itself.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked per iteration.
     * @returns {number} Returns the index of the found element, else `-1`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': false },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': true }
     * ];
     *
     * _.findIndex(users, function(o) { return o.user == 'barney'; });
     * // => 0
     *
     * // The `_.matches` iteratee shorthand.
     * _.findIndex(users, { 'user': 'fred', 'active': false });
     * // => 1
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.findIndex(users, ['active', false]);
     * // => 0
     *
     * // The `_.property` iteratee shorthand.
     * _.findIndex(users, 'active');
     * // => 2
     */
    function findIndex(array, predicate) {
      return (array && array.length)
        ? baseFindIndex(array, getIteratee(predicate, 3))
        : -1;
    }

    /**
     * This method is like `_.findIndex` except that it iterates over elements
     * of `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked per iteration.
     * @returns {number} Returns the index of the found element, else `-1`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': true },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': false }
     * ];
     *
     * _.findLastIndex(users, function(o) { return o.user == 'pebbles'; });
     * // => 2
     *
     * // The `_.matches` iteratee shorthand.
     * _.findLastIndex(users, { 'user': 'barney', 'active': true });
     * // => 0
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.findLastIndex(users, ['active', false]);
     * // => 2
     *
     * // The `_.property` iteratee shorthand.
     * _.findLastIndex(users, 'active');
     * // => 0
     */
    function findLastIndex(array, predicate) {
      return (array && array.length)
        ? baseFindIndex(array, getIteratee(predicate, 3), true)
        : -1;
    }

    /**
     * Flattens `array` a single level deep.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to flatten.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * _.flatten([1, [2, [3, [4]], 5]]);
     * // => [1, 2, [3, [4]], 5]
     */
    function flatten(array) {
      var length = array ? array.length : 0;
      return length ? baseFlatten(array, 1) : [];
    }

    /**
     * Recursively flattens `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to flatten.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * _.flattenDeep([1, [2, [3, [4]], 5]]);
     * // => [1, 2, 3, 4, 5]
     */
    function flattenDeep(array) {
      var length = array ? array.length : 0;
      return length ? baseFlatten(array, INFINITY) : [];
    }

    /**
     * Recursively flatten `array` up to `depth` times.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to flatten.
     * @param {number} [depth=1] The maximum recursion depth.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * var array = [1, [2, [3, [4]], 5]];
     *
     * _.flattenDepth(array, 1);
     * // => [1, 2, [3, [4]], 5]
     *
     * _.flattenDepth(array, 2);
     * // => [1, 2, 3, [4], 5]
     */
    function flattenDepth(array, depth) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      depth = depth === undefined ? 1 : toInteger(depth);
      return baseFlatten(array, depth);
    }

    /**
     * The inverse of `_.toPairs`; this method returns an object composed
     * from key-value `pairs`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} pairs The key-value pairs.
     * @returns {Object} Returns the new object.
     * @example
     *
     * _.fromPairs([['fred', 30], ['barney', 40]]);
     * // => { 'fred': 30, 'barney': 40 }
     */
    function fromPairs(pairs) {
      var index = -1,
          length = pairs ? pairs.length : 0,
          result = {};

      while (++index < length) {
        var pair = pairs[index];
        result[pair[0]] = pair[1];
      }
      return result;
    }

    /**
     * Gets the first element of `array`.
     *
     * @static
     * @memberOf _
     * @alias first
     * @category Array
     * @param {Array} array The array to query.
     * @returns {*} Returns the first element of `array`.
     * @example
     *
     * _.head([1, 2, 3]);
     * // => 1
     *
     * _.head([]);
     * // => undefined
     */
    function head(array) {
      return array ? array[0] : undefined;
    }

    /**
     * Gets the index at which the first occurrence of `value` is found in `array`
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons. If `fromIndex` is negative, it's used as the offset
     * from the end of `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to search.
     * @param {*} value The value to search for.
     * @param {number} [fromIndex=0] The index to search from.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.indexOf([1, 2, 1, 2], 2);
     * // => 1
     *
     * // Search from the `fromIndex`.
     * _.indexOf([1, 2, 1, 2], 2, 2);
     * // => 3
     */
    function indexOf(array, value, fromIndex) {
      var length = array ? array.length : 0;
      if (!length) {
        return -1;
      }
      fromIndex = toInteger(fromIndex);
      if (fromIndex < 0) {
        fromIndex = nativeMax(length + fromIndex, 0);
      }
      return baseIndexOf(array, value, fromIndex);
    }

    /**
     * Gets all but the last element of `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.initial([1, 2, 3]);
     * // => [1, 2]
     */
    function initial(array) {
      return dropRight(array, 1);
    }

    /**
     * Creates an array of unique values that are included in all given arrays
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons. The order of result values is determined by the
     * order they occur in the first array.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @returns {Array} Returns the new array of intersecting values.
     * @example
     *
     * _.intersection([2, 1], [4, 2], [1, 2]);
     * // => [2]
     */
    var intersection = rest(function(arrays) {
      var mapped = arrayMap(arrays, baseCastArrayLikeObject);
      return (mapped.length && mapped[0] === arrays[0])
        ? baseIntersection(mapped)
        : [];
    });

    /**
     * This method is like `_.intersection` except that it accepts `iteratee`
     * which is invoked for each element of each `arrays` to generate the criterion
     * by which they're compared. Result values are chosen from the first array.
     * The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function|Object|string} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns the new array of intersecting values.
     * @example
     *
     * _.intersectionBy([2.1, 1.2], [4.3, 2.4], Math.floor);
     * // => [2.1]
     *
     * // The `_.property` iteratee shorthand.
     * _.intersectionBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 1 }]
     */
    var intersectionBy = rest(function(arrays) {
      var iteratee = last(arrays),
          mapped = arrayMap(arrays, baseCastArrayLikeObject);

      if (iteratee === last(mapped)) {
        iteratee = undefined;
      } else {
        mapped.pop();
      }
      return (mapped.length && mapped[0] === arrays[0])
        ? baseIntersection(mapped, getIteratee(iteratee))
        : [];
    });

    /**
     * This method is like `_.intersection` except that it accepts `comparator`
     * which is invoked to compare elements of `arrays`. Result values are chosen
     * from the first array. The comparator is invoked with two arguments:
     * (arrVal, othVal).
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of intersecting values.
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
     * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
     *
     * _.intersectionWith(objects, others, _.isEqual);
     * // => [{ 'x': 1, 'y': 2 }]
     */
    var intersectionWith = rest(function(arrays) {
      var comparator = last(arrays),
          mapped = arrayMap(arrays, baseCastArrayLikeObject);

      if (comparator === last(mapped)) {
        comparator = undefined;
      } else {
        mapped.pop();
      }
      return (mapped.length && mapped[0] === arrays[0])
        ? baseIntersection(mapped, undefined, comparator)
        : [];
    });

    /**
     * Converts all elements in `array` into a string separated by `separator`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to convert.
     * @param {string} [separator=','] The element separator.
     * @returns {string} Returns the joined string.
     * @example
     *
     * _.join(['a', 'b', 'c'], '~');
     * // => 'a~b~c'
     */
    function join(array, separator) {
      return array ? nativeJoin.call(array, separator) : '';
    }

    /**
     * Gets the last element of `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @returns {*} Returns the last element of `array`.
     * @example
     *
     * _.last([1, 2, 3]);
     * // => 3
     */
    function last(array) {
      var length = array ? array.length : 0;
      return length ? array[length - 1] : undefined;
    }

    /**
     * This method is like `_.indexOf` except that it iterates over elements of
     * `array` from right to left.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to search.
     * @param {*} value The value to search for.
     * @param {number} [fromIndex=array.length-1] The index to search from.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.lastIndexOf([1, 2, 1, 2], 2);
     * // => 3
     *
     * // Search from the `fromIndex`.
     * _.lastIndexOf([1, 2, 1, 2], 2, 2);
     * // => 1
     */
    function lastIndexOf(array, value, fromIndex) {
      var length = array ? array.length : 0;
      if (!length) {
        return -1;
      }
      var index = length;
      if (fromIndex !== undefined) {
        index = toInteger(fromIndex);
        index = (index < 0 ? nativeMax(length + index, 0) : nativeMin(index, length - 1)) + 1;
      }
      if (value !== value) {
        return indexOfNaN(array, index, true);
      }
      while (index--) {
        if (array[index] === value) {
          return index;
        }
      }
      return -1;
    }

    /**
     * Removes all given values from `array` using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * **Note:** Unlike `_.without`, this method mutates `array`. Use `_.remove`
     * to remove elements from an array by predicate.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to modify.
     * @param {...*} [values] The values to remove.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [1, 2, 3, 1, 2, 3];
     *
     * _.pull(array, 2, 3);
     * console.log(array);
     * // => [1, 1]
     */
    var pull = rest(pullAll);

    /**
     * This method is like `_.pull` except that it accepts an array of values to remove.
     *
     * **Note:** Unlike `_.difference`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to modify.
     * @param {Array} values The values to remove.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [1, 2, 3, 1, 2, 3];
     *
     * _.pullAll(array, [2, 3]);
     * console.log(array);
     * // => [1, 1]
     */
    function pullAll(array, values) {
      return (array && array.length && values && values.length)
        ? basePullAll(array, values)
        : array;
    }

    /**
     * This method is like `_.pullAll` except that it accepts `iteratee` which is
     * invoked for each element of `array` and `values` to generate the criterion
     * by which they're compared. The iteratee is invoked with one argument: (value).
     *
     * **Note:** Unlike `_.differenceBy`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to modify.
     * @param {Array} values The values to remove.
     * @param {Function|Object|string} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [{ 'x': 1 }, { 'x': 2 }, { 'x': 3 }, { 'x': 1 }];
     *
     * _.pullAllBy(array, [{ 'x': 1 }, { 'x': 3 }], 'x');
     * console.log(array);
     * // => [{ 'x': 2 }]
     */
    function pullAllBy(array, values, iteratee) {
      return (array && array.length && values && values.length)
        ? basePullAll(array, values, getIteratee(iteratee))
        : array;
    }

    /**
     * This method is like `_.pullAll` except that it accepts `comparator` which
     * is invoked to compare elements of `array` to `values`. The comparator is
     * invoked with two arguments: (arrVal, othVal).
     *
     * **Note:** Unlike `_.differenceWith`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to modify.
     * @param {Array} values The values to remove.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [{ 'x': 1, 'y': 2 }, { 'x': 3, 'y': 4 }, { 'x': 5, 'y': 6 }];
     *
     * _.pullAllWith(array, [{ 'x': 3, 'y': 4 }], _.isEqual);
     * console.log(array);
     * // => [{ 'x': 1, 'y': 2 }, { 'x': 5, 'y': 6 }]
     */
    function pullAllWith(array, values, comparator) {
      return (array && array.length && values && values.length)
        ? basePullAll(array, values, undefined, comparator)
        : array;
    }

    /**
     * Removes elements from `array` corresponding to `indexes` and returns an
     * array of removed elements.
     *
     * **Note:** Unlike `_.at`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to modify.
     * @param {...(number|number[])} [indexes] The indexes of elements to remove,
     *  specified individually or in arrays.
     * @returns {Array} Returns the new array of removed elements.
     * @example
     *
     * var array = [5, 10, 15, 20];
     * var evens = _.pullAt(array, 1, 3);
     *
     * console.log(array);
     * // => [5, 15]
     *
     * console.log(evens);
     * // => [10, 20]
     */
    var pullAt = rest(function(array, indexes) {
      indexes = arrayMap(baseFlatten(indexes, 1), String);

      var result = baseAt(array, indexes);
      basePullAt(array, indexes.sort(compareAscending));
      return result;
    });

    /**
     * Removes all elements from `array` that `predicate` returns truthy for
     * and returns an array of the removed elements. The predicate is invoked
     * with three arguments: (value, index, array).
     *
     * **Note:** Unlike `_.filter`, this method mutates `array`. Use `_.pull`
     * to pull elements from an array by value.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to modify.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the new array of removed elements.
     * @example
     *
     * var array = [1, 2, 3, 4];
     * var evens = _.remove(array, function(n) {
     *   return n % 2 == 0;
     * });
     *
     * console.log(array);
     * // => [1, 3]
     *
     * console.log(evens);
     * // => [2, 4]
     */
    function remove(array, predicate) {
      var result = [];
      if (!(array && array.length)) {
        return result;
      }
      var index = -1,
          indexes = [],
          length = array.length;

      predicate = getIteratee(predicate, 3);
      while (++index < length) {
        var value = array[index];
        if (predicate(value, index, array)) {
          result.push(value);
          indexes.push(index);
        }
      }
      basePullAt(array, indexes);
      return result;
    }

    /**
     * Reverses `array` so that the first element becomes the last, the second
     * element becomes the second to last, and so on.
     *
     * **Note:** This method mutates `array` and is based on
     * [`Array#reverse`](https://mdn.io/Array/reverse).
     *
     * @static
     * @memberOf _
     * @category Array
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [1, 2, 3];
     *
     * _.reverse(array);
     * // => [3, 2, 1]
     *
     * console.log(array);
     * // => [3, 2, 1]
     */
    function reverse(array) {
      return array ? nativeReverse.call(array) : array;
    }

    /**
     * Creates a slice of `array` from `start` up to, but not including, `end`.
     *
     * **Note:** This method is used instead of [`Array#slice`](https://mdn.io/Array/slice)
     * to ensure dense arrays are returned.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to slice.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns the slice of `array`.
     */
    function slice(array, start, end) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      if (end && typeof end != 'number' && isIterateeCall(array, start, end)) {
        start = 0;
        end = length;
      }
      else {
        start = start == null ? 0 : toInteger(start);
        end = end === undefined ? length : toInteger(end);
      }
      return baseSlice(array, start, end);
    }

    /**
     * Uses a binary search to determine the lowest index at which `value` should
     * be inserted into `array` in order to maintain its sort order.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @returns {number} Returns the index at which `value` should be inserted into `array`.
     * @example
     *
     * _.sortedIndex([30, 50], 40);
     * // => 1
     *
     * _.sortedIndex([4, 5], 4);
     * // => 0
     */
    function sortedIndex(array, value) {
      return baseSortedIndex(array, value);
    }

    /**
     * This method is like `_.sortedIndex` except that it accepts `iteratee`
     * which is invoked for `value` and each element of `array` to compute their
     * sort ranking. The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function|Object|string} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {number} Returns the index at which `value` should be inserted into `array`.
     * @example
     *
     * var dict = { 'thirty': 30, 'forty': 40, 'fifty': 50 };
     *
     * _.sortedIndexBy(['thirty', 'fifty'], 'forty', _.propertyOf(dict));
     * // => 1
     *
     * // The `_.property` iteratee shorthand.
     * _.sortedIndexBy([{ 'x': 4 }, { 'x': 5 }], { 'x': 4 }, 'x');
     * // => 0
     */
    function sortedIndexBy(array, value, iteratee) {
      return baseSortedIndexBy(array, value, getIteratee(iteratee));
    }

    /**
     * This method is like `_.indexOf` except that it performs a binary
     * search on a sorted `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to search.
     * @param {*} value The value to search for.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.sortedIndexOf([1, 1, 2, 2], 2);
     * // => 2
     */
    function sortedIndexOf(array, value) {
      var length = array ? array.length : 0;
      if (length) {
        var index = baseSortedIndex(array, value);
        if (index < length && eq(array[index], value)) {
          return index;
        }
      }
      return -1;
    }

    /**
     * This method is like `_.sortedIndex` except that it returns the highest
     * index at which `value` should be inserted into `array` in order to
     * maintain its sort order.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @returns {number} Returns the index at which `value` should be inserted into `array`.
     * @example
     *
     * _.sortedLastIndex([4, 5], 4);
     * // => 1
     */
    function sortedLastIndex(array, value) {
      return baseSortedIndex(array, value, true);
    }

    /**
     * This method is like `_.sortedLastIndex` except that it accepts `iteratee`
     * which is invoked for `value` and each element of `array` to compute their
     * sort ranking. The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function|Object|string} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {number} Returns the index at which `value` should be inserted into `array`.
     * @example
     *
     * // The `_.property` iteratee shorthand.
     * _.sortedLastIndexBy([{ 'x': 4 }, { 'x': 5 }], { 'x': 4 }, 'x');
     * // => 1
     */
    function sortedLastIndexBy(array, value, iteratee) {
      return baseSortedIndexBy(array, value, getIteratee(iteratee), true);
    }

    /**
     * This method is like `_.lastIndexOf` except that it performs a binary
     * search on a sorted `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to search.
     * @param {*} value The value to search for.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.sortedLastIndexOf([1, 1, 2, 2], 2);
     * // => 3
     */
    function sortedLastIndexOf(array, value) {
      var length = array ? array.length : 0;
      if (length) {
        var index = baseSortedIndex(array, value, true) - 1;
        if (eq(array[index], value)) {
          return index;
        }
      }
      return -1;
    }

    /**
     * This method is like `_.uniq` except that it's designed and optimized
     * for sorted arrays.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to inspect.
     * @returns {Array} Returns the new duplicate free array.
     * @example
     *
     * _.sortedUniq([1, 1, 2]);
     * // => [1, 2]
     */
    function sortedUniq(array) {
      return (array && array.length)
        ? baseSortedUniq(array)
        : [];
    }

    /**
     * This method is like `_.uniqBy` except that it's designed and optimized
     * for sorted arrays.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @returns {Array} Returns the new duplicate free array.
     * @example
     *
     * _.sortedUniqBy([1.1, 1.2, 2.3, 2.4], Math.floor);
     * // => [1.1, 2.3]
     */
    function sortedUniqBy(array, iteratee) {
      return (array && array.length)
        ? baseSortedUniqBy(array, getIteratee(iteratee))
        : [];
    }

    /**
     * Gets all but the first element of `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.tail([1, 2, 3]);
     * // => [2, 3]
     */
    function tail(array) {
      return drop(array, 1);
    }

    /**
     * Creates a slice of `array` with `n` elements taken from the beginning.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to take.
     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.take([1, 2, 3]);
     * // => [1]
     *
     * _.take([1, 2, 3], 2);
     * // => [1, 2]
     *
     * _.take([1, 2, 3], 5);
     * // => [1, 2, 3]
     *
     * _.take([1, 2, 3], 0);
     * // => []
     */
    function take(array, n, guard) {
      if (!(array && array.length)) {
        return [];
      }
      n = (guard || n === undefined) ? 1 : toInteger(n);
      return baseSlice(array, 0, n < 0 ? 0 : n);
    }

    /**
     * Creates a slice of `array` with `n` elements taken from the end.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to take.
     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.takeRight([1, 2, 3]);
     * // => [3]
     *
     * _.takeRight([1, 2, 3], 2);
     * // => [2, 3]
     *
     * _.takeRight([1, 2, 3], 5);
     * // => [1, 2, 3]
     *
     * _.takeRight([1, 2, 3], 0);
     * // => []
     */
    function takeRight(array, n, guard) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      n = (guard || n === undefined) ? 1 : toInteger(n);
      n = length - n;
      return baseSlice(array, n < 0 ? 0 : n, length);
    }

    /**
     * Creates a slice of `array` with elements taken from the end. Elements are
     * taken until `predicate` returns falsey. The predicate is invoked with three
     * arguments: (value, index, array).
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': true },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': false }
     * ];
     *
     * _.takeRightWhile(users, function(o) { return !o.active; });
     * // => objects for ['fred', 'pebbles']
     *
     * // The `_.matches` iteratee shorthand.
     * _.takeRightWhile(users, { 'user': 'pebbles', 'active': false });
     * // => objects for ['pebbles']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.takeRightWhile(users, ['active', false]);
     * // => objects for ['fred', 'pebbles']
     *
     * // The `_.property` iteratee shorthand.
     * _.takeRightWhile(users, 'active');
     * // => []
     */
    function takeRightWhile(array, predicate) {
      return (array && array.length)
        ? baseWhile(array, getIteratee(predicate, 3), false, true)
        : [];
    }

    /**
     * Creates a slice of `array` with elements taken from the beginning. Elements
     * are taken until `predicate` returns falsey. The predicate is invoked with
     * three arguments: (value, index, array).
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': false },
     *   { 'user': 'fred',    'active': false},
     *   { 'user': 'pebbles', 'active': true }
     * ];
     *
     * _.takeWhile(users, function(o) { return !o.active; });
     * // => objects for ['barney', 'fred']
     *
     * // The `_.matches` iteratee shorthand.
     * _.takeWhile(users, { 'user': 'barney', 'active': false });
     * // => objects for ['barney']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.takeWhile(users, ['active', false]);
     * // => objects for ['barney', 'fred']
     *
     * // The `_.property` iteratee shorthand.
     * _.takeWhile(users, 'active');
     * // => []
     */
    function takeWhile(array, predicate) {
      return (array && array.length)
        ? baseWhile(array, getIteratee(predicate, 3))
        : [];
    }

    /**
     * Creates an array of unique values, in order, from all given arrays using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @returns {Array} Returns the new array of combined values.
     * @example
     *
     * _.union([2, 1], [4, 2], [1, 2]);
     * // => [2, 1, 4]
     */
    var union = rest(function(arrays) {
      return baseUniq(baseFlatten(arrays, 1, true));
    });

    /**
     * This method is like `_.union` except that it accepts `iteratee` which is
     * invoked for each element of each `arrays` to generate the criterion by which
     * uniqueness is computed. The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function|Object|string} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns the new array of combined values.
     * @example
     *
     * _.unionBy([2.1, 1.2], [4.3, 2.4], Math.floor);
     * // => [2.1, 1.2, 4.3]
     *
     * // The `_.property` iteratee shorthand.
     * _.unionBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 1 }, { 'x': 2 }]
     */
    var unionBy = rest(function(arrays) {
      var iteratee = last(arrays);
      if (isArrayLikeObject(iteratee)) {
        iteratee = undefined;
      }
      return baseUniq(baseFlatten(arrays, 1, true), getIteratee(iteratee));
    });

    /**
     * This method is like `_.union` except that it accepts `comparator` which
     * is invoked to compare elements of `arrays`. The comparator is invoked
     * with two arguments: (arrVal, othVal).
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of combined values.
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
     * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
     *
     * _.unionWith(objects, others, _.isEqual);
     * // => [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }, { 'x': 1, 'y': 1 }]
     */
    var unionWith = rest(function(arrays) {
      var comparator = last(arrays);
      if (isArrayLikeObject(comparator)) {
        comparator = undefined;
      }
      return baseUniq(baseFlatten(arrays, 1, true), undefined, comparator);
    });

    /**
     * Creates a duplicate-free version of an array, using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons, in which only the first occurrence of each element
     * is kept.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to inspect.
     * @returns {Array} Returns the new duplicate free array.
     * @example
     *
     * _.uniq([2, 1, 2]);
     * // => [2, 1]
     */
    function uniq(array) {
      return (array && array.length)
        ? baseUniq(array)
        : [];
    }

    /**
     * This method is like `_.uniq` except that it accepts `iteratee` which is
     * invoked for each element in `array` to generate the criterion by which
     * uniqueness is computed. The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {Function|Object|string} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns the new duplicate free array.
     * @example
     *
     * _.uniqBy([2.1, 1.2, 2.3], Math.floor);
     * // => [2.1, 1.2]
     *
     * // The `_.property` iteratee shorthand.
     * _.uniqBy([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 1 }, { 'x': 2 }]
     */
    function uniqBy(array, iteratee) {
      return (array && array.length)
        ? baseUniq(array, getIteratee(iteratee))
        : [];
    }

    /**
     * This method is like `_.uniq` except that it accepts `comparator` which
     * is invoked to compare elements of `array`. The comparator is invoked with
     * two arguments: (arrVal, othVal).
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new duplicate free array.
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 },  { 'x': 1, 'y': 2 }];
     *
     * _.uniqWith(objects, _.isEqual);
     * // => [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }]
     */
    function uniqWith(array, comparator) {
      return (array && array.length)
        ? baseUniq(array, undefined, comparator)
        : [];
    }

    /**
     * This method is like `_.zip` except that it accepts an array of grouped
     * elements and creates an array regrouping the elements to their pre-zip
     * configuration.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array of grouped elements to process.
     * @returns {Array} Returns the new array of regrouped elements.
     * @example
     *
     * var zipped = _.zip(['fred', 'barney'], [30, 40], [true, false]);
     * // => [['fred', 30, true], ['barney', 40, false]]
     *
     * _.unzip(zipped);
     * // => [['fred', 'barney'], [30, 40], [true, false]]
     */
    function unzip(array) {
      if (!(array && array.length)) {
        return [];
      }
      var length = 0;
      array = arrayFilter(array, function(group) {
        if (isArrayLikeObject(group)) {
          length = nativeMax(group.length, length);
          return true;
        }
      });
      return baseTimes(length, function(index) {
        return arrayMap(array, baseProperty(index));
      });
    }

    /**
     * This method is like `_.unzip` except that it accepts `iteratee` to specify
     * how regrouped values should be combined. The iteratee is invoked with the
     * elements of each group: (...group).
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array of grouped elements to process.
     * @param {Function} [iteratee=_.identity] The function to combine regrouped values.
     * @returns {Array} Returns the new array of regrouped elements.
     * @example
     *
     * var zipped = _.zip([1, 2], [10, 20], [100, 200]);
     * // => [[1, 10, 100], [2, 20, 200]]
     *
     * _.unzipWith(zipped, _.add);
     * // => [3, 30, 300]
     */
    function unzipWith(array, iteratee) {
      if (!(array && array.length)) {
        return [];
      }
      var result = unzip(array);
      if (iteratee == null) {
        return result;
      }
      return arrayMap(result, function(group) {
        return apply(iteratee, undefined, group);
      });
    }

    /**
     * Creates an array excluding all given values using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to filter.
     * @param {...*} [values] The values to exclude.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.without([1, 2, 1, 3], 1, 2);
     * // => [3]
     */
    var without = rest(function(array, values) {
      return isArrayLikeObject(array)
        ? baseDifference(array, values)
        : [];
    });

    /**
     * Creates an array of unique values that is the [symmetric difference](https://en.wikipedia.org/wiki/Symmetric_difference)
     * of the given arrays. The order of result values is determined by the order
     * they occur in the arrays.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @returns {Array} Returns the new array of values.
     * @example
     *
     * _.xor([2, 1], [4, 2]);
     * // => [1, 4]
     */
    var xor = rest(function(arrays) {
      return baseXor(arrayFilter(arrays, isArrayLikeObject));
    });

    /**
     * This method is like `_.xor` except that it accepts `iteratee` which is
     * invoked for each element of each `arrays` to generate the criterion by which
     * by which they're compared. The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function|Object|string} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns the new array of values.
     * @example
     *
     * _.xorBy([2.1, 1.2], [4.3, 2.4], Math.floor);
     * // => [1.2, 4.3]
     *
     * // The `_.property` iteratee shorthand.
     * _.xorBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 2 }]
     */
    var xorBy = rest(function(arrays) {
      var iteratee = last(arrays);
      if (isArrayLikeObject(iteratee)) {
        iteratee = undefined;
      }
      return baseXor(arrayFilter(arrays, isArrayLikeObject), getIteratee(iteratee));
    });

    /**
     * This method is like `_.xor` except that it accepts `comparator` which is
     * invoked to compare elements of `arrays`. The comparator is invoked with
     * two arguments: (arrVal, othVal).
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of values.
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
     * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
     *
     * _.xorWith(objects, others, _.isEqual);
     * // => [{ 'x': 2, 'y': 1 }, { 'x': 1, 'y': 1 }]
     */
    var xorWith = rest(function(arrays) {
      var comparator = last(arrays);
      if (isArrayLikeObject(comparator)) {
        comparator = undefined;
      }
      return baseXor(arrayFilter(arrays, isArrayLikeObject), undefined, comparator);
    });

    /**
     * Creates an array of grouped elements, the first of which contains the first
     * elements of the given arrays, the second of which contains the second elements
     * of the given arrays, and so on.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] The arrays to process.
     * @returns {Array} Returns the new array of grouped elements.
     * @example
     *
     * _.zip(['fred', 'barney'], [30, 40], [true, false]);
     * // => [['fred', 30, true], ['barney', 40, false]]
     */
    var zip = rest(unzip);

    /**
     * This method is like `_.fromPairs` except that it accepts two arrays,
     * one of property names and one of corresponding values.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} [props=[]] The property names.
     * @param {Array} [values=[]] The property values.
     * @returns {Object} Returns the new object.
     * @example
     *
     * _.zipObject(['a', 'b'], [1, 2]);
     * // => { 'a': 1, 'b': 2 }
     */
    function zipObject(props, values) {
      return baseZipObject(props || [], values || [], assignValue);
    }

    /**
     * This method is like `_.zipObject` except that it supports property paths.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} [props=[]] The property names.
     * @param {Array} [values=[]] The property values.
     * @returns {Object} Returns the new object.
     * @example
     *
     * _.zipObjectDeep(['a.b[0].c', 'a.b[1].d'], [1, 2]);
     * // => { 'a': { 'b': [{ 'c': 1 }, { 'd': 2 }] } }
     */
    function zipObjectDeep(props, values) {
      return baseZipObject(props || [], values || [], baseSet);
    }

    /**
     * This method is like `_.zip` except that it accepts `iteratee` to specify
     * how grouped values should be combined. The iteratee is invoked with the
     * elements of each group: (...group).
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] The arrays to process.
     * @param {Function} [iteratee=_.identity] The function to combine grouped values.
     * @returns {Array} Returns the new array of grouped elements.
     * @example
     *
     * _.zipWith([1, 2], [10, 20], [100, 200], function(a, b, c) {
     *   return a + b + c;
     * });
     * // => [111, 222]
     */
    var zipWith = rest(function(arrays) {
      var length = arrays.length,
          iteratee = length > 1 ? arrays[length - 1] : undefined;

      iteratee = typeof iteratee == 'function' ? (arrays.pop(), iteratee) : undefined;
      return unzipWith(arrays, iteratee);
    });

    /*------------------------------------------------------------------------*/

    /**
     * Creates a `lodash` object that wraps `value` with explicit method chaining enabled.
     * The result of such method chaining must be unwrapped with `_#value`.
     *
     * @static
     * @memberOf _
     * @category Seq
     * @param {*} value The value to wrap.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36 },
     *   { 'user': 'fred',    'age': 40 },
     *   { 'user': 'pebbles', 'age': 1 }
     * ];
     *
     * var youngest = _
     *   .chain(users)
     *   .sortBy('age')
     *   .map(function(o) {
     *     return o.user + ' is ' + o.age;
     *   })
     *   .head()
     *   .value();
     * // => 'pebbles is 1'
     */
    function chain(value) {
      var result = lodash(value);
      result.__chain__ = true;
      return result;
    }

    /**
     * This method invokes `interceptor` and returns `value`. The interceptor
     * is invoked with one argument; (value). The purpose of this method is to
     * "tap into" a method chain in order to modify intermediate results.
     *
     * @static
     * @memberOf _
     * @category Seq
     * @param {*} value The value to provide to `interceptor`.
     * @param {Function} interceptor The function to invoke.
     * @returns {*} Returns `value`.
     * @example
     *
     * _([1, 2, 3])
     *  .tap(function(array) {
     *    // Mutate input array.
     *    array.pop();
     *  })
     *  .reverse()
     *  .value();
     * // => [2, 1]
     */
    function tap(value, interceptor) {
      interceptor(value);
      return value;
    }

    /**
     * This method is like `_.tap` except that it returns the result of `interceptor`.
     * The purpose of this method is to "pass thru" values replacing intermediate
     * results in a method chain.
     *
     * @static
     * @memberOf _
     * @category Seq
     * @param {*} value The value to provide to `interceptor`.
     * @param {Function} interceptor The function to invoke.
     * @returns {*} Returns the result of `interceptor`.
     * @example
     *
     * _('  abc  ')
     *  .chain()
     *  .trim()
     *  .thru(function(value) {
     *    return [value];
     *  })
     *  .value();
     * // => ['abc']
     */
    function thru(value, interceptor) {
      return interceptor(value);
    }

    /**
     * This method is the wrapper version of `_.at`.
     *
     * @name at
     * @memberOf _
     * @category Seq
     * @param {...(string|string[])} [paths] The property paths of elements to pick,
     *  specified individually or in arrays.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }, 4] };
     *
     * _(object).at(['a[0].b.c', 'a[1]']).value();
     * // => [3, 4]
     *
     * _(['a', 'b', 'c']).at(0, 2).value();
     * // => ['a', 'c']
     */
    var wrapperAt = rest(function(paths) {
      paths = baseFlatten(paths, 1);
      var length = paths.length,
          start = length ? paths[0] : 0,
          value = this.__wrapped__,
          interceptor = function(object) { return baseAt(object, paths); };

      if (length > 1 || this.__actions__.length ||
          !(value instanceof LazyWrapper) || !isIndex(start)) {
        return this.thru(interceptor);
      }
      value = value.slice(start, +start + (length ? 1 : 0));
      value.__actions__.push({
        'func': thru,
        'args': [interceptor],
        'thisArg': undefined
      });
      return new LodashWrapper(value, this.__chain__).thru(function(array) {
        if (length && !array.length) {
          array.push(undefined);
        }
        return array;
      });
    });

    /**
     * Enables explicit method chaining on the wrapper object.
     *
     * @name chain
     * @memberOf _
     * @category Seq
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * // A sequence without explicit chaining.
     * _(users).head();
     * // => { 'user': 'barney', 'age': 36 }
     *
     * // A sequence with explicit chaining.
     * _(users)
     *   .chain()
     *   .head()
     *   .pick('user')
     *   .value();
     * // => { 'user': 'barney' }
     */
    function wrapperChain() {
      return chain(this);
    }

    /**
     * Executes the chained sequence and returns the wrapped result.
     *
     * @name commit
     * @memberOf _
     * @category Seq
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var array = [1, 2];
     * var wrapped = _(array).push(3);
     *
     * console.log(array);
     * // => [1, 2]
     *
     * wrapped = wrapped.commit();
     * console.log(array);
     * // => [1, 2, 3]
     *
     * wrapped.last();
     * // => 3
     *
     * console.log(array);
     * // => [1, 2, 3]
     */
    function wrapperCommit() {
      return new LodashWrapper(this.value(), this.__chain__);
    }

    /**
     * This method is the wrapper version of `_.flatMap`.
     *
     * @name flatMap
     * @memberOf _
     * @category Seq
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * function duplicate(n) {
     *   return [n, n];
     * }
     *
     * _([1, 2]).flatMap(duplicate).value();
     * // => [1, 1, 2, 2]
     */
    function wrapperFlatMap(iteratee) {
      return this.map(iteratee).flatten();
    }

    /**
     * Gets the next value on a wrapped object following the
     * [iterator protocol](https://mdn.io/iteration_protocols#iterator).
     *
     * @name next
     * @memberOf _
     * @category Seq
     * @returns {Object} Returns the next iterator value.
     * @example
     *
     * var wrapped = _([1, 2]);
     *
     * wrapped.next();
     * // => { 'done': false, 'value': 1 }
     *
     * wrapped.next();
     * // => { 'done': false, 'value': 2 }
     *
     * wrapped.next();
     * // => { 'done': true, 'value': undefined }
     */
    function wrapperNext() {
      if (this.__values__ === undefined) {
        this.__values__ = toArray(this.value());
      }
      var done = this.__index__ >= this.__values__.length,
          value = done ? undefined : this.__values__[this.__index__++];

      return { 'done': done, 'value': value };
    }

    /**
     * Enables the wrapper to be iterable.
     *
     * @name Symbol.iterator
     * @memberOf _
     * @category Seq
     * @returns {Object} Returns the wrapper object.
     * @example
     *
     * var wrapped = _([1, 2]);
     *
     * wrapped[Symbol.iterator]() === wrapped;
     * // => true
     *
     * Array.from(wrapped);
     * // => [1, 2]
     */
    function wrapperToIterator() {
      return this;
    }

    /**
     * Creates a clone of the chained sequence planting `value` as the wrapped value.
     *
     * @name plant
     * @memberOf _
     * @category Seq
     * @param {*} value The value to plant.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var wrapped = _([1, 2]).map(square);
     * var other = wrapped.plant([3, 4]);
     *
     * other.value();
     * // => [9, 16]
     *
     * wrapped.value();
     * // => [1, 4]
     */
    function wrapperPlant(value) {
      var result,
          parent = this;

      while (parent instanceof baseLodash) {
        var clone = wrapperClone(parent);
        clone.__index__ = 0;
        clone.__values__ = undefined;
        if (result) {
          previous.__wrapped__ = clone;
        } else {
          result = clone;
        }
        var previous = clone;
        parent = parent.__wrapped__;
      }
      previous.__wrapped__ = value;
      return result;
    }

    /**
     * This method is the wrapper version of `_.reverse`.
     *
     * **Note:** This method mutates the wrapped array.
     *
     * @name reverse
     * @memberOf _
     * @category Seq
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var array = [1, 2, 3];
     *
     * _(array).reverse().value()
     * // => [3, 2, 1]
     *
     * console.log(array);
     * // => [3, 2, 1]
     */
    function wrapperReverse() {
      var value = this.__wrapped__;
      if (value instanceof LazyWrapper) {
        var wrapped = value;
        if (this.__actions__.length) {
          wrapped = new LazyWrapper(this);
        }
        wrapped = wrapped.reverse();
        wrapped.__actions__.push({
          'func': thru,
          'args': [reverse],
          'thisArg': undefined
        });
        return new LodashWrapper(wrapped, this.__chain__);
      }
      return this.thru(reverse);
    }

    /**
     * Executes the chained sequence to extract the unwrapped value.
     *
     * @name value
     * @memberOf _
     * @alias toJSON, valueOf
     * @category Seq
     * @returns {*} Returns the resolved unwrapped value.
     * @example
     *
     * _([1, 2, 3]).value();
     * // => [1, 2, 3]
     */
    function wrapperValue() {
      return baseWrapperValue(this.__wrapped__, this.__actions__);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` through `iteratee`. The corresponding value
     * of each key is the number of times the key was returned by `iteratee`.
     * The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The iteratee to transform keys.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * _.countBy([6.1, 4.2, 6.3], Math.floor);
     * // => { '4': 1, '6': 2 }
     *
     * _.countBy(['one', 'two', 'three'], 'length');
     * // => { '3': 2, '5': 1 }
     */
    var countBy = createAggregator(function(result, value, key) {
      hasOwnProperty.call(result, key) ? ++result[key] : (result[key] = 1);
    });

    /**
     * Checks if `predicate` returns truthy for **all** elements of `collection`.
     * Iteration is stopped once `predicate` returns falsey. The predicate is
     * invoked with three arguments: (value, index|key, collection).
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked per iteration.
     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
     * @returns {boolean} Returns `true` if all elements pass the predicate check, else `false`.
     * @example
     *
     * _.every([true, 1, null, 'yes'], Boolean);
     * // => false
     *
     * var users = [
     *   { 'user': 'barney', 'active': false },
     *   { 'user': 'fred',   'active': false }
     * ];
     *
     * // The `_.matches` iteratee shorthand.
     * _.every(users, { 'user': 'barney', 'active': false });
     * // => false
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.every(users, ['active', false]);
     * // => true
     *
     * // The `_.property` iteratee shorthand.
     * _.every(users, 'active');
     * // => false
     */
    function every(collection, predicate, guard) {
      var func = isArray(collection) ? arrayEvery : baseEvery;
      if (guard && isIterateeCall(collection, predicate, guard)) {
        predicate = undefined;
      }
      return func(collection, getIteratee(predicate, 3));
    }

    /**
     * Iterates over elements of `collection`, returning an array of all elements
     * `predicate` returns truthy for. The predicate is invoked with three arguments:
     * (value, index|key, collection).
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': true },
     *   { 'user': 'fred',   'age': 40, 'active': false }
     * ];
     *
     * _.filter(users, function(o) { return !o.active; });
     * // => objects for ['fred']
     *
     * // The `_.matches` iteratee shorthand.
     * _.filter(users, { 'age': 36, 'active': true });
     * // => objects for ['barney']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.filter(users, ['active', false]);
     * // => objects for ['fred']
     *
     * // The `_.property` iteratee shorthand.
     * _.filter(users, 'active');
     * // => objects for ['barney']
     */
    function filter(collection, predicate) {
      var func = isArray(collection) ? arrayFilter : baseFilter;
      return func(collection, getIteratee(predicate, 3));
    }

    /**
     * Iterates over elements of `collection`, returning the first element
     * `predicate` returns truthy for. The predicate is invoked with three arguments:
     * (value, index|key, collection).
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object} collection The collection to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked per iteration.
     * @returns {*} Returns the matched element, else `undefined`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36, 'active': true },
     *   { 'user': 'fred',    'age': 40, 'active': false },
     *   { 'user': 'pebbles', 'age': 1,  'active': true }
     * ];
     *
     * _.find(users, function(o) { return o.age < 40; });
     * // => object for 'barney'
     *
     * // The `_.matches` iteratee shorthand.
     * _.find(users, { 'age': 1, 'active': true });
     * // => object for 'pebbles'
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.find(users, ['active', false]);
     * // => object for 'fred'
     *
     * // The `_.property` iteratee shorthand.
     * _.find(users, 'active');
     * // => object for 'barney'
     */
    function find(collection, predicate) {
      predicate = getIteratee(predicate, 3);
      if (isArray(collection)) {
        var index = baseFindIndex(collection, predicate);
        return index > -1 ? collection[index] : undefined;
      }
      return baseFind(collection, predicate, baseEach);
    }

    /**
     * This method is like `_.find` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object} collection The collection to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked per iteration.
     * @returns {*} Returns the matched element, else `undefined`.
     * @example
     *
     * _.findLast([1, 2, 3, 4], function(n) {
     *   return n % 2 == 1;
     * });
     * // => 3
     */
    function findLast(collection, predicate) {
      predicate = getIteratee(predicate, 3);
      if (isArray(collection)) {
        var index = baseFindIndex(collection, predicate, true);
        return index > -1 ? collection[index] : undefined;
      }
      return baseFind(collection, predicate, baseEachRight);
    }

    /**
     * Creates an array of flattened values by running each element in `collection`
     * through `iteratee` and concating its result to the other mapped values.
     * The iteratee is invoked with three arguments: (value, index|key, collection).
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * function duplicate(n) {
     *   return [n, n];
     * }
     *
     * _.flatMap([1, 2], duplicate);
     * // => [1, 1, 2, 2]
     */
    function flatMap(collection, iteratee) {
      return baseFlatten(map(collection, iteratee), 1);
    }

    /**
     * Iterates over elements of `collection` invoking `iteratee` for each element.
     * The iteratee is invoked with three arguments: (value, index|key, collection).
     * Iteratee functions may exit iteration early by explicitly returning `false`.
     *
     * **Note:** As with other "Collections" methods, objects with a "length" property
     * are iterated like arrays. To avoid this behavior use `_.forIn` or `_.forOwn`
     * for object iteration.
     *
     * @static
     * @memberOf _
     * @alias each
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array|Object} Returns `collection`.
     * @example
     *
     * _([1, 2]).forEach(function(value) {
     *   console.log(value);
     * });
     * // => logs `1` then `2`
     *
     * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
     *   console.log(key);
     * });
     * // => logs 'a' then 'b' (iteration order is not guaranteed)
     */
    function forEach(collection, iteratee) {
      return (typeof iteratee == 'function' && isArray(collection))
        ? arrayEach(collection, iteratee)
        : baseEach(collection, baseCastFunction(iteratee));
    }

    /**
     * This method is like `_.forEach` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @alias eachRight
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array|Object} Returns `collection`.
     * @example
     *
     * _.forEachRight([1, 2], function(value) {
     *   console.log(value);
     * });
     * // => logs `2` then `1`
     */
    function forEachRight(collection, iteratee) {
      return (typeof iteratee == 'function' && isArray(collection))
        ? arrayEachRight(collection, iteratee)
        : baseEachRight(collection, baseCastFunction(iteratee));
    }

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` through `iteratee`. The corresponding value
     * of each key is an array of elements responsible for generating the key.
     * The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The iteratee to transform keys.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * _.groupBy([6.1, 4.2, 6.3], Math.floor);
     * // => { '4': [4.2], '6': [6.1, 6.3] }
     *
     * // The `_.property` iteratee shorthand.
     * _.groupBy(['one', 'two', 'three'], 'length');
     * // => { '3': ['one', 'two'], '5': ['three'] }
     */
    var groupBy = createAggregator(function(result, value, key) {
      if (hasOwnProperty.call(result, key)) {
        result[key].push(value);
      } else {
        result[key] = [value];
      }
    });

    /**
     * Checks if `value` is in `collection`. If `collection` is a string it's checked
     * for a substring of `value`, otherwise [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * is used for equality comparisons. If `fromIndex` is negative, it's used as
     * the offset from the end of `collection`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to search.
     * @param {*} value The value to search for.
     * @param {number} [fromIndex=0] The index to search from.
     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.reduce`.
     * @returns {boolean} Returns `true` if `value` is found, else `false`.
     * @example
     *
     * _.includes([1, 2, 3], 1);
     * // => true
     *
     * _.includes([1, 2, 3], 1, 2);
     * // => false
     *
     * _.includes({ 'user': 'fred', 'age': 40 }, 'fred');
     * // => true
     *
     * _.includes('pebbles', 'eb');
     * // => true
     */
    function includes(collection, value, fromIndex, guard) {
      collection = isArrayLike(collection) ? collection : values(collection);
      fromIndex = (fromIndex && !guard) ? toInteger(fromIndex) : 0;

      var length = collection.length;
      if (fromIndex < 0) {
        fromIndex = nativeMax(length + fromIndex, 0);
      }
      return isString(collection)
        ? (fromIndex <= length && collection.indexOf(value, fromIndex) > -1)
        : (!!length && baseIndexOf(collection, value, fromIndex) > -1);
    }

    /**
     * Invokes the method at `path` of each element in `collection`, returning
     * an array of the results of each invoked method. Any additional arguments
     * are provided to each invoked method. If `methodName` is a function it's
     * invoked for, and `this` bound to, each element in `collection`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Array|Function|string} path The path of the method to invoke or
     *  the function invoked per iteration.
     * @param {...*} [args] The arguments to invoke each method with.
     * @returns {Array} Returns the array of results.
     * @example
     *
     * _.invokeMap([[5, 1, 7], [3, 2, 1]], 'sort');
     * // => [[1, 5, 7], [1, 2, 3]]
     *
     * _.invokeMap([123, 456], String.prototype.split, '');
     * // => [['1', '2', '3'], ['4', '5', '6']]
     */
    var invokeMap = rest(function(collection, path, args) {
      var index = -1,
          isFunc = typeof path == 'function',
          isProp = isKey(path),
          result = isArrayLike(collection) ? Array(collection.length) : [];

      baseEach(collection, function(value) {
        var func = isFunc ? path : ((isProp && value != null) ? value[path] : undefined);
        result[++index] = func ? apply(func, value, args) : baseInvoke(value, path, args);
      });
      return result;
    });

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` through `iteratee`. The corresponding value
     * of each key is the last element responsible for generating the key. The
     * iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The iteratee to transform keys.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * var array = [
     *   { 'dir': 'left', 'code': 97 },
     *   { 'dir': 'right', 'code': 100 }
     * ];
     *
     * _.keyBy(array, function(o) {
     *   return String.fromCharCode(o.code);
     * });
     * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
     *
     * _.keyBy(array, 'dir');
     * // => { 'left': { 'dir': 'left', 'code': 97 }, 'right': { 'dir': 'right', 'code': 100 } }
     */
    var keyBy = createAggregator(function(result, value, key) {
      result[key] = value;
    });

    /**
     * Creates an array of values by running each element in `collection` through
     * `iteratee`. The iteratee is invoked with three arguments:
     * (value, index|key, collection).
     *
     * Many lodash methods are guarded to work as iteratees for methods like
     * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
     *
     * The guarded methods are:
     * `ary`, `curry`, `curryRight`, `drop`, `dropRight`, `every`, `fill`,
     * `invert`, `parseInt`, `random`, `range`, `rangeRight`, `slice`, `some`,
     * `sortBy`, `take`, `takeRight`, `template`, `trim`, `trimEnd`, `trimStart`,
     * and `words`
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the new mapped array.
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * _.map([4, 8], square);
     * // => [16, 64]
     *
     * _.map({ 'a': 4, 'b': 8 }, square);
     * // => [16, 64] (iteration order is not guaranteed)
     *
     * var users = [
     *   { 'user': 'barney' },
     *   { 'user': 'fred' }
     * ];
     *
     * // The `_.property` iteratee shorthand.
     * _.map(users, 'user');
     * // => ['barney', 'fred']
     */
    function map(collection, iteratee) {
      var func = isArray(collection) ? arrayMap : baseMap;
      return func(collection, getIteratee(iteratee, 3));
    }

    /**
     * This method is like `_.sortBy` except that it allows specifying the sort
     * orders of the iteratees to sort by. If `orders` is unspecified, all values
     * are sorted in ascending order. Otherwise, specify an order of "desc" for
     * descending or "asc" for ascending sort order of corresponding values.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function[]|Object[]|string[]} [iteratees=[_.identity]] The iteratees to sort by.
     * @param {string[]} [orders] The sort orders of `iteratees`.
     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.reduce`.
     * @returns {Array} Returns the new sorted array.
     * @example
     *
     * var users = [
     *   { 'user': 'fred',   'age': 48 },
     *   { 'user': 'barney', 'age': 34 },
     *   { 'user': 'fred',   'age': 42 },
     *   { 'user': 'barney', 'age': 36 }
     * ];
     *
     * // Sort by `user` in ascending order and by `age` in descending order.
     * _.orderBy(users, ['user', 'age'], ['asc', 'desc']);
     * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 42]]
     */
    function orderBy(collection, iteratees, orders, guard) {
      if (collection == null) {
        return [];
      }
      if (!isArray(iteratees)) {
        iteratees = iteratees == null ? [] : [iteratees];
      }
      orders = guard ? undefined : orders;
      if (!isArray(orders)) {
        orders = orders == null ? [] : [orders];
      }
      return baseOrderBy(collection, iteratees, orders);
    }

    /**
     * Creates an array of elements split into two groups, the first of which
     * contains elements `predicate` returns truthy for, the second of which
     * contains elements `predicate` returns falsey for. The predicate is
     * invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the array of grouped elements.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36, 'active': false },
     *   { 'user': 'fred',    'age': 40, 'active': true },
     *   { 'user': 'pebbles', 'age': 1,  'active': false }
     * ];
     *
     * _.partition(users, function(o) { return o.active; });
     * // => objects for [['fred'], ['barney', 'pebbles']]
     *
     * // The `_.matches` iteratee shorthand.
     * _.partition(users, { 'age': 1, 'active': false });
     * // => objects for [['pebbles'], ['barney', 'fred']]
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.partition(users, ['active', false]);
     * // => objects for [['barney', 'pebbles'], ['fred']]
     *
     * // The `_.property` iteratee shorthand.
     * _.partition(users, 'active');
     * // => objects for [['fred'], ['barney', 'pebbles']]
     */
    var partition = createAggregator(function(result, value, key) {
      result[key ? 0 : 1].push(value);
    }, function() { return [[], []]; });

    /**
     * Reduces `collection` to a value which is the accumulated result of running
     * each element in `collection` through `iteratee`, where each successive
     * invocation is supplied the return value of the previous. If `accumulator`
     * is not given the first element of `collection` is used as the initial
     * value. The iteratee is invoked with four arguments:
     * (accumulator, value, index|key, collection).
     *
     * Many lodash methods are guarded to work as iteratees for methods like
     * `_.reduce`, `_.reduceRight`, and `_.transform`.
     *
     * The guarded methods are:
     * `assign`, `defaults`, `defaultsDeep`, `includes`, `merge`, `orderBy`,
     * and `sortBy`
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * _.reduce([1, 2], function(sum, n) {
     *   return sum + n;
     * }, 0);
     * // => 3
     *
     * _.reduce({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
     *   (result[value] || (result[value] = [])).push(key);
     *   return result;
     * }, {});
     * // => { '1': ['a', 'c'], '2': ['b'] } (iteration order is not guaranteed)
     */
    function reduce(collection, iteratee, accumulator) {
      var func = isArray(collection) ? arrayReduce : baseReduce,
          initAccum = arguments.length < 3;

      return func(collection, getIteratee(iteratee, 4), accumulator, initAccum, baseEach);
    }

    /**
     * This method is like `_.reduce` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * var array = [[0, 1], [2, 3], [4, 5]];
     *
     * _.reduceRight(array, function(flattened, other) {
     *   return flattened.concat(other);
     * }, []);
     * // => [4, 5, 2, 3, 0, 1]
     */
    function reduceRight(collection, iteratee, accumulator) {
      var func = isArray(collection) ? arrayReduceRight : baseReduce,
          initAccum = arguments.length < 3;

      return func(collection, getIteratee(iteratee, 4), accumulator, initAccum, baseEachRight);
    }

    /**
     * The opposite of `_.filter`; this method returns the elements of `collection`
     * that `predicate` does **not** return truthy for.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': false },
     *   { 'user': 'fred',   'age': 40, 'active': true }
     * ];
     *
     * _.reject(users, function(o) { return !o.active; });
     * // => objects for ['fred']
     *
     * // The `_.matches` iteratee shorthand.
     * _.reject(users, { 'age': 40, 'active': true });
     * // => objects for ['barney']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.reject(users, ['active', false]);
     * // => objects for ['fred']
     *
     * // The `_.property` iteratee shorthand.
     * _.reject(users, 'active');
     * // => objects for ['barney']
     */
    function reject(collection, predicate) {
      var func = isArray(collection) ? arrayFilter : baseFilter;
      predicate = getIteratee(predicate, 3);
      return func(collection, function(value, index, collection) {
        return !predicate(value, index, collection);
      });
    }

    /**
     * Gets a random element from `collection`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object} collection The collection to sample.
     * @returns {*} Returns the random element.
     * @example
     *
     * _.sample([1, 2, 3, 4]);
     * // => 2
     */
    function sample(collection) {
      var array = isArrayLike(collection) ? collection : values(collection),
          length = array.length;

      return length > 0 ? array[baseRandom(0, length - 1)] : undefined;
    }

    /**
     * Gets `n` random elements at unique keys from `collection` up to the
     * size of `collection`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object} collection The collection to sample.
     * @param {number} [n=0] The number of elements to sample.
     * @returns {Array} Returns the random elements.
     * @example
     *
     * _.sampleSize([1, 2, 3], 2);
     * // => [3, 1]
     *
     * _.sampleSize([1, 2, 3], 4);
     * // => [2, 3, 1]
     */
    function sampleSize(collection, n) {
      var index = -1,
          result = toArray(collection),
          length = result.length,
          lastIndex = length - 1;

      n = baseClamp(toInteger(n), 0, length);
      while (++index < n) {
        var rand = baseRandom(index, lastIndex),
            value = result[rand];

        result[rand] = result[index];
        result[index] = value;
      }
      result.length = n;
      return result;
    }

    /**
     * Creates an array of shuffled values, using a version of the
     * [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher-Yates_shuffle).
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object} collection The collection to shuffle.
     * @returns {Array} Returns the new shuffled array.
     * @example
     *
     * _.shuffle([1, 2, 3, 4]);
     * // => [4, 1, 3, 2]
     */
    function shuffle(collection) {
      return sampleSize(collection, MAX_ARRAY_LENGTH);
    }

    /**
     * Gets the size of `collection` by returning its length for array-like
     * values or the number of own enumerable properties for objects.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object} collection The collection to inspect.
     * @returns {number} Returns the collection size.
     * @example
     *
     * _.size([1, 2, 3]);
     * // => 3
     *
     * _.size({ 'a': 1, 'b': 2 });
     * // => 2
     *
     * _.size('pebbles');
     * // => 7
     */
    function size(collection) {
      if (collection == null) {
        return 0;
      }
      if (isArrayLike(collection)) {
        var result = collection.length;
        return (result && isString(collection)) ? stringSize(collection) : result;
      }
      return keys(collection).length;
    }

    /**
     * Checks if `predicate` returns truthy for **any** element of `collection`.
     * Iteration is stopped once `predicate` returns truthy. The predicate is
     * invoked with three arguments: (value, index|key, collection).
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked per iteration.
     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
     * @returns {boolean} Returns `true` if any element passes the predicate check, else `false`.
     * @example
     *
     * _.some([null, 0, 'yes', false], Boolean);
     * // => true
     *
     * var users = [
     *   { 'user': 'barney', 'active': true },
     *   { 'user': 'fred',   'active': false }
     * ];
     *
     * // The `_.matches` iteratee shorthand.
     * _.some(users, { 'user': 'barney', 'active': false });
     * // => false
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.some(users, ['active', false]);
     * // => true
     *
     * // The `_.property` iteratee shorthand.
     * _.some(users, 'active');
     * // => true
     */
    function some(collection, predicate, guard) {
      var func = isArray(collection) ? arraySome : baseSome;
      if (guard && isIterateeCall(collection, predicate, guard)) {
        predicate = undefined;
      }
      return func(collection, getIteratee(predicate, 3));
    }

    /**
     * Creates an array of elements, sorted in ascending order by the results of
     * running each element in a collection through each iteratee. This method
     * performs a stable sort, that is, it preserves the original sort order of
     * equal elements. The iteratees are invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {...(Function|Function[]|Object|Object[]|string|string[])} [iteratees=[_.identity]]
     *  The iteratees to sort by, specified individually or in arrays.
     * @returns {Array} Returns the new sorted array.
     * @example
     *
     * var users = [
     *   { 'user': 'fred',   'age': 48 },
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 42 },
     *   { 'user': 'barney', 'age': 34 }
     * ];
     *
     * _.sortBy(users, function(o) { return o.user; });
     * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 42]]
     *
     * _.sortBy(users, ['user', 'age']);
     * // => objects for [['barney', 34], ['barney', 36], ['fred', 42], ['fred', 48]]
     *
     * _.sortBy(users, 'user', function(o) {
     *   return Math.floor(o.age / 10);
     * });
     * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 42]]
     */
    var sortBy = rest(function(collection, iteratees) {
      if (collection == null) {
        return [];
      }
      var length = iteratees.length;
      if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) {
        iteratees = [];
      } else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
        iteratees.length = 1;
      }
      return baseOrderBy(collection, baseFlatten(iteratees, 1), []);
    });

    /*------------------------------------------------------------------------*/

    /**
     * Gets the timestamp of the number of milliseconds that have elapsed since
     * the Unix epoch (1 January 1970 00:00:00 UTC).
     *
     * @static
     * @memberOf _
     * @type {Function}
     * @category Date
     * @returns {number} Returns the timestamp.
     * @example
     *
     * _.defer(function(stamp) {
     *   console.log(_.now() - stamp);
     * }, _.now());
     * // => logs the number of milliseconds it took for the deferred function to be invoked
     */
    var now = Date.now;

    /*------------------------------------------------------------------------*/

    /**
     * The opposite of `_.before`; this method creates a function that invokes
     * `func` once it's called `n` or more times.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {number} n The number of calls before `func` is invoked.
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * var saves = ['profile', 'settings'];
     *
     * var done = _.after(saves.length, function() {
     *   console.log('done saving!');
     * });
     *
     * _.forEach(saves, function(type) {
     *   asyncSave({ 'type': type, 'complete': done });
     * });
     * // => logs 'done saving!' after the two async saves have completed
     */
    function after(n, func) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      n = toInteger(n);
      return function() {
        if (--n < 1) {
          return func.apply(this, arguments);
        }
      };
    }

    /**
     * Creates a function that accepts up to `n` arguments, ignoring any
     * additional arguments.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to cap arguments for.
     * @param {number} [n=func.length] The arity cap.
     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
     * @returns {Function} Returns the new function.
     * @example
     *
     * _.map(['6', '8', '10'], _.ary(parseInt, 1));
     * // => [6, 8, 10]
     */
    function ary(func, n, guard) {
      n = guard ? undefined : n;
      n = (func && n == null) ? func.length : n;
      return createWrapper(func, ARY_FLAG, undefined, undefined, undefined, undefined, n);
    }

    /**
     * Creates a function that invokes `func`, with the `this` binding and arguments
     * of the created function, while it's called less than `n` times. Subsequent
     * calls to the created function return the result of the last `func` invocation.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {number} n The number of calls at which `func` is no longer invoked.
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * jQuery(element).on('click', _.before(5, addContactToList));
     * // => allows adding up to 4 contacts to the list
     */
    function before(n, func) {
      var result;
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      n = toInteger(n);
      return function() {
        if (--n > 0) {
          result = func.apply(this, arguments);
        }
        if (n <= 1) {
          func = undefined;
        }
        return result;
      };
    }

    /**
     * Creates a function that invokes `func` with the `this` binding of `thisArg`
     * and prepends any additional `_.bind` arguments to those provided to the
     * bound function.
     *
     * The `_.bind.placeholder` value, which defaults to `_` in monolithic builds,
     * may be used as a placeholder for partially applied arguments.
     *
     * **Note:** Unlike native `Function#bind` this method doesn't set the "length"
     * property of bound functions.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to bind.
     * @param {*} thisArg The `this` binding of `func`.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new bound function.
     * @example
     *
     * var greet = function(greeting, punctuation) {
     *   return greeting + ' ' + this.user + punctuation;
     * };
     *
     * var object = { 'user': 'fred' };
     *
     * var bound = _.bind(greet, object, 'hi');
     * bound('!');
     * // => 'hi fred!'
     *
     * // Bound with placeholders.
     * var bound = _.bind(greet, object, _, '!');
     * bound('hi');
     * // => 'hi fred!'
     */
    var bind = rest(function(func, thisArg, partials) {
      var bitmask = BIND_FLAG;
      if (partials.length) {
        var holders = replaceHolders(partials, getPlaceholder(bind));
        bitmask |= PARTIAL_FLAG;
      }
      return createWrapper(func, bitmask, thisArg, partials, holders);
    });

    /**
     * Creates a function that invokes the method at `object[key]` and prepends
     * any additional `_.bindKey` arguments to those provided to the bound function.
     *
     * This method differs from `_.bind` by allowing bound functions to reference
     * methods that may be redefined or don't yet exist.
     * See [Peter Michaux's article](http://peter.michaux.ca/articles/lazy-function-definition-pattern)
     * for more details.
     *
     * The `_.bindKey.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for partially applied arguments.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Object} object The object to invoke the method on.
     * @param {string} key The key of the method.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new bound function.
     * @example
     *
     * var object = {
     *   'user': 'fred',
     *   'greet': function(greeting, punctuation) {
     *     return greeting + ' ' + this.user + punctuation;
     *   }
     * };
     *
     * var bound = _.bindKey(object, 'greet', 'hi');
     * bound('!');
     * // => 'hi fred!'
     *
     * object.greet = function(greeting, punctuation) {
     *   return greeting + 'ya ' + this.user + punctuation;
     * };
     *
     * bound('!');
     * // => 'hiya fred!'
     *
     * // Bound with placeholders.
     * var bound = _.bindKey(object, 'greet', _, '!');
     * bound('hi');
     * // => 'hiya fred!'
     */
    var bindKey = rest(function(object, key, partials) {
      var bitmask = BIND_FLAG | BIND_KEY_FLAG;
      if (partials.length) {
        var holders = replaceHolders(partials, getPlaceholder(bindKey));
        bitmask |= PARTIAL_FLAG;
      }
      return createWrapper(key, bitmask, object, partials, holders);
    });

    /**
     * Creates a function that accepts arguments of `func` and either invokes
     * `func` returning its result, if at least `arity` number of arguments have
     * been provided, or returns a function that accepts the remaining `func`
     * arguments, and so on. The arity of `func` may be specified if `func.length`
     * is not sufficient.
     *
     * The `_.curry.placeholder` value, which defaults to `_` in monolithic builds,
     * may be used as a placeholder for provided arguments.
     *
     * **Note:** This method doesn't set the "length" property of curried functions.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to curry.
     * @param {number} [arity=func.length] The arity of `func`.
     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
     * @returns {Function} Returns the new curried function.
     * @example
     *
     * var abc = function(a, b, c) {
     *   return [a, b, c];
     * };
     *
     * var curried = _.curry(abc);
     *
     * curried(1)(2)(3);
     * // => [1, 2, 3]
     *
     * curried(1, 2)(3);
     * // => [1, 2, 3]
     *
     * curried(1, 2, 3);
     * // => [1, 2, 3]
     *
     * // Curried with placeholders.
     * curried(1)(_, 3)(2);
     * // => [1, 2, 3]
     */
    function curry(func, arity, guard) {
      arity = guard ? undefined : arity;
      var result = createWrapper(func, CURRY_FLAG, undefined, undefined, undefined, undefined, undefined, arity);
      result.placeholder = curry.placeholder;
      return result;
    }

    /**
     * This method is like `_.curry` except that arguments are applied to `func`
     * in the manner of `_.partialRight` instead of `_.partial`.
     *
     * The `_.curryRight.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for provided arguments.
     *
     * **Note:** This method doesn't set the "length" property of curried functions.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to curry.
     * @param {number} [arity=func.length] The arity of `func`.
     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
     * @returns {Function} Returns the new curried function.
     * @example
     *
     * var abc = function(a, b, c) {
     *   return [a, b, c];
     * };
     *
     * var curried = _.curryRight(abc);
     *
     * curried(3)(2)(1);
     * // => [1, 2, 3]
     *
     * curried(2, 3)(1);
     * // => [1, 2, 3]
     *
     * curried(1, 2, 3);
     * // => [1, 2, 3]
     *
     * // Curried with placeholders.
     * curried(3)(1, _)(2);
     * // => [1, 2, 3]
     */
    function curryRight(func, arity, guard) {
      arity = guard ? undefined : arity;
      var result = createWrapper(func, CURRY_RIGHT_FLAG, undefined, undefined, undefined, undefined, undefined, arity);
      result.placeholder = curryRight.placeholder;
      return result;
    }

    /**
     * Creates a debounced function that delays invoking `func` until after `wait`
     * milliseconds have elapsed since the last time the debounced function was
     * invoked. The debounced function comes with a `cancel` method to cancel
     * delayed `func` invocations and a `flush` method to immediately invoke them.
     * Provide an options object to indicate whether `func` should be invoked on
     * the leading and/or trailing edge of the `wait` timeout. The `func` is invoked
     * with the last arguments provided to the debounced function. Subsequent calls
     * to the debounced function return the result of the last `func` invocation.
     *
     * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
     * on the trailing edge of the timeout only if the debounced function is
     * invoked more than once during the `wait` timeout.
     *
     * See [David Corbacho's article](http://drupalmotion.com/article/debounce-and-throttle-visual-explanation)
     * for details over the differences between `_.debounce` and `_.throttle`.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to debounce.
     * @param {number} [wait=0] The number of milliseconds to delay.
     * @param {Object} [options] The options object.
     * @param {boolean} [options.leading=false] Specify invoking on the leading
     *  edge of the timeout.
     * @param {number} [options.maxWait] The maximum time `func` is allowed to be
     *  delayed before it's invoked.
     * @param {boolean} [options.trailing=true] Specify invoking on the trailing
     *  edge of the timeout.
     * @returns {Function} Returns the new debounced function.
     * @example
     *
     * // Avoid costly calculations while the window size is in flux.
     * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
     *
     * // Invoke `sendMail` when clicked, debouncing subsequent calls.
     * jQuery(element).on('click', _.debounce(sendMail, 300, {
     *   'leading': true,
     *   'trailing': false
     * }));
     *
     * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
     * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
     * var source = new EventSource('/stream');
     * jQuery(source).on('message', debounced);
     *
     * // Cancel the trailing debounced invocation.
     * jQuery(window).on('popstate', debounced.cancel);
     */
    function debounce(func, wait, options) {
      var args,
          maxTimeoutId,
          result,
          stamp,
          thisArg,
          timeoutId,
          trailingCall,
          lastCalled = 0,
          leading = false,
          maxWait = false,
          trailing = true;

      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      wait = toNumber(wait) || 0;
      if (isObject(options)) {
        leading = !!options.leading;
        maxWait = 'maxWait' in options && nativeMax(toNumber(options.maxWait) || 0, wait);
        trailing = 'trailing' in options ? !!options.trailing : trailing;
      }

      function cancel() {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        if (maxTimeoutId) {
          clearTimeout(maxTimeoutId);
        }
        lastCalled = 0;
        args = maxTimeoutId = thisArg = timeoutId = trailingCall = undefined;
      }

      function complete(isCalled, id) {
        if (id) {
          clearTimeout(id);
        }
        maxTimeoutId = timeoutId = trailingCall = undefined;
        if (isCalled) {
          lastCalled = now();
          result = func.apply(thisArg, args);
          if (!timeoutId && !maxTimeoutId) {
            args = thisArg = undefined;
          }
        }
      }

      function delayed() {
        var remaining = wait - (now() - stamp);
        if (remaining <= 0 || remaining > wait) {
          complete(trailingCall, maxTimeoutId);
        } else {
          timeoutId = setTimeout(delayed, remaining);
        }
      }

      function flush() {
        if ((timeoutId && trailingCall) || (maxTimeoutId && trailing)) {
          result = func.apply(thisArg, args);
        }
        cancel();
        return result;
      }

      function maxDelayed() {
        complete(trailing, timeoutId);
      }

      function debounced() {
        args = arguments;
        stamp = now();
        thisArg = this;
        trailingCall = trailing && (timeoutId || !leading);

        if (maxWait === false) {
          var leadingCall = leading && !timeoutId;
        } else {
          if (!lastCalled && !maxTimeoutId && !leading) {
            lastCalled = stamp;
          }
          var remaining = maxWait - (stamp - lastCalled);

          var isCalled = (remaining <= 0 || remaining > maxWait) &&
            (leading || maxTimeoutId);

          if (isCalled) {
            if (maxTimeoutId) {
              maxTimeoutId = clearTimeout(maxTimeoutId);
            }
            lastCalled = stamp;
            result = func.apply(thisArg, args);
          }
          else if (!maxTimeoutId) {
            maxTimeoutId = setTimeout(maxDelayed, remaining);
          }
        }
        if (isCalled && timeoutId) {
          timeoutId = clearTimeout(timeoutId);
        }
        else if (!timeoutId && wait !== maxWait) {
          timeoutId = setTimeout(delayed, wait);
        }
        if (leadingCall) {
          isCalled = true;
          result = func.apply(thisArg, args);
        }
        if (isCalled && !timeoutId && !maxTimeoutId) {
          args = thisArg = undefined;
        }
        return result;
      }
      debounced.cancel = cancel;
      debounced.flush = flush;
      return debounced;
    }

    /**
     * Defers invoking the `func` until the current call stack has cleared. Any
     * additional arguments are provided to `func` when it's invoked.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to defer.
     * @param {...*} [args] The arguments to invoke `func` with.
     * @returns {number} Returns the timer id.
     * @example
     *
     * _.defer(function(text) {
     *   console.log(text);
     * }, 'deferred');
     * // => logs 'deferred' after one or more milliseconds
     */
    var defer = rest(function(func, args) {
      return baseDelay(func, 1, args);
    });

    /**
     * Invokes `func` after `wait` milliseconds. Any additional arguments are
     * provided to `func` when it's invoked.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to delay.
     * @param {number} wait The number of milliseconds to delay invocation.
     * @param {...*} [args] The arguments to invoke `func` with.
     * @returns {number} Returns the timer id.
     * @example
     *
     * _.delay(function(text) {
     *   console.log(text);
     * }, 1000, 'later');
     * // => logs 'later' after one second
     */
    var delay = rest(function(func, wait, args) {
      return baseDelay(func, toNumber(wait) || 0, args);
    });

    /**
     * Creates a function that invokes `func` with arguments reversed.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to flip arguments for.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var flipped = _.flip(function() {
     *   return _.toArray(arguments);
     * });
     *
     * flipped('a', 'b', 'c', 'd');
     * // => ['d', 'c', 'b', 'a']
     */
    function flip(func) {
      return createWrapper(func, FLIP_FLAG);
    }

    /**
     * Creates a function that memoizes the result of `func`. If `resolver` is
     * provided it determines the cache key for storing the result based on the
     * arguments provided to the memoized function. By default, the first argument
     * provided to the memoized function is used as the map cache key. The `func`
     * is invoked with the `this` binding of the memoized function.
     *
     * **Note:** The cache is exposed as the `cache` property on the memoized
     * function. Its creation may be customized by replacing the `_.memoize.Cache`
     * constructor with one whose instances implement the [`Map`](http://ecma-international.org/ecma-262/6.0/#sec-properties-of-the-map-prototype-object)
     * method interface of `delete`, `get`, `has`, and `set`.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to have its output memoized.
     * @param {Function} [resolver] The function to resolve the cache key.
     * @returns {Function} Returns the new memoizing function.
     * @example
     *
     * var object = { 'a': 1, 'b': 2 };
     * var other = { 'c': 3, 'd': 4 };
     *
     * var values = _.memoize(_.values);
     * values(object);
     * // => [1, 2]
     *
     * values(other);
     * // => [3, 4]
     *
     * object.a = 2;
     * values(object);
     * // => [1, 2]
     *
     * // Modify the result cache.
     * values.cache.set(object, ['a', 'b']);
     * values(object);
     * // => ['a', 'b']
     *
     * // Replace `_.memoize.Cache`.
     * _.memoize.Cache = WeakMap;
     */
    function memoize(func, resolver) {
      if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      var memoized = function() {
        var args = arguments,
            key = resolver ? resolver.apply(this, args) : args[0],
            cache = memoized.cache;

        if (cache.has(key)) {
          return cache.get(key);
        }
        var result = func.apply(this, args);
        memoized.cache = cache.set(key, result);
        return result;
      };
      memoized.cache = new memoize.Cache;
      return memoized;
    }

    /**
     * Creates a function that negates the result of the predicate `func`. The
     * `func` predicate is invoked with the `this` binding and arguments of the
     * created function.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} predicate The predicate to negate.
     * @returns {Function} Returns the new function.
     * @example
     *
     * function isEven(n) {
     *   return n % 2 == 0;
     * }
     *
     * _.filter([1, 2, 3, 4, 5, 6], _.negate(isEven));
     * // => [1, 3, 5]
     */
    function negate(predicate) {
      if (typeof predicate != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      return function() {
        return !predicate.apply(this, arguments);
      };
    }

    /**
     * Creates a function that is restricted to invoking `func` once. Repeat calls
     * to the function return the value of the first invocation. The `func` is
     * invoked with the `this` binding and arguments of the created function.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * var initialize = _.once(createApplication);
     * initialize();
     * initialize();
     * // `initialize` invokes `createApplication` once
     */
    function once(func) {
      return before(2, func);
    }

    /**
     * Creates a function that invokes `func` with arguments transformed by
     * corresponding `transforms`.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to wrap.
     * @param {...(Function|Function[])} [transforms] The functions to transform
     * arguments, specified individually or in arrays.
     * @returns {Function} Returns the new function.
     * @example
     *
     * function doubled(n) {
     *   return n * 2;
     * }
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var func = _.overArgs(function(x, y) {
     *   return [x, y];
     * }, square, doubled);
     *
     * func(9, 3);
     * // => [81, 6]
     *
     * func(10, 5);
     * // => [100, 10]
     */
    var overArgs = rest(function(func, transforms) {
      transforms = arrayMap(baseFlatten(transforms, 1), getIteratee());

      var funcsLength = transforms.length;
      return rest(function(args) {
        var index = -1,
            length = nativeMin(args.length, funcsLength);

        while (++index < length) {
          args[index] = transforms[index].call(this, args[index]);
        }
        return apply(func, this, args);
      });
    });

    /**
     * Creates a function that invokes `func` with `partial` arguments prepended
     * to those provided to the new function. This method is like `_.bind` except
     * it does **not** alter the `this` binding.
     *
     * The `_.partial.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for partially applied arguments.
     *
     * **Note:** This method doesn't set the "length" property of partially
     * applied functions.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to partially apply arguments to.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new partially applied function.
     * @example
     *
     * var greet = function(greeting, name) {
     *   return greeting + ' ' + name;
     * };
     *
     * var sayHelloTo = _.partial(greet, 'hello');
     * sayHelloTo('fred');
     * // => 'hello fred'
     *
     * // Partially applied with placeholders.
     * var greetFred = _.partial(greet, _, 'fred');
     * greetFred('hi');
     * // => 'hi fred'
     */
    var partial = rest(function(func, partials) {
      var holders = replaceHolders(partials, getPlaceholder(partial));
      return createWrapper(func, PARTIAL_FLAG, undefined, partials, holders);
    });

    /**
     * This method is like `_.partial` except that partially applied arguments
     * are appended to those provided to the new function.
     *
     * The `_.partialRight.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for partially applied arguments.
     *
     * **Note:** This method doesn't set the "length" property of partially
     * applied functions.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to partially apply arguments to.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new partially applied function.
     * @example
     *
     * var greet = function(greeting, name) {
     *   return greeting + ' ' + name;
     * };
     *
     * var greetFred = _.partialRight(greet, 'fred');
     * greetFred('hi');
     * // => 'hi fred'
     *
     * // Partially applied with placeholders.
     * var sayHelloTo = _.partialRight(greet, 'hello', _);
     * sayHelloTo('fred');
     * // => 'hello fred'
     */
    var partialRight = rest(function(func, partials) {
      var holders = replaceHolders(partials, getPlaceholder(partialRight));
      return createWrapper(func, PARTIAL_RIGHT_FLAG, undefined, partials, holders);
    });

    /**
     * Creates a function that invokes `func` with arguments arranged according
     * to the specified indexes where the argument value at the first index is
     * provided as the first argument, the argument value at the second index is
     * provided as the second argument, and so on.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to rearrange arguments for.
     * @param {...(number|number[])} indexes The arranged argument indexes,
     *  specified individually or in arrays.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var rearged = _.rearg(function(a, b, c) {
     *   return [a, b, c];
     * }, 2, 0, 1);
     *
     * rearged('b', 'c', 'a')
     * // => ['a', 'b', 'c']
     */
    var rearg = rest(function(func, indexes) {
      return createWrapper(func, REARG_FLAG, undefined, undefined, undefined, baseFlatten(indexes, 1));
    });

    /**
     * Creates a function that invokes `func` with the `this` binding of the
     * created function and arguments from `start` and beyond provided as an array.
     *
     * **Note:** This method is based on the [rest parameter](https://mdn.io/rest_parameters).
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to apply a rest parameter to.
     * @param {number} [start=func.length-1] The start position of the rest parameter.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var say = _.rest(function(what, names) {
     *   return what + ' ' + _.initial(names).join(', ') +
     *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
     * });
     *
     * say('hello', 'fred', 'barney', 'pebbles');
     * // => 'hello fred, barney, & pebbles'
     */
    function rest(func, start) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      start = nativeMax(start === undefined ? (func.length - 1) : toInteger(start), 0);
      return function() {
        var args = arguments,
            index = -1,
            length = nativeMax(args.length - start, 0),
            array = Array(length);

        while (++index < length) {
          array[index] = args[start + index];
        }
        switch (start) {
          case 0: return func.call(this, array);
          case 1: return func.call(this, args[0], array);
          case 2: return func.call(this, args[0], args[1], array);
        }
        var otherArgs = Array(start + 1);
        index = -1;
        while (++index < start) {
          otherArgs[index] = args[index];
        }
        otherArgs[start] = array;
        return apply(func, this, otherArgs);
      };
    }

    /**
     * Creates a function that invokes `func` with the `this` binding of the created
     * function and an array of arguments much like [`Function#apply`](https://es5.github.io/#x15.3.4.3).
     *
     * **Note:** This method is based on the [spread operator](https://mdn.io/spread_operator).
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to spread arguments over.
     * @param {number} [start=0] The start position of the spread.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var say = _.spread(function(who, what) {
     *   return who + ' says ' + what;
     * });
     *
     * say(['fred', 'hello']);
     * // => 'fred says hello'
     *
     * var numbers = Promise.all([
     *   Promise.resolve(40),
     *   Promise.resolve(36)
     * ]);
     *
     * numbers.then(_.spread(function(x, y) {
     *   return x + y;
     * }));
     * // => a Promise of 76
     */
    function spread(func, start) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      start = start === undefined ? 0 : nativeMax(toInteger(start), 0);
      return rest(function(args) {
        var array = args[start],
            otherArgs = args.slice(0, start);

        if (array) {
          arrayPush(otherArgs, array);
        }
        return apply(func, this, otherArgs);
      });
    }

    /**
     * Creates a throttled function that only invokes `func` at most once per
     * every `wait` milliseconds. The throttled function comes with a `cancel`
     * method to cancel delayed `func` invocations and a `flush` method to
     * immediately invoke them. Provide an options object to indicate whether
     * `func` should be invoked on the leading and/or trailing edge of the `wait`
     * timeout. The `func` is invoked with the last arguments provided to the
     * throttled function. Subsequent calls to the throttled function return the
     * result of the last `func` invocation.
     *
     * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
     * on the trailing edge of the timeout only if the throttled function is
     * invoked more than once during the `wait` timeout.
     *
     * See [David Corbacho's article](http://drupalmotion.com/article/debounce-and-throttle-visual-explanation)
     * for details over the differences between `_.throttle` and `_.debounce`.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to throttle.
     * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
     * @param {Object} [options] The options object.
     * @param {boolean} [options.leading=true] Specify invoking on the leading
     *  edge of the timeout.
     * @param {boolean} [options.trailing=true] Specify invoking on the trailing
     *  edge of the timeout.
     * @returns {Function} Returns the new throttled function.
     * @example
     *
     * // Avoid excessively updating the position while scrolling.
     * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
     *
     * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
     * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
     * jQuery(element).on('click', throttled);
     *
     * // Cancel the trailing throttled invocation.
     * jQuery(window).on('popstate', throttled.cancel);
     */
    function throttle(func, wait, options) {
      var leading = true,
          trailing = true;

      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      if (isObject(options)) {
        leading = 'leading' in options ? !!options.leading : leading;
        trailing = 'trailing' in options ? !!options.trailing : trailing;
      }
      return debounce(func, wait, {
        'leading': leading,
        'maxWait': wait,
        'trailing': trailing
      });
    }

    /**
     * Creates a function that accepts up to one argument, ignoring any
     * additional arguments.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to cap arguments for.
     * @returns {Function} Returns the new function.
     * @example
     *
     * _.map(['6', '8', '10'], _.unary(parseInt));
     * // => [6, 8, 10]
     */
    function unary(func) {
      return ary(func, 1);
    }

    /**
     * Creates a function that provides `value` to the wrapper function as its
     * first argument. Any additional arguments provided to the function are
     * appended to those provided to the wrapper function. The wrapper is invoked
     * with the `this` binding of the created function.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {*} value The value to wrap.
     * @param {Function} [wrapper=identity] The wrapper function.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var p = _.wrap(_.escape, function(func, text) {
     *   return '<p>' + func(text) + '</p>';
     * });
     *
     * p('fred, barney, & pebbles');
     * // => '<p>fred, barney, &amp; pebbles</p>'
     */
    function wrap(value, wrapper) {
      wrapper = wrapper == null ? identity : wrapper;
      return partial(wrapper, value);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Casts `value` as an array if it's not one.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to inspect.
     * @returns {Array} Returns the cast array.
     * @example
     *
     * _.castArray(1);
     * // => [1]
     *
     * _.castArray({ 'a': 1 });
     * // => [{ 'a': 1 }]
     *
     * _.castArray('abc');
     * // => ['abc']
     *
     * _.castArray(null);
     * // => [null]
     *
     * _.castArray(undefined);
     * // => [undefined]
     *
     * _.castArray();
     * // => []
     *
     * var array = [1, 2, 3];
     * console.log(_.castArray(array) === array);
     * // => true
     */
    function castArray() {
      if (!arguments.length) {
        return [];
      }
      var value = arguments[0];
      return isArray(value) ? value : [value];
    }

    /**
     * Creates a shallow clone of `value`.
     *
     * **Note:** This method is loosely based on the
     * [structured clone algorithm](https://mdn.io/Structured_clone_algorithm)
     * and supports cloning arrays, array buffers, booleans, date objects, maps,
     * numbers, `Object` objects, regexes, sets, strings, symbols, and typed
     * arrays. The own enumerable properties of `arguments` objects are cloned
     * as plain objects. An empty object is returned for uncloneable values such
     * as error objects, functions, DOM nodes, and WeakMaps.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to clone.
     * @returns {*} Returns the cloned value.
     * @example
     *
     * var objects = [{ 'a': 1 }, { 'b': 2 }];
     *
     * var shallow = _.clone(objects);
     * console.log(shallow[0] === objects[0]);
     * // => true
     */
    function clone(value) {
      return baseClone(value, false, true);
    }

    /**
     * This method is like `_.clone` except that it accepts `customizer` which
     * is invoked to produce the cloned value. If `customizer` returns `undefined`
     * cloning is handled by the method instead. The `customizer` is invoked with
     * up to four arguments; (value [, index|key, object, stack]).
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to clone.
     * @param {Function} [customizer] The function to customize cloning.
     * @returns {*} Returns the cloned value.
     * @example
     *
     * function customizer(value) {
     *   if (_.isElement(value)) {
     *     return value.cloneNode(false);
     *   }
     * }
     *
     * var el = _.cloneWith(document.body, customizer);
     *
     * console.log(el === document.body);
     * // => false
     * console.log(el.nodeName);
     * // => 'BODY'
     * console.log(el.childNodes.length);
     * // => 0
     */
    function cloneWith(value, customizer) {
      return baseClone(value, false, true, customizer);
    }

    /**
     * This method is like `_.clone` except that it recursively clones `value`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to recursively clone.
     * @returns {*} Returns the deep cloned value.
     * @example
     *
     * var objects = [{ 'a': 1 }, { 'b': 2 }];
     *
     * var deep = _.cloneDeep(objects);
     * console.log(deep[0] === objects[0]);
     * // => false
     */
    function cloneDeep(value) {
      return baseClone(value, true, true);
    }

    /**
     * This method is like `_.cloneWith` except that it recursively clones `value`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to recursively clone.
     * @param {Function} [customizer] The function to customize cloning.
     * @returns {*} Returns the deep cloned value.
     * @example
     *
     * function customizer(value) {
     *   if (_.isElement(value)) {
     *     return value.cloneNode(true);
     *   }
     * }
     *
     * var el = _.cloneDeepWith(document.body, customizer);
     *
     * console.log(el === document.body);
     * // => false
     * console.log(el.nodeName);
     * // => 'BODY'
     * console.log(el.childNodes.length);
     * // => 20
     */
    function cloneDeepWith(value, customizer) {
      return baseClone(value, true, true, customizer);
    }

    /**
     * Performs a [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * comparison between two values to determine if they are equivalent.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'user': 'fred' };
     * var other = { 'user': 'fred' };
     *
     * _.eq(object, object);
     * // => true
     *
     * _.eq(object, other);
     * // => false
     *
     * _.eq('a', 'a');
     * // => true
     *
     * _.eq('a', Object('a'));
     * // => false
     *
     * _.eq(NaN, NaN);
     * // => true
     */
    function eq(value, other) {
      return value === other || (value !== value && other !== other);
    }

    /**
     * Checks if `value` is greater than `other`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is greater than `other`, else `false`.
     * @example
     *
     * _.gt(3, 1);
     * // => true
     *
     * _.gt(3, 3);
     * // => false
     *
     * _.gt(1, 3);
     * // => false
     */
    function gt(value, other) {
      return value > other;
    }

    /**
     * Checks if `value` is greater than or equal to `other`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is greater than or equal to `other`, else `false`.
     * @example
     *
     * _.gte(3, 1);
     * // => true
     *
     * _.gte(3, 3);
     * // => true
     *
     * _.gte(1, 3);
     * // => false
     */
    function gte(value, other) {
      return value >= other;
    }

    /**
     * Checks if `value` is likely an `arguments` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isArguments(function() { return arguments; }());
     * // => true
     *
     * _.isArguments([1, 2, 3]);
     * // => false
     */
    function isArguments(value) {
      // Safari 8.1 incorrectly makes `arguments.callee` enumerable in strict mode.
      return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
        (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
    }

    /**
     * Checks if `value` is classified as an `Array` object.
     *
     * @static
     * @memberOf _
     * @type {Function}
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isArray([1, 2, 3]);
     * // => true
     *
     * _.isArray(document.body.children);
     * // => false
     *
     * _.isArray('abc');
     * // => false
     *
     * _.isArray(_.noop);
     * // => false
     */
    var isArray = Array.isArray;

    /**
     * Checks if `value` is classified as an `ArrayBuffer` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isArrayBuffer(new ArrayBuffer(2));
     * // => true
     *
     * _.isArrayBuffer(new Array(2));
     * // => false
     */
    function isArrayBuffer(value) {
      return isObjectLike(value) && objectToString.call(value) == arrayBufferTag;
    }

    /**
     * Checks if `value` is array-like. A value is considered array-like if it's
     * not a function and has a `value.length` that's an integer greater than or
     * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
     * @example
     *
     * _.isArrayLike([1, 2, 3]);
     * // => true
     *
     * _.isArrayLike(document.body.children);
     * // => true
     *
     * _.isArrayLike('abc');
     * // => true
     *
     * _.isArrayLike(_.noop);
     * // => false
     */
    function isArrayLike(value) {
      return value != null && isLength(getLength(value)) && !isFunction(value);
    }

    /**
     * This method is like `_.isArrayLike` except that it also checks if `value`
     * is an object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array-like object, else `false`.
     * @example
     *
     * _.isArrayLikeObject([1, 2, 3]);
     * // => true
     *
     * _.isArrayLikeObject(document.body.children);
     * // => true
     *
     * _.isArrayLikeObject('abc');
     * // => false
     *
     * _.isArrayLikeObject(_.noop);
     * // => false
     */
    function isArrayLikeObject(value) {
      return isObjectLike(value) && isArrayLike(value);
    }

    /**
     * Checks if `value` is classified as a boolean primitive or object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isBoolean(false);
     * // => true
     *
     * _.isBoolean(null);
     * // => false
     */
    function isBoolean(value) {
      return value === true || value === false ||
        (isObjectLike(value) && objectToString.call(value) == boolTag);
    }

    /**
     * Checks if `value` is a buffer.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
     * @example
     *
     * _.isBuffer(new Buffer(2));
     * // => true
     *
     * _.isBuffer(new Uint8Array(2));
     * // => false
     */
    var isBuffer = !Buffer ? constant(false) : function(value) {
      return value instanceof Buffer;
    };

    /**
     * Checks if `value` is classified as a `Date` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isDate(new Date);
     * // => true
     *
     * _.isDate('Mon April 23 2012');
     * // => false
     */
    function isDate(value) {
      return isObjectLike(value) && objectToString.call(value) == dateTag;
    }

    /**
     * Checks if `value` is likely a DOM element.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a DOM element, else `false`.
     * @example
     *
     * _.isElement(document.body);
     * // => true
     *
     * _.isElement('<body>');
     * // => false
     */
    function isElement(value) {
      return !!value && value.nodeType === 1 && isObjectLike(value) && !isPlainObject(value);
    }

    /**
     * Checks if `value` is an empty collection or object. A value is considered
     * empty if it's an `arguments` object, array, string, or jQuery-like collection
     * with a length of `0` or has no own enumerable properties.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is empty, else `false`.
     * @example
     *
     * _.isEmpty(null);
     * // => true
     *
     * _.isEmpty(true);
     * // => true
     *
     * _.isEmpty(1);
     * // => true
     *
     * _.isEmpty([1, 2, 3]);
     * // => false
     *
     * _.isEmpty({ 'a': 1 });
     * // => false
     */
    function isEmpty(value) {
      if (isArrayLike(value) &&
          (isArray(value) || isString(value) ||
            isFunction(value.splice) || isArguments(value))) {
        return !value.length;
      }
      for (var key in value) {
        if (hasOwnProperty.call(value, key)) {
          return false;
        }
      }
      return true;
    }

    /**
     * Performs a deep comparison between two values to determine if they are
     * equivalent.
     *
     * **Note:** This method supports comparing arrays, array buffers, booleans,
     * date objects, error objects, maps, numbers, `Object` objects, regexes,
     * sets, strings, symbols, and typed arrays. `Object` objects are compared
     * by their own, not inherited, enumerable properties. Functions and DOM
     * nodes are **not** supported.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'user': 'fred' };
     * var other = { 'user': 'fred' };
     *
     * _.isEqual(object, other);
     * // => true
     *
     * object === other;
     * // => false
     */
    function isEqual(value, other) {
      return baseIsEqual(value, other);
    }

    /**
     * This method is like `_.isEqual` except that it accepts `customizer` which
     * is invoked to compare values. If `customizer` returns `undefined` comparisons
     * are handled by the method instead. The `customizer` is invoked with up to
     * six arguments: (objValue, othValue [, index|key, object, other, stack]).
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @param {Function} [customizer] The function to customize comparisons.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * function isGreeting(value) {
     *   return /^h(?:i|ello)$/.test(value);
     * }
     *
     * function customizer(objValue, othValue) {
     *   if (isGreeting(objValue) && isGreeting(othValue)) {
     *     return true;
     *   }
     * }
     *
     * var array = ['hello', 'goodbye'];
     * var other = ['hi', 'goodbye'];
     *
     * _.isEqualWith(array, other, customizer);
     * // => true
     */
    function isEqualWith(value, other, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      var result = customizer ? customizer(value, other) : undefined;
      return result === undefined ? baseIsEqual(value, other, customizer) : !!result;
    }

    /**
     * Checks if `value` is an `Error`, `EvalError`, `RangeError`, `ReferenceError`,
     * `SyntaxError`, `TypeError`, or `URIError` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an error object, else `false`.
     * @example
     *
     * _.isError(new Error);
     * // => true
     *
     * _.isError(Error);
     * // => false
     */
    function isError(value) {
      if (!isObjectLike(value)) {
        return false;
      }
      return (objectToString.call(value) == errorTag) ||
        (typeof value.message == 'string' && typeof value.name == 'string');
    }

    /**
     * Checks if `value` is a finite primitive number.
     *
     * **Note:** This method is based on [`Number.isFinite`](https://mdn.io/Number/isFinite).
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a finite number, else `false`.
     * @example
     *
     * _.isFinite(3);
     * // => true
     *
     * _.isFinite(Number.MAX_VALUE);
     * // => true
     *
     * _.isFinite(3.14);
     * // => true
     *
     * _.isFinite(Infinity);
     * // => false
     */
    function isFinite(value) {
      return typeof value == 'number' && nativeIsFinite(value);
    }

    /**
     * Checks if `value` is classified as a `Function` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isFunction(_);
     * // => true
     *
     * _.isFunction(/abc/);
     * // => false
     */
    function isFunction(value) {
      // The use of `Object#toString` avoids issues with the `typeof` operator
      // in Safari 8 which returns 'object' for typed array and weak map constructors,
      // and PhantomJS 1.9 which returns 'function' for `NodeList` instances.
      var tag = isObject(value) ? objectToString.call(value) : '';
      return tag == funcTag || tag == genTag;
    }

    /**
     * Checks if `value` is an integer.
     *
     * **Note:** This method is based on [`Number.isInteger`](https://mdn.io/Number/isInteger).
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an integer, else `false`.
     * @example
     *
     * _.isInteger(3);
     * // => true
     *
     * _.isInteger(Number.MIN_VALUE);
     * // => false
     *
     * _.isInteger(Infinity);
     * // => false
     *
     * _.isInteger('3');
     * // => false
     */
    function isInteger(value) {
      return typeof value == 'number' && value == toInteger(value);
    }

    /**
     * Checks if `value` is a valid array-like length.
     *
     * **Note:** This function is loosely based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
     * @example
     *
     * _.isLength(3);
     * // => true
     *
     * _.isLength(Number.MIN_VALUE);
     * // => false
     *
     * _.isLength(Infinity);
     * // => false
     *
     * _.isLength('3');
     * // => false
     */
    function isLength(value) {
      return typeof value == 'number' &&
        value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }

    /**
     * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
     * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
     * @example
     *
     * _.isObject({});
     * // => true
     *
     * _.isObject([1, 2, 3]);
     * // => true
     *
     * _.isObject(_.noop);
     * // => true
     *
     * _.isObject(null);
     * // => false
     */
    function isObject(value) {
      var type = typeof value;
      return !!value && (type == 'object' || type == 'function');
    }

    /**
     * Checks if `value` is object-like. A value is object-like if it's not `null`
     * and has a `typeof` result of "object".
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
     * @example
     *
     * _.isObjectLike({});
     * // => true
     *
     * _.isObjectLike([1, 2, 3]);
     * // => true
     *
     * _.isObjectLike(_.noop);
     * // => false
     *
     * _.isObjectLike(null);
     * // => false
     */
    function isObjectLike(value) {
      return !!value && typeof value == 'object';
    }

    /**
     * Checks if `value` is classified as a `Map` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isMap(new Map);
     * // => true
     *
     * _.isMap(new WeakMap);
     * // => false
     */
    function isMap(value) {
      return isObjectLike(value) && getTag(value) == mapTag;
    }

    /**
     * Performs a partial deep comparison between `object` and `source` to
     * determine if `object` contains equivalent property values. This method is
     * equivalent to a `_.matches` function when `source` is partially applied.
     *
     * **Note:** This method supports comparing the same values as `_.isEqual`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {Object} object The object to inspect.
     * @param {Object} source The object of property values to match.
     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
     * @example
     *
     * var object = { 'user': 'fred', 'age': 40 };
     *
     * _.isMatch(object, { 'age': 40 });
     * // => true
     *
     * _.isMatch(object, { 'age': 36 });
     * // => false
     */
    function isMatch(object, source) {
      return object === source || baseIsMatch(object, source, getMatchData(source));
    }

    /**
     * This method is like `_.isMatch` except that it accepts `customizer` which
     * is invoked to compare values. If `customizer` returns `undefined` comparisons
     * are handled by the method instead. The `customizer` is invoked with five
     * arguments: (objValue, srcValue, index|key, object, source).
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {Object} object The object to inspect.
     * @param {Object} source The object of property values to match.
     * @param {Function} [customizer] The function to customize comparisons.
     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
     * @example
     *
     * function isGreeting(value) {
     *   return /^h(?:i|ello)$/.test(value);
     * }
     *
     * function customizer(objValue, srcValue) {
     *   if (isGreeting(objValue) && isGreeting(srcValue)) {
     *     return true;
     *   }
     * }
     *
     * var object = { 'greeting': 'hello' };
     * var source = { 'greeting': 'hi' };
     *
     * _.isMatchWith(object, source, customizer);
     * // => true
     */
    function isMatchWith(object, source, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      return baseIsMatch(object, source, getMatchData(source), customizer);
    }

    /**
     * Checks if `value` is `NaN`.
     *
     * **Note:** This method is not the same as [`isNaN`](https://es5.github.io/#x15.1.2.4)
     * which returns `true` for `undefined` and other non-numeric values.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
     * @example
     *
     * _.isNaN(NaN);
     * // => true
     *
     * _.isNaN(new Number(NaN));
     * // => true
     *
     * isNaN(undefined);
     * // => true
     *
     * _.isNaN(undefined);
     * // => false
     */
    function isNaN(value) {
      // An `NaN` primitive is the only value that is not equal to itself.
      // Perform the `toStringTag` check first to avoid errors with some ActiveX objects in IE.
      return isNumber(value) && value != +value;
    }

    /**
     * Checks if `value` is a native function.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
     * @example
     *
     * _.isNative(Array.prototype.push);
     * // => true
     *
     * _.isNative(_);
     * // => false
     */
    function isNative(value) {
      if (value == null) {
        return false;
      }
      if (isFunction(value)) {
        return reIsNative.test(funcToString.call(value));
      }
      return isObjectLike(value) &&
        (isHostObject(value) ? reIsNative : reIsHostCtor).test(value);
    }

    /**
     * Checks if `value` is `null`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `null`, else `false`.
     * @example
     *
     * _.isNull(null);
     * // => true
     *
     * _.isNull(void 0);
     * // => false
     */
    function isNull(value) {
      return value === null;
    }

    /**
     * Checks if `value` is `null` or `undefined`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is nullish, else `false`.
     * @example
     *
     * _.isNil(null);
     * // => true
     *
     * _.isNil(void 0);
     * // => true
     *
     * _.isNil(NaN);
     * // => false
     */
    function isNil(value) {
      return value == null;
    }

    /**
     * Checks if `value` is classified as a `Number` primitive or object.
     *
     * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are classified
     * as numbers, use the `_.isFinite` method.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isNumber(3);
     * // => true
     *
     * _.isNumber(Number.MIN_VALUE);
     * // => true
     *
     * _.isNumber(Infinity);
     * // => true
     *
     * _.isNumber('3');
     * // => false
     */
    function isNumber(value) {
      return typeof value == 'number' ||
        (isObjectLike(value) && objectToString.call(value) == numberTag);
    }

    /**
     * Checks if `value` is a plain object, that is, an object created by the
     * `Object` constructor or one with a `[[Prototype]]` of `null`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     * }
     *
     * _.isPlainObject(new Foo);
     * // => false
     *
     * _.isPlainObject([1, 2, 3]);
     * // => false
     *
     * _.isPlainObject({ 'x': 0, 'y': 0 });
     * // => true
     *
     * _.isPlainObject(Object.create(null));
     * // => true
     */
    function isPlainObject(value) {
      if (!isObjectLike(value) ||
          objectToString.call(value) != objectTag || isHostObject(value)) {
        return false;
      }
      var proto = getPrototypeOf(value);
      if (proto === null) {
        return true;
      }
      var Ctor = proto.constructor;
      return (typeof Ctor == 'function' &&
        Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString);
    }

    /**
     * Checks if `value` is classified as a `RegExp` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isRegExp(/abc/);
     * // => true
     *
     * _.isRegExp('/abc/');
     * // => false
     */
    function isRegExp(value) {
      return isObject(value) && objectToString.call(value) == regexpTag;
    }

    /**
     * Checks if `value` is a safe integer. An integer is safe if it's an IEEE-754
     * double precision number which isn't the result of a rounded unsafe integer.
     *
     * **Note:** This method is based on [`Number.isSafeInteger`](https://mdn.io/Number/isSafeInteger).
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a safe integer, else `false`.
     * @example
     *
     * _.isSafeInteger(3);
     * // => true
     *
     * _.isSafeInteger(Number.MIN_VALUE);
     * // => false
     *
     * _.isSafeInteger(Infinity);
     * // => false
     *
     * _.isSafeInteger('3');
     * // => false
     */
    function isSafeInteger(value) {
      return isInteger(value) && value >= -MAX_SAFE_INTEGER && value <= MAX_SAFE_INTEGER;
    }

    /**
     * Checks if `value` is classified as a `Set` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isSet(new Set);
     * // => true
     *
     * _.isSet(new WeakSet);
     * // => false
     */
    function isSet(value) {
      return isObjectLike(value) && getTag(value) == setTag;
    }

    /**
     * Checks if `value` is classified as a `String` primitive or object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isString('abc');
     * // => true
     *
     * _.isString(1);
     * // => false
     */
    function isString(value) {
      return typeof value == 'string' ||
        (!isArray(value) && isObjectLike(value) && objectToString.call(value) == stringTag);
    }

    /**
     * Checks if `value` is classified as a `Symbol` primitive or object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isSymbol(Symbol.iterator);
     * // => true
     *
     * _.isSymbol('abc');
     * // => false
     */
    function isSymbol(value) {
      return typeof value == 'symbol' ||
        (isObjectLike(value) && objectToString.call(value) == symbolTag);
    }

    /**
     * Checks if `value` is classified as a typed array.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isTypedArray(new Uint8Array);
     * // => true
     *
     * _.isTypedArray([]);
     * // => false
     */
    function isTypedArray(value) {
      return isObjectLike(value) &&
        isLength(value.length) && !!typedArrayTags[objectToString.call(value)];
    }

    /**
     * Checks if `value` is `undefined`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
     * @example
     *
     * _.isUndefined(void 0);
     * // => true
     *
     * _.isUndefined(null);
     * // => false
     */
    function isUndefined(value) {
      return value === undefined;
    }

    /**
     * Checks if `value` is classified as a `WeakMap` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isWeakMap(new WeakMap);
     * // => true
     *
     * _.isWeakMap(new Map);
     * // => false
     */
    function isWeakMap(value) {
      return isObjectLike(value) && getTag(value) == weakMapTag;
    }

    /**
     * Checks if `value` is classified as a `WeakSet` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isWeakSet(new WeakSet);
     * // => true
     *
     * _.isWeakSet(new Set);
     * // => false
     */
    function isWeakSet(value) {
      return isObjectLike(value) && objectToString.call(value) == weakSetTag;
    }

    /**
     * Checks if `value` is less than `other`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is less than `other`, else `false`.
     * @example
     *
     * _.lt(1, 3);
     * // => true
     *
     * _.lt(3, 3);
     * // => false
     *
     * _.lt(3, 1);
     * // => false
     */
    function lt(value, other) {
      return value < other;
    }

    /**
     * Checks if `value` is less than or equal to `other`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is less than or equal to `other`, else `false`.
     * @example
     *
     * _.lte(1, 3);
     * // => true
     *
     * _.lte(3, 3);
     * // => true
     *
     * _.lte(3, 1);
     * // => false
     */
    function lte(value, other) {
      return value <= other;
    }

    /**
     * Converts `value` to an array.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {Array} Returns the converted array.
     * @example
     *
     * _.toArray({ 'a': 1, 'b': 2 });
     * // => [1, 2]
     *
     * _.toArray('abc');
     * // => ['a', 'b', 'c']
     *
     * _.toArray(1);
     * // => []
     *
     * _.toArray(null);
     * // => []
     */
    function toArray(value) {
      if (!value) {
        return [];
      }
      if (isArrayLike(value)) {
        return isString(value) ? stringToArray(value) : copyArray(value);
      }
      if (iteratorSymbol && value[iteratorSymbol]) {
        return iteratorToArray(value[iteratorSymbol]());
      }
      var tag = getTag(value),
          func = tag == mapTag ? mapToArray : (tag == setTag ? setToArray : values);

      return func(value);
    }

    /**
     * Converts `value` to an integer.
     *
     * **Note:** This function is loosely based on [`ToInteger`](http://www.ecma-international.org/ecma-262/6.0/#sec-tointeger).
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {number} Returns the converted integer.
     * @example
     *
     * _.toInteger(3);
     * // => 3
     *
     * _.toInteger(Number.MIN_VALUE);
     * // => 0
     *
     * _.toInteger(Infinity);
     * // => 1.7976931348623157e+308
     *
     * _.toInteger('3');
     * // => 3
     */
    function toInteger(value) {
      if (!value) {
        return value === 0 ? value : 0;
      }
      value = toNumber(value);
      if (value === INFINITY || value === -INFINITY) {
        var sign = (value < 0 ? -1 : 1);
        return sign * MAX_INTEGER;
      }
      var remainder = value % 1;
      return value === value ? (remainder ? value - remainder : value) : 0;
    }

    /**
     * Converts `value` to an integer suitable for use as the length of an
     * array-like object.
     *
     * **Note:** This method is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {number} Returns the converted integer.
     * @example
     *
     * _.toLength(3);
     * // => 3
     *
     * _.toLength(Number.MIN_VALUE);
     * // => 0
     *
     * _.toLength(Infinity);
     * // => 4294967295
     *
     * _.toLength('3');
     * // => 3
     */
    function toLength(value) {
      return value ? baseClamp(toInteger(value), 0, MAX_ARRAY_LENGTH) : 0;
    }

    /**
     * Converts `value` to a number.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to process.
     * @returns {number} Returns the number.
     * @example
     *
     * _.toNumber(3);
     * // => 3
     *
     * _.toNumber(Number.MIN_VALUE);
     * // => 5e-324
     *
     * _.toNumber(Infinity);
     * // => Infinity
     *
     * _.toNumber('3');
     * // => 3
     */
    function toNumber(value) {
      if (isObject(value)) {
        var other = isFunction(value.valueOf) ? value.valueOf() : value;
        value = isObject(other) ? (other + '') : other;
      }
      if (typeof value != 'string') {
        return value === 0 ? value : +value;
      }
      value = value.replace(reTrim, '');
      var isBinary = reIsBinary.test(value);
      return (isBinary || reIsOctal.test(value))
        ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
        : (reIsBadHex.test(value) ? NAN : +value);
    }

    /**
     * Converts `value` to a plain object flattening inherited enumerable
     * properties of `value` to own properties of the plain object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {Object} Returns the converted plain object.
     * @example
     *
     * function Foo() {
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.assign({ 'a': 1 }, new Foo);
     * // => { 'a': 1, 'b': 2 }
     *
     * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
     * // => { 'a': 1, 'b': 2, 'c': 3 }
     */
    function toPlainObject(value) {
      return copyObject(value, keysIn(value));
    }

    /**
     * Converts `value` to a safe integer. A safe integer can be compared and
     * represented correctly.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {number} Returns the converted integer.
     * @example
     *
     * _.toSafeInteger(3);
     * // => 3
     *
     * _.toSafeInteger(Number.MIN_VALUE);
     * // => 0
     *
     * _.toSafeInteger(Infinity);
     * // => 9007199254740991
     *
     * _.toSafeInteger('3');
     * // => 3
     */
    function toSafeInteger(value) {
      return baseClamp(toInteger(value), -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER);
    }

    /**
     * Converts `value` to a string if it's not one. An empty string is returned
     * for `null` and `undefined` values. The sign of `-0` is preserved.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to process.
     * @returns {string} Returns the string.
     * @example
     *
     * _.toString(null);
     * // => ''
     *
     * _.toString(-0);
     * // => '-0'
     *
     * _.toString([1, 2, 3]);
     * // => '1,2,3'
     */
    function toString(value) {
      // Exit early for strings to avoid a performance hit in some environments.
      if (typeof value == 'string') {
        return value;
      }
      if (value == null) {
        return '';
      }
      if (isSymbol(value)) {
        return symbolToString ? symbolToString.call(value) : '';
      }
      var result = (value + '');
      return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
    }

    /*------------------------------------------------------------------------*/

    /**
     * Assigns own enumerable properties of source objects to the destination
     * object. Source objects are applied from left to right. Subsequent sources
     * overwrite property assignments of previous sources.
     *
     * **Note:** This method mutates `object` and is loosely based on
     * [`Object.assign`](https://mdn.io/Object/assign).
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function Foo() {
     *   this.c = 3;
     * }
     *
     * function Bar() {
     *   this.e = 5;
     * }
     *
     * Foo.prototype.d = 4;
     * Bar.prototype.f = 6;
     *
     * _.assign({ 'a': 1 }, new Foo, new Bar);
     * // => { 'a': 1, 'c': 3, 'e': 5 }
     */
    var assign = createAssigner(function(object, source) {
      if (nonEnumShadows || isPrototype(source) || isArrayLike(source)) {
        copyObject(source, keys(source), object);
        return;
      }
      for (var key in source) {
        if (hasOwnProperty.call(source, key)) {
          assignValue(object, key, source[key]);
        }
      }
    });

    /**
     * This method is like `_.assign` except that it iterates over own and
     * inherited source properties.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @alias extend
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function Foo() {
     *   this.b = 2;
     * }
     *
     * function Bar() {
     *   this.d = 4;
     * }
     *
     * Foo.prototype.c = 3;
     * Bar.prototype.e = 5;
     *
     * _.assignIn({ 'a': 1 }, new Foo, new Bar);
     * // => { 'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5 }
     */
    var assignIn = createAssigner(function(object, source) {
      if (nonEnumShadows || isPrototype(source) || isArrayLike(source)) {
        copyObject(source, keysIn(source), object);
        return;
      }
      for (var key in source) {
        assignValue(object, key, source[key]);
      }
    });

    /**
     * This method is like `_.assignIn` except that it accepts `customizer` which
     * is invoked to produce the assigned values. If `customizer` returns `undefined`
     * assignment is handled by the method instead. The `customizer` is invoked
     * with five arguments: (objValue, srcValue, key, object, source).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @alias extendWith
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} sources The source objects.
     * @param {Function} [customizer] The function to customize assigned values.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function customizer(objValue, srcValue) {
     *   return _.isUndefined(objValue) ? srcValue : objValue;
     * }
     *
     * var defaults = _.partialRight(_.assignInWith, customizer);
     *
     * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
     * // => { 'a': 1, 'b': 2 }
     */
    var assignInWith = createAssigner(function(object, source, srcIndex, customizer) {
      copyObjectWith(source, keysIn(source), object, customizer);
    });

    /**
     * This method is like `_.assign` except that it accepts `customizer` which
     * is invoked to produce the assigned values. If `customizer` returns `undefined`
     * assignment is handled by the method instead. The `customizer` is invoked
     * with five arguments: (objValue, srcValue, key, object, source).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} sources The source objects.
     * @param {Function} [customizer] The function to customize assigned values.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function customizer(objValue, srcValue) {
     *   return _.isUndefined(objValue) ? srcValue : objValue;
     * }
     *
     * var defaults = _.partialRight(_.assignWith, customizer);
     *
     * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
     * // => { 'a': 1, 'b': 2 }
     */
    var assignWith = createAssigner(function(object, source, srcIndex, customizer) {
      copyObjectWith(source, keys(source), object, customizer);
    });

    /**
     * Creates an array of values corresponding to `paths` of `object`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {...(string|string[])} [paths] The property paths of elements to pick,
     *  specified individually or in arrays.
     * @returns {Array} Returns the new array of picked elements.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }, 4] };
     *
     * _.at(object, ['a[0].b.c', 'a[1]']);
     * // => [3, 4]
     *
     * _.at(['a', 'b', 'c'], 0, 2);
     * // => ['a', 'c']
     */
    var at = rest(function(object, paths) {
      return baseAt(object, baseFlatten(paths, 1));
    });

    /**
     * Creates an object that inherits from the `prototype` object. If a `properties`
     * object is given its own enumerable properties are assigned to the created object.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} prototype The object to inherit from.
     * @param {Object} [properties] The properties to assign to the object.
     * @returns {Object} Returns the new object.
     * @example
     *
     * function Shape() {
     *   this.x = 0;
     *   this.y = 0;
     * }
     *
     * function Circle() {
     *   Shape.call(this);
     * }
     *
     * Circle.prototype = _.create(Shape.prototype, {
     *   'constructor': Circle
     * });
     *
     * var circle = new Circle;
     * circle instanceof Circle;
     * // => true
     *
     * circle instanceof Shape;
     * // => true
     */
    function create(prototype, properties) {
      var result = baseCreate(prototype);
      return properties ? baseAssign(result, properties) : result;
    }

    /**
     * Assigns own and inherited enumerable properties of source objects to the
     * destination object for all destination properties that resolve to `undefined`.
     * Source objects are applied from left to right. Once a property is set,
     * additional values of the same property are ignored.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @example
     *
     * _.defaults({ 'user': 'barney' }, { 'age': 36 }, { 'user': 'fred' });
     * // => { 'user': 'barney', 'age': 36 }
     */
    var defaults = rest(function(args) {
      args.push(undefined, assignInDefaults);
      return apply(assignInWith, undefined, args);
    });

    /**
     * This method is like `_.defaults` except that it recursively assigns
     * default properties.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @example
     *
     * _.defaultsDeep({ 'user': { 'name': 'barney' } }, { 'user': { 'name': 'fred', 'age': 36 } });
     * // => { 'user': { 'name': 'barney', 'age': 36 } }
     *
     */
    var defaultsDeep = rest(function(args) {
      args.push(undefined, mergeDefaults);
      return apply(mergeWith, undefined, args);
    });

    /**
     * This method is like `_.find` except that it returns the key of the first
     * element `predicate` returns truthy for instead of the element itself.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked per iteration.
     * @returns {string|undefined} Returns the key of the matched element, else `undefined`.
     * @example
     *
     * var users = {
     *   'barney':  { 'age': 36, 'active': true },
     *   'fred':    { 'age': 40, 'active': false },
     *   'pebbles': { 'age': 1,  'active': true }
     * };
     *
     * _.findKey(users, function(o) { return o.age < 40; });
     * // => 'barney' (iteration order is not guaranteed)
     *
     * // The `_.matches` iteratee shorthand.
     * _.findKey(users, { 'age': 1, 'active': true });
     * // => 'pebbles'
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.findKey(users, ['active', false]);
     * // => 'fred'
     *
     * // The `_.property` iteratee shorthand.
     * _.findKey(users, 'active');
     * // => 'barney'
     */
    function findKey(object, predicate) {
      return baseFind(object, getIteratee(predicate, 3), baseForOwn, true);
    }

    /**
     * This method is like `_.findKey` except that it iterates over elements of
     * a collection in the opposite order.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked per iteration.
     * @returns {string|undefined} Returns the key of the matched element, else `undefined`.
     * @example
     *
     * var users = {
     *   'barney':  { 'age': 36, 'active': true },
     *   'fred':    { 'age': 40, 'active': false },
     *   'pebbles': { 'age': 1,  'active': true }
     * };
     *
     * _.findLastKey(users, function(o) { return o.age < 40; });
     * // => returns 'pebbles' assuming `_.findKey` returns 'barney'
     *
     * // The `_.matches` iteratee shorthand.
     * _.findLastKey(users, { 'age': 36, 'active': true });
     * // => 'barney'
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.findLastKey(users, ['active', false]);
     * // => 'fred'
     *
     * // The `_.property` iteratee shorthand.
     * _.findLastKey(users, 'active');
     * // => 'pebbles'
     */
    function findLastKey(object, predicate) {
      return baseFind(object, getIteratee(predicate, 3), baseForOwnRight, true);
    }

    /**
     * Iterates over own and inherited enumerable properties of an object invoking
     * `iteratee` for each property. The iteratee is invoked with three arguments:
     * (value, key, object). Iteratee functions may exit iteration early by explicitly
     * returning `false`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forIn(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => logs 'a', 'b', then 'c' (iteration order is not guaranteed)
     */
    function forIn(object, iteratee) {
      return object == null
        ? object
        : baseFor(object, baseCastFunction(iteratee), keysIn);
    }

    /**
     * This method is like `_.forIn` except that it iterates over properties of
     * `object` in the opposite order.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forInRight(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => logs 'c', 'b', then 'a' assuming `_.forIn` logs 'a', 'b', then 'c'
     */
    function forInRight(object, iteratee) {
      return object == null
        ? object
        : baseForRight(object, baseCastFunction(iteratee), keysIn);
    }

    /**
     * Iterates over own enumerable properties of an object invoking `iteratee`
     * for each property. The iteratee is invoked with three arguments:
     * (value, key, object). Iteratee functions may exit iteration early by
     * explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forOwn(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => logs 'a' then 'b' (iteration order is not guaranteed)
     */
    function forOwn(object, iteratee) {
      return object && baseForOwn(object, baseCastFunction(iteratee));
    }

    /**
     * This method is like `_.forOwn` except that it iterates over properties of
     * `object` in the opposite order.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forOwnRight(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => logs 'b' then 'a' assuming `_.forOwn` logs 'a' then 'b'
     */
    function forOwnRight(object, iteratee) {
      return object && baseForOwnRight(object, baseCastFunction(iteratee));
    }

    /**
     * Creates an array of function property names from own enumerable properties
     * of `object`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns the new array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = _.constant('a');
     *   this.b = _.constant('b');
     * }
     *
     * Foo.prototype.c = _.constant('c');
     *
     * _.functions(new Foo);
     * // => ['a', 'b']
     */
    function functions(object) {
      return object == null ? [] : baseFunctions(object, keys(object));
    }

    /**
     * Creates an array of function property names from own and inherited
     * enumerable properties of `object`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns the new array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = _.constant('a');
     *   this.b = _.constant('b');
     * }
     *
     * Foo.prototype.c = _.constant('c');
     *
     * _.functionsIn(new Foo);
     * // => ['a', 'b', 'c']
     */
    function functionsIn(object) {
      return object == null ? [] : baseFunctions(object, keysIn(object));
    }

    /**
     * Gets the value at `path` of `object`. If the resolved value is
     * `undefined` the `defaultValue` is used in its place.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to get.
     * @param {*} [defaultValue] The value returned if the resolved value is `undefined`.
     * @returns {*} Returns the resolved value.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
     *
     * _.get(object, 'a[0].b.c');
     * // => 3
     *
     * _.get(object, ['a', '0', 'b', 'c']);
     * // => 3
     *
     * _.get(object, 'a.b.c', 'default');
     * // => 'default'
     */
    function get(object, path, defaultValue) {
      var result = object == null ? undefined : baseGet(object, path);
      return result === undefined ? defaultValue : result;
    }

    /**
     * Checks if `path` is a direct property of `object`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path to check.
     * @returns {boolean} Returns `true` if `path` exists, else `false`.
     * @example
     *
     * var object = { 'a': { 'b': { 'c': 3 } } };
     * var other = _.create({ 'a': _.create({ 'b': _.create({ 'c': 3 }) }) });
     *
     * _.has(object, 'a');
     * // => true
     *
     * _.has(object, 'a.b.c');
     * // => true
     *
     * _.has(object, ['a', 'b', 'c']);
     * // => true
     *
     * _.has(other, 'a');
     * // => false
     */
    function has(object, path) {
      return hasPath(object, path, baseHas);
    }

    /**
     * Checks if `path` is a direct or inherited property of `object`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path to check.
     * @returns {boolean} Returns `true` if `path` exists, else `false`.
     * @example
     *
     * var object = _.create({ 'a': _.create({ 'b': _.create({ 'c': 3 }) }) });
     *
     * _.hasIn(object, 'a');
     * // => true
     *
     * _.hasIn(object, 'a.b.c');
     * // => true
     *
     * _.hasIn(object, ['a', 'b', 'c']);
     * // => true
     *
     * _.hasIn(object, 'b');
     * // => false
     */
    function hasIn(object, path) {
      return hasPath(object, path, baseHasIn);
    }

    /**
     * Creates an object composed of the inverted keys and values of `object`.
     * If `object` contains duplicate values, subsequent values overwrite property
     * assignments of previous values.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to invert.
     * @returns {Object} Returns the new inverted object.
     * @example
     *
     * var object = { 'a': 1, 'b': 2, 'c': 1 };
     *
     * _.invert(object);
     * // => { '1': 'c', '2': 'b' }
     */
    var invert = createInverter(function(result, value, key) {
      result[value] = key;
    }, constant(identity));

    /**
     * This method is like `_.invert` except that the inverted object is generated
     * from the results of running each element of `object` through `iteratee`.
     * The corresponding inverted value of each inverted key is an array of keys
     * responsible for generating the inverted value. The iteratee is invoked
     * with one argument: (value).
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to invert.
     * @param {Function|Object|string} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Object} Returns the new inverted object.
     * @example
     *
     * var object = { 'a': 1, 'b': 2, 'c': 1 };
     *
     * _.invertBy(object);
     * // => { '1': ['a', 'c'], '2': ['b'] }
     *
     * _.invertBy(object, function(value) {
     *   return 'group' + value;
     * });
     * // => { 'group1': ['a', 'c'], 'group2': ['b'] }
     */
    var invertBy = createInverter(function(result, value, key) {
      if (hasOwnProperty.call(result, value)) {
        result[value].push(key);
      } else {
        result[value] = [key];
      }
    }, getIteratee);

    /**
     * Invokes the method at `path` of `object`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the method to invoke.
     * @param {...*} [args] The arguments to invoke the method with.
     * @returns {*} Returns the result of the invoked method.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': [1, 2, 3, 4] } }] };
     *
     * _.invoke(object, 'a[0].b.c.slice', 1, 3);
     * // => [2, 3]
     */
    var invoke = rest(baseInvoke);

    /**
     * Creates an array of the own enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects. See the
     * [ES spec](http://ecma-international.org/ecma-262/6.0/#sec-object.keys)
     * for more details.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keys(new Foo);
     * // => ['a', 'b'] (iteration order is not guaranteed)
     *
     * _.keys('hi');
     * // => ['0', '1']
     */
    function keys(object) {
      var isProto = isPrototype(object);
      if (!(isProto || isArrayLike(object))) {
        return baseKeys(object);
      }
      var indexes = indexKeys(object),
          skipIndexes = !!indexes,
          result = indexes || [],
          length = result.length;

      for (var key in object) {
        if (baseHas(object, key) &&
            !(skipIndexes && (key == 'length' || isIndex(key, length))) &&
            !(isProto && key == 'constructor')) {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * Creates an array of the own and inherited enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keysIn(new Foo);
     * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
     */
    function keysIn(object) {
      var index = -1,
          isProto = isPrototype(object),
          props = baseKeysIn(object),
          propsLength = props.length,
          indexes = indexKeys(object),
          skipIndexes = !!indexes,
          result = indexes || [],
          length = result.length;

      while (++index < propsLength) {
        var key = props[index];
        if (!(skipIndexes && (key == 'length' || isIndex(key, length))) &&
            !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * The opposite of `_.mapValues`; this method creates an object with the
     * same values as `object` and keys generated by running each own enumerable
     * property of `object` through `iteratee`. The iteratee is invoked with
     * three arguments: (value, key, object).
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns the new mapped object.
     * @example
     *
     * _.mapKeys({ 'a': 1, 'b': 2 }, function(value, key) {
     *   return key + value;
     * });
     * // => { 'a1': 1, 'b2': 2 }
     */
    function mapKeys(object, iteratee) {
      var result = {};
      iteratee = getIteratee(iteratee, 3);

      baseForOwn(object, function(value, key, object) {
        result[iteratee(value, key, object)] = value;
      });
      return result;
    }

    /**
     * Creates an object with the same keys as `object` and values generated by
     * running each own enumerable property of `object` through `iteratee`. The
     * iteratee is invoked with three arguments: (value, key, object).
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns the new mapped object.
     * @example
     *
     * var users = {
     *   'fred':    { 'user': 'fred',    'age': 40 },
     *   'pebbles': { 'user': 'pebbles', 'age': 1 }
     * };
     *
     * _.mapValues(users, function(o) { return o.age; });
     * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
     *
     * // The `_.property` iteratee shorthand.
     * _.mapValues(users, 'age');
     * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
     */
    function mapValues(object, iteratee) {
      var result = {};
      iteratee = getIteratee(iteratee, 3);

      baseForOwn(object, function(value, key, object) {
        result[key] = iteratee(value, key, object);
      });
      return result;
    }

    /**
     * This method is like `_.assign` except that it recursively merges own and
     * inherited enumerable properties of source objects into the destination
     * object. Source properties that resolve to `undefined` are skipped if a
     * destination value exists. Array and plain object properties are merged
     * recursively.Other objects and value types are overridden by assignment.
     * Source objects are applied from left to right. Subsequent sources
     * overwrite property assignments of previous sources.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var users = {
     *   'data': [{ 'user': 'barney' }, { 'user': 'fred' }]
     * };
     *
     * var ages = {
     *   'data': [{ 'age': 36 }, { 'age': 40 }]
     * };
     *
     * _.merge(users, ages);
     * // => { 'data': [{ 'user': 'barney', 'age': 36 }, { 'user': 'fred', 'age': 40 }] }
     */
    var merge = createAssigner(function(object, source, srcIndex) {
      baseMerge(object, source, srcIndex);
    });

    /**
     * This method is like `_.merge` except that it accepts `customizer` which
     * is invoked to produce the merged values of the destination and source
     * properties. If `customizer` returns `undefined` merging is handled by the
     * method instead. The `customizer` is invoked with seven arguments:
     * (objValue, srcValue, key, object, source, stack).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} sources The source objects.
     * @param {Function} customizer The function to customize assigned values.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function customizer(objValue, srcValue) {
     *   if (_.isArray(objValue)) {
     *     return objValue.concat(srcValue);
     *   }
     * }
     *
     * var object = {
     *   'fruits': ['apple'],
     *   'vegetables': ['beet']
     * };
     *
     * var other = {
     *   'fruits': ['banana'],
     *   'vegetables': ['carrot']
     * };
     *
     * _.mergeWith(object, other, customizer);
     * // => { 'fruits': ['apple', 'banana'], 'vegetables': ['beet', 'carrot'] }
     */
    var mergeWith = createAssigner(function(object, source, srcIndex, customizer) {
      baseMerge(object, source, srcIndex, customizer);
    });

    /**
     * The opposite of `_.pick`; this method creates an object composed of the
     * own and inherited enumerable properties of `object` that are not omitted.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The source object.
     * @param {...(string|string[])} [props] The property names to omit, specified
     *  individually or in arrays.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'a': 1, 'b': '2', 'c': 3 };
     *
     * _.omit(object, ['a', 'c']);
     * // => { 'b': '2' }
     */
    var omit = rest(function(object, props) {
      if (object == null) {
        return {};
      }
      props = arrayMap(baseFlatten(props, 1), String);
      return basePick(object, baseDifference(keysIn(object), props));
    });

    /**
     * The opposite of `_.pickBy`; this method creates an object composed of
     * the own and inherited enumerable properties of `object` that `predicate`
     * doesn't return truthy for. The predicate is invoked with two arguments:
     * (value, key).
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The source object.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked per property.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'a': 1, 'b': '2', 'c': 3 };
     *
     * _.omitBy(object, _.isNumber);
     * // => { 'b': '2' }
     */
    function omitBy(object, predicate) {
      predicate = getIteratee(predicate);
      return basePickBy(object, function(value, key) {
        return !predicate(value, key);
      });
    }

    /**
     * Creates an object composed of the picked `object` properties.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The source object.
     * @param {...(string|string[])} [props] The property names to pick, specified
     *  individually or in arrays.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'a': 1, 'b': '2', 'c': 3 };
     *
     * _.pick(object, ['a', 'c']);
     * // => { 'a': 1, 'c': 3 }
     */
    var pick = rest(function(object, props) {
      return object == null ? {} : basePick(object, baseFlatten(props, 1));
    });

    /**
     * Creates an object composed of the `object` properties `predicate` returns
     * truthy for. The predicate is invoked with two arguments: (value, key).
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The source object.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked per property.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'a': 1, 'b': '2', 'c': 3 };
     *
     * _.pickBy(object, _.isNumber);
     * // => { 'a': 1, 'c': 3 }
     */
    function pickBy(object, predicate) {
      return object == null ? {} : basePickBy(object, getIteratee(predicate));
    }

    /**
     * This method is like `_.get` except that if the resolved value is a function
     * it's invoked with the `this` binding of its parent object and its result
     * is returned.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to resolve.
     * @param {*} [defaultValue] The value returned if the resolved value is `undefined`.
     * @returns {*} Returns the resolved value.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c1': 3, 'c2': _.constant(4) } }] };
     *
     * _.result(object, 'a[0].b.c1');
     * // => 3
     *
     * _.result(object, 'a[0].b.c2');
     * // => 4
     *
     * _.result(object, 'a[0].b.c3', 'default');
     * // => 'default'
     *
     * _.result(object, 'a[0].b.c3', _.constant('default'));
     * // => 'default'
     */
    function result(object, path, defaultValue) {
      if (!isKey(path, object)) {
        path = baseCastPath(path);
        var result = baseGet(object, path);
        object = parent(object, path);
      } else {
        result = object == null ? undefined : object[path];
      }
      if (result === undefined) {
        result = defaultValue;
      }
      return isFunction(result) ? result.call(object) : result;
    }

    /**
     * Sets the value at `path` of `object`. If a portion of `path` doesn't exist
     * it's created. Arrays are created for missing index properties while objects
     * are created for all other missing properties. Use `_.setWith` to customize
     * `path` creation.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
     *
     * _.set(object, 'a[0].b.c', 4);
     * console.log(object.a[0].b.c);
     * // => 4
     *
     * _.set(object, 'x[0].y.z', 5);
     * console.log(object.x[0].y.z);
     * // => 5
     */
    function set(object, path, value) {
      return object == null ? object : baseSet(object, path, value);
    }

    /**
     * This method is like `_.set` except that it accepts `customizer` which is
     * invoked to produce the objects of `path`.  If `customizer` returns `undefined`
     * path creation is handled by the method instead. The `customizer` is invoked
     * with three arguments: (nsValue, key, nsObject).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to set.
     * @param {*} value The value to set.
     * @param {Function} [customizer] The function to customize assigned values.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = {};
     *
     * _.setWith(object, '[0][1]', 'a', Object);
     * // => { '0': { '1': 'a' } }
     */
    function setWith(object, path, value, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      return object == null ? object : baseSet(object, path, value, customizer);
    }

    /**
     * Creates an array of own enumerable key-value pairs for `object` which
     * can be consumed by `_.fromPairs`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the new array of key-value pairs.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.toPairs(new Foo);
     * // => [['a', 1], ['b', 2]] (iteration order is not guaranteed)
     */
    function toPairs(object) {
      return baseToPairs(object, keys(object));
    }

    /**
     * Creates an array of own and inherited enumerable key-value pairs for
     * `object` which can be consumed by `_.fromPairs`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the new array of key-value pairs.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.toPairsIn(new Foo);
     * // => [['a', 1], ['b', 2], ['c', 1]] (iteration order is not guaranteed)
     */
    function toPairsIn(object) {
      return baseToPairs(object, keysIn(object));
    }

    /**
     * An alternative to `_.reduce`; this method transforms `object` to a new
     * `accumulator` object which is the result of running each of its own enumerable
     * properties through `iteratee`, with each invocation potentially mutating
     * the `accumulator` object. The iteratee is invoked with four arguments:
     * (accumulator, value, key, object). Iteratee functions may exit iteration
     * early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Array|Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [accumulator] The custom accumulator value.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * _.transform([2, 3, 4], function(result, n) {
     *   result.push(n *= n);
     *   return n % 2 == 0;
     * }, []);
     * // => [4, 9]
     *
     * _.transform({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
     *   (result[value] || (result[value] = [])).push(key);
     * }, {});
     * // => { '1': ['a', 'c'], '2': ['b'] }
     */
    function transform(object, iteratee, accumulator) {
      var isArr = isArray(object) || isTypedArray(object);
      iteratee = getIteratee(iteratee, 4);

      if (accumulator == null) {
        if (isArr || isObject(object)) {
          var Ctor = object.constructor;
          if (isArr) {
            accumulator = isArray(object) ? new Ctor : [];
          } else {
            accumulator = isFunction(Ctor) ? baseCreate(getPrototypeOf(object)) : {};
          }
        } else {
          accumulator = {};
        }
      }
      (isArr ? arrayEach : baseForOwn)(object, function(value, index, object) {
        return iteratee(accumulator, value, index, object);
      });
      return accumulator;
    }

    /**
     * Removes the property at `path` of `object`.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to unset.
     * @returns {boolean} Returns `true` if the property is deleted, else `false`.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 7 } }] };
     * _.unset(object, 'a[0].b.c');
     * // => true
     *
     * console.log(object);
     * // => { 'a': [{ 'b': {} }] };
     *
     * _.unset(object, 'a[0].b.c');
     * // => true
     *
     * console.log(object);
     * // => { 'a': [{ 'b': {} }] };
     */
    function unset(object, path) {
      return object == null ? true : baseUnset(object, path);
    }

    /**
     * This method is like `_.set` except that accepts `updater` to produce the
     * value to set. Use `_.updateWith` to customize `path` creation. The `updater`
     * is invoked with one argument: (value).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to set.
     * @param {Function} updater The function to produce the updated value.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
     *
     * _.update(object, 'a[0].b.c', function(n) { return n * n; });
     * console.log(object.a[0].b.c);
     * // => 9
     *
     * _.update(object, 'x[0].y.z', function(n) { return n ? n + 1 : 0; });
     * console.log(object.x[0].y.z);
     * // => 0
     */
    function update(object, path, updater) {
      return object == null ? object : baseUpdate(object, path, baseCastFunction(updater));
    }

    /**
     * This method is like `_.update` except that it accepts `customizer` which is
     * invoked to produce the objects of `path`.  If `customizer` returns `undefined`
     * path creation is handled by the method instead. The `customizer` is invoked
     * with three arguments: (nsValue, key, nsObject).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to set.
     * @param {Function} updater The function to produce the updated value.
     * @param {Function} [customizer] The function to customize assigned values.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = {};
     *
     * _.updateWith(object, '[0][1]', _.constant('a'), Object);
     * // => { '0': { '1': 'a' } }
     */
    function updateWith(object, path, updater, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      return object == null ? object : baseUpdate(object, path, baseCastFunction(updater), customizer);
    }

    /**
     * Creates an array of the own enumerable property values of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property values.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.values(new Foo);
     * // => [1, 2] (iteration order is not guaranteed)
     *
     * _.values('hi');
     * // => ['h', 'i']
     */
    function values(object) {
      return object ? baseValues(object, keys(object)) : [];
    }

    /**
     * Creates an array of the own and inherited enumerable property values of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property values.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.valuesIn(new Foo);
     * // => [1, 2, 3] (iteration order is not guaranteed)
     */
    function valuesIn(object) {
      return object == null ? [] : baseValues(object, keysIn(object));
    }

    /*------------------------------------------------------------------------*/

    /**
     * Clamps `number` within the inclusive `lower` and `upper` bounds.
     *
     * @static
     * @memberOf _
     * @category Number
     * @param {number} number The number to clamp.
     * @param {number} [lower] The lower bound.
     * @param {number} upper The upper bound.
     * @returns {number} Returns the clamped number.
     * @example
     *
     * _.clamp(-10, -5, 5);
     * // => -5
     *
     * _.clamp(10, -5, 5);
     * // => 5
     */
    function clamp(number, lower, upper) {
      if (upper === undefined) {
        upper = lower;
        lower = undefined;
      }
      if (upper !== undefined) {
        upper = toNumber(upper);
        upper = upper === upper ? upper : 0;
      }
      if (lower !== undefined) {
        lower = toNumber(lower);
        lower = lower === lower ? lower : 0;
      }
      return baseClamp(toNumber(number), lower, upper);
    }

    /**
     * Checks if `n` is between `start` and up to but not including, `end`. If
     * `end` is not specified it's set to `start` with `start` then set to `0`.
     * If `start` is greater than `end` the params are swapped to support
     * negative ranges.
     *
     * @static
     * @memberOf _
     * @category Number
     * @param {number} number The number to check.
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
     * @example
     *
     * _.inRange(3, 2, 4);
     * // => true
     *
     * _.inRange(4, 8);
     * // => true
     *
     * _.inRange(4, 2);
     * // => false
     *
     * _.inRange(2, 2);
     * // => false
     *
     * _.inRange(1.2, 2);
     * // => true
     *
     * _.inRange(5.2, 4);
     * // => false
     *
     * _.inRange(-3, -2, -6);
     * // => true
     */
    function inRange(number, start, end) {
      start = toNumber(start) || 0;
      if (end === undefined) {
        end = start;
        start = 0;
      } else {
        end = toNumber(end) || 0;
      }
      number = toNumber(number);
      return baseInRange(number, start, end);
    }

    /**
     * Produces a random number between the inclusive `lower` and `upper` bounds.
     * If only one argument is provided a number between `0` and the given number
     * is returned. If `floating` is `true`, or either `lower` or `upper` are floats,
     * a floating-point number is returned instead of an integer.
     *
     * **Note:** JavaScript follows the IEEE-754 standard for resolving
     * floating-point values which can produce unexpected results.
     *
     * @static
     * @memberOf _
     * @category Number
     * @param {number} [lower=0] The lower bound.
     * @param {number} [upper=1] The upper bound.
     * @param {boolean} [floating] Specify returning a floating-point number.
     * @returns {number} Returns the random number.
     * @example
     *
     * _.random(0, 5);
     * // => an integer between 0 and 5
     *
     * _.random(5);
     * // => also an integer between 0 and 5
     *
     * _.random(5, true);
     * // => a floating-point number between 0 and 5
     *
     * _.random(1.2, 5.2);
     * // => a floating-point number between 1.2 and 5.2
     */
    function random(lower, upper, floating) {
      if (floating && typeof floating != 'boolean' && isIterateeCall(lower, upper, floating)) {
        upper = floating = undefined;
      }
      if (floating === undefined) {
        if (typeof upper == 'boolean') {
          floating = upper;
          upper = undefined;
        }
        else if (typeof lower == 'boolean') {
          floating = lower;
          lower = undefined;
        }
      }
      if (lower === undefined && upper === undefined) {
        lower = 0;
        upper = 1;
      }
      else {
        lower = toNumber(lower) || 0;
        if (upper === undefined) {
          upper = lower;
          lower = 0;
        } else {
          upper = toNumber(upper) || 0;
        }
      }
      if (lower > upper) {
        var temp = lower;
        lower = upper;
        upper = temp;
      }
      if (floating || lower % 1 || upper % 1) {
        var rand = nativeRandom();
        return nativeMin(lower + (rand * (upper - lower + freeParseFloat('1e-' + ((rand + '').length - 1)))), upper);
      }
      return baseRandom(lower, upper);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Converts `string` to [camel case](https://en.wikipedia.org/wiki/CamelCase).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the camel cased string.
     * @example
     *
     * _.camelCase('Foo Bar');
     * // => 'fooBar'
     *
     * _.camelCase('--foo-bar');
     * // => 'fooBar'
     *
     * _.camelCase('__foo_bar__');
     * // => 'fooBar'
     */
    var camelCase = createCompounder(function(result, word, index) {
      word = word.toLowerCase();
      return result + (index ? capitalize(word) : word);
    });

    /**
     * Converts the first character of `string` to upper case and the remaining
     * to lower case.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to capitalize.
     * @returns {string} Returns the capitalized string.
     * @example
     *
     * _.capitalize('FRED');
     * // => 'Fred'
     */
    function capitalize(string) {
      return upperFirst(toString(string).toLowerCase());
    }

    /**
     * Deburrs `string` by converting [latin-1 supplementary letters](https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block)#Character_table)
     * to basic latin letters and removing [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to deburr.
     * @returns {string} Returns the deburred string.
     * @example
     *
     * _.deburr('déjà vu');
     * // => 'deja vu'
     */
    function deburr(string) {
      string = toString(string);
      return string && string.replace(reLatin1, deburrLetter).replace(reComboMark, '');
    }

    /**
     * Checks if `string` ends with the given target string.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to search.
     * @param {string} [target] The string to search for.
     * @param {number} [position=string.length] The position to search from.
     * @returns {boolean} Returns `true` if `string` ends with `target`, else `false`.
     * @example
     *
     * _.endsWith('abc', 'c');
     * // => true
     *
     * _.endsWith('abc', 'b');
     * // => false
     *
     * _.endsWith('abc', 'b', 2);
     * // => true
     */
    function endsWith(string, target, position) {
      string = toString(string);
      target = typeof target == 'string' ? target : (target + '');

      var length = string.length;
      position = position === undefined
        ? length
        : baseClamp(toInteger(position), 0, length);

      position -= target.length;
      return position >= 0 && string.indexOf(target, position) == position;
    }

    /**
     * Converts the characters "&", "<", ">", '"', "'", and "\`" in `string` to
     * their corresponding HTML entities.
     *
     * **Note:** No other characters are escaped. To escape additional
     * characters use a third-party library like [_he_](https://mths.be/he).
     *
     * Though the ">" character is escaped for symmetry, characters like
     * ">" and "/" don't need escaping in HTML and have no special meaning
     * unless they're part of a tag or unquoted attribute value.
     * See [Mathias Bynens's article](https://mathiasbynens.be/notes/ambiguous-ampersands)
     * (under "semi-related fun fact") for more details.
     *
     * Backticks are escaped because in IE < 9, they can break out of
     * attribute values or HTML comments. See [#59](https://html5sec.org/#59),
     * [#102](https://html5sec.org/#102), [#108](https://html5sec.org/#108), and
     * [#133](https://html5sec.org/#133) of the [HTML5 Security Cheatsheet](https://html5sec.org/)
     * for more details.
     *
     * When working with HTML you should always [quote attribute values](http://wonko.com/post/html-escaping)
     * to reduce XSS vectors.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to escape.
     * @returns {string} Returns the escaped string.
     * @example
     *
     * _.escape('fred, barney, & pebbles');
     * // => 'fred, barney, &amp; pebbles'
     */
    function escape(string) {
      string = toString(string);
      return (string && reHasUnescapedHtml.test(string))
        ? string.replace(reUnescapedHtml, escapeHtmlChar)
        : string;
    }

    /**
     * Escapes the `RegExp` special characters "^", "$", "\", ".", "*", "+",
     * "?", "(", ")", "[", "]", "{", "}", and "|" in `string`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to escape.
     * @returns {string} Returns the escaped string.
     * @example
     *
     * _.escapeRegExp('[lodash](https://lodash.com/)');
     * // => '\[lodash\]\(https://lodash\.com/\)'
     */
    function escapeRegExp(string) {
      string = toString(string);
      return (string && reHasRegExpChar.test(string))
        ? string.replace(reRegExpChar, '\\$&')
        : string;
    }

    /**
     * Converts `string` to [kebab case](https://en.wikipedia.org/wiki/Letter_case#Special_case_styles).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the kebab cased string.
     * @example
     *
     * _.kebabCase('Foo Bar');
     * // => 'foo-bar'
     *
     * _.kebabCase('fooBar');
     * // => 'foo-bar'
     *
     * _.kebabCase('__foo_bar__');
     * // => 'foo-bar'
     */
    var kebabCase = createCompounder(function(result, word, index) {
      return result + (index ? '-' : '') + word.toLowerCase();
    });

    /**
     * Converts `string`, as space separated words, to lower case.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the lower cased string.
     * @example
     *
     * _.lowerCase('--Foo-Bar');
     * // => 'foo bar'
     *
     * _.lowerCase('fooBar');
     * // => 'foo bar'
     *
     * _.lowerCase('__FOO_BAR__');
     * // => 'foo bar'
     */
    var lowerCase = createCompounder(function(result, word, index) {
      return result + (index ? ' ' : '') + word.toLowerCase();
    });

    /**
     * Converts the first character of `string` to lower case.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the converted string.
     * @example
     *
     * _.lowerFirst('Fred');
     * // => 'fred'
     *
     * _.lowerFirst('FRED');
     * // => 'fRED'
     */
    var lowerFirst = createCaseFirst('toLowerCase');

    /**
     * Converts the first character of `string` to upper case.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the converted string.
     * @example
     *
     * _.upperFirst('fred');
     * // => 'Fred'
     *
     * _.upperFirst('FRED');
     * // => 'FRED'
     */
    var upperFirst = createCaseFirst('toUpperCase');

    /**
     * Pads `string` on the left and right sides if it's shorter than `length`.
     * Padding characters are truncated if they can't be evenly divided by `length`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padded string.
     * @example
     *
     * _.pad('abc', 8);
     * // => '  abc   '
     *
     * _.pad('abc', 8, '_-');
     * // => '_-abc_-_'
     *
     * _.pad('abc', 3);
     * // => 'abc'
     */
    function pad(string, length, chars) {
      string = toString(string);
      length = toInteger(length);

      var strLength = stringSize(string);
      if (!length || strLength >= length) {
        return string;
      }
      var mid = (length - strLength) / 2,
          leftLength = nativeFloor(mid),
          rightLength = nativeCeil(mid);

      return createPadding('', leftLength, chars) + string + createPadding('', rightLength, chars);
    }

    /**
     * Pads `string` on the right side if it's shorter than `length`. Padding
     * characters are truncated if they exceed `length`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padded string.
     * @example
     *
     * _.padEnd('abc', 6);
     * // => 'abc   '
     *
     * _.padEnd('abc', 6, '_-');
     * // => 'abc_-_'
     *
     * _.padEnd('abc', 3);
     * // => 'abc'
     */
    function padEnd(string, length, chars) {
      string = toString(string);
      return string + createPadding(string, length, chars);
    }

    /**
     * Pads `string` on the left side if it's shorter than `length`. Padding
     * characters are truncated if they exceed `length`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padded string.
     * @example
     *
     * _.padStart('abc', 6);
     * // => '   abc'
     *
     * _.padStart('abc', 6, '_-');
     * // => '_-_abc'
     *
     * _.padStart('abc', 3);
     * // => 'abc'
     */
    function padStart(string, length, chars) {
      string = toString(string);
      return createPadding(string, length, chars) + string;
    }

    /**
     * Converts `string` to an integer of the specified radix. If `radix` is
     * `undefined` or `0`, a `radix` of `10` is used unless `value` is a hexadecimal,
     * in which case a `radix` of `16` is used.
     *
     * **Note:** This method aligns with the [ES5 implementation](https://es5.github.io/#x15.1.2.2)
     * of `parseInt`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} string The string to convert.
     * @param {number} [radix=10] The radix to interpret `value` by.
     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
     * @returns {number} Returns the converted integer.
     * @example
     *
     * _.parseInt('08');
     * // => 8
     *
     * _.map(['6', '08', '10'], _.parseInt);
     * // => [6, 8, 10]
     */
    function parseInt(string, radix, guard) {
      // Chrome fails to trim leading <BOM> whitespace characters.
      // See https://code.google.com/p/v8/issues/detail?id=3109 for more details.
      if (guard || radix == null) {
        radix = 0;
      } else if (radix) {
        radix = +radix;
      }
      string = toString(string).replace(reTrim, '');
      return nativeParseInt(string, radix || (reHasHexPrefix.test(string) ? 16 : 10));
    }

    /**
     * Repeats the given string `n` times.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to repeat.
     * @param {number} [n=0] The number of times to repeat the string.
     * @returns {string} Returns the repeated string.
     * @example
     *
     * _.repeat('*', 3);
     * // => '***'
     *
     * _.repeat('abc', 2);
     * // => 'abcabc'
     *
     * _.repeat('abc', 0);
     * // => ''
     */
    function repeat(string, n) {
      string = toString(string);
      n = toInteger(n);

      var result = '';
      if (!string || n < 1 || n > MAX_SAFE_INTEGER) {
        return result;
      }
      // Leverage the exponentiation by squaring algorithm for a faster repeat.
      // See https://en.wikipedia.org/wiki/Exponentiation_by_squaring for more details.
      do {
        if (n % 2) {
          result += string;
        }
        n = nativeFloor(n / 2);
        string += string;
      } while (n);

      return result;
    }

    /**
     * Replaces matches for `pattern` in `string` with `replacement`.
     *
     * **Note:** This method is based on [`String#replace`](https://mdn.io/String/replace).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to modify.
     * @param {RegExp|string} pattern The pattern to replace.
     * @param {Function|string} replacement The match replacement.
     * @returns {string} Returns the modified string.
     * @example
     *
     * _.replace('Hi Fred', 'Fred', 'Barney');
     * // => 'Hi Barney'
     */
    function replace() {
      var args = arguments,
          string = toString(args[0]);

      return args.length < 3 ? string : string.replace(args[1], args[2]);
    }

    /**
     * Converts `string` to [snake case](https://en.wikipedia.org/wiki/Snake_case).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the snake cased string.
     * @example
     *
     * _.snakeCase('Foo Bar');
     * // => 'foo_bar'
     *
     * _.snakeCase('fooBar');
     * // => 'foo_bar'
     *
     * _.snakeCase('--foo-bar');
     * // => 'foo_bar'
     */
    var snakeCase = createCompounder(function(result, word, index) {
      return result + (index ? '_' : '') + word.toLowerCase();
    });

    /**
     * Splits `string` by `separator`.
     *
     * **Note:** This method is based on [`String#split`](https://mdn.io/String/split).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to split.
     * @param {RegExp|string} separator The separator pattern to split by.
     * @param {number} [limit] The length to truncate results to.
     * @returns {Array} Returns the new array of string segments.
     * @example
     *
     * _.split('a-b-c', '-', 2);
     * // => ['a', 'b']
     */
    function split(string, separator, limit) {
      return toString(string).split(separator, limit);
    }

    /**
     * Converts `string` to [start case](https://en.wikipedia.org/wiki/Letter_case#Stylistic_or_specialised_usage).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the start cased string.
     * @example
     *
     * _.startCase('--foo-bar');
     * // => 'Foo Bar'
     *
     * _.startCase('fooBar');
     * // => 'Foo Bar'
     *
     * _.startCase('__foo_bar__');
     * // => 'Foo Bar'
     */
    var startCase = createCompounder(function(result, word, index) {
      return result + (index ? ' ' : '') + capitalize(word);
    });

    /**
     * Checks if `string` starts with the given target string.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to search.
     * @param {string} [target] The string to search for.
     * @param {number} [position=0] The position to search from.
     * @returns {boolean} Returns `true` if `string` starts with `target`, else `false`.
     * @example
     *
     * _.startsWith('abc', 'a');
     * // => true
     *
     * _.startsWith('abc', 'b');
     * // => false
     *
     * _.startsWith('abc', 'b', 1);
     * // => true
     */
    function startsWith(string, target, position) {
      string = toString(string);
      position = baseClamp(toInteger(position), 0, string.length);
      return string.lastIndexOf(target, position) == position;
    }

    /**
     * Creates a compiled template function that can interpolate data properties
     * in "interpolate" delimiters, HTML-escape interpolated data properties in
     * "escape" delimiters, and execute JavaScript in "evaluate" delimiters. Data
     * properties may be accessed as free variables in the template. If a setting
     * object is given it takes precedence over `_.templateSettings` values.
     *
     * **Note:** In the development build `_.template` utilizes
     * [sourceURLs](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl)
     * for easier debugging.
     *
     * For more information on precompiling templates see
     * [lodash's custom builds documentation](https://lodash.com/custom-builds).
     *
     * For more information on Chrome extension sandboxes see
     * [Chrome's extensions documentation](https://developer.chrome.com/extensions/sandboxingEval).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The template string.
     * @param {Object} [options] The options object.
     * @param {RegExp} [options.escape] The HTML "escape" delimiter.
     * @param {RegExp} [options.evaluate] The "evaluate" delimiter.
     * @param {Object} [options.imports] An object to import into the template as free variables.
     * @param {RegExp} [options.interpolate] The "interpolate" delimiter.
     * @param {string} [options.sourceURL] The sourceURL of the template's compiled source.
     * @param {string} [options.variable] The data object variable name.
     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
     * @returns {Function} Returns the compiled template function.
     * @example
     *
     * // Use the "interpolate" delimiter to create a compiled template.
     * var compiled = _.template('hello <%= user %>!');
     * compiled({ 'user': 'fred' });
     * // => 'hello fred!'
     *
     * // Use the HTML "escape" delimiter to escape data property values.
     * var compiled = _.template('<b><%- value %></b>');
     * compiled({ 'value': '<script>' });
     * // => '<b>&lt;script&gt;</b>'
     *
     * // Use the "evaluate" delimiter to execute JavaScript and generate HTML.
     * var compiled = _.template('<% _.forEach(users, function(user) { %><li><%- user %></li><% }); %>');
     * compiled({ 'users': ['fred', 'barney'] });
     * // => '<li>fred</li><li>barney</li>'
     *
     * // Use the internal `print` function in "evaluate" delimiters.
     * var compiled = _.template('<% print("hello " + user); %>!');
     * compiled({ 'user': 'barney' });
     * // => 'hello barney!'
     *
     * // Use the ES delimiter as an alternative to the default "interpolate" delimiter.
     * var compiled = _.template('hello ${ user }!');
     * compiled({ 'user': 'pebbles' });
     * // => 'hello pebbles!'
     *
     * // Use custom template delimiters.
     * _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
     * var compiled = _.template('hello {{ user }}!');
     * compiled({ 'user': 'mustache' });
     * // => 'hello mustache!'
     *
     * // Use backslashes to treat delimiters as plain text.
     * var compiled = _.template('<%= "\\<%- value %\\>" %>');
     * compiled({ 'value': 'ignored' });
     * // => '<%- value %>'
     *
     * // Use the `imports` option to import `jQuery` as `jq`.
     * var text = '<% jq.each(users, function(user) { %><li><%- user %></li><% }); %>';
     * var compiled = _.template(text, { 'imports': { 'jq': jQuery } });
     * compiled({ 'users': ['fred', 'barney'] });
     * // => '<li>fred</li><li>barney</li>'
     *
     * // Use the `sourceURL` option to specify a custom sourceURL for the template.
     * var compiled = _.template('hello <%= user %>!', { 'sourceURL': '/basic/greeting.jst' });
     * compiled(data);
     * // => find the source of "greeting.jst" under the Sources tab or Resources panel of the web inspector
     *
     * // Use the `variable` option to ensure a with-statement isn't used in the compiled template.
     * var compiled = _.template('hi <%= data.user %>!', { 'variable': 'data' });
     * compiled.source;
     * // => function(data) {
     * //   var __t, __p = '';
     * //   __p += 'hi ' + ((__t = ( data.user )) == null ? '' : __t) + '!';
     * //   return __p;
     * // }
     *
     * // Use the `source` property to inline compiled templates for meaningful
     * // line numbers in error messages and stack traces.
     * fs.writeFileSync(path.join(cwd, 'jst.js'), '\
     *   var JST = {\
     *     "main": ' + _.template(mainText).source + '\
     *   };\
     * ');
     */
    function template(string, options, guard) {
      // Based on John Resig's `tmpl` implementation (http://ejohn.org/blog/javascript-micro-templating/)
      // and Laura Doktorova's doT.js (https://github.com/olado/doT).
      var settings = lodash.templateSettings;

      if (guard && isIterateeCall(string, options, guard)) {
        options = undefined;
      }
      string = toString(string);
      options = assignInWith({}, options, settings, assignInDefaults);

      var imports = assignInWith({}, options.imports, settings.imports, assignInDefaults),
          importsKeys = keys(imports),
          importsValues = baseValues(imports, importsKeys);

      var isEscaping,
          isEvaluating,
          index = 0,
          interpolate = options.interpolate || reNoMatch,
          source = "__p += '";

      // Compile the regexp to match each delimiter.
      var reDelimiters = RegExp(
        (options.escape || reNoMatch).source + '|' +
        interpolate.source + '|' +
        (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + '|' +
        (options.evaluate || reNoMatch).source + '|$'
      , 'g');

      // Use a sourceURL for easier debugging.
      var sourceURL = '//# sourceURL=' +
        ('sourceURL' in options
          ? options.sourceURL
          : ('lodash.templateSources[' + (++templateCounter) + ']')
        ) + '\n';

      string.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
        interpolateValue || (interpolateValue = esTemplateValue);

        // Escape characters that can't be included in string literals.
        source += string.slice(index, offset).replace(reUnescapedString, escapeStringChar);

        // Replace delimiters with snippets.
        if (escapeValue) {
          isEscaping = true;
          source += "' +\n__e(" + escapeValue + ") +\n'";
        }
        if (evaluateValue) {
          isEvaluating = true;
          source += "';\n" + evaluateValue + ";\n__p += '";
        }
        if (interpolateValue) {
          source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
        }
        index = offset + match.length;

        // The JS engine embedded in Adobe products needs `match` returned in
        // order to produce the correct `offset` value.
        return match;
      });

      source += "';\n";

      // If `variable` is not specified wrap a with-statement around the generated
      // code to add the data object to the top of the scope chain.
      var variable = options.variable;
      if (!variable) {
        source = 'with (obj) {\n' + source + '\n}\n';
      }
      // Cleanup code by stripping empty strings.
      source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source)
        .replace(reEmptyStringMiddle, '$1')
        .replace(reEmptyStringTrailing, '$1;');

      // Frame code as the function body.
      source = 'function(' + (variable || 'obj') + ') {\n' +
        (variable
          ? ''
          : 'obj || (obj = {});\n'
        ) +
        "var __t, __p = ''" +
        (isEscaping
           ? ', __e = _.escape'
           : ''
        ) +
        (isEvaluating
          ? ', __j = Array.prototype.join;\n' +
            "function print() { __p += __j.call(arguments, '') }\n"
          : ';\n'
        ) +
        source +
        'return __p\n}';

      var result = attempt(function() {
        return Function(importsKeys, sourceURL + 'return ' + source)
          .apply(undefined, importsValues);
      });

      // Provide the compiled function's source by its `toString` method or
      // the `source` property as a convenience for inlining compiled templates.
      result.source = source;
      if (isError(result)) {
        throw result;
      }
      return result;
    }

    /**
     * Converts `string`, as a whole, to lower case just like
     * [String#toLowerCase](https://mdn.io/toLowerCase).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the lower cased string.
     * @example
     *
     * _.toLower('--Foo-Bar');
     * // => '--foo-bar'
     *
     * _.toLower('fooBar');
     * // => 'foobar'
     *
     * _.toLower('__FOO_BAR__');
     * // => '__foo_bar__'
     */
    function toLower(value) {
      return toString(value).toLowerCase();
    }

    /**
     * Converts `string`, as a whole, to upper case just like
     * [String#toUpperCase](https://mdn.io/toUpperCase).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the upper cased string.
     * @example
     *
     * _.toUpper('--foo-bar');
     * // => '--FOO-BAR'
     *
     * _.toUpper('fooBar');
     * // => 'FOOBAR'
     *
     * _.toUpper('__foo_bar__');
     * // => '__FOO_BAR__'
     */
    function toUpper(value) {
      return toString(value).toUpperCase();
    }

    /**
     * Removes leading and trailing whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trim('  abc  ');
     * // => 'abc'
     *
     * _.trim('-_-abc-_-', '_-');
     * // => 'abc'
     *
     * _.map(['  foo  ', '  bar  '], _.trim);
     * // => ['foo', 'bar']
     */
    function trim(string, chars, guard) {
      string = toString(string);
      if (!string) {
        return string;
      }
      if (guard || chars === undefined) {
        return string.replace(reTrim, '');
      }
      chars = (chars + '');
      if (!chars) {
        return string;
      }
      var strSymbols = stringToArray(string),
          chrSymbols = stringToArray(chars);

      return strSymbols
        .slice(charsStartIndex(strSymbols, chrSymbols), charsEndIndex(strSymbols, chrSymbols) + 1)
        .join('');
    }

    /**
     * Removes trailing whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trimEnd('  abc  ');
     * // => '  abc'
     *
     * _.trimEnd('-_-abc-_-', '_-');
     * // => '-_-abc'
     */
    function trimEnd(string, chars, guard) {
      string = toString(string);
      if (!string) {
        return string;
      }
      if (guard || chars === undefined) {
        return string.replace(reTrimEnd, '');
      }
      chars = (chars + '');
      if (!chars) {
        return string;
      }
      var strSymbols = stringToArray(string);
      return strSymbols
        .slice(0, charsEndIndex(strSymbols, stringToArray(chars)) + 1)
        .join('');
    }

    /**
     * Removes leading whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trimStart('  abc  ');
     * // => 'abc  '
     *
     * _.trimStart('-_-abc-_-', '_-');
     * // => 'abc-_-'
     */
    function trimStart(string, chars, guard) {
      string = toString(string);
      if (!string) {
        return string;
      }
      if (guard || chars === undefined) {
        return string.replace(reTrimStart, '');
      }
      chars = (chars + '');
      if (!chars) {
        return string;
      }
      var strSymbols = stringToArray(string);
      return strSymbols
        .slice(charsStartIndex(strSymbols, stringToArray(chars)))
        .join('');
    }

    /**
     * Truncates `string` if it's longer than the given maximum string length.
     * The last characters of the truncated string are replaced with the omission
     * string which defaults to "...".
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to truncate.
     * @param {Object} [options=({})] The options object.
     * @param {number} [options.length=30] The maximum string length.
     * @param {string} [options.omission='...'] The string to indicate text is omitted.
     * @param {RegExp|string} [options.separator] The separator pattern to truncate to.
     * @returns {string} Returns the truncated string.
     * @example
     *
     * _.truncate('hi-diddly-ho there, neighborino');
     * // => 'hi-diddly-ho there, neighbo...'
     *
     * _.truncate('hi-diddly-ho there, neighborino', {
     *   'length': 24,
     *   'separator': ' '
     * });
     * // => 'hi-diddly-ho there,...'
     *
     * _.truncate('hi-diddly-ho there, neighborino', {
     *   'length': 24,
     *   'separator': /,? +/
     * });
     * // => 'hi-diddly-ho there...'
     *
     * _.truncate('hi-diddly-ho there, neighborino', {
     *   'omission': ' [...]'
     * });
     * // => 'hi-diddly-ho there, neig [...]'
     */
    function truncate(string, options) {
      var length = DEFAULT_TRUNC_LENGTH,
          omission = DEFAULT_TRUNC_OMISSION;

      if (isObject(options)) {
        var separator = 'separator' in options ? options.separator : separator;
        length = 'length' in options ? toInteger(options.length) : length;
        omission = 'omission' in options ? toString(options.omission) : omission;
      }
      string = toString(string);

      var strLength = string.length;
      if (reHasComplexSymbol.test(string)) {
        var strSymbols = stringToArray(string);
        strLength = strSymbols.length;
      }
      if (length >= strLength) {
        return string;
      }
      var end = length - stringSize(omission);
      if (end < 1) {
        return omission;
      }
      var result = strSymbols
        ? strSymbols.slice(0, end).join('')
        : string.slice(0, end);

      if (separator === undefined) {
        return result + omission;
      }
      if (strSymbols) {
        end += (result.length - end);
      }
      if (isRegExp(separator)) {
        if (string.slice(end).search(separator)) {
          var match,
              substring = result;

          if (!separator.global) {
            separator = RegExp(separator.source, toString(reFlags.exec(separator)) + 'g');
          }
          separator.lastIndex = 0;
          while ((match = separator.exec(substring))) {
            var newEnd = match.index;
          }
          result = result.slice(0, newEnd === undefined ? end : newEnd);
        }
      } else if (string.indexOf(separator, end) != end) {
        var index = result.lastIndexOf(separator);
        if (index > -1) {
          result = result.slice(0, index);
        }
      }
      return result + omission;
    }

    /**
     * The inverse of `_.escape`; this method converts the HTML entities
     * `&amp;`, `&lt;`, `&gt;`, `&quot;`, `&#39;`, and `&#96;` in `string` to their
     * corresponding characters.
     *
     * **Note:** No other HTML entities are unescaped. To unescape additional HTML
     * entities use a third-party library like [_he_](https://mths.be/he).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to unescape.
     * @returns {string} Returns the unescaped string.
     * @example
     *
     * _.unescape('fred, barney, &amp; pebbles');
     * // => 'fred, barney, & pebbles'
     */
    function unescape(string) {
      string = toString(string);
      return (string && reHasEscapedHtml.test(string))
        ? string.replace(reEscapedHtml, unescapeHtmlChar)
        : string;
    }

    /**
     * Converts `string`, as space separated words, to upper case.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the upper cased string.
     * @example
     *
     * _.upperCase('--foo-bar');
     * // => 'FOO BAR'
     *
     * _.upperCase('fooBar');
     * // => 'FOO BAR'
     *
     * _.upperCase('__foo_bar__');
     * // => 'FOO BAR'
     */
    var upperCase = createCompounder(function(result, word, index) {
      return result + (index ? ' ' : '') + word.toUpperCase();
    });

    /**
     * Splits `string` into an array of its words.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to inspect.
     * @param {RegExp|string} [pattern] The pattern to match words.
     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
     * @returns {Array} Returns the words of `string`.
     * @example
     *
     * _.words('fred, barney, & pebbles');
     * // => ['fred', 'barney', 'pebbles']
     *
     * _.words('fred, barney, & pebbles', /[^, ]+/g);
     * // => ['fred', 'barney', '&', 'pebbles']
     */
    function words(string, pattern, guard) {
      string = toString(string);
      pattern = guard ? undefined : pattern;

      if (pattern === undefined) {
        pattern = reHasComplexWord.test(string) ? reComplexWord : reBasicWord;
      }
      return string.match(pattern) || [];
    }

    /*------------------------------------------------------------------------*/

    /**
     * Attempts to invoke `func`, returning either the result or the caught error
     * object. Any additional arguments are provided to `func` when it's invoked.
     *
     * @static
     * @memberOf _
     * @category Util
     * @param {Function} func The function to attempt.
     * @returns {*} Returns the `func` result or error object.
     * @example
     *
     * // Avoid throwing errors for invalid selectors.
     * var elements = _.attempt(function(selector) {
     *   return document.querySelectorAll(selector);
     * }, '>_>');
     *
     * if (_.isError(elements)) {
     *   elements = [];
     * }
     */
    var attempt = rest(function(func, args) {
      try {
        return apply(func, undefined, args);
      } catch (e) {
        return isError(e) ? e : new Error(e);
      }
    });

    /**
     * Binds methods of an object to the object itself, overwriting the existing
     * method.
     *
     * **Note:** This method doesn't set the "length" property of bound functions.
     *
     * @static
     * @memberOf _
     * @category Util
     * @param {Object} object The object to bind and assign the bound methods to.
     * @param {...(string|string[])} methodNames The object method names to bind,
     *  specified individually or in arrays.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var view = {
     *   'label': 'docs',
     *   'onClick': function() {
     *     console.log('clicked ' + this.label);
     *   }
     * };
     *
     * _.bindAll(view, 'onClick');
     * jQuery(element).on('click', view.onClick);
     * // => logs 'clicked docs' when clicked
     */
    var bindAll = rest(function(object, methodNames) {
      arrayEach(baseFlatten(methodNames, 1), function(key) {
        object[key] = bind(object[key], object);
      });
      return object;
    });

    /**
     * Creates a function that iterates over `pairs` invoking the corresponding
     * function of the first predicate to return truthy. The predicate-function
     * pairs are invoked with the `this` binding and arguments of the created
     * function.
     *
     * @static
     * @memberOf _
     * @category Util
     * @param {Array} pairs The predicate-function pairs.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var func = _.cond([
     *   [_.matches({ 'a': 1 }),           _.constant('matches A')],
     *   [_.conforms({ 'b': _.isNumber }), _.constant('matches B')],
     *   [_.constant(true),                _.constant('no match')]
     * ]);
     *
     * func({ 'a': 1, 'b': 2 });
     * // => 'matches A'
     *
     * func({ 'a': 0, 'b': 1 });
     * // => 'matches B'
     *
     * func({ 'a': '1', 'b': '2' });
     * // => 'no match'
     */
    function cond(pairs) {
      var length = pairs ? pairs.length : 0,
          toIteratee = getIteratee();

      pairs = !length ? [] : arrayMap(pairs, function(pair) {
        if (typeof pair[1] != 'function') {
          throw new TypeError(FUNC_ERROR_TEXT);
        }
        return [toIteratee(pair[0]), pair[1]];
      });

      return rest(function(args) {
        var index = -1;
        while (++index < length) {
          var pair = pairs[index];
          if (apply(pair[0], this, args)) {
            return apply(pair[1], this, args);
          }
        }
      });
    }

    /**
     * Creates a function that invokes the predicate properties of `source` with
     * the corresponding property values of a given object, returning `true` if
     * all predicates return truthy, else `false`.
     *
     * @static
     * @memberOf _
     * @category Util
     * @param {Object} source The object of property predicates to conform to.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * _.filter(users, _.conforms({ 'age': _.partial(_.gt, _, 38) }));
     * // => [{ 'user': 'fred', 'age': 40 }]
     */
    function conforms(source) {
      return baseConforms(baseClone(source, true));
    }

    /**
     * Creates a function that returns `value`.
     *
     * @static
     * @memberOf _
     * @category Util
     * @param {*} value The value to return from the new function.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var object = { 'user': 'fred' };
     * var getter = _.constant(object);
     *
     * getter() === object;
     * // => true
     */
    function constant(value) {
      return function() {
        return value;
      };
    }

    /**
     * Creates a function that returns the result of invoking the given functions
     * with the `this` binding of the created function, where each successive
     * invocation is supplied the return value of the previous.
     *
     * @static
     * @memberOf _
     * @category Util
     * @param {...(Function|Function[])} [funcs] Functions to invoke.
     * @returns {Function} Returns the new function.
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var addSquare = _.flow(_.add, square);
     * addSquare(1, 2);
     * // => 9
     */
    var flow = createFlow();

    /**
     * This method is like `_.flow` except that it creates a function that
     * invokes the given functions from right to left.
     *
     * @static
     * @memberOf _
     * @category Util
     * @param {...(Function|Function[])} [funcs] Functions to invoke.
     * @returns {Function} Returns the new function.
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var addSquare = _.flowRight(square, _.add);
     * addSquare(1, 2);
     * // => 9
     */
    var flowRight = createFlow(true);

    /**
     * This method returns the first argument given to it.
     *
     * @static
     * @memberOf _
     * @category Util
     * @param {*} value Any value.
     * @returns {*} Returns `value`.
     * @example
     *
     * var object = { 'user': 'fred' };
     *
     * _.identity(object) === object;
     * // => true
     */
    function identity(value) {
      return value;
    }

    /**
     * Creates a function that invokes `func` with the arguments of the created
     * function. If `func` is a property name the created callback returns the
     * property value for a given element. If `func` is an object the created
     * callback returns `true` for elements that contain the equivalent object
     * properties, otherwise it returns `false`.
     *
     * @static
     * @memberOf _
     * @category Util
     * @param {*} [func=_.identity] The value to convert to a callback.
     * @returns {Function} Returns the callback.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * // Create custom iteratee shorthands.
     * _.iteratee = _.wrap(_.iteratee, function(callback, func) {
     *   var p = /^(\S+)\s*([<>])\s*(\S+)$/.exec(func);
     *   return !p ? callback(func) : function(object) {
     *     return (p[2] == '>' ? object[p[1]] > p[3] : object[p[1]] < p[3]);
     *   };
     * });
     *
     * _.filter(users, 'age > 36');
     * // => [{ 'user': 'fred', 'age': 40 }]
     */
    function iteratee(func) {
      return baseIteratee(typeof func == 'function' ? func : baseClone(func, true));
    }

    /**
     * Creates a function that performs a partial deep comparison between a given
     * object and `source`, returning `true` if the given object has equivalent
     * property values, else `false`. The created function is equivalent to
     * `_.isMatch` with a `source` partially applied.
     *
     * **Note:** This method supports comparing the same values as `_.isEqual`.
     *
     * @static
     * @memberOf _
     * @category Util
     * @param {Object} source The object of property values to match.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': true },
     *   { 'user': 'fred',   'age': 40, 'active': false }
     * ];
     *
     * _.filter(users, _.matches({ 'age': 40, 'active': false }));
     * // => [{ 'user': 'fred', 'age': 40, 'active': false }]
     */
    function matches(source) {
      return baseMatches(baseClone(source, true));
    }

    /**
     * Creates a function that performs a partial deep comparison between the
     * value at `path` of a given object to `srcValue`, returning `true` if the
     * object value is equivalent, else `false`.
     *
     * **Note:** This method supports comparing the same values as `_.isEqual`.
     *
     * @static
     * @memberOf _
     * @category Util
     * @param {Array|string} path The path of the property to get.
     * @param {*} srcValue The value to match.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var users = [
     *   { 'user': 'barney' },
     *   { 'user': 'fred' }
     * ];
     *
     * _.find(users, _.matchesProperty('user', 'fred'));
     * // => { 'user': 'fred' }
     */
    function matchesProperty(path, srcValue) {
      return baseMatchesProperty(path, baseClone(srcValue, true));
    }

    /**
     * Creates a function that invokes the method at `path` of a given object.
     * Any additional arguments are provided to the invoked method.
     *
     * @static
     * @memberOf _
     * @category Util
     * @param {Array|string} path The path of the method to invoke.
     * @param {...*} [args] The arguments to invoke the method with.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var objects = [
     *   { 'a': { 'b': { 'c': _.constant(2) } } },
     *   { 'a': { 'b': { 'c': _.constant(1) } } }
     * ];
     *
     * _.map(objects, _.method('a.b.c'));
     * // => [2, 1]
     *
     * _.invokeMap(_.sortBy(objects, _.method(['a', 'b', 'c'])), 'a.b.c');
     * // => [1, 2]
     */
    var method = rest(function(path, args) {
      return function(object) {
        return baseInvoke(object, path, args);
      };
    });

    /**
     * The opposite of `_.method`; this method creates a function that invokes
     * the method at a given path of `object`. Any additional arguments are
     * provided to the invoked method.
     *
     * @static
     * @memberOf _
     * @category Util
     * @param {Object} object The object to query.
     * @param {...*} [args] The arguments to invoke the method with.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var array = _.times(3, _.constant),
     *     object = { 'a': array, 'b': array, 'c': array };
     *
     * _.map(['a[2]', 'c[0]'], _.methodOf(object));
     * // => [2, 0]
     *
     * _.map([['a', '2'], ['c', '0']], _.methodOf(object));
     * // => [2, 0]
     */
    var methodOf = rest(function(object, args) {
      return function(path) {
        return baseInvoke(object, path, args);
      };
    });

    /**
     * Adds all own enumerable function properties of a source object to the
     * destination object. If `object` is a function then methods are added to
     * its prototype as well.
     *
     * **Note:** Use `_.runInContext` to create a pristine `lodash` function to
     * avoid conflicts caused by modifying the original.
     *
     * @static
     * @memberOf _
     * @category Util
     * @param {Function|Object} [object=lodash] The destination object.
     * @param {Object} source The object of functions to add.
     * @param {Object} [options] The options object.
     * @param {boolean} [options.chain=true] Specify whether the functions added
     *  are chainable.
     * @returns {Function|Object} Returns `object`.
     * @example
     *
     * function vowels(string) {
     *   return _.filter(string, function(v) {
     *     return /[aeiou]/i.test(v);
     *   });
     * }
     *
     * _.mixin({ 'vowels': vowels });
     * _.vowels('fred');
     * // => ['e']
     *
     * _('fred').vowels().value();
     * // => ['e']
     *
     * _.mixin({ 'vowels': vowels }, { 'chain': false });
     * _('fred').vowels();
     * // => ['e']
     */
    function mixin(object, source, options) {
      var props = keys(source),
          methodNames = baseFunctions(source, props);

      if (options == null &&
          !(isObject(source) && (methodNames.length || !props.length))) {
        options = source;
        source = object;
        object = this;
        methodNames = baseFunctions(source, keys(source));
      }
      var chain = (isObject(options) && 'chain' in options) ? options.chain : true,
          isFunc = isFunction(object);

      arrayEach(methodNames, function(methodName) {
        var func = source[methodName];
        object[methodName] = func;
        if (isFunc) {
          object.prototype[methodName] = function() {
            var chainAll = this.__chain__;
            if (chain || chainAll) {
              var result = object(this.__wrapped__),
                  actions = result.__actions__ = copyArray(this.__actions__);

              actions.push({ 'func': func, 'args': arguments, 'thisArg': object });
              result.__chain__ = chainAll;
              return result;
            }
            return func.apply(object, arrayPush([this.value()], arguments));
          };
        }
      });

      return object;
    }

    /**
     * Reverts the `_` variable to its previous value and returns a reference to
     * the `lodash` function.
     *
     * @static
     * @memberOf _
     * @category Util
     * @returns {Function} Returns the `lodash` function.
     * @example
     *
     * var lodash = _.noConflict();
     */
    function noConflict() {
      if (root._ === this) {
        root._ = oldDash;
      }
      return this;
    }

    /**
     * A no-operation function that returns `undefined` regardless of the
     * arguments it receives.
     *
     * @static
     * @memberOf _
     * @category Util
     * @example
     *
     * var object = { 'user': 'fred' };
     *
     * _.noop(object) === undefined;
     * // => true
     */
    function noop() {
      // No operation performed.
    }

    /**
     * Creates a function that returns its nth argument.
     *
     * @static
     * @memberOf _
     * @category Util
     * @param {number} [n=0] The index of the argument to return.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var func = _.nthArg(1);
     *
     * func('a', 'b', 'c');
     * // => 'b'
     */
    function nthArg(n) {
      n = toInteger(n);
      return function() {
        return arguments[n];
      };
    }

    /**
     * Creates a function that invokes `iteratees` with the arguments provided
     * to the created function and returns their results.
     *
     * @static
     * @memberOf _
     * @category Util
     * @param {...(Function|Function[])} iteratees The iteratees to invoke.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var func = _.over(Math.max, Math.min);
     *
     * func(1, 2, 3, 4);
     * // => [4, 1]
     */
    var over = createOver(arrayMap);

    /**
     * Creates a function that checks if **all** of the `predicates` return
     * truthy when invoked with the arguments provided to the created function.
     *
     * @static
     * @memberOf _
     * @category Util
     * @param {...(Function|Function[])} predicates The predicates to check.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var func = _.overEvery(Boolean, isFinite);
     *
     * func('1');
     * // => true
     *
     * func(null);
     * // => false
     *
     * func(NaN);
     * // => false
     */
    var overEvery = createOver(arrayEvery);

    /**
     * Creates a function that checks if **any** of the `predicates` return
     * truthy when invoked with the arguments provided to the created function.
     *
     * @static
     * @memberOf _
     * @category Util
     * @param {...(Function|Function[])} predicates The predicates to check.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var func = _.overSome(Boolean, isFinite);
     *
     * func('1');
     * // => true
     *
     * func(null);
     * // => true
     *
     * func(NaN);
     * // => false
     */
    var overSome = createOver(arraySome);

    /**
     * Creates a function that returns the value at `path` of a given object.
     *
     * @static
     * @memberOf _
     * @category Util
     * @param {Array|string} path The path of the property to get.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var objects = [
     *   { 'a': { 'b': { 'c': 2 } } },
     *   { 'a': { 'b': { 'c': 1 } } }
     * ];
     *
     * _.map(objects, _.property('a.b.c'));
     * // => [2, 1]
     *
     * _.map(_.sortBy(objects, _.property(['a', 'b', 'c'])), 'a.b.c');
     * // => [1, 2]
     */
    function property(path) {
      return isKey(path) ? baseProperty(path) : basePropertyDeep(path);
    }

    /**
     * The opposite of `_.property`; this method creates a function that returns
     * the value at a given path of `object`.
     *
     * @static
     * @memberOf _
     * @category Util
     * @param {Object} object The object to query.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var array = [0, 1, 2],
     *     object = { 'a': array, 'b': array, 'c': array };
     *
     * _.map(['a[2]', 'c[0]'], _.propertyOf(object));
     * // => [2, 0]
     *
     * _.map([['a', '2'], ['c', '0']], _.propertyOf(object));
     * // => [2, 0]
     */
    function propertyOf(object) {
      return function(path) {
        return object == null ? undefined : baseGet(object, path);
      };
    }

    /**
     * Creates an array of numbers (positive and/or negative) progressing from
     * `start` up to, but not including, `end`. A step of `-1` is used if a negative
     * `start` is specified without an `end` or `step`. If `end` is not specified
     * it's set to `start` with `start` then set to `0`.
     *
     * **Note:** JavaScript follows the IEEE-754 standard for resolving
     * floating-point values which can produce unexpected results.
     *
     * @static
     * @memberOf _
     * @category Util
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @param {number} [step=1] The value to increment or decrement by.
     * @returns {Array} Returns the new array of numbers.
     * @example
     *
     * _.range(4);
     * // => [0, 1, 2, 3]
     *
     * _.range(-4);
     * // => [0, -1, -2, -3]
     *
     * _.range(1, 5);
     * // => [1, 2, 3, 4]
     *
     * _.range(0, 20, 5);
     * // => [0, 5, 10, 15]
     *
     * _.range(0, -4, -1);
     * // => [0, -1, -2, -3]
     *
     * _.range(1, 4, 0);
     * // => [1, 1, 1]
     *
     * _.range(0);
     * // => []
     */
    var range = createRange();

    /**
     * This method is like `_.range` except that it populates values in
     * descending order.
     *
     * @static
     * @memberOf _
     * @category Util
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @param {number} [step=1] The value to increment or decrement by.
     * @returns {Array} Returns the new array of numbers.
     * @example
     *
     * _.rangeRight(4);
     * // => [3, 2, 1, 0]
     *
     * _.rangeRight(-4);
     * // => [-3, -2, -1, 0]
     *
     * _.rangeRight(1, 5);
     * // => [4, 3, 2, 1]
     *
     * _.rangeRight(0, 20, 5);
     * // => [15, 10, 5, 0]
     *
     * _.rangeRight(0, -4, -1);
     * // => [-3, -2, -1, 0]
     *
     * _.rangeRight(1, 4, 0);
     * // => [1, 1, 1]
     *
     * _.rangeRight(0);
     * // => []
     */
    var rangeRight = createRange(true);

    /**
     * Invokes the iteratee `n` times, returning an array of the results of
     * each invocation. The iteratee is invoked with one argument; (index).
     *
     * @static
     * @memberOf _
     * @category Util
     * @param {number} n The number of times to invoke `iteratee`.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the array of results.
     * @example
     *
     * _.times(3, String);
     * // => ['0', '1', '2']
     *
     *  _.times(4, _.constant(true));
     * // => [true, true, true, true]
     */
    function times(n, iteratee) {
      n = toInteger(n);
      if (n < 1 || n > MAX_SAFE_INTEGER) {
        return [];
      }
      var index = MAX_ARRAY_LENGTH,
          length = nativeMin(n, MAX_ARRAY_LENGTH);

      iteratee = baseCastFunction(iteratee);
      n -= MAX_ARRAY_LENGTH;

      var result = baseTimes(length, iteratee);
      while (++index < n) {
        iteratee(index);
      }
      return result;
    }

    /**
     * Converts `value` to a property path array.
     *
     * @static
     * @memberOf _
     * @category Util
     * @param {*} value The value to convert.
     * @returns {Array} Returns the new property path array.
     * @example
     *
     * _.toPath('a.b.c');
     * // => ['a', 'b', 'c']
     *
     * _.toPath('a[0].b.c');
     * // => ['a', '0', 'b', 'c']
     *
     * var path = ['a', 'b', 'c'],
     *     newPath = _.toPath(path);
     *
     * console.log(newPath);
     * // => ['a', 'b', 'c']
     *
     * console.log(path === newPath);
     * // => false
     */
    function toPath(value) {
      return isArray(value) ? arrayMap(value, String) : stringToPath(value);
    }

    /**
     * Generates a unique ID. If `prefix` is given the ID is appended to it.
     *
     * @static
     * @memberOf _
     * @category Util
     * @param {string} [prefix=''] The value to prefix the ID with.
     * @returns {string} Returns the unique ID.
     * @example
     *
     * _.uniqueId('contact_');
     * // => 'contact_104'
     *
     * _.uniqueId();
     * // => '105'
     */
    function uniqueId(prefix) {
      var id = ++idCounter;
      return toString(prefix) + id;
    }

    /*------------------------------------------------------------------------*/

    /**
     * Adds two numbers.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {number} augend The first number in an addition.
     * @param {number} addend The second number in an addition.
     * @returns {number} Returns the total.
     * @example
     *
     * _.add(6, 4);
     * // => 10
     */
    function add(augend, addend) {
      var result;
      if (augend === undefined && addend === undefined) {
        return 0;
      }
      if (augend !== undefined) {
        result = augend;
      }
      if (addend !== undefined) {
        result = result === undefined ? addend : (result + addend);
      }
      return result;
    }

    /**
     * Computes `number` rounded up to `precision`.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {number} number The number to round up.
     * @param {number} [precision=0] The precision to round up to.
     * @returns {number} Returns the rounded up number.
     * @example
     *
     * _.ceil(4.006);
     * // => 5
     *
     * _.ceil(6.004, 2);
     * // => 6.01
     *
     * _.ceil(6040, -2);
     * // => 6100
     */
    var ceil = createRound('ceil');

    /**
     * Computes `number` rounded down to `precision`.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {number} number The number to round down.
     * @param {number} [precision=0] The precision to round down to.
     * @returns {number} Returns the rounded down number.
     * @example
     *
     * _.floor(4.006);
     * // => 4
     *
     * _.floor(0.046, 2);
     * // => 0.04
     *
     * _.floor(4060, -2);
     * // => 4000
     */
    var floor = createRound('floor');

    /**
     * Computes the maximum value of `array`. If `array` is empty or falsey
     * `undefined` is returned.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {Array} array The array to iterate over.
     * @returns {*} Returns the maximum value.
     * @example
     *
     * _.max([4, 2, 8, 6]);
     * // => 8
     *
     * _.max([]);
     * // => undefined
     */
    function max(array) {
      return (array && array.length)
        ? baseExtremum(array, identity, gt)
        : undefined;
    }

    /**
     * This method is like `_.max` except that it accepts `iteratee` which is
     * invoked for each element in `array` to generate the criterion by which
     * the value is ranked. The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {Array} array The array to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {*} Returns the maximum value.
     * @example
     *
     * var objects = [{ 'n': 1 }, { 'n': 2 }];
     *
     * _.maxBy(objects, function(o) { return o.n; });
     * // => { 'n': 2 }
     *
     * // The `_.property` iteratee shorthand.
     * _.maxBy(objects, 'n');
     * // => { 'n': 2 }
     */
    function maxBy(array, iteratee) {
      return (array && array.length)
        ? baseExtremum(array, getIteratee(iteratee), gt)
        : undefined;
    }

    /**
     * Computes the mean of the values in `array`.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {Array} array The array to iterate over.
     * @returns {number} Returns the mean.
     * @example
     *
     * _.mean([4, 2, 8, 6]);
     * // => 5
     */
    function mean(array) {
      return sum(array) / (array ? array.length : 0);
    }

    /**
     * Computes the minimum value of `array`. If `array` is empty or falsey
     * `undefined` is returned.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {Array} array The array to iterate over.
     * @returns {*} Returns the minimum value.
     * @example
     *
     * _.min([4, 2, 8, 6]);
     * // => 2
     *
     * _.min([]);
     * // => undefined
     */
    function min(array) {
      return (array && array.length)
        ? baseExtremum(array, identity, lt)
        : undefined;
    }

    /**
     * This method is like `_.min` except that it accepts `iteratee` which is
     * invoked for each element in `array` to generate the criterion by which
     * the value is ranked. The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {Array} array The array to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {*} Returns the minimum value.
     * @example
     *
     * var objects = [{ 'n': 1 }, { 'n': 2 }];
     *
     * _.minBy(objects, function(o) { return o.n; });
     * // => { 'n': 1 }
     *
     * // The `_.property` iteratee shorthand.
     * _.minBy(objects, 'n');
     * // => { 'n': 1 }
     */
    function minBy(array, iteratee) {
      return (array && array.length)
        ? baseExtremum(array, getIteratee(iteratee), lt)
        : undefined;
    }

    /**
     * Computes `number` rounded to `precision`.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {number} number The number to round.
     * @param {number} [precision=0] The precision to round to.
     * @returns {number} Returns the rounded number.
     * @example
     *
     * _.round(4.006);
     * // => 4
     *
     * _.round(4.006, 2);
     * // => 4.01
     *
     * _.round(4060, -2);
     * // => 4100
     */
    var round = createRound('round');

    /**
     * Subtract two numbers.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {number} minuend The first number in a subtraction.
     * @param {number} subtrahend The second number in a subtraction.
     * @returns {number} Returns the difference.
     * @example
     *
     * _.subtract(6, 4);
     * // => 2
     */
    function subtract(minuend, subtrahend) {
      var result;
      if (minuend === undefined && subtrahend === undefined) {
        return 0;
      }
      if (minuend !== undefined) {
        result = minuend;
      }
      if (subtrahend !== undefined) {
        result = result === undefined ? subtrahend : (result - subtrahend);
      }
      return result;
    }

    /**
     * Computes the sum of the values in `array`.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {Array} array The array to iterate over.
     * @returns {number} Returns the sum.
     * @example
     *
     * _.sum([4, 2, 8, 6]);
     * // => 20
     */
    function sum(array) {
      return (array && array.length)
        ? baseSum(array, identity)
        : 0;
    }

    /**
     * This method is like `_.sum` except that it accepts `iteratee` which is
     * invoked for each element in `array` to generate the value to be summed.
     * The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {Array} array The array to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {number} Returns the sum.
     * @example
     *
     * var objects = [{ 'n': 4 }, { 'n': 2 }, { 'n': 8 }, { 'n': 6 }];
     *
     * _.sumBy(objects, function(o) { return o.n; });
     * // => 20
     *
     * // The `_.property` iteratee shorthand.
     * _.sumBy(objects, 'n');
     * // => 20
     */
    function sumBy(array, iteratee) {
      return (array && array.length)
        ? baseSum(array, getIteratee(iteratee))
        : 0;
    }

    /*------------------------------------------------------------------------*/

    // Ensure wrappers are instances of `baseLodash`.
    lodash.prototype = baseLodash.prototype;
    lodash.prototype.constructor = lodash;

    LodashWrapper.prototype = baseCreate(baseLodash.prototype);
    LodashWrapper.prototype.constructor = LodashWrapper;

    LazyWrapper.prototype = baseCreate(baseLodash.prototype);
    LazyWrapper.prototype.constructor = LazyWrapper;

    // Avoid inheriting from `Object.prototype` when possible.
    Hash.prototype = nativeCreate ? nativeCreate(null) : objectProto;

    // Add functions to the `MapCache`.
    MapCache.prototype.clear = mapClear;
    MapCache.prototype['delete'] = mapDelete;
    MapCache.prototype.get = mapGet;
    MapCache.prototype.has = mapHas;
    MapCache.prototype.set = mapSet;

    // Add functions to the `SetCache`.
    SetCache.prototype.push = cachePush;

    // Add functions to the `Stack` cache.
    Stack.prototype.clear = stackClear;
    Stack.prototype['delete'] = stackDelete;
    Stack.prototype.get = stackGet;
    Stack.prototype.has = stackHas;
    Stack.prototype.set = stackSet;

    // Assign cache to `_.memoize`.
    memoize.Cache = MapCache;

    // Add functions that return wrapped values when chaining.
    lodash.after = after;
    lodash.ary = ary;
    lodash.assign = assign;
    lodash.assignIn = assignIn;
    lodash.assignInWith = assignInWith;
    lodash.assignWith = assignWith;
    lodash.at = at;
    lodash.before = before;
    lodash.bind = bind;
    lodash.bindAll = bindAll;
    lodash.bindKey = bindKey;
    lodash.castArray = castArray;
    lodash.chain = chain;
    lodash.chunk = chunk;
    lodash.compact = compact;
    lodash.concat = concat;
    lodash.cond = cond;
    lodash.conforms = conforms;
    lodash.constant = constant;
    lodash.countBy = countBy;
    lodash.create = create;
    lodash.curry = curry;
    lodash.curryRight = curryRight;
    lodash.debounce = debounce;
    lodash.defaults = defaults;
    lodash.defaultsDeep = defaultsDeep;
    lodash.defer = defer;
    lodash.delay = delay;
    lodash.difference = difference;
    lodash.differenceBy = differenceBy;
    lodash.differenceWith = differenceWith;
    lodash.drop = drop;
    lodash.dropRight = dropRight;
    lodash.dropRightWhile = dropRightWhile;
    lodash.dropWhile = dropWhile;
    lodash.fill = fill;
    lodash.filter = filter;
    lodash.flatMap = flatMap;
    lodash.flatten = flatten;
    lodash.flattenDeep = flattenDeep;
    lodash.flattenDepth = flattenDepth;
    lodash.flip = flip;
    lodash.flow = flow;
    lodash.flowRight = flowRight;
    lodash.fromPairs = fromPairs;
    lodash.functions = functions;
    lodash.functionsIn = functionsIn;
    lodash.groupBy = groupBy;
    lodash.initial = initial;
    lodash.intersection = intersection;
    lodash.intersectionBy = intersectionBy;
    lodash.intersectionWith = intersectionWith;
    lodash.invert = invert;
    lodash.invertBy = invertBy;
    lodash.invokeMap = invokeMap;
    lodash.iteratee = iteratee;
    lodash.keyBy = keyBy;
    lodash.keys = keys;
    lodash.keysIn = keysIn;
    lodash.map = map;
    lodash.mapKeys = mapKeys;
    lodash.mapValues = mapValues;
    lodash.matches = matches;
    lodash.matchesProperty = matchesProperty;
    lodash.memoize = memoize;
    lodash.merge = merge;
    lodash.mergeWith = mergeWith;
    lodash.method = method;
    lodash.methodOf = methodOf;
    lodash.mixin = mixin;
    lodash.negate = negate;
    lodash.nthArg = nthArg;
    lodash.omit = omit;
    lodash.omitBy = omitBy;
    lodash.once = once;
    lodash.orderBy = orderBy;
    lodash.over = over;
    lodash.overArgs = overArgs;
    lodash.overEvery = overEvery;
    lodash.overSome = overSome;
    lodash.partial = partial;
    lodash.partialRight = partialRight;
    lodash.partition = partition;
    lodash.pick = pick;
    lodash.pickBy = pickBy;
    lodash.property = property;
    lodash.propertyOf = propertyOf;
    lodash.pull = pull;
    lodash.pullAll = pullAll;
    lodash.pullAllBy = pullAllBy;
    lodash.pullAllWith = pullAllWith;
    lodash.pullAt = pullAt;
    lodash.range = range;
    lodash.rangeRight = rangeRight;
    lodash.rearg = rearg;
    lodash.reject = reject;
    lodash.remove = remove;
    lodash.rest = rest;
    lodash.reverse = reverse;
    lodash.sampleSize = sampleSize;
    lodash.set = set;
    lodash.setWith = setWith;
    lodash.shuffle = shuffle;
    lodash.slice = slice;
    lodash.sortBy = sortBy;
    lodash.sortedUniq = sortedUniq;
    lodash.sortedUniqBy = sortedUniqBy;
    lodash.split = split;
    lodash.spread = spread;
    lodash.tail = tail;
    lodash.take = take;
    lodash.takeRight = takeRight;
    lodash.takeRightWhile = takeRightWhile;
    lodash.takeWhile = takeWhile;
    lodash.tap = tap;
    lodash.throttle = throttle;
    lodash.thru = thru;
    lodash.toArray = toArray;
    lodash.toPairs = toPairs;
    lodash.toPairsIn = toPairsIn;
    lodash.toPath = toPath;
    lodash.toPlainObject = toPlainObject;
    lodash.transform = transform;
    lodash.unary = unary;
    lodash.union = union;
    lodash.unionBy = unionBy;
    lodash.unionWith = unionWith;
    lodash.uniq = uniq;
    lodash.uniqBy = uniqBy;
    lodash.uniqWith = uniqWith;
    lodash.unset = unset;
    lodash.unzip = unzip;
    lodash.unzipWith = unzipWith;
    lodash.update = update;
    lodash.updateWith = updateWith;
    lodash.values = values;
    lodash.valuesIn = valuesIn;
    lodash.without = without;
    lodash.words = words;
    lodash.wrap = wrap;
    lodash.xor = xor;
    lodash.xorBy = xorBy;
    lodash.xorWith = xorWith;
    lodash.zip = zip;
    lodash.zipObject = zipObject;
    lodash.zipObjectDeep = zipObjectDeep;
    lodash.zipWith = zipWith;

    // Add aliases.
    lodash.extend = assignIn;
    lodash.extendWith = assignInWith;

    // Add functions to `lodash.prototype`.
    mixin(lodash, lodash);

    /*------------------------------------------------------------------------*/

    // Add functions that return unwrapped values when chaining.
    lodash.add = add;
    lodash.attempt = attempt;
    lodash.camelCase = camelCase;
    lodash.capitalize = capitalize;
    lodash.ceil = ceil;
    lodash.clamp = clamp;
    lodash.clone = clone;
    lodash.cloneDeep = cloneDeep;
    lodash.cloneDeepWith = cloneDeepWith;
    lodash.cloneWith = cloneWith;
    lodash.deburr = deburr;
    lodash.endsWith = endsWith;
    lodash.eq = eq;
    lodash.escape = escape;
    lodash.escapeRegExp = escapeRegExp;
    lodash.every = every;
    lodash.find = find;
    lodash.findIndex = findIndex;
    lodash.findKey = findKey;
    lodash.findLast = findLast;
    lodash.findLastIndex = findLastIndex;
    lodash.findLastKey = findLastKey;
    lodash.floor = floor;
    lodash.forEach = forEach;
    lodash.forEachRight = forEachRight;
    lodash.forIn = forIn;
    lodash.forInRight = forInRight;
    lodash.forOwn = forOwn;
    lodash.forOwnRight = forOwnRight;
    lodash.get = get;
    lodash.gt = gt;
    lodash.gte = gte;
    lodash.has = has;
    lodash.hasIn = hasIn;
    lodash.head = head;
    lodash.identity = identity;
    lodash.includes = includes;
    lodash.indexOf = indexOf;
    lodash.inRange = inRange;
    lodash.invoke = invoke;
    lodash.isArguments = isArguments;
    lodash.isArray = isArray;
    lodash.isArrayBuffer = isArrayBuffer;
    lodash.isArrayLike = isArrayLike;
    lodash.isArrayLikeObject = isArrayLikeObject;
    lodash.isBoolean = isBoolean;
    lodash.isBuffer = isBuffer;
    lodash.isDate = isDate;
    lodash.isElement = isElement;
    lodash.isEmpty = isEmpty;
    lodash.isEqual = isEqual;
    lodash.isEqualWith = isEqualWith;
    lodash.isError = isError;
    lodash.isFinite = isFinite;
    lodash.isFunction = isFunction;
    lodash.isInteger = isInteger;
    lodash.isLength = isLength;
    lodash.isMap = isMap;
    lodash.isMatch = isMatch;
    lodash.isMatchWith = isMatchWith;
    lodash.isNaN = isNaN;
    lodash.isNative = isNative;
    lodash.isNil = isNil;
    lodash.isNull = isNull;
    lodash.isNumber = isNumber;
    lodash.isObject = isObject;
    lodash.isObjectLike = isObjectLike;
    lodash.isPlainObject = isPlainObject;
    lodash.isRegExp = isRegExp;
    lodash.isSafeInteger = isSafeInteger;
    lodash.isSet = isSet;
    lodash.isString = isString;
    lodash.isSymbol = isSymbol;
    lodash.isTypedArray = isTypedArray;
    lodash.isUndefined = isUndefined;
    lodash.isWeakMap = isWeakMap;
    lodash.isWeakSet = isWeakSet;
    lodash.join = join;
    lodash.kebabCase = kebabCase;
    lodash.last = last;
    lodash.lastIndexOf = lastIndexOf;
    lodash.lowerCase = lowerCase;
    lodash.lowerFirst = lowerFirst;
    lodash.lt = lt;
    lodash.lte = lte;
    lodash.max = max;
    lodash.maxBy = maxBy;
    lodash.mean = mean;
    lodash.min = min;
    lodash.minBy = minBy;
    lodash.noConflict = noConflict;
    lodash.noop = noop;
    lodash.now = now;
    lodash.pad = pad;
    lodash.padEnd = padEnd;
    lodash.padStart = padStart;
    lodash.parseInt = parseInt;
    lodash.random = random;
    lodash.reduce = reduce;
    lodash.reduceRight = reduceRight;
    lodash.repeat = repeat;
    lodash.replace = replace;
    lodash.result = result;
    lodash.round = round;
    lodash.runInContext = runInContext;
    lodash.sample = sample;
    lodash.size = size;
    lodash.snakeCase = snakeCase;
    lodash.some = some;
    lodash.sortedIndex = sortedIndex;
    lodash.sortedIndexBy = sortedIndexBy;
    lodash.sortedIndexOf = sortedIndexOf;
    lodash.sortedLastIndex = sortedLastIndex;
    lodash.sortedLastIndexBy = sortedLastIndexBy;
    lodash.sortedLastIndexOf = sortedLastIndexOf;
    lodash.startCase = startCase;
    lodash.startsWith = startsWith;
    lodash.subtract = subtract;
    lodash.sum = sum;
    lodash.sumBy = sumBy;
    lodash.template = template;
    lodash.times = times;
    lodash.toInteger = toInteger;
    lodash.toLength = toLength;
    lodash.toLower = toLower;
    lodash.toNumber = toNumber;
    lodash.toSafeInteger = toSafeInteger;
    lodash.toString = toString;
    lodash.toUpper = toUpper;
    lodash.trim = trim;
    lodash.trimEnd = trimEnd;
    lodash.trimStart = trimStart;
    lodash.truncate = truncate;
    lodash.unescape = unescape;
    lodash.uniqueId = uniqueId;
    lodash.upperCase = upperCase;
    lodash.upperFirst = upperFirst;

    // Add aliases.
    lodash.each = forEach;
    lodash.eachRight = forEachRight;
    lodash.first = head;

    mixin(lodash, (function() {
      var source = {};
      baseForOwn(lodash, function(func, methodName) {
        if (!hasOwnProperty.call(lodash.prototype, methodName)) {
          source[methodName] = func;
        }
      });
      return source;
    }()), { 'chain': false });

    /*------------------------------------------------------------------------*/

    /**
     * The semantic version number.
     *
     * @static
     * @memberOf _
     * @type {string}
     */
    lodash.VERSION = VERSION;

    // Assign default placeholders.
    arrayEach(['bind', 'bindKey', 'curry', 'curryRight', 'partial', 'partialRight'], function(methodName) {
      lodash[methodName].placeholder = lodash;
    });

    // Add `LazyWrapper` methods for `_.drop` and `_.take` variants.
    arrayEach(['drop', 'take'], function(methodName, index) {
      LazyWrapper.prototype[methodName] = function(n) {
        var filtered = this.__filtered__;
        if (filtered && !index) {
          return new LazyWrapper(this);
        }
        n = n === undefined ? 1 : nativeMax(toInteger(n), 0);

        var result = this.clone();
        if (filtered) {
          result.__takeCount__ = nativeMin(n, result.__takeCount__);
        } else {
          result.__views__.push({
            'size': nativeMin(n, MAX_ARRAY_LENGTH),
            'type': methodName + (result.__dir__ < 0 ? 'Right' : '')
          });
        }
        return result;
      };

      LazyWrapper.prototype[methodName + 'Right'] = function(n) {
        return this.reverse()[methodName](n).reverse();
      };
    });

    // Add `LazyWrapper` methods that accept an `iteratee` value.
    arrayEach(['filter', 'map', 'takeWhile'], function(methodName, index) {
      var type = index + 1,
          isFilter = type == LAZY_FILTER_FLAG || type == LAZY_WHILE_FLAG;

      LazyWrapper.prototype[methodName] = function(iteratee) {
        var result = this.clone();
        result.__iteratees__.push({
          'iteratee': getIteratee(iteratee, 3),
          'type': type
        });
        result.__filtered__ = result.__filtered__ || isFilter;
        return result;
      };
    });

    // Add `LazyWrapper` methods for `_.head` and `_.last`.
    arrayEach(['head', 'last'], function(methodName, index) {
      var takeName = 'take' + (index ? 'Right' : '');

      LazyWrapper.prototype[methodName] = function() {
        return this[takeName](1).value()[0];
      };
    });

    // Add `LazyWrapper` methods for `_.initial` and `_.tail`.
    arrayEach(['initial', 'tail'], function(methodName, index) {
      var dropName = 'drop' + (index ? '' : 'Right');

      LazyWrapper.prototype[methodName] = function() {
        return this.__filtered__ ? new LazyWrapper(this) : this[dropName](1);
      };
    });

    LazyWrapper.prototype.compact = function() {
      return this.filter(identity);
    };

    LazyWrapper.prototype.find = function(predicate) {
      return this.filter(predicate).head();
    };

    LazyWrapper.prototype.findLast = function(predicate) {
      return this.reverse().find(predicate);
    };

    LazyWrapper.prototype.invokeMap = rest(function(path, args) {
      if (typeof path == 'function') {
        return new LazyWrapper(this);
      }
      return this.map(function(value) {
        return baseInvoke(value, path, args);
      });
    });

    LazyWrapper.prototype.reject = function(predicate) {
      predicate = getIteratee(predicate, 3);
      return this.filter(function(value) {
        return !predicate(value);
      });
    };

    LazyWrapper.prototype.slice = function(start, end) {
      start = toInteger(start);

      var result = this;
      if (result.__filtered__ && (start > 0 || end < 0)) {
        return new LazyWrapper(result);
      }
      if (start < 0) {
        result = result.takeRight(-start);
      } else if (start) {
        result = result.drop(start);
      }
      if (end !== undefined) {
        end = toInteger(end);
        result = end < 0 ? result.dropRight(-end) : result.take(end - start);
      }
      return result;
    };

    LazyWrapper.prototype.takeRightWhile = function(predicate) {
      return this.reverse().takeWhile(predicate).reverse();
    };

    LazyWrapper.prototype.toArray = function() {
      return this.take(MAX_ARRAY_LENGTH);
    };

    // Add `LazyWrapper` methods to `lodash.prototype`.
    baseForOwn(LazyWrapper.prototype, function(func, methodName) {
      var checkIteratee = /^(?:filter|find|map|reject)|While$/.test(methodName),
          isTaker = /^(?:head|last)$/.test(methodName),
          lodashFunc = lodash[isTaker ? ('take' + (methodName == 'last' ? 'Right' : '')) : methodName],
          retUnwrapped = isTaker || /^find/.test(methodName);

      if (!lodashFunc) {
        return;
      }
      lodash.prototype[methodName] = function() {
        var value = this.__wrapped__,
            args = isTaker ? [1] : arguments,
            isLazy = value instanceof LazyWrapper,
            iteratee = args[0],
            useLazy = isLazy || isArray(value);

        var interceptor = function(value) {
          var result = lodashFunc.apply(lodash, arrayPush([value], args));
          return (isTaker && chainAll) ? result[0] : result;
        };

        if (useLazy && checkIteratee && typeof iteratee == 'function' && iteratee.length != 1) {
          // Avoid lazy use if the iteratee has a "length" value other than `1`.
          isLazy = useLazy = false;
        }
        var chainAll = this.__chain__,
            isHybrid = !!this.__actions__.length,
            isUnwrapped = retUnwrapped && !chainAll,
            onlyLazy = isLazy && !isHybrid;

        if (!retUnwrapped && useLazy) {
          value = onlyLazy ? value : new LazyWrapper(this);
          var result = func.apply(value, args);
          result.__actions__.push({ 'func': thru, 'args': [interceptor], 'thisArg': undefined });
          return new LodashWrapper(result, chainAll);
        }
        if (isUnwrapped && onlyLazy) {
          return func.apply(this, args);
        }
        result = this.thru(interceptor);
        return isUnwrapped ? (isTaker ? result.value()[0] : result.value()) : result;
      };
    });

    // Add `Array` and `String` methods to `lodash.prototype`.
    arrayEach(['pop', 'push', 'shift', 'sort', 'splice', 'unshift'], function(methodName) {
      var func = arrayProto[methodName],
          chainName = /^(?:push|sort|unshift)$/.test(methodName) ? 'tap' : 'thru',
          retUnwrapped = /^(?:pop|shift)$/.test(methodName);

      lodash.prototype[methodName] = function() {
        var args = arguments;
        if (retUnwrapped && !this.__chain__) {
          return func.apply(this.value(), args);
        }
        return this[chainName](function(value) {
          return func.apply(value, args);
        });
      };
    });

    // Map minified function names to their real names.
    baseForOwn(LazyWrapper.prototype, function(func, methodName) {
      var lodashFunc = lodash[methodName];
      if (lodashFunc) {
        var key = (lodashFunc.name + ''),
            names = realNames[key] || (realNames[key] = []);

        names.push({ 'name': methodName, 'func': lodashFunc });
      }
    });

    realNames[createHybridWrapper(undefined, BIND_KEY_FLAG).name] = [{
      'name': 'wrapper',
      'func': undefined
    }];

    // Add functions to the lazy wrapper.
    LazyWrapper.prototype.clone = lazyClone;
    LazyWrapper.prototype.reverse = lazyReverse;
    LazyWrapper.prototype.value = lazyValue;

    // Add chaining functions to the `lodash` wrapper.
    lodash.prototype.at = wrapperAt;
    lodash.prototype.chain = wrapperChain;
    lodash.prototype.commit = wrapperCommit;
    lodash.prototype.flatMap = wrapperFlatMap;
    lodash.prototype.next = wrapperNext;
    lodash.prototype.plant = wrapperPlant;
    lodash.prototype.reverse = wrapperReverse;
    lodash.prototype.toJSON = lodash.prototype.valueOf = lodash.prototype.value = wrapperValue;

    if (iteratorSymbol) {
      lodash.prototype[iteratorSymbol] = wrapperToIterator;
    }
    return lodash;
  }

  /*--------------------------------------------------------------------------*/

  // Export lodash.
  var _ = runInContext();

  // Expose lodash on the free variable `window` or `self` when available. This
  // prevents errors in cases where lodash is loaded by a script tag in the presence
  // of an AMD loader. See http://requirejs.org/docs/errors.html#mismatch for more details.
  (freeWindow || freeSelf || {})._ = _;

  // Some AMD build optimizers like r.js check for condition patterns like the following:
  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    // Define as an anonymous module so, through path mapping, it can be
    // referenced as the "underscore" module.
    define(function() {
      return _;
    });
  }
  // Check for `exports` after `define` in case a build optimizer adds an `exports` object.
  else if (freeExports && freeModule) {
    // Export for Node.js.
    if (moduleExports) {
      (freeModule.exports = _)._ = _;
    }
    // Export for CommonJS support.
    freeExports._ = _;
  }
  else {
    // Export to the global object.
    root._ = _;
  }
}.call(this));

/*!
 * URI.js - Mutating URLs
 *
 * Version: 1.17.1
 *
 * Author: Rodney Rehm
 * Web: http://medialize.github.io/URI.js/
 *
 * Licensed under
 *   MIT License http://www.opensource.org/licenses/mit-license
 *
 */
(function (root, factory) {
  'use strict';
  // https://github.com/umdjs/umd/blob/master/returnExports.js
  if (typeof exports === 'object') {
    // Node
    module.exports = factory(require('./punycode'), require('./IPv6'), require('./SecondLevelDomains'));
  } else if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['./punycode', './IPv6', './SecondLevelDomains'], factory);
  } else {
    // Browser globals (root is window)
    root.URI = factory(root.punycode, root.IPv6, root.SecondLevelDomains, root);
  }
}(this, function (punycode, IPv6, SLD, root) {
  'use strict';
  /*global location, escape, unescape */
  // FIXME: v2.0.0 renamce non-camelCase properties to uppercase
  /*jshint camelcase: false */

  // save current URI variable, if any
  var _URI = root && root.URI;

  function URI(url, base) {
    var _urlSupplied = arguments.length >= 1;
    var _baseSupplied = arguments.length >= 2;

    // Allow instantiation without the 'new' keyword
    if (!(this instanceof URI)) {
      if (_urlSupplied) {
        if (_baseSupplied) {
          return new URI(url, base);
        }

        return new URI(url);
      }

      return new URI();
    }

    if (url === undefined) {
      if (_urlSupplied) {
        throw new TypeError('undefined is not a valid argument for URI');
      }

      if (typeof location !== 'undefined') {
        url = location.href + '';
      } else {
        url = '';
      }
    }

    this.href(url);

    // resolve to base according to http://dvcs.w3.org/hg/url/raw-file/tip/Overview.html#constructor
    if (base !== undefined) {
      return this.absoluteTo(base);
    }

    return this;
  }

  URI.version = '1.17.1';

  var p = URI.prototype;
  var hasOwn = Object.prototype.hasOwnProperty;

  function escapeRegEx(string) {
    // https://github.com/medialize/URI.js/commit/85ac21783c11f8ccab06106dba9735a31a86924d#commitcomment-821963
    return string.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
  }

  function getType(value) {
    // IE8 doesn't return [Object Undefined] but [Object Object] for undefined value
    if (value === undefined) {
      return 'Undefined';
    }

    return String(Object.prototype.toString.call(value)).slice(8, -1);
  }

  function isArray(obj) {
    return getType(obj) === 'Array';
  }

  function filterArrayValues(data, value) {
    var lookup = {};
    var i, length;

    if (getType(value) === 'RegExp') {
      lookup = null;
    } else if (isArray(value)) {
      for (i = 0, length = value.length; i < length; i++) {
        lookup[value[i]] = true;
      }
    } else {
      lookup[value] = true;
    }

    for (i = 0, length = data.length; i < length; i++) {
      /*jshint laxbreak: true */
      var _match = lookup && lookup[data[i]] !== undefined
        || !lookup && value.test(data[i]);
      /*jshint laxbreak: false */
      if (_match) {
        data.splice(i, 1);
        length--;
        i--;
      }
    }

    return data;
  }

  function arrayContains(list, value) {
    var i, length;

    // value may be string, number, array, regexp
    if (isArray(value)) {
      // Note: this can be optimized to O(n) (instead of current O(m * n))
      for (i = 0, length = value.length; i < length; i++) {
        if (!arrayContains(list, value[i])) {
          return false;
        }
      }

      return true;
    }

    var _type = getType(value);
    for (i = 0, length = list.length; i < length; i++) {
      if (_type === 'RegExp') {
        if (typeof list[i] === 'string' && list[i].match(value)) {
          return true;
        }
      } else if (list[i] === value) {
        return true;
      }
    }

    return false;
  }

  function arraysEqual(one, two) {
    if (!isArray(one) || !isArray(two)) {
      return false;
    }

    // arrays can't be equal if they have different amount of content
    if (one.length !== two.length) {
      return false;
    }

    one.sort();
    two.sort();

    for (var i = 0, l = one.length; i < l; i++) {
      if (one[i] !== two[i]) {
        return false;
      }
    }

    return true;
  }

  function trimSlashes(text) {
    var trim_expression = /^\/+|\/+$/g;
    return text.replace(trim_expression, '');
  }

  URI._parts = function() {
    return {
      protocol: null,
      username: null,
      password: null,
      hostname: null,
      urn: null,
      port: null,
      path: null,
      query: null,
      fragment: null,
      // state
      duplicateQueryParameters: URI.duplicateQueryParameters,
      escapeQuerySpace: URI.escapeQuerySpace
    };
  };
  // state: allow duplicate query parameters (a=1&a=1)
  URI.duplicateQueryParameters = false;
  // state: replaces + with %20 (space in query strings)
  URI.escapeQuerySpace = true;
  // static properties
  URI.protocol_expression = /^[a-z][a-z0-9.+-]*$/i;
  URI.idn_expression = /[^a-z0-9\.-]/i;
  URI.punycode_expression = /(xn--)/i;
  // well, 333.444.555.666 matches, but it sure ain't no IPv4 - do we care?
  URI.ip4_expression = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
  // credits to Rich Brown
  // source: http://forums.intermapper.com/viewtopic.php?p=1096#1096
  // specification: http://www.ietf.org/rfc/rfc4291.txt
  URI.ip6_expression = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/;
  // expression used is "gruber revised" (@gruber v2) determined to be the
  // best solution in a regex-golf we did a couple of ages ago at
  // * http://mathiasbynens.be/demo/url-regex
  // * http://rodneyrehm.de/t/url-regex.html
  URI.find_uri_expression = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/ig;
  URI.findUri = {
    // valid "scheme://" or "www."
    start: /\b(?:([a-z][a-z0-9.+-]*:\/\/)|www\.)/gi,
    // everything up to the next whitespace
    end: /[\s\r\n]|$/,
    // trim trailing punctuation captured by end RegExp
    trim: /[`!()\[\]{};:'".,<>?«»“”„‘’]+$/
  };
  // http://www.iana.org/assignments/uri-schemes.html
  // http://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers#Well-known_ports
  URI.defaultPorts = {
    http: '80',
    https: '443',
    ftp: '21',
    gopher: '70',
    ws: '80',
    wss: '443'
  };
  // allowed hostname characters according to RFC 3986
  // ALPHA DIGIT "-" "." "_" "~" "!" "$" "&" "'" "(" ")" "*" "+" "," ";" "=" %encoded
  // I've never seen a (non-IDN) hostname other than: ALPHA DIGIT . -
  URI.invalid_hostname_characters = /[^a-zA-Z0-9\.-]/;
  // map DOM Elements to their URI attribute
  URI.domAttributes = {
    'a': 'href',
    'blockquote': 'cite',
    'link': 'href',
    'base': 'href',
    'script': 'src',
    'form': 'action',
    'img': 'src',
    'area': 'href',
    'iframe': 'src',
    'embed': 'src',
    'source': 'src',
    'track': 'src',
    'input': 'src', // but only if type="image"
    'audio': 'src',
    'video': 'src'
  };
  URI.getDomAttribute = function(node) {
    if (!node || !node.nodeName) {
      return undefined;
    }

    var nodeName = node.nodeName.toLowerCase();
    // <input> should only expose src for type="image"
    if (nodeName === 'input' && node.type !== 'image') {
      return undefined;
    }

    return URI.domAttributes[nodeName];
  };

  function escapeForDumbFirefox36(value) {
    // https://github.com/medialize/URI.js/issues/91
    return escape(value);
  }

  // encoding / decoding according to RFC3986
  function strictEncodeURIComponent(string) {
    // see https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/encodeURIComponent
    return encodeURIComponent(string)
      .replace(/[!'()*]/g, escapeForDumbFirefox36)
      .replace(/\*/g, '%2A');
  }
  URI.encode = strictEncodeURIComponent;
  URI.decode = decodeURIComponent;
  URI.iso8859 = function() {
    URI.encode = escape;
    URI.decode = unescape;
  };
  URI.unicode = function() {
    URI.encode = strictEncodeURIComponent;
    URI.decode = decodeURIComponent;
  };
  URI.characters = {
    pathname: {
      encode: {
        // RFC3986 2.1: For consistency, URI producers and normalizers should
        // use uppercase hexadecimal digits for all percent-encodings.
        expression: /%(24|26|2B|2C|3B|3D|3A|40)/ig,
        map: {
          // -._~!'()*
          '%24': '$',
          '%26': '&',
          '%2B': '+',
          '%2C': ',',
          '%3B': ';',
          '%3D': '=',
          '%3A': ':',
          '%40': '@'
        }
      },
      decode: {
        expression: /[\/\?#]/g,
        map: {
          '/': '%2F',
          '?': '%3F',
          '#': '%23'
        }
      }
    },
    reserved: {
      encode: {
        // RFC3986 2.1: For consistency, URI producers and normalizers should
        // use uppercase hexadecimal digits for all percent-encodings.
        expression: /%(21|23|24|26|27|28|29|2A|2B|2C|2F|3A|3B|3D|3F|40|5B|5D)/ig,
        map: {
          // gen-delims
          '%3A': ':',
          '%2F': '/',
          '%3F': '?',
          '%23': '#',
          '%5B': '[',
          '%5D': ']',
          '%40': '@',
          // sub-delims
          '%21': '!',
          '%24': '$',
          '%26': '&',
          '%27': '\'',
          '%28': '(',
          '%29': ')',
          '%2A': '*',
          '%2B': '+',
          '%2C': ',',
          '%3B': ';',
          '%3D': '='
        }
      }
    },
    urnpath: {
      // The characters under `encode` are the characters called out by RFC 2141 as being acceptable
      // for usage in a URN. RFC2141 also calls out "-", ".", and "_" as acceptable characters, but
      // these aren't encoded by encodeURIComponent, so we don't have to call them out here. Also
      // note that the colon character is not featured in the encoding map; this is because URI.js
      // gives the colons in URNs semantic meaning as the delimiters of path segements, and so it
      // should not appear unencoded in a segment itself.
      // See also the note above about RFC3986 and capitalalized hex digits.
      encode: {
        expression: /%(21|24|27|28|29|2A|2B|2C|3B|3D|40)/ig,
        map: {
          '%21': '!',
          '%24': '$',
          '%27': '\'',
          '%28': '(',
          '%29': ')',
          '%2A': '*',
          '%2B': '+',
          '%2C': ',',
          '%3B': ';',
          '%3D': '=',
          '%40': '@'
        }
      },
      // These characters are the characters called out by RFC2141 as "reserved" characters that
      // should never appear in a URN, plus the colon character (see note above).
      decode: {
        expression: /[\/\?#:]/g,
        map: {
          '/': '%2F',
          '?': '%3F',
          '#': '%23',
          ':': '%3A'
        }
      }
    }
  };
  URI.encodeQuery = function(string, escapeQuerySpace) {
    var escaped = URI.encode(string + '');
    if (escapeQuerySpace === undefined) {
      escapeQuerySpace = URI.escapeQuerySpace;
    }

    return escapeQuerySpace ? escaped.replace(/%20/g, '+') : escaped;
  };
  URI.decodeQuery = function(string, escapeQuerySpace) {
    string += '';
    if (escapeQuerySpace === undefined) {
      escapeQuerySpace = URI.escapeQuerySpace;
    }

    try {
      return URI.decode(escapeQuerySpace ? string.replace(/\+/g, '%20') : string);
    } catch(e) {
      // we're not going to mess with weird encodings,
      // give up and return the undecoded original string
      // see https://github.com/medialize/URI.js/issues/87
      // see https://github.com/medialize/URI.js/issues/92
      return string;
    }
  };
  // generate encode/decode path functions
  var _parts = {'encode':'encode', 'decode':'decode'};
  var _part;
  var generateAccessor = function(_group, _part) {
    return function(string) {
      try {
        return URI[_part](string + '').replace(URI.characters[_group][_part].expression, function(c) {
          return URI.characters[_group][_part].map[c];
        });
      } catch (e) {
        // we're not going to mess with weird encodings,
        // give up and return the undecoded original string
        // see https://github.com/medialize/URI.js/issues/87
        // see https://github.com/medialize/URI.js/issues/92
        return string;
      }
    };
  };

  for (_part in _parts) {
    URI[_part + 'PathSegment'] = generateAccessor('pathname', _parts[_part]);
    URI[_part + 'UrnPathSegment'] = generateAccessor('urnpath', _parts[_part]);
  }

  var generateSegmentedPathFunction = function(_sep, _codingFuncName, _innerCodingFuncName) {
    return function(string) {
      // Why pass in names of functions, rather than the function objects themselves? The
      // definitions of some functions (but in particular, URI.decode) will occasionally change due
      // to URI.js having ISO8859 and Unicode modes. Passing in the name and getting it will ensure
      // that the functions we use here are "fresh".
      var actualCodingFunc;
      if (!_innerCodingFuncName) {
        actualCodingFunc = URI[_codingFuncName];
      } else {
        actualCodingFunc = function(string) {
          return URI[_codingFuncName](URI[_innerCodingFuncName](string));
        };
      }

      var segments = (string + '').split(_sep);

      for (var i = 0, length = segments.length; i < length; i++) {
        segments[i] = actualCodingFunc(segments[i]);
      }

      return segments.join(_sep);
    };
  };

  // This takes place outside the above loop because we don't want, e.g., encodeUrnPath functions.
  URI.decodePath = generateSegmentedPathFunction('/', 'decodePathSegment');
  URI.decodeUrnPath = generateSegmentedPathFunction(':', 'decodeUrnPathSegment');
  URI.recodePath = generateSegmentedPathFunction('/', 'encodePathSegment', 'decode');
  URI.recodeUrnPath = generateSegmentedPathFunction(':', 'encodeUrnPathSegment', 'decode');

  URI.encodeReserved = generateAccessor('reserved', 'encode');

  URI.parse = function(string, parts) {
    var pos;
    if (!parts) {
      parts = {};
    }
    // [protocol"://"[username[":"password]"@"]hostname[":"port]"/"?][path]["?"querystring]["#"fragment]

    // extract fragment
    pos = string.indexOf('#');
    if (pos > -1) {
      // escaping?
      parts.fragment = string.substring(pos + 1) || null;
      string = string.substring(0, pos);
    }

    // extract query
    pos = string.indexOf('?');
    if (pos > -1) {
      // escaping?
      parts.query = string.substring(pos + 1) || null;
      string = string.substring(0, pos);
    }

    // extract protocol
    if (string.substring(0, 2) === '//') {
      // relative-scheme
      parts.protocol = null;
      string = string.substring(2);
      // extract "user:pass@host:port"
      string = URI.parseAuthority(string, parts);
    } else {
      pos = string.indexOf(':');
      if (pos > -1) {
        parts.protocol = string.substring(0, pos) || null;
        if (parts.protocol && !parts.protocol.match(URI.protocol_expression)) {
          // : may be within the path
          parts.protocol = undefined;
        } else if (string.substring(pos + 1, pos + 3) === '//') {
          string = string.substring(pos + 3);

          // extract "user:pass@host:port"
          string = URI.parseAuthority(string, parts);
        } else {
          string = string.substring(pos + 1);
          parts.urn = true;
        }
      }
    }

    // what's left must be the path
    parts.path = string;

    // and we're done
    return parts;
  };
  URI.parseHost = function(string, parts) {
    // Copy chrome, IE, opera backslash-handling behavior.
    // Back slashes before the query string get converted to forward slashes
    // See: https://github.com/joyent/node/blob/386fd24f49b0e9d1a8a076592a404168faeecc34/lib/url.js#L115-L124
    // See: https://code.google.com/p/chromium/issues/detail?id=25916
    // https://github.com/medialize/URI.js/pull/233
    string = string.replace(/\\/g, '/');

    // extract host:port
    var pos = string.indexOf('/');
    var bracketPos;
    var t;

    if (pos === -1) {
      pos = string.length;
    }

    if (string.charAt(0) === '[') {
      // IPv6 host - http://tools.ietf.org/html/draft-ietf-6man-text-addr-representation-04#section-6
      // I claim most client software breaks on IPv6 anyways. To simplify things, URI only accepts
      // IPv6+port in the format [2001:db8::1]:80 (for the time being)
      bracketPos = string.indexOf(']');
      parts.hostname = string.substring(1, bracketPos) || null;
      parts.port = string.substring(bracketPos + 2, pos) || null;
      if (parts.port === '/') {
        parts.port = null;
      }
    } else {
      var firstColon = string.indexOf(':');
      var firstSlash = string.indexOf('/');
      var nextColon = string.indexOf(':', firstColon + 1);
      if (nextColon !== -1 && (firstSlash === -1 || nextColon < firstSlash)) {
        // IPv6 host contains multiple colons - but no port
        // this notation is actually not allowed by RFC 3986, but we're a liberal parser
        parts.hostname = string.substring(0, pos) || null;
        parts.port = null;
      } else {
        t = string.substring(0, pos).split(':');
        parts.hostname = t[0] || null;
        parts.port = t[1] || null;
      }
    }

    if (parts.hostname && string.substring(pos).charAt(0) !== '/') {
      pos++;
      string = '/' + string;
    }

    return string.substring(pos) || '/';
  };
  URI.parseAuthority = function(string, parts) {
    string = URI.parseUserinfo(string, parts);
    return URI.parseHost(string, parts);
  };
  URI.parseUserinfo = function(string, parts) {
    // extract username:password
    var firstSlash = string.indexOf('/');
    var pos = string.lastIndexOf('@', firstSlash > -1 ? firstSlash : string.length - 1);
    var t;

    // authority@ must come before /path
    if (pos > -1 && (firstSlash === -1 || pos < firstSlash)) {
      t = string.substring(0, pos).split(':');
      parts.username = t[0] ? URI.decode(t[0]) : null;
      t.shift();
      parts.password = t[0] ? URI.decode(t.join(':')) : null;
      string = string.substring(pos + 1);
    } else {
      parts.username = null;
      parts.password = null;
    }

    return string;
  };
  URI.parseQuery = function(string, escapeQuerySpace) {
    if (!string) {
      return {};
    }

    // throw out the funky business - "?"[name"="value"&"]+
    string = string.replace(/&+/g, '&').replace(/^\?*&*|&+$/g, '');

    if (!string) {
      return {};
    }

    var items = {};
    var splits = string.split('&');
    var length = splits.length;
    var v, name, value;

    for (var i = 0; i < length; i++) {
      v = splits[i].split('=');
      name = URI.decodeQuery(v.shift(), escapeQuerySpace);
      // no "=" is null according to http://dvcs.w3.org/hg/url/raw-file/tip/Overview.html#collect-url-parameters
      value = v.length ? URI.decodeQuery(v.join('='), escapeQuerySpace) : null;

      if (hasOwn.call(items, name)) {
        if (typeof items[name] === 'string' || items[name] === null) {
          items[name] = [items[name]];
        }

        items[name].push(value);
      } else {
        items[name] = value;
      }
    }

    return items;
  };

  URI.build = function(parts) {
    var t = '';

    if (parts.protocol) {
      t += parts.protocol + ':';
    }

    if (!parts.urn && (t || parts.hostname)) {
      t += '//';
    }

    t += (URI.buildAuthority(parts) || '');

    if (typeof parts.path === 'string') {
      if (parts.path.charAt(0) !== '/' && typeof parts.hostname === 'string') {
        t += '/';
      }

      t += parts.path;
    }

    if (typeof parts.query === 'string' && parts.query) {
      t += '?' + parts.query;
    }

    if (typeof parts.fragment === 'string' && parts.fragment) {
      t += '#' + parts.fragment;
    }
    return t;
  };
  URI.buildHost = function(parts) {
    var t = '';

    if (!parts.hostname) {
      return '';
    } else if (URI.ip6_expression.test(parts.hostname)) {
      t += '[' + parts.hostname + ']';
    } else {
      t += parts.hostname;
    }

    if (parts.port) {
      t += ':' + parts.port;
    }

    return t;
  };
  URI.buildAuthority = function(parts) {
    return URI.buildUserinfo(parts) + URI.buildHost(parts);
  };
  URI.buildUserinfo = function(parts) {
    var t = '';

    if (parts.username) {
      t += URI.encode(parts.username);

      if (parts.password) {
        t += ':' + URI.encode(parts.password);
      }

      t += '@';
    }

    return t;
  };
  URI.buildQuery = function(data, duplicateQueryParameters, escapeQuerySpace) {
    // according to http://tools.ietf.org/html/rfc3986 or http://labs.apache.org/webarch/uri/rfc/rfc3986.html
    // being »-._~!$&'()*+,;=:@/?« %HEX and alnum are allowed
    // the RFC explicitly states ?/foo being a valid use case, no mention of parameter syntax!
    // URI.js treats the query string as being application/x-www-form-urlencoded
    // see http://www.w3.org/TR/REC-html40/interact/forms.html#form-content-type

    var t = '';
    var unique, key, i, length;
    for (key in data) {
      if (hasOwn.call(data, key) && key) {
        if (isArray(data[key])) {
          unique = {};
          for (i = 0, length = data[key].length; i < length; i++) {
            if (data[key][i] !== undefined && unique[data[key][i] + ''] === undefined) {
              t += '&' + URI.buildQueryParameter(key, data[key][i], escapeQuerySpace);
              if (duplicateQueryParameters !== true) {
                unique[data[key][i] + ''] = true;
              }
            }
          }
        } else if (data[key] !== undefined) {
          t += '&' + URI.buildQueryParameter(key, data[key], escapeQuerySpace);
        }
      }
    }

    return t.substring(1);
  };
  URI.buildQueryParameter = function(name, value, escapeQuerySpace) {
    // http://www.w3.org/TR/REC-html40/interact/forms.html#form-content-type -- application/x-www-form-urlencoded
    // don't append "=" for null values, according to http://dvcs.w3.org/hg/url/raw-file/tip/Overview.html#url-parameter-serialization
    return URI.encodeQuery(name, escapeQuerySpace) + (value !== null ? '=' + URI.encodeQuery(value, escapeQuerySpace) : '');
  };

  URI.addQuery = function(data, name, value) {
    if (typeof name === 'object') {
      for (var key in name) {
        if (hasOwn.call(name, key)) {
          URI.addQuery(data, key, name[key]);
        }
      }
    } else if (typeof name === 'string') {
      if (data[name] === undefined) {
        data[name] = value;
        return;
      } else if (typeof data[name] === 'string') {
        data[name] = [data[name]];
      }

      if (!isArray(value)) {
        value = [value];
      }

      data[name] = (data[name] || []).concat(value);
    } else {
      throw new TypeError('URI.addQuery() accepts an object, string as the name parameter');
    }
  };
  URI.removeQuery = function(data, name, value) {
    var i, length, key;

    if (isArray(name)) {
      for (i = 0, length = name.length; i < length; i++) {
        data[name[i]] = undefined;
      }
    } else if (getType(name) === 'RegExp') {
      for (key in data) {
        if (name.test(key)) {
          data[key] = undefined;
        }
      }
    } else if (typeof name === 'object') {
      for (key in name) {
        if (hasOwn.call(name, key)) {
          URI.removeQuery(data, key, name[key]);
        }
      }
    } else if (typeof name === 'string') {
      if (value !== undefined) {
        if (getType(value) === 'RegExp') {
          if (!isArray(data[name]) && value.test(data[name])) {
            data[name] = undefined;
          } else {
            data[name] = filterArrayValues(data[name], value);
          }
        } else if (data[name] === String(value) && (!isArray(value) || value.length === 1)) {
          data[name] = undefined;
        } else if (isArray(data[name])) {
          data[name] = filterArrayValues(data[name], value);
        }
      } else {
        data[name] = undefined;
      }
    } else {
      throw new TypeError('URI.removeQuery() accepts an object, string, RegExp as the first parameter');
    }
  };
  URI.hasQuery = function(data, name, value, withinArray) {
    switch (getType(name)) {
      case 'String':
        // Nothing to do here
        break;

      case 'RegExp':
        for (var key in data) {
          if (hasOwn.call(data, key)) {
            if (name.test(key) && (value === undefined || URI.hasQuery(data, key, value))) {
              return true;
            }
          }
        }

        return false;

      case 'Object':
        for (var _key in name) {
          if (hasOwn.call(name, _key)) {
            if (!URI.hasQuery(data, _key, name[_key])) {
              return false;
            }
          }
        }

        return true;

      default:
        throw new TypeError('URI.hasQuery() accepts a string, regular expression or object as the name parameter');
    }

    switch (getType(value)) {
      case 'Undefined':
        // true if exists (but may be empty)
        return name in data; // data[name] !== undefined;

      case 'Boolean':
        // true if exists and non-empty
        var _booly = Boolean(isArray(data[name]) ? data[name].length : data[name]);
        return value === _booly;

      case 'Function':
        // allow complex comparison
        return !!value(data[name], name, data);

      case 'Array':
        if (!isArray(data[name])) {
          return false;
        }

        var op = withinArray ? arrayContains : arraysEqual;
        return op(data[name], value);

      case 'RegExp':
        if (!isArray(data[name])) {
          return Boolean(data[name] && data[name].match(value));
        }

        if (!withinArray) {
          return false;
        }

        return arrayContains(data[name], value);

      case 'Number':
        value = String(value);
        /* falls through */
      case 'String':
        if (!isArray(data[name])) {
          return data[name] === value;
        }

        if (!withinArray) {
          return false;
        }

        return arrayContains(data[name], value);

      default:
        throw new TypeError('URI.hasQuery() accepts undefined, boolean, string, number, RegExp, Function as the value parameter');
    }
  };


  URI.commonPath = function(one, two) {
    var length = Math.min(one.length, two.length);
    var pos;

    // find first non-matching character
    for (pos = 0; pos < length; pos++) {
      if (one.charAt(pos) !== two.charAt(pos)) {
        pos--;
        break;
      }
    }

    if (pos < 1) {
      return one.charAt(0) === two.charAt(0) && one.charAt(0) === '/' ? '/' : '';
    }

    // revert to last /
    if (one.charAt(pos) !== '/' || two.charAt(pos) !== '/') {
      pos = one.substring(0, pos).lastIndexOf('/');
    }

    return one.substring(0, pos + 1);
  };

  URI.withinString = function(string, callback, options) {
    options || (options = {});
    var _start = options.start || URI.findUri.start;
    var _end = options.end || URI.findUri.end;
    var _trim = options.trim || URI.findUri.trim;
    var _attributeOpen = /[a-z0-9-]=["']?$/i;

    _start.lastIndex = 0;
    while (true) {
      var match = _start.exec(string);
      if (!match) {
        break;
      }

      var start = match.index;
      if (options.ignoreHtml) {
        // attribut(e=["']?$)
        var attributeOpen = string.slice(Math.max(start - 3, 0), start);
        if (attributeOpen && _attributeOpen.test(attributeOpen)) {
          continue;
        }
      }

      var end = start + string.slice(start).search(_end);
      var slice = string.slice(start, end).replace(_trim, '');
      if (options.ignore && options.ignore.test(slice)) {
        continue;
      }

      end = start + slice.length;
      var result = callback(slice, start, end, string);
      string = string.slice(0, start) + result + string.slice(end);
      _start.lastIndex = start + result.length;
    }

    _start.lastIndex = 0;
    return string;
  };

  URI.ensureValidHostname = function(v) {
    // Theoretically URIs allow percent-encoding in Hostnames (according to RFC 3986)
    // they are not part of DNS and therefore ignored by URI.js

    if (v.match(URI.invalid_hostname_characters)) {
      // test punycode
      if (!punycode) {
        throw new TypeError('Hostname "' + v + '" contains characters other than [A-Z0-9.-] and Punycode.js is not available');
      }

      if (punycode.toASCII(v).match(URI.invalid_hostname_characters)) {
        throw new TypeError('Hostname "' + v + '" contains characters other than [A-Z0-9.-]');
      }
    }
  };

  // noConflict
  URI.noConflict = function(removeAll) {
    if (removeAll) {
      var unconflicted = {
        URI: this.noConflict()
      };

      if (root.URITemplate && typeof root.URITemplate.noConflict === 'function') {
        unconflicted.URITemplate = root.URITemplate.noConflict();
      }

      if (root.IPv6 && typeof root.IPv6.noConflict === 'function') {
        unconflicted.IPv6 = root.IPv6.noConflict();
      }

      if (root.SecondLevelDomains && typeof root.SecondLevelDomains.noConflict === 'function') {
        unconflicted.SecondLevelDomains = root.SecondLevelDomains.noConflict();
      }

      return unconflicted;
    } else if (root.URI === this) {
      root.URI = _URI;
    }

    return this;
  };

  p.build = function(deferBuild) {
    if (deferBuild === true) {
      this._deferred_build = true;
    } else if (deferBuild === undefined || this._deferred_build) {
      this._string = URI.build(this._parts);
      this._deferred_build = false;
    }

    return this;
  };

  p.clone = function() {
    return new URI(this);
  };

  p.valueOf = p.toString = function() {
    return this.build(false)._string;
  };


  function generateSimpleAccessor(_part){
    return function(v, build) {
      if (v === undefined) {
        return this._parts[_part] || '';
      } else {
        this._parts[_part] = v || null;
        this.build(!build);
        return this;
      }
    };
  }

  function generatePrefixAccessor(_part, _key){
    return function(v, build) {
      if (v === undefined) {
        return this._parts[_part] || '';
      } else {
        if (v !== null) {
          v = v + '';
          if (v.charAt(0) === _key) {
            v = v.substring(1);
          }
        }

        this._parts[_part] = v;
        this.build(!build);
        return this;
      }
    };
  }

  p.protocol = generateSimpleAccessor('protocol');
  p.username = generateSimpleAccessor('username');
  p.password = generateSimpleAccessor('password');
  p.hostname = generateSimpleAccessor('hostname');
  p.port = generateSimpleAccessor('port');
  p.query = generatePrefixAccessor('query', '?');
  p.fragment = generatePrefixAccessor('fragment', '#');

  p.search = function(v, build) {
    var t = this.query(v, build);
    return typeof t === 'string' && t.length ? ('?' + t) : t;
  };
  p.hash = function(v, build) {
    var t = this.fragment(v, build);
    return typeof t === 'string' && t.length ? ('#' + t) : t;
  };

  p.pathname = function(v, build) {
    if (v === undefined || v === true) {
      var res = this._parts.path || (this._parts.hostname ? '/' : '');
      return v ? (this._parts.urn ? URI.decodeUrnPath : URI.decodePath)(res) : res;
    } else {
      if (this._parts.urn) {
        this._parts.path = v ? URI.recodeUrnPath(v) : '';
      } else {
        this._parts.path = v ? URI.recodePath(v) : '/';
      }
      this.build(!build);
      return this;
    }
  };
  p.path = p.pathname;
  p.href = function(href, build) {
    var key;

    if (href === undefined) {
      return this.toString();
    }

    this._string = '';
    this._parts = URI._parts();

    var _URI = href instanceof URI;
    var _object = typeof href === 'object' && (href.hostname || href.path || href.pathname);
    if (href.nodeName) {
      var attribute = URI.getDomAttribute(href);
      href = href[attribute] || '';
      _object = false;
    }

    // window.location is reported to be an object, but it's not the sort
    // of object we're looking for:
    // * location.protocol ends with a colon
    // * location.query != object.search
    // * location.hash != object.fragment
    // simply serializing the unknown object should do the trick
    // (for location, not for everything...)
    if (!_URI && _object && href.pathname !== undefined) {
      href = href.toString();
    }

    if (typeof href === 'string' || href instanceof String) {
      this._parts = URI.parse(String(href), this._parts);
    } else if (_URI || _object) {
      var src = _URI ? href._parts : href;
      for (key in src) {
        if (hasOwn.call(this._parts, key)) {
          this._parts[key] = src[key];
        }
      }
    } else {
      throw new TypeError('invalid input');
    }

    this.build(!build);
    return this;
  };

  // identification accessors
  p.is = function(what) {
    var ip = false;
    var ip4 = false;
    var ip6 = false;
    var name = false;
    var sld = false;
    var idn = false;
    var punycode = false;
    var relative = !this._parts.urn;

    if (this._parts.hostname) {
      relative = false;
      ip4 = URI.ip4_expression.test(this._parts.hostname);
      ip6 = URI.ip6_expression.test(this._parts.hostname);
      ip = ip4 || ip6;
      name = !ip;
      sld = name && SLD && SLD.has(this._parts.hostname);
      idn = name && URI.idn_expression.test(this._parts.hostname);
      punycode = name && URI.punycode_expression.test(this._parts.hostname);
    }

    switch (what.toLowerCase()) {
      case 'relative':
        return relative;

      case 'absolute':
        return !relative;

      // hostname identification
      case 'domain':
      case 'name':
        return name;

      case 'sld':
        return sld;

      case 'ip':
        return ip;

      case 'ip4':
      case 'ipv4':
      case 'inet4':
        return ip4;

      case 'ip6':
      case 'ipv6':
      case 'inet6':
        return ip6;

      case 'idn':
        return idn;

      case 'url':
        return !this._parts.urn;

      case 'urn':
        return !!this._parts.urn;

      case 'punycode':
        return punycode;
    }

    return null;
  };

  // component specific input validation
  var _protocol = p.protocol;
  var _port = p.port;
  var _hostname = p.hostname;

  p.protocol = function(v, build) {
    if (v !== undefined) {
      if (v) {
        // accept trailing ://
        v = v.replace(/:(\/\/)?$/, '');

        if (!v.match(URI.protocol_expression)) {
          throw new TypeError('Protocol "' + v + '" contains characters other than [A-Z0-9.+-] or doesn\'t start with [A-Z]');
        }
      }
    }
    return _protocol.call(this, v, build);
  };
  p.scheme = p.protocol;
  p.port = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (v !== undefined) {
      if (v === 0) {
        v = null;
      }

      if (v) {
        v += '';
        if (v.charAt(0) === ':') {
          v = v.substring(1);
        }

        if (v.match(/[^0-9]/)) {
          throw new TypeError('Port "' + v + '" contains characters other than [0-9]');
        }
      }
    }
    return _port.call(this, v, build);
  };
  p.hostname = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (v !== undefined) {
      var x = {};
      var res = URI.parseHost(v, x);
      if (res !== '/') {
        throw new TypeError('Hostname "' + v + '" contains characters other than [A-Z0-9.-]');
      }

      v = x.hostname;
    }
    return _hostname.call(this, v, build);
  };

  // compound accessors
  p.origin = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (v === undefined) {
      var protocol = this.protocol();
      var authority = this.authority();
      if (!authority) {
        return '';
      }

      return (protocol ? protocol + '://' : '') + this.authority();
    } else {
      var origin = URI(v);
      this
        .protocol(origin.protocol())
        .authority(origin.authority())
        .build(!build);
      return this;
    }
  };
  p.host = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (v === undefined) {
      return this._parts.hostname ? URI.buildHost(this._parts) : '';
    } else {
      var res = URI.parseHost(v, this._parts);
      if (res !== '/') {
        throw new TypeError('Hostname "' + v + '" contains characters other than [A-Z0-9.-]');
      }

      this.build(!build);
      return this;
    }
  };
  p.authority = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (v === undefined) {
      return this._parts.hostname ? URI.buildAuthority(this._parts) : '';
    } else {
      var res = URI.parseAuthority(v, this._parts);
      if (res !== '/') {
        throw new TypeError('Hostname "' + v + '" contains characters other than [A-Z0-9.-]');
      }

      this.build(!build);
      return this;
    }
  };
  p.userinfo = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (v === undefined) {
      if (!this._parts.username) {
        return '';
      }

      var t = URI.buildUserinfo(this._parts);
      return t.substring(0, t.length -1);
    } else {
      if (v[v.length-1] !== '@') {
        v += '@';
      }

      URI.parseUserinfo(v, this._parts);
      this.build(!build);
      return this;
    }
  };
  p.resource = function(v, build) {
    var parts;

    if (v === undefined) {
      return this.path() + this.search() + this.hash();
    }

    parts = URI.parse(v);
    this._parts.path = parts.path;
    this._parts.query = parts.query;
    this._parts.fragment = parts.fragment;
    this.build(!build);
    return this;
  };

  // fraction accessors
  p.subdomain = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    // convenience, return "www" from "www.example.org"
    if (v === undefined) {
      if (!this._parts.hostname || this.is('IP')) {
        return '';
      }

      // grab domain and add another segment
      var end = this._parts.hostname.length - this.domain().length - 1;
      return this._parts.hostname.substring(0, end) || '';
    } else {
      var e = this._parts.hostname.length - this.domain().length;
      var sub = this._parts.hostname.substring(0, e);
      var replace = new RegExp('^' + escapeRegEx(sub));

      if (v && v.charAt(v.length - 1) !== '.') {
        v += '.';
      }

      if (v) {
        URI.ensureValidHostname(v);
      }

      this._parts.hostname = this._parts.hostname.replace(replace, v);
      this.build(!build);
      return this;
    }
  };
  p.domain = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (typeof v === 'boolean') {
      build = v;
      v = undefined;
    }

    // convenience, return "example.org" from "www.example.org"
    if (v === undefined) {
      if (!this._parts.hostname || this.is('IP')) {
        return '';
      }

      // if hostname consists of 1 or 2 segments, it must be the domain
      var t = this._parts.hostname.match(/\./g);
      if (t && t.length < 2) {
        return this._parts.hostname;
      }

      // grab tld and add another segment
      var end = this._parts.hostname.length - this.tld(build).length - 1;
      end = this._parts.hostname.lastIndexOf('.', end -1) + 1;
      return this._parts.hostname.substring(end) || '';
    } else {
      if (!v) {
        throw new TypeError('cannot set domain empty');
      }

      URI.ensureValidHostname(v);

      if (!this._parts.hostname || this.is('IP')) {
        this._parts.hostname = v;
      } else {
        var replace = new RegExp(escapeRegEx(this.domain()) + '$');
        this._parts.hostname = this._parts.hostname.replace(replace, v);
      }

      this.build(!build);
      return this;
    }
  };
  p.tld = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (typeof v === 'boolean') {
      build = v;
      v = undefined;
    }

    // return "org" from "www.example.org"
    if (v === undefined) {
      if (!this._parts.hostname || this.is('IP')) {
        return '';
      }

      var pos = this._parts.hostname.lastIndexOf('.');
      var tld = this._parts.hostname.substring(pos + 1);

      if (build !== true && SLD && SLD.list[tld.toLowerCase()]) {
        return SLD.get(this._parts.hostname) || tld;
      }

      return tld;
    } else {
      var replace;

      if (!v) {
        throw new TypeError('cannot set TLD empty');
      } else if (v.match(/[^a-zA-Z0-9-]/)) {
        if (SLD && SLD.is(v)) {
          replace = new RegExp(escapeRegEx(this.tld()) + '$');
          this._parts.hostname = this._parts.hostname.replace(replace, v);
        } else {
          throw new TypeError('TLD "' + v + '" contains characters other than [A-Z0-9]');
        }
      } else if (!this._parts.hostname || this.is('IP')) {
        throw new ReferenceError('cannot set TLD on non-domain host');
      } else {
        replace = new RegExp(escapeRegEx(this.tld()) + '$');
        this._parts.hostname = this._parts.hostname.replace(replace, v);
      }

      this.build(!build);
      return this;
    }
  };
  p.directory = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (v === undefined || v === true) {
      if (!this._parts.path && !this._parts.hostname) {
        return '';
      }

      if (this._parts.path === '/') {
        return '/';
      }

      var end = this._parts.path.length - this.filename().length - 1;
      var res = this._parts.path.substring(0, end) || (this._parts.hostname ? '/' : '');

      return v ? URI.decodePath(res) : res;

    } else {
      var e = this._parts.path.length - this.filename().length;
      var directory = this._parts.path.substring(0, e);
      var replace = new RegExp('^' + escapeRegEx(directory));

      // fully qualifier directories begin with a slash
      if (!this.is('relative')) {
        if (!v) {
          v = '/';
        }

        if (v.charAt(0) !== '/') {
          v = '/' + v;
        }
      }

      // directories always end with a slash
      if (v && v.charAt(v.length - 1) !== '/') {
        v += '/';
      }

      v = URI.recodePath(v);
      this._parts.path = this._parts.path.replace(replace, v);
      this.build(!build);
      return this;
    }
  };
  p.filename = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (v === undefined || v === true) {
      if (!this._parts.path || this._parts.path === '/') {
        return '';
      }

      var pos = this._parts.path.lastIndexOf('/');
      var res = this._parts.path.substring(pos+1);

      return v ? URI.decodePathSegment(res) : res;
    } else {
      var mutatedDirectory = false;

      if (v.charAt(0) === '/') {
        v = v.substring(1);
      }

      if (v.match(/\.?\//)) {
        mutatedDirectory = true;
      }

      var replace = new RegExp(escapeRegEx(this.filename()) + '$');
      v = URI.recodePath(v);
      this._parts.path = this._parts.path.replace(replace, v);

      if (mutatedDirectory) {
        this.normalizePath(build);
      } else {
        this.build(!build);
      }

      return this;
    }
  };
  p.suffix = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (v === undefined || v === true) {
      if (!this._parts.path || this._parts.path === '/') {
        return '';
      }

      var filename = this.filename();
      var pos = filename.lastIndexOf('.');
      var s, res;

      if (pos === -1) {
        return '';
      }

      // suffix may only contain alnum characters (yup, I made this up.)
      s = filename.substring(pos+1);
      res = (/^[a-z0-9%]+$/i).test(s) ? s : '';
      return v ? URI.decodePathSegment(res) : res;
    } else {
      if (v.charAt(0) === '.') {
        v = v.substring(1);
      }

      var suffix = this.suffix();
      var replace;

      if (!suffix) {
        if (!v) {
          return this;
        }

        this._parts.path += '.' + URI.recodePath(v);
      } else if (!v) {
        replace = new RegExp(escapeRegEx('.' + suffix) + '$');
      } else {
        replace = new RegExp(escapeRegEx(suffix) + '$');
      }

      if (replace) {
        v = URI.recodePath(v);
        this._parts.path = this._parts.path.replace(replace, v);
      }

      this.build(!build);
      return this;
    }
  };
  p.segment = function(segment, v, build) {
    var separator = this._parts.urn ? ':' : '/';
    var path = this.path();
    var absolute = path.substring(0, 1) === '/';
    var segments = path.split(separator);

    if (segment !== undefined && typeof segment !== 'number') {
      build = v;
      v = segment;
      segment = undefined;
    }

    if (segment !== undefined && typeof segment !== 'number') {
      throw new Error('Bad segment "' + segment + '", must be 0-based integer');
    }

    if (absolute) {
      segments.shift();
    }

    if (segment < 0) {
      // allow negative indexes to address from the end
      segment = Math.max(segments.length + segment, 0);
    }

    if (v === undefined) {
      /*jshint laxbreak: true */
      return segment === undefined
        ? segments
        : segments[segment];
      /*jshint laxbreak: false */
    } else if (segment === null || segments[segment] === undefined) {
      if (isArray(v)) {
        segments = [];
        // collapse empty elements within array
        for (var i=0, l=v.length; i < l; i++) {
          if (!v[i].length && (!segments.length || !segments[segments.length -1].length)) {
            continue;
          }

          if (segments.length && !segments[segments.length -1].length) {
            segments.pop();
          }

          segments.push(trimSlashes(v[i]));
        }
      } else if (v || typeof v === 'string') {
        v = trimSlashes(v);
        if (segments[segments.length -1] === '') {
          // empty trailing elements have to be overwritten
          // to prevent results such as /foo//bar
          segments[segments.length -1] = v;
        } else {
          segments.push(v);
        }
      }
    } else {
      if (v) {
        segments[segment] = trimSlashes(v);
      } else {
        segments.splice(segment, 1);
      }
    }

    if (absolute) {
      segments.unshift('');
    }

    return this.path(segments.join(separator), build);
  };
  p.segmentCoded = function(segment, v, build) {
    var segments, i, l;

    if (typeof segment !== 'number') {
      build = v;
      v = segment;
      segment = undefined;
    }

    if (v === undefined) {
      segments = this.segment(segment, v, build);
      if (!isArray(segments)) {
        segments = segments !== undefined ? URI.decode(segments) : undefined;
      } else {
        for (i = 0, l = segments.length; i < l; i++) {
          segments[i] = URI.decode(segments[i]);
        }
      }

      return segments;
    }

    if (!isArray(v)) {
      v = (typeof v === 'string' || v instanceof String) ? URI.encode(v) : v;
    } else {
      for (i = 0, l = v.length; i < l; i++) {
        v[i] = URI.encode(v[i]);
      }
    }

    return this.segment(segment, v, build);
  };

  // mutating query string
  var q = p.query;
  p.query = function(v, build) {
    if (v === true) {
      return URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
    } else if (typeof v === 'function') {
      var data = URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
      var result = v.call(this, data);
      this._parts.query = URI.buildQuery(result || data, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
      this.build(!build);
      return this;
    } else if (v !== undefined && typeof v !== 'string') {
      this._parts.query = URI.buildQuery(v, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
      this.build(!build);
      return this;
    } else {
      return q.call(this, v, build);
    }
  };
  p.setQuery = function(name, value, build) {
    var data = URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace);

    if (typeof name === 'string' || name instanceof String) {
      data[name] = value !== undefined ? value : null;
    } else if (typeof name === 'object') {
      for (var key in name) {
        if (hasOwn.call(name, key)) {
          data[key] = name[key];
        }
      }
    } else {
      throw new TypeError('URI.addQuery() accepts an object, string as the name parameter');
    }

    this._parts.query = URI.buildQuery(data, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
    if (typeof name !== 'string') {
      build = value;
    }

    this.build(!build);
    return this;
  };
  p.addQuery = function(name, value, build) {
    var data = URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
    URI.addQuery(data, name, value === undefined ? null : value);
    this._parts.query = URI.buildQuery(data, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
    if (typeof name !== 'string') {
      build = value;
    }

    this.build(!build);
    return this;
  };
  p.removeQuery = function(name, value, build) {
    var data = URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
    URI.removeQuery(data, name, value);
    this._parts.query = URI.buildQuery(data, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
    if (typeof name !== 'string') {
      build = value;
    }

    this.build(!build);
    return this;
  };
  p.hasQuery = function(name, value, withinArray) {
    var data = URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
    return URI.hasQuery(data, name, value, withinArray);
  };
  p.setSearch = p.setQuery;
  p.addSearch = p.addQuery;
  p.removeSearch = p.removeQuery;
  p.hasSearch = p.hasQuery;

  // sanitizing URLs
  p.normalize = function() {
    if (this._parts.urn) {
      return this
        .normalizeProtocol(false)
        .normalizePath(false)
        .normalizeQuery(false)
        .normalizeFragment(false)
        .build();
    }

    return this
      .normalizeProtocol(false)
      .normalizeHostname(false)
      .normalizePort(false)
      .normalizePath(false)
      .normalizeQuery(false)
      .normalizeFragment(false)
      .build();
  };
  p.normalizeProtocol = function(build) {
    if (typeof this._parts.protocol === 'string') {
      this._parts.protocol = this._parts.protocol.toLowerCase();
      this.build(!build);
    }

    return this;
  };
  p.normalizeHostname = function(build) {
    if (this._parts.hostname) {
      if (this.is('IDN') && punycode) {
        this._parts.hostname = punycode.toASCII(this._parts.hostname);
      } else if (this.is('IPv6') && IPv6) {
        this._parts.hostname = IPv6.best(this._parts.hostname);
      }

      this._parts.hostname = this._parts.hostname.toLowerCase();
      this.build(!build);
    }

    return this;
  };
  p.normalizePort = function(build) {
    // remove port of it's the protocol's default
    if (typeof this._parts.protocol === 'string' && this._parts.port === URI.defaultPorts[this._parts.protocol]) {
      this._parts.port = null;
      this.build(!build);
    }

    return this;
  };
  p.normalizePath = function(build) {
    var _path = this._parts.path;
    if (!_path) {
      return this;
    }

    if (this._parts.urn) {
      this._parts.path = URI.recodeUrnPath(this._parts.path);
      this.build(!build);
      return this;
    }

    if (this._parts.path === '/') {
      return this;
    }

    _path = URI.recodePath(_path);

    var _was_relative;
    var _leadingParents = '';
    var _parent, _pos;

    // handle relative paths
    if (_path.charAt(0) !== '/') {
      _was_relative = true;
      _path = '/' + _path;
    }

    // handle relative files (as opposed to directories)
    if (_path.slice(-3) === '/..' || _path.slice(-2) === '/.') {
      _path += '/';
    }

    // resolve simples
    _path = _path
      .replace(/(\/(\.\/)+)|(\/\.$)/g, '/')
      .replace(/\/{2,}/g, '/');

    // remember leading parents
    if (_was_relative) {
      _leadingParents = _path.substring(1).match(/^(\.\.\/)+/) || '';
      if (_leadingParents) {
        _leadingParents = _leadingParents[0];
      }
    }

    // resolve parents
    while (true) {
      _parent = _path.search(/\/\.\.(\/|$)/);
      if (_parent === -1) {
        // no more ../ to resolve
        break;
      } else if (_parent === 0) {
        // top level cannot be relative, skip it
        _path = _path.substring(3);
        continue;
      }

      _pos = _path.substring(0, _parent).lastIndexOf('/');
      if (_pos === -1) {
        _pos = _parent;
      }
      _path = _path.substring(0, _pos) + _path.substring(_parent + 3);
    }

    // revert to relative
    if (_was_relative && this.is('relative')) {
      _path = _leadingParents + _path.substring(1);
    }

    this._parts.path = _path;
    this.build(!build);
    return this;
  };
  p.normalizePathname = p.normalizePath;
  p.normalizeQuery = function(build) {
    if (typeof this._parts.query === 'string') {
      if (!this._parts.query.length) {
        this._parts.query = null;
      } else {
        this.query(URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace));
      }

      this.build(!build);
    }

    return this;
  };
  p.normalizeFragment = function(build) {
    if (!this._parts.fragment) {
      this._parts.fragment = null;
      this.build(!build);
    }

    return this;
  };
  p.normalizeSearch = p.normalizeQuery;
  p.normalizeHash = p.normalizeFragment;

  p.iso8859 = function() {
    // expect unicode input, iso8859 output
    var e = URI.encode;
    var d = URI.decode;

    URI.encode = escape;
    URI.decode = decodeURIComponent;
    try {
      this.normalize();
    } finally {
      URI.encode = e;
      URI.decode = d;
    }
    return this;
  };

  p.unicode = function() {
    // expect iso8859 input, unicode output
    var e = URI.encode;
    var d = URI.decode;

    URI.encode = strictEncodeURIComponent;
    URI.decode = unescape;
    try {
      this.normalize();
    } finally {
      URI.encode = e;
      URI.decode = d;
    }
    return this;
  };

  p.readable = function() {
    var uri = this.clone();
    // removing username, password, because they shouldn't be displayed according to RFC 3986
    uri.username('').password('').normalize();
    var t = '';
    if (uri._parts.protocol) {
      t += uri._parts.protocol + '://';
    }

    if (uri._parts.hostname) {
      if (uri.is('punycode') && punycode) {
        t += punycode.toUnicode(uri._parts.hostname);
        if (uri._parts.port) {
          t += ':' + uri._parts.port;
        }
      } else {
        t += uri.host();
      }
    }

    if (uri._parts.hostname && uri._parts.path && uri._parts.path.charAt(0) !== '/') {
      t += '/';
    }

    t += uri.path(true);
    if (uri._parts.query) {
      var q = '';
      for (var i = 0, qp = uri._parts.query.split('&'), l = qp.length; i < l; i++) {
        var kv = (qp[i] || '').split('=');
        q += '&' + URI.decodeQuery(kv[0], this._parts.escapeQuerySpace)
          .replace(/&/g, '%26');

        if (kv[1] !== undefined) {
          q += '=' + URI.decodeQuery(kv[1], this._parts.escapeQuerySpace)
            .replace(/&/g, '%26');
        }
      }
      t += '?' + q.substring(1);
    }

    t += URI.decodeQuery(uri.hash(), true);
    return t;
  };

  // resolving relative and absolute URLs
  p.absoluteTo = function(base) {
    var resolved = this.clone();
    var properties = ['protocol', 'username', 'password', 'hostname', 'port'];
    var basedir, i, p;

    if (this._parts.urn) {
      throw new Error('URNs do not have any generally defined hierarchical components');
    }

    if (!(base instanceof URI)) {
      base = new URI(base);
    }

    if (!resolved._parts.protocol) {
      resolved._parts.protocol = base._parts.protocol;
    }

    if (this._parts.hostname) {
      return resolved;
    }

    for (i = 0; (p = properties[i]); i++) {
      resolved._parts[p] = base._parts[p];
    }

    if (!resolved._parts.path) {
      resolved._parts.path = base._parts.path;
      if (!resolved._parts.query) {
        resolved._parts.query = base._parts.query;
      }
    } else if (resolved._parts.path.substring(-2) === '..') {
      resolved._parts.path += '/';
    }

    if (resolved.path().charAt(0) !== '/') {
      basedir = base.directory();
      basedir = basedir ? basedir : base.path().indexOf('/') === 0 ? '/' : '';
      resolved._parts.path = (basedir ? (basedir + '/') : '') + resolved._parts.path;
      resolved.normalizePath();
    }

    resolved.build();
    return resolved;
  };
  p.relativeTo = function(base) {
    var relative = this.clone().normalize();
    var relativeParts, baseParts, common, relativePath, basePath;

    if (relative._parts.urn) {
      throw new Error('URNs do not have any generally defined hierarchical components');
    }

    base = new URI(base).normalize();
    relativeParts = relative._parts;
    baseParts = base._parts;
    relativePath = relative.path();
    basePath = base.path();

    if (relativePath.charAt(0) !== '/') {
      throw new Error('URI is already relative');
    }

    if (basePath.charAt(0) !== '/') {
      throw new Error('Cannot calculate a URI relative to another relative URI');
    }

    if (relativeParts.protocol === baseParts.protocol) {
      relativeParts.protocol = null;
    }

    if (relativeParts.username !== baseParts.username || relativeParts.password !== baseParts.password) {
      return relative.build();
    }

    if (relativeParts.protocol !== null || relativeParts.username !== null || relativeParts.password !== null) {
      return relative.build();
    }

    if (relativeParts.hostname === baseParts.hostname && relativeParts.port === baseParts.port) {
      relativeParts.hostname = null;
      relativeParts.port = null;
    } else {
      return relative.build();
    }

    if (relativePath === basePath) {
      relativeParts.path = '';
      return relative.build();
    }

    // determine common sub path
    common = URI.commonPath(relativePath, basePath);

    // If the paths have nothing in common, return a relative URL with the absolute path.
    if (!common) {
      return relative.build();
    }

    var parents = baseParts.path
      .substring(common.length)
      .replace(/[^\/]*$/, '')
      .replace(/.*?\//g, '../');

    relativeParts.path = (parents + relativeParts.path.substring(common.length)) || './';

    return relative.build();
  };

  // comparing URIs
  p.equals = function(uri) {
    var one = this.clone();
    var two = new URI(uri);
    var one_map = {};
    var two_map = {};
    var checked = {};
    var one_query, two_query, key;

    one.normalize();
    two.normalize();

    // exact match
    if (one.toString() === two.toString()) {
      return true;
    }

    // extract query string
    one_query = one.query();
    two_query = two.query();
    one.query('');
    two.query('');

    // definitely not equal if not even non-query parts match
    if (one.toString() !== two.toString()) {
      return false;
    }

    // query parameters have the same length, even if they're permuted
    if (one_query.length !== two_query.length) {
      return false;
    }

    one_map = URI.parseQuery(one_query, this._parts.escapeQuerySpace);
    two_map = URI.parseQuery(two_query, this._parts.escapeQuerySpace);

    for (key in one_map) {
      if (hasOwn.call(one_map, key)) {
        if (!isArray(one_map[key])) {
          if (one_map[key] !== two_map[key]) {
            return false;
          }
        } else if (!arraysEqual(one_map[key], two_map[key])) {
          return false;
        }

        checked[key] = true;
      }
    }

    for (key in two_map) {
      if (hasOwn.call(two_map, key)) {
        if (!checked[key]) {
          // two contains a parameter not present in one
          return false;
        }
      }
    }

    return true;
  };

  // state
  p.duplicateQueryParameters = function(v) {
    this._parts.duplicateQueryParameters = !!v;
    return this;
  };

  p.escapeQuerySpace = function(v) {
    this._parts.escapeQuerySpace = !!v;
    return this;
  };

  return URI;
}));

/** @license zlib.js 2012 - imaya [ https://github.com/imaya/zlib.js ] The MIT License */(function() {'use strict';function q(b){throw b;}var t=void 0,u=!0,aa=this;function A(b,a){var c=b.split("."),d=aa;!(c[0]in d)&&d.execScript&&d.execScript("var "+c[0]);for(var e;c.length&&(e=c.shift());)!c.length&&a!==t?d[e]=a:d=d[e]?d[e]:d[e]={}};var B="undefined"!==typeof Uint8Array&&"undefined"!==typeof Uint16Array&&"undefined"!==typeof Uint32Array&&"undefined"!==typeof DataView;function F(b,a){this.index="number"===typeof a?a:0;this.m=0;this.buffer=b instanceof(B?Uint8Array:Array)?b:new (B?Uint8Array:Array)(32768);2*this.buffer.length<=this.index&&q(Error("invalid index"));this.buffer.length<=this.index&&this.f()}F.prototype.f=function(){var b=this.buffer,a,c=b.length,d=new (B?Uint8Array:Array)(c<<1);if(B)d.set(b);else for(a=0;a<c;++a)d[a]=b[a];return this.buffer=d};
F.prototype.d=function(b,a,c){var d=this.buffer,e=this.index,f=this.m,g=d[e],k;c&&1<a&&(b=8<a?(H[b&255]<<24|H[b>>>8&255]<<16|H[b>>>16&255]<<8|H[b>>>24&255])>>32-a:H[b]>>8-a);if(8>a+f)g=g<<a|b,f+=a;else for(k=0;k<a;++k)g=g<<1|b>>a-k-1&1,8===++f&&(f=0,d[e++]=H[g],g=0,e===d.length&&(d=this.f()));d[e]=g;this.buffer=d;this.m=f;this.index=e};F.prototype.finish=function(){var b=this.buffer,a=this.index,c;0<this.m&&(b[a]<<=8-this.m,b[a]=H[b[a]],a++);B?c=b.subarray(0,a):(b.length=a,c=b);return c};
var ba=new (B?Uint8Array:Array)(256),ca;for(ca=0;256>ca;++ca){for(var K=ca,da=K,ea=7,K=K>>>1;K;K>>>=1)da<<=1,da|=K&1,--ea;ba[ca]=(da<<ea&255)>>>0}var H=ba;function ja(b,a,c){var d,e="number"===typeof a?a:a=0,f="number"===typeof c?c:b.length;d=-1;for(e=f&7;e--;++a)d=d>>>8^O[(d^b[a])&255];for(e=f>>3;e--;a+=8)d=d>>>8^O[(d^b[a])&255],d=d>>>8^O[(d^b[a+1])&255],d=d>>>8^O[(d^b[a+2])&255],d=d>>>8^O[(d^b[a+3])&255],d=d>>>8^O[(d^b[a+4])&255],d=d>>>8^O[(d^b[a+5])&255],d=d>>>8^O[(d^b[a+6])&255],d=d>>>8^O[(d^b[a+7])&255];return(d^4294967295)>>>0}
var ka=[0,1996959894,3993919788,2567524794,124634137,1886057615,3915621685,2657392035,249268274,2044508324,3772115230,2547177864,162941995,2125561021,3887607047,2428444049,498536548,1789927666,4089016648,2227061214,450548861,1843258603,4107580753,2211677639,325883990,1684777152,4251122042,2321926636,335633487,1661365465,4195302755,2366115317,997073096,1281953886,3579855332,2724688242,1006888145,1258607687,3524101629,2768942443,901097722,1119000684,3686517206,2898065728,853044451,1172266101,3705015759,
2882616665,651767980,1373503546,3369554304,3218104598,565507253,1454621731,3485111705,3099436303,671266974,1594198024,3322730930,2970347812,795835527,1483230225,3244367275,3060149565,1994146192,31158534,2563907772,4023717930,1907459465,112637215,2680153253,3904427059,2013776290,251722036,2517215374,3775830040,2137656763,141376813,2439277719,3865271297,1802195444,476864866,2238001368,4066508878,1812370925,453092731,2181625025,4111451223,1706088902,314042704,2344532202,4240017532,1658658271,366619977,
2362670323,4224994405,1303535960,984961486,2747007092,3569037538,1256170817,1037604311,2765210733,3554079995,1131014506,879679996,2909243462,3663771856,1141124467,855842277,2852801631,3708648649,1342533948,654459306,3188396048,3373015174,1466479909,544179635,3110523913,3462522015,1591671054,702138776,2966460450,3352799412,1504918807,783551873,3082640443,3233442989,3988292384,2596254646,62317068,1957810842,3939845945,2647816111,81470997,1943803523,3814918930,2489596804,225274430,2053790376,3826175755,
2466906013,167816743,2097651377,4027552580,2265490386,503444072,1762050814,4150417245,2154129355,426522225,1852507879,4275313526,2312317920,282753626,1742555852,4189708143,2394877945,397917763,1622183637,3604390888,2714866558,953729732,1340076626,3518719985,2797360999,1068828381,1219638859,3624741850,2936675148,906185462,1090812512,3747672003,2825379669,829329135,1181335161,3412177804,3160834842,628085408,1382605366,3423369109,3138078467,570562233,1426400815,3317316542,2998733608,733239954,1555261956,
3268935591,3050360625,752459403,1541320221,2607071920,3965973030,1969922972,40735498,2617837225,3943577151,1913087877,83908371,2512341634,3803740692,2075208622,213261112,2463272603,3855990285,2094854071,198958881,2262029012,4057260610,1759359992,534414190,2176718541,4139329115,1873836001,414664567,2282248934,4279200368,1711684554,285281116,2405801727,4167216745,1634467795,376229701,2685067896,3608007406,1308918612,956543938,2808555105,3495958263,1231636301,1047427035,2932959818,3654703836,1088359270,
936918E3,2847714899,3736837829,1202900863,817233897,3183342108,3401237130,1404277552,615818150,3134207493,3453421203,1423857449,601450431,3009837614,3294710456,1567103746,711928724,3020668471,3272380065,1510334235,755167117],O=B?new Uint32Array(ka):ka;function P(){}P.prototype.getName=function(){return this.name};P.prototype.getData=function(){return this.data};P.prototype.Y=function(){return this.Z};A("Zlib.GunzipMember",P);A("Zlib.GunzipMember.prototype.getName",P.prototype.getName);A("Zlib.GunzipMember.prototype.getData",P.prototype.getData);A("Zlib.GunzipMember.prototype.getMtime",P.prototype.Y);function la(b){this.buffer=new (B?Uint16Array:Array)(2*b);this.length=0}la.prototype.getParent=function(b){return 2*((b-2)/4|0)};la.prototype.push=function(b,a){var c,d,e=this.buffer,f;c=this.length;e[this.length++]=a;for(e[this.length++]=b;0<c;)if(d=this.getParent(c),e[c]>e[d])f=e[c],e[c]=e[d],e[d]=f,f=e[c+1],e[c+1]=e[d+1],e[d+1]=f,c=d;else break;return this.length};
la.prototype.pop=function(){var b,a,c=this.buffer,d,e,f;a=c[0];b=c[1];this.length-=2;c[0]=c[this.length];c[1]=c[this.length+1];for(f=0;;){e=2*f+2;if(e>=this.length)break;e+2<this.length&&c[e+2]>c[e]&&(e+=2);if(c[e]>c[f])d=c[f],c[f]=c[e],c[e]=d,d=c[f+1],c[f+1]=c[e+1],c[e+1]=d;else break;f=e}return{index:b,value:a,length:this.length}};function ma(b){var a=b.length,c=0,d=Number.POSITIVE_INFINITY,e,f,g,k,h,l,s,p,m,n;for(p=0;p<a;++p)b[p]>c&&(c=b[p]),b[p]<d&&(d=b[p]);e=1<<c;f=new (B?Uint32Array:Array)(e);g=1;k=0;for(h=2;g<=c;){for(p=0;p<a;++p)if(b[p]===g){l=0;s=k;for(m=0;m<g;++m)l=l<<1|s&1,s>>=1;n=g<<16|p;for(m=l;m<e;m+=h)f[m]=n;++k}++g;k<<=1;h<<=1}return[f,c,d]};function na(b,a){this.k=qa;this.I=0;this.input=B&&b instanceof Array?new Uint8Array(b):b;this.b=0;a&&(a.lazy&&(this.I=a.lazy),"number"===typeof a.compressionType&&(this.k=a.compressionType),a.outputBuffer&&(this.a=B&&a.outputBuffer instanceof Array?new Uint8Array(a.outputBuffer):a.outputBuffer),"number"===typeof a.outputIndex&&(this.b=a.outputIndex));this.a||(this.a=new (B?Uint8Array:Array)(32768))}var qa=2,ra={NONE:0,v:1,o:qa,ba:3},sa=[],S;
for(S=0;288>S;S++)switch(u){case 143>=S:sa.push([S+48,8]);break;case 255>=S:sa.push([S-144+400,9]);break;case 279>=S:sa.push([S-256+0,7]);break;case 287>=S:sa.push([S-280+192,8]);break;default:q("invalid literal: "+S)}
na.prototype.g=function(){var b,a,c,d,e=this.input;switch(this.k){case 0:c=0;for(d=e.length;c<d;){a=B?e.subarray(c,c+65535):e.slice(c,c+65535);c+=a.length;var f=a,g=c===d,k=t,h=t,l=t,s=t,p=t,m=this.a,n=this.b;if(B){for(m=new Uint8Array(this.a.buffer);m.length<=n+f.length+5;)m=new Uint8Array(m.length<<1);m.set(this.a)}k=g?1:0;m[n++]=k|0;h=f.length;l=~h+65536&65535;m[n++]=h&255;m[n++]=h>>>8&255;m[n++]=l&255;m[n++]=l>>>8&255;if(B)m.set(f,n),n+=f.length,m=m.subarray(0,n);else{s=0;for(p=f.length;s<p;++s)m[n++]=
f[s];m.length=n}this.b=n;this.a=m}break;case 1:var r=new F(B?new Uint8Array(this.a.buffer):this.a,this.b);r.d(1,1,u);r.d(1,2,u);var v=ta(this,e),x,Q,y;x=0;for(Q=v.length;x<Q;x++)if(y=v[x],F.prototype.d.apply(r,sa[y]),256<y)r.d(v[++x],v[++x],u),r.d(v[++x],5),r.d(v[++x],v[++x],u);else if(256===y)break;this.a=r.finish();this.b=this.a.length;break;case qa:var E=new F(B?new Uint8Array(this.a.buffer):this.a,this.b),Ka,R,X,Y,Z,pb=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],fa,La,ga,Ma,oa,wa=Array(19),
Na,$,pa,C,Oa;Ka=qa;E.d(1,1,u);E.d(Ka,2,u);R=ta(this,e);fa=ua(this.W,15);La=va(fa);ga=ua(this.V,7);Ma=va(ga);for(X=286;257<X&&0===fa[X-1];X--);for(Y=30;1<Y&&0===ga[Y-1];Y--);var Pa=X,Qa=Y,J=new (B?Uint32Array:Array)(Pa+Qa),w,L,z,ha,I=new (B?Uint32Array:Array)(316),G,D,M=new (B?Uint8Array:Array)(19);for(w=L=0;w<Pa;w++)J[L++]=fa[w];for(w=0;w<Qa;w++)J[L++]=ga[w];if(!B){w=0;for(ha=M.length;w<ha;++w)M[w]=0}w=G=0;for(ha=J.length;w<ha;w+=L){for(L=1;w+L<ha&&J[w+L]===J[w];++L);z=L;if(0===J[w])if(3>z)for(;0<
z--;)I[G++]=0,M[0]++;else for(;0<z;)D=138>z?z:138,D>z-3&&D<z&&(D=z-3),10>=D?(I[G++]=17,I[G++]=D-3,M[17]++):(I[G++]=18,I[G++]=D-11,M[18]++),z-=D;else if(I[G++]=J[w],M[J[w]]++,z--,3>z)for(;0<z--;)I[G++]=J[w],M[J[w]]++;else for(;0<z;)D=6>z?z:6,D>z-3&&D<z&&(D=z-3),I[G++]=16,I[G++]=D-3,M[16]++,z-=D}b=B?I.subarray(0,G):I.slice(0,G);oa=ua(M,7);for(C=0;19>C;C++)wa[C]=oa[pb[C]];for(Z=19;4<Z&&0===wa[Z-1];Z--);Na=va(oa);E.d(X-257,5,u);E.d(Y-1,5,u);E.d(Z-4,4,u);for(C=0;C<Z;C++)E.d(wa[C],3,u);C=0;for(Oa=b.length;C<
Oa;C++)if($=b[C],E.d(Na[$],oa[$],u),16<=$){C++;switch($){case 16:pa=2;break;case 17:pa=3;break;case 18:pa=7;break;default:q("invalid code: "+$)}E.d(b[C],pa,u)}var Ra=[La,fa],Sa=[Ma,ga],N,Ta,ia,za,Ua,Va,Wa,Xa;Ua=Ra[0];Va=Ra[1];Wa=Sa[0];Xa=Sa[1];N=0;for(Ta=R.length;N<Ta;++N)if(ia=R[N],E.d(Ua[ia],Va[ia],u),256<ia)E.d(R[++N],R[++N],u),za=R[++N],E.d(Wa[za],Xa[za],u),E.d(R[++N],R[++N],u);else if(256===ia)break;this.a=E.finish();this.b=this.a.length;break;default:q("invalid compression type")}return this.a};
function xa(b,a){this.length=b;this.Q=a}
var ya=function(){function b(a){switch(u){case 3===a:return[257,a-3,0];case 4===a:return[258,a-4,0];case 5===a:return[259,a-5,0];case 6===a:return[260,a-6,0];case 7===a:return[261,a-7,0];case 8===a:return[262,a-8,0];case 9===a:return[263,a-9,0];case 10===a:return[264,a-10,0];case 12>=a:return[265,a-11,1];case 14>=a:return[266,a-13,1];case 16>=a:return[267,a-15,1];case 18>=a:return[268,a-17,1];case 22>=a:return[269,a-19,2];case 26>=a:return[270,a-23,2];case 30>=a:return[271,a-27,2];case 34>=a:return[272,
a-31,2];case 42>=a:return[273,a-35,3];case 50>=a:return[274,a-43,3];case 58>=a:return[275,a-51,3];case 66>=a:return[276,a-59,3];case 82>=a:return[277,a-67,4];case 98>=a:return[278,a-83,4];case 114>=a:return[279,a-99,4];case 130>=a:return[280,a-115,4];case 162>=a:return[281,a-131,5];case 194>=a:return[282,a-163,5];case 226>=a:return[283,a-195,5];case 257>=a:return[284,a-227,5];case 258===a:return[285,a-258,0];default:q("invalid length: "+a)}}var a=[],c,d;for(c=3;258>=c;c++)d=b(c),a[c]=d[2]<<24|d[1]<<
16|d[0];return a}(),Aa=B?new Uint32Array(ya):ya;
function ta(b,a){function c(a,c){var b=a.Q,d=[],e=0,f;f=Aa[a.length];d[e++]=f&65535;d[e++]=f>>16&255;d[e++]=f>>24;var g;switch(u){case 1===b:g=[0,b-1,0];break;case 2===b:g=[1,b-2,0];break;case 3===b:g=[2,b-3,0];break;case 4===b:g=[3,b-4,0];break;case 6>=b:g=[4,b-5,1];break;case 8>=b:g=[5,b-7,1];break;case 12>=b:g=[6,b-9,2];break;case 16>=b:g=[7,b-13,2];break;case 24>=b:g=[8,b-17,3];break;case 32>=b:g=[9,b-25,3];break;case 48>=b:g=[10,b-33,4];break;case 64>=b:g=[11,b-49,4];break;case 96>=b:g=[12,b-
65,5];break;case 128>=b:g=[13,b-97,5];break;case 192>=b:g=[14,b-129,6];break;case 256>=b:g=[15,b-193,6];break;case 384>=b:g=[16,b-257,7];break;case 512>=b:g=[17,b-385,7];break;case 768>=b:g=[18,b-513,8];break;case 1024>=b:g=[19,b-769,8];break;case 1536>=b:g=[20,b-1025,9];break;case 2048>=b:g=[21,b-1537,9];break;case 3072>=b:g=[22,b-2049,10];break;case 4096>=b:g=[23,b-3073,10];break;case 6144>=b:g=[24,b-4097,11];break;case 8192>=b:g=[25,b-6145,11];break;case 12288>=b:g=[26,b-8193,12];break;case 16384>=
b:g=[27,b-12289,12];break;case 24576>=b:g=[28,b-16385,13];break;case 32768>=b:g=[29,b-24577,13];break;default:q("invalid distance")}f=g;d[e++]=f[0];d[e++]=f[1];d[e++]=f[2];var h,k;h=0;for(k=d.length;h<k;++h)m[n++]=d[h];v[d[0]]++;x[d[3]]++;r=a.length+c-1;p=null}var d,e,f,g,k,h={},l,s,p,m=B?new Uint16Array(2*a.length):[],n=0,r=0,v=new (B?Uint32Array:Array)(286),x=new (B?Uint32Array:Array)(30),Q=b.I,y;if(!B){for(f=0;285>=f;)v[f++]=0;for(f=0;29>=f;)x[f++]=0}v[256]=1;d=0;for(e=a.length;d<e;++d){f=k=0;
for(g=3;f<g&&d+f!==e;++f)k=k<<8|a[d+f];h[k]===t&&(h[k]=[]);l=h[k];if(!(0<r--)){for(;0<l.length&&32768<d-l[0];)l.shift();if(d+3>=e){p&&c(p,-1);f=0;for(g=e-d;f<g;++f)y=a[d+f],m[n++]=y,++v[y];break}0<l.length?(s=Ba(a,d,l),p?p.length<s.length?(y=a[d-1],m[n++]=y,++v[y],c(s,0)):c(p,-1):s.length<Q?p=s:c(s,0)):p?c(p,-1):(y=a[d],m[n++]=y,++v[y])}l.push(d)}m[n++]=256;v[256]++;b.W=v;b.V=x;return B?m.subarray(0,n):m}
function Ba(b,a,c){var d,e,f=0,g,k,h,l,s=b.length;k=0;l=c.length;a:for(;k<l;k++){d=c[l-k-1];g=3;if(3<f){for(h=f;3<h;h--)if(b[d+h-1]!==b[a+h-1])continue a;g=f}for(;258>g&&a+g<s&&b[d+g]===b[a+g];)++g;g>f&&(e=d,f=g);if(258===g)break}return new xa(f,a-e)}
function ua(b,a){var c=b.length,d=new la(572),e=new (B?Uint8Array:Array)(c),f,g,k,h,l;if(!B)for(h=0;h<c;h++)e[h]=0;for(h=0;h<c;++h)0<b[h]&&d.push(h,b[h]);f=Array(d.length/2);g=new (B?Uint32Array:Array)(d.length/2);if(1===f.length)return e[d.pop().index]=1,e;h=0;for(l=d.length/2;h<l;++h)f[h]=d.pop(),g[h]=f[h].value;k=Ca(g,g.length,a);h=0;for(l=f.length;h<l;++h)e[f[h].index]=k[h];return e}
function Ca(b,a,c){function d(b){var c=h[b][l[b]];c===a?(d(b+1),d(b+1)):--g[c];++l[b]}var e=new (B?Uint16Array:Array)(c),f=new (B?Uint8Array:Array)(c),g=new (B?Uint8Array:Array)(a),k=Array(c),h=Array(c),l=Array(c),s=(1<<c)-a,p=1<<c-1,m,n,r,v,x;e[c-1]=a;for(n=0;n<c;++n)s<p?f[n]=0:(f[n]=1,s-=p),s<<=1,e[c-2-n]=(e[c-1-n]/2|0)+a;e[0]=f[0];k[0]=Array(e[0]);h[0]=Array(e[0]);for(n=1;n<c;++n)e[n]>2*e[n-1]+f[n]&&(e[n]=2*e[n-1]+f[n]),k[n]=Array(e[n]),h[n]=Array(e[n]);for(m=0;m<a;++m)g[m]=c;for(r=0;r<e[c-1];++r)k[c-
1][r]=b[r],h[c-1][r]=r;for(m=0;m<c;++m)l[m]=0;1===f[c-1]&&(--g[0],++l[c-1]);for(n=c-2;0<=n;--n){v=m=0;x=l[n+1];for(r=0;r<e[n];r++)v=k[n+1][x]+k[n+1][x+1],v>b[m]?(k[n][r]=v,h[n][r]=a,x+=2):(k[n][r]=b[m],h[n][r]=m,++m);l[n]=0;1===f[n]&&d(n)}return g}
function va(b){var a=new (B?Uint16Array:Array)(b.length),c=[],d=[],e=0,f,g,k,h;f=0;for(g=b.length;f<g;f++)c[b[f]]=(c[b[f]]|0)+1;f=1;for(g=16;f<=g;f++)d[f]=e,e+=c[f]|0,e<<=1;f=0;for(g=b.length;f<g;f++){e=d[b[f]];d[b[f]]+=1;k=a[f]=0;for(h=b[f];k<h;k++)a[f]=a[f]<<1|e&1,e>>>=1}return a};function Da(b,a){this.input=b;this.b=this.c=0;this.i={};a&&(a.flags&&(this.i=a.flags),"string"===typeof a.filename&&(this.filename=a.filename),"string"===typeof a.comment&&(this.A=a.comment),a.deflateOptions&&(this.l=a.deflateOptions));this.l||(this.l={})}
Da.prototype.g=function(){var b,a,c,d,e,f,g,k,h=new (B?Uint8Array:Array)(32768),l=0,s=this.input,p=this.c,m=this.filename,n=this.A;h[l++]=31;h[l++]=139;h[l++]=8;b=0;this.i.fname&&(b|=Ea);this.i.fcomment&&(b|=Fa);this.i.fhcrc&&(b|=Ga);h[l++]=b;a=(Date.now?Date.now():+new Date)/1E3|0;h[l++]=a&255;h[l++]=a>>>8&255;h[l++]=a>>>16&255;h[l++]=a>>>24&255;h[l++]=0;h[l++]=Ha;if(this.i.fname!==t){g=0;for(k=m.length;g<k;++g)f=m.charCodeAt(g),255<f&&(h[l++]=f>>>8&255),h[l++]=f&255;h[l++]=0}if(this.i.comment){g=
0;for(k=n.length;g<k;++g)f=n.charCodeAt(g),255<f&&(h[l++]=f>>>8&255),h[l++]=f&255;h[l++]=0}this.i.fhcrc&&(c=ja(h,0,l)&65535,h[l++]=c&255,h[l++]=c>>>8&255);this.l.outputBuffer=h;this.l.outputIndex=l;e=new na(s,this.l);h=e.g();l=e.b;B&&(l+8>h.buffer.byteLength?(this.a=new Uint8Array(l+8),this.a.set(new Uint8Array(h.buffer)),h=this.a):h=new Uint8Array(h.buffer));d=ja(s,t,t);h[l++]=d&255;h[l++]=d>>>8&255;h[l++]=d>>>16&255;h[l++]=d>>>24&255;k=s.length;h[l++]=k&255;h[l++]=k>>>8&255;h[l++]=k>>>16&255;h[l++]=
k>>>24&255;this.c=p;B&&l<h.length&&(this.a=h=h.subarray(0,l));return h};var Ha=255,Ga=2,Ea=8,Fa=16;A("Zlib.Gzip",Da);A("Zlib.Gzip.prototype.compress",Da.prototype.g);function T(b,a){this.p=[];this.q=32768;this.e=this.j=this.c=this.u=0;this.input=B?new Uint8Array(b):b;this.w=!1;this.r=Ia;this.M=!1;if(a||!(a={}))a.index&&(this.c=a.index),a.bufferSize&&(this.q=a.bufferSize),a.bufferType&&(this.r=a.bufferType),a.resize&&(this.M=a.resize);switch(this.r){case Ja:this.b=32768;this.a=new (B?Uint8Array:Array)(32768+this.q+258);break;case Ia:this.b=0;this.a=new (B?Uint8Array:Array)(this.q);this.f=this.U;this.B=this.R;this.s=this.T;break;default:q(Error("invalid inflate mode"))}}
var Ja=0,Ia=1,Ya={O:Ja,N:Ia};
T.prototype.h=function(){for(;!this.w;){var b=U(this,3);b&1&&(this.w=u);b>>>=1;switch(b){case 0:var a=this.input,c=this.c,d=this.a,e=this.b,f=a.length,g=t,k=t,h=d.length,l=t;this.e=this.j=0;c+1>=f&&q(Error("invalid uncompressed block header: LEN"));g=a[c++]|a[c++]<<8;c+1>=f&&q(Error("invalid uncompressed block header: NLEN"));k=a[c++]|a[c++]<<8;g===~k&&q(Error("invalid uncompressed block header: length verify"));c+g>a.length&&q(Error("input buffer is broken"));switch(this.r){case Ja:for(;e+g>d.length;){l=
h-e;g-=l;if(B)d.set(a.subarray(c,c+l),e),e+=l,c+=l;else for(;l--;)d[e++]=a[c++];this.b=e;d=this.f();e=this.b}break;case Ia:for(;e+g>d.length;)d=this.f({F:2});break;default:q(Error("invalid inflate mode"))}if(B)d.set(a.subarray(c,c+g),e),e+=g,c+=g;else for(;g--;)d[e++]=a[c++];this.c=c;this.b=e;this.a=d;break;case 1:this.s(Za,$a);break;case 2:ab(this);break;default:q(Error("unknown BTYPE: "+b))}}return this.B()};
var bb=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],cb=B?new Uint16Array(bb):bb,db=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,258,258],eb=B?new Uint16Array(db):db,fb=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0],gb=B?new Uint8Array(fb):fb,hb=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577],ib=B?new Uint16Array(hb):hb,jb=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,
10,11,11,12,12,13,13],kb=B?new Uint8Array(jb):jb,lb=new (B?Uint8Array:Array)(288),V,mb;V=0;for(mb=lb.length;V<mb;++V)lb[V]=143>=V?8:255>=V?9:279>=V?7:8;var Za=ma(lb),nb=new (B?Uint8Array:Array)(30),ob,qb;ob=0;for(qb=nb.length;ob<qb;++ob)nb[ob]=5;var $a=ma(nb);function U(b,a){for(var c=b.j,d=b.e,e=b.input,f=b.c,g=e.length,k;d<a;)f>=g&&q(Error("input buffer is broken")),c|=e[f++]<<d,d+=8;k=c&(1<<a)-1;b.j=c>>>a;b.e=d-a;b.c=f;return k}
function rb(b,a){for(var c=b.j,d=b.e,e=b.input,f=b.c,g=e.length,k=a[0],h=a[1],l,s;d<h&&!(f>=g);)c|=e[f++]<<d,d+=8;l=k[c&(1<<h)-1];s=l>>>16;b.j=c>>s;b.e=d-s;b.c=f;return l&65535}
function ab(b){function a(a,b,c){var d,e=this.J,f,g;for(g=0;g<a;)switch(d=rb(this,b),d){case 16:for(f=3+U(this,2);f--;)c[g++]=e;break;case 17:for(f=3+U(this,3);f--;)c[g++]=0;e=0;break;case 18:for(f=11+U(this,7);f--;)c[g++]=0;e=0;break;default:e=c[g++]=d}this.J=e;return c}var c=U(b,5)+257,d=U(b,5)+1,e=U(b,4)+4,f=new (B?Uint8Array:Array)(cb.length),g,k,h,l;for(l=0;l<e;++l)f[cb[l]]=U(b,3);if(!B){l=e;for(e=f.length;l<e;++l)f[cb[l]]=0}g=ma(f);k=new (B?Uint8Array:Array)(c);h=new (B?Uint8Array:Array)(d);
b.J=0;b.s(ma(a.call(b,c,g,k)),ma(a.call(b,d,g,h)))}T.prototype.s=function(b,a){var c=this.a,d=this.b;this.C=b;for(var e=c.length-258,f,g,k,h;256!==(f=rb(this,b));)if(256>f)d>=e&&(this.b=d,c=this.f(),d=this.b),c[d++]=f;else{g=f-257;h=eb[g];0<gb[g]&&(h+=U(this,gb[g]));f=rb(this,a);k=ib[f];0<kb[f]&&(k+=U(this,kb[f]));d>=e&&(this.b=d,c=this.f(),d=this.b);for(;h--;)c[d]=c[d++-k]}for(;8<=this.e;)this.e-=8,this.c--;this.b=d};
T.prototype.T=function(b,a){var c=this.a,d=this.b;this.C=b;for(var e=c.length,f,g,k,h;256!==(f=rb(this,b));)if(256>f)d>=e&&(c=this.f(),e=c.length),c[d++]=f;else{g=f-257;h=eb[g];0<gb[g]&&(h+=U(this,gb[g]));f=rb(this,a);k=ib[f];0<kb[f]&&(k+=U(this,kb[f]));d+h>e&&(c=this.f(),e=c.length);for(;h--;)c[d]=c[d++-k]}for(;8<=this.e;)this.e-=8,this.c--;this.b=d};
T.prototype.f=function(){var b=new (B?Uint8Array:Array)(this.b-32768),a=this.b-32768,c,d,e=this.a;if(B)b.set(e.subarray(32768,b.length));else{c=0;for(d=b.length;c<d;++c)b[c]=e[c+32768]}this.p.push(b);this.u+=b.length;if(B)e.set(e.subarray(a,a+32768));else for(c=0;32768>c;++c)e[c]=e[a+c];this.b=32768;return e};
T.prototype.U=function(b){var a,c=this.input.length/this.c+1|0,d,e,f,g=this.input,k=this.a;b&&("number"===typeof b.F&&(c=b.F),"number"===typeof b.P&&(c+=b.P));2>c?(d=(g.length-this.c)/this.C[2],f=258*(d/2)|0,e=f<k.length?k.length+f:k.length<<1):e=k.length*c;B?(a=new Uint8Array(e),a.set(k)):a=k;return this.a=a};
T.prototype.B=function(){var b=0,a=this.a,c=this.p,d,e=new (B?Uint8Array:Array)(this.u+(this.b-32768)),f,g,k,h;if(0===c.length)return B?this.a.subarray(32768,this.b):this.a.slice(32768,this.b);f=0;for(g=c.length;f<g;++f){d=c[f];k=0;for(h=d.length;k<h;++k)e[b++]=d[k]}f=32768;for(g=this.b;f<g;++f)e[b++]=a[f];this.p=[];return this.buffer=e};
T.prototype.R=function(){var b,a=this.b;B?this.M?(b=new Uint8Array(a),b.set(this.a.subarray(0,a))):b=this.a.subarray(0,a):(this.a.length>a&&(this.a.length=a),b=this.a);return this.buffer=b};function sb(b){this.input=b;this.c=0;this.t=[];this.D=!1}sb.prototype.X=function(){this.D||this.h();return this.t.slice()};
sb.prototype.h=function(){for(var b=this.input.length;this.c<b;){var a=new P,c=t,d=t,e=t,f=t,g=t,k=t,h=t,l=t,s=t,p=this.input,m=this.c;a.G=p[m++];a.H=p[m++];(31!==a.G||139!==a.H)&&q(Error("invalid file signature:"+a.G+","+a.H));a.z=p[m++];switch(a.z){case 8:break;default:q(Error("unknown compression method: "+a.z))}a.n=p[m++];l=p[m++]|p[m++]<<8|p[m++]<<16|p[m++]<<24;a.Z=new Date(1E3*l);a.fa=p[m++];a.ea=p[m++];0<(a.n&4)&&(a.aa=p[m++]|p[m++]<<8,m+=a.aa);if(0<(a.n&Ea)){h=[];for(k=0;0<(g=p[m++]);)h[k++]=
String.fromCharCode(g);a.name=h.join("")}if(0<(a.n&Fa)){h=[];for(k=0;0<(g=p[m++]);)h[k++]=String.fromCharCode(g);a.A=h.join("")}0<(a.n&Ga)&&(a.S=ja(p,0,m)&65535,a.S!==(p[m++]|p[m++]<<8)&&q(Error("invalid header crc16")));c=p[p.length-4]|p[p.length-3]<<8|p[p.length-2]<<16|p[p.length-1]<<24;p.length-m-4-4<512*c&&(f=c);d=new T(p,{index:m,bufferSize:f});a.data=e=d.h();m=d.c;a.ca=s=(p[m++]|p[m++]<<8|p[m++]<<16|p[m++]<<24)>>>0;ja(e,t,t)!==s&&q(Error("invalid CRC-32 checksum: 0x"+ja(e,t,t).toString(16)+
" / 0x"+s.toString(16)));a.da=c=(p[m++]|p[m++]<<8|p[m++]<<16|p[m++]<<24)>>>0;(e.length&4294967295)!==c&&q(Error("invalid input size: "+(e.length&4294967295)+" / "+c));this.t.push(a);this.c=m}this.D=u;var n=this.t,r,v,x=0,Q=0,y;r=0;for(v=n.length;r<v;++r)Q+=n[r].data.length;if(B){y=new Uint8Array(Q);for(r=0;r<v;++r)y.set(n[r].data,x),x+=n[r].data.length}else{y=[];for(r=0;r<v;++r)y[r]=n[r].data;y=Array.prototype.concat.apply([],y)}return y};A("Zlib.Gunzip",sb);A("Zlib.Gunzip.prototype.decompress",sb.prototype.h);A("Zlib.Gunzip.prototype.getMembers",sb.prototype.X);function tb(b){if("string"===typeof b){var a=b.split(""),c,d;c=0;for(d=a.length;c<d;c++)a[c]=(a[c].charCodeAt(0)&255)>>>0;b=a}for(var e=1,f=0,g=b.length,k,h=0;0<g;){k=1024<g?1024:g;g-=k;do e+=b[h++],f+=e;while(--k);e%=65521;f%=65521}return(f<<16|e)>>>0};function ub(b,a){var c,d;this.input=b;this.c=0;if(a||!(a={}))a.index&&(this.c=a.index),a.verify&&(this.$=a.verify);c=b[this.c++];d=b[this.c++];switch(c&15){case vb:this.method=vb;break;default:q(Error("unsupported compression method"))}0!==((c<<8)+d)%31&&q(Error("invalid fcheck flag:"+((c<<8)+d)%31));d&32&&q(Error("fdict flag is not supported"));this.L=new T(b,{index:this.c,bufferSize:a.bufferSize,bufferType:a.bufferType,resize:a.resize})}
ub.prototype.h=function(){var b=this.input,a,c;a=this.L.h();this.c=this.L.c;this.$&&(c=(b[this.c++]<<24|b[this.c++]<<16|b[this.c++]<<8|b[this.c++])>>>0,c!==tb(a)&&q(Error("invalid adler-32 checksum")));return a};var vb=8;function wb(b,a){this.input=b;this.a=new (B?Uint8Array:Array)(32768);this.k=W.o;var c={},d;if((a||!(a={}))&&"number"===typeof a.compressionType)this.k=a.compressionType;for(d in a)c[d]=a[d];c.outputBuffer=this.a;this.K=new na(this.input,c)}var W=ra;
wb.prototype.g=function(){var b,a,c,d,e,f,g,k=0;g=this.a;b=vb;switch(b){case vb:a=Math.LOG2E*Math.log(32768)-8;break;default:q(Error("invalid compression method"))}c=a<<4|b;g[k++]=c;switch(b){case vb:switch(this.k){case W.NONE:e=0;break;case W.v:e=1;break;case W.o:e=2;break;default:q(Error("unsupported compression type"))}break;default:q(Error("invalid compression method"))}d=e<<6|0;g[k++]=d|31-(256*c+d)%31;f=tb(this.input);this.K.b=k;g=this.K.g();k=g.length;B&&(g=new Uint8Array(g.buffer),g.length<=
k+4&&(this.a=new Uint8Array(g.length+4),this.a.set(g),g=this.a),g=g.subarray(0,k+4));g[k++]=f>>24&255;g[k++]=f>>16&255;g[k++]=f>>8&255;g[k++]=f&255;return g};function xb(b,a){var c,d,e,f;if(Object.keys)c=Object.keys(a);else for(d in c=[],e=0,a)c[e++]=d;e=0;for(f=c.length;e<f;++e)d=c[e],A(b+"."+d,a[d])};A("Zlib.Inflate",ub);A("Zlib.Inflate.prototype.decompress",ub.prototype.h);xb("Zlib.Inflate.BufferType",{ADAPTIVE:Ya.N,BLOCK:Ya.O});A("Zlib.Deflate",wb);A("Zlib.Deflate.compress",function(b,a){return(new wb(b,a)).g()});A("Zlib.Deflate.prototype.compress",wb.prototype.g);xb("Zlib.Deflate.CompressionType",{NONE:W.NONE,FIXED:W.v,DYNAMIC:W.o});}).call(this); //@ sourceMappingURL=zlib_and_gzip.min.js.map

'use strict';
/*******************************************************************************
 * Copyright 2012 Pawel Psztyc
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 ******************************************************************************/

/**
 * Advanced Rest Client namespace
 */
var arc = arc || {};
/**
 * ARC app's namespace
 */
arc.app = arc.app || {};
/**
 * A namespace for the file importer / exporter.
 */
arc.app.router = arc.app.router || {};
/**
 * List of functions to call before route change.
 */
arc.app.router._middle = new Set();
arc.app.router._routes = new Map();
/**
 * Register middle finction that will be called each time when the route change.
 */
arc.app.router.middle = function(...callback) {
  callback.forEach((item) => arc.app.router._middle.add(item));
};

arc.app.router.register = function(path, callback) {
  arc.app.router._routes.set(path, callback);
};
/**
 * Handler for hash change.
 */
arc.app.router.onHash = function(e) {
  var route = e.newURL;
  var hashIndex = route.indexOf('#');
  if (hashIndex === -1) {
    arc.app.router.redirect('/');
    return;
  }
  route = route.substr(hashIndex).replace('#!', '');

  var call = arc.app.router.getRoute(route);
  if (!call) {
    console.warn(`Route "${route}" not found.`);
    arc.app.router.redirect('/');
    return;
  }

  var params = {
    params: {}
  };
  var parts = arc.app.router.parse(call);
  var copy = String(route);
  parts.forEach((item) => {
    if (typeof item === 'string') {
      copy = copy.replace(item, '');
      return;
    }
    copy = copy.substr(1);
    // let paramValue = copy.match(new RegExp(item.pattern))[0];
    let paramValue = copy.match(/[^\/]+/)[0];
    copy = copy.replace('/' + paramValue, '');
    params.params[item.name] = paramValue;
  });

  var clb = arc.app.router._routes.get(call);
  var fns = Array.from(arc.app.router._middle);
  fns.push(clb);
  arc.app.router.callCallback(params, fns);
};

arc.app.router.callCallback = function(params, arr) {
  var fn = arr.shift();
  if (!fn) {
    return;
  }
  fn(params, () => {
    arc.app.router.callCallback(params, arr);
  });
};

arc.app.router.redirect = function(to) {
  to = String(to);
  if (!to) {
    to = '/';
  }
  if (to[0] !== '/') {
    to = '/' + to;
  }
  location.hash = '!' + to;
};

arc.app.router.start = () => {
  window.addEventListener('hashchange', arc.app.router.onHash);
  arc.app.router.onHash({
    newURL: location.href
  });
};

arc.app.router.getRoute = function(route) {
  var keys = arc.app.router._routes.keys();
  for (let def of keys) {
    var paramIndex = def.indexOf(':');
    if (paramIndex === -1) {
      if (def === route) {
        return def;
      }
      continue;
    }
    if (route.indexOf(def.substr(0, paramIndex)) === 0) {
      return def;
    }
  }
};
var PATH_REGEXP = new RegExp([
  // Match escaped characters that would otherwise appear in future matches.
  // This allows the user to escape special characters that won't transform.
  '(\\\\.)',
  // Match Express-style parameters and un-named parameters with a prefix
  // and optional suffixes. Matches appear as:
  //
  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
  // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
  // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
  '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^()])+)\\))?|\\(((?:\\\\.|[^()])+)\\))([+*?])?|(\\*))'
].join('|'), 'g');
/**
 * Parse a string for the raw tokens.
 *
 * @param  {String} str
 * @return {Array}
 */
arc.app.router.parse = function(str) {
  var tokens = [];
  var key = 0;
  var index = 0;
  var path = '';
  var res;

  while ((res = PATH_REGEXP.exec(str)) !== null) {
    var m = res[0];
    var escaped = res[1];
    var offset = res.index;
    path += str.slice(index, offset);
    index = offset + m.length;

    // Ignore already escaped sequences.
    if (escaped) {
      path += escaped[1];
      continue;
    }

    // Push the current path onto the tokens.
    if (path) {
      tokens.push(path);
      path = '';
    }

    var prefix = res[2];
    var name = res[3];
    var capture = res[4];
    var group = res[5];
    var suffix = res[6];
    var asterisk = res[7];

    var repeat = suffix === '+' || suffix === '*';
    var optional = suffix === '?' || suffix === '*';
    var delimiter = prefix || '/';
    var pattern = capture || group || (asterisk ? '.*' : '[^' + delimiter + ']+?');

    tokens.push({
      name: name || key++,
      prefix: prefix || '',
      delimiter: delimiter,
      optional: optional,
      repeat: repeat,
      pattern: pattern.replace(/([=!:$\/()])/g, '\\$1')
    });
  }

  // Match any characters still remaining.
  if (index < str.length) {
    path += str.substr(index);
  }

  // If the path exists, push it onto the end.
  if (path) {
    tokens.push(path);
  }

  return tokens;
};

'use strict';
/*******************************************************************************
 * Copyright 2012 Pawel Psztyc
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 ******************************************************************************/

/**
 * Advanced Rest Client namespace
 */
var arc = arc || {};
/**
 * ARC app's namespace
 */
arc.app = arc.app || {};
/**
 * A namespace for the utilis functions
 */
arc.app.utils = {};
/**
 * Generate a RFC4122, version 4 ID. Example:
 * "92329D39-6F5C-4520-ABFC-AAB64544E172"
 * http://stackoverflow.com/a/21963136/1127848
 * @return {String} The UUID string.
 */
arc.app.utils.uuid = function() {
  // jscs:disable
  /* jshint ignore:start */
  var lut = [];
  for (var i = 0; i < 256; i++) {
    lut[i] = (i < 16 ? '0' : '') + (i).toString(16);
  }
  var fn = function() {
    var d0 = Math.random() * 0xffffffff | 0;
    var d1 = Math.random() * 0xffffffff | 0;
    var d2 = Math.random() * 0xffffffff | 0;
    var d3 = Math.random() * 0xffffffff | 0;
    return lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] +
      lut[d0 >> 24 & 0xff] + '-' + lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + '-' +
      lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + '-' + lut[d2 & 0x3f | 0x80] +
      lut[d2 >> 8 & 0xff] + '-' + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] +
      lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];
  };
  return fn();
  // jscs:enable
  /* jshint ignore:end */
};
/**
 * This function will search for links in the `input` and replace it with anchor.
 *
 * @param {String} input A search string
 * @return {String} Parsed string.
 */
arc.app.utils.autoLink = function(input) {
  var r = new RegExp('(https?:\\/\\/([^" >]*))', 'gim');
  return input.replace(r, '<a target="_blank" class="auto-link" href="$1">$1</a>');
};
/**
 * Escape characters to display HTML code.
 *
 * @return {String} Encoded string.
 */
arc.app.utils.encodeHtml = function(input) {
  if (typeof input !== 'string') {
    return input;
  }
  return input.replace(/</g, '&lt;').replace(/>/g, '&gt;');
};
arc.app.utils._chromeVersion = null;
/**
 * Get Chrome full version.
 *
 * @type {String} A full version or `(not set)` is can't find.
 */
Object.defineProperty(arc.app.utils, 'chromeVersion', {
  enumerable: true,

  get: function() {
    if (arc.app.utils._chromeVersion) {
      return arc.app.utils._chromeVersion;
    }
    var raw = navigator.userAgent.match(/Chrom[e|ium]\/([0-9\.]+)/);
    arc.app.utils._chromeVersion = raw ? raw[1] : '(not set)';
    return arc.app.utils._chromeVersion;
  },

  set: function() {
    throw new Error('appVer can\'t be overrited.');
  }
});
arc.app.utils._appVer = null;
/**
 * Get ARC version from the manifest file.
 *
 * @type {String} An ARC version.
 */
Object.defineProperty(arc.app.utils, 'appVer', {
  enumerable: true,

  get: function() {
    if (arc.app.utils._appVer) {
      return arc.app.utils._appVer;
    }
    if (!chrome || !chrome.runetime || !chrome.runtime.getManifest) {
      //testing
      arc.app.utils._appVer = '5.0.5-test';
    } else {
      arc.app.utils._appVer = chrome.runtime.getManifest().version;
    }
    return arc.app.utils._appVer;
  },

  set: function() {
    throw new Error('appVer can\'t be overrited.');
  }
});

'use strict';
/*******************************************************************************
 * Copyright 2012 Pawel Psztyc
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 ******************************************************************************/
/* global HAR */

/**
 * A base types definitions for the app.
 */

/**
 * A base object for all types with helper methods.
 */
class BaseObject {

  /**
   * Check if [passed] object contains all required properties declared in [required] array.
   * This method will throw an [Error] when required parameter is missing.
   *
   * @param {Array<String>} required An array of required parameters.
   * @param {Object} passed An object on which test properties
   */
  assertRequiredKeys(required, passed) {
    const errors = [];
    required.forEach((name) => {
      if (!(name in passed)) {
        errors.push(name);
      }
    });
    if (errors.length > 0) {
      throw new Error('Missing parameters: ' + errors.join(', ') + '.');
    }
  }

  /**
   * Override toJSON behaviour so it will eliminate
   * all _* properies and replace it with a proper ones.
   */
  toJSON() {
    var copy = Object.assign({}, this);
    var keys = Object.keys(copy);
    var under = keys.filter((key) => key.indexOf('_') === 0);
    under.forEach((key) => {
      let realKey = key.substr(1);
      copy[realKey] = copy[key];
      delete copy[key];
    });
    return copy;
  }
}
/**
 * OrderedList object represents an object that can be ordered in a list. This
 * objects have additional properties and methods to manage their position on
 * the list.
 *
 * @example <caption>Reordering elements on list</caption>
 * // Initial list
 * let list = [OrderedList1, OrderedList2, OrderedList3, OrderedList4, OrderedList5, OrderedList6,
 * OrderedList7];
 * // Last element must be moved from 7-th position to 3-rd (zero-based)
 * list.forEach((item) => {
 *  item.changeOrder('up', 2, list[6], list[6].order);
 * });
 * // [OrderedList1, OrderedList2, OrderedList7, OrderedList3, OrderedList4, OrderedList5,
 * OrderedList6]
 * @extends BaseObject
 */
class OrderedList extends BaseObject {

  constructor(opts) {
    super(opts);
    /**
     * Object order on a list
     *
     * @type {Number}
     * @default 0
     */
    this.order = opts.order || 0;
  }
  /**
   * Change the order of the element. This method will change the order of the
   * element depending on arguments. Note that this method don't care on which
   * list item is. Program should perform this operation only on elements that
   * are already on the list. Object that is changing position can also be
   * changed using this method so it's safe to use it on all list elements.
   *
   *
   *
   * @example <caption>Reordering elements on list</caption>
   * //For example if you want to move element from position 7 to position 2.
   * //The function should look as follows:
   *
   * // Initial list
   * let list = [OrderedList1, OrderedList2, OrderedList3, OrderedList4, OrderedList5,
   * OrderedList6, OrderedList7];
   * // Last element must be moved from 7-th position to 3-rd (zero-based)
   * list.forEach((item) => {
   *  item.changeOrder('up', 2, list[6], list[6].order);
   * });
   * // [OrderedList1, OrderedList2, OrderedList7, OrderedList3, OrderedList4, OrderedList5,
   * OrderedList6]
   * Note: positions (order) are zero-based.
   *
   * @param {String} dir  The direction of the change. Set to `up` if the
   * element should go up on the list or `down` (default) otherwise.
   * @param {Number} change  A target position of the moved element. If the
   * element should finally be at position 2 this value should be 2.
   * @param {OrderedList} moved  A moved OrderedList object as a reference to
   * compare if current object is moved object.
   * @param {Number} movedOrder  A base position of the moved element. If
   * moved element previously was at position 7 this value should be 7.
   */
  changeOrder(dir, change, moved, movedOrder) {
    if (dir === 'up') {
      if (this.order === 0) {
        throw new Error('Can\'t move list element below 0 in this direction.');
      }
      this.moveUp(change, moved, movedOrder);
    } else {
      this.moveDown(change, moved, movedOrder);
    }
  }
  /**
   * Decrement order value so the element will go up on the list.
   * This method is used internally by {@link OrderedList#changeOrder} method.
   *
   * @example
   * Object.moveUp(2, OtherObject, 4);
   *
   * @param {Number} change  A target position of the moved element. If the
   * element should finally be at position 2 this value should be 2.
   * @param {OrderedList} moved  A moved OrderedList object as a reference to
   * compare if current object is moved object.
   * @param {Number} movedOrder  A base position of the moved element. If
   * moved element previously was at position 7 this value should be 7.
   */
  moveUp(change, moved, movedOrder) {
    if (this.order < change) {
      return;
    }
    if (this.order > movedOrder) {
      return;
    }
    if (this === moved) {
      this.order = change;
      return;
    }
    --this.order;
  }
  /**
   * Increment order value so the element will go down on the list.
   * This method is used internally by {@link OrderedList#changeOrder} method.
   *
   * @example
   * Object.moveUp(2, OtherObject, 4);
   *
   * @param {Number} change  A target position of the moved element. If the
   * element should finally be at position 2 this value should be 2.
   * @param {OrderedList} moved  A moved OrderedList object as a reference to
   * compare if current object is moved object.
   * @param {Number} movedOrder  A base position of the moved element. If
   * moved element previously was at position 7 this value should be 7.
   */
  moveDown(change, moved, movedOrder) {
    if (this.order > change) {
      return;
    }
    if (this.order < movedOrder) {
      return;
    }
    if (this === moved) {
      this.order = change;
      return;
    }
    ++this.order;
  }
  toJSON() {
    return super.toJSON();
  }
}
/**
 * A base class for request object.
 * This object will be stored in the database.
 *
 * @extends OrderedList
 * @throws {Error} If `url`, `method` or `type` is not available to the constructor.
 */
class RequestObject extends OrderedList {
  /**
   * To construct RequestObject client need an URL, method and type defined.
   * A type can be one of 'saved', 'history' or 'drive'.
   * If a type is 'drive' then driveId property must be set.
   *
   * RequestObjects may not have id property when it's newly created object or
   * when object was restored from Drive and not yet saved locally.
   */
  constructor(opts) {
    super(opts);
    super.assertRequiredKeys(['url', 'method', 'type'], opts);
    if (opts.id) {
      /**
       * A database ID.
       * It can be null / undefined if the object wasn't saved yet.
       *
       * @type {Number}
       */
      this.id = opts.id;
    }
    /**
     * A HAR object containing request info.
     * To initialize this object use helper class HAR:
     * `new HAR.Log({ ... })` or just pass a JSON object according to HAR specification.
     *
     * @type {HAR}
     */
    this._har = opts._har ? (opts._har instanceof HAR.Log) ? opts._har :
      new HAR.Log(opts._har) : null;
    /**
     * A name of the request.
     * It is repeated in the HAR object - according to HAR spec in the pages array of the
     * log object. It must be in the non-array path to index the value in the IDB engine.
     * @type {!String}
     */
    this._name = null;
    /**
     * Request URL. It's an index and part of keyPath in the database. Therefore it's required.
     *
     * @type {!String}
     */
    this.url = opts.url;
    /**
     * Request HTTP method.
     * It's an index and part of keyPath in the database. Therefore it's required.
     *
     * @type {!String}
     */
    this.method = opts.method;
    /**
     * A type of the object. Sub classes can set it by default.
     * Used to distinguish what kind of request is this (saved, history)
     *
     * @type {!String}
     */
    this.type = opts.type;
    // set a har object
    if (opts.har) {
      this.har = opts.har;
    }
    // Set a name value.
    if (opts.name) {
      this.name = opts.name;
    }
  }

  set har(har) {
    if (har instanceof HAR.Log) {
      this._har = har;
    } else {
      this._har = new HAR.Log(har);
    }
  }

  get har() {
    return this._har;
  }

  set name(name) {
    this._name = String(name);
    if (this._har) {
      this._har.pages[0].title = this._name;
    }
  }

  get name() {
    return this._name;
  }

  toJSON() {
    return super.toJSON();
  }
}
/**
 * A class of saved requests objects.
 * It's just a shorthand class.
 *
 * @example <caption>Creating this class id the same as</caption>
 * let ro = new RequestObject(...);
 * ro.type = 'saved';
 *
 * @extends RequestObject
 */
// jshint unused:false
class SavedRequestObject extends RequestObject {
  constructor(opts) {
    opts.type = 'saved';
    super(opts);
  }
  toJSON() {
    return super.toJSON();
  }
}
/**
 * A class of history requests objects.
 * It's just a shorthand class, enlivenment for:
 *
 * @example <caption>Creating this class id the same as</caption>
 * let ro = new RequestObject(...);
 * ro.type = 'history';
 *
 * @extends RequestObject
 */
// jshint unused:false
class HistoryRequestObject extends RequestObject {
  constructor(opts) {
    opts.type = 'history';
    super(opts);
  }
  toJSON() {
    return super.toJSON();
  }
}
/**
 * A class of drive requests object.
 * It's just a shorthand class, enlivenment for:
 *
 * @example <caption>Creating this class id the same as</caption>
 * let ro = new RequestObject(...);
 * ro.type = 'drive';
 *
 * @extends RequestObject
 */
// jshint unused:false
class DriveRequestObject extends RequestObject {
  constructor(opts) {
    opts.type = 'drive';
    super(opts);
    /**
     * Google Drive ID.
     *
     * @type {String}
     */
    this.driveId = opts.driveId;
  }
  toJSON() {
    return super.toJSON();
  }
}
/**
 * Creates a new base request object stored in the local store.
 * It's different than RequestObject to quickly access latest request data
 * without querying IDB. It also simplifies logic.
 * Request object is created on demand during save.
 *
 * This object ment to be stored in local storage and support request view editors.
 */
class RequestLocalObject extends BaseObject {
  constructor(opts) {
    super(opts);
    /**
     * An url of the request.
     *
     * @type {String}
     */
    this.url = opts.url || '';
    /**
     * A HTTP method
     *
     * @type {String}
     */
    this.method = opts.method || 'GET';
    /**
     * A HTTP message part with the string values.
     *
     * @type {String}
     */
    this.headers = opts.headers || '';
    /**
     * A payload of the request.
     *
     * @type {Any}
     */
    this.payload = opts.payload || undefined;
    /**
     * (Optional) True if original request that created this object originated from saved request,
     * may be not set. If `isSaved` and `isDrive` is false then the object represents
     * history object.
     *
     * @type {Boolean}
     */
    this.isSaved = opts.isSaved || false;
    /**
     * (Optional) True if original request that created this object originated from google drive.
     *
     * @type {Boolean}
     */
    this.isDrive = opts.isDrive || false;
    /**
     * (Optional) Type depends on isSaved, the ID of the original object.
     *
     * @type {Number}
     */
    this.id = opts.id || undefined;
    /**
     * Drive items are stored like saved request. They have additional attribute `driveId`.
     *
     * @type {String}
     */
    this.driveId = opts.driveId || undefined;
  }
}
/**
 * A class representing an entity in the data store with information
 * about export to app server.
 *
 * @extends BaseObject
 * @throws {Error} If `serverId` or `requestId` is not available to the constructor.
 */
// jshint unused:false
class ServerExportedObject extends BaseObject {

  constructor(opts) {
    super(opts);

    super.assertRequiredKeys(['serverId', 'requestId'], opts);
    /**
     * An id of the item on the server.
     *
     * @type {String}
     */
    this.serverId = opts.serverId;
    /**
     * RequestObject data store id.
     *
     * @type {String}
     */
    this.requestId = opts.requestId;
  }
}
/**
 * A class representing an URL.
 *
 * @extends BaseObject
 * @throws {Error} If `url` is not available to the constructor.
 */
class UrlObject extends BaseObject {

  constructor(opts) {
    super();
    super.assertRequiredKeys(['url'], opts);
    /**
     * An URL to store. It's a database key path so it must be unique.
     *
     * @type {!String}
     */
    this.url = opts.url;
    /**
     * Last used time as a number of milliseconds
     *
     * @type {Number}
     */
    this.time = opts.time;
  }
}
/**
 * A class representing an entity in the URL history data store.
 *
 * @extends UrlObject
 */
// jshint unused:false
class HistoryUrlObject extends UrlObject {
  constructor(opts) {
    super(opts);
  }
}
/**
 * A class representing an entity in the socket urls history data store.
 *
 * @extends UrlObject
 */
// jshint unused:false
class HistorySocketObject extends UrlObject {
  constructor(opts) {
    super(opts);
  }
}
/**
 * A class representing and entity in the Projects data store.
 *
 * @extends OrderedList
 * @throws {Error} If `requestIds` is not undefined but is not an Array.
 */
// jshint unused:false
class ProjectObject extends OrderedList {

  constructor(opts) {
    super(opts);

    if (!opts.requestIds) {
      opts.requestIds = [];
    }
    if (typeof opts.requestIds.length === 'undefined') {
      throw new Error('`requestIds` property must be an array of ids of request objects');
    }
    if (opts.id) {
      /**
       * A database ID.
       * It can be null / undefined if the object wasn't saved yet.
       *
       * @type {Number}
       */
      this.id = opts.id;
    }
    /**
     * A list of all endpoints (RequestObjects) referenced to this project.
     *
     * @type {Array}
     */
    this.requestIds = opts.requestIds;
    /**
     * Project name
     *
     * @type {String}
     */
    this.name = opts.name;
    /**
     * Project creation time.
     *
     * @type {Date}
     */
    this.created = opts.time ? new Date(opts.time) : opts.created ? opts.created : new Date();
  }

  /**
   * Append request id to the list of ids.
   *
   * @param {Number} requestIds An ID of the request object.
   */
  addRequest(requestIds) {
    if (!requestIds) {
      throw new Error('Request ID must be set.');
    }
    this.requestIds.push(requestIds);
  }
}
/**
 * A HTTP status code representation in the storage.
 *
 * @extends BaseObject
 * @throws {Error} If `key` or `label` is not available to the constructor.
 */
// jshint unused:false
class HttpStatusObject extends BaseObject {
  constructor(opts) {
    super();

    super.assertRequiredKeys(['key', 'label'], opts);
    /**
     * A HTTP status code is represented as `key`
     *
     * @type {Number}
     */
    this.key = opts.key;
    /**
     * A status message associated with this code.
     *
     * @type {String}
     */
    this.label = opts.label;
    /**
     * An optional description for this code.
     *
     * @type {String}
     */
    this.desc = opts.desc ? opts.desc : undefined;
  }
}
/**
 * A HTTP header representation in the storage.
 *
 * @extends BaseObject
 * @throws {Error} If `key` or `type` is not available to the constructor.
 */
// jshint unused:false
class HttpHeaderObject extends BaseObject {
  constructor(opts) {
    super();

    super.assertRequiredKeys(['key', 'type'], opts);
    /**
     * Header name.
     *
     * @type {String}
     */
    this.key = opts.key;
    /**
     * Header type. One of `request` or `response`.
     *
     * @type {String}
     */
    this.type = opts.type;
    /**
     * An optional example for this header.
     *
     * @type {String}
     */
    this.example = opts.example ? opts.example : undefined;
    /**
     * An optional description for this header.
     *
     * @type {String}
     */
    this.desc = opts.desc ? opts.desc : undefined;
  }
}
/**
 * A class representing data export object.
 * This object will be used to export data to file as a structure wrapper.
 *
 * @extends BaseObject
 */
class FileExport extends BaseObject {
  constructor(opts) {
    super();
    this.kind = 'ARC#requestsDataExport';
    this.createdAt = new Date();
    this.version = arc.app.utils.appVer;

    if (!(opts.requests instanceof Array)) {
      console.warn('The opts.requests is not an array. Overriding');
      opts.requests = [];
    }
    if (!(opts.projects instanceof Array)) {
      console.warn('The opts.projects is not an array. Overriding');
      opts.projects = [];
    }
    opts.requests.forEach((item) => item.kind = 'ARC#RequestObject');
    opts.projects.forEach((item) => item.kind = 'ARC#ProjectObject');

    this.requests = opts.requests;
    this.projects = opts.projects;
  }
}
/**
 * A class representing a magic variable stored in the database.
 */
class MagicVariableObject extends BaseObject {
  constructor(opts) {
    super();
    //this.id = undefined;
    this.variable = opts.variable || undefined;
    this.value = opts.value || undefined;
    this.type = opts.type || 'global';
    this.project = opts.project || undefined;
  }
}

window.RequestObject = RequestObject;
window.SavedRequestObject = SavedRequestObject;
window.HistoryRequestObject = HistoryRequestObject;
window.DriveRequestObject = DriveRequestObject;
window.ProjectObject = ProjectObject;
window.FileExport = FileExport;
window.RequestLocalObject = RequestLocalObject;

'use strict';
/*******************************************************************************
 * Copyright 2012 Pawel Psztyc
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 ******************************************************************************/

/**
 * A parser for headers.
 */

/**
 * Advanced Rest Client namespace
 */
var arc = arc || {};
/**
 * ARC app's namespace
 */
arc.app = arc.app || {};
/**
 * A namespace for headers parser.
 */
arc.app.headers = {};
/**
 * Filter array of headers and return not duplicated array of the same headers.
 * Duplicated headers should be appended to already found one using coma separator.
 *
 * @param {Array} headers
 *                Headers array to filter. All objects in headers array must have "name"
 *                and "value" keys.
 * @return {Array} An array of filtered headers.
 */
arc.app.headers.filter = function(headers) {
  var _tmp = {};
  headers.forEach((header) => {
    if (header.name in _tmp) {
      if (!!header.value) {
        _tmp[header.name] += ', ' + header.value;
      }
    } else {
      _tmp[header.name] = header.value;
    }
  });
  var result = [];
  for (let _key in _tmp) {
    result[result.length] = {
      'name': _key,
      'value': _tmp[_key]
    };
  }
  return result;
};
/**
 * Parse headers array to Raw HTTP headers string.
 *
 * @param {Array} headersArray List of objects with "name" and "value" properties.
 * @returns {String} A HTTP representation of the headers.
 */
arc.app.headers.toString = function(headersArray) {
  if (!(headersArray instanceof Array)) {
    throw new Error('Headers must be an instance of Array');
  }
  if (headersArray.length === 0) {
    return '';
  }
  headersArray = arc.app.headers.filter(headersArray);
  var result = '';
  headersArray.forEach((header) => {
    if (result !== '') {
      result += '\n';
    }
    let key = header.name;
    let value = header.value;
    if (key && key.trim() !== '') {
      result += key + ': ';
      if (value && value.trim() !== '') {
        result += value;
      }
    }
  });
  return result;
};
/**
 * Parse HTTP headers input from string to array of a key:value pairs objects.
 *
 * @param {String} headersString Raw HTTP headers input
 * @returns {Array<Object>} The array of objects where properties are `name` as a header name and
 * `value` as a header content.
 */
arc.app.headers.toJSON = function(headersString) {
  if (!headersString || headersString.trim() === '') {
    return [];
  }
  if (typeof headersString !== 'string') {
    throw new Error('Headers must be an instance of String.');
  }
  const result = [];
  const headers = headersString.split(/\n/gim);

  for (let i = 0, len = headers.length; i < len; i++) {
    let line = headers[i].trim();
    if (line === '') {
      continue;
    }
    let sepPosition = line.indexOf(':');
    if (sepPosition === -1) {
      result[line] = '';
      continue;
    }
    let name = line.substr(0, sepPosition);
    let value = line.substr(sepPosition + 1).trim();
    let obj = {
      name: name,
      value: value
    };
    result.push(obj);
  }
  return result;
};
/**
 * Helper method for old system: combine headers list with encoding value.
 * Note that this function will update the original array.
 *
 * @param {Array} headers An array of headers
 * @param {String} encoding An encoding string from the old request.
 * @return {Boolean} True if encoding has been added to the array.
 */
arc.app.headers._oldCombine = function(headers, encoding) {
  if (!(headers instanceof Array)) {
    throw new Error('Headers must be an array');
  }
  encoding = String(encoding);
  var ct = headers.filter((item) => item.name.toLowerCase() === 'content-type');
  if (ct.length === 0) {
    headers.push({
      'name': 'Content-Type',
      'value': encoding.trim()
    });
    return true;
  }
  return false;
};
/**
 * Get the Content-Type value from the headers.
 *
 * @param {Array|String} headers Either HTTP headers string or list of headers.
 * @return {String|null} A content-type header value or null if not found
 */
arc.app.headers.getContentType = function(headers) {
  if (typeof headers === 'string') {
    headers = arc.app.headers.toJSON(headers);
  }
  headers = arc.app.headers.filter(headers);
  var ct = headers.filter((item) => item.name.toLowerCase() === 'content-type');
  ct = (ct.length === 0) ? null : ct[0].value;
  if (ct) {
    let index = ct.indexOf('; ');
    if (index > 0) {
      ct = ct.substr(0, index);
    }
  }
  return ct;
};

'use strict';
/*******************************************************************************
 * Copyright 2012 Pawel Psztyc
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 ******************************************************************************/

/* global Dexie, chrome, HistoryUrlObject, HistorySocketObject, ProjectObject,
 ServerExportedObject, RequestObject, HttpStatusObject, HttpHeaderObject, MagicVariableObject */
window.pendingAnalytics = window.pendingAnalytics || [];
/**
 * Advanced Rest Client namespace
 *
 * @namespace
 */
var arc = arc || {};
/**
 * ARC app's namespace
 *
 * @namespace
 */
arc.app = arc.app || {};
/**
 * A namespace for the database scripts.
 *
 * @namespace
 */
arc.app.db = arc.app.db || {};

/**
 * A namespace for IndexedDB scripts.
 *
 * @namespace
 */
arc.app.db.idb = {};
/**
 * A namespace for request objects queries..
 *
 * @namespace
 */
arc.app.db.idb.requests = {};
/**
 * A namespace for projects queries
 *
 * @namespace
 */
arc.app.db.idb.projects = {};
/**
 * A namespace for websocket history urls queries
 *
 * @namespace
 */
arc.app.db.idb.websockets = {};
/**
 * A namespace for status codes definitions queries
 *
 * @namespace
 */
arc.app.db.idb.statuses = {};
/**
 * A namespace for headers definitions queries
 *
 * @namespace
 */
arc.app.db.idb.headers = {};
/**
 * A namespace for exported to app server data queries
 *
 * @namespace
 */
arc.app.db.idb.exported = {};
/**
 * A namespace for url history queries
 *
 * @namespace
 */
arc.app.db.idb.urls = {};
/**
 * Open the database.
 *
 * @returns {Promise} The promise when ready.
 */
arc.app.db.idb.open = function() {
  return new Dexie.Promise(function(resolve, reject) {
    var db = new Dexie('arc');
    db.version(1)
      .stores({
        headers: '&[key+type],key,type',
        statuses: '&key',
        historyUrls: '&url',
        historySockets: '&url',
        requestObject: '++id,url,method,[url+method],type,_name',
        serverExportObjects: '[serverId+requestId],serverId,requestId',
        projectObjects: '++id,*requestIds'
      });
    db.version(2)
      .stores({
        headers: '&[key+type],key,type',
        statuses: '&key',
        historyUrls: '&url',
        historySockets: '&url',
        requestObject: '++id,url,method,[url+method],type,_name',
        serverExportObjects: '[serverId+requestId],serverId,requestId',
        projectObjects: '++id,*requestIds',
        variables: '++id,variable,type'
      });
    db.projectObjects.mapToClass(ProjectObject);
    db.serverExportObjects.mapToClass(ServerExportedObject);
    db.requestObject.mapToClass(RequestObject);
    db.historySockets.mapToClass(HistorySocketObject);
    db.historyUrls.mapToClass(HistoryUrlObject);
    db.statuses.mapToClass(HttpStatusObject);
    db.headers.mapToClass(HttpHeaderObject);
    db.variables.mapToClass(MagicVariableObject);
    db.on('error', function(error) {
      console.error('IndexedDB global error', error);
      let pending = arc.app.analytics.sendException('IDB error:: ' + JSON.stringify(error));
      if (pending) {
        window.pendingAnalytics[window.pendingAnalytics.length] = pending;
      }
    });
    db.on('ready', function() {
      if (arc.app.db.idb.upgraded) {
        return;
      }
      arc.app.db.idb._db = db;
      return arc.app.db.idb.populateDatabase(db)
      .then(() => arc.app.db.idb.upgraded = true)
      .catch(() => arc.app.db.idb.upgraded = false);
    });
    db.open()
      .then(function() {
        resolve(db);
      })
      .catch(function(error) {
        console.error('IDB open main catch block', error);
        let pending = arc.app.analytics.sendException('IDB create error::' + JSON.stringify(error));
        if (pending) {
          window.pendingAnalytics[window.pendingAnalytics.length] = pending;
        }
        reject(error);
      });
  });
};
/**
 * Populate database with initial data
 *
 * @return {Promise} Fulfilled promise when data were populated or no population is needed.
 */
arc.app.db.idb.populateDatabase = function(db) {
  //if statuses are set headers must be set as well since they are inserted in single transaction.
  return db.statuses.count()
    .then((count) => {
      if (count > 0) {
        console.info('Database already populated');
        return Dexie.Promise.resolve(null);
      }
      return arc.app.db.idb.downloadDefinitions()
        .catch(function() {
          console.warn('Definitions wasn\'t there. skipping definitions installation.');
          return Dexie.Promise.reject(new Error('Definitions location error'));
        });
    })
    .then(function(defs) {
      if (!defs) {
        return Dexie.Promise.resolve(null);
      }

      defs.requests.forEach((item) => {
        item.type = 'request';
        item.key = item.key.toLowerCase();
      });
      defs.responses.forEach((item) => {
        item.type = 'response';
        item.key = item.key.toLowerCase();
      });
      let headers = defs.requests.concat(defs.responses);

      return db.transaction('rw', db.statuses, db.headers, function() {
        console.info('populating database with predefined values');
        let promises = [];
        let codes = defs.codes;
        codes.forEach(function(item) {
          promises.push(db.statuses.add(item));
        });
        headers.forEach(function(item) {
          promises.push(db.headers.add(item));
        });
        return Dexie.Promise.all(promises);
      });
    })
    .then(function() {
      console.log('The database has been populated with data.');
    })
    .catch(function(e) {
      console.warn('Database population unsuccessfull.', e);
      let pending = arc.app.analytics.sendException('IDB populate error::' + JSON.stringify(e));
      if (pending) {
        window.pendingAnalytics[window.pendingAnalytics.length] = pending;
      }
    });
};
/**
 * Creates IndexedDB key for a RequestObject.
 * The main key is a combination of [HTTP METHOD]:[URL]
 *
 * @param {String} method A HTTP method
 * @param {String} url An URL of the request.
 * @return {String} a key for the Request object
 */
arc.app.db.idb.requests.createRequestKey = function(method, url) {
  var args = Array.from(arguments);
  if (args.length !== 2) {
    throw new Error('Number of arguments requires is 2 but ' + args.length +
      ' has been provided');
  }
  return method + ':' + url;
};
arc.app.db.idb.downloadDefinitions = function() {
  var url = chrome.runtime.getURL ? chrome.runtime.getURL('/assets/definitions.json') :
    '/app/assets/definitions.json'; // for test cases
  return fetch(url)
    .then(function(response) {
      return response.json();
    });
};
/**
 * Get status code definition by it's code
 */
arc.app.db.idb.statuses.getStatusCode = function(code) {
  return arc.app.db.idb.open()
    .then(function(db) {
      return db.statuses.get(code)
        .finally(function() {
          db.close();
        });
    });
};
/**
 * Get header from the storage by it's name and type
 */
arc.app.db.idb.headers.getHeaderByName = function(name, type) {
  return new Promise(function(resolve, reject) {
    arc.app.db.idb.open()
      .then(function(db) {
        let result = null;
        db.headers.where('[key+type]')
          .equals([name, type])
          .each(function(header) {
            result = header;
          })
          .catch(reject)
          .finally(function() {
            db.close();
            resolve(result);
          });
      })
      .catch((e) => reject(e));
  });
};

'use strict';
/*******************************************************************************
 * Copyright 2012 Pawel Psztyc
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 ******************************************************************************/
/* global chrome */
/**
 * Advanced Rest Client namespace
 */
var arc = arc || {};
/**
 * ARC app's namespace
 */
arc.app = arc.app || {};
/**
 * A namespace for the utilis functions
 */
arc.app.arc = {};
/**
 * Minimum supported version of Chrome.
 * The script will use manifest.minimum_chrome_version to determine minimum version.
 * It will use higher number to determine if Chrome is compatible.
 */
arc.app.arc.minSupportedVersion = 45;
/**
 * Get application's App ID
 */
arc.app.arc.getAppId = function(callback) {
  chrome.storage.local.get({
    'APP_ID': null
  }, function(result) {
    if (!result.APP_ID) {
      result.APP_ID = arc.app.utils.uuid();
      chrome.storage.local.set(result, function() {
        callback(result.APP_ID);
      });
    } else {
      callback(result.APP_ID);
    }
  });
};
/**
 * Check if current Chrome version is compatible with the app.
 */
arc.app.arc.checkCompatybility = function() {
  var version = arc.app.utils.chromeVersion;
  var manifest = chrome.runtime.getManifest();
  var manMin = 0;
  /*jshint camelcase: false */
  if (manifest &&
    manifest.minimum_chrome_version) { // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
    manMin =
      Number(manifest.minimum_chrome_version); //jscs:disable requireCamelCaseOrUpperCaseIdentifiers
  }
  /*jshint camelcase: true */
  var supported = Math.max(manMin, arc.app.arc.minSupportedVersion);
  if (Number(version.match(/(\d+)\./)[1]) < supported) {
    window.setTimeout(function() {
      document.querySelector('#incompatibleVersionDialog').open();
    }, 2000);
  }
};

/* JavaScript extension */

/**
 * Ensure that the property will be set as a date object.
 * If passed `time` argument is not a valid date object or couldn't be parsed as a date, current
 * date will be used.
 * Due to the issue: https://github.com/Polymer/polymer/issues/3424 it can't be placed in Object's
 * prototype.
 *
 * @property {Object} obj An object to operate on.
 * @property {String} property A property to assign a value to. It will be set to `this[property]`.
 * @property {Date|String|Number} A date object, timestamp or date string.
 */
Object.ensureDate = function(obj, property, time) {
  if (time instanceof Date) {
    obj[property] = time;
  } else if (Number.isInteger(time)) {
    obj[property] = new Date(time);
  } else {
    try {
      let d = new Date(time);
      if (Number.isNaN(d.getDate())) {
        obj[property] = new Date();
      } else {
        obj[property] = d;
      }
    } catch (e) {
      obj[property] = new Date();
    }
  }
  return obj;
};

'use strict';
/*******************************************************************************
 * Copyright 2012 Pawel Psztyc
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 ******************************************************************************/
/* global chrome */
/**
 * Advanced Rest Client namespace
 */
var arc = arc || {};
/**
 * ARC app's namespace
 */
arc.app = arc.app || {};
/**
 * A namespace for the app server API
 */
arc.app.server = arc.app.server || {};
/**
 * Currently logged in user ID.
 */
arc.app.server.applicationUserId = null;
/**
 * Check if the user has session set on the server.
 */
arc.app.server.hasSession = function(callback) {
  arc.app.server.request.pingRequest()
    .then(function(json) {
      if (json.error) {
        return {
          'error': true,
          'message': json.error
        };
      }
      var data = {
        state: 2, //unknown
        uid: null //unknown
      };
      if ('hasSession' in json) {
        data.state = json.hasSession ? 1 : 0;
        if (json.hasSession) {
          data.uid = json.userId;
        }
      }
      return data;
    })
    .then(callback);
};
/**
 * Opened auth tab id.
 */
arc.app.server._authTab = null;
/**
 * Authorize the user in the app.
 * TODO:80 This needs new approach:
 * - Redirect the user to the server's auth callback
 * - from the page call chrome.runtime.sendExtensionMessage
 * - handle message in the background page and call the app
 * - listen (here) for message form BG page and change session state if nescessary.
 * TODO 02: Use AppEngine Oauth provider and use chrome.identity API for server authentication.
 */
arc.app.server.auth = function() {
  return new Promise(function(resolve, reject) {
    var returnPath = 'https://' + chrome.runtime.id + '.chromiumapp.org/appengine_auth';
    var url = arc.app.server.request.AUTH_URL;
    url += '/signin?ret=';
    var regexp = /%20/g;
    url = url + encodeURIComponent(returnPath).replace(regexp, '+');
    chrome.identity.launchWebAuthFlow({
      'url': url,
      'interactive': true
    }, function(redirectUrl) {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        let index = redirectUrl.indexOf('auth=1');
        if (index !== -1) {
          resolve(true);
        } else {
          resolve(false);
        }
      }
    });
  });
};
/**
 * A chrome storage state changes listener.
 * Listen for changes in storage and check if auth object changed.
 */
arc.app.server.authStateMayChanged = function(changes) {
  if (Object.keys(changes).indexOf('applogin') !== -1) {
    arc.app.server.hasSession(function(session) {
      if (window.arcGwtCallbacks && ('sessionchange' in window.arcGwtCallbacks)) {
        window.arcGwtCallbacks.sessionchange(session);
      }
      if (arc.app.server._authTab) {
        chrome.tabs.remove(arc.app.server._authTab);
        arc.app.server._authTab = null;
      }
    });
  }
};
/**
 * Get developer messages from the server.
 */
arc.app.server.getMessages = function(since, callback) {
  arc.app.server.request.messagesRequest(since)
    .then(callback);
};
/**
 * Get user stored data projection from the server.
 *
 * @param {String} uid Uid of the user to import data from.
 */
arc.app.server.getImportSuggestions = function(uid, callback) {
  arc.app.server.request.importSuggestionsRequest(uid)
    .then(function(result) {
      callback(result);
    });
};

/**
 * Get user stored data from the server.
 *
 * @param {Array} uids A list of datastore IDs to import
 */
arc.app.server.getImportData = function(uids, callback) {
  arc.app.server.request.getImportData(uids)
    .then(function(result) {
      callback(result);
    });
};

chrome.storage.onChanged.addListener(arc.app.server.authStateMayChanged);

'use strict';
/*******************************************************************************
 * Copyright 2012 Pawel Psztyc
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 ******************************************************************************/
/* global Headers */
/**
 * Library for making a requests to the app's API.
 */

/**
 * Advanced Rest Client namespace
 */
var arc = arc || {};
/**
 * ARC app's namespace
 */
arc.app = arc.app || {};
/**
 * A namespace for the app server API
 */
arc.app.server = arc.app.server || {};
/**
 * A namespace for request object builder.
 */
arc.app.server.request = {};
/**
 * Initialize the library. This should be called once.
 */
arc.app.server.request.init = function() {
  var root = 'https://chromerestclient.appspot.com/';
  root = 'http://127.0.0.1:8888/';
  arc.app.server.request.SERVICE_URL = root + 'ext-channel';
  arc.app.server.request.PING_URL = root + 'ping/session';
  arc.app.server.request.AUTH_URL = root + 'auth';
  arc.app.server.request.ASSETS_URL = root + 'static/';
  arc.app.server.request.MESSAGES_URL = root + 'messages/';

  arc.app.server.request.SUGGESTIONS_LISTING = arc.app.server.request.SERVICE_URL + '/list/';
  arc.app.server.request.GET_IMPORT_DATA = arc.app.server.request.SERVICE_URL + '/get';
  arc.app.server.request.EXPORT_DATA = arc.app.server.request.SERVICE_URL + '/put';
};

/**
 * Build a base for the request
 */
arc.app.server.request.buildRequest = function(url, method, body) {
  var init = {
    method: method || 'GET',
    credentials: 'include',
    cache: 'no-cache'
  };
  var headers = new Headers();
  headers.append('X-Chrome-Extension', 'ChromeRestClient');
  if (body) {
    init.body = body;
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
  }
  init.headers = headers;
  return fetch(url, init);
};

arc.app.server.request.pingRequest = function() {
  return arc.app.server.request.buildRequest(arc.app.server.request.PING_URL)
    .then(function(response) {
      return response.json();
    })
    .catch(function(error) {
      return {
        'error': true,
        'message': 'Error to load response from server. Session state unknown. (' +
          error.message + ')'
      };
    });
};
/**
 * Make a request to the server for new messages.
 */
arc.app.server.request.messagesRequest = function(since) {
  return arc.app.server.request.buildRequest(arc.app.server.request.MESSAGES_URL + since)
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      var data = [];
      json.forEach(function(item) {
        data.push({
          actionUrl: item.actionUrl,
          message: item.message
        });
      });
      return data;
    })
    .catch(function(error) {
      return {
        'error': true,
        'message': 'Can\'t get messages list from the server. (' + error.message + ')'
      };
    });
};
/**
 * During the data import first it will download a list of suggestions.
 * This list contain a projection of user data stored on the server.
 *
 * @param {String} uid Uid of the user to import data from. Default to "me" which means logged in
 *                used data.
 */
arc.app.server.request.importSuggestionsRequest = function(uid) {
  uid = uid || 'me';
  return arc.app.server.request.buildRequest(arc.app.server.request.SUGGESTIONS_LISTING + uid)
    .then(function(response) {
      return response.json();
    })
    .catch(function(error) {
      return {
        'error': true,
        'message': 'Can\'t get messages list from the server. (' + error.message + ')'
      };
    });
};
/**
 * Import user data from the server.
 *
 * @param {Array} uids An array of uids to import.
 */
arc.app.server.request.getImportData = function(uids) {
  var data = '';
  uids.forEach(function(uid) {
    return data += 'k%5B%5D=' + uid + '&';
  });
  data = data.substring(0, data.length - 1);
  return arc.app.server.request.buildRequest(arc.app.server.request.GET_IMPORT_DATA, 'POST', data)
    .then(function(response) {
      return response.json();
    })
    .catch(function(error) {
      return {
        'error': true,
        'message': 'Can\'t get messages list from the server. (' + error.message + ')'
      };
    });
};

arc.app.server.request.init();

'use strict';
/*******************************************************************************
 * Copyright 2016 Pawel Psztyc, The ARC team
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 ******************************************************************************/
/* global chrome */
/**
 * Advanced Rest Client namespace
 */
var arc = arc || {};
/**
 * ARC app's namespace
 */
arc.app = arc.app || {};
/**
 * A namespace for app settings
 */
arc.app.settings = arc.app.settings || {};

arc.app.settings.getConfig = function() {
  return new Promise(function(resolve) {
    var values = {
      'DEBUG_ENABLED': false,
      'HISTORY_ENABLED': true,
      'MAGICVARS_ENABLED': true,
      'CMH_ENABLED': true,
      'CMP_ENABLED': true
    };
    try {
      chrome.storage.sync.get(values, function(result) {
        resolve(result);
      });
    } catch (e) {
      console.error('arc.app.settings.getConfig', e);
      resolve(values);
    }
  });
};
arc.app.settings.saveConfig = function(key, value) {
  return new Promise(function(resolve) {
    var o = {};
    o[key] = value;
    chrome.storage.sync.set(o, resolve);
  });
};
arc.app.settings.observe = function(callback) {
  chrome.storage.onChanged.addListener(function(changes, area) {
    callback(changes, area);
  });
};

'use strict';
/*******************************************************************************
 * Copyright 2012 Pawel Psztyc
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 ******************************************************************************/
/* global chrome */

/**
 * App's client ID.
 */
//const CLIENT_ID = '10525470235.apps.googleusercontent.com';
/**
 * Google Drive REST API namespace.
 *
 * @namespace
 */
var drive = {};
/**
 * Authorize the app in Google Drive service.
 *
 * @return {Promise} Fulfilled promise with auth token or reject.
 */
drive.auth = function() {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({'interactive': true}, (authToken) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError.message);
      }
      if (!authToken) {
        return reject('User canceled');
      }
      resolve(authToken);
    });
  });
};
/**
 * Files manipulation API.
 *
 * @namespace
 */
drive.file = {};
/**
 * File meta boundary for POST calls.
 */
drive.file.boundary = 'ARCFormBoundary49nr1hyovoq1tt9';
drive.file.delimiter = '\r\n--' + drive.file.boundary + '\r\n';
drive.file.closeDelimiter = '\r\n--' + drive.file.boundary + '--';
/**
 * Drive's registered content type.
 * It will be used to search for app's files in the Drive.
 * Drive's handlers will recognize the app and will run it from Drive UI.
 */
drive.file.mime = 'application/restclient+data';
/**
 * Extension name for files stored in Google Drive.
 */
drive.file.extension = 'arc';
/**
 * A list of allowed resources (file metadata) in the file create request.
 * See https://developers.google.com/drive/v3/reference/files/create for full list.
 */
drive.file.allowedResource = [
  'appProperties', 'contentHints', 'createdTime', 'description', 'folderColorRgb', 'id',
  'mimeType', 'modifiedTime', 'name', 'parents', 'properties', 'starred', 'viewedByMeTime',
  'viewersCanCopyContent', 'writersCanShare'
];
/**
 * Creates a Google Drive File.
 *
 * If config.resource.mimeType is not set and drive.file.mime is set then `drive.file.mime` will
 * be used as a mime type.
 *
 * This script will automatically set file thumbnail if not set
 * (config.resource.contentHints.thumbnail object value).
 *
 * @param {Object} config A file creation configuration consisted with:
 *  - {Object} resource - A file metadata. See `drive.file.allowedResource` for more information.
 *  - {Object} media - A file contents definition to save on drive. It must have defined following
 * keys:
 *    - {String} mimeType - A media mime type
 *    - {String|Object} body - A content to save.
 */
drive.file.create = function(config) {
  return new Promise((resolve, reject) => {
    try {
      config = drive.file.ensureDriveFileConfig(config);
    } catch (e) {
      reject(e);
      return;
    }
    if (!config.resource.contentHints || !config.resource.contentHints.thumbnail ||
      !config.resource.contentHints.image) {
      let at;
      drive.auth()
      .then((_at) => at = _at)
      .then(drive.file._appSafeIcon)
      .then((file) => {
        if (!config.resource.contentHints) {
          config.resource.contentHints = {};
        }
        config.resource.contentHints.thumbnail = {
          image: file,
          mimeType: 'image/png'
        };
        return drive.file._uploadFile(at, config);
      })
      .then(resolve)
      .catch(reject);
    } else {
      let at;
      drive.auth()
      .then((_at) => at = _at)
      .then(() => drive.file._uploadFile(at, config))
      .then(resolve)
      .catch(reject);
    }
  });
};
/**
 * Update the file on Google Drive.
 *
 * @param {String} fileId A Google Drive file ID.
 * @param {Object} config The same as for `create` function.
 * @return {Promise} Fulfilled promise with file properties (the response).
 */
drive.file.update = function(fileId, config) {
  return new Promise((resolve, reject) => {
    try {
      config = drive.file.ensureDriveFileConfig(config);
    } catch (e) {
      reject(e);
      return;
    }
    let at;
    drive.auth()
    .then((_at) => at = _at)
    .then(() => drive.file._uploadUpdate(fileId, at, config))
    .then(resolve)
    .catch(reject);
  });
};
/**
 * Ensure that the file has correct configuration and throw an error if not.
 * Also it will add a mime type of the file if not present.
 */
drive.file.ensureDriveFileConfig = function(config) {
  if (!('resource' in config) ||
      !('media' in config)) {
    throw new Error('Invalid arguments.');
  }
  let names = Object.getOwnPropertyNames(config.resource);
  let error = false;
  let invalidArguments = [];
  names.forEach((key) => {
    if (drive.file.allowedResource.indexOf(key) === -1) {
      error = true;
      invalidArguments.push(key);
    }
  });
  if (error) {
    throw new Error('Unknown argument for resource: ' + invalidArguments.join(', '));
  }
  if (!config.resource.mimeType && drive.file.mime) {
    config.resource.mimeType = drive.file.mime;
  }
  return config;
};
/**
 * Perform upload action.
 */
drive.file._uploadFile = function(accessToken, options) {
  var init = {
    method: 'POST',
    body: drive.file._getPayload(options),
    headers: drive.file._getUploadHeaders(accessToken),
  };
  return fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', init)
  .then(function(response) {
    return response.json();
  });
};
drive.file._appSafeIcon = () => {
  return new Promise((resolve) => {
    let url = chrome.runtime.getURL ? chrome.runtime.getURL('/assets/arc_icon_128.png') :
      '/app/assets/arc_icon_128.png'; // for test cases
    fetch(url)
    .then((response) => {
      return response.blob();
    })
    .then((blob) => {
      let reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = function(e) {
        let data = e.target.result;
        data = btoa(data)
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
        resolve(data);
      };
    });
  });
};
drive.file._uploadUpdate = function(fileId, accessToken, options) {
  var init = {
    method: 'PATCH',
    body: drive.file._getPayload(options),
    headers: drive.file._getUploadHeaders(accessToken),
  };
  return fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`,
    init)
  .then(function(response) {
    return response.json();
  })
  .catch((e) => {
    throw e;
  });
};
drive.file._getUploadHeaders = function(accessToken) {
  var headers = new Headers();
  headers.set('Authorization', 'Bearer ' + accessToken);
  headers.set('Content-Type', 'multipart/related; boundary="' + drive.file.boundary + '"');
  return headers;
};
drive.file._getPayload = function(config) {
  var content;
  if (typeof config.media.body !== 'string') {
    content = JSON.stringify(config.media.body);
  } else {
    content = config.media.body;
  }
  var d = drive.file.delimiter;
  var cd = drive.file.closeDelimiter;
  let meta = JSON.stringify(config.resource);

  let body = `${d}Content-Type: application/json; charset=UTF-8\r\n\r\n${meta}`;
  body += `${d}Content-Type: ${config.media.mimeType}\r\n\r\n`;
  body += `${content}${cd}`;
  return body;
};
//
// /**
//  * Update content of the file.
//  *
//  * @param {String} fileId Google Drive file id.
//  * @param {String|Object} content Content to be saved in the file. Anything else then String
//  *            will be passed to JSON.stringify function.
//  * @param {Function} callback A callback function to be called after patch.
//  */
// arc.app.drive.updateFile = function(fileId, content, callback) {
//   try {
//     if (typeof content !== 'string') {
//       content = JSON.stringify(content);
//     }
//     let metadata = {
//       'mimeType': appMimeType
//     };
//     let metaString = JSON.stringify(metadata);
//     let payload = btoa(unescape(encodeURIComponent(content)));
//     let multipartRequestBody = `${delimiter}Content-Type: application/json\r\n\r\n${metaString}`;
//     multipartRequestBody += `${delimiter}Content-Type: ${appMimeType}\r\n`;
//     multipartRequestBody += `Content-Transfer-Encoding: base64\r\n\r\n${payload}${closeDelim}`;
//
//     let request = gapi.client.request({
//       'path': `/upload/drive/v2/files/${fileId}`,
//       'method': 'PUT',
//       'params': {
//         'uploadType': 'multipart'
//       },
//       'headers': {
//         'Content-Type': `multipart/mixed; boundary="${boundary}"`
//       },
//       'body': multipartRequestBody
//     });
//     request.execute(callback);
//   } catch (e) {
//     callback({
//       'error': e
//     });
//   }
// };
// /**
//  * Get Google Drive file metadata.
//  *
//  * @param {String} fileId Google Drive file id.
//  * @param {Function} callback A callback function to be called.
//  */
// arc.app.drive.getFileMeta = function(fileId, callback) {
//   let request = gapi.client.request({
//     'path': `/drive/v2/files/${fileId}`,
//     'method': 'GET',
//     'params': {
//       'fields': 'downloadUrl,title,etag'
//     }
//   });
//   request.execute(function(resp) {
//     callback(resp);
//   });
// };
// /**
//  * Get file contents from Google Drive.
//  *
//  * @param {String} downloadUrl File's download URL (received from the API)
//  * @param {Function} callback A callback function to be called.
//  */
// arc.app.drive.getFile = function(downloadUrl, callback) {
//   let accessToken = gapi.auth.getToken().access_token;
//   if (!accessToken) {
//     console.warn('Access token is not available. Call rejected');
//     callback.call(this, {
//       'error': 'Not authorized'
//     });
//     return;
//   }
//   let xhr = new XMLHttpRequest();
//   xhr.open('GET', downloadUrl);
//   xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
//   xhr.onload = function() {
//     callback.call(arc, xhr.responseText);
//   };
//   xhr.onerror = function(e) {
//     callback.call(arc, e);
//   };
//   xhr.send();
// };
// arc.app.drive.listFiles = function(mimeType, nextPageToken, query, callback) {
//   let accessToken = gapi.auth.getToken().access_token;
//   if (!accessToken) {
//     console.warn('Access token is not available. Call rejected');
//     callback.call(this, {
//       'error': 'Not authorized'
//     });
//     return;
//   }
//   let q = `mimeType="${mimeType}" and trashed = false`;
//   if (query) {
//     q += ` and title contains '${query}'`;
//   }
//   let params = {
//     'q': q,
//     'maxResults': 50,
//     'fields': 'items(createdDate,iconLink,id,title),nextLink,nextPageToken'
//   };
//   if (nextPageToken !== null) {
//     params.pageToken = nextPageToken;
//   }
//   //application/restclient+data
//   //TODO:30 why do I need it here?
//   if (accessToken) {
//     gapi.auth.setToken({
//       'access_token': accessToken
//     });
//   }
//   try {
//     var request = gapi.client.request({
//       'path': '/drive/v2/files',
//       'method': 'GET',
//       'params': params
//     });
//     request.execute(callback);
//   } catch (e) {
//     callback.call(this, {
//       'error': e
//     });
//   }
// };

'use strict';
/*******************************************************************************
 * Copyright 2012 Pawel Psztyc
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 ******************************************************************************/

/**
 * Advanced Rest Client namespace
 */
var arc = arc || {};
/**
 * ARC app's namespace
 */
arc.app = arc.app || {};
/**
 * A namespace for the file importer / exporter.
 */
arc.app.importer = arc.app.importer || {};
/**
 * Save imported from file data.
 */
arc.app.importer.saveFileData = function(data) {
  const requests = [];
  const isLegacy = data.kind === undefined ? true : false;
  data.requests.forEach((item) => {
    let obj = arc.app.importer.normalizeRequest(item);
    if (obj) {
      requests.push(obj);
      obj.type = 'saved';
    }
  });
  return arc.app.db.idb.open()
    .then(function(db) {
      return db.transaction('rw', db.requestObject, db.projectObjects, function() {
          const projects = {};
          let promises = [];
          //TODO:60 Is here memory leak?
          let insertRequest = (db, item) => {
            let referencedProjectId = item.project;
            let oldItemId = item.id;
            delete item.project;
            delete item.id;
            return db.requestObject.add(item)
              .then(function(requestId) {
                if (referencedProjectId) {
                  if (!(referencedProjectId in projects)) {
                    let _projects = data.projects.filter(
                      (project) => project.id === referencedProjectId);
                    if (_projects.length === 1) {
                      let project = new ProjectObject({
                        time: _projects[0].time,
                        name: _projects[0].name,
                        requestIds: [requestId]
                      });
                      projects[referencedProjectId] = project;
                    } else if (_projects.length > 1) {
                      console.warn('Projects filtered array has more than one element ' +
                        'and it should not happen.');
                    }
                  } else {
                    projects[referencedProjectId].addRequest(requestId);
                  }
                } else if (!isLegacy) {
                  for (var i = 0, length = data.projects.length; i < length; i++) {
                    if (!data.projects[i].requestIds) {
                      continue;
                    }
                    if (data.projects[i].requestIds.indexOf(oldItemId) !== -1) {
                      if (!data.projects[i].importRequestIds) {
                        data.projects[i].importRequestIds = [];
                      }
                      data.projects[i].importRequestIds.push(requestId);
                    }
                  }
                }
              });
          };

          requests.forEach((item) => {
            promises.push(insertRequest(db, item));
          });

          return Dexie.Promise.all(promises)
            .then(() => {
              let list = [];
              if (isLegacy) {
                let projectKeys = Object.keys(projects);
                if (projectKeys.length > 0) {
                  projectKeys.forEach((projectKey) => {
                    list.push(new ProjectObject(projects[projectKey]));
                  });
                }
              } else {
                if (data.projects && data.projects.length) {
                  data.projects.forEach((item) => {
                    if (!item.importRequestIds) {
                      item.importRequestIds = [];
                    }
                    item.requestIds = item.importRequestIds;
                    delete item.importRequestIds;
                    list.push(new ProjectObject(item));
                  });
                }
              }

              if (!list.length) {
                return null;
              }
              let promises = [];
              list.forEach((project) => {
                delete project.id;
                promises.push(db.projectObjects.add(project));
              });
              return Dexie.Promise.all(promises);
            });
        })
        .catch(function(error) {
          console.error('An error occurred when importing data.', error);
          throw error;
        })
        .finally(function() {
          db.close();
        });
    });
};
arc.app.importer.normalizeRequest = function(item) {
  if (item.kind) {
    let har = item._har ? item._har : item.har;
    if (har) {
      item.har = new HAR.Log(har);
    }
    delete item._har;
    item = new RequestObject(item);
    return item;
  }
  try {
    let obj = arc.app.importer._createHARfromSql(item);
    //just for import, to be removed before save.
    if (item.project) {
      obj.project = item.project;
    }
    return obj;
  } catch (e) {
    console.error('Unable to import request object', item, e.message);
  }
  return null;
};
/**
 * To be used to transform old system data to new data structure.
 *
 * @param {Object} item
 *  {
 *    "url": "Request URL",
 *    "method": "Request HTTP method",
 *    "encoding": "Old encoding value",
 *    "payload": "HTTP entity",
 *    "headers": "HTTP headers",
 *    "project": "Id of the project",
 *    "time": "Add time"
 *  }
 */
arc.app.importer._createHARfromSql = function(item) {
  var creator = new HAR.Creator({
    name: 'Advanced REST client',
    version: arc.app.utils.appVer,
    comment: 'Created during file import'
  });
  var browser = new HAR.Browser({
    name: 'Chrome',
    version: arc.app.utils.chromeVersion
  });
  var log = new HAR.Log({
    'comment': 'Imported from the file.',
    'version': 1.2,
    'creator': creator,
    'browser': browser
  });
  var requestHeaders = arc.app.headers.toJSON(item.headers);
  var request = new HAR.Request({
    url: item.url,
    httpVersion: 'HTTP/1.1',
    method: item.method
  });
  if (['GET', 'HEAD'].indexOf(item.method) === -1) {
    //Do not pass encoding for not-payload requests
    arc.app.headers._oldCombine(requestHeaders, item.encoding);
    var contentType = arc.app.headers.getContentType(requestHeaders) ||
      'application/x-www-form-urlencoded';
    var post = new HAR.PostData({
      mimeType: contentType,
      text: item.payload
    });
    request.postData = post;
  }
  request.headers = requestHeaders;
  var page = new HAR.Page({
    id: arc.app.db.idb.requests.createRequestKey(item.method, item.url),
    title: item.name,
    startedDateTime: new Date(item.time),
    pageTimings: {}
  });
  var entry = new HAR.Entry({
    startedDateTime: new Date(item.time),
    request: request,
    response: {
      status: '0',
      statusText: 'No response'
    }
  });
  entry.setPage(page);
  log.addPage(page);
  log.addEntry(entry, page.id);

  var obj = new RequestObject({
    'har': log,
    'url': item.url,
    'method': item.method,
    'name': item.name,
    'type': 'saved'
  });
  return obj;
};
/**
 * Prepare data for export.
 */
arc.app.importer.prepareExport = function() {
  var db;
  const result = {
    requests: [],
    projects: []
  };
  return arc.app.db.idb.open()
    .then(function(_db) {
      db = _db;
      return db.requestObject
        .where('type')
        .equals('saved')
        .toArray();
    })
    .then(function(requests) {
      if (requests && requests.length) {
        requests.forEach((item) => item._har = new HAR.Log(item._har));
      }
      result.requests = requests;
      return db.projectObjects
        .toArray();
    })
    .then(function(projects) {
      result.projects = projects;
    })
    .then(function() {
      return arc.app.importer.createExportObject(result);
    })
    .finally(function() {
      db.close();
    });
};
/**
 * Create a proper export object that have required export definitions.
 *
 * @param {Object} opts
 *  requests - A list of requests to be exported
 *  projects - A list of projects to be exported
 */
arc.app.importer.createExportObject = function(opts) {
  let exportObject = new FileExport({
    requests: opts.requests,
    projects: opts.projects
  });
  return exportObject;
};

'use strict';
/*******************************************************************************
 * Copyright 2012 Pawel Psztyc
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 ******************************************************************************/
/* global fetch, analytics */
/**
 * Advanced Rest Client namespace
 *
 * @namespace
 */
var arc = arc || {};
/**
 * ARC app's namespace
 *
 * @namespace
 */
arc.app = arc.app || {};
/**
 * A namespace for the Google Analytics tasks.
 *
 * @namespace
 */
arc.app.analytics = arc.app.analytics || {};
/**
 * A list of created trackers.
 */
arc.app.analytics._trackers = [];
/**
 * A configuration for trackers.
 * The array should contain as many configuration objects as needed.
 * Functions will use this configurations later to call trackers.
 * Value of each object will be passed as an argument to `create` function.
 * Each configuration element should contain a `name` property. If there will be no
 * `name` property the tracker will be not called by this code (but it will be initialized).
 */
arc.app.analytics._trackersConfig = [{
  'trackingId': 'UA-18021184-6'
},{
  'trackingId': 'UA-18021184-14'
}];
/**
 * Initialize Google Analytics code (init tracker).
 */
arc.app.analytics.init = function() {
  arc.app.analytics._initTranckers();
  arc.app.analytics._setCustomDimmensions();
  arc.app.analytics._setAppUid();
  arc.app.analytics._setChromeChannel();
};
/**
 * Initialize trackers.
 */
arc.app.analytics._initTranckers = function() {
  var service = analytics.getService('ARC');
  arc.app.analytics._trackersConfig.forEach(function(item) {
    let tracker = service.getTracker(item.trackingId);
    arc.app.analytics._trackers.push(tracker);
  });
};
/**
 * Initialize and set up custom dimmenstion that are used by the app.
 */
arc.app.analytics._setCustomDimmensions = function() {
  var appVersion = arc.app.utils.appVer;
  var chromeVer = arc.app.utils.chromeVersion;
  arc.app.analytics._trackers.forEach(function(tracker) {
    tracker.set('dimension1', chromeVer);
    tracker.set('dimension2', appVersion);
    //tracker.set('appVersion', appVersion);
  });
};
/**
 * The app is creating a anonymous UUID and is keeping it into
 * sync storage. This value will be propagated across app instances of the same user.
 * This information will be used in compliance with Google Analytics terms & conditions
 * which disallows any user information to be send to the GA server.
 * It's only for statistical reports.
 *
 * TODO: Add possibility to disable tracking code in settings.
 */
arc.app.analytics._setAppUid = function() {
  var setUid = function(uuid) {
    arc.app.analytics._trackers.forEach(function(tracker) {
      tracker.set('userId', uuid);
    });
  };
  if (chrome && chrome.storage && chrome.storage.sync) {
    chrome.storage.sync.get({
      'appuid': false
    }, function(data) {
      if (data.appuid) {
        setUid(data.appuid);
      } else {
        data.appuid = arc.app.utils.uuid();
        chrome.storage.sync.set(data, function() {
          setUid(data.appuid);
        });
      }
    });
  }
};
/**
 * If possible list current Chrom[e|ium] channels and find current version's channel.
 * Then set it up as a custom dimension.
 */
arc.app.analytics._setChromeChannel = function() {
  if (!window.navigator.onLine) {
    return;
  }
  arc.app.analytics._loadCSV()
    .then(function(obj) {
      if (!(obj instanceof Array)) {
        return;
      }
      let version = arc.app.utils.chromeVersion;
      for (let i = 0, size = obj[1].length; i < size; i++) {
        let item = obj[1][i];
        /*jshint camelcase: false */
        // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
        if (item.current_version === version ||
          item.previous_version === version) {
          // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
          /*jshint camelcase: true */
          let channel = item.channel;
          for (let j = 0, len = arc.app.analytics._trackers.length; j < len; j++) {
            arc.app.analytics._trackers[i].set('dimension3', channel);
          }
          return;
        }
      }
    })
    .catch(function(cause) {
      // @if NODE_ENV='debug'
      console.info('Unable to download Chrome channels list', cause);
      // @endif
    });
};
/**
 * Loads a CSV data with chrome data.
 *
 * @return {Object} Promise will result with parsed object of the current channels.
 */
arc.app.analytics._loadCSV = function() {
  var init = {
    mode: 'no-cors',
    cache: 'force-cache'
  };
  return fetch('https://omahaproxy.appspot.com/all?csv=1', init).then(function(response) {
    return response.text();
  }).then(function(data) {
    return data.split('\n');
  }).then(function(lines) {
    var keys = lines[0].split(',');
    var data = [];
    for (var i = 1; i < lines.length; ++i) {
      var line = lines[i];
      if (!line.length) {
        continue;
      }
      var columns = line.split(',');
      var row = {};
      for (var j = 0; j < columns.length; ++j) {
        row[keys[j]] = columns[j];
      }
      data.push(row);
    }
    return [keys, data];
  });
};
/**
 * And an event to the Google Analytics.
 *
 * @param {String} category Event's category
 * @param {String} action Event's action
 * @param {String} label Event's label
 * @param {!Number} value An optional value of the event.
 */
arc.app.analytics.sendEvent = function(category, action, label, value) {
  if (arc.app.analytics._trackers.length === 0) {
    return {
      'type': 'event',
      'params': arguments
    };
  }
  arc.app.analytics._trackers.forEach(function(tracker) {
    tracker.sendEvent(category, action, label, value);
  });
};
/**
 * Send a screen name as a screen view.
 *
 * @param {String} screenName A screen name to be send.
 */
arc.app.analytics.sendScreen = function(screenName) {
  arc.app.analytics._trackers.forEach(function(tracker) {
    tracker.sendAppView(screenName);
  });
};
/**
 * Send an exception information to the GA server.
 *
 * @param {String} exception An exception message.
 * @param {Boolean} isFatal True if the exception is fatal.
 */
arc.app.analytics.sendException = function(exception, isFatal) {
  if (arc.app.analytics._trackers.length === 0) {
    return {
      'type': 'exception',
      'params': [exception, isFatal + '']
    };
  }
  arc.app.analytics._trackers.forEach(function(tracker) {
    tracker.sendException(exception, isFatal);
  });
};
arc.app.analytics.getPendingAnalytics = function(callback) {
  if (!chrome.runtime.getBackgroundPage) {
    callback([]);
    return;
  }
  chrome.runtime.getBackgroundPage((bg) => {
    let bgPendings = bg.pendingAnalytics;
    if (!bgPendings) {
      bgPendings = [];
    }
    if (!window.pendingAnalytics) {
      window.pendingAnalytics = [];
    }
    let data = window.pendingAnalytics.concat(bgPendings);
    callback(data);
    window.pendingAnalytics = [];
    bg.pendingAnalytics = [];
  });
};

'use strict';
/*******************************************************************************
 * Copyright 2012 Pawel Psztyc
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 ******************************************************************************/

/**
 * A base object for all types with helper methods.
 */
class StatusNotification {
  /**
   * Special type of notification when the user see a message and have more than one option
   * to click. Status element will always include "dismiss" message.
   *
   * @param {Object} opts Initialization object:
   *  {
   *    "message": "A message to show",
   *    "timeout": "An optional number of milliseconds. Default to StatusNotification.TIME_SHORT",
   *    "actionName": "Optional but must be set with callback function. A label to display."
   *  }
   * @param {Function} callback Optional function to call when the user click on the action button.
   */
  static notify(opts, callback) {
    if (callback && !opts.actionName) {
      throw new Error('You need to set `actionName` option when setting callback');
    }
    if (!opts.timeout && opts.timeout !== 0) {
      opts.timeout = StatusNotification.TIME_SHORT;
    }
    var toast;
    try {
      toast = document.querySelector('paper-toast[text="' + opts.message + '"]');
    } catch (e) {}
    var isCallback = (!!callback);
    if (!toast) {
      toast = document.createElement('paper-toast');
      toast.classList.add('status-toast');
      //toast.autoFitOnAttach = true;
      //toast.withBackdrop = true;
      toast.text = opts.message;
      toast.duration = opts.timeout;
      let label = document.createElement('paper-button');
      label.innerText = isCallback ? opts.actionName : 'Close';
      let fn = function() {
        label.removeEventListener('click', fn);
        toast.close();
        if (isCallback) {
          callback();
        }
      };
      label.addEventListener('tap', fn);
      toast.appendChild(label);
      document.body.appendChild(toast);
    } else {
      //replace action
      let label = Polymer.dom(toast.root)
        .querySelector('paper-button');
      let fn = function() {
        label.removeEventListener('click', fn);
        toast.close();
        if (isCallback) {
          callback();
        }
      };
      label.addEventListener('tap', fn);
    }
    toast.open();
  }
}
StatusNotification.TIME_SHORT = 3000;
StatusNotification.TIME_MEDIUM = 7000;
StatusNotification.TIME_LONG = 12000;
StatusNotification.TIME_INFINITY = 0;

'use strict';
/*******************************************************************************
 * Copyright 2016 Pawel Psztyc, The ARC team
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 ******************************************************************************/

/**
 * Parses URL to get some information about it.
 *
 * <p>Script found at http://blog.stevenlevithan.com/archives/parseuri</p>
 *
 * URL like:
 * http://usr:pwd@www.test.com:81/dir/dir.2/index.htm?q1=0&&test1&test2=value&a[]=1&a[]=2#top
 * parses to:
 *
 * anchor:	top
 * query:	q1=0&&test1&test2=value&a[]=1&a[]=2
 * file:	index.htm
 * directory:	/dir/dir.2/
 * path:	/dir/dir.2/index.htm
 * relative:	/dir/dir.2/index.htm?q1=0&&test1&test2=value&a[]=1&a[]=2#top
 * port:	81
 * host:	www.test.com
 * password:	pwd
 * user:	usr
 * userInfo:	usr:pwd
 * authority:	usr:pwd@www.test.com:81
 * protocol:	http
 * source:http://usr:pwd@www.test.com:81/dir/dir.2/index.htm?q1=0&&test1&test2=value&a[]=1&a[]=2#top
 * queryKey: {
 *   q1:	0,
 *   test1:	[empty string]
 *   test2:	value
 *   a[]:	2
 * }
 *
 * @see http://blog.stevenlevithan.com/archives/parseuri
 */
/*jshint unused:false*/
class URLParser {
  /**
   * Creates an instance of the parser and parse the url
   *
   * @param {String} input The URL to parse
   */
  constructor(input) {
      var regStr = '^(?:(?![^:@]+:[^:@\\/]*@)([^:\\/?#.]+):)?(?:\\/\\/)?((?:(([^:@]*)(?::([^:@]*' +
        '))?)?@)?([^:\\/?#]*)(?::(\\d*))?)(((\\/(?:[^?#](?![^?#\\/]*\\.[^?#\\/.]+(?:[?#]|$)))*' +
        '\\/?)?([^?#\\/]*))(?:\\?([^#]*))?(?:#(.*))?)';
      this.mainRegexp = new RegExp(regStr, 'gim');
      /**
       * The full url. Oryginal value of the source.
       * Source can't be changed via any setters.
       *
       * @type {String}
       */
      this.source = input;
      /**
       * Protocol used in URL. It's null by default.
       *
       * @type {String|null}
       */
      this.protocol = null;
      /**
       * Authority used in URL.
       * Authotity is: [USER:PASSWORD@]HOST[:PORT]
       * @example
       * usr:pwd@www.test.com:81
       *
       * @type {String|null}
       */
      this.authority = null;
      /**
       * User Info used in the URL.
       * User info is: USER:PASSWORD.
       * @example
       * usr:pwd
       *
       * @type {String|null}
       */
      this.userInfo = null;
      /**
       * User used in the URL
       *
       * @type {String|null}
       */
      this.user = null;
      /**
       * Password used in the URL
       *
       * @type {String|null}
       */
      this.password = null;
      /**
       * HOST used in the URL
       *
       * @example www.test.com
       *
       * @type {String|null}
       */
      this.host = null;
      /**
       * Port used in the url.
       *
       * @type {String|null}
       */
      this._port = null;
      /**
       * All data after host value in the url
       *
       * @type {String|null}
       */
      this.relative = null;
      /**
       * Path value used in the url.
       *
	     * @example /dir/dir.2/index.htm
       *
       * @type {String|null}
       */
      this.path = null;
      /**
       * Directory value used in the url.
       *
       * @example /dir/dir.2/
       *
       * @type {String|null}
       */
      this.directory = null;
      /**
       * File value used in the url.
       *
       * @example index.htm
       *
       * @type {String|null}
       */
      this.file = null;
      /**
       * Query value used in the url.
       *
       * @example q1=0&&test1&test2=value&a[]=1&a[]=2
       *
       * @type {String|null}
       */
      this._query = null;
      /**
       * Anchor value used in the url without the '#' character
       *
       * @type {String|null}
       */
      this.anchor = null;
      /**
       * List of http parameters.
       *
       * @type {Set}
       */
      this._paramsList = new Set();
      /**
       * A character to be used when parsing query parameters list.
       *
       * @type {String}
       */
      this.queryDelimiter = '&';
      this.parse(input);
    }
    /**
     * Parse the url
     *
     * @param {String} url The URL to parse
     */
  parse(url) {
    var i = 14;
    var results = this.mainRegexp.exec(url);
    while (i--) {
      let value = results[i];
      if (!value) {
        continue;
      }
      switch (i) {
        case 13:
          this.anchor = value;
          break;
        case 12:
          this._query = value;
          break;
        case 11:
          this.file = value;
          break;
        case 10:
          this.directory = value;
          break;
        case 9:
          this.path = value;
          break;
        case 8:
          this.relative = value;
          break;
        case 7:
          this._port = value;
          break;
        case 6:
          this.host = value;
          break;
        case 5:
          this.password = value;
          break;
        case 4:
          this.user = value;
          break;
        case 3:
          this.userInfo = value;
          break;
        case 2:
          this.authority = value;
          break;
        case 1:
          this.protocol = value;
          break;
        case 0:
          this.source = value;
          break;
      }
    }
    if (this._query) {
      this._paramsList = this._parseParams(this._query);
    }
  }
  set port(port) {
    this._port = port;
  }

  get port() {
    if (isNaN(this._port)) {
      return this._port;
    }
    return parseInt(this._port);
  }
  /**
   * Set query value .
   * Note: It will not change source value
   *
   * @param {String} query
   */
  set query(query) {
    if (query) {
      this._query = query;
      this._paramsList = this._parseParams(query);
    } else {
      this._query = null;
      this._paramsList = new Set();
    }
  }
  /**
   * Current query value;
   */
  get query() {
    return this._query;
  }

  set paramsList(paramsList) {
    if (!(paramsList instanceof Set)) {
      try {
        paramsList = new Set(paramsList);
      } catch (e) {
        throw new TypeError('paramsList must be type of set');
      }
    }
    this._paramsList = paramsList;
    this.setQueryFromCurrentParams();
  }

  get paramsList() {
    return this._paramsList;
  }
  /**
   * Parse a query params value and return a set of parsed parameters.
   *
   * @param {String} query A query string from the url.
   * @return {Set} A set of objects where param name has key `name` and param value has key
   * `value`.
   */
  _parseParams(query) {
    var reg = /(?:^|&|;)([^&;=]*)=?([^&;]*)/g;
    var result = new Set();
    query.replace(reg, ($0, $1, $2) => {
      if ($1) {
        let obj = {
          name: $1,
          value: $2
        };
        result.add(obj);
      }
    });
    return result;
  }

  setQueryFromCurrentParams() {
    var result = '';
    for (let param of this._paramsList) {
      if (!param) {
        continue;
      }
      if (result) {
        result += this.queryDelimiter;
      }
      result += param.name + '=' + param.value;
    }
    this._query = result;
  }

  toString() {
    var result = '';
    var hasUser = false;
    var hasPassword = false;
    if (this.protocol) {
      result += this.protocol;
      result += '://';
    }

    if (this.user && this.user.trim() !== '') {
      hasUser = true;
      result += this.user;
    }
    if (this.password && this.password.trim() !== '') {
      hasPassword = true;
      if (hasUser) {
        result += ':';
      }
      result += this.password;
    }
    if (hasPassword || hasUser) {
      result += '@';
    }
    result += this.host;

    if (this._port) {
      result += ':' + this._port;
    }
    result += this.path;
    if (this._query && this._query.trim() !== '') {
      result += '?' + this._query;
    }
    if (this.anchor && this.anchor.trim() !== '') {
      result += '#' + this.anchor;
    }
    return result;
  }
  /**
   * Returns a string where all characters that are not valid for a URL
   * component have been escaped. The escaping of a character is done by
   * converting it into its UTF-8 encoding and then encoding each of the
   * resulting bytes as a %xx hexadecimal escape sequence.
   * <p>
   * Note: this method will convert any the space character into its escape
   * short form, '+' rather than %20. It should therefore only be used for
   * query-string parts.
   *
   * <p>
   * The following character sets are <em>not</em> escaped by this method:
   * <ul>
   * <li>ASCII digits or letters</li>
   * <li>ASCII punctuation characters:
   *
   * <pre>- _ . ! ~ * ' ( )</pre>
   * </li>
   * </ul>
   * </p>
   *
   * <p>
   * Notice that this method <em>does</em> encode the URL component delimiter
   * characters:<blockquote>
   *
   * <pre>
   * ; / ? : &amp; = + $ , #
   * </pre>
   *
   * </blockquote>
   * </p>
   *
   * @param {String} str A string containing invalid URL characters
   * @return {String} a string with all invalid URL characters escaped
   */
  static encodeQueryString(str) {
    if (!str) {
      return str;
    }
    var regexp = /%20/g;
    return encodeURIComponent(str).replace(regexp, '+');
  }
  /**
   * Returns a string where all URL component escape sequences have been
   * converted back to their original character representations.
   *
   * Note: this method will convert the space character escape short form, '+',
   * into a space. It should therefore only be used for query-string parts.
   *
   * @param {String} str string containing encoded URL component sequences
   * @return {String} string with no encoded URL component encoded sequences
   */
  static decodeQueryString(str) {
    if (!str) {
      return str;
    }
    var regexp = /\+/g;
    return decodeURIComponent(str.replace(regexp, '%20'));
  }
}

'use strict';

/* global URLParser */
/*******************************************************************************
 * Copyright 2016 Pawel Psztyc, The ARC team
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 ******************************************************************************/
/**
 * A class containing methods to parse request payload.
 */
class PayloadParser {
  /**
   * Parse input array to string x-www-form-urlencoded
   *
   * @param {Array<Object>} arr Input array. Each element musct contain an object with
   * `name` and `value` keys.
   * @return {String} A parsed string of `name`=`value` pairs of the input objects.
   */
  static arrayToString(arr) {
    var result = '';
    if (!arr) {
      return result;
    }
    arr.forEach((item) => {
      let name = PayloadParser._paramValue(item.name);
      let value = PayloadParser._paramValue(item.value);
      if (!name && !value) {
        return;
      }
      if (result) {
        result += '&';
      }
      result += name + '=' + value;
    });
    return result;
  }
  /**
   * Parse input string to array of x-www-form-urlencoded form parameters.
   *
   * @param {String} input A string of HTTP x-www-form-urlencoded parameters
   * @return {Array<Object>} An array of params with `name` and `value` keys.
   */
  static stringToArray(input) {
    var result = [];
    if (!input || !input.trim()) {
      return result;
    }
    //Chrome inspector has FormData output in format: `param-name`:`param-value`
    //When copying from inspector the ':' must be replaced with '='
    var htmlInputCheck = /^([^\\=]{1,})=(.*)$/m;
    if (!htmlInputCheck.test(input)) {
      //replace chome inspector data.
      input = input.replace(/^([^\\:]{1,}):(.*)$/gm, '$1=$2&').replace(/\n/gm,'');
      input = input.substr(0, input.length - 1);
    }
    var parts = input.split('&');
    parts.forEach((line) => {
      var obj = PayloadParser._paramLineToFormObject(line);
      if (!obj) {
        return;
      }
      result.push(obj);
    });
    return result;
  }
  /**
   * Encode payload to x-www-form-urlencoded string.
   *
   * @param {Array<object>|String} input An input data.
   */
  static encodeUrlEncoded(input) {
    if (!input || !input.length) {
      return input;
    }
    var isArray = true;
    if (!(input instanceof Array)) {
      isArray = false;
      input = PayloadParser.stringToArray(input);
    }
    input.forEach((obj) => {
      obj.name = URLParser.encodeQueryString(obj.name);
      obj.value = URLParser.encodeQueryString(obj.value);
    });
    if (isArray) {
      return input;
    }
    return PayloadParser.arrayToString(input);
  }

  /**
   * Decode x-www-form-urlencoded data.
   *
   * @param {Array<object>|String} input An input data.
   */
  static decodeUrlEncoded(input) {
    if (!input || !input.length) {
      return input;
    }
    var isArray = true;
    if (!(input instanceof Array)) {
      isArray = false;
      input = PayloadParser.stringToArray(input);
    }
    input.forEach((obj) => {
      obj.name = URLParser.decodeQueryString(obj.name);
      obj.value = URLParser.decodeQueryString(obj.value);
    });
    if (isArray) {
      return input;
    }
    return PayloadParser.arrayToString(input);
  }

  /**
   * Parse input string as a payload param key or value.
   *
   * @param {String} input An input to parse.
   */
  static _paramValue(input) {
    if (!input) {
      return String();
    }
    input = String(input);
    input = input.trim();
    return input;
  }
  /**
   * Parse a line of key=value http params into an object with `name` and `value` keys.
   *
   * @param {String} input A input line of x-www-form-urlencoded text tike `param=value`
   * @return {Object} A parsed object with `name` and `value` keys.
   */
  static _paramLineToFormObject(input) {
    if (!input) {
      return;
    }
    var _tmp = input.split('=');
    var name = _tmp[0].trim();
    if (!name && _tmp.length === 1) {
      return;
    }
    var value;
    if (_tmp.length === 1) {
      value = '';
    } else {
      value = _tmp[1].trim();
    }
    return {
      name: name,
      value: value
    };
  }
}

'use strict';
/*******************************************************************************
 * Copyright 2012 Pawel Psztyc
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 ******************************************************************************/
/* global chrome */
/**
 * Advanced Rest Client namespace
 *
 * @namespace
 */
var arc = arc || {};
/**
 * ARC app's namespace
 *
 * @namespace
 */
arc.app = arc.app || {};
/**
 * A namespace for the clipboard functions.
 *
 * @namespace
 */
arc.app.clipboard = arc.app.clipboard || {};

arc.app.clipboard.write = function(data) {
  chrome.permissions.contains({
    permissions: ['clipboardWrite']
  }, (status) => {
    if (status) {
      arc.app.clipboard._write(data);
    } else {
      chrome.permissions.request({
        permissions: ['clipboardWrite']
      }, (granted) => {
        if (granted) {
          arc.app.clipboard._write(data);
        }
      });
    }
  });
};

arc.app.clipboard._write = function(data) {
  var clipboardholder = document.createElement('textarea');
  document.body.appendChild(clipboardholder);
  clipboardholder.value = data;
  clipboardholder.select();
  document.execCommand('copy');
  clipboardholder.parentNode.removeChild(clipboardholder);
};

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == 'object' && typeof module == 'object') { // CommonJS
    mod(require('../../lib/codemirror'));
  } else if (typeof define == 'function' && define.amd) { // AMD
    define(['../../lib/codemirror'], mod);
  } else { // Plain browser env
    mod(CodeMirror);
  }
})(function(CodeMirror) {
  'use strict';

  CodeMirror.defineMode('http-headers', function() {

    function failRest(stream, state) {
      stream.skipToEnd();
      state.cur = failRest;
      return 'error';
    }

    function header(stream) {
      if (stream.sol() && !stream.eat(/[ \t]/)) {
        if (stream.match(/^.*?:/)) {
          return 'atom';
        } else {
          stream.skipToEnd();
          return 'error';
        }
      } else {
        stream.skipToEnd();
        return 'string';
      }
    }

    return {
      token: function(stream, state) {
        var cur = state.cur;
        if (!cur || cur !== header && stream.eatSpace()) {
          return null;
        }
        return cur(stream, state);
      },

      blankLine: function(state) {
        state.cur = failRest;
      },

      startState: function() {
        return {
          cur: header
        };
      }
    };
  });
  CodeMirror.defineMIME('message/http-headers', 'http-headers');
});

(function(mod) {
  if (typeof exports == 'object' && typeof module == 'object') { // CommonJS
    mod(require('../../lib/codemirror'));
  } else if (typeof define == 'function' && define.amd) { // AMD
    define(['../../lib/codemirror'], mod);
  } else { // Plain browser env
    mod(CodeMirror);
  }
})(function(CodeMirror) {
  'use strict';

  var Pos = CodeMirror.Pos;
  var accept = [
    '*/*',
    'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'application/xml,application/xhtml+xml,text/html;q=0.9, text/plain;q=0.8,image/png,*/*;q=0.5',
    'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'image/jpeg, application/x-ms-application, image/gif, application/xaml+xml, image/pjpeg, ' +
      'application/x-ms-xbap, application/x-shockwave-flash, application/msword, */*',
    'text/html, application/xml;q=0.9, application/xhtml+xml, image/png, image/webp, image/jpeg,' +
      ' image/gif, image/x-xbitmap, */*;q=0.1',
    'image/png,image/*;q=0.8,*/*;q=0.5',
    'audio/webm, audio/ogg, audio/wav, audio/*;q=0.9, application/ogg;q=0.7, video/*;q=0.6; ' +
      '*/*;q=0.5',
    'video/webm, video/ogg, video/*;q=0.9, application/ogg=0.7, audio/*;q=0.6; */*;q=0.5',
    'application/javascript, */*;q=0.8',
    'text/css,*/*;q=0.1',
    'text/html, application/xml;q=0.9, application/xhtml+xml, image/png, image/webp, image/jpeg' +
      ', image/gif, image/x-xbitmap, */*;q=0.1'
  ];
  var contentTypes = [
    'application/json',
    'application/xml',
    'application/atom+xml',
    'multipart-form-data',
    'application/x-www-form-urlencoded',
    'application/base64',
    'application/octet-stream',
    'text/plain',
    'text/css',
    'text/html',
    'application/javascript'
  ];
  var authorizationHeaders = ['Basic {base64 of user:password}','Bearer {OAuth2 bearer}'];
  var authorizationParams = {
    'base64 of user:password': {
      type: String,
      call: 'authorizationBasic'
    },
    'OAuth2 bearer': {
      type: String,
      call: 'authorizationGoogleOauth2'
    }
  };

  var headersStructure = [{
    key: 'Accept',
    values: accept
  }, {
    key: 'Accept-Charset',
    values: [
      'UTF-8',
      'UTF-16',
      'ISO-8859-1',
      'ISO-8859-1,utf-8;q=0.7,*;q=0.7']
  }, {
    key: 'Accept-Encoding',
    values: [
      'compress',
      'gzip',
      'deflate',
      'identity',
      'br',
      '*',
      'gzip, deflate, sdch']
  }, {
    key: 'Accept-Language',
    values: [
      'en-US',
      'cad',
      'en-gb;q=0.8, en;q=0.7'
    ]
  }, {
    key: 'Authorization',
    values: authorizationHeaders,
    params: authorizationParams
  }, {
    key: 'Access-Control-Request-Method',
    values: ['GET','POST','PUT','DELETE']
  }, {
    key: 'Access-Control-Request-Headers',
    values: ['{list-of-headers}']
  }, {
    key: 'Cache-Control',
    values: [
      'no-cache',
      'no-store',
      'max-age={seconds}',
      'max-stale={seconds}',
      'min-fresh={seconds}',
      'no-transform',
      'only-if-cached'
    ],
    params: {
      seconds: {
        type: Number
      }
    }
  }, {
    key: 'Connection',
    values: ['close', 'keep-alive']
  }, {
    key: 'Content-MD5',
    values: ['{md5-of-message}']
  }, {
    key: 'Content-Length',
    values: ['{length-in-bytes}']
  }, {
    key: 'Content-Type',
    values: contentTypes
  }, {
    key: 'Cookie',
    values: [
      '{cookie name}={cookie value}',
      '{cookie name}={cookie value}; expires={insert GMT date here}; domain={domain.com}; ' +
        'path=/; secure'
    ]
  }, {
    key: 'Date',
    values: [
      '{insert GMT date here}'
    ]
  }, {
    key: 'DNT',
    values: [0, 1]
  }, {
    key: 'Expect',
    values: [
      '200-OK',
      '100-continue'
    ]
  }, {
    key: 'From',
    values: ['user@domain.com']
  }, {
    key: 'Front-End-Https',
    values: ['on', 'off']
  }, {
    key: 'Host',
    values: [
      'www.domain.com',
      'www.domain.com:80'
    ]
  }, {
    key: 'If-Match',
    values: ['{insert entity tag}']
  }, {
    key: 'If-Modified-Since',
    values: ['{insert GMT date here}']
  }, {
    key: 'If-None-Match',
    values: ['{insert entity tag}']
  }, {
    key: 'If-Range',
    values: ['{insert entity tag}', '{insert GMT date here}']
  }, {
    key: 'If-Unmodified-Since',
    values: ['{insert GMT date here}']
  }, {
    key: 'Max-Forwards',
    values: ['{number of forwards}'],
    params: {
      'number of forwards': {
        type: Number
      }
    }
  }, {
    key: 'Origin',
    values: []
  }, {
    key: 'Pragma',
    values: ['no-cache']
  }, {
    key: 'Proxy-Authorization',
    values: authorizationHeaders,
    params: authorizationParams
  }, {
    key: 'Proxy-Connection',
    values: ['close', 'keep-alive']
  }, {
    key: 'Range',
    values: [
      'bytes={from bytes}-{to bytes}',
      'bytes=-{final bytes}'
    ]
  }, {
    key: 'Referer',
    values: ['{http://www.domain.com/}']
  }, {
    key: 'TE',
    values: [
      '{header name}',
      'trailers, deflate;q=0.5'
    ]
  }, {
    key: 'Upgrade',
    values: ['HTTP/2.0, SHTTP/1.3, IRC/6.9, RTA/x11']
  }, {
    key: 'User-Agent',
    values: [
      navigator.userAgent,
      'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:33.0) Gecko/20120101 Firefox/33.0',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10; rv:33.0) Gecko/20100101 Firefox/33.0',
      'Opera/9.80 (Windows NT 6.0) Presto/2.12.388 Version/12.14',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.75.14 (KHTML, like Gecko)' +
        ' Version/7.0.3 Safari/7046A194A',
      'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.0; WOW64; Trident/4.0; SLCC1)',
      'Mozilla/5.0 (MSIE 10.0; Windows NT 6.1; Trident/5.0)',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gec' +
        'ko) Version/6.0 Mobile/10A5376e Safari/8536.25',
      'Mozilla/5.0 (iPad; CPU OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) ' +
        'Version/6.0 Mobile/10A5376e Safari/8536.25',
      'Mozilla/5.0 (Linux; Android 4.4.2; Nexus 4 Build/KOT49H) AppleWebKit/537.36 (KHTML, ' +
        'like Gecko) Chrome/34.0.1847.114 Mobile Safari/537.36',
      'Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM;' +
        ' Touch; NOKIA; Lumia 920)'
    ]
  }, {
    key: 'Via',
    values: []
  }, {
    key: 'Warning',
    values: [
      '{code} {agent} {message} {date}'
    ],
    properties: {
      code: {
        type: Number
      },
      agent: {
        type: String
      },
      message: {
        type: String
      },
      date: {
        type: Date
      }
    }
  }, {
    key: 'X-ATT-DeviceId',
    values: []
  }, {
    key: 'X-Forwarded-For',
    values: []
  }, {
    key: 'X-Forwarded-Proto',
    values: ['http', 'https']
  }, {
    key: 'X-Requested-With',
    values: ['XMLHttpRequest']
  }, {
    key: 'X-Wap-Profile',
    values: []
  }];

  function getToken(editor, cur) {
    return editor.getTokenAt(cur);
  }
  /**
   * Get all keywords (headers names).
   * @param {Array} headersStructure List of possible headers
   * @return {Array} Array of founded header names.
   */
  var getKeywords = function(headersStructure) {
    var keywords = [];
    for (var i = 0; i < headersStructure.length; i++) {
      keywords.push({
        text: headersStructure[i].key,
        hint: function(cm, data, completion) {
          cm.replaceRange(completion.text + ': ', data.from, data.to);
          CodeMirror.signal(cm, 'header-key-selected', completion.text);
        }
      });
    }
    return keywords;
  };
  var getHeaderValuesFor = function(headersStructure, key) {
    var keywords = [];
    for (var i = 0; i < headersStructure.length; i++) {
      if (headersStructure[i].key.toLowerCase() === key) {
        if (headersStructure[i].values && headersStructure[i].values.length > 0) {
          headersStructure[i].values.forEach(function(item) {
            var completion = {
              text: item,
              hint: function(cm, data, completion) {
                cm.replaceRange(completion.text, data.from, data.to);
                CodeMirror.signal(cm, 'header-value-selected', completion.text);
              }
            };
            keywords.push(completion);
          });
        }
        break;
      }
    }
    return keywords;
  };
  var cleanResults = function(text, keywords) {
    var results = [];
    var i = 0;
    for (i = 0; i < keywords.length; i++) {
      if (keywords[i].text) {
        if (keywords[i].text.toLowerCase().substring(0, text.length) === text) {
          results.push(keywords[i]);
        }
      } else {
        if (keywords[i].toLowerCase().substring(0, text.length) === text) {
          results.push(keywords[i]);
        }
      }
    }
    return results;
  };

  function getHints(editor, options) {
    var cur = editor.getCursor();
    var token = getToken(editor, cur);
    var tokenString = (!!token.string) ? '' : token.string.trim();
    var keywords = [];
    var i = 0;
    var fromCur = {
      line: cur.line,
      ch: cur.ch + 2
    };
    var toCur = {
      line: cur.line,
      ch: cur.ch
    };
    var flagClean = true;
    var last = editor.getRange({
      line: cur.line,
      ch: cur.ch - 1
    }, cur);
    var last2 = editor.getRange({
      line: cur.line,
      ch: cur.ch - 2
    }, cur);

    if ((last === ':' || last2 === ': ') || (last === ',' || last2 === ', ')) {
      var key = editor.getRange({
        line: cur.line,
        ch: 0
      }, cur);
      if (!key) {
        key = '';
      }
      key = key.substr(0, key.indexOf(':')).trim().toLowerCase();
      keywords = getHeaderValuesFor(headersStructure, key);

    } else if (editor.getRange({
        line: cur.line,
        ch: 0
      }, cur).trim() !== '') {
      var prev = editor.getRange({
        line: cur.line,
        ch: 0
      }, cur).trim();
      if (prev.indexOf(':') > -1) {
        //looking for value
        tokenString = prev.substr(prev.indexOf(':') + 1).trim().toLowerCase();
        keywords = getHeaderValuesFor(headersStructure, key);
      } else {
        //looking for header name starting with...
        tokenString = prev.toLowerCase();
        keywords = getKeywords(headersStructure);
      }
      fromCur.ch = token.start;

    } else {
      for (i = 0; i < headersStructure.length; i++) {
        keywords = getKeywords(headersStructure);
      }
    }

    if (flagClean === true && tokenString.trim() === '') {
      flagClean = false;
    }

    if (flagClean) {
      keywords = cleanResults(tokenString, keywords);
    }
    /*
     * from: replaceToken ? Pos(cur.line, tagStart == null ? token.start : tagStart) : cur,
     to: replaceToken ? Pos(cur.line, token.end) : cur
     */
    return {
      list: keywords,
      from: fromCur,
      to: toCur
    };
  }

  CodeMirror.registerHelper('hint', 'http-headers', getHints);
});

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE
(function(mod) {
  if (typeof exports == 'object' && typeof module == 'object') {// CommonJS
    mod(require('./../lib/codemirror'));
  } else if (typeof define == 'function' && define.amd) {// AMD
    define(['../../lib/codemirror'], mod);
  } else {// Plain browser env
    mod(CodeMirror);
  }
})(function(CodeMirror) {
  'use strict';

  var HINT_ELEMENT_CLASS = 'CodeMirror-hint';
  var ACTIVE_HINT_ELEMENT_CLASS = 'iron-selected';

  // This is the old interface, kept around for now to stay
  // backwards-compatible.
  CodeMirror.showHint = function(cm, getHints, options) {
    if (!getHints) {
      return cm.showHint(options);
    }
    if (options && options.async) {
      getHints.async = true;
    }
    var newOpts = {
      hint: getHints
    };
    if (options) {
      for (var prop in options) {
        newOpts[prop] = options[prop];
      }
    }
    return cm.showHint(newOpts);
  };

  CodeMirror.defineExtension('showHint', function(options) {
    // We want a single cursor position.
    if (this.listSelections().length > 1 || this.somethingSelected()) {
      return;
    }

    if (this.state.completionActive) {
      this.state.completionActive.close();
    }
    var completion = this.state.completionActive = new Completion(this, options);
    if (!completion.options.hint) {
      return;
    }

    CodeMirror.signal(this, 'startCompletion', this);
    completion.update(true);
  });

  function Completion(cm, options) {
    this.cm = cm;
    this.options = this.buildOptions(options);
    this.widget = null;
    this.debounce = 0;
    this.tick = 0;
    this.startPos = this.cm.getCursor();
    this.startLen = this.cm.getLine(this.startPos.line).length;

    var self = this;
    cm.on('cursorActivity', this.activityFunc = function() {
      self.cursorActivity();
    });
  }

  var requestAnimationFrame = window.requestAnimationFrame || function(fn) {
    return setTimeout(fn, 1000 / 60);
  };
  var cancelAnimationFrame = window.cancelAnimationFrame || clearTimeout;

  Completion.prototype = {
    close: function() {
      if (!this.active()) {
        return;
      }
      this.cm.state.completionActive = null;
      this.tick = null;
      this.cm.off('cursorActivity', this.activityFunc);

      if (this.widget && this.data) {
        CodeMirror.signal(this.data, 'close');
      }
      if (this.widget) {
        this.widget.close();
      }
      CodeMirror.signal(this.cm, 'endCompletion', this.cm);
    },

    active: function() {
      return this.cm.state.completionActive == this;
    },

    pick: function(data, i) {
      var completion = data.list[i];
      if (completion.hint) {
        completion.hint(this.cm, data, completion);
      } else {
        this.cm.replaceRange(getText(completion), completion.from || data.from,
          completion.to || data.to, 'complete');
      }
      CodeMirror.signal(data, 'pick', completion);
      this.close();
    },

    cursorActivity: function() {
      if (this.debounce) {
        cancelAnimationFrame(this.debounce);
        this.debounce = 0;
      }

      var pos = this.cm.getCursor();
      var line = this.cm.getLine(pos.line);
      if (pos.line != this.startPos.line ||
        line.length - pos.ch != this.startLen - this.startPos.ch ||
        pos.ch < this.startPos.ch || this.cm.somethingSelected() ||
        (pos.ch && this.options.closeCharacters.test(line.charAt(pos.ch - 1)))) {
        this.close();
      } else {
        var self = this;
        this.debounce = requestAnimationFrame(function() {
          self.update();
        });
        if (this.widget) {
          this.widget.disable();
        }
      }
    },

    update: function(first) {
      if (this.tick == null) {
        return;
      }
      if (this.data) {
        CodeMirror.signal(this.data, 'update');
      }
      if (!this.options.hint.async) {
        this.finishUpdate(this.options.hint(this.cm, this.options), first);
      } else {
        var myTick = ++this.tick;
        var self = this;
        this.options.hint(this.cm, function(data) {
          if (self.tick == myTick) {
            self.finishUpdate(data, first);
          }
        }, this.options);
      }
    },

    finishUpdate: function(data, first) {
      this.data = data;

      var picked = (this.widget && this.widget.picked) || (first && this.options.completeSingle);
      if (this.widget) {
        this.widget.close();
      }
      if (data && data.list.length) {
        if (picked && data.list.length == 1) {
          this.pick(data, 0);
        } else {
          this.widget = new Widget(this, data);
          CodeMirror.signal(data, 'shown');
        }
      }
    },

    buildOptions: function(options) {
      var editor = this.cm.options.hintOptions;
      var out = {};
      for (var prop in defaultOptions) {
        out[prop] = defaultOptions[prop];
      }
      if (editor) {
        for (var prop in editor) {
          if (editor[prop] !== undefined) {
            out[prop] = editor[prop];
          }
        }
      }
      if (options) {
        for (var prop in options) {
          if (options[prop] !== undefined) {
            out[prop] = options[prop];
          }
        }
      }
      return out;
    }
  };

  function getText(completion) {
    if (typeof completion === 'string') {
      return completion;
    } else {
      return completion.text;
    }
  }

  function buildKeyMap(completion, handle) {
    var baseMap = {
      Up: function() {
        handle.moveFocus(-1);
      },
      Down: function() {
        handle.moveFocus(1);
      },
      PageUp: function() {
        handle.moveFocus(-handle.menuSize() + 1, true);
      },
      PageDown: function() {
        handle.moveFocus(handle.menuSize() - 1, true);
      },
      Home: function() {
        handle.setFocus(0);
      },
      End: function() {
        handle.setFocus(handle.length - 1);
      },
      Enter: handle.pick,
      Tab: handle.pick,
      Esc: handle.close
    };
    var custom = completion.options.customKeys;
    var ourMap = custom ? {} : baseMap;

    function addBinding(key, val) {
      var bound;
      if (typeof val !== 'string') {
        bound = function(cm) {
          return val(cm, handle);
        };
        // This mechanism is deprecated
      } else if (baseMap.hasOwnProperty(val)) {
        bound = baseMap[val];
      } else {
        bound = val;
      }
      ourMap[key] = bound;
    }
    if (custom) {
      for (var key in custom) {
        if (custom.hasOwnProperty(key)) {
          addBinding(key, custom[key]);
        }
      }
    }
    var extra = completion.options.extraKeys;
    if (extra) {
      for (var key in extra) {
        if (extra.hasOwnProperty(key)) {
          addBinding(key, extra[key]);
        }
      }
    }
    return ourMap;
  }

  function getHintElement(hintsElement, el) {
    while (el && el != hintsElement) {
      if (el.nodeName.toUpperCase() === 'LI' && el.parentNode === hintsElement) {
        return el;
      }
      el = el.parentNode;
    }
  }

  function Widget(completion, data) {
    this.completion = completion;
    this.data = data;
    this.picked = false;
    var widget = this;
    var cm = completion.cm;

    var hints = this.hints = document.createElement('paper-material');
    hints.className = 'CodeMirror-hints';
    this.selectedHint = data.selectedHint || 0;
    var container = document.createElement('paper-menu');
    container.selected = 0;
    hints.appendChild(container);
    hints.elevation = 2;

    var completions = data.list;
    for (var i = 0; i < completions.length; ++i) {
      var elt = container.appendChild(document.createElement('paper-item'));
      var cur = completions[i];
      var className = HINT_ELEMENT_CLASS + (i != this.selectedHint ? '' : ' ' +
        ACTIVE_HINT_ELEMENT_CLASS);
      if (cur.className != null) {
        className = cur.className + ' ' + className;
      }
      elt.className = className;
      if (cur.render) {
        cur.render(elt, data, cur);
      } else {
        elt.appendChild(document.createTextNode(cur.displayText || getText(cur)));
      }
      elt.hintId = i;
    }

    var pos = cm.cursorCoords(completion.options.alignWithWord ? data.from : null, 'local');
    var left = pos.left;
    var top = pos.bottom;
    var below = true;
    hints.style.left = left + 'px';
    hints.style.top = top + 'px';
    // If we're at the edge of the screen, then we want the menu to appear on the left of the
    // cursor.
    var winW = window.innerWidth || Math.max(document.body.offsetWidth,
      document.documentElement.offsetWidth);
    var winH = window.innerHeight || Math.max(document.body.offsetHeight,
      document.documentElement.offsetHeight);
    (completion.options.container || document.body).appendChild(hints);
    var box = hints.getBoundingClientRect();
    var overlapY = box.bottom - winH;
    if (overlapY > 0) {
      var height = box.bottom - box.top;
      var curTop = pos.top - (pos.bottom - box.top);
      if (curTop - height > 0) { // Fits above cursor
        hints.style.top = (top = pos.top - height) + 'px';
        below = false;
      } else if (height > winH) {
        hints.style.height = (winH - 5) + 'px';
        hints.style.top = (top = pos.bottom - box.top) + 'px';
        var cursor = cm.getCursor();
        if (data.from.ch != cursor.ch) {
          pos = cm.cursorCoords(cursor);
          hints.style.left = (left = pos.left) + 'px';
          box = hints.getBoundingClientRect();
        }
      }
    }
    var overlapX = box.right - winW;
    if (overlapX > 0) {
      if (box.right - box.left > winW) {
        hints.style.width = (winW - 5) + 'px';
        overlapX -= (box.right - box.left) - winW;
      }
      hints.style.left = (left = pos.left - overlapX) + 'px';
    }

    cm.addKeyMap(this.keyMap = buildKeyMap(completion, {
      moveFocus: function(n, avoidWrap) {
        widget.changeActive(widget.selectedHint + n, avoidWrap);
      },
      setFocus: function(n) {
        widget.changeActive(n);
      },
      menuSize: function() {
        return widget.screenAmount();
      },
      length: completions.length,
      close: function() {
        completion.close();
      },
      pick: function() {
        widget.pick();
      },
      data: data
    }));

    if (completion.options.closeOnUnfocus) {
      var closingOnBlur;
      cm.on('blur', this.onBlur = function() {
        closingOnBlur = setTimeout(function() {
          completion.close();
        }, 100);
      });
      cm.on('focus', this.onFocus = function() {
        clearTimeout(closingOnBlur);
      });
    }

    var startScroll = cm.getScrollInfo();
    cm.on('scroll', this.onScroll = function() {
      var curScroll = cm.getScrollInfo();
      var editor = cm.getWrapperElement().getBoundingClientRect();
      var newTop = top + startScroll.top - curScroll.top;
      var point = newTop -
        (window.pageYOffset || (document.documentElement || document.body).scrollTop);
      if (!below) {
        point += hints.offsetHeight;
      }
      if (point <= editor.top || point >= editor.bottom) {
        return completion.close();
      }
      hints.style.top = newTop + 'px';
      hints.style.left = (left + startScroll.left - curScroll.left) + 'px';
    });

    CodeMirror.on(hints, 'dblclick', function(e) {
      var t = getHintElement(hints.children[0], e.target || e.srcElement);
      if (t && t.hintId != null) {
        widget.changeActive(t.hintId);
        widget.pick();
      }
    });

    CodeMirror.on(hints, 'click', function(e) {
      var t = getHintElement(hints.children[0], e.target || e.srcElement);
      if (t && t.hintId != null) {
        widget.changeActive(t.hintId);
        if (completion.options.completeOnSingleClick) {
          widget.pick();
        }
      }
    });

    CodeMirror.on(hints, 'mousedown', function() {
      setTimeout(function() {
        cm.focus();
      }, 20);
    });

    CodeMirror.signal(data, 'select', completions[0], hints.children[0].firstChild);
    return true;
  }

  Widget.prototype = {
    close: function() {
      if (this.completion.widget != this) {
        return;
      }
      this.completion.widget = null;
      this.hints.parentNode.removeChild(this.hints);
      this.completion.cm.removeKeyMap(this.keyMap);

      var cm = this.completion.cm;
      if (this.completion.options.closeOnUnfocus) {
        cm.off('blur', this.onBlur);
        cm.off('focus', this.onFocus);
      }
      cm.off('scroll', this.onScroll);
    },

    disable: function() {
      this.completion.cm.removeKeyMap(this.keyMap);
      var widget = this;
      this.keyMap = {
        Enter: function() {
          widget.picked = true;
        }
      };
      this.completion.cm.addKeyMap(this.keyMap);
    },

    pick: function() {
      this.completion.pick(this.data, this.selectedHint);
    },

    changeActive: function(i, avoidWrap) {
      if (i >= this.data.list.length) {
        i = avoidWrap ? this.data.list.length - 1 : 0;
      } else if (i < 0) {
        i = avoidWrap ? 0 : this.data.list.length - 1;
      }
      if (this.selectedHint == i) {
        return;
      }
      var node = this.hints.children[0].children[this.selectedHint];
      node.className = node.classList.remove(ACTIVE_HINT_ELEMENT_CLASS);
      node = this.hints.children[0].children[this.selectedHint = i];
      node.classList.add(ACTIVE_HINT_ELEMENT_CLASS);
      if (node.offsetTop < this.hints.scrollTop) {
        this.hints.scrollTop = node.offsetTop - 3;
      } else if (node.offsetTop + node.offsetHeight > this.hints.scrollTop +
        this.hints.clientHeight) {
        this.hints.scrollTop = node.offsetTop + node.offsetHeight - this.hints.clientHeight + 3;
      }
      CodeMirror.signal(this.data, 'select', this.data.list[this.selectedHint], node);
    },

    screenAmount: function() {
      return Math.floor(this.hints.clientHeight /
        this.hints.children[0].children[0].offsetHeight) || 1;
    }
  };

  CodeMirror.registerHelper('hint', 'auto', function(cm, options) {
    var helpers = cm.getHelpers(cm.getCursor(), 'hint');
    var words;
    if (helpers.length) {
      for (var i = 0; i < helpers.length; i++) {
        var cur = helpers[i](cm, options);
        if (cur && cur.list.length) {
          return cur;
        }
      }
    } else if (words = cm.getHelper(cm.getCursor(), 'hintWords')) {
      if (words) {
        return CodeMirror.hint.fromList(cm, {
          words: words
        });
      }
    } else if (CodeMirror.hint.anyword) {
      return CodeMirror.hint.anyword(cm, options);
    }
  });

  CodeMirror.registerHelper('hint', 'fromList', function(cm, options) {
    var cur = cm.getCursor();
    var token = cm.getTokenAt(cur);
    var found = [];
    for (var i = 0; i < options.words.length; i++) {
      var word = options.words[i];
      if (word.slice(0, token.string.length) === token.string) {
        found.push(word);
      }
    }

    if (found.length) {
      return {
        list: found,
        from: CodeMirror.Pos(cur.line, token.start),
        to: CodeMirror.Pos(cur.line, token.end)
      };
    }
  });

  CodeMirror.commands.autocomplete = CodeMirror.showHint;

  var defaultOptions = {
    hint: CodeMirror.hint.auto,
    completeSingle: true,
    alignWithWord: true,
    closeCharacters: /[\s()\[\]{};:>,]/,
    closeOnUnfocus: true,
    completeOnSingleClick: false,
    container: null,
    customKeys: null,
    extraKeys: null
  };

  CodeMirror.defineOption('hintOptions', null);
});

(function(document, window) {
  'use strict';
  arc.app.analytics.init();

  let app = document.querySelector('#app');
  app.baseUrl = '/';
  app.pageTitle = '';
  /**
   * Because controllers do not have direct access to the toolbar it must keep relevant data in
   * the main object if it must to be accessible to the toolbar.
   * This is an array of requests related to the currently opened project.
   *
   * TODO:50 In future releases controllers should not keep their data in the toolbar. New design
   * should keep all releted to the controller data in the main workspace window.
   */
  app.projectEndpoints = [];
  /**
   * The same as above.
   */
  app.selectedRequest = null;
  app.addEventListener('dom-change', function() {
    console.log('Our app is ready to rock!');
  });

  // event called when the app is initialized and can remove loader.
  window.addEventListener('ArcInitialized', function() {
    document.querySelector('arc-loader-screen').close();
  });

  window.addEventListener('WebComponentsReady', function() {
    console.log('Components are ready');
    //event will be handled in elements/routing.html
    let event = new Event('initializeRouting');
    window.dispatchEvent(event);
  });

  app.scrollPageToTop = function() {
    app.$.headerPanelMain.scrollToTop(true);
  };

  app.closeDrawer = function() {
    app.$.paperDrawerPanel.closeDrawer();
  };

  // A handler called when data has been imported to the app.
  app._dataImportedHandler = function() {
    app.$.appMenu.refreshProjects();
  };
  /**
   * Open search bar and notify opener about changes.
   */
  app.openSearch = () => {
    var bar = document.querySelector('#search-bar');
    bar.setAttribute('show', true);
    bar.parentNode.setAttribute('mode', 'search');
    var input = document.querySelector('#mainSearchInput');
    var searchFn = function(e) {
      //inform controller about search action
      app._featureCalled('search', e);
      // Array.from(document.querySelectorAll('[search-query]')).forEach((ctrl) => {
      //   if (ctrl.onSearch) {
      //     ctrl.onSearch();
      //   }
      // });
    };
    var blurFn = function(e) {
      let input = document.querySelector('#mainSearchInput');
      input.removeEventListener('blur', blurFn);
      input.removeEventListener('search', searchFn);
      let bar = e.target.parentNode;
      bar.removeAttribute('show', true);
      bar.parentNode.removeAttribute('mode', 'search');
    };

    input.addEventListener('search', searchFn);
    input.addEventListener('blur', blurFn);
    input.focus();
  };

  document.body.addEventListener('page-title-changed', (e) => {
    app.pageTitle = e.detail.title;
  });

  document.body.addEventListener('restore-request', (e) => {
    app.set('request', e.detail.request);
    page('/request/current');
  });

  /**
   * Read more about requesting features in ArcHasToolbarBehavior behavior file.
   * Also change main.css in features section.
   */
  app.featuresMapping = new Map();
  document.body.addEventListener('request-toolbar-features', (e) => {
    app.featuresMapping.clear();
    var list = e.detail.features;
    var bar = document.querySelector('#mainToolbar');
    list.forEach((feature) => {
      bar.setAttribute(feature, true);
      app.featuresMapping.set(feature, e.target);
    });
  });
  document.body.addEventListener('release-toolbar-features', () => {
    var bar = document.querySelector('#mainToolbar');
    var keys = app.featuresMapping.keys();
    for (let feature of keys) {
      bar.removeAttribute(feature);
    }
    app.featuresMapping.clear();
    app.projectEndpoints = [];
  });
  app._featureCalled = (feature, event) => {
    if (!app.featuresMapping.has(feature)) {
      console.warn('Feature "%s" has been called without the mapping', feature);
      return;
    }
    var src = app.featuresMapping.get(feature);
    var name = feature[0].toUpperCase() + feature.substr(1);
    var fnName = 'on' + name;
    if (!(fnName in src)) {
      console.warn(`Function ${fnName} is undefined for ${src.nodeName}`);
    } else {
      src[fnName](event);
    }
  };
  app._onFeatureOpen = (e) => {
    app._featureCalled('open', e);
  };
  app._onFeatureSave = (e) => {
    app._featureCalled('save', e);
  };
  app._onFeatureExport = (e) => {
    app._featureCalled('export', e);
  };
  app._onFeatureClearAll = (e) => {
    app._featureCalled('clearAll', e);
  };
  app._onFeatureProjectEndpoints = (e) => {
    app._featureCalled('projectEndpoints', e.detail.item.dataset.id);
  };
  // called when any component want to change request link.
  document.body.addEventListener('action-link-change', (e) => {
    var url = e.detail.url;
    if (app.request.url && url.indexOf('/') === 0) {
      /* global URLParser */
      let p = new URLParser(app.request.url);
      url = p.protocol + '://' + p.authority + url;
      app.set('request.url', url);
    } else {
      app.set('request.url', url);
    }

  });
  // called when any component want to write to clipboard.
  document.body.addEventListener('clipboard-write', (e) => {
    var data = e.detail.data;
    arc.app.clipboard.write(data);
  });
  document.body.addEventListener('project-saved', () => {
    app.$.appMenu.refreshProjects();
  });

  app.onSave = () => {
    var ctrl = document.querySelector('arc-request-controller');
    ctrl.onSave();
  };

  app.onOpen = () => {
    page('/saved');
  };

  app._cancelEvent = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  };

})(document, window);
