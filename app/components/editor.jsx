import './editorpage.css';
import 'antd/dist/antd.css';
import React from 'react'; 

import PlazaSelect from './plazaselect/plazaselect.jsx';  
import Control from './control/control.jsx';  
import Detail from './detail/detail.jsx';
import Submit from './submit/submit.jsx';
import SaveConfirm from './utils/saveConfirm.jsx';

class EditorPage extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			ffmap : null,
			store : [],
			plazaId : '',
			isMerge : false,
			floor : [] //楼层店铺数据
		};

		this.editStart = this.editStart.bind(this);
		this.editStore = this.editStore.bind(this);
		this.getPlazaId = this.getPlazaId.bind(this);
		this.saveEdit = this.saveEdit.bind(this);
		this.setMerge = this.setMerge.bind(this);
	}

	//DOM加载完毕之后，初始化map
	componentDidMount() {
		this.state.ffmap = new FFanMap('map', {
			zoom : 20,
			editable : true,
			regionInteractive : true
		});
		this.state.ffmap.loadBuilding(this.state.plazaId); //1000772


		//获取商铺列表
		this.state.ffmap.on('rendered', event => {
			const _list = [];
			event.storeGroup.eachLayer(function(s) {
				_list.push(s.feature);
			});

			this.setState({floor : _list});
		});
	}

	editStart() {
		this.state.ffmap.on('featureClick', event => {
			if(event.store.editEnabled() || event.store.selected) {
				return;
			}

			if(!this.state.isMerge && this.state.store.length > 0) {
				this.refs.saveConfirm.showConfirm();
			}
			else if(this.state.isMerge) {
				if(this.state.store.length == 2) {
					 const _s = this.state.store.shift();
					// _s.disableEdit();
					_s.selected = false;
				}
				// event.store.enableEdit();
				event.store.selected = true
				this.state.store.push(event.store);
			}
			else {
				event.store.enableEdit();
				this.setState({store : [event.store]});
			}
		});
	}

	editStore(update) {
		if(!this.state.isMerge) {
			if(update.name) {
				//name要在地图上更新，所以要单独调用set
				if(this.state.isAdd) {
					//手动添加一个名称label,如果是添加，应该建一个name放上去。todo
					// const centerLatLng = this.state.store[0].getBounds().getCenter();
					// const nameLabel = new FFanMap.Label(centerLatLng, '');
					// this.state.ffmap.addOverlay(nameLabel);
					// this.state.store[0].nameLabel = nameLabel;
				}
				this.state.store[0].name = update.name;
			}
		}
		else {
			if(this.state.store[0].nameLabel) {
				this.state.store[0].nameLabel.setContent(update.name);
			}
		}
		let newStore = Object.assign(this.state.store[0], update);
		this.setState({store : [newStore]});

	}

	getPlazaId(id) {
		this.state.plazaId = id;

		if(this.state.ffmap) {
			this.state.ffmap.loadBuilding(id)
		}
	}

	saveEdit() {
		console.log(this.state.store);
		if(this.state.store[0].disableEdit) {
			this.state.store[0].disableEdit();
		}
	
		this.setState({store : []});
	}

	//合并店铺
	setMerge() {
		if(this.state.store.length > 0) {
			this.refs.saveConfirm.showConfirm();
		}
		this.setState({isMerge : true});
	}

	render () {
	    return (
			<div className="page" id="editor">
				<div className="topbar">
					<div className="mid clearfix">
						<PlazaSelect getPlazaId={this.getPlazaId} />
						<Control state={this.state} setMerge={this.setMerge} mergeStore={this.mergeStore} editStart={this.editStart} saveEdit={this.saveEdit} />
					</div>
				</div>
				<div className="e-content mid clearfix">
					<div className="map-wrapper">
						<div className="map" id="map" style={{height:530}}></div>
					</div>
					<Detail state={this.state} editStore={this.editStore} />
				</div>
				<div className="bottom mid">
					<Submit state={this.state} />
				</div>

				<SaveConfirm ref="saveConfirm" />
			</div>
	    );
	  }
}

export default EditorPage;

