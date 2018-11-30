$(document).ready(function() {

	d3.csv("text_topic_matrix.csv", function(error, mdata) {
		if (error) throw error;
		var bD = 25
		function vData(bD) {
			var data = new Array();
			xpos1 = 100
			ypos1 = 100
			xpos2 = 100
			ypos2 = 100 + (bD * (mdata.length+1))
			for (var l = 0; l < 33; l++) {
				data.push({
					x1: xpos1,
					y1: ypos1,
					x2: xpos2,
					y2: ypos2,
					val: "Topic " + (l-1).toString(),
					t: l-1,
				})
				xpos1 += bD
				xpos2 += bD
			}
			return data
		}

		function hData(bD) {
			var data = new Array();
			xpos1 = 100
			ypos1 = 100
			xpos2 = 100 + (bD * 32)
			ypos2 = 100
			for (var l = 0; l < (mdata.length+2); l++) {
				data.push({
					x1: xpos1,
					y1: ypos1,
					x2: xpos2,
					y2: ypos2,
					val: "Document " + (l-1).toString(),
					t: -1,
				})
				ypos1 += bD
				ypos2 += bD
			}
			return data
		}

		function cData(bD) {
			var data = new Array();
			x = 100 + bD
			y = 100 + bD 
			for (var l = 0; l < mdata.length; l++) {
				x = 100 + bD
				for (key in mdata[l]) {
						data.push({
						x: x,
						y: y,
						val: "Topic "+key,
						r: mdata[l][key] * 2,
						t: key,
					})
					x += bD
				}
				y += bD
			}
			return data;
		}

		function labelData(bD) {
			var data = new Array();
			x = 0
			y = 130
			for (var i = 1; i <= mdata.length; i++) {
				data.push({
					x: x,
					y: y,
					r: 0,
					val: "Document "+i.toString(),
					t: -1,
				})
				y += bD
			}
			x = 130
			y = 80
			for (var i = 0; i < 31; i++) {
				data.push({
					x: x,
					y: y,
					r: 315,
					val: "Topic "+i.toString(),
					t: i,
				})
				x += bD
			}
			return data;
		}

		var lData = vData(bD).concat(hData(bD));
		var cData = cData(bD);
		var labelData = labelData(bD);

		var newP = document.getElementById("topicP");
		var newD = document.getElementById("documentP");

		var sortItems = function(a, b) { return d3["descending"](a.r, b.r) };

		var grid = d3.select("#grid")
			.append("svg")
			.attr("width","950px")
			.attr("height","1100px");

		var lLines = grid.selectAll("line")
			.data(lData)
			.enter().append("line")
			.attr("class", function(d,i){ return "class"+(d.t).toString();})
			.attr("x1", function(d) { return d.x1; })
			.attr("y1", function(d) { return d.y1; })
			.attr("x2", function(d) { return d.x2; })
			.attr("y2", function(d) { return d.y2; })
			.attr("stroke-width", 0.5)
			.attr("stroke", "black")
			.on("click", function(d) {
				if (d.val.startsWith("Topic")) {
					newP.innerHTML = d.val;
					window.localStorage.setItem("tname",d.val);
				} else {
					newD.innerHTML = d.val;
					window.localStorage.setItem("tname",d.val);
				}
			})
			.on("mouseover", function(d) {
				c = (d3.select(this).attr("class")).slice(5)
				if(c != -1) {
					d3.selectAll("."+d3.select(this).attr("class"))
						.style('stroke', 'black')
	            		.style('stroke-width', 2.0);
            	}
            })
			.on("mouseout", function(d) {
				d3.selectAll("."+d3.select(this).attr("class"))
					.style('stroke', 'black')
            		.style('stroke-width', 0.5);
			});
			
			

		var intersection = grid.selectAll("circle")
			.data(cData)
			.enter().append("circle")
			.attr("class", function(d,i){ return "class"+(d.t).toString();})
			.style("stroke", "grey")
		    .style("fill", "#FFFFE0")
		    .attr("r", function(d) { return d.r })
		    .attr("cx", function(d) { return d.x })
		    .attr("cy", function(d) { return d.y })
		    .on("click", function(d) {
				d3.select(".classl"+d.t)
					.style("fill","red");
				newP.innerHTML = d.val;
				window.localStorage.setItem("tname",d.val);
			})
			.on("mouseover", function(d){
				d3.selectAll("."+d3.select(this).attr("class"))
            		.style('stroke', 'black')
            		.style('stroke-width', 2.0);
			})
			.on("mouseout", function(d){
				d3.selectAll("."+d3.select(this).attr("class"))
            		.style('stroke', 'grey')
            		.style('stroke-width', 1.0);
			});


		var matrixLabels = grid.selectAll("text")
			.data(labelData)
			.enter()
			.append("text")
			.attr("class", function(d,i) { return "classl"+d.t})
			.text(function(d,i) { return d.val; })
			.attr("transform", (d,i)=>{
        			return 'translate( '+d.x+' , '+d.y+'),'+ 'rotate('+d.r+')';})
			.on("click", function(d) {
				if (d.val.startsWith("Topic")) {
					newP.innerHTML = d.val;
					window.localStorage.setItem("tname",d.val);
				} else {
					newD.innerHTML = d.val;
					window.localStorage.setItem("tname",d.val);
				}
			});
	});

});