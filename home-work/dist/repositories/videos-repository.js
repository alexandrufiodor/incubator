"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videosRepository = void 0;
let videosDB = [];
exports.videosRepository = {
    findAllVideos() {
        return videosDB;
    },
    findVideosById(id) {
        return videosDB.find(video => video.id === id);
    },
    createVideo(title, author, availableResolutions) {
        var _a;
        const newVideo = {
            id: ((_a = videosDB === null || videosDB === void 0 ? void 0 : videosDB[(videosDB === null || videosDB === void 0 ? void 0 : videosDB.length) - 1]) === null || _a === void 0 ? void 0 : _a.id) + 1 || 1,
            title,
            author,
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: (new Date()).toISOString(),
            publicationDate: (new Date()).toISOString(),
            availableResolutions,
        };
        videosDB = [...videosDB, newVideo];
        return newVideo;
    },
    updateVideo(id, video) {
        const index = videosDB.findIndex(video => video.id === id);
        if (index !== -1) {
            videosDB[index] = Object.assign(Object.assign(Object.assign({}, videosDB[index]), video), { publicationDate: (new Date()).toISOString() });
        }
        return videosDB;
    },
    deleteVideo(id) {
        for (let i = 0; i < videosDB.length; i++) {
            if (videosDB[i].id === id) {
                videosDB.splice(i, 1);
                return true;
            }
        }
        return false;
    }
};
//# sourceMappingURL=videos-repository.js.map