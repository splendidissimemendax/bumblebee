import os

def fread(filename):
	with open(filename, 'r') as f:
		return f.read()


def fwrite(filename, text):
	basedir = os.path.dirname(filename)

	if not os.path.isdir(basedir):
		os.makedirs(basedir)

	with open(filename, 'w') as f:
		f.write(text)

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

	print("Site built.")

if __name__ == "__main__":
	buildSite()