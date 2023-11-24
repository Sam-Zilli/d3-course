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

// adding internal element inside margin sizes for graph, g is "group" in svg
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

const x = d3.scaleLinear()
	.domain([0,40000])
  	.range([0, WIDTH])

const y = d3.scaleLinear()
	.domain([0, 90])
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
		// console.log("updated " + data[year]["year"])
		// for each year, update by passing in all the country objects
		update(dataPerYear)

 	}, 10000)
	// the initial call to load the data
	// console.log(data[year]["countries"])
	update(data[year]["countries"])
})

function update(data) {
	const t = d3.transition().duration(750);
	// ______________________________________________________
	// binding data to svg elements (circles) for each country 

	// JOIN new data with old elements
	const circles = g.selectAll("circle")
    	.data(data, (d) => {
			return d["country"]
		})

    // EXIT old elements not present in new data.
   	circles.exit()
    	.attr("fill", "red")
		.transition(t)
      	.attr("cy", y(0))
     	.remove()

  	// ENTER new elements present in new data...
  	circles.enter().append("circle")
		.each(function(d,i) {
			if(d["life_exp"] == null || d["income"] == null) {
				d3.select(this.remove())
			}
		})
		.attr("id", "circleBasicTooltip")
    	.attr("fill", (element) => {
			if (element["continent"] === "asia") {
				return "yellow"
			}
			// should be no red circles if null values eliminated correctly
			if (element["income" == null] || element["life_exp"] == null) {
				return "red"
			}
			else {
				return "black"
			}
		})
    	// .attr("cy", (d) => y(d["life_exp"]))
    	.attr("r", 5)
    	// AND UPDATE old elements present in new data.
    	.merge(circles)
    	.transition(t)
      	.attr("cx", d => x(d["income"]) ** 2)
      	.attr("cy", d => y(d["life_exp"]))

  	d3.select("#circleBasicTooltip")
		.on("mouseover", function() { console.log("MOUSEOER"); return tooltip.style("visibility", "visible");}  )
		.on("mousemove", function(){return tooltip.style("top", (event.pageY-800)+"px").style("left",(event.pageX-800)+"px");})
		.on("mouseout", function(){return tooltip.style("visibility", "hidden");});
}
