function setTableData() {
	document.getElementById("z1x").value = store.data[0].x;
	document.getElementById("z1y").value = store.data[0].y;
	document.getElementById("z2x").value = store.data[1].x;
	document.getElementById("z2y").value = store.data[1].y;
	if (store.pointsCount > 2) {
		document.getElementById("z3x").value = store.data[2].x;
		document.getElementById("z3y").value = store.data[2].y;
	}
	document.getElementById('input_limit').value = store.limitPercent;
	document.getElementById("constant").value = store.constant;
	document.getElementById("estimated_crossing").innerHTML =
		`Estimated crossing: (x: ${store.cross.x}, y: ${store.cross.y})`;
	displayPoints();
}

function displayPoints() {
	let displayZ3 = store.pointsCount > 2 ? "display: inline;" : "display: none;";
	document.getElementById("z3title").setAttribute("style", displayZ3);
	document.getElementById("z3x").setAttribute("style", displayZ3);
	document.getElementById("z3y").setAttribute("style", displayZ3);
}

function getTableData() {
	store.data.length = store.pointsCount;
	store.limitPercent = getLimitPercentValue();
	store.data[0].x = +document.getElementById("z1x").value;
	store.data[0].y = +document.getElementById("z1y").value;
	store.data[1].x = +document.getElementById("z2x").value;
	store.data[1].y = z2yValue(+document.getElementById("z2y").value);
	if (store.pointsCount > 2) {
		store.data[2].x = +document.getElementById("z3x").value;
		store.data[2].y = z3yValue(+document.getElementById("z3y").value);
	}
	store.constant = +document.getElementById("constant").value;
	if (store.constant <= 0) { store.constant = 1; }
}

function incPointsCount() {
	if (store.pointsCount > 2) { return; }
	store.pointsCount++;
	store.data.push({ x: 2, y: 2.03 });
	setTableData();
	displayPoints();
}

function decPointsCount() {
	if (store.pointsCount < 3) { return; }
	store.pointsCount--;
	store.data.pop();
	displayPoints();
}

function z2yValue(z2y) {
	let z1y = store.data[0].y;
	if (z2y <= z1y) {
		alert('z2.y should be larger than z1.y');
		document.getElementById("z2y").value = z1y;
		return z1y
	}
	let maxZ2y = z1y * (100 + store.limitPercent) / 100;
	if (z2y >= maxZ2y) {
		alert(`z2.y should be less than z1.y + ${store.limitPercent}%`);
		document.getElementById("z2y").value = maxZ2y * 0.99;
		return maxZ2y * 0.99;
	}
	return z2y;
}

function z3yValue(z3y) {
	let z2y = store.data[1].y;
	if (z3y <= z2y) {
		alert('z3.y should be larger than z3.y');
		newZ3y = z2y * 1.01;
		document.getElementById("z3y").value = newZ3y;
		return newZ3y;
	}
	let maxZ3y = store.data[0].y * (100 + store.limitPercent) / 100;
	if (z3y >= maxZ3y) {
		alert(`z3.y should be less than z1.y + ${store.limitPercent}%`);
		document.getElementById("z3y").value = maxZ3y * 0.99;
		return maxZ3y * 0.99;
	}
	return z3y;
}

function getLimitPercentValue() {
	let limPer = +document.getElementById('input_limit').value;
	if (limPer >= 3 && limPer <= 100) {
		return limPer;
	}
	alert(`Limit should be from 3 to 100%`);
	document.getElementById("input_limit").value = 3;
	return 3;
}

function checkData() {
	const { data, pointsCount } = store;
	for (let i = 1; i < pointsCount; i++) {
		if (data[i].y <= data[i-1].y) {
			alert(`Z${i+1}.y should be more than Z${i}.y!`);
			data[i].y = data[i-1].y + 1;
		}
	}
}
