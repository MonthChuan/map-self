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

  if (value) {
    L.DomUtil.addClass(item.getElement(), 'selected');
  } else {
    if(item.getElement && item.getElement().className) {
      L.DomUtil.removeClass(item.getElement(), 'selected');
    }
  }
};

export { getSelect, setSelect };