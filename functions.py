from os import walk
from os.path import join, splitext
import datetime
import pytz
from re import sub
import markdown
from email import utils

location = "" # insert path to *site folder here
tz = pytz.timezone('') # insert timezone here


# find/replace across files
def fix(filetype, search, replace, no = -1):

	onlyfiles = []
	
	for root, dirs, files in walk("./*site", topdown=False):
		for name in files:
			onlyfiles.append(join(root, name))

	type = "." + filetype.lower()
	list = []

	for f in onlyfiles:
		ext = splitext(f)[-1].lower()

		if ext == type:
			with open(f, "r") as file:
				data = file.read()
				data = sub(search, replace, data, no)
			
			with open(f, "w") as file:
				file.write(data)
			
			list.append(f)

	print(list)

# update post index
def updateindex(path, title, description, tags, projects):
	replacetext = '\n	{\n		path: "' + path + '",\n		title: "' + title + '",\n		description: "' + description + '",\n		tags: [' + tags + '],\n		projects: [' + projects + ']\n	},'

	with open("./*site/script.js", "r") as file:
		data = file.read()
		data = data.replace("const postsArray = [", "const postsArray = [" + replacetext)

	with open("./*site/script.js", "w") as file:
		file.write(data)

	print("File updated.")

# create a new post
def newpost(title, description, dt):
	if dt == "":
		dt = str(datetime.date.today())

	file = title.replace(" ", "_")

	path = "./*site/posts/" + dt + "_" + file + ".html"

	with open("./*site/posts/template.html", "r") as f:
		data = f.read()
	
	data = data.replace("{{YOUR BLOG POST TITLE HERE}}", title)
	data = data.replace("{{YOUR BLOG POST DESCRIPTION HERE}}", description)

	with open(path, "w") as f:
		f.write(data)

# update page index
def updatepageindex(title, description, display, directory):
	path = title.replace(" ", "_")

	replacetext = '\n	{\n		path: "' + path + '",\n		title: "' + title + '",\n		description: "' + description + '",\n		display: ' + display + ',\n		directory: ' + directory + '\n	},'

	with open("./*site/script.js", "r") as file:
		data = file.read()
		data = data.replace("const pageArray = [", "const pageArray = [" + replacetext)

	with open("./*site/script.js", "w") as file:
		file.write(data)

	print("File updated.")

# create a new page
def newpage(title, description):
	file = title.replace(" ", "_")

	path = "./*site/pages/" + file + ".html"

	with open("./*site/pages/*blank.html", "r") as f:
		data = f.read()
		data = data.replace("{{TITLE}}", title)
		data = data.replace("{{DESCRIPTION}}", description)

	with open(path, "w") as f:
		f.write(data)

# clean a post
def clean(filename, dt):
	file = filename.replace(" ", "_")

	path = "./*site/posts/" + dt + "_" + file + ".html"

	with open(path, "r") as f:
		data = f.read()

		# replace i with em
		data = data.replace("<i>", "<em>")
		data = data.replace("</i>", "</em>")

		# replace b with strong
		data = data.replace("<b>", "<strong>")
		data = data.replace("</b>", "</strong>")

		# clear useless stuff
		data = data.replace(' class="npf_indented\"', "")
		data = data.replace(' target="_blank"', "")
		data = data.replace(' rel=\"nofollow\"', "")
		data = data.replace('https://href.li/?', '')

	with open(path, "w") as f:
		f.write(data)

# convert md to html
def md(filename):
	formatted = filename.replace(" ", "_")
	path = "./*markdown/" + formatted + ".md"

	# Open the file for reading and read the input to a temp variable
	with open(path, 'r') as f:
		tempMd = f.read()

	title = sub(r"[\s\S]*title: \"([^\"]*)[\s\S]*", r"\1", tempMd)
	dt = sub(r"[\s\S]*date: ([\d-]*)[\s\S]*", r"\1", tempMd)
	descr = sub(r"[\s\S]*description: \"([^\"]*)[\s\S]*", r"\1", tempMd)
	tags = sub(r"[\s\S]*tags: \[([^\]]*)[\s\S]*", r"\1", tempMd)
	projects = sub(r"[\s\S]*projects: \[([^\]]*)[\s\S]*", r"\1", tempMd)

	if dt == "":
		dt = str(datetime.date.today())

	titleFormatted = dt + "_" + title.replace(" ", "_")

	newPath = "./*site/posts/" +  titleFormatted + ".html"

	tempMd = sub(r"[\s\S]*\]\n---\n\n", "", tempMd)

	tempHtml = markdown.markdown(tempMd, extensions=["footnotes"])
	
	newpost(title, descr, dt)

	with open(newPath, 'r') as f:
		file = f.read()
		file = file.replace("{{HERE}}", tempHtml)
		file = file.replace("class=\"footnote-ref\"", "data-toggle=\"tooltip\" title=\"∞\"")
		file = file.replace("class=\"footnote-backref\"", "data-toggle=\"tooltip\"")
		file = file.replace("&#8617;", "<sup>^</sup>")
		file = sub(r"#fn:\d*\">(\d*)</a>", r'#fn:\1">[\1]</a>', file)

	with open(newPath, "w") as f:
		f.write(file)

	updateindex(titleFormatted, title, descr, tags, projects)

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

	with open('./*site/rss.xml', 'r') as f:
		file = f.read()
		file = sub('<ttl>20000</ttl>', item, file)
		file = sub('<lastBuildDate>\n\t\t.*\n\t</lastBuildDate>', lastbuild, file)

	with open('./*site/rss.xml', "w") as f:
		f.write(file)



# INPUTS

action1 = input("Update RSS feed (1), convert a file (2), add a page (3), or edit posts (4): ")

if int(action1) == 1:
	title = input("page title: ")
	descr = input("page description: ")
	link = input("link: https://splendide-mendax.com/")

	link = "https://splendide-mendax.com/" + link

	rss(title, link, descr)

	print("RSS feed updated!\n")

elif int(action1) == 2:
	posttitle = input("post title: ")

	md(posttitle)

	print("\nThe post " + posttitle + " has been converted to HTML.")


elif int(action1) == 3:
	title = input("page title: ")
	descr = input("page description: ")
	display = input("display on home page (t/f): ")
	directory = input("directory (t/f): ")

	if display.lower() == "t":
		display = "true"
	else:
		display = "false"

	if directory.lower() == "t":
		directory = "true"
	else:
		directory = "false"

	filename = title.replace(" ", "_")

	newpage(title, descr)
	updatepageindex(title, descr, display, directory)

	print("\nA new post \"" + title + "\" with the description \"" + descr + "\" has been created.\n")


elif int(action1) == 4:
	action2 = input("Create a new post (1) or a backdated post (2), update the post index (3), create a new file (4), or clean a post (5): ")

	if int(action2) == 1:
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

	elif int(action2) == 2:
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

		fix("js", today, dt, 1)

		print("\nA new post \"" + posttitle + "\" with the description \"" + descr + "\" and the tags [" + posttags + "] in the project " + postprojects + " dated " + dt + " has been created.\n")

	elif int(action2) == 3:
		dt = input("date (yyyy-mm-dd): ")
		posttitle = input("post title: ")
		descr = input("post description: ")
		posttags = input("tags (in double quotes, comma separated): ")
		postprojects = input("projects (in double quotes, comma separated): ")

		filename = dt + "_" + posttitle.replace(" ", "_")

		updateindex(filename, posttitle, descr, posttags, postprojects)

		print("\nThe post \"" + posttitle + "\" (" + filename + ") with the tags [" + posttags + "] in the project " + postprojects + " has been added to the index.\n")

	elif int(action2) == 4:
		descr = input("post date: ")
		posttitle = input("post title: ")

		newpost(posttitle, descr)

		print("\nA new post \"" + posttitle + "\" with the description \"" + descr + "\" has been created.\n")

	elif int(action2) == 5:
		date = input("post date: ")
		posttitle = input("post title: ")

		clean(posttitle, date)

		print("\n\"" + posttitle + "\" has been cleaned.\n")

	else:
		print("\nThat wasn't an option. Try again.\n")

else:
	print("\nThat wasn't an option. Try again.\n")