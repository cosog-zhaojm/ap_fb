package com.cosog.model;

import javax.persistence.Column;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "tbl_alarm_item2group_conf")
public class AlarmGroupItem implements java.io.Serializable {

	private static final long serialVersionUID = 1L;
	private Integer id;
	private Integer groupId;
	private Integer itemId;
	private String itemName;
	private String itemCode;
	private Integer itemAddr;
	private Float upperLimit;
	private Float lowerLimit;
	private Float hystersis;
	private Integer delay;
	private Integer alarmLevel;
	private Integer alarmSign;

	public AlarmGroupItem() {
		super();
		// TODO Auto-generated constructor stub
	}

	/** full constructor */
	public AlarmGroupItem(Integer id, Integer groupId, Integer itemId, String itemName, String itemCode,
			Integer itemAddr, Float upperLimit, Float lowerLimit, Float hystersis, Integer delay, Integer alarmLevel,
			Integer alarmSign) {
		super();
		this.id = id;
		this.groupId = groupId;
		this.itemId = itemId;
		this.itemName = itemName;
		this.itemCode = itemCode;
		this.itemAddr = itemAddr;
		this.upperLimit = upperLimit;
		this.lowerLimit = lowerLimit;
		this.hystersis = hystersis;
		this.delay = delay;
		this.alarmLevel = alarmLevel;
		this.alarmSign = alarmSign;
	}

	@Id
	@GeneratedValue
	@Column(name = "id", nullable = false, precision = 22, scale = 0)
	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	@Column(name = "groupid", nullable = false, precision = 22, scale = 0)
	public Integer getGroupId() {
		return this.groupId;
	}
	public void setGroupId(Integer groupId) {
		this.groupId = groupId;
	}
	
	@Column(name = "itemid", nullable = true, precision = 22, scale = 0)
	public Integer getItemId() {
		return this.itemId;
	}
	
	public void setItemId(Integer itemId) {
		this.itemId = itemId;
	}

	@Column(name = "itemName", nullable = true, length = 8)
	public String getItemName() {
		return itemName;
	}

	public void setItemName(String itemName) {
		this.itemName = itemName;
	}

	@Column(name = "itemCode", nullable = true, length = 8)
	public String getItemCode() {
		return itemCode;
	}

	public void setItemCode(String itemCode) {
		this.itemCode = itemCode;
	}

	@Column(name = "itemAddr", nullable = true, precision = 22, scale = 0)
	public Integer getItemAddr() {
		return itemAddr;
	}

	public void setItemAddr(Integer itemAddr) {
		this.itemAddr = itemAddr;
	}

	@Column(name = "upperLimit")
	public Float getUpperLimit() {
		return upperLimit;
	}

	public void setUpperLimit(Float upperLimit) {
		this.upperLimit = upperLimit;
	}

	@Column(name = "lowerLimit")
	public Float getLowerLimit() {
		return lowerLimit;
	}

	public void setLowerLimit(Float lowerLimit) {
		this.lowerLimit = lowerLimit;
	}

	@Column(name = "hystersis")
	public Float getHystersis() {
		return hystersis;
	}

	public void setHystersis(Float hystersis) {
		this.hystersis = hystersis;
	}

	@Column(name = "delay")
	public Integer getDelay() {
		return delay;
	}

	public void setDelay(Integer delay) {
		this.delay = delay;
	}

	@Column(name = "alarmLevel")
	public Integer getAlarmLevel() {
		return alarmLevel;
	}

	public void setAlarmLevel(Integer alarmLevel) {
		this.alarmLevel = alarmLevel;
	}

	@Column(name = "alarmSign")
	public Integer getAlarmSign() {
		return alarmSign;
	}

	public void setAlarmSign(Integer alarmSign) {
		this.alarmSign = alarmSign;
	}

	
}