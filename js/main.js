const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 100 }
const WIDTH = 600 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 400 - MARGIN.TOP - MARGIN.BOTTOM


let year = 0

const svg = d3.select("#chart-area").append("svg")
 .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
 .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)


const g = svg.append("g")
 .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)


// X label
g.append("text")
 .attr("class", "x axis-label")
 .attr("x", WIDTH / 2)
 .attr("y", HEIGHT + 60)
 .attr("font-size", "20px")
 .attr("text-anchor", "middle")
 .text("Month")


// Y label
const yLabel = g.append("text")
 .attr("class", "y axis-label")
 .attr("x", - (HEIGHT / 2))
 .attr("y", -60)
 .attr("font-size", "20px")
 .attr("text-anchor", "middle")
 .attr("transform", "rotate(-90)")
 .text("Life Expectancy")


// const x = d3.scaleBand()
//  .range([0, WIDTH])
//  .paddingInner(0.3)
//  .paddingOuter(0.2)

// x axis will be logarithmic
const x = d3.scaleLog()
	.domain([0,100])
	.range([0,40000])

const y = d3.scaleLinear()
 .range([HEIGHT, 0])


const xAxisGroup = g.append("g")
 .attr("class", "x axis")
 .attr("transform", `translate(0, ${HEIGHT})`)

const yAxisGroup = g.append("g")
 .attr("class", "y axis")
 

d3.json("data/data.json").then(function(data){
 	d3.interval(() => {
		// iterating through each of the objects in the data (each is a year)
		if(year < 214) {
			year++
		}
		// once it reaches max year, reset to 0
		else {
			year = 0;
		}
   		const newData = data[year]
   		update(newData)
 	}, 1000000)
	update(data)
})




function update(data) {
	const t = d3.transition().duration(750)	
	// let jsonVersion = JSON.stringify(data)
	// console.log(jsonVersion) 
	// data.map( (d) => d.map( (c) => console.log(c.income)))

 
//  x.domain(data.map(d => d[country]))
//  y.domain([0, d3.max(data, d => d[year].life_exp)])


//  const xAxisCall = d3.axisBottom(x)
//  xAxisGroup.transition(t).call(xAxisCall)
//    .selectAll("text")
//      .attr("cy", "10")
//      .attr("cx", "-5")
//      .attr("text-anchor", "end")
//      .attr("transform", "rotate(-40)")


//  const yAxisCall = d3.axisLeft(y)
//    .ticks(3)
//    .tickFormat(d => d + "m")
//  yAxisGroup.transition(t).call(yAxisCall)


//  // JOIN new data with old elements.
//  const circles = g.selectAll("circle")
//    .data(data, d => d.country) 

//  // EXIT old elements not present in new data.
//  circles.exit()
//    .attr("fill", "red")
//    .transition(t)
//      .attr("height", 0)
//      .attr("cy", y(0))
//      .remove()


//  // ENTER new elements present in new data...
//  circles.enter().append("circle")
//    .attr("fill", "grey")
//    .attr("cy", y(0))
//    .attr("height", 0)
//    // AND UPDATE old elements present in new data.
//    .merge(circles)
//    .transition(t)
//      .attr("cx", (d) => x(d.income))
//      .attr("cy", d => y(d[value]))
// 	 .attr("r", x.bandwidth)
}
