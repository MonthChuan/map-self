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
			isMerge : false
		};

		this.editStart = this.editStart.bind(this);
		this.editStore = this.editStore.bind(this);
		this.getPlazaId = this.getPlazaId.bind(this);
		this.saveEdit = this.saveEdit.bind(this);
		this.setMerge = this.setMerge.bind(this);
		this.mergeStore = this.mergeStore.bind(this);
	}

	//DOM加载完毕之后，初始化map
	componentDidMount() {
		this.state.ffmap = new FFanMap('map', {
			zoom : 20,
			editable : true,
			regionInteractive : true
		});
		this.state.ffmap.loadBuilding(this.state.plazaId); //1000772
	}

	editStart() {
		this.state.ffmap.on('featureClick', event => {
			if(event.store.editEnabled()) {
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
		if(update.name) {
			//name要在地图上更新，所以要单独调用set
			this.state.store[0].name = update.name;
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
		//todo提交store数据
		this.state.store[0].disableEdit();
		this.setState({store : []});
	}

	//合并店铺
	setMerge() {
		this.setState({isMerge : true});
	}
	mergeStore(store) {
		//
	}

	render () {
		// console.log(this.state.isMerge)
	    return (
			<div className="page" id="editor">
				<PlazaSelect getPlazaId={this.getPlazaId} />
				<div className="content-wrapper clearfix">
					<Control state={this.state} setMerge={this.setMerge} mergeStore={this.mergeStore} />
					<div className="map-wrapper">
						<div className="map" id="map" style={{height:600}}></div>
					</div>
					<Detail state={this.state} editStore={this.editStore} />
				</div>
				<Submit state={this.state} editStart={this.editStart} saveEdit={this.saveEdit} />

				<SaveConfirm ref="saveConfirm" />
			</div>
	    );
	  }
}

export default EditorPage;

