import './editorpage.css';
import 'antd/dist/antd.css';
import React from 'react'; 

import PlazaSelect from './plazaselect/plazaselect.jsx';  
import Control from './control/control.jsx';  
import Detail from './detail/detail.jsx';
import Submit from './submit/submit.jsx';
import { message, Modal, Popconfirm } from 'antd'; 

class EditorPage extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			ffmap : null,
			store : [],
			plazaId : '',
			isMerge : false,
			floor : [], //楼层店铺数据
			floorId : 1, //默认一楼
			floorMaxNum : 0, //为了拼新建商铺的ID
			floorName : 'F1', //为了拼新建商铺的ID
			status : {
				isAdd : false,
				isEdit : false,
				isDelete : false,
				isMerge : false,
				isSubMerge : false,
				isZT : false,
				isStart : true,
				isActive : false
			},
			popconfirmVisible : false
		};
		this.preDeleteStore = null;

		this.editStart = this.editStart.bind(this);
		this.editStore = this.editStore.bind(this);
		this.getPlazaId = this.getPlazaId.bind(this);
		this.saveEdit = this.saveEdit.bind(this);
		this.setState = this.setState.bind(this);


		this.newNameLabel = this.newNameLabel.bind(this);
		this.initFeatureClick = this.initFeatureClick.bind(this);
		this.deleteStoreConfirmOk = this.deleteStoreConfirmOk.bind(this);
		this.deleteStoreConfirmCancel = this.deleteStoreConfirmCancel.bind(this);
		this.fixStoreParam = this.fixStoreParam.bind(this);
	} 

	fixStoreParam(obj) {
		// let f = null;
		let coords = [];
		let centerPoint = null;
		let centerPointXY = {x : 0, y : 0};
		let coordsList = [];
		let layerType = '';

		if(obj.feature) {
			layerType = 'feature';
		}
		else if(obj.graphics) {
			layerType = 'graphics';
		}	

		if(obj.action != 'DELETE') {
			if(obj.coords) {
				coords = obj.coords;
				centerPoint = obj.getBounds().getCenter();
			} 
			else {
				if(obj.getCenter) {
					centerPoint = obj.getCenter();
				}
				else {
					centerPoint = obj[layerType].getCenter();
				}
				
				coordsList = obj.getOriginalLatlng();
				if(coordsList[0].length > 1) {
					coords = coordsList[0];
				}
				else {
					coords = coordsList[0][0];
				}
			}
			
			centerPointXY = FMap.Utils.toOriginalCoordinates(centerPoint);
		}

		if(obj.action == 'NEW') {
			this.state.floorMaxNum ++ ;
			obj.id = this.state.plazaId + '_' + this.state.floorName + '_' + this.state.floorMaxNum;
		}

		const param = {
			type : 'Feature',
			id : obj.id || '',
			properties : {
				centerx : centerPointXY.x,
				centery : centerPointXY.y,
				re_name : obj.name,
				re_type : obj.regionType || '',
				region_id : obj.id || ''
			},
			geometry : {
				type : 'MultiPolygon',
				coordinates : [[coords]]
			}
		};

		return {
			action : obj.action,
			feature : param
		}
	}

	initFeatureClick(event) {
		const _store = event.store || event.target;
		if(this.state.store.length > 2 || (this.state.status.isZT && this.state.status.isActive)) {
				message.warning('您正在编辑状态，请先完成操作并保存，再进行其他操作！', 3);
				return;
			}
			if(this.state.status.isStart || !this.state.status.isActive) {
				//查看店铺信息
				_store.action = 'SHOW';
			}
			else {
				//去掉重复操作
				if((_store.editEnabled && _store.editEnabled()) || _store.selected) {
					return;
				}
				if(this.state.store.length > 0 && this.state.store[0].action != 'SHOW' && !(this.state.status.isMerge || this.state.status.isSubMerge)) {
					message.warning('您正在编辑状态，请先完成操作并保存，再进行其他操作！', 3);
					return;
				}

				if(this.state.status.isEdit) {
					_store.action = 'UPDATE';
					if(_store.enableEdit) {
						_store.enableEdit();
					}
					else {
						_store.eachLayer(i => {
							i.enableEdit();
						});
					}
				}
				else if(this.state.status.isDelete) {
					this.setState({
						popconfirmVisible : true
					});
					this.refs.popconfirmChild.click();
					_store.selected = true;
					this.preDeleteStore = _store;
					return;
				}
				else if(this.state.status.isMerge || this.state.status.isSubMerge) {
					this.setState({status : {
						isAdd : false,
						isEdit : false,
						isDelete : false,
						isMerge : false,
						isSubMerge : true,
						isZT : false,
						isStart : false,
						isActive : true
					}});
					_store.action = 'merge';
					if(this.state.store.length == 2 ) {
						const _oStore = this.state.store.pop();
						_oStore.selected = false;
					}
					_store.selected = true;
					const _s = [_store].concat(this.state.store);
					this.setState({store : _s});
					return;
				}

			}
			
			this.setState({store : [_store]});
	}

	//DOM加载完毕之后，初始化map
	componentDidMount() {
		this.state.ffmap = new FMap.Map('map', {
			zoom : 20,
			editable : true,
			regionInteractive : true,
			baseAPI : 'http://yunjin.intra.sit.ffan.com/mapeditor/map'
			// baseAPI: 'http://imap.sit.ffan.com/poi'
		});
		this.state.ffmap.loadBuilding(this.state.plazaId); //1000772


		//获取商铺列表
		this.state.ffmap.on('rendered', event => {
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

			let maxNum = numList[0];
			numList.map( i => {
				if(i > maxNum) {
					maxNum = i;
				}
			});

			this.setState({
				floor : storeList,
				floorId : f_num,
				floorMaxNum : maxNum,
				floorName : f_name
			});
		});

		this.state.ffmap.on('featureClick', event => {
			this.initFeatureClick(event);
		});

		//承重柱
		this.state.ffmap.on('click', event => {
			if(this.state.status.isZT != 2 || (this.state.store.length > 0 && this.state.store[0].action != 'SHOW')) {
				return;
			}
			const p1 = FMap.Utils.latLngToPoint(event.latlng);
			const p2 = [p1.x + 3, p1.y + 3];
			const bounds = [event.latlng, FMap.Utils.pointToLatLng(p2)];
			const layer = L.rectangle(bounds, {
				draggable : true,
				color: "#ff7800", 
				weight: 1, 
				transform: true
			});

			this.state.ffmap.addOverlay(layer);
			layer.transform.enable({rotation: true});
			layer.name = '承重柱';
			layer.regionType = '030202';
			layer.action = 'NEW';
			this.setState({store : [layer]});
		});
	}

	//点击开始编辑按钮
	editStart() {
		$.ajax({
			'url' : preAjaxUrl + '/mapeditor/map/editStart/' + this.state.plazaId + '/' + this.state.floorId,
			'type' : 'POST',
			'xhrFields': {
                      withCredentials: true
              }
		}).done(req => {
			if(req.status == 200) {
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
			}
			else {
				if(req.status == 460) {
					location.href = location.pathname + '#/login';
				}
				else {
					Modal.error({
						title : '注意',
						content : req.message
					});
				}
			}
		});
	}

	editStore(update) { 
		if(this.state.store.length == 0) {
			message.warning('没有正在编辑的商铺！', 3);
			return;
		}
		if(this.state.status.isAdd) {
			//name要在地图上更新，所以要单独调用set
			if(this.state.status.isAdd) {
				if(!this.state.store[0].nameLabel) {
					//手动添加一个名称label,如果是添加，应该建一个name放上去。todo
					const center = this.state.store[0].graphics.getCenter();
					this.newNameLabel(center, this.state.store[0].graphics);
				}
				this.state.store[0].nameLabel.setContent(update.name);
			}
		}
		else {
			if(update.name) {		
				this.state.store[0].re_name = update.name;
				if(this.state.store[0].nameLabel) {
					this.state.store[0].nameLabel.setContent(update.name);
				}
			}
		}
		const newStore0 = Object.assign(this.state.store[0], update);
		const newSlist = [newStore0].concat(this.state.store.slice(1));
		this.setState({store : newSlist});

	}

	getPlazaId(id) {
		if(this.state.store.length > 0 && this.state.store[0].action != 'SHOW') {
			this.saveEdit();
		}

		this.state.plazaId = id;

		if(this.state.ffmap) {
			this.state.ffmap.loadBuilding(id);
		}

		this.setState({
			status : {
				isAdd : false,
				isEdit : false,
				isDelete : false,
				isMerge : false,
				isSubMerge : false,
				isZT : false,
				isStart : true,
				isActive : false
			}
		});
		this.setState({store : []});

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

			this.setState({store : []});
		});
		
	}

	//新建一个name label
	newNameLabel(center, layer) {
		const nameLabel = new FMap.PoiLabel(center, '', layer, { pane : 'markerPane'});
		this.state.ffmap.addOverlay(nameLabel);
		this.state.store[0].nameLabel = nameLabel;
	}

	deleteStoreConfirmOk(e) {
		this.preDeleteStore.selected = false;
		this.setState({popconfirmVisible : false});
		this.preDeleteStore.action = 'DELETE';
		this.state.store = [this.preDeleteStore];
		// this.setState({store : [this.preDeleteStore]});
		if(this.state.store[0].graphics) {
			this.state.store[0].graphics.remove();
		}
		else {
			this.state.store[0].remove();
		}
		
		if(this.state.store[0].nameLabel) {
			this.state.store[0].nameLabel.remove();
		}
		// this.preDeleteStore = null;
		
	}

	deleteStoreConfirmCancel(e) {
		this.preDeleteStore.selected = false;
		this.setState({popconfirmVisible : false});
	}

	render () {
	    return (
			<div className="page" id="editor">
				<div className="topbar">
					<div className="mid clearfix">
						<PlazaSelect getPlazaId={this.getPlazaId} />
						<Control 
							state={this.state} 
							setState={this.setState}
							initFeatureClick={this.initFeatureClick}
							mergeStore={this.mergeStore} 
							editStart={this.editStart} 
							saveEdit={this.saveEdit} 
							newNameLabel={this.newNameLabel}
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
						visible={this.state.popconfirmVisible}
						onConfirm={this.deleteStoreConfirmOk}
						onCancel={this.deleteStoreConfirmCancel}
					>
						<a ref="popconfirmChild" className="popconfirm-btn"></a>
					</Popconfirm>
					<div className="e-content-main clearfix">
						<div className="map-wrapper">
							<div className="map" id="map" style={{height:'100%'}}></div>
						</div>
						<Detail state={this.state} editStore={this.editStore} />
					</div>
				</div>
				<div className="bottom mid">
					<Submit state={this.state} saveEdit={this.saveEdit} setState={this.setState} />
				</div>
			</div>
	    );
	  }
}

export default EditorPage;

