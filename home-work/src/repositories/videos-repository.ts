type availableResolutions = Array<string>
type VideoType = {
  id: number,
  title: string,
  author: string,
  canBeDownloaded: boolean,
  minAgeRestriction: null | number,
  createdAt: string,
  publicationDate: string,
  availableResolutions: availableResolutions,
}

export let videosDB: Array<VideoType> = []

export const videosRepository = {
  async findAllVideos(): Promise<Array<VideoType>> {
    return videosDB;
  },
  async findVideosById(id: number): Promise<VideoType | undefined> {
    return videosDB.find(video => video.id === id);
  },
  async createVideo(title: string, author: string, availableResolutions: availableResolutions): Promise<VideoType> {
    const publicationDate = new Date();
    publicationDate.setDate(publicationDate.getDate() + 1);
    const newVideo: VideoType = {
      id: videosDB?.[videosDB?.length -1]?.id + 1 || 1,
      title,
      author,
      canBeDownloaded: false,
      minAgeRestriction: null,
      createdAt: (new Date()).toISOString(),
      publicationDate: publicationDate.toISOString(),
      availableResolutions,
    }
    videosDB = [...videosDB, newVideo]
    return newVideo;
  },
  async updateVideo(id: number, video: {
    title: string,
    author: string,
    availableResolutions: availableResolutions,
    canBeDownloaded: boolean,
    minAgeRestriction: null | number,
  }): Promise<Array<VideoType>> {
    const index = videosDB.findIndex(video => video.id === id);
    if (index !== -1) {
      videosDB[index] = {
        ...videosDB[index],
        ...video
      };
    }
    return videosDB;
  },
  async deleteVideo(id: number): Promise<boolean> {
    for (let i = 0; i < videosDB.length; i++) {
      if (videosDB[i].id === id) {
        videosDB.splice(i, 1);
        return true;
      }
    }
    return false;
  },
  async deleteAllVideos() : Promise<boolean> {
    videosDB = [];
    return true;
  }
}
