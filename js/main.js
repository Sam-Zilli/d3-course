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

// Tooltip
const tip = d3.tip()
  .attr('class', 'd3-tip')
	.html(d => {
		let text = `<strong>Country:</strong> <span style='color:red;text-transform:capitalize'>${d.country}</span><br>`
		text += `<strong>Continent:</strong> <span style='color:red;text-transform:capitalize'>${d.continent}</span><br>`
		text += `<strong>Life Expectancy:</strong> <span style='color:red'>${d3.format(".2f")(d.life_exp)}</span><br>`
		text += `<strong>GDP Per Capita:</strong> <span style='color:red'>${d3.format("$,.0f")(d.income)}</span><br>`
		text += `<strong>Population:</strong> <span style='color:red'>${d3.format(",.0f")(d.population)}</span><br>`
		return text
	})
g.call(tip)

// Year label on x axis
const yearText = g.append("text")
	.attr("x", WIDTH - MARGIN.LEFT)
	.attr("y", HEIGHT)
	.attr("font-size", "32px")
	.text("");

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


// axis, area, and color scaling
const x = d3.scaleLog()
	.range([0, WIDTH])
	.domain([142, 150000])

const y = d3.scaleLinear()
	.range([HEIGHT, 0])
	.domain([0, 90])

const area = d3.scaleLinear()
	.range([25*Math.PI, 1500*Math.PI])
	.domain([2000, 1400000000])

const continentColor = d3.scaleOrdinal(d3.schemePastel1)

// x axis
const xAxisGroup = g.append("g")
 .attr("class", "x axis")
 .attr("transform", `translate(0, ${HEIGHT})`)

// y axis
const yAxisGroup = g.append("g")
 .attr("class", "y axis")

 const xAxisCall = d3.axisBottom(x)
	// setting custom x axis tick values
	.tickValues([400,4000,40000])
	.tickFormat(d3.format("$"));

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


const continents = ["europe", "asia", "americas", "africa"]

const legend = g.append("g")
	.attr("transform", `translate(${WIDTH - 10}, ${HEIGHT - 125})`)

continents.forEach((continent, i) => {
	const legendRow = legend.append("g")
		.attr("transform", `translate(0, ${i * 20})`)

	legendRow.append("rect")
    .attr("width", 10)
    .attr("height", 10)
		.attr("fill", continentColor(continent))

	legendRow.append("text")
    .attr("x", -10)
    .attr("y", 10)
    .attr("text-anchor", "end")
    .style("text-transform", "capitalize")
    .text(continent)
})

// data retrieval and binding from json
d3.json("data/data.json").then(function(data){
	const formattedData = data.map(year => {
		return year["countries"].filter(country => {
			const dataExists = (country.income && country.life_exp)
			return dataExists
		}).map(country => {
			country.income = Number(country.income)
			country.life_exp = Number(country.life_exp)
			return country
		})
	})
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
		const dataPerYear = formattedData[year]
		// console.log("updated " + data[year]["year"])
		// for each year, update by passing in all the country objects
		update(dataPerYear, (1800 + year).toString())

 	}, 100)
	// the initial call to load the data
	// console.log(data[year]["countries"])
	update(formattedData[year], "1800")
})

function update(data, year) {
	const t = d3.transition().duration(100);
	// updating the year text on x axis
	// yearText.text(data["year"])
	yearText.text(year.toString());

	// reaching into data object to get countries list
	// data = data["countries"]

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
		// tip events are added before the MERGE because 
		// we only want one tip event attached to each cirlce
		.on("mouseover", tip.show)
		.on("mouseout", tip.hide)
		// color encoded by country
		.attr("fill", d => continentColor(d["continent"]))
    	// AND UPDATE old elements present in new data.
    	.merge(circles)
    	.transition(t)
      		.attr("cx", d => { return x(d["income"]) })
      		.attr("cy", d => { return y(d["life_exp"]) })
			.attr("r", d => Math.sqrt(area(d.population) / Math.PI))
}
