Polymer({
  is: 'headers-editor-status',
  behaviors: [ArcBehaviors.HeadersParserBehavior],

  properties: {
    headersSize: Number,
    valid: Boolean,
    errorMessage: String
  }
});
