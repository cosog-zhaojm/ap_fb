package com.cosog.controller.datainterface;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.nio.charset.Charset;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.socket.TextMessage;

import com.cosog.controller.base.BaseController;
import com.cosog.model.calculate.CommResponseData;
import com.cosog.model.calculate.ElectricCalculateResponseData;
import com.cosog.model.calculate.PCPCalculateRequestData;
import com.cosog.model.calculate.PCPCalculateResponseData;
import com.cosog.model.calculate.RPCCalculateResponseData;
import com.cosog.model.calculate.TimeEffResponseData;
import com.cosog.model.calculate.TimeEffTotalResponseData;
import com.cosog.model.calculate.TotalAnalysisRequestData;
import com.cosog.model.calculate.TotalAnalysisResponseData;
import com.cosog.model.calculate.TotalCalculateRequestData;
import com.cosog.model.calculate.TotalCalculateResponseData;
import com.cosog.model.drive.KafkaConfig;
import com.cosog.service.base.CommonDataService;
import com.cosog.service.datainterface.CalculateDataService;
import com.cosog.task.EquipmentDriverServerTask;
import com.cosog.thread.calculate.CalculateThread;
import com.cosog.thread.calculate.TotalCalculateThread;
import com.cosog.utils.Config;
import com.cosog.utils.Config2;
import com.cosog.utils.Constants;
import com.cosog.utils.EquipmentDriveMap;
import com.cosog.utils.OracleJdbcUtis;
import com.cosog.utils.ParamUtils;
import com.cosog.utils.StringManagerUtils;
import com.cosog.websocket.config.WebSocketByJavax;
import com.cosog.websocket.handler.SpringWebSocketHandler;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import jxl.DateCell;
import jxl.Sheet;
import jxl.Workbook;

@Controller
@RequestMapping("/calculateDataController")
@Scope("prototype")
public class CalculateDataController extends BaseController{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Autowired
	CalculateDataService<?> calculateDataService;
	@Autowired
	private CommonDataService commonDataService;
	
	@Bean//这个注解会从Spring容器拿出Bean
    public SpringWebSocketHandler infoHandler() {
        return new SpringWebSocketHandler();
    }	
	@Bean//这个注解会从Spring容器拿出Bean
    public static WebSocketByJavax infoHandler2() {
        return new WebSocketByJavax();
    }
	
	@RequestMapping("/getBatchCalculateTime")
	public String getBatchCalculateTime() throws SQLException, IOException, ParseException, InterruptedException,Exception{
		String url[]=Config.getInstance().configFile.getAgileCalculate().getFESDiagram();
		String screwPumpCalUrl[]=Config.getInstance().configFile.getAgileCalculate().getPcpProduction();
		String json="";
		long startTime=0;
		long endTime=0;
		long allTime=0;
		String totalDate = StringManagerUtils.getCurrentTime();
		CalculateThread calculateThreadList[]=new CalculateThread[20];
		for(int i=0;i<20;i++){
			calculateThreadList[i]=null;
		}
		
		String wellListSql="select distinct(wellid) from tbl_rpc_diagram_hist t  where t.resultstatus in (0,2) and t.productiondataid >0";
		String sqlAll="select count(1) from tbl_rpc_diagram_hist t  where t.resultstatus in (0,2) and t.productiondataid >0";
		List<?> wellList = calculateDataService.findCallSql(wellListSql);
		int calCount=0;
		startTime=new Date().getTime();
		for(int j=0;j<wellList.size();j++){
			boolean isCal=false;
			while(!isCal){
				for(int i=0;i<calculateThreadList.length;i++){
					if(calculateThreadList[i]==null || !(calculateThreadList[i].isAlive())){
						calculateThreadList[i]=new CalculateThread(i,StringManagerUtils.stringToInteger(wellList.get(j)+""),calculateDataService);
						calculateThreadList[i].start();
						isCal=true;
						break;
					}
				}
			}
		}
		
		boolean finish=false;
		while(!finish){
			for(int i=0;i<calculateThreadList.length;i++){
				if(calculateThreadList[i]!=null&&calculateThreadList[i].isAlive()){
					finish=false;
					break;
				}
				finish=true;
			}
			
		}
		
		endTime=new Date().getTime();
		allTime=endTime-startTime;
		json=calCount+"条记录计算完成，共用时:"+allTime+"毫秒";
		System.out.println(json);
		response.setContentType("application/json;charset=utf-8");
		response.setHeader("Cache-Control", "no-cache");
		PrintWriter pw;
		try {
			pw = response.getWriter();
			pw.write(json);
			pw.flush();
			pw.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}
	
	@RequestMapping("/dailyCalculation")
	public String DailyCalculation() throws ParseException{
		String tatalDate=ParamUtils.getParameter(request, "date");
		String wellId=ParamUtils.getParameter(request, "wellId");
		String endAcqTime=ParamUtils.getParameter(request, "endAcqTime");
		if(StringManagerUtils.isNotNull(tatalDate)){
			tatalDate=StringManagerUtils.addDay(StringManagerUtils.stringToDate(tatalDate));
		}else{
			tatalDate=StringManagerUtils.getCurrentTime();
		}
		TotalCalculateThread totalCalculateThreadList[]=new TotalCalculateThread[20];
		for(int i=0;i<20;i++){
			totalCalculateThreadList[i]=null;
		}
		
		String wellListSql="select t.id,t.liftingtype from TBL_WELLINFORMATION t where 1=1";
//		wellListSql+=" and t.id=106";
		if(StringManagerUtils.isNotNull(wellId)){
			wellListSql+=" and t.id="+wellId;
		}
		wellListSql+= " order by t.sortnum ";
		
		long startTime=0;
		long endTime=0;
		long allTime=0;
		startTime=new Date().getTime();
		List<?> wellList = calculateDataService.findCallSql(wellListSql);
		int calCount=0;
		for(int i=0;i<wellList.size();i++){
			Object[] wellObj=(Object[]) wellList.get(i);
			boolean isCal=false;
			while(!isCal){
				for(int j=0;j<totalCalculateThreadList.length;j++){
					if(totalCalculateThreadList[j]==null || !(totalCalculateThreadList[j].isAlive())){
						totalCalculateThreadList[j]=new TotalCalculateThread(j,StringManagerUtils.stringToInteger(wellObj[0]+""),StringManagerUtils.stringToInteger(wellObj[1]+""),tatalDate,endAcqTime,calculateDataService);
						totalCalculateThreadList[j].start();
						isCal=true;
						break;
					}
				}
			}
		}
		
		boolean finish=false;
		while(!finish){
			for(int i=0;i<totalCalculateThreadList.length;i++){
				if(totalCalculateThreadList[i]!=null&&totalCalculateThreadList[i].isAlive()){
					finish=false;
					break;
				}
				finish=true;
			}
		}
		endTime=new Date().getTime();
		allTime=endTime-startTime;
		String json =wellList.size()+"口井汇总完成，共用时:"+allTime+"毫秒";
		System.out.println(json);
		//HttpServletResponse response = ServletActionContext.getResponse();
		response.setContentType("application/json;charset=utf-8");
		PrintWriter pw;
		try {
			pw = response.getWriter();
			pw.write(json);
			pw.flush();
			pw.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}
	
	@RequestMapping("/FSDiagramDailyCalculation")
	public String FSDiagramDailyCalculation() throws ParseException, SQLException, IOException{
		String tatalDate=ParamUtils.getParameter(request, "date");
		String wellId=ParamUtils.getParameter(request, "wellId");
		List<String> requestDataList=null;
		String endAcqTime=java.net.URLDecoder.decode(ParamUtils.getParameter(request, "endAcqTime"),"utf-8");
		if(StringManagerUtils.isNotNull(tatalDate)){
			tatalDate=StringManagerUtils.addDay(StringManagerUtils.stringToDate(tatalDate));
		}else{
			tatalDate=StringManagerUtils.getCurrentTime();
		}
		if(StringManagerUtils.isNotNull(endAcqTime) && StringManagerUtils.isNotNull(wellId)){
			requestDataList=calculateDataService.getFSDiagramDailyCalculationRequestData(tatalDate,wellId,endAcqTime);
		}else{
			requestDataList=calculateDataService.getFSDiagramDailyCalculationRequestData(tatalDate,wellId);
		}
		String url=Config.getInstance().configFile.getAgileCalculate().getTotalCalculation().getWell()[0];
		for(int i=0;requestDataList!=null&&i<requestDataList.size();i++){//TotalCalculateResponseData
			try {
//				System.out.println(requestDataList.get(i));
				Gson gson = new Gson();
				java.lang.reflect.Type typeRequest = new TypeToken<TotalAnalysisRequestData>() {}.getType();
				TotalAnalysisRequestData totalAnalysisRequestData = gson.fromJson(requestDataList.get(i), typeRequest);
				String responseData=StringManagerUtils.sendPostMethod(url, requestDataList.get(i),"utf-8");
				
				java.lang.reflect.Type type = new TypeToken<TotalAnalysisResponseData>() {}.getType();
				TotalAnalysisResponseData totalAnalysisResponseData = gson.fromJson(responseData, type);
//				System.out.println(responseData);
				if(totalAnalysisResponseData!=null&&totalAnalysisResponseData.getResultStatus()==1){
					calculateDataService.saveFSDiagramDailyCalculationData(totalAnalysisResponseData,totalAnalysisRequestData,tatalDate);
				}else{
					System.out.println("抽油机曲线数据汇总error:"+requestDataList.get(i));
				}
			} catch (Exception e) {
				e.printStackTrace();
				continue;
			}
		}
		
		System.out.println("抽油机曲线数据汇总完成");
		
		String json ="";
		//HttpServletResponse response = ServletActionContext.getResponse();
		response.setContentType("application/json;charset=utf-8");
		PrintWriter pw;
		try {
			pw = response.getWriter();
			pw.write(json);
			pw.flush();
			pw.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}
	
	@RequestMapping("/PCPRPMDailyCalculation")
	public String PCPRPMDailyCalculation() throws ParseException{
		String tatalDate=ParamUtils.getParameter(request, "date");
		String wellId=ParamUtils.getParameter(request, "wellId");
		if(StringManagerUtils.isNotNull(tatalDate)){
			tatalDate=StringManagerUtils.addDay(StringManagerUtils.stringToDate(tatalDate));
		}else{
			tatalDate=StringManagerUtils.getCurrentTime();
		}
		List<String> requestDataList=calculateDataService.getPCPRPMDailyCalculationRequestData(tatalDate,wellId);
		String url=Config.getInstance().configFile.getAgileCalculate().getTotalCalculation().getWell()[0];
		for(int i=0;i<requestDataList.size();i++){//TotalCalculateResponseData
			try {
//				System.out.println(requestDataList.get(i));
				Gson gson = new Gson();
				java.lang.reflect.Type typeRequest = new TypeToken<TotalAnalysisRequestData>() {}.getType();
				TotalAnalysisRequestData totalAnalysisRequestData = gson.fromJson(requestDataList.get(i), typeRequest);
				String responseData=StringManagerUtils.sendPostMethod(url, requestDataList.get(i),"utf-8");
				java.lang.reflect.Type type = new TypeToken<TotalAnalysisResponseData>() {}.getType();
				TotalAnalysisResponseData totalAnalysisResponseData = gson.fromJson(responseData, type);
				
				if(totalAnalysisResponseData!=null&&totalAnalysisResponseData.getResultStatus()==1){
					calculateDataService.savePCPRPMDailyCalculationData(totalAnalysisResponseData,totalAnalysisRequestData,tatalDate);
				}else{
					System.out.println("螺杆泵转速数据汇总error:"+requestDataList.get(i));
				}
			} catch (Exception e) {
				e.printStackTrace();
				continue;
			}
		}
		
		System.out.println("螺杆泵转速数据汇总完成");
		
		String json ="";
		//HttpServletResponse response = ServletActionContext.getResponse();
		response.setContentType("application/json;charset=utf-8");
		PrintWriter pw;
		try {
			pw = response.getWriter();
			pw.write(json);
			pw.flush();
			pw.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}
	
	@RequestMapping("/DiscreteDailyCalculation")
	public String DiscreteDailyCalculation() throws ParseException{
		String tatalDate=ParamUtils.getParameter(request, "date");
		String wellId=ParamUtils.getParameter(request, "wellId");
		if(StringManagerUtils.isNotNull(tatalDate)){
			tatalDate=StringManagerUtils.addDay(StringManagerUtils.stringToDate(tatalDate));
		}else{
			tatalDate=StringManagerUtils.getCurrentTime();
		}
		List<String> requestDataList=calculateDataService.getDiscreteDailyCalculation(tatalDate,wellId);
		String url=Config.getInstance().configFile.getAgileCalculate().getTotalCalculation().getWell()[0];
		for(int i=0;i<requestDataList.size();i++){
			try {
//				System.out.println(requestDataList.get(i));
				Gson gson = new Gson();
				java.lang.reflect.Type typeRequest = new TypeToken<TotalAnalysisRequestData>() {}.getType();
				TotalAnalysisRequestData totalAnalysisRequestData = gson.fromJson(requestDataList.get(i), typeRequest);
				String responseData=StringManagerUtils.sendPostMethod(url, requestDataList.get(i),"utf-8");
				java.lang.reflect.Type type = new TypeToken<TotalAnalysisResponseData>() {}.getType();
				TotalAnalysisResponseData totalAnalysisResponseData = gson.fromJson(responseData, type);
				if(totalAnalysisResponseData!=null&&totalAnalysisResponseData.getResultStatus()==1){
					calculateDataService.saveDiscreteDailyCalculationData(totalAnalysisResponseData,totalAnalysisRequestData,tatalDate);
				}else{
					System.out.println("抽油机离散数据汇总error:"+requestDataList.get(i));
				}
			} catch (Exception e) {
				e.printStackTrace();
				continue;
			}
		}
		
		System.out.println("抽油机离散数据汇总完成");
		
		String json ="";
		//HttpServletResponse response = ServletActionContext.getResponse();
		response.setContentType("application/json;charset=utf-8");
		PrintWriter pw;
		try {
			pw = response.getWriter();
			pw.write(json);
			pw.flush();
			pw.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}
	
	@RequestMapping("/PCPDiscreteDailyCalculation")
	public String PCPDiscreteDailyCalculation() throws ParseException{
		String tatalDate=ParamUtils.getParameter(request, "date");
		String wellId=ParamUtils.getParameter(request, "wellId");
		if(StringManagerUtils.isNotNull(tatalDate)){
			tatalDate=StringManagerUtils.addDay(StringManagerUtils.stringToDate(tatalDate));
		}else{
			tatalDate=StringManagerUtils.getCurrentTime();
		}
		List<String> requestDataList=calculateDataService.getPCPDiscreteDailyCalculation(tatalDate,wellId);
		String url=Config.getInstance().configFile.getAgileCalculate().getTotalCalculation().getWell()[0];
		for(int i=0;i<requestDataList.size();i++){
			try {
				Gson gson = new Gson();
				java.lang.reflect.Type typeRequest = new TypeToken<TotalAnalysisRequestData>() {}.getType();
				TotalAnalysisRequestData totalAnalysisRequestData = gson.fromJson(requestDataList.get(i), typeRequest);
				String responseData=StringManagerUtils.sendPostMethod(url, requestDataList.get(i),"utf-8");
				java.lang.reflect.Type type = new TypeToken<TotalAnalysisResponseData>() {}.getType();
				TotalAnalysisResponseData totalAnalysisResponseData = gson.fromJson(responseData, type);
				
				if(totalAnalysisResponseData!=null&&totalAnalysisResponseData.getResultStatus()==1){
					calculateDataService.savePCPDiscreteDailyCalculationData(totalAnalysisResponseData,totalAnalysisRequestData,tatalDate);
				}else{
					System.out.println("螺杆泵离散数据汇总error:"+requestDataList.get(i));
				}
			} catch (Exception e) {
				e.printStackTrace();
				continue;
			}
		}
		
		System.out.println("螺杆泵离散数据汇总完成");
		
		String json ="";
		//HttpServletResponse response = ServletActionContext.getResponse();
		response.setContentType("application/json;charset=utf-8");
		PrintWriter pw;
		try {
			pw = response.getWriter();
			pw.write(json);
			pw.flush();
			pw.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}
	
	//设置字符串utf-8编码
    public static String StringToUTF8(String xml,String type){
    	StringBuffer sb = new StringBuffer();
    	sb.append(xml);
    	String xmString = "";
    	String xmlUTF8="";
    	try {
    		xmString = new String(sb.toString().getBytes("UTF-8"),"ISO-8859-1");
//    		xmlUTF8 = URLEncoder.encode(xmString, "UTF-8");
    		xmlUTF8 = new String(xmString.getBytes("ISO-8859-1"),"UTF-8");
    	} catch (UnsupportedEncodingException e) {
    		e.printStackTrace();
        }
        return xmlUTF8;
   } 
    
  //设置字符串utf-8编码
    public static String UTF8ToGBK(String xml){
    	String gbk="";
    	try {
    		String utf8 = new String(xml.getBytes( "UTF-8"));  
    		String unicode = new String(utf8.getBytes(),"UTF-8");   
    		gbk = new String(unicode.getBytes("GBK"));  
    	} catch (UnsupportedEncodingException e) {
    		e.printStackTrace();
        }
        return gbk;
   } 
    
    public static String GBKToUTF8(String xml){
    	String utf8="";
    	try {
//    		String gbk = new String(xml.getBytes( "GBK"));  
//    		String unicode = new String(gbk.getBytes(),"GBK");   
//    		utf8 = new String(unicode.getBytes("UTF-8"));  
    		utf8 = new String (xml.getBytes("gbk"),"utf-8");
    	} catch (UnsupportedEncodingException e) {
    		e.printStackTrace();
        }
        return utf8;
   }
    
    public static String getUTF8StringFromGBKString(String gbkStr) {
    	try {
    		return new String(getUTF8BytesFromGBKString(gbkStr), "UTF-8");
    	} catch (UnsupportedEncodingException e) {
    		throw new InternalError();
    	}  
    }
    
    public static byte[] getUTF8BytesFromGBKString(String gbkStr) {
    	int n = gbkStr.length();
    	byte[] utfBytes = new byte[3 * n];
    	int k = 0;
    	for (int i = 0; i < n; i++) {
    		int m = gbkStr.charAt(i);
    		if (m < 128 && m >= 0) {
    			utfBytes[k++] = (byte) m;
    			continue;
    		}
    		utfBytes[k++] = (byte) (0xe0 | (m >> 12));
    		utfBytes[k++] = (byte) (0x80 | ((m >> 6) & 0x3f));
    		utfBytes[k++] = (byte) (0x80 | (m & 0x3f));
    	}
    	if (k < utfBytes.length) {
    		byte[] tmp = new byte[k];
    		System.arraycopy(utfBytes, 0, tmp, 0, k);
    		return tmp;
    	}
    	return utfBytes;
    }
    
    public static String getEncoding(String str) {        
        String encode = "GB2312";        
       try {        
           if (str.equals(new String(str.getBytes(encode), encode))) {        
                String s = encode;        
               return s;        
            }        
        } catch (Exception exception) {        
        }        
        encode = "ISO-8859-1";        
       try {        
           if (str.equals(new String(str.getBytes(encode), encode))) {        
                String s1 = encode;        
               return s1;        
            }        
        } catch (Exception exception1) {        
        }        
        encode = "UTF-8";        
       try {        
           if (str.equals(new String(str.getBytes(encode), encode))) {        
                String s2 = encode;        
               return s2;        
            }        
        } catch (Exception exception2) {        
        }        
        encode = "GBK";        
       try {        
           if (str.equals(new String(str.getBytes(encode), encode))) {        
                String s3 = encode;        
               return s3;        
            }        
        } catch (Exception exception3) {        
        }        
       return "";        
    }
    
    
    
    @RequestMapping("/encodeTest")
	public String encodeTest() throws SQLException, IOException, ParseException, InterruptedException{
    	String str="中国";
    	byte[] unicodeByte= str.getBytes("unicode");
    	byte[] utf8Byte= str.getBytes("utf8");
    	byte[] gbkByte= str.getBytes("gbk");
    	byte[] isoByte= str.getBytes("iso8859-1");
    	
    	String strUnicode=new String(unicodeByte,"unicode");
    	String strUtf8=new String(utf8Byte,"utf8");
    	String strGbk=new String(gbkByte,"gbk");
    	String strIso=new String(isoByte,"iso8859");
    	
    	return null;
    }

}
