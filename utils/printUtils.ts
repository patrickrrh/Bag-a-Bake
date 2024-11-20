import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { useState } from 'react';

// type Printer = {
//     url: string;
// }

// const [selectedPrinter, setSelectedPrinter] = useState<Printer | null>(null);

// export const print = async (html: string) => {
//     await Print.printAsync({ 
//         html,
//         printerUrl: selectedPrinter?.url
//     });
// }

export const printPDF = async (html: string) => {
    const { uri } = await Print.printToFileAsync({ html });
    await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
}