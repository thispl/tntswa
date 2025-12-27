// Copyright (c) 2025, TNTSWA and contributors
// For license information, please see license.txt

frappe.query_reports["Membership Form Report"] = {

    filters: [
        {
            fieldname: "district",
            label: __("District"),
            fieldtype: "Link",
            options: "District"
        }
    ],
    onload: function(report) {
        report.page.add_inner_button(__("Download"), function () {

            let filters = report.get_values(); 

            frappe.call({
                method: "tntswa.tntswa.report.membership_form_report.membership_form_report.download_donation_pdf",
                args: {
                    district: filters.district   
                },
                callback: function (r) {
                    if (r.message) {
                        window.open(r.message);
                    }
                }
            });
        });
    },

};

