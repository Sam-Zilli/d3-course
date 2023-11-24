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

const yearText = g.append("text")
	.attr("x", WIDTH - MARGIN.LEFT)
	.attr("y", HEIGHT)
	.attr("font-size", "32px")
	.text("");

// create a tooltip
var tooltip = d3.select("#chart-area")
  .append("div")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .text("I'm a circle!");	

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

// defaults to base 10
const x = d3.scaleLog()
	.range([0, WIDTH])
	.domain([142, 150000])

const y = d3.scaleLinear()
	.domain([0, 90])
	.range([HEIGHT, 0])

const area = d3.scaleLinear()
	.range([25*Math.PI, 1500*Math.PI])
	.domain([2000, 1400000000])

const continentColor = d3.scaleOrdinal(d3.schemePastel1)


const xAxisGroup = g.append("g")
 .attr("class", "x axis")
 .attr("transform", `translate(0, ${HEIGHT})`)

const yAxisGroup = g.append("g")
 .attr("class", "y axis")

 const xAxisCall = d3.axisBottom(x)
	// setting custom x axis tick values
	.tickValues([0,400,4000,40000])

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
		const dataPerYear = data[year]
		// console.log("updated " + data[year]["year"])
		// for each year, update by passing in all the country objects
		update(dataPerYear)

 	}, 1000)
	// the initial call to load the data
	// console.log(data[year]["countries"])
	update(data[year])
})

function update(data) {
	const t = d3.transition().duration(100);
	yearText.text(data["year"])
	data = data["countries"]
	// ______________________________________________________
	// binding data to svg elements (circles) for each country 

	// JOIN new data with old elements
	const circles = g.selectAll("circle")
    	.data(data, (d) => {
			return d["country"]
		})

    // EXIT old elements not present in new data.
   	circles.exit()
     	.remove()

  	// ENTER new elements present in new data...
  	circles.enter().append("circle")
		.each(function(d,i) {
			if(d["life_exp"] == null || d["income"] == null) {
				d3.select(this.remove())
			}
		})
		.attr("fill", d => continentColor(d["continent"]))
    	// AND UPDATE old elements present in new data.
    	.merge(circles)
    	.transition(t)
      		.attr("cx", d => x(d["income"]))
      		.attr("cy", d => y(d["life_exp"]))
			.attr("r", d => Math.sqrt(area(d.population) / Math.PI))

  	d3.select("#circleBasicTooltip")
		.on("mouseover", function() { 
			console.log("MOUSEOER"); 
			return tooltip.style("visibility", "visible");
			})
		.on("mousemove", function(){return tooltip.style("top", (event.pageY-800)+"px").style("left",(event.pageX-800)+"px");})
		.on("mouseout", function(){return tooltip.style("visibility", "hidden");});
}
