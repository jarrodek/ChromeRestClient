document.addEventListener('WebComponentsReady', function() {
        var template = document.getElementById('page-template');

        var batteryDevice = document.getElementById('battery-device');
        var batteryLevel = batteryDevice.querySelector('[characteristic=battery_level]');

        var heartRateDevice = document.getElementById('heart-rate-device');
        var bodySensorLocation = heartRateDevice.querySelector('[characteristic=body_sensor_location]');
        var heartRateControlPoint = heartRateDevice.querySelector('[characteristic=heart_rate_control_point]');

        var getBatteryLevelButton = document.getElementById('get-battery-level');
        var getBodySensorLocationButton = document.getElementById('get-body-sensor-location');
        var resetEnergyExpendedButton = document.getElementById('reset-energy-expended');
        var progressBar = document.querySelector('paper-progress');

        var buttons = document.querySelectorAll('paper-button');
        for (var i = 0; i < buttons.length; i++) {
          buttons[i].addEventListener('click', buttonClick);
        }

        getBatteryLevelButton.addEventListener('click', function() {
          batteryDevice.request().then(function(device) {
            return batteryLevel.read().then(function(value) {
              var data = new DataView(value);
              template.text = device.name + ' Battery Level is ' + data.getUint8(0) + '%';
              progressBar.indeterminate = false;
            })
          })
          .catch(onError);
        });

        getBodySensorLocationButton.addEventListener('click', function() {
          heartRateDevice.request().then(function(device) {
            return bodySensorLocation.read().then(function(value) {
              var data = new DataView(value);
              var loc = ['other', 'chest', 'wrist', 'finger', 'hand', 'ear lobe', 'foot'];
              template.text = device.name + ' Body sensor is placed on the ' + loc[data.getUint8(0)];
              progressBar.indeterminate = false;
            })
          })
          .catch(onError);
        });

        resetEnergyExpendedButton.addEventListener('click', function() {
          heartRateDevice.request().then(function(device) {
            // Writing 1 is the signal to reset energy expended.
            var resetEnergyExpended = new Uint8Array([1]);
            return heartRateControlPoint.write(resetEnergyExpended).then(function() {
              template.text = device.name + ' Energy expended has been reset';
              progressBar.indeterminate = false;
            })
          })
          .catch(onError);
        });

        function buttonClick() {
          progressBar.indeterminate = true;
          template.text = '';
        }

        function onError(error) {
          template.text = 'Argh! ' + error;
          progressBar.indeterminate = false;
        }
      });