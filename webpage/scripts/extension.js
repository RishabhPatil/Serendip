//making it global so that words are stored even after the function ends
var documents = new Array;

function add_word_extension()
{
	var text;
	var text_inputbar = document.getElementById("inputword2");
	text = text_inputbar.value;
	if(text == "")
	{
		alert("Empty text box");
		return;
	}
	if(text != "")
	{	
		for(i=0; i<documents.length; i++)
		{
			if(text == documents[i])
			{
				alert("Already added");
				return;
			}
		}

		documents.push(text);	
	}
	text_inputbar.value = "";
	view_cards_and_chart();
}

function clear_word_extension()
{
	document.getElementById("inputword2").value = "";
	documents = [];
	view_cards_and_chart();

	var bubble_chartspace = document.getElementById("bubble");
    bubble_chartspace.innerHTML = "";
}

function view_cards_and_chart()
{
	var topics_space = document.getElementById("topics");
	topics_space.innerHTML = "";
	document.getElementById("bubble").innerHTML="";
	var words;
	var ranking_space = document.getElementById("ranking");
	ranking_space.innerHTML = "";

	if(documents.length == 0)
	{
		return;
	}


	for(i=0; i<documents.length; i++)
	{
		words=document.createElement("button");
		words.className = "btn btn-success mx-1";
		words.innerHTML = '<b>'+documents[i]+'</b> <span aria-hidden="true">&times;</span>';
		words.type = "button";
		words.name = documents[i];
		topics_space.appendChild(words);
		words.onclick = Remove_word;
	}

	var card, card_doc, card_body;
	
	

	d3.csv("Extension.csv", function(error, data) {
		var documents_name = new Array();
		var distinct_doc = new Array();
		var topics = new Array();
		var lengths = new Array();
		var present = false;

		data.forEach(function(d) {
			documents_name.push(d.Document);
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
			for(j=0; j<documents_name.length; j++)
			{
				if(distinct_doc[i] == documents_name[j])
				{
					distinct_topics.push(topics[j]);
					distinct_lengths.push(lengths[j]);
				}
			}
			add_card(distinct_doc[i], distinct_topics, distinct_lengths);
		}
	});

	var topics = new Array();
	var importance = new Array();

	//Get the topics from the TopicsWords.csv
	d3.csv("TopicsWords.csv", function(error, data)
	{
		data.forEach(function(d)
		{
			for(i=0; i<documents.length; i++)
			{
				if(d.topics == documents[i])
				{
					topics.push(d.topics);
					importance.push(d.length);					
				}
			}
		});


		display_bubble_chart(topics, importance);	
	});

	
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

function display_bubble_chart(topics, importance)
{
	
    var bubble_chartspace = document.getElementById("bubble");
    bubble_chartspace.innerHTML = "";

	var chart = document.createElement("div");

	/*var data = new Array();
	var obj = {}
	for(i=0; i<topics.length; i++)
	{
		obj = {};
		obj.topic = topics[i];
		obj.importance = importance[i];
		data.push(obj);
	}

	
	//Start with the chart dimensions

	var diameter = 500,
		pad = 1.5,
		color = d3.scaleOrdinal(d3.schemeCategory20c);

	alert("1 here");

	var bubble = d3.pack(data)
					.size([diameter, diameter])
					.padding(pad);

	alert("2");
	var svg = d3.select(chart)
            .append("svg")
            .attr("width", diameter)
            .attr("height", diameter)
            .attr("class", "bubble");

    alert("3");
    var nodes = d3.hierarchy(data)
        .sum(function(d) { return d.importance; });

    alert("4");
        var node = svg.selectAll(".node")
            .data(bubble(nodes).descendants())
            .enter()
            .filter(function(d){
                return  !d.children
            })
            .append("g")
            .attr("class", "node")
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

    alert("5");
        node.append("circle")
            .attr("r", function(d) {
                return d.importance;
            })
            .style("fill", function(d,i) {
                return color(i);
            });*/
    
    bubble_chartspace.appendChild(chart);

}

function Remove_word()
{
	var new_array = new Array();
	for(i=0; i<documents.length; i++)
	{
		if(this.name != documents[i])
		{
			new_array.push(documents[i]);
		}
	}
	documents = new_array;
	view_cards_and_chart();
}