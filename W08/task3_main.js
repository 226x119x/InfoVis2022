d3.csv("https://226x119x.github.io/InfoVis2022/W08/w08_task1.csv")
    .then( data => {
        data.forEach( d => { d.label = d.label; d.value = +d.value; });

        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 128,
            radius: Math.min( width, height ) / 2,
            margin: {top:10, right:10, bottom:20, left:60}
        };

        const scatter_plot = new PieChart( config, data );
          scatter_plot.update();
    })
    .catch( error => {
        console.log( error );
    });

class PieChart {

  constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            radius: config.radius || Math.min( width, height ) / 2,
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
          //.attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);
          .attr('transform', `translate(${width/2}, ${height/2})`);

      self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
      self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

      self.xscale = d3.scaleLinear()
          .range( [0, self.inner_width] );

      self.yscale = d3.scaleLinear()
          .range( [self.inner_height, 0] );

      self.xaxis = d3.axisBottom( self.xscale )
          .ticks(17);

      self.yaxis = d3.axisLeft( self.yscale )
          .ticks(8);

      self.xaxis_group = self.chart.append('g')
          .attr('transform', `translate(0, ${self.inner_height})`);

      self.yaxis_group = self.chart.append('g')
          .attr('transform', `translate(0, 0)`);

      self.label_text = self.chart.append('g')
          .attr('transform', `translate(0, 0)`);
  }

  update() {
        let self = this;

        const xmin = d3.min( self.data, d => d.x );
        const xmax = d3.max( self.data, d => d.x );
        //self.xscale.domain( [xmin, xmax] );
        self.xscale.domain( [0, xmax] );

        const ymin = d3.min( self.data, d => d.y );
        const ymax = d3.max( self.data, d => d.y );
        //self.yscale.domain( [ymin, ymax] );
        self.yscale.domain( [0, ymax] );

        self.render();
  }

  render() {
      let self = this;

      const pie = d3.pie()
                    .value( d => d.value)

      const arc = d3.arc()
                    .innerRadius(0)
                    .outerRadius(radius);

      self.chart.selectAll("pie")
          .data(self.data)
          .enter()
          .append("path")
          .attr('d', arc)
          .attr('fill', 'black')
          .attr('stroke', 'white')
          .style('stroke-width', '2px');

      self.xaxis_group
          .call( self.xaxis );

      self.yaxis_group
          .call( self.yaxis );
  }
}
