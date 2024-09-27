import pytz
import datetime
import markdown
from re import sub
from email import utils

tz = pytz.timezone('UTC') # insert timezone here
site = ""

# update post index
def updateindex(path, title, description, tags, projects):
	replacetext = '\n	{\n		title: "' + title + '",\n		path: "' + path + '",\n		description: "' + description + '",\n		tags: [' + tags + '],\n		projects: [' + projects + ']\n	},'

	with open("./site/assets/scripts/script.js", "r") as file:
		data = file.read()
		data = data.replace("const posts = [", "const posts = [" + replacetext)

	with open("./site/assets/scripts/script.js", "w") as file:
		file.write(data)

	print("File updated.")

# create a new post
def newpost(title, description, dt):
	if dt == "":
		dt = str(datetime.date.today())

	file = title.replace(" ", "_")
	file = sub(r"</*em>", "", file)
	file = sub(r"</*strong>", "", file)

	path = "./site/posts/" + dt + "_" + file + ".html"

	with open("./site/posts/template.html", "r") as f:
		data = f.read()
	
	data = data.replace("{{TITLE}}", title)
	data = data.replace("{{DESCRIPTION}}", description)

	with open(path, "w") as f:
		f.write(data)

# update page index
def updatepageindex(title, description, header, home):
	path = title.replace(" ", "_")

	replacetext = '\n	{\n		title: "' + title + '",\n		path: "' + path + '",\n		description: "' + description + '",\n		header: ' + header +',\n		homePage: ' + home + '\n	},'

	with open("./site/assets/scripts/script.js", "r") as file:
		data = file.read()
		data = data.replace("const pages = [", "const pages = [" + replacetext)

	with open("./site/assets/scripts/script.js", "w") as file:
		file.write(data)

	print("File updated.")

# create a new page
def newpage(title, description):
	file = title.replace(" ", "_")

	path = "./site/pages/" + file + ".html"

	with open("./site/template.html", "r") as f:
		data = f.read()
		data = data.replace("{{TITLE}}", title)
		data = data.replace("{{DESCRIPTION}}", description)

	with open(path, "w") as f:
		f.write(data)

def md(filename):
	loc = "./markdown/" + filename + ".md"

	# Open the file for reading and read the input to a temp variable
	with open(loc, 'r') as f:
		tempMd = f.read()

	meta = sub(r"\]\n---\n\n[\s\S]*", "", tempMd)

	title = sub(r"[\s\S]*title: \"([^\"]*)[\s\S]*", r"\1", meta)

	formatted = title.replace(" ", "_")
	formatted = formatted.replace("*", "")

	title = sub(r"\*\*\*([^\*]*)\*\*\*", r"<strong><em>\1</em></strong>", title)
	title = sub(r"\*\*([^\*]*)\*\*", r"<strong>\1</strong>", title)
	title = sub(r"\*([^\*]*)\*", r"<em>\1</em>", title)

	dt = sub(r"[\s\S]*date: ([\d-]*)[\s\S]*", r"\1", meta)
	descr = sub(r"[\s\S]*description: \"([^\"]*)[\s\S]*", r"\1", meta)
	tags = sub(r"[\s\S]*tags: \[([^\]]*)[\s\S]*", r"\1", meta)
	projects = sub(r"[\s\S]*projects: \[([^\]]*)[\s\S]*", r"\1", meta)

	if dt == "":
		dt = str(datetime.date.today())

	formatted = dt + "_" + formatted

	newLoc = "./site/posts/" +  formatted + ".html"

	tempMd = sub(r"[\s\S]*\]\n---\n\n", "", tempMd)

	tempHtml = markdown.markdown(tempMd, extensions=["footnotes", "nl2br", 'tables'])
	tempHtml = tempHtml.replace("footnote-ref\"", "tooltip\" data-text=\"∞\"")
	tempHtml = tempHtml.replace("footnote-backref", "tooltip")
	tempHtml = sub(r"title=\"Jump back to footnote \d* in the text\"", "data-text=\"return to text\"", tempHtml)
	tempHtml = sub(r"(<li id=\"fn:\d*\">)\n<p>", r"\1", tempHtml)
	tempHtml = tempHtml.replace("<li><p>", "<li>")
	tempHtml = sub(r"</p>\n</li>", "</li>", tempHtml)
	tempHtml = sub(r"#fn:\d*\">(\d*)</a>", r'#fn:\1">[\1]</a>', tempHtml)
	tempHtml = tempHtml.replace("&#8617;", "<sup>^</sup>")
	tempHtml = tempHtml.replace("&#160;", "")
	
	newpost(title, descr, dt)

	with open(newLoc, 'r') as f:
		file = f.read()
		file = file.replace("{{CONTENT}}", tempHtml)

	with open(newLoc, "w") as f:
		f.write(file)

	updateindex(formatted, title, descr, tags, projects)

def rss(title, link, description):
	nowdt = datetime.datetime.now()
	nowdt = tz.localize(nowdt)
	date = utils.format_datetime(nowdt)

	item = "<ttl>20000</ttl>\n\n\t<item>\n\t\t<title>" + title
	item = item + "</title>\n\t\t<description>\n\t\t\t" + description 
	item = item + "\n\t\t</description>\n\t\t<link>" + link 
	item = item + "</link>\n\t\t<pubDate>\n\t\t\t" + date 
	item = item + "\n\t\t</pubDate>\n\t</item>"

	lastbuild = "<lastBuildDate>\n\t\t" + date + "\n\t</lastBuildDate>"

	with open('./site/rss.xml', 'r') as f:
		file = f.read()
		file = sub('<ttl>20000</ttl>', item, file)
		file = sub('<lastBuildDate>\n\t\t.*\n\t</lastBuildDate>', lastbuild, file)

	with open('./site/rss.xml', "w") as f:
		f.write(file)



# INPUTS

action1 = input("Update RSS feed (1), add a post (2), or add a page (3): ")

if int(action1) == 1:
	action2 = input("Get most recent post (y/n)? ")

	if action2.lower() == "y":
 
		with open('./site/assets/scripts/script.js', 'r') as f:
			file = f.read()
			file = sub(r'[\s\S]*const postsArray \= \[\n\t{\n', '', file)
			file = sub(r'\},[\s\S]*', '', file)

		title = sub(r'[\s\S]*title: "(.*)",[\s\S]*', r'\1', file)
		descr = sub(r'[\s\S]*description: "(.*)",[\s\S]*', r'\1', file)
		link = site + sub(r'[\s\S]*path: "(.*)",[\s\S]*', r'\1', file)

	else:
		title = input("page title: ")
		descr = input("page description: ")

		link = input("link: " + site)
		link = site + link

	rss(title, link, descr)

	print("RSS feed updated!\n")

elif int(action1) == 2:
	action2 = input("Create a post from MD (1) or create a blank new (2) or backdated post (3): ")

	if int(action2) == 1:
		filename = input("file name (no extension): ")

		md(filename)

		print("\nThe file " + filename + ".md has been converted to a post in HTML.")

	elif int(action2) == 2:
		posttitle = input("post title: ")
		descr = input("post description: ")
		posttags = input("tags (in double quotes, comma separated): ")
		postprojects = input("projects (in double quotes, comma separated): ")
		today = str(datetime.date.today())

		filename = posttitle.replace(" ", "_")
		path = today + "_" + filename

		newpost(posttitle, descr, "")
		updateindex(path, posttitle, descr, posttags, postprojects)

		print("\nA new post \"" + posttitle + "\" with the description \"" + descr + "\" and the tags [" + posttags + "] in the project " + postprojects + " has been created.\n")

	elif int(action2) == 3:
		dt = input("date (yyyy-mm-dd): ")
		posttitle = input("post title: ")
		descr = input("post description: ")
		posttags = input("tags (in double quotes, comma separated): ")
		postprojects = input("projects (in double quotes, comma separated): ")

		today = str(datetime.date.today())

		filename = posttitle.replace(" ", "_")
		path = dt + "_" + filename

		newpost(posttitle, descr, dt)
		updateindex(path, posttitle, descr, posttags, postprojects)

		print("\nA new post \"" + posttitle + "\" with the description \"" + descr + "\" and the tags [" + posttags + "] in the project " + postprojects + " dated " + dt + " has been created.\n")

	else:
		print("\nThat wasn't an option. Try again.\n")

elif int(action1) == 3:
	title = input("page title: ")
	descr = input("page description: ")
	header = input("show in header (t/f): ")
	home = input("show on home page (t/f): ")

	if header.lower() == "t" or "true":
		header = "true"
	else:
		header = "false"

	if home.lower() == "t" or "true":
		home = "true"
	else:
		home = "false"

	filename = title.replace(" ", "_")

	newpage(title, descr)
	updatepageindex(title, descr, header, home)

	print("\nA new post \"" + title + "\" with the description \"" + descr + "\" has been created.\n")

else:
	print("\nThat wasn't an option. Try again.\n")