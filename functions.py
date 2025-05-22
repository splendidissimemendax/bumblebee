import pytz
import datetime
import markdown
import re
from email import utils

tz = pytz.timezone('UTC') # insert timezone here
site = ""

def fread(path):
	with open(path, "r") as f:
		return f.read()
	
def fwrite(path, text):
	with open(path, "w") as f:
		f.write(text)

# update post index
def updateindex(path, title, description, tags, projects):
	replacetext = '\n	{\n		title: "'+ title 
	replacetext += '",\n		path: "' + path 
	replacetext += '",\n		description: "' + description 
	replacetext += '",\n		tags: [' + tags 
	replacetext += '],\n		projects: [' + projects + ']\n	},'

	data = fread("./site/assets/scripts/script.js")
	data = data.replace("const posts = [", "const posts = [" + replacetext)

	fwrite("./site/assets/scripts/script.js", data)

	print("File updated.")

# create a new post
def newpost(title, description, dt):
	if dt == "":
		dt = str(datetime.date.today())

	file = title.replace(" ", "_").replace("?", "")
	file = re.sub(r"</*em>", "", file)
	file = re.sub(r"</*strong>", "", file)

	path = "./site/posts/" + dt + "_" + file + ".html"

	data = fread("./site/posts/template.html")
	data = data.replace("{{TITLE}}", title)
	data = data.replace("{{DESCRIPTION}}", description)

	fwrite(path, data)

# update page index
def updatepageindex(title, description, header, home):
	path = title.replace(" ", "_").replace("?", "")

	replacetext = '\n	{\n		title: "' + title + '",\n		path: "' + path + '",\n		description: "' + description + '",\n		header: ' + header +',\n		homePage: ' + home + '\n	},'

	data = fread("./site/assets/scripts/script.js")
	data = data.replace("const pages = [", "const pages = [" + replacetext)

	fwrite("./site/assets/scripts/script.js", data)

	print("File updated.")

# create a new page
def newpage(title, description):
	file = title.replace(" ", "_")

	path = "./site/pages/" + file + ".html"

	data = fread("./site/template.html")
	data = data.replace("{{TITLE}}", title)
	data = data.replace("{{DESCRIPTION}}", description)

	fwrite(path, data)

def md(filename):
	path = "./markdown/" + filename + ".md"

	# Open the file for reading and read the input to a temp variable
	tempMd = fread(path)

	meta = re.sub(r"\]\n---\n\n[\s\S]*", "", tempMd)

	title = re.sub(r"[\s\S]*title: \"([^\"]*)[\s\S]*", r"\1", meta)

	formatted = title.replace(" ", "_").replace("?", "")
	formatted = formatted.replace("*", "")

	title = re.sub(r"\*\*\*([^\*]*)\*\*\*", r"<strong><em>\1</em></strong>", title)
	title = re.sub(r"\*\*([^\*]*)\*\*", r"<strong>\1</strong>", title)
	title = re.sub(r"\*([^\*]*)\*", r"<em>\1</em>", title)

	dt = re.sub(r"[\s\S]*date: ([\d-]*)[\s\S]*", r"\1", meta)
	descr = re.sub(r"[\s\S]*description: \"([^\"]*)[\s\S]*", r"\1", meta)
	tags = re.sub(r"[\s\S]*tags: \[([^\]]*)[\s\S]*", r"\1", meta)
	projects = re.sub(r"[\s\S]*projects: \[([^\]]*)[\s\S]*", r"\1", meta)

	if dt == "":
		dt = str(datetime.date.today())

	formatted = dt + "_" + formatted

	path = "./site/posts/" +  formatted + ".html"

	tempMd = re.sub(r"[\s\S]*\]\n---\n\n", "", tempMd)

	tempHtml = markdown.markdown(tempMd, extensions=["footnotes", "nl2br", 'tables'])
	
	newpost(title, descr, dt)

	file = fread(path).replace("{{CONTENT}}", tempHtml)

	fwrite(path, file)

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

	file = fread('./site/rss.xml')
	file = file.replace('<ttl>20000</ttl>', item)
	file = re.sub(r'<lastBuildDate>\n\t\t.*\n\t</lastBuildDate>', lastbuild, file)

	fwrite('./site/rss.xml', file)



# INPUTS

action1 = input("Update RSS feed (1), add a post (2), or add a page (3): ")

if int(action1) == 1:
	action2 = input("Get most recent post (y/n)? ")

	if action2.lower() == "y":
		file = fread('./site/assets/scripts/script.js')

		meta = re.search(r'const posts = \[\n\t\{\n[^{]*\}', file)
		meta = meta.group()

		title = re.sub(r'[\s\S]*title: "(.*)",[\s\S]*', r'\1', meta)
		descr = re.sub(r'[\s\S]*description: "(.*)",[\s\S]*', r'\1', meta)
		link = site + re.sub(r'[\s\S]*path: "(.*)",[\s\S]*', r'\1', meta)

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

	if header.lower() == "t" or header.lower() == "true":
		header = "true"
	else:
		header = "false"

	if home.lower() == "t" or home.lower() =="true":
		home = "true"
	else:
		home = "false"

	filename = title.replace(" ", "_")

	newpage(title, descr)
	updatepageindex(title, descr, header, home)

	print("\nA new page \"" + title + "\" with the description \"" + descr + "\" has been created.\n")

else:
	print("\nThat wasn't an option. Try again.\n")