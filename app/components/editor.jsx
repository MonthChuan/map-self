import React from 'react'; 

import PlazaSelect from './plazaselect/plazaselect.jsx';    

class EditorPage extends React.Component{
	constructor() {
		super();
	}

	render () {
	    return (
	      <div id="editor">
						<PlazaSelect />
				</div>
	    );
	  }
}

export default EditorPage;

