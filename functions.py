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
	date = date.strftime('%a, %d %b %Y %H:%M:%S +0000')

	return date

def readPage(text):
	frontmatter = sub(r"---\n([^(---)]*)\n---[\s\S]*", r"\1", text)
	frontmatter = frontmatter.split("\n")

	page = {}
	
	for t in frontmatter:
		key = sub(r":.*", "", t)
		val = sub(r"[^:]*: ", "", t)

		if key == "date":
			val = convertDate(val)

		page[key] = val

	content = sub(r"---\n[^(---)]*\n---\n*", "", text)
	content = markdown.markdown(content, extensions=["footnotes", "nl2br", 'tables'])
	page["content"] = content

	return page

# BUILD SITE
def buildSite():

	# IMPORT TEMPLATES
	headHTML = fread("./templates/header.html")
	footHTML = fread("./templates/footer.html")

	pageHTML = fread("./templates/page.html")
	postHTML = fread("./templates/page.html")

	# SUB HEADER AND FOOTER
	pageHTML = pageHTML.replace("{{HEADER}}", headHTML)
	pageHTML = pageHTML.replace("{{FOOTER}}", footHTML)

	postHTML = postHTML.replace("{{HEADER}}", headHTML)
	postHTML = postHTML.replace("{{FOOTER}}", footHTML)

	home = fread("markdown/pages/home.md")
	page = readPage(home)
	print(page)

	print("Site built.")

if __name__ == "__main__":
	buildSite()