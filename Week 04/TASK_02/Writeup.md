# ShopDark - Portfolio Write-up

## Project Overview

ShopDark is a multi-page e-commerce website I built from scratch using HTML, CSS, and vanilla JavaScript. The idea was to put together everything from the past few weeks into one complete project, a site where you can actually browse products, add things to a cart, and go through a checkout flow. No frameworks, no backend, just the basics done properly.

## Features

The home page has a search bar, category shortcuts, and a featured products section. The shop page shows the full catalog with live search, a category filter, and sorting by price, rating, or name. Each product has its own detail page with a description, rating, quantity picker, and related products at the bottom. The cart lets you add and remove items, change quantities, and see a running total with shipping calculated automatically (free over $50). The checkout page validates every field before it goes through, then shows a success screen when done.

## Tech Stack

| Layer | What I Used | Why |
|---|---|---|
| Markup | HTML5 | straightforward, no build tools needed |
| Styling | Plain CSS with variables | gave me full control without learning a framework |
| Logic | Vanilla JavaScript (ES6+) | kept things simple and easy to follow |
| Cart State | localStorage | cart data survives page navigation without a server |
| Fonts | Google Fonts (Inter) | clean and easy to read |
| Hosting | GitHub Pages | free and works perfectly for static sites |

## Challenges and How I Solved Them

**Keeping cart data across pages**

Since there's no server, I stored the cart as a JSON array in localStorage. Every page reads from and writes to the same key, so the cart stays in sync no matter which page you're on.

**Search, filter, and sort all running at the same time**

I ran into a bug early on where the search and filter were stepping on each other. The fix was putting everything through one function, getFiltered(), that reads all three values at once and re-renders the grid. Once I did that everything stayed consistent.

**One HTML file for all product pages**

Instead of making a separate HTML file for every product (which would be 12 files and a nightmare to maintain), I used one product-detail.html that reads the id from the URL and renders the right product dynamically.

**Form validation without a library**

I wrote the checkout validation by hand. Each field has a check inside the submit handler and errors show up inline next to the field that's wrong. When everything passes, the cart clears and a success screen replaces the form without reloading the page.

## Reflection

When I started this module, HTML felt like just putting text and boxes on a screen. I had no idea how much was involved in making something actually work.

The first week was mostly figuring out how the browser thinks, why elements sit where they do, how the box model works, why my divs kept collapsing. It was frustrating but it built a foundation I actually understood instead of just copying.

Week two with Bootstrap was eye-opening. I had been spending so much time writing repetitive CSS, buttons, grids, spacing, and Bootstrap showed me that a lot of that work has already been done. Using a design system made me faster and the results looked more consistent.

Week three is where things really started to click. JavaScript turned the page from a static document into something you could actually interact with. The first time I got a button click to update the DOM, I understood why people enjoy web development. It stopped feeling like writing code and started feeling like building something.

ShopDark pulled all of that together. The hardest part was not any single feature, it was making sure everything worked together. The cart updating across pages, the form catching every edge case, the search not breaking when you combine it with a filter. Getting those details right took longer than the obvious stuff but it's what makes the site feel finished.

I still have a long way to go but I can now build something from scratch and put it live. That's a real skill and I didn't have it four weeks ago.

## What I Want to Learn Next

1. **Learning React** - manually updating the DOM with JavaScript can get messy as a project grows. I want to learn React so I can build bigger apps more cleanly without managing every re-render by hand.

2. **Back-end Basics** - right now the cart only lives in the browser. I want to learn Node.js so I can build a proper backend, save user accounts, and store order history in a real database.


**Live URL:** [https://shamirali55.github.io/qwetrum-web-dev/](https://shamirali55.github.io/qwetrum-web-dev/)