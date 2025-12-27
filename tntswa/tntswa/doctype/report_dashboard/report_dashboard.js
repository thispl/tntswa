// Copyright (c) 2025, TNTSWA and contributors
// For license information, please see license.txt

frappe.ui.form.on("Report Dashboard", {
	download(frm) {
        frappe.call({
            method: "tntswa.tntswa.doctype.report_dashboard.report_dashboard.download_donation_pdf",
            args: {
                district: frm.doc.district
            },
            callback: function(r) {
                if (r.message) {
                    window.open(r.message);
                }
            }
        });
    }
});
