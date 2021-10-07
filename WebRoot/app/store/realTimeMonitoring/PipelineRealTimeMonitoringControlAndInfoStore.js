Ext.define('AP.store.realTimeMonitoring.PipelineRealTimeMonitoringControlAndInfoStore', {
    extend: 'Ext.data.Store',
    alias: 'widget.pipelineRealTimeMonitoringControlAndInfoStore',
    autoLoad: true,
    pageSize: 10000,
    proxy: {
        type: 'ajax',
        url: context + '/realTimeMonitoringController/getDeviceControlandInfoData',
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
        	var get_rawData = store.proxy.reader.rawData;
        	var isControl=get_rawData.isControl;
        	var deviceInfoDataList=get_rawData.deviceInfoDataList;
        	var deviceControlList=get_rawData.deviceControlList;
        	
        	var deviceInfoDataStr="{\"items\":[";
        	for(var i=0;i<deviceInfoDataList.length;i++){
        		deviceInfoDataStr+="{\"item\":\""+deviceInfoDataList[i].title+"\",\"itemcode\":\""+deviceInfoDataList[i].name+"\",\"value\":\""+deviceInfoDataList[i].value+"\"},";
        	}
        	if(stringEndWith(deviceInfoDataStr,",")){
        		deviceInfoDataStr = deviceInfoDataStr.substring(0, deviceInfoDataStr.length - 1);
    		}
        	deviceInfoDataStr+="]}";
        	
        	var deviceInfoStoreData=Ext.JSON.decode(deviceInfoDataStr);
        	var deviceInfoStore=Ext.create('Ext.data.Store', {
			    fields:['item', 'itemCode','value'],
			    data:deviceInfoStoreData,
			    proxy: {
			        type: 'memory',
			        reader: {
			            type: 'json',
			            root: 'items'
			        }
			    }
			});
        	var deviceInfoGridPanel=Ext.getCmp("PipelineRealTimeMonitoringDeviceInfoDataGridPanel_Id");
    		if(!isNotVal(deviceInfoGridPanel)){
    			deviceInfoGridPanel=Ext.create('Ext.grid.Panel', {
    				id:'PipelineRealTimeMonitoringDeviceInfoDataGridPanel_Id',
    				border: false,
    				columnLines: true,
    				forceFit: false,
    				store: deviceInfoStore,
    			    columns: [
    			    	{ 
    			        	header: '名称',  
    			        	dataIndex: 'item',
    			        	align:'left',
    			        	flex:9,
    			        	renderer:function(value){
    			        		return "<span data-qtip=\""+(value==undefined?"":value)+"\">"+(value==undefined?"":value)+"</span>";
    			        	}
    			        },
    			        { 
    			        	header: '变量', 
    			        	dataIndex: 'value',
    			        	align:'center',
    			        	flex:10,
    			        	renderer:function(value){
    			        		return "<span data-qtip=\""+(value==undefined?"":value)+"\">"+(value==undefined?"":value)+"</span>";
    			        	}
    			        }
    			    ]
    			});
    			Ext.getCmp("PipelineRealTimeMonitoringRightDeviceInfoPanel").add(deviceInfoGridPanel);
    		}else{
    			deviceInfoGridPanel.reconfigure(deviceInfoStore);
    		}
        	
        	
        	
        	//控制
        	var controlDataStr="{\"items\":[";
        	for(var i=0;i<deviceControlList.length;i++){
        		controlDataStr+="{\"item\":\""+deviceControlList[i].title+"\",\"itemcode\":\""+deviceControlList[i].name+"\",\"value\":\""+deviceControlList[i].value+"\",\"operation\":true,\"isControl\":"+isControl+",\"showType\":1,\"commStatus\":"+commStatus+"},";
        	}
        	if(stringEndWith(controlDataStr,",")){
    			controlDataStr = controlDataStr.substring(0, controlDataStr.length - 1);
    		}
    		controlDataStr+="]}";
        	
    		var controlStoreData=Ext.JSON.decode(controlDataStr);
    		
    		var controlStore=Ext.create('Ext.data.Store', {
			    fields:['item','value','operation'],
			    data:controlStoreData,
			    proxy: {
			        type: 'memory',
			        reader: {
			            type: 'json',
			            root: 'items'
			        }
			    }
			});
    		
    		var controlGridPanel=Ext.getCmp("PipelineRealTimeMonitoringControlDataGridPanel_Id");
    		if(!isNotVal(controlGridPanel)){
    			controlGridPanel=Ext.create('Ext.grid.Panel', {
    				id:'PipelineRealTimeMonitoringControlDataGridPanel_Id',
    				requires: [
                       	'Ext.grid.selection.SpreadsheetModel',
                       	'Ext.grid.plugin.Clipboard'
                       	],
                    xtype:'spreadsheet-checked',
                    plugins: [
                        'clipboard',
                        'selectionreplicator',
                        new Ext.grid.plugin.CellEditing({
                      	  clicksToEdit:2
                        })
                    ],
    				border: false,
    				columnLines: true,
    				forceFit: false,
    				store: controlStore,
    			    columns: [
    			        { 
    			        	header: '操作项',  
    			        	dataIndex: 'item',
    			        	align:'left',
    			        	flex:12,
    			        	renderer:function(value){
    			        		return "<span data-qtip=\""+(value==undefined?"":value)+"\">"+(value==undefined?"":value)+"</span>";
    			        	}
    			        },
//    			        { 
//    			        	header: '变量', 
//    			        	dataIndex: 'value',
//    			        	align:'center',
//    			        	flex:3,
//    			        	renderer:function(value){
//    			        		return "<span data-qtip=\""+(value==undefined?"":value)+"\">"+(value==undefined?"":value)+"</span>";
//    			        	}
//    			        },
    			        { 	header: '操作', 
    			        	dataIndex: 'operation',
    			        	align:'center',
    			        	flex:4,
    			        	renderer :function(value,e,o){
    			        		var id = e.record.id;
    			        		var item=o.data.item;
    			        		var itemcode=o.data.itemcode;
    			        		var isControl=o.data.isControl;
    			        		var resolutionMode=o.data.resolutionMode;
    			        		var text="";
    			        		var hand=false;
    			        		var hidden=false;
    			        		if(isControl==1){
    			        			hand=false;
    			        		}else{
    			        			hand=true;
    			        		}
    			        		if(!o.data.operation){
    			        			hidden=true;
    			        		}
    			        		text="设置";
    		                    Ext.defer(function () {
    		                        Ext.widget('button', {
    		                            renderTo: id,
    		                            height: 18,
    		                            width: 50,
    		                            text: text,
    		                            disabled:hand,
    		                            hidden:hidden,
    		                            handler: function () {
    		                            	var operaName="";
    		                            	if(text=="停抽"||text=="启抽"||text=="即时采集"||text=="即时刷新"){
    		                            		operaName="是否执行"+text+"操作";
    		                            	}else{
    		                            		operaName="是否执行"+text+item.split("(")[0]+"操作";
    		                            	}
    		                            	 Ext.MessageBox.msgButtons['yes'].text = "<img   style=\"border:0;position:absolute;right:50px;top:1px;\"  src=\'" + context + "/images/zh_CN/accept.png'/>&nbsp;&nbsp;&nbsp;确定";
    		                                 Ext.MessageBox.msgButtons['no'].text = "<img   style=\"border:0;position:absolute;right:50px;top:1px;\"  src=\'" + context + "/images/zh_CN/cancel.png'/>&nbsp;&nbsp;&nbsp;取消";
    		                                 Ext.Msg.confirm("操作确认", operaName, function (btn) {
    		                                     if (btn == "yes") {
    		                                         var win_Obj = Ext.getCmp("DeviceControlCheckPassWindow_Id")
    		                                         if (win_Obj != undefined) {
    		                                             win_Obj.destroy();
    		                                         }
    		                                         var DeviceControlCheckPassWindow = Ext.create("AP.view.realTimeMonitoring.DeviceControlCheckPassWindow", {
    		                                             title: '控制'
    		                                         });
    		                                         
    		                                         
    		                                     	 var wellName  = Ext.getCmp("PumpRealTimeMonitoringListGridPanel_Id").getSelectionModel().getSelection()[0].data.wellName;
    		                                     	 Ext.getCmp("DeviceControlWellName_Id").setValue(wellName);
    		                                     	 Ext.getCmp("DeviceControlDeviceType_Id").setValue(1);
    		                                         Ext.getCmp("DeviceControlType_Id").setValue(o.data.itemcode);
    		                                         Ext.getCmp("DeviceControlShowType_Id").setValue(resolutionMode);
    		                                         
    		                                         Ext.getCmp("DeviceControlValue_Id").setValue("");
    		                                         Ext.getCmp("checkPassFromPassword_id").setValue("");
    		                                         
    		                                         Ext.getCmp("DeviceControlShowType_Id").setValue(2);
    		                                         Ext.getCmp("DeviceControlValue_Id").show();
		                                        	 Ext.getCmp("DeviceControlValueCombo_Id").hide();
		                                        	 Ext.getCmp("DeviceControlValue_Id").setFieldLabel(o.data.item);
		                                        	 Ext.getCmp("DeviceControlValue_Id").setValue(o.data.value);
    		                                         
//    		                                         if(resolutionMode==0){//开关量
//    		                                        	 Ext.getCmp("DeviceControlValue_Id").hide();
//    		                                        	 Ext.getCmp("DeviceControlValueCombo_Id").hide();
//    		                                         }else if(resolutionMode==1){//枚举量
//    		                                        	 Ext.getCmp("DeviceControlValue_Id").hide();
//    		                                        	 Ext.getCmp("DeviceControlValueCombo_Id").setFieldLabel(o.data.item);
//    		                                        	 var data=[];
//    		                                        	 if(o.data.itemcode=="balanceCalculateMode"){
//    		                                        		 data=[['1', '下行程最大值/上行程最大值'], ['2', '上行程最大值/下行程最大值']];
//    		                                        	 }else if(o.data.itemcode=="balanceCalculateType"){
//    		                                        		 data=[['1', '电流法'], ['2', '功率法']];
//    		                                        	 }else if(o.data.itemcode=="balanceControlMode"){
//    		                                        		 data=[['0', '手动'], ['1', '自动']];
//    		                                        	 }
//    		                                        	 var controlTypeStore = new Ext.data.SimpleStore({
//    		                                             	autoLoad : false,
//    		                                                 fields: ['boxkey', 'boxval'],
//    		                                                 data: data
//    		                                             });
//    		                                        	 Ext.getCmp("DeviceControlValueCombo_Id").setStore(controlTypeStore);
//    		                                        	 Ext.getCmp("DeviceControlValueCombo_Id").setRawValue(o.data.value);
//    		                                        	 Ext.getCmp("DeviceControlValueCombo_Id").show();
//    		                                         }else{
//    		                                        	 Ext.getCmp("DeviceControlValue_Id").show();
//    		                                        	 Ext.getCmp("DeviceControlValueCombo_Id").hide();
//    		                                        	 Ext.getCmp("DeviceControlValue_Id").setFieldLabel(o.data.item);
//    		                                        	 Ext.getCmp("DeviceControlValue_Id").setValue(o.data.value);
//    		                                         }
    		                                         
    		                                         DeviceControlCheckPassWindow.show();
    		                                         Ext.getCmp("DeviceControlValue_Id").setValue("");
    		                                         Ext.getCmp("checkPassFromPassword_id").setValue("");
    		                                     }
    		                                 });
    		                            }
    		                        });
    		                    }, 50);
    		                    return Ext.String.format('<div id="{0}"></div>', id);
    			        	} 
    			        }
    			    ]
    			});
    			Ext.getCmp("PipelineRealTimeMonitoringRightControlPanel").add(controlGridPanel);
    		}else{
    			controlGridPanel.reconfigure(controlStore);
    		}
        },
        beforeload: function (store, options) {
        	var wellName  = Ext.getCmp("PipelineRealTimeMonitoringListGridPanel_Id").getSelectionModel().getSelection()[0].data.wellName;
        	var new_params = {
        			wellName: wellName,
        			deviceType:1
                };
           Ext.apply(store.proxy.extraParams, new_params);
        },
        datachanged: function (v, o) {
            //onLabelSizeChange(v, o, "statictisTotalsId");
        }
    }
});