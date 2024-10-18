export interface Thumbnail {
  url: string;
  width: number;
  height: number;
}

export interface Thumbnails {
  [key: string]: Thumbnail;
}

export interface VideoSnippet {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: Thumbnails;
  channelTitle: string;
  liveBroadcastContent: string;
}

export interface VideoId {
  kind: string;
  videoId?: string;
  channelId?: string;
  playlistId?: string;
}

export interface YouTubeSearchResult {
  kind: string;
  etag: string;
  id: VideoId;
  snippet: VideoSnippet;
}

export interface YouTubeSearchResponse {
  items: YouTubeSearchResult[];
}

