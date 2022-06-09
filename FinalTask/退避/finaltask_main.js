let price_data;
let rate_data;
let amount_data;
let area_chart;
let line_chart;
let bar_chart;
let x_coordinate;

const color_scale = d3.scaleOrdinal( d3.schemeCategory10 );
//color_scale.domain(['setosa','versicolor','virginica']);*/
const parseTime = d3.timeParse("%Y-%m");
const parseTime2 = d3.timeParse("%Y");

/*データを読み込み代入：rate
d3.csv("https://226x119x.github.io/InfoVis2022/FinalTask/gold_rate.csv")
    .then( data => {
        rate_data = data;
        rate_data.forEach( d => {
            d.date = parseTime(d.date);
            d.exchangerate = +d.exchangerate;
        });
    })
    .catch( error => {
        console.log( error );
    });*/

//データを読み込み代入：price
  d3.csv("https://226x119x.github.io/InfoVis2022/FinalTask/gold_price.csv")
    .then(data => {
      price_data = data;
      price_data.forEach( d => {
          d.date = parseTime(d.date);
          d.price = +d.price;
      });
        //console.log(price_data);
        //console.log(price_data.price);
        //console.log(rate_data);

        area_chart = new AreaChart( {
            parent: '#drawing_region_areachart',
            width: 960,
            height: 500,
            margin1: {top:20, right:20, bottom:110, left:40},
            margin2: {top:430, right:20, bottom:30, left:40},
            xlabel: 'Species',
            cscale: color_scale
        }, price_data,);
        area_chart.update();
    })
    .catch( error => {
        console.log( error );
    });

    //データを読み込み代入：rate
    d3.csv("https://226x119x.github.io/InfoVis2022/FinalTask/gold_rate.csv")
    .then( data => {
       rate_data = data;
       rate_data.forEach( d => {
           d.date = parseTime(d.date);
           d.exchangerate = +d.exchangerate;
        });

        line_chart = new LineChart( {
            parent: '#drawing_region_linechart',
            width: 256,
            height: 256,
            margin: {top:10, right:10, bottom:50, left:50},
            xlabel: 'Species',
            cscale: color_scale
        }, rate_data, );
        line_chart.update();
    })
    .catch( error => {
        console.log( error );
    });

    //データを読み込み代入：amount
    d3.csv("https://226x119x.github.io/InfoVis2022/FinalTask/gold_amount.csv")
    .then( data => {
       amount_data = data;
       amount_data.forEach( d => {
           d.year = parseTime2(d.year);
           d.United_States = d.United_States;
           d.Australia = +d.Australia;
           d.Canada = +d.Canada;
           d.China = +d.China;
           d.Ghana = +d.Ghana;
           d.Indonesia = +d.Indonesia;
           d.Mexico = +d.Mexico;
           d.Peru = +d.Peru;
           d.Russia = +d.Russia;
           d.South_Africa = +d.South_Africa;
           d.Uzbekistan = +d.Uzbekistan;
        });
        console.log(amount_data)

        bar_chart = new BarChart( {
            parent: '#drawing_region_linechart',
            width: 256,
            height: 256,
            margin: {top:10, right:10, bottom:50, left:50},
            xlabel: 'Species',
            cscale: color_scale
        }, amount_data, );
        bar_chart.update();
    })
    .catch( error => {
        console.log( error );
    });

    //ボタンイベント
    d3.select('#rink')
        .on('click', function(){
          x_coordinate = area_chart.coordinate();
          line_chart.replot(x_coordinate);
        });

//開発予定地
function RangeChanger() {
    if ( filter.length == 0 ) {
        scatter_plot.data = input_data;
    }
    else {
        scatter_plot.data = input_data.filter( d => filter.includes( d.species ) );
    }
    scatter_plot.update();
}
