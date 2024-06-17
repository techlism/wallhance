import { ColorValue } from 'react-native';
export enum ImageType {
    all = "all",
    photo = "photo",
    illustration = "illustration",
    vector = "vector"
}
// this is the data type for response.data.hits
export type PixabayImageResponse = {
    id: number;
    pageURL: string;
    type: string;
    tags: string[];
    previewURL: string;
    previewWidth: number;
    previewHeight: number;
    webformatURL: string;
    webformatWidth: number;
    webformatHeight: number;
    largeImageURL: string;
    imageWidth: number;
    imageHeight: number;
    imageSize: number;
    views: number;
    downloads: number;
    favorites: number;
    likes: number;
    comments: number;
    user_id: number;
    fullHDURL: string; // waiting for the API approval    
    imageURL: string;    // waiting for the API approval
    user: string;
    userImageURL: string;
}

export type WallhavenImageResponse = {
    id: string;
    url: string;
    short_url: string;
    uploader?: {
      username: string;
      group: string;
      avatar: {
        "200px": string;
        "128px": string;
        "32px": string;
        "20px": string;
      };
    };
    views: number;
    favorites: number;
    source: string;
    purity: string;
    category: string;
    dimension_x: number;
    dimension_y: number;
    resolution: string;
    ratio: string;
    file_size: number;
    file_type: string;
    created_at: string;
    colors: string[];
    path: string;
    thumbs: {
      large: string;
      original: string;
      small: string;
    };
    tags?: {
      id: number;
      name: string;
      alias: string;
      category_id: number;
      category: string;
      purity: string;
      created_at: string;
    }[];
}

export type WallPaperManagerResponse = {
    msg : string;
    status : string;
    url : string;    
}

export type IconProps = {
  size?: number;
  color?: ColorValue;
}  