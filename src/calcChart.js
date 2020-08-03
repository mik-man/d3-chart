function calcCrossX(y, data) {
	const iLast = store.pointsCount - 1;
	const avgInc = avgIncTg(data);
	const tgLast = tg(data[iLast-1], data[iLast])
	let tgCross = tgLast + avgInc;
	const cornerX = Math.atan(tgCross)/Math.PI*180;
	console.log(`cornerX = ${cornerX};`);
	if (tgCross < 0.0000001) { tgCross = .1 };
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
	const cornersCount = store.pointsCount - 1;
	const incCount = cornersCount - 1;
	if (incCount === 0) { return 0; }
	let incTotal = 0;
	for (let i=0; i < incCount; i++) {
		const tgPrev = tg(data[i], data[i+1]);
		const tgNext = tg(data[i+1], data[i+2]);
		incTotal += (tgNext - tgPrev);
		const corner1 = Math.atan(tgPrev)/Math.PI*180;
		const corner2 = Math.atan(tgNext)/Math.PI*180;
		const cornerInc = Math.atan(incTotal)/Math.PI*180 /2;
		console.log(`corner1 = ${corner1}; corner2 = ${corner2}; avgInc = ${cornerInc};`);
	}
	return (incTotal / cornersCount);
}