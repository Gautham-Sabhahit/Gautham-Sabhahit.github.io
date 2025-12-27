---
layout: archive
title: ""
author_profile: true
sidebar:
---

<!-- Content of the page -->
<p style="font-size: 1.1em;">Hello and welcome to my personal webpage! I am a stellar astrophysicist with a broad interest in massive stars. I have experience in stellar evolution modelling following the life and death of massive stars, as well as atmosphere modelling studying their strong stellar wind structure and mass-loss physics.</p>

## Recent Publications

<ul>
  {% assign first_author_pubs = site.publications | where: "category", "manuscripts" | sort: "date" | reverse | slice: 0, 4 %}
  {% for pub in first_author_pubs %}
    <li style="margin-bottom: 1.5em;">
      <strong><a href="{{ pub.url }}">{{ pub.title }}</a></strong><br>
      <em>{{ pub.authors | join: ", " }}</em><br>
      <span>{{ pub.content | strip_html | truncatewords: 30 }}</span>
    </li>
  {% endfor %}
</ul>

<p><a href="/publications/">More publications →</a></p>
