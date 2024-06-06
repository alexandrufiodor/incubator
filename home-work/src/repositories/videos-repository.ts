type availableResolutions = Array<string>
type video = {
  id: number,
  title: string,
  author: string,
  canBeDownloaded: boolean,
  minAgeRestriction: null | number,
  createdAt: string,
  publicationDate: string,
  availableResolutions: availableResolutions,
}

export let videosDB: Array<video> = []

export const videosRepository = {
  findAllVideos() {
    return videosDB
  },
  findVideosById(id: number) {
    return videosDB.find(video => video.id === id);
  },
  createVideo(title: string, author: string, availableResolutions: availableResolutions) {
    const publicationDate = new Date();
    publicationDate.setDate(publicationDate.getDate() + 1);
    const newVideo: video = {
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
  updateVideo(id: number, video: {
    title: string,
    author: string,
    availableResolutions: availableResolutions,
    canBeDownloaded: boolean,
    minAgeRestriction: null | number,
  }) {
    const index = videosDB.findIndex(video => video.id === id);
    if (index !== -1) {
      videosDB[index] = {
        ...videosDB[index],
        ...video
      };
    }
    return videosDB;
  },
  deleteVideo(id: number) {
    for (let i = 0; i < videosDB.length; i++) {
      if (videosDB[i].id === id) {
        videosDB.splice(i, 1);
        return true;
      }
    }
    return false;
  },
  deleteAllVideos() {
    videosDB = [];
    return true;
  }
}
