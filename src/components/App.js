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
    this.state = {apiData:[], data:[], showDisabled:false};
    this.handleClick = this.handleClick.bind(this);
    this.setChartData = this.setChartData.bind(this);
  }

  componentDidMount() {

    const url = 'https://api.tfl.gov.uk/Occupancy/CarPark';
    const params = {app_id: appID, app_key: appKey};
    axios.get( url, { params })
	    .then(response => {
	      	/*let data = response.data.map(item => {
            let numFree = item.bays[item.bays.length-1].free;
		        let obj = {};
		        obj['_id'] = item.name;
		        obj['colorValue'] = Math.random(numFree);
		        obj['value'] = numFree;
		        return obj;
          
	      })
        */
      		this.setState( {apiData: response.data} )
          this.setChartData();
    	});
  }

  setChartData () {
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

  handleClick() {
    this.setChartData();
  }

  render() {
     return (
      	<div>
          <a href="#" onClick={this.handleClick}>Change Dataset</a>
      		<SimpleComponent data={this.state.data} colorLegend={colorLegend} />
      	</div>
      )
  }
}

export default App;
