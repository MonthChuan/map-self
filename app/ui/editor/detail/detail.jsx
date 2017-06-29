import './detail.css';
import React from 'react';  
import { connect } from 'react-redux';
import { SET_STORE, GET_STORECATGORY } from '../../../action/actionTypes';
import * as Service from '../../../services/index';
import { Input, Select, Tabs, Radio, DatePicker } from 'antd'; 
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const Search = Input.Search;
const RadioGroup = Radio.Group;

class Detail extends React.Component{
	constructor(props) {
		super(props);

		this.selectChange = this.selectChange.bind(this);
		this.selectChangeName = this.selectChangeName.bind(this);
		this.clickStore = this.clickStore.bind(this);
		this.searchStore = this.searchStore.bind(this);

		this.beforeEditDetail = this.beforeEditDetail.bind(this);
	}

	beforeEditDetail() {
		const store0 = this.props.store.store[0];
		if(!store0) {
			return false;
		}

		if(!store0.label) {
			//手动添加一个名称label,如果是添加，应该建一个name放上去。todo
			let center = null;
			let sourceLayer = null;
			if(store0.getCenter) {
				center = store0.getCenter();
				sourceLayer = store0;
			}
			else {
				center = store0.graphics.getCenter();
				sourceLayer = store0.graphics;
			}
	
			this.props.newNameLabel(center, sourceLayer, store0);
		}

		return true;
	}

	selectChangeName(event) {
		const { value } = event.target;
		if(this.beforeEditDetail()) {
			const store = this.props.store.store[0];

			store.label.setContent(value);
			Object.assign(store.feature.properties, {'re_name' : value});
			const newSlist = [store].concat(this.props.store.store.slice(1));
			this.props.dispatch({
				type : SET_STORE,
				data : newSlist
			})
		}

		
	}

	selectChange(value) {
		if(this.beforeEditDetail()) {
			const store = this.props.store.store[0];

			Object.assign(store.feature.properties, {'re_type' : value});
			const newSlist = [store].concat(this.props.store.store.slice(1));
			this.props.dispatch({
				type : SET_STORE,
				data : newSlist
			})
		}
	}

	//第一次渲染组件之后，异步获取数据
	componentDidMount() {
		Service.getCatgoryAjax(
			(req) => {
				this.props.dispatch({
					type: GET_STORECATGORY,
					catgory : req.data
				});
			}
		)
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
		const typelistTpl = this.props.store.catgory.map(function(item) {
			return <Option key={item.code} value={item.code}>{item.desc}</Option>
		});

		const self = this;
		const storelistTpl = this.props.map.floor.map(function(item) {
			if(!item.properties.re_name || !item.id) {
				return;
			}
			return <li key={item.id} value={item.id} onClick={self.clickStore}>{item.properties.re_name}</li>;
		});

		const _item = this.props.store.curStore[0];
		const isDisable = this.props.control.isActive ? false : true;
		const storeName = (_item && _item.feature) ? _item.feature.properties.re_name : '';
		const storeType = (_item && _item.feature) ? _item.feature.properties.re_type : '';

		return (
			<div className="detail-wrapper">
				 <div className="card-container">
					<Tabs size="small">
						<TabPane tab="属性" key="1">
							<div className="y-scroll info-wrap">
								<div className="line">
									<label className="txt">店铺名称：</label>
									<Input placeholder="店铺名称" disabled={isDisable} value={storeName} onChange={this.selectChangeName} />
								</div>
								<div className="line">
									<label className="txt">业态：</label>
									<Select placeholder="店铺类型" disabled={isDisable} value={storeType} onChange={this.selectChange}>
										{typelistTpl}
									</Select>
								</div>

								{/*<div className="line">
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
									<label className="txt">铺位合同到期日期：</label>
									<DatePicker />
								</div>	*/}


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

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps)(Detail);

