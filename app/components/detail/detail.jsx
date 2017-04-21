import './detail.css';
import React from 'react';  
import { Input, Select } from 'antd'; 
const Option = Select.Option;
const typelist = [
	{name : "礼品店", code : "060403"},
	{name : "儿童用品店", code : "060404"},
	{name : "购物中心", code : "060405"},
	{name : "服装店", code : "060406"}
];

export default class Detail extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			store : this.props.store,
			map : null
		};
	}

	//先获取map对象
	setValue(option) {
		if(!this.state.map) {
			this.setState(this.props.getData());
		}
	}

	selectChange() {}
	render() {
		// console.log(this.props.store)
		return (
			<div className="detail-wrapper">
				<p className="title">编辑器</p>
				<div className="line">
					<label>名称：</label>
					<Input style={{ width: 130 }} placeholder="店铺名称" value={this.state.store._name || "defaultvalue"} onChange={this.selectChange} />
				</div>
				<div className="line">
					<label>类型：</label>
					<Select defaultValue="dd" style={{ width: 130 }} onChange={this.selectChange}>
						<Option value="Yiminghe">yiminghe</Option>
					</Select>
				</div>
			</div>
		);
	}
}

// export default Login;

