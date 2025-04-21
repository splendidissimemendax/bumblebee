def buildSite(): 
	print("built")

# IMPORT TEMPLATES
with open("./templates/header.html", "r") as f:
	headHTML = f.read()

with open("./templates/footer.html", "r") as f:
	footHTML = f.read()

with open("./templates/page.html", "r") as f:
	pageHTML = f.read()

# SUB HEADER AND FOOTER
pageHTML = pageHTML.replace("{{HEADER}}", headHTML)
pageHTML = pageHTML.replace("{{FOOTER}}", footHTML)

with open("./templates/page.html", "r") as f:
	postHTML = f.read()

# SUB HEADER AND FOOTER
postHTML = postHTML.replace("{{HEADER}}", headHTML)
postHTML = postHTML.replace("{{FOOTER}}", footHTML)