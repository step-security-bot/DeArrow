import { VideoID } from "@ajayyy/maze-utils/lib/video";

export interface PlaybackUrl {
    url: string;
    width: number;
    height: number;
}

interface ThumbnailVideoBase {
    video: HTMLVideoElement | null;
    width: number;
    height: number;
    onReady: Array<(video: RenderedThumbnailVideo) => void>;
    timestamp: number;
}

export type RenderedThumbnailVideo = ThumbnailVideoBase & {
    canvas: HTMLCanvasElement;
    rendered: true;
}

export type ThumbnailVideo = RenderedThumbnailVideo | ThumbnailVideoBase & {
    rendered: false;
};

export interface ThumbnailData {
    video: ThumbnailVideo[];
    playbackUrls: PlaybackUrl[];
}

interface ThumbnailDataCacheRecord extends ThumbnailData {
    lastUsed: number;
}

//todo: set a max size of this and delete some after a while
const cache: Record<VideoID, ThumbnailDataCacheRecord> = {};
const cacheLimit = 2000;

export function getFromCache(videoID: VideoID): ThumbnailData | undefined {
    return cache[videoID];
}

export function setupCache(videoID: VideoID): ThumbnailData {
    if (!cache[videoID]) {
        cache[videoID] = {
            video: [],
            playbackUrls: [],
            lastUsed: Date.now()
        };

        if (Object.keys(cache).length > cacheLimit) {
            const oldest = Object.entries(cache).reduce((a, b) => a[1].lastUsed < b[1].lastUsed ? a : b);
            delete cache[oldest[0]];
        }
    }

    return cache[videoID];
}

export function cacheUsed(videoID: VideoID): boolean {
    if (cache[videoID]) cache[videoID].lastUsed = Date.now();

    return !! cache[videoID];
}