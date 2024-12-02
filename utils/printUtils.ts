import { OrderType } from '@/types/types';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { useState } from 'react';
import { formatDatewithtime, formatRupiah } from './commonFunctions';
import * as FileSystem from 'expo-file-system';

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

export const printPDF = async (html: string, fileName: string) => {
    const { uri } = await Print.printToFileAsync({ html });

    const newFilePath = `${FileSystem.documentDirectory}${fileName}.pdf`;

    await FileSystem.moveAsync({
        from: uri,
        to: newFilePath,
      });

    await shareAsync(newFilePath, { UTI: '.pdf', mimeType: 'application/pdf' });
}

export const generateInvoice = (orderItem: OrderType, userData: any) => {
    return `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <style>
            body { font-family: Arial, sans-serif; background-color: #FEFAF9; margin: 30px auto; padding: 0; }
            h1, h2 { text-align: center; margin: 10px 0; }
            .details-container {
              width: 90%; 
              margin: 20px auto;
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              gap: 20px; /* Ensures some spacing between left and right sections */
            }
            .details-left, .details-right {
              display: flex;
              flex-direction: column;
            }
            .details-left p, .details-right p {
              margin: 5px 0;
            }
            table { width: 90%; margin: 30px auto; border-collapse: collapse; background-color: #fff; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f4f4f4; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .total-container { 
              width: 90%; 
              margin: 20px auto; 
              display: flex; 
              justify-content: flex-end; 
              font-weight: bold; 
            }
            .total-container span { margin-left: 10px; }
          </style>
        </head>
        <body>
          <h1>Invoice</h1>
          <h2>ID Pesanan: ${orderItem.orderId}</h2>
          <div class="details-container">
            <div class="details-left">
              <p><strong>${userData?.bakery?.bakeryName}</strong></p>
              <p>Tanggal Pesanan: ${formatDatewithtime(orderItem.orderDate)}</p>
            </div>
            <div class="details-right">
              <p>Pembeli: ${orderItem.user.userName}</p>
              <p>No Telepon: ${orderItem.user.userPhoneNumber}</p>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Produk</th>
                <th>Jumlah</th>
                <th>Harga</th>
              </tr>
            </thead>
            <tbody>
              ${orderItem.orderDetail
        .map(
          (item) => `
                <tr>
                  <td>${item.product.productName}</td>
                  <td>${item.productQuantity}</td>
                  <td>${formatRupiah(item.totalDetailPrice)}</td>
                </tr>
              `
        )
        .join("")}
            </tbody>
          </table>
          <div class="total-container">
            <p>Total: ${formatRupiah(orderItem.totalOrderPrice)}</p>
          </div>
        </body>
      </html>
    `;
  };