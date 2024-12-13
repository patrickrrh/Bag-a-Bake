import * as MediaLibrary from 'expo-media-library';
import { showToast } from './toastUtils';
import * as FileSystem from 'expo-file-system';

export const handleDownloadImage = async (path: string, file: string) => {
    const imageUrl = `${process.env.EXPO_PUBLIC_LOCAL_SERVER}/${path}/${file}`;

    try {
        const fileUri = `${FileSystem.documentDirectory}${file}`;
        await FileSystem.downloadAsync(imageUrl, fileUri);
        await MediaLibrary.createAssetAsync(fileUri);
        showToast('success', 'Gambar berhasil diunduh');
    } catch (error) {
        console.error('Error downloading image:', error);
        showToast('error', 'Terjadi kesalahan saat mengunduh gambar');
    }
};