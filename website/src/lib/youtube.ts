// YouTube Data API v3 integration
// Fetches videos from UKPSC Decoded channel and categorizes them

const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || '';

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  duration?: string;
  category: string;
}

// Get channel ID from handle @ukpscdecoded
export async function getChannelId(): Promise<string> {
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=ukpscdecoded&type=channel&key=${YOUTUBE_API_KEY}`
  );
  const data = await res.json();
  return data.items?.[0]?.snippet?.channelId || '';
}

// Fetch all videos from the channel
export async function fetchChannelVideos(): Promise<YouTubeVideo[]> {
  if (!YOUTUBE_API_KEY) return [];

  try {
    // First get channel uploads playlist
    const channelRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forHandle=@ukpscdecoded&key=${YOUTUBE_API_KEY}`,
      { next: { revalidate: 3600 } }
    );
    const channelData = await channelRes.json();
    const uploadsPlaylistId =
      channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

    if (!uploadsPlaylistId) return [];

    // Fetch videos from uploads playlist
    const videosRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${uploadsPlaylistId}&key=${YOUTUBE_API_KEY}`,
      { next: { revalidate: 3600 } }
    );
    const videosData = await videosRes.json();

    const videos: YouTubeVideo[] = (videosData.items || []).map((item: any) => {
      const title = item.snippet.title;
      const category = categorizeVideo(title);
      return {
        id: item.snippet.resourceId.videoId,
        title: title,
        description: item.snippet.description?.substring(0, 150) || '',
        thumbnail:
          item.snippet.thumbnails?.high?.url ||
          item.snippet.thumbnails?.medium?.url ||
          '',
        publishedAt: item.snippet.publishedAt,
        category,
      };
    });

    return videos;
  } catch (error) {
    console.error('YouTube API error:', error);
    return [];
  }
}

// Auto-categorize based on video title keywords
function categorizeVideo(title: string): string {
  const lower = title.toLowerCase();
  if (
    lower.includes('current affairs') ||
    lower.includes('current') ||
    lower.includes('समसामयिक')
  )
    return 'Current Affairs';
  if (
    lower.includes('pyq') ||
    lower.includes('previous year') ||
    lower.includes('analysis')
  )
    return 'PYQ Analysis';
  return 'Uttarakhand GK';
}
