var store = {
	pointsCount: 3,
	data: [{ x: 95, y: 736 }, { x: 300, y: 739 }, { x: 550, y: 741}],
	cross: { x: 0, y: 0 },
	limit: [],
	vline: [],
	constant: 1,
	limitPercent: 3,
};

function initChart() {
	setTableData();
}

function refreshChart() {
	getTableData();
	let { data, cross, limitPercent } = store;
	cross.y = data[0].y * (100 + limitPercent) / 100;
	cross.x = calcCrossX(cross.y, data);
	store.data.push(cross);
	let littleMore = calcLittleMore();
	store.data.push(littleMore);
	store.limit = [{ x: data[0].x, y: cross.y }, { x: littleMore.x, y: cross.y }];
	store.vline = [{ x: cross.x, y: data[0].y }, { x: cross.x, y: littleMore.y }];
	setTableData();
	d3.select("svg").selectAll("*").remove();
	drawChart();
}

function drawChart() {
	let { data, limit, vline } = store;
	var svg = d3.select("svg"),
		margin = { top: 20, right: 20, bottom: 30, left: 50 },
		width = +svg.attr("width") - margin.left - margin.right,
		height = +svg.attr("height") - margin.top - margin.bottom,
		g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	let x = d3.scaleLinear().rangeRound([0, width - 50]);
	let y = d3.scaleLinear().rangeRound([height, 0]);
	x.domain([data[0].x, limit[1].x]);
	y.domain([data[0].y, vline[1].y]);

	g.append("g")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x));

	g.append("g").call(d3.axisLeft(y));

	var line = d3.line()
		.x(function (d) { return x(d.x) })
		.y(function (d) { return y(d.y) })
		.curve(d3.curveMonotoneX);

	// it works! :)
	g.append("text").attr("x", 160).attr("y", 20)
		.text(`limit (${store.limit[0].y})`)
		.attr("font-size", ".8rem");

	// limit
	g.append("path")
		.datum(limit)
		.attr("fill", "none")
		.attr("stroke", "black")
		.attr("d", line);

	// vline
	g.append("path")
		.datum(vline)
		.attr("fill", "none")
		.attr("stroke", "black")
		.attr("d", line);

	// chart line
	g.append("path")
		.datum(data)
		.attr("fill", "none")
		.attr("stroke", "black")
		.style("stroke-dasharray", ("3, 3"))
		.attr("d", line);

	data.length = store.pointsCount + 1;

	// points
	g.selectAll()
		.data(data)
		.enter()
		.append("circle")
		.attr("stroke", "none")
		.attr("cx", function (d) { return x(d.x) })
		.attr("cy", function (d) { return y(d.y) })
		.attr("r", 3);
		//.on("click", mouseClick)
		//.on("mouseout", removeHint);
	// points sings
	g.selectAll()
		.data(data)
		.enter()
		.append("text")
		.attr("x", function (d, i) { return x(d.x) + shiftX(i) })
		.attr("y", function (d, i) { return y(d.y) + shiftY(d, i) })
		.text(getSign) // points hints
		.attr("font-size", ".8rem");

	function removeHint() {
		d3.select("#hint").remove();
	}

	function mouseClick(d, i) {  // Add interactivity
		d3.select("#hint").remove();
		// Specify where to put label of text
		g.append("text")
			.attr("id", "hint")  // Create an id for text so we can select it later for removing on mouseout
			.attr("x", function () { return x(d.x) + shiftX(i); })
			.attr("y", function () { return y(d.y) + shiftY(d, i); })
			.text(() => getSign(d, i));
	}
}

function getSign(point, i) {
	switch (i) {
		case store.pointsCount:
			return (`X(${point.x},${point.y})`);
		default:
			return (`Z${i + 1}(${point.x}, ${point.y})`);
	}
}

function shiftX(i) {
	return 7;
}

function shiftY(point, i) {
	switch (i) {
		case 0:
			return -10;
		case store.pointsCount:
			return 18;
	}
	if (point.y !== store.data[0].y) {
		return 5;
	}
	return -10;
}