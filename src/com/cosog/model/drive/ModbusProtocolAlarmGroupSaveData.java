package com.cosog.model.drive;

import java.util.List;

public class ModbusProtocolAlarmGroupSaveData {

	int id;
	int resolutionMode;
	String groupCode;
	String groupName;
	String oldGroupName;
	String protocol;
	String remark;
	
	private List<String> delidslist;
	
	private List<AlarmItems> alarmItems;
	
	public static class AlarmItems
	{
	    private String itemName;

	    private int itemAddr;

	    private String upperLimit;

	    private String lowerLimit;

	    private String hystersis;

	    private String delay;

	    private String alarmLevel;

	    private String alarmSign;
	    
	    private int type;
	    
	    private String value;
	    
	    private int bitIndex;

	    public void setItemName(String itemName){
	        this.itemName = itemName;
	    }
	    public String getItemName(){
	        return this.itemName;
	    }
	    public void setItemAddr(int itemAddr){
	        this.itemAddr = itemAddr;
	    }
	    public int getItemAddr(){
	        return this.itemAddr;
	    }
	    public void setUpperLimit(String upperLimit){
	        this.upperLimit = upperLimit;
	    }
	    public String getUpperLimit(){
	        return this.upperLimit;
	    }
	    public void setLowerLimit(String lowerLimit){
	        this.lowerLimit = lowerLimit;
	    }
	    public String getLowerLimit(){
	        return this.lowerLimit;
	    }
	    public void setHystersis(String hystersis){
	        this.hystersis = hystersis;
	    }
	    public String getHystersis(){
	        return this.hystersis;
	    }
	    public void setDelay(String delay){
	        this.delay = delay;
	    }
	    public String getDelay(){
	        return this.delay;
	    }
	    public void setAlarmLevel(String alarmLevel){
	        this.alarmLevel = alarmLevel;
	    }
	    public String getAlarmLevel(){
	        return this.alarmLevel;
	    }
	    public void setAlarmSign(String alarmSign){
	        this.alarmSign = alarmSign;
	    }
	    public String getAlarmSign(){
	        return this.alarmSign;
	    }
		public int getType() {
			return type;
		}
		public void setType(int type) {
			this.type = type;
		}
		public String getValue() {
			return value;
		}
		public void setValue(String value) {
			this.value = value;
		}
		public int getBitIndex() {
			return bitIndex;
		}
		public void setBitIndex(int bitIndex) {
			this.bitIndex = bitIndex;
		}
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getGroupCode() {
		return groupCode;
	}

	public void setGroupCode(String groupCode) {
		this.groupCode = groupCode;
	}

	public String getGroupName() {
		return groupName;
	}

	public void setGroupName(String groupName) {
		this.groupName = groupName;
	}

	public String getOldGroupName() {
		return oldGroupName;
	}

	public void setOldGroupName(String oldGroupName) {
		this.oldGroupName = oldGroupName;
	}

	public String getProtocol() {
		return protocol;
	}

	public void setProtocol(String protocol) {
		this.protocol = protocol;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public List<String> getDelidslist() {
		return delidslist;
	}

	public void setDelidslist(List<String> delidslist) {
		this.delidslist = delidslist;
	}

	public List<AlarmItems> getAlarmItems() {
		return alarmItems;
	}

	public void setAlarmItems(List<AlarmItems> alarmItems) {
		this.alarmItems = alarmItems;
	}

	public int getResolutionMode() {
		return resolutionMode;
	}

	public void setResolutionMode(int resolutionMode) {
		this.resolutionMode = resolutionMode;
	}
}
