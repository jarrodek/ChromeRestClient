(function(self) {
  function workspaceRead(e) {
    console.log(e.detail);
    debugger;
  }
  self.addEventListener('workspace-state-read', workspaceRead);
})(window);
