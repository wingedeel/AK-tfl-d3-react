/* ---------------------------------------
Specify a hardcoded location
Returns 227 bike points
Default, initial display shows 10 points.
User can change the number of bike points displayed.
--------------------------------------- */

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

const colorLegend = ['#f7fcf5','#e5f5e0','#c7e9c0','#a1d99b','#74c476','#41ab5d','#238b45','#006d2c','#00441b'];



class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      allData:[], 
      chartData:[],  
      numOfResults:25
    };

    this.requestData = this.requestData.bind(this);
    this.setChartData = this.setChartData.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }


  componentDidMount() {
    this.requestData('BikePoint',location);
  }



  requestData(type, loc){
    //const url = 'https://api.tfl.gov.uk/Place?swLat=51.0&swLon=-0.1&neLon=0.1&neLat=52.0&type=BikePoint'
    const url = 'https://api.tfl.gov.uk/Place';
    const params =  {
      app_id: appID, 
      app_key: appKey,
      swLat:loc.swLat,
      swLon:loc.swLon,
      neLon:loc.neLon,
      neLat:loc.neLat,
      type
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
        let obj = {};
        let item = this.state.allData[i];
        let numFree = item.additionalProperties[7].value;
        obj['_id'] = item.commonName;
        obj['numFree'] = numFree;
        obj['colorValue'] = numFree*100;
        obj['value'] = numFree;
        chartData.push(obj);
    }
    this.setState( {chartData});
  }

  onFormSubmit(event){
    event.preventDefault();
    this.setChartData();
  }
  

  onInputChange(event){
    let max = this.state.allData.length;
    let num = event.target.value>max ? max : event.target.value;
    this.setState( { numOfResults:num});
  }

  render() {
     return (
      	<div className="app">
          <h1>London Bike Points - places free</h1>
          <h4>Using data from the TfL Unified API</h4>
          <form className="form" onSubmit={this.onFormSubmit}>
            <span>Number of results to show?  </span>
            <input
              placeholder="Enter number here"
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
