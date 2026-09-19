---
layout: single
title: "Research Interests"
permalink: /research-interests/
author_profile: true
---

Massive stars &mdash; born with more than roughly 8 times the mass of the Sun &mdash; are rare, but disproportionately important. They dominate the ionising radiation and mechanical energy budgets of galaxies, drive the chemical enrichment of the interstellar medium, and end their lives as core-collapse supernovae or, for the most massive among them, collapse directly into black holes. The heaviest stellar-mass black holes, and the mergers that produce gravitational waves like GW190521, are thought to trace directly back to the evolution and death of massive and very massive stars.

Throughout their lives, massive stars continuously blow radiation-driven winds: photons scattering off spectral lines push material outwards, steadily removing the star's outer layers. For the most massive stars, wind mass loss can strip away a large fraction of a star's initial mass long before it reaches the end of its life. How much mass a star loses, and how fast, governs its internal structure and surface chemistry, and ultimately what it leaves behind: a neutron star, a stellar-mass black hole, or, in the most extreme cases, a pair-instability supernova that leaves no remnant at all. Mass-loss rates are one of the most important ingredients in stellar evolution models, and getting them right is why my research is focused on understanding and predicting them accurately.

I use the **MESA** stellar evolution code to study massive and very massive star evolution, building a [custom mass-loss implementation](/publication/2022-08-01-massloss-implementation-and) for stars in the local Universe, and extending it to [very massive stars at low metallicity](/publication/2023-09-01-very-massive-stars) to trace their evolution in the early Universe. I'm equally interested in the winds that drive this mass loss: I use the **PoWR** atmosphere code for hydrodynamical modelling of stellar winds, most recently deriving [new mass-loss predictions](https://arxiv.org/abs/2607.28012) for very massive stars, such as [the wind kink](/publication/2025-12-01-hydrodynamical-massloss-rates) where winds transition from optically thin to optically thick.

### Codes

- **MESA** (stellar evolution) &mdash; extensive experience with stellar-evolution calculations; developed and implemented a custom mass-loss framework tailored for very massive stars within the MESA codebase (Fortran). Implementation available at [github.com/Apophis-1/](https://github.com/Apophis-1/).
- **PoWR** (non-LTE stellar atmospheres) &mdash; hydrodynamical wind&ndash;atmosphere calculations yielding theoretical mass-loss prescriptions for massive stars.
