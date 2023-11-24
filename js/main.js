// canvas and margin sizes
const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 100 }
const WIDTH = 600 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 400 - MARGIN.TOP - MARGIN.BOTTOM

// increments based on what year is retrieved from dataset
let year = 0

// retrieving svg element from html and adding margins
const svg = d3.select("#chart-area").append("svg")
 .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
 .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

// adding internal element inside margin sizes for graph
const g = svg.append("g")
 .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

// X label
g.append("text")
 .attr("class", "x axis-label")
 .attr("x", WIDTH / 2)
 .attr("y", HEIGHT + 60)
 .attr("font-size", "20px")
 .attr("text-anchor", "middle")
 .text("GDP Per Capita ($)")

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

// x axis will be logarithmic, default base 10
const x = d3.scaleLog()
	.domain([0, 40000]) // adjust this after testing
	.range([0,40000]) // the range of tick marks displayed

const y = d3.scaleLinear()
	// ages range from 0 to 90 years old
	.domain( [0, 90] )
	// reversing the range, height is the minimum value
	.range([HEIGHT, 0])

const xAxisGroup = g.append("g")
 .attr("class", "x axis")
 .attr("transform", `translate(0, ${HEIGHT})`)

const yAxisGroup = g.append("g")
 .attr("class", "y axis")

 const xAxisCall = d3.axisBottom(x)
 xAxisGroup.call(xAxisCall)
	 .selectAll("text")
	  .attr("cy", "10")
	  .attr("cx", "-5")
	  .attr("text-anchor", "end")
	  .attr("transform", "rotate(-40)")


  const yAxisCall = d3.axisLeft(y)
		.ticks(10)
		.tickFormat(d => d + " years")
   yAxisGroup.call(yAxisCall)

// data retrieval and binding from json
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
		// data has an object for each year, inside that year
		// another object for each country
		const dataPerYear = data[year]["countries"]
		// for each year, update by passing in all the country objects
		update(dataPerYear)

 	}, 100000)
	// console.log(data[year])
	// console.log("______")
	// console.log(data[year].countries)


	// dataPerYear.map( (d) => console.log(d["continent"]) )
	// console.log(dataPerYear)

	// the initial call to load the data
	// console.log(data[year]["countries"])
	update(data[year]["countries"])
})

function update(data) {
	const t = d3.transition().duration(750);
	data.map ( (d) =>
		console.log(d["country"] + " " + d["income"])
		)

	// data.map( (element) => {
	// 	if(element["continent"] == "asia") {
	// 		console.log(element["income"])
	// 	}
	// })
		  

	// let jsonVersion = JSON.stringify(data)
	// console.log(jsonVersion) 
	// data.map( (d) => d.map( (c) => console.log(c.income)))

 
 	// x.domain(data.map(d => d["country"]))



 // JOIN new data with old elements. For each country, make a circle
// 	const circles = g.selectAll("circle")
//     	.data(data, (d) => d["country"]) 

//  // EXIT old elements not present in new data.
// //  circles.exit()
// //    .attr("fill", "red")
// //    .transition(t)
// //      .attr("height", 0)
// //      .attr("cy", y(0))
// //      .remove()


// //  // ENTER new elements present in new data...
// //  circles.enter().append("circle")
// //    .attr("fill", "grey")
// //    .attr("cy", y(0))
// //    .attr("height", 0)
// //    // AND UPDATE old elements present in new data.
// //    .merge(circles)
// //    .transition(t)
// //      .attr("cx", (d) => x(Number(d["income"])))
// //      .attr("cy", d => y(Number(d["life_exp"])))
// // 	 .attr("r", x.bandwidth)
}
