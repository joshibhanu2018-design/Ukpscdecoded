// YouTube Data API v3 integration
// Fetches videos from UKPSC Decoded channel and categorizes them

import videoConfig from '@content/videoConfig.json';

const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || '';

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  duration?: string;
  category: string;
  freePreview?: boolean;
}

// Video IDs flagged as free-preview lectures (editable in content/videoConfig.json)
export function isFreePreview(videoId: string): boolean {
  return (videoConfig.freePreviewVideoIds || []).includes(videoId);
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
      const videoId = item.snippet.resourceId.videoId;
      const category = categorizeVideo(title, videoId);
      return {
        id: videoId,
        title: title,
        description: item.snippet.description?.substring(0, 150) || '',
        thumbnail:
          item.snippet.thumbnails?.high?.url ||
          item.snippet.thumbnails?.medium?.url ||
          '',
        publishedAt: item.snippet.publishedAt,
        category,
        freePreview: isFreePreview(videoId),
      };
    });

    return videos;
  } catch (error) {
    console.error('YouTube API error:', error);
    return [];
  }
}

// Auto-categorize based on video title keywords and video characteristics
function categorizeVideo(title: string, videoId?: string): string {
  const lower = title.toLowerCase();

  // Shorts — YouTube Shorts have specific title patterns or very short titles
  // Also detected by #shorts hashtag in title or description
  if (
    lower.includes('#shorts') ||
    lower.includes('#short') ||
    lower.includes('shorts') ||
    (title.length < 60 && !lower.includes('full') && !lower.includes('complete'))
  )
    return 'Shorts';

  // PYQ — Previous Year Questions
  if (
    lower.includes('pyq') ||
    lower.includes('previous year') ||
    lower.includes('पिछले वर्ष') ||
    lower.includes('past paper')
  )
    return 'PYQ';

  // Current Affairs
  if (
    lower.includes('current affairs') ||
    lower.includes('current') ||
    lower.includes('समसामयिक') ||
    lower.includes('weekly') ||
    lower.includes('monthly')
  )
    return 'Current Affairs';

  // Strategy — exam tips, preparation strategy, how-to
  if (
    lower.includes('strategy') ||
    lower.includes('topper') ||
    lower.includes('preparation') ||
    lower.includes('how to') ||
    lower.includes('tips') ||
    lower.includes('plan') ||
    lower.includes('syllabus') ||
    lower.includes('booklist') ||
    lower.includes('roadmap') ||
    lower.includes('रणनीति')
  )
    return 'Strategy';

  // National — Indian polity, economy, history (non-Uttarakhand)
  if (
    lower.includes('indian polity') ||
    lower.includes('indian economy') ||
    lower.includes('indian history') ||
    lower.includes('national') ||
    lower.includes('india') ||
    lower.includes('constitution') ||
    lower.includes('parliament') ||
    lower.includes('भारत')
  )
    return 'National';

  // Default — UK Special (Uttarakhand-specific)
  return 'UK Special';
}
