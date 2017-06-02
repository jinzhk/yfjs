<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    String pId = request.getParameter("id");
    if(pId == null || "".equals(pId)) {
        pId = "0";
    }
    String pLevelStr = request.getParameter("lv");
    int pLevel = 0;
    if(pLevelStr != null && !"".equals(pLevelStr)) {
        pLevel = Integer.parseInt(pLevelStr);
    }
    String pName = request.getParameter("n");
    if(pName == null) {
        pName = "";
    } else {
        pName += ".";
    }
    String pCheck = request.getParameter("chk");
    if(pCheck == null) {
        pCheck = "";
    }
    String nId, nName;
    StringBuffer outStr = new StringBuffer("[");
    for (int i=1; i<5; i++) {
        nId = pId + i;
        nName = pName + "n" + i;
        outStr.append("{ id:'").append(nId).append("',	name:'").append(nName).append("',	isParent:")
            .append(( pLevel < 2 && (i%2)!=0)?"true":"false").append(pCheck==""?"":(((pLevel < 2 && (i%2)!=0)?", halfCheck:true":"")))
            .append(i==3?", checked:true":"").append("}");
        if (i < 4) {
            outStr.append(",");
        }
    }
    outStr.append("]");
    out.print(outStr.toString());
%>