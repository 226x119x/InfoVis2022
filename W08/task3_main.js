d3.csv("https://226x119x.github.io/InfoVis2022/W08/w08_task1.csv")
    .then( data => {
        data.forEach( d => { d.label = d.label; d.value = +d.value; });

        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 256,
            radius: Math.min( 256, 256 ) / 2,
            margin: {top:10, right:10, bottom:20, left:60}
        };

        const pie_chart = new PieChart( config, data );
          pie_chart.update();
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
            radius: config.radius || Math.min( 256, 256 ) / 2,
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
          .attr('transform', `translate(${self.config.width/2}, ${self.config.height/2})`);

      self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
      self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;
  }

  update() {
        let self = this;
        self.render();
  }

  render() {
      let self = this;

      const pie = d3.pie()
                    .value( d => d.value );

      const arc = d3.arc()
                    .innerRadius(self.config.radius / 2)//ドーナツチャート
                    .outerRadius(self.config.radius);

      var color = d3.scaleOrdinal()
                    .domain(self.data)
                    .range(d3.schemeSet2);

      self.chart.selectAll("pie")
          .data( pie(self.data) )
          .enter()
          .append("path")
          .attr('d', arc)
          .attr("fill", function(d) {
            return color(d.data.label);
        })
          .attr('stroke', 'white')
          .style('stroke-width', '2px');

      self.chart.selectAll('text')
                .data( pie(self.data) )
                .enter()
                .append('text')
                .text(function(d){ return d.data.label})
                .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")";  })
                .style("text-anchor", "middle")
                .style("font-size", 15)
  }
}
