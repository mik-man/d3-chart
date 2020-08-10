<?
function renderChart($descriptionTable, $values) {
  echo '<script src="https://d3js.org/d3.v5.min.js"></script>';
  echo '<script src="chart.js"></script>';
  echo '<script src="calcChart.js"></script>';
  echo '<script src="bindData.js"></script>';

  $rootEl = 'chart';
  echo '<svg id="' . $rootEl . '" width="100%" height="100%" preserveAspectRatio="none"></svg>';
  //  
  $pointsCount = count($values);
  $points = '[';
  for ($i = 0; $i < $pointsCount; $i++) {
    $comma = $i < $pointsCount - 1 ? ', ' : ']';
    $points = $points . 
      '{ x: ' . strval($values[$i][3]) . ', y: ' . strval($values[$i][1]) . ' }' . $comma;
  }

  $dates = '[';
  for ($i = 0; $i < $pointsCount; $i++) {
    $comma = $i < $pointsCount - 1 ? ', ' : ']';
    $dates = $dates . '\'' . strval($values[$i][0]) . '\'' . $comma;
  }

  echo '<script>';
  echo 'bootstrapChart(';
  echo '\'' . $rootEl . '\', ' . $points . ', ' . $dates . ', ';
  echo strval($descriptionTable[7]) . ', 1.2,);';
  echo '</script>'; 
}
?>