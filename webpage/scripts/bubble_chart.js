$(document).ready(function() {

    bubble_topic = {
        "children": [{
                "topic": "topic10",
                "score": 0.6,
                "color": "rgb(153, 153, 102)"
            },
            {
                "topic": "topic2",
                "score": 0.3,
                "color": "blue"
            },
            {
                "topic": "topic5",
                "score": 0.5,
                "color": "Yellow"

            }
        ]
    };

    var diameter = 300;

    var bubble = d3.pack(bubble_topic)
        .size([diameter, diameter])
        .padding(1.5);

    var svg = d3.select("#bubble")
        .append("svg")
        .attr("width", 500)
        .attr("height", 500)
        .attr("class", "bubble");

    var source = d3.hierarchy(bubble_topic)
        .sum(function(d) {
            return d.score;
        });

    var node = svg.selectAll(".node")
        .data(bubble(source).descendants())
        .enter()
        .filter(function(d) {
            return !d.children
        })
        .append("g")
        .attr("class", "node")
        .attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        });

    //Bubble attributes
    node.append("circle")
        .attr("r", function(d) {
            return d.r;
        })
        .style("fill", function(d, i) {
            return d.data.color;
        });

    //Labels in bubble
    node.append("text")
        .attr("dy", ".1em")
        .style("text-anchor", "middle")
        .style("font-weight", "bold")
        .text(function(d) {
            return d.data.topic.substring(0, d.r);
        })
        .attr("font-size", function(d) {
            return d.r / 6;
        })
        .attr("fill", "black");
    //Values of labels in bubble
    node.append("text")
        .attr("dy", "1.3em")
        .style("text-anchor", "middle")
        .style("font-weight", "bold")
        .text(function(d) {
            return d.data.score;
        })
        .attr("font-size", function(d) {
            return d.r / 6;
        })
        .attr("fill", "black");


});