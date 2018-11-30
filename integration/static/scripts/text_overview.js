function topicLineGraph(id, data){

    console.log(data)

    var card_body = document.getElementById(id);

    d3.select(card_body)
            .selectAll("*")
            .remove();
    
    var width = 300,
        height = 610,
        margin = 30;

    data.forEach(function(d) {
        d.values.forEach(function(d) {
            d.line = +d.line;
            d.frequency = +d.frequency;
        });
    });


    // Define scale
    var x = d3.scaleLinear()
        .domain(d3.extent(data[0].values, function(d) {
            return d.line;
        }))
        .range([0, height - margin]);

    var y = d3.scaleLinear()
        // .domain([0, 241])
        .domain([0.1,0])
        .range([width - margin, 0]);


    //Create SVG for chart
    var svg = d3.select(card_body)
        .append("svg")
        .attr("width", width + margin)
        .attr("height", height + margin)
        .append("g")
        .attr("transform", "translate(" + margin + "," + margin + ")");

    // Draw Axis
    var xAxis = d3.axisLeft(x);
    var yAxis = d3.axisTop(y);


    //Define lines
    var line = d3.line()
        .y(function(d) {
            return x(d.line);
        })
        .x(function(d) {
            return y(d.frequency);
        })

    // Line attributes
    var lines = svg.append("g")
        .attr("class", "lines")
        .selectAll(".line-all")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "line-all")
        .append("path")
        .attr("class", d => d.id + " line tpcbutton")
        .attr("d", function(d) {
            return line(d.values);
        })
        .style("stroke", function(d) {
            return '#212121'
        })
        .style("fill", "none")
        .style("stroke-width", "3")
        .style("opacity", "0.3")
        .on("click", function(d) {
            var className = $(this).attr('class')
            var classes = className.split(" ")
            var ix = classes.indexOf("selected")
            if (ix == -1) {
                $(this).addClass("selected")
                d3.select(this)
                    .style("stroke", function(d) {
                        return d.color
                    })
                classes.push("selected")
                $(this).attr("class", classes.join(" "))
            } else {
                d3.select(this)
                    .style("stroke", function(d) {
                        return "#777777"
                    })
                classes.pop(ix)
                $(this).attr("class", classes.join(" "))
            }
        })
        .on("mouseover", function(d) {
            d3.selectAll(".line")
                .style("opacity", "0.15");
            d3.select(this)
                .style("stroke-width", "3")
                .style("opacity", "0.8")
                .style("cursor", "pointer");
            svg.append("text")
                .attr("x", (width - margin) / 3)
                .attr("y", 0)
                .attr("class", "title")
                .style("fill", "#212121")
                .style("font-size", "15px")
                .text(d.name)
                .attr("text-anchor", "middle");
        })
        .on("mouseout", function(d) {
            d3.selectAll(".line")
                .style("opacity", "0.3");
            d3.select(this)
                .style("stroke-width", "3")
                .style("cursor", "none");
            svg.select(".title")
                .remove();
        });



}