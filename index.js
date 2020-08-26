const svg=d3.select("svg"), padding=200;
const width=svg.attr("width")-padding, height=svg.attr("height")-padding;
const g=svg.append("g").attr("transform","translate("+ 100 +","+ 100 +")");
            
fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
   .then(response=>response.json())
   .then(data=>{
    const xScale = d3.scaleTime()
                     .domain([d3.min(data, d=>new Date(d.Year-1)), d3.max(data, d=>new Date(d.Year+1))])
                     .range([0, width]);
    g.append("g").attr("id","x-axis")
                 .attr("transform","translate(0, "+ height +")")
                 .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));

    const yScale=d3.scaleTime()
                   .domain([d3.min(data, d=>new Date(`2000 01 01 00:${d.Time}`)), d3.max(data, d=>new Date(`2000 01 01 00:${d.Time}`))])
                   .range([0, height]);
    g.append("g").attr("id","y-axis").call(d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S")));

    //Title
    svg.append("text")
        .attr("id","title")
        .attr("transform", 'translate(100, 100)')
        .attr("x", 50)
        .attr("y", -15)
        .attr("font-size", "24px")
        .text("Doping in Professional Bicycle Racing");
    //Time in Minutes
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -120)
        .attr("y", 130)
        .attr("dy", "-5.1em")
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .style("font-size", "15px")
        .text("Time in Minutes");

        const tooltip=d3.select("body").append("div").attr("class","tooltip").attr("id", "tooltip").style("opacity", 0);
  
           g.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("class","dot")
            .attr("cx", d=>xScale(new Date(d.Year)))
            .attr("cy", d=>yScale(new Date(`2000 01 01 00:${d.Time}`)))
            .attr("r", 5)
            .attr("data-xvalue", d=>xScale(new Date(d.Year)))
            .attr("data-yvalue", d=>yScale(new Date(`2000 01 01 00:${d.Time}`)))
            .on("mouseover", d => { 
             tooltip.style("opacity", 0.9);
             tooltip.attr("data-year", xScale(new Date(d.Year)));
             tooltip.html(d.Name + "<br />"+"Year: "+ d.Year + ', Time: ' +d.Time)
            .style("left", d3.event.pageX + "px")
            .style("top", d3.event.pageY - 28 + "px");
            })   
            .on("mouseout", d => {
             tooltip.style("opacity", 0);
            });
     });