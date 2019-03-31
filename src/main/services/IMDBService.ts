import axios from "axios";

const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36";

export default class IMDBService {

    private static apiKey: string;

    public static setApiKey(key: string | undefined) {
        if (!IMDBService.apiKey && key) {
            IMDBService.apiKey = key;
        }
    }

    public static get(opt: IGetOptions): Promise<IOmdbEntity> {
        let url = `http://www.omdbapi.com/?apikey=${IMDBService.apiKey}`;
        if (opt.title) {url += `&t=${opt.title}`; }
        if (opt.year) {url += `&year=${opt.year}`; }
        if (opt.episode) {url += `&Episode=${opt.episode}`; }
        if (opt.season) {url += `&Season=${opt.season}`; }
        if (opt.plot) {url += `&plot=${opt.plot}`; }
        else {url += `&plot=full`; }
        return IMDBService.sendQuery("get", url);
    }

    public static async sendQuery(method: string, url: string, data: any = {}): Promise<IOmdbEntity> {
        return new Promise((resolve, reject) => {
            const payload = Object.assign({}, data);
            const headers: any = {
                "Content-Type": "application/json",
                "Accept": "application/json, text/plain, */*",
                "User-Agent": userAgent,
            };
            const config = {
                url,
                method,
                headers,
                data: payload,
                timeout: 30000,
            };

            axios.request(config).then(res => {
                if (res.data && res.data.Response === "True") {
                    resolve(res.data);
                } else if (res.data && res.data.Response === "False") {
                    console.warn("could not get response from omdb-api", res.data.Error);
                    console.warn("endpoint: " + method + " | " + url);
                    reject();
                } else {
                    console.warn("could not get response from omdb-api", res);
                    console.warn("endpoint: " + method + " | " + url);
                    reject();
                }
            }).catch(e => {
                console.warn("rest error: " + e.response.status, e.response.data);
                console.warn("endpoint: " + method + " | " + url);
                console.warn("payload: ", payload);
                if (e.response && e.response.data) {
                    console.warn("rest error: " + e.response.status, e.response.data);
                    console.warn("endpoint: " + method + " | " + url);
                    console.warn("payload: ", payload);
                }
                reject(e);
            });
        });
    }
}

export interface IGetOptions {
    title: string;
    year?: number;
    season?: number;
    episode?: number;
    plot?: "full" | "short";
}

export interface IOmdbEntity {
    Title: string;
    Year: string;
    Rated: string;
    Released: string;
    Season: string;
    Episode: string;
    Runtime: string;
    Genre: string;
    Director: string;
    Writer: string;
    Actors: string;
    Plot: string;
    Language: string;
    Country: string;
    Awards: string;
    Poster: string;
    Ratings: string;
    Metascore: string;
    imdbRating: string;
    imdbVotes: string;
    imdbID: string;
    seriesID: string;
    Type: string;
    Response: string;
}