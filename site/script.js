/* 
CONTENTS
1. Basic info
	1a. Variables
	1b. Misc
2. Arrays
	2a. Header messages
	2b. Pages
	2c. Posts
	2d. Footer links
3. Functions
	3a. Misc adjustments
	3b. Header functions
	3c. Page functions
	3d. Post functions
4. HTML generation
	4a. Header HTML
	4b. Footer HTML
	4c. Post page HTML
	4d. Home page HTML
	4e. Pages page HTML
	4f. Archive page HTML
	4g. Tags page HTML
	4h. Projects page HTML
5. HTML insertion
*/



/* ==================
	1. BASIC INFO
================== */

/* ------------------
	1A. VARIABLES
------------------ */

const blogName = "Bumblebee";
const linkIntro = "Links:";
const recentPostsCutoff = 5;
const headerMessageOn = true;

let   randomColors = true;
const colors = [
	"yellow",
	"green",
	"moss",
	"teal",
	"blue"
]

/* ------------------
	1B. MISC
------------------ */

const url = window.location.pathname;

const postDateFormat = /\d{4}\-\d{2}\-\d{2}\_/;

const blog = {
	// header
	header: { id: "header", HTML: "" },
	messageList: { id: "message-list", HTML: ""},

	// page lists to display on various pages
	pageList: { id: "page-list", HTML: ""},
	pageDisplay: {id: "page-display", HTML: ""},

	// post lists to display on various pages 
	archivePostList: { id: "archive-post-list", HTML: "" },
	recentPostList: { id: "recent-post-list", HTML: "" },
	tagIndex: { id: "tag-index", HTML: "" },
	projectIndex: { id: "project-index", HTML: "" },

	// post data
	niceDate: { id: "post-date", HTML: "" },
	postMeta: { id: "post-meta", HTML: "" },
	postNav: { id: "post-nav", HTML: "" },

	// footer
	footer: { id: "footer", HTML: "" }
};

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



/* ==================
	2. ARRAYS
================== */

/* ------------------
	2A. HEADER MESSAGES
------------------ */

const messagesArray = [
	{
		quote: "Quote A", 
		source: "Source A" 
	},
	{
		quote: "Quote B", 
		source: "Source B"
	}
];

/* ------------------
	2B. PAGES
------------------ */

const pageArray = [
	{
		path: "favorite_things",
		title: "favorite things",
		description: "These are a few of my favorite things.",
		display: true,
		directory: false
	},
	{
		path: "sources",
		title: "sources",
		description: "The sources of my header messages.",
		display: true,
		directory: false
	},
	{
		path: "about",
		title: "about",
		description: "About me.",
		display: false,
		directory: false
	},
	{
		path: "test",
		title: "test",
		description: "Styles test",
		display: false,
		directory: false
	}
];

/* ------------------
	2C. POSTS
------------------ */

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

/* ------------------
	2D. FOOTER LINKS
------------------ */

const footerLinks = [
	'<a href="https://wikipedia.org">{{LINK A}}</a>',
	'<a href="https://archive.org">{{LINK B}}</a>'
];



/* ==================
	3. FUNCTIONS
================== */

/* ------------------
	3A. MISC ADJUSTMENTS
------------------ */

for (let i in postsArray) postsArray[i].path = "posts/" + postsArray[i].path + ".html";


for (let i in pageArray) {
	if (pageArray[i].directory) {
		pageArray[i].path = "pages/" + pageArray[i].path + "/index.html";
	} else {
		pageArray[i].path = "pages/" + pageArray[i].path + ".html";
	}
	
}

const pagesSorted = pageArray.sort(
	(a, b) => {
		const titleA = a.title.toUpperCase(); // ignore upper and lowercase
		const titleB = b.title.toUpperCase(); // ignore upper and lowercase
		if (titleA < titleB) {
		  return -1;
		}
		if (titleA > titleB) {
		  return 1;
		}
	  
		// titles must be equal
		return 0;
	  }
);

/* ------------------
	3B. HEADER FUNCTIONS
------------------ */

function formatMessages(i, messagesArray) { // take an index and an array of posts (which may be postsArray or a subset) and return an HTML-tagged link for that indexed post
	let messageText = "";
	const quote = messagesArray[i].quote;
	const source = messagesArray[i].source;

	messageText += '<li>"' + quote + '"<br><small>—' + source + "</small></list>";

	return messageText;
}

/* ------------------
	3C. PAGE FUNCTIONS
------------------ */

function formatPageLink(i, pageArray) {
	let linkText = "";
	const pageTitle = pageArray[i].title;
	const pageDescr = pageArray[i].description;
	let color = colors[Math.floor(Math.random() * colors.length)];

	linkText += '<li class="box"';
	if (randomColors) linkText += 'style="--color: var(--' + color + ')"';
	linkText += '><a href="/' + pageArray[i].path + '"><span class="post-title">' + pageTitle + '</span></a> | ';

	if (pageDescr && pageDescr.length) linkText += pageDescr;

	linkText += '</li>';
	return linkText;
}

function formatPageTitle(i, pageArray) { 
	let linkText = "";
	const pageTitle = pageArray[i].title;

	linkText += '<li class="post-title"><a href="/' + pageArray[i].path + '">' + pageTitle + '</a></li>';
	return linkText;
}

/* ------------------
	3D. POST FUNCTIONS
------------------ */

function formatPostLink(i, postsArray) {
	let linkText = "";
	const postTitle = postsArray[i].title;
	const postDescr = postsArray[i].description;
	const postTags = postsArray[i].tags;
	let color = colors[Math.floor(Math.random() * colors.length)];

	linkText += '<li class="box"';
	if (randomColors) linkText += 'style="--color: var(--' + color + ')"';
	linkText += '><a href="/' + postsArray[i].path + '">';

	linkText += '<span class="post-title">' + postTitle + "</span>";
	if (postDateFormat.test(postsArray[i].path.slice(6, 17))) linkText += " | " + monthNums2Names[postsArray[i].path.slice(11, 13)] + " " + postsArray[i].path.slice(14, 16) + ", " + postsArray[i].path.slice(6, 10) + '</a>';

	if (postDescr && postDescr.length) linkText += '<p>' + postDescr + '</p>';

	if (postTags && postTags.length) {
		postTags.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
		for (let i = 0; i < postTags.length; i++) {
			let tagName = postTags[i];
			postTags[i] = '<li><a href="/pages/tags.html#--' + tagName.replace(/\s/g, "-") + '" rel="tag">' + tagName + '</a></li>';
		}
		linkText += '<dl><dt>Tags</dt><dd class="tag-list">' + postTags.join("") + '</dd></dl>';
	}

	return linkText;
}

function buildPostIndex(tagType, emptyMessage) {
	let listText = "";

	for (let i = 0; i < postsArray.length; i++) {
		for (let j = 0; j < postsArray[i][tagType].length; j++) {
			if (typeof allTags[postsArray[i][tagType][j]] == 'undefined') allTags[postsArray[i][tagType][j]] = [];

			allTags[postsArray[i][tagType][j]].push({ path: postsArray[i].path, title: postsArray[i].title });
		}
	}
	const allTagNames = Object.keys(allTags).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

	if (allTagNames.length > 0) {
		for (let i = 0; i < allTagNames.length; i++) {
			let tagName = allTagNames[i];
			if (tagType == "projects") {
				listText += '<li><details id="--' + tagName.replace(/ /g, "-") + '"><summary>' + tagName + '</summary><ol class="post-list">';
				for (let j = allTags[tagName].length - 1; j >= 0; j--) listText += formatPostLink(j, allTags[tagName]);
			} else {
				listText += '<li><details id="--' + tagName.replace(/ /g, "-") + '"><summary>' + tagName + '</summary><ol reversed class="post-list">';
				for (let j = 0; j < allTags[tagName].length; j++) listText += formatPostLink(j, allTags[tagName]);
			}
			listText += '</ol></details></li>';
		}
	} else listText += '<li>' + emptyMessage + '</li>';

	return listText;
}



/* ==================
	4. HTML GENERATION
================== */

/* ------------------
	4A. HEADER HTML
------------------ */

blog.header.HTML += '<nav id="main-nav"><ul>' +
	'<li id="title"><a href="/">' + blogName + '</a></li>' +
	'<li><a href="/pages/about.html">about</a></li>' +
	'<li><a href="/pages/">pages</a></li>' +
	'<li><a href="/posts/">posts</a></li>'+
	'<li><a href="/rss.xml">feed</a></li>' +
	'</ul></nav>';

if (headerMessageOn && messagesArray.length > 0) {
	let randMessage = messagesArray[Math.floor(Math.random() * messagesArray.length)].quote;
	blog.header.HTML += '<hr/><p id="header-message"><svg viewBox="0 0 22 22"><circle cx="11" cy="11" r="8"/></svg> ' + randMessage + '</p>';
}

if (document.getElementById(blog.messageList.id)) {
	for (let i = 0; i < messagesArray.length; i++) {
		blog.messageList.HTML += formatMessages(i, messagesArray);
	}
}

/* ------------------
	4B. FOOTER HTML
------------------ */

blog.footer.HTML += '<hr/><p>' + linkIntro + ' ' + footerLinks.join(" | ");
blog.footer.HTML += '<a id="return-link" href="#container" rel="return">\u2191 back to top</a></p>';

/* ------------------
	4C. POST PAGE HTML
------------------ */

// check if this is a post
let currentIndex = -1;
let currentFilename = url.substring(url.lastIndexOf('posts/'));

if (!currentFilename.endsWith(".html")) {
	currentFilename += ".html";
}

for (let i = 0; i < postsArray.length; i++) {
	if (postsArray[i].path === currentFilename) {
		currentIndex = i;
		break;
	}
}

const tagList = [];
const projectList = []

if (currentIndex > -1) {
	// POST DATE
	if (postDateFormat.test(postsArray[currentIndex].path.slice(6, 17))) {
		blog.niceDate.HTML += monthNums2Names[postsArray[currentIndex].path.slice(11, 13)] + " " + postsArray[currentIndex].path.slice(14, 16) + ", " + postsArray[currentIndex].path.slice(6, 10)
	}

	document.getElementById("post-date").setAttribute("datetime", postsArray[currentIndex].path.slice(6, 16));

	// POST META: TAGS
	if (postsArray[currentIndex].tags.length > 0) {
		postsArray[currentIndex].tags.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
		for (let i = 0; i < postsArray[currentIndex].tags.length; i++) {
			let tagName = postsArray[currentIndex].tags[i];
			tagList[i] = '<li><a href="/pages/tags.html#--' + tagName.replace(/\s/g, "-") + '" rel="tag">' + tagName + '</a></li>';
		}
	} else {
		tagList[0] = "<li>none</li>";
	}

	blog.postMeta.HTML += '<dt>Tags</dt><dd class="tag-list">' + tagList.join("") + '</dd>';

	// POST META: PROJECTS
	if (postsArray[currentIndex].projects.length > 0) {
		postsArray[currentIndex].projects.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
		for (let i = 0; i < postsArray[currentIndex].projects.length; i++) {
			let projectName = postsArray[currentIndex].projects[i];
			projectList[i] = '<li><a href="/pages/projects.html#--' + projectName.replace(/\s/g, "-") + '" rel="project">' + projectName + '</a></li>';
		}
	} else {
		projectList[0] = "<li>none</li>";
	}

	blog.postMeta.HTML += '<dt>Projects</dt><dd id="project-list">' + projectList.join("") + '</dd>';
	
	// POST NAVIGATION
	let prevPost,
		nextPost;

	if (currentIndex > 0) {
		prevPost = postsArray[currentIndex - 1];
		blog.postNav.HTML += '<div><a href="/' + prevPost.path + '" rel="next">\u2190 Next Post</a><p>' + prevPost.title + '</p></div>';
	} else blog.postNav.HTML += '<div>Latest post!</div>';

	if (0 <= currentIndex && currentIndex < postsArray.length - 1) {
		nextPost = postsArray[currentIndex + 1];
		blog.postNav.HTML += '<div><a href="/' + nextPost.path + '" rel="prev">Previous Post \u2192</a><p>' + nextPost.title + '</p></div>';
	} else blog.postNav.HTML += '<div>First post!</div>';
}

/* ------------------
	4D. HOME PAGE HTML
------------------ */

// display pages
if (document.getElementById(blog.pageDisplay.id)) {
	blog.pageDisplay.HTML += "Try these pages: "

	for (let i = 0; i < pageArray.length; i++) {
		if (pageArray[i].display) {
			blog.pageDisplay.HTML += formatPageTitle(i, pagesSorted);
		}
	}
}

// recent posts
if (document.getElementById(blog.recentPostList.id)) {
	const numberOfRecentPosts = Math.min(recentPostsCutoff, postsArray.length);
	for (let i = 0; i < numberOfRecentPosts; i++) {
		blog.recentPostList.HTML += formatPostLink(i, postsArray);
	}

	// if there are more posts than the cutoff, end the list with a link to the Archive
	if (postsArray.length > recentPostsCutoff) {
		blog.recentPostList.HTML += '<li id="more-posts"><a href=/posts/>\u2192 more posts</a></li>';
	}
}

/* ------------------
	4E. PAGES PAGE HTML
------------------ */

if (document.getElementById(blog.pageList.id)) {
	for (let i = 0; i < pageArray.length; i++) {
		blog.pageList.HTML += formatPageLink(i, pagesSorted);
	}
}

/* ------------------
	4F. ARCHIVE PAGE HTML
------------------ */

if (document.getElementById(blog.archivePostList.id)) {
	for (let i = 0; i < postsArray.length; i++) {
		blog.archivePostList.HTML += formatPostLink(i, postsArray);
	}
}

/* ------------------
	4G. TAGS PAGE HTML
------------------ */

const allTags = {};

if (document.getElementById(blog.tagIndex.id)) blog.tagIndex.HTML = buildPostIndex("tags", 'This blog currently uses no tags!');

/* ------------------
	4H. PROJECT PAGE HTML
------------------ */

const allProjects = {};

if (document.getElementById(blog.projectIndex.id)) blog.projectIndex.HTML = buildPostIndex("projects", 'This blog currently has no projects!');



/* ==================
	5. HTML INSERTION
================== */

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