Ext.define('GibsonOS.module.rdm.index.model.Grid', {
    extend: 'GibsonOS.data.Model',
    fields: [{
        name: 'name',
        type: 'string'
    },{
        name: 'id',
        type: 'int'
    },{
        name: 'size',
        type: 'int'
    },{
        name: 'downloaded',
        type: 'int'
    },{
        name: 'url',
        type: 'string'
    },{
        name: 'elapsed',
        type: 'int'
    },{
        name: 'remaining',
        type: 'int'
    },{
        name: 'speed',
        type: 'int'
    },{
        name: 'status',
        type: 'int'
    },{
        name: 'percent',
        type: 'double'
    },{
        name: 'job',
        type: 'string'
    }]
});