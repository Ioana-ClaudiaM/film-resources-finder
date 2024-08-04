import React from 'react';
import { PDFDocument } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

const GeneratePDF = async ({ newRole, motivatie, raspuns1, raspuns2, cvFile, projectLinks, setPdfBlob,selectedRoleId }) => {
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);

    const fontBytes = await fetch('/fonts/Roboto-Regular.ttf').then(res => res.arrayBuffer());
    const customFont = await pdfDoc.embedFont(fontBytes);

    let page = pdfDoc.addPage();
    const { width, height } = page.getSize();

    const margin = 50;
    const lineHeight = 20;
    let y = height - margin;

    const addText = (text, fontSize = 12) => {
        const lines = wordWrap(text, { width: width - margin * 2, font: customFont, fontSize });
        lines.forEach((line) => {
            if (y - lineHeight < margin) {
                page = pdfDoc.addPage();
                y = height - margin;
            }
            page.drawText(line, { x: margin, y: y - lineHeight, size: fontSize, font: customFont });
            y -= lineHeight;
        });
    };

    const wordWrap = (text, options) => {
        const { width, font, fontSize } = options;
        const lines = [];
        let currentLine = '';
        const words = text.split(/\s+/);

        for (const word of words) {
            const wordWidth = font.widthOfTextAtSize(word, fontSize);
            const currentLineWidth = font.widthOfTextAtSize(currentLine, fontSize);

            if (word === '\n') {
                lines.push(currentLine.trim());
                currentLine = '';
            } else if (currentLineWidth + wordWidth < width) {
                currentLine += (currentLine.length > 0 ? ' ' : '') + word;
            } else {
                lines.push(currentLine.trim());
                currentLine = word;
            }
        }

        lines.push(currentLine.trim());
        return lines;
    };

    const title = `Aplicarea lui ${newRole.name} pentru rolul ${selectedRoleId}`;
    addText(title, 15);

    addText('Informatii personale:', 18);
    addText(`Nume: ${newRole.name}`);
    addText(`Email: ${newRole.email}`);
    addText(`Telefon: ${newRole.telefon}`);
    addText(`Oras: ${newRole.oras}`);

    addText('Motivatie:', 18);
    addText(motivatie);

    addText('Raspunsuri la intrebari:', 18);
    addText('1. De ce considerati ca sunteti potrivit pentru acest rol?');
    addText(raspuns1);
    addText('2. Care sunt cele mai mari contributii pe care le-ai putea aduce acestui proiect/film?');
    addText(raspuns2);

    const cvText = cvFile ? 'CV-ul a fost incarcat.' : 'CV-ul nu a fost incarcat.';
    addText('Status CV:', 18);
    addText(cvText);

    addText('Proiectele personale:', 18);
    if (projectLinks.length > 0) {
        projectLinks.forEach((link, index) => {
            addText(`${index + 1}. ${link}`);
        });
    } else {
        addText('Nu au fost incarcate proiecte personale.');
    }

    const pdfBytes = await pdfDoc.save();
    const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
    setPdfBlob(pdfBlob);
};

export default GeneratePDF;
