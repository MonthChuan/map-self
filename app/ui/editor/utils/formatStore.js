export const formatStore = (obj, getId) => {
    let coords = [];
    let centerPoint = null;
    let centerPointXY = {x : 0, y : 0};
    let coordsList = [];
    let layerType = '';
    let paramId = '';
    let param = null;

    paramId = obj.feature.id;

    param = {
        type : 'Feature',
        id : paramId,
        properties : {
            re_name : obj.feature.properties.re_name || '',
            re_type : obj.feature.properties.re_type || '',
            region_id : paramId
        }
    };

    if(obj.coorChange) {
        if(obj.graphics) {
            layerType = 'graphics';
        }

        if(obj.action != 'DELETE') {
            if(obj.coords) {
                coords = obj.coords;
                centerPoint = obj.getBounds().getCenter();
            } 
            else {
                if(obj.centerPoint) {
                    centerPoint = obj.centerPoint;
                }
                else {
                    if(obj.getCenter) {
                        centerPoint = obj.getCenter();
                    }
                    else {
                        centerPoint = obj[layerType].getCenter();
                    }
                }
                
                if(obj.coordinates) {
                    coords = obj.coordinates;
                }
                else {
                    coordsList = FMap.Utils.getOriginalByLatlngs(obj.getLatLngs());
                    if(coordsList[0].length > 1) {
                        coords = coordsList[0];
                    }
                    else {
                        coords = coordsList[0][0];
                    }
                }
            }
            
            centerPointXY = FMap.Utils.toOriginalCoordinates(centerPoint);
        }

        param.properties.centerx = centerPointXY.x;
        param.properties.centery = centerPointXY.y;

        param.geometry = {
            type : 'MultiPolygon',
            coordinates : [[coords.concat(coords.slice(0,1))]]
        }
    }

    return {
        action : obj.action,
        feature : param
    }
};

export const formatStoreList = (storeList) => {
    const regionParam = [];
    storeList.map(item => {
      if(item.action && item.action != '') {
        regionParam.push( formatStore(item) );
      }
	});

    return regionParam;
};