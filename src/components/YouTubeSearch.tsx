import React, { useEffect, useState } from "react";
import axios from "axios";
import YouTube, { YouTubeProps, YouTubeEvent } from "react-youtube";
import { YouTubeSearchResponse, YouTubeSearchResult } from "./youtubeTypes";
import { YT } from "./enums";

const YouTubeSearch: React.FC = () => {
  const [videos, setVideos] = useState<YouTubeSearchResult[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string | undefined>();
  const [videoKey, setVideoKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [previousVideo, setPreviousVideo] = useState<string | undefined>();
  const API_KEY = process.env.REACT_APP_GOOGLE_YOUTUBE_API as string;

  useEffect(() => {
    const fetchVideos = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get<YouTubeSearchResponse>(
          "https://www.googleapis.com/youtube/v3/search",
          {
            params: {
              part: "snippet",
              channelId: "UCPXRHu3iYggeluGLgz4QTOQ",
              maxResults: 50,
              key: API_KEY,
            },
          }
        );

        setVideos(response.data.items);
      } catch (error) {
        console.error("Error fetching YouTube data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, [API_KEY]);

  useEffect(() => {
    if (videos.length > 0) {
      const randomVideo = videos[Math.floor(Math.random() * videos.length)];
      setSelectedVideo(randomVideo.id.videoId);
      console.log("Selected video ID:", randomVideo.id.videoId);
    }
  }, [videos]);

  const opts: YouTubeProps["opts"] = {
    width: "100%",
    height: "100%",
    playerVars: {
      autoplay: 1,
    },
  };

  const getRandomVideo = (
    videos: YouTubeSearchResult[]
  ): YouTubeSearchResult | undefined => {
    if (videos.length === 0) return undefined;
    if (videos.length === 1) return videos[0];

    let filteredVideos = videos;
    if (previousVideo) {
      filteredVideos = videos.filter(
        (video) => video.id.videoId !== previousVideo
      );
    }

    const randomIndex = Math.floor(Math.random() * filteredVideos.length);
    return filteredVideos[randomIndex];
  };

  const playRandomVideo = () => {
    let attempts = 0;
    const maxAttempts = videos.length;
    let randomVideo: YouTubeSearchResult | undefined;

    do {
      randomVideo = getRandomVideo(videos);
      attempts++;
    } while (
      randomVideo &&
      randomVideo.id.videoId === previousVideo &&
      attempts < maxAttempts
    );

    if (randomVideo && randomVideo.id.videoId) {
      setSelectedVideo(randomVideo.id.videoId);
      setPreviousVideo(randomVideo.id.videoId);
      setVideoKey((prevKey) => prevKey + 1);
      console.log("Random new video", randomVideo.id.videoId);
    } else {
      console.log("Could not find a different video");
    }
  };

  const onPlayerStateChange = (event: YouTubeEvent<number>) => {
    //ref: https://developers.google.com/youtube/iframe_api_reference#onStateChange
    if (event.data === YT.PlayerState.ENDED) {
      console.log("Video ended");
      setPreviousVideo(selectedVideo);
      playRandomVideo();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-lg p-6 w-full max-w-2xl flex flex-col h-[600px]">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Daily Dose of Motivation
        </h2>

        <div className="flex-grow flex flex-col justify-center items-center">
          {isLoading ? (
            <div className="text-center text-gray-600">Loading videos...</div>
          ) : videos.length === 0 ? (
            <div className="text-center text-gray-600">No videos available</div>
          ) : selectedVideo ? (
            <div className="w-full h-[400px] mb-4">
              <YouTube
                videoId={selectedVideo}
                opts={opts}
                onStateChange={onPlayerStateChange}
                key={videoKey}
                className="rounded-md shadow-md w-full h-full"
              />
            </div>
          ) : (
            <div className="text-center text-gray-600">No video selected</div>
          )}
        </div>

        <div className="mt-auto">
          <button
            onClick={playRandomVideo}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
            disabled={isLoading || videos.length === 0}
          >
            {isLoading ? "Wait for it to load!" : "Random Video"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default YouTubeSearch;
