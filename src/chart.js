var store = {
	data: [{ x: 0, y: 2 }, { x: 1, y: 2.01 }],
	cross: { x: 0, y: 0 },
	limit: [],
	vline: [],
};

function initChart() {
	setTableData();
}

function refreshChart() {
	getTableData();
	let { data, cross } = store;
	let limitPercent = document.getElementById('input_limit').value;
	cross.y = data[0].y + (data[0].y * limitPercent / 100);
	cross.x = calcCrossX(cross.y, data);
	store.data[2] = cross;
	let littleMore = { x: 0, y: 0 };
	littleMore.x = data[0].x + ((cross.x - data[0].x) * 1.1);
	littleMore.y = data[0].y + ((cross.y - data[0].y) * 1.1);
	store.data[3] = littleMore;
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

	let x = d3.scaleLinear().rangeRound([0, width]);
	let y = d3.scaleLinear().rangeRound([height, 0]);
	x.domain([data[0].x, limit[1].x]);
	y.domain([data[0].y, vline[1].y]);

	g.append("g")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x));

	g.append("g").call(d3.axisLeft(y));

	var line = d3.line()
		.x(function (d) { return x(d.x) })
		.y(function (d) { return y(d.y) });

	// line
	g.append("path")
		.datum(data)
		.attr("fill", "none")
		.attr("stroke", "black")
		.style("stroke-dasharray", ("3, 3"))
		.attr("d", line);

	data.pop();
	svg.selectAll("circles")
		.append("circles")
		.data(data)
		.enter()
		.append("circle")
		.attr("stroke", "none")
		.attr("cx", function (d) { return x(d.x) })
		.attr("cy", function (d) { return y(d.y) })
		.attr("r", 3);
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
}

function calcCrossX(y, data) {
	const dx = data[1].x - data[0].x;
	let dy = data[1].y - data[0].y;
	if (dy === 0) { dy = 1; }
	const dy1 = y - data[0].y;
	const dx1 = dy1 * (dx / dy);
	const x = data[0].x + dx1;
	return (Math.round(x * 1000) / 1000);
}
