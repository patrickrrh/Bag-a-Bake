import * as MediaLibrary from 'expo-media-library';
import { showToast } from './toastUtils';

export const handleDownloadImage = async (uri: string) => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
        showToast('error', 'Izin untuk mengakses galeri diperlukan');
        return;
    };

    await MediaLibrary.createAssetAsync(uri);
    showToast('success', 'Gambar berhasil diunduh');
};