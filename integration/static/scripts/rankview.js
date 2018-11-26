function add_word()
{
	var text, color;
	text=document.getElementById("inputword").value;
	color=document.getElementById("Select").value;
	
	var words_panel=document.getElementById("words");
	var para=document.createElement('p');
	para.innerHTML = text;

	para.style.color=color;
	words_panel.appendChild(para);
}

function rankView(DATA_FOLDER, topic_filename){

	var filename = DATA_FOLDER+"TopicWords.csv";

	var word_data_1 = [0.95,0.75,0.4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var word_data_2 = [0.8,0.85,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

	d3.csv(filename, function(error, data) {
		if (error) throw error;

		var topics = new Array();
		var lengths = new Array();
		var ranks = new Array();
		data.forEach(function(d) {
			topics.push(d.topics);
			lengths.push(100);
			ranks.push(d.rank);
		})

		var margin = {top: 30, right: 50, bottom: 150, left: 150},
		    width = 800 - margin.left - margin.right,
		    height = 400 - margin.top - margin.bottom;

		var x1 = d3.scaleBand()
			.domain(topics)
			.rangeRound([0, width]);

		var y1 = d3.scaleLinear()
			.range([250,0]);

		y1.domain([0, d3.max(lengths)]);

		var xAxis1 = d3.axisBottom(x1).ticks(30);
		var yAxis1 = d3.axisLeft(y1).ticks(20);

		var rankBar = d3.select("#rank")
		    .append("svg")
			.attr("width","800px")
			.attr("height","400px");

		/**  Plotting axes  **/
		rankBar.append("g")
		      .attr("class", "x axis")
		      .attr("transform", "translate(0," + 250 + ")")
		      .call(xAxis1)
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
			.data(data)
			.enter()
			.append("rect")
		      .attr("class", "bar")
		      .attr("x", function(d) { return x1(d.topics) })
		      .attr("y", function(d) { return 0 } )
		      .attr("width", 15)
		      .attr("height", function(d) { return height - y1(d.length); })
		      .attr("fill","grey");

		for (var i = 0; i < topics.length; i++) {
			if(word_data_1[i] != 0) {
				rankBar.append("line")
						.data(data)
						.attr("x1", function(d) { return x1(d.topics) + (i*19) })
						.attr("y1", function(d) { return height - y1(d.length) - (word_data_1[i]*160); })
						.attr("x2", function(d) { return x1(d.topics) + (i*19) + 15 })
						.attr("y2", function(d) { return height - y1(d.length) - (word_data_1[i]*160) })
						.attr("stroke-width", 2.0)
						.attr("stroke", "red");
			}
			if(word_data_2[i] != 0) {
				rankBar.append("line")
						.data(data)
						.attr("x1", function(d) { return x1(d.topics) + (i*19) })
						.attr("y1", function(d) { return height - y1(d.length) - (word_data_2[i]*160); })
						.attr("x2", function(d) { return x1(d.topics) + (i*19) + 15 })
						.attr("y2", function(d) { return height - y1(d.length) - (word_data_2[i]*160) })
						.attr("stroke-width", 2.0)
						.attr("stroke", "blue");
			}
		}
   	});

}