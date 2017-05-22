import './detail.css';
import React from 'react';  
import { Input, Select, Tabs, Radio, DatePicker } from 'antd'; 
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const Search = Input.Search;
const RadioGroup = Radio.Group;
// const typelist = [
// 	{name : "便利店", code : "060401"},
// 	{name : "礼品店", code : "060403"},
// 	{name : "儿童用品店", code : "060404"},
// 	{name : "购物中心", code : "060405"},
// 	{name : "服装店", code : "060406"}
// ];

export default class Detail extends React.Component{
	constructor(props) {
		super(props);
		this.state = this.props.state;
		this.state.zsRadio = 1;
		this.state.typelist = [];

		this.selectChange = this.selectChange.bind(this);
		this.selectChangeName = this.selectChangeName.bind(this);
		this.clickStore = this.clickStore.bind(this);
		this.searchStore = this.searchStore.bind(this);
		this.onRadioChange = this.onRadioChange.bind(this);
		this.onCalendarChange = this.onCalendarChange.bind(this);
	}

	//第一次渲染组件之后，异步获取数据
	componentDidMount() {
		$.ajax({
			'url' : 'http://yunjin.intra.sit.ffan.com/mapeditor/category/categoryCodes',
			'dataType' : 'json'
		}).done( req => {
			if(req.status == 200) {
				this.setState({typelist : req.data});
			}
		});
	}

	onCalendarChange(value, mode) {}

	onRadioChange(event) {
		this.setState({
			zsRadio : event.target.value
		});
	}

	selectChangeName(event) {
		const { value } = event.target;

		this.props.editStore({'name' : value});
	}

	selectChange(value) {
		this.props.editStore({ 'regionType' : value});
	}

	clickStore(event) {
		const id = event.target.getAttribute('value');
		const s = this.props.state.ffmap.searchStoreByID(id);
		
		if(s.length==0 || s[0].selected) {
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

	}

	render() {
		const typelistTpl = this.state.typelist.map(function(item) {
			return <Option key={item.code} value={item.code}>{item.desc}</Option>
		});

		const self = this;
		const storelistTpl = this.props.state.floor.map(function(item) {
			if(!item.properties.re_name || !item.id) {
				return;
			}
			return <li key={item.id} value={item.id} onClick={self.clickStore}>{item.properties.re_name}</li>;
		});

		const isDisable = (this.props.state.store[0] && this.props.state.store[0].action=='SHOW') ? true : false;

		return (
			<div className="detail-wrapper">
				 <div className="card-container">
					<Tabs size="small">
						<TabPane tab="属性" key="1">
							<div className="y-scroll info-wrap">
								<div className="line">
									<label className="txt">店铺名称：</label>
									<Input placeholder="店铺名称" disabled={isDisable} value={(this.props.state.store[0] && this.props.state.store[0].name)} onChange={this.selectChangeName} />
								</div>
								<div className="line">
									<label className="txt">业态：</label>
									<Select placeholder="店铺类型" disabled={isDisable} value={(this.props.state.store[0] && this.props.state.store[0].regionType)} onChange={this.selectChange}>
										{typelistTpl}
									</Select>
								</div>

								<p className="line-tit">招商平台信息</p>
								<div className="line">
									<label className="txt">地图ID：</label>
									<span className="txt2">ALF0237</span>
								</div>
								<div className="line">
									<RadioGroup onChange={this.onRadioChange} value={this.state.zsRadio}>
										<Radio value={1}>品牌名称</Radio>
										<Radio value={2}>铺位编号</Radio>
									</RadioGroup>
									
									<Select placeholder="请选择品牌" style={{'display' : `${this.state.zsRadio==1?'inline-block':'none'}`}}>
										{typelistTpl}
									</Select>
									<Input placeholder="请输入铺位编号" style={{'display' : `${this.state.zsRadio==2?'inline-block':'none'}`}} />
								</div>
								<div className="line">
									<label className="txt">项目方系统编号：</label>
									<Input placeholder="请输入系统内标铺位编号" />
								</div>
								<div className="line">
									<label className="txt">铺位合同到期日期：</label>
									<DatePicker />
								</div>
								<div className="line">
									<label className="txt">全景视频／图片：</label>
									<Input placeholder="请输入在线文件地址" />
								</div>
	

								<p className="line-tit">楼层工程信息</p>
								<div className="line">
									<label className="txt">套内面积：</label>
									<Input placeholder="小数点后一位" />m²
								</div>
								<div className="line">
									<label className="txt">建筑面积：</label>
									<Input placeholder="小数点后一位" />m²
								</div>
								<div className="line">
									<label className="txt">地面至楼板最低高度：</label>
									<Input placeholder="小数点后一位" />m
								</div>
								<div className="line">
									<label className="txt">地板至不可拆卸管道最低高度：</label>
									<Input placeholder="小数点后一位" />m
								</div>


							</div>
						</TabPane>
						<TabPane tab="商铺" key="2">
							<div className="y-scroll slist-wrap">
								<Search
									placeholder="输入商铺名称关键词，快速检索商铺"
									style={{ width: '100%' }}
									onSearch={this.searchStore}
								/>
								<ul ref="storeList" className="stores">{storelistTpl}</ul>
							</div>
						</TabPane>

						<TabPane tab="楼层" key="3">
							<div className="y-scroll info-wrap">
								<div className="line">
										<label className="txt">楼层业态：</label>
										<Select placeholder="楼层业态">
											{typelistTpl}
										</Select>
									</div>
								<div className="line">
									<label className="txt">全景视频／图片：</label>
									<Input placeholder="请输入在线文件地址" />
								</div>
							</div>
						</TabPane>
					</Tabs>
				</div>
			</div>
		);
	}
}

// export default Login;

