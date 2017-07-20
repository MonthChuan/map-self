import './rightbar.css';
import React from 'react';  
import { connect } from 'react-redux';

import { Select } from 'antd'; 
const Option = Select.Option; 

class RightBar extends React.Component{
	constructor(props) {
		super(props);

		this.handleChange = this.handleChange.bind(this);
	}

	// componentDidMount() {
	// 	if(this.props.map.floor) {

	// 	}
	// }

	handleChange(event) {
		const id = event.key;
		const name = event.label;
		const list = this.props.map.ffmap.searchStoreByID(id);

		if(list.length > 0) {
			// let center = list[0].feature.getCenter();
			// let marker = new FMap.Marker(center);
			// this.props.map.ffmap.addOverlay(marker)

			list[0].feature.bindPopup(name, {
				autoClose : true,
				keepInView : true
			});
			list[0].feature.openPopup();
		}
	}

	render() {
		let selectTpl = '';
		if(this.props.map.floor.length > 0) {
			let storelistTpl = [];
			this.props.map.floor.forEach(function(item) {
				if(item.properties.re_name && item.id) {
					storelistTpl.push(<Option key={item.id} value={item.id}>{item.properties.re_name}</Option>);
				}
			});
			selectTpl = <Select
					labelInValue
					showSearch
					className="rightbar-select"
					size="large"
					placeholder="搜索商铺"
					optionFilterProp="children"
					onChange={this.handleChange}
					filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
				>
					{storelistTpl}
				</Select>;
		}
		return (
			<div className="rightbar-wrap">
				{selectTpl}
			</div>
		);
	}
}

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps)(RightBar);

