from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect

from twitter_scraper import get_tweets
import re

# Create your views here.

def index(request):
	context = {}
	
	return render(request, "templates/index.html", context)

@csrf_exempt	
def handleUsername(request):
	context = {
		"text" : "",
	}

	if request.method == "POST":
		if len(request.POST["username"]) != 0:
			username = request.POST["username"]
			print("Handling username " + username)
			pattern = re.compile('http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+')
			tweets = get_tweets(username, pages=10)
			
			for tweet in get_tweets(username, pages=10):
				if tweet["retweets"] > -1:
					text = pattern.sub('', tweet["text"]) 
					
					if "pic" in text:
						text = text[:text.index("pic")] + " " + text[text.index("pic"):]
					
					for word in text.split(" "):
						if "pic" not in word:
							context["text"] += word + " "
		
	print("Done")
	return JsonResponse(context)
