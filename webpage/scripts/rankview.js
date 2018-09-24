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