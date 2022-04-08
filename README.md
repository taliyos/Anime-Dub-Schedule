# Anime Dub Schedule

> A better name at some point?

Live at [talios.software](https://talios.software)

## Note

Despite the lack of updates on this repository, the next major update is underway! The next version will be hosted in a new repository since there is a major technology change. (React + Server) The primary reason for this is to move away from being in pure JS, which can cause some oddities in the code and bonuses as helping me get up to speed on React. This update will also include AniList integration and should be done soon. I'm currently finishing up classes, so I'll have a bunch of time to work on it soon. In the meantime, I'll still update this version with bugfixes.

If you're interested in this, you may be interested in another project I'm working on. More details on that once it's ready...

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
