<?
function renderDescriptionTable($values) {
  $header = array(
    "Шахта", "Лава", "Калибр цепи", "Тип цепи", "Класс прочности", "Длина в поставке, м",
    "Номинальная длина отрезка, мм", "Граничное значение, %", "Дата ввода лавы", "Добыча, тыс.т");

  $limitValueRowIndex = 7;
  $limitValue = strval($values[$limitValueRowIndex]) . '% ('
    . strval($values[$limitValueRowIndex - 1] * (100 + $values[$limitValueRowIndex]) / 100) . ')';

  echo '<table id="description-table">';
  echo '<col style="width: 13rem">';
  echo '<col style="width: 5rem">';
  for ($i = 0; $i < 10; $i++) {
    echo '<tr>';
    echo '<td>' . $header[$i] . '</td>';
    $value = $i !== $limitValueRowIndex ? $values[$i] : $limitValue;
    echo '<td>' . $value . '</td>';
    echo '</tr>';
  }
  echo '</table>';
}
?>
