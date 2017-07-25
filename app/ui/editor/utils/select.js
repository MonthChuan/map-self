// import { DomUtil } from 'leaflet';

const getSelect = (item) => {
  if(item.selected) {
    return item.selected;
  }
  else {
    return false;
  }
};

const setSelect = (item, value) => {
  if(item.selected && item.selected == value) {
    return;
  }
  item.selected = value;

  let itemElement = null;
  if(item.layerDisplay && item.layerDisplay.getElement) {
    itemElement = item.layerDisplay.getElement();
  }
  else if(item.getElement) {
    itemElement = item.getElement();
  }
  else if(item.graphics) {
    itemElement = item.graphics.getElement();
  }

  if(itemElement && itemElement.className) {
    if (value) {
      L.DomUtil.addClass(itemElement, 'selected');
    } else {
      L.DomUtil.removeClass(itemElement, 'selected');
    }
  }
};

export { getSelect, setSelect };