---
layout: archive
title: ""
author_profile: true
sidebar:
---

<div class="home-hero">
  <p class="home-hero__tagline">Hi, I'm Gautham<span class="home-hero__accent">.</span></p>
  <div class="home-hero__badges">
    <span class="home-hero__badge">Stellar Astrophysicist</span>
    <span class="home-hero__badge">Armagh Observatory</span>
  </div>
  <p class="home-hero__intro">I study massive stars &mdash; from stellar evolution modelling that follows their life and death, to atmosphere modelling of the strong stellar winds and mass-loss physics that shape their fate.</p>
</div>

<h2 class="home-section-title">Recent Publications</h2>

{% assign first_author_pubs = site.publications | where: "category", "manuscripts" | sort: "date" | reverse | slice: 0, 4 %}
{% for pub in first_author_pubs %}
  <div class="list__item">
    <article class="archive__item">
      <h2 class="archive__item-title"><a href="{{ pub.url }}">{{ pub.title }}</a></h2>
      <p><strong>Authors:</strong> {{ pub.authors | join: ", " }}</p>
      <p class="archive__item-excerpt">{{ pub.content | strip_html | truncatewords: 30 }}</p>
    </article>
  </div>
{% endfor %}

<a class="home-more-link" href="/publications/">More publications &rarr;</a>
