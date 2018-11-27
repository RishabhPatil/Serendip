//making it global so that words are stored even after the function ends
var documents = new Array;
var json_var = {};


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

	var key;
	//insert the words into the json_var
	for(i=0; i<documents.length; i++)
	{
		key = "word"+(i+1);
		json_var[key] = documents[i]; 
	}

	var topics = new Array();
	var importance = new Array();
	//Ajax request
	$.ajax({
	  url: "/docsearch",
	  type: "get",
	  async: false,
	  data: json_var,
	  success: function(response) {
	  	for(i=0;i<response.topic_scores.children.length; i++)
	  	{
	  		topics.push(response.topic_scores.children[i].topic);
	  		importance.push(response.topic_scores.children[i].score);

	  	}
	  	console.log(response);
	  },
	  error: function(xhr) {
	    //Do Something to handle error
	  }
	});

	view_cards_and_chart(topics, importance);
}

function clear_word_extension()
{
	document.getElementById("inputword2").value = "";
	documents = [];

	var key;
	//insert the words into the json_var
	for(i=0; i<documents.length; i++)
	{
		key = "word"+(i+1);
		json_var[key] = documents[i]; 
	}

	//Ajax request
	$.ajax({
	  url: "/docsearch",
	  type: "get",
	  async: false,
	  data: json_var,
	  success: function(response) {
	  },
	  error: function(xhr) {
	    //Do Something to handle error
	  }
	});

	view_cards_and_chart();

	var bubble_chartspace = document.getElementById("bubble");
    bubble_chartspace.innerHTML = "";
}

function view_cards_and_chart(topics, importance)
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
	
	var Extensionfile = window.localStorage.getItem("DATA_FOLDER") + "Extension.csv";

	d3.csv(Extensionfile, function(error, data) {
		//if (error) throw error;
		var documents_name = new Array();
		var distinct_doc = new Array();
		var topics = new Array();
		var lengths = new Array();
		var present = false;

		console.log("Inside view_cards_and_chart");
		console.log(data);

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

	display_bubble_chart(topics, importance);
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
	var color = d3.scaleOrdinal().range(d3.schemeCategory20);
	var Extensionfile = window.localStorage.getItem("DATA_FOLDER") + "Extension.csv";
	//no need for data here
	d3.csv(Extensionfile, function(){
		var document_data = new Array();
		var obj = {};


		//creating the data structure for input
		for(i=0; i<topics.length ;i++)
		{
			obj = {};
			obj.topic = topics[i];
			obj.length = lengths[i];
			obj.color = color(topics[i])
			document_data.push(obj);
		}

		var parentWidth = card.offsetWidth;

		var MaxWidth = Math.round(parentWidth - (0.15*parentWidth));
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
		      .attr("y", function(d) { return y1(d.length + 5) } )
		      .attr("width", Math.round(width/40))
		      .attr("height", function(d) { return height - y1(d.length + 5); })
		      .attr("fill", function (d) {
		      		if(d.length == 0)
		      		{
		      			return "gray";
		      		}

		      		return d.color;
		      });
   	});

	card_header.appendChild(chart);
	ranking_space.appendChild(card);
}

function display_bubble_chart(topics, importance)
{
	
    var bubble_chartspace = document.getElementById("bubble");
    bubble_chartspace.innerHTML = "";

	var chart = document.createElement("div");

	//start bubble_chart
	var children = new Array();
	var obj = {};
	var color = d3.scaleOrdinal().range(d3.schemeCategory20);
	for(i=0; i<topics.length; i++)
	{
		obj = {};
		obj["topic"] = topics[i];
		obj["score"] = parseInt(importance[i] * 1000, 10);
		obj["color"] = color(topics[i]);
		children.push(obj);
	}

	var bubble_topic = {};
	bubble_topic["children"] = children;
	
    var diameter = bubble_chartspace.offsetWidth - Math.round(bubble_chartspace.offsetWidth/12);

    var bubble = d3.pack(bubble_topic)
        .size([diameter, diameter])
        .padding(1.5);

    var svg = d3.select("#bubble")
        .append("svg")
        .attr("width", diameter)
        .attr("height", diameter)
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

	//end bubble_chart
    
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
	var key;
	json_var = {};
	//insert the words into the json_var
	for(i=0; i<documents.length; i++)
	{
		key = "word"+(i+1);
		json_var[key] = documents[i]; 
	}
	var topics = new Array();
	var importance = new Array();
	//Ajax request
	$.ajax({
	  url: "/docsearch",
	  type: "get",
	  async: false,
	  data: json_var,
	  success: function(response) {
	  	for(i=0;i<response.topic_scores.children.length; i++)
	  	{
	  		topics.push(response.topic_scores.children[i].topic);
	  		importance.push(response.topic_scores.children[i].score);

	  	}
	  	console.log(response);
	  },
	  error: function(xhr) {
	    //Do Something to handle error
	  }
	});

	view_cards_and_chart(topics, importance);
}