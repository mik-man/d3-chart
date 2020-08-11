<?
  include "descriptionTable.php";
  include "dataTable.php";
  include "chart.php";
  $descriptionTable = array(
    "Степная", "141", "26х92", "плоская", "", "100.000", "736", 3, "2020.01.01", "0.000");
  $dataTable = array(
    array("2020.01.01", 736.10, 0.00, 0, "ФИО"),
    array("2020.01.03", 737.00, 0.12, 150, "ФИО"),
    array("2020.01.05", 738.50, 0.33, 310, "ФИО"),
    // array("2020.01.07", 739.56, 0.47, 500, "ФИО")
  );
?>
<html>

<head>
  <title>SK-Chart-page</title>
  <link rel="stylesheet" type="text/css" href="style.css">
</head>

<body>
  <div class="row">
    <div id="divTableTop">
      <? renderDescriptionTable($descriptionTable); ?>
    </div>
    <div id="divTableData">
      <? renderDataTable($dataTable); ?>
    </div>
  </div>
  <div class="row custom-wrap">
    <div id="chart-section">
      <h3>Прогноз износа цепи</h3>
      <div id="chart-container">
      <? renderChart($descriptionTable, $dataTable); ?></div>
    </div>
    <? include "chartExplanation.php" ?>
  </div>
</body>

</html>
