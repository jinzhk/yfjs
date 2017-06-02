<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    String pId = request.getParameter("id");
    if(pId == null || "".equals(pId)) {
        pId = "0";
    }
    String pCountStr = request.getParameter("count");
    int pCount = 10;
    if(pCountStr != null && !"".equals(pCountStr)) {
        pCount = Integer.parseInt(pCountStr);
    }

    int max = pCount;
    String nId, nName;
    StringBuffer outStr = new StringBuffer("[");
    for (int i=1; i<=max; i++) {
        nId = pId+"_"+i;
        nName = "tree"+nId;
        outStr.append("{ id:'").append(nId).append("',	name:'").append(nName).append("'}");
        if (i<max) {
            outStr.append(",");
        }
    }
    outStr.append("]");
    out.print(outStr.toString());
%>