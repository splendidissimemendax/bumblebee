# Bumblebee

A JS-based framework for building a site, strongly inspired by the [Zonelots framework](https://codeberg.org/01bbl/Zonelots) (itself based off [Zonelets](https://zonelets.net/), with added tagging functionality). This is primarily a personal project (it's what I use on my own site) and is thus fairly idiosyncratic, but I wanted to make it available in case anyone else might find it useful.

If you want to see how it looks straight out of the box, I have a demo page [here](https://bumblebee-framework.netlify.app/).

## premise

I really like Zonelots conceptually, but as I kept using it, I found myself adding things on top piecemeal until it looked a lot like that one [XKCD](https://xkcd.com/2347/), which is to say "messy and a little fragile". Also, it was getting slow—not terribly, but noticeably. 

What I really needed to do was start from scratch, so I did. It's still basically "Zonelots as Bee would do it", but it's hopefully less precarious and somewhat faster.

The big changes are the additional languages. The Python script removes the need to make manual edits to the JavaScript after the initial setup. Basically, as long as you're happy with the way the site's working (and you don't make any typos), you could never look at the JavaScript script again: just run the Python script from terminal or your IDE, follow the prompts, and upload the whole thing to whatever hosting service you're using. Markdown is very optional, but it removes the need to write posts in HTML and generally makes life a little easier. 

The other big change is speed-related. Basically, I've set things up so that if an element doesn't appear on a page, the bits of script associated with building the element won't run. Hopefully this saves a bit of loading time, especially once you've got more posts to process.

Other, more minor changes include:

- building the header from the pages array

- (optional) theme switcher

- (optional) post navigation within projects

- (optional) post sorting by date, which removes the need to move backdated posts in the posts array

- (optional) RSS feed and associated automation

## Instructions

### Set up

1. Find and replace the following template phrases across all files:

	1. `{{NAME}}` to your name/pseudonym (all HTML files, script.js).

	2. `{{BLOG NAME}}` to your blog's name (script.js, rss.xml).

	3. `{{URL}}` to your blog's URL (rss.xml, functions.py).

	4. `{{YEAR}}` to the current year (script.js) (or you could change the footer message entirely—up to you).

	5. `{{EMAIL}}` to your email (if you'd like to show that in the footer—again, you can just change this entirely).

2. Edit the information in section 1A of script.js (the blog name, whether you want the theme switcher, etc.).

3. Replace the favicon. If not using a file called favicon.svg, remember to change the file name in your .html pages.

3. Enter your timezone into the variable at the top of functions.py.

4. Delete the example posts, as well as any pages you don't mean to use, and all the data associated with either in script.js. 

5. Check that the header/homepage status of the pages you're keeping is how you'd like it (default shows the test page in the header and the tags page on the home page).

6. Edit footer links to your preference.

7. Either add additional themes or turn off the theme switcher (current themes are "minimal", which is basically just enough styling to make the site look nice; "old school", which is based on a monochrome CRT monitor; and "base", which is no styling at all except for the theme switcher itself).

### Adding a post/page/RSS feed entry

1. Run functions.py and select the function you want to perform.

2. In the terminal, input the requested information in the requested form (e.g. dates are yyyy-mm-dd).

3. If you've backdated a post and you've set `sortPosts` to `false`, you'll have to move that entry in the post index by hand or posts won't be in date order. The same is true for any typos you want to fix or any posts you want to delete. Otherwise, you're done!