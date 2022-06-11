let price_data;
let rate_data;
let amount_data;
let infected_data;
let area_chart;
let line_chart;
let bar_chart;
let bar_chart2;
let x_coordinate;

const color_scale = d3.scaleOrdinal( d3.schemeCategory10 );
//color_scale.domain(['setosa','versicolor','virginica']);*/
const parseTime = d3.timeParse("%Y-%m");
const parseTime2 = d3.timeParse("%Y");
const parseTime3 = d3.timeParse("%Y/%m/%e");

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

        area_chart = new AreaChart0( {
            parent: '#drawing_region_areachart',
            width: 1200,
            height: 500,
            margin1: {top:20, right:50, bottom:110, left:60},
            margin2: {top:430, right:20, bottom:30, left:40},
            xlabel: 'Date',
            ylabel: 'Price[gram/yen]'
        }, price_data,);
        area_chart.update();
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
           d.United_States = +d.United_States;
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

        bar_chart = new BarChart0( {
            parent: '#drawing_region_areachart',
            width: 1000,
            height: 500,
            //margin: {top:10, right:10, bottom:50, left:50},
            margin: {top:20, right:30, bottom:110, left:40},
            ylabel: 'Production[ton]',
            cscale: color_scale
        }, amount_data, area_chart.returnChart(), area_chart.returnXscale() );
        bar_chart.update();
    })
    .catch( error => {
        console.log( error );
    });

    //データを読み込み代入：covid19
    d3.csv("https://226x119x.github.io/InfoVis2022/FinalTask/covid19_data.csv")
    .then( data => {
       infected_data = data;
       infected_data.forEach( d => {
           d.date = parseTime3(d.date);
           d.infected = +d.infected;
        });

        bar_chart2 = new BarChart2( {
            parent: '#drawing_region_areachart',
            width: 1000,
            height: 500,
            //margin: {top:10, right:10, bottom:50, left:50},
            margin: {top:20, right:30, bottom:110, left:40},
            ylabel: 'The number of people',
            cscale: color_scale
        }, amount_data, area_chart.returnChart(), area_chart.returnXscale() );
        bar_chart2.update();
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

        line_chart = new LineChart0( {
            parent: '#drawing_region_linechart',
            width: 960,
            height: 500,
            //margin: {top:10, right:10, bottom:50, left:50},
            margin: {top:20, right:20, bottom:110, left:40},
            ylabel: 'Exchange rate[dollar-yen]',
            cscale: color_scale
        }, rate_data, area_chart.returnChart(), area_chart.returnXscale() );
        line_chart.update();
    })
    .catch( error => {
        console.log( error );
    });

    //ボタンイベント
    d3.select('#rink')
        .on('click', function(){
          x_coordinate = area_chart.coordinate();
          bar_chart.replot(x_coordinate);
          line_chart.replot(x_coordinate);
        });
    d3.select('#exchangerate')
        .on('click', function(){
          line_chart.display();
        });
    d3.select('#production')
        .on('click', function(){
          bar_chart.display();
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
