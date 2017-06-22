import './editorpage.css';
import 'antd/dist/antd.css';
import React from 'react'; 
import { connect } from 'react-redux';

import PlazaSelect from './plazaselect/plazaselect.jsx';  
import Control from './control/control.jsx';  
import Detail from './detail/detail.jsx';
import Submit from './submit/submit.jsx';
import { message, Modal, Popconfirm } from 'antd'; 
import { getSelect, setSelect } from './utils/select';



import * as Service from '../../services/index';
import { ADD_MAP, SET_PLAZAID, SET_STATUS, SET_FLOORINFO, SET_STORE, SET_BKSTORE, SET_CONFIRMSHOW } from '../../action/actionTypes';

class EditorPage extends React.Component{
	constructor(props) {
		super(props);
		this.preDeleteStore = null;

		this.editStore = this.editStore.bind(this);
		this.setState = this.setState.bind(this);


		this.newNameLabel = this.newNameLabel.bind(this);
		this.initFeatureClick = this.initFeatureClick.bind(this);
		this.deleteStoreConfirmOk = this.deleteStoreConfirmOk.bind(this);
		this.deleteStoreConfirmCancel = this.deleteStoreConfirmCancel.bind(this);
	} 

	initFeatureClick(event) {
		const _store = event.layer;

		const control = this.props.control;
		const storeList = this.props.store.store;
		if(storeList.length > 2 || (control.isZT && control.isActive)) {
				message.warning('您正在编辑状态，请先完成操作并保存，再进行其他操作！', 3);
				return;
			}
			if(control.isStart || !control.isActive) {
				//查看店铺信息
				_store.action = 'SHOW';
			}
			else {
				//去掉重复操作
				if((_store.editEnabled && _store.editEnabled()) || getSelect(_store)) {
					return;
				}
				if(storeList.length > 0 && storeList[0].action != 'SHOW' && !(control.isMerge || control.isSubMerge)) {
					message.warning('您正在编辑状态，请先完成操作并保存，再进行其他操作！', 3);
					return;
				}

				if(control.isEdit) {
					_store.action = 'UPDATE';
					if(_store.enableEdit) {
						_store.enableEdit();
					}
					else {
						_store.eachLayer(i => {
							i.enableEdit();
						});
					}
					const _latlng = _store.getLatLngs()[0][0].map(item => {
						return Object.assign({}, item);
					});

					this.props.dispatch({
						type : SET_STORE,
						data : [_store]
					});

					this.props.dispatch({
						type : SET_BKSTORE,
						data : [{
							name : _store.name,
							regionType : _store.regionType,
							latlng : [[_latlng]]
						}]
					});
					return;
				}
				else if(control.isDelete) {
					this.props.dispatch({
						type : SET_CONFIRMSHOW,
						data : true
					});
					this.refs.popconfirmChild.click();

					setSelect(_store, true);
					this.preDeleteStore = _store;
					return;
				}
				else if(control.isMerge || control.isSubMerge) {
					this.props.dispatch({
						type : SET_STATUS,
						status : {
							isAdd : false,
							isEdit : false,
							isDelete : false,
							isMerge : false,
							isSubMerge : true,
							isZT : false,
							isStart : false,
							isActive : true
						}
					});
			
					if(storeList.length == 2 ) {
						const _oStore = storeList.pop();
						setSelect(_oStore, false);
					}
					setSelect(_store, true);
					const _s = [_store].concat(storeList);

					this.props.dispatch({
						type : SET_STORE,
						data : _s
					});
					return;
				}

			}
			
			this.props.dispatch({
				type : SET_STORE,
				data : [_store]
			});
	}

	//DOM加载完毕之后，初始化map
	componentDidMount() {
		const map = new FMap.Map('map', {
			zoom : 20,
			editable : true,
			regionInteractive : true,
			baseAPI : 'http://yunjin.intra.sit.ffan.com/mapeditor/map'
		});
		this.props.dispatch({
			type : ADD_MAP,
			ffmap : map
		});

		// 获取商铺列表
		map.on('rendered', event => {
			let storeList = [];
			let numList = [];
			let f_name = '';
			let f_num = 1;
			event.regionGroup.eachLayer(function(s) {
				storeList.push(s.feature);

				//为了拼region_id，需要获取楼层里面ID最后数字最大的
				const str = s.feature.id;
				const arr = str.split('_');
				f_name = arr[arr.length - 2];
				f_num = s.feature.properties.floor_num;
				numList.push( parseInt(arr[arr.length - 1]) );
			});

			event.regionGroup.on('click', e => {
				this.initFeatureClick(e);
			});

			let maxNum = numList[0];
			numList.map( i => {
				if(i > maxNum) {
					maxNum = i;
				}
			});

			this.props.dispatch({
				type : SET_FLOORINFO,
				info : {
					floor : storeList,
					floorId : f_num,
					floorMaxNum : maxNum,
					floorName : f_name
				}
			});
		});

		//承重柱
		// this.state.ffmap.on('click', event => {
		// 	if(this.state.status.isZT != 2 || (this.state.store.length > 0 && this.state.store[0].action != 'SHOW')) {
		// 		return;
		// 	}
		// 	const p1 = FMap.Utils.latLngToPoint(event.latlng);
		// 	const p2 = [p1.x + 3, p1.y + 3];
		// 	const bounds = [event.latlng, FMap.Utils.pointToLatLng(p2)];
		// 	const layer = L.rectangle(bounds, {
		// 		draggable : true,
		// 		color: "#ff7800", 
		// 		weight: 1, 
		// 		transform: true
		// 	});

		// 	this.state.ffmap.addOverlay(layer);
		// 	layer.transform.enable({rotation: true});
		// 	layer.feature = {
		// 		properties : {
		// 			re_name : '承重柱',
		// 			re_type : '030202'
		// 		}
		// 	};
		// 	layer.action = 'NEW';
		// 	this.setState({store : [layer]});
		// });



		this.refs.map.style.height = '100%';
	}

	editStore(update) { 
		if(this.state.store.length == 0) {
			message.warning('没有正在编辑的商铺！', 3);
			return;
		}

		const store0 = this.state.store[0];
		//name要在地图上更新，所以要单独调用set
		if(store0.action == 'NEW') {
			if(!store0.label) {
				//手动添加一个名称label,如果是添加，应该建一个name放上去。todo
				const center = store0.graphics.getCenter();
				this.newNameLabel(center, store0.graphics, store0);
			}
			store0.label.setContent(update.re_name);
			if(!store0.feature) {
				store0.feature = {
					properties : {
						re_name : '',
						re_type : ''
					}
				};
			}
		}
		else {
			if(update.re_name) {		
				this.state.store[0].re_name = update.re_name;
				if(this.state.store[0].label) {
					this.state.store[0].label.setContent(update.re_name);
				}
			}
		}
		
		Object.assign(store0.feature.properties, update);
		const newSlist = [store0].concat(this.state.store.slice(1));
		this.setState({store : newSlist});

	}

	//点击保存按钮
	saveEdit() {
		if(this.state.store.length == 0) {
			message.warning('没有正在编辑的商铺！', 3);
			return
		}
		if( this.state.status.isSubMerge && this.state.store.length < 3 ) {
			message.warning('商铺合并操作未完成，请继续操作！', 3);
			return;
		}

		const ajaxUrl = preAjaxUrl + '/mapeditor/map/plaza/edit/region/' + this.state.plazaId + '/' + this.state.floorId;
		const regionParam = this.state.store.map(item => {
			return this.fixStoreParam(item);
		});

		$.ajax({
			'url' : ajaxUrl,
			'method' : 'POST',
			'dataType' : 'json',
			'data' : {"data" : JSON.stringify(regionParam)}
		}).done(req => {
			if(req.status == 200) {

				Modal.success({
					title : '提示',
					content : '保存成功！'
				});
				
			}
			else {
				Modal.error({
					title : '提示',
					content : req.message
				});
			}
			if(this.state.store[0].transform) {
				this.state.store[0].transform.enable({
					rotation: false,
					scaling : false
				});
			}
			if(this.state.store[0].dragging) {
				this.state.store[0].dragging.disable();
			}
		
			if(this.state.store[0].eachLayer) {
				this.state.store[0].eachLayer(i => {
					i.disableEdit();
				});
			}
			else {
				this.state.store[0].disableEdit();
			}
			//重置按钮状态
			this.setState({status : {
				isAdd : true,
				isEdit : true,
				isDelete : true,
				isMerge : true,
				isSubMerge : false,
				isZT : true,
				isStart : false,
				isActive : false
			}});

			this.setState({
				store : [],
				bkStore : []
			});
		});
		
	}

	//新建一个name label
	newNameLabel(center, sourceLayer, nameLayer) {
		const nameLabel = new FMap.PoiLabel(center, '', sourceLayer, { pane : 'markerPane'});
		this.props.map.ffmap.addOverlay(nameLabel);
		nameLayer.label = nameLabel;
	}

	deleteStoreConfirmOk(e) {
		setSelect(this.preDeleteStore, false);
		// this.setState({popconfirmVisible : false});
		this.props.dispatch({
			type : SET_CONFIRMSHOW,
			data : false
		})
		this.preDeleteStore.action = 'DELETE';
		
		this.props.dispatch({
			type : SET_STORE,
			data : [this.preDeleteStore]
		});
		const store0 = this.preDeleteStore;
		if(store0.graphics) {
			store0.graphics.remove();
		}
		else {
			store0.remove();
		}
		
		if(store0.label) {
			store0.label.remove();
		}	
	}

	deleteStoreConfirmCancel(e) {
		setSelect(this.preDeleteStore, false);
		this.props.dispatch({
			type : SET_CONFIRMSHOW,
			data : false
		})
	}

	render () {
		console.log(this.props)
	    return (
			<div className="page" id="editor">
				<div className="topbar">
					<div className="mid clearfix">
						<PlazaSelect />
						{/*<Control 
							state={this.state} 
							setState={this.setState}
							initFeatureClick={this.initFeatureClick}
							mergeStore={this.mergeStore} 
							saveEdit={this.saveEdit} 
							newNameLabel={this.newNameLabel}
						/>*/}
						<Control 
							newNameLabel={this.newNameLabel} 
							initFeatureClick={this.initFeatureClick}
						/>
					</div>
				</div>
				<div className="e-content mid">
					<Popconfirm 
						title="确认删除此商铺？"
						okText="确认" 
						cancelText="取消"
						placement="top"
						arrowPointAtCenter
						visible={this.props.map.popconfirmVisible}
						onConfirm={this.deleteStoreConfirmOk}
						onCancel={this.deleteStoreConfirmCancel}
					>
						<a ref="popconfirmChild" className="popconfirm-btn"></a>
					</Popconfirm>
					<div className="e-content-main clearfix" >
						<div className="map-wrapper">
							<div ref="map" className="map" id="map" style={{height:700}}></div>
						</div>
						<Detail newNameLabel={this.newNameLabel} />
					</div>
				</div>
				<div className="bottom mid">
					<Submit state={this.state} saveEdit={this.saveEdit} setState={this.setState} />
				</div>
			</div>
	    );
	  }
}

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps)(EditorPage);
// export default EditorPage;

