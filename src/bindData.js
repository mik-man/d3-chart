function setTableData() {
	document.getElementById("z1x").value = store.data[0].x;
	document.getElementById("z2x").value = store.data[1].x;
	document.getElementById("z1y").value = store.data[0].y;
	document.getElementById("z2y").value = store.data[1].y;
	document.getElementById("cx").value = store.cross.x;
	document.getElementById("cy").value = store.cross.y;
}

function getTableData() {
	store.data[0].x = +document.getElementById("z1x").value;
	store.data[1].x = +document.getElementById("z2x").value;
	store.data[0].y = +document.getElementById("z1y").value;
	let z2y = +document.getElementById("z2y").value;
	store.data[1].y = z2yValue(z2y);
	store.cross.x = +document.getElementById("cx").value;
	store.cross.y = +document.getElementById("cy").value;
}

function z2yValue(z2y) {
	let z1y = store.data[0].y;
	if (z2y < z1y) {
		alert('z2.y should be larger than z1.y');
		document.getElementById("z2y").value = z1y;
		return z1y}
	let maxZ2y = z1y * 1.03;
	if (z2y > maxZ2y) {
		alert('z2.y should be less than z1.y + 3%');
		document.getElementById("z2y").value = maxZ2y;
		return maxZ2y; }
	return z2y;
}
