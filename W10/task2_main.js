d3.csv("https://226x119x.github.io/InfoVis2022/W10/w10_task2.csv")
    .then( data => {
        data.forEach( d => { d.x = +d.x; d.y = +d.y; });

        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 150,
            margin: {top:20, right:20, bottom:20, left:30}
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
  }

  update() {
        let self = this;

        //const xmin = d3.min( self.data, d => d.x );
        const xmax = d3.max( self.data, d => d.x );
        //self.xscale.domain( [xmin, xmax] );
        self.xscale.domain( [0, xmax] );

        //const ymin = d3.min( self.data, d => d.y );
        const ymax = d3.max( self.data, d => d.y );
        //self.yscale.domain( [ymin, ymax] );
        self.yscale.domain( [0, ymax] );

        self.render();
  }

  render() {
      let self = this;

      const line = d3.line()
                     .x( d => self.xscale(d.x) )
                     .y( d => self.yscale(d.y) );

      const area = d3.area()
                     .x( d => self.xscale(d.x) )
                     .y1( d => self.yscale(d.y) )
                     .y0( d3.max(self.data, d => d.y ) + 10 );//10はおそらくmargine

      self.chart.selectAll("circle")
                .data(self.data)
                .enter()
                .append("circle")
                .attr("cx", d => self.xscale( d.x ) )
                .attr("cy", d => self.yscale( d.y ) )
                .attr("r", 10 );

      self.xaxis_group
          .call( self.xaxis );

      self.yaxis_group
          .call( self.yaxis );
  }
}
