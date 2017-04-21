import './editorpage.css';
import 'antd/dist/antd.css';
import React from 'react'; 


import PlazaSelect from './plazaselect/plazaselect.jsx';  
import Control from './control/control.jsx';  
import Detail from './detail/detail.jsx';
import Submit from './submit/submit.jsx';

class EditorPage extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			ffmap : null,
			store : {},
			plazaId : ''
		};
	}

	//DOM加载完毕之后，初始化map
	componentDidMount() {
		console.log(this.state.plazaId)
		this.state.ffmap = new FFanMap('map', {
			zoom : 20,
			editable : true,
			regionInteractive : true
		});
		// this.state.ffmap.loadBuilding(this.state.plazaId);
		this.state.ffmap.loadBuilding(1000772)
	}

	getMap() {
		return this.state.ffmap;
	}

	getData() {
		return this.state;
	}

	editStart() {
		this.state.ffmap.on('featureClick', event => {
			event.store.toggleEdit();
			// console.log(event)
			// console.log(event.store)
			// console.log(event.store.getOriginalLatlng());
			this.setState({store : event.store});
		});
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
				<PlazaSelect getData={this.getData.bind(this)} getPlazaId={this.getPlazaId.bind(this)} />
				<div className="content-wrapper clearfix">
					<Control getData={this.getData.bind(this)} />
					<div className="map-wrapper">
						<div className="map" id="map" style={{height:600}}></div>
					</div>
					<Detail store={this.state.store} getData={this.getData.bind(this)} />
				</div>
				<Submit getData={this.getData.bind(this)} editStart={this.editStart.bind(this)} />
			</div>
	    );
	  }
}

export default EditorPage;

