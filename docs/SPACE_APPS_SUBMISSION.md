# CropCompass: NASA Space Apps Submission

Prepared: 13 November 2026. Status: draft for team review, not a submitted entry.
Source base: latest fetched `origin/dev`, commit `270a930`. Working branch:
`docs/space-apps-submission`.

## Submission Notes

The text in sections 1-7 is intended for the project submission form. Section 8
contains declarations for the team to review and confirm; this document does not
accept legal terms on anyone's behalf. Replace the explicitly pending demo and
challenge links before submission.

Working challenge: **Field Shift: Adapting Farms with NASA Data**, NASA Space Apps
2026, as identified in the repository. **Official challenge page URL: pending.**
The supplied `crop-compass-three.vercel.app` URL is the project, not the challenge
statement. Confirm the official challenge title and link in the submission portal.

The team confirmed that CropCompass was built for this challenge and that GitHub
Copilot was the only AI development tool used. This is not a claim that all work
occurred during the official event window. The published 2026 participant terms
state an event start of 14 November 2026, subject to an expressly approved local
variation. This repository contains development before that date. Confirm the
applicable preparation/pre-existing-work rules with the organizers and disclose
that history accurately before making an eligibility declaration.

**Eligibility warning:** the [official participant FAQ](https://www.spaceappschallenge.org/resources/participant-faqs/)
explicitly says teams are not allowed to begin working on challenges before the
hackathon. Earlier work in this repository appears to conflict with that rule.
Obtain organizer clarification before submitting this existing implementation for
judging; do not claim that it was produced entirely within the event. The project
can still be described accurately, but this document cannot establish eligibility.
The FAQ also says to use the current Project Submission Guide when it is published;
the 30-second/seven-slide limit here follows the requirements supplied by the team.

## 1. Project Title

**CropCompass**

Supporting line: **Earth data for the next crop decision.**

## 2. High-Level Project Summary

Choosing a crop means balancing uncertain rainfall, limited water, soil health,
income, and the effects of what grew before. These decisions are difficult when
weather, soil, and satellite information are scattered across technical datasets.

CropCompass is a web-based crop-rotation decision-support prototype that brings
these inputs together. It combines NASA POWER weather, MODIS vegetation history,
SoilGrids estimates, and farmer-entered crop records to explore what to plant next
and possible two-year rotations. Farmers can correct soil assumptions, test water
availability, and choose how strongly to prioritize income, water savings, soil
health, and risk.

A transparent simulation engine evaluates options across historical weather
windows and displays yield ranges, indicative economics, irrigation demand, and
failure counts. Field previews, saved plans, guided tours, and the Sprout assistant
make those comparisons easier to explore. Data-source and confidence labels keep
assumptions visible.

CropCompass addresses the challenge by translating Earth data into understandable,
farm-contextual crop-planning choices. Its intended value is better-informed
discussion between farmers and advisers, especially where water is constrained.
It is not a weather forecast or guaranteed prescription, and the agronomic and
economic assumptions still require local field validation. Crop recommendations
currently use an India-specific crop pack.

## 3. Link to Final Project

- **Live application:** https://crop-compass-three.vercel.app/
- **Public source repository:** https://github.com/Praannjaal/CropCompass
- **Setup and technical documentation:** https://github.com/Praannjaal/CropCompass#readme

The application login page and public GitHub repository were reachable without
credentials when preparing this draft. Authenticated farm records remain private.
Judge-facing instructions: open the app and use **Continue as guest** if the
deployed configuration enables it, or create a separate account. Check this flow
in a signed-out browser before submission; the public project link is not proof
that every authenticated feature or external service is currently available.

Publish the submission materials from this documentation branch to a public
branch or release before sharing links to them. Do not submit localhost links,
private account sessions, passwords, or expiring preview URLs.

## 4. Project Demo

**Chosen format: seven slides**, within the maximum supplied in the submission
requirements. The completed 16:9 presentation is available in two formats:

- **[Seven-page PDF](SPACE_APPS_DEMO.pdf):** ready to upload to a public presentation
  or file-sharing service; verified to contain exactly seven pages.
- **[Interactive HTML deck](SPACE_APPS_DEMO.html):** open directly in a browser.
  Use Previous/Next or the arrow keys; Home/End jump to the first/last slide.
  Present enters fullscreen, and Print / PDF exports all seven slides.

Keep the `submission-assets` folder beside the HTML when moving or publishing it.
The PDF is self-contained. When re-exporting from the browser, enable background
graphics and disable browser headers/footers. The supplied PDF was exported with
the deck's custom 16:9 page size and checked for the seven-page limit.

**Public demo link: PENDING.** Upload or publish the final seven-slide deck, enable
viewing without a sign-in/access request, and paste that URL into the demo field.
The live application URL belongs in section 3; it is not a substitute for the
required slides or a maximum-30-second video.

### Seven-Slide Narrative

1. **CropCompass:** the farmer's next-crop question and the working product.
2. **The decision:** explain water, income, soil, and previous-crop trade-offs.
3. **Earth data into field context:** NASA POWER, MODIS NDVI, SoilGrids, and the journal.
4. **Try a crop:** show the field preview and distinguish modeled depth from measurement.
5. **Compare, then plan:** show historical outcomes, priorities, rotations, and saved choices.
6. **Trust and access:** provenance, limitations, multilingual UI, guest access, tours, and Sprout.
7. **Potential impact and next steps:** intended users, validation needs, project link, data/AI credits.

### Screenshot Provenance

The deck uses actual local application captures made on 13 November 2026, not
mocked interface images or captures of private production accounts. A disposable
guest farm at approximately 17 N, 78.125 E in Telangana supplied an illustrative
scenario: full irrigation, a green gram crop sown on 20 June 2026 and harvested on
25 August 2026, and a brinjal preview/recommendation. These records are demonstration
inputs, not farmer observations. Water, roots, yields, prices, and historical
failure counts shown in the screenshots are model outputs or assumptions, not
validated field outcomes or guarantees. The captures do not establish that every
authenticated feature is available on the public deployment.

The Sprout image is the project's existing artwork. No third-party stock imagery
or NASA logo was added. Keep the scenario captions and source/AI credits when
presenting or re-exporting; do not present the illustrated rankings as current
live results.

## 5. Detailed Project Description

### The Problem

Farmers make crop choices under interacting constraints. A crop that looks
profitable under full irrigation may be unsuitable under rain-fed conditions.
Previous crops affect water carry-over and succession constraints. Soil maps may
not match a farmer's field, and a high relative score can hide poor absolute
outcomes. Earth-observation and weather datasets are valuable, but their formats,
spatial scales, and uncertainty make them difficult to translate into a practical
comparison at decision time.

### What CropCompass Does

CropCompass lets a user locate a farm using coordinates, a map pin, or a drawn
boundary; record crops and management history; review climate and satellite
information; and compare crop-planning scenarios. The interface includes:

- Separate weather, soil, and satellite readiness indicators.
- Climate summaries covering rainfall, dry spells, heat, and seasonal patterns.
- A MODIS NDVI history with suggested growing-season dates for farmer confirmation.
- Editable soil inputs, including texture, organic carbon, pH, and root-accessible depth.
- A crop journal that informs the subsequent crop and rotation analyses.
- Field view with searchable crop previews and explicit analysis-source labels.
- Next-crop and two-year rotation exploration, priority weights, sensitivity tests,
  saved plans, and comparisons of modeled outcomes.
- English, Hindi, and Telugu interfaces, theme-aware guided tours, and private
  guest sessions that can be converted into accounts while retaining their records.
- Sprout, an optional conversational explanation layer with consent and usage limits.

### How It Works

1. **Locate and contextualize.** The farm location selects a coarse weather grid
   cell and finer soil/vegetation estimates. A drawn boundary is stored for location
   and area context; it does not increase weather resolution or produce field-wide
   satellite zonal statistics.
2. **Retrieve and check data.** NASA POWER is downloaded in annual windows and
   checked for coverage, units, physical plausibility, and consistency with POWER
   monthly data. Accepted annual checkpoints are retained so interrupted work can
   resume. A monthly check from the same provider is not independent validation.
3. **Incorporate farmer knowledge.** Known soil values override corresponding
   defaults or mapped estimates. The journal supplies previous crops and dates.
   Satellite greenness suggests timing but never identifies a crop automatically.
4. **Replay and simulate.** A deterministic Python engine estimates water and crop
   responses across historical weather windows, applying crop-calendar and
   succession rules. Next-crop analysis starts from a modeled recent soil-water
   state; seasonal crop fit is a separate analysis, identified in the interface.
5. **Compare outcomes.** The engine reports distributions and historical failure
   counts, indicative economics, irrigation needs, and soil-health indicators.
   User-selected weights rank the available alternatives; the ranking is not a
   calibrated probability of success.
6. **Explain and retain context.** The app displays source dates, assumptions,
   confidence labels, and saved-plan provenance. Sprout explains bounded evidence
   supplied by the app rather than generating the numerical recommendations itself.

### Scientific and Technical Approach

The water model uses FAO-56-style reference evapotranspiration and daily soil-water
accounting, including crop coefficients, root-zone storage, evaporation, drainage,
and irrigation scenarios. Weather support determines whether Penman-Monteith or a
Hargreaves fallback is used. Soil hydraulic estimates use Saxton-Rawls-style
pedotransfer functions derived from texture and organic matter.

Yield response is based on FAO-33-style water-stress relationships, with flowering
stress, heat, and succession adjustments. Historical weather trials produce yield
quantiles and failure frequencies. In this implementation, crop failure means
simulated yield below half the attainable yield, not observed farm bankruptcy or
a directly measured probability of future crop loss.

Income combines simulated yield with static, indicative crop prices and costs.
Soil-carbon comparisons use a RothC-style model and simplified residue and nitrogen
accounting. Crop-family and shared-host rules express modeled carry-over concerns,
not diagnoses of pests or diseases in a particular field. Stress tests perturb
weather assumptions; they are not downscaled future climate forecasts.

If recent weather cannot be verified, eligible planning can use an explicitly
labeled historical-reference scenario based on at least 30 consecutive checked
complete years. Substituted recent days initialize the scenario but are excluded
from historical trial outcomes. The system retains a low-confidence warning and
does not silently reclassify the substitute as observed weather.

### Technology

The frontend uses React, TypeScript, Vite, Tailwind CSS, CSS Modules, React Router,
TanStack Query, i18next, Leaflet, ECharts, and Lucide icons. The guided-tour engine
uses React Context/hooks, DOM portals, stable target anchors, and browser-local
per-user/version cookies; it does not require a model call.

The backend uses Python, FastAPI, Pydantic, SQLAlchemy, Alembic, and psycopg, with
NumPy, pandas, PyYAML, and zstandard supporting computation and data handling.
Neon PostgreSQL stores shared application data; SQLite supports isolated local
development and tests. Vercel hosts the frontend and Render hosts the API. Sprout
uses the OpenAI-compatible SDK with the configured Groq-hosted model. Mailjet/SMTP
supports password-reset delivery when configured.

### Beneficiaries and Potential Impact

The initial intended beneficiaries are farmers and agricultural advisers working
within the supported India crop pack, with particular relevance to water-limited
planning. Educators and challenge participants can also use the app to explore
how soil, crop history, water availability, and preferences affect a decision.

The intended impact is more transparent comparison and better-informed planning,
not a measured claim of improved yield, higher profit, reduced irrigation, or
carbon sequestration. Future evaluation should compare predictions against local
field observations and agronomist baselines, test usability with farmers, and
measure whether users understand uncertainty. Expanding region packs and checking
local costs, calendars, soils, and crop parameters are prerequisites for broader use.

### Limitations to State Clearly

- Crop recommendations are currently India-pack-specific, not globally validated.
- NASA weather represents a coarse grid cell, not a sensor in the drawn field.
- SoilGrids values are predictions. The default 1 m modeling depth is an assumption,
  not measured soil thickness or detected bedrock; user-entered depth is identified separately.
- The MODIS integration uses NDVI, not EVI or a downloaded quality-assurance band.
  A single 250 m pixel and heuristic smoothing cannot establish crop identity.
- Historical simulations and sensitivity scenarios are not forecasts or guarantees.
- Prices, costs, succession effects, and carbon outcomes need independent local validation.
- Sprout can make errors, may be unavailable, and does not replace professional advice.
- Guest retention enforcement and the cleanup command are implemented; deployed
  scheduling, proxy configuration, provider availability, and operational monitoring
  must be verified for the submission deployment.

## 6. NASA Data, References, and Attribution

### NASA Data Actually Used

| Dataset or service | Role in CropCompass | Reference |
| --- | --- | --- |
| NASA POWER daily point API, agricultural community | Historical meteorology and retained modeled soil-wetness variables; weather-based climate and crop simulations. | https://power.larc.nasa.gov/ ; https://power.larc.nasa.gov/docs/services/api/temporal/daily/ |
| NASA POWER monthly API | Same-provider rainfall/evaporation consistency checks for annual daily ingestion. | https://power.larc.nasa.gov/docs/services/api/temporal/monthly/ |
| MODIS Terra vegetation indices, MOD13Q1 Collection 6.1 | 250 m, 16-day NDVI histories and approximate growing-season timing. | https://doi.org/10.5067/MODIS/MOD13Q1.061 |
| NASA ORNL DAAC MODIS/VIIRS Land Products Subsets REST service | Access to available dates and farm-coordinate NDVI pixel subsets. | https://modis.ornl.gov/data/modis_webservice.html ; https://doi.org/10.3334/ORNLDAAC/1600 |

Suggested acknowledgement: "This project uses meteorological data from the NASA
POWER Project and MODIS Terra MOD13Q1 NDVI accessed through NASA's ORNL DAAC subset
service. Data were used for historical scenario analysis, not as a live forecast."

Provider citation details:

- NASA POWER requests acknowledgement of NASA Langley Research Center's Prediction
  Of Worldwide Energy Resources project, funded through the NASA Earth Science
  Division. Include the temporal service, API version from its response metadata,
  and actual access date. Do not copy the provider's hourly-service example for
  this daily/monthly application. Guidance: https://power.larc.nasa.gov/docs/referencing/ .
- Didan, K. (2021). *MOD13Q1 MODIS/Terra Vegetation Indices 16-Day L3 Global 250m
  SIN Grid V061*. NASA EOSDIS Land Processes DAAC.
  https://doi.org/10.5067/MODIS/MOD13Q1.061 . ORNL's citation page lists this
  version; retain the served product metadata with the final demo evidence.
- ORNL DAAC (2018). *Terrestrial Ecology Subsetting & Visualization Services
  (TESViS) RESTful Web Service*. ORNL DAAC, Oak Ridge, Tennessee, USA.
  https://doi.org/10.3334/ORNLDAAC/1600 . Cite the REST service used by the code,
  as well as the product. The separate interactive Global Subsets Tool has a
  different DOI and should not be substituted without explanation.

POWER is a derived data service combining source products; do not describe every
variable as a direct satellite measurement. Relative wetness indices are not
measured millimetres of plant-available water. Coverage differs by variable and
data availability. Record the actual retrieval dates and product identifiers for
the final demo, and use the providers' requested citation wording.

### Other Data, Services, and Methods

| Resource | Use and attribution requirement |
| --- | --- |
| ISRIC SoilGrids | Soil-property predictions at six depth intervals. Cite the SoilGrids dataset/method paper and applicable data license: https://soilgrids.org/ ; https://doi.org/10.5194/soil-7-217-2021 . |
| OpenStreetMap contributors | Map data/basemap. Retain visible contributor attribution; review ODbL data terms and the tile service's separate usage policy: https://www.openstreetmap.org/copyright . |
| Nominatim | Place search. Attribute OpenStreetMap and follow the public service usage policy: https://operations.osmfoundation.org/policies/nominatim/ . |
| FAO Irrigation and Drainage Paper 56 | Reference evapotranspiration and crop-water modeling basis: https://www.fao.org/4/x0490e/x0490e00.htm . |
| FAO Irrigation and Drainage Paper 33 | Yield-response-to-water framework. Cite the publication by Doorenbos and Kassam (1979); identify implementation adaptations rather than claiming a complete FAO model. |
| Saxton and Rawls (2006) | Pedotransfer relationships for soil water retention: https://doi.org/10.2136/sssaj2005.0117 . |
| RothC | Conceptual basis for indicative soil-carbon comparisons. Cite the model documentation and describe the app as RothC-style, with its own assumptions/adaptations. |
| Crop parameters and economics | Versioned species/India pack in the repository. Preserve its per-parameter references, confidence notes, and indicative/static price labels; do not imply a live market feed. |
| Groq and the configured model | Optional runtime AI explanations. Cite the provider/model and disclose that availability and service terms apply. |
| Vercel, Render, Neon, and Mailjet | Hosting, database, and optional email infrastructure, respectively. These are service dependencies, not NASA data or project sponsors. |

No other space-agency dataset has been verified as part of the current ingestion
path. Do not list SMAP, GPM, HLS, Sentinel, or other products as implemented merely
because they were considered or appear in the challenge resources.

### Open-Source Software and Visuals

Direct software acknowledgements should include React/React DOM, TypeScript, Vite,
Tailwind CSS, React Router, TanStack Query, i18next/react-i18next, Leaflet, ECharts,
Lucide, eventsource-parser, Python, FastAPI, Uvicorn, Pydantic/pydantic-settings,
SQLAlchemy, Alembic, psycopg, argon2-cffi, HTTPX, the OpenAI Python SDK, NumPy,
pandas, PyYAML, zstandard, pytest, and Ruff. Publish the exact release dependency
manifests and preserve their license notices. A public repository by itself is
not a license grant for the project's original work.

The following inventory was checked against installed package metadata on
13 November 2026. It identifies direct dependencies, not a complete transitive
license audit, and does not prove the hosted service uses these exact versions.
Reconcile it with the final release lockfile/environment before submission.

| Software | Checked version | Declared license / reference |
| --- | --- | --- |
| React / React DOM | 19.3.1 / 19.3.1 | MIT; https://react.dev/ |
| TypeScript | 7.0.2 | Apache-2.0; https://www.typescriptlang.org/ |
| Vite / React plugin | 8.3.4 / 6.1.2 | MIT; https://vite.dev/ |
| Tailwind CSS / Vite plugin | 4.3.3 / 4.3.3 | MIT; https://tailwindcss.com/ |
| React Router | 8.4.0 | MIT; https://reactrouter.com/ |
| TanStack React Query | 5.104.3 | MIT; https://tanstack.com/query |
| i18next / react-i18next | 26.4.6 / 17.0.17 | MIT; https://www.i18next.com/ |
| Leaflet | 1.9.4 | BSD-2-Clause; https://leafletjs.com/ |
| Apache ECharts | 6.1.0 | Apache-2.0; https://echarts.apache.org/ |
| Lucide React | 1.61.0 | ISC; https://lucide.dev/ |
| eventsource-parser | 4.1.3 | MIT; https://github.com/rexxars/eventsource-parser |
| Type definitions: React / React DOM / Leaflet | 19.3.0 / 19.3.0 / 1.9.22 | MIT; https://github.com/DefinitelyTyped/DefinitelyTyped |
| Python | Runtime must be 3.12+ | PSF license; https://docs.python.org/3/license.html |
| FastAPI | 0.143.2 | MIT; https://fastapi.tiangolo.com/ |
| Uvicorn | 0.54.0 | BSD-3-Clause; https://www.uvicorn.org/ |
| Pydantic / pydantic-settings | 2.14.1 / 2.16.0 | MIT; https://docs.pydantic.dev/ |
| email-validator | 2.3.0 | Unlicense; https://github.com/JoshData/python-email-validator |
| SQLAlchemy / Alembic | 2.1.4 / 1.20.0 | MIT; https://www.sqlalchemy.org/ ; https://alembic.sqlalchemy.org/ |
| psycopg / psycopg-binary | 3.3.6 / 3.3.6 | LGPL-3.0-only; https://www.psycopg.org/ . Review distribution obligations and bundled notices. |
| argon2-cffi | 25.1.0 | MIT; https://argon2-cffi.readthedocs.io/ |
| HTTPX | 0.28.1 | BSD-3-Clause; https://www.python-httpx.org/ |
| OpenAI Python SDK | 2.54.0 | Apache-2.0; https://github.com/openai/openai-python |
| NumPy | 2.5.4 | Metadata: BSD-3-Clause AND 0BSD AND MIT AND Zlib AND CC0-1.0; https://numpy.org/ . Retain bundled-component notices. |
| pandas | 3.0.6 | BSD-3-Clause; https://pandas.pydata.org/ |
| PyYAML | 6.0.3 | MIT; https://pyyaml.org/ |
| zstandard | 0.25.0 | BSD-3-Clause; https://github.com/indygreg/python-zstandard |
| pytest / Ruff | 9.1.1 / 0.17.1 | MIT; https://pytest.org/ ; https://docs.astral.sh/ruff/ |

Data are not software: check their own terms separately. OpenStreetMap data uses
ODbL 1.0 and requires contributor attribution; public tile access also has a usage
policy at https://operations.osmfoundation.org/policies/tiles/ . SoilGrids license
and redistribution details should be checked against the specific released data
distribution; the verified FAQ identifies the product and citation but is not, by
itself, a complete license grant. Do not infer unrestricted reuse from free access.

Visuals in the demo should be the team's own app screenshots and the repository's
Sprout artwork, with attribution for visible maps and icons retained. No stock
photography or NASA insignia is required. Confirm the provenance and reuse rights
of every image, font, logo, music track, recording, and generated asset that is
actually included in the final demo. Do not imply NASA endorsement.

The repository's Sprout image is generated by
[frontend/scripts/draw-sprout.ps1](../frontend/scripts/draw-sprout.ps1), using
System.Drawing. Attribute it as project-created artwork, with the team's disclosed
Copilot assistance to code, not as a NASA-provided image. This deck uses the app's
own screenshots rather than external stock photography.

**License audit pending:** verify and record licenses for the exact bundled
versions, the project itself, data sources, model weights/service access, and all
demo assets. Section 8 identifies the declarations that depend on this audit.

## 7. AI Tools Disclosure

### Development

We used **GitHub Copilot** as an AI-assisted development tool for implementation,
code suggestions, debugging, test preparation, and drafting project documentation
and presentation materials. The team remains responsible for reviewing the code,
scientific assumptions, test evidence, citations, and final submission content.
The team confirmed no additional AI development tools for this draft; update this
disclosure if other tools were used by any team member or for the final demo.

### AI in the Application

CropCompass also contains **Sprout**, an optional runtime assistant that uses a
Groq-hosted language model through an OpenAI-compatible API. The source default is
`openai/gpt-oss-120b`; confirm any deployed override before submission. Model and
service references: https://groq.com/ ; https://huggingface.co/openai/gpt-oss-120b .
Model weights and hosted access have distinct terms; do not equate a hosted service
with an open-source library. The OpenAI SDK
does not, by itself, mean requests are sent to OpenAI's hosted service.

Sprout explains bounded application evidence and selected scenarios. The Python
crop simulation and ranking engine produces the numerical crop results; it is
not a trained machine-learning crop predictor, and the LLM does not generate
the authoritative yield, water, or ranking calculations. Users review a consent
notice before sending messages. AI output can be incorrect and needs human review.

## 8. Terms, Conditions, and Team Declarations

Official terms reviewed: https://www.spaceappschallenge.org/legal/
(2026 participant terms, updated 7 August 2026; accessed 13 November 2026).

**Do not mark these complete until the submitting team has verified them.**

- [ ] We confirm the official challenge/year and the applicable local event,
  submission deadline, and permitted preparation/pre-existing-work rules.
- [ ] We accurately distinguish work created for this challenge from any earlier
  work. "Built for this challenge" does not assert that all commits fall within
  the official hackathon period.
- [ ] We have the rights and permissions to publish the submitted code, data,
  screenshots, artwork, recordings, and other materials.
- [ ] We have identified the licenses for all third-party materials, retained
  required notices, and cited every source, including freely available resources.
- [ ] We have selected and included an appropriate open-source license for our
  original work, or understand the terms' stated default distribution provision.
  The published terms state NASA may distribute original content under Apache 2.0
  when no specific OSI-compliant license is specified; do not treat that as an
  existing repository license or as resolving third-party license obligations.
- [ ] We have reviewed the compatibility of external data licenses and hosted AI/
  service dependencies with the submission terms, including any organizer guidance
  needed for resources that are not OSI-licensed software.
- [ ] We have disclosed AI tools and separated development assistance from runtime AI.
- [ ] We have removed secrets, confidential information, and inappropriate personal
  data from the repository, demo, and public submission.
- [ ] We have obtained required consent for any identifiable adults featured in
  submitted media and followed the terms' restrictions concerning minors.
- [ ] We have reviewed the publication, licensing, media/publicity, and other
  permissions in the official terms and are authorized to accept them.
- [ ] We have checked applicable export-control and third-party-material requirements.
- [ ] We do not imply NASA endorsement, and our scientific/impact claims are
  supported or clearly identified as intended benefits and unvalidated assumptions.
- [ ] The final project and demo links work for a signed-out reviewer, and the demo
  has no more than seven slides or, if replaced by video, lasts no more than 30 seconds.

### Final Handoff Checklist

Before submitting: confirm the challenge URL and event eligibility; review the
summary/description against the actual deployed release; finish the license and
asset attribution inventory; publish the seven-slide demo; paste its public URL;
test guest/signup access and external-service availability; then have the team
complete the required declarations in the official submission form.