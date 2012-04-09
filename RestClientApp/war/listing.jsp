<%@page import="com.google.appengine.api.datastore.KeyFactory"%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="com.google.appengine.api.users.User" %>
<%@ page import="com.google.appengine.api.users.UserService" %>
<%@ page import="com.google.appengine.api.users.UserServiceFactory" %>
<%@ page import="com.google.appengine.api.datastore.DatastoreServiceFactory" %>
<%@ page import="com.google.appengine.api.datastore.DatastoreService" %>
<%@ page import="com.google.appengine.api.datastore.Query" %>
<%@ page import="com.google.appengine.api.datastore.Entity" %>
<%@ page import="com.google.appengine.api.datastore.FetchOptions" %>
<%@ page import="java.util.List" %>
<%@ page import="java.util.Map" %>
<%@ page import="java.util.Set" %>
<%@ page import="java.util.Iterator" %>
<%@ page import="java.text.DateFormat" %>
<%@ page import="com.restclient.server.AppUser" %>
<%@ page import="com.restclient.server.RequestItem" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>Advanced Rest Client Application</title>
<style type="text/css">
body {
	background-color: white;
	color: black;
	font-family: Arial, sans-serif;
	font-size: small;
	margin: 8px;
	margin-top: 3px;
}

.mainPanel {
	display: -webkit-box;
	display: -moz-box;
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
}

.bodyPanel {
	-webkit-box-align: stretch;
	-moz-box-align: stretch;
	-webkit-padding-start: 150px;
	-moz-padding-start: 150px;
	margin: 0;
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	z-index: 1;
}

.menu {
	background: -webkit-linear-gradient(rgba(234, 238, 243, 0.2), #eaeef3 ),
		-webkit-linear-gradient(left, #eaeef3, #eaeef3 97%, #d3d7db);
	-webkit-border-end: 1px solid #c6c9ce;
	-moz-border-end: 1px solid #c6c9ce;
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	top: 0;
	width: 150px;
	z-index: 2;
}

.contentTitle {
	-webkit-padding-end: 24px;
	-webkit-user-select: none;
	color: black;
	font-size: 175%;
	font-weight: normal;
	margin: 0;
	padding-bottom: 14px;
	padding-top: 13px;
	text-align: end;
	cursor: pointer;
}

.mainNav {
	-webkit-user-select: none;
	-moz-user-select: none;
	list-style-type: none;
	margin: 0;
	padding: 0;
}

.navBarItem {
	border-bottom: 1px solid transparent;
	border-top: 1px solid transparent;
	color: black;
	cursor: pointer;
	display: block;
	font-size: 105%;
	outline: none;
	padding: 10px 0;
	text-align: end;
	text-shadow: white 0 1px 1px;
	-webkit-padding-end: 24px;
	-moz-padding-end: 24px;
}

.navBarItemSelected {
	-webkit-box-shadow: 0px 1px 0px #f7f7f7;
	-moz-box-shadow: 0px 1px 0px #f7f7f7;
	background: -webkit-linear-gradient(left, #bbcee9, #bbcee9 97%, #aabedc);
	border-bottom: 1px solid #8faad9;
	border-top: 1px solid #8faad9;
	color: black;
	text-shadow: #bbcee9 0 1px 1px;
}

.mainViewContent {
	position: relative;
	-webkit-box-shadow: #666 0 2px 5px;
	background-color: white;
	border-left: 1px solid #B8B8B8;
	box-sizing: border-box;
	min-height: 100%;
	width: 100%;
	padding: 20px;
}
.table{
	table-layout: fixed;
	width: 100%;
}
.tableCell {
	padding: 6px 15px;
	overflow: hidden;
}
thead .theadCell{
	padding: 3px 15px;
	text-align: left;
	color: #4B4A4A;
	text-shadow: #DDF 1px 1px 0;
	overflow: hidden;
	background-color: #FFFFFF;
	border-bottom: 2px solid #6F7277;
}
tr:nth-child(odd) {background-color: #FFFFFF}
tr:nth-child(even) {background-color: #F3F7FB}
section {
	border: 1px solid #6F7277;
	margin-bottom: 10px;
	padding: 10px;
}
.error, .info{padding:10px 20px;background:rgba(255, 0, 0, 0.05);-webkit-border-radius:8px;-moz-border-radius:8px;border-radius:8px;border:1px solid rgba(255, 0, 0, 0.2);display: block;text-align: center;font-weight: bold;font-size: 14px;}
</style>
</head>

<%
    UserService userService = UserServiceFactory.getUserService();
	if(!userService.isUserLoggedIn()){
		response.sendRedirect("index.jsp");
	} else {
	String errorMessage = null;
	String errorCode = request.getParameter("e");
	
	if(errorCode != null){
		int error = Integer.parseInt(errorCode);
		switch(error){
		case 1: errorMessage = "Unable to remove selected item from datastore :("; break;
		case 2: errorMessage = "Unable to remove Your data from datastore :( Try again later."; break;
		default: errorMessage = null; break;
		}
	}
%>
<body>
	<div class="mainPanel">
		<div class="menu">
			<h1 class="contentTitle">Advanced Rest Client</h1>
			<ul role="tablist" class="mainNav">
				<li page="about" class="navBarItem" role="tab"
					tabindex="-1" aria-selected="false" onclick="document.location.href='index.jsp'">About</li>
				<li page="listing" class="navBarItem navBarItemSelected" role="tab"
					tabindex="-1" aria-selected="true">My data</li>
				<li class="navBarItem">
					<g:plusone href="https://chrome.google.com/webstore/detail/hgmloofddffdnphfgcellkdfbfbjeloo"></g:plusone>
				</li>
			</ul>
		</div>
		<div class="bodyPanel">
			<div class="mainViewContent">
				<%
				if(errorMessage != null){
				%>
				<div class="error"><%= errorMessage %></div>
				<%
				}
				%>
				<h2>My data</h2>
				<p>
					Here you can manage your data saved in application
				</p>
				<section>
					<h3>Remove my data completely.</h3>
					<a onclick="if(!confirm('This will remove all your data from application. Continue?')) return false;" href="/udata/deleteall">Delete all my data from application</a>
				</section>
				<section>
					<h3>Your data list</h3>
				<%
				AppUser appUser = AppUser.getUserById(userService.getCurrentUser().getUserId());
			    if (appUser == null) {
			    	%>
			        <p>No such account registered :( (<%= userService.getCurrentUser().getEmail() %>).</p>
			        <%
			    } else {
			    	List<RequestItem> items = appUser.getItemsSet();
			    	if (items == null || items.size() == 0) {
				    	%>
				        <p>There is no data associated with your account (<%= userService.getCurrentUser().getEmail() %>).</p>
				        <%
				    } else {
				    	%>
				    	<table class="table" cellspacing="0">
				    	<colgroup>
				    		<col/>
			    			<col style="width: 40%;"/>
			    			<col style="width: 135px; "/>
			    			<col style="width: 85px; ">
			    		</colgroup>
			    		<thead>
			    			<tr>
			    				<th colspan="1" class="theadCell">Name</th>
			    				<th colspan="1" class="theadCell">URL</th>
			    				<th colspan="1" class="theadCell">Add date</th>
			    				<th colspan="1" class="theadCell">Delete</th>
			    			</tr>
			    		</thead>
			    		<tbody>
				    	<%
				    	for(RequestItem item : items){
			    		%>
			    		<tr>
			    			<td class="tableCell tableName"><%= item.getName() %></td>
			    			<td class="tableCell tableUrl"><%= item.getUrl() %></td>
			    			<td class="tableCell"><%= DateFormat.getDateTimeInstance(DateFormat.SHORT, DateFormat.SHORT).format(item.getCreateDate()) %></td>
			    			<td class="tableCell">
			    				<a onclick="if(!confirm('Do you really want to delete this record?')) return false;" href="/udata/delete?k=<%= KeyFactory.keyToString(item.getKey()) %>">delete</a>
			    			</td>
			    		</tr>
			    		<%
				    	}
				    	%>
				    	</tbody>
				    	</table>
				    	<%
				    }
			    }
				%>
				</section>
			</div>
		</div>
	</div>
	<script type="text/javascript">
		var po = document.createElement('script');
		po.type = 'text/javascript';
		po.async = true;
		po.src = 'https://apis.google.com/js/plusone.js';
		var s = document.getElementsByTagName('script')[0];
		s.parentNode.insertBefore(po, s);
	</script>
	<script>
		var _gaq=[['_setAccount','UA-18021184-6'],['_trackPageview']];
		(function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
		g.src=('https:'==location.protocol?'//ssl':'//www')+'.google-analytics.com/ga.js';
		s.parentNode.insertBefore(g,s)}(document,'script'));
	</script>
</body>
<% } %>
</html>