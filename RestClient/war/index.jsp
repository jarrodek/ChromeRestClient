<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="com.google.appengine.api.users.User" %>
<%@ page import="com.google.appengine.api.users.UserService" %>
<%@ page import="com.google.appengine.api.users.UserServiceFactory" %>
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
.error, .info{padding:10px 20px;background:rgba(255, 0, 0, 0.05);-webkit-border-radius:8px;-moz-border-radius:8px;border-radius:8px;border:1px solid rgba(255, 0, 0, 0.2);display: block;text-align: center;font-weight: bold;font-size: 14px;}
</style>
</head>
<%
    UserService userService = UserServiceFactory.getUserService();
	boolean isUser = userService.isUserLoggedIn();
	boolean admin = userService.isUserAdmin();
	
	String infoMessage = null;
	String infoCode = request.getParameter("i");
	if(infoCode != null){
		if(infoCode.equals("removedall")){
			infoMessage = "Your data has been removed. Now You are disconnected from application.";
		}
	}
%>
<body>
	<div class="mainPanel">
		<div class="menu">
			<h1 class="contentTitle">Advanced Rest Client</h1>
			<ul role="tablist" class="mainNav">
				<li page="about" class="navBarItem navBarItemSelected" role="tab"
					tabindex="-1" aria-selected="true">About</li>
				<% if(isUser){ %>
				<li page="listing" class="navBarItem" role="tab"
					tabindex="-1" aria-selected="false" onclick="document.location.href='listing.jsp'">My data</li>
				<% } %>
				<% if(admin){ %>
				<li page="admin" class="navBarItem" role="tab"
					tabindex="-1" aria-selected="false" onclick="document.location.href='admin.jsp'">Admin</li>
				<% } %>
				<li class="navBarItem">
					<g:plusone href="https://chrome.google.com/webstore/detail/hgmloofddffdnphfgcellkdfbfbjeloo"></g:plusone>
				</li>
			</ul>
		</div>
		<div class="bodyPanel">
			<div class="mainViewContent">
				<%
				if(infoMessage != null){
				%>
				<div class="info"><%= infoMessage %></div>
				<%
				}
				%>
				<h2>Welcome to Advanced Rest Client service page</h2>
				<p>
					Go to <a href="https://chrome.google.com/webstore/detail/hgmloofddffdnphfgcellkdfbfbjeloo">Chrome Web Store</a> to install this application.
				</p>
				<p>
					Source code can be found at <a href="http://code.google.com/p/chrome-rest-client/">Google Code Hosting</a> under Apache License.
				</p>
				<p>
					Application blog: <a href="http://restforchrome.blogspot.com/">http://restforchrome.blogspot.com/</a>
				</p>
				<p>
					Please, if You find bug in application create ticket on Google Code <a href="http://code.google.com/p/chrome-rest-client/issues/list">Issue tracker</a>.<br/>
					Suggestions about application can be done as issue ticket as well. It's better way than leaving comment in Chrome Web Store :)
				</p>
				<section>
					<h3>About this service</h3>
					<p>
						This is cover of applications backend service to store saved requests data outside Chrome extension.<br/>
						Using this service You can store, restore and share saved data.  
					</p>
				</section>
				<% if(!isUser){ %>
				<section>
					<h3>If You are user of this application</h3>
					<p>
						  You can <a href="<%= userService.createLoginURL("/listing.jsp") %>">view your data</a> stored in this application.
					</p>
				</section>
				<% } %>
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
</html>