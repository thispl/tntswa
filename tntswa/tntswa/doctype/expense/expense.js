// Copyright (c) 2025, TNTSWA and contributors
// For license information, please see license.txt

frappe.ui.form.on("Expense", {
	validate(frm) {
        if (frm.doc.date > frappe.datetime.get_today()) {
            frappe.throw(__('Document not allowed for future date'));
        }
    }
});
