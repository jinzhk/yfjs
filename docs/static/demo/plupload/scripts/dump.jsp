<%@ page contentType="text/html;chartset=UTF-8" language="java" %>
<%@ page import="java.util.Map" %>
<%@ page import="java.util.Enumeration" %>
<%@ page import="java.util.HashMap" %>
<!DOCTYPE html>
<html class="no-js">
<head lang="zh-CN">
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <meta name="renderer" content="webkit">
    <title>Plupload - Form dump</title>

    <link rel="stylesheet" type="text/css" href="../../../resources/lib/css/base.css"/>
</head>
<body style="font: 13px Verdana; background: #eee; color: #333">
	<div class="container">

        <h1>Post dump</h1>

        <p>Shows the form items posted.</p>

        <table class="table">
            <tr>
                <th>Name</th>
                <th>Value</th>
            </tr>
            <%
                Map<String, Object> params = new HashMap<String, Object>();
                Enumeration pNames=request.getParameterNames();
                while(pNames.hasMoreElements()){
                    String name=(String)pNames.nextElement();
                    String value=request.getParameter(name);
                    params.put(name, value);
                }
                int count = 0;
                for (Map.Entry<String, Object> entry : params.entrySet()) {
            %>
            <tr class="<%=(count%2 == 0 ? "alt" : "")%>">
                <td><%=entry.getKey()%></td>
                <td><pre><%=entry.getValue()%></pre></td>
            </tr>
            <%
                    count++;
                }
            %>
        </table>

    </div>
</body>
</html>
