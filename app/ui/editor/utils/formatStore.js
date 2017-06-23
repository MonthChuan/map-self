export const formatStore = (obj, getId) => {
    let coords = [];
    let centerPoint = null;
    let centerPointXY = {x : 0, y : 0};
    let coordsList = [];
    let layerType = '';
    let paramId = '';

    if(obj.graphics) {
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
            
            coordsList = FMap.Utils.getOriginalByLatlngs(obj.getLatLngs());
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
        paramId = getId();
    }
    else {
        paramId = obj.feature.properties.region_id;
    }

    const param = {
        type : 'Feature',
        id : paramId,
        properties : {
            centerx : centerPointXY.x,
            centery : centerPointXY.y,
            re_name : obj.feature.properties.re_name || '',
            re_type : obj.feature.properties.re_type || '',
            region_id : paramId
        },
        geometry : {
            type : 'MultiPolygon',
            coordinates : [[coords.concat(coords.slice(0,1))]]
        }
    };

    return {
        action : obj.action,
        feature : param
    }
}