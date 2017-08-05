import React, { Component } from 'react';
import SimpleComponent from './SimpleComponent';
import axios from 'axios';

const appID = '45424d2e';
const appKey = '0c06da185829a08ba97d76499acd69a6';
const location = {
      swLat:'51.0',
      swLon:'-0.1',
      neLon:'0.1',
      neLat:'52.0'
    };

const colorLegend = [
  // reds from dark to light
  "#67000d", "#a50f15", "#cb181d", "#ef3b2c", "#fb6a4a", "#fc9272", "#fcbba1", "#fee0d2",
  //neutral grey
  "#f0f0f0",
  // blues from light to dark
  "#deebf7", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", '#08519c', "#08306b"
];

//var colorScale = ['#f7fcf5','#e5f5e0','#c7e9c0','#a1d99b','#74c476','#41ab5d','#238b45','#006d2c','#00441b'];



class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      allData:[], 
      chartData:[],  
      numOfResults:10
    };

    this.getRange = this.getRange.bind(this);
    this.requestBikePoints = this.requestBikePoints.bind(this);
    this.setChartData = this.setChartData.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }


  componentDidMount() {
    this.requestBikePoints(location);
  }

  getRange(start, end) {
    var foo = [];
    for (var i = start; i <= end; i++) {
        foo.push(i);
    }
    return foo;
  }

/* ---------------------------------------
Specify a hardcoded location
Returns 227 bike points
Default, initial display shows 10 points.
User can change the number of bike points displayed.
--------------------------------------- */
  requestBikePoints(loc){
    //const url = 'https://api.tfl.gov.uk/Place?swLat=51.0&swLon=-0.1&neLon=0.1&neLat=52.0&type=BikePoint'
    const url = 'https://api.tfl.gov.uk/Place';
    const params =  {
      app_id: appID, 
      app_key: appKey,
      swLat:loc.swLat,
      swLon:loc.swLon,
      neLon:loc.neLon,
      neLat:loc.neLat,
      type:'BikePoint'
    };
    axios.get( url, {params})
      .then(response => {
        console.log('hardcoded data: ', response)
        this.setState({allData:response.data})
        this.setChartData();
      })
  }

  setChartData(){
    let chartData=[];
    for (var i=0; i<this.state.numOfResults; i++) {
          let item = this.state.allData[i];
          let numFree = item.additionalProperties[7].value;
        let obj = {};
        obj['_id'] = item.commonName;
        obj['colorValue'] = Math.random(numFree);
          obj['value'] = Math.random(numFree);
          chartData.push(obj);
    }
      this.setState( {chartData});
  }

  onFormSubmit(event){
    event.preventDefault();
    this.setState( { numOfResults:this.state.numOfResults});
    this.setChartData();
    //this.props.fetchResults(this.props.searchTerm);
  }
  

  onInputChange(event){
    this.setState( { numOfResults:event.target.value});
    //this.props.setSearchTerm(event.target.value);
  }

  render() {
     return (
      	<div className="app">
          <h2>Showing {this.state.chartData.length} Nearby Bike Locations</h2>
          <form onSubmit={this.onFormSubmit}>
            <input
              placeholder="Enter search term here"
              value={this.state.numOfResults}
              onChange={this.onInputChange}/>
            <span>
              <button type="submit">Submit</button>
            </span>
          </form>
      		<SimpleComponent data={this.state.chartData} colorLegend={colorLegend} />
      </div>
      )
  }
}

export default App;
