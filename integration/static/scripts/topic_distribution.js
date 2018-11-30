// $("#grid").click(function() {

function topic_click(topic_filename,id){
    DATA_FOLDER = window.localStorage.getItem("DATA_FOLDER");
    var filename = DATA_FOLDER+topic_filename;
    console.log(filename);
    d3.csv(filename, function(data) {

        d3.select("#" + id)
            .selectAll("*")
            .remove();

        var topic = [];
        for (var i = 0; i < 20; i++) {
            topic[i] = {
                "Name": data[i].word,
                "Value": data[i].value
            };
        }

        topic = topic.sort(function(x,y){
            return d3.ascending(x.Value,y.Value);
        })

        var margin = {
            left: 85,
            right: 5,
            top: 5,
            bottom: 5
        };

        var width = 200 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;

        var svg = d3.select("#" + id)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            

        var x = d3.scaleLinear()
            .range([0, width])
            .domain([0, d3.max(topic, function(d) {
                return d.Value;
            })]);

        var y = d3.scaleBand()
            .range([height, 0])
            .domain(topic.map(function(d) {
                return d.Name;
            }))
            .padding(0.5);

        svg.append("g")
            .call(d3.axisLeft(y));   

        svg.selectAll(".bar")
            .data(topic)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("fill","#ff8533")
            .attr("width", function(d) {
                return x(d.Value);
            })
            .attr("height", y.bandwidth()+2)
            .attr("y", function(d) {
                return y(d.Name);
            });
    });
}