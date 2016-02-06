var ratings = document.querySelector('#ratings');
    ratings.addEventListener('value-change', function() {
      document.querySelector('#ratingsLabel').textContent = ratings.value;
    });

    var grade = document.querySelector('#grade');
    grade.addEventListener('value-change', function() {
      var label = (grade.value < grade.secondaryProgress) ? "Fail" : "Pass" ;
      document.querySelector('#gradeLabel').textContent = grade.value + " (" + label + ")";
    });