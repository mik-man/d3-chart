function setTableData() {
	document.getElementById("z1x").value = store.data[0].x;
	document.getElementById("z1y").value = store.data[0].y;
	document.getElementById("z2x").value = store.data[1].x;
	document.getElementById("z2y").value = store.data[1].y;
	if (store.pointsCount > 2) {
		document.getElementById("z3x").value = store.data[2].x;
		document.getElementById("z3y").value = store.data[2].y;
	}
	document.getElementById('limit').value = store.limitPercent;
	document.getElementById("constant").value = store.constant;
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
	store.limitPercent = +document.getElementById('limit').value;
	store.data[0].x = +document.getElementById("z1x").value;
	store.data[0].y = +document.getElementById("z1y").value;
	store.data[1].x = +document.getElementById("z2x").value;
	store.data[1].y = +document.getElementById("z2y").value;
	if (store.pointsCount > 2) {
		store.data[2].x = +document.getElementById("z3x").value;
		store.data[2].y = +document.getElementById("z3y").value;
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

function checkData() {
	const { data, pointsCount } = store;
	let check = true;
	let limitPercent = store.limitPercent;
	if (limitPercent < 3 || limitPercent > 100) {
		alert(`Limit should be from 3% to 100%`);
		limitPercent = 3;
		store.limitPercent = limitPercent;
		check = false;
	}
	const limit = data[0].y * (100 + limitPercent) / 100;
	for (let i = 1; i < pointsCount; i++) {
		if (data[i].x <= data[i - 1].x) {
			alert(`z${i + 1}.x should be more than z${i}.x!`);
			data[i].x = data[i - 1].x + 1;
			check = false;
		}
		if (data[i].y <= data[i - 1].y) {
			alert(`z${i + 1}.y should be more than z${i}.y!`);
			data[i].y = data[i - 1].y + 1;
			check = false;
		}
		if (data[i].y >= limit) {
			alert(`z${i + 1}.y should be less than z1.y + ${limitPercent}% (${limit})`);
			data[i].y = Math.round(limit * 0.99 * 10) / 10;
			check = false;
		}
	}
	return check;
}
