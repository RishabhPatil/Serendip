function drawMatrix(DATA_FOLDER) {

	var doc_names = new Array(); 
	$.getJSON(DATA_FOLDER+"/doc_ids.json", function(data) {
		    $.each(data, function (index, value) {
	       		doc_names.push(value);
	    	});
		});

	d3.csv(DATA_FOLDER+"/text_topic_matrix.csv", function(error, mdata) {
		if (error) throw error;
		var bD = 25
		var h = Object.keys(mdata[0]).length -1;
		var v = mdata.length;
		console.log(h,v);

		function vData(bD) {
			var data = new Array();
			xpos1 = 100
			ypos1 = 100
			xpos2 = 100
			ypos2 = 100 + (bD * (mdata.length+1))
			for (var l = 0; l < h+2; l++) {
				data.push({
					x1: xpos1,
					y1: ypos1,
					x2: xpos2,
					y2: ypos2,
					val: "topic " + (l-1).toString(),
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
			xpos2 = 100 + (bD * h)
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
			for (var l = 0; l < v; l++) {
				x = 100 + bD
				for (var k = 1; k < h; k++) {
						key = "Topic"+(k-1).toString();
						data.push({
						x: x,
						y: y,
						val: key,
						r: mdata[l][key] * 8,
						t: key.slice(5),
					})
					x += bD
				}
				y += bD
			}
			return data;
		}

		function labelData(bD, doc_names) {
			var data = new Array();
			x = 0
			y = 130
			for (var i = 1; i <= mdata.length; i++) {
				data.push({
					x: x,
					y: y,
					r: 0,
					val: doc_names[i-1].substring(0, 10) + '...',
					id: i-1,
					t: -1,
				})
				y += bD
			}
			x = 130
			y = 80
			for (var i = 0; i < h; i++) {
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
		var labelData = labelData(bD, doc_names);

		var newP = document.getElementById("topicP");
		var newD = document.getElementById("documentP");

		var div = d3.select("body").append("div")	
		    .attr("class", "tooltip")				
		    .style("opacity", 0);

		var grid = d3.select("#grid")
			.append("svg")
			.attr("width","950px")
			.attr("height","1100px");

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
					d3.selectAll(".classl"+d.t)
						.style("fill", "red");
					newP.innerHTML = d.val;
					window.localStorage.setItem("tname",d.val);
					topic_click(DATA_FOLDER, d.val.replace(" ","")+".csv")

				} else {
					window.localStorage.setItem("tname",d.val);
					window.localStorage.setItem("docid",d.id)
					newD.innerHTML = d.val;
					$("#documentP").click(function() {
  						textViewInit();
					});
				}
			}).
			on("mouseover", function(d,i) {
				div.transition()
	                .duration(200)		
	                .style("opacity", 0.9);
	            div.html(doc_names[i])
		            .style("left", (d3.event.pageX +30) + "px")		
	                .style("top", (d3.event.pageY - 20) + "px");
			})
			.on("mouseout", function(d) {		
	            div.transition()		
	                .duration(500)		
	                .style("opacity", 0);	
        	});


		var lLines = grid.selectAll("line")
			.data(lData)
			.enter().append("line")
			.attr("class", function(d,i) { return "class"+d.t})
			.attr("x1", function(d) { return d.x1; })
			.attr("y1", function(d) { return d.y1; })
			.attr("x2", function(d) { return d.x2; })
			.attr("y2", function(d) { return d.y2; })
			.attr("stroke-width", 0.5)
			.attr("stroke", "black")
			.on("click", function(d) {
				if (d.val.startsWith("topic")) {
					d3.selectAll(".classl"+d.t)
						.style("fill", "red");
					newP.innerHTML = d.val;
					window.localStorage.setItem("tname",d.val);
				} else {
					newD.innerHTML = d.val;
					window.localStorage.setItem("tname",d.val);
				}
			})
			.on("mouseover", function(d,i) {
				c = d3.select(this).attr("class")
				console.log(c)
				if(c.slice(5)!=-1) {
					d3.selectAll("."+c)
						.style("stroke", "black")
						.style("stroke-width", 2.0)	
					}
			})
			.on("mouseout", function(d,i) {
				c = d3.select(this).attr("class")
				if(c.slice(5)!=-1) {
					d3.selectAll("."+c)
						.style("stroke", "black")
						.style("stroke-width", 0.5)	
				}
			});
			
			

		var intersection = grid.selectAll("circle")
			.data(cData)
			.enter().append("circle")
			.attr("class", function(d,i) { return "class"+d.t})
			.style("stroke", "grey")
		    .style("fill", "#FFFFE0")
		    .attr("r", function(d) { return d.r })
		    .attr("cx", function(d) { return d.x })
		    .attr("cy", function(d) { return d.y })
		    .on("click", function(d) {
		    	d3.selectAll(".classl"+d.t)
						.style("fill", "red");
				console.log(d.val);
				newP.innerHTML = d.val;
				window.localStorage.setItem("tname",d.val);
				topic_click(DATA_FOLDER, d.val.replace(" ","")+".csv")
			})
			.on("mouseover", function(d,i) {
				c = d3.select(this).attr("class");
				console.log(c)
				d3.selectAll("."+c)
					.style("stroke", "black")
					.style("stroke-width", 2.0)	
			})
			.on("mouseout", function(d,i) {
				c = d3.select(this).attr("class")
				d3.selectAll("."+c)
					.style("stroke", "black")
					.style("stroke-width", 0.5)	
			});


	});

}