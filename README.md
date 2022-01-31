# Anime Dub Schedule

> A better name at some point?

Live at [talios.software](https://talios.software)

## Overview

Brings a new way to check when your favorite anime dubs are about to be released! Pulls release date information from the community maintained [TeamUp](https://teamup.com/ksdhpfjcouprnauwda) and key art and integration from [AniList](www.anilist.co).

## History

This started as a small project around the start of the COVID-19 pandemic. I wanted a way to quickly check when shows were about to be released graphically. That version was fully personal-only. This version aims to bring server-side functionality, therefore allowing widespread use, and an in-depth integration with AniList (tracking shows, only show currently watching, etc.)

## Features
- Calendar Information from TeamUp
- AniList tracking
- Filtering of preferred shows
- Admin Dashboard for fixing mis-matched shows

## Setup and Use

If you want to get a head-start and check out this project for yourself (or want to contribute), you can setup the project locally.
This project uses NodeJS v16.9.1. 

To start, run npm start in the project directory.

API Keys for TeamUp and AniList must be specifed in teamup.json and anilist.json inside the settings directory.

```
{
	"APIKey": "keygoeshere"
}
```
## License

Anime Dub Schedule is licensed under GNUv3. See the [LICENSE](LICENSE) for additional info.
