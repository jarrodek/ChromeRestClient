var progress = document.querySelector('paper-progress');
    var button = document.querySelector('paper-button');

    var repeat, maxRepeat = 5, animating = false;

    function nextProgress() {
      animating = true;
      if (progress.value < progress.max) {
        progress.value += (progress.step || 1);
      } else {
        if (++repeat >= maxRepeat) {
          animating = false;
          button.disabled = false;
          return;
        }
        progress.value = progress.min;
      }

      requestAnimationFrame(nextProgress);
    }

    function startProgress() {
      repeat = 0;
      progress.value = progress.min;
      button.disabled = true;
      if (!animating) {
        nextProgress();
      }
    }

    window.addEventListener('WebComponentsReady', function() {
      startProgress();
    });