<%*
let title = await tp.system.prompt("Post Title")
let description = await tp.system.prompt("Post Description")
let slug = title.split(" ").join("-").toLowerCase()
let tag = await tp.system.prompt("Add tag for a post", "You can add more later")
await tp.file.rename(slug)
-%>
---
title: <% title %>
description: <% description %>
pubDatetime: <%tp.date.now("YYYY-MM-DDTHH:mm:ssZ") %>
postSlug: <% slug %>
featured: false
draft: true
tags: [<% tag %>]
---
<% tp.web.random_picture("900x300", "tree,landscape,water,mountain") %>

<% description %>
## Table of contents