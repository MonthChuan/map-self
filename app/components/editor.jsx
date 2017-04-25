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
			store : null,
			plazaId : '',
			isMerge : false
		};
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
			if(!this.state.isMerge && this.state.store) {
				this.refs.saveConfirm.showConfirm();
			}
			else {
				event.store.toggleEdit();
				this.setState({store : event.store});
			}
		});
	}

	editStore(update) {
		if(update.name) {
			//name要在地图上更新，所以要单独调用set
			this.state.store.name = update.name;
		}
	
		let newStore = Object.assign(this.state.store, update);
		this.setState({store : newStore});
	}

	getPlazaId(id) {
		this.state.plazaId = id;

		if(this.state.ffmap) {
			this.state.ffmap.loadBuilding(id)
		}
	}

	render () {
	    return (
			<div className="page" id="editor">
				<PlazaSelect getPlazaId={this.getPlazaId.bind(this)} />
				<div className="content-wrapper clearfix">
					<Control state={this.state} />
					<div className="map-wrapper">
						<div className="map" id="map" style={{height:600}}></div>
					</div>
					<Detail state={this.state} editStore={this.editStore.bind(this)} />
				</div>
				<Submit state={this.state} editStart={this.editStart.bind(this)} />

				<SaveConfirm ref="saveConfirm" />
			</div>
	    );
	  }
}

export default EditorPage;

