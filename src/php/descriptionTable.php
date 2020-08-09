<?
function renderDescriptionTable($values) {
  $header = array(
    "Шахта", "Лава", "Калибр цепи", "Тип цепи", "Класс прочности", "Длина в поставке, м",
    "Номинальная длина отрезка, мм", "Граничное значение, %", "Дата ввода лавы", "Добыча, тыс.т");

  echo '<table id="description-table">';
  echo '<col style="width: 13rem">';
  echo '<col style="width: 5rem">';
  for ($i = 0; $i < 10; $i++) {
    echo '<tr>';
    echo '<td>'.$header[$i].'</td>';
    echo '<td>'.$values[$i].'</td>';
    echo '</tr>';
  }
  echo '</table>';
}
?>