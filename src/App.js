import React, { Component } from 'react';
import './App.css';

const ReactHighcharts = require('react-highcharts'); // Expects that Highcharts was loaded in the code.
const axios = require('axios');


let topicData = [], reasonData = [], topicReasonData = [];
let topicChartData = [], reasonChartData = [], topicReasonChartData = [], listOfCategories = [];
let serviceUrl = "https://sentimentanalysis.cfapps.io";
//let serviceUrl = "http://localhost:8080";

class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			topicData: [],
			reasonData: [],
			topicReasonData: []
		};
		axios.get(serviceUrl + '/getTopicData')
			.then(response => {
				console.log(response.data);
				topicData = response.data;

				console.log(topicChartData);
				axios.get(serviceUrl + '/getReasonData')
					.then(response => {
						console.log(response.data);
						reasonData = response.data;
						console.log(reasonChartData);
						axios.get(serviceUrl + '/getTopicReasonData?topicMaxCount=5')
							.then(response => {
								console.log(response.data);
								topicReasonData = response.data;
								console.log(topicReasonData);
								this.setState({
									topicData: topicData,
									reasonData: reasonData,
									topicReasonData: topicReasonData
								});
							})
							.catch(function (error) {
								console.log(error);
							});
					})
					.catch(function (error) {
						console.log(error);
					})
			})
			.catch(function (error) {
				console.log(error);
			})
	}

	render() {
		const { topicData, reasonData, topicReasonData } = this.state;
		console.log(topicReasonData);

		topicData.forEach(function (topic) {
			topicChartData.push({
				//"x": topic['topicName'],
				"y": topic['counter'],
				"name": topic['topicName']
			});
		});
		reasonData.forEach(function (reason) {
			reasonChartData.push({
				"y": reason['counter'],
				"name": reason['reasonName']
			});
		});
		let topicOptions = {
			chart: {
				type: 'column'
			},
			title: {
				text: 'Topic count map chart'
			},
			xAxis: {
				type: 'category',
				labels: {
					rotation: -45,
					style: {
						fontSize: '13px',
						fontFamily: 'Verdana, sans-serif'
					}
				}
			},
			yAxis: {
				min: 0,
				title: {
					text: 'Count (number)'
				}
			},
			legend: {
				enabled: false
			},
			tooltip: {
				pointFormat: 'Count: <b>{point.y:.1f}</b>'
			},
			series: [{
				type: 'column',
				name: 'TopicCount',
				data: topicChartData

			}]
		}

		let reasonOptions = {
			chart: {
				type: 'column'
			},
			title: {
				text: 'Reason count map chart'
			},
			xAxis: {
				type: 'category',
				labels: {
					rotation: -45,
					style: {
						fontSize: '13px',
						fontFamily: 'Verdana, sans-serif'
					}
				}
			},
			yAxis: {
				min: 0,
				title: {
					text: 'Count (number)'
				}
			},
			legend: {
				enabled: false
			},
			tooltip: {
				pointFormat: 'Count: <b>{point.y:.1f}</b>'
			},
			series: [{
				name: 'ReasonCount',
				data: reasonChartData
			}]
		}

		let chartTopicReasonData = {
			"categoryList": [],
			"seriesDataList": []
		};
		if (topicReasonData != null) {
			chartTopicReasonData = topicReasonData["topicReasonChartData"];
			console.log(topicReasonData);
		}

		console.log(chartTopicReasonData);


		let topicReasonOptions = {
			chart: {
				type: 'bar'
			},
			title: {
				text: 'Topic Reason Rating - Sentiment Analysis'
			},
			subtitle: {
				text: ''
			},
			xAxis: {
				categories: chartTopicReasonData && chartTopicReasonData["categoryList"],
				title: {
					text: null
				}
			},
			yAxis: {
				min: 0,
				title: {
					text: 'Topic Names',
					align: 'high'
				},
				labels: {
					overflow: 'justify'
				}
			},
			tooltip: {
				valueSuffix: ' comments'
			},
			plotOptions: {
				bar: {
					dataLabels: {
						enabled: true
					}
				}
			},
			credits: {
				enabled: false
			},
			series: chartTopicReasonData && chartTopicReasonData["seriesDataList"]
		}

		return (
			<div>
				<ReactHighcharts config={topicReasonOptions}></ReactHighcharts>
				{/* <ReactHighcharts config={topicOptions}></ReactHighcharts>
				<ReactHighcharts config={reasonOptions}></ReactHighcharts> */}
				{/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
			</div>
		);
	}
}

export default App;
