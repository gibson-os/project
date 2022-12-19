GibsonOS.define('GibsonOS.module.hc.rfmrhinetower.fn.setColor', function(element, brightness) {
    var gosData = Ext.decode(element.getAttribute('gos'));
    var color = '#';

    color += parseInt(((gosData.r ? gosData.r : 0)/15)*brightness).toString(16);
    color += parseInt(((gosData.g ? gosData.g : 0)/15)*brightness).toString(16);
    color += parseInt(((gosData.b ? gosData.b : 0)/15)*brightness).toString(16);

    element.style.fill = color;
});