//Edited HTTP mode to make possible edit headers
CodeMirror.defineMode("http", function() {
  function failFirstLine(stream, state) {
    stream.skipToEnd();
    state.cur = header;
    return "error";
  }

  function header(stream) {
    if (stream.sol() && !stream.eat(/[ \t]/)) {
      if (stream.match(/^.*?:/)) {
        return "atom";
      } else {
        stream.skipToEnd();
        return "error";
      }
    } else {
      stream.skipToEnd();
      return "string";
    }
  }
  
  return {
    token: function(stream, state) {
      var cur = state.cur;
      if (cur != header && stream.eatSpace()) return null;
      return cur(stream, state);
    },

    startState: function() {
      return {cur: header};
    }
  };
});

CodeMirror.defineMIME("message/http", "http");