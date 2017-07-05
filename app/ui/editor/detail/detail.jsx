import './detail.css';
import React from 'react';  
import { connect } from 'react-redux';
import { getSelect, setSelect } from '../utils/select';
import { SET_STORE, GET_STORECATGORY, RESET_STORE } from '../../../action/actionTypes';
import * as Service from '../../../services/index';
import { Input, Select, Tabs, Radio, DatePicker } from 'antd'; 
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const Search = Input.Search;
const RadioGroup = Radio.Group;

class Detail extends React.Component{
	constructor(props) {
		super(props);

		this.clickStore = this.clickStore.bind(this);
		this.searchStore = this.searchStore.bind(this);
		this.propertyChange = this.propertyChange.bind(this);

		this.beforeEditDetail = this.beforeEditDetail.bind(this);
	}

	beforeEditDetail() {
		const store0 = this.props.store.curStore[0];
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

	propertyChange(event) {
		let value = '';
		let opt = null;

		if(this.beforeEditDetail()) {
			const curStoreList = this.props.store.curStore;
			const store = curStoreList[0];
			let newCurSlist = [];
			let newStoreList = this.props.store.store;
			let newBkStore = this.props.store.bkStore;

			if(!store.action) {
				store.action = 'UPDATE';
			}

			if(event.target) {
				value = event.target.value;
				opt = {'re_name' : value};
				store.label.setContent(value);
			}
			else {
				value = event;
				opt = {'re_type' : value};
			}

			if(newStoreList.indexOf(store) < 0) {
				newBkStore = [{
					re_name : store.feature.properties.re_name,
					re_type : store.feature.properties.re_type
				}];
			}
					
			Object.assign(store.feature.properties, opt);
			
			if(newStoreList.indexOf(store) < 0) {
				this.props.store.actionCommand.initial(newStoreList);
				newStoreList = [store].concat(newStoreList.slice(0));
			}

			newCurSlist = [store].concat(curStoreList.slice(1));			
			this.props.dispatch({
				type : RESET_STORE,
				data : {
					curStore : newCurSlist,
					store : newStoreList,
					bkStore : newBkStore
				}
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
		const s = this.props.map.ffmap.searchStoreByID(id);
		
		if(s.length==0 || getSelect(s[0])) {
			return;
		}

		setSelect(s[0], true);
		const timer = setTimeout(function() {
			setSelect(s[0], false);
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
									<Input placeholder="店铺名称" disabled={isDisable} value={storeName} onChange={this.propertyChange} />
								</div>
								<div className="line">
									<label className="txt">业态：</label>
									<Select placeholder="店铺类型" disabled={isDisable} value={storeType} onChange={this.propertyChange}>
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

