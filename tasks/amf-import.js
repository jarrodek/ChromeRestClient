const amf = require('../node_modules/amf-client-js/amf.js');
amf.plugins.document.WebApi.register();
amf.plugins.document.Vocabularies.register();
amf.plugins.features.AMFValidation.register();
window.Amf = amf;
