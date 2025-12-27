// Copyright (c) 2025, TNTSWA and contributors
// For license information, please see license.txt

 frappe.ui.form.on('Document View', {
    refresh: function(frm) {
        frm.disable_save();

    frappe.call({
            method: 'tntswa.tntswa.doctype.document_view.document_view.get_document_manager_data',
            args:{
                district:frm.doc.district
            },
            callback: function(response) {
                const documentManagerData = response.message;

                if (documentManagerData && documentManagerData.length > 0) {
                    
                    let htmlContent = `
                        <style>
                            table {
                                width: 100%; 
                                border-collapse: collapse; 
                                border: 1px solid #ddd; 
                                table-layout: auto;
                            }
                            table th, table td {
                                padding: 10px;
                                text-align: center;
                                border: 1px solid #ddd;
                            }
                            
                            table tbody tr:nth-child(even) {
                                background-color: #e6f2f1;  
                            }
                            
                            button.view-btn {
                                padding: 6px 12px;
                                background-color: #28a745;
                                color: white;
                                border: none;
                                border-radius: 4px;
                                cursor: pointer;
                            }
                            a.download-link {
                                padding: 6px 12px;
                                background-color: #007bff;
                                color: white;
                                border-radius: 4px;
                                text-decoration: none;
                                display: inline-block;
                                cursor: pointer;
                            }
                        </style>

                        <table style="border:1px solid black;">
                            <thead style="border:1px solid black;">
                                <tr style="border:1px solid black;">
                                    <th style="background-color:#0F1568; color:white; border:1px solid black;">எண்</th>
                                    <th style="background-color:#0F1568; color:white; border:1px solid black;">ஆவணத்தின் தலைப்பு</th>
                                    <th style="background-color:#0F1568; color:white; border:1px solid black;">மாவட்டம்</th>
                                    <th style="background-color:#0F1568; color:white; border:1px solid black;">காட்சி</th>
                                    <th style="background-color:#0F1568; color:white; border:1px solid black;">பதிவிறக்கம்</th>
                                </tr>
                            </thead>
                            <tbody style="border:1px solid black;">
                    `;

                    documentManagerData.forEach(function(doc) {
                        const fileUrl = doc.document || '';
                        const id = doc.name || '-';
                        const documentTitle = doc.document_title || '-';
                        const district = doc.district || '-';

                        htmlContent += `
                            <tr style="border:1px solid black;">
                                <td style="border:1px solid black;  ">${id}</td>
                                <td style="border:1px solid black; text-align:left; ">${documentTitle}</td>
                                <td style="border:1px solid black; text-align:left;">${district}</td>
                                <td style="border:1px solid black;">
                                    ${fileUrl ? `<button class="view-btn" data-url="${fileUrl}">காட்சி</button>` : '-'}
                                </td>
                                <td style="border:1px solid black;">
                                    ${fileUrl ? `<a class="download-link" href="${fileUrl}" download>பதிவிறக்கம்</a>` : '-'}
                                </td>
                            </tr>
                        `;
                    });

                    htmlContent += `</tbody></table>`;

                    frm.fields_dict.document_table.$wrapper.css("width", "100%"); // ensure full width
                    frm.fields_dict.document_table.$wrapper.html(htmlContent);

                    
                    frm.fields_dict.document_table.$wrapper.on('click', '.view-btn', function () {
                        const fileUrl = $(this).data('url');
                        const fileExtension = fileUrl.split('.').pop().toLowerCase();

                        let content = '';

                        if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(fileExtension)) {
                            content = `<img src="${fileUrl}" style="max-width: 100%; height: auto;" />`;
                        } else if (fileExtension === 'pdf') {
                            content = `<iframe src="${fileUrl}" width="100%" height="600px" style="border: none;"></iframe>`;
                        } else {
                            content = `<p>Preview not available for this file type. <a href="${fileUrl}" target="_blank">Open File</a></p>`;
                        }

                        const dialog = new frappe.ui.Dialog({
                            title: 'Preview Document',
                            size: 'large',
                            fields: [
                                {
                                    fieldname: 'preview',
                                    fieldtype: 'HTML',
                                    options: content
                                }
                            ]
                        });

                        dialog.show();
                    });

                } else {
                    frm.fields_dict.document_table.$wrapper.html("<p>No data available.</p>");
                }
            }
        });

        
    },
    onload(frm) {
        frm.disable_save();
    },
    
    district(frm){    
            frappe.call({
            method: 'tntswa.tntswa.doctype.document_view.document_view.get_document_manager_data_district',
            args:{
                district:frm.doc.district
            },
            callback: function(response) {
                const documentManagerData = response.message;

                if (documentManagerData && documentManagerData.length > 0) {
                    
                    let htmlContent = `
                        <style>
                            table {
                                width: 100%; 
                                border-collapse: collapse; 
                                border: 1px solid #ddd; 
                                table-layout: auto;
                            }
                            table th, table td {
                                padding: 10px;
                                text-align: center;
                                border: 1px solid #ddd;
                            }
                            table tbody tr:nth-child(even) {
                                background-color: #e6f2f1;  
                            }
                            button.view-btn {
                                padding: 6px 12px;
                                background-color: #28a745;
                                color: white;
                                border: none;
                                border-radius: 4px;
                                cursor: pointer;
                            }
                            a.download-link {
                                padding: 6px 12px;
                                background-color: #007bff;
                                color: white;
                                border-radius: 4px;
                                text-decoration: none;
                                display: inline-block;
                                cursor: pointer;
                            }
                        </style>

                        <table style="border:1px solid black;">
                            <thead style="border:1px solid black;">
                                <tr style="border:1px solid black;">
                                    <th style="background-color:#0F1568; color:white; border:1px solid black;">எண்</th>
                                    <th style="background-color:#0F1568; color:white; border:1px solid black;">ஆவணத்தின் தலைப்பு</th>
                                    <th style="background-color:#0F1568; color:white; border:1px solid black;">மாவட்டம்</th>
                                    <th style="background-color:#0F1568; color:white; border:1px solid black;">காட்சி</th>
                                    <th style="background-color:#0F1568; color:white; border:1px solid black;">பதிவிறக்கம்</th>
                                </tr>
                            </thead>
                            <tbody style="border:1px solid black;">
                    `;

                    documentManagerData.forEach(function(doc) {
                        const fileUrl = doc.document || '';
                        const id = doc.name || '-';
                        const documentTitle = doc.document_title || '-';
                        const district = doc.district || '-';

                        htmlContent += `
                            <tr style="border:1px solid black;">
                                <td style="border:1px solid black;  ">${id}</td>
                                <td style="border:1px solid black; text-align:left; ">${documentTitle}</td>
                                <td style="border:1px solid black; text-align:left;">${district}</td>
                                <td style="border:1px solid black;">
                                    ${fileUrl ? `<button class="view-btn" data-url="${fileUrl}">காட்சி</button>` : '-'}
                                </td>
                                <td style="border:1px solid black;">
                                    ${fileUrl ? `<a class="download-link" href="${fileUrl}" download>பதிவிறக்கம்</a>` : '-'}
                                </td>
                            </tr>
                        `;
                    });

                    htmlContent += `</tbody></table>`;

                    frm.fields_dict.document_table.$wrapper.css("width", "100%"); // ensure full width
                    frm.fields_dict.document_table.$wrapper.html(htmlContent);

                    
                    frm.fields_dict.document_table.$wrapper.on('click', '.view-btn', function () {
                        const fileUrl = $(this).data('url');
                        const fileExtension = fileUrl.split('.').pop().toLowerCase();

                        let content = '';

                        if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(fileExtension)) {
                            content = `<img src="${fileUrl}" style="max-width: 100%; height: auto;" />`;
                        } else if (fileExtension === 'pdf') {
                            content = `<iframe src="${fileUrl}" width="100%" height="600px" style="border: none;"></iframe>`;
                        } else {
                            content = `<p>Preview not available for this file type. <a href="${fileUrl}" target="_blank">Open File</a></p>`;
                        }

                        const dialog = new frappe.ui.Dialog({
                            title: 'Preview Document',
                            size: 'large',
                            fields: [
                                {
                                    fieldname: 'preview',
                                    fieldtype: 'HTML',
                                    options: content
                                }
                            ]
                        });

                        dialog.show();
                    });

                } else {
                    frm.fields_dict.document_table.$wrapper.html("<p>No data available.</p>");
                }
            }
        });
    },
    
    
        
    
   
        
 
    
});

