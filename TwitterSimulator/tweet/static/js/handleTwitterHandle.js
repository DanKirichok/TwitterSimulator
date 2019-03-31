var myMarkov = new MarkovText(3);
var generatedWords = "";
var currentUsername = "";

$("#loading-container").css("display", "none");

$("#generateSentenceBtn").click(function(){
	if ($("#twitter_username_input").val().length == 0){
		return;
	}
	
	if ($("#twitter_username_input").val() != currentUsername) {
		$("#loading-container").css("display", "block");
		$("#make-tweet-container").css("display", "none");
	}
	
	if ($("#twitter_username_input").val() == currentUsername) {
		generatedWords = myMarkov.output(25);
		generateTweetBlock(currentUsername, "Today", generatedWords);
		
	} else {
		$.ajax({
			url: "handleUsername/",
			type: "POST",
			data: {
				"username": $("#twitter_username_input").val(),
			},
			
			success: function(json) {
				$("#loading-container").css("display", "none");
				$("#make-tweet-container").css("display", "block");
				
				currentUsername = $("#twitter_username_input").val();
				
				myMarkov.learn(json["text"]);
				
				generatedWords = myMarkov.output(25);				
				generateTweetBlock(currentUsername, "Today", generatedWords);
			}
		});
	}
});

function generateTweetBlock(username, date, text) {
	console.log("Generating tweet block")
	
	var tweet_block = `
		<li class="tweet-card">
		<div class="tweet-content">
		  <div class="tweet-header">
			<span class="fullname">
			  <strong>{{FULL_NAME}}</strong>
			</span>
			<span id = "twitter-username" class="username">@{{USERNAME}}</span>
			<span id = "twitter-post-date"class="tweet-time"> - {{DATE}}</span>
		  </div>
		  <a>
			<img class="tweet-card-avatar" src="https://pbs.twimg.com/media/C8RPRoFVwAAitMD.jpg" alt="">
		  </a>
		  <div class="tweet-text">
			<p class="" lang="es" data-aria-label-part="0">{{TEXT}}</a>
			  <a href="" class="twitter-hashtag" dir="ltr"></a>
			</p>
		  </div>
		  <div class="tweet-footer">
			<a class="tweet-footer-btn">
			  <i class="fas fa-comments"></i><span> 18</span>
			</a>
			<a class="tweet-footer-btn">
			  <i class="octicon octicon-sync" aria-hidden="true"></i><span> 64</span>
			</a>
			<a class="tweet-footer-btn">
			  <i class="octicon octicon-heart" aria-hidden="true"></i><span> 202</span>
			</a>
			<a class="tweet-footer-btn">
			  <i class="octicon octicon-mail" aria-hidden="true"></i><span> 155</span>
			</a>
		  </div>
		</div>
	  </li>
	`.replace("{{USERNAME}}", username).replace("{{DATE}}", date).replace("{{TEXT}}", text).replace("{{FULL_NAME}}", username);
	$(".tweet-list").empty();
	$(".tweet-list").prepend(tweet_block);
	
}