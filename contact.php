<!DOCTYPE HTML>
<html>
	<head>  
        <meta content="text/html;charset=utf-8" http-equiv="Content-Type">
        <meta content="utf-8" http-equiv="encoding">     
        <link rel="stylesheet" type="text/css" href="style.css">
        
	    <script src="loader.js" type="text/javascript"></script> 
        
    </head>
  
    <body>
  
        <div id="main-wrapper">       

        	<div id="left-wrapper">       

            
            	<div id="adbox-left">
                	<img src="placeholder.jpg" style="visibility: hidden;">
                </div>
                
            </div>
                
                      
            <div id="middle-wrapper">    
			<script>document.getElementById('middle-wrapper').style.width = window.innerWidth - 400 + "px"</script>        
          
                <div id="header-div"> 
				<script>document.getElementById('header-div').style.width = window.innerWidth - 400 + "px"</script>              
                
                    <div id="header">
					<script>document.getElementById('header').style.width = window.innerWidth - 400 + "px"</script> 
                    
                        <h1 id="header-logo">Epoch of Elements</h1>
                        <div id="header-links">
                        
                            <a href="game.html">Play</a> &#9632;
                            <a href="index.html">Info</a> &#9632;
                            <a href="media.html">Media</a> &#9632;
                            <a href="support.html">Support</a> &#9632;
                            <a href="team.html">Team</a> &#9632;
                            <a href="contact.php">Contact</a>
                        
                        </div>
                        
                    </div> 
                </div> 
                              
                <div id="main">
                	<div id="content">
                    
                    <h1 style="margin-top: 10px; text-align: center;">Contact the Epoch of Elements Team</h1>
                    <p style="text-align: center;"><i>Here are some good reasons to contact us:</i></p>
                    
<div class="page-container" style="max-width: 800px;">

<div class="left" style="width: 20%; height: 125px;"><img src="images/report-bug.png"></div>
<div class="left" style="width: 76%; height: 125px; padding: 2%; text-align: justify;"><h2 style="margin-top: 0px;">Report Bugs</h2><p>Found a bug in EoE? Let us know what happened and what you were doing at the time and we will do our best to fix it. The more information you give us, the more likely we can reproduce the issue and squash that disgusting bug.</div>

<div class="left" style="width: 20%; height: 125px;"><img src="images/suggestion.png"></div>
<div class="left" style="width: 76%; height: 125px; padding: 2%; text-align: justify;"><h2 style="margin-top: 0px;">Game Suggestions</h2><p>We try our best to think of innovative ideas and game concepts to put EoE at maximum fun factor, but we are definitely open to unique and creative ideas from anyone. If you have an idea to make Epoch better, let us know!</div>

<div class="left" style="width: 20%; height: 125px;"><img src="images/happy-face.png"></div>
<div class="left" style="width: 76%; height: 125px; padding: 2%; text-align: justify;"><h2 style="margin-top: 0px;">Appreciation</h2><p>It really helps keep us motivated when we hear about how much fun the EoE community is having playing it. If you want to tell us what you're really liking about the game, we love to know that we're on the right track.</div>

</div>

<h2 style="text-align: center; margin-top: 20px;">Contact Form</h2>
<p style="text-align:center; font-style: italic;">All fields are required for a response. We do not save your email address.</p>

<div class="page-container">

<form method="post" action="contact.php">

<div class="left" style="width: 15%; line-height: 20px; margin-bottom: 20px; vertical-align: middle; text-align: center;">Name:</div> <div class="right" style="width: 80%; margin-bottom: 20px;"><input type="text" style="width: 80%;" name="name"></div>

<div class="left" style="width: 15%; line-height: 20px; margin-bottom: 20px; vertical-align: middle; text-align: center;">Email:</div> <div class="right" style="width: 80%; margin-bottom: 20px;"><input type="text" style="width: 80%;" name="email"></div>

<div class="left" style="width: 15%; line-height: 200px; vertical-align: middle; text-align: center;">Message:</div> <div class="right" style="width: 80%;"><textarea style="width: 80%;" rows="10" name="message"></div>

<input style="margin-left: 40%; margin-right: auto; margin-top: 30px; margin-bottom: 40px;" type="submit" value="Send Message">

</form>
</div>

<?php
  $name = $_REQUEST['name'] ;
  $email = $_REQUEST['email'] ;
  $message = $_REQUEST['message'] ;
  mail("social@epochofelements.com", "Epoch Contact Form - " . $name, $message, "From:" . $email);
?>
                    
                    </div>
                </div>             
                 
                <div id="footer-div">
                    <img src="placeholder.jpg" style="visibility: hidden;">
                </div> 
          
            </div> 
      
            <div id="right-wrapper">
                
                <div id="adbox-right">
                	<img src="placeholder.jpg" style="visibility: hidden;">
                </div>
                
            </div>
          
        </div>           
  </body>
</html>