# Bumblebee

A JS-based framework for building a site, based on the [Zonelots framework](https://codeberg.org/01bbl/Zonelots) (itself based off [Zonelets](https://zonelets.net/), with added tagging functionality). This is primarily a personal project (it's what I use on my own site) and is thus fairly idiosyncratic, but I wanted to make it available in case anyone else might find it useful.

If you want to see how it looks straight out of the box, I have a demo page [here](https://bumblebee-framework.netlify.app/).

## differences

### from Zonelets (via Zonelots)

1. **Tags**: You can tag posts. There's a tag page where you can see all tags and the posts tagged with them. This is run through the JS script, so you only have to update them in one place.

2. **Header messages**: The script will show a random message from a list. This can be turned on and off.

3. **Post navigation**: Includes post titles in the page navigation links.

### from Zonelots

1. **Update**: The most important feature is that I've fixed the bit of the code that was broken, based on a solution worked out by [strflr](https://strflr.neocities.org/blog/posts/2024-03-24-Zonelots-Fix).

2. **Automation**: Basically, you only have to enter the Javascript to do the initial set-up or to backdate a post.

3. **Projects**: Based on the framework of tagging. I personally have a bunch of tags and having a separate system for projects (rather than just using tags) helps me keep things organized.

4. **Page Index**: I made an index for static pages that functions a lot like the posts index.

5. **Message Sources**: All my messages are quotes and I wanted a page that would automatically update with all the quotes in the array and their respective sources, so I built it.

5. **Post navigation**: I removed the nav links at the top of the page.

6. **Updated CSS**: I made everything more elaborate because I simply cannot help myself. Good news: changing colors should be a snap, because it's all set up with variables now.

7. **Random colors**: I have it set up so that the posts and pages in the respective lists are randomly colored, just because I think it looks nice. You can just turn it off if you don't like it.

## Instructions

### Set up

1. Edit ```{{AUTHOR}}``` to your name/pseudonym in the .html files.

2. Edit the information in section 1A of script.js (the blog name, whether you want header messages on, etc.).

3. Replace the favicon. If not using a file called favicon.svg, remember to change the file name in your .html pages.

3. Enter your timezone into the variable at the top of functions.py.

4. Delete the example posts and their data, as well as any unused themes. Add header messages to the messages array if you like.

### Adding a post/page/RSS feed entry

1. Run functions.py and select the function you want to perform.

2. In the terminal, input the requested information in the requested form (e.g. dates are yyyy-mm-dd).

3. If you've backdated a post, you'll have to move that entry in the post index array by hand or posts won't be in date order. Otherwise, you're done.