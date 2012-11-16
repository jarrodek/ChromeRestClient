CodeMirror.defineMode("headers", function() {
    
    function parseHeaderInError(stream, state){
        var ch = stream.next();
        if(ch == ":"){
            state.parseKey = false;
            return "header-value";
        }
        var code = ch.charCodeAt(0);
        if(code < 33 || code > 126 || code == 40 || code == 41){
            return "header-key-error";
        }
        return "header-key";
    }
    
    return {
        startState: function() {
            return {
                inerror: false,
                parseKey: false
            };
        },
        token: function(stream, state) {
            if (stream.sol()){
                if(state.parseKey){
                    return parseHeaderInError(stream, state);
                }
                
                state.inerror = false;
                if(stream.skipTo(":")){
                    //check if there is a whitespace
                    var value = stream.current();
                    if(!/^([a-zA-Z0-9!@#\$%^\&\*_\+:\-])+$/.test(value)){
                        //error in header name.
                        stream.backUp(value.length);
                        state.parseKey = true;
                        return null;
                    }
                    state.parseKey = false;
                    stream.next();
                    return "header-key";
                } else {
                    //invalid notation
                    stream.skipToEnd();
                    return "header-error";
                }
            }
            if(state.parseKey){
                return parseHeaderInError(stream, state);
            }
            if(!stream.skipTo(":")){
                stream.skipToEnd();
                return "header-value";
            } else {
                if(!state.inerror){
                    state.inerror = true;
                    return "header-value";
                }
            }
            stream.skipToEnd();
            return "header-error";
        },
        indent: function(state, textAfter) {
            return 0;
        }
    };
});
CodeMirror.defineMIME("text/x-headers", "headers");