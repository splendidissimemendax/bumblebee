import os
from re import sub
import datetime
import markdown

def fread(filename):
	with open(filename, 'r') as f:
		return f.read()

def fwrite(filename, text):
	basedir = os.path.dirname(filename)

	if not os.path.isdir(basedir):
		os.makedirs(basedir)

	with open(filename, 'w') as f:
		f.write(text)

def convertDate(datestr):
	date = datetime.datetime.strptime(datestr, '%Y-%m-%d')
	date = date.strftime('%B %-d, %Y')

	return date

def readPage(text):
	text = text.replace("---",":frontmatter:", 2)

	frontmatter = sub(r":frontmatter:\n([\s\S]*)\n:frontmatter:\n*[\s\S]*", r"\1", text)
	frontmatter = frontmatter.split("\n")

	page = {}
	
	for t in frontmatter:
		key = sub(r":.*", "", t)
		val = sub(r"[^:]*: ", "", t)

		page[key] = val

	content = sub(r":frontmatter:\n([\s\S]*)\n:frontmatter:\n*", "", text)
	content = markdown.markdown(content, extensions=["footnotes", "nl2br", 'tables'])
	page["content"] = content

	return page

# BUILD SITE
def buildSite():

	# IMPORT TEMPLATES
	headHTML = fread("./templates/header.html")
	footHTML = fread("./templates/footer.html")

	pageHTML = fread("./templates/page.html")
	postHTML = fread("./templates/post.html")

	# SUB HEADER AND FOOTER
	pageHTML = pageHTML.replace("{{HEADER}}", headHTML)
	pageHTML = pageHTML.replace("{{FOOTER}}", footHTML)

	postHTML = postHTML.replace("{{HEADER}}", headHTML)
	postHTML = postHTML.replace("{{FOOTER}}", footHTML)

	# PAGES
	pages = os.listdir("markdown/pages/")
	pageMeta = []

	for i in pages:
		file = fread("markdown/pages/" + i)
		meta = readPage(file)

		content = meta.pop("content")

		page = pageHTML.replace("{{CONTENT}}", content)
		page = page.replace("{{DESCRIPTION}}", meta["description"])
		page = page.replace("{{TITLE}}", meta["title"])

		if "location" in meta:
			pass
		else:
			meta["location"] = meta["date"] + "_" + meta["title"].replace(" ", "_").lower()

		pageMeta.append(meta)
		
		fwrite("site/" + meta["location"] + ".html", page)

	# POSTS
	posts = os.listdir("markdown/posts/")
	postMeta = []

	for i in posts:
		file = fread("markdown/posts/" + i)
		meta = readPage(file)

		content = meta.pop("content")

		post = postHTML.replace("{{CONTENT}}", content)
		post = post.replace("{{DESCRIPTION}}", meta["description"])
		post = post.replace("{{TITLE}}", meta["title"])
		post = post.replace("{{DATE}}", convertDate(meta["date"]))

		if "location" in meta:
			pass
		else:
			meta["location"] = meta["date"] + "_" + meta["title"].replace(" ", "_").lower()

		postMeta.append(meta)
		
		fwrite("site/posts/" + meta["location"] + ".html", post)

	print("Site built.")

if __name__ == "__main__":
	buildSite()