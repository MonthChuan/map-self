import './control.css';
import React from 'react';  
import { Button, message, Menu, Dropdown, Icon, Modal } from 'antd'; 
import SaveConfirm from '../utils/saveConfirm.jsx';
import { getSelect, setSelect } from '../utils/select';

export default class Control extends React.Component{
	constructor(props) {
		super(props);
		this.state = this.props.state;
		this.state.btnstatus = false;

		this.drawPloy = this.drawPloy.bind(this);
		this.setMerge = this.setMerge.bind(this);
		this.deleteStore = this.deleteStore.bind(this);
		this.mergeStore = this.mergeStore.bind(this);
		this.editStart = this.editStart.bind(this);
		this.saveEdit = this.saveEdit.bind(this);
		this.dropDown = this.dropDown.bind(this);
		this.editRegion = this.editRegion.bind(this);
		this.submitAll = this.submitAll.bind(this);

		this.checkAct = this.checkAct.bind(this);
		this.cancelAct = this.cancelAct.bind(this);
	}

	submitAll() {
		if(this.props.state.store.length > 0 && this.props.state.store[0].action != 'SHOW') {
			this.props.saveEdit();
		}
		//todo结束本次编辑。。。

		$.ajax({
			'url' : preAjaxUrl + '/mapeditor/map/editEnd/' + this.props.state.plazaId,
			'method' : 'POST'
		}).done(req => {
			if(req.status == 200) {
				Modal.success({
					title : '',
					content : '已经提交审核，请耐心等待！'
				});
				this.props.setState({status : {
					isAdd : false,
					isEdit : false,
					isDelete : false,
					isMerge : false,
					isSubMerge : false,
					isZT : false,
					isStart : false,
					isActive : 2
				}});
				this.setState({btnstatus : 'disabled'});
			}
			else {
				Modal.error({
					title : '注意',
					content : req.message
				});
			}
		});
	}

	//检查是否可以进行下面操作
	checkAct() {
		if(this.props.state.store.length > 0 && this.props.state.store[0].action != 'SHOW') {
			message.warning('您正在编辑状态，请先完成操作并保存，再进行其他操作！', 3);
			return false;
		}
		return true;
	}
	
	//新增商铺
	drawPloy() {
		if(!this.checkAct()) {return}


		const newStore = this.state.ffmap.startPolygon();
		newStore.action = "NEW";

		this.props.setState({status : {
			isAdd : true,
			isEdit : false,
			isDelete : false,
			isMerge : false,
			isSubMerge : false,
			isZT : false,
			isStart : false,
			isActive : true
		}});
		this.props.state.store = [newStore];

		newStore.on('click', e => {
			this.props.initFeatureClick(e);
		});
	}

	//合并
	setMerge() {
		if(!this.checkAct()) {return}
		this.props.setState({status : {
			isAdd : false,
			isEdit : false,
			isDelete : false,
			isMerge : true,
			isSubMerge : false,
			isZT : false,
			isStart : false,
			isActive : true
		}});
	}

	mergeStore(store) {
		if(this.props.state.store.length < 2) {
			message.warning('无法合并！', 3);
		}
		else {
			const s0 = this.props.state.store[0];
			const s1 = this.props.state.store[1];

			if( s0.getBounds().intersects(s1.getBounds()) ) {
				let coords = [];
				const union = turf.union(s0.toGeoJSON(), s1.toGeoJSON());
				const layer = this.state.ffmap.drawGeoJSON(union, {editable: true});

				s0.remove();
				s0.label.remove();

				s1.remove();
				s1.label.remove();
				s0.action = 'DELETE';
				s1.action = 'DELETE';
      			this.state.ffmap.addOverlay(layer);
		  				
				const coordObj = turf.coordAll(union).map(item => {
					return {
						lat : item[1],
						lng : item[0]
					};
				});
				coords = FMap.Utils.getOriginalByLatlngs(coordObj);

				layer.coords = coords;
				layer.action = 'NEW';
				const _s = [layer].concat(this.props.state.store);
				this.props.setState({store : _s});
				this.props.state.store = _s;
				//手动添加一个名称label
				const centerLatLng = layer.getBounds().getCenter();
				this.props.newNameLabel(centerLatLng, layer, layer);

				layer.on('click', e => {
					this.props.initFeatureClick(e);
				});
			}
			else {
				message.error('无法合并！', 3);
			}
		}
	}

	editStart() {
		this.props.editStart();
	}

	saveEdit() {
		this.props.saveEdit();
	}

	//delete
	deleteStore() {
		if(!this.checkAct()) {return}
		this.props.setState({status : {
			isAdd : false,
			isEdit : false,
			isDelete : true,
			isMerge : false,
			isSubMerge : false,
			isZT : false,
			isStart : false,
			isActive : true
		}});
	} 

	dropDown( { key } ) {
		this.props.setState({status : {
			isAdd : false,
			isEdit : false,
			isDelete : false,
			isMerge : false,
			isSubMerge : false,
			isZT : key,
			isStart : false,
			isActive : true
		}});
		const bulidZT = (name, type) => {
			const layer = this.state.ffmap.startPolygon({
				color: "#ff7800", 
				weight: 1
			});
			layer.name = name;
			layer.regionType = type;
			layer.action = 'NEW';

			this.props.setState({store : [layer]});
		};

		switch(parseInt(key)) {
			case 1:
				bulidZT('多经点位', '030201');
				break;
			case 2:
				break;
			case 3:
				bulidZT('万达百货', '万达百货');
				break;
			default:
				break;
		}
	}

	//商铺编辑
	editRegion() {
		if(!this.checkAct()) {return}
		this.props.setState({status : {
			isAdd : false,
			isEdit : true,
			isDelete : false,
			isMerge : false,
			isSubMerge : false,
			isZT : false,
			isStart : false,
			isActive : true
		}});
	}

	//取消操作
	cancelAct() {
		for(let i = 0, l = this.props.state.store.length; i < l; i++) {
			let item = this.props.state.store[i];
			let bkItem = this.props.state.bkStore[i];
			if(item.action == 'NEW') {
				if(item._proxy) {
					item._proxy.editor.map.editTools.stopDrawing();
				}
				
				if(item.graphics) {
					item.graphics.remove();
				}
				else {
					if(item.transform) {
						item.transform.disable();
					}
					item.remove();
				}

				if(item.label) {
					item.label.remove();
				}
			}
			else if(item.action == 'UPDATE') {
				item.disableEdit();
				item.setLatLngs(bkItem.latlng);
				if(item.name != bkItem.name) {
					item.re_name = bkItem.name;
					item.name = bkItem.name;
					if(item.label) {
						item.label.setContent(bkItem.name);
					}
				}

				if(item.regionType != bkItem.regionType) {
					item.regionType = bkItem.regionType;
				}
			}
			else if(item.action == 'DELETE') {
				this.props.state.ffmap.addOverlay(item);
				this.props.newNameLabel(item.getCenter(), item, item);
				item.label.setContent(item.feature.properties.re_name);
			}

			// if(item.selected) {
			// 	item.selected = false;
			// }
			if(getSelect(item)) {
				setSelect(item, false);
			}
			
		}


		
		

		this.props.setState({
			status : {
				isAdd : true,
				isEdit : true,
				isDelete : true,
				isMerge : true,
				isSubMerge : false,
				isZT : true,
				isStart : false,
				isActive : false
			},
			store : [],
			bkStore : []
		});
	}

	render() {
		const menu = (
			<Menu onClick={this.dropDown}>
				<Menu.Item key="1">多经点</Menu.Item>
				<Menu.Item key="2">承重柱</Menu.Item>
				<Menu.Item key="3">万达百货</Menu.Item>
			</Menu>
		);
		const name0 = "s-btn s-cancel clearfix" + (this.props.state.status.isActive ? '' : ' disable');
		const name1 = "s-btn s-add clearfix" + (this.props.state.status.isAdd ? '' : ' disable');
		const name2 = "s-btn s-edit clearfix" + (this.props.state.status.isEdit ? '' : ' disable');
		const name3 = "s-btn s-delete clearfix" + (this.props.state.status.isDelete ? '' : ' disable');
		const name4 = "s-btn s-merge clearfix" + (this.props.state.status.isMerge ? '' : ' disable');
		const name5 = "s-btn s-zt clearfix" + (this.props.state.status.isZT ? '' : ' disable');

		const mergeStyle = {'display' : (this.props.state.status.isSubMerge ? 'none' : 'inline-block')};
		const submergeStyle = {'display' : (this.props.state.status.isSubMerge ? 'inline-block' : 'none')};

		const startStyle = {'display' : (this.props.state.status.isStart ? 'inline-block' : 'none')};
		const saveStyle = {'display' : (this.props.state.status.isStart || (this.props.state.status.isActive == 2) ? 'none' : 'inline-block')};
	
		return (
			<div className="control">
				<a className={name0} onClick={this.cancelAct}>取消操作</a>
				<a className={name1} onClick={this.drawPloy}><i className="s-icon"></i>新增商铺</a>
				<a className={name2} onClick={this.editRegion} ><i className="s-icon"></i>商铺编辑</a>
				<a className={name3} onClick={this.deleteStore}><i className="s-icon"></i>删除商铺</a>
				<a className={name4} style={mergeStyle} onClick={this.setMerge}><i className="s-icon"></i>商铺合并</a>
				<a className="s-btn s-merge clearfix" style={submergeStyle} onClick={this.mergeStore}><i className="s-icon"></i>执行合并</a>

				<Dropdown overlay={menu}>
					<span className={name5}><i className="s-icon"></i>专题数据<Icon type="down" /></span>
				</Dropdown>
				<Button className="e-save" style={startStyle} type="primary" onClick={this.editStart}>开始编辑</Button>
				<Button className="e-save" style={saveStyle} type="primary" onClick={this.saveEdit}>保存</Button>
				<Button className="e-save" type="primary" onClick={this.submitAll} disabled={this.state.btnstatus}>提交审核</Button>
				<SaveConfirm ref="saveConfirm" />
			</div>
		);
	}
}


