import './detail.css';
import React from 'react';  
import { connect } from 'react-redux';
import { getSelect, setSelect } from '../utils/select';
import ActionCommand from '../utils/actionCommand';
import { SET_STORE, GET_STORECATGORY, RESET_STORE } from '../../../action/actionTypes';
import * as Service from '../../../services/index';
import { Input, Select, Tabs } from 'antd'; 
const Option = Select.Option;
const TabPane = Tabs.TabPane;
// const Search = Input.Search;
// const RadioGroup = Radio.Group;

class Detail extends React.Component{
	constructor(props) {
		super(props);

		this.actionCommand = {};
		this.propertyObj = {};
		// this.isPushStore = false;
		this.clickStore = this.clickStore.bind(this);
		this.searchStore = this.searchStore.bind(this);
		this.propertyChange = this.propertyChange.bind(this);
		this.proertyChangeEnd = this.proertyChangeEnd.bind(this);

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
		let opt = {};

		if(this.beforeEditDetail()) {
			const curStoreList = this.props.store.curStore;
			const store = curStoreList[0];
			let newCurSlist = [];
			let newStoreList = this.props.store.store;
			let bkStore = this.props.store.bkStore;
			let propertyType = '';

			if(!store.action) {
				store.action = 'UPDATE';
			}

			if(event.target) {
				value = event.target.value;
				propertyType = event.target.dataset.type;
				store.label.setContent(value);
			}
			else {
				value = event;
				propertyType = 're_type';
			}

			opt[propertyType] = value;

			if( this.props.store.actionCommand.length > 0 && (store.feature.id == this.props.store.actionCommand[0].id) ) {
				this.actionCommand = this.props.store.actionCommand[0];
				// this.isPushStore = false;
			}
			else {
				this.actionCommand = new ActionCommand(bkStore[0]);
				this.props.store.actionCommand.unshift(this.actionCommand);
				// this.isPushStore = true;
			}
					
			Object.assign(store.feature.properties, opt);
			this.propertyObj = opt;
			
			// if(newStoreList.indexOf(store) < 0) {
			// 	this.props.store.actionCommand.initial(newStoreList);
			// 	newStoreList = [store].concat(newStoreList.slice(0));
			// }

			newCurSlist = [store].concat(curStoreList.slice(1));			
			this.props.dispatch({
				type : RESET_STORE,
				data : {
					curStore : newCurSlist
					// store : newStoreList,
					// bkStore : newBkStore
				}
			})
		}
	}

	proertyChangeEnd(event) {
		if(this.actionCommand && this.actionCommand.execute) {
			this.actionCommand.execute(this.propertyObj);
		}
		
		this.props.dispatch({
			type : RESET_STORE,
			data : {
				store : this.props.store.curStore,
				curStore : this.props.store.curStore
			}
		})
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
					<Tabs>
						<TabPane tab="属性" key="1">
							<div className="y-scroll info-wrap">
								<div className="line">
									<label className="txt">店铺名称：</label>
									<Input 
										data-type="re_name"
										placeholder="店铺名称" 
										disabled={isDisable} 
										value={storeName} 
										onChange={this.propertyChange} 
										onBlur={this.proertyChangeEnd}
									/>
								</div>
								<div className="line">
									<label className="txt">业态：</label>
									<Select 
										placeholder="店铺类型" 
										disabled={isDisable} 
										value={storeType} 
										onChange={this.propertyChange}
										onBlur={this.proertyChangeEnd}
									>
										{typelistTpl}
									</Select>
								</div>
							</div>
						</TabPane>
						<TabPane tab="商铺" key="2">
							<div className="y-scroll slist-wrap">
								<ul ref="storeList" className="stores">{storelistTpl}</ul>
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

