Ext.define('AP.store.realTimeMonitoring.PumpRealTimeMonitoringWellListStore', {
    extend: 'Ext.data.Store',
    alias: 'widget.pumpRealTimeMonitoringWellListStore',
    fields: ['id','commStatus','commStatusName','wellName'],
    autoLoad: true,
    pageSize: 50,
    proxy: {
        type: 'ajax',
        url: context + '/realTimeMonitoringController/getDeviceRealTimeOverview',
        actionMethods: {
            read: 'POST'
        },
    reader: {
            type: 'json',
            rootProperty: 'totalRoot',
            totalProperty: 'totalCount',
            keepRawData: true
        }
    },
    listeners: {
        load: function (store, record, f, op, o) {
            //获得列表数
            var get_rawData = store.proxy.reader.rawData;
            var arrColumns = get_rawData.columns;
            var column = createRealTimeMonitoringColumn(arrColumns);
            Ext.getCmp("PumpRealTimeMonitoringColumnStr_Id").setValue(column);
            Ext.getCmp("AlarmShowStyle_Id").setValue(JSON.stringify(get_rawData.AlarmShowStyle));
            var gridPanel = Ext.getCmp("PumpRealTimeMonitoringListGridPanel_Id");
            if (!isNotVal(gridPanel)) {
                var newColumns = Ext.JSON.decode(column);
                var bbar = new Ext.PagingToolbar({
                	store: store,
                	displayInfo: true,
                	displayMsg: '共 {2}条'
    	        });
                
                gridPanel = Ext.create('Ext.grid.Panel', {
                    id: "PumpRealTimeMonitoringListGridPanel_Id",
                    border: false,
                    autoLoad: true,
                    bbar: bbar,
                    columnLines: true,
                    forceFit: false,
//                    stripeRows: true,
                    viewConfig: {
                    	emptyText: "<div class='con_div_' id='div_dataactiveid'><" + cosog.string.nodata + "></div>"
                    },
                    store: store,
                    columns: newColumns,
                    listeners: {
                    	selectionchange: function (view, selected, o) {
                    		Ext.getCmp("PumpRealTimeMonitoringSelectedCurve_Id").setValue('');
                    	},
                    	select: function(grid, record, index, eOpts) {
                    		Ext.getCmp("PumpRealTimeMonitoringSelectedCurve_Id").setValue('');
                    		Ext.getCmp("PumpRealTimeMonitoringInfoDeviceListSelectRow_Id").setValue(index);
                    		var deviceName=record.data.wellName;
                    		var deviceType=0;
                    		CreatePumpDeviceRealTimeMonitoringDataTable(deviceName,deviceType);
                    		Ext.create('AP.store.realTimeMonitoring.PumpRealTimeMonitoringControlAndInfoStore');
                    	}
                    }
                });
                var PumpRealTimeMonitoringInfoDeviceListPanel = Ext.getCmp("PumpRealTimeMonitoringInfoDeviceListPanel_Id");
                PumpRealTimeMonitoringInfoDeviceListPanel.add(gridPanel);
            }
            if(get_rawData.totalCount>0){
//            	if(gridPanel.getSelectionModel().getSelection().length>0){
//            		gridPanel.getSelectionModel().deselectAll(true);
//            	}
            	gridPanel.getSelectionModel().select(0, true);
            }else{
            	if(pumpDeviceRealTimeMonitoringDataHandsontableHelper!=null){
					if(pumpDeviceRealTimeMonitoringDataHandsontableHelper.hot!=undefined){
						pumpDeviceRealTimeMonitoringDataHandsontableHelper.hot.destroy();
					}
					pumpDeviceRealTimeMonitoringDataHandsontableHelper=null;
				}
            	Ext.getCmp("PumpRealTimeMonitoringSelectedCurve_Id").setValue('');
            	
            	$("#pumpRealTimeMonitoringCurveDiv_Id").html('');
            	
            	Ext.getCmp("PumpRealTimeMonitoringRightControlPanel").removeAll();
            	Ext.getCmp("PumpRealTimeMonitoringRightDeviceInfoPanel").removeAll();
            }
        },
        beforeload: function (store, options) {
        	var orgId = Ext.getCmp('leftOrg_Id').getValue();
        	var deviceName=Ext.getCmp('RealTimeMonitoringPumpDeviceListComb_Id').getValue();
        	var commStatus  = Ext.getCmp("PumpRealTimeMonitoringStatGridPanel_Id").getSelectionModel().getSelection()[0].data.itemCode;
        	
            var new_params = {
                    orgId: orgId,
                    deviceType:0,
                    deviceName:deviceName,
                    commStatus:commStatus
                };
            Ext.apply(store.proxy.extraParams, new_params);
        },
        datachanged: function (v, o) {
            //onLabelSizeChange(v, o, "statictisTotalsId");
        }
    }
});