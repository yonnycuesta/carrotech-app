import { Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { logueB64 } from '../helpers/form-validator';
import { IOrderData } from '../interfaces/order-pdf-interface';

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;


@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() { }

  private getLogoBase64(): string {
    return logueB64.data;
  }

  // toTODO:: MULTIPLE PDF

  // Método existente modificado para retornar una Promise
  generateOrderMultiPDF(orderData: any): Promise<void> {
    const documentDefinition: TDocumentDefinitions = {
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60],
      header: {
        columns: [
          {
            image: this.getLogoBase64(),
            width: 100,
            margin: [40, 20]
          },
          {
            text: 'ORDEN DE ENTREGA',
            alignment: 'right',
            margin: [0, 20, 40, 0],
            fontSize: 20,
            bold: true,
            color: '#2B579A'
          }
        ]
      },
      content: [
        {
          columns: [
            {
              width: '*',
              stack: [
                { text: 'Información de la Orden', style: 'sectionHeader' },
                { text: `Código: ${orderData.code}`, margin: [0, 5] },
                { text: `Fecha: ${new Date(orderData.created_at).toLocaleString()}`, margin: [0, 5] },
                { text: `Estado: ${orderData.statu_es}`, margin: [0, 5] },
                { text: `Código MO: ${orderData.mocode}`, margin: [0, 5] },
                { text: `Turno: ${orderData.shift}`, margin: [0, 5] },
                { text: `Territorio o Zona: ${orderData.zone}`, margin: [0, 5] },
              ]
            },
            {
              width: '*',
              stack: [
                { text: 'Información del Personal', style: 'sectionHeader' },
                { text: `Técnico: ${orderData.staff_name}`, margin: [0, 5] },
                { text: `Cédula del técnico: ${orderData.staff_dni}`, margin: [0, 5] },
                { text: `Responsable: ${orderData.manager_name}`, margin: [0, 5] },
                { text: `Cédula del responsable: ${orderData.manager_dni}`, margin: [0, 5] }
              ]
            }
          ],
          columnGap: 40
        },
        { text: 'Materiales y Equipos', style: 'sectionHeader', margin: [0, 20, 0, 10] },
        {
          table: {
            headerRows: 1,
            widths: ['auto', '*', 'auto'],
            body: [
              [
                { text: 'Código', style: 'tableHeader' },
                { text: 'Descripción', style: 'tableHeader' },
                { text: 'Cantidad', style: 'tableHeader' }
              ],
              ...orderData.items.map((item: any) => [
                item.code,
                item.name,
                { text: item.qty.toString(), alignment: 'center' }
              ])
            ]
          }
        },
        // { text: 'Comentarios:', style: 'sectionHeader', margin: [0, 15, 0, 5] },
        { text: orderData.comment || 'Sin comentarios', margin: [0, 15, 0, 15] },
        {
          columns: [
            {
              width: '*',
              text: '_______________________\nFirma del Responsable En Bodega',
              alignment: 'center',
              margin: [0, 60, 0, 0]
            },
            {
              width: '*',
              text: '_______________________\nFirma del destinatario',
              alignment: 'center',
              margin: [0, 60, 0, 0]
            }
          ]
        }
      ],
      styles: {
        sectionHeader: {
          fontSize: 14,
          bold: true,
          color: '#2B579A',
          margin: [0, 10, 0, 5]
        },
        tableHeader: {
          bold: true,
          fontSize: 12,
          color: '#2B579A',
          fillColor: '#F2F2F2'
        }
      },
      defaultStyle: {
        fontSize: 10,
        color: '#333'
      }
    };

    return new Promise((resolve, reject) => {
      try {
        pdfMake.createPdf(documentDefinition).download(`orden-${orderData.code}.pdf`);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  // Nuevo método para generar PDF sin descargarlo (para vista previa)
  generateOrderPDFPreview(orderData: any): Promise<void> {
    const documentDefinition: TDocumentDefinitions = {
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60],
      header: {
        columns: [
          {
            image: this.getLogoBase64(),
            width: 100,
            margin: [40, 20]
          },
          {
            text: 'ORDEN DE ENTREGA',
            alignment: 'right',
            margin: [0, 20, 40, 0],
            fontSize: 20,
            bold: true,
            color: '#2B579A'
          }
        ]
      },
      content: [
        {
          columns: [
            {
              width: '*',
              stack: [
                { text: 'Información de la Orden', style: 'sectionHeader' },
                { text: `Código: ${orderData.code}`, margin: [0, 5] },
                { text: `Fecha: ${new Date(orderData.created_at).toLocaleString()}`, margin: [0, 5] },
                { text: `Estado: ${orderData.statu_es}`, margin: [0, 5] },
                { text: `Código MO: ${orderData.mocode}`, margin: [0, 5] },
                { text: `Turno: ${orderData.shift}`, margin: [0, 5] },
                { text: `Territorio o Zona: ${orderData.zone}`, margin: [0, 5] },
              ]
            },
            {
              width: '*',
              stack: [
                { text: 'Información del Personal', style: 'sectionHeader' },
                { text: `Técnico: ${orderData.staff_name}`, margin: [0, 5] },
                { text: `Cédula del técnico: ${orderData.staff_dni}`, margin: [0, 5] },
                { text: `Responsable: ${orderData.manager_name}`, margin: [0, 5] },
                { text: `Cédula del responsable: ${orderData.manager_dni}`, margin: [0, 5] }
              ]
            }
          ],
          columnGap: 40
        },
        { text: 'Materiales y Equipos', style: 'sectionHeader', margin: [0, 20, 0, 10] },
        {
          table: {
            headerRows: 1,
            widths: ['auto', '*', 'auto'],
            body: [
              [
                { text: 'Código', style: 'tableHeader' },
                { text: 'Descripción', style: 'tableHeader' },
                { text: 'Cantidad', style: 'tableHeader' }
              ],
              ...orderData.items.map((item: any) => [
                item.code,
                item.name,
                { text: item.qty.toString(), alignment: 'center' }
              ])
            ]
          }
        },
        // { text: 'Comentarios:', style: 'sectionHeader', margin: [0, 15, 0, 5] },
        { text: orderData.comment || 'Sin comentarios', margin: [0, 15, 0, 15] },
        {
          columns: [
            {
              width: '*',
              text: '_______________________\nFirma del Responsable En Bodega',
              alignment: 'center',
              margin: [0, 60, 0, 0]
            },
            {
              width: '*',
              text: '_______________________\nFirma del destinatario',
              alignment: 'center',
              margin: [0, 60, 0, 0]
            }
          ]
        }
      ],
      styles: {
        sectionHeader: {
          fontSize: 14,
          bold: true,
          color: '#2B579A',
          margin: [0, 10, 0, 5]
        },
        tableHeader: {
          bold: true,
          fontSize: 12,
          color: '#2B579A',
          fillColor: '#F2F2F2'
        }
      },
      defaultStyle: {
        fontSize: 10,
        color: '#333'
      }
    };

    return new Promise((resolve, reject) => {
      try {
        pdfMake.createPdf(documentDefinition).open();
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }


}
