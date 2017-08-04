import React, { Component } from 'react';
import SimpleComponent from './SimpleComponent';
import axios from 'axios';

const appID = '45424d2e';
const appKey = '0c06da185829a08ba97d76499acd69a6';

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
    this.state = {hardcodedData:[], apiData:[], data:[], startIndex:0, endIndex:10, showDisabled:false};
    this.handleClick = this.handleClick.bind(this);
    //this.setChartData = this.setChartData.bind(this);
    //this.requestCarParkData = this.requestCarParkData.bind(this);
    //this.receivedCarParkData = this.receivedCarParkData.bind(this);
    this.getRange = this.getRange.bind(this);
    //this.requestMultipleBikePoints = this.requestMultipleBikePoints.bind(this);
    //this.requestBikePoint = this.requestBikePoint.bind(this);
    //this.receivedBikePointData = this.receivedBikePointData.bind(this);
    //this.setBikeChartData = this.setBikeChartData.bind(this);
    this.requestBikePointsAtLocation = this.requestBikePointsAtLocation.bind(this);
    this.requestHardcodedBikePoint = this.requestHardcodedBikePoint.bind(this);
    this.requestMultipleHardcodedBikePoints = this.requestMultipleHardcodedBikePoints.bind(this);
    this.receivedHardcodedBikePointData = this.receivedHardcodedBikePointData.bind(this);
    this.setHardcodedBikeChartData = this.setHardcodedBikeChartData.bind(this);
  }

  componentDidMount() {
    //this.requestCarParkData(this.receivedCarParkData);
    //this.requestMultipleBikePoints(1,30);
    this.requestBikePointsAtLocation();
  }

/*
  requestCarParkData(callback) {
    const url = 'https://api.tfl.gov.uk/Occupancy/CarPark';
    const params = {app_id: appID, app_key: appKey};
    axios.get( url, {params})
      .then(response => {
        callback(response.data);
      })
  }

  receivedCarParkData(data) {
    console.log('receivedCarParkData ', data);
    this.setState( {apiData: data} )
    this.setChartData();
  }
*/


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
  requestBikePointsAtLocation(){
    const url = 'https://api.tfl.gov.uk/Place?swLat=51.0&swLon=-0.1&neLon=0.1&neLat=52.0&type=BikePoint'
    const params = {app_id: appID, app_key: appKey};
    axios.get( url, {params})
      .then(response => {
        console.log('hardcoded data: ', response)
        this.setState({hardcodedData:response.data})
        this.requestMultipleHardcodedBikePoints();
      })
  }

  requestMultipleHardcodedBikePoints(){
    let chartData=[];
    for (var i=0; i<this.state.endIndex; i++) {
          //this.requestHardcodedBikePoint(i, this.receivedHardcodedBikePointData);
          let item = this.state.hardcodedData[i];
          let numFree = item.additionalProperties[7].value;
        let obj = {};
        obj['_id'] = item.commonName;
        obj['colorValue'] = Math.random(numFree);
          obj['value'] = Math.random(numFree);
          chartData.push(obj);
    }
      this.setState( {data:chartData});
  }

  requestHardcodedBikePoint (index, callback) {
    const bpId = this.state.hardcodedData[index].id;
    const url = 'https://api.tfl.gov.uk/BikePoint/'+ bpId;
    const params = {app_id: appID, app_key: appKey};
    axios.get( url, {params})
      .then(response => {
        callback(response.data);
      })
  }

  receivedHardcodedBikePointData(data) {
    console.log('receivedBikePointData ', data);
    //console.log('apiData ', this.state.hardcodedData)
    let newData = Array.from(this.state.data);
    newData.push(data);
    this.setState( {data: newData})
     console.log('new data length', newData.length);
    this.setHardcodedBikeChartData();
  }


  setHardcodedBikeChartData () {
    console.log('*************')
    console.log('this.state.data ', this.state.data.length);
    // Toggle the showDisabled property
    let chartData = this.state.data.map(item => {
      console.log('item', item);
        let numFree = item.additionalProperties[7].value;
        
        let obj = {};
        obj['_id'] = item.commonName;
        obj['colorValue'] = Math.random(numFree);
        if (!this.state.showDisabled) {
          obj['value'] = numFree*100;
        } else {
          obj['value'] = Math.random(numFree);
        }
        return obj;
    })
    this.setState( { data: chartData });
  }
/*
  requestMultipleBikePoints(start, end) {
    let range = this.getRange(start,end); 
    for (var i=0; i<range.length; i++) {
      this.requestBikePoint(range[i], this.receivedBikePointData);
    }
  }

  requestBikePoint (index, callback) {
    const bpId = 'BikePoints_' + (index);
    const url = 'https://api.tfl.gov.uk/BikePoint/'+ bpId;
    const params = {app_id: appID, app_key: appKey};
    axios.get( url, {params})
      .then(response => {
        callback(response.data);
      })
  }

  receivedBikePointData(data) {
    console.log('receivedBikePointData ', data);
    console.log('apiData ', this.state.apiData)
    let newData = Array.from(this.state.apiData);
    newData.push(data);
    this.setState( {apiData: newData})
    // console.log('apiData ', apiData);
    this.setBikeChartData();
  }


  setBikeChartData () {
    // Toggle the showDisabled property
    let data = this.state.apiData.map(item => {
        let numFree = item.additionalProperties[7].value;
        let obj = {};
        obj['_id'] = item.commonName;
        obj['colorValue'] = Math.random(numFree);
        if (!this.state.showDisabled) {
          obj['value'] = numFree*100;
        } else {
          obj['value'] = Math.random(numFree);
        }
        return obj;
    })
    this.setState( { data });
  }
*/
/*
  setChartData () {
    // Toggle the showDisabled property
    this.setState ({ showDisabled:!this.state.showDisabled }) 
    let data = this.state.apiData.map(item => {
        let numFree = item.bays[item.bays.length-1].free;
        let obj = {};
        obj['_id'] = item.name;
        obj['colorValue'] = Math.random(numFree);
        if (!this.state.showDisabled) {
          obj['value'] = numFree*100;
        } else {
          obj['value'] = Math.random(numFree);
        }
        return obj;
    })
    this.setState( { data });
  }
*/
  handleClick() {
    //this.setChartData();
    this.setState( { endIndex:this.state.endIndex+10});
    this.requestMultipleHardcodedBikePoints();
    //this.requestMultipleBikePoints(this.state.startIndex,this.state.endIndex);
  }

  render() {
     return (
      	<div>
          <a href="#" onClick={this.handleClick}>Change Dataset</a>
          <h2>Showing {this.state.data.length} Nearby Bike Locations</h2>
      		<SimpleComponent data={this.state.data} colorLegend={colorLegend} />

      	</div>
      )
  }
}

export default App;
