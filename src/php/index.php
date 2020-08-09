<html>

<head>
  <title>SK-Chart-page</title>
  <link rel="stylesheet" type="text/css" href="style.css">
</head>

<body>
  <div class="divParent">
    <div id="divTableTop">
      <? include "tableTop.php" ?>
    </div>
    <div id="divTableData">
    <? include "tableData.php" ?>
    </div>
  </div>
  <br />
  <div class="divParent" id="divParent2">
    <div id="divChart">Chart here<br/>
      <svg id="chart" width="600" height="400"></svg>
    </div>
    <? include "legend.php" ?>
  </div>
</body>

</html>