/* ==================
	0. CREDITS
================== */

/*  This code is strongly inspired by Marina Kittaka's Zonelets (https://zonelets.net/)
	via speakthesky's fork, Zonelots (https://codeberg.org/01bbl/Zonelots). 
	
	I have rewritten the whole thing from scratch, but it would not look the way it 
	does without those projects as reference. 
	
	Any errors that remain are my own. You can find me at splendide-mendax.com */

/* ==================
	1. BASIC INFO
================== */

/* ------------------
	1A. VARIABLES
------------------ */
const blogName      = "{{BLOG NAME}}";
const footerMsg     = "© {{NAME}} {{YEAR}}"
const recentPosts   = 5;     // how many posts do you want to show on the home page?
const themeSwitcher = true;  // do you want to use multiple themes?
const projNav       = true;  // do you want to include nav links for projects in posts?
const sortPosts     = true;  // sort posts by date
const hasRss        = true;  // do you have an rss feed

/* ==================
	2. ARRAYS
================== */

/* ------------------
	2A. POSTS/PAGES
------------------ */
// POSTS
const posts = [
	{
		title: "sample",
		path: "2024-09-24_sample",
		description: "the third of three posts",
		tags: ["tag a"],
		projects: ["project a"]
	},
	{
		title: "example",
		path: "2024-09-23_example",
		description: "the second of three posts",
		tags: ["tag a", "tag b"],
		projects: []
	},
	{
		title: "archetype",
		path: "2024-09-22_archetype",
		description: "the first of three posts",
		tags: ["tag b"],
		projects: ["project a"]
	}
];

// PAGES
const pages = [
	{
		title: "projects",
		path: "projects",
		description: "posts sorted by project",
		header: false,
		homePage: false
	},
	{
		title: "tags",
		path: "tags",
		description: "posts sorted by tag",
		header: false,
		homePage: true
	},
	{
		title: "test",
		path: "test",
		description: "test page for styles",
		header: true,
		homePage: false
	}
];

/* ------------------
	2B. GENERAL
------------------ */
const footer = [
	{
		title: "email",
		path: "mailto:{{EMAIL}}"
	},
	{
		title: "wikipedia",
		path: "https://www.wikipedia.org"
	},
];

/* ------------------
	2C. THEME SWITCHER
------------------ */
const themes = [
	{
		title: "minimal",
		style: `background-color: white;`
	},
	{
		title: "old school",
		style: `background-color: lime;`
	},
	{
		title: "none",
		style: `background-color: black;`
	},
]

// if you don't mean to make structural edits, you're done!

/* ==================
	3. PREPARATIONS
================== */

/* ------------------
	3A. ELEMENTS
------------------ */
const elements = {
	// GENERAL
	header:        {id: "header", html: ""},
	footer:        {id: "footer", html: ""},

	// HOME
	reccedPages:   {id: "reccedPages", html: ""},
	recentPosts:   {id: "recentPosts", html: ""},

	// POSTS
	postDate:      {id: "date", html: ""},
	postMeta:      {id: "postMeta", html: ""},

	// INDICIES
	postIndex:     {id: "postIndex", html: ""},
	pageIndex:     {id: "pageIndex", html: ""},
	tagsIndex:     {id: "tagsIndex", html: ""},
	projIndex:     {id: "projIndex", html: ""},

	// THEME SWITCHER
	themeSwitcher: {id: "switcher", html: ""}
};

/* ------------------
	3B. ADJUSTMENTS
------------------ */
// delete absent elements from elements to avoid building them
for (let i in elements) {
	if (elements[i].id) {
		const selection = document.getElementById(elements[i].id);
		if (!selection) delete elements[i];
	} else {
		delete elements[i];
	}
}

// POSTS
if (sortPosts) {
	posts.sort((a, b) => {
		const dateA = a.path.slice(0,9);
		const dateB = b.path.slice(0,9);
	
		if (dateA < dateB) return 1;
		if (dateA > dateB) return -1;
	
		return 0;
	});
}

for (let i in posts) posts[i].path = "/posts/" + posts[i].path + ".html";

// establish if current page is a post
const url = window.location.pathname;
let index = -1;

if (url.includes('/posts/')) {
	let file = url.substring(url.lastIndexOf('/posts/'));
	
	if (!file.endsWith(".html")) {
		file += ".html";
	}
	
	for (let i = 0; i < posts.length; i++) {
		if (posts[i].path === file) {
			index = i;
			break;
		}
	}
}

// PAGES
for (let i in pages) pages[i].path = "/pages/" + pages[i].path + ".html";

pages.sort((a, b) => {
	const titleA = a.title.toLowerCase();
	const titleB = b.title.toLowerCase();

	if (titleA < titleB) return -1;
	if (titleA > titleB) return 1;

	return 0;
});

// HEADER
const header = [
	{
		title: "posts",
		path: "/posts/"
	},
	{
		title: "pages",
		path: "/pages/"
	}
];

if (hasRss) header.push({title: "rss", path: "/rss.xml"});

for (let i in pages) {
	if (pages[i].header) header.push({title: pages[i].title, path: pages[i].path});
}

header.sort((a, b) => {
	const titleA = a.title.toLowerCase();
	const titleB = b.title.toLowerCase();

	if (titleA < titleB) return -1;
	if (titleA > titleB) return 1;

	return 0;
});

// THEME SWITCHER
if (themeSwitcher) {
	for (let i in themes) themes[i].path = "/assets/styles/" + themes[i].title.replace(/ /g, "_") + ".css";
} else {
	delete elements.themeSwitcher;
}


/* ------------------
	3C. MISC
------------------ */
const dateFormat = /\d{4}\-\d{2}\-\d{2}\_/;

const months = {
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
}

/* ==================
	4. FUNCTIONS
================== */

/* ------------------
	4A. POST META
------------------ */
function formatPostTags(post) {
	let data = "";

	if (post.tags && post.projects) {
		if (post.tags.length || post.projects.length) {
			data += `<dl>`
			if (post.tags.length) {
				data += `<dt>tags</dt><dd><ul>`;
				for (let i in post.tags) data += `<li><a href="/pages/tags.html#${post.tags[i].replace(/\s/, "-")}">#${post.tags[i]}</a></li>`;
				data += `</ul></dd>`;
			}
	
			if (post.projects.length) {
				data += `<dt>projects</dt><dd><ul>`;
				for (let i in post.projects) data += `<li><a href="/pages/projects.html#${post.projects[i].replace(/\s/, "-")}">${post.projects[i]}</a></li>`;
				data += `</ul></dd>`;
			}
			data += `</dl>`
		}
	}

	return data;
}

function formatPostDate(path) {
	let date = "";
	let test = path.slice(7, 18);

	if (dateFormat.test(test)) {
		let month = months[path.slice(12, 14)];
		let day = path.slice(15, 17);
		let year = path.slice(7, 11);

		date += `${month} ${day}, ${year}`
	}

	return date;
}

function formatPostNav(array, index, project = "") {
	let html = ``;
	let prev = Number(Number(index) + 1);
	let next = Number(Number(index) - 1);

	let nextHtml = ``;
	let prevHtml = ``;
	let projHtml = ``;

	if (prev > array.length - 1) {
		prevHtml += `first post`;
	} else {
		prevHtml += `<a href="${array[prev].path}">← previous post</a>
		<p>${array[prev].title}</p>`
	}

	if (next < 0) {
		nextHtml += `last post`;
	} else {
		nextHtml += `<a href="${array[next].path}">next post →</a>
		<p>${array[next].title}</p>`
	}

	if (project != "") {
		projHtml += `<a href="/pages/projects.html#${project.replace(/\s/, "-")}">${project}</a>`
	} else {
		projHtml += `<a href="/posts/">all posts</a>`
	}

	html += `<div class="series">
		<div>${prevHtml}</div>
		<div>${projHtml}</div>
		<div>${nextHtml}</div>
	</div>`

	return html;
}

function formatPostMeta(post) {
	let html = formatPostTags(post);
	html += `<nav>`
	html += formatPostNav(posts, index);
	
	if (post.projects.length && projNav) {
		post.projects.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

		for (let i in post.projects) {
			let projName = post.projects[i];
			let projPosts = [];
			let projIndex = -1;


			for (let x in posts) {
				if (posts[x].projects.includes(projName)) {
					projPosts.push(posts[x]);
				}
			}

			for (let y in projPosts) {
				if (projPosts[y].path === url.substring(url.lastIndexOf('/posts/'))) {
					projIndex = y;
					break;
				}
			}

			html += formatPostNav(projPosts, projIndex, projName);
		}
	}

	html += `</nav>`

	return html;
}

/* ------------------
	4B. INDEX ENTRIES
------------------ */
function formatPostLink(post) {
	let tags = formatPostTags(post);

	let date = "";
	let test = post.path.slice(7, 18);
	if (dateFormat.test(test)) date += ` | ${formatPostDate(post.path)}`;

	let description = ``;
	if (post.description) description += `<p>${post.description}</p>`

	let html = `<li>
		<a href="${post.path}">${post.title}</a>${date}
		${description}
		${tags}
	</li>`;

	return html;
}

function formatPageLink(page) {
	let html = `<li><a href="${page.path}">${page.title}</a> | ${page.description}</li>`;

	return html;
}

function formatTagsIndex(tagType) {
	let html = ``;
	let allTags = {};

	for (let i = 0; i < posts.length; i++) {
		for (let j = 0; j < posts[i][tagType].length; j++) {
			if (typeof allTags[posts[i][tagType][j]] == 'undefined') allTags[posts[i][tagType][j]] = [];

			allTags[posts[i][tagType][j]].push({ path: posts[i].path, title: posts[i].title});
		}
	}
	const allTagNames = Object.keys(allTags).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

	if (allTagNames.length > 0) {
		for (let i = 0; i < allTagNames.length; i++) {
			let tagName = allTagNames[i];
			let count = allTags[tagName].length

			let list = "";
			if (tagType == "projects") {
				list += `<ol class="postList">`;

				for (let j = allTags[tagName].length - 1; j >= 0; j--) list += formatPostLink(allTags[tagName][j]);
			} else {
				list += `<ol reversed class="postList">`;

				for (let j = 0; j < allTags[tagName].length; j++) list += formatPostLink(allTags[tagName][j]);
			}

			html += `<details id="${tagName.replace(/ /g, "-")}"><summary>${tagName} (${count})</summary>${list}</ol></details>`;
		}
	} else html += `<p>This blog has no ${tagType}.</p>`;

	return html;
}

/* ------------------
	4C. THEMES
------------------ */
function setTheme(themeName) {
	let themeIndex = 0;

	for (let i in themes) {
		if (themes[i].title == themeName) {
			themeIndex = i;
			break;
		}
	}

	let theme = themes[themeIndex];

	document.getElementById('switcher-id').href = theme.path;

	localStorage.setItem('style', theme.title);
}

/* ==================
	5. HTML
================== */

/* ------------------
	5A. GENERAL
------------------ */
if (elements.header) {
	let headLinks = ``;

	for (i in header) headLinks += `<li><a href="${header[i].path}">${header[i].title}</a></li>`;

	elements.header.html += `<nav>
		<p><a href="/">${blogName}</a><p>
		<ul>
			${headLinks}
		</ul>
	</nav>`;

	elements.footer.html += ``;
}

// FOOTER
if (elements.footer) {
	let footLinks = ``;

	for (i in footer) footLinks += `<li><a href="${footer[i].path}">${footer[i].title}</a></li>`;

	if (footerMsg.length) elements.footer.html += `<p>${footerMsg}</p>`

	elements.footer.html += `<nav>
		<ul>
			${footLinks}
		</ul>

		<p><a href="#content">return to top ↑</a></p>
	</nav>`
}


/* ------------------
	5B. HOME
------------------ */
if (elements.reccedPages) {
	elements.reccedPages.html += `<ul>`;

	for (let i in pages) {
		if (pages[i].homePage) elements.reccedPages.html += formatPageLink(pages[i]);
	}

	elements.reccedPages.html += `</ul>`;
	}

if (elements.recentPosts) {
	elements.recentPosts.html += `<ol>`;

	for (let i = 0; i < Math.min(recentPosts, posts.length); i++) {
		elements.recentPosts.html += formatPostLink(posts[i]);
	}

	elements.recentPosts.html += `</ol>`;

	if (posts.length > recentPosts) {
		elements.recentPosts.html += `<p><a href="/posts/">more posts →</a></p>`
	}
}

/* ------------------
	5C. POSTS
------------------ */
if (elements.postDate) {
	elements.postDate.html += formatPostDate(posts[index].path)

	let element = document.getElementsByTagName("time")[0];

	element.setAttribute("datetime", posts[index].path.slice(7, 17));
}

if (elements.postMeta) {
	elements.postMeta.html += formatPostMeta(posts[index]);
}

/* ------------------
	5D. INDICIES
------------------ */
if (elements.pageIndex) {
	elements.pageIndex.html += `<ol>`;

	for (let i in pages) {
		elements.pageIndex.html += formatPageLink(pages[i]);
	}

	elements.pageIndex.html += `</ol>`;
}
 
if (elements.postIndex) {
	elements.postIndex.html += `<ol reversed>`

	for (let i in posts) {
		elements.postIndex.html += formatPostLink(posts[i])
	}

	elements.postIndex.html += `</ol>`
}

if (elements.tagsIndex) {
	elements.tagsIndex.html += formatTagsIndex("tags");
}

if (elements.projIndex) {
	elements.projIndex.html += formatTagsIndex("projects");
}

/* ------------------
	5E. THEME SWITCHER
------------------ */

if (themeSwitcher && elements.themeSwitcher) {
	for (let i in themes) {
		elements.themeSwitcher.html += `<div data-theme="${themes[i].title}" title="${themes[i].title}" class="switch" id="switch-${i + 1}" style="${themes[i].style}"></div>`;
	}

	document.documentElement.style.setProperty('--theme-count', themes.length);
}

/* ==================
	6. INSERTION
================== */

for (let i in elements) {
	let selection;

	if (elements[i].id) {
		selection = document.getElementById(elements[i].id);

		if (selection) selection.innerHTML = elements[i].html;
	} else {
		selection = document.getElementsByTagName(elements[i].select);

		if (selection) {
			for (let j in selection) selection[j].innerHTML = elements[i].html;
		}
	}
}

// open element
if (document.querySelector(".index") && window.location.hash) document.getElementById(window.location.hash.slice(1))?.setAttribute("open", "");

if (themeSwitcher) {
	let switches = document.getElementsByClassName('switch');

	let chosenTheme = localStorage.getItem('style');

	if (chosenTheme && chosenTheme !== undefined) {
		setTheme(chosenTheme);
	} else {
		setTheme(themes[0].title);
	}

	for (let i of switches) {
		i.addEventListener('click', function () {
			let theme = this.dataset.theme;
			setTheme(theme);
		});
	}
}