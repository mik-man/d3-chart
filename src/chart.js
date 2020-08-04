var store = {
	constant: 1.2,
	limitPercent: 3,
	pointsCount: 3,
	data: [{ x: 95, y: 736 }, { x: 300, y: 739 }, { x: 550, y: 743 }],
	dates: ['2020.08.01', '2020.08.02', '2020.08.03'],
	angles: [45],
	cross: { x: 0, y: 0 },
	crossAngle: 45,
	limit: [],
	vline: [],
	pointLines: [] // 2 dimentions array
};

function initChart() {
	setTableData();
}

function refreshChart() {
	getTableData();
	checkData();
	calcData();
	setTableData();
	d3.select("svg").selectAll("*").remove();
	drawChart();
}

function drawChart() {
	let { data, limit, vline, pointLines } = store;
	var svg = d3.select("svg"),
		margin = { top: 20, right: 20, bottom: 30, left: 50 },
		width = +svg.attr("width") - margin.left - margin.right,
		height = +svg.attr("height") - margin.top - margin.bottom,
		g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	let xScale = d3.scaleLinear().rangeRound([0, width - 50]);
	let yScale = d3.scaleLinear().rangeRound([height, 0]);
	xScale.domain([limit[0].x, limit[1].x]);
	yScale.domain([vline[0].y, vline[1].y]);

	g.append("g")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(xScale));

	g.append("g").call(d3.axisLeft(yScale));

	let line = d3.line()
		.x(function (d) { return xScale(d.x) })
		.y(function (d) { return yScale(d.y) });

	let curveLine = d3.line()
		.x(function (d) { return xScale(d.x) })
		.y(function (d) { return yScale(d.y) })
		.curve(d3.curveMonotoneX);

	// it works! :)
	g.append("text").attr("x", 160).attr("y", 20)
		.text(`limit = ${store.limit[0].y} (${store.limitPercent}%)`)
		.attr("font-size", ".8rem");

	console.log(store);
	// limit
	g.append("path")
		.datum(limit)
		.attr("fill", "none")
		.attr("stroke", "black")
		.attr("stroke-width", .6)
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
		.attr("d", curveLine);

	data.length = store.pointsCount + 1;

	// points
	g.selectAll()
		.data(data)
		.enter()
		.append("circle")
		.attr("stroke", "none")
		.attr("cx", function (d) { return xScale(d.x) })
		.attr("cy", function (d) { return yScale(d.y) })
		.attr("r", 3);
	//.on("click", mouseClick)
	//.on("mouseout", removeHint);

	// points sings
	g.selectAll()
		.data(data)
		.enter()
		.append("text")
		.attr("x", function (d, i) { return xScale(d.x) + shiftX(i) })
		.attr("y", function (d, i) { return yScale(d.y) + shiftY(d, i) })
		.text(getSign) // points hints
		.attr("font-size", ".8rem");

	// points coordinates lines
	for (let pli = 0; pli < store.pointsCount; pli++) {
		drawPointLine(g, pli, line);
		drawPointLineSigns(g, pli, xScale, yScale);
	}

	function removeHint() {
		d3.select("#hint").remove();
	}

	function mouseClick(d, i) {  // Add interactivity
		d3.select("#hint").remove();
		// Specify where to put label of text
		g.append("text")
			.attr("id", "hint")  // Create an id for text so we can select it later for removing on mouseout
			.attr("x", function () { return xScale(d.x) + shiftX(i); })
			.attr("y", function () { return yScale(d.y) + shiftY(d, i); })
			.text(() => getSign(d, i));
	}
}

function drawPointLine(g, pli, line) {
	const { pointLines } = store;
	g.append("path")
		.datum(pointLines[pli])
		.attr("fill", "none")
		.attr("stroke", "blue")
		.attr("d", line)
		.attr("stroke-width", .4);
}

function drawPointLineSigns(g, pli, xScale, yScale) {
	const { pointLines } = store;
	g.selectAll()
		.data(pointLines[pli])
		.enter()
		.append("text")
		.attr("fill", "blue")
		.attr("font-size", ".8rem")
		.attr("x", function (d, i) { return xScale(d.x) + 5 })
		.attr("y", function (d, i) { return yScale(d.y) - 5 })
		.text(getPointLineSign); // points hints

}

function getPointLineSign(point, i) {
	switch (i) {
		case 0 : return `${point.y}`;
		case 1 : return '';
		case 2 : return `${point.x}`;
	}
}

function getSign(point, i) {
	const { dates } = store;
	switch (i) {
		case store.pointsCount:
			return (`X = ${point.x}`);
		default:
			return (`Z${i + 1}(${dates[i]})`);
	}
}

function shiftX(i) {
	return 7;
}

function shiftY(p, i) {
	if (i === store.pointsCount) return 18;
	return 6;
}