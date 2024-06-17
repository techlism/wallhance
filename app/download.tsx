import { useLocalSearchParams } from "expo-router";
import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from "expo-file-system";
// working (will contributre the types if needed)
import ManageWallpaper, { TYPE } from 'react-native-manage-wallpaper';
import { useState } from "react";
import { WallPaperManagerResponse } from "lib/types";
import DownloadIcon from "components/Icons/DownloadIcon";
import SetAsWallpaperIcon from "components/Icons/SetAsWallpaperIcon";

export default function Download(){
    const { bg_uri , file_name , file_type } = useLocalSearchParams();
    
    const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
    const [statusMsg, setStatusMsg] = useState('');

    const downloadFromUrl = async () => {
      try {
        if (permissionResponse?.status !== 'granted') {
          await requestPermission();
        }        
        const fileFormat = '.' + ((file_type as string).split('/')[1] || 'jpeg')
        const { uri } = await FileSystem.downloadAsync(bg_uri as string, FileSystem.documentDirectory + 'wallhance_'+file_name as string + fileFormat);
        const asset = await MediaLibrary.createAssetAsync(uri);
        let album = await MediaLibrary.createAlbumAsync('Wallhance', asset, false);
        if(album){
          setStatusMsg('Image downloaded successfully');
          setTimeout(() => {
            setStatusMsg('');
          }, 2000);
        }
        // } else {
          // await MediaLibrary.addAssetsToAlbumAsync([asset], album.id, false);
        // }
      } catch (error : any) {
        if(permissionResponse?.status !== 'granted'){
          setStatusMsg('Please grant permission(s) to download the image');
          setTimeout(() => {
            setStatusMsg('');
          }, 2000);
        }
        else{
          setStatusMsg('An error occured while downloading the image');
          setTimeout(() => {
            setStatusMsg('');
          }, 2000);          
        }
      }
    };

    const output = (res : WallPaperManagerResponse) => {
      if(res.status === 'success'){
        setStatusMsg('Wallpaper set successfully');
        setTimeout(() => {
          setStatusMsg('');
        }, 2000);
      }
      else{
        setStatusMsg('An error occured while setting the wallpaper');
        setTimeout(() => {
          setStatusMsg('');
        }, 2000);
      }
    };
  
    const setWallpaper = () => {
      try {
        ManageWallpaper.setWallpaper(
          {
            uri: bg_uri as string,
          },
          output,
          TYPE.HOME,
        );        
      } catch (error) {
        setStatusMsg('An error occured while setting the wallpaper');
        setTimeout(() => {
          setStatusMsg('');
        }, 2000);        
      }

    };
    
    return(
        <View className="flex-1 justify-center p-4">
            <View style={StyleSheet.absoluteFillObject}>
                <Image
                    source={{
                        uri: (bg_uri as string) || "..assets/bg_light.svg",
                    }}
                    style={[StyleSheet.absoluteFillObject]}
                />
            </View>     
            <View className="flex-1 justify-end flex-col">
              {statusMsg && 
              <View className="border rounded-xl bg-slate-50 grid grid-cols-1 items-center align-middle px-2 py-4">
                <Text className="text-md font-semibold" style={{color : `${(statusMsg.toLowerCase().includes('error') || statusMsg.toLowerCase().includes('please') ? 'red' : 'green')}`}}>{statusMsg}</Text>
              </View>}
              <View className="min-h-20 flex justify-around flex-row items-center">
                  {/* Download button and set as wallpaper button */}
                  <TouchableOpacity onPress={downloadFromUrl} className="rounded-xl p-2 px-4" style={{backgroundColor : 'rgba(29, 136, 239, 0.9)'}}>
                    {/* <Text>Download</Text> */}
                      <DownloadIcon size={35} />
                    </TouchableOpacity>
                  <TouchableOpacity onPress={setWallpaper} className="rounded-xl p-2 px-4" style={{backgroundColor : 'rgba(29, 136, 239, 0.9)'}}>
                    {/* <Text>Set as Wallpaper</Text> */}
                    <SetAsWallpaperIcon size={35}/>
                  </TouchableOpacity>
              </View>
            </View>

        </View>
    )

}