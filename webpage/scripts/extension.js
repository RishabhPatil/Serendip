//making it global so that words are stored even after the function ends
var documents = new Array;

function add_word_extension()
{
	var text;
	text = document.getElementById("inputword2").value;
	if(text != "")
	{
		documents.push(text);	
	}
	view_cards();
}

function clear_word_extension()
{
	document.getElementById("inputword2").value = "";
	documents = [];
	view_cards();
}

function view_cards()
{
	var topics_space = document.getElementById("topics");
	topics_space.innerHTML = "";
	var words;

	for(i=0; i<documents.length; i++)
	{
		words=document.createElement('button');
		words.class = "btn btn-primary mx-2";
		words.innerHTML = documents[i];
		topics_space.appendChild(words);
	}


	var doc_results = [ ["doc1", 20, 30], ["doc2", 20, 20], ["doc3", 10, 20] ];

	var card, card_doc, card_body;
	var ranking_space = document.getElementById("ranking");
	ranking_space.innerHTML = "";

	for(i=0; i<doc_results.length && documents.length!=0; i++)
	{
		add_card(doc_results[i]);
	}

	/*for(i=0; i<documents.length && documents.length!=0; i++)
	{
		add_bubble()
	}*/
	display_bubble_chart();	
}

function add_card(doc_name)
{
	var card, card_doc, card_body, card_header_p, img;
	var ranking_space = document.getElementById("ranking");

	card = document.createElement("div");
	card.className = "card my-2";
	card_header = document.createElement("div");
	card_header.className = "card-header";
	card_header_h5 = document.createElement("h5");
	card_header_h5.innerHTML = doc_name[0];
	card_header_h5.style.cssFloat = "right";
	card_header.appendChild(card_header_h5);
	card.appendChild(card_header);
	var chart;
	chart = document.createElement("div");

	d3.csv("TopicsWords.csv", function(error, data) {
		if (error) throw error;

		var topics = new Array();
		var lengths = new Array()
		data.forEach(function(d) {
			topics.push(d.topics);
			lengths.push(d.length);	
		})

		var MaxWidth = 1000;
		var MaxHeight = 80;

		var margin = {top: 0, right: 10, bottom: 0, left: 10},
		    width = MaxWidth - margin.left - margin.right,
		    height = MaxHeight - margin.top - margin.bottom;

		var x1 = d3.scaleBand()
			.domain(topics)
			.rangeRound([0, width]);

		var y1 = d3.scaleLinear()
			.range([80,0]);

		y1.domain([0, d3.max(lengths)]);

		var xAxis1 = d3.axisBottom(x1).ticks(30);
		var yAxis1 = d3.axisLeft(y1).ticks(20);

		var rankBar = d3.select(chart)
		    .append("svg")
			.attr("width", MaxWidth)
			.attr("height", MaxHeight);


		rankBar.selectAll(".bar")
			.data(data)
			.enter()
			.append("rect")
		      .attr("class", "bar")
		      .attr("x", function(d) { return x1(d.topics) })
		      .attr("y", function(d) { return y1(d.length) } )
		      .attr("width", 25)
		      .attr("height", function(d) { return height - y1(d.length); })
		      .attr("fill","grey");
   	});

/*	var dataURL = chart.node().toDataURL();
	card_header.style('background-image', 'url(' + dataURL + ')');*/
	card_header.appendChild(chart);
	ranking_space.appendChild(card);
}

function display_bubble_chart()
{
	
}