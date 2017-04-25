import './detail.css';
import React from 'react';  
import { Input, Select } from 'antd'; 
const Option = Select.Option;
const typelist = [
	{name : "便利店", code : "060401"},
	{name : "礼品店", code : "060403"},
	{name : "儿童用品店", code : "060404"},
	{name : "购物中心", code : "060405"},
	{name : "服装店", code : "060406"}
];

export default class Detail extends React.Component{
	constructor(props) {
		super(props);
		this.state = this.props.state;

		this.selectChange = this.selectChange.bind(this);
		this.selectChangeName = this.selectChangeName.bind(this);
	}


	selectChangeName(event) {
		const { value } = event.target;

		this.props.editStore({'name' : value});
	}

	selectChange(value) {
		this.props.editStore({ 'regionType' : value});
	}

	render() {
		const typelistTpl = typelist.map(function(item) {
			return <Option key={item.code} value={item.code}>{item.name}</Option>
		});

		return (
			<div className="detail-wrapper">
				<p className="title">编辑器</p>
				<div className="line">
					<label>名称：</label>
					<Input style={{ width: 130 }} placeholder="店铺名称" value={(this.props.state.store && this.props.state.store.name) || "店铺名称"} onChange={this.selectChangeName} />
				</div>
				<div className="line">
					<label>类型：</label>
					<Select value={(this.props.state.store && this.props.state.store.regionType) || "店铺类型"}  style={{ width: 130 }} onChange={this.selectChange}>
						{typelistTpl}
					</Select>
				</div>
			</div>
		);
	}
}

// export default Login;

