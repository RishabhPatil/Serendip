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
	add_card(doc_results[1]);
	
}

function add_card(doc_name)
{
	var card, card_doc, card_body, card_header_p;
	var ranking_space = document.getElementById("ranking");

	card = document.createElement("div");
	card.class = "card card-primary";
	card_header = document.createElement("div");
	card_header.class = "card-header";
	card_header_h2 = document.createElement("h2");
	card_header_h2.innerHTML = doc_name[0];
	card_header.appendChild(card_header_h2);
	card.appendChild(card_header);
	card_body = document.createElement("div");
	card_body.class = "card-body";

	/*var progress, pro_bar;
	for(i=1; i<doc_name.length; i++)
	{
		progress = document.createElement("div");
		progress.class = "progress";
		pro_bar = document.createElement("div");
		pro_bar.class = "progress-bar progress-bar-striped progress-bar-animated";
		pro_bar.role = "progressbar";
		pro_bar.style.width = ""+doc_name[i]+"%";
		pro_bar.innerHTML = doc_name[i];
		progress.appendChild(pro_bar);
		card_body.appendChild(progress);
	}*/


	card.appendChild(card_body);
	ranking_space.appendChild(card);

}

