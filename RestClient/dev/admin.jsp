<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>Advanced Rest Client Application</title>
<style type="text/css">
</style>
</head>
<body>
<h1>Messages</h1>

<section>
	<h2>Add message</h2>
	<form action="/admin/message/add" method="post">
		<input type="hidden" name="payload" value="message-add"/>
		<div>
			Notification's read more destination:
			<input type="text" name="actionUrl" value="" placeholder="click URL"/>
		</div>
		<div>
			Message:
			<textarea name="message" placeholder="The message"></textarea>
		</div>
		<div>
			<input type="submit" value="save"/>
		</div>
	</form>
</section>

</body>
</html>