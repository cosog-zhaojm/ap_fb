var protocolAcqUnitConfigItemsHandsontableHelper=null;
var protocolConfigAcqUnitPropertiesHandsontableHelper=null;
Ext.define('AP.view.acquisitionUnit.ModbusProtocolAcqUnitConfigInfoView', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.modbusProtocolAcqUnitConfigInfoView',
    layout: "fit",
    id:'modbusProtocolAcqUnitConfigInfoViewId',
    border: false,
    initComponent: function () {
    	var me = this;
    	Ext.apply(me, {
    		items: [{
            	tbar: [{
                    id: 'ModbusProtocolAcqGroupConfigSelectRow_Id',
                    xtype: 'textfield',
                    value: 0,
                    hidden: true
                },'->',{
        			xtype: 'button',
                    text: '添加采控单元',
                    iconCls: 'add',
                    handler: function (v, o) {
                    	addAcquisitionUnitInfo();
        			}
        		},"-",{
        			xtype: 'button',
                    text: '添加采控组',
                    iconCls: 'add',
                    handler: function (v, o) {
                    	addAcquisitionGroupInfo();
        			}
        		},"-",{
                	xtype: 'button',
        			pressed: true,
        			text: cosog.string.save,
        			iconCls: 'save',
        			handler: function (v, o) {
        				SaveModbusProtocolAcqUnitConfigTreeData();
        			}
                }],
                layout: "border",
                items: [{
                	border: true,
                	region: 'west',
                	width:'25%',
                    layout: "border",
                    border: true,
                    header: false,
                    collapsible: true,
                    split: true,
                    collapseDirection: 'left',
                    hideMode:'offsets',
                    items: [{
                    	region: 'center',
                    	title:'采控单元配置',
//                    	autoScroll:true,
                        scrollable: true,
                    	id:"ModbusProtocolAcqGroupConfigPanel_Id"
                    },{
                    	region: 'south',
                    	height:'42%',
                    	title:'属性',
                    	collapsible: true,
                        split: true,
                    	layout: 'fit',
                        html:'<div class="ModbusProtocolAcqGroupPropertiesTableInfoContainer" style="width:100%;height:100%;"><div class="con" id="ModbusProtocolAcqGroupPropertiesTableInfoDiv_id"></div></div>',
                        listeners: {
                            resize: function (abstractcomponent, adjWidth, adjHeight, options) {
                            	if(protocolConfigAcqUnitPropertiesHandsontableHelper!=null && protocolConfigAcqUnitPropertiesHandsontableHelper.hot!=undefined){
                            		var selectRow= Ext.getCmp("ModbusProtocolAcqGroupConfigSelectRow_Id").getValue();
                            		var gridPanel=Ext.getCmp("ModbusProtocolAcqGroupConfigTreeGridPanel_Id");
                            		if(isNotVal(gridPanel)){
                            			var selectedItem=gridPanel.getStore().getAt(selectRow);
                            			CreateProtocolAcqUnitConfigPropertiesInfoTable(selectedItem.data);
                            		}
                            	}
                            }
                        }
                    }]
                },{
                	border: true,
//                    flex: 4,
                	region: 'center',
                    title:'采控项配置',
                    id:"ModbusProtocolAcqGroupItemsConfigTableInfoPanel_Id",
                    layout: 'fit',
                    html:'<div class="ModbusProtocolAcqGroupItemsConfigTableInfoContainer" style="width:100%;height:100%;"><div class="con" id="ModbusProtocolAcqGroupItemsConfigTableInfoDiv_id"></div></div>',
                    listeners: {
                        resize: function (abstractcomponent, adjWidth, adjHeight, options) {
                        	if(protocolAcqUnitConfigItemsHandsontableHelper!=null && protocolAcqUnitConfigItemsHandsontableHelper.hot!=undefined){
                        		var selectRow= Ext.getCmp("ModbusProtocolAcqGroupConfigSelectRow_Id").getValue();
                        		var gridPanel=Ext.getCmp("ModbusProtocolAcqGroupConfigTreeGridPanel_Id");
                        		if(isNotVal(gridPanel)){
                        			var selectedItem=gridPanel.getStore().getAt(selectRow);
                        			if(selectedItem.data.classes==0){
                                		if(isNotVal(selectedItem.data.children) && selectedItem.data.children.length>0){
                                			CreateProtocolAcqUnitItemsConfigInfoTable(selectedItem.data.children[0].text,selectedItem.data.children[0].classes,selectedItem.data.children[0].code);
                                		}
                                	}else if(selectedItem.data.classes==1){
                                		CreateProtocolAcqUnitItemsConfigInfoTable(selectedItem.data.text,selectedItem.data.classes,selectedItem.data.code);
                                	}else if(selectedItem.data.classes==2||selectedItem.data.classes==3){
                                		CreateProtocolAcqUnitItemsConfigInfoTable(selectedItem.data.protocol,selectedItem.data.classes,selectedItem.data.code);
                                	}
                        		}
                        	}
                        }
                    }
                }]
            }]
    	});
        this.callParent(arguments);
    }
});

function CreateProtocolAcqUnitItemsConfigInfoTable(protocolName,classes,code){
	Ext.Ajax.request({
		method:'POST',
		url:context + '/acquisitionUnitManagerController/getProtocolItemsConfigData',
		success:function(response) {
//			Ext.getCmp("DriverItemsConfigTableInfoPanel_Id").setTitle(protocolName+"采控项配置");
			var result =  Ext.JSON.decode(response.responseText);
			if(protocolAcqUnitConfigItemsHandsontableHelper==null || protocolAcqUnitConfigItemsHandsontableHelper.hot==undefined){
				protocolAcqUnitConfigItemsHandsontableHelper = ProtocolAcqUnitConfigItemsHandsontableHelper.createNew("ModbusProtocolAcqGroupItemsConfigTableInfoDiv_id");
				var colHeaders="['','序号','名称','地址','数量','存储数据类型','接口数据类型','读写类型','单位','换算比例','采集模式']";
				var columns="[{data:'checked',type:'checkbox'},{data:'id'},{data:'title'},"
					 	+"{data:'addr',type:'text',allowInvalid: true, validator: function(val, callback){return handsontableDataCheck_Num(val, callback,this.row, this.col,protocolAcqUnitConfigItemsHandsontableHelper);}},"
						+"{data:'quantity',type:'text',allowInvalid: true, validator: function(val, callback){return handsontableDataCheck_Num(val, callback,this.row, this.col,protocolAcqUnitConfigItemsHandsontableHelper);}}," 
						+"{data:'storeDataType',type:'dropdown',strict:true,allowInvalid:false,source:['byte','int16','uint16','float32','bcd']}," 
						+"{data:'IFDataType',type:'dropdown',strict:true,allowInvalid:false,source:['bool','int','float32','float64','string']}," 
						+"{data:'RWType',type:'dropdown',strict:true,allowInvalid:false,source:['只读', '读写']}," 
						+"{data:'unit'}," 
						+"{data:'ratio',type:'text',allowInvalid: true, validator: function(val, callback){return handsontableDataCheck_Num(val, callback,this.row, this.col,protocolAcqUnitConfigItemsHandsontableHelper);}}," 
						+"{data:'acqMode',type:'dropdown',strict:true,allowInvalid:false,source:['主动上传', '被动响应']}" 
						+"]";
				protocolAcqUnitConfigItemsHandsontableHelper.colHeaders=Ext.JSON.decode(colHeaders);
				protocolAcqUnitConfigItemsHandsontableHelper.columns=Ext.JSON.decode(columns);
				if(result.totalRoot.length==0){
					protocolAcqUnitConfigItemsHandsontableHelper.createTable([{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}]);
				}else{
					protocolAcqUnitConfigItemsHandsontableHelper.createTable(result.totalRoot);
				}
			}else{
				if(result.totalRoot.length==0){
					protocolAcqUnitConfigItemsHandsontableHelper.hot.loadData([{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}]);
				}else{
					protocolAcqUnitConfigItemsHandsontableHelper.hot.loadData(result.totalRoot);
				}
			}
		},
		failure:function(){
			Ext.MessageBox.alert("错误","与后台联系的时候出了问题");
		},
		params: {
			protocolName:protocolName,
			classes:classes,
			code:code
        }
	});
};

var ProtocolAcqUnitConfigItemsHandsontableHelper = {
		createNew: function (divid) {
	        var protocolAcqUnitConfigItemsHandsontableHelper = {};
	        protocolAcqUnitConfigItemsHandsontableHelper.hot1 = '';
	        protocolAcqUnitConfigItemsHandsontableHelper.divid = divid;
	        protocolAcqUnitConfigItemsHandsontableHelper.validresult=true;//数据校验
	        protocolAcqUnitConfigItemsHandsontableHelper.colHeaders=[];
	        protocolAcqUnitConfigItemsHandsontableHelper.columns=[];
	        protocolAcqUnitConfigItemsHandsontableHelper.AllData=[];
	        
	        protocolAcqUnitConfigItemsHandsontableHelper.addColBg = function (instance, td, row, col, prop, value, cellProperties) {
	             Handsontable.renderers.TextRenderer.apply(this, arguments);
	             td.style.backgroundColor = 'rgb(242, 242, 242)';    
	        }
	        
	        protocolAcqUnitConfigItemsHandsontableHelper.addBoldBg = function (instance, td, row, col, prop, value, cellProperties) {
	            Handsontable.renderers.TextRenderer.apply(this, arguments);
	            td.style.backgroundColor = 'rgb(184, 184, 184)';
	        }
	        
	        protocolAcqUnitConfigItemsHandsontableHelper.createTable = function (data) {
	        	$('#'+protocolAcqUnitConfigItemsHandsontableHelper.divid).empty();
	        	var hotElement = document.querySelector('#'+protocolAcqUnitConfigItemsHandsontableHelper.divid);
	        	protocolAcqUnitConfigItemsHandsontableHelper.hot = new Handsontable(hotElement, {
	        		data: data,
	        		colWidths: [25,50,120,80,80,80,80,80,80,80,80],
//	                hiddenColumns: {
//	                    columns: [0],
//	                    indicators: true
//	                },
	                columns:protocolAcqUnitConfigItemsHandsontableHelper.columns,
	                stretchH: 'all',//延伸列的宽度, last:延伸最后一列,all:延伸所有列,none默认不延伸
	                autoWrapRow: true,
	                rowHeaders: false,//显示行头
	                colHeaders:protocolAcqUnitConfigItemsHandsontableHelper.colHeaders,//显示列头
	                columnSorting: true,//允许排序
	                sortIndicator: true,
	                manualColumnResize:true,//当值为true时，允许拖动，当为false时禁止拖动
	                manualRowResize:true,//当值为true时，允许拖动，当为false时禁止拖动
	                filters: true,
	                renderAllRows: true,
	                search: true,
	                cells: function (row, col, prop) {
	                	var cellProperties = {};
	                    var visualRowIndex = this.instance.toVisualRow(row);
	                    var visualColIndex = this.instance.toVisualColumn(col);
	                    if (visualColIndex >0) {
							cellProperties.readOnly = true;
//							cellProperties.renderer = protocolAcqUnitConfigItemsHandsontableHelper.addBoldBg;
		                }
	                    return cellProperties;
	                },
	                afterSelectionEnd : function (row,column,row2,column2, preventScrolling,selectionLayerLevel) {
//	                	var row1=protocolAcqUnitConfigItemsHandsontableHelper.hot.getDataAtRow(row);
//	                	if(row1[0]){
//	                		protocolAcqUnitConfigItemsHandsontableHelper.hot.setDataAtCell(row, 0, false);
//	                	}else{
//	                		protocolAcqUnitConfigItemsHandsontableHelper.hot.setDataAtCell(row, 0, true);
//	                	}
	                }
//	        		,colHeaders: function (col) { 
//	                    switch (col) { 
//	                     case 0: 
//	                      var txt = "<input type='checkbox' class='checker' "; 
//	                      txt += isChecked(data) ? 'checked="checked"' : ''; 
//	                      txt += "> 全选"; 
//	                      return txt; 
//	                     default:
//	                    	 return protocolAcqUnitConfigItemsHandsontableHelper.colHeaders[col]; 
//	                    } 
//	                 }
	        	});
	        }
	        //保存数据
	        protocolAcqUnitConfigItemsHandsontableHelper.saveData = function () {}
	        protocolAcqUnitConfigItemsHandsontableHelper.clearContainer = function () {
	        	protocolAcqUnitConfigItemsHandsontableHelper.AllData = [];
	        }
	        return protocolAcqUnitConfigItemsHandsontableHelper;
	    }
};


function CreateProtocolAcqUnitConfigPropertiesInfoTable(data){
	var root=[];
	if(data.classes==2){
		var item1={};
		item1.id=1;
		item1.title='单元名称';
		item1.value=data.text;
		root.push(item1);
		
		var item2={};
		item2.id=2;
		item2.title='备注';
		item2.value=data.remark;
		root.push(item2);
	}else if(data.classes==3){
		var item1={};
		item1.id=1;
		item1.title='组名称';
		item1.value=data.text;
		root.push(item1);
		
		var item2={};
		item2.id=2;
		item2.title='组类型';
		item2.value=data.typeName;
		root.push(item2);
		
		var item3={};
		item3.id=3;
		item3.title='保存周期(s)';
		item3.value=data.save_cycle;
		root.push(item3);
		
		var item4={};
		item4.id=4;
		item4.title='备注';
		item4.value=data.remark;
		root.push(item4);
	}
	
	if(protocolConfigAcqUnitPropertiesHandsontableHelper==null || protocolConfigAcqUnitPropertiesHandsontableHelper.hot==undefined){
		protocolConfigAcqUnitPropertiesHandsontableHelper = ProtocolConfigAcqUnitPropertiesHandsontableHelper.createNew("ModbusProtocolAcqGroupPropertiesTableInfoDiv_id");
		var colHeaders="['序号','名称','变量']";
		var columns="[{data:'id'},{data:'title'},{data:'value'}]";
		protocolConfigAcqUnitPropertiesHandsontableHelper.colHeaders=Ext.JSON.decode(colHeaders);
		protocolConfigAcqUnitPropertiesHandsontableHelper.columns=Ext.JSON.decode(columns);
		protocolConfigAcqUnitPropertiesHandsontableHelper.classes=data.classes;
		protocolConfigAcqUnitPropertiesHandsontableHelper.createTable(root);
	}else{
		protocolConfigAcqUnitPropertiesHandsontableHelper.classes=data.classes;
		protocolConfigAcqUnitPropertiesHandsontableHelper.hot.loadData(root);
	}
};

var ProtocolConfigAcqUnitPropertiesHandsontableHelper = {
		createNew: function (divid) {
	        var protocolConfigAcqUnitPropertiesHandsontableHelper = {};
	        protocolConfigAcqUnitPropertiesHandsontableHelper.hot = '';
	        protocolConfigAcqUnitPropertiesHandsontableHelper.classes =null;
	        protocolConfigAcqUnitPropertiesHandsontableHelper.divid = divid;
	        protocolConfigAcqUnitPropertiesHandsontableHelper.validresult=true;//数据校验
	        protocolConfigAcqUnitPropertiesHandsontableHelper.colHeaders=[];
	        protocolConfigAcqUnitPropertiesHandsontableHelper.columns=[];
	        protocolConfigAcqUnitPropertiesHandsontableHelper.AllData=[];
	        
	        protocolConfigAcqUnitPropertiesHandsontableHelper.addColBg = function (instance, td, row, col, prop, value, cellProperties) {
	             Handsontable.renderers.TextRenderer.apply(this, arguments);
	             td.style.backgroundColor = 'rgb(242, 242, 242)';    
	        }
	        
	        protocolConfigAcqUnitPropertiesHandsontableHelper.addBoldBg = function (instance, td, row, col, prop, value, cellProperties) {
	            Handsontable.renderers.TextRenderer.apply(this, arguments);
	            td.style.backgroundColor = 'rgb(184, 184, 184)';
	        }
	        
	        protocolConfigAcqUnitPropertiesHandsontableHelper.createTable = function (data) {
	        	$('#'+protocolConfigAcqUnitPropertiesHandsontableHelper.divid).empty();
	        	var hotElement = document.querySelector('#'+protocolConfigAcqUnitPropertiesHandsontableHelper.divid);
	        	protocolConfigAcqUnitPropertiesHandsontableHelper.hot = new Handsontable(hotElement, {
	        		data: data,
	        		colWidths: [2,5,5],
//	                hiddenColumns: {
//	                    columns: [0],
//	                    indicators: true
//	                },
	                columns:protocolConfigAcqUnitPropertiesHandsontableHelper.columns,
	                stretchH: 'all',//延伸列的宽度, last:延伸最后一列,all:延伸所有列,none默认不延伸
	                autoWrapRow: true,
	                rowHeaders: false,//显示行头
	                colHeaders:protocolConfigAcqUnitPropertiesHandsontableHelper.colHeaders,//显示列头
	                columnSorting: true,//允许排序
	                sortIndicator: true,
	                manualColumnResize:true,//当值为true时，允许拖动，当为false时禁止拖动
	                manualRowResize:true,//当值为true时，允许拖动，当为false时禁止拖动
	                filters: true,
	                renderAllRows: true,
	                search: true,
	                cells: function (row, col, prop) {
	                	var cellProperties = {};
	                    var visualRowIndex = this.instance.toVisualRow(row);
	                    var visualColIndex = this.instance.toVisualColumn(col);
	                    if (visualColIndex ==0 || visualColIndex ==1) {
							cellProperties.readOnly = true;
							cellProperties.renderer = protocolConfigAcqUnitPropertiesHandsontableHelper.addBoldBg;
		                }
	                    if(protocolConfigAcqUnitPropertiesHandsontableHelper.classes===1){
	                    	if (visualColIndex === 2 && visualRowIndex===1) {
		                    	this.type = 'dropdown';
		                    	this.source = ['泵设备','管设备'];
		                    	this.strict = true;
		                    	this.allowInvalid = false;
		                    }
	                    }else if(protocolConfigAcqUnitPropertiesHandsontableHelper.classes===3){
	                    	if (visualColIndex === 2 && visualRowIndex===1) {
		                    	this.type = 'dropdown';
		                    	this.source = ['采集组','控制组'];
		                    	this.strict = true;
		                    	this.allowInvalid = false;
		                    }
	                    }
	                    return cellProperties;
	                },
	                afterSelectionEnd : function (row,column,row2,column2, preventScrolling,selectionLayerLevel) {
	                }
	        	});
	        }
	        protocolConfigAcqUnitPropertiesHandsontableHelper.saveData = function () {}
	        protocolConfigAcqUnitPropertiesHandsontableHelper.clearContainer = function () {
	        	protocolConfigAcqUnitPropertiesHandsontableHelper.AllData = [];
	        }
	        return protocolConfigAcqUnitPropertiesHandsontableHelper;
	    }
};


function SaveModbusProtocolAcqUnitConfigTreeData(){
	var ScadaDriverModbusConfigSelectRow= Ext.getCmp("ModbusProtocolAcqGroupConfigSelectRow_Id").getValue();
	if(ScadaDriverModbusConfigSelectRow!=''){
		var selectedItem=Ext.getCmp("ModbusProtocolAcqGroupConfigTreeGridPanel_Id").getStore().getAt(ScadaDriverModbusConfigSelectRow);
		var propertiesData=protocolConfigAcqUnitPropertiesHandsontableHelper.hot.getData();
		var protocolProperties={};
		if(selectedItem.data.classes==2){//选中的是采控单元
			protocolProperties.classes=selectedItem.data.classes;
			protocolProperties.id=selectedItem.data.id;
			protocolProperties.unitCode=selectedItem.data.code;
			protocolProperties.unitName=propertiesData[0][2];
			protocolProperties.remark=propertiesData[1][2];
		}else if(selectedItem.data.classes==3){//选中的是采控单元组
			protocolProperties.classes=selectedItem.data.classes;
			protocolProperties.id=selectedItem.data.id;
			protocolProperties.groupCode=selectedItem.data.code;
			protocolProperties.groupName=propertiesData[0][2];
			protocolProperties.acqCycle=300;
			protocolProperties.typeName=propertiesData[1][2];
			protocolProperties.saveCycle=propertiesData[2][2];
			protocolProperties.remark=propertiesData[3][2];
		}
		if(selectedItem.data.classes==2){//保存采控单元
			var acqUnitSaveData={};
			acqUnitSaveData.updatelist=[];
			acqUnitSaveData.updatelist.push(protocolProperties);
			saveAcquisitionUnitConfigData(acqUnitSaveData,selectedItem.data.protocol);
		}
		
		if(selectedItem.data.classes==3){//选中的是采控单元组
			var acqGroupSaveData={};
			acqGroupSaveData.updatelist=[];
			acqGroupSaveData.updatelist.push(protocolProperties);
			
			saveAcquisitionGroupConfigData(acqGroupSaveData,selectedItem.data.protocol,selectedItem.parentNode.data.id);
			//给采控组授予采控项
			grantAcquisitionItemsPermission();
		}
		
	}
};

function saveModbusProtocolConfigData(configInfo){
	Ext.Ajax.request({
		method:'POST',
		url:context + '/acquisitionUnitManagerController/saveModbusProtocolConfigData',
		success:function(response) {
			var data=Ext.JSON.decode(response.responseText);
			protocolAcqUnitConfigItemsHandsontableHelper.clearContainer();
			if (data.success) {
            	Ext.MessageBox.alert("信息","保存成功");
            	Ext.getCmp("ModbusProtocolAcqGroupConfigTreeGridPanel_Id").getStore().load();
            } else {
            	Ext.MessageBox.alert("信息","数据保存失败");
            }
		},
		failure:function(){
			Ext.MessageBox.alert("信息","请求失败");
		},
		params: {
			data:JSON.stringify(configInfo)
        }
	});
}

function saveAcquisitionUnitConfigData(acqUnitSaveData,protocol){
	Ext.Ajax.request({
		method:'POST',
		url:context + '/acquisitionUnitManagerController/saveAcquisitionUnitHandsontableData',
		success:function(response) {
			rdata=Ext.JSON.decode(response.responseText);
			if (rdata.success) {
            	Ext.MessageBox.alert("信息","保存成功");
            	Ext.getCmp("ModbusProtocolAcqGroupConfigTreeGridPanel_Id").getStore().load();
            } else {
            	Ext.MessageBox.alert("信息","采控单元数据保存失败");
            }
		},
		failure:function(){
			Ext.MessageBox.alert("信息","请求失败");
            acquisitionUnitConfigHandsontableHelper.clearContainer();
		},
		params: {
        	data: JSON.stringify(acqUnitSaveData),
        	protocol: protocol
        }
	});
}

function saveAcquisitionGroupConfigData(acqGroupSaveData,protocol,unitId){
	Ext.Ajax.request({
		method:'POST',
		url:context + '/acquisitionUnitManagerController/saveAcquisitionGroupHandsontableData',
		success:function(response) {
			rdata=Ext.JSON.decode(response.responseText);
			if (rdata.success) {
            	Ext.MessageBox.alert("信息","保存成功");
            	Ext.getCmp("ModbusProtocolAcqGroupConfigTreeGridPanel_Id").getStore().load();
            } else {
            	Ext.MessageBox.alert("信息","采控组数据保存失败");
            }
		},
		failure:function(){
			Ext.MessageBox.alert("信息","请求失败");
		},
		params: {
        	data: JSON.stringify(acqGroupSaveData),
        	protocol: protocol,
        	unitId: unitId
        }
	});
};
