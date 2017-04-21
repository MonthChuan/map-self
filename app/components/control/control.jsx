import './control.css';
import React from 'react';  
import { Button, Input } from 'antd';   

const Search = Input.Search;

export default class Control extends React.Component{
	constructor(props) {
		super(props);
		this.state = null;
		this.drawLine = this.drawLine.bind(this);
		this.drawPloy = this.drawPloy.bind(this);
		this.seachStore = this.seachStore.bind(this);
	}
	//点击之前先获取map对象
	clickInit() {
		if(!this.state) {
			this.state = this.props.getData();
		}
	}
	//画线
	drawLine(evt) {
		this.clickInit();
		this.state.ffmap.startPolyline();
	}
	
	//画面
	drawPloy() {
		this.clickInit();
		this.state.ffmap.startPolygon();
	}

	//合并
	//搜索店铺
	seachStore(value) {
		this.clickInit();
		let stores = [];

		if(/^[0-9]*$/.test(value)) {
			stores = this.state.ffmap.searchStoreByID(value);
		}
		else {
			stores = this.state.ffmap.serachStoreByName(value);
		}
		stores.forEach(function(store, i) {
			store.selected = true;
		});
	}
	render() {
		return (
			<div className="control">
				<Button type="primary" onClick={this.drawLine}>线</Button><br />
				<Button type="primary" onClick={this.drawPloy}>面</Button><br />
				<Button type="primary">合并</Button><br />
				<Search
					placeholder="搜索店铺"
					style={{ width: 100 }}
					onSearch={this.seachStore}
				/>
			</div>
		);
	}
}

// export default Login;

