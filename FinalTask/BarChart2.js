class BarChart2 {
    constructor (config, data, chart, xscale) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:10, right:10, bottom:10, left:10},
            ylabel: config.ylabel || ''
        };
        this.data = data;
        this.chart = chart;
        this.xscale = xscale;
        this.plot_flag = 1;
        this.init();
    }

    init() {
        let self = this;

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.yscale = d3.scaleLinear()
            .range([self.inner_height, 0]);

        self.xaxis = d3.axisBottom(self.xscale)
            .tickFormat(d3.timeFormat("%Y"));

        self.yaxis = d3.axisLeft(self.yscale);

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);

        self.yaxis_group = self.chart.append('g')
            .attr('transform', `translate(${self.inner_width + 7}, 0)`);

        self.clip = self.chart.append("defs").append("svg:clipPath")
            .attr("id", "clip")
            .append("svg:rect")
            .attr("width", self.inner_width )
            .attr("height", self.inner_height )
            .attr("x", 0)
            .attr("y", 0);

         self.text_group = self.chart.append("g");
    }

    update() {
        let self = this;

        self.yscale.domain([0,
          d3.max(self.data, function(d){return d.infected;})
        ]);

        self.render();
    }

    render() {
        let self = this;

      self.chart.append("g")
          .attr("clip-path", "url(#clip)")
          .selectAll(".covbar")
          .append("g")
          .data(self.data)
          .join("rect")
          .attr("class", "covbar")
          .attr("x", d => self.xscale( d.date ) )
          .attr("y", d => self.yscale( d.infected) )
          .attr("width", 2)
          .attr("height", d => self.inner_height - self.yscale( d.infected ))
          .attr("fill", "steelblue")
          .on('mouseover', (e,d) => {
                d3.select('#tooltip')
                    .style('opacity', 1)
                    .html(`<div class="tooltip-label">Date: ${d.date.getFullYear()}/${d.date.getMonth()+1}/${d.date.getDate()}</div>Number: ${d.infected}`);
            })
            .on('mousemove', (e) => {
                const padding = 10;
                d3.select('#tooltip')
                    .style('left', (e.pageX + padding) + 'px')
                    .style('top', (e.pageY + padding) + 'px');
            })
            .on('mouseleave', () => {
                d3.select('#tooltip')
                    .style('opacity', 0);
            });;

      self.text_group.append('text')
          .attr("class", "text")
          .style('font-size', '15px')
          .attr('transform', `rotate(90)`)
          .attr('y', -(self.inner_width + 27))
          .attr('x', self.config.width / 4 - 50)
          .attr('text-anchor', 'middle')
          .attr('dy', '1em')
          .text( self.config.ylabel );

        self.yaxis_group.append("g")
            .attr("class", "axis axis--y")
            .call(self.yaxis);
    }

    replot(){
      let self = this;

      if(self.plot_flag == 1){
        self.chart.selectAll(".covbar")
                  .remove();

        self.text_group.selectAll(".text")
                        .remove();

        self.yaxis_group.select(".axis--y")
                        .remove();

        self.render();
      }
        else{}
    }

    display(){
      let self = this;

      if(self.plot_flag == 1){
        self.chart.selectAll(".covbar")
                  .remove();

        self.text_group.selectAll(".text")
                  .remove();

        self.yaxis_group.select(".axis--y")
                  .remove();

        self.plot_flag = 0;
      }
      else{
        self.render();

        self.plot_flag = 1;
      }
    }
}
