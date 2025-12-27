// Copyright (c) 2025, TNTSWA and contributors
// For license information, please see license.txt

frappe.ui.form.on("District", {
	refresh(frm) {
	        frm.add_custom_button(__("Office Bearer"), function () {
			var f_name = frm.doc.name
			var print_format = "Office Bearer";
			window.open(frappe.urllib.get_full_url("/api/method/frappe.utils.print_format.download_pdf?"
				+ "doctype=" + encodeURIComponent("District")
				+ "&name=" + encodeURIComponent(f_name)
				+ "&trigger_print=1"
				+ "&format=" + print_format
				+ "&no_letterhead=0"
			));
		},__("Actions"));

	},
});
