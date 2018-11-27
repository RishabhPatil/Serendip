function add_word()
{
	var text, color;
	var all_words = {}
	var colors = new Array()
	text=document.getElementById("inputword").value;
	color=document.getElementById("Select").value;
	
	if (text != "") {
		var words_panel=document.getElementById("words");
		var para=document.createElement('p');
		para.innerHTML = text;
		para.style.color=color;
		words_panel.appendChild(para);

		var nodes = words_panel.querySelectorAll("p"); 
		for (i = 0; i < nodes.length; i++) {
			all_words[i] = nodes[i].innerHTML;
			colors.push(nodes[i].style.color);
		}
	}

	var topics_data;
	var ranks_data;

	$.ajax({
		      url: "/get_word_ranks",
		      type: "get",
		      async: false,
		      data: {"words":all_words},
		      success: function(response) {
		        topics_data = response.topic_lens;
		        ranks_data = response.ranks;
		      },
		      error: function(xhr) {
		        //Do Something to handle error
		      }
	});

	rankView(topics_data, ranks_data, colors);

}

function rankView(topics_data, ranks_data, colors){

	var topics = new Array();
	var lengths = new Array();
	if (topics_data != null) {
		topics_data.forEach(function(d) {
			topics.push(d.name);
			lengths.push(d.len);
		})
	}

	// console.log(ranks_data);

	d3.select("#rank")
            .selectAll("*")
            .remove();

	var margin = {top: 30, right: 50, bottom: 150, left: 150},
	    width = 800 - margin.left - margin.right,
	    height = 400 - margin.top - margin.bottom;

	var x = d3.scaleBand()
		.domain(topics)
		.rangeRound([0, width]);

	var y = d3.scaleLinear()
		.range([250,0]);

	y.domain([0, d3.max(lengths)]);

	var xAxis = d3.axisBottom(x).ticks(30);
	var yAxis = d3.axisLeft(y).ticks(20);

	var rankBar = d3.select("#rank")
	    .append("svg")
		.attr("width","800px")
		.attr("height","400px");

	/**  Plotting axes  **/
	rankBar.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + 250 + ")")
	      .call(xAxis)
	    .selectAll("text")
	      .style("text-anchor", "end")
	      .attr("dx", "4.0em")
	      .attr("dy", "0em")
	      .attr("transform", "rotate(90)" );

	// rankBar.append("g")
	//       .attr("class", "y axis")
	//       .call(yAxis1)
	//     .append("text")
	//       .attr("transform", "rotate(-90)")
	//       .attr("y", 6)
	//       .attr("dy", ".71em")
	//       .style("text-anchor", "end");


	rankBar.selectAll(".bar")
		.data(topics_data)
		.enter()
		.append("rect")
	      .attr("class", "bar")
	      .attr("x", function(d) { return x(d.name) })
	      .attr("y", function(d) { return 0 } )
	      .attr("width", 15)
	      .attr("height", function(d) { return height - y(d.len); })
	      .attr("fill","grey");


	console.log(ranks_data);

	for (var i =0; i < ranks_data.length; i++) {
		for (var j=0; j < topics.length; j++) {
			if (ranks_data[i][j] != 999) {
				rankBar.append("line")
						.data(topics_data)
						.attr("x1", function(d) { return x(d.name) + (j*20) })
						.attr("y1", function(d) { return height - y(d.len) - (height-ranks_data[i][j]) })
						.attr("x2", function(d) { return x(d.name) + (j*20) + 15 })
						.attr("y2", function(d) { return height - y(d.len) - (height-ranks_data[i][j]) })
						.attr("stroke-width", 2.0)
						.attr("stroke", colors[i]);
			}
		}
	}

}