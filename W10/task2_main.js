d3.csv("https://226x119x.github.io/InfoVis2022/W10/w10_task2.csv")
    .then( data => {
        data.forEach( d => { d.x = +d.x; d.y = +d.y; });

        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 200,
            margin: {top:30, right:10, bottom:50, left:40}
        };

        const line_chart = new LineChart( config, data );
          line_chart.update();
    })
    .catch( error => {
        console.log( error );
    });

class LineChart {

  constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:10, right:10, bottom:10, left:10}
        }
        this.data = data;
        this.init();
  }

  init() {
      let self = this;

      self.svg = d3.select( self.config.parent )
          .attr('width', self.config.width)
          .attr('height', self.config.height);

      self.chart = self.svg.append('g')
          .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

      self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
      self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

      self.xscale = d3.scaleLinear()
          .range( [0, self.inner_width] );

      self.yscale = d3.scaleLinear()
          .range( [self.inner_height, 0] );

      self.xaxis = d3.axisBottom( self.xscale );

      self.yaxis = d3.axisLeft( self.yscale );

      self.xaxis_group = self.chart.append('g')
          .attr('transform', `translate(0, ${self.inner_height})`);

      self.yaxis_group = self.chart.append('g')
          .attr('transform', `translate(0, 0)`);

      self.label_text = self.chart.append('g')
          .attr('transform', `translate(0, 0)`);

      self.color = d3.scaleOrdinal()
                     .domain(self.data)
                     .range(d3.schemeSet1);
  }

  update() {
        let self = this;

        const xmax = d3.max( self.data, d => d.x );
        self.xscale.domain( [0, xmax] );

        const ymax = d3.max( self.data, d => d.y );
        self.yscale.domain( [0, ymax] );

        self.render();
  }

  render() {
      let self = this;

      let circles = self.chart.selectAll('circle')
                       .data(self.data)
                       .enter()
                       .append('circle');

      circles
          .attr('cx', d => self.xscale(d.x))
          .attr('cy', d => self.yscale(d.y))
          .attr('r', d => 7)
          .attr("fill", function(d) {
            return self.color(d.x);
          });

      circles
          .on('mouseover', (e,d) => {
              d3.select('#tooltip')
                .style('opacity', 1)
                .html(`<div class="tooltip-label">Position</div>(${d.x}, ${d.y})`);
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
           });

      self.xaxis_group
          .call( self.xaxis )
          .append("text")
          .attr("fill", "black")
          .attr("x", self.inner_width / 2)
          .attr("y", 30)
          .attr("text-anchor", "middle")
          .attr("font-size", "9pt")
          .attr("font-weight", "bold")
          .text("X-axis");

      self.yaxis_group
          .call( self.yaxis )
          .append("text")
          .attr("fill", "black")
          .attr("x", -(self.inner_height / 2))
          .attr("y", -30)
          .attr("text-anchor", "middle")
          .attr("font-size", "9pt")
          .attr("transform", "rotate(-90)")
          .attr("font-weight", "bold")
          .text("Y-axis");

      self.label_text
          .append("text")
          .attr("x", self.inner_width / 2)
          .attr("y", -13)
          .attr("text-anchor", "middle")
          .attr("font-size", "14pt")
          .attr("font-weight", "bold")
          .text("Scatter Plot");
  }
}
