import './detail.css';
import React from 'react';  
import { Input, Select, Tabs } from 'antd'; 
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const Search = Input.Search;
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
		this.clickStore = this.clickStore.bind(this);
		this.searchStore = this.searchStore.bind(this);
	}

	selectChangeName(event) {
		const { value } = event.target;

		this.props.editStore({'name' : value});
	}

	selectChange(value) {
		this.props.editStore({ 'regionType' : value});
	}

	clickStore(event) {
		const id = event.target.value;
		const s = this.props.state.ffmap.searchStoreByID(id);
		
		if(s[0].selected) {
			return;
		}
		s[0].selected = true;
		const timer = setTimeout(function() {
			s[0].selected = false;
			clearTimeout(timer);
		}, 3000);
	}

	searchStore(value) {
		const ulNode = this.refs.storeList;
		const listNode = ulNode.children;
		const filterNode = [];

		for(let i = 0, len = listNode.length; i < len; i++) {
			listNode[i].className = '';
			if(listNode[i].textContent.toLowerCase().indexOf(value.toLowerCase()) > -1) {
				filterNode.push(listNode[i])
			}
		}
		
		filterNode.map(function(item) {
			ulNode.insertBefore(item, listNode[0]);
			item.className = 'selected';
		});

		console.log(filterNode)
	}

	render() {
		const typelistTpl = typelist.map(function(item) {
			return <Option key={item.code} value={item.code}>{item.name}</Option>
		});

		const self = this;
		const storelistTpl = this.props.state.floor.map(function(item) {
			if(!item.properties.re_name || !item.id) {
				return;
			}
			return <li key={item.id} value={item.id} onClick={self.clickStore}>{item.properties.re_name}</li>;
		});

		return (
			<div className="detail-wrapper">
				 <div className="card-container">
					<Tabs type="card">
						<TabPane tab="商铺列表" key="1">
							<Search
								placeholder="输入商铺名称关键词，快速检索商铺"
								style={{ width: '100%' }}
								onSearch={this.searchStore}
							/>
							<ul ref="storeList" className="stores">{storelistTpl}</ul>
						</TabPane>
						<TabPane tab="商铺属性" key="2">
							<div className="line">
								<label>名称：</label>
								<Input style={{ width: 130 }} placeholder="店铺名称" value={(this.props.state.store[0] && this.props.state.store[0].name)} onChange={this.selectChangeName} />
							</div>
							<div className="line">
								<label>类型：</label>
								<Select placeholder="店铺类型" value={(this.props.state.store[0] && this.props.state.store[0].regionType)}  style={{ width: 130 }} onChange={this.selectChange}>
									{typelistTpl}
								</Select>
							</div>
						</TabPane>
					</Tabs>
				</div>
			</div>
		);
	}
}

// export default Login;

