/*
CONTENTS
	1. Basic Info
	2. The Content
		2.1. Posts
		2.2. Messages
	3. Creating Insertable HTML
		3.1. Post Page
		3.2. Archive List
		3.3. Recent Post List
		3.4. Tag Index
	4. Inserting HTML Into Pages

INSTRUCTIONS
	To add a new post, copy this object literal into the top of postsArray in section 2.1:
		{
			path: "filename",
			title: "post title/heading",
			description: "",
			tags: ["tag 1", "tag 2", "etc."],
			projects: ["project"]
		},
	Replace 'filename' with the name of the file (not the file extension, though).
	Replace 'post title/heading' with a human-readable post title.
	Replace 'tag 1', 'tag 2' etc. with tags (if no tags, leave the array empty).

	Safe characters to use in titles: anything except ordinary (not left/right) double-quotes.
	To use ordinary double-quotes, put a backslash before each one.
	(e.g. title: "How to \"use\" double-quotes in titles")

	Safe characters to use in tags:
		letters (upper- or lowercase)
		numbers
		? / : @ - . _ ~ ! $ & ' ( ) * + , ; = (question mark, slash, colon, at sign, hyphen-minus, period, underscore, tilde, exclamation mark, dollar, ampersand, apostrophe, left parenthesis, right parenthesis, asterisk, plus, comma, semicolon, equals)
		spaces (will be replaced by hyphens in tag urls)

	To add a new message, add it to messagesArray in section 2.2. The order doesn't matter.
*/



/* ==================
	1. BASIC INFO
================== */

// these are the only things you should have to change by hand (assuming you're not backdating posts)

const blogName = "{{BLOG NAME}}";
const recentPostsCutoff = 5; // set the number of most-recent posts displayed on the index page
const headerMessageOn = true; // switch header messages on (true) or off (false)
const linkIntro = "Links:"; // the thing it says before the footer links
let trekify = false; // engage star trek theme

// messages and footer links
const messagesArray = [
	{quote: "Quote A", source: "Source A" },
	{quote: "Quote B", source: "Source B"}
];
const footerLinks = [
	'<a href="https://wikipedia.org">{{LINK A}}</a>',
	'<a href="https://archive.org">{{LINK B}}</a>'
];

const url = window.location.pathname;



/* ===================
	2. THE CONTENT
=================== */

/* ---------------
	2.1. POSTS
--------------- */

const postsArray = [
	{
		path: "2024-04-03_sample",
		title: "sample",
		description: "The third of three example posts.",
		tags: ["sample tag b"],
		projects: ["sample project"]
	},
	{
		path: "2024-04-02_example",
		title: "example",
		description: "The second of three example posts.",
		tags: ["sample tag a", "sample tag b"],
		projects: []
	},
	{
		path: "2024-04-01_archetype",
		title: "archetype",
		description: "The first of three example posts.",
		tags: ["sample tag a"],
		projects: ["sample project"]
	}
];

for (let i in postsArray) postsArray[i].path = "posts/" + postsArray[i].path + ".html";


const pageArray = [
	{
		path: "favorite things",
		title: "favorite things",
		description: "These are a few of my favorite things."
	},
	{
		path: "sources",
		title: "sources",
		description: "The sources of my header messages."
	}
];

for (let i in pageArray) pageArray[i].path = "pages/" + pageArray[i].path + ".html";


/* ================================
	3. CREATING INSERTABLE HTML
================================ */

function formatPostLink(i, postsArray) { // take an index and an array of posts (which may be postsArray or a subset) and return an HTML-tagged link for that indexed post
	let linkText = "";
	const postTitle = postsArray[i].title;
	const postDescr = postsArray[i].description;
	const postTags = postsArray[i].tags;

	linkText += '<li class="box"><a href="' + relativePath + '/' + postsArray[i].path + '">';

	const monthNums2Names = {
		"01": "January",
		"02": "February",
		"03": "March",
		"04": "April",
		"05": "May",
		"06": "June",
		"07": "July",
		"08": "August",
		"09": "September",
		"10": "October",
		"11": "November",
		"12": "December"
	};

	linkText += '<span class="post-title">' + postTitle + "</span>";
	if (postDateFormat.test(postsArray[i].path.slice(6, 17))) linkText += " | " + monthNums2Names[postsArray[i].path.slice(11, 13)] + " " + postsArray[i].path.slice(14, 16) + ", " + postsArray[i].path.slice(6, 10) + '</a>';

	if (postDescr && postDescr.length) linkText += '<p>' + postDescr + '</p>';

	if (postTags && postTags.length) {
		postTags.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
		for (let i = 0; i < postTags.length; i++) {
			let tagName = postTags[i];
			postTags[i] = '<li><a href="' + relativePath + '/tags.html#--' + tagName.replace(/\s/g, "-") + '" rel="tag">' + tagName + '</a></li>';
		}
		linkText += '<dl><dt>Tags</dt><dd class="tag-list">' + postTags.join("") + '</dd></dl>';
	}

	return linkText;
}

function formatPageLink(i, pageArray) { // take an index and an array of posts (which may be postsArray or a subset) and return an HTML-tagged link for that indexed post
	let linkText = "";
	const pageTitle = pageArray[i].title;
	const pageDescr = pageArray[i].description;

	linkText += '<li><a href="' + relativePath + '/' + pageArray[i].path + '"><span class="post-title">' + pageTitle + '</span></a> | ';

	if (pageDescr && pageDescr.length) linkText += pageDescr;

	linkText += '</li>';
	return linkText;
}

function formatMessages(i, messagesArray) { // take an index and an array of posts (which may be postsArray or a subset) and return an HTML-tagged link for that indexed post
	let messageText = "";
	const quote = messagesArray[i].quote;
	const source = messagesArray[i].source;

	messageText += '<li>"' + quote + '"<br><small>—' + source + "</small></list>";

	return messageText;
}

function buildPostIndex(tagType, emptyMessage) { // take a json object of posts pre-sorted by tags (or another parameter) and output HTML for a list of tags, each of which has a sub-lists of posts
	let listText = "";

	for (let i = 0; i < postsArray.length; i++) { // set up an object of all posts by tag
		for (let j = 0; j < postsArray[i][tagType].length; j++) {
			if (typeof allTags[postsArray[i][tagType][j]] == 'undefined') allTags[postsArray[i][tagType][j]] = [];

			allTags[postsArray[i][tagType][j]].push({ path: postsArray[i].path, title: postsArray[i].title });
		}
	}
	const allTagNames = Object.keys(allTags).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

	if (allTagNames.length > 0) {
		for (let i = 0; i < allTagNames.length; i++) {
			let tagName = allTagNames[i];
			listText += '<li><details id="--' + tagName.replace(/ /g, "-") + '"><summary>' + tagName + '</summary><ul class="post-list">';
			for (let j = 0; j < allTags[tagName].length; j++) listText += formatPostLink(j, allTags[tagName]);
			listText += '</ul></details></li>';
		}
	} else listText += '<li>' + emptyMessage + '</li>';

	return listText;
}

function buildProjIndex(projectType, emptyMessage) { // take a json object of posts pre-sorted by projects (or another parameter) and output HTML for a list of projects, each of which has a sub-lists of posts
	let listText = "";

	for (let i = 0; i < postsArray.length; i++) { // set up an object of all posts by project
		for (let j = 0; j < postsArray[i][projectType].length; j++) {
			if (typeof allProjects[postsArray[i][projectType][j]] == 'undefined') allProjects[postsArray[i][projectType][j]] = [];

			allProjects[postsArray[i][projectType][j]].push({ path: postsArray[i].path, title: postsArray[i].title });
		}
	}
	const allProjectNames = Object.keys(allProjects).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

	if (allProjectNames.length > 0) {
		for (let i = 0; i < allProjectNames.length; i++) {
			let projectName = allProjectNames[i];
			listText += '<li><details id="--' + projectName.replace(/ /g, "-") + '"><summary>' + projectName + '</summary><ul class="post-list">';
			for (let j = allProjects[projectName].length - 1; j >= 0; j--) listText += formatPostLink(j, allProjects[projectName]);
			listText += '</ul></details></li>';
		}
	} else listText += '<li>' + emptyMessage + '</li>';

	return listText;
}

function buildPageIndex(tagType, emptyMessage) { // take a json object of posts pre-sorted by tags (or another parameter) and output HTML for a list of tags, each of which has a sub-lists of posts
	let listText = "";

	for (let i = 0; i < postsArray.length; i++) { // set up an object of all posts by tag
		for (let j = 0; j < postsArray[i][tagType].length; j++) {
			if (typeof allTags[postsArray[i][tagType][j]] == 'undefined') allTags[postsArray[i][tagType][j]] = [];

			allTags[postsArray[i][tagType][j]].push({ path: postsArray[i].path, title: postsArray[i].title });
		}
	}
	const allTagNames = Object.keys(allTags).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

	if (allTagNames.length > 0) {
		for (let i = 0; i < allTagNames.length; i++) {
			let tagName = allTagNames[i];
			listText += '<li><details id="--' + tagName.replace(/ /g, "-") + '"><summary>' + tagName + '</summary><ul class="post-list">';
			for (let j = 0; j < allTags[tagName].length; j++) listText += formatPostLink(j, allTags[tagName]);
			listText += '</ul></details></li>';
		}
	} else listText += '<li>' + emptyMessage + '</li>';

	return listText;
}

// final array of blog items (outer key: variable name, inner values: HTML element id/class and inner HTML)
const blog = {
	header: { id: "header", HTML: "" },
	niceDate: { id: "post-date", HTML: "" },
	postMeta: { id: "post-meta", HTML: "" },
	postNav: { id: "post-nav", HTML: "" },
	footer: { id: "footer", HTML: "" },
	archivePostList: { id: "archive-post-list", HTML: "" },
	recentPostList: { id: "recent-post-list", HTML: "" },
	tagIndex: { id: "tag-index", HTML: "" },
	projectIndex: { id: "project-index", HTML: "" },
	pageList: { id: "page-list", HTML: ""},
	messageList: { id: "message-list", HTML: ""}
};

// if reader is in posts or projects, put relative path up by one directory
let relativePath = (url.includes("posts/")) || (url.includes("projects/")) || (url.includes("pages/")) ? ".." : ".";

const postDateFormat = /\d{4}\-\d{2}\-\d{2}\_/;

// write the header HTML

if (trekify == true) {
	blog.header.HTML += '<div id="title"><a href="' + relativePath + '/">' + blogName + '</a></div>';

	blog.header.HTML += '<nav id="main-nav"><ul>' +
		'<li><a href="' + relativePath + '/about.html">about</a></li>' +
		'<li><a href="' + relativePath + '/pages/">pages</a></li>' +
		'<li><a href="' + relativePath + '/posts/">posts</a></li>'
	'</ul></nav>';
}

else { // add links to the header here
	blog.header.HTML += '<nav id="main-nav"><ul>' +
		'<li id="title"><a href="' + relativePath + '/">' + blogName + '</a></li>' +
		'<li><a href="' + relativePath + '/about.html">about</a></li>' +
		'<li><a href="' + relativePath + '/pages/">pages</a></li>' +
		'<li><a href="' + relativePath + '/posts/">posts</a></li>'
	'</ul></nav>';
}

if (headerMessageOn && messagesArray.length > 0) {
	let randMessage = messagesArray[Math.floor(Math.random() * messagesArray.length)].quote;
	blog.header.HTML += '<hr/><p id="header-message"><svg viewBox="0 0 22 22"><circle cx="11" cy="11" r="8"/></svg> ' + randMessage + '</p>';
}

// write the footer HTML
blog.footer.HTML += '<hr/><p>' + linkIntro + ' ' + footerLinks.join(" | ");
blog.footer.HTML += '<a id="return-link" href="#container" rel="return">\u2191 back to top</a></p>';

// To do the following stuff, we want to know where we are in the post array (if we're currently on a post page).
let currentIndex = -1;
let currentFilename = url.substring(url.lastIndexOf('posts/'));
// Depending on the web server settings (Or something?), the browser url may or may not have ".html" at the end. If not, we must add it back in to match the posts array. (12-19-2022 fix)
if (!currentFilename.endsWith(".html")) {
	currentFilename += ".html";
}
let i;
for (let i = 0; i < postsArray.length; i++) {
	if (postsArray[i].path === currentFilename) {
		currentIndex = i;
		break;
	}
}

/* -------------------
	3.1. POST PAGE
------------------- */

// get the current post title, date, and tags (if on a post page), and the post nav links
const tagList = [];
const projectList = []

if (currentIndex > -1) {
	// generate more-readable date
	const monthNums2Names = {
		"01": "January",
		"02": "February",
		"03": "March",
		"04": "April",
		"05": "May",
		"06": "June",
		"07": "July",
		"08": "August",
		"09": "September",
		"10": "October",
		"11": "November",
		"12": "December"
	};

	if (postDateFormat.test(postsArray[currentIndex].path.slice(6, 17))) {
		if (trekify == true) {
			blog.niceDate.HTML += "Stardate " + postsArray[currentIndex].path.slice(6,10) + postsArray[currentIndex].path.slice(11,13) + "." + postsArray[currentIndex].path.slice(14,16)
		}

		else {
			blog.niceDate.HTML += monthNums2Names[postsArray[currentIndex].path.slice(11, 13)] + " " + postsArray[currentIndex].path.slice(14, 16) + ", " + postsArray[currentIndex].path.slice(6, 10)
		}
	}

	document.getElementById("post-date").setAttribute("datetime", postsArray[currentIndex].path.slice(6, 16));

	// generate post tags HTML
	if (postsArray[currentIndex].tags.length > 0) {
		postsArray[currentIndex].tags.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
		for (let i = 0; i < postsArray[currentIndex].tags.length; i++) {
			let tagName = postsArray[currentIndex].tags[i];
			tagList[i] = '<li><a href="' + relativePath + '/tags.html#--' + tagName.replace(/\s/g, "-") + '" rel="tag">' + tagName + '</a></li>';
		}
	} else {
		tagList[0] = "none";
	}

	blog.postMeta.HTML += '<dt>Tags</dt><dd class="tag-list">' + tagList.join("") + '</dd>';

	// generate post projects HTML
	if (postsArray[currentIndex].projects.length > 0) {
		postsArray[currentIndex].projects.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
		for (let i = 0; i < postsArray[currentIndex].projects.length; i++) {
			let projectName = postsArray[currentIndex].projects[i];
			projectList[i] = '<li><a href="' + relativePath + '/projects/#--' + projectName.replace(/\s/g, "-") + '" rel="project">' + projectName + '</a></li>';
		}
	} else {
		projectList[0] = "none";
	}

	blog.postMeta.HTML += '<dt>Projects</dt><dd id="project-list">' + projectList.join("") + '</dd>';
	// generate post nav HTML
	let prevPost,
		nextPost;

	// if before latest post:
	if (currentIndex > 0) {
		prevPost = postsArray[currentIndex - 1];
		blog.postNav.HTML += '<div><a href="' + relativePath + '/' + prevPost.path + '" rel="next">\u2190 Next Post</a><p>' + prevPost.title + '</p></div>';
	} else blog.postNav.HTML += '<div>Latest post!</div>';

	// if after earliest post:
	if (0 <= currentIndex && currentIndex < postsArray.length - 1) {
		nextPost = postsArray[currentIndex + 1];
		blog.postNav.HTML += '<div><a href="' + relativePath + '/' + nextPost.path + '" rel="prev">Previous Post \u2192</a><p>' + nextPost.title + '</p></div>';
	} else blog.postNav.HTML += '<div>First post!</div>';
}

/* ----------------------
	3.2. ARCHIVE LIST
---------------------- */

// generate the Post List HTML
if (document.getElementById(blog.archivePostList.id)) {
	for (let i = 0; i < postsArray.length; i++) {
		blog.archivePostList.HTML += formatPostLink(i, postsArray);
	}
}

// generate the Page List HTML
if (document.getElementById(blog.pageList.id)) {
	for (let i = 0; i < pageArray.length; i++) {
		blog.pageList.HTML += formatPageLink(i, pageArray.sort());
	}
}

// generate the message list html
if (document.getElementById(blog.messageList.id)) {
	for (let i = 0; i < messagesArray.length; i++) {
		blog.messageList.HTML += formatMessages(i, messagesArray);
	}
}

/* --------------------------
	3.3. RECENT POST LIST
-------------------------- */

// generate the Recent Post List HTML
if (document.getElementById(blog.recentPostList.id)) {
	const numberOfRecentPosts = Math.min(recentPostsCutoff, postsArray.length);
	for (let i = 0; i < numberOfRecentPosts; i++) {
		blog.recentPostList.HTML += formatPostLink(i, postsArray);
	}

	// if there are more posts than the cutoff, end the list with a link to the Archive
	if (postsArray.length > recentPostsCutoff) {
		blog.recentPostList.HTML += '<li id="more-posts"><a href=' + relativePath + '/posts/>\u2192 more posts</a></li>';
	}
}

/* -------------------
	3.4. TAG AND PROJECT INDEX
------------------- */

// if reader is on the tags page, generate the Tag Index HTML
const allTags = {};


if (document.getElementById(blog.tagIndex.id)) blog.tagIndex.HTML = buildPostIndex("tags", 'This blog currently uses no tags!');

// if reader is on the projects page, generate the Project Index HTML
const allProjects = {};


if (document.getElementById(blog.projectIndex.id)) blog.projectIndex.HTML = buildProjIndex("projects", 'This blog currently has no projects!');



/* =================================
	4. INSERTING HTML INTO PAGES
================================= */

// for each blog item, if its element is in the file, insert its HTML
for (let i in blog) {
	const element = document.getElementById(blog[i].id);
	if (element) element.innerHTML = blog[i].HTML;
	else {
		const elements = document.getElementsByClassName(blog[i].id);
		if (elements.length > 0) {
			for (let j in elements) {
				elements[j].innerHTML = blog[i].HTML;
			}
		}
	}
}

// if on an index page, open the selected item's sub-list (if any) using its id
if (document.querySelector(".index") && window.location.hash) document.getElementById(window.location.hash.slice(1))?.setAttribute("open", "");