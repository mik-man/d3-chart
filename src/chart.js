var store = {
	pointsCount: 2,
	data: [{ x: 0, y: 2 }, { x: 1, y: 2.01 }],
	cross: { x: 0, y: 0 },
	limit: [],
	vline: [],
	constant: 1,
};

function initChart() {
	setTableData();
}

function refreshChart() {
	getTableData();
	let { data, cross, constant } = store;
	let limitPercent = document.getElementById('input_limit').value;
	cross.y = data[0].y + (data[0].y * limitPercent / 100);
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
		.y(function (d) { return y(d.y) })
		.curve(d3.curveMonotoneX);

	// line
	g.append("path")
		.datum(data)
		.attr("fill", "none")
		.attr("stroke", "black")
		.style("stroke-dasharray", ("3, 3"))
		.attr("d", line);

	data.pop();
	g.selectAll("circles")
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
	const iLast = store.pointsCount - 1;
	const avgInc = avgIncTg(data);
	const tgLast = tg(data[iLast-1], data[iLast])
	const tgCross = tgLast + avgInc;
	const dy = y - data[iLast].y;
	const dx = dy / tgCross / store.constant;
	const x = data[iLast].x + dx;
	return (Math.round(x * 1000) / 1000);
}

function calcLittleMore() {
	const { data } = store;
	const lm = { x: 0, y: 0 };
	const ic = store.pointsCount; // index cross point
	lm.y = data[0].y + ((data[ic].y - data[0].y) * 1.1);
	const tgLast = tg(data[ic-1], data[ic]);
	const dy = lm.y - data[ic].y;
	const dx = dy / tgLast / store.constant;
	lm.x = data[ic].x + dx;
	return lm;
}

function tg(p0, p1) {
	const dx = p1.x - p0.x;
	if (dx === 0) { return 1; } //error, actually
	return (p1.y - p0.y) / dx;
}

// average increment of tg (i.e. corner)
function avgIncTg(data) {
	// (increment needs at least two pair (0,1) and (1,2))
	// so, e.g.: two points = one corner = no increments
	// three points = two corners = one increment... and so on.
	const incCount = store.pointsCount - 2;
	if (incCount === 0) { return 0; }
	let incTotal = 0;
	for (let i=0; i < incCount; i++) {
		const tgPrev = tg(data[i], data[i+1]);
		const tgNext = tg(data[i+1], data[i+2]);
		incTotal += (tgNext - tgPrev);
	}
	return (incTotal / incCount);
}
