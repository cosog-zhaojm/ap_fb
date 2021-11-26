create index IDX_000_01_DM on TBL_CODE(ITEMVALUE);
create index IDX_000_01_SJXDM on TBL_CODE(ITEMCODE);
create index IDX_000_01_ZT on TBL_CODE(STATE);
create index IDX_ACQ_GROUP_CONF_CODE on TBL_ACQ_GROUP_CONF(GROUP_CODE);
create index IDX_ACQ_GROUP_CONF_PROTOCOL on TBL_ACQ_GROUP_CONF(PROTOCOL);
create index IDX_ACQ_GROUP_CONF_TYPE on TBL_ACQ_GROUP_CONF(TYPE);
create index IDX_ACQ_GROUP_ITEM_GROUPID on TBL_ACQ_ITEM2GROUP_CONF(GROUPID);
create index IDX_ACQ_GROUP_ITEM_INDEX on TBL_ACQ_ITEM2GROUP_CONF(BITINDEX);
create index IDX_ACQ_GROUP_ITEM_ITEMID on TBL_ACQ_ITEM2GROUP_CONF(ITEMID);
create index IDX_ACQ_GROUP_ITEM_ITEMNAME on TBL_ACQ_ITEM2GROUP_CONF(ITEMNAME);
create index IDX_ACQ_GROUP_ITEM_SHOWLEVEL on TBL_ACQ_ITEM2GROUP_CONF(SHOWLEVEL);
create index IDX_ACQ_GROUP_ITEM_SORT on TBL_ACQ_ITEM2GROUP_CONF(SORT);
create index IDX_ACQ_UNIT_CONF_CODE on TBL_ACQ_UNIT_CONF(UNIT_CODE);
create index IDX_ACQ_UNIT_CONF_PROTOCOL on TBL_ACQ_UNIT_CONF(PROTOCOL);
create index IDX_ACQ_UNIT_GROUP_GROUPID on TBL_ACQ_GROUP2UNIT_CONF(GROUPID);
create index IDX_ACQ_UNIT_GROUP_UNITID on TBL_ACQ_GROUP2UNIT_CONF(UNITID);
create index IDX_ALARMINSTANCE_CODE on TBL_PROTOCOLALARMINSTANCE(CODE);
create index IDX_ALARMINSTANCE_SORT on TBL_PROTOCOLALARMINSTANCE(SORT);
create index IDX_ALARMINSTANCE_TYPE on TBL_PROTOCOLALARMINSTANCE(DEVICETYPE);
create index IDX_ALARMINSTANCE_UNITID on TBL_PROTOCOLALARMINSTANCE(ALARMUNITID);
create index IDX_ALARM_ITEM2UNIT_ITEMNAME on TBL_ALARM_ITEM2UNIT_CONF(ITEMNAME);
create index IDX_ALARM_ITEM2UNIT_TYPE on TBL_ALARM_ITEM2UNIT_CONF(TYPE);
create index IDX_ALARM_ITEM2UNIT_UNIT on TBL_ALARM_ITEM2UNIT_CONF(UNITID);
create index IDX_ALARM_UNIT_CODE on TBL_ALARM_UNIT_CONF(UNIT_CODE);
create index IDX_ALARM_UNIT_PROROCOL on TBL_ALARM_UNIT_CONF(PROTOCOL);
create index IDX_AUXILIARY2MASTER_AUXILIARY on TBL_AUXILIARY2MASTER(AUXILIARYID);
create index IDX_AUXILIARY2MASTER_MASTER on TBL_AUXILIARY2MASTER(MASTERID);
create index IDX_AUXILIARYDEVICE_NAME on TBL_AUXILIARYDEVICE(NAME);
create index IDX_AUXILIARYDEVICE_SORT on TBL_AUXILIARYDEVICE(SORT);
create index IDX_AUXILIARYDEVICE_TYPE on TBL_AUXILIARYDEVICE(TYPE);
create index IDX_DEVICEOPERATIONLOG_ACTION on TBL_DEVICEOPERATIONLOG(ACTION);
create index IDX_DEVICEOPERATIONLOG_TIME on TBL_DEVICEOPERATIONLOG(CREATETIME);
create index IDX_DEVICEOPERATIONLOG_USERID on TBL_DEVICEOPERATIONLOG(USER_ID);
create index IDX_DEVICEOPERATIONLOG_WELLID on TBL_DEVICEOPERATIONLOG(WELLNAME);
create index IDX_DIST_ITEM_SORT on TBL_DIST_ITEM(SORTS);
create index IDX_DIST_ITEM_STATUS on TBL_DIST_ITEM(STATUS);
create index IDX_DIST_ITEM_SYSID on TBL_DIST_ITEM(SYSDATAID);
create index IDX_DIST_NAME_CNAME on TBL_DIST_NAME(CNAME);
create index IDX_DIST_NAME_ENAME on TBL_DIST_NAME(ENAME);
create index IDX_DIST_NAME_SORT on TBL_DIST_NAME(SORTS);
create index IDX_ORG_CODE_PARENT on TBL_ORG(ORG_PARENT,ORG_CODE);
create index IDX_ORG_PARENT on TBL_ORG(ORG_PARENT);
create index IDX_PIPELINEACQDATA_H_COMM on TBL_PIPELINEACQDATA_HIST(COMMSTATUS);
create index IDX_PIPELINEACQDATA_H_TIME on TBL_PIPELINEACQDATA_HIST(ACQTIME);
create index IDX_PIPELINEACQDATA_H_WELLID on TBL_PIPELINEACQDATA_HIST(WELLID);
create index IDX_PIPELINEACQDATA_L_COMM on TBL_PIPELINEACQDATA_LATEST(COMMSTATUS);
create index IDX_PIPELINEACQDATA_L_TIME on TBL_PIPELINEACQDATA_LATEST(ACQTIME);
create index IDX_PIPELINEACQDATA_L_WELLID on TBL_PIPELINEACQDATA_LATEST(WELLID);
create index IDX_PIPELINEALARMINFO_H_ITEM on TBL_PIPELINEALARMINFO_HIST(ITEMNAME);
create index IDX_PIPELINEALARMINFO_H_LEVEL on TBL_PIPELINEALARMINFO_HIST(ALARMLEVEL);
create index IDX_PIPELINEALARMINFO_H_TIME on TBL_PIPELINEALARMINFO_HIST(ALARMTIME);
create index IDX_PIPELINEALARMINFO_H_TYPE on TBL_PIPELINEALARMINFO_HIST(ALARMTYPE);
create index IDX_PIPELINEALARMINFO_H_WELLID on TBL_PIPELINEALARMINFO_HIST(WELLID);
create index IDX_PIPELINEALARMINFO_L_ITEM on TBL_PIPELINEALARMINFO_LATEST(ITEMNAME);
create index IDX_PIPELINEALARMINFO_L_LEVEL on TBL_PIPELINEALARMINFO_LATEST(ALARMLEVEL);
create index IDX_PIPELINEALARMINFO_L_TIME on TBL_PIPELINEALARMINFO_LATEST(ALARMTIME);
create index IDX_PIPELINEALARMINFO_L_TYPE on TBL_PIPELINEALARMINFO_LATEST(ALARMTYPE);
create index IDX_PIPELINEALARMINFO_L_WELLID on TBL_PIPELINEALARMINFO_LATEST(WELLID);
create index IDX_PIPELINEDEVICE_ALARMINS on TBL_PIPELINEDEVICE(ALARMINSTANCECODE);
create index IDX_PIPELINEDEVICE_INS on TBL_PIPELINEDEVICE(INSTANCECODE);
create index IDX_PIPELINEDEVICE_NAME on TBL_PIPELINEDEVICE(WELLNAME);
create index IDX_PIPELINEDEVICE_ORG on TBL_PIPELINEDEVICE(ORGID);
create index IDX_PIPELINEDEVICE_SIGNINID on TBL_PIPELINEDEVICE(SIGNINID);
create index IDX_PIPELINEDEVICE_SLAVE on TBL_PIPELINEDEVICE(SLAVE);
create index IDX_PIPELINEDEVICE_SORT on TBL_PIPELINEDEVICE(SORTNUM);
create index IDX_PIPELINEDEVICE_TYPE on TBL_PIPELINEDEVICE(DEVICETYPE);
create index IDX_PROTOCOLINSTANCE_CODE on TBL_PROTOCOLINSTANCE(CODE);
create index IDX_PROTOCOLINSTANCE_SORT on TBL_PROTOCOLINSTANCE(SORT);
create index IDX_PROTOCOLINSTANCE_TYPE on TBL_PROTOCOLINSTANCE(DEVICETYPE);
create index IDX_PROTOCOLINSTANCE_UNIT on TBL_PROTOCOLINSTANCE(UNITID);
create index IDX_PROTOCOLSMSINSTANCE_CODE on TBL_PROTOCOLSMSINSTANCE(CODE);
create index IDX_PROTOCOLSMSINSTANCE_SORT on TBL_PROTOCOLSMSINSTANCE(SORT);
create index IDX_PUMPACQDATA_HIST_COMM on TBL_PUMPACQDATA_HIST(COMMSTATUS);
create index IDX_PUMPACQDATA_HIST_TIME on TBL_PUMPACQDATA_HIST(ACQTIME);
create index IDX_PUMPACQDATA_HIST_WELLID on TBL_PUMPACQDATA_HIST(WELLID);
create index IDX_PUMPACQDATA_LATEST_COMM on TBL_PUMPACQDATA_LATEST(COMMSTATUS);
create index IDX_PUMPACQDATA_LATEST_TIME on TBL_PUMPACQDATA_LATEST(ACQTIME);
create index IDX_PUMPACQDATA_LATEST_WELLID on TBL_PUMPACQDATA_LATEST(WELLID);
create index IDX_PUMPALARMINFO_HIST_ITEM on TBL_PUMPALARMINFO_HIST(ITEMNAME);
create index IDX_PUMPALARMINFO_HIST_LEVEL on TBL_PUMPALARMINFO_HIST(ALARMLEVEL);
create index IDX_PUMPALARMINFO_HIST_TIME on TBL_PUMPALARMINFO_HIST(ALARMTIME);
create index IDX_PUMPALARMINFO_HIST_TYPE on TBL_PUMPALARMINFO_HIST(ALARMTYPE);
create index IDX_PUMPALARMINFO_HIST_WELLID on TBL_PUMPALARMINFO_HIST(WELLID);
create index IDX_PUMPALARMINFO_L_ITEM on TBL_PUMPALARMINFO_LATEST(ITEMNAME);
create index IDX_PUMPALARMINFO_L_LEVEL on TBL_PUMPALARMINFO_LATEST(ALARMLEVEL);
create index IDX_PUMPALARMINFO_L_TIME on TBL_PUMPALARMINFO_LATEST(ALARMTIME);
create index IDX_PUMPALARMINFO_L_TYPE on TBL_PUMPALARMINFO_LATEST(ALARMTYPE);
create index IDX_PUMPALARMINFO_L_WELLID on TBL_PUMPALARMINFO_LATEST(WELLID);
create index IDX_PUMPDEVICE_ALARMINS on TBL_PUMPDEVICE(ALARMINSTANCECODE);
create index IDX_PUMPDEVICE_INS on TBL_PUMPDEVICE(INSTANCECODE);
create index IDX_PUMPDEVICE_NAME on TBL_PUMPDEVICE(WELLNAME);
create index IDX_PUMPDEVICE_ORG on TBL_PUMPDEVICE(ORGID);
create index IDX_PUMPDEVICE_SIGNINID on TBL_PUMPDEVICE(SIGNINID);
create index IDX_PUMPDEVICE_SLAVE on TBL_PUMPDEVICE(SLAVE);
create index IDX_PUMPDEVICE_SORT on TBL_PUMPDEVICE(SORTNUM);
create index IDX_PUMPDEVICE_TYPE on TBL_PUMPDEVICE(DEVICETYPE);
create index IDX_REQUIREPASS on TBL_USER(USER_QUICKLOGIN);
create index IDX_RESOURCEMONITORING_ACQTIME on TBL_RESOURCEMONITORING(ACQTIME);
create index IDX_RM_MODULEID on TBL_MODULE2ROLE(RM_MODULEID);
create index IDX_RM_ROLEID on TBL_MODULE2ROLE(RM_ROLEID);
create index IDX_ROLE_CODE on TBL_ROLE(ROLE_CODE);
create index IDX_SMSDEVICE_INS on TBL_SMSDEVICE(INSTANCECODE);
create index IDX_SMSDEVICE_ORG on TBL_SMSDEVICE(ORGID);
create index IDX_SMSDEVICE_SIGNINID on TBL_SMSDEVICE(SIGNINID);
create index IDX_SMSDEVICE_SORT on TBL_SMSDEVICE(SORTNUM);
create index IDX_SYSTEMLOG_ACTION on TBL_SYSTEMLOG(ACTION);
create index IDX_SYSTEMLOG_TOME on TBL_SYSTEMLOG(CREATETIME);
create index IDX_SYSTEMLOG_USER on TBL_SYSTEMLOG(USER_ID);
create index IDX_USER_ID_PWD on TBL_USER(USER_ID,USER_PWD);
create index IDX_USER_ORGID on TBL_USER(USER_ORGID);
create index IDX_USER_PWD on TBL_USER(USER_PWD);
create index INDEXD_MODULE_MDCODE on TBL_MODULE(MD_CODE);
create index INDEX_MODULE_PARENTID on TBL_MODULE(MD_PARENTID);
create index INDEX_MODULE_SORT on TBL_MODULE(MD_SEQ);
create index INDEX_MODULE_TYPE on TBL_MODULE(MD_TYPE);