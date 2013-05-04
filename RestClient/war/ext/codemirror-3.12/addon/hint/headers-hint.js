(function() {
    function headersHint(editor, headersStructure, getToken) {
        var cur = editor.getCursor();
        var token = getToken(editor, cur);
        var tokenString = (!!token.string) ? "" : token.string.trim();
        if(tokenString.trim() === ""){
            
        }
        var keywords = [];
        var i = 0;

        var from = {line: cur.line, ch: cur.ch + 2};
        var to = {line: cur.line, ch: cur.ch};
        var flagClean = true;

        
        //if it is start of the line show every possibility
        var last = editor.getRange({line: cur.line, ch: cur.ch - 1}, cur);
        var last2 = editor.getRange({line: cur.line, ch: cur.ch - 2}, cur);

        if ((last === ":" || last2 === ": ") || (last === "," || last2 === ", ")) {
            var key = editor.getRange({line: cur.line, ch: 0}, cur);
            if (!key)
                key = "";
            key = key.substr(0, key.indexOf(":")).trim().toLowerCase();
            keywords = getHeaderValuesFor(headersStructure, key);
        } else if (editor.getRange({line: cur.line, ch: 0}, cur).trim() !== "") {
            var prev = editor.getRange({line: cur.line, ch: 0}, cur).trim();
            if (prev.indexOf(":") > -1) {
                //looking for value
                tokenString = prev.substr(prev.indexOf(":") + 1).trim().toLowerCase();
                keywords = getHeaderValuesFor(headersStructure, key);
            } else {
                //looking for header name starting with...
                tokenString = prev.toLowerCase();
                keywords = getKeywords(headersStructure);
            }
            from.ch = token.start;
        } else {
            for (i = 0; i < headersStructure.length; i++) {
                keywords = getKeywords(headersStructure);
            }
        }

        if (flagClean === true && tokenString.trim() === "") {
            flagClean = false;
        }

        if (flagClean) {
            keywords = cleanResults(tokenString, keywords);
        }

        return {list: keywords, from: from, to: to};
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
                    cm.replaceRange(completion.text + ": ", data.from, data.to);
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

    var headersStructure = [
        {key: 'Accept', values: ['text/plain', 'text/html', 'text/javascript', 'application/json']},
        {key: 'Accept-Charset', values: ['utf-8', 'utf-16', 'iso-8859-1']},
        {key: 'Accept-Datetime', values: []},
        {key: 'Accept-Encoding', values: ['compress','gzip','deflate','identity']},
        {key: 'Accept-Language', values: ['en-US']},
        {key: 'Authorization', values: ['Basic ']},
        {key: 'Cache-Control', values: ['no-cache']},
        {key: 'Connection', values: ['close']},
        {key: 'Content-MD5', values: []},
        {key: 'Content-Length', values: []},
        {key: 'Content-Type', values: ['application/atom+xml','application/json','application/xml','application/x-www-form-urlencoded','multipart/form-data']},   
        {key: 'Cookie', values: []},
        {key: 'Date', values: []},
        {key: 'DNT', values: [0,1]},
        {key: 'Expect', values: ['100-continue']},
        {key: 'From', values: []},
        {key: 'Front-End-Https', values: ['on','off']},
        {key: 'Host', values: []},
        {key: 'If-Match', values: []},
        {key: 'If-Modified-Since', values: []},
        {key: 'If-None-Match', values: []},
        {key: 'If-Range', values: []},
        {key: 'If-Unmodified-Since', values: []},
        {key: 'Max-Forwards', values: []},
        {key: 'Origin', values: []},
        {key: 'Pragma', values: ['no-cache']},
        {key: 'Proxy-Authorization', values: []},
        {key: 'Proxy-Connection', values: ['keep-alive']},
        {key: 'Range', values: []},
        {key: 'Referer', values: []},
        {key: 'TE', values: []},
        {key: 'Upgrade', values: []},
        {key: 'User-Agent', values: []},
        {key: 'Via', values: []},
        {key: 'Warning', values: []},
        {key: 'X-ATT-DeviceId', values: []},
        {key: 'X-Forwarded-For', values: []},
        {key: 'X-Forwarded-Proto', values: ['http','https']},
        {key: 'X-Requested-With', values: ['XMLHttpRequest']},
        {key: 'X-Wap-Profile', values: []}
    ];



    CodeMirror.headersHint = function(editor, showHints, options) {
        if (String.prototype.trim === undefined) {
            String.prototype.trim = function() {
                return this.replace(/^\s+|\s+$/g, '');
            };
        }
        if (!Array.prototype.forEach) {
            Array.prototype.forEach = function(fn, scope) {
                for (var i = 0, len = this.length; i < len; ++i) {
                    fn.call(scope, this[i], i, this);
                }
            };
        }

        if (typeof showHints === "function") {
            window.setTimeout(function() {
                var hints = headersHint(editor, headersStructure, function(e, cur) {
                    return e.getTokenAt(cur);
                });
                showHints(hints);
            }, 1);
            return;
        }

        return headersHint(editor, headersStructure, function(e, cur) {
            return e.getTokenAt(cur);
        });
    };
})();
