self.onmessage = function(e) {
    var data = e.data;
    var parser = new JSONViewer(data);
    if(parser.latestError!=null){
        self.postMessage(parser.latestError);
        return;
    }
    
    
    var parsedData = '<div class="prettyPrint">';
    parsedData += this.parse(jsonValue); //, 1
    parsedData += "</div>";
    result.setHTML(parsedData);
    jsonPanel.add(this);
    jsonValue = null;
    addControls();
};


function JSONViewer(data){
    this.jsonValue = null;
    this.latestError = null;
    if(typeof data == "string"){
        try {
            this.jsonValue = JSON.parse(data);
        } catch (e) {
            this.latestError = e.message;
        }
    } else {
        this.jsonValue = data;
    }
}
JSONViewer.prototype = {
    
}