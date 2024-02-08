import { Injectable } from '@nestjs/common';

interface IndexAnimeType {
  id: number;
  siteUrl: string;
  title: {
    romaji: string;
    english: string;
    native: string;
  };
  coverImage: {
    medium: string;
    extraLarge: string;
    large: string;
  };
}

interface ShowAnimeType {
  id: number;
  startDate: {
    year: number;
    month: number;
    day: number;
  };
  endDate: {
    year: number;
    month: number;
    day: number;
  };
  title: {
    romaji: string;
    english: string;
    native: string;
  };
  status:
    | 'FINISHED'
    | 'RELEASING'
    | 'NOT_YET_RELEASED'
    | 'CANCELLED'
    | 'HIATUS';
  episodes: number;
  genres: string[];
  season: 'SPRING' | 'WINTER' | 'SUMMER' | 'FALL';
  coverImage: {
    extraLarge: string;
    large: string;
    medium: string;
    color: string;
  };
  bannerImage: string;
}

const showAnimeQuery = `
  query ($id: Int) {
    Media(id: $id){
      id
      startDate {
        year
        month
        day
      }
      endDate {
        year
        month
        day
      }
        title {
          romaji
          english
          native
        }
      status
      episodes
      genres
      season
      coverImage {
        extraLarge
        large
        medium
        color
      }
      bannerImage
      
    }
  }
`;

const indexAnimeQuery = `
{
  Page  {
    pageInfo {
      total
      perPage
      currentPage
      lastPage
      hasNextPage
    }
    media ( type: ANIME ) {
      id
      siteUrl
      title {
        romaji
        english
        native
      }
      coverImage {
        medium
        extraLarge
        large
        color
      }
    }
  } 
}
`;

@Injectable()
export class AnimeService {
  async show(id: string): Promise<ShowAnimeType> {
    const variables = {
      id
    };

    const url = 'https://graphql.anilist.co',
      options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          query: showAnimeQuery,
          variables: variables
        })
      };

    try {
      const res = await fetch(url, options);
      const animeList = await res.json();
      return animeList.data.Media;
    } catch (error) {}
  }
  async index(): Promise<IndexAnimeType[]> {
    const url = 'https://graphql.anilist.co',
      options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          query: indexAnimeQuery
        })
      };

    try {
      const res = await fetch(url, options);
      const animeList = await res.json();
      return animeList.data.Page.media;
    } catch (error) {}
  }
}
