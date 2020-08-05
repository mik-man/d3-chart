var store = {
	constant: 1.2,
	limitPercent: 3,
	pointsCount: 3,
	data: [{ x: 95, y: 736 }, { x: 300, y: 738 }, { x: 550, y: 743 }],
	dates: ['2020.08.01', '2020.08.02', '2020.08.03'],
	angles: [45],
	cross: { x: 0, y: 0 },
	crossAngle: 45,
	limit: [],
	vline: [],
	pointLines: [] // 2 dimentions array
};

// example
function callRenderChart() {
	renderChart(
		'chart',
		[{ x: 95, y: 736 }, { x: 300, y: 738 }, { x: 550, y: 743 }],
		['2020.07.01', '2020.07.02', '2020.07.03'],
		5,
		1.3,
	);
}

function renderChart(rootEl, points, dates, limit, angleMultiplier) {
	store.data = points;
	store.dates = dates;
	store.limitPercent = limit;
	store.constant = angleMultiplier;
	store.pointsCount = points.length;
	checkData();
	calcData();
	drawChart(`#${rootEl}`);
}

function initChart() {
	setTableData();
}

function refreshChart() {
	getTableData();
	if (!checkData()) { setTableData(); }
	calcData();
	drawChart("#chart");
}

function drawChart(svgId) {
	let { data, limit, vline, pointLines } = store;
	d3.select(svgId).selectAll("*").remove();
	var svg = d3.select(svgId),
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
		case 0: return `${point.y}`;
		case 1: return '';
		case 2: return `${point.x}`;
	}
}

function getSign(point, i) {
	const { dates } = store;
	switch (i) {
		case store.pointsCount:
			return (`X = ${Math.round(point.x * 100) / 100}`);
		default:
			return (`Z${i + 1} ${dates[i]}`);
	}
}

function shiftX(i) {
	return 7;
}

function shiftY(p, i) {
	if (i === store.pointsCount) return 18;
	return 6;
}