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

	var card, card_doc, card_body;
	var ranking_space = document.getElementById("ranking");
	ranking_space.innerHTML = "";

	d3.csv("Extension.csv", function(error, data) {
		var documents = new Array();
		var distinct_doc = new Array();
		var topics = new Array();
		var lengths = new Array();
		var present = false;

		data.forEach(function(d) {
			documents.push(d.Document);
			topics.push(d.topics);
			lengths.push(d.length);
			present = false;
			for(i=0; i<distinct_doc.length && !present; i++)
			{
				if(distinct_doc[i] == d.Document)
				{
					present = true;
				}
			}
			if(present == false)
			{
				distinct_doc.push(d.Document);
			}
		})

		

		for(i=0; i<distinct_doc.length; i++)
		{
			var distinct_lengths = new Array();
			var distinct_topics = new Array();
			for(j=0; j<documents.length; j++)
			{
				if(distinct_doc[i] == documents[j])
				{
					distinct_topics.push(topics[j]);
					distinct_lengths.push(lengths[j]);
				}
			}
			add_card(distinct_doc[i], distinct_topics, distinct_lengths);
		}
	});

	display_bubble_chart();	
}

function add_card(doc_name, topics, lengths)
{

	var card, card_doc, card_body, card_header_p, img;
	var ranking_space = document.getElementById("ranking");

	card = document.createElement("div");
	card.className = "card my-2";
	card_header = document.createElement("div");
	card_header.className = "card-header";
	card_header_h5 = document.createElement("h5");
	card_header_h5.innerHTML = doc_name;
	card_header_h5.style.cssFloat = "right";
	card_header.appendChild(card_header_h5);
	card.appendChild(card_header);
	var chart;
	chart = document.createElement("div");

	d3.csv("Extension.csv", function(){
		var document_data = new Array();
		var obj = {};

		for(i=0; i<topics.length ;i++)
		{
			obj = {};
			obj.topic = topics[i];
			obj.length = lengths[i];
			document_data.push(obj);
		}

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
			.data(document_data)
			.enter()
			.append("rect")
		      .attr("class", "bar")
		      .attr("x", function(d) { return x1(d.topic) })
		      .attr("y", function(d) { return y1(d.length) } )
		      .attr("width", 25)
		      .attr("height", function(d) { return height - y1(d.length); })
		      .attr("fill","grey");
   	});

	card_header.appendChild(chart);
	ranking_space.appendChild(card);
}

/*function add_card(doc_name)
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

//	var dataURL = chart.node().toDataURL();
//	card_header.style('background-image', 'url(' + dataURL + ')');
	card_header.appendChild(chart);
	ranking_space.appendChild(card);
}*/

function display_bubble_chart()
{
	
}